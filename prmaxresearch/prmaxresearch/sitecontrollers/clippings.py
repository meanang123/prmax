# -*- coding: utf-8 -*-
"research clippings"
#-----------------------------------------------------------------------------
# Name:        clippings
# Purpose:
# Author:      Chris Hoy
#
# Created:
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, BooleanValidator, IntNull
from prcommon.model import OutletExternalLinkGeneral
from ttl.base import stdreturn

class DataSourceIdSchema(PrFormSchema):
	"schema"
	outletexternallinkid = validators.Int()

class UpdateSchema(PrFormSchema):
	"schema"
	outletexternallinkid = validators.Int()
	outletid = IntNull()
	ignore = BooleanValidator()

class ClippingsController(SecureController):
	""" internal security """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_link(self, *args, **params):
		""" list all the roles int the system"""

		return OutletExternalLinkGeneral.get_rest_page(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_outlets(self, *args, **params):
		""" list all the roles int the system"""

		if args:
			params['outletid'] = int(args[0])

		return OutletExternalLinkGeneral.list_outlets(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DataSourceIdSchema(), state_factory=std_state_factory)
	def get_outlet_trans_record(self, *args, **params):
		""" Update Record """

		return stdreturn(data=OutletExternalLinkGeneral.get(params["outletexternallinkid"]))

	get_outlet_trans_record

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateSchema(), state_factory=std_state_factory)
	def update_outlet_trans(self, *args, **params):
		""" Update Record """

		OutletExternalLinkGeneral.update(params)

		return stdreturn(data=OutletExternalLinkGeneral.get(params["outletexternallinkid"]))

