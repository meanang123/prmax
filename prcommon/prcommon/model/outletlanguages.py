# -*- coding: utf-8 -*-
"""outletlanguages"""
#-----------------------------------------------------------------------------
# Name:        outletlanguages
# Purpose:
# Author:      Chris Hoy
#
# Created:     09/11/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from ttl.model import BaseSql
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon")

class OutletLanguages(BaseSql):
	""" outletlanguages  """

	@classmethod
	def update(cls,  outletid,  languageid1, languageid2, activity):
		""" update the list of languages for an oulets"""

		languages = []
		if languageid1 and  languageid1 != "-1":
			languageid1 = int(languageid1)
			languages.append( languageid1 )

		if languageid2 and  languageid2 != "-1":
			languageid2 = int(languageid2)
			languages.append( languageid2 )

		new_lang = {}
		for languageid in languages:
			new_lang[languageid] =  languageid

		# check for deletes
		existing = {}
		for row in session.query(OutletLanguages).filter(OutletLanguages.outletid == outletid).all():
			existing[row.languageid] = True
			if row.languageid not in new_lang:
				session.delete( row )

		# check for add
		for languageid in languages:
			if languageid not in existing:
				outletlang = OutletLanguages( outletid = outletid, languageid = languageid)
				if languageid1 ==  languageid:
					outletlang.isprefered = 1
				session.add( outletlang )
				session.flush()

		# setup perfered langaues

		# reset too blank
		session.query(OutletLanguages).filter(OutletLanguages.outletid ==  outletid).update({"isprefered": 0})
		# has primary
		if languageid1:
			session.query(OutletLanguages).\
			  filter(OutletLanguages.outletid ==  outletid).\
				filter(OutletLanguages.languageid ==  languageid1).\
			  update({"isprefered": 1})
		# only has secondary promote too primary
		elif  languageid2:
			session.query(OutletLanguages).\
			  filter(OutletLanguages.outletid ==  outletid).\
			  filter(OutletLanguages.languageid ==  languageid2).\
			  update({"isprefered": 2})


# load tables from db
OutletLanguages.mapping = Table('outletlanguages', metadata, autoload=True)

mapper(OutletLanguages, OutletLanguages.mapping)


