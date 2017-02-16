# -*- coding: utf-8 -*-
'''  '''
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
from datetime import date, timedelta, datetime
from turbogears import database
from ttl.tg.config import read_config

import unittest
import ttl.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), ("test.cfg", ), None)
# connect to database
database.bind_meta_data()

from prcommon.model.madaptive.madaptiveaccess import MadaptiveAccess

class MediaToolkitTest(unittest.TestCase):
	"MediaToolkitTest"

	def test_basic_search(self):
		"basic search and results"
		engine = MadaptiveAccess()

		feed = "http://new.m-adaptive.com/rss?feed_id=245&sig=1db0d1387c95816cb84733e1df53f7a9e414786d7bdfc1c9f4624671&t=1467802443"

		data = engine.execute_search(feed)

		assert data["success"] == Constants.Return_Success


	def test_basic_search_failure(self):
		"basic search and results"
		engine = MadaptiveAccess()
		feed = "http://new.m-adaptive.com/rss?feed_id=245"

		data = engine.execute_search(feed)

		assert data["success"] == Constants.Return_Failed
