# -*- coding: utf-8 -*-
"""issue record"""
#-----------------------------------------------------------------------------
# Name:       issues.py
# Purpose:
# Author:      Chris Hoy
# Created:     12/06/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class Issue(BaseSql):
	""" issues """

Issue.mapping = Table('issues', metadata, autoload = True, schema="userdata")

mapper(Issue, Issue.mapping )
