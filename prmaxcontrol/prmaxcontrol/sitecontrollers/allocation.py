# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        allocation.py
# Purpose:
#
# Author:      
#
# Created:     12/12//2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, identity, validators, error_handler
from prcommon.model import Customer, User, CustomerGeneral, CustomerAllocation, Report, PaymentMethods, AuditTrail, PriceCode, PRMaxAdmin, Task
from prcommon.accounts.admin import PaymentSystemNew
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler, pr_form_error_handler
from ttl.tg.controllers import SecureControllerAdmin, set_output_as
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema, FloatToIntValidator
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
import ttl.tg.validators as tgvalidators
from ttl.model import BaseSql


class CustomerAllocationSchema(PrFormSchema):
	" customer allocation "
	customerpaymentallocationid = validators.Int()
	
	
class AllocationController(SecureControllerAdmin):
	"""Allocation Controller"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def allocation_details(self, *argv, **params):
		""" Allocation Details """


		return BaseSql.grid_to_rest_ext(
			CustomerAllocation.getGridPageAllocations(params),
			params["offset"],
			True if "customerpaymentallocationid" in params else False)	
		
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customer_to_allocate(self, *argv, **params):
		""" List of invoices/payments/adjustments for a customer """

		return CustomerAllocation.grid_to_rest_ext(
			CustomerAllocation.getGridPage(params),
			params["offset"],
			True if "customerpaymentallocationid" in params else False)	

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def allocation_get_details(self, *argv, **params):
		""" get detaild for re-allocation """

		return stdreturn(data=CustomerAllocation.getDetailsFromKey(params))	
	
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def allocation_reallocate(self, *argv, **params):
		""" add new allocation to item  """

		return stdreturn(data=CustomerAllocation.update_allocations(params))	
	
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerAllocationSchema(), state_factory=std_state_factory)
	def allocation_delete(self, *argv, **params):
		""" delete an allocation """

		CustomerAllocation.delete(params)
		return stdreturn()
	