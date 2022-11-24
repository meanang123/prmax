# -*- coding: utf-8 -*-
"""Prospect"""
#-----------------------------------------------------------------------------
# Name:        newsfeed.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     05/01/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from ttl.model import BaseSql

import prcommon.Constants as Constants
import logging
LOG = logging.getLogger("prcommon")

class UnSubscribe(BaseSql):
	""" unsubscri email address"""

	@staticmethod
	def exists(email):
		"""checkt to see if a email address existing in the unsub file """

		return True if session.query( UnSubscribe).filter(UnSubscribe.email == email.lower()).count() else False

	_List_View = """SELECT u.unsubscribeid,u.email,
	ur.unsubscribereason,
	ContactName(p.title,p.firstname,p.familyname,'','') as contactname,
	pc.prospectcompanyname
	FROM sales.unsubscribe AS u
	LEFT OUTER JOIN sales.unsubscribereason AS ur ON ur.unsubscribereasonid = u.unsubscribereasonid
	LEFT OUTER JOIN sales.prospectsarchive AS p ON p.prospectid = u.prospectid
	LEFT OUTER JOIN sales.prospectcompany AS pc ON pc.prospectcompanyid = p.prospectcompanyid
"""

	_Count_Figure = """ SELECT COUNT(*) FROM sales.unsubscribe AS u"""

	@classmethod
	def list_of_unsubscribe(cls,  params):
		""" list of unsubscribe"""

		whereclause = ""

		if "emailaddress" in params:
			params["emailaddress"] = "%" + params["emailaddress"] + "%"
			whereclause = BaseSql.addclause( whereclause, "u.email ILIKE :emailaddress")

		if "unsubscribeid" in params:
			params["unsubscribeid"] = int (params["unsubscribeid"])
			whereclause = BaseSql.addclause( whereclause, "u.unsubscribeid = :unsubscribeid")

		# fix up sort field

		if params.get('sortfield', "") == "email":
			params["sortfield"] =  "UPPER(u.email)"

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(u.email)",
		  'unsubscribeid',
		  UnSubscribe._List_View + whereclause + BaseSql.Standard_View_Order,
		  UnSubscribe._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "unsubscribeid" in params else False )

	@classmethod
	def get(cls,  unsubscribeid):
		""" get details """

		return session.query(UnSubscribe).filter( UnSubscribe.unsubscribeid == unsubscribeid ).scalar()

	@classmethod
	def delete(cls, unsubscribeid ):
		""" delete an unsubscribe record """

		transaction = cls.sa_get_active_transaction()
		try:
			session.delete( cls.get( unsubscribeid ) )

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("unsubscribe_delete")
			transaction.rollback()
			raise


UnSubscribe.mapping = Table('unsubscribe', metadata, autoload=True, schema="sales" )
mapper(UnSubscribe, UnSubscribe.mapping)