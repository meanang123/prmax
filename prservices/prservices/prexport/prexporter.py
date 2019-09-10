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
import logging
from turbogears import database
from ttl.tg.config import read_config

LOGGER = logging.getLogger("prcommon.model")
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.exports.dataexport import DataExport

def _run( ):
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:],"" , ["outdir=", "limit=", "filter=", "zipped", "password=", "countryid=", "csv", "employee_filter="])
	outdir = None
	limit = None
	sql_filter = None
	is_zipped = False
	is_csv = False
	password = None
	countryid = None
	employee_filter = None

	for option, params in options:
		if option in ("--outdir",):
			outdir = params
		if option in ("--limit",):
			limit = int(params)
		if option in ("--filter",):
			sql_filter = params
		if option in ("--employee_filter"):
			employee_filter = params
		if option in ("--zipped",):
			is_zipped = True
		if option in ("--csv",):
			is_csv = True
		if option in ("--password",):
			password = params
		if option in ("--countryid",):
			countryid = int(params)

	if outdir == None:
		print "Missing Output Directory"
		return

	print "Settings"
	print "Output Dir		:", outdir
	print "Output Style	:", "csv" if is_csv else "xml"
	print "Zipper			:", "True" if is_zipped else "False"
	print "Limited			:", "True" if limit else "False"
	print "Outlet Filtered	:", "True" if sql_filter else "False"
	print "Employee Filter	:", "True" if employee_filter else "False"
	print "Zip Pswd		:", password if password else "Not Selected"
	print "CountryId		:", str(countryid, )

	exporter = DataExport(
	  outdir,
	  limit,
	  sql_filter,
	  is_zipped,
	  password,
	  countryid,
	  is_csv,
	  employee_filter
	)

	exporter.export()

if __name__ == '__main__':
	_run(  )
