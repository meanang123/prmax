# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        user.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     14/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, config
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from prmaxapi.model import LoginTokens, User, Customer

class TokenSchema(tgvalidators.Schema):
	""" Token adding schema """
	allow_extra_fields = True
	userid = tgvalidators.Int()
	customertypeid = tgvalidators.Int()

class LoginSchema(tgvalidators.Schema):
	""" Token adding schema """
	userid = tgvalidators.Int()
	customertypeid = tgvalidators.Int()
	force_logout = tgvalidators.BooleanValidator()

class TokenController(OpenSecureController):
	"""  Token access system"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TokenSchema())
	def gettoken(self, *args, **kw):
		""" add an entry into the research system for chnages """

		data = LoginTokens.check_access(kw)
		if data:
			return dict(success="FA", data=data)

		user = User.query.get(kw["userid"])
		cust = Customer.query.get(user.customerid)
		if cust.getConcurrentExeeded(kw["userid"]):
			return dict(success="FA", message="Concurrent User Licence Exceeded")

		return dict(success="OK", tokenid=LoginTokens.add_login(kw["userid"], config.get('prmaxapi.token_life')))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LoginSchema())
	def login_api(self, *args, **kw):
		""" Login to the api
		return the active token
		"""



