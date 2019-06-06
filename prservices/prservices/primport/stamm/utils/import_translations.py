# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        import_translations.py
# Purpose:     Import STamm Translations
#
# Author:      Chris Hoy
#
# Created:     14/04/2015
# Copyright:  (c) 2015
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

	inserts_frequencies = []
	workbook_frequencies = xlrd.open_workbook(os.path.join(sourcedir, "StammTranslations.xlsx"))
	xls_sheet_frequencies = workbook_frequencies.sheet_by_name('frequency')
	for rnum in xrange(1, xls_sheet_frequencies.nrows):
		if type(xls_sheet_frequencies.cell_value(rnum, 0)) is float:
			sourcetext = str(int(xls_sheet_frequencies.cell_value(rnum, 0))).strip()
		else:
			sourcetext = str(xls_sheet_frequencies.cell_value(rnum, 0)).strip()
		#sourcetext = xls_sheet_frequencies.cell_value(rnum, 0)
		translation = int(xls_sheet_frequencies.cell_value(rnum, 1))
		english = xls_sheet_frequencies.cell_value(rnum, 2).lower().strip()

		inserts_frequencies.append({"fieldname": "frequency-type",
		                            "sourcetext": sourcetext,
		                            "sourcetypeid" : Constants.Source_Type_Stamm,
		                            "translation" : translation,
		                            "english" : english
		                            })
	if inserts_frequencies:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_frequencies)
		session.commit()

	inserts_circulationauditdate = []
	workbook_circulation = xlrd.open_workbook(os.path.join(sourcedir, "StammTranslations.xlsx"))
	xls_sheet_circulation = workbook_circulation.sheet_by_name('circulation-audit-period')
	for rnum in xrange(1, xls_sheet_circulation.nrows):
		sourcetext = xls_sheet_circulation.cell_value(rnum, 0).strip()
		translation = int(xls_sheet_circulation.cell_value(rnum, 1))
		english = xls_sheet_circulation.cell_value(rnum, 2).lower().strip()

		inserts_circulationauditdate.append({"fieldname": "circulation-audit-period",
	                                         "sourcetext": sourcetext,
	                                         "sourcetypeid" : Constants.Source_Type_Stamm,
	                                         "translation" : translation,
	                                         "english" : english
	                                         })
	if inserts_circulationauditdate:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_circulationauditdate)
		session.commit()



'''
	inserts_priority_jobtitles = []
	workbook_pjobtitles = xlrd.open_workbook(os.path.join(sourcedir, "priority_jobtitles.xlsx"))
	xls_sheet_pjobtitles = workbook_pjobtitles.sheet_by_name('jobtitles')
	for rnum in xrange(1, xls_sheet_pjobtitles.nrows):
		sourcetext = xls_sheet_pjobtitles.cell_value(rnum, 2).strip()
		translation = int(xls_sheet_pjobtitles.cell_value(rnum, 1))
		english = xls_sheet_pjobtitles.cell_value(rnum, 0).strip()

		inserts_priority_jobtitles.append({"fieldname": "priority-jobtitles",
		                            "sourcetext": sourcetext,
		                            "sourcetypeid" : Constants.Source_Type_Stamm,
		                            "translation" : translation,
		                            "english" : english
		                            })
	if inserts_priority_jobtitles:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_priority_jobtitles)
		session.commit()

	inserts_languages = []
	workbook_languages = xlrd.open_workbook(os.path.join(sourcedir, "StammTranslations.xlsx"))
	xls_sheet_languages = workbook_languages.sheet_by_name('languages')
	for rnum in xrange(1, 48):
		if type(xls_sheet_languages.cell_value(rnum, 0)) is float:
			sourcetext = str(int(xls_sheet_languages.cell_value(rnum, 0))).strip()
		else:
			sourcetext = xls_sheet_languages.cell_value(rnum, 0).strip()
		#sourcetext = xls_sheet_frequencies.cell_value(rnum, 0)
		translation = int(xls_sheet_languages.cell_value(rnum, 1))
		english = xls_sheet_languages.cell_value(rnum, 2).lower().strip()

		inserts_languages.append({"fieldname": "language",
		                            "sourcetext": sourcetext,
		                            "sourcetypeid" : Constants.Source_Type_Stamm,
		                            "translation" : translation,
		                            "english" : english
		                            })
	if inserts_languages:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_languages)
		session.commit()

	inserts_circulationsources = []
	workbook_circulation = xlrd.open_workbook(os.path.join(sourcedir, "StammTranslations.xlsx"))
	xls_sheet_circulation = workbook_circulation.sheet_by_name('circulation')
	for rnum in xrange(1, xls_sheet_circulation.nrows):
		if type(xls_sheet_circulation.cell_value(rnum, 0)) is float:
			sourcetext = str(int(xls_sheet_circulation.cell_value(rnum, 0))).strip()
		else:
			sourcetext = xls_sheet_circulation.cell_value(rnum, 0).strip()
		#sourcetext = xls_sheet_circulation.cell_value(rnum, 0)
		translation = int(xls_sheet_circulation.cell_value(rnum, 1))
		english = xls_sheet_circulation.cell_value(rnum, 2).lower().strip()

		inserts_circulationsources.append({"fieldname": "circulation-source",
	                                "sourcetext": sourcetext,
	                                "sourcetypeid" : Constants.Source_Type_Stamm,
	                                "translation" : translation,
	                                "english" : english
	                                })
	if inserts_circulationsources:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts_circulationsources)
		session.commit()

	# media channels
	inserts = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "Sachgruppe.xlsx"))
	xls_sheet = workbook.sheet_by_name('Sachgruppe')
	for rnum in xrange(1, xls_sheet.nrows):
		sourcetext = xls_sheet.cell_value(rnum, 5)
		des_text = xls_sheet.cell_value(rnum, 10).strip()
		english = xls_sheet.cell_value(rnum, 6).strip()
		outlettype = session.query(PRmaxOutletTypes).filter(PRmaxOutletTypes.prmax_outlettypename.ilike(des_text)).scalar()
		prmax_outlettypeid = unicode(outlettype.prmax_outlettypeid) if outlettype else None
		keywords = []
		for interestname in xls_sheet.cell_value(rnum, 7).strip().split(","):
			interestname = interestname.strip()
			if interestname == "NA":
				continue
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
			filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Stamm).\
		    filter(DataSourceTranslations.fieldname == "classification").\
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
			inserts.append({"fieldname": "classification",
			                "sourcetext": sourcetext,
			                "sourcetypeid" : Constants.Source_Type_Stamm,
			                "translation" : prmax_outlettypeid,
			                "english" : english,
			                "extended_translation" : keywords,
			                })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()


	# job roles
	inserts = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "Ressort_Art.xlsx"))
	xls_sheet = workbook.sheet_by_name('Ressort_Art')
	for rnum in xrange(1, xls_sheet.nrows):
		sourcetext = xls_sheet.cell_value(rnum, 0)
		if type(sourcetext) is float:
			sourcetext = str(int(sourcetext)).strip()
		else:
			sourcetext = sourcetext.encode('utf8').strip()

		des_text = xls_sheet.cell_value(rnum, 5).strip()
		english = xls_sheet.cell_value(rnum, 3).strip()
		jobrole = session.query(PRMaxRoles).\
	        filter(PRMaxRoles.prmaxrole.ilike(des_text)).\
	        filter(PRMaxRoles.visible == True).scalar()
		prmaxroleid = simplejson.dumps([jobrole.prmaxroleid, ] if jobrole else [])
		keywords = []
		tmp = session.query(DataSourceTranslations).\
	        filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Stamm).\
	        filter(DataSourceTranslations.fieldname == "jobtitle-areainterest").\
	        filter(DataSourceTranslations.sourcetext == sourcetext).scalar()
		if tmp:
			if prmaxroleid != tmp.translation or english != tmp.english or keywords != tmp.extended_translation:
				session.begin()
				tmp.translation = prmaxroleid
				tmp.english = english
				tmp.extended_translation = keywords
				session.commit()
		else:
			inserts.append({"fieldname": "jobtitle-areainterest",
		                    "sourcetext": sourcetext,
		                    "sourcetypeid" : Constants.Source_Type_Stamm,
		                    "translation" : prmaxroleid,
		                    "english" : english,
		                    "extended_translation" : keywords,
		                    })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()
'''
if __name__ == '__main__':
	_run()
