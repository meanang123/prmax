# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     15/12/2008
#
# Author:       Chris Hoy
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import pickle
from base64 import b64encode, b64decode
import psycopg2
import psycopg2.extras

import prmax.utilities3.common.constants as Constants

class DBCompress(object):
	""" Compression interface """
	@classmethod
	def decode(cls,data):
		"""decode data"""

		#t = open("c:\\temp\\data.txt","wb")
		#t.write(data)
		#t.close()

		return pickle.loads(b64decode(data))

	@classmethod
	def encode(cls,data):
		""" encode and pass to postgres"""
		return psycopg2.Binary(b64encode(pickle.dumps(data)))

	@classmethod
	def encode2(cls,data):
		"""encode data but not as postgres"""
		return b64encode(pickle.dumps(data))

	@classmethod
	def encode3(cls,data):
		"""encode data but not as postgres"""
		return b64encode(pickle.dumps(str(data)))

	@classmethod
	def b64encode(cls,data):
		return b64encode(data)

	@classmethod
	def b64decode(cls,data):
		return b64decode(str(data))

	@classmethod
	def encode_postgres(cls, data):
		return psycopg2.Binary(data)

	
class DBConnect(object):
	""" Connect to a postgress database"""
	def __init__(self,connection):
		""" connection = "dbname='%s' user='%s' host='%s' password='%s'"""
		self._db =  psycopg2.connect(connection)
		self._db.set_client_encoding('UTF-8')
		#self._db.set_client_encoding('iso8859-2')

	def Open(self):
		pass
	def Close(self):
		self._db.close()

	def getCursor(self, no_stop = True, to_dict = True):
		if to_dict:
			c = self._db.cursor(cursor_factory=psycopg2.extras.DictCursor)
		else:
			c = self._db.cursor()
		if no_stop:
			c.execute("ROLLBACK;")
			self.startTransaction(c)
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
		c = self._db.cursor()
		try:
			c.execute(command,params)
			cv = c.fetchone()
			if to_dict and cv:
				return self.build_dict(c,cv)
			else:
				return cv
		finally:
			c.close()
		return None

	def executeAll(self, command, params, to_dict = False):
		c = self._db.cursor()
		try:
			c.execute(command,params)
			cv = c.fetchall()
			if to_dict:
				return [ self.build_dict(c,row) for row in cv]
			else:
				return cv
		finally:
			c.close()

	def executeDict(self, command, params ) :
		c = self._db.cursor(cursor_factory=psycopg2.extras.DictCursor)
		try:
			c.execute(command,params)
			cv = c.fetchall()
			return cv
		finally:
			c.close()

	def execute(self, command, params):
		c = self._db.cursor()
		try:
			c.execute(command,params)
		finally:
			c.close()

	def build_dict(self, c, row):
		res = {}
		for i in range(len(c.description)):
			if type(row[i])==types.StringType:
				res[c.description[i][0]] = row[i].decode('utf-8')
			else:
				res[c.description[i][0]] = row[i]
		return res

class DBUtilities(object):
	""" database heklpers """
	@staticmethod
	def formatsearchword(word, expand):
		"format word search"
		if expand:
			return word + "%"
		else:
			return word

	@staticmethod
	def employeeindextooutlettree( index, SD, plpy):
		"get a set of outletid's for a set of employeeid"
		if "employeeindextooutlettree" in SD:
			plan = SD["employeeindextooutlettree"]
		else:
			plan = plpy.prepare("SELECT e.employeeid,e.outletid FROM SetToIdList($1) as ls JOIN employees as e ON ls.dataid = e.employeeid", ["text", ])
		SD['employeeindextooutlettree'] = plan
		
		from prmax.utilities3.common.dbhelper import DBCompress
		res = dict()
		for dataRow in plpy.execute(plan, [ DBCompress.encode(index)]):
			res[dataRow['employeeid']] = dataRow['outletid']

		return res

	@staticmethod
	def searchkeytodatatype(searchtype):
		"searchkeytodatatype"
		if searchtype in Constants.Search_Data_IsOutlet:
			return Constants.Search_Data_Outlet
		else:
			return Constants.Search_Data_Employee


