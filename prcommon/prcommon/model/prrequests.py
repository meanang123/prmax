# -*- coding: utf-8 -*-
"""prrequest tweets"""
#-----------------------------------------------------------------------------
# Name:       prrequests.py
# Purpose:
# Author:      Chris Hoy
# Created:     28/03/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class PRRequest(BaseSql):
	""" prrequest """

PRRequest.mapping = Table('prrequest', metadata, autoload = True)

mapper(PRRequest, PRRequest.mapping )
