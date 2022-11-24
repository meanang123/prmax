# -*- coding: utf-8 -*-
"""documents record"""
#-----------------------------------------------------------------------------
# Name:       documents.py
# Purpose:
# Author:      Chris Hoy
# Created:     17/09/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class Documents(BaseSql):
	""" documents """

Documents.mapping = Table('documents', metadata, autoload = True, schema="userdata")

mapper(Documents, Documents.mapping )
