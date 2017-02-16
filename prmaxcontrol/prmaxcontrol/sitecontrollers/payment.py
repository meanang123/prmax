# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        payment.py
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
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema, FloatToIntValidator
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
import prcommon.Constants as Constants
import ttl.tg.validators as tgvalidators
from ttl.model import BaseSql
import ttl.Constants as BaseConstants

import logging
LOGGER = logging.getLogger("prmaxcontrol")

class CustomerIdSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	
class PrSendInvoiceSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	invoice_date = tgvalidators.ISODateValidator()
	licence_start_date = tgvalidators.ISODateValidator()
	advance_licence_start = tgvalidators.ISODateValidator()
	logins = validators.Int()
	isdd = BooleanValidator()
	months_free = validators.Int()
	months_paid = validators.Int()
	advancefeatures = BooleanValidator()
	adv_months_free = validators.Int()
	adv_months_paid = validators.Int()
	cost = validators.Money()
	advcost = validators.Money()
	prepaidaccess = BooleanValidator()
	updatum_months_free = validators.Int()
	updatum_months_paid = validators.Int()
	updatumcost = validators.Money()
	
class PriceCostsSchema(PrFormSchema):
	""" schema """
	advancefeatures = BooleanValidator()
	
class PrOneOffInvoiceSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	invoice_date = tgvalidators.ISODateValidator()
	amount = validators.Money()
	vat = validators.Money()	

class PrAdjustAccountSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	adjustmenttypeid = validators.Int()
	value = validators.Number()
	adjustmentdate = tgvalidators.ISODateValidator()

class PrTakePaymentSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	emailtocustomer = BooleanValidator()

class PRDDCsvSchema(PrFormSchema):
	""" csv shema """
	pay_montly_day = validators.Int()

class PRDDInvoicesSchema(PrFormSchema):
	" prdd invoice "
	pay_montly_day = validators.Int()
	take_date = tgvalidators.ISODateValidator()
	
class PaymentController(SecureControllerAdmin):
	"""Payment Controller"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("")
	def add_manual_invoice(self, *args, **params):
		""" Manual Invoice """

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id
		try:
			PaymentSystemNew.add_manual_invoice(params)
			retd = stdreturn()
		except:
			LOGGER.exception("add_manual_invoice %s", str(params))
			retd = dict(success=BaseConstants.Return_Failed, message="Problem Adding Invoice")

		return formreturn(retd)	

	@expose("")
	def add_manual_credit(self, *args, **params):
		""" Manual Credit """

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id
		params["amount"] = float(params["amount"])
		params["unpaidamount"] = float(params["unpaidamount"])
		params["vat"] = float(params["vat"])
		try:
			PaymentSystemNew.add_manual_credit(params)
			retd = stdreturn()
		except:
			LOGGER.exception("add_manual_credit %s", str(params))
			retd = dict(success=BaseConstants.Return_Failed, message="Problem Adding Invoice")

		return formreturn(retd)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrSendInvoiceSchema(), state_factory=std_state_factory)
	def invoice_send(self, *rgv, **params):
		""" Send a pre invoice """

		PaymentSystemNew.send_pre_invoice(params)
		return stdreturn()	
	
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PriceCostsSchema(), state_factory=std_state_factory)
	def prices_get(self, *argv, **params):
		""" get the value of price based on monthly/fixed term  """

		return stdreturn(cost=PriceCode.get_costs(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOneOffInvoiceSchema(), state_factory=std_state_factory)
	def invoice_one_off_send(self, *argv, **params):
		""" Send a pre invoice """

		PaymentSystemNew.invoice_one_off_send(params)
		return stdreturn()	
	
	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrAdjustAccountSchema(), state_factory=std_state_factory)
	def adjust_account(self, *argv, **params):
		""" Adjust Account """

		PaymentSystemNew.adjustment(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrTakePaymentSchema(), state_factory=std_state_factory)
	def payment_take(self, *argv, **params):
		""" take a payment from a user  """

		PaymentSystemNew.payment_success(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def payment_monthly_take(self, *argv, **params):
		"""Take a payment from a monthly """

		PaymentSystemNew.payment_success(params, True)

		return stdreturn(data=Customer.getPaymentValue(params["icustomerid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDCsvSchema(), state_factory=std_state_factory)
	def payment_dd_reset(self, *argv, **params):
		""" Rest the fields """

		return dict(data=PaymentSystemNew.dd_clear_post_csv(params))
	
	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def payment_dd_failed(self, *argv, **params):
		""" Fail the last dd payment received by from the customer  """

		PaymentSystemNew.fail_last_dd(params)

		return stdreturn()	

	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDCsvSchema(), state_factory=std_state_factory)
	def payment_dd_csv(self, *args, **params):
		""" Cav file of DD fieldds"""

		return set_output_as("csv", PaymentSystemNew.dd_create_csv(params))

	@expose(template="prcommon.templates.payment.dd_invoices_draft")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDCsvSchema(), state_factory=std_state_factory)
	def payment_dd_csv_draft(self, *argv, **params):
		""" Create DD invoices from the period"""

		return dict(data=PaymentSystemNew.dd_create_csv_draft(params))		
	

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDInvoicesSchema(), state_factory=std_state_factory)
	def payment_dd_invoices(self, *argv, **params):
		""" Create DD invoices from the period"""

		return stdreturn(nbr=PaymentSystemNew.dd_invoice_run(params))

	@expose(template="prcommon.templates.payment.dd_invoices_draft")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDInvoicesSchema(), state_factory=std_state_factory)
	def payment_dd_invoices_draft(self, *argv, **params):
		""" Create DD invoices from the period"""

		return dict(data=PaymentSystemNew.dd_invoice_run_draft(params))	