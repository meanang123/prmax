# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        PRMaxRoles.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27/06/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator, JSONValidator

from prmax.model import PRMaxRolesWords, SearchSession, PRMaxRoles
import prmax.Constants as Constants

#########################################################
## validators
#########################################################

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

@SimpleFormValidator
def PRMaxApplyRolesTypeSchema_post(value_dict, state, validator):
	""" """
	value_dict['searchtypeid'] = Constants.Search_Standard_Type
	#value_dict['deduplicate'] = True

class ApplyRolesSchema(PrFormSchema):
	roles = JSONValidator()
	chained_validators = (PRMaxApplyRolesTypeSchema_post,)

class PRMaxRolesSchema(PrFormSchema):
	prmaxroleid = validators.Int()

#########################################################
## controlllers
#########################################################

class PRMaxRolesController(SecureController):
	""" User interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ApplyRolesSchema(), state_factory=std_state_factory)
	def applyroles(self, *args, **kw):
		""" apply roles to search session """
		kw["deduplicate"] = 1
		SearchSession.ApplyRoleTOSession( kw )
		return dict(success="OK", data = SearchSession.getSessionCount( kw ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRoleWordsSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **kw):
		"""gets a list of interests based upon the user selection
		and the filter type"""
		return  dict(success="OK", data=PRMaxRolesWords.get_user_selection(kw))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRolesSchema(), state_factory=std_state_factory)
	def getext(self, *args, **kw):
		""" get the extended prmax role details"""
		return  dict(success = "OK", data = PRMaxRoles.get_ext ( kw["prmaxroleid"] ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def find(self, *args, **kw):
		""" get the extended prmax role details"""
		return  dict(success = "OK", data = PRMaxRoles.find( kw["prmaxroleid"], kw["prmaxrole"] ) )



