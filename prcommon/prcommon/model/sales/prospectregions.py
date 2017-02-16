# -*- coding: utf-8 -*-
"""ProspectRegion"""
#-----------------------------------------------------------------------------
# Name:        prospectregions.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     11/09/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from ttl.model import BaseSql

import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon")

class ProspectRegion(BaseSql):
	""" ProspectRegion """

	_List_View = """SELECT pc.prospectregionid, pc.prospectregionname
	FROM sales.prospectregion AS pc"""
	_Count_Figure = """ SELECT COUNT(*) FROM sales.prospectregion AS pc """

	@classmethod
	def add(cls, params):
		"""Add Prospect Region"""

		transaction = cls.sa_get_active_transaction()
		try:
			region = ProspectRegion( prospectregionname = params["prospectregionname"] )
			session.add(  region )
			session.flush()
			transaction.commit()
			return region.prospectregionid
		except:
			LOGGER.exception("prospectregion_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		"""Update Prospect Region"""

		transaction = cls.sa_get_active_transaction()
		try:
			region = ProspectRegion.query.get ( prospectregionid )
			region.prospectregionname = params["prospectregionname"]
			transaction.commit()
		except:
			LOGGER.exception("prospectregion_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, prospectregionid ):
		"""Get a record """

		return ProspectRegion.query.get( prospectregionid )

	@classmethod
	def list_of_regions(cls,  params):
		""" list of companies """

		whereclause = ""
		if "prospectregionname" in params:
			whereclause = BaseSql.addclause("", "prospectregionname ILIKE :prospectregionname")
			params["prospectregionname"] = params["prospectregionname"].replace("*", "%")

		if "prospectregionid" in  params:
			whereclause = BaseSql.addclause("", "prospectregionid = :prospectregionid")

		# fix up sort field
		if params.get("sortfield", "") == "prospectregionname":
			params["sortfield"] = "UPPER(prospectregionname)"

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(prospectregionname)",
		  'prospectregionid',
		  ProspectRegion._List_View + whereclause + BaseSql.Standard_View_Order,
		  ProspectRegion._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "prospectregionid" in params else False )

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [ dict (id = row.prospectregionid, name = row.prospectregionname)
		         for row in session.query(ProspectRegion).order_by( ProspectRegion.prospectregionname).all() ]

	@staticmethod
	def exists(prospectregionid, prospectregionname):
		"""checkt to see if a email address existing in the unsub file """
		if prospectregionid == -1:
			return True if session.query( ProspectRegion ).filter(ProspectRegion.prospectregionname == prospectregionname).count() else False
		else:
			return True if session.query( ProspectRegion ).filter(ProspectRegion.prospectregionname == prospectregionname).\
			  filter( prospectregionid != prospectregionid).count() else False

ProspectRegion.mapping = Table('prospectregion', metadata, autoload=True, schema="sales" )
mapper(ProspectRegion, ProspectRegion.mapping)