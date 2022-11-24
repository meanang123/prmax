# -*- coding: utf-8 -*-
"""contacthistoryuserdefine record"""
#-----------------------------------------------------------------------------
# Name:       contacthistoryuserdefine.py
# Purpose:
# Author:      Chris Hoy
# Created:     12/06/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class ContactHistoryUserDefine(BaseSql):
	""" ContactHistoryUserDefine """

ContactHistoryUserDefine.mapping = Table('contacthistoryuserdefine', metadata, autoload = True, schema="userdata")

mapper(ContactHistoryUserDefine, ContactHistoryUserDefine.mapping )
