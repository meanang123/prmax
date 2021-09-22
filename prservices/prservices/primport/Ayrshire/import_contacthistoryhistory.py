# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_contacthistory.py
# Purpose:     
#
# Author:      
#
# Created:     August 2017
# Copyright:  (c) 2017
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
import datetime
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import ContactHistoryUserDefine, Contact, ContactHistory, ContactHistoryHistory, Outlet, ContactHistoryTypes, ContactHistoryResponses, Employee
from turbogears.database import session

OUTLETCOLUMN = 6
CHUD1IDCOLUMN = 2
TAKENCOLUMN = 19
CONTACTCOLUMN = 7
DETAILSCOLUMN = 8
SUBJECTCOLUMN = 9
CONTACTHISTORYTYPECOLUMN = 12
OUTCOMECOLUMN = 13
RESPONSECOLUMN = 11
CUSTOMERID = 5730
SENDBYCOLUMN = 1

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
	xls_sheet = workbook.sheet_by_name('enquires')

	for rnum in range(2, xls_sheet.nrows):
		session.begin()	
		
		response = xls_sheet.cell_value(rnum, RESPONSECOLUMN).strip()
		taken = dateutil.parser.parse(xls_sheet.cell_value(rnum, TAKENCOLUMN))
		details = xls_sheet.cell_value(rnum, DETAILSCOLUMN).strip()
		contacthistorytype = xls_sheet.cell_value(rnum, CONTACTHISTORYTYPECOLUMN).strip()
		subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN).strip()
		
		if response != '':
			res = session.query(ContactHistoryResponses).\
			    filter(ContactHistoryResponses.response.ilike(response)).\
			    filter(ContactHistoryResponses.taken == taken).all()
			if res and len(res) > 1:
				for r in res:
					chtype = session.query(ContactHistoryTypes).\
						filter(ContactHistoryTypes.contacthistorytypedescription.ilike(contacthistorytype)).scalar()					

					ch = session.query(ContactHistory).\
					    filter(ContactHistory.details.ilike(details)).\
					    filter(ContactHistory.crm_response.ilike(response)).\
					    filter(ContactHistory.contacthistorytypeid == chtype.contacthistorytypeid).\
					    filter(ContactHistory.taken == taken).\
					    filter(ContactHistory.crm_subject.ilike(subject)).scalar()
					
					if ch.contacthistoryid == r.contacthistoryid:
						r.send_by = xls_sheet.cell_value(rnum, SENDBYCOLUMN).strip()
						r.toemailaddress = ''

						chh = ContactHistoryHistory(
							contacthistoryresponseid=r.contacthistoryresponseid,
						contacthistoryid=r.contacthistoryid,
						to_notes=r.response,
						from_issues=xls_sheet.cell_value(rnum, SENDBYCOLUMN).strip(),
						created=datetime.datetime.now() - datetime.timedelta(days=90),
						contacthistoryhistorytypeid=2)
						
						session.add(chh)
						session.flush()						
			else:				
				res[0].send_by = xls_sheet.cell_value(rnum, SENDBYCOLUMN).strip()
				res[0].toemailaddress = ''
				
				chh = ContactHistoryHistory(
				    contacthistoryresponseid=res[0].contacthistoryresponseid,
				contacthistoryid=res[0].contacthistoryid,
				to_notes=res[0].response,
				from_issues=xls_sheet.cell_value(rnum, SENDBYCOLUMN).strip(),
				created=datetime.datetime.now() - datetime.timedelta(days=90),
				contacthistoryhistorytypeid=2)
				
				session.add(chh)
				session.flush()
	
		session.commit()
	
if __name__ == '__main__':
	_run()
