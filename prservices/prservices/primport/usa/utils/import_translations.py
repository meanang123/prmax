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
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "translations.xlsx"))
	xls_sheet = workbook.sheet_by_name('mediatype')
	for rnum in xrange(1, xls_sheet.nrows):
		sourcetext = xls_sheet.cell_value(rnum, 0).encode('utf-8')
		des_text = xls_sheet.cell_value(rnum, 1).strip()
		english = xls_sheet.cell_value(rnum, 1).strip()
		translation = int(xls_sheet.cell_value(rnum, 2))

		inserts.append({"fieldname": "mediatype",
		                "sourcetext": sourcetext,
		                "sourcetypeid" : Constants.Source_Type_Usa,
		                "translation" : translation,
		                "english" : english,
		                })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()

	inserts_frequencies = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "translations.xlsx"))
	xls_sheet = workbook.sheet_by_name('frequency')
	for rnum in xrange(1, xls_sheet.nrows):
		sourcetext = xls_sheet.cell_value(rnum, 0).encode('utf-8')
		des_text = xls_sheet.cell_value(rnum, 1).strip()
		english = xls_sheet.cell_value(rnum, 1).strip()
		translation = int(xls_sheet.cell_value(rnum, 2))

		inserts_frequencies.append({"fieldname": "frequency",
	                    "sourcetext": sourcetext,
	                    "sourcetypeid" : Constants.Source_Type_Usa,
	                    "translation" : translation,
	                    "english" : english,
	                    })

	if inserts_frequencies:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_frequencies)
		session.commit()



if __name__ == '__main__':
	_run()
