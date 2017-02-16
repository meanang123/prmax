# -*- coding: utf-8 -*-
"LanguageController"
#-----------------------------------------------------------------------------
# Name:        languages
# Purpose:
#
# Author:      Chris Hoy
# Created:
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler,  \
     validators, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import Languages
from ttl.base import stdreturn, duplicatereturn

class LanguagesGetSchema(PrFormSchema):
	"schema"
	languageid = validators.Int()

class LanguageController(SecureController):
	""" LanguageController """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **params):
		""" list of seleced languages"""
		return stdreturn( data = Languages.get_user_selection( params ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of language  """

		if len(args) > 0:
			params["languageid"] = int(args[0])

		return  Languages.get_list_languagues ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if Languages.exists ( params["languagename"]):
			return duplicatereturn()

		languageid = Languages.add( params)

		return stdreturn( data = Languages.get( languageid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LanguagesGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if Languages.exists ( params["languagename"],  params["languageid"]):
			return duplicatereturn()

		Languages.update( params)

		return stdreturn( data = Languages.get( params["languageid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LanguagesGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get language  """

		return stdreturn( data = Languages.get( params["languageid"]))
