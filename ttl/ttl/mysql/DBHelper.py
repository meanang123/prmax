	# -*- coding: utf-8 -*-

import MySQLdb
import threading, Queue, thread

class DBConnect(object):
	""" Connect to a mysqldb database"""
	def __init__(self,connection):
		""" host = "localhost", user = "testuser", passwd = "testpass", db = "test"""
		self._db = MySQLdb.connect ( **connection )

	def Close(self):
		self._db.close()

	def getCursor(self, to_dict = True):
		if to_dict:
			c = self._db.cursor(MySQLdb.cursors.DictCursor)
		else:
			c = self._db.cursor()
		return c

	def startTransaction(self,c):
		c.execute("BEGIN;")

	def commitTransaction(self,c):
		c.execute("COMMIT;")

	def rollbackTransaction(self,c):
		c.execute("ROLLBACK;")

	def closeCursor(self,c):
		c.close()

	def executeOne(self, command, params, to_dict = False):
		c = self.getCursor( to_dict )
		try:
			c.execute(command,params)
			cv = c.fetchone()
			return cv
		finally:
			self.closeCursor(c)

		return None

	def executeAll(self, command, params, to_dict = False):
		c = self.getCursor( to_dict )
		try:
			c.execute(command,params)
			cv = c.fetchall()
			return cv
		finally:
			self.closeCursor ( c )

	def execute(self, command, params):
		c = self.getCursor( False )
		try:
			c.execute(command,params)
		finally:
				self.closeCursor ( c )


class DBConnectionPool(object):
	def __init__(self):
		self._connections = None
