# -*- coding: utf-8 -*-
""" CustomerAccessLog """
#-----------------------------------------------------------------------------
# Name:       customeraccesslog.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     20/07/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model.common import BaseSql

class CustomerAccessLog(BaseSql):
	""" log when an action happens"""
	LOGGEDIN = 1
	MAINSYSTEMACCESSED = 2
	DOSEARCH = 3


CustomerAccessLog.mapping = Table('customeraccesslog', metadata, autoload=True)

mapper(CustomerAccessLog, CustomerAccessLog.mapping)
