# -*- coding: utf-8 -*-
"""issuedocuments record"""
#-----------------------------------------------------------------------------
# Name:       issuedocuments.py
# Purpose:
# Author:      Chris Hoy
# Created:     17/09/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class IssueDocuments(BaseSql):
	""" issuedocuments """

IssueDocuments.mapping = Table('issuedocuments', metadata, autoload = True, schema="userdata")

mapper(IssueDocuments, IssueDocuments.mapping )
