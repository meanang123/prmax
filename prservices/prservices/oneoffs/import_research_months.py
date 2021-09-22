# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        prexporter.py
# Purpose:     Export System
#
# Author:      Chris Hoy
#
# Created:     27/02/2014
# Copyright:  (c) 2014
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
from turbogears import database
import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import ResearchDetails
from turbogears.database import session
import xlrd

RESEARCHFREQDESC = {"1.0": 5,
                    "2.0": 8,
                    "3.0": 7,
                    "4.0": 4,
                    "5.0": 4,
                    "6.0": 4,}

def _run():
	""" run import research months """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["source=", ])
	source = None
	for option, params in options:
		if option in ("--source",):
			source = params

	if source == None:
		print ("Missing Parameters")
		exit(-1)

	workbook = xlrd.open_workbook(source)
	xls_sheet = workbook.sheet_by_name("Working report")
	for rnum in xrange(1, xls_sheet.nrows):
		tmp = unicode(xls_sheet.cell_value(rnum, 0)).encode('utf8')
		if not tmp:
			continue

		outletid = int(float(tmp))
		researchfrequencyid = RESEARCHFREQDESC[unicode(xls_sheet.cell_value(rnum, 3)).encode('utf8')]
		dates = []
		for cnum in xrange(4, 16):
			value = xls_sheet.cell_value(rnum, cnum)
			if value:
				dates.append(xlrd.xldate.xldate_as_datetime(value, workbook.datemode))

		print (outletid)
		session.begin()
		research = session.query(ResearchDetails).filter(ResearchDetails.outletid == outletid).scalar()
		if research:
			research.researchfrequencyid = researchfrequencyid
			for nbr in xrange(1, len(dates) + 1):
				setattr(research, "quest_month_" + str(nbr), dates[nbr-1].month)

		session.commit()

if __name__ == '__main__':
	_run()
