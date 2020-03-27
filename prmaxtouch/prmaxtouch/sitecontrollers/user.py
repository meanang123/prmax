# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        user.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import JSONValidatorInterests
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, RestSchema

from prcommon.model import UserGeneral
from ttl.base import stdreturn, duplicatereturn


class UserController(SecureController):
	""" User interface """

#######################################################
## Preferences
#######################################################

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory = std_state_factory)
	def user_list(self, *argv, **params):
		""" list of uses for drop down  """

		params["icustomerid"] = params["customerid"]
		return UserGeneral.user_list(params)
