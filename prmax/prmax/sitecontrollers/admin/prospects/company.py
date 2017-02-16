# -*- coding: utf-8 -*-
"""SOE admin"""
#-----------------------------------------------------------------------------
# Name:        company.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     25/07/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import ProspectCompany
from ttl.base import stdreturn, duplicatereturn

class PPRCompanyUpdate(PrFormSchema):
	"""Schema """
	prospectcompanyid = validators.Int()

class CompanyController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of prospects """

		if args:
			params["prospectcompanyid"] =  int( args[0])


		return ProspectCompany.list_of_companies( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def add_company(self, *argv, **params):
		""" Add Company """

		if ProspectCompany.exists( -1,  params["prospectcompanyname"]):
			return duplicatereturn()

		prospectcompanyid = ProspectCompany.add ( params )

		return stdreturn ( data = ProspectCompany.get ( prospectcompanyid ))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PPRCompanyUpdate(), state_factory = std_state_factory)
	def update_company(self, *argv, **params):
		""" Update Company """

		if ProspectCompany.exists( params["prospectcompanyid"],  params["prospectcompanyname"]):
			return duplicatereturn()

		ProspectCompany.update ( params )

		return stdreturn ( data = ProspectCompany.get ( params["prospectcompanyid"] ))
