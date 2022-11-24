# -*- coding: utf-8 -*-
"""clippings importer"""
#-----------------------------------------------------------------------------
# Name:        importer.py
# Purpose:     Import Clippings
#
# Author:      Chris Hoy
#
# Created:     14/04/2014
# Copyright:  (c) 2014
#
#-----------------------------------------------------------------------------
from ttl.tg.config import read_config
import os
import getopt
import sys
from turbogears import database
import logging
LOGGER = logging.getLogger("prcommon.model")

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import ClippingsImport

def _run():
	""" run the application """

	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcefile=", "sourcedir="])
	sourcefile = None
	sourcedir = None

	for option, params in options:
		if option in ("--sourcefile",):
			sourcefile = params
		if option in ("--sourcedir",):
				sourcedir = params

	if sourcefile == None and sourcedir == None:
		print ("Missing Source File or Directory")
		return

	importer = ClippingsImport()

	if sourcefile:
		importer.import_ipcb_file(sourcefile, None)
	else:
		importer.import_ipcb_folder(sourcedir)

if __name__ == '__main__':
	_run()
