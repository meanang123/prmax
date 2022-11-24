# -*- coding: utf-8 -*-
"""issue record"""
#-----------------------------------------------------------------------------
# Name:       issuehistory.py
# Purpose:
# Author:      Chris Hoy
# Created:     31/07/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class IssueHistory(BaseSql):
	""" issue history """

IssueHistory.mapping = Table('issuehistory', metadata, autoload = True, schema="userdata")

mapper(IssueHistory, IssueHistory.mapping )
