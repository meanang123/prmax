# -*- coding: utf-8 -*-
"""Full Inxders """
#-----------------------------------------------------------------------------
# Name:
# Purpose:
#
# Author:
#
# Created:
# Copyright:   (c) 2014

#-----------------------------------------------------------------------------
from datetime import datetime
from time import sleep
import platform
import os
from threading import Thread
from queue import Queue
from prmax.utilities3.common.constants import HIGHEST_INDEX_ID

NBROFTHREADS = 8

if platform.system() in ('Microsoft', "Windows"):
	COMMANDFILE = r'\Projects\tg15env\Scripts\python \Projects\prmax\development\prservices\prservices\prindexer\indexer.py --filter=%d'
else:
	COMMANDFILE = 'python2.7 /usr/local/lib/python2.7/dist-packages/prservices-1.0.0.1-py2.7.egg/prservices/prindexer/indexer.py  --filter=%d'

class IndexSection(Thread):
	""" index a section of the queue"""
	def __init__( self, queue ):
		""" setup """
		Thread.__init__(self)
		self._queue = queue

	def run(self):
		while True:
			if self._queue.empty():
				print("Existing %s" % self.getName())
				break

			record = self._queue.get()
			print("%s Staring %d " % (datetime.now(), record))
			os.system(COMMANDFILE % record)

class QueueSize(Thread):
	"""queue size"""
	def __init__( self, queue ):
		""" setup """
		Thread.__init__(self)
		self._queue = queue

	def run(self):
		while True:
			if self._queue.empty():
				print("Queue Empty Timer Finishing")
				break

			sleep(30)
			print("%s Queue Size : %d " % (datetime.now(), self._queue.qsize()))

def _run():
	"""Run Indexer """
	all_object_to_index = Queue()
	for index in range(1, HIGHEST_INDEX_ID+1):
		all_object_to_index.put(index)

	for threadnumber in range(0, NBROFTHREADS):
		newthread = IndexSection ( all_object_to_index )
		newthread.setName("Index %d" % threadnumber)
		newthread.start()

	newthread = QueueSize(all_object_to_index)
	newthread.start()
	newthread.join()

if __name__ == '__main__':
	print("Starting ", datetime.now())
	_run( )
	print("Completed ", datetime.now())
