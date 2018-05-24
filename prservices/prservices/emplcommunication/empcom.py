# -*- coding: utf-8 -*-
"""employee communication"""
#-----------------------------------------------------------------------------
# Name:        empcom.py
# Purpose:     FIx employees to have a unique communication
#
# Author:      Stamatia Vatsi
#
# Created:     23/04/2018
# Copyright:  (c) 2018
#
#-----------------------------------------------------------------------------

import logging
import os
from turbogears import database
from turbogears.database import session
from ttl.tg.config import read_config
from sqlalchemy.sql import func
from sqlalchemy.sql import text
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlet import Outlet, OutletInterests
from prcommon.model.communications import Communication, Address
from prcommon.model.employee import Employee
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

def _run():
	""" run the application """
	
	emp_count = func.count(Employee.communicationid)
	communications = session.query(emp_count, Employee.communicationid).\
		group_by(Employee.communicationid).\
	    having(emp_count > 1).all()
	
	for com in communications:
		session.begin()
		employees = session.query(Employee).\
		    filter(Employee.communicationid == com[1]).all()
		for x in range(1,len(employees)):
			comm = _duplicate_communication(employees[0].communicationid)
			employees[x].communicationid = comm.communicationid
		session.commit()

def _duplicate_address(addressid):
	
	print (addressid)
	
	addr = Address.query.get(addressid)
	new_addr = Address(address1=addr.address1,
                       address2=addr.address2,
                       addresstypeid=addr.addresstypeid,
                       county=addr.county,
                       postcode=addr.postcode,
                       countryid=addr.countryid,
                       townname=addr.townname,
                       townid=addr.townid,
                       multiline=addr.multiline
                       )
	session.add(new_addr)
	session.flush()

	return new_addr
	
def _duplicate_communication(communicationid):
	
	print(communicationid)
	
	com = Communication.query.get(communicationid)
	new_addr = {}
	if com.addressid:
		new_addr = _duplicate_address(com.addressid)
	
	new_com = Communication(addressid=new_addr.addressid if new_addr else None,
                            email=com.email,
                            customerid=com.customerid,
                            communicationtypeid=com.communicationtypeid,
                            tel=com.tel,
                            fax=com.fax,
                            mobile=com.mobile,
                            webphone=com.webphone,
                            twitter=com.twitter,
                            facebook=com.facebook,
                            linkedin=com.linkedin,
                            twitterid=com.twitterid,
                            blog=com.blog,
                            instagram=com.instagram
                            )
	session.add(new_com)
	session.flush()

	
	return new_com


	
if __name__ == '__main__':
	_run()
