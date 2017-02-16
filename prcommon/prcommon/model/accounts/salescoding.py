# -*- coding: utf-8 -*-
""" Sales Coding """
#-----------------------------------------------------------------------------
# Name:        salescoding.py
# Author:      Chris Hoy
# Created:    08/07/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model.common import BaseSql

import logging
LOG = logging.getLogger("prmax")

class SalesCoding(BaseSql):
	"""  Sales coding """

	pass


SalesCoding.mapping = Table('sales_analysis', metadata, autoload=True, schema="accounts")

mapper(SalesCoding, SalesCoding.mapping)

