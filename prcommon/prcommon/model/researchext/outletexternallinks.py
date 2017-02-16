# -*- coding: utf-8 -*-
"""OutletExternalLink Record """
#-----------------------------------------------------------------------------
# Name:        outletexternallinks.py
# Purpose:
# Author:      Chris Hoy
# Created:     08/05/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from prcommon.model.common import BaseSql

class OutletExternalLink(BaseSql):
	""" OutletExternalLink record """
	pass

OutletExternalLink.mapping = Table('outlet_external_links', metadata, autoload=True, schema="research")
mapper(OutletExternalLink, OutletExternalLink.mapping)

