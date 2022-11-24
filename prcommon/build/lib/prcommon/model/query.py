# -*- coding: utf-8 -*-
"query"
#-----------------------------------------------------------------------------
# Name:        query.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     13-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import metadata, session, mapper
from sqlalchemy import Table
from common import BaseSql
from ttl.ttlcsv import ToCsv
import logging
LOGGER = logging.getLogger("prmax")

class QueryHistory(BaseSql):
	"""QueryHistory"""
	List_Combo = """
	SELECT JSON_ENCODE(c.subject ) as subject, c.queryhistoryid,c.queryhistoryid as id
	FROM internal.queryhistory AS c
	WHERE
	c.subject ilike :subject
	%s
	ORDER BY c.subject
	LIMIT :limit  OFFSET :offset """
	List_Combo_Id = """
	SELECT JSON_ENCODE(c.subject ) as subject, c.queryhistoryid,c.queryhistoryid as id
	FROM internal.queryhistory AS c
	WHERE c.queryhistoryid = :id
	%s"""

	@classmethod
	def get_list_rest_page(cls, params):
		"""get rest page """

		return BaseSql.grid_to_rest ( cls.getListPage(params),
		                              params["offset"],
		                              False)

	@classmethod
	def getListPage(cls, params):
		""" get alist of queries"""
		whereused = ""
		if "typeid" in  params:
			whereused = " AND c.typeid = :typeid"

		return BaseSql.getListPage ( params ,
								                 "subject" ,
								                 "queryhistoryid" ,
								                 QueryHistory.List_Combo % whereused,
								                 QueryHistory.List_Combo_Id % whereused,
								                 cls )

	@classmethod
	def load (cls, params ) :
		""" Load a specific record """

		return QueryHistory.query.get ( params["queryhistoryid"])

	@classmethod
	def save (cls, params ) :
		""" Save a query"""
		try:
			transaction = cls.sa_get_active_transaction()

			tmp = session.query( QueryHistory ) .filter_by ( subject = params["subject"]).all()
			if tmp:
				tmp[0].query_text = params["query_text"]
			else:
				session.add ( QueryHistory ( **params ) )

			transaction.commit()

		except:
			LOGGER.exception("QueryHistory_save")
			transaction.rollback()
			raise

	@classmethod
	def toresearch (cls, params ) :
		""" Change a query to be or not visible to research application"""
		try:
			transaction = cls.sa_get_active_transaction()

			query = QueryHistory.query.get ( params["queryhistoryid"])
			if query:
				if params['visibletoresearch'] == True:
					query.typeid = 1
				else:
					query.typeid = 0

			transaction.commit()

		except:
			LOGGER.exception("QueryHistory_toresearch")
			transaction.rollback()
			raise


class AdHocQuery( BaseSql ):
	"""  AdHocQuery """
	@classmethod
	def line_to_string(cls, line):
		"convert line"
		return " ".join ( [ str(row) for row in line] )

	@classmethod
	def execute ( cls, ex_string ):
		"run execute"

		def _fixrows(row):
			"fix row"
			def _fixtext( obj ):
				"fixup row"
				if isinstance(obj, basestring):
					return obj
				else:
					return unicode( str(obj) , 'utf-8','replace')

			return "<br/>" + " ".join ( [ _fixtext(obj) for obj in row ])


		try:
			transaction = AdHocQuery.sa_get_active_transaction()
			_result = session.execute ( ex_string, None, mapper = cls )
			_rows = [[ row.upper() for row  in _result.keys()],]
			_rows.extend ( _result .fetchall())
			transaction.rollback()
			return "".join( [_fixrows ( ows ) for ows in _rows ] )
		except:
			transaction.rollback()
			raise

	@classmethod
	def toexcel ( cls, ex_string ):
		"to excel "
		try:
			transaction = AdHocQuery.sa_get_active_transaction()
			_result = session.execute ( ex_string, None, mapper = cls )
			_rows = [[ row for row  in _result.keys()],]
			_rows.extend ( _result .fetchall())
			transaction.rollback()
			return ToCsv ( _rows )
		except:
			transaction.rollback()
			raise



QueryHistory.mapping = Table('queryhistory', metadata, autoload = True, schema = 'internal')
mapper( AdHocQuery, QueryHistory.mapping )
mapper( QueryHistory, QueryHistory.mapping )
