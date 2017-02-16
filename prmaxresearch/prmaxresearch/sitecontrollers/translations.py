# -*- coding: utf-8 -*-
"research roles"
#-----------------------------------------------------------------------------
# Name:        translations
# Purpose:
# Author:      Chris Hoy
#
# Created:
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import DataFeedsGeneral
from ttl.base import stdreturn

class SourceTypeSchema(PrFormSchema):
	sourcetypeid = validators.Int()

class DataSourceIdSchema(PrFormSchema):
	datasourcetranslationid = validators.Int()

class TranslationController(SecureController):
	""" internal security """
	require = identity.in_group("dataadmin")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SourceTypeSchema(), state_factory=std_state_factory)
	def get_for_source(self, *args, **params):
		""" Add a new role"""

		return stdreturn(data=DataFeedsGeneral.sourcefield(params["sourcetypeid"]))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list all the roles int the system"""

		return DataFeedsGeneral.get_rest_page(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DataSourceIdSchema(), state_factory=std_state_factory)
	def get_record(self, *args, **params):
		""" Gte Record """

		return stdreturn(data=DataFeedsGeneral.get(params["datasourcetranslationid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DataSourceIdSchema(), state_factory=std_state_factory)
	def update(self, *args, **params):
		""" Update Record """

		DataFeedsGeneral.update(params)

		return stdreturn(data=DataFeedsGeneral.get(params["datasourcetranslationid"]))

