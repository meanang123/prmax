# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        ttlcommon.py
# Purpose:     helper function for test function
# Author:       Chris Hoy
#
# Created:     10/08/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import database
from turbogears.database import get_engine, create_session

def initTestController():
	# setup default database connections
	database.set_db_uri("postgres://prmax:mkjn_45@localhost/prmax","sqlalchemy")
	database.set_db_uri("postgres://prmax:mkjn_45@localhost/prmaxcache","prmaxcache")
	database.set_db_uri("postgres://prmax:mkjn_45@localhost/prmaxcollateral","prmaxcollateral")

	get_engine()
	create_session()
