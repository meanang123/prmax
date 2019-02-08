# -*- coding: utf-8 -*-
""" CustomerSettings """
#-----------------------------------------------------------------------------
# Name:       customersettings.py
# Purpose:		Basic Data sets
#
# Author:      Chris Hoy
#
# Created:     06/12/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table


class CustomerSettings(object):
	""" data sets for customers """

	pass


CustomerSettings.mapping = Table('customersettings', metadata, autoload=True, schema="internal")

mapper(CustomerSettings, CustomerSettings.mapping)
