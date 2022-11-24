# -*- coding: utf-8 -*-
"""remove unused publishers and update the rest"""
#-----------------------------------------------------------------------------
# Name:        fixpublishers.py
# Purpose:     remove unused publishers tidy up the rest
#
# Author:      Stamatia Vatsi
#
# Created:     10/09/2019
# Copyright:  (c) 2019
#
#-----------------------------------------------------------------------------

import logging
import os
import sys
import getopt
import xlrd
from sqlalchemy import Table, Column, Integer, not_
from sqlalchemy.sql import text, func, except_, union, union_all, select
from turbogears import database
from turbogears.database import session
from ttl.tg.config import read_config
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.employee import Employee
from prcommon.model import Publisher, Outlet
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

def _run():
	""" run the application """

	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir="])
	sourcedir = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params

	if sourcedir is None:
		print ("Missing Source Directory")
		return

	#delete unused publishers
	_delete_unsused_publishers()
	
	#update and tidy up publishers
	_update_publishers(sourcedir)

def _delete_unsused_publishers():

	notlinkedpublishers = [row[0] for row in session.execute(except_(session.query(Publisher.publisherid),
	                                                                 session.query(Outlet.publisherid).distinct())).fetchall()]

	for notlinkedpublisherid in notlinkedpublishers:
		session.begin()
		session.execute(text("DELETE FROM internal.publishers WHERE publisherid = :publisherid"), {'publisherid': notlinkedpublisherid}, Publisher)
		print ('Deleted Publisherid: %s' %notlinkedpublisherid)
		session.commit()


def _update_publishers(sourcedir):
	filename = "publishers.xlsx"
	workbook = xlrd.open_workbook(os.path.join(sourcedir, filename))

	#add countryid
	xls_sheet = workbook.sheet_by_index(0)
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		publisherid = int(xls_sheet.cell_value(rnum_read, 0))
		countryid = int(xls_sheet.cell_value(rnum_read, 1))
		session.execute(text("UPDATE internal.publishers SET countryid = :countryid where publisherid = :publisherid"), \
	                    {'countryid': countryid, 'publisherid': publisherid}, Publisher)
		session.commit()

	#remove countryid
	xls_sheet1 = workbook.sheet_by_index(1)
	for rnum_read in xrange(1, xls_sheet1.nrows):
		session.begin()
		publisherid = int(xls_sheet.cell_value(rnum_read, 0))
		session.execute(text("UPDATE internal.publishers SET countryid = null where publisherid = :publisherid"), {'publisherid': publisherid}, Publisher)
		session.commit()
	

if __name__ == '__main__':
	_run()	