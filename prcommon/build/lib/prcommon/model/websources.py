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
from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prcommon.model")

class WebSources(BaseSql):
	""" WebSources Record"""
	ListData = """
		SELECT
		websourceid,
	  websourceid AS id,
		websourcedescription
		FROM internal.websource """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.websource """

	@classmethod
	def get_list_websources(cls, params):
		""" get rest page  """
		whereused = ""

		if "websourcedescription" in params:
			whereused = BaseSql.addclause("", "websourcedescription ilike :websourcedescription")
			if params["websourcedescription"]:
				params["websourcedescription"] = params["websourcedescription"].replace("*", "")
				params["websourcedescription"] = params["websourcedescription"] +  "%"

		if "websourceid" in  params:
			whereused = BaseSql.addclause(whereused, "websourceid = :websourceid")


		return cls.get_rest_page_base(
									params,
									'websourceid',
									'websourcedescription',
									WebSources.ListData + whereused + BaseSql.Standard_View_Order,
									WebSources.ListDataCount + whereused,
									cls)

	@classmethod
	def exists(cls, websourcedescription, websourceid=-1):
		""" check to see a specufuc role exists """

		data = session.query(WebSources).filter_by(websourcedescription=websourcedescription)
		if data and websourceid != -1:
			for row in data:
				if row.websourceid != websourceid:
					return True
				return False
		else:
			return True if data.count() > 0 else False

	@classmethod
	def add(cls, params):
		""" add a new role to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			websources = WebSources(websourcedescription=params["websourcedescription"])
			session.add(websources)
			session.flush()
			transaction.commit()
			return websources.websourceid
		except:
			LOGGER.exception("WebSources Add")
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
			websources = WebSources.query.get(params["websourceid"])

			websources.websourcedescription = params["websourcedescription"]

			transaction.commit()
		except:
			LOGGER.exception("WebSources Update")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@classmethod
	def get(cls, websourceid):
		""" Get prmaxrole details and extended details"""

		return WebSources.query.get(websourceid)

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """

		return [dict(id=row.websourceid, name=row.websourcedescription)
				       for row in session.query(WebSources).order_by(WebSources.websourceid).all()]

#########################################################
## Map object to db
#########################################################

WebSources.mapping = Table('websource', metadata, autoload=True, schema='internal')

mapper(WebSources, WebSources.mapping)
