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
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema

from prmax.model import Preferences,  Customer, User, UserView
from ttl.base import stdreturn, duplicatereturn

#########################################################
## validators
#########################################################

class PreferenceInterfaceSchema(PrFormSchema):
	""" validateord for the user preference interface """
	interface_font_size = validators.Int()

class UserAdminSchema(PrFormSchema):
	""" validateord for the user preference interface """
	ruserid = validators.Int()

class PreferenceGeneralSchema(PrFormSchema):
	""" perference schema """

	user_countries = JSONValidatorInterests()


#########################################################
## controlllers
#########################################################

class UserController(SecureController):
	""" User interface """

#######################################################
## Preferences
#######################################################

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def preferences_get(self, *args, **kw):
		""" return the users current settings"""

		return stdreturn( data = Preferences.get(kw['user_id']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def preferences_password_update(self, *args, **kw):
		""" changes the current users password"""

		Preferences.update_password(kw)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PreferenceGeneralSchema(), state_factory=std_state_factory)
	def preferences_general_update(self, *args, **kw):
		"""update the users general settings"""

		Preferences.update_general(kw)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PreferenceInterfaceSchema(), state_factory=std_state_factory)
	def preferences_itf_update(self, *args, **kw):
		""" update the users iterface settings"""

		Preferences.update_itf(kw)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def preferences_show_startup(self, *args, **kw):
		""" Change user startup flag """

		Preferences.update_show_startup(kw)
		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def add(self, *args, **kw):
		""" Change user startup flag """

		if not Customer.user_able_to_add_check( kw ):
			return duplicatereturn( message = "Licenced User Count Exceeded")

		if User.exists(kw['email']) or User.exists_email(kw['email']):
			return duplicatereturn( message = "Email address already exists")

		userid = User.addUser( kw )

		return stdreturn( data = UserView.query.get(userid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory = std_state_factory)
	def list(self, *argv, **kw):
		""" list user for a customer """

		kw["icustomerid"] = kw["customerid"]
		return User.getDataGridPage(kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UserAdminSchema(), state_factory = std_state_factory)
	def update(self, *argv, **kw):
		""" update a user """

		if User.exists(kw['email'], kw["ruserid"]) or User.exists_email(kw['email'], kw["ruserid"]):
			return duplicatereturn ( message = "Email address already exists")

		User.update ( kw )

		return stdreturn( data = UserView.query.get(kw["ruserid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def delete(self, *argv, **kw):
		""" Delete a user """

		User.DeleteUser ( kw["ruserid"] )
		return stdreturn


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def update_password(self, *argv, **kw):
		""" update users password """

		User.update_password ( kw )
		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_get_settings(self, *argv, **kw):
		""" get researcher settings """

		return stdreturn( user = User.research_get_settings ( kw ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_settings(self, *argv, **kw):
		""" update researcher settings """

		if User.exists ( kw["email_address"], kw["userid"] ) :
			return duplicatereturn()

		User.research_update_settings ( kw )
		return stdreturn()



