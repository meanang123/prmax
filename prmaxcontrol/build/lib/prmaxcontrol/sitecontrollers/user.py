# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        user.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     29/05/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from prcommon.model import UserGeneral, Customer, User, UserView
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, BooleanValidator
from ttl.base import stdreturn, duplicatereturn

class UserAdminSchema(PrFormSchema):
	""" validateord for the user preference interface """
	iuserid = validators.Int()

class UserAdminUpdateSchema(PrFormSchema):
	""" validateord for the user preference interface """
	iuserid = validators.Int()
	isuseradmin = BooleanValidator()
	nodirectmail = BooleanValidator()
	canviewfinancial = BooleanValidator()

#########################################################
## controlllers
#########################################################

class UserController(SecureController):
	""" User interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" Change user startup flag """

		if not Customer.user_able_to_add_check(params):
			return duplicatereturn(message="Licenced User Count Exceeded")

		if User.exists(params['email']) or User.exists_email(params['email']):
			return duplicatereturn(message="Email address already exists")

		userid = User.addUser(params)

		return stdreturn(data=UserView.query.get(userid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UserAdminUpdateSchema(), state_factory=std_state_factory)
	def update(self, *argv, **params):
		""" update a user """

		if User.exists(params['email'], params["iuserid"]) or User.exists_email(params['email'], params["iuserid"]):
			return duplicatereturn(message="Email address already exists")

		User.update_ext(params)

		return stdreturn(data=UserView.query.get(params["iuserid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def delete(self, *argv, **params):
		""" Delete a user """

		User.DeleteUser(params["iuserid"])

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def update_password(self, *argv, **params):
		""" update users password """

		User.update_password(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def user_list(self, *argv, **params):
		""" list of uses for drop down  """

		params["icustomerid"] = params["customerid"]
		return UserGeneral.user_list(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UserAdminSchema(), state_factory=std_state_factory)
	def get_internal(self, *argv, **params):
		""" get details """

		return stdreturn(data=UserView.query.get(params["iuserid"]))




