# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_translations.py
# Purpose:     Import Nijgn Translations
#
# Author:      Chris Hoy
#
# Created:     April 2016
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
		print ("Missing Source Directory")
		return


	#import media types
	inserts_mediatypes = []
	workbook_mediatypes = xlrd.open_workbook(os.path.join(sourcedir, "mediatypes.xlsx"))
	xls_sheet_mediatypes = workbook_mediatypes.sheet_by_name('nigjh_mediatypes')
	for rnum in xrange(1, xls_sheet_mediatypes.nrows):
		sourcetext = xls_sheet_mediatypes.cell_value(rnum, 0)
		translation = xls_sheet_mediatypes.cell_value(rnum, 1).strip()
		english = str(xls_sheet_mediatypes.cell_value(rnum, 3)).strip()
		prmax_outlettypeid = int(xls_sheet_mediatypes.cell_value(rnum, 2))
		prmax_outlettypename = xls_sheet_mediatypes.cell_value(rnum, 3).strip()

		inserts_mediatypes.append({"fieldname": "media-type",
	                         "sourcetext": sourcetext,
	                         "sourcetypeid" : Constants.Source_Type_Nijgh,
	                         "translation" : prmax_outlettypeid,
	                         "english" : english
	                         })

	if inserts_mediatypes:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_mediatypes)
		session.commit()


	inserts_frequencies = []
	workbook_frequencies = xlrd.open_workbook(os.path.join(sourcedir, "frequencies.xls"))
	xls_sheet_frequencies = workbook_frequencies.sheet_by_name('frequencies')
	for rnum in xrange(1, xls_sheet_frequencies.nrows):
		if type(xls_sheet_frequencies.cell_value(rnum, 0)) is float:
			sourcetext = str(int(xls_sheet_frequencies.cell_value(rnum, 0))).strip()
		else:
			sourcetext = str(xls_sheet_frequencies.cell_value(rnum, 0)).strip()    
		#sourcetext = xls_sheet_frequencies.cell_value(rnum, 0)
		des_text = int(xls_sheet_frequencies.cell_value(rnum, 1))
		english = xls_sheet_frequencies.cell_value(rnum, 2).lower().strip()

		inserts_frequencies.append({"fieldname": "frequency-type",
	                         "sourcetext": sourcetext,
	                         "sourcetypeid" : Constants.Source_Type_Nijgh,
	                         "translation" : english,
	                         "english" : des_text
	                         })
	if inserts_frequencies:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_frequencies)
		session.commit()

	#import jobs translations
	inserts_jobs = []
	workbook_jobs = xlrd.open_workbook(os.path.join(sourcedir, "jobs.xls"))
	xls_sheet_jobs = workbook_jobs.sheet_by_name('jobs')
	for rnum in xrange(1, xls_sheet_jobs.nrows):
		sourcetext = xls_sheet_jobs.cell_value(rnum, 0)
		if type(sourcetext) is float:
			sourcetext = str(int(sourcetext)).strip()
		else:
			sourcetext = str(sourcetext).strip()    
		des_text = xls_sheet_jobs.cell_value(rnum, 1).strip()
		english = xls_sheet_jobs.cell_value(rnum, 2).strip()

		inserts_jobs.append({"fieldname": "job-title",
	                         "sourcetext": sourcetext,
	                         "sourcetypeid" : Constants.Source_Type_Nijgh,
	                         "translation" : des_text,
	                         "english" : english
	                         })

	if inserts_jobs:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_jobs)
		session.commit()

	# media channels
	inserts = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "classifications.xlsx"))
	xls_sheet_keywords = workbook.sheet_by_name('ONDERWERP')
	
	for rnum in xrange(1, xls_sheet_keywords.nrows):
		
		sourcetext = xls_sheet_keywords.cell_value(rnum, 0).lower().strip()
		des_text = xls_sheet_keywords.cell_value(rnum, 1).lower().strip()
		#english = xls_sheet_keywords.cell_value(rnum, 2).lower().strip()
		#outlettype = session.query(PRmaxOutletTypes).filter(PRmaxOutletTypes.prmax_outlettypename.ilike('Newspapers - National newspapers')).scalar()
		#outlettype = session.query(PRmaxOutletTypes).filter(PRmaxOutletTypes.prmax_outlettypename.ilike(des_text)).scalar()
		#prmax_outlettypeid = unicode(outlettype.prmax_outlettypeid) if outlettype else None
		keywords = []
		english_matched = ''
		
		for cnum in xrange(3, xls_sheet_keywords.ncols):
			english_matched = english_matched+ ':' + xls_sheet_keywords.cell_value(rnum, cnum)
	
		while english_matched.endswith(':'):
			english_matched = english_matched[0:len(english_matched)-1]
		while english_matched.startswith(':'):
			english_matched = english_matched[1:len(english_matched)]
	
		for interestname in english_matched.strip().split(":"):
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
					print (interestname)
		keywords = simplejson.dumps(keywords)		

		tmp = session.query(DataSourceTranslations).\
		  filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Nijgh).\
		  filter(DataSourceTranslations.fieldname == "classification").\
		  filter(DataSourceTranslations.sourcetext == sourcetext).scalar()
		if tmp:
			if english_matched != tmp.english or \
			   keywords != tmp.extended_translation:
				session.begin()
				tmp.english = english
				tmp.extended_translation = keywords
				session.commit()
		else:
			inserts.append({"fieldname": "classification",
			                "sourcetext": sourcetext,
			                "sourcetypeid" : Constants.Source_Type_Nijgh,
			                "translation" : sourcetext,
			                "english" : english_matched,
			                "extended_translation" : keywords
			                })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()





if __name__ == '__main__':
	_run()
