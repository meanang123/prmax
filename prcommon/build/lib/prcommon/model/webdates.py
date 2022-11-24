# -*- coding: utf-8 -*-
"""WebDates record """
#-----------------------------------------------------------------------------
# Name:       webdates.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     March/2016
# Copyright:   (c) 2016
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from prcommon.model.outlet import Outlet

import logging
LOGGER = logging.getLogger("prcommon.model")

class WebDates(BaseSql):
	""" WebDates Record"""
	ListData = """
		SELECT
		webauditdateid,
	    webauditdateid AS id,
		webauditdatedescription
		FROM internal.webauditdate """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.webauditdate """

	@classmethod
	def get_list_webdates(cls, params ) :
		""" get rest page  """
		whereused =  ""

		if "webauditdatedescription" in params:
			whereused = BaseSql.addclause("", "webauditdatedescription ilike :webauditdatedescription")
			if params["webauditdatedescription"]:
				params["webauditdatedescription"] =  params["webauditdatedescription"].replace("*", "")
				params["webauditdatedescription"] = params["webauditdatedescription"] +  "%"

		if "webauditdateid" in  params:
			whereused = BaseSql.addclause(whereused, "webauditdateid = :webauditdateid")


		return cls.get_rest_page_base(
									params,
									'webauditdateid',
									'webauditdatedescription',
									WebDates.ListData + whereused + BaseSql.Standard_View_Order,
									WebDates.ListDataCount + whereused,
									cls )

	@classmethod
	def exists(cls , webauditdatedescription,  webauditdateid = -1) :
		""" check to see a specific role exists """

		data = session.query ( WebDates ).filter_by( webauditdatedescription = webauditdatedescription )
		if data and  webauditdateid != -1:
			for row in data:
				if row.webauditdateid !=  webauditdateid:
					return True
			else:
				return False
		else:
			return True if data.count()>0 else False

	@classmethod
	def add ( cls, params ) :
		""" add a new role to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			webdates = WebDates( webauditdatedescription = params["webauditdatedescription"])
			session.add( webdates )
			session.flush()
			transaction.commit()
			return webdates.webauditdateid
		except:
			LOGGER.exception("WebDates Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def delete ( cls, webauditdateid ) :
		""" Delete Web Dates """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			webdates = WebDates.query.get( webauditdateid )
			session.delete ( webdates )
			transaction.commit()
		except:
			LOGGER.exception("WebDates Delete")
			try:
				transaction.rollback()
			except :
				pass
			raise

	@classmethod
	def update ( cls, params ) :
		""" update new role to the system """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			webdates = WebDates.query.get( params["webauditdateid"])

			webdates.webauditdatedescription = params["webauditdatedescription"]

			transaction.commit()
		except:
			LOGGER.exception("WebDates Update")
			try:
				transaction.rollback()
			except :
				pass
			raise


	@classmethod
	def get( cls , webauditdateid) :
		""" Get prmaxrole details and extended details"""

		return dict(
		  webdates = WebDates.query.get (webauditdateid),
		  inuse = True if session.query(Outlet.webauditdateid).filter(Outlet.webauditdateid == webauditdateid).limit(1).all() else False
		)

#########################################################
## Map object to db
#########################################################

WebDates.mapping = Table('webauditdate', metadata, autoload = True, schema='internal')

mapper(WebDates, WebDates.mapping )
