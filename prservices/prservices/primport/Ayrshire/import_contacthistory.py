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

from prcommon.model import ContactHistoryUserDefine, Contact, ContactHistory, Outlet, ContactHistoryTypes, ContactHistoryResponses, Employee
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
	xls_sheet = workbook.sheet_by_name('enquires')

	for rnum in range(2, xls_sheet.nrows):
		session.begin()	
		
		employeeid = None
		contactid = None
		outletid = None
		taken = dateutil.parser.parse(xls_sheet.cell_value(rnum, TAKENCOLUMN))
		outletname = xls_sheet.cell_value(rnum, OUTLETCOLUMN).strip().lower()
		contacthistorytype = xls_sheet.cell_value(rnum, CONTACTHISTORYTYPECOLUMN).strip().lower()
		chud1desc = xls_sheet.cell_value(rnum, CHUD1IDCOLUMN).strip().lower()
		response = xls_sheet.cell_value(rnum, RESPONSECOLUMN).strip()

		if outletname == 'the herald':
			outletid = 93177
		else:
			outlet = session.query(Outlet).\
				filter(Outlet.outletname.ilike(outletname)).\
				filter(Outlet.customerid == -1).\
				filter(Outlet.countryid == 1).scalar()	
			if outlet:
				outletid = outlet.outletid
				contactsource = xls_sheet.cell_value(rnum, CONTACTCOLUMN).split(' ')
				firstname = contactsource[0].lower()
				familyname = contactsource[1].lower() if len(contactsource)>1 else ''
				sourcetypes = [1,2]
				contacts = session.query(Contact).\
					filter(Contact.familyname.ilike(familyname)).\
					filter(Contact.firstname.ilike(firstname)).\
					filter(Contact.customerid == -1).\
					filter(Contact.sourcetypeid.in_(sourcetypes)).all()
				for contact in contacts:
					outlet_employee = session.query(Employee).\
					filter(Employee.outletid == outletid).\
					filter(Employee.contactid == contact.contactid).scalar()
					if outlet_employee:
						employeeid = outlet_employee.employeeid
						contactid = contact.contactid
				
		chtype = session.query(ContactHistoryTypes).\
		    filter(ContactHistoryTypes.contacthistorytypedescription.ilike(contacthistorytype)).scalar()
		chud1 = session.query(ContactHistoryUserDefine).\
		    filter(ContactHistoryUserDefine.description.ilike(chud1desc)).\
			filter(ContactHistoryUserDefine.fieldid == 1).\
		    filter(ContactHistoryUserDefine.customerid == CUSTOMERID).scalar()
		contacthistory = ContactHistory(
		    outletid = outletid,
		    contactid = contactid,
		    employeeid = employeeid,
		    taken = taken,
		    details = xls_sheet.cell_value(rnum, DETAILSCOLUMN),
		    customerid = CUSTOMERID,
		    ref_customerid = CUSTOMERID,
		    subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN),
		    outcome = xls_sheet.cell_value(rnum, OUTCOMECOLUMN),
		    contacthistorytypeid = chtype.contacthistorytypeid if chtype else None,
		    chud1id = chud1.contacthistoryuserdefinid if chud1.contacthistoryuserdefinid else None,
		    crm_response = response,
		    crm_subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN)
		)
		session.add(contacthistory)
		session.flush()

		if response != '':
			response = ContactHistoryResponses(
				contacthistorystatusid = 1, #completed
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
