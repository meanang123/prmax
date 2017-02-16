# -*- coding: utf-8 -*-
"""check_queue"""
#-----------------------------------------------------------------------------
# Name:        admin_clear_down.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     04/06/2016
# Copyright:  (c) 2016
#
#-----------------------------------------------------------------------------
import os
from datetime import datetime
from turbogears import database
from sqlalchemy import text
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()
from turbogears.database import session
from prcommon.model import Customer

DEMO_RE_SET = """UPDATE internal.customers SET customerstatusid = 3 WHERE licence_expire < current_date AND customerstatusid = 2 AND isinternal = FALSE"""

COMMANDS = (("Disable Old Demo's", DEMO_RE_SET), )
def _run():
	""" run the application """
	for command in COMMANDS:
		print command[0]
		session.execute(text(command[1]), None, Customer)

if __name__ == '__main__':
	print "Starting ", datetime.now()
	_run()
	print "Existing ", datetime.now()
