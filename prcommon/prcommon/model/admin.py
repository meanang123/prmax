# -*- coding: utf-8 -*-
"""Admin methods"""
#-----------------------------------------------------------------------------
# Name:        admin.py
# Purpose:		To control access too the user session. What current list is open
#
# Author:      Chris Hoy
#
# Created:    10/09/2010
# RCS-ID:      $Id:  $
# Copyright:  (c) 2010

#-----------------------------------------------------------------------------
import datetime
import logging
from copy import deepcopy
from turbogears.database import metadata, mapper, session
from turbogears import visit, identity
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from prcommon.model.identity import VisitIdentity, User, Customer, Visit
from prcommon.model.internal import Cost, Terms, NbrOfLogins, AuditTrail
from prcommon.model.lookups import PrmaxModules, CustomerSources, CustomerProducts
from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.crm import Task
from prcommon.model.communications import Address
import prcommon.Constants as Constants
from prcommon.model.crm import ContactHistory
from prcommon.model.lookups import VatCodes, Countries, CustomerTypes
from prcommon.model.report import Report
from prcommon.model.crm2.solidmediageneral import SolidMediaGeneral
from prcommon.sales.salesorderconformation import SendOrderConfirmationBuilder, UpgradeConfirmationBuilder
from ttl.string import Translate25UTF8ToHtml
from ttl.PasswordGenerator import Pgenerate
from ttl.postgres import DBCompress
from ttl.ttldate import TtlDate, DateAddMonths
from ttl.ttlmaths import toInt, from_int


LOGGER = logging.getLogger("prcommon")

class CustomerExternal(BaseSql):
	""" External admin function for customer accessed where the user is not logged in"""
	@classmethod
	def cost(cls, params):
		""" collect the cost of the required logins/period for the licence"""

		if int(params.get("isprofessional", "0")) == 1:
			cost = Constants.PRmax_Professional_Cost
			total = Constants.PRmax_Professional_Total
		else:
			result = session.query(Cost).filter_by(
				termid=params['termid'],
				nbrofloginsid=params['nbrofloginsid'])
			if result.count() == 0:
				return(0, "Please ring for price", "")
			else:
				cost = result[0].cost
				total = result[0].total
				if "advancefeatures" in params and params["advancefeatures"]:
					cost += result[0].advancecost
					total += result[0].advancetotal
				if "crm" in params:
					cost += result[0].crmcost
					total += result[0].crmtotal

		return(cost, "", total)

	@classmethod
	def cost2(cls, customerid):
		""" based on the customer record"""

		cust = Customer.query.get(customerid)
		if cust.is_bundle:
			cost = Constants.PRmax_Professional_Cost
			total = Constants.PRmax_Professional_Total
		else:
			result = session.query(Cost).filter_by(
			  termid=cust.termid,
			  nbrofloginsid=cust.nbrofloginsid)
			cost = result[0].cost
			total = result[0].total
			if cust.advancefeatures:
				cost += result[0].advancecost
				total += result[0].advancetotal
			if cust.crm:
				cost += result[0].crmcost
				total += result[0].crmtotal

		return(cost, "", total)

	@classmethod
	def new(cls, params):
		""" adds a customer and user record to the system """

		try:
			#get the login count
			logins = NbrOfLogins.query.get(params['nbrofloginsid'])
			# get length type
			term = Terms.query.get(params['termid'])

			# add address
			addr = Address(address1=params['address1'],
										 address2=params['address2'],
										 county=params['county'],
										 postcode=params['postcode'],
										 townname=params['townname'],
										 addresstypeid=Address.customerAddress)
			session.add(addr)
			session.flush()
			# add external customer
			proforma = True if params.get("proforma") else False
			advancefeatures = True if params.get("advancefeatures") else False
			crm = True if params.get("crm") else False

			cust = CustomerExternal(
				advancefeatures=advancefeatures,
				crm=crm,
				customername=params['customername'],
				contactname="",
				contact_title=params.get('contact_title', ''),
				contact_firstname=params.get('contact_firstname', ''),
				contact_surname=params.get('contact_surname', ''),
				contactjobtitle=params["contactjobtitle"],
				logins=logins.nbroflogins,
				maxnbrofusersaccounts=logins.maxnbrofusersaccounts,
				addressid=addr.addressid,
				email=params['email'],
				tel=params['tel'],
				termid=params['termid'],
				licence_expire=term.getEndDate(),
				nbrofloginsid=params['nbrofloginsid'],
				proforma=proforma,
				vatnumber=params["vatnumber"] if "vatnumber" in params else "",
				countryid=params["countryid"],
			  customersourceid=int(params["customersourceid"]))
			session.add(cust)

			# professional version
			if "isprofessional" in  params and  params["isprofessional"] == '1':
				cust.advancefeatures = True
				cust.crm = True
				cust.updatum = True
				cust.seo = True
				cust.is_bundle = True
				cust.has_news_rooms = True
#				cust.has_global_newsroom = True

			session.flush()

			customer = Customer.query.get(cust.customerid)
			customer.contactname = customer.getContactName()

			# add primary data set
			CustomerPrmaxDataSets.set_primary(customer.customerid)


			# add primary user
			user = User(user_name=params['email'],
			            email_address=params['email'],
			            display_name=customer.getContactName(),
			            password=params['password'],
			            customerid=cust.customerid)
			session.add(user)
			session.flush()

			# fix up solid media interface
			if cust.customertypeid == Constants.CustomerType_SolididMedia:
				cust.crm = True
				cust.updatum = True
				SolidMediaGeneral(cust)

		except:
			LOGGER.exception("customer_external_new")
			raise

		return dict(cust=cust, user=user)

	@classmethod
	def new_from_demo_request(cls, demorequest, params):
		""" Copnvert a demo request to a customer """

		try:
			#get the login count
			term = Terms.query.get(1)
			custtype = CustomerTypes.query.get(params["customertypeid"])

			# add address
			addr = Address(address1=params["address1"],
										 address2=params["address2"],
										 county=params["county"],
										 postcode=params["postcode"],
										 townname=params["townname"],
										 addresstypeid=Address.customerAddress)
			session.add(addr)
			session.flush()
			# add external customer
			cust = Customer(
			  customertypeid=custtype.convert_to_type(),
			  customersourceid=custtype.customersourceid,
				customerstatusid=Constants.Customer_Active,
				customername=params["customername"],
				contactname="",
				contact_title=params["contact_title"],
				contact_firstname=params["contact_firstname"],
				contact_surname=params["contact_surname"],
				contactjobtitle=params["job_title"],
				logins=1,
				addressid=addr.addressid,
				email=params["email"],
				tel=params["telephone"],
				termid=1,
				licence_expire=term.getEndDate(True),
				nbrofloginsid=1,
				proforma=False,
				isdemo=True,
				useemail=False,
				countryid=demorequest.countryid,
				advancefeatures=params["advancefeatures"],
				licence_start_date=datetime.date.today())

			cust.set_type_defaults()

			session.add(cust)
			session.flush()

			# add account record
			session.add(CustomerAccountsDetails(customerid=cust.customerid))

			# add extended settings
			session.add(CustomerSettings(customerid=cust.customerid))

			cust = Customer.query.get(cust.customerid)
			cust.contactname = cust.getContactName()

			# add primary user
			password = Pgenerate().generate_password_simple(6)[0:6]
			user = User(user_name=params["email"],
			            email_address=params["email"],
			            display_name=cust.getContactName(),
			            password=password,
			            customerid=cust.customerid)
			session.add(user)

			# add primary data set
			CustomerPrmaxDataSets.set_primary(cust.customerid)

			# eletre demorequesr record
			session.delete(demorequest)

			# add Task
			task = Task(userid=params["assigntoid"],
								 tasktypeid=Constants.TaskType_Trial,
								 taskstatusid=Constants.TaskStatus_InProgress,
								 ref_customerid=cust.customerid,
								 due_date=TtlDate.addWorkingDates(datetime.datetime.now(),
			                                            days=custtype.demodays))
			session.add(task)
			session.flush()
			session.add(ContactHistory(
			  ref_customerid=cust.customerid,
			  userid=params["userid"],
			  details="Demo Request",
			  customerid=params["customerid"],
			  subject="Demo Request",
			  contacthistorysourceid=Constants.Contact_History_Type_Sales,
			  taskid=task.taskid))

			# fix up solid media interface
			if cust.customertypeid == Constants.CustomerType_SolididMedia:
				cust.crm = True
				cust.updatum = True

				SolidMediaGeneral(cust)
		except:
			LOGGER.exception("customer_external_new")
			raise
		return  dict(cust=cust, user=user, password=password)

	@classmethod
	def exists(cls, customername):
		""" Check to see if a customer name already exists """

		result = session.query(Customer).filter_by(customername=customername)

		return True if result.count() else False

	@classmethod
	def do_login(cls, user):
		""" Login a customer internal function this is to allow the customer to be
		logged in to make the payment on creating a new account"""
		# get current key
		# logout current session

		visit_key = visit.current().key
		link = session.query(VisitIdentity).filter_by(visit_key=visit_key)
		# link to current user
		if link.count() == 0:
			link = VisitIdentity(visit_key=visit_key, user_id=user.user_id)
			session.add(link)
		else:
			link.one()
			link.user_id = user.user_id

		# load and set the security model
		user_identity = identity.current_provider.load_identity(visit_key)
		identity.set_current_identity(user_identity)

	@staticmethod
	def can_login(userid=None, tokenid=None, force_logout=False):
		"""Check to see if a customer has exceeded it's concurrent logins"""

		#elif cust.getConcurrentExeeded(identity.current.user.user_id):

		return None
	@staticmethod
	def logout():
		"""cleanup"""

		sessionid = visit.current().key

		session.query(Visit).filter(Visit.visit_key == sessionid).delete()
		session.query(VisitIdentity).filter(VisitIdentity.visit_key == sessionid).delete()

	@classmethod
	def update_licence(cls, params):
		""" Change the customers licence terms """

		customer = Customer.query.get(params['customerid'])
		old_terms = dict(termid=customer.termid,
		                 nbrofloginsid=customer.nbrofloginsid)
		#logins=NbrOfLogins.query.get(params['nbrofloginsid'])
		#customer.nbrofloginsid = params['nbrofloginsid']
		#customer.logins = logins.nbroflogins
		#customer.maxnbrofusersaccounts = logins.maxnbrofusersaccounts

		customer.termid = params['termid']

		session.add(AuditTrail(audittypeid=Constants.audit_payment_complete,
								              audittext="Licence Terms change",
								              userid=params['user_id'],
								              customerid=params['customerid'],
								              auditextfields=DBCompress.encode2(old_terms)))

		session.flush()


class PRMaxControl(BaseSql):
	""" PRmax Control record """

	@classmethod
	def get(cls):
		""" get record """
		return session.query(PRMaxControl).filter_by().one()

class PRMaxAdmin(BaseSql):
	""" prmax admin controller """
	@classmethod
	def send_order_confirmation_preview(cls, params):
		""" send_order_confirmation_preview
		"""

		sendconf = SendOrderConfirmationBuilder()

		customer = Customer.query.get(params['icustomerid'])
		if customer.orderpaymentmethodid in(1, 2, 4, 5):
			sendconf.setUser("email", "Password")

		tmp = Translate25UTF8ToHtml(sendconf.run(params["icustomerid"], "", params["userid"], True))

		return "<html><body>" +  tmp  +"</body></html>"



	@classmethod
	def upgrade_confirmation_preview(cls, params):
		"""Generate an upgrade preview"""
		try:
			return cls._upgrade_confirmation_base(params, False)
		except:
			LOGGER.exception("upgrade_confirmation_preview")
			raise

	@classmethod
	def _upgrade_confirmation_base(cls, params, send=False):
		"""Generate a preview or send the order confirmation"""

		ftotal = fcost = 0
		upgrade = UpgradeConfirmationBuilder()
		if send:
			customer = Customer.query.get(params['icustomerid'])
		customer = deepcopy(Customer.query.get(params['icustomerid']))

		# at this point we need too mix in the settings
		customer.emailtocustomer = params["emailtocustomer"]

		if params["purchase_order"]:
			customer.purchase_order = params["purchase_order"]

		customer.media_upgrade = params["media_upgrade"]
		customer.advance_upgrade = params["advance_upgrade"]
		customer.monitoring_upgrade = params["monitoring_upgrade"]

		vat = VatCodes.query.get(Countries.query.get(customer.countryid) .vatcodeid)

		if customer.media_upgrade:
			# media upgrade
			customer.logins_org = customer.logins
			customer.logins = params["logins"]
			customer.order_confirmation_media_cost = params["cost"]
			customer.order_confirmation_media_vat = toInt(vat.calc_vat_required(from_int(params["cost"])))
			ftotal += customer.order_confirmation_media_cost
			fcost += customer.order_confirmation_media_cost
			ftotal += customer.order_confirmation_media_vat
			if send and customer.paymentmethodid in Constants.isPaymentMethodMonthly:
				# setup monthy ayment value
				customer.pay_monthly_value = customer.order_confirmation_media_cost
				# need to check advance at this point
				if customer.advancefeatures and not customer.advance_upgrade:
					customer.dd_advance_value = customer.order_confirmation_adv_cost

			if send and customer.logins_org != customer.logins:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_logins_changed,
				  audittext="Logins changed from %d to %d" % (customer.logins_org, customer.logins),
				  userid=params["userid"],
				  customerid=params["icustomerid"]))

		if customer.advance_upgrade:
			customer.order_confirmation_adv_vat = toInt(vat.calc_vat_required(from_int(params["advcost"])))
			customer.order_confirmation_adv_cost = params["advcost"]
			if send:
				if customer.advancefeatures != True:
					session.add(AuditTrail(
					  audittypeid=Constants.audit_expire_date_changed,
					  audittext="Features Turned On",
					  userid=params["userid"],
					  customerid=params["icustomerid"]))

				customer.dd_advance_value = customer.order_confirmation_adv_cost
				ftotal += customer.order_confirmation_adv_cost
				fcost += customer.order_confirmation_adv_cost
				ftotal += customer.order_confirmation_adv_vat

			customer.advancefeatures = True

		if customer.monitoring_upgrade:
			customer.updatum_months_free = params["updatum_months_free"]
			customer.updatum_months_paid = params["updatum_months_paid"]
			customer.maxmonitoringusers_org = customer.maxmonitoringusers
			customer.maxmonitoringusers = params["maxmonitoringusers"]
			customer.order_confirmation_updatum_vat = toInt(vat.calc_vat_required(from_int(params["updatumcost"])))
			customer.order_confirmation_updatum_cost = params["updatumcost"]
			customer.updatum_start_date = params["updatum_start_date"]
			if customer.paymentmethodid in Constants.isPaymentMethodMonthly:
				customer.updatum_end_date = Constants.Direct_Debit_Expire_Date
			else:
				customer.updatum_end_date = DateAddMonths(customer.updatum_start_date, params["updatum_months_free"] + params["updatum_months_paid"])
			customer.updatum = True
			if send:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Monitoring Turned On",
				  userid=params["userid"],
				  customerid=params["icustomerid"]))
				ftotal += customer.order_confirmation_updatum_cost
				fcost += customer.order_confirmation_updatum_cost
				ftotal += customer.order_confirmation_updatum_vat
				# set the dd cost
				if customer.paymentmethodid in Constants.isPaymentMethodMonthly:
					customer.dd_monitoring_value = customer.order_confirmation_updatum_cost

		# quick for confirmation payment types:
		if customer.paymentmethodid in Constants.isPaymentMethodMonthly:
			customer.orderpaymentmethodid = 4
		else:
			customer.orderpaymentmethodid = 3

		# if this is not preview and this is send invoice then do so
		if send and params["sendinvoice"]:
			if params["upgrade_confirmation_accepted"]:
				customer.upgrade_confirmation_accepted = True

			ltypes = []
			if customer.media_upgrade:
				ltypes.append("Media Data")
			if customer.advance_upgrade:
				ltypes.append("Advance Features")
			if customer.monitoring_upgrade:
				ltypes.append("Monitoring")

			licencedetails = "Prmax Upgrade of " + ", ".join(ltypes)

			# we need too send the invoice as well at this point
			reportoptions = dict(paymentline="",
			                     show_bank=True,
			                     licencedetails=licencedetails,
			                     total=ftotal,
			                     vat=ftotal - fcost,
			                     cost=fcost,
			                     modules=True,
			                     customerid=params["icustomerid"],
			                     message=params.get("order_confirmation_message", ""))

			if customer.media_upgrade:
				reportoptions['corecost'] = customer.order_confirmation_media_cost
			if customer.advance_upgrade:
				reportoptions['advcost'] = customer.order_confirmation_adv_cost
			if customer.monitoring_upgrade:
				reportoptions['updatumcost'] = customer.order_confirmation_updatum_cost

			# add report options
			Report.add(
		      params['icustomerid'],
		      Constants.Report_Output_pdf,
		      reportoptions,
		      {},
		      Constants.Report_Template_Invoice)

		data = upgrade.run(customer, params["userid"])
		if send:
			upgrade.send_email(params["email"])
		else:
			return data

	@classmethod
	def upgrade_confirmation(cls, params):
		"""Generate an upgrade preview"""

		try:
			transaction = cls.sa_get_active_transaction()
			cls._upgrade_confirmation_base(params, True)
			transaction.commit()
		except:
			LOGGER.exception("upgrade_confirmation")
			transaction.rollback()
			raise

	@classmethod
	def send_order_confirmation(cls, params):
		""" send and order confirmation
		update the customer settings"""

		try:
			transaction = cls.sa_get_active_transaction()

			customer = Customer.query.get(params['icustomerid'])
			# at this point we need to update the fields
			# now we need to setup the expire date
			customer.licence_start_date = params["licence_start_date"]
			if params["logins"] != customer.logins:
				session.add(AuditTrail(audittypeid=Constants.audit_logins_changed,
				                       audittext="Logins changed from %d to %d" % (customer.logins, params["logins"]),
				                       userid=params["userid"],
				                       customerid=params["icustomerid"]))
				customer.logins = params["logins"]

			# is dd then set end date too future
			if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Is_DD:
				licence_expire = Constants.Direct_Debit_Expire_Date
			else:
				licence_expire = DateAddMonths(customer.licence_start_date, params["months_free"] + params["months_paid"])

			if customer.licence_expire != licence_expire:
				customer.licence_expire = licence_expire
				session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
				                       audittext="Core Expire Date %s" % (licence_expire.strftime("%d/%m/%y")),
				                       userid=params["userid"],
				                       customerid=params['icustomerid']))
			customer.renewal_date = licence_expire

			# only do this is we are sending ot the order confirmation
			if params["saveonly"] == False:
				# reset all status to live
				customer.remove_demo_status()

			# save the months map
			customer.months_paid = params["months_paid"]
			customer.months_free = params["months_free"]
			customer.pricecodeid = params["pricecodeid"]
			customer.pricecoderenewalid = params["pricecoderenewalid"]
			customer.purchase_order = params["purchase_order"]
			customer.orderedby = params["orderedby"]
			customer.order_confirmation_message = params["order_confirmation_message"]
			customer.orderpaymentmethodid = params["orderpaymentmethodid"]
			customer.orderpaymentfreqid = params["orderpaymentfreqid"]
			customer.has_bundled_invoice = params["has_bundled_invoice"]

			# set the payment method up
			if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Is_Fixed_Term:
				customer.paymentmethodid = Constants.PaymentMethod_Fixed
			elif params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Is_DD:
				customer.paymentmethodid = Constants.PaymentMethod_DD

			# advance features
			customer.advancefeatures = params["advancefeatures"]
			if params["advancefeatures"]:
				customer.advance_licence_start = params["advance_licence_start"]
				advance_licence_expired = customer.advance_licence_start + \
					datetime.timedelta(days=(params["adv_months_free"] + params["adv_months_paid"]) * 30)
				if customer.advance_licence_expired != advance_licence_expired:
					customer.advance_licence_expired = advance_licence_expired
					session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
					                       audittext="Advance Expire Date %s" % (advance_licence_expired.strftime("%d/%m/%y")),
					                       userid=params["userid"],
					                       customerid=params['icustomerid']))
				customer.adv_months_paid = params["adv_months_paid"]
				customer.adv_months_free = params["adv_months_free"]
				customer.advpricecodeid = params["advpricecodeid"]
				customer.advpricecoderenewalid = params["advpricecoderenewalid"]

			#Monitoring
			customer.updatum = params["updatum"]
			if params["updatum"]:
				if customer.maxmonitoringusers != params["maxmonitoringusers"]:
					session.add(AuditTrail(
					  audittypeid=Constants.audit_trail_monitoring_user_count,
					  audittext="Monitoring Users From %d to %d" % (customer.maxmonitoringusers, params["maxmonitoringusers"]),
					  userid=params["userid"],
					  customerid=params["icustomerid"]))

				customer.maxmonitoringusers = params["maxmonitoringusers"]

				customer.updatum_start_date = params["updatum_start_date"]
				updatum_end_date = customer.updatum_start_date + \
					datetime.timedelta(days=(params["updatum_months_free"] + params["updatum_months_paid"]) * 30)
				if customer.updatum_start_date != updatum_end_date:
					customer.updatum_end_date = updatum_end_date
					session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
																		audittext="Monitoring Expire Date %s" % (updatum_end_date.strftime("%d/%m/%y")),
																		userid=params["userid"],
																		customerid=params['icustomerid']))
				customer.updatum_months_paid = params["updatum_months_paid"]
				customer.updatum_months_free = params["updatum_months_free"]
				customer.updatumpricecodeid = params["updatumpricecodeid"]
				customer.updatumpricecoderenewalid = params["updatumpricecoderenewalid"]

			## Status
			customerstatusid = Constants.Customer_Awaiting_Activation
			if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Allow_Acces:
				customerstatusid = Constants.Customer_Active

			if customer.customerstatusid != customerstatusid:
				session.add(AuditTrail(audittypeid=Constants.audit_status_changed,
																 audittext="Status Changed",
																 userid=params['user_id'],
																 customerid=params['icustomerid'],
																 auditextfields=DBCompress.encode2(
				                           dict(from_code=customer.customerstatusid,
				                                to_code=customerstatusid))))
				customer.customerstatusid = customerstatusid

			details = params["internalnote"]
			vat = VatCodes.query.get(Countries.query.get(customer.countryid).vatcodeid)

			financial = []

			val = float(params["cost"])
			vatval = vat.calc_vat_required(val)
			ftotal = val + vatval
			fcost = val
			customer.order_confirmation_media_cost = toInt(val)
			customer.order_confirmation_media_vat = toInt(vatval)

			financial.append(["Media", val, vatval, val+vatval])
			if customer.advancefeatures:
				val = float(params["advcost"])
				vatval = vat.calc_vat_required(val)
				ftotal += val
				ftotal += vatval
				fcost += val
				customer.order_confirmation_adv_cost = toInt(val)
				customer.order_confirmation_adv_vat = toInt(vatval)
				financial.append(["Features", val, vatval, val+vatval])
			else:
				customer.order_confirmation_adv_cost = 0
				customer.order_confirmation_adv_vat = 0

			ftotal_media = ftotal
			ftotal_monitoring = 0
			ftotal_international = 0

			if customer.updatum:
				val = float(params["updatumcost"])
				vatval = vat.calc_vat_required(val)
				ftotal += val
				ftotal += vatval
				ftotal_monitoring += (val + vatval)
				fcost += val
				customer.order_confirmation_updatum_cost = toInt(val)
				customer.order_confirmation_updatum_vat = toInt(vatval)
				financial.append(["Monitoring", val, vatval, val+vatval])
			else:
				customer.order_confirmation_updatum_cost = 0
				customer.order_confirmation_updatum_vat = 0

			total = ["Total", 0.0, 0.0, 0.0]
			for row in financial:
				for counter in(1, 2, 3):
					total[counter] += row[counter]
			financial.append(total)

			# set the default values for montly
			if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Is_DD:
				customer.pay_monthly_value = toInt(ftotal_media)
				customer.dd_monitoring_value = toInt(ftotal_monitoring)
				customer.dd_international_data_value = toInt(ftotal_international)
			# at this point we need to add to both the audit and crm the terms and figures
			def _to_string(row):
				" row to string"
				return "%-20s%0.2f %0.2f %0.2f" % tuple(row)
			details += "\n"
			details += "\n".join([_to_string(row) for row in financial])

			# at this point we need to set the customer to accept the confirmation
			if params["confirmation_accepted"]:
				customer.confirmation_accepted = True
			else:
				pass


			# set the customerorderstatusid for accounts
			# is is based on the payment tidy up into dict later
			if params["orderpaymentmethodid"] == Constants.OrderConfirmationPayment_CC:
				customer.customerorderstatusid = Constants.Financial_Order_Status_Completed
				customer.financialstatusid = Constants.Customer_Financial_Active
			elif params["orderpaymentmethodid"] == Constants.OrderConfirmationPayment_SI_GA:
				customer.customerorderstatusid = Constants.Financial_Order_Status_A_P_A
				customer.financialstatusid = Constants.Customer_Financial_Payment_Overdue
			elif params["orderpaymentmethodid"] == Constants.OrderConfirmationPayment_SI_NA:
				customer.customerorderstatusid = Constants.Financial_Order_Status_A_P_NOT_A
				customer.financialstatusid = Constants.Customer_Financial_Payment_Overdue
			elif params["orderpaymentmethodid"] == Constants.OrderConfirmationPayment_DD_SUP_GA:
				customer.customerorderstatusid = Constants.Financial_Order_Status_DD_NOT_C
				customer.financialstatusid = Constants.Customer_Financial_Active
			elif params["orderpaymentmethodid"] == Constants.OrderConfirmationPayment_DD_SM_GA:
				customer.customerorderstatusid = Constants.Financial_Order_Status_A_DD_A
				customer.financialstatusid = Constants.Customer_Financial_Payment_Overdue
			elif params["orderpaymentmethodid"] == Constants.OrderConfirmationPayment_DD_SM_GA:
				customer.customerorderstatusid = Constants.Financial_Order_Status_A_DD_NOT_A
				customer.financialstatusid = Constants.Customer_Financial_Payment_Overdue

			if params["saveonly"] == False:
				contacthistory = ContactHistory(ref_customerid=params["icustomerid"],
														 userid=params["userid"],
														 details=details,
														 customerid=params["customerid"],
														 subject="Order Confirmation",
														 contacthistorysourceid=Constants.Contact_History_Type_Financial
														)
				session.add(contacthistory)
				session.flush()

				# need to deal with invoice
				if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Send_Invoice:
					reportoptions = params
					reportoptions["show_bank"] = True
					reportoptions.pop("updatumcost")
					reportoptions.pop("advcost")
					# setup payment line
					command = Constants.Licence_Line5 if customer.advancefeatures else Constants.Licence_Line4

					reportoptions['licencedetails'] = command %(customer.logins, customer.licence_start_date.strftime("%d/%m/%y"), customer.licence_expire.strftime("%d/%m/%y"))
					reportoptions['total'] = toInt(ftotal)
					reportoptions['vat'] = toInt(ftotal - fcost)
					reportoptions['cost'] = toInt(fcost)
					if customer.advancefeatures:
						reportoptions['modules'] = True
						reportoptions['advcost'] = customer.order_confirmation_adv_cost
						reportoptions['corecost'] = customer.order_confirmation_media_cost
					if customer.updatum:
						reportoptions['modules'] = True
						reportoptions['updatumcost'] = customer.order_confirmation_updatum_cost
						reportoptions['corecost'] = customer.order_confirmation_media_cost

					reportoptions['customerid'] = params["icustomerid"]
					reportoptions['message'] = params.get("message", "")
					reportoptions["paymentline"] = ""

					# add report options
					Report.add(
						params['icustomerid'],
						Constants.Report_Output_pdf,
						reportoptions,
						{},
						Constants.Report_Template_Invoice)

				# need to deal with order confirmation email
				if params["emailtocustomer"]:
					# update user/password
					password = None
					if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Allow_Acces:
						user = User.query.filter_by(email_address=params["email"]).all()
						# make sure the email address exist and is no this users account
						if user and user[0].customerid == customer.customerid:
							password = Pgenerate().generate_password_simple(6)[0:6]
							user[0].password = password

					sendorder = SendOrderConfirmationBuilder()
					sendorder.setUser(params["email"], password)
					sendorder.run(params["icustomerid"], params["email"], params["userid"])

				# and move the task and status too the next person in the chain
				if "taskid" in params and params["taskid"] > 0:
					# at this point do we need too add a renewal task into the system at the end date
					# if this isn't a dd customer
					task = Task.query.get(params["taskid"])
					oldtaskuserid = task.userid
					task.userid = int(params["assigntoid"])

					if params["orderpaymentmethodid"] in Constants.OrderConfirmationPayment_Is_Fixed_Term:
						# how far in the future will depend on the number of days and if it shoould be accounts
						#
						due_date = customer.licence_expire - datetime.timedelta(days=7)
						session.add(Task(
							taskstatusid=Constants.TaskStatus_InProgress,
							due_date=due_date,
							userid=oldtaskuserid,
							subject="Renewal",
							tasktypeid=Constants.TaskType_Renewal,
							emailactionstatusid=Constants.EmailActionStatus_NoEmails,
							ref_customerid=params["icustomerid"]))

					# update existing task and move too accounts
					if params["saveonly"] == False:
						data = session.query(User).filter_by(email_address="accounts@paperround.net").all()
						if data:
							task.userid = data[0].user_id

					else:
						task.userid = params["assigntoid"]
					task.taskstatusid = Constants.TaskStatus_InProgress

			transaction.commit()
		except:
			LOGGER.exception("send_order_confirmation")
			transaction.rollback()
			raise

	@classmethod
	def send_dd_order_confirmation(cls, params):
		"""Send a dd received order confirmation """
		try:
			transaction = cls.sa_get_active_transaction()
			sendconf = SendOrderConfirmationBuilder()

			customer = Customer.query.get(params['icustomerid'])
			user = User.query.filter_by(email_address=params["email"]).all()
			password = ""
			# make sure the email address exist and is no this users account
			if user and user[0].customerid == customer.customerid:
				password = Pgenerate().generate_password_simple(6)[0:6]
				user[0].password = password

			if password:
				sendconf.setUser(params["email"], password)

			sendconf.templatename = "dd_received_template.html"
			sendconf.subject = "Direct Debit Received"

			sendconf.run(params["icustomerid"],
			              params["email"],
			              params["userid"],
			              False)

			transaction.commit()
		except:
			LOGGER.exception("send_dd_order_confirmation")
			transaction.rollback()
			raise

class PriceCode(BaseSql):
	""" Price code table"""

	List_Types = """SELECT pricecodeid,pricecodedescription,prmaxmoduleid,paid_months,customersourceid,customerproductid FROM accounts.pricecodes ORDER BY pricecodedescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert_core(data):
			""""local convert"""
			return [dict(id=row.pricecodeid, name=row.pricecodedescription, paid_months=row.paid_months)
							for row in data.fetchall() if row.prmaxmoduleid == 1]

		def _convert_adv(data):
			""""local convert"""
			return [dict(id=row.pricecodeid, name=row.pricecodedescription, paid_months=row.paid_months)
							for row in data.fetchall() if row.prmaxmoduleid == 2]

		def _convert_updatum(data):
			""""local convert"""
			return [dict(id=row.pricecodeid, name=row.pricecodedescription, paid_months=row.paid_months)
							for row in data.fetchall() if row.prmaxmoduleid == 4]

		def _convert_clippings(data):
			""""local convert"""
			return [dict(id=row.pricecodeid, name=row.pricecodedescription, paid_months=row.paid_months)
				      for row in data.fetchall() if row.prmaxmoduleid == 6]

		def _convert_int(data):
			""""local convert"""
			return [dict(id=row.pricecodeid, name=row.pricecodedescription, paid_months=row.paid_months)
				      for row in data.fetchall() if row.prmaxmoduleid == 5]

		if params["type"] == "adv":
			_conv = _convert_adv
		elif params["type"] == "updatum":
			_conv = _convert_updatum
		elif params["type"] == "clippings":
			_conv = _convert_clippings
		elif params["type"] == "int":
			_conv = _convert_int
		else:
			_conv = _convert_core


		return cls.sqlExecuteCommand(text(PriceCode.List_Types), None, _conv)

	@classmethod
	def exists(cls, params):
		""" Check to see if a name exists """
		if "pricecodeid" in params:
			result = session.execute(text("SELECT pricecodeid FROM accounts.pricecodes WHERE pricecodedescription ILIKE :pricecodedescription AND prmaxmoduleid =:prmaxmoduleid "
			                              "AND customersourceid =:customersourceid AND customerproductid =:customerproductid AND pricecodeid !=:pricecodeid"),
			                                params, cls)
			tmp = result.fetchall()
			return True if tmp else False
		else:
			result = session.execute(text("SELECT pricecodeid FROM accounts.pricecodes WHERE pricecodedescription ILIKE :pricecodedescription AND prmaxmoduleid =:prmaxmoduleid "
			                              "AND customersourceid =:customersourceid AND customerproductid =:customerproductid"),
			                                params, cls)
			tmp = result.fetchall()
			return True if tmp else False

	@classmethod
	def delete(cls, params):
		""" delete a price code will fail if in use """

		try:
			transaction = cls.sa_get_active_transaction()
			pricecode = PriceCode.query.get(params["pricecodeid"])
			session.delete(pricecode)
			transaction.commit()
		except:
			LOGGER.exception("PriceCode_delete")
			transaction.rollback()
			raise

	@classmethod
	def add(cls, params):
		""" add a new price code """
		try:
			transaction = cls.sa_get_active_transaction()
			pricecode = PriceCode(
			  pricecodedescription=params["pricecodedescription"],
			  prmaxmoduleid=params["prmaxmoduleid"],
			  fixed_salesprice=toInt(params["fixed_salesprice"]),
			  fixed_renewalprice=toInt(params["fixed_renewalprice"]),
			  monthly_salesprice=toInt(params["monthly_salesprice"]),
			  monthly_renewalprice=toInt(params["monthly_renewalprice"]),
			  concurrentusers=params["concurrentusers"],
			  pricecodelongdescription=params["pricecodelongdescription"],
			  paid_months=params["paid_months"],
			  customersourceid=params["customersourceid"],
			  customerproductid=params["customerproductid"])
			session.add(pricecode)
			session.flush()
			transaction.commit()
			return pricecode.pricecodeid
		except:
			LOGGER.exception("PriceCode_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" add a new price code """
		try:
			transaction = cls.sa_get_active_transaction()
			pricecode = PriceCode.query.get(params["pricecodeid"])
			pricecode.pricecodedescription = params["pricecodedescription"]
			pricecode.prmaxmoduleid = params["prmaxmoduleid"]
			pricecode.fixed_salesprice = toInt(params["fixed_salesprice"])
			pricecode.fixed_renewalprice = toInt(params["fixed_renewalprice"])
			pricecode.monthly_salesprice = toInt(params["monthly_salesprice"])
			pricecode.monthly_renewalprice = toInt(params["monthly_renewalprice"])
			pricecode.concurrentusers = params["concurrentusers"]
			pricecode.pricecodelongdescription = params["pricecodelongdescription"]
			pricecode.paid_months = params["paid_months"]
			pricecode.customersourceid = params["customersourceid"]
			pricecode.customerproductid = params["customerproductid"]

			transaction.commit()
		except:
			LOGGER.exception("PriceCode_update")
			transaction.rollback()
			raise

	ListData = """
	SELECT
		pricecodeid,
	  pricecodedescription,
	  pricecodelongdescription,
	  pm.prmaxmoduleid,
	  pm.prmaxmoduledescription,
	  pc.fixed_salesprice/100.00 AS fixed_salesprice,
	  pc.fixed_renewalprice/100.00 AS fixed_renewalprice,
	  pc.monthly_salesprice/100.00 AS monthly_salesprice,
	  pc.monthly_renewalprice/100.00 AS monthly_renewalprice,
	  pc.concurrentusers,
	  pc.paid_months,
	  cs.customersourceid,
	  cs.customersourcedescription,
	  cp.customerproductid,
	  cp.customerproductdescription
	FROM accounts.pricecodes AS pc
	JOIN internal.prmaxmodules AS pm ON pm.prmaxmoduleid = pc.prmaxmoduleid
	LEFT JOIN internal.customersources AS cs ON cs.customersourceid = pc.customersourceid
	LEFT JOIN internal.customerproducts AS cp ON cp.customerproductid = pc.customerproductid
	ORDER BY  %s %s
	LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM accounts.pricecodes"""

	@classmethod
	def get_grid_page(cls, params):
		""" get a page of price codes"""

		params["sort"] = 'UPPER(pricecodedescription)'

		return BaseSql.getGridPage(params,
								                'UPPER(pricecodedescription)',
								                'pricecodeid',
								                PriceCode.ListData,
								                PriceCode.ListDataCount,
								                cls)

	@classmethod
	def get(cls, params):
		""" add a new price code """

		pricecode = PriceCode.query.get(params["pricecodeid"])
		pricemodule = PrmaxModules.query.get(pricecode.prmaxmoduleid)
		if pricecode.customersourceid:
			customersource = CustomerSources.query.get(pricecode.customersourceid)
		customerproduct = CustomerProducts.query.get(pricecode.customerproductid)
		return dict(pricecodeid=pricecode.pricecodeid,
								  pricecodedescription=pricecode.pricecodedescription,
								  prmaxmoduleid=pricecode.prmaxmoduleid,
								  prmaxmoduledescription=pricemodule.prmaxmoduledescription,
								  fixed_salesprice=pricecode.fixed_salesprice/100.00,
								  fixed_renewalprice=pricecode.fixed_renewalprice/100.00,
								  monthly_salesprice=pricecode.monthly_salesprice/100.00,
								  monthly_renewalprice=pricecode.monthly_renewalprice/100.00,
								  concurrentusers=pricecode.concurrentusers,
								  pricecodelongdescription=pricecode.pricecodelongdescription,
		                          paid_months=pricecode.paid_months,
		                          customersourceid=pricecode.customersourceid,
		                          customersourcedescription=customersource.customersourcedescription if customersource else None,
		                          customerproductid=pricecode.customerproductid,
		                          customerproductdescription=customerproduct.customerproductdescription)

	@classmethod
	def get_costs(cls, params):
		""" get the actual costs """

		if not "pricecodeid" in params or params["pricecodeid"] == "":
			costs = dict(media=0, advance=0, updatum=0, paid_months=12)
		else:
			pricecode = PriceCode.query.get(params["pricecodeid"])

			if params["orderpaymentfreqid"] == "1":
				costs = dict(media=pricecode.fixed_salesprice,
											 advance=0,
											 updatum=0,
				               paid_months=pricecode.paid_months)
			else:
				costs = dict(media=pricecode.monthly_salesprice,
											 advance=0,
											 updatum=0,
				               paid_months=pricecode.paid_months)

		if "advpricecodeid" in params and len(params["advpricecodeid"]) > 0:
			advcode = PriceCode.query.get(params["advpricecodeid"])
			costs["advance"] = advcode.fixed_salesprice if params["orderpaymentfreqid"] == "1" else advcode.monthly_salesprice

		if "updatumpricecodeid" in params and len(params["updatumpricecodeid"]) > 0:
			monitoring = PriceCode.query.get(params["updatumpricecodeid"])
			costs["updatum"] = monitoring.fixed_salesprice if params["orderpaymentfreqid"] == "1" else monitoring.monthly_salesprice
			costs["updatum"] *= int(params["maxmonitoringusers"])

		return costs


#########################################################
# load tables from db
CustomerExternal.mapping = Table('customers', metadata, autoload=True, schema="internal")
PRMaxAdmin.mapping = Table('customers', metadata, autoload=True, schema="internal")
PRMaxControl.mapping = Table("prmaxcontrol", metadata, autoload=True, schema="internal")
PriceCode.mapping = Table("pricecodes", metadata, autoload=True, schema="accounts")

mapper(CustomerExternal, Customer.mapping)
mapper(PRMaxControl, PRMaxControl.mapping)
mapper(PRMaxAdmin, PRMaxAdmin.mapping)
mapper(PriceCode, PriceCode.mapping)
