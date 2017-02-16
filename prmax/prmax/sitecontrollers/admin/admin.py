# -*- coding: utf-8 -*-
"""Admin Site Controller"""
#-----------------------------------------------------------------------------
# Name:        admin.py
# Purpose:     Holds all the functions that a sure required to administrat
#              functions would include password add/delete uses in their
#              group, interaction with their part of the bill paying and
#              history systems
#
# Author:      Chris Hoy(over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:  (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, validators, error_handler, \
     exception_handler, controllers, identity, config
from ttl.tg.errorhandlers import pr_std_error_handler, pr_std_exception_handler, \
     pr_form_error_handler
from ttl.tg.controllers import SecureController, set_output_as
from ttl.tg.validators import PrGridSchema, std_state_factory, PrFormSchema, \
     BooleanValidator, FloatToIntValidator, RestSchema, IntNull
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn, \
     licence_exceeded_return
import ttl.tg.validators as tgvalidators
from prmax.utilities.common import addConfigDetails
from prcommon.model import CustomerInvoice, PriceCode, TaskTags
from prmax.model import CustomerExternal, User, Customer, EmailQueue, \
     AuditTrail, Terms, PaymentSystem, Report, ActionLog, \
     PrmaxCustomerInfo, Visit, DemoRequests, Accounting, DataImport, \
     ResearchGeneral, PRMaxAdmin, CustomerAllocation, Task
from  prcommon.model import CustomerPrmaxDataSets, UserGeneral
from prmax.sitecontrollers.admin.newsfeed import NewsFeedController
from prmax.sitecontrollers.admin.seo import SeoAdminController
from prmax.sitecontrollers.admin.partners import PartnerController
from prmax.sitecontrollers.admin.prospects.prospects import ProspectsController
from prmax.sitecontrollers.admin.clippings import ClippingsController

import prmax.Constants as Constants

import logging
LOGGER = logging.getLogger("prmax")

class UpdateUserDetailsSchema(PrFormSchema):
	" udpate user details "
	canviewfinancial = BooleanValidator()
	isuseradmin = BooleanValidator()
	nodirectmail = BooleanValidator()
	iuserid = validators.Int()

class UpdateMonitoringDetailsSchema(PrFormSchema):
	"schema"
	hasmonitoring = BooleanValidator()
	iuserid = validators.Int()

class AuditTrailIdSchema(PrFormSchema):
	""" report id schema"""
	audittrailid = validators.Int()

class PrUpdateDetailsSchema(PrFormSchema):
	""" schema """
	termid = validators.Int()

class PrUserSchema(PrFormSchema):
	""" schema """
	iuserid = validators.Int()

class PrCustomerSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()

class PrCustomerUpdateSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	customersourceid = validators.Int()


class PrReactiveSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	sendemail = BooleanValidator()
	licence_expire = tgvalidators.ISODateValidator()
	assigntoid = validators.Int()

class PrCustomerTypeSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	customertypeid = validators.Int()

class DemoSchema(PrFormSchema):
	""" schema """
	demorequestid = validators.Int()

class DemoSchemaToCustomer(PrFormSchema):
	""" schema """
	demorequestid = validators.Int()
	advancefeatures = BooleanValidator()
	assigntoid = validators.Int()
	customertypeid = validators.Int()

class ActiveCustomerDate(PrFormSchema):
	""" report id schema"""
	active_report_date = validators.DateValidator(empty=True)

class PrCustomerFinancialSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	pay_monthly_value = tgvalidators.FloatToIntValidator()
	next_month_value = tgvalidators.FloatToIntValidator()
	dd_monitoring_value = tgvalidators.FloatToIntValidator()
	dd_advance_value = tgvalidators.FloatToIntValidator()
	dd_international_data_value = tgvalidators.FloatToIntValidator()
	seopaymenttypeid = validators.Int()
	dd_start_day = validators.Int()
	dd_start_month = validators.Int()
	has_bundled_invoice = BooleanValidator()

class PrCustomerFinancialSeoSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	seonbrincredit = validators.Int()

class SupportCustomerSchema(PrFormSchema):
	""" schema """
	userid = validators.Int()
	icustomerid = validators.Number()

class AddCustomerSchema(PrFormSchema):
	""" schema """
	advancefeatures = tgvalidators.BooleanValidator(if_empty=True)
	crm = tgvalidators.BooleanValidator(if_empty=True)

class ModulesCustomerSchema(PrFormSchema):
	""" schema """
	userid = validators.Int()
	icustomerid = validators.Number()
	advancefeatures = tgvalidators.BooleanValidator(if_empty=True)
	crm = tgvalidators.BooleanValidator(if_empty=True)
	updatum = tgvalidators.BooleanValidator()
	seo = tgvalidators.BooleanValidator()
	maxmonitoringusers = validators.Int()
	is_bundle = BooleanValidator()
	has_news_rooms = BooleanValidator()
	has_journorequests = BooleanValidator()
	has_international_data = BooleanValidator()
	has_clippings = BooleanValidator()

class CostModulesSchema(PrFormSchema):
	""" schem for modules included costs """
	termid = validators.Int()
	nbrofloginsid = validators.Int()
	advancefeatures = BooleanValidator()

class PrDDFirstSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	pay_montly_day = validators.Int()
	sub_start_day = validators.Int()

class PrInternalStatusSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	isinternal = tgvalidators.BooleanValidator(if_empty=True)

class ExtendedSubjectSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	has_extended_email_subject = BooleanValidator()



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


class PRTaskUpdateSchema(PrFormSchema):
	""" schema """
	taskid = validators.Int()
	emailactionstatus = BooleanValidator()

class PRTaskSchema(PrFormSchema):
	""" schema """
	taskid = validators.Int()

class PriceCodeSchema(PrFormSchema):
	""" schema """
	pricecodeid = validators.Int()

class PriceCodeAddSchema(PrFormSchema):
	""" schema """
	prmaxmoduleid = validators.Int()
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
	fixed_salesprice = validators.Number()
	fixed_renewalprice = validators.Number()
	monthly_salesprice = validators.Number()
	monthly_renewalprice = validators.Number()
	concurrentusers = validators.Number()
	paid_months = validators.Int()

class CustomerAllocationSchema(PrFormSchema):
	" customer allocation "
	customerpaymentallocationid = validators.Int()

class PRCustomerSettingsSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	customersourceid = validators.Int()

class TaskTagSchema(PrFormSchema):
	""" schema """
	tasktagid = validators.Int()

class PriceCostsSchema(PrFormSchema):
	""" schema """
	#paymentfreqid = validators.Int()
	#nbrloginsid = validators.Int()
	advancefeatures = BooleanValidator()

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


class PRCustomerGridSchema(PrGridSchema):
	""" Customer Listing """
	unallocated = BooleanValidator()

class PRCustomerFinancial2Schema(PrGridSchema):
	""" Customer Listing """
	unallocated = BooleanValidator()
	moneyonly = BooleanValidator()


class PrAdjustAccountSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	adjustmenttypeid = validators.Int()
	value = validators.Number()
	adjustmentdate = tgvalidators.ISODateValidator()

class PrCreditSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	payment_date = tgvalidators.ISODateValidator()
	emailtocustomer = BooleanValidator()
	vat = tgvalidators.FloatToIntValidator()
	cost = tgvalidators.FloatToIntValidator()
	gross = tgvalidators.FloatToIntValidator()


class PRDDInvoicesSchema(PrFormSchema):
	" prdd invoice "
	pay_montly_day = validators.Int()
	take_date = tgvalidators.ISODateValidator()

class PRDDCsvSchema(PrFormSchema):
	""" csv shema """
	pay_montly_day = validators.Int()

class PRImportSchemaSchema(PrFormSchema):
	" import schema "
	no_add_outlet = BooleanValidator()


class PrOneOffInvoiceSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	invoice_date = tgvalidators.ISODateValidator()
	amount = validators.Money()
	vat = validators.Money()

class	DemoStatusSchema(PrFormSchema):
	"""Demo Schema"""
	icustomerid = validators.Int()
	demo = BooleanValidator()
	isadvancedemo = BooleanValidator()
	ismonitoringdemo = BooleanValidator()

class PrTakePaymentSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	emailtocustomer = BooleanValidator()

class PrUPdateDataSetsSchema(PrFormSchema):
	"schema"
	icustomerid = validators.Int()
	prmaxdatasetid = validators.Int()
	customerprmaxdatasetid = IntNull()

class ExtendedSettingsSchema(PrFormSchema):
	"schema"
	icustomerid = validators.Int()
	search_show_job_roles = BooleanValidator()
	search_show_coverage = BooleanValidator()
	search_show_profile = BooleanValidator()
	search_show_smart = BooleanValidator()
	view_outlet_results_colours = BooleanValidator()
	no_distribution = BooleanValidator()
	no_export = BooleanValidator()
	distributionistemplated = BooleanValidator()
	has_clickthrought = BooleanValidator()

class IUserSchema(PrFormSchema):
	"schema"
	iuserid = validators.Int()

class ExternalAdminController(controllers.RootController):
	""" External admin controller """

	partners = PartnerController()

	@expose(template="prmax.templates.eadmin/new_customer")
	def newaccountform(self, *args, **params):
		""" Display the new account form"""
		# default cost is 12 months and 1 user
		params['cost'] = CustomerExternal.cost(dict(termid=4, nbrofloginsid=1))[0] / 100.0
		if not  "isprofessional_only" in params:
			params["isprofessional_only"] = False

		return addConfigDetails(params)

	@expose(template="prmax.templates.eadmin/new_customer")
	def newaccountprofessional(self, *args, **params):
		""" Display the new account form"""
		# default cost is 12 months and 1 user and professional
		params['cost'] = CustomerExternal.cost(dict(termid=4, nbrofloginsid=1, isprofessional=1))[0] / 100.0
		params["isprofessional_only"] = True

		return addConfigDetails(params)


	@expose(template="prmax.templates.eadmin/requestdemo")
	def requestdemo(self, *args, **params):
		"""  Request a Demo """
		params["customertypeid"] = 1
		if "customersourceid" not in params:
			params["customersourceid"] = 5

		return addConfigDetails(params)

	@expose(template="prmax.templates.eadmin/demorequestsubmitted")
	def demorequestsubmitted(self, *args, **params):
		"""  Request a Demo """

		DemoRequests.add(params)
		return addConfigDetails(params)

	@expose(template="prmax.templates.eadmin/payment_restart")
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def payment_restart(self, *args, **params):
		""" payment for on it own  """

		return addConfigDetails(params)

	@expose(template="prmax.templates.eadmin/payment_start")
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def payment_start(self, *args, **params):
		""" start the payment page """

		ret = addConfigDetails(params)
		customer = ret['customer'] = CustomerExternal.query.get(params['customerid'])
		terms = Terms.query.order_by(Terms.termname)
		ret['terms'] = terms.all()
		for term in ret['terms']:
			term.attr = dict(value=term.termid, selected="selected" if term.termid == customer.termid else None)

		params = dict(termid=customer.termid,
		              nbrofloginsid=customer.nbrofloginsid,
		              isprofessional=0)
		params["advancefeatures"] = customer.advancefeatures

		if customer.isdemo:
			params["advancefeatures"] = False

		if customer.crm:
			params["crm"] = True

		if customer.is_bundle:
			params["isprofessional"] = 1

		ret["advancefeatures"] = params["advancefeatures"]

		ret['cost'] = CustomerExternal.cost(params)[2] / 100.00
		ret['isprofessional_only'] = customer.is_bundle

		return ret

	@expose(template="prmax.templates.eadmin/payment_confirmation")
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def payment_confirmation(self, *args, **params):
		""" start the payment page """

		customer = Customer.query.get(params['customerid'])
		customer.email = params["email"]
		if customer.termid != int(params["termid"]):
			CustomerExternal.update_licence(params)
			customer.termid = int(params["termid"])
		#at this point we need to check the advance features flag
		isprofessional = int(params.get("isprofessional", 0))
		if not  isprofessional:
			advancefeatures = False
			if params.get("advancefeatures", "") in("on", "ok", "true"):
				advancefeatures = True
			if customer.advancefeatures != advancefeatures:
				customer.advancefeatures = advancefeatures
		else:
			advancefeatures = True

		ret = addConfigDetails(params)
		ret['customer'] = customer
		ret['protex'] = dict(gateway=config.get("protex.gateway"),
		                     code=config.get("protex.code"),
		                     crypt=PaymentSystem.encode_protex_form(params, customer))
		term = Terms.query.get(customer.termid)
		ret["termname"] = term.termname
		ret['cost'] = CustomerExternal.cost(dict(termid=customer.termid,
		                                         nbrofloginsid=customer.nbrofloginsid,
		                                         advancefeatures=advancefeatures,
		                                         isprofessional=isprofessional))[2] / 100.00

		# http://genshi.edgewall.org/wiki/Documents/templates.htmL
		#					<option selected="{% if termid==4 'selected' else '' %}" value="1">1 Year</option>


		return ret

	@expose(template="prmax.templates.eadmin/payment_success")
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def payment_success(self, *argc, **params):
		""" payment_success """
		try:
			PaymentSystem.protex_success(params)
		except:
			pass

		return addConfigDetails(params)

	@expose(template="prmax.templates.eadmin/payment_proforma_complete")
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def payment_proforma(self, *argc, **params):
		""" request a proforma invoice """
		Report.add(
			params['customerid'],
			Constants.Report_Output_pdf,
			params,
			{},
			Constants.Report_Template_Invoice_Proforma)

		return addConfigDetails(params)


	@expose(template="prmax.templates.eadmin/payment_failure")
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def payment_failure(self, *argc, **params):
		"payment_failure"
		try:
			PaymentSystem.protex_failed(params)
		except:
			pass

		return addConfigDetails(params)


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def proforma(self, *argc, **params):
		""" Gemerate a pro forma invoide """
		customer = CustomerExternal.query.get(params['customerid'])
		if customer.termid != int(params["termid"]):
			CustomerExternal.update_licence(params)
			customer = CustomerExternal.query.get(params['customerid'])

		if customer.is_bundle:
			# add fields
			params["cost"] = Constants.PRmax_Professional_Cost
			params["total"] = Constants.PRmax_Professional_Total
			params["vat"] = params["total"] - params["cost"]
			params["licencedetails"] = "Licence for Prmax Professional version"

		Report.add(
			params['customerid'],
			Constants.Report_Output_pdf,
			params,
			{},
			Constants.Report_Template_Invoice_Proforma)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators={'termid':validators.Int(), 'nbrofloginsid':validators.Int()})
	def cost(self, *argc, **params):
		""" get the cost of the product for the display screen"""
		return stdreturn(data=CustomerExternal.cost(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CostModulesSchema(), state_factory=std_state_factory)
	def cost_modules(self, *argc, **params):
		""" get the cost of the product for the display screen but get the modules from the user record """
		customer = Customer.query.get(params["customerid"])
		if customer.crm:
			params["crm"] = True

		return stdreturn(data=CustomerExternal.cost(params))



	@expose("json")
	@exception_handler(pr_std_exception_handler)
	def new(self, *argc, **params):
		""" Add a new customer to the system """

		## check name existos
		if User.exists(params['email']) or User.exists_email(params['email']):
			return dict(success="DU", message="Email address already exists")

		if CustomerExternal.exists(params['customername']):
			return dict(success="DU", message="Company Already Exists")

		try:
			# account
			acc = CustomerExternal.new(params)
			if params.has_key("proforma"):
				reportdatainfo = {}
				reportoptions = params
				reportoptions['customerid'] = acc['cust'].customerid
				# add report options
				Report.add(
					acc['cust'].customerid,
					Constants.Report_Output_pdf,
					reportoptions,
					reportdatainfo,
					Constants.Report_Template_Invoice_Proforma)

				return stdreturn(
					page="/eadmin/payment_proforma_complete",
					ncustid=acc['cust'].customerid)
			else:
				# login
				CustomerExternal.do_login(acc['user'])
				# goto the payment page
				return stdreturn(
					page="/eadmin/payment_restart",
					ncustid=acc['cust'].customerid)
		except Exception, ex:
			try:
				transaction = CustomerExternal.sa_get_active_transaction()
				transaction.rollback()
			except:
				pass
			raise ex

		return stdreturn(page="/eadmin/payment_restart", ncustid=acc['cust'].customerid)

class InternalAdminController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("admin")

	newsfeed = NewsFeedController()
	seo = SeoAdminController()
	prospects = ProspectsController()
	clippings = ClippingsController()


	@expose(template="prmax.templates.iadmin/main")
	def main(self, *args, **params):
		"""main screen for internal management"""
		return addConfigDetails(params)

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
	@validate(validators=PrCustomerSchema(), state_factory=std_state_factory)
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
	@validate(validators=UpgradeConfirmationSchema(), state_factory=std_state_factory)
	def upgrade_confirmation(self, *argc, **params):
		""" Generate a Upgrade Confirmation for customer and set details """

		PRMaxAdmin.upgrade_confirmation(params)

		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRCustomerGridSchema(), state_factory=std_state_factory)
	def customers(self, *argv, **params):
		""" returns the list of customers for the grid"""

		return Customer.getSearchPage(params)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customer_monthlies(self, *argv, **params):
		""" Returns list of monthies customers"""

		return Customer.getMonltyPage(params)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customers_combo(self, *argv, **params):
		""" returns the list of customers for the grid"""

		return Customer.get_list_page(params)


	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ActiveCustomerDate(), state_factory=std_state_factory)
	def customer_active(self, *args, **params):
		""" view a specific csv report """

		reportoutput = Accounting.getActiveUserAsCsv(params)
		return set_output_as("csv", reportoutput)

	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ActiveCustomerDate(), state_factory=std_state_factory)
	def customer_payments_report(self, *args, **params):
		""" view a specific csv report """

		reportoutput = Accounting.getPaymentHistory(params)
		set_output_as("csv", reportoutput)
		return reportoutput

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators={'customerid':validators.Int()})
	def get_internal(self, *argv, **params):
		""" get the details of a customer to display in the internal system"""
		return stdreturn(data=Customer.get_internal(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators={'customerid':validators.Int(), 'customerstatusid':validators.Int()})
	def changestatus(self, *argv, **params):
		""" Change the status of a customer """

		params['user_id'] = identity.current.user.user_id
		Customer.change_status(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators={'customerid':validators.Int()})
	def sendprimarypassword(self, *argv, **params):
		""" Change the status of a customer """

		params['user_id'] = identity.current.user.user_id
		customer = Customer.query.get(params['customerid'])

		EmailQueue.send_password(customer.email)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def audit(self, *argv, **params):
		""" get the audit list """

		return AuditTrail.getDataGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def users(self, *argv, **params):
		""" get the audit list """

		return User.getDataGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def activityview(self, *argv, **params):
		""" List Current Activity """

		return ActionLog.getGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def activitycustomer(self, *argv, **params):
		""" List Current Activity """

		return ActionLog.getGridPage(params)


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def demorequests(self, *argv, **params):
		""" List of current demo requests"""

		return DemoRequests.getGridPage(params)


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def get_front_page(self, *argv, **params):
		""" Get current front page details"""

		return stdreturn(info=PrmaxCustomerInfo.get(params["icustomerid"], True))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def update_front_page(self, *argv, **params):
		""" update the current front page info for the custmer"""

		PrmaxCustomerInfo.change(params["icustomerid"], params["info"])
		return stdreturn()


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def activeusers(self, *argv, **params):
		""" List Current Activity """

		return Visit.getGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def set_expire_date(self, *argv, **params):
		""" Resets the customer expiry date """

		Customer.set_expire_date(params)

		return stdreturn(data=Customer.get_internal(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def set_collateral_limit(self, *argv, **params):
		"""Set the collateral limit for a customer """

		Customer.set_collateral_size(params["icustomerid"], params["collateral_size"])
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def set_max_emails_for_day(self, *argv, **params):
		"""Set email limit for a customer """

		Customer.set_max_emails_for_day(params["icustomerid"], params["max_emails_for_day"])
		return stdreturn()


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def set_login_count(self, *argv, **params):
		""" Resets the customers login count"""

		Customer.set_login_count(params["icustomerid"],
								             params["logins"],
								             params["user_id"])
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def set_users_count(self, *argv, **params):
		""" Resets the customers login count"""

		Customer.set_user_count(params["icustomerid"],
								            params["nbrofusersaccounts"],
								            params["user_id"])
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def set_email_status(self, *argv, **params):
		"""  change the demo status for an account"""

		status = True if params.get("useemail", "0") == "1" else False
		emailistestmode = True if params.get("emailistestmode", "0") == "1" else False
		Customer.set_email_status(params["icustomerid"],
								              status,
								              emailistestmode,
								              params["user_id"])
		return stdreturn()


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DemoStatusSchema(), state_factory=std_state_factory)
	def set_demo_status(self, *argv, **params):
		"""  change the demo status for an account"""

		Customer.set_demo_status(params["icustomerid"],
		                           params["demo"],
		                           params["isadvancedemo"],
		                           params["ismonitoringdemo"],
		                           params["user_id"])
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def get_user_internal(self, *argv, **params):
		""" get the user details """

		return stdreturn(data=User.get_user_internal(params["iuserid"]))


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def update_user_password(self, *argv, **params):
		""" Update users """
		User.update_password(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateUserDetailsSchema(), state_factory=std_state_factory)
	def update_user_details(self, *argv, **params):
		""" Update users detials"""
		User.update_details(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateMonitoringDetailsSchema(), state_factory=std_state_factory)
	def update_updatum_password(self, *argv, **params):
		""" Update users detials"""

		if params["hasmonitoring"] and User.exceeds_monitor_count(params["iuserid"]):
			return licence_exceeded_return()

		User.update_updatum_details(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUserSchema(), state_factory=std_state_factory)
	def delete_user(self, *argv, **params):
		""" Update users detials"""

		User.DeleteUser(params["iuserid"])

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DemoSchemaToCustomer(), state_factory=std_state_factory)
	def demo_to_customer(self, *argv, **params):
		""" Update users detials"""

		demorequest = DemoRequests.query.get(params["demorequestid"])

		#1. check to see if email/customer exists
		if CustomerExternal.exists(params["customername"]):
			return duplicatereturn(message="Businesss Name Already Exists")

		if User.exists(params["email"]):
			return duplicatereturn(message="Email Address Already Exists")

		# do convert
		result = CustomerExternal.new_from_demo_request(demorequest, params)

		if params.has_key("sendemail"):
			EmailQueue.send_demo_email(result["user"], result["password"], result["cust"])

		return stdreturn(customerid=result["cust"].customerid,
		                  userid=result["user"].user_id)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrReactiveSchema(), state_factory=std_state_factory)
	def re_activate_trial(self, *argv, **params):
		""" reactive an exusting trial """

		if User.EmailUsedElseWhere(params["email"], params["icustomerid"]):
			return errorreturn("Email Address in use by another customer")

		DemoRequests.reactive_demo(params)
		if params["sendemail"]:
			result = User.Reset(params["email"],
			                     params["icustomerid"],
			                     params["displayname"])
			customer = Customer.query.get(params["icustomerid"])
			EmailQueue.send_demo_email(result["user"],
			                         result["password"],
			                         customer)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DemoSchema(), state_factory=std_state_factory)
	def delete_demo(self, *argv, **params):
		""" Update users detials"""

		# delete the row
		DemoRequests.delete(params["demorequestid"])

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DemoSchema(), state_factory=std_state_factory)
	def demo_get_customer(self, *argv, **params):
		"""  Demo details """

		return stdreturn(data=DemoRequests.query.get(params["demorequestid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerUpdateSchema(), state_factory=std_state_factory)
	def update_customer(self, *argv, **params):
		""" Update a customer record """

		# delete the row
		Customer.update_internal(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerFinancialSchema(), state_factory=std_state_factory)
	def update_customer_financial(self, *argv, **params):
		""" Update a customer record """

		ddref = Customer.ddRefUnique(params["icustomerid"], params["dd_ref"])
		if ddref:
			return errorreturn("DD Reference in use by %s " % ddref)

		Customer.update_customer_financial(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerFinancialSeoSchema(), state_factory=std_state_factory)
	def customer_seo_qty_update(self, icustomerid, seonbrincredit, *argv, **params):
		""" Reset the free qty for a customer seo """

		Customer.customer_seo_qty_update(icustomerid, seonbrincredit, params["userid"])

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrTakePaymentSchema(), state_factory=std_state_factory)
	def payment_take(self, *argv, **params):
		""" take a payment from a user  """

		PaymentSystem.payment_success(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCreditSchema(), state_factory=std_state_factory)
	def credit_take(self, *argv, **params):
		""" credit customer  """

		PaymentSystem.credit(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrAdjustAccountSchema(), state_factory=std_state_factory)
	def adjust_account(self, *argv, **params):
		""" Adjust Account """

		PaymentSystem.adjustment(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerSchema(), state_factory=std_state_factory)
	def payment_monthly_take(self, *argv, **params):
		"""Take a payment from a monthly """

		PaymentSystem.payment_success(params, True)

		return stdreturn(data=Customer.getPaymentValue(params["icustomerid"]))


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrDDFirstSchema(), state_factory=std_state_factory)
	def payment_dd_first(self, *argv, **params):
		"""Take the first payment for a dd customer """

		PaymentSystem.dd_first_month(params)

		return stdreturn(data=Customer.getPaymentValue(params["icustomerid"]))


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerSchema(), state_factory=std_state_factory)
	def delete_customer(self, *argv, **params):
		""" delete a customer """

		# delete the row
		return dict(success=Customer.DeleteCustomer(params["icustomerid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerSchema(), state_factory=std_state_factory)
	def profoma_send(self, *argv, **params):
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
	@validate(validators=PrSendInvoiceSchema(), state_factory=std_state_factory)
	def invoice_send(self, *rgv, **params):
		""" Send a pre invoice """

		PaymentSystem.send_pre_invoice(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOneOffInvoiceSchema(), state_factory=std_state_factory)
	def invoice_one_off_send(self, *argv, **params):
		""" Send a pre invoice """

		PaymentSystem.invoice_one_off_send(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRCustomerFinancial2Schema(), state_factory=std_state_factory)
	def customer_financial(self, *argv, **params):
		""" get the audit list """

		return AuditTrail.getFinancialDataGridPage(params)


	@expose(content_type="application/pdf")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AuditTrailIdSchema(), state_factory=std_state_factory)
	def viewpdf(self, *args, **params):
		""" view a specific pdf report """

		# load audit infor
		reportoutput = AuditTrail.getReportData(params["audittrailid"])
		return set_output_as("pdf", reportoutput,
								       "PRMaxLabels_%d.pdf"% params["audittrailid"])

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AuditTrailIdSchema(), state_factory=std_state_factory)
	def viewhtml(self, *args, **params):
		""" view a specific html report """

		# load audit infor
		return AuditTrail.query.get(params["audittrailid"]).document

	@expose("")
	@validate(validators=PRImportSchemaSchema(), state_factory=std_state_factory)
	def import_customer_outlets(self, *args, **params):
		""" import customer outlets """
		addoutlet = True if not params["no_add_outlet"] else False
		importer = DataImport(int(params["icustomerid"]), addoutlet)

		try:
			retd = stdreturn(added=importer.importOutlet(params["private_file"].file))
		except Exception, ex:
			LOGGER.exception("import_customer_outlets")
			retd = dict(success="FA", message=str(ex))

		return "<div><textarea>%s</textarea></div>" %  \
					 self.jsonencoder.encode(retd)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AddCustomerSchema(), state_factory=std_state_factory)
	def new(self, *argv, **params):
		""" Add a new customer """
		error = Customer.checkExists(params)
		if error:
			return error

		return stdreturn(data=Customer.new(params))


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def options(self, *args, **inparams):
		""" data options"""

		return dict(identifier='id', label="name",
								  items=[
								    dict(id=1, type=1, name="Options", children=
								          [dict(_reference=6),
								           dict(_reference=7),
								           dict(_reference=8),
								           dict(_reference=9),
		                       dict(_reference=25),
		                       dict(_reference=29)
								           ]),
								    dict(id=2, type=0, name="Add Customer", content="prmax.customer.InternalAddCustomer"),
								    dict(id=3, type=0, name="Support Users", content="prmax.iadmin.Support"),
								    dict(id=4, type=0, name="Research", content="prmax.iadmin.Research"),
								    dict(id=5, type=0, name="Query", content="prcommon.query.query"),
								    dict(id=6, type=3, name="Sales", children=[
								      dict(_reference=2), dict(_reference=12), dict(_reference=14),
								      dict(_reference=15), dict(_reference=27)]),
								    dict(id=7, type=3, name="Support", children=[
								      dict(_reference=3), dict(_reference=5), dict(_reference=16),
								      dict(_reference=19), dict(_reference=23), dict(_reference=24)]),
								    dict(id=8, type=3, name="Research", children=[dict(_reference=4)]),
								    dict(id=9, type=3, name="Accounts", children=[
								      dict(_reference=10), dict(_reference=11), dict(_reference=17),
								      dict(_reference=18), dict(_reference=20), dict(_reference=21),
		                  dict(_reference=22)]),
								    dict(id=10, type=0, name="DD Invoices's", content="prmax.iadmin.accounts.DDInvoices"),
								    dict(id=11, type=0, name="DD Csv", content="prmax.iadmin.accounts.DDCsv"),
								    dict(id=12, type=0, name="Diary", content="prmax.iadmin.sales.view"),
								    dict(id=14, type=0, name="Demo Requests", content="prmax.iadmin.sales.DemoRequestView"),
								    dict(id=15, type=0, name="Front Screen", content="prmax.iadmin.support.FrontScreen"),
								    dict(id=16, type=0, name="Active Users", content="prmax.iadmin.support.ActiveUsers"),
								    dict(id=17, type=0, name="Reports", content="prmax.iadmin.accounts.Reports"),
								    dict(id=18, type=0, name="DD View", content="prmax.iadmin.accounts.DDView"),
								    dict(id=19, type=0, name="Private Data", content="prmax.iadmin.support.PrivateData"),
								    dict(id=20, type=0, name="Diary", content="prmax.iadmin.accounts.Diary"),
								    dict(id=21, type=0, name="Price Codes", content="prmax.iadmin.accounts.PriceCodes"),
		                dict(id=22, type=0, name="Diary Types", content="prmax.iadmin.TaskTags"),
		                dict(id=23, type=0, name="Mail Queue", content="prmax.iadmin.support.MailQueue"),
		                dict(id=24, type=0, name="List", content="prmax.iadmin.support.seo.view"),
		                dict(id=25, type=3, name="SEO", children=[dict(_reference=24), dict(_reference=26)]),
		                dict(id=26, type=0, name="Complaints", content="prmax.iadmin.support.seo.Complaints"),
		                dict(id=27, type=0, name="News", content="prmax.iadmin.sales.newsfeed.view"),
		                dict(id=29, type=0, name="Prospects", children=[
		                  dict(_reference=30),
		                  dict(_reference=31),
		                  dict(_reference=32),
		                  dict(_reference=33),
		                  dict(_reference=34)]),
		                dict(id=30, type=0, name="Gather", content="prmax.iadmin.sales.prospects.gather.view"),
		                dict(id=31, type=0, name="Companies", content="prmax.iadmin.sales.prospects.companies.view"),
		                dict(id=32, type=0, name="Mailing Lists", content="prmax.iadmin.sales.prospects.mailing.view"),
		                dict(id=33, type=0, name="Bounces", content="prmax.iadmin.sales.prospects.bounces.view"),
		                dict(id=34, type=0, name="Exclusions", content="prmax.iadmin.sales.prospects.exclusions.view")

								  ])

	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ActiveCustomerDate(), state_factory=std_state_factory)
	def research_active(self, *args, **params):
		""" view a specific csv report """

		reportoutput = ResearchGeneral.activityreport(params)
		return set_output_as("csv", reportoutput)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def users_support(self, *argv, **params):
		""" returns the list of customers for the grid"""

		return User.getSupportUserPage(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SupportCustomerSchema(), state_factory=std_state_factory)
	def support_customer_set(self, *argv, **params):
		""" Set support user current customer login """

		User.setSupportCustomer(params["iuserid"], params["icustomerid"])
		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ExtendedSubjectSchema(), state_factory=std_state_factory)
	def update_extended_subject(self, *argv, **params):
		""" Customer has extended email subject """

		Customer.update_extended_subject(params["icustomerid"],
		                                   params["has_extended_email_subject"])
		return stdreturn()


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ModulesCustomerSchema(), state_factory=std_state_factory)
	def update_customer_modules(self, *argv, **params):
		""" Update the customer modules """

		Customer.update_modules(params)

		return stdreturn(data=Customer.get_internal(params))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerSchema(), state_factory=std_state_factory)
	def payment_dd_failed(self, *argv, **params):
		""" Fail the last dd payment received by from the customer  """

		PaymentSystem.fail_last_dd(params)

		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDInvoicesSchema(), state_factory=std_state_factory)
	def payment_dd_invoices(self, *argv, **params):
		""" Create DD invoices from the period"""

		return stdreturn(nbr=PaymentSystem.dd_invoice_run(params))

	@expose(template="prmax.templates.iadmin/dd_invoices_draft")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDInvoicesSchema(), state_factory=std_state_factory)
	def payment_dd_invoices_draft(self, *argv, **params):
		""" Create DD invoices from the period"""

		return dict(data=PaymentSystem.dd_invoice_run_draft(params))


	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDCsvSchema(), state_factory=std_state_factory)
	def payment_dd_csv(self, *args, **params):
		""" Cav file of DD fieldds"""

		return set_output_as("csv", PaymentSystem.dd_create_csv(params))

	@expose(template="prmax.templates.iadmin/dd_invoices_draft")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDCsvSchema(), state_factory=std_state_factory)
	def payment_dd_csv_draft(self, *argv, **params):
		""" Create DD invoices from the period"""

		return dict(data=PaymentSystem.dd_create_csv_draft(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDDCsvSchema(), state_factory=std_state_factory)
	def payment_dd_reset(self, *argv, **params):
		""" Rest the fields """

		return dict(data=PaymentSystem.dd_clear_post_csv(params))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCustomerTypeSchema(), state_factory=std_state_factory)
	def update_customertypeid(self, *argv, **params):
		""" Update the customer type """

		Customer.update_customertypeid(params)

		return stdreturn(data=Customer.get_internal(params))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrInternalStatusSchema(), state_factory=std_state_factory)
	def update_internal_status(self, *argv, **params):
		""" Chnage the internal flag for a customer """

		Customer.update_internal_status(params)

		return stdreturn()

	@expose("")
	def add_manual_invoice(self, *args, **params):
		""" Manual Invoice """

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id
		try:
			PaymentSystem.add_manual_invoice(params)
			retd = stdreturn()
		except:
			LOGGER.exception("add_manual_invoice %s", str(params))
			retd = dict(success=Constants.Return_Failed, message="Problem Adding Invoice")

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
			PaymentSystem.add_manual_credit(params)
			retd = stdreturn()
		except:
			LOGGER.exception("add_manual_credit %s", str(params))
			retd = dict(success=Constants.Return_Failed, message="Problem Adding Invoice")

		return formreturn(retd)



	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customer_invoices(self, *argv, **params):
		""" List of invoices for a customer """

		return CustomerInvoice.getGridPage(params)


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customer_to_allocate(self, *argv, **params):
		""" List of invoices/payments/adjustments for a customer """

		return CustomerAllocation.getGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def tasks(self, *argv, **params):
		""" list of tasks """

		return Task.getGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRTaskUpdateSchema(), state_factory=std_state_factory)
	def task_update(self, *argv, **params):
		""" list of tasks """

		Task.update(params)
		return stdreturn(task=Task.getDisplay(params["taskid"]))


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema, state_factory=std_state_factory)
	def task_add(self, *argv, **params):
		""" Add a taks """

		params["taskid"] = Task.add(params)
		return stdreturn(task=Task.getDisplay(params["taskid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRTaskSchema(), state_factory=std_state_factory)
	def task_get(self, *argv, **params):
		""" list of tasks """

		return stdreturn(task=Task.getDisplay(params["taskid"]))

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

		return PriceCode.get_grid_page(params)


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def allocation_details(self, *argv, **params):
		""" Allocation Details """

		return CustomerAllocation.getGridPageAllocations(params)


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerAllocationSchema(), state_factory=std_state_factory)
	def allocation_delete(self, *argv, **params):
		""" delete an allocation """

		CustomerAllocation.delete(params)
		return stdreturn()

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
	@validate(validators=PRCustomerSettingsSchema(), state_factory=std_state_factory)
	def customer_task_settings_update(self, *argv, **params):
		""" add new allocation to item  """

		Customer.update_settings(params)
		return stdreturn()

	# Task Tags

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def tasktags(self, *argv, **params):
		""" list of price codes """

		return TaskTags.getGridPage(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def tasktags_add(self, *argv, **params):
		""" add new price code  """

		if TaskTags.Exists(params):
			return duplicatereturn()

		params["tasktagid"] = TaskTags.add(params)
		return stdreturn(data=TaskTags.get(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TaskTagSchema(), state_factory=std_state_factory)
	def tasktags_delete(self, *argv, **params):
		""" delete a price code if not in use """

		TaskTags.delete(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=TaskTagSchema(), state_factory=std_state_factory)
	def tasktags_update(self, *argv, **params):
		""" delete a price code if not in use """

		if TaskTags.Exists(params):
			return duplicatereturn()

		TaskTags.update(params)
		return stdreturn(data=TaskTags.get(params))


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
	@validate(validators=PrCustomerSchema(), state_factory=std_state_factory)
	def customer_balance(self, *argv, **params):
		""" return the customer balance record """

		return stdreturn(balances=Customer.getBalances(params["icustomerid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def send_conf_dd(self, *argc, **params):
		""" Generate a DD order confrimation for the customer """

		PRMaxAdmin.send_dd_order_confirmation(params)

		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def customer_data_sets(self, *argv, **params):
		""" return a list of datasets with those that you have selected  """

		if argv:
			params["prmaxdatasetid"] = int(argv[0])

		return CustomerPrmaxDataSets.rest_grid_page(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUPdateDataSetsSchema(), state_factory=std_state_factory)
	def customer_data_set_update(self, *argc, **params):
		""" Add/Delete the data set from a cutomer """

		return stdreturn(data=CustomerPrmaxDataSets.update_datasets(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IUserSchema(), state_factory=std_state_factory)
	def send_login_details(self, *argc, **params):
		""" update password and send login details """

		UserGeneral.send_login_details(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ExtendedSettingsSchema(), state_factory=std_state_factory)
	def update_extendedsettings(self, *argc, **params):
		""" update extended Settings """

		Customer.update_extendedsettings(params)

		return stdreturn(data=Customer.get_internal(params))

