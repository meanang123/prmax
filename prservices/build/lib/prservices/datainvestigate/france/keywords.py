# -*- coding: utf-8 -*-
"""France data"""
#-----------------------------------------------------------------------------
# Name:        emailsender.py
# Purpose:     
#
# Author:      Stamatia Vatsi
#
# Created:     03/05/2017
# Copyright:  (c) 2017
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
from turbogears import database
import xlrd, xlwt
import logging
import simplejson
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlet import Outlet, OutletProfile, Employee, Contact, Communication
from prcommon.model.communications import Communication, Address
LOGGER = logging.getLogger("prcommon.model")
from prcommon.model import DataSourceTranslations, PRmaxOutletTypes, PRMaxRoles, Interests, OutletInterests
from turbogears.database import session

FRANCEID = 2
NEWSCURRENTAFFAIRS = 2048
NATIONALNEWS = 2500
INTERNATIONALNEWS = 460
REGIONALNEWS = 1287
LOCALNEWS = 461

def _run():
	""" run the application """

	fr_outlets = session.query(Outlet).\
		filter(Outlet.customerid == -1).\
		filter(Outlet.sourcetypeid == 2).\
	    filter(Outlet.countryid == FRANCEID).\
	    filter(Outlet.prmax_outlettypeid.in_((1,6,10))).all()
	
	for outlet in fr_outlets:
		session.begin()
		
		prmax_outlettypeid = outlet.prmax_outlettypeid
		outletinterests = [x.interestid for x in session.query(OutletInterests).\
	        filter(OutletInterests.outletid == outlet.outletid).all()]

		if prmax_outlettypeid == 1:
			for outletinterest in outletinterests:
				if outletinterest not in (NEWSCURRENTAFFAIRS,NATIONALNEWS,INTERNATIONALNEWS):
					session.query(OutletInterests).filter(OutletInterests.interestid == outletinterest).filter(OutletInterests.outletid == outlet.outletid).delete()
					session.flush()
			if NEWSCURRENTAFFAIRS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = NEWSCURRENTAFFAIRS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
			if NATIONALNEWS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = NATIONALNEWS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
			if INTERNATIONALNEWS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = INTERNATIONALNEWS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
		elif prmax_outlettypeid == 6:
			for outletinterest in outletinterests:
				if outletinterest not in (NEWSCURRENTAFFAIRS,REGIONALNEWS):
					session.query(OutletInterests).filter(OutletInterests.interestid == outletinterest).filter(OutletInterests.outletid == outlet.outletid).delete()
					session.flush()
			if NEWSCURRENTAFFAIRS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = NEWSCURRENTAFFAIRS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
			if REGIONALNEWS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = REGIONALNEWS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
		elif prmax_outlettypeid == 10:
			for outletinterest in outletinterests:
				if outletinterest not in (NEWSCURRENTAFFAIRS,LOCALNEWS):
					session.query(OutletInterests).filter(OutletInterests.interestid == outletinterest).filter(OutletInterests.outletid == outlet.outletid).delete()
					session.flush()
			if NEWSCURRENTAFFAIRS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = NEWSCURRENTAFFAIRS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
			if LOCALNEWS not in outletinterests:
				outletinterest = OutletInterests(
				    interestid = LOCALNEWS,
				    outletid = outlet.outletid
				)
				session.add(outletinterest)
				session.flush()
		session.commit()
			

if __name__ == '__main__':
	_run()
