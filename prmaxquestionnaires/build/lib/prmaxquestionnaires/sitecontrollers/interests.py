# -*- coding: utf-8 -*-
"OpenInterestController"
#-----------------------------------------------------------------------------
# Name:        interests
# Purpose:
#
# Author:      Chris Hoy
# Created:    21/02/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from  ttl.tg.errorhandlers import pr_form_error_handler
from ttl.tg.validators import PRmaxOpenFormSchema
from prcommon.model import Interests
from ttl.base import stdreturn


class OpenInterestController(OpenSecureController):
	""" internal security user must be part of admin group """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxOpenFormSchema())
	def listuserselection(self, *args, **params):
		""" list of seleced languages"""


		params['word'] = params.get('word','').lower() + "%"
		params["customerid"] = -1

		return  stdreturn(
		  transactionid = params["transactionid"] ,
		  data = Interests.get_user_selection(params)
		)
