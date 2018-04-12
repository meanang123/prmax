# -*- coding: utf-8 -*-
""" Globsl Newsroom to seo link """
#-----------------------------------------------------------------------------
# Name:        seonewsrooms.py
# Purpose:    Global News room to seo
#
# Author:      Chris Hoy
# Created:     27/03/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

class SeoNewsRooms(object):
	""" Newsroom seo details"""
	pass

SeoNewsRooms.mapping = Table('seonewsrooms', metadata, autoload=True, schema="seoreleases")

mapper(SeoNewsRooms, SeoNewsRooms.mapping)
