# -*- coding: utf-8 -*-
"""ProductionCompany record """
#-----------------------------------------------------------------------------
# Name:       productioncompany.py
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

from prcommon.model.outletprofile import OutletProfile

import logging
LOGGER = logging.getLogger("prcommon.model")

class ProductionCompany(BaseSql):
	""" ProductionCompany Record"""
	ListData = """
		SELECT
		productioncompanyid,
	  productioncompanyid AS id,
		productioncompanydescription
		FROM internal.productioncompanies """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.productioncompanies """

	@classmethod
	def get_list_production_companies(cls, params ) :
		""" get rest page  """
		whereused =  ""

		if "productioncompanydescription" in params:
			whereused = BaseSql.addclause("", "productioncompanydescription ilike :productioncompanydescription")
			if params["productioncompanydescription"]:
				params["productioncompanydescription"] =  params["productioncompanydescription"].replace("*", "")
				params["productioncompanydescription"] = params["productioncompanydescription"] +  "%"

		if "productioncompanyid" in  params:
			whereused = BaseSql.addclause(whereused, "productioncompanyid = :productioncompanyid")


		return cls.get_rest_page_base(
									params,
									'productioncompanyid',
									'productioncompanydescription',
									ProductionCompany.ListData + whereused + BaseSql.Standard_View_Order,
									ProductionCompany.ListDataCount + whereused,
									cls )

	@classmethod
	def exists(cls , productioncompanydescription,  productioncompanyid = -1) :
		""" check to see a specufuc role exists """

		data = session.query ( ProductionCompany ).filter_by( productioncompanydescription = productioncompanydescription )
		if data and  productioncompanyid != -1:
			for row in data:
				if row.productioncompanyid !=  productioncompanyid:
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
			productioncompany = ProductionCompany( productioncompanydescription = params["productioncompanydescription"])
			session.add( productioncompany )
			session.flush()
			transaction.commit()
			return productioncompany.productioncompanyid
		except:
			LOGGER.exception("ProductionCompany Add")
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
			productioncompany = ProductionCompany.query.get( params["productioncompanyid"])

			productioncompany.productioncompanydescription = params["productioncompanydescription"]

			transaction.commit()
		except:
			LOGGER.exception("ProductionCompany Update")
			try:
				transaction.rollback()
			except :
				pass
			raise

	@classmethod
	def delete ( cls, productioncompanyid ) :
		""" update new role to the system """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			productioncompany = ProductionCompany.query.get( productioncompanyid)

			session.delete ( productioncompany )

			transaction.commit()
		except:
			LOGGER.exception("ProductionCompany Delete")
			try:
				transaction.rollback()
			except :
				pass
			raise


	@classmethod
	def get( cls , productioncompanyid) :
		""" Get prmaxrole details and extended details"""

		return dict ( productioncompany = ProductionCompany.query.get ( productioncompanyid),
		              inuse = True if session.query(OutletProfile.productioncompanyid).\
		              filter(OutletProfile.productioncompanyid == productioncompanyid).limit(1).all() else False)

#########################################################
## Map object to db
#########################################################

ProductionCompany.mapping = Table('productioncompanies', metadata, autoload = True, schema='internal')

mapper(ProductionCompany, ProductionCompany.mapping )
