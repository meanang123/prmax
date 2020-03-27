# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        common.py
# Purpose:		basic object for all model elements
#
# Author:      Chris Hoy
#
# Created:     10-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import identity
from turbogears.database import  session
from simplejson import JSONDecoder,dump
from ttl.tg.errorhandlers import SecurityException
from sqlalchemy.sql import text
from types import ListType, TupleType

from cherrypy import request, response
from cStringIO import StringIO
from ttl.ttljson import TtlJsonEncoder
from ttl.tg.common import set_default_response_settings, set_response_type


import ttl.Constants as Constants
from ttl.dict import DictExt

import types, logging
log = logging.getLogger("ttl.model")

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
	def get_active_transaction():
		""" get the current active transaction """
		try:
			transaction = request.sa_transaction
		except AttributeError:
			transaction = session.begin(subtransactions=True)
		return transaction

	@staticmethod
	def get_session_transaction():
		"""get a new session transaction not for tg interface"""

		return session.begin()


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
		except:
			log.exception("sqlExecuteCommand Command: %s" % command )
			if transtion:
				try:
					trans.rollback()
				except: pass
			raise
		return success

	@staticmethod
	def ResultExists(result):
		""" Check to see if the results exist """
		data  = result.fetchone()
		return True if data else False

	@staticmethod
	def result_count_rows(result):
		""" Check to see if the results exist """
		return (result.rowcount, )

	@staticmethod
	def ResultAsEncodedDict(results):
		""" return the result as an encoded dictionary"""

		try:
			keys = results.keys
			if type ( keys ) != ListType:
				keys = results.keys()
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
		tmp = result.fetchone()
		if tmp:
			return tmp.values()
		else:
			return None

	@classmethod
	def _singleResultAsDict(cls, result):
		""" return a single record as dictionary no need to encode data"""
		try:
			keys = result.keys
			if type ( keys ) != ListType:
				keys = result.keys()
		except:
			keys = result._metadata.keys

		r = {}
		try:
			values = result.fetchone().values()
			for i in xrange(0, len(keys)):
				r[keys[i]] = values[i]
		except:
			pass

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
	def single_integer_row(result):
		""" return a single result field usuall used for count functgions """
		rows = result.fetchall()
		if rows:
			return rows[0]
		else:
			return (0, )


	@staticmethod
	def sum_of_rows(result):
		""" sum of the first column of a number of rows """
		rows = result.fetchall()
		retvalue = 0
		for row in rows:
			retvalue += row[0]

		return (retvalue, )


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
		if sortfield in sortfields:
			sortby = sortfields[sortfield]

		if sortby == "outletname":
			sortby = "UPPER(sortname)"

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

		ret = dict (numRows = numRows, items = items )
		if primaryid:
			ret['identifier'] = primaryid
			ret['label'] = primaryid
		return ret

	@classmethod
	def get_grid_page(cls, params, sortdefault, primaryid, query, querynbr, parent):
		""" get a page for a grid """

		params['sortfield'] = params.get('sortfield', sortdefault)
		if not params['sortfield']:
			params['sortfield'] = sortdefault

		items = parent.sqlExecuteCommand (
			text(query % (params['sortfield'],params['direction'])) ,
			params,BaseSql.ResultAsEncodedDict)

		nbr_func = BaseSql.single_integer_row
		query_nbr = querynbr
		if type(querynbr) == TupleType:
			(query_nbr, nbr_func) = querynbr

		numRows = parent.sqlExecuteCommand (
			text(query_nbr) ,
			params,
			nbr_func)[0]

		ret = dict (numRows = numRows, items = items)
		if primaryid:
			ret['identifier'] = primaryid
			ret['label'] = primaryid

		return ret

	@classmethod
	def get_rest_page_base(cls, params , primaryid, sortdefault, query, querynbr, parent):
		""" Get a basic page of rest """

		data = cls.get_grid_page ( params, sortdefault, primaryid, query, querynbr, parent )

		return cls.grid_to_rest ( data ,
		                          params["offset"],
		                          True if primaryid in  params else False )

	@classmethod
	def grid_to_rest(cls, data, offset, single = False ) :
		""" convert the output from a grid too a rest controller
		A single record request has a single object and not an array """

		# return the json as a string
		tmp = StringIO()
		if single:
			if data["items"]:
				dump ( data["items"][0], tmp )
		else:
			dump ( data["items"], tmp )
		tmp.flush()
		response.headers['Content-Range'] = "items %d-%d/%d" % ( offset , len(data["items"]), data["numRows"])
		data  = tmp.getvalue()
		tmp.close()
		del tmp

		set_default_response_settings()
		set_response_type( "json" )

		return data

	@classmethod
	def grid_to_rest_ext(cls, data, offset, single = False ) :
		""" convert the output from a grid too a rest controller
		A single record request has a single object and not an array """

		# return the json as a string
		encode = TtlJsonEncoder()
		retdata = ""
		if single:
			if data["items"]:
				retdata = encode.encode ( data["items"][0] )
		else:
				retdata = encode.encode ( data["items"] )

		# set up grid response
		response.headers['Content-Range'] = "items %d-%d/%d" % ( offset , len(data["items"]), data["numRows"])

		return retdata


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

	@staticmethod
	def addclause( whereclause, clause):
		if whereclause:
			whereclause += " AND "
		else:
			whereclause += " WHERE "

		whereclause += " " + clause + " "

		return whereclause

	@staticmethod
	def addgroupbyclause( groupbyclause, clause):
		if groupbyclause:
			groupbyclause += ", "
		else:
			groupbyclause += " GROUP BY "

		groupbyclause += " " + clause + " "

		return groupbyclause

	@staticmethod
	def addorderbyclause( orderbyclause, clause):
		if orderbyclause:
			orderbyclause += ", "
		else:
			orderbyclause += " ORDER BY "

		orderbyclause += " " + clause + " "

		return orderbyclause

	Standard_View_Order = """
	ORDER BY %s %s
	LIMIT :limit  OFFSET :offset """

	Standard_View_Order2 = """
	ORDER BY %s %s
	LIMIT NULL  OFFSET :offset """

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


def RunInTransaction( func, params, location) :
	""" Run a function inside aa transaction and commit the transaction """

	try:
		func(**params)
		transaction.commit()
	except Exception, ex:
		try:
			transaction.rollback()
		except :
			pass
		log.error("%s : %s"% (location, str(ex)))
		raise ex

	__all__ = ["BaseSql", "RunInTransaction"]



class WhereClause(object):
	""" Where clause builder """
	def __init__(self):
		""" set base """
		self._whereclause = ""

	@property
	def whereclause(self):
		""" return thhe actual clause """
		return self._whereclause

	def add(self, clause):
		self._whereclause = BaseSql.addclause( self._whereclause, clause)
