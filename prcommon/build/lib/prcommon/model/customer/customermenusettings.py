# -*- coding: utf-8 -*-
""" CustomerMenuSettings """
#-----------------------------------------------------------------------------
# Name:       customermenusettings.py
# Purpose:    MenuBar settings for customers
#
# Author:      Stamatia Vatsi
#
# Created:     Dec 2021
# Copyright:   (c) 2021
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table


class CustomerMenuSettings(object):
	""" menubar settings for prmax customers """

	pass


CustomerMenuSettings.mapping = Table('customermenusettings', metadata, autoload=True, schema="internal")

mapper(CustomerMenuSettings, CustomerMenuSettings.mapping)
