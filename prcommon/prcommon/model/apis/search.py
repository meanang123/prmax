# -*- coding: utf-8 -*-
""" apilogin """
#-----------------------------------------------------------------------------
# Name:        apilogin.py
# Purpose:
# Author:      Chris Hoy
#
# Created:    15/10/203
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------
import logging
from prcommon.model.searchsession import SearchSession
from prcommon.model.search.search import ApiSearching
import prcommon.Constants as Constants

from ttl.dict import DictExt

LOGGER = logging.getLogger("prcommon.model")

class ApiSearch(object):
	""" do a search"""

	@staticmethod
	def results_view(params):
		"""Get a list of results"""

		params["apiview"] = True

		return SearchSession.getDisplayPage(params)


	@staticmethod
	def delete_selection(user_id, searchtypeid=Constants.Search_Standard_Type, selection=Constants.Search_SelectedAll):
		"""Delete a selection in the list """

		return SearchSession.DeleteSelection(
		  user_id,
		  searchtypeid,
		  selection)

	@staticmethod
	def do_search(params):
		"""do api search """

		data = ApiSearching.do_search(DictExt(params))

		return dict(total=data['total'])


	SEARCH_TYPE_KEY = "search_type"
	SEARCH_TYPE_OUTLET = "outlet"
	SEARCH_TYPE_EMPLOYEE = "employee"

	SEARCH_TYPE_OUTLET_OUTLET_NAME = "outlet_searchname"
	SEARCH_TYPE_OUTLET_INTERESTS = "outlet_interests"

	SEARCH_TYPE_EMPLOYEE_NAME = "employee_searchname"
	SEARCH_TYPE_EMPLOYEE_ROLES = "employee_roles"
	SEARCH_TYPE_EMPLOYEE_INTERESTS = 'employee_interests'
	SEARCH_TYPE_EMPLOYEE_COUNTRIES = 'employee_countryid'
	SEARCH_TYPE_EMPLOYEE_TYPES = 'employee_outlettypes'





