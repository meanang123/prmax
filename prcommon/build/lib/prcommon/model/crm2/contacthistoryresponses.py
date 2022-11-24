# -*- coding: utf-8 -*-
"""issue record"""
#-----------------------------------------------------------------------------
# Name:       contacthistoryresponses.py
# Purpose:
# Author:      Chris Hoy
# Created:     14/8/2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class ContactHistoryResponses(BaseSql):
	""" contacthistoryresponses """
	pass

ContactHistoryResponses.mapping = Table('contacthistoryresponses', metadata, autoload=True, schema="userdata")

mapper(ContactHistoryResponses, ContactHistoryResponses.mapping)
