# -*- coding: utf-8 -*-
"""ProspectType"""
#-----------------------------------------------------------------------------
# Name:        prospecttypes.py
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

class ProspectType(BaseSql):
	""" Prospect company """

	_List_View = """SELECT pc.prospecttypeid, pc.prospecttypename
	FROM sales.prospecttype AS pc"""
	_Count_Figure = """ SELECT COUNT(*) FROM sales.prospecttype AS pc """

	@classmethod
	def add(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = ProspectType( prospecttypename = params["prospecttypename"] )
			session.add( prospect)
			session.flush()
			transaction.commit()
			return prospect.prospecttypeid
		except:
			LOGGER.exception("prospecttype_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = ProspectType.query.get ( prospecttypeid )
			prospect.prospecttypename = params["prospecttypename"]
			transaction.commit()
		except:
			LOGGER.exception("prospecttype_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, prospecttypeid ):
		"""Get a record """

		return ProspectType.query.get( prospecttypeid )

	@classmethod
	def list_of_types(cls,  params):
		""" list of companies """

		whereclause = ""
		if "prospecttypename" in params:
			whereclause = BaseSql.addclause("", "prospecttypename ILIKE :prospecttypename")
			params["prospecttypename"] = params["prospecttypename"].replace("*", "%")

		if "prospecttypeid" in  params:
			whereclause = BaseSql.addclause("", "prospecttypeid = :prospecttypeid")

		# fix up sort field
		if params.get("sortfield", "") == "prospecttypename":
			params["sortfield"] = "UPPER(prospecttypename)"

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(prospecttypename)",
		  'prospecttypeid',
		  ProspectType._List_View + whereclause + BaseSql.Standard_View_Order,
		  ProspectType._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "prospecttypeid" in params else False )

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [ dict (id = row.prospecttypeid, name = row.prospecttypename)
		         for row in session.query(ProspectType).order_by( ProspectType.prospecttypename).all() ]

	@staticmethod
	def exists(prospecttypeid, prospecttypename):
		"""checkt to see if a email address existing in the unsub file """
		if prospecttypeid == -1:
			return True if session.query( ProspectType ).filter(ProspectType.prospecttypename == prospecttypename).count() else False
		else:
			return True if session.query( ProspectType ).filter(ProspectType.prospecttypename == prospecttypename).\
			  filter( prospecttypeid != prospecttypeid).count() else False

ProspectType.mapping = Table('prospecttype', metadata, autoload=True, schema="sales" )
mapper(ProspectType, ProspectType.mapping)