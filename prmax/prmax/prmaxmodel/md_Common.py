# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        md_Common.py
# Purpose:		basic object for all model elements
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import identity
from turbogears.database import  session
from simplejson import JSONDecoder
from ttl.tg.errorhandlers import SecurityException
from sqlalchemy.sql import text

from cherrypy import request

import prmax.Constants as Constants
from ttl.dict import DictExt

import types, logging
log = logging.getLogger("prmax.model")

class BaseSql(object):
	""" base sql object """
	@classmethod
	def sa_get_active_transaction(cls ):
		""" get the current active transaction """
		try:
			transaction = request.sa_transaction
		except AttributeError:
			transaction = session.begin(subtransactions=True)
		return transaction

	@staticmethod
	def checkprivate(incustomerid, customerid=None):
		""" check to see of a record is private """
		# check secuirty
		if customerid == None:
			customerid = identity.current.user.customerextid

		if customerid != 39 and incustomerid != -1 and customerid != incustomerid:
			raise SecurityException("")

	@staticmethod
	def checkprivateoutlet(outlet, outletid):
		""" CHECK TO SEE IF OUTLET IS PRIVATE"""
		# check secuirty
		query = session.query(outlet.customerid).filter_by(outletid=outletid)
		if len(query):
			BaseSql.checkprivate(query[0].customerid)

	@classmethod
	def sqlExecuteCommand (cls, command, data = None, \
						   func=None,transtion=False) :
		""" Execute an sql statement"""
		success = False
		if transtion:
			trans = session.begin(subtransactions = True)
		try:
			result = None
			if data :
				result = session.execute(command, data, cls)
			else:
				result = session.execute(command, None, cls)
			if transtion:
				trans.commit()
			if func :
				success = func(result)
			else:
				success = True
		except Exception, ex :
			log.error("sqlExecuteCommand Command: %s Error: %s" % (command, str(ex)))
			if transtion:
				try:
					trans.rollback()
				except: pass
			raise ex
		return success

	@staticmethod
	def ResultExists(result):
		""" Check to see if the results exist """
		data  = result.fetchone()
		return True if data else False

	@staticmethod
	def ResultAsEncodedDict(results):
		""" return the result as an encoded dictionary"""

		try:
			keys = results.keys
			if type ( keys ) != ListType:
				keys = result.keys()
		except:
			keys = results._metadata.keys

		def _do(row):
			"internal"
			r = {}
			for i in xrange(0, len(keys)):
				if type(row[i])==types.StringType:
					r[keys[i]] = row[i].decode('utf-8')
				else:
					r[keys[i]] = row[i]
			return r

		return [ _do(row) for row in  results.fetchall()]

	@staticmethod
	def ResultAsList(results):
		""" return the result as an encoded list"""

		def _do(row):
			""" convert the row from tuple to list for json"""
			return list(row)

		return [ _do(row) for row in  results.fetchall()]


	@staticmethod
	def SingleResultAsEncodedDict(result):
		""" Return a single result as en encoded dictionary"""
		try:
			keys = result.keys
			if type ( keys ) != ListType:
				keys = result.keys()
			values = result.fetchone().values()
		except:
			tmp = result.fetchone()
			keys = tmp.keys()
			values = tmp.values()
		r = {}
		for i in xrange(0, len(keys)):
			if type(values[i]) == types.StringType:
				r[keys[i]] = values[i].decode('utf-8')
			else:
				r[keys[i]] = values[i]
		return r

	@classmethod
	def _singleResult(cls, result):
		""" return a single result as a tuple"""
		return result.fetchone().values()

	@classmethod
	def _singleResultAsDict(cls, result):
		""" return a single record as dictionary no need to encode data"""
		try:
			keys = result.keys
			if type ( keys ) != ListType:
				keys = result.keys()
		except:
			keys = result._metadata.keys

		values = result.fetchone().values()
		r = {}
		for i in xrange(0, len(keys)):
			r[keys[i]] = values[i]
		return r

	@staticmethod
	def singleFieldInteger(result):
		""" return a single result field usuall used for count functgions """
		rows = result.fetchall()
		if rows:
			return rows[0][0]
		else:
			return 0

	@staticmethod
	def SingleFieldIntNone(result):
		""" return a single result field usuall used for count functgions """
		rows = result.fetchall()
		if rows:
			return rows[0][0]
		else:
			return None


	@staticmethod
	def NbrOfRows(result):
		""" returns the number of rows """
		rows = result.fetchall()
		if rows:
			return len(rows)
		else:
			return 0


	@classmethod
	def getPageDispayStd(cls, kw, sortfields, defaultorder ):
		""" Get parameters for search display data page"""

		# capture sort info
		sortfield = int(kw.get('sortorder', defaultorder))
		sortby = sortfields[1]
		direction = "asc"
		if sortfield < 0:
			direction = "desc"
		sortfield = abs(sortfield)
		if sortfields.has_key(sortfield):
			sortby = sortfields[sortfield]

		# return dict of params
		return DictExt (  dict(
			userid = kw["user_id"],
			customerid = kw["customerid"],
			limit = int(kw.get("count", "100")),
			offset = int(kw.get("start", "0")),
			direction = direction,
			sortby = sortby))

	@classmethod
	def getPageDispayStd2(cls, kw, defaultsort, sortfields):
		""" Get parameters for search display data page"""

		# capture sort info
		sortby = kw.get("sort", defaultsort)
		direction = "asc"
		if sortby and sortby[0] == "-":
			direction = "desc"
			sortby = sortby[1:]

		kw['sortby'] = sortfields.get(sortby, sortby)
		kw['direction'] = direction

		# return dict of params
		if kw.has_key("listname"):
			kw["listname"] = kw["listname"].replace("*", "%")

		return DictExt (  kw )

	@classmethod
	def getGridPage(cls, kw, sortdefault, primaryid, query, querynbr, parent):
		""" get a page for a grid"""
		kw['sortfield'] = kw.get('sortfield', sortdefault)
		if not kw['sortfield']:
			kw['sortfield'] = sortdefault

		items = parent.sqlExecuteCommand (
			text(query%(kw['sortfield'], kw['direction'])) ,
			kw,
			BaseSql.ResultAsEncodedDict)

		numRows = parent.sqlExecuteCommand (
			text(querynbr) ,
			kw,
			BaseSql._singleResult)[0]

		ret = dict (numRows  = numRows,	items = items )
		if primaryid:
			ret['identifier'] = primaryid
		return ret

	@classmethod
	def getListPage( cls, kw, name, primaryid, query, queryid, parent):
		""" get a list for a lookup list """

		command = queryid if "id" in kw else query
		if name not in kw:
			kw[name] = "%"
		else:
			kw[name] = kw[name].replace("*","%")

		items = parent.sqlExecuteCommand (
			text(command) ,
			kw,
			BaseSql.ResultAsEncodedDict)

		return dict ( identifier = primaryid ,
					  numRows  = len(items),
					  items = items)

def getValue(kw, name):
	""" get as NULL"""
	value = kw.get(name, "NULL")
	return value if value == None else "NULL"

def fixValue(kw):
	""" fix up dict """
	rkw = {}
	for key in kw.keys():
		rkw[key] = getValue(kw, key)
	return rkw

class ParamCtrl(object):
	""" Control of options """
	@staticmethod
	def getLogic(kw):
		""" get the logic settings """
		value = kw.get('logic', Constants.Search_Or)
		if value == "false":
			value = Constants.Search_And
		elif value == "true":
			value = Constants.Search_Or

		kw.logic = value

	@staticmethod
	def initParams(key):
		""" start up """
		return DictExt(key)

	@staticmethod
	def convertJSonListsParams(data):
		""" convert a list """
		decode = JSONDecoder()
		obj = decode.decode(data)
		t = type(obj)
		if t == types.StringType:
			return obj.lower()
		elif t == types.DictionaryType:
			obj = DictExt(obj)
		return obj

	@staticmethod
	def convertJSonListsParamsStd(data):
		""" convert a list """
		decode = JSONDecoder()
		obj = decode.decode(data)
		t = type(obj)
		if t == types.StringType:
			return obj.lower()
		return obj
