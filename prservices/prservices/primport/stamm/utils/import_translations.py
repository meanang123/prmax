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

	# languages
	inserts = []
	workbook = xlrd.open_workbook(os.path.join(sourcedir, "stamm_languages.xlsx"))
	xls_sheet = workbook.sheet_by_name('languages2')
	for rnum in xrange(1, xls_sheet.nrows):
		sourcetext = xls_sheet.cell_value(rnum, 0).encode('utf-8')
		des_text = xls_sheet.cell_value(rnum, 1).strip()
		english = xls_sheet.cell_value(rnum, 1).strip()
		translation = int(xls_sheet.cell_value(rnum, 2))

		inserts.append({"fieldname": "language",
	                    "sourcetext": sourcetext,
	                    "sourcetypeid" : Constants.Source_Type_Stamm,
	                    "translation" : translation,
	                    "english" : english,
	                    })

	if inserts:
		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
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
		sourcetext = str(int(xls_sheet.cell_value(rnum, 0)))
		des_text = xls_sheet.cell_value(rnum, 5).strip()
		english = xls_sheet.cell_value(rnum, 3).strip()
		jobrole = session.query(PRMaxRoles).\
		  filter(PRMaxRoles.prmaxrole.ilike(des_text)).\
		  filter(PRMaxRoles.visible == True).scalar()
		prmaxroleid = simplejson.dumps([jobrole.prmaxroleid, ] if jobrole else [])
		keywords = []
		for interestname in xls_sheet.cell_value(rnum, 6).strip().split(","):
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





if __name__ == '__main__':
	_run()
