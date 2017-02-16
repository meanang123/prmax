# -*- coding: utf-8 -*-
"""Mailing"""
#-----------------------------------------------------------------------------
# Name:        mailing.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     14/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table, text
from ttl.model import BaseSql
from datetime import date
import StringIO
import csv
from prospectcompany import ProspectCompany
from mailinglist import MailingList

import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon")

class Mailing( BaseSql ):
	""" Prmax Mailing List"""

	_List_View = """SELECT m.mailingid,m.mailingname
	FROM sales.mailing AS m """

	_Count_Figure = """ SELECT COUNT(*) FROM sales.mailing AS m """

	@staticmethod
	def exists( mailingid, mailingname):
		"""check to see if a email address existing in the archive file """

		return True if session.query( Mailing ).filter(Mailing.mailingname == mailingname.lower()).count() else False

	@classmethod
	def list_of_mailings(cls,  params):
		""" list of mailings"""

		whereclause = ""

		data = BaseSql.getGridPage(
		  params,
		  "UPPER(mailingname)",
		  'mailingid',
		  Mailing._List_View + whereclause + BaseSql.Standard_View_Order,
		  Mailing._Count_Figure + whereclause,
		  cls )

		return cls.grid_to_rest (
		  data,
		  params['offset'],
		  True if "mailingid" in params else False )


	@classmethod
	def add(cls, params):
		"""Add mailing"""

		transaction = cls.sa_get_active_transaction()
		try:
			mailing = Mailing( mailingname = params["mailingname"])
			session.flush()
			# create standard mailing list
			session.execute(text("INSERT INTO sales.mailinglist(mailingid,prospectid) SELECT :mailingid,prospectid from sales.prospectslive"),
			                dict(mailingid = mailing.mailingid), cls)
			transaction.commit()

			return mailing.mailingid
		except:
			LOGGER.exception("mailing_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, mailingid):
		"""get """

		return Mailing.query.get(mailingid)

	@classmethod
	def to_csv( cls, mailingid ):
		""" get the mailing as a list """


		rows = session.execute(text("""SELECT p.email,p.familyname,p.firstname,p.title,pc.prospectcompanyname
					FROM sales.mailinglist AS m
		      JOIN sales.prospectslive AS p ON p.prospectid = m.prospectid
		      LEFT OUTER JOIN sales.prospectcompany AS pc ON pc.prospectcompanyid = p.prospectcompanyid
		      WHERE m.mailingid = :mailingid"""),
		                dict(mailingid = mailingid),
		                cls).fetchall()
		output = StringIO.StringIO()
		csv_write = csv.writer ( output )
		csv_write.writerows( rows )
		output.flush()
		return output.getvalue()



Mailing.mapping = Table('mailing', metadata, autoload=True, schema="sales" )
mapper(Mailing, Mailing.mapping)