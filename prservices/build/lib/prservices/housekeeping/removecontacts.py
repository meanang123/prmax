# -*- coding: utf-8 -*-
"""remove duplicate roles"""
#-----------------------------------------------------------------------------
# Name:        duplicateroles.py
# Purpose:     delete duplicate News Desk roles from the same employee
#
# Author:      Stamatia Vatsi
#
# Created:     25/05/2018
# Copyright:  (c) 2018
#
#-----------------------------------------------------------------------------

import logging
import os
import sys
import getopt
from sqlalchemy import Table, Column, Integer, not_
from sqlalchemy.sql import text, func, except_, union, union_all, select
from turbogears import database
from turbogears.database import session
from ttl.tg.config import read_config
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.employee import Employee
from prcommon.model import ContactHistory, ContactHistoryGeneral
from prcommon.model import Contact
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

def _run():
	""" run the application """

	options, dummy = getopt.getopt(sys.argv[1:], "", ["check"])
	check = None

	for option, params in options:
		if option in ("--check",):
			check = True
	
	notlinkedcontacts = [row[0] for row in session.execute(except_(session.query(Contact.contactid),
	                                            session.query(Employee.contactid).distinct(), session.query(ContactHistory.contactid).distinct())).fetchall()]
	
	for notlinkedcontactid in notlinkedcontacts:
		session.begin()
		session.execute(text("DELETE FROM contacts WHERE contactid = :contactid"), {'contactid': notlinkedcontactid}, Contact)
		print ('Deleted Contactid: %s' %notlinkedcontactid)
		session.commit()

if __name__ == '__main__':
	_run()