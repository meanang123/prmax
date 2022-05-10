# -*- coding: utf-8 -*-
"""MarketSector record """
#-----------------------------------------------------------------------------
# Name:       marketsector.py
# Purpose:
# Author:      Stamatia Vatsi
#
# Created:     May 2022
# Copyright:   (c) 2022
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, or_
from prcommon.model.common import BaseSql
from prcommon.model.outlet import Outlet

import logging
LOGGER = logging.getLogger("prcommon.model")

class MarketSector(BaseSql):
	""" MarketSector Record"""
	ListData = """
		SELECT
		marketsectorid,
		marketsectorid AS id,
		marketsectordescription
		FROM internal.marketsector """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.marketsector """


	def __json__(self):
		"""to json"""

		return dict (
		  marketsectorid = self.marketsectorid,
		  marketsectordescription = self.marketsectordescription)

	@classmethod
	def get_list_marketsector(cls, params ) :
		""" get rest page  """
		whereused =  ""

		if "marketsectordescription" in params:
			whereused = BaseSql.addclause("", "marketsectordescription ilike :marketsectordescription")
			if params["marketsectordescription"]:
				params["marketsectordescription"] = params["marketsectordescription"].replace("*", "")
				params["marketsectordescription"] = "%" + params["marketsectordescription"] +  "%"

		if "marketsectorid" in  params:
			whereused = BaseSql.addclause(whereused, "marketsectorid = :marketsectorid")


		return cls.get_rest_page_base(
									params,
									'marketsectorid',
									'marketsectordescription',
									MarketSector.ListData + whereused + BaseSql.Standard_View_Order,
									MarketSector.ListDataCount + whereused,
									cls )

	@classmethod
	def exists(cls , marketsectordescription,  marketsectorid = -1) :
		""" check to see a specific market sector exists """

		data = session.query(MarketSector).filter_by(marketsectordescription = marketsectordescription)
		if data and  marketsectorid != -1:
			for row in data:
				if row.marketsectorid !=  marketsectorid:
					return True
			else:
				return False
		else:
			return True if data.count()>0 else False

	@classmethod
	def add(cls, params):
		""" add a new market sector to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			marketsector = MarketSector(marketsectordescription = params["marketsectordescription"])
			session.add(marketsector)
			session.flush()
			transaction.commit()
			return marketsector.marketsectorid
		except:
			LOGGER.exception("Market Sector Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def delete(cls, marketsectorid):
		""" Delete Makret Sector"""
		transaction = BaseSql.sa_get_active_transaction()

		try:
			marketsector = MarketSector.query.get(marketsectorid)
			session.delete(marketsector)
			transaction.commit()
		except:
			LOGGER.exception("Market Sector Delete")
			try:
				transaction.rollback()
			except :
				pass
			raise

	@classmethod
	def update(cls, params):
		""" update market sector to the system """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			marketsector = MarketSector.query.get(params["marketsectorid"])

			marketsector.marketsectordescription = params["marketsectordescription"]

			transaction.commit()
		except:
			LOGGER.exception("MarketSector Update")
			try:
				transaction.rollback()
			except :
				pass
			raise


	@classmethod
	def get(cls, marketsectorid):
		""" Get market sector details"""

		inuse = False
		if session.query(Outlet).filter(or_(Outlet.marketsectorprimaryid == marketsectorid, Outlet.marketsectorsecondaryid == marketsectorid, Outlet.marketsectortertiaryid == marketsectorid)).limit(1).all():
			inuse = True
		return dict(
		  marketsector = MarketSector.query.get(marketsectorid),
		  inuse = inuse
		)

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return dict(
			  id = row.marketsectorid,
			  name = row.marketsectordescription)

		data = [ _convert( row ) for row in session.query(MarketSector).order_by(MarketSector.marketsectordescription).all()]

		if "ignore" in params:
			data.insert(0,dict(id=-1,name="No Filter"))

		return data

#########################################################
## Map object to db
#########################################################

MarketSector.mapping = Table('marketsector', metadata, autoload = True, schema='internal')

mapper(MarketSector, MarketSector.mapping )
