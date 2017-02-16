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

class WebSearchBase( object ):
	""" common test  """

	def do_freelance_name_search(self , search_text , count):
		""" does a basic search on the outlet name in the quick search form
		this should always have at least on result """

		self.do_login()

		sel = self.selenium
		sel.click_and_wait("dijit_form_Button_0")
		sel.click_and_wait("dijit_layout__TabButton_10")
		sel.click("dijit_form_TextBox_6")
		sel.type("dijit_form_TextBox_6", search_text)
		sel.click_and_wait("std_search_search", 7)
		self.assertNotEqual("total: %d" % count, sel.get_text("std_view_tb.countinfo").lower())

	def test_quick_outlet_name_results(self):
		self.do_quick_outlet_name ( "the times", 0 )

	def test_quick_outlet_name_no_results(self):
		self.do_quick_outlet_name ( "zcvas", 1 )

	def test_freelance_name_results(self):
		self.do_freelance_name_search( "smith" , 0 )



class TestWebSearchFireFox( WebSearchBase, PrmaxWebBase ):
	""" does the test on a firefox broswer"""

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.FireFox
		PrmaxWebBase.setUp(self)

class TestWebSearchIEExplorer( WebSearchBase, PrmaxWebBase ):
	""" does the test on a IE explorer instance """

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.IEExplorer
		PrmaxWebBase.setUp(self)

class TestWebSearchSafari( WebSearchBase, PrmaxWebBase ):
	""" does the test on a safari browse"""

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.Safari
		PrmaxWebBase.setUp(self)





