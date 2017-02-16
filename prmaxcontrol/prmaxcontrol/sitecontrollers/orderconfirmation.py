# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        order.py
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


class CustomerIdSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()

class CustomerPartnerLiveExtendSchema(PrFormSchema):
	enddate = ISODateValidator()
	icustomerid = validators.Int()
	maxnbrofusersaccounts = validators.Int()
	logins = validators.Int()
	advancefeatures = BooleanValidator()
	
class UpgradeConfirmationSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	logins = validators.Int()
	emailtocustomer = BooleanValidator()
	updatum_start_date = tgvalidators.ISODateValidator()
	confirmation_accepted = BooleanValidator()
	upgrade_confirmation_accepted = BooleanValidator()
	sendinvoice = BooleanValidator()

	maxmonitoringusers = validators.Int()
	updatum_months_free = validators.Int()
	updatum_months_paid = validators.Int()
	international_upgrade = BooleanValidator()

	cost = FloatToIntValidator()
	advcost = FloatToIntValidator()
	updatumcost = FloatToIntValidator()
	internationalcost = FloatToIntValidator()

	media_upgrade = BooleanValidator()
	advance_upgrade = BooleanValidator()
	monitoring_upgrade = BooleanValidator()
	

class PrOrderConfirmationSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	advancefeatures = BooleanValidator()
	updatum = BooleanValidator()
	months_free = validators.Int()
	months_paid = validators.Int()
	logins = validators.Int()
	cost = validators.Number()
	adv_months_free = validators.Int()
	adv_months_paid = validators.Int()
	advcost = validators.Number()
	orderpaymentmethodid = validators.Number()
	taskid = validators.Int()
	emailtocustomer = BooleanValidator()
	orderpaymentmethodid = validators.Int()
	licence_start_date = tgvalidators.ISODateValidator()
	advance_licence_start = tgvalidators.ISODateValidator()
	confirmation_accepted = BooleanValidator()
	saveonly = BooleanValidator()
	has_international_data = BooleanValidator()
	orderpaymentfreqid = validators.Number()
	has_clippings = BooleanValidator()

	maxmonitoringusers = validators.Int()
	updatum_months_free = validators.Int()
	updatum_months_paid = validators.Int()
	updatumcost = validators.Number()
	updatum_start_date = tgvalidators.ISODateValidator()
	has_bundled_invoice = BooleanValidator()

class OrderConfirmationController(SecureControllerAdmin):
	"""
	Admin Customer Methods
	"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def proforma_send(self, *argv, **params):
		"""  Send a proforam invoice """

		reportdatainfo = {}
		reportoptions = params
		# setup payment details
		total = round(float(params['value']) * 100, 0)
		vat = (Constants.VatRate / 100) * total
		reportoptions['total'] = total + vat
		reportoptions['vat'] = vat
		reportoptions['cost'] = total
		reportoptions["licencedetails"] = params["proformatext"]
		reportoptions["customerid"] = params['icustomerid']

		Report.add(
		    params['icustomerid'],
		    Constants.Report_Output_pdf,
		    reportoptions,
		    reportdatainfo,
		    Constants.Report_Template_Invoice_Proforma)

		return stdreturn()	

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpgradeConfirmationSchema(), state_factory=std_state_factory)
	def upgrade_confirmation(self, *argc, **params):
		""" Generate a Upgrade Confirmation for customer and set details """

		PRMaxAdmin.upgrade_confirmation(params)

		return stdreturn()	

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOrderConfirmationSchema(), state_factory=std_state_factory)
	def order_confirmation_send(self, *argc, **params):
		""" Generate a Order Confirmation for customer and set details """

		PRMaxAdmin.send_order_confirmation(params)

		return stdreturn()

	@expose("text/html")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def order_confirmation_send_preview(self, *argc, **params):
		""" Generate a Order Confirmation for customer and set details """

		return PRMaxAdmin.send_order_confirmation_preview(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOrderConfirmationSchema(), state_factory=std_state_factory)
	def order_confirmation_send_save(self, *argc, **params):
		""" Generate a Order Confirmation for customer and set details """

		PRMaxAdmin.send_order_confirmation(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpgradeConfirmationSchema(), state_factory=std_state_factory)
	def upgrade_confirmation_preview(self, *argc, **params):
		""" Generate a preview Upgrade Confirmation for customer and set details """

		return stdreturn(html_preview=PRMaxAdmin.upgrade_confirmation_preview(params))	

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def send_conf_dd(self, *argc, **params):
		""" Generate a DD order confrimation for the customer """

		PRMaxAdmin.send_dd_order_confirmation(params)

		return stdreturn()	
	

