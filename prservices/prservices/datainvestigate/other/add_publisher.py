# -*- coding: utf-8 -*-
"""add_publisher"""
#-----------------------------------------------------------------------------
# Name:        add_publisher.py
# Purpose:     add a forgotten publisher column for David
#
# Author:      Stamatia Vatsi
#
# Created:     November 2018
# Copyright:  (c) 2018
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
from turbogears import database
import xlrd, xlwt
import logging
import simplejson
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config
import shutil
import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import Outlet, Publisher
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

	OUTLETID_COL = 9

	shutil.copy(os.path.join(sourcedir, "ff.xlsx"), os.path.normpath(os.path.join(sourcedir, "ff2.xlsx")))

	workbook = xlrd.open_workbook(os.path.join(sourcedir, "ff.xlsx"))
	xls_sheet = workbook.sheet_by_name('ff')
	wb = xlwt.Workbook()
	ws = wb.add_sheet('fff')
	
	
	for rnum in range(1, xls_sheet.nrows):
		outletid = int(xls_sheet.cell_value(rnum, OUTLETID_COL))
		outlet = Outlet.query.get(outletid)
		publishername = session.query(Publisher.publishername).filter(Publisher.publisherid == outlet.publisherid).scalar()

		ws.write(rnum, xls_sheet.ncols, publishername)
	
	wb.save(os.path.join(sourcedir, "ff.xlsx"))

if __name__ == '__main__':
	_run()