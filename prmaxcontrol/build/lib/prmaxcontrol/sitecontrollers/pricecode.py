# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        pricecode.py
# Purpose:
#
# Author:
#
# Created:     Dec 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, identity, validators, error_handler
from prcommon.model import Customer, User, CustomerGeneral, CustomerAllocation, Report, PaymentMethods, PriceCode, AuditTrail,BaseSql
from prcommon.accounts.admin import PaymentSystemNew
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler, pr_form_error_handler
from ttl.tg.controllers import SecureControllerAdmin
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
import prcommon.Constants as Constants
import ttl.tg.validators as tgvalidators


class PriceCodeSchema(PrFormSchema):
	""" schema """
	pricecodeid = validators.Int()

class PriceCodeAddSchema(PrFormSchema):
	""" schema """
	prmaxmoduleid = validators.Int()
	customersourceid = validators.Int()
	fixed_salesprice = validators.Number()
	fixed_renewalprice = validators.Number()
	monthly_salesprice = validators.Number()
	monthly_renewalprice = validators.Number()
	concurrentusers = validators.Number()
	paid_months = validators.Int()

class PriceCodeUpdateSchema(PrFormSchema):
	""" schema """
	pricecodeid = validators.Int()
	prmaxmoduleid = validators.Int()
	customersourceid = validators.Int()
	fixed_salesprice = validators.Number()
	fixed_renewalprice = validators.Number()
	monthly_salesprice = validators.Number()
	monthly_renewalprice = validators.Number()
	concurrentusers = validators.Number()
	paid_months = validators.Int()


class PriceCodeController(SecureControllerAdmin):
	"""
	Admin Customer Methods
	"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PriceCodeAddSchema(), state_factory=std_state_factory)
	def pricecode_add(self, *argv, **params):
		""" add new price code  """

		if PriceCode.exists(params):
			return duplicatereturn()

		params["pricecodeid"] = PriceCode.add(params)
		return stdreturn(data=PriceCode.get(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PriceCodeSchema(), state_factory=std_state_factory)
	def pricecode_delete(self, *argv, **params):
		""" delete a price code if not in use """

		PriceCode.delete(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PriceCodeUpdateSchema(), state_factory=std_state_factory)
	def pricecode_update(self, *argv, **params):
		""" delete a price code if not in use """

		if PriceCode.exists(params):
			return duplicatereturn()

		PriceCode.update(params)
		return stdreturn(data=PriceCode.get(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def pricecodes(self, *argv, **params):
		""" list of price codes """

		return PriceCode.grid_to_rest_ext(
		    PriceCode.get_grid_page(params),
		    params["offset"],
		    True if "pricecodeid" in params else False)


