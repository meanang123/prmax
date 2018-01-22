# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        primporter.py
# Purpose:     Import Usa Data
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
from turbogears import database
import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.datafeeds.usa import USADataImport
from prcommon.model import DataFeedsGeneral

def _run():
	""" run the application """
	
	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir=", "check", "remove_old=", "update", "sourcetypeid="])
	sourcedir = None
	check = None
	update = None
	remove_old = None
	sourcetypeid = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params
		if option in ("--check",):
			check = True
		if option in ("--remove_old", ):
			remove_old = int(params)
		if option in ("--update"):
			update = True
		if option in ("--sourcetypeid"):
			sourcetypeid = int(params)

 	if sourcedir == None:
		print "Missing Source Directory"
		return

	if remove_old:
		DataFeedsGeneral.do_delete_old_data(remove_old)
	elif sourcetypeid:
		DataFeedsGeneral.do_delete_old_sourcetypeid(sourcetypeid)

	else:
		importer = USADataImport(sourcedir, check)
		if update:
			importer.run_update()
		else:
			importer.run_import()

if __name__ == '__main__':
	_run()
