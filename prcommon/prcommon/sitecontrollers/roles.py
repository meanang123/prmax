# -*- coding: utf-8 -*-
"research roles"
#-----------------------------------------------------------------------------
# Name:        roles
# Purpose:
# Author:      Chris Hoy
#
# Created:
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, \
	 JSONValidatorListInt, JSONValidatorInterests, RestSchema, SimpleFormValidator
from prcommon.model import PRMaxRoles, PRMaxRolesWords
from ttl.base import stdreturn


@SimpleFormValidator
def types_roles_post(value_dict, state, validator):
	"""creats all the parameters needed be passed to the list user selection
method"""
	def _fixup(word):
		"internal"
		words = word.split(" ")
		return [ word + "%" for word in words]

	value_dict['word'] = _fixup(value_dict.get('word','').lower())

class PRMaxRoleWordsSchema(PrFormSchema):
	""" ggghh """
	chained_validators = (types_roles_post,)

class PRMaxRolesSchema(PrFormSchema):
	""" prmax role schema"""
	prmaxroleid = validators.Int()

class PRMaxRolesSchema2(PrFormSchema):
	""" prmax role schema"""
	prmaxroleid = validators.Int()
	roles = JSONValidatorListInt()
	interests = JSONValidatorInterests()

class RolesController(SecureController):
	""" internal security user must be part of admin group """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRoleWordsSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **params):
		"""gets a list of interests based upon the user selection
		and the filter type"""

		return  stdreturn(data=PRMaxRolesWords.get_user_selection( params ))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def job_roles_select(self, *args, **params ):
		""" list all the roles int the system"""

		params["visible"] = 1
		return PRMaxRoles.get_rest_list(params)
