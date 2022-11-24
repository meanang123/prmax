# -*- coding: utf-8 -*-
"""CirculationDates record """
#-----------------------------------------------------------------------------
# Name:       circulationdates.py
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
from prcommon.model.outlet import Outlet

import logging
LOGGER = logging.getLogger("prcommon.model")

class CirculationDates(BaseSql):
	""" CirculationDates Record"""
	ListData = """
		SELECT
		circulationauditdateid,
	  circulationauditdateid AS id,
		circulationauditdatedescription
		FROM internal.circulationauditdate """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.circulationauditdate """

	@classmethod
	def get_list_circulationdates(cls, params ) :
		""" get rest page  """
		whereused =  ""

		if "circulationauditdatedescription" in params:
			whereused = BaseSql.addclause("", "circulationauditdatedescription ilike :circulationauditdatedescription")
			if params["circulationauditdatedescription"]:
				params["circulationauditdatedescription"] =  params["circulationauditdatedescription"].replace("*", "")
				params["circulationauditdatedescription"] = params["circulationauditdatedescription"] +  "%"

		if "circulationauditdateid" in  params:
			whereused = BaseSql.addclause(whereused, "circulationauditdateid = :circulationauditdateid")


		return cls.get_rest_page_base(
									params,
									'circulationauditdateid',
									'circulationauditdatedescription',
									CirculationDates.ListData + whereused + BaseSql.Standard_View_Order,
									CirculationDates.ListDataCount + whereused,
									cls )

	@classmethod
	def exists(cls , circulationauditdatedescription,  circulationauditdateid = -1) :
		""" check to see a specufuc role exists """

		data = session.query ( CirculationDates ).filter_by( circulationauditdatedescription = circulationauditdatedescription )
		if data and  circulationauditdateid != -1:
			for row in data:
				if row.circulationauditdateid !=  circulationauditdateid:
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
			circulationdates = CirculationDates( circulationauditdatedescription = params["circulationauditdatedescription"])
			session.add( circulationdates )
			session.flush()
			transaction.commit()
			return circulationdates.circulationauditdateid
		except:
			LOGGER.exception("CirculationDates Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def delete ( cls, circulationauditdateid ) :
		""" Delete Circuation Dates """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			circulationdates = CirculationDates.query.get( circulationauditdateid )
			session.delete ( circulationdates )
			transaction.commit()
		except:
			LOGGER.exception("CirculationDates Delete")
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
			circulationdates = CirculationDates.query.get( params["circulationauditdateid"])

			circulationdates.circulationauditdatedescription = params["circulationauditdatedescription"]

			transaction.commit()
		except:
			LOGGER.exception("CirculationDates Update")
			try:
				transaction.rollback()
			except :
				pass
			raise


	@classmethod
	def get( cls , circulationauditdateid) :
		""" Get prmaxrole details and extended details"""

		return dict(
		  circulationdates = CirculationDates.query.get ( circulationauditdateid),
		  inuse = True if session.query(Outlet.circulationauditdateid).filter(Outlet.circulationauditdateid == circulationauditdateid).limit(1).all() else False
		)

#########################################################
## Map object to db
#########################################################

CirculationDates.mapping = Table('circulationauditdate', metadata, autoload = True, schema='internal')

mapper(CirculationDates, CirculationDates.mapping )
