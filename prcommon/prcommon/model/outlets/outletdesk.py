# -*- coding: utf-8 -*-
"""outletdesk"""
#-----------------------------------------------------------------------------
# Name:        outletdesk
# Purpose:
# Author:      Chris Hoy
#
# Created:     28/02/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

import logging
LOGGER = logging.getLogger("prcommon")

class OutletDesk(BaseSql):
	""" outletdesk  """
	pass

# load tables from db
OutletDesk.mapping = Table('outletdesk', metadata, autoload=True)

mapper(OutletDesk, OutletDesk.mapping)
