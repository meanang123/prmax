# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        audit.py
# Purpose:
#
# Author:      
#
# Created:     12/12/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, identity, validators, error_handler
from prcommon.model import Customer, User, CustomerGeneral, CustomerAllocation, Report, PaymentMethods, AuditTrail, PriceCode, PRMaxAdmin, Task
from prcommon.accounts.admin import PaymentSystemNew
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler, pr_form_error_handler
from ttl.tg.controllers import SecureControllerAdmin, set_output_as
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema, FloatToIntValidator, DateRangeValidator
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
import ttl.tg.validators as tgvalidators
from ttl.model import BaseSql


class CustomerIdSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()

class PRCustomerFinancial2Schema(PrGridSchema):
	""" Customer Listing """
	unallocated = BooleanValidator()
	moneyonly = BooleanValidator()

class AuditTrailIdSchema(PrFormSchema):
	""" report id schema"""
	audittrailid = validators.Int()	

class PartnerFinancilaListSchema(RestSchema):
	"schema"
	daterange = DateRangeValidator()

	
class AuditController(SecureControllerAdmin):
	"""
	Admin Customer Methods
	"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRCustomerFinancial2Schema(), state_factory=std_state_factory)
	def customer_financial(self, *argv, **params):
		""" get the audit list """


		return BaseSql.grid_to_rest_ext(
			AuditTrail.getFinancialDataGridPage(params),
			params["offset"],
			True if "audittrailid" in params else False)	
	
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PartnerFinancilaListSchema(), state_factory=std_state_factory)
	def partners_financial(self, *argv, **params):
		""" get the audit list for partner """

		return BaseSql.grid_to_rest_ext(
			AuditTrail.getFinancialPartnersDataGridPage(params),
			params["offset"],
			True if "audittrailid" in params else False)	
	
	@expose(content_type="application/pdf")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AuditTrailIdSchema(), state_factory=std_state_factory)
	def viewpdf(self, *args, **params):
		""" view a specific pdf report """

		# load audit info
		reportoutput = AuditTrail.getReportData(params["audittrailid"])
		return set_output_as("pdf", reportoutput,
		                     "PRMaxLabels_%d.pdf"% params["audittrailid"])

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AuditTrailIdSchema(), state_factory=std_state_factory)
	def viewhtml(self, *args, **params):
		""" view a specific html report """

		# load audit info
		return AuditTrail.query.get(params["audittrailid"]).document
	
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def audit(self, *argv, **params):
		""" get the audit list """

		return BaseSql.grid_to_rest_ext(
			AuditTrail.getDataGridPage(params),
			params["offset"],
			True if "audittrailid" in params else False)	
