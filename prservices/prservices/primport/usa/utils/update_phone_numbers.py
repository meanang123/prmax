# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        update_phone_numbers.py
# Purpose:     Update phone numbers of USA
#
# Author:      
#
# Created:     September 2018
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

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlet import Outlet
from prcommon.model.communications import Communication, Address
from prcommon.model.employee import Employee
from prcommon.model.contact import Contact
LOGGER = logging.getLogger("prcommon.model")


def _run():
	""" run the application """
	
	publications = session.query(Outlet).filter(Outlet.sourcetypeid == 7).all()
	employees = session.query(Employee).filter(Employee.sourcetypeid == 7).all()
	contacts = session.query(Contact).filter(Contact.sourcetypeid == 7).all()

	for publication in publications:
		phone = fax = ''
		pub_com = session.query(Communication).filter(Communication.communicationid == publication.communicationid).scalar()
		if pub_com and pub_com.tel:
			phone = pub_com.tel.strip()
			if pub_com.tel.strip().startswith('+1') and pub_com.tel.strip() != '':
				phone = "%s %s" %('001', pub_com.tel[2:])
			elif pub_com.tel.strip().startswith('+ 1')  and pub_com.tel.strip() != '':
				phone = "%s %s" %('001', pub_com.tel[3:])
			elif len(pub_com.tel.strip()) < 15  and pub_com.tel.strip() != '':
				phone = "%s %s" % ('001', pub_com.tel.strip())
		if pub_com and pub_com.fax:
			fax = pub_com.fax.strip()
			if pub_com.fax.strip().startswith('+1') and pub_com.fax.strip() != '':
				fax = "%s %s" %('001', pub_com.fax[2:])
			elif pub_com.fax.strip().startswith('+ 1')  and pub_com.tel.strip() != '':
				fax = "%s %s" %('001', pub_com.fax[3:])
			elif len(pub_com.fax.strip()) < 15  and pub_com.fax.strip() != '':
				fax = "%s %s" % ('001', pub_com.fax.strip())
		if phone != '' or fax != '':
			session.execute(text("UPDATE communications SET tel = :phone, fax = :fax where communicationid = :communicationid"), \
				            {'phone':phone, 'fax':fax, 'communicationid':pub_com.communicationid}, Communication)
		
	for employee in employees:
		phone = fax = ''
		emp_com = session.query(Communication).filter(Communication.communicationid == employee.communicationid).scalar()
		if emp_com and emp_com.tel:
			phone = emp_com.tel.strip()
			if emp_com.tel.startswith('+1')  and emp_com.tel.strip() != '':
				phone = "%s %s" %('001', emp_com.tel[2:])
			elif emp_com.tel.strip().startswith('+ 1')  and emp_com.tel.strip() != '':
				phone = "%s %s" %('001', emp_com.tel[3:])
			elif len(emp_com.tel.strip()) < 15:
				phone = "%s %s" % ('001', emp_com.tel.strip())
		if emp_com and emp_com.fax:
			fax = emp_com.fax.strip()
			if emp_com.fax.startswith('+1')  and emp_com.fax.strip() != '':
				fax = "%s %s" %('001', emp_com.fax[2:])
			elif emp_com.fax.strip().startswith('+ 1')  and emp_com.fax.strip() != '':
				fax = "%s %s" %('001', emp_com.fax[3:])
			elif len(emp_com.fax.strip()) < 15:
				fax = "%s %s" % ('001', emp_com.fax.strip())
		if phone != '' or fax != '':
			session.execute(text("UPDATE communications SET tel = :phone, fax = :fax where communicationid = :communicationid"), \
		                    {'phone':phone, 'fax':fax, 'communicationid':pub_com.communicationid}, Communication)

	for contact in contacts:
		phone = fax = ''
		con_employees = session.query(Employee).filter(Employee.contactid == contact.contactid).all()
		for con_emp in con_employees:
			con_emp_com = session.query(Communication).filter(Communication.communicationid == con_emp.communicationid).scalar()
			if con_emp_com and con_emp_com.tel:
				phone = con_emp_com.tel.strip()
				if con_emp_com.tel.startswith('+1')  and con_emp_com.tel.strip() != '':
					phone = "%s %s" %('001', con_emp_com.tel[2:])
				elif con_emp_com.tel.strip().startswith('+ 1')  and con_emp_com.tel.strip() != '':
					phone = "%s %s" %('001', con_emp_com.tel[3:])
				elif len(con_emp_com.tel.strip()) < 15:
					phone = "%s %s" % ('001', con_emp_com.tel.strip())
			if con_emp_com and con_emp_com.fax:
				fax = con_emp_com.fax.strip()
				if con_emp_com.fax.startswith('+1')  and con_emp_com.fax.strip() != '':
					fax = "%s %s" %('001', con_emp_com.fax[2:])
				elif con_emp_com.fax.strip().startswith('+ 1')  and con_emp_com.fax.strip() != '':
					fax = "%s %s" %('001', con_emp_com.fax[3:])
				elif len(con_emp_com.fax.strip()) < 15:
					fax = "%s %s" % ('001', con_emp_com.fax.strip())

			if phone != '' or fax != '':
				session.execute(text("UPDATE communications SET tel = :phone, fax = :fax where communicationid = :communicationid"), \
			                    {'phone':phone, 'fax':fax, 'communicationid':pub_com.communicationid}, Communication)

if __name__ == '__main__':
	_run()
