# -*- coding: utf-8 -*-
"Subject Controller "
#-----------------------------------------------------------------------------
# Name: subjects.py
# Purpose:
#              functions
#
# Author:      Chris Hoy
#
# Created:           10/06/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureControllerAdmin
import ttl.tg.validators as tgvalidators
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 BooleanValidator, RestSchema, JSONValidatorInterests, IntNull
from prcommon.model import Subject, SubjectInterest
from ttl.base import stdreturn, duplicatereturn

class SubjectAddMappingSchema(PrFormSchema):
	"schema"
	interestid = validators.Int()
	subjectid = IntNull()

class SubjectDeleteSchema(PrFormSchema):
	"schema"
	subjectid = validators.Int()

class SubjectController(SecureControllerAdmin):
	""" """
	require = identity.in_group("dataadmin")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of all subject mappings """

		return Subject.get_rest_page_research(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SubjectAddMappingSchema(), state_factory=std_state_factory)
	def add_mapping(self, *args, **params):
		""" Add a mapping """

		if "subjectname" in  params:
			if Subject.exists(params["subjectname"],  -1):
				return duplicatereturn()

		SubjectInterest.add_mapping(params)

		return stdreturn(data = SubjectInterest.get_row(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SubjectDeleteSchema(), state_factory=std_state_factory)
	def delete_subject(self, *args, **params):
		""" Delete Subject """

		Subject.delete(params["subjectid"])

		return stdreturn( subjectid = params["subjectid"] )


