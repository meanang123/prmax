# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        customers.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     11/4/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, identity, validators, error_handler
from prcommon.model import Customer, User, CustomerGeneral, Task
from prcommon.model.dataimport import DataImport
from prcommon.accounts.admin import PaymentSystemNew
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler
from ttl.tg.controllers import SecureControllerAdmin
import ttl.tg.validators as tgvalidators
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema
from ttl.base import stdreturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
from prcommon.model.common import BaseSql

class CustomerIdSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()

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

class CustomerPartnerAddSchema(PrFormSchema):
	""" schema """
	maxnbrofusersaccounts = validators.Int()
	logins = validators.Int()
	countryid = validators.Int()
	isdemo = BooleanValidator()
	advancefeatures = BooleanValidator()
	startdate = ISODateValidator()
	enddate = ISODateValidator()

class CustomerPartnerToLiveSchema(PrFormSchema):
	advancefeatures = BooleanValidator()
	startdate = ISODateValidator()
	enddate = ISODateValidator()
	icustomerid = validators.Int()

class CustomerPartnerLiveExtendSchema(PrFormSchema):
	enddate = ISODateValidator()
	icustomerid = validators.Int()
	maxnbrofusersaccounts = validators.Int()
	logins = validators.Int()
	advancefeatures = BooleanValidator()

class PrUpdateCustomerSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	individual = BooleanValidator()
	countryid = validators.Int()

class PRTaskSchema(PrFormSchema):
	""" schema """
	taskid = validators.Int()


class PrCreditSchema(PrFormSchema):
	""" schema """
	icustomerid = validators.Int()
	payment_date = tgvalidators.ISODateValidator()
	emailtocustomer = BooleanValidator()
	vat = tgvalidators.FloatToIntValidator()
	cost = tgvalidators.FloatToIntValidator()
	gross = tgvalidators.FloatToIntValidator()

class PRImportSchemaSchema(PrFormSchema):
	" import schema "
	no_add_outlet = BooleanValidator()
	
class CustomerController(SecureControllerAdmin):
	"""
	Admin Customer Methods
	"""

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_limited(self, *args, **params):
		""" customer list """

		params["limited_view"] = True
		return Customer.get_search_rest(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def user_list(self, *args, **params):
		""" user list """

		return User.get_as_rest(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def get_internal(self, *argv, **params):
		""" return internal details about a customer """

		return stdreturn(data=Customer.get_internal(params))


	@expose(template="prmaxcontrol.templates.customers.summary")
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def summary(self, *args, **params):
		""" Summary Details"""

		return CustomerGeneral.get_admin_summary(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerPartnerAddSchema(), state_factory=std_state_factory)
	def add_partner_customer(self, *argv, **params):
		""" add a new partner record and return details """

		check = CustomerGeneral.partner_account_exists(params)
		if check != None:
			return check

		return stdreturn(data=CustomerGeneral.display_row(CustomerGeneral.add_partner_customer(params)))


	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerPartnerToLiveSchema(), state_factory=std_state_factory)
	def partner_demo_to_live(self, *argv, **params):
		""" update demo account to live """

		CustomerGeneral.partner_demo_to_live(params)

		return stdreturn(data=CustomerGeneral.display_row(params["icustomerid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerPartnerLiveExtendSchema(), state_factory=std_state_factory)
	def partner_extend_live(self, *argv, **params):
		""" update demo account to live """

		CustomerGeneral.partner_extend_live(params)

		return stdreturn(data=CustomerGeneral.display_row(params["icustomerid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUpdateCustomerSchema(), state_factory=std_state_factory)
	def update_customer(self, *argv, **params):
		""" Update a customer record """

		# delete the row
		Customer.update_internal(params)

		return stdreturn(data=CustomerGeneral.display_row(params["icustomerid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def customer_balance(self, *argv, **params):
		""" return the customer balance record """

		return stdreturn(balances=Customer.getBalances(params["icustomerid"]))

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
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def update_customer_salesanalysis(self, *argv, **params):
		""" Update a customer record """

		Customer.update_customer_salesanalysis(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CustomerIdSchema(), state_factory=std_state_factory)
	def update_customer_address(self, *argv, **params):
		""" Update a customer record """

		Customer.update_customer_address(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCreditSchema(), state_factory=std_state_factory)
	def credit_take(self, *argv, **params):
		""" credit customer  """

		PaymentSystemNew.credit(params)

		return stdreturn()

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
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def customers_combo(self, *argv, **params):
		""" returns the list of customers for the grid"""

		return Customer.get_list_page(params)	

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def partner_customers(self, *argv, **params):
		"""  returns the list of customers for the grid """

		return BaseSql.grid_to_rest_ext(Customer.get_list_partners_page(params),
		                              params["offset"],
				                      False )


	