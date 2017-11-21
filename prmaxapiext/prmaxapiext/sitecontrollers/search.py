# -*- coding: utf-8 -*-
"""apis"""
#-----------------------------------------------------------------------------
# Name:        search.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     10/11/2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.base import stdreturn
from prcommon.model import ApiSearch

class SearchSchema(tgvalidators.Schema):
	""" Token adding schema """
	pass

class SearchController(SecureController):
	"""  base for apis """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SearchSchema())
	def do_search(self, *args, **params):
		""" do the search """

		ApiSearch.do_search(params)

		return stdreturn(data=ApiSearch.result_stats(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=tgvalidators.RestSchema())
	def results(self, *args, **params):
		""" page current results
		"""
		return ApiSearch.results_view(params)



class TillSalesController(OpenSecureController):
	""" Till Sales controller """

	@expose('json')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PPRFormSchema(), state_factory=ppr_std_state_factory)
	def sales_json(self, *args, **params):
		"""
		json document of sales allows for multiple rows
		"""

		StockedGeneral.process_sales_head_office_level(simplejson.load(request.body.fp), params)

		return stdreturn()








