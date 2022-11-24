# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        primporter.py
# Purpose:     Import STamm Data
#
# Author:      Chris Hoy
#
# Created:     14/04/2014
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

from prcommon.model import DataSourceTranslations

def _run( ):
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:],"" , ["fieldname=", "sourcetypeid=", "limit="])
	fieldname = None
	sourcetypeid = None
	limit = None

	for option, params in options:
		if option in ("--fieldname",):
			fieldname = params
		if option in ("--sourcetypeid",):
			sourcetypeid = int(params)
		if option in ("--limit"):
			limit = int(params)


	if fieldname == None or  sourcetypeid == None:
		print ("Missing Options")
		return

	DataSourceTranslations.do_translations(sourcetypeid, fieldname, limit)

if __name__ == '__main__':
	_run(  )
