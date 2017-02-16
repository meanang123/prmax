# -*- coding: utf-8 -*-
"""ClippingsReportFields Record """
#-----------------------------------------------------------------------------
# Name:        clippingsreportfields.py
# Purpose:
# Author:      Chris Hoy
# Created:     03/09/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql

import logging
LOG = logging.getLogger("prcommon")

class ClippingsReportFields(BaseSql):
	"ClippingsReportFields"
	pass

ClippingsReportFields.mapping = Table('clippingsreportfields', metadata, autoload=True, schema="internal")

mapper(ClippingsReportFields, ClippingsReportFields.mapping)

