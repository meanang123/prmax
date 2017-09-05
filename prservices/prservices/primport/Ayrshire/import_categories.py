# -*- coding: utf-8 -*-
"""primporter"""
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

from prcommon.model import ContactHistoryUserDefine, Customer
from turbogears.database import session

USERDEFINEFIELDCOLUMN = 0
USERDEFINEFIELDISSUESCOLUMN = 3

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

	xls_sheet = workbook.sheet_by_name('categories')
	xls_sheet_issues = workbook.sheet_by_name('issues')

	session.begin()	
	session.execute(text("UPDATE internal.customers SET crm_user_define_1 = 'Category' where customerid = 5730"), {}, Customer)		#live: customerid=5730, test: customerid=5636

	for rnum in range(1, xls_sheet.nrows):
		
		userdefinefield = xls_sheet.cell_value(rnum, USERDEFINEFIELDCOLUMN)
		
		userdefinefield =  ContactHistoryUserDefine(
	        fieldid = 1,
	        description = userdefinefield,
	        customerid = 5730) #live: customerid=5730
		session.add(userdefinefield)
		session.flush()

	session.commit()
	
	
	xls_sheet_issues = workbook.sheet_by_name('issues')

	session.begin()	
	session.execute(text("UPDATE internal.customers SET crm_user_define_2 = 'Issue' where customerid = 5730"), {}, Customer)		#live: customerid=5730

	for rnum in range(2, xls_sheet_issues.nrows):
		
		userdefinefield_issue = xls_sheet_issues.cell_value(rnum, USERDEFINEFIELDISSUESCOLUMN)
		
		userdefinefield =  ContactHistoryUserDefine(
	        fieldid = 2,
	        description = userdefinefield_issue,
	        customerid = 5730) #live: customerid=5730
		session.add(userdefinefield)
		session.flush()

	session.commit()


if __name__ == '__main__':
	_run()
