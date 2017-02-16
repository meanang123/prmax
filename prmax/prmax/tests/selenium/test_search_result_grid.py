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

#sel.click("std_view_tb.markoptions")
#sel.click("std_view_tb.mark.menu.invertmarks_text")
#sel.click("std_view_tb.markoptions")


class WebSearchResultGridBase( object ):
	""" common test  """

	def test_clear(self):
		self.do_quick_outlet_name("the times", 0 )
		sel  = self.selenium
		sel.click_and_wait("std_view_tb.clearall")
		self.do_check_result_count_zero(sel)

	def test_mark_all(self):
		self.do_quick_outlet_name("the times", 0 )
		sel  = self.selenium
		sel.click("std_view_tb.markoptions")
		sel.click("std_view_tb.mark.menu.markall_text")
		info = sel.get_text("std_view_tb.countinfo").lower()
		self.assertEqual(-1, info.find("selected"))

	def test_clear_all(self):
		self.do_quick_outlet_name("the times", 0 )
		sel  = self.selenium
		sel.click("std_view_tb.markoptions")
		sel.click("std_view_tb.mark.menu.clear_text")
		info = sel.get_text("std_view_tb.countinfo").lower()
		self.assertEqual(-1, info.find("selected"))

class TestWebSearchResultGridFireFox( WebSearchResultGridBase, PrmaxWebBase ):
	""" does the test on a firefox broswer"""

	def setUp(self):
		self.browserStartCommand = PrmaxWebBase.FireFox
		PrmaxWebBase.setUp(self)

