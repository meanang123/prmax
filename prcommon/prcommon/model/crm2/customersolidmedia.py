# -*- coding: utf-8 -*-
"""customersolidmedia record"""
#-----------------------------------------------------------------------------
# Name:       customersolidmedia.py
# Purpose:
# Author:      Chris Hoy
# Created:     31/10/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class CustomerSolidMedia(BaseSql):
	"""Solid Media"""


CustomerSolidMedia.mapping = Table('customersolidmedia', metadata, autoload = True, schema="userdata")

mapper(CustomerSolidMedia, CustomerSolidMedia.mapping )
