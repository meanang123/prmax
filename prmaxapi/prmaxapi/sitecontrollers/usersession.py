# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        usersession.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     10/11/2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler, config
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from ttl.base import stdreturn, errorreturn

from prmaxapi.model import LoginTokens

class LoginSchema(tgvalidators.Schema):
	""" Token adding schema """
	allow_extra_fields = True
	userid = tgvalidators.Int()
	customertypeid = tgvalidators.Int()
	force_logout = tgvalidators.BooleanValidator()

class LogoutSchema(tgvalidators.Schema):
	""" Token adding schema """
	allow_extra_fields = True
	userid = tgvalidators.Int2Null()
	usersessionid = tgvalidators.Int2Null()

class ActiveUsersSchema(tgvalidators.Schema):
	""" List of active users for customer"""
	customerid = tgvalidators.Int2Null()
	userid = tgvalidators.Int2Null()

class SessionController(OpenSecureController):
	"""  Token access system"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LoginSchema())
	def start_session(self, *args, **params):
		""" Login to the api return the active token
		"""

		# this check to see if the user/customer has acess rights for the api services
		data = LoginTokens.check_session_access(params)
		if data:
			return errorreturn(data)

		#  this function check to see if the customer/user can login based on concurrent connections etc
		data = LoginTokens.check_able_to_login_in(params)
		if data:
			return errorreturn(data)

		# returns login token for main api service
		return stdreturn(usersessionid=LoginTokens.get_active_session(
			    params["userid"],
			    config.get('pprmaxapi.token_life', 600)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LogoutSchema())
	def end_session(self, *args, **params):
		""" Login to the api return the active token
		"""

		LoginTokens.close_session(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ActiveUsersSchema())
	def active_users(self, *args, **params):
		""" Login to the api return the active token
		"""

		return stdreturn(users=LoginTokens.active_users(params))





