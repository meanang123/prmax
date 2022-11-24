# -*- coding: utf-8 -*-
"""ClippingsReport Record """
#-----------------------------------------------------------------------------
# Name:        clippingsreport.py
# Purpose:
# Author:      Chris Hoy
# Created:     03/09/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from ttl.model import BaseSql

import logging
LOG = logging.getLogger("prcommon")

class ClippingsReport(BaseSql):
	"ClippingsReport"

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """

		return [dict(id=row.clippingsreportid, name=row.clippingreportdescription)
		        for row in session.query(ClippingsReport).\
		        filter(ClippingsReport.clippingreportformat == int(params.get("set", -1))).\
		        order_by(ClippingsReport.clippingreportdescription).all()]


ClippingsReport.mapping = Table('clippingsreport', metadata, autoload=True, schema="internal")



mapper(ClippingsReport, ClippingsReport.mapping)

