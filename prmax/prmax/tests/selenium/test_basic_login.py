# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        do basic searchs .py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:     02/03/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

from _base import PrmaxWebBase
import re

class WebLoginBase( object ):
	""" common test  """

	def test_login(self):
		self.do_login()

	def test_logout(self):
		self.do_login()
		sel = self.selenium
		sel.click("//span[@id='dijit_form_Button_4']")
		self.failUnless(re.search(r"^Logout of Prmax[\s\S]$", sel.get_confirmation()))
		sel.wait_for_page_to_load("30000")
		self.assertEqual("Prmax login", sel.get_title())

class TestWebLoginFireFox( WebLoginBase, PrmaxWebBase ):
	""" does the test on a firefox broswer"""

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.FireFox
		PrmaxWebBase.setUp(self)

class TestWebLoginIEExplorer( WebLoginBase, PrmaxWebBase ):
	""" does the test on a IE explorer instance """

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.IEExplorer
		PrmaxWebBase.setUp(self)

class TestWebLoginSafari( WebLoginBase, PrmaxWebBase ):
	""" does the test on a safari browse"""

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.Safari
		PrmaxWebBase.setUp(self)





