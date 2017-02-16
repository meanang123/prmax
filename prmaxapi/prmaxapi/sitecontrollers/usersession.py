# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        usersession.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     27/11/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, \
	 error_handler, config
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from prmaxapi.model import LoginTokens, User, Customer

class LoginSchema(tgvalidators.Schema):
	""" Token adding schema """
	userid = tgvalidators.Int()
	customertypeid = tgvalidators.Int()
	force_logout = tgvalidators.BooleanValidator()

class LogoutSchema(tgvalidators.Schema):
	""" Token adding schema """
	usersessionid = tgvalidators.String()

class TokenController(OpenSecureController):
	"""  Token access system"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LoginSchema())
	def start_session(self, *args,  **kw):
		""" Login to the api
		return the active token
		"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LoginSchema())
	def end_session(self, *args,  **kw):
		""" Login to the api
		return the active token
		"""


