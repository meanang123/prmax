# -*- coding: utf-8 -*-
"""prappserver"""
#-----------------------------------------------------------------------------
# Name:        prappserver
# Purpose:     Back end processing engine for prmax
#
# Author:      Chris Hoy
#
# Created:     09/11/2012
# Copyright:  (c) 2012
#
#-----------------------------------------------------------------------------
from datetime import datetime, timedelta
from time import sleep
import prcommon.Constants as Constants
import threading, Queue
from turbogears import database
from turbogears.database import session
from ttl.tg.config import read_config
import os
import logging
import getopt
import sys

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import  ProcessQueue
from prcommon.model.general.profilecache import ProfileCache
from prcommon.model.clippings.clippingscache import ClippingCache
from prcommon.model.clippings.output.clippingoutputpowerpoint import ClippingOutputPowerPoint

# add function to process email

PROCESSMAPPING = {
  Constants.Process_Outlet_Profile : ProfileCache,
  Constants.Process_Clipping_View : ClippingCache,
  Constants.Clipping_Output_Build_PowerPoint : ClippingOutputPowerPoint
}

logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger("prmax.prappserver")

SLEEPINTERVALS = 10  # seconds to sleep before querying queue again
UPDATEINTERVALS = 20 # seconds - entry on queue is at least this old before processing

class WorkerController(threading.Thread):
	""" thread waits for a queue record, then process email and log it """
	def __init__(self, queue, lock, do_test=None):
		""" setup """
		threading.Thread.__init__(self)
		self._queue = queue
		self._lock = lock
		self._do_test = do_test

	def run(self):
		""" This take a queue record and process it """
		while True:
			try:
				# wait for an item to become avaliable
				record = self._queue.get()
				#LOGGER.info ("Processing %d, Thread: %d" % ( record["queueemailerid"], thread.get_ident()))

				try:
					# first lock the record as processing
					process = None
					self._lock.acquire()
					try:
						session.begin()
						process = ProcessQueue.query.get(record["processqueueid"])
						process.statusid = Constants.Queue_Processed
						session.commit()
					finally:
						self._lock.release()

					# do action here
					session.begin()
					command = PROCESSMAPPING[process.processid](process)
					command.run()

					# does this has a response if so then we need to update the dn
					if getattr(command, "get_response", None):
						process.processqueueoutput = command.get_response()

					session.commit()

				except:
					LOGGER.exception("Id = %d", record["processqueueid"])
					session.rollback()
			except:
				if record and "processqueueid" in record:
					LOGGER.exception("Id = %d", record["processqueueid"])

class DistController(threading.Thread):
	""" Controller for the process queue
	This takes a record and send it out as an email

	"""
	def __init__(self, nbr=2, do_test=None):
		""" Start the distribution systen """
		self._lock = threading.Lock()
		self._nbr = nbr * 2
		self._do_test = do_test
		threading.Thread.__init__(self)
		self._queue = Queue.Queue()
		for count in xrange(0, nbr-1):
			worker = WorkerController(self._queue, self._lock, do_test)
			worker.setName("Process_Control_" + str(count))
			worker.setDaemon(True)
			worker.start()

		# need to have a cleaup thread here

	def run(self):
		"""Run the queue manager"""
		while True:
			try:
				if self._queue.qsize():
					LOGGER.debug("Queue Count %d", self._queue.qsize())
				# if items on queue then wait
				while self._queue.qsize() > 0:
						sleep(SLEEPINTERVALS)

				# see if there are any records on the queue
				checkdate = datetime.now() - timedelta(seconds=UPDATEINTERVALS)
				checkdate = str(checkdate)
				#LOGGER.debug( "Checking ProcessQueue.last_updated <  %s" % checkdate)
				rows = session.query(ProcessQueue).\
				    filter(ProcessQueue.statusid == Constants.Queue_Waiting).\
				    order_by(ProcessQueue.priority).\
				    limit(self._nbr).all()
				#LOGGER.debug( "Query Count %d" % len(rows))
				for row in rows:
					try:
						# it's now on the processing queue mark as such
						session.begin()
						row.statusid = Constants.Queue_Processing
						session.commit()
						LOGGER.debug("Processing processqueueid %d", row.processqueueid)
						self._queue.put(dict(processqueueid=row.processqueueid))
					except:
						LOGGER.exception("Process Failure")
						session.rollback()
				sleep(SLEEPINTERVALS)
			except:
				LOGGER.exception("run")
				session.rollback()

def _run():
	""" run the application """
	#
	OPTIONS, DUMMY = getopt.getopt(sys.argv[1:], "", ["live", "test"])
	do_test = None

	for option, params in OPTIONS:
		if option in ("--live",):
			do_test = False
		if option in ("--test",):
			do_test = True

	if do_test == None:
		print "Missing Environment"
		return

	ctrl = DistController(4, do_test)
	ctrl.setDaemon(True)
	ctrl.start()
	while True:
		try:
			ctrl.join(3)
		except KeyboardInterrupt:
			break

if __name__ == '__main__':
	print "Starting ", datetime.now()
	_run()
	print "Existing ", datetime.now()
