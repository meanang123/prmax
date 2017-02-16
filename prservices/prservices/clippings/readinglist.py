# -*- coding: utf-8 -*-
"""readinglist"""
#-----------------------------------------------------------------------------
# Name:        readinglist.py
# Purpose:     Import Clippings
#
# Author:      Chris Hoy
#
# Created:     24/08/2015
# Copyright:  (c) 2015
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

from prcommon.model import OutletExternalLinkGeneral

def _run():
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcefile="])
	sourcefile = None

	for option, params in options:
		if option in ("--sourcefile",):
			sourcefile = params

	if sourcefile == None:
		print "Missing Source File or Directory"
		return

	OutletExternalLinkGeneral.import_xls(sourcefile)

if __name__ == '__main__':
	_run()
