# -*- coding: utf-8 -*-
"""DistributionTemplates Record """
#-----------------------------------------------------------------------------
# Name:        distributiontemplates.py
# Purpose:
# Author:      Chris Hoy
# Created:     07/01/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from prcommon.model.common import BaseSql

class DistributionTemplates(BaseSql):
	""" DistributionTemplates """
	pass


DistributionTemplates.mapping = Table('distributiontemplates', metadata, autoload=True, schema="userdata")

mapper(DistributionTemplates, DistributionTemplates.mapping)

