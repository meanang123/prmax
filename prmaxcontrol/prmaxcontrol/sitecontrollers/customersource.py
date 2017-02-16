# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        partners.py
# Purpose:
#
# Author:
#
# Created:     19/01/2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, identity, validators, error_handler
from prcommon.model import Customer, User, CustomerGeneral, CustomerAllocation, Report, PaymentMethods, PriceCode, AuditTrail,BaseSql
from prcommon.model.customersource import CustomerSources
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler, pr_form_error_handler
from ttl.tg.controllers import SecureControllerAdmin
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
import prcommon.Constants as Constants
import ttl.tg.validators as tgvalidators


class CustomerSourceSchema(PrFormSchema):
	""" schema """
	customersourceid = validators.Int()


class CustomerSourceController(SecureControllerAdmin):
	"""
	Admin Customer Methods
	"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerSourceSchema(), state_factory=std_state_factory)
	def get_partner(self, *argv, **params):
		""" list of price codes """

		return stdreturn( data = CustomerSources.get(params))

	@expose("json")
	def update_partner(self, *argv, **params):
		""" update customersource """

		return stdreturn( data = CustomerSources.update(params))
	
