# -*- coding: utf-8 -*-
''' Embedded Check Pages '''
#-----------------------------------------------------------------------------
# Name:        check_pages.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:	   29/03/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
#
import os
from turbogears import database
from ttl.tg.config import read_config
from datetime import datetime, timedelta
import unittest

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.cyberwatch.soapinterface import CSWCommand, CSWNoseTest

class CyberWatchTest(unittest.TestCase):
	"CyberWatchTest"

	def test_basic_search_news(self):
		"basic search and results"

		command = CSWCommand()
		command.search_all(start_date=datetime.now() - timedelta(days=50),
			                 index=CSWCommand.Index_News,
			                 keywords=["Cookery", "School"],
			                 extra_search=["meta.country.id=3", ])

		results = CSWNoseTest()
		command.do_search(results)

		assert results.nbrrows != 0


	def test_basic_search_facebook(self):
		"basic search and results"

		command = CSWCommand()
		command.search_all(start_date=datetime.now() - timedelta(days=50),
			                 index=CSWCommand.Index_Facebook,
			                 keywords=["food", ],
		                   field="text")

		results = CSWNoseTest()
		command.do_search(results)

		assert results.nbrrows != 0
