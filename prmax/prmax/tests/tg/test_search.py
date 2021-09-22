# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        test_searching.py
# Purpose:     Test the search system
#
# Author:       Chris Hoy
#
# Created:     25/02/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009
#-----------------------------------------------------------------------------

from prmax.tests.tg._base import PRMaxBase
import prmax.Constants as Constants

class TestSearchController( PRMaxBase ):
	""" Test interaction with the interst controller """

	def test_quick_no_criteira(self):
		""" get a list of all the interest in the system"""

		#search_partial
		self.initSecurity()
		print ("Test Empty Query")
		response = self.app.get('/search/dosearch',
								self._get_quick_search(),
								headers={'Cookie': self.session_id })
		obj = response.json
		assert obj['success'] == "OK", "Response Error"
		assert obj['data']['total'] == 0, "Found should not be found"

		print ("Test Outlet Name Search")
		command = self._get_quick_search()
		command['quick_searchname'] = "t"
		response = self.app.get('/search/dosearch',
								command,
								headers={'Cookie': self.session_id })
		obj = response.json
		assert obj['success'] == "OK", "Response Error"
		assert obj['data']['total'] != 0, "No Outlets Found"
		nbr = obj['data']['total']

		print ("Test Outlet Name Search with partial match")
		command['search_partial'] = 1
		response = self.app.get('/search/dosearch',
								command,
								headers={'Cookie': self.session_id })
		obj = response.json
		assert obj['success'] == "OK", "Response Error"
		assert obj['data']['total'] != 0, "No Outlets Found"

		print ("Patial Match found more?")
		assert obj['data']['total'] > nbr, "Partial match did find more"

		print ("Test Characters")
		command = self._get_quick_search()
		command['quick_searchname'] = """!"£%^&*(){}[]@'#~"""
		response = self.app.get('/search/dosearch',
								command,
								headers={'Cookie': self.session_id })
		assert obj['success'] == "OK", "Response Error"

	def _get_quick_search(self):
		""" get default search options """
		return dict(search_type = "quick",
					quick_searchname = "",
					quick_types = "",
					quick_contact = "",
					quick_interests = "",
					quick_coverage = "" ,
					mode = Constants.Search_Mode_Add)


