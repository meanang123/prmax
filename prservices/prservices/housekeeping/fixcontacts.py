# -*- coding: utf-8 -*-
"""update contacts with countryid"""
#-----------------------------------------------------------------------------
# Name:        fixcontacts.py
# Purpose:     update contacts with countryid
#
# Author:      Stamatia Vatsi
#
# Created:     12/09/2019
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
from prcommon.model import Employee, Contact, Outlet, Countries
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")
GERMAN = 113
def _run():
	""" run the application """

	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir="])
	sourcedir = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params

	if sourcedir is None:
		print "Missing Source Directory"
		return

	filename = "contacts.xlsx"
	workbook = xlrd.open_workbook(os.path.join(sourcedir, filename))
	xls_sheet1 = workbook.sheet_by_name('to_duplicate')
	xls_sheet2 = workbook.sheet_by_name('to_duplicate2')
	xls_sheet3 = workbook.sheet_by_name('to_duplicate3')
	
	_update_stamm_contacts(workbook)
	_update_distinct_contacts()
	_match_customerid_for_private()
	_duplicate_contacts(workbook, xls_sheet1)
	_duplicate_contacts2(workbook, xls_sheet2)
	_update_france_sourcetype(workbook)
	_duplicate_contacts3(workbook, xls_sheet3)
	_update_sourcetype_freelancers(workbook)
	#_update_contacts()
	#_test()
		
def _update_sourcetype_freelancers(workbook):
	xls_sheet = workbook.sheet_by_name('update_sourcetypes1')
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		contactid = int(xls_sheet.cell_value(rnum_read, 0))
		contact = session.query(Contact).filter(Contact.contactid == contactid).scalar()
		employees = session.query(Employee).filter(Employee.contactid == contactid).all()
		if len(employees) == 1:
			session.execute(text("UPDATE employees SET sourcetypeid = 2 where employeeid = :employeeid"),{'employeeid': employees[0].employeeid}, Employee)
			if contact.countryid == None:
				contact.countryid = employees[0].countryid
				session.flush()
		else:
			for employee in employees:
				if employee.sourcetypeid == None and employee.countryid in (1,2,3):
					session.execute(text("UPDATE employees SET sourcetypeid = 2 where employeeid = :employeeid"),{'employeeid': employee.employeeid}, Employee)
	
		session.commit()			
			
	
def _duplicate_contacts2(workbook, xls_sheet):

	#xls_sheet = workbook.sheet_by_name('to_duplicate')
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		contactid = int(xls_sheet.cell_value(rnum_read, 0))
		contact = session.query(Contact).filter(Contact.contactid == contactid).scalar()
		employees = session.query(Employee).filter(Employee.contactid == contactid).all()
		
		for employee in employees:
			if employee.sourcetypeid == None:
				employee.sourcetypeid = contact.sourcetypeid
				session.commit()
				session.begin()
			elif contact.sourcetypeid != employee.sourcetypeid:
				already_added_contact = session.query(Contact).\
				    filter(Contact.familyname.ilike(contact.familyname)).\
					filter(Contact.firstname.ilike(contact.firstname)).\
				    filter(Contact.customerid == contact.customerid).\
				    filter(Contact.sourcetypeid == employee.sourcetypeid).\
				    filter(Contact.countryid == contact.countryid).scalar()
				if already_added_contact:
					employee.contactid = already_added_contact.contactid
					session.flush()
					session.commit()
					session.begin()
				else:
					new_contact = Contact(familyname=contact.familyname,
						                  firstname=contact.firstname,
						                  prefix=contact.prefix,
						                  suffix=contact.suffix,
						                  customerid=contact.customerid,
						                  sourcetypeid=employee.sourcetypeid,
					                      sourcekey=contact.sourcekey,
						                  countryid=contact.countryid)
					session.add(new_contact)
					session.flush()
					employee.contactid = new_contact.contactid
					session.commit()
					session.begin()
		session.commit()
	print 'End _duplicate_contacts2'


def _duplicate_contacts3(workbook, xls_sheet):

	#xls_sheet = workbook.sheet_by_name('to_duplicate')
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		contactid = int(xls_sheet.cell_value(rnum_read, 0))
		contact = session.query(Contact).filter(Contact.contactid == contactid).scalar()
		employees = session.query(Employee).filter(Employee.contactid == contactid).all()
		
		for employee in employees:
			if employee.sourcetypeid != contact.sourcetypeid:
				add_contact = session.query(Contact).\
				    filter(Contact.familyname.ilike(contact.familyname)).\
					filter(Contact.firstname.ilike(contact.firstname)).\
				    filter(Contact.customerid == contact.customerid).\
				    filter(Contact.sourcetypeid == employee.sourcetypeid).\
				    filter(Contact.countryid == contact.countryid).scalar()
				if add_contact:
					employee.contactid = already_added_contact.contactid
					session.flush()
					session.commit()
					session.begin()
				else:
					new_contact = Contact(familyname=contact.familyname,
						                  firstname=contact.firstname,
						                  prefix=contact.prefix,
						                  suffix=contact.suffix,
						                  customerid=contact.customerid,
						                  sourcetypeid=employee.sourcetypeid,
					                      sourcekey=contact.sourcekey,
						                  countryid=contact.countryid)
					session.add(new_contact)
					session.flush()
					employee.contactid = new_contact.contactid
					session.commit()
					session.begin()
		session.commit()
	print 'End _duplicate_contacts3'
	
def _update_france_sourcetype(workbook):
	
	xls_sheet = workbook.sheet_by_name('fix_france_sourcetype')
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		employeeid = int(xls_sheet.cell_value(rnum_read, 0))
		sourcetypeid = 2
		session.execute(text("UPDATE employees SET sourcetypeid = :sourcetypeid where employeeid = :employeeid"), \
	                    {'employeeid': employeeid, 'sourcetypeid': sourcetypeid}, Employee)
		session.commit()
	print 'End _update_france_sourcetype'
	
	
def _test():

	a = session.query(Contact).filter(Contact.countryid == None).all()
	x = session.query(Contact).filter(Contact.countryid == None).filter(Contact.sourcetypeid != 3).filter(Contact.customerid == -1).all()
	print 'hello'
	
	
	
	
def _match_customerid_for_private():
	
	private_contacts = session.query(Contact).\
	    filter(Contact.sourcetypeid == 3).\
	    filter(Contact.customerid == -1).all()
	nbr = 0
	session.begin()
	for pc in private_contacts:
		employee = session.query(Employee).\
		    filter(Employee.contactid == pc.contactid).first()
		if employee:
			pc.customerid = employee.customerid
			nbr += 1
		if nbr % 50 == 0:
			session.commit()
			print '%s contacts updated' %(nbr)
			session.begin()		
	session.commit()		
	print 'End _match_customerid_for_private'
	
	
def _update_distinct_contacts():
	
	session.begin()
	
	contacts = session.execute(text("select contactid, count(employeeid), count(distinct(countryid)) from employees where contactid is not null and contactid not in (282748,288016,291317,307141,264373,156387,387942,165436,198720,119917,119918,213472,217214,217215,646808,247632,260129,260130,260134,510637,217213,318696,319948,322439,521702,522195,385970,553193,96716,199108,199110,199112,198720,204776,207078,366508,164131,378951,378953,378954,378956,378959,382891,151636,123388,645697,440738,663078,378952,521579,522548,523065,298744,579049,251391,96658,305557,315789,346516,354426,378950,378957,378958,646804) \
	and sourcetypeid != :privatesourcetypeid and customerid = :customerid group by contactid having count(employeeid) >= 1 and count(distinct(countryid)) = 1"), \
	                    {'privatesourcetypeid': 3, 'customerid': -1}, Employee).fetchall()
	
	#country_count = func.count(Employee.countryid)
	#contacts = [x.contactid for x in session.query(Employee.contactid).\
	#    group_by(Employee.contactid).\
	#    having(country_count == 1).all()]
	nbr = 0
	for contact in contacts:
		contactid = contact[0]
		employee = session.query(Employee).filter(Employee.contactid == contactid).first()
		contact = session.query(Contact).filter(Contact.contactid == contactid).scalar()
		contact.countryid = employee.countryid
		session.flush()
		nbr += 1
		if nbr % 50 == 0:
			session.commit()
			print '%s records update out of %s' %(nbr, len(contacts))
			session.begin()
	session.commit()
	print 'End _update_distinct_contacts'
	
def _update_contacts():
	
	session.begin()
	contacts = session.query(Contact).filter(Contact.countryid == None).all()
	for contact in contacts:
		employee = session.query(Employee).filter(Employee.contactid == contact.contactid).first()
		if employee:
			contact.countryid = employee.countryid
		else:
			contact.countryid = 1
		session.flush()
			
	session.commit()
	print 'End _update_contacts'
	
def _update_stamm_contacts(workbook):

	xls_sheet = workbook.sheet_by_name('STAMM')
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		employeeid = int(xls_sheet.cell_value(rnum_read, 0))
		contactid = int(xls_sheet.cell_value(rnum_read, 1))
		countryid = GERMAN
		session.execute(text("UPDATE employees SET countryid = :countryid where employeeid = :employeeid"), \
	                    {'employeeid': employeeid, 'countryid': countryid}, Employee)
		session.execute(text("UPDATE contacts SET countryid = :countryid where contactid = :contactid"), \
	                    {'contactid': contactid, 'countryid': countryid}, Contact)
		session.commit()
	print 'End _update_stamm_contacts'


def _duplicate_contacts(workbook, xls_sheet):

	#xls_sheet = workbook.sheet_by_name('to_duplicate')
	for rnum_read in xrange(1, xls_sheet.nrows):
		session.begin()
		contactid = int(xls_sheet.cell_value(rnum_read, 0))
		contact = session.query(Contact).filter(Contact.contactid == contactid).scalar()
		employees = session.query(Employee).filter(Employee.contactid == contactid).all()
		
		for employee in employees:
			if contact.countryid == None:
				contact.countryid = employee.countryid
				session.commit()
				session.begin()
			elif contact.countryid != employee.countryid:
				already_added_contact = session.query(Contact).\
				    filter(Contact.familyname.ilike(contact.familyname)).\
					filter(Contact.firstname.ilike(contact.firstname)).\
				    filter(Contact.customerid == contact.customerid).\
				    filter(Contact.sourcetypeid == contact.sourcetypeid).\
				    filter(Contact.countryid == employee.countryid).scalar()
				if already_added_contact:
					employee.contactid = already_added_contact.contactid
					session.flush()
					session.commit()
					session.begin()
				else:
					new_contact = Contact(familyname=contact.familyname,
						                  firstname=contact.firstname,
						                  prefix=contact.prefix,
						                  suffix=contact.suffix,
						                  customerid=contact.customerid,
						                  sourcetypeid=contact.sourcetypeid,
					                      sourcekey=contact.sourcekey,
						                  countryid=employee.countryid)
					session.add(new_contact)
					session.flush()
					employee.contactid = new_contact.contactid
					session.commit()
					session.begin()
		session.commit()
	print 'End _duplicate_contacts'
	
	
if __name__ == '__main__':
	_run()	