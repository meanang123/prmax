# -*- coding: utf-8 -*-
"""Import Prospects"""
#-----------------------------------------------------------------------------
# Name:
# Purpose:     Import Prospects
#
# Author:      Chris Hoy
#
# Created:     10/09/2012
# Copyright:  (c) 2012
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
import csv
from datetime import datetime
from turbogears import database
from turbogears.database import session
import logging
LOGGER = logging.getLogger("pprcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import UnSubscribe, UnSubscribeReason,  Prospect, \
     ProspectCompany, ProspectType,  ProspectSource,  ProspectRegion

def _run( ):
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:], "" , ["file"])
	Reason_Col = 0
	Email_Col = 1

	session.begin()

	# import propsects
	prospect_source = {}
	for row in session.query(ProspectSource):
		prospect_source[row.prospectsourcename.lower()] = row.prospectsourceid
	prospect_types = {}
	for row in session.query(ProspectType):
		prospect_types[row.prospecttypename.lower()] = row.prospecttypeid
	prospect_companies = {}
	for row in session.query(ProspectCompany):
		prospect_companies[row.prospectcompanyname.lower()] = row.prospectcompanyid
	prospect_region = {}
	for row in session.query(ProspectRegion):
		prospect_region[row.prospectregionname.lower()] = row.prospectregionid

	records =  []
	Row_Title = 3
	Row_Firstname = 4
	Row_FamilyName = 5
	Row_Email = 6
	Row_Company = 0
	Row_Web = None
	Row_Tel = 2
	Row_Source = 7
	Row_Type = None
	Row_Region =  1

	emails_exists = {}
	reader = csv.reader( file(os.path.normpath(os.path.join(os.path.dirname(__file__),'data/propsects2.csv'))))
	reader.next()
	for row in reader:
		email = row[Row_Email].strip().replace('\xa0', '').replace('\xc2\xc2', '').replace('\xc2', '')
		familyname = row[Row_FamilyName].strip().replace('\xa0', '').replace('\xc2\xc2', '').replace('\xc2', '')
		firstname = row[Row_Firstname].strip().replace('\xa0', '').replace('\xc2\xc2', '').replace('\xc2', '')
		if not email:
			continue
		if email.lower() in emails_exists:
			continue

		emails_exists[email.lower()] = True

		# check for entry in prospects or unsubscribe
		tmp = session.query(Prospect).filter( Prospect.email == email).scalar()
		if tmp:
			print "Email %s Already Exists in prospects" % email
			continue

		tmp = session.query( UnSubscribe).filter( UnSubscribe.email == email).scalar()
		if tmp:
			print "Email %s Already Exists in Unsubscribe" % email
			continue

		ins_row =  dict ( title = row[Row_Title].strip(),
		                  firstname = firstname,
		                  familyname = familyname,
		                  email = email ,
		                  prospectcompanyid = None,
		                  prospecttypeid = Prospect.mapping.c.prospecttypeid.default_extra,
		                  prospectsourceid = 1,
		                  addedby = 1,
		                  prospectregionid = None
		                  )

		# source
		value = row[Row_Source].strip()
		if value:
			if value.lower() not in prospect_source:
				record = ProspectSource( prospectsourcename = value)
				session.add ( record )
				session.flush()
				prospect_source[value.lower()] = record.prospectsourceid
			ins_row["prospectsourceid"] = prospect_source[value.lower()]
		#type
		if Row_Type != None:
			value = row[Row_Type].strip().replace('\xa0', '')
			if value:
				if value.lower() not in prospect_types:
					record = ProspectType( prospecttypename = value)
					session.add ( record )
					session.flush()
					prospect_types[value.lower()] = record.prospecttypeid
				ins_row["prospecttypeid"] = prospect_types[value.lower()]
		# company
		value = row[Row_Company].strip().replace('\xa0', '')
		if value:
			if value.lower() not in prospect_companies:
				record = ProspectCompany( prospectcompanyname = value)
				session.add ( record )
				session.flush()
				prospect_companies[value.lower()] = record.prospectcompanyid
			ins_row["prospectcompanyid"] = prospect_companies[value.lower()]

		# Prospect region
		if Row_Region !=  None:
			value = row[Row_Region].strip().replace('\xa0', '')
			if value:
				if value.lower() not in prospect_region:
					record = ProspectRegion( prospectregionname = value)
					session.add ( record )
					session.flush()
					prospect_region[value.lower()] = record.prospectregionid
				ins_row["prospectregionid"] = prospect_region[value.lower()]

		records.append(ins_row)

	session.execute(Prospect.mapping.insert(), records)

	session.commit()


if __name__ == '__main__':
	print "Starting ", datetime.now()
	_run(  )
	print "Existing ", datetime.now()
