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
from turbogears import database
from turbogears.database import session
from ttl.tg.config import read_config
from sqlalchemy.sql import func
from sqlalchemy.sql import text
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.employee import Employee, EmployeePrmaxRole
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

def _run():
	""" run the application """

	options, dummy = getopt.getopt(sys.argv[1:], "", ["check"])
	check = None

	for option, params in options:
		if option in ("--check",):
			check = True
	
	emp_count = func.count(EmployeePrmaxRole.employeeid)
	employeeroles = session.query(emp_count, EmployeePrmaxRole.employeeid).\
        filter(EmployeePrmaxRole.prmaxroleid == 1008).\
        group_by(EmployeePrmaxRole.employeeid).\
        having(emp_count > 1).all()

	for employeerole in employeeroles:
		if not check:
			session.begin()
			emplroles = session.query(EmployeePrmaxRole).\
				filter(EmployeePrmaxRole.employeeid == employeerole[1]).all()
			for x in range(1, len(emplroles)):
				session.execute(text("DELETE from employeeprmaxroles WHERE employeeprmaxroleid = :employeeprmaxroleid" ), {'employeeprmaxroleid':emplroles[x].employeeprmaxroleid}, Employee)
			session.commit()
		else:
			log.info("Found employeeid: %s" % employeerole[1])
		
if __name__ == '__main__':
	_run()
