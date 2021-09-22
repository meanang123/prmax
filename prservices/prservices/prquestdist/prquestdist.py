# -*- coding: utf-8 -*-
"""ppremailer"""
#-----------------------------------------------------------------------------
# Name:        prquestdist.py
# Purpose:     Send out Mass questionaaries
#
# Author:      Chris Hoy
#
# Created:     16/11/2012
# Copyright:  (c) 2012
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
import logging
from datetime import datetime
from turbogears import database
from ttl.tg.config import read_config

LOGGER = logging.getLogger("prcommon.model")

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.researchprojects.projectemails import ProjectEmails

def _run():
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["live", "test", "testmode", "toemail=", "researchprojectid="])
	do_test = None
	to_email = None
	researchprojectid = None
	test_mode = False

	for option, params in options:
		if option in ("--live",):
			do_test = False
		if option in ("--test",):
			do_test = True
		if option == "--toemail":
			to_email = params
		if option == "--researchprojectid":
			researchprojectid = int(params)
		if option == "--testmode":
			test_mode = True

	if do_test is None:
		print ("Missing Environment")
		return

	if do_test and  to_email is None:
		print ("Test Environment requires 'toemail' address")
		return


	ProjectEmails.send_first_emails(do_test, to_email, researchprojectid, test_mode)
	# because of the way david wan't too work this is now incorrect
	ProjectEmails.send_follow_up_emails(do_test, to_email, test_mode)

if __name__ == '__main__':
	print ("Starting ", datetime.now())
	_run()
	print ("Existing ", datetime.now())
