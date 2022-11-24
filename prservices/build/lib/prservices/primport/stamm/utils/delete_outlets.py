# -*- coding: utf-8 -*-
"""delete_outlets"""
#-----------------------------------------------------------------------------
# Name:        delete_outlets.py
# Purpose:     Delete outlets for STAMM
#
# Author:
#
# Created:     Dec 2017
# Copyright:  (c) 2017
#
#-----------------------------------------------------------------------------
import os
import sys
import getopt
import logging
import csv
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

OUTLETID = 0

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

	count = deleted = 0
	sourcefile = "StammDelete.csv"
	reader = csv.reader( file(os.path.join (sourcedir, sourcefile)))
	for row in reader:
		session.begin()
		session.execute(text("SELECT outlet_delete(outletid) FROM outlets WHERE outletid =:outletid"), dict(outletid = row[0]), Outlet)
		session.commit()
		deleted += 1

		if deleted % 50 == 0:
			sys.stdout.write('\n%d %d' % (count, deleted))
			sys.stdout.flush()
		count += 1

if __name__ == '__main__':
	_run()



