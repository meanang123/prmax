# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_translations.py
# Purpose:     Import USA Translations
#
# Author:      Chris Hoy
#
# Created:     March 2016
# Copyright:  (c) 2016
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
from turbogears import database
import xlrd
import logging
import simplejson
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import DataSourceTranslations, PRmaxOutletTypes, PRMaxRoles, Interests
from turbogears.database import session


def _run():
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "", ["sourcedir=", "check", "remove_old="])
	sourcedir = None

	for option, params in options:
		if option in ("--sourcedir",):
			sourcedir = params

	if sourcedir == None:
		print "Missing Source Directory"
		return

	inserts = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "MagazineUSA.xlsx"))
	xls_sheet_matched = workbook.sheet_by_name('Matched')
		
	for rnum_matched in range(1, xls_sheet_matched.nrows):
		english = ''
		keywords = []
		sourcetext = xls_sheet_matched.cell_value(rnum_matched, 0)
		
		if type(sourcetext) is float:
			sourcetext = str(int(sourcetext)).strip()
		else:
			sourcetext = str(sourcetext).strip()    

		media_channel = xls_sheet_matched.cell_value(rnum_matched, 2).strip()
		outlettype = session.query(PRmaxOutletTypes).filter(PRmaxOutletTypes.prmax_outlettypename.ilike(media_channel)).scalar()
		prmax_outlettypeid = unicode(outlettype.prmax_outlettypeid) if outlettype else None
		for cnum_matched in xrange(3, xls_sheet_matched.ncols):
			english = english + ':' + xls_sheet_matched.cell_value(rnum_matched, cnum_matched)
		
		while english.endswith(':'):
			english = english[0:len(english)-1]
		while english.startswith(':'):
			english = english[1:len(english)]
		
		for interestname in english.strip().split(":"):
			interestname = interestname.strip()
			interestid = session.query(Interests.interestid).\
		          filter(Interests.interestname.ilike(interestname)).\
		          filter(Interests.customerid == -1).scalar()
			if interestid:
				keywords.append(interestid)
			else:
				interests = session.query(Interests).filter(Interests.interestname.ilike(interestname)).all()
				if interests:
					interests[0].customerid = -1
					keywords.append(interests[0].interestid)
				else:
					print interestname
		keywords = simplejson.dumps(keywords)

		tmp = session.query(DataSourceTranslations).\
	          filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Usa).\
	          filter(DataSourceTranslations.fieldname == "interests").\
	          filter(DataSourceTranslations.sourcetext == sourcetext).scalar()
		if tmp:
			if prmax_outlettypeid != tmp.translation or \
		           english != tmp.english or \
		           keywords != tmp.extended_translation:
				session.begin()
				tmp.translation = prmax_outlettypeid
				tmp.english = english
				tmp.extended_translation = keywords
				session.commit()
		else:
			inserts.append({"fieldname": "interests",
		                        "sourcetext": sourcetext,
		                        "sourcetypeid" : Constants.Source_Type_Usa,
		                        "translation" : prmax_outlettypeid,
		                        "english" : english,
		                        "extended_translation" : keywords,
		                        })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()


if __name__ == '__main__':
	_run()
