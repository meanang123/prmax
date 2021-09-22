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
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config
import dateutil

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import ContactHistoryUserDefine, Contact, ContactHistory, Outlet, ContactHistoryTypes, ContactHistoryResponses, \
     Employee, Issue, ContactHistoryIssues, ContactHistoryStatus
from turbogears.database import session

OUTLETCOLUMN = 0
TAKENCOLUMN = 8
ISSUECOLUMN = 2
CHTYPECOLUMN = 3
STATUSCOLUMN = 4
SUBJECTCOLUMN = 5
DETAILSCOLUMN = 6
RESPONSECOLUMN = 7
CUSTOMERID = 6883
#CUSTOMERID = 82

def _run():
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir=", "check", "remove_old="])
	sourcedir = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params

	if sourcedir == None:
		print ("Missing Source Directory")
		return

	workbook = xlrd.open_workbook(os.path.join(sourcedir, "contacthistory.xlsx"))
	xls_sheet = workbook.sheet_by_name('enquiries')

	for rnum in range(1, xls_sheet.nrows):
	#for rnum in range(1, xls_sheet.nrows):
		session.begin()	
		
 		employeeid = None
		contactid = None
		outletid = None
		outletname = xls_sheet.cell_value(rnum, OUTLETCOLUMN).strip().lower()
		taken = dateutil.parser.parse(xls_sheet.cell_value(rnum, TAKENCOLUMN))
		issue = xls_sheet.cell_value(rnum, ISSUECOLUMN).strip().lower()
		type = xls_sheet.cell_value(rnum, CHTYPECOLUMN).strip().lower()
		status = xls_sheet.cell_value(rnum, STATUSCOLUMN).strip().lower()
		subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN).strip().lower()
		details = xls_sheet.cell_value(rnum, DETAILSCOLUMN).strip().lower()
		response = xls_sheet.cell_value(rnum, RESPONSECOLUMN).strip()

		outlet = session.query(Outlet).\
	        filter(Outlet.outletname.ilike(outletname)).\
	        filter(Outlet.customerid.in_((-1,CUSTOMERID))).\
	        filter(Outlet.countryid == 1).scalar()	
		if outlet:
			outletid = outlet.outletid
		else:
			print (outletname)
									
		chissue = session.query(Issue).\
			filter(Issue.customerid == CUSTOMERID).\
		    filter(Issue.name.ilike(issue)).scalar()
		if not chissue:
			print ('Issue: %s' %issue)
				
		chtype = session.query(ContactHistoryTypes).\
		    filter(ContactHistoryTypes.contacthistorytypedescription.ilike(type)).scalar()
		chstatus = session.query(ContactHistoryStatus).\
			filter(ContactHistoryStatus.contacthistorystatusdescription.ilike('%s%%' %status)).scalar()

		contacthistory = ContactHistory(
		    outletid = outletid,
		    contactid = contactid,
		    employeeid = employeeid,
		    taken = taken,
		    details = xls_sheet.cell_value(rnum, DETAILSCOLUMN),
		    customerid = CUSTOMERID,
		    ref_customerid = CUSTOMERID,
		    subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN),
		    contacthistorytypeid = chtype.contacthistorytypeid if chtype else None,
		    crm_response = response,
		    crm_subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN)
		)
		session.add(contacthistory)
		session.flush()

		if chissue:
			ch_issue = ContactHistoryIssues(
				contacthistoryid = contacthistory.contacthistoryid,
				issueid = chissue.issueid,
				isprimary = True
			)
			session.add(ch_issue)
			session.flush()
						

		if response != '':
			response = ContactHistoryResponses(
				contacthistorystatusid = chstatus.contacthistorystatusid,
				response = xls_sheet.cell_value(rnum, RESPONSECOLUMN).strip(),
				taken = contacthistory.taken,
				contacthistoryid = contacthistory.contacthistoryid,
				contacthistorytypeid = contacthistory.contacthistorytypeid
			)
			session.add(response)
			session.flush()
		session.commit()

	
if __name__ == '__main__':
	_run()
