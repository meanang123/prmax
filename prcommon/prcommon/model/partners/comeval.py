# -*- coding: utf-8 -*-
"""Com eval """
#-----------------------------------------------------------------------------
# Name:        comeval.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     08-05-2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy import text
from prcommon.model.identity import Customer
import StringIO
import csv

import logging
LOGGER = logging.getLogger("prcommon.model")

class ComEval(object):
	""" comeval """

	data_command_sql = """SELECT
	oc.outletcoverageid,
	o.outletid,
	o.outletname,
	ga.geographicalname AS coverage,
	glt.geographicallookupdescription AS coverage_type,
	gap.geographicalname AS coverage_parent,
	gltp.geographicallookupdescription AS coverage_parent_type
	FROM outlets AS o
	JOIN outletcoverage AS oc ON oc.outletid = o.outletid
	JOIN internal.geographical AS ga ON ga.geographicalid = oc.geographicalid
	JOIN internal.geographicallookuptypes AS glt ON glt.geographicallookuptypeid = ga.geographicallookuptypeid
	JOIN internal.geographicaltree as gt ON oc.geographicalid = gt.childgeographicalareaid
	LEFT OUTER JOIN internal.geographical AS gap ON gap.geographicalid = gt.parentgeographicalareaid
	LEFT OUTER JOIN internal.geographicallookuptypes AS gltp ON gltp.geographicallookuptypeid = gap.geographicallookuptypeid

	WHERE o.prmax_outlettypeid in (6,9,10) AND o.sourcetypeid in (1,2)
"""
	data_col_names =  ["outletcoverageid",
	                   "outletid",
	                   "outletname",
	                   "coverage",
	                   "coverage_type",
	                   "coverage_parent",
	                   "coverage_parent_type"]

	@classmethod
	def data_coverage(cls):
		"""return the data for the csv """

		rows = session.query( text(ComEval.data_command_sql), None, Customer).all()

		output = StringIO.StringIO()
		csv_write = csv.writer ( output )
		csv_write.writerow( ComEval.data_col_names )
		csv_write.writerows( rows )
		output.flush()

		return output.getvalue()


