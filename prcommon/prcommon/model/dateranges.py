# -*- coding: utf-8 -*-
""" Dateranges """
#-----------------------------------------------------------------------------
# Name:       dateranges.py
# Purpose:	  standart options for dateranges
#
# Author:      Stamatia Vatsi
#
# Created:     10/12/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table


class DateRanges(object):
	""" data sets for customers """

	pass


DateRanges.mapping = Table('dateranges', metadata, autoload=True, schema="internal")

mapper(DateRanges, DateRanges.mapping)
