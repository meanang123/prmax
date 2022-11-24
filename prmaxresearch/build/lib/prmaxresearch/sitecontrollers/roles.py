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

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 JSONValidatorListInt, JSONValidatorInterests, RestSchema, SimpleFormValidator
from prcommon.model import PRMaxRoles, PRMaxRolesWords
from ttl.base import stdreturn, duplicatereturn


@SimpleFormValidator
def PRMaxRoleWordsTypeSchema_post(value_dict, state, validator):
	"""creats all the parameters needed be passed to the list user selection
method"""
	def _fixup(word):
		words = word.split(" ")
		return [ word + "%" for word in words]

	value_dict['word'] = _fixup(value_dict.get('word','').lower())

class PRMaxRoleWordsSchema(PrFormSchema):
	""" ggghh """
	chained_validators = (PRMaxRoleWordsTypeSchema_post,)

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
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def rolesall(self, *args, **params ):
		""" list all the roles int the system"""

		return PRMaxRoles.get_rest_list(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" Add a new role"""
		if PRMaxRoles.exists ( params ) :
			return duplicatereturn()

		return  stdreturn( data = PRMaxRoles.add ( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRolesSchema(), state_factory=std_state_factory)
	def role_set_visible(self, *args, **params):
		""" get the extended prmax role details"""

		return  stdreturn( data = PRMaxRoles.set_visible ( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRolesSchema2(), state_factory=std_state_factory)
	def update_synonims(self, *args, **params):
		""" get the extended prmax role details"""

		return  stdreturn(data = PRMaxRoles.update_synonims ( params) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRolesSchema(), state_factory=std_state_factory)
	def getext(self, *args, **params):
		""" get the extended prmax role details"""

		return  stdreturn(data = PRMaxRoles.get_ext ( params["prmaxroleid"] ) )





	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def find(self, *args, **params):
		""" get the extended prmax role details"""
		return  stdreturn( data = PRMaxRoles.find( params["prmaxroleid"], params["prmaxrole"] ) )
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRoleWordsSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **params):
		"""gets a list of interests based upon the user selection
		and the filter type"""
		return  stdreturn(data=PRMaxRolesWords.get_user_selection( params ))

