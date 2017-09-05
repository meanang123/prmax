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
import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import Customer
from prcommon.model import Outlet
from prcommon.model import Interests
from prcommon.model.contact import Contact
from prcommon.model.communications import Communication
from prcommon.model.employee import Employee, EmployeeInterests
from turbogears.database import session

CONTACTCOLUMN = 1
JOBTITLECOLUMN = 2
PHONECOLUMN = 3
MOBILECOLUMN = 5
EMAILCOLUMN = 7
INTERESTCOLUMN = 11
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

	xls_sheet_contacts = workbook.sheet_by_name('contacts')

	session.begin()	
	for rnum in range(2, xls_sheet_contacts.nrows):

		contactid = None
		firstname = familyname = prefix = ''
		contactsource = xls_sheet_contacts.cell_value(rnum, CONTACTCOLUMN).split(' ')
		if len(contactsource) < 2:
			familyname = contactsource[0]
		elif len(contactsource) == 2:
			firstname = contactsource[0]
			familyname = contactsource[1] 
		elif len(contactsource) == 3:
			prefix = contactsource[0]
			firstname = contactsource[1]
			familyname = contactsource[2]
			
			
		sourcetypes = [1,2]
		contact = session.query(Contact).\
			filter(Contact.familyname.ilike(familyname)).\
			filter(Contact.firstname.ilike(firstname)).\
			filter(Contact.customerid == -1).\
			filter(Contact.sourcetypeid.in_(sourcetypes)).first()
#		if not contact:
			# add primary contact
		p_contact = Contact (prefix = prefix,
	                         firstname = firstname,
	                         familyname = familyname,
	                         sourcetypeid = Constants.Research_Source_Private)
		session.add(p_contact)
		# add outlet
		com = Communication (tel = xls_sheet_contacts.cell_value(rnum, PHONECOLUMN).strip(),
	                         email = xls_sheet_contacts.cell_value(rnum, EMAILCOLUMN).strip(),
	                         mobile = xls_sheet_contacts.cell_value(rnum, MOBILECOLUMN).strip())
		session.add(com)
		session.flush()
		out = Outlet(outletname=p_contact.getName(),
	                 sortname="",
	                 communicationid = com.communicationid,
	                 customerid = CUSTOMERID,
	                 outletsearchtypeid=Constants.Search_Type_Freelance,
	                 outlettypeid = Constants.Outlet_Type_Freelance,
	                 statusid = Outlet.Live,
	                 sourcetypeid = Constants.Research_Source_Private
	                 )
		session.add(out)
		session.flush()
		outletid = out.outletid
		session.flush()
		# add primary contact
		# deliverypreferenceid, profile
		empl = Employee (
	        outletid = out.outletid ,
	        contactid = p_contact.contactid,
	        isprimary = 1,
	        job_title = xls_sheet_contacts.cell_value(rnum, JOBTITLECOLUMN).strip(),
	        sourcetypeid = Constants.Research_Source_Private,
	        customerid = CUSTOMERID)
		session.add(empl)
		session.flush()
		out.primaryemployeeid = empl.employeeid

		interestname = xls_sheet_contacts.cell_value(rnum, INTERESTCOLUMN).strip()
		keyword= session.query(Interests).filter(Interests.interestname.ilike(interestname)).scalar()
		interest = EmployeeInterests(employeeid = empl.employeeid,
	                                 interestid = keyword.interestid,
	                                 customerid = CUSTOMERID)
		session.add(interest)
		session.flush()

	session.commit()


if __name__ == '__main__':
	_run()
