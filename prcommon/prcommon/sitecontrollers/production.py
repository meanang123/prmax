# -*- coding: utf-8 -*-
"""ProductionCompany """
#-----------------------------------------------------------------------------
# Name:        production.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     07/11/2012
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, \
     PrGridSchema, ExtendedDateValidator, RestSchema
import ttl.tg.validators as tgvalidators
from prcommon.model import ProductionCompany
from ttl.base import stdreturn, duplicatereturn, samereturn

class ProductionCompanyAddSchema(PrFormSchema):
	""" schema """
	pass

class ProductionCompanyGetSchema(PrFormSchema):
	""" schema """
	productioncompanyid = validators.Int()


class ProductionCompanyController( object ):
	""" ProductionCompany Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of circulationsources  """

		if len(args) > 0:
			params["productioncompanyid"] = int(args[0])

		return  ProductionCompany.get_list_production_companies ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProductionCompanyAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if ProductionCompany.exists ( params["productioncompanydescription"]):
			return duplicatereturn()

		productioncompanyid = ProductionCompany.add( params)

		return stdreturn( data = ProductionCompany.get( productioncompanyid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProductionCompanyGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if ProductionCompany.exists ( params["productioncompanydescription"],  params["productioncompanyid"]):
			return duplicatereturn()

		ProductionCompany.update( params)

		return stdreturn( data = ProductionCompany.get( params["productioncompanyid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProductionCompanyGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get circulationsources  """

		return stdreturn( data = ProductionCompany.get( params["productioncompanyid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProductionCompanyGetSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" delete production company """

		ProductionCompany.delete( params["productioncompanyid"])

		return stdreturn()

