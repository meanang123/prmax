# -*- coding: utf-8 -*-
"DistributionTemplatesController"
#-----------------------------------------------------------------------------
# Name:        DistributionTemplates
# Purpose:
#
# Author:      Chris Hoy
# Created:
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, PrGridSchema
from ttl.base import stdreturn, duplicatereturn
from prcommon.model import GeneralDistributionTemplates

class TemplateAddSchema(PrFormSchema):
	"schema"
	customerid = validators.Int()
	distributiontemplatetypeid = validators.Int()

class TemplateIdSchema(PrFormSchema):
	"schema"
	distributiontemplateid = validators.Int()

class TemplateUpdateSchema(PrFormSchema):
	"schema"
	distributiontemplateid = validators.Int()


class DistributionTemplatesController(SecureController):
	""" DistributionTemplatesController """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TemplateAddSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" Add a new template"""

		if GeneralDistributionTemplates.exists(params):
			return duplicatereturn()

		params["distributiontemplateid"] = GeneralDistributionTemplates.add(params)

		return stdreturn(data=GeneralDistributionTemplates.get_display(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def templates_list(self, *args, **params):
		""" list of questions """

		if args:
			params['distributiontemplateid'] = int(args[0])

		return GeneralDistributionTemplates.list_templates(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TemplateIdSchema(), state_factory=std_state_factory)
	def load(self, *args, **params):
		""" Load Details for edit """

		return stdreturn(data=GeneralDistributionTemplates.load(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TemplateUpdateSchema(), state_factory=std_state_factory)
	def update(self, *args, **params):
		""" Update """

		if GeneralDistributionTemplates.exists(params):
				return duplicatereturn()

		GeneralDistributionTemplates.update(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TemplateIdSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" Delete """

		GeneralDistributionTemplates.delete(params)

		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def templates_list_dropdown(self, *argv, **params):
		""" returns a list of templates """

		return GeneralDistributionTemplates.get_list(params)



