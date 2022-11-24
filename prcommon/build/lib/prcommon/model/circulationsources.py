# -*- coding: utf-8 -*-
"""CirculationSources record """
#-----------------------------------------------------------------------------
# Name:       circulationsources.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     07/11/2012
# Copyright:   (c) 2012
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prcommon.model")

class CirculationSources(BaseSql):
	""" CirculationSources Record"""
	ListData = """
		SELECT
		circulationsourceid,
	  circulationsourceid AS id,
		circulationsourcedescription
		FROM internal.circulationsource """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.circulationsource """

	@classmethod
	def get_list_circulationsources(cls, params):
		""" get rest page  """
		whereused = ""

		if "circulationsourcedescription" in params:
			whereused = BaseSql.addclause("", "circulationsourcedescription ilike :circulationsourcedescription")
			if params["circulationsourcedescription"]:
				params["circulationsourcedescription"] = params["circulationsourcedescription"].replace("*", "")
				params["circulationsourcedescription"] = params["circulationsourcedescription"] +  "%"

		if "circulationsourceid" in  params:
			whereused = BaseSql.addclause(whereused, "circulationsourceid = :circulationsourceid")


		return cls.get_rest_page_base(
									params,
									'circulationsourceid',
									'circulationsourcedescription',
									CirculationSources.ListData + whereused + BaseSql.Standard_View_Order,
									CirculationSources.ListDataCount + whereused,
									cls)

	@classmethod
	def exists(cls, circulationsourcedescription, circulationsourceid=-1):
		""" check to see a specufuc role exists """

		data = session.query(CirculationSources).filter_by(circulationsourcedescription=circulationsourcedescription)
		if data and circulationsourceid != -1:
			for row in data:
				if row.circulationsourceid != circulationsourceid:
					return True
				return False
		else:
			return True if data.count() > 0 else False

	@classmethod
	def add(cls, params):
		""" add a new role to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			circulationsources = CirculationSources(circulationsourcedescription=params["circulationsourcedescription"])
			session.add(circulationsources)
			session.flush()
			transaction.commit()
			return circulationsources.circulationsourceid
		except:
			LOGGER.exception("CirculationSources Add")
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
			circulationsources = CirculationSources.query.get(params["circulationsourceid"])

			circulationsources.circulationsourcedescription = params["circulationsourcedescription"]

			transaction.commit()
		except:
			LOGGER.exception("CirculationSources Update")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@classmethod
	def get(cls, circulationsourceid):
		""" Get prmaxrole details and extended details"""

		return CirculationSources.query.get(circulationsourceid)

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """

		return [dict(id=row.circulationsourceid, name=row.circulationsourcedescription)
				       for row in session.query(CirculationSources).order_by(CirculationSources.circulationsourceid).all()]

#########################################################
## Map object to db
#########################################################

CirculationSources.mapping = Table('circulationsource', metadata, autoload=True, schema='internal')

mapper(CirculationSources, CirculationSources.mapping)
