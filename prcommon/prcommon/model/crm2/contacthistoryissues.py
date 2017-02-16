# -*- coding: utf-8 -*-
"""issue record"""
#-----------------------------------------------------------------------------
# Name:       contacthistoryissues.py
# Purpose:
# Author:      Chris Hoy
# Created:     14/07/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class ContactHistoryIssues(BaseSql):
	""" issues """

ContactHistoryIssues.mapping = Table('contacthistoryissues', metadata, autoload = True, schema="userdata")

mapper(ContactHistoryIssues, ContactHistoryIssues.mapping )
