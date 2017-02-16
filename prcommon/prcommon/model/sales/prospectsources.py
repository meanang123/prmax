# -*- coding: utf-8 -*-
"""ProspectSource"""
#-----------------------------------------------------------------------------
# Name:        prospectsources.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     20/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from ttl.model import BaseSql

import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon")

class ProspectSource(BaseSql):
	""" Prospect company """

	_List_View = """SELECT pc.prospectsourceid, pc.prospectsourcename
	FROM sales.prospectsource AS pc"""
	_Count_Figure = """ SELECT COUNT(*) FROM sales.prospectsource AS pc """

	@classmethod
	def add(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = ProspectSource( prospectsourcename = params["prospectsourcename"] )
			session.add( prospect)
			session.flush()
			transaction.commit()
			return prospect.prospectsourceid
		except:
			LOGGER.exception("prospectsource_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = ProspectSource.query.get ( prospectsourceid )
			prospect.prospectsourcename = params["prospectsourcename"]
			transaction.commit()
		except:
			LOGGER.exception("prospectsource_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, prospectsourceid ):
		"""Get a record """

		return ProspectSource.query.get( prospectsourceid )

	@classmethod
	def list_of_sources(cls,  params):
		""" list of sources """

		whereclause = ""
		if "prospectsourcename" in params:
			whereclause = BaseSql.addclause("", "prospectsourcename ILIKE :prospectsourcename")
			params["prospectsourcename"] = params["prospectsourcename"].replace("*", "%")

		if "prospectsourceid" in  params:
			whereclause = BaseSql.addclause("", "prospectsourceid = :prospectsourceid")

		# fix up sort field
		if params.get("sortfield", "") == "prospectsourcename":
			params["sortfield"] = "UPPER(prospectsourcename)"

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(prospectsourcename)",
		  'prospectsourceid',
		  ProspectSource._List_View + whereclause + BaseSql.Standard_View_Order,
		  ProspectSource._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "prospectsourceid" in params else False )


	@staticmethod
	def exists(prospectsourceid, prospectsourcename):
		"""checkt to see if a email address existing in the unsub file """
		if prospectsourceid == -1:
			return True if session.query( ProspectSource ).filter(ProspectSource.prospectsourcename == prospectsourcename).count() else False
		else:
			return True if session.query( ProspectSource ).filter(ProspectSource.prospectsourcename == prospectsourcename).\
			  filter( prospectsourceid != prospectsourceid).count() else False


	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [ dict (id = row.prospectsourceid, name = row.prospectsourcename)
		         for row in session.query(ProspectSource).order_by( ProspectSource.prospectsourcename).all() ]

ProspectSource.mapping = Table('prospectsource', metadata, autoload=True, schema="sales" )
mapper(ProspectSource, ProspectSource.mapping)