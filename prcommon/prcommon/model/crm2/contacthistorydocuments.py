# -*- coding: utf-8 -*-
"""contacthistorydocuments record"""
#-----------------------------------------------------------------------------
# Name:       contacthistorydocuments.py
# Purpose:
# Author:      Chris Hoy
# Created:     17/09/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class ContactHistoryDocuments(BaseSql):
	""" contacthistorydocuments """

ContactHistoryDocuments.mapping = Table('contacthistorydocuments', metadata, autoload = True, schema="userdata")

mapper(ContactHistoryDocuments, ContactHistoryDocuments.mapping )
