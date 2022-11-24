# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        update_existing_outlets.py
# Purpose:     Update existing outlets for Stamm
#
# Author:
#
# Created:     Jan 2018
# Copyright:  (c) 2018
#
#-----------------------------------------------------------------------------
import os
import sys
import getopt
import logging
import xlrd
from turbogears import database
from turbogears.database import session
from sqlalchemy.sql import text
from ttl.tg.config import read_config
import simplejson

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlet import Outlet, OutletInterests
from prcommon.model.communications import Communication, Address
from prcommon.model.employee import Employee
from prcommon.model.research import DataSourceTranslations
from prcommon.model import PRmaxOutletTypes, PRMaxRoles, Interests
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

MEDIAID_COLUMN = 0
MEDIACHANNEL_COLUMN = 5
KEYWORD_COLUMN = 6

def _run():
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir="])
	sourcedir = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params

	if sourcedir is None:
		print ("Missing Source Directory")
		return

	filename = "stamm_no_classification Dec 2017.xlsx"
	workbook = xlrd.open_workbook(os.path.join(sourcedir, filename))
	xls_sheet_coded = workbook.sheet_by_name('Coded')
	updated = 0

	for rnum_read in xrange(1, xls_sheet_coded.nrows):

		session.begin()
		mediaid = int(xls_sheet_coded.cell_value(rnum_read, MEDIAID_COLUMN))
		prmax_outlettypeid = int(xls_sheet_coded.cell_value(rnum_read, MEDIACHANNEL_COLUMN))
		interestnames = str(xls_sheet_coded.cell_value(rnum_read, KEYWORD_COLUMN)).split(':')

		publication = session.query(Outlet).\
		            filter(Outlet.sourcetypeid == 5).\
		            filter(Outlet.sourcekey == mediaid).scalar()

		if publication:
				session.execute(text("UPDATE outlets SET prmax_outlettypeid = :prmax_outlettypeid where outletid = :outletid"), \
			                    {'prmax_outlettypeid': prmax_outlettypeid, 'outletid': publication.outletid}, Outlet)
				updated += 1

				interests = []
				for interestname in interestnames:
					interestname = interestname.strip()
					interestid = session.query(Interests.interestid).\
						filter(Interests.interestname.ilike(interestname)).\
						filter(Interests.customerid == -1).scalar()
					interests.append(interestid)

				interests_done = {}
				interests_exist = session.query(OutletInterests).\
			        filter(OutletInterests.outletid == publication.outletid).all()
				if interests_exist:
					for interest_exist in interests_exist:
						interests_done[interest_exist.interestid] = True

				for interestid in interests:
					if interestid and interestid not in interests_done:
						interests_done[interestid] = True
						session.add(OutletInterests(
					        outletid=publication.outletid,
					        interestid=interestid))

		session.commit()

	xls_sheet_uncoded = workbook.sheet_by_name('Uncoded')
	for rnum_read in xrange(1, xls_sheet_uncoded.nrows):

		session.begin()
		mediaid = int(xls_sheet_uncoded.cell_value(rnum_read, MEDIAID_COLUMN))
		prmax_outlettypeid = int(xls_sheet_uncoded.cell_value(rnum_read, MEDIACHANNEL_COLUMN))
		interestnames = str(xls_sheet_uncoded.cell_value(rnum_read, KEYWORD_COLUMN)).split(':')

		publication = session.query(Outlet).\
		            filter(Outlet.sourcetypeid == 5).\
		            filter(Outlet.sourcekey == mediaid).scalar()

		if publication:
				session.execute(text("UPDATE outlets SET prmax_outlettypeid = :prmax_outlettypeid where outletid = :outletid"), \
			                    {'prmax_outlettypeid': prmax_outlettypeid, 'outletid': publication.outletid}, Outlet)
				updated += 1

				interests = []
				for interestname in interestnames:
					interestname = interestname.strip()
					interestid = session.query(Interests.interestid).\
						filter(Interests.interestname.ilike(interestname)).\
						filter(Interests.customerid == -1).scalar()
					interests.append(interestid)

				interests_done = {}
				interests_exist = session.query(OutletInterests).\
			        filter(OutletInterests.outletid == publication.outletid).all()
				if interests_exist:
					for interest_exist in interests_exist:
						interests_done[interest_exist.interestid] = True

				for interestid in interests:
					if interestid and interestid not in interests_done:
						interests_done[interestid] = True
						session.add(OutletInterests(
					        outletid=publication.outletid,
					        interestid=interestid))

		session.commit()

	xls_sheet_new = workbook.sheet_by_name('New')
	for rnum_read in xrange(1, xls_sheet_new.nrows):

		session.begin()
		mediaid = int(xls_sheet_new.cell_value(rnum_read, MEDIAID_COLUMN))
		prmax_outlettypeid = int(xls_sheet_new.cell_value(rnum_read, MEDIACHANNEL_COLUMN))
		interestnames = str(xls_sheet_new.cell_value(rnum_read, KEYWORD_COLUMN)).split(':')

		publication = session.query(Outlet).\
	                filter(Outlet.sourcetypeid == 5).\
	                filter(Outlet.sourcekey == mediaid).scalar()

		if publication:
				session.execute(text("UPDATE outlets SET prmax_outlettypeid = :prmax_outlettypeid where outletid = :outletid"), \
			                    {'prmax_outlettypeid': prmax_outlettypeid, 'outletid': publication.outletid}, Outlet)
				updated += 1

				interests = []
				for interestname in interestnames:
					interestname = interestname.strip()
					interestid = session.query(Interests.interestid).\
						filter(Interests.interestname.ilike(interestname)).\
						filter(Interests.customerid == -1).scalar()
					interests.append(interestid)

				interests_done = {}
				interests_exist = session.query(OutletInterests).\
			        filter(OutletInterests.outletid == publication.outletid).all()
				if interests_exist:
					for interest_exist in interests_exist:
						interests_done[interest_exist.interestid] = True

				for interestid in interests:
					if interestid and interestid not in interests_done:
						interests_done[interestid] = True
						session.add(OutletInterests(
					        outletid=publication.outletid,
					        interestid=interestid))

		session.commit()

	print ('updated - %s' %updated)

if __name__ == '__main__':
	_run()
