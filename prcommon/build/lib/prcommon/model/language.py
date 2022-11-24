# -*- coding: utf-8 -*-
"""Languages record """
#-----------------------------------------------------------------------------
# Name:       language.py
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

import logging
LOGGER = logging.getLogger("prcommon.model")

class Languages(BaseSql):
	""" Languages Record"""
	ListData = """
		SELECT
		languageid,
	  languageid AS id,
		languagename
		FROM internal.languages """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.languages """

	def __json__(self):
		"""to json"""

		return dict (
		  languageid = self.languageid,
		  languagename = self.languagename)

	@classmethod
	def get_list_languagues(cls, params ) :
		""" get rest page  """
		whereused =  ""

		if "languagename" in params:
			whereused = BaseSql.addclause("", "languagename ilike :languagename")
			if params["languagename"]:
				params["languagename"] =  params["languagename"].replace("*", "")
				params["languagename"] = params["languagename"] +  "%"

		if "languageid" in  params:
			whereused = BaseSql.addclause(whereused, "languageid = :languageid")


		return cls.get_rest_page_base(
									params,
									'languageid',
									'languagename',
									Languages.ListData + whereused + BaseSql.Standard_View_Order,
									Languages.ListDataCount + whereused,
									cls )

	@classmethod
	def exists(cls , languagename,  languageid = -1) :
		""" check to see a specufuc role exists """

		data = session.query ( Languages ).filter_by( languagename = languagename )
		if data and  languageid != -1:
			for row in data:
				if row.languageid !=  languageid:
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
			language = Languages( languagename = params["languagename"])
			session.add( language )
			session.flush()
			transaction.commit()
			return language.languageid
		except:
			LOGGER.exception("Languages Add")
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
			language = Languages.query.get( params["languageid"])

			language.languagename = params["languagename"]

			transaction.commit()
		except:
			LOGGER.exception("Languages Update")
			try:
				transaction.rollback()
			except :
				pass
			raise

	@classmethod
	def get( cls , languageid) :
		""" Get prmaxrole details and extended details"""

		return Languages.query.get ( languageid)

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return dict(
			  id = row.languageid,
			  name = row.languagename)

		data = [ _convert( row ) for row in session.query( Languages ).order_by( Languages.languagename).all()]

		if "ignore" in params:
			data.insert(0,dict(id=-1,name="No Filter"))

		return data

	@classmethod
	def get_user_selection(cls,  params):
		"""list of selected """
		
		word = params["word"]
		if word == "*":
			word = ""
		word = word + "%"	

		return session.query(
		  Languages.mapping.c.languagename,
		  Languages.mapping.c.languageid ).\
		       filter( Languages.mapping.c.languagename.ilike(word)).order_by(Languages.mapping.c.languagename).all()


#########################################################
## Map object to db
#########################################################

Languages.mapping = Table('languages', metadata, autoload = True, schema='internal')

mapper(Languages, Languages.mapping )
