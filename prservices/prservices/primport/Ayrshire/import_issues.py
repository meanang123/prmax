# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_contacthistory.py
# Purpose:     
#
# Author:      
#
# Created:     August 2017
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
from sqlalchemy.sql import text
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config
import datetime, dateutil

import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import ContactHistoryUserDefine, Customer, Issue, Contact
from turbogears.database import session

CREATEDCOLUMN = 11
NAMECOLUMN = 3
ISSUESTATUSCOLUMN = 6
CUSTOMERID = 5636 #live: customerid=5730
APPROVEDBYIDCOLUMN = 1


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

	workbook = xlrd.open_workbook(os.path.join(sourcedir, "contacthistory.xlsx"))
	xls_sheet = workbook.sheet_by_name('issues')
	
	session.begin()	
	for rnum in range(2, xls_sheet.nrows):
		created = dateutil.parser.parse(xls_sheet.cell_value(rnum, CREATEDCOLUMN))
	
		contactid = None
		contactsource = xls_sheet.cell_value(rnum, APPROVEDBYIDCOLUMN).split(' ')
		firstname = contactsource[0].lower()
		familyname = contactsource[1].lower() if len(contactsource)>1 else ''
		sourcetypes = [1,2]
		contact = session.query(Contact).\
			filter(Contact.familyname.ilike(familyname)).\
			filter(Contact.firstname.ilike(firstname)).\
			filter(Contact.customerid == -1).\
			filter(Contact.sourcetypeid.in_(sourcetypes)).first()
		if contact:
			contactid = contact.contactid		
				
		issue =  Issue(
	        name = xls_sheet.cell_value(rnum, NAMECOLUMN),
	        created = created.date(),
		    issuestatusid = 1 if xls_sheet.cell_value(rnum, ISSUESTATUSCOLUMN) == -1 else 2,
		    approvedbyid = contactid if contactid else None,
	        customerid = CUSTOMERID,)
		session.add(issue)
		session.flush()
	
	session.commit()
	
	


if __name__ == '__main__':
	_run()
