# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        selenium  .py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:     02/03/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

from ttl.selenium import SeleniumExt
import unittest
from selenium import *

class PrmaxWebBase(unittest.TestCase):
	""" base class for selenium test"""
	# default selenium server details
	# this needs to be started before these test can be run
	seleniumHost = 'localhost'
	seleniumPort = str(4444)

	# browser info
	FireFox = FIREFOX
	Chrome = CHROME
	IEExplorer = IE
	Safari = "*safari"

	# default browser
	browserStartCommand = "*firefox"

	# default login details
	username = "Chris"
	password = "qwert"

	# default prmax location
	browserURL = "http://localhost"


	def setUp(self):
		""" default test start function """
		print "Using selenium server at " + self.seleniumHost + ":" + self.seleniumPort
		print "Browser is " + self.browserStartCommand

		self.selenium = SeleniumExt(self.seleniumHost,
									self.seleniumPort,
									self.browserStartCommand,
									self.browserURL)
		self.selenium.start()

	def tearDown(self):
		""" default stop"""
		self.selenium.stop()

	def do_login(self):
		""" common method to make sure the user is logged in """
		sel  = self.selenium
		sel.open("/login")
		sel.type("user_name", self.username)
		sel.type("password", self.password)
		sel.click("login")
		sel.wait_for_page_to_load("30000")
		# this is part of the default template
		self.assertEqual("Prmax Main", sel.get_title())
		# this is needed fot all the js and pages to be build
		sel.wait(7)

	def do_quick_outlet_name(self , search_text , count):
		""" does a basic search on the outlet name in the quick search form
		this should always have at least on result """

		self.do_login()

		sel = self.selenium
		sel.click_and_wait("dijit_form_Button_0")
		sel.click("dijit_form_TextBox_1")
		sel.type("dijit_form_TextBox_1", search_text)
		sel.click_and_wait("std_search_search", 7)
		self.do_check_result_count(sel, count )

	def do_check_result_count(self, sel, count ):
		self.assertNotEqual("total: %d" % count, sel.get_text("std_view_tb.countinfo").lower())

	def do_check_result_count_zero(self, sel ):
		self.assertEqual("total: 0", sel.get_text("std_view_tb.countinfo").lower())


