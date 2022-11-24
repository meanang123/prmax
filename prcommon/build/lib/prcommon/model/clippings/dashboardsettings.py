# -*- coding: utf-8 -*-
"""DashboardSettings Record """
#-----------------------------------------------------------------------------
# Name:        dashboardsettings.py
# Purpose:
# Author:      Stamatia Vatsi
# Created:     11/12/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from prcommon.model.common import BaseSql

class DashboardSettings(BaseSql):
	""" DashboardSettings record """

	pass

DashboardSettings.mapping = Table('dashboardsettings', metadata, autoload=True, schema="userdata")
mapper(DashboardSettings, DashboardSettings.mapping)

