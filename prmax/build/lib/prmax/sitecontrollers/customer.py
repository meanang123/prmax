# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        customer.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     29/05/2008
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController, set_output_as
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema
from prmax.model import Preferences, Customer, User, AuditTrail
from ttl.base import stdreturn

#########################################################
## validators
#########################################################

class PreferenceInterfaceSchema(PrFormSchema):
	""" validateord for the user preference interface """
	interface_font_size = validators.Int()

class AuditTrailIdSchema(PrFormSchema):
	""" Audit Trail Id """
	audittrailid = validators.Int()


#########################################################
## controlllers
#########################################################

class CustomerController(SecureController):
	""" Customer and user exposed methods"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def preferences_project_update(self, *args, **kw):
		""" update the current customers project settings """

		Preferences.update_projectname(kw)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def get(self, *args, **kw):
		""" get the current customers details"""

		return stdreturn(data=Customer.getForEdit(kw['customerid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def update(self, *args, **kw):
		""" update the details"""

		return Customer.update(kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def logoff_user(self, *args, **kw):
		""" For concurrent system log off specific user"""

		User.logout_other_users("-1", kw["old_user_id"])

		return stdreturn(old_user_id=kw["old_user_id"])


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def financial_history(self, *args, **kw):
		""" Get a list of invoices for a customer  """

		return AuditTrail.customer_financial_history(kw)


	@expose(content_type="application/pdf")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AuditTrailIdSchema(), state_factory=std_state_factory)
	def view_pdf(self, *args, **kw):
		""" view a specific pdf report """

		# load audit infor
		reportoutput = AuditTrail.getReportData(kw["audittrailid"])
		return set_output_as("pdf", reportoutput, "PRmaxInv_Copy_%d.pdf" % kw["audittrailid"])


