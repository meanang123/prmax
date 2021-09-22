# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_contacthistory.py
# Purpose:     
#
# Author:      
#
# Created:     June 2021
# Copyright:  (c) 2021
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
     Employee, Client, User
from turbogears.database import session

OUTLETCOLUMN = 5
TAKENCOLUMN = 15
TAKENBYCOLUMN = 9
CLIENTCOLUMN = 8
CONTACTCOLUM = 4
CONTACTEMAILCOLUMN = 6
SUBJECTCOLUMN = 3
RESPONSECOLUMN = 12
CUSTOMERID = 8257
UDF1COLUMN = 1
UDF2COLUMN = 2
UDF3COLUMN = 13
UDF4COLUMN = 14

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

	workbook = xlrd.open_workbook(os.path.join(sourcedir, "contacthistory1.xlsx"))
	xls_sheet = workbook.sheet_by_name('enquiries')

	for rnum in range(1, xls_sheet.nrows):
	#for rnum in range(1, xls_sheet.nrows):
		session.begin()	
		
 		employeeid = None
		contactid = None
		outletid = None
		outletname = xls_sheet.cell_value(rnum, OUTLETCOLUMN).strip().lower()
		contactname = xls_sheet.cell_value(rnum, CONTACTCOLUM).strip().lower()
		taken = dateutil.parser.parse(xls_sheet.cell_value(rnum, TAKENCOLUMN))
		takenbyname = xls_sheet.cell_value(rnum, TAKENBYCOLUMN).strip().lower()
		subject = xls_sheet.cell_value(rnum, SUBJECTCOLUMN).strip().lower()
		response = xls_sheet.cell_value(rnum, RESPONSECOLUMN).strip()
		udf1description = _get_as_string(xls_sheet.cell_value(rnum, UDF1COLUMN)).strip().lower()
		udf2description = _get_as_string(xls_sheet.cell_value(rnum, UDF2COLUMN)).strip().lower()
		udf3description = _get_as_string(xls_sheet.cell_value(rnum, UDF3COLUMN)).strip().lower()
		udf4description = _get_as_string(xls_sheet.cell_value(rnum, UDF4COLUMN)).strip().lower()
		clientname = xls_sheet.cell_value(rnum, CLIENTCOLUMN).strip().lower()

		outlet = session.query(Outlet).\
	        filter(Outlet.outletname.ilike(outletname)).\
	        filter(Outlet.customerid.in_((-1,CUSTOMERID))).\
	        filter(Outlet.countryid == 1).scalar()	
		if outlet:
			outletid = outlet.outletid
		else:
			print (outletname)
			
		contactsource = contactname.split(' ')
		if contactsource:
			if len(contactsource) >= 2:
				firstname = contactsource[0]
				familyname = contactsource[1] if len(contactsource) > 1 else None
			contacts = session.query(Contact).\
			        filter(Contact.firstname.ilike(firstname)).\
			        filter(Contact.familyname.ilike(familyname)).all()
			if contacts and outletid:
				for contact in contacts:
					employee = session.query(Employee).\
				                filter(Employee.contactid == contact.contactid).\
				                filter(Employee.outletid == outlet.outletid).\
				                filter(Employee.customerid.in_((CUSTOMERID, -1))).scalar()
					if employee:
						employeeid = employee.employeeid
						contactid = contact.contactid
						break
					
							
		client = session.query(Client).\
		        filter(Client.customerid == CUSTOMERID).\
		        filter(Client.clientname.ilike(clientname)).scalar()
		
		takenby = session.query(User).\
		        filter(User.user_name.ilike(takenbyname)).\
		        filter(User.customerid == CUSTOMERID).scalar()
		
		udf1 = session.query(ContactHistoryUserDefine).\
		        filter(ContactHistoryUserDefine.fieldid == 1).\
		        filter(ContactHistoryUserDefine.customerid == CUSTOMERID).\
		        filter(ContactHistoryUserDefine.description.ilike(udf1description)).scalar()
		udf2 = session.query(ContactHistoryUserDefine).\
		        filter(ContactHistoryUserDefine.fieldid == 2).\
		        filter(ContactHistoryUserDefine.customerid == CUSTOMERID).\
		        filter(ContactHistoryUserDefine.description.ilike(udf2description)).scalar()
		udf3 = session.query(ContactHistoryUserDefine).\
		        filter(ContactHistoryUserDefine.fieldid == 3).\
		        filter(ContactHistoryUserDefine.customerid == CUSTOMERID).\
		        filter(ContactHistoryUserDefine.description.ilike(udf3description)).scalar()
		udf4 = session.query(ContactHistoryUserDefine).\
		        filter(ContactHistoryUserDefine.fieldid == 4).\
		        filter(ContactHistoryUserDefine.customerid == CUSTOMERID).\
		        filter(ContactHistoryUserDefine.description.ilike(udf4description)).scalar()
		
		contacthistory = ContactHistory(
		    outletid = outletid,
		    contactid = contactid,
		    employeeid = employeeid,
		    taken = taken,
		    customerid = CUSTOMERID,
		    ref_customerid = CUSTOMERID,
		    subject = subject,
		    crm_response = response,
		    crm_subject = subject,
		    clientid = client.clientid if client else None,
		    taken_by = takenby.user_id if takenby else None,
		    chud1id = udf1.contacthistoryuserdefinid if udf1 else None,
		    chud2id = udf2.contacthistoryuserdefinid if udf2 else None,
		    chud3id = udf3.contacthistoryuserdefinid if udf3 else None,
		    chud4id = udf4.contacthistoryuserdefinid if udf4 else None
		)
		session.add(contacthistory)
		session.flush()

		if response != '':
			response = ContactHistoryResponses(
				contacthistorystatusid = contacthistory.contacthistorystatusid,
				response = xls_sheet.cell_value(rnum, RESPONSECOLUMN).strip(),
				taken = contacthistory.taken,
				contacthistoryid = contacthistory.contacthistoryid,
				contacthistorytypeid = contacthistory.contacthistorytypeid
			)
			session.add(response)
			session.flush()
		session.commit()

def _get_as_string(value):
	if type(value) is float:
		value = str(int(value)).strip()
	elif type(value) is int:
		value = str(value).strip()    
	else:
		value = value.encode('utf8').strip()

	return value
	
if __name__ == '__main__':
	_run()
