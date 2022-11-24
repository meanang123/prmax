# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        update_existing_outlets.py
# Purpose:     Update existing outlets of USA
#
# Author:      
#
# Created:     March 2016
# Copyright:  (c) 2016
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
LOGGER = logging.getLogger("prcommon.model")

OUTLETNAMECOLUMN = 0
ADDRESS1COLUMN = 1
CITYCOLUMN = 2
STATECOLUMN = 3
POSTCODE = 4
PHONECOLUMN = 5
FAXCOLUMN = 6
CIRCULATIONCOLUMN = 7
WWWCOLUMN = 8
EMAILCOLUMN = 9
IDCOLUMN = 10


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

	filename = "daily matched1.xls"
	workbook = xlrd.open_workbook(os.path.join(sourcedir, filename))
	xls_sheet = workbook.sheet_by_index(0)

	for rnum_read in xrange(1, xls_sheet.nrows):

		session.begin()

		if str(xls_sheet.cell_value(rnum_read, IDCOLUMN)).strip() != 'no match':
			outletid = int(xls_sheet.cell_value(rnum_read, IDCOLUMN))
			outletname = xls_sheet.cell_value(rnum_read, OUTLETNAMECOLUMN).strip()
			address1 = xls_sheet.cell_value(rnum_read, ADDRESS1COLUMN).strip()
			city = xls_sheet.cell_value(rnum_read, CITYCOLUMN).strip()
			state = xls_sheet.cell_value(rnum_read, STATECOLUMN).strip()
			zipcode = xls_sheet.cell_value(rnum_read, POSTCODE)
			if type(zipcode) is float:
				zipcode = str(int(zipcode)).strip()
			else:
				zipcode = str(zipcode).strip()

			phone = xls_sheet.cell_value(rnum_read, PHONECOLUMN).strip()
			fax = xls_sheet.cell_value(rnum_read, FAXCOLUMN).strip()
			circulation = xls_sheet.cell_value(rnum_read, CIRCULATIONCOLUMN)
			www = xls_sheet.cell_value(rnum_read, WWWCOLUMN).strip()
			email = xls_sheet.cell_value(rnum_read, EMAILCOLUMN).strip()

			#publication = session.query(Outlet, Address, Communication).\
				#join(Communication, Communication.communicationid == Outlet.communicationid).\
				#join(Address, Address.addressid == Communication.addressid).\
				#filter(Outlet.sourcetypeid == 4).\
				#filter(Outlet.outletid == outletid).scalar()

			publication = session.query(Outlet).\
		            filter(Outlet.sourcetypeid == 4).\
		            filter(Outlet.outletid == outletid).scalar()

			if publication:
					session.execute(text("UPDATE outlets SET sourcetypeid = 7, outletname = :outletname, circulation = :circulation, www = :www where outletid = :outletid"), \
				                    {'outletname': outletname, 'circulation': circulation, 'www': www, 'outletid': publication.outletid}, Outlet)

					session.execute(text("UPDATE communications SET tel = :phone, fax = :fax, email = :email where communicationid = :communicationid"), \
				                    {'phone': phone, 'fax': fax, 'email':email, 'communicationid': publication.communicationid}, Communication)

					address = session.query(Address, Communication).\
				            filter(Communication.communicationid == publication.communicationid).\
				            filter(Address.addressid == Communication.addressid).scalar()

					session.execute(text("UPDATE addresses SET address1 = :address1, townname = :city, county = :state, postcode = :zipcode where addressid = :addressid"), \
				                    {'address1': address1, 'city': city, 'state': state, 'zipcode': zipcode, 'addressid': address.addressid}, Address)

					employees = session.query(Employee).\
				            filter(Employee.outletid == outletid).\
				            filter(Employee.sourcetypeid == 4).all()

					for row_employees in employees:
							session.execute(text('UPDATE employees SET sourcetypeid = 7 where outletid = :outletid'), {'outletid': publication.outletid}, Outlet)
							session.execute(text('UPDATE contacts SET sourcetypeid = 7 where contactid = :contactid'), {'contactid': row_employees.contactid}, Employee)

		session.commit()


if __name__ == '__main__':
	_run()
