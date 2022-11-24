# -*- coding: utf-8 -*-
"""customersolidmediaprofiles record"""
#-----------------------------------------------------------------------------
# Name:       customersolidmediaprofiles.py
# Purpose:
# Author:      Chris Hoy
# Created:     31/10/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

class CustomerSolidMediaProfiles(BaseSql):
	"""Solid Media Profiles"""


CustomerSolidMediaProfiles.mapping = Table('customersolidmediaprofiles', metadata, autoload = True, schema="userdata")

mapper(CustomerSolidMediaProfiles, CustomerSolidMediaProfiles.mapping )
