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

# initiale interface to tg to get at data model
read_config(os.getcwd(), ("test.cfg", ), None)
# connect to database
database.bind_meta_data()

from prcommon.model import MediaToolKitAccess


class MediaToolkitTest(unittest.TestCase):
	"CyberWatchTest"

	def test_basic_search_news(self):
		"basic search and results"
		engine = MediaToolKitAccess(1)

		data = engine.execute_search(37943, 6106508, from_time=datetime.now() - timedelta(days=1))

		print len(data)

		for clip in data:
			print clip["id"], clip["type"], clip["url"]

	def test_list_all_avaliable_searchs(self):

		engine = MediaToolKitAccess(1)

		data = engine.list_all_avaliable_searchs()

		for row in data:
			print row
