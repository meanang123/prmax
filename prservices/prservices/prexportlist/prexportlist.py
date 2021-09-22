# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        prexporter.py
# Purpose:     Export System
#
# Author:      Chris Hoy
#
# Created:     27/02/2014
# Copyright:  (c) 2014
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
from datetime import datetime
from turbogears import database
import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import Customer
from turbogears.database import session
from sqlalchemy import text


def _run( ):
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:],"" , ["listid=", "test"])
	listid = None
	is_list = False
	for option, params in options:
		if option in ("--listid",):
			if params.find(",") == -1:
				listid = dict(listid = int(params))
			else:
				is_list = True
				listid = params
	if listid == None:
		print ("Missing Export List")
		return

	if  is_list:
		listdetails = session.execute(text("SELECT listid, customerid, listname FROM userdata.list WHERE listid IN %s" % listid ), None, Customer ).fetchall()
		listmembers = session.execute(text("SELECT listmemberid,listid, outletid,employeeid FROM userdata.listmembers WHERE listid IN %s" % listid), None, Customer ).fetchall()
		out_file = file("/tmp/prmax_lists_%s.sql" % datetime.today().strftime("%d%m%y%H%M"), "w")
	else:
		listdetails = session.execute(text("SELECT listid, customerid, listname FROM userdata.list WHERE listid = :listid"), listid, Customer ).fetchall()
		listmembers = session.execute(text("SELECT listmemberid,listid, outletid,employeeid FROM userdata.listmembers WHERE listid = :listid AND outletid IS NOT NULL"), listid, Customer ).fetchall()
		out_file = file("/tmp/prmax_list_%d.sql" % listid["listid"], "w")

	for row in listdetails:
		params = (row[0],row[1],row[2])
		out_file.write("INSERT INTO userdata.list(listid, customerid, listname) VALUES (%d,%d,'%s');\n" % params)

	for row in listmembers:
		employeeid = "NULL" if not row[3] else str(row[3])
		out_file.write("INSERT INTO userdata.listmembers(listmemberid,listid, outletid,employeeid) VALUES (%d,%d,%d,%s);\n" % (row[0], row[1], row[2], employeeid))

if __name__ == '__main__':
	_run(  )
