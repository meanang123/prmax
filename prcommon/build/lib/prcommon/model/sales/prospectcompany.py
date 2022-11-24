# -*- coding: utf-8 -*-
"""Prospect Company"""
#-----------------------------------------------------------------------------
# Name:        prospectcompany.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     25/07/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from ttl.model import BaseSql

import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon")

class ProspectCompany(BaseSql):
	""" Prospect company """

	_List_View = """SELECT pc.prospectcompanyid, pc.prospectcompanyname
	FROM sales.prospectcompany AS pc"""
	_Count_Figure = """ SELECT COUNT(*) FROM sales.prospectcompany AS pc """

	@classmethod
	def add(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = ProspectCompany( prospectcompanyname = params["prospectcompanyname"] )
			session.add( prospect)
			session.flush()
			transaction.commit()
			return prospect.prospectcompanyid
		except:
			LOGGER.exception("prospectcompany_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = ProspectCompany.query.get ( prospectcompanyid )
			prospect.prospectcompanyname = params["prospectcompanyname"]
			transaction.commit()
		except:
			LOGGER.exception("prospectcompany_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, prospectcompanyid ):
		"""Get a record """

		return ProspectCompany.query.get( prospectcompanyid )

	@classmethod
	def list_of_companies(cls,  params):
		""" list of companies """

		whereclause = ""
		if "prospectcompanyname" in params:
			whereclause = BaseSql.addclause("", "prospectcompanyname ILIKE :prospectcompanyname")
			params["prospectcompanyname"] = params["prospectcompanyname"].replace("*", "%")

		if "prospectcompanyid" in  params:
			whereclause = BaseSql.addclause("", "prospectcompanyid = :prospectcompanyid")

		# fix up sort field
		if params.get("sortfield", "") == "prospectcompanyname":
			params["sortfield"] = "UPPER(prospectcompanyname)"

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(prospectcompanyname)",
		  'prospectcompanyid',
		  ProspectCompany._List_View + whereclause + BaseSql.Standard_View_Order,
		  ProspectCompany._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "prospectcompanyid" in params else False )


	@staticmethod
	def exists(prospectcompanyid, prospectcompanyname):
		"""checkt to see if a email address existing in the unsub file """
		if prospectcompanyid == -1:
			return True if session.query( ProspectCompany ).filter(ProspectCompany.prospectcompanyname == prospectcompanyname).count() else False
		else:
			return True if session.query( ProspectCompany ).filter(ProspectCompany.prospectcompanyname == prospectcompanyname).\
			  filter( prospectcompanyid != prospectcompanyid).count() else False

ProspectCompany.mapping = Table('prospectcompany', metadata, autoload=True, schema="sales" )
mapper(ProspectCompany, ProspectCompany.mapping)