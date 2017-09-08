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
import xlwt
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

	workbook = xlrd.open_workbook(os.path.join(sourcedir, "1.xlsx"))
	xls_sheet = workbook.sheet_by_name('1')

	filename2 =  "111.xlsx" 
	wb = xlwt.Workbook()
	ws = wb.add_sheet('111')

	for rnum in range(0, xls_sheet.nrows):
		for cnum in range(0, 6):
			x = xls_sheet.cell_value(rnum, cnum)
			if type(x) is float:
				x = str(int(x)).strip()
			elif type(x) is int:
				x = str(x).strip()    
			else:
				x = x.strip()			
			ws.write(rnum, cnum, x)

	wb.save(os.path.join(sourcedir, filename2))


if __name__ == '__main__':
	_run()
