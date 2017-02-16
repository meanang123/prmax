# -*- coding: utf-8 -*-
"""contacthistoryhistory record"""
#-----------------------------------------------------------------------------
# Name:       contacthistoryhistory.py
# Purpose:
# Author:      Chris Hoy
# Created:     04/08/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class ContactHistoryHistory(BaseSql):
	""" ContactHistoryHistory """

ContactHistoryHistory.mapping = Table('contacthistoryhistory', metadata, autoload = True, schema="userdata")

mapper(ContactHistoryHistory, ContactHistoryHistory.mapping )
