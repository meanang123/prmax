# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_translations.py
# Purpose:     Import USA Translations
#
# Author:      Chris Hoy
#
# Created:     March 2016
# Copyright:  (c) 2016
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
from turbogears import database
import xlrd
import logging
import simplejson
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import DataSourceTranslations, PRmaxOutletTypes, PRMaxRoles, Interests
from turbogears.database import session


def _run():
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir=", "check", "remove_old="])
	sourcedir = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params

	if sourcedir == None:
		print "Missing Source Directory"
		return

	inserts = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "mediachannels.xlsx"))
	xls_sheet = workbook.sheet_by_name('mediatype')
	for rnum in xrange(1, xls_sheet.nrows):
		sourcetext = xls_sheet.cell_value(rnum, 0).encode('utf-8')
		des_text = xls_sheet.cell_value(rnum, 1).strip()
		english = xls_sheet.cell_value(rnum, 1).strip()
		translation = int(xls_sheet.cell_value(rnum, 2))

		inserts.append({"fieldname": "mediatype",
		                "sourcetext": sourcetext,
		                "sourcetypeid" : Constants.Source_Type_SouthAmerica,
		                "translation" : translation,
		                "english" : english,
		                })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()

	inserts_keywords = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "keywords.xlsx"))
	xls_sheet = workbook.sheet_by_name('keywords')
	for rnum in xrange(1, xls_sheet.nrows):
		
		
		sourcetext = xls_sheet.cell_value(rnum, 0).lower().strip()
		des_text = xls_sheet.cell_value(rnum, 1).lower().strip()		
		keywords = []
		english_matched = xls_sheet.cell_value(rnum, 1).lower().strip()

		for interestname in english_matched.strip().split(':'):
			interestname = interestname.strip()
			interestid = session.query(Interests.interestid).\
		        filter(Interests.interestname.ilike(interestname)).\
		        filter(Interests.customerid == -1).scalar()			
			if interestid:
				keywords.append(interestid)
			else:
				interests = session.query(Interests).filter(Interests.interestname.ilike(interestname)).all()
				if interests:
					interests[0].customerid = -1
					keywords.append(interests[0].interestid)
				else:
					print interestname
					keywords.append(2474)
		keywords = simplejson.dumps(keywords)		

		tmp = session.query(DataSourceTranslations).\
	        filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_SouthAmerica).\
	        filter(DataSourceTranslations.fieldname == "interests").\
	        filter(DataSourceTranslations.sourcetext == sourcetext).scalar()
		if tmp:
			if english_matched != tmp.english or \
		       keywords != tmp.extended_translation:
				session.begin()
				tmp.english = english
				tmp.extended_translation = keywords
				session.commit()
		else:
			inserts_keywords.append({"fieldname": "interests",
		                    "sourcetext": sourcetext,
		                    "sourcetypeid" : Constants.Source_Type_SouthAmerica,
		                    "translation" : sourcetext,
		                    "english" : english_matched,
		                    "extended_translation" : keywords
		                    })

	if inserts_keywords:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_keywords)
		session.commit()

if __name__ == '__main__':
	_run()
