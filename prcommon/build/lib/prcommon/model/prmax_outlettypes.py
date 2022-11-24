# -*- coding: utf-8 -*-
"""WebSources record """
#-----------------------------------------------------------------------------
# Name:       websources.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     March/2016
# Copyright:   (c) 2016
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from sqlalchemy.sql import func, text
from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prcommon.model")


class Prmax_Outlettypes(BaseSql):
	""" Prmax_outlettypes Record"""
	Private_ListData = """ SELECT 
		prmax_outlettypeid,
	    prmax_outlettypeid AS id,
		prmax_outlettypename
		FROM internal.prmax_outlettypes
	    WHERE outletsearchtypeid = 13
	    AND prmax_outletgroupid = 'privatechannels'"""

	Private_ListDataCount = """
		SELECT COUNT(*) FROM  internal.prmax_outlettypes WHERE outletsearchtypeid = 13 AND prmax_outletgroupid = 'privatechannels'"""

	ListData = """SELECT 
		prmax_outlettypeid,
		prmax_outlettypename,
	    prmax_outletgroupid 
	    FROM internal.prmax_outlettypes
	    WHERE customerid = -1 """


	@classmethod
	def get_list_prmax_outlettypes(cls, params):
		""" get rest page  """
		whereused = ""

		if "prmax_outlettypename" in params:
			whereused = BaseSql.addclause("", "prmax_outlettypename ilike :prmax_outlettypename")
			if params["prmax_outlettypename"]:
				params["prmax_outlettypename"] = params["prmax_outlettypename"].replace("*", "")
				params["prmax_outlettypename"] = params["prmax_outlettypename"] +  "%"

		if "prmax_outlettypeid" in  params:
			whereused = BaseSql.addclause(whereused, "prmax_outlettypeid = :prmax_outlettypeid")


		return cls.get_rest_page_base(
									params,
									'prmax_outlettypeid',
									'prmax_outlettypename',
									Prmax_Outlettypes.ListData + whereused + BaseSql.Standard_View_Order,
									Prmax_Outlettypes.ListDataCount + whereused,
									cls)

	@classmethod
	def exists(cls, prmax_outlettypename, customerid):
		""" check to see a specufuc role exists """

		data = session.query(Prmax_Outlettypes).\
		    filter(Prmax_Outlettypes.prmax_outlettypename.ilike(prmax_outlettypename)).\
		    filter(Prmax_Outlettypes.customerid == customerid)
		return True if data.count() > 0 else False

	@classmethod
	def add(cls, params):
		""" add a new role to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			max_prmax_outlettypeid = session.query(func.max(Prmax_Outlettypes.prmax_outlettypeid)).scalar()
			prmax_outlettypes = Prmax_Outlettypes(
			    prmax_outlettypeid = max_prmax_outlettypeid + 1,
			    prmax_outlettypename=params["prmax_outlettypename"],
			    outletsearchtypeid = params['outletsearchtypeid'],
			    prmax_outletgroupid = params['prmax_outletgroupid'],
			    customerid = params['customerid']
			)
			session.add(prmax_outlettypes)
			session.flush()
			transaction.commit()
			return prmax_outlettypes.prmax_outlettypeid
		except:
			LOGGER.exception("Private Prmax_Outlettype Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def update(cls, params):
		""" update new role to the system """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			prmax_outlettypes = Prmax_Outlettypes.query.get(params["prmax_outlettypeid"])
			prmax_outlettypes.prmax_outlettypename = params["prmax_outlettypename"]
			transaction.commit()
		except:
			LOGGER.exception("Private Prmax_Outlettype Update")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@classmethod
	def get(cls, prmax_outlettypeid):
		""" Get prmax_outlettypes details"""

		return Prmax_Outlettypes.query.get(prmax_outlettypeid)

	@classmethod
	def getLookUp2(cls, params):
		""" get a listing """

		return [dict(id=row.prmax_outlettypeid, name=row.prmax_outlettypename)
				       for row in session.query(Prmax_Outlettypes).order_by(Prmax_Outlettypes.prmax_outlettypeid).all()]


	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		
		orclause = ''
		if 'customerid' in params and params['customerid'] != -1:
			orclause = ' OR customerid = %s' %int(params['customerid'])
		orderbyclause = ' ORDER BY prmax_outlettypename'
		def _convert(data):
			""""local convert"""
			return [dict(id=row.prmax_outlettypeid, name=row.prmax_outlettypename, grouptypeid=row.prmax_outletgroupid)
			        for row in data.fetchall()]
		data = cls.sqlExecuteCommand(text(Prmax_Outlettypes.ListData + orclause + orderbyclause), params, _convert)

		if "nofreelancer" in params:
			data = [data for data in data if data.get('id') != 42]

		return data


	@classmethod
	def get_grid_page_private(cls, params):
		""" get a page of prmax_outlettypes"""
		
		andclause = ' AND customerid = %s' %int(params['customerid'])

		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "prmax_outlettypename"
			params['direction'] = "ASC"

		return Prmax_Outlettypes.getGridPage(params,
		                              'prmax_outlettypename',
		                              'prmax_outlettypeid',
		                              Prmax_Outlettypes.Private_ListData + andclause + BaseSql.Standard_View_Order,
		                              Prmax_Outlettypes.Private_ListDataCount + andclause,
		                              cls)

	@classmethod
	def delete(cls, prmax_outlettypeid):
		""" delete a statement """

		try:
			transaction = cls.sa_get_active_transaction()
			prmax_outlettype = Prmax_Outlettypes.query.get(prmax_outlettypeid)
			session.delete(prmax_outlettype)
			transaction.commit()
		except:
			LOGGER.exception("Prmax_outlettype delete")
			transaction.rollback()
			raise
		
		
#########################################################
## Map object to db
#########################################################

Prmax_Outlettypes.mapping = Table('prmax_outlettypes', metadata, autoload=True, schema='internal')

mapper(Prmax_Outlettypes, Prmax_Outlettypes.mapping)
