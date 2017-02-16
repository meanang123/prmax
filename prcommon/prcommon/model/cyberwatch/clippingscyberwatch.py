# -*- coding: utf-8 -*-
"""ClippingsCyberWatch Record """
#-----------------------------------------------------------------------------
# Name:        clippingscyberwatch.py
# Purpose:
# Author:      Chris Hoy
# Created:     07/01/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

class ClippingsCyberWatch(object):
	""" ClippingsCyberWatch """
	pass


ClippingsCyberWatch.mapping = Table('clippingscyberwatch', metadata, autoload=True, schema="userdata")

mapper(ClippingsCyberWatch, ClippingsCyberWatch.mapping)

