# -*- coding: utf-8 -*-
"""Quest Search"""
#-----------------------------------------------------------------------------
# Name:        search.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:     22/02/2013
# RCS-ID:      $Id:  $
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler
from prcommon.model import OutletGeneral

from ttl.tg.errorhandlers import pr_form_error_handler, \
	 pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from ttl.tg.validators import std_state_factory, OpenRestSchema

class SearchController(OpenSecureController):
	"""Handles required  information from the search function and does the
	searching"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def list_outlet_rest(self, *args, **params):
		""" Simple search based on the outletname
		"""
		return OutletGeneral.get_research_list ( params )

