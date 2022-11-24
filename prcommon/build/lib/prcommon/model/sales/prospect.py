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
from datetime import date, datetime

from prospectcompany import ProspectCompany
from prospectarchive import ProspectArchive
from prospectsources import ProspectSource
from prospecttypes import ProspectType
from unsubscribe import UnSubscribe
from prospectregions import ProspectRegion

import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon")

class Prospect(BaseSql):
	""" Prmax Prospect """

	def get_name(self):
		""" return the name """

		fields = ( self.title, self.firstname, self.familyname )

		return " ".join([row for row in fields if row!=None and len(row)]).strip()


	@staticmethod
	def exists(prospectid, email):
		"""checkt to see if a email address existing in the archive file """

		data = session.query( Prospect ).filter(Prospect.email == email.lower()).all()
		if data:
			if prospectid == -1:
				return True

			for row in data:
				if row.prospectid != prospectid:
					return True

		return False


	_List_View = """SELECT p.prospectid,p.email,
	ContactName(p.title,p.firstname,p.familyname,'','') as contactname,
	pc.prospectcompanyname,
	to_char(p.lastsent,'DD-MM-YY') AS lastsent_display,
	pt.prospecttypename,
	ps.prospectsourcename,
	pr.prospectregionname
	FROM sales.prospectslive AS p
	LEFT OUTER JOIN sales.prospectcompany AS pc ON pc.prospectcompanyid = p.prospectcompanyid
	LEFT OUTER JOIN sales.prospectsource AS ps ON ps.prospectsourceid = p.prospectsourceid
	LEFT OUTER JOIN sales.prospecttype AS pt ON pt.prospecttypeid = p.prospecttypeid
	LEFT OUTER JOIN sales.prospectregion AS pr ON pr.prospectregionid = p.prospectregionid

	"""

	_Count_Figure = """ SELECT COUNT(*) FROM sales.prospectslive AS p
	LEFT OUTER JOIN sales.prospectcompany AS pc ON pc.prospectcompanyid = p.prospectcompanyid"""

	@classmethod
	def list_of_prospects(cls,  params):
		""" list of live prospects """

		whereclause = ""

		if "emailaddress" in params:
			params["emailaddress"] = "%" + params["emailaddress"] + "%"
			whereclause = BaseSql.addclause( whereclause, "p.email ILIKE :emailaddress")

		if "prospectid" in params:
			params["prospectid"] = int (params["prospectid"])
			whereclause = BaseSql.addclause( whereclause, "p.prospectid = :prospectid")

		# fix up sort field

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(email)",
		  'prospectid',
		  Prospect._List_View + whereclause + BaseSql.Standard_View_Order,
		  Prospect._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "prospectid" in params else False )

	@classmethod
	def add(cls, params):
		"""Add Prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = Prospect(
			  email = params["email"],
			  familyname = params["familyname"],
			  firstname = params["firstname"],
			  title = params["title"],
			  addedby = params["userid"],
			  prospectsourceid = params["prospectsourceid"],
			  prospecttypeid = params["prospecttypeid"],
			  telephone = params["telephone"],
			  web = params["web"],
			  addeddate = datetime.now()
			)

			if "prospectcompanyid" in params and params["prospectcompanyid"]:
				prospect.prospectcompanyid = params["prospectcompanyid"]

			if "prospectregionid" in params and params["prospectregionid"]:
				prospect.prospectregionid = params["prospectregionid"]

			transaction.commit()

			return prospect.prospectid
		except:
			LOGGER.exception("prospect_add")
			transaction.rollback()
			raise

	@classmethod
	def archive(cls, params):
		"""move to the archive"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = Prospect.query.get( params["prospectid"])
			prospecta = ProspectArchive (
			  prospectid = prospect.prospectid,
			  email = prospect.email,
			  familyname = prospect.familyname,
			  firstname = prospect.firstname,
			  title = prospect.title,
			  prospectcompanyid = prospect.prospectcompanyid,
			  lastsent = prospect.lastsent,
			  nbrsent = prospect.nbrsent,
			  addedby = prospect.addedby,
			  prospectsourceid = prospect.prospectsourceid,
			  prospecttypeid = prospect.prospecttypeid,
			  web = prospect.web,
			  telephone = prospect.telephone
			)
			session.add ( prospecta )
			session.delete ( prospect )

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("prospect_archive")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		"""update the prospect"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = Prospect.query.get( params["prospectid"])
			prospect.email = params["email"]
			prospect.familyname = params["familyname"]
			prospect.firstname = params["firstname"]
			prospect.title = params["title"]
			prospect.prospectsourceid = params["prospectsourceid"]
			prospect.prospecttypeid = params["prospecttypeid"]
			prospect.telephone = params["telephone"]
			prospect.web = params["web"]
			prospect.modified = datetime.now()
			if "prospectcompanyid" in params and params["prospectcompanyid"]:
				prospect.prospectcompanyid = params["prospectcompanyid"]
			else:
				prospect.prospectcompanyid = None

			if "prospectregionid" in params and params["prospectregionid"]:
				prospect.prospectregionid = params["prospectregionid"]
			else:
				prospect.prospectregionid = None

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("prospect_update")
			transaction.rollback()
			raise

	@classmethod
	def delete(cls, params):
		"""move to the archive"""

		transaction = cls.sa_get_active_transaction()
		try:
			prospect = Prospect.query.get( params["prospectid"])
			prospecta = ProspectArchive (
			  prospectid = prospect.prospectid,
			  email = prospect.email,
			  familyname = prospect.familyname,
			  firstname = prospect.firstname,
			  title = prospect.title,
			  prospectcompanyid = prospect.prospectcompanyid,
			  lastsent = prospect.lastsent,
			  nbrsent = prospect.nbrsent,
			  addedby = prospect.addedby,
			  prospectsourceid = prospect.prospectsourceid,
			  prospecttypeid = prospect.prospecttypeid,
			  web = prospect.web,
			  telephone = prospect.telephone
			)
			session.add ( prospecta )
			session.flush()


			if not UnSubscribe.exists(prospect.email):
				unsub = UnSubscribe(
				  email = prospect.email,
				  unsubscribereasonid = params["unsubscribereasonid"],
				  prospectid = prospect.prospectid)
				session.add( unsub )
			else:
				unsub = session.query( UnSubscribe).filter(UnSubscribe.email == prospect.email.lower()).scalar()
				unsub.prospectid =  prospect.prospectid
			session.delete ( prospect )

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("prospect_delete")
			transaction.rollback()
			raise

	@classmethod
	def get_row(cls, prospectid):
		""" get display details """

		data = cls.get ( prospectid )

		return data

	@classmethod
	def get(cls, prospectid):
		""" get display details """

		prospect = Prospect.query.get( prospectid)
		prospectsource = ProspectSource.query.get( prospect.prospectsourceid )
		prospecttype = ProspectType.query.get( prospect.prospecttypeid )

		if prospect.prospectcompanyid:
			prospectcompany = ProspectCompany.query.get( prospect.prospectcompanyid )
			prospectcompanyname = prospectcompany.prospectcompanyname if prospectcompany else ""
		else:
			prospectcompany = None
			prospectcompanyname = ""

		if prospect.prospectregionid:
			prospectregion = ProspectRegion.query.get( prospect.prospectregionid )
			prospectregionname = prospectregion.prospectregionname
		else:
			prospectregionname = ""


		if prospect.lastsent:
			lastsent_display = prospect.lastsent.strftime("%d/%m/%y")
		else:
			lastsent_display = ""


		return dict (
		  prospectid = prospect.prospectid,
		  email = prospect.email,
		  familyname = prospect.familyname,
		  firstname = prospect.firstname,
		  title = prospect.title,
		  contactname = prospect.get_name(),
		  lastsent_display = lastsent_display,
		  prospectcompanyname = prospectcompanyname,
		  prospectcompanyid = prospect.prospectcompanyid,
		  prospectsourceid = prospect.prospectsourceid,
		  prospectregionid = prospect.prospectregionid,
		  prospecttypeid = prospect.prospecttypeid,
		  telephone = prospect.telephone,
		  web = prospect.web,
		  prospectsourcename = prospectsource.prospectsourcename,
		  prospecttypename =  prospecttype.prospecttypename)

Prospect.mapping = Table('prospectslive', metadata, autoload=True, schema="sales" )
# fix up default value for column
Prospect.mapping.c.prospecttypeid.default_extra = 5
mapper(Prospect, Prospect.mapping)