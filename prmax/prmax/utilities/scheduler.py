# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         reportbuilder
# Purpose:     To run the report generator application
#
# Author:       Chris Hoy
#
# Created:      02/10/2008
# RCS-ID:       $Id:  $
# Copyright:  (c) 2008

# look at sub-process.py look at better
#-----------------------------------------------------------------------------
import sched, time, datetime
from ttl.postgres import DBConnect
import prmax.Constants as Constants
from  ttl.ttlemail import SendSupportEmailMessage

class Scheduler(object):
	""" Scheduled event"""

	def __init__(self):
		""" init event"""
		self._scheduler = sched.scheduler(time.time, time.sleep)
		self._tasks = []

	def addTask( self, task):
		""" add tasj to even tscheduler"""
		self._tasks.append(task)
		self.scheduleTask(task)

	def scheduleTask(self, task):
		""" add repeeat task"""
		if task._type == 0:
			self._scheduler.enterabs(task.getTime(), 1, self._runtask, (task, ))
		else:
			self._scheduler.enter(task._interval, 1, self._runtask, (task, ))

	def _runtask(self, *argv, **kw):
		""" run task """
		self.scheduleTask(argv[0])
		argv[0].run()

	def run(self):
		"""run instance """
		self._scheduler.run()

class ScheduleTask(object):
	""" individual task"""
	def __init__(self, type, interval, runcommand):
		self._type = type
		self._interval = interval
		self._runcommand = runcommand

	def getTime(self):
		""" get time """
		tnow = datetime.datetime.now()
		nt = datetime.datetime(tnow.year,
							   tnow.month,
							   tnow.day,
							   self._interval[0],
							   self._interval[1],
							   tnow.second,
							   tnow.microsecond
							   )
		if tnow >= nt:
			nt += datetime.timedelta(days = 1)
		return time.mktime(nt.timetuple())

	def run(self):
		"""run the command"""
		self._runcommand()


class SqlCommand(object):
	""" run sql command """
	def __init__(self, commandline, tocache = False ):
		"""init """
		self._commandline = commandline
		self._dbconnectionstring = Constants.db_Command_Service
		if tocache:
			self._dbconnectionstring = Constants.db_Cache_Command_Service

	def __call__(self):
		""" run command """
		print "Excuting Command " , self._commandline , datetime.datetime.now()
		db = DBConnect(self._dbconnectionstring)
		try:
			cur = db.getCursor(True)
			try:
				cur.execute( self._commandline)
				db.commitTransaction(cur)
				print "Command Completed " , datetime.datetime.now()
			except Exception, ex:
				try:
					db.rollbackTransaction(cur)
				except: pass
				print ex
		finally:
			db.Close()


def CheckQueue():
	""" run sql command """

	__Command =  """
	SELECT customerid,l.emailtemplatename,embargo,COUNT(*)
	FROM userdata.listmemberdistribution AS lm
	JOIN userdata.emailtemplates as l ON l.listid = lm.listid
	WHERE emailstatusid =2
	GROUP BY customerid, l.emailtemplatename, embargo
	ORDER BY embargo"""

	print "Excuting Command " , datetime.datetime.now()

	db = DBConnect(Constants.db_Command_Service)
	try:
		cur = db.getCursor(True)
		try:
			cur.execute( __Command )
			tmp = cur.fetchall( )
			if tmp:
				SendSupportEmailMessage(
				  "Email Queue",
				   "<br/>".join( [str(row) for row in tmp]),
				  "support@prmax.co.uk",
				  "support@prmax.co.uk" )

		except Exception, ex:
			print ex
	finally:
		db.Close()