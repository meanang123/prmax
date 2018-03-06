# -*- coding: utf-8 -*-
"""Admin"""
#-----------------------------------------------------------------------------
# Name:        admin.py
# Purpose:	   Customer and Demo system
#
# Author:      Chris Hoy
#
# Created:     10-12-2008
# RCS-ID:      $Id:  $
# Copyright:  (c) 2008

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from turbogears import config
from sqlalchemy import Table, text, func, and_

from prcommon.model import Terms, AuditTrail, CustomerProtex, CustomerPayments, \
     Customer, User, BaseSql, Report, CustomerInvoice, CustomerAllocation, \
     Adjustments, EmailQueue, Task, ContactHistory, PRMaxSettings, ClippingPriceServiceLevel
from prcommon.model import  CustomerExternal as CustomerExternalBase, \
     PRMaxControl, Months, VatCodes, SEORelease, ClippingsOrder, ClippingsPrices, Clipping
from  prcommon.sales.salesorderconformation import SendOrderConfirmationBuilder

from prmax.prmaxmodel.md_Lookups import CustomerPaymentTypes
from prcommon.model import Countries

import prmax.Constants as Constants
from ttl.protex import simpleXor
from ttl.postgres import DBCompress
from ttl.PasswordGenerator import Pgenerate
from ttl.ttldate import DateAddMonths, TtlDate
import email
from ttl.ttlsagepay import AESSagePay
from datetime import date, datetime, timedelta
import calendar
import csv
import StringIO
import simplejson
from ttl.ttlmaths import toInt

import logging
LOGGER = logging.getLogger("prmax.model")

class CustomerExternal(CustomerExternalBase):
	""" External admin function for customer accessed where the user is not logged in"""
	pass

class PaymentSystem(object):
	""" payment control logic"""

	@staticmethod
	def decode_protex_form(crypt):
		""" convert the encypted data back to actual data """

		engine = AESSagePay(config.get('protex.password'))
		decrypted = engine.decrypt_sage(crypt)
		fields = dict()
		for pairs in decrypted.split("&"):
			field = pairs.split("=")
			fields[field[0]] = field[1]
		return fields

	@staticmethod
	def encode_protex_form(params, customer):
		""" encode the details that need to be sent to protex"""

		cost = CustomerExternal.cost2(customer.customerid)
		term = Terms.query.get(customer.termid)

		guuid = email.Utils.make_msgid()
		vref = guuid[1:guuid.index("@")].strip(".")
		data = "&VendorTxCode=" +  vref

		# Amount Numeric.
		data += "&Amount=" + "%.2f" % round(cost[2]/100.0, 2)
		data += "&Currency=GBP"
		#Description Alphanumeric Max 100 characters Free text description of goods or services being purchased
		data += "&Description=" +Constants.Licence_Line %(term.termname, date.today().strftime("%d/%m/%y"))
		#SuccessURL
		data += "&SuccessURL=" + config.get('prmax.web') + "eadmin/payment_success"
		#FailureURL
		data += "&FailureURL=" + config.get('prmax.web') + "eadmin/payment_failure"
		#CustomerName:
		data += "&CustomerName=" + customer.getContactName()
		#CustomerEMail:
		data += "&CustomerEMail=" + params["email"]
		#VendorEMail:
		data += "&VendorEMail=" + config.get('prmax.email')
		#BillingAddress:
		data += "&BillingAddress1=" + params["address1"]
		data += "&BillingAddress2=" + params["address2"]
		data += "&BillingCity=" + params["townname"]
		data += "&BillingPostCode=" + params["postcode"]
		data += "&BillingCountry=GB"
		data += "&DeliveryAddress1=" + params["address1"]
		data += "&DeliveryAddress2=" + params["address2"]
		data += "&DeliveryCity=" + params["townname"]
		data += "&DeliveryPostCode=" + params["postcode"]
		data += "&DeliveryCountry=GB"
		data += "&BillingSurname=" + params["surname"]
		data += "&BillingFirstnames=" + params["firstname"]
		data += "&DeliverySurname=" + params["surname"]
		data += "&DeliveryFirstnames=" + params["firstname"]

		engine = AESSagePay(config.get('protex.password'))

		crypted = engine.encrypt(data)

		# at this point we must auto this fact agains the custmer
		session.add(AuditTrail(audittypeid=Constants.audit_payment_started,
		                       audittext="Payment about to be made  Ref %s Amount %.2f" %(vref, round(cost[0],2)),
		                       userid=params["user_id"],
		                       customerid=params["customerid"],
		                       auditextfields=DBCompress.encode2(data)))

		session.add(CustomerProtex(customerid=params["customerid"],
		                           paymenttransactionid=1,
		                           statusid=1,
		                           protextransactionid=vref,
		                           sent=DBCompress.encode2(data)))
		session.flush()

		return crypted

	@classmethod
	def protex_success(cls, params):
		""" protex successfullt returned"""
		# verify we are in the right place?
		transaction = session.begin(subtransactions=True)
		try:
			# complete protext LOGGER
			protexinfo = PaymentSystem.decode_protex_form(params['crypt'])
			protex = CustomerProtex.query.get(protexinfo['VendorTxCode'])
			if protex.statusid == 3:
				LOGGER.error("payment_protex_success duplicate request already dealt with")
				return
			protex.statusid = 3
			protex.response = DBCompress.encode2(protexinfo)
			params["customerid"] = protex.customerid
			if params.get("user_id", None) in(-1, None):
				params["user_id"] = session.query(User.user_id).filter_by(customerid=protex.customerid).one()[0]

			# change customer status
			customer = Customer.query.get(params["customerid"])
			vat = VatCodes.query.get(Countries.query.get(customer.countryid).vatcodeid)

			customer.isdemo = False
			customer.useemail = True
			params['customerstatusid'] = Constants.Customer_Active
			Customer.change_status_internal(params)

			# set exipred date
			enddate = Terms.query.get(customer.termid).getEndDate()
			Customer.setExtpireDateInternal(params["customerid"],
												              enddate,
												              enddate,
												              date.today(),
												              date.today(),
												              date.today(),
												              date.today(),
												              params["user_id"],
												              customer.advancefeatures,
												              None)
			# set renewal date
			customer.renewal_date =(enddate - timedelta(days=1)).strftime("%Y-%m-%d")

			# add renewal task
			due_date = customer.licence_expire - timedelta(days=7)
			taskuserid = User.getASalesUser()
			if taskuserid:
				session.add(Task(
					taskstatusid=Constants.TaskStatus_InProgress,
					due_date=due_date,
					userid=taskuserid,
					subject="Renewal",
					tasktypeid=Constants.TaskType_Renewal,
					emailactionstatusid=Constants.EmailActionStatus_NoEmails,
					ref_customerid=customer.customerid))

			total = float(protexinfo['Amount'].replace(",", "")) * 100
			if vat.rate > 0:
				cost = round((100 / (100 + (vat.rate / 10.0))) * total, 2)
			else:
				cost = total

			# add record to  customer payment history
			payment = CustomerPayments(customerid=params['customerid'],
												           payment=total,
												           paymenttypeid=Constants.payment_cc,
												           transactionid=protexinfo['TxAuthNo'],
												           vat=total - cost)
			session.add(payment)
			session.flush()

			# complete auti trail
			session.add(AuditTrail(audittypeid=Constants.audit_payment_complete,
												        audittext="Payment made Ref %s Amount %s" % \
												       (protexinfo['TxAuthNo'], protexinfo['Amount']),
												        userid=params['user_id'],
												        customerid=params['customerid'],
												        auditextfields=DBCompress.encode2(protexinfo),
												        customerpaymentid=payment.customerpaymentid))

			# create report options
			reportdatainfo = {}
			reportoptions = params
			reportoptions['customerpaymentid'] = payment.customerpaymentid
			paymenttype = CustomerPaymentTypes.query.get(Constants.payment_cc)
			reportoptions['paymentline'] = Constants.Payment_Line.decode("utf-8") % (float(protexinfo['Amount'].replace(",", "")), paymenttype.customerpaymenttypename)
			if customer.is_bundle:
				reportoptions["cost"] = Constants.PRmax_Professional_Cost
				reportoptions["total"] = Constants.PRmax_Professional_Total
				reportoptions["vat"] = reportoptions["total"] - reportoptions["cost"]
			else:
				reportoptions["cost"] = cost
				reportoptions["total"] = total
				reportoptions["vat"] = total - cost

			# add report options
			Report.add(
				params['customerid'],
				Constants.Report_Output_pdf,
				reportoptions,
				reportdatainfo,
				Constants.Report_Template_Invoice)

			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("payment_protex_success")
			raise

	@classmethod
	def protex_failed(cls, params):
		""" payments failed in protex LOGGER to that effect"""

		transaction = session.begin(subtransactions=True)
		try:
			# LOGGER payment success
			protexinfo = PaymentSystem.decode_protex_form(params['crypt'])

			session.add(AuditTrail(audittypeid=Constants.audit_payment_failed,
												        audittext="Payment failed reason: %s Amount %s" % \
												       (protexinfo['StatusDetail'], protexinfo['Amount']),
												        userid=params['userid'],
												        customerid=params['customerid'],
												        auditextfields=DBCompress.encode2(protexinfo)))

			protex = CustomerProtex.query.get(protexinfo['VendorTxCode'])
			protex.statusid = 2
			protex.response = DBCompress.encode2(protexinfo)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("payment_protex_failed")
			transaction.rollback()
			raise

	@classmethod
	def payment_success(cls, params, monthly=False, include_vat=False):
		""" payment take by habd """
		# verify we are in the right place?
		transaction = session.begin(subtransactions=True)
		try:
			customer = Customer.query.get(params["icustomerid"])
			vat = VatCodes.query.get(Countries.query.get(customer.countryid).vatcodeid)
			customer.remove_demo_status()

			if params.has_key("licence_expire"):
				customer.customerstatusid = Constants.Customer_Active
				params['customerstatusid'] = Constants.Customer_Active

			# get payment type if no type then it a monlty dd
			paymenttypeid = params.get("paymenttypeid", Constants.Payment_Bank)
			paymenttype = CustomerPaymentTypes.query.get(paymenttypeid)

			# set exipred date if
			if params.has_key("licence_expire"):
				Customer.setExtpireDateInternal(params["icustomerid"],
																        params["licence_expire"],
																        params["licence_expire"],
																        date.today(),
																        date.today(),
																        date.today(),
																        date.today(),
																        params["user_id"],
																        customer.advancefeatures,
																        None)

			# add record to  customer payment history
			# setup payment details
			total = float(params['value'].replace(",", "")) * 100
			if not include_vat:
				if vat.rate > 0:
					cost = round((100 / (100 + (vat.rate/10.0))) * total, 2)
				else:
					cost = total
			else:
				cost = total

			lparams = dict(customerid=params['icustomerid'],
											payment=total,
											paymenttypeid=paymenttypeid,
											vat=total - cost)

			# need to do
			if params.has_key("payment_date") and params["payment_date"]:
				lparams["actualdate"]  = params["payment_date"]

			# need to sort out allocations
			if params.has_key("allocations"):
				allocations = simplejson.loads(params["allocations"])
				unallocated = 0
				for row in allocations:
					unallocated += row["amount"] * 100
				lparams["unallocated"] = total - unallocated

			payment = CustomerPayments(**lparams)
			session.add(payment)
			session.flush()

			# add allocations
			if params.has_key("allocations"):
				for row in allocations:
					if not row["amount"]:
						continue
					keyid = int(row["keyid"][1:])
					lparams = dict(source_paymentid=payment.customerpaymentid,
													amount=row["amount"] * 100)
					if row["keyid"][0] == "I":
						lparams["alloc_invoiceid"] = keyid
						custinvoice = CustomerInvoice.query.get(keyid)
						custinvoice.unpaidamount -= (row["amount"] * 100)
						if custinvoice.unpaidamount < 0:
							custinvoice.unpaidamount = 0
					elif row["keyid"][0] == "A":
						lparams["alloc_adjustmentid"] = keyid
						adjustment = Adjustments.query.get(keyid)
						adjustment.unallocated -= (row["amount"] * 100)
						if adjustment.unallocated < 0:
							adjustment.unallocated = 0
					elif row["keyid"][0] == "P":
						lparams["alloc_paymentid"] = keyid
						customerpayment = CustomerPayments.query.get(keyid)
						customerpayment.unallocated -= (row["amount"] * 100)
						if customerpayment.unallocated < 0:
							customerpayment.unallocated = 0

					customerallocation = CustomerAllocation(**lparams)
					session.add(customerallocation)

			auditparams = dict(audittypeid=Constants.audit_payment_complete,
												  audittext="Payment Amount %s" % params['value'],
												  userid=params['user_id'],
												  customerid=params['icustomerid'],
												  customerpaymentid=payment.customerpaymentid)
			if monthly:
				auditparams["payment_month"] = date(int(params["yearid"]), int(params["monthid"]), 1).strftime("%Y-%m-%d")

			# complete auti trail
			session.add(AuditTrail(**auditparams))

			# create report options
			if not params.has_key("allocations"):
				reportdatainfo = {}
				reportoptions = params
				# setup payment line

				if "monthid" in params:
					date_string = Months.getDescription(int(params["monthid"])) + " " + str(params["yearid"])
					paymentline = Constants.Payment_Line2.decode("utf-8") % (total / 100.00, date_string)
					reportoptions['licencedetails'] = Constants.Licence_Line3 % (date_string)
					customer.last_paid = "%s-%s-01" % (params["yearid"], params["monthid"])
				elif params.has_key("licence_expire"):
					license_d = datetime.strptime(params["licence_expire"], "%Y-%m-%d")
					reportoptions['licencedetails'] = Constants.Licence_Line2 % (license_d.strftime("%d/%m/%Y"))
					paymentline = Constants.Payment_Line.decode("utf-8")% (total / 100.00, paymenttype.customerpaymenttypename)
					customer.last_paid = date.today().strftime("%Y-%m-%d")
				else:
					reportoptions['licencedetails'] = Constants.Licence_Line2 % (customer.licence_expire.strftime("%d/%m/%Y"))
					paymentline = Constants.Payment_Line.decode("utf-8") % (total / 100.00, paymenttype.customerpaymenttypename)
					customer.last_paid = date.today().strftime("%Y-%m-%d")

					if params.has_key("payment_date") and params["payment_date"]:
						payment_date = datetime.strptime(params['payment_date'], "%Y-%m-%d")
						paymentline = Constants.Payment_Line3.decode("utf-8") % payment_date.strftime("%d %B %Y")

				reportoptions['customerpaymentid'] = payment.customerpaymentid
				reportoptions['total'] = total
				reportoptions['vat'] = total - cost
				reportoptions['cost'] = cost
				reportoptions['customerid'] = params["icustomerid"]
				reportoptions['paymentline'] = paymentline
				reportoptions['message'] = params.get("message", "")
				reportoptions['monthly'] = monthly
				if params.has_key("payment_date") and params["payment_date"]:
					reportoptions["invoicedate"] = datetime.strptime(params['payment_date'], "%Y-%m-%d")

				# add report options
				Report.add(
					params['icustomerid'],
					Constants.Report_Output_pdf,
					reportoptions,
					reportdatainfo,
					Constants.Report_Template_Invoice)

			if params.get("emailtocustomer", False) == True:
				# make customer live
				# how about account's status
				customer.customerstatusid = Constants.Customer_Active
				password = ""

				# choose the login details based on the customer?

				user = User.query.filter_by(email_address=params["email"]).all()
				# make sure the email address exist and is no this users account
				# if this is a finaclial account will not work
				if user and user[0].customerid == customer.customerid:
					password = Pgenerate().generate_password_simple(6)[0:6]
					user[0].password = password

				sendorder = SendOrderConfirmationBuilder()
				if user:
					sendorder.setUser(user[0].email_address, password)

				sendorder.templatename = "payment_received_template.html"
				sendorder.subject = "Payment Receipted PRmax Activated"
				sendorder.audittext = "Receipt Conformation Sent"

				def _load_extra_data(lookup_data, extra_data):
					""" Load extra data """
					payment = CustomerPayments.query.get(extra_data)
					lookup_data["payment"] = dict(
					  payment=payment,
					  paymenttype=CustomerPaymentTypes.query.get(payment.paymenttypeid))

				sendorder.load_extra_func = _load_extra_data
				sendorder.load_extra_data = payment.customerpaymentid

				sendorder.run(params["icustomerid"],
				              params["email"],
				              params["userid"]
				             )



			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("payment_taken")
			raise

	@classmethod
	def credit(cls, inparams):
		""" Credit the account """
		transaction = session.begin(subtransactions=True)
		try:
			customer = Customer.query.get(inparams["icustomerid"])
			paymenttype = CustomerPaymentTypes.query.get(Constants.Payment_Credit)

			total = inparams["gross"]

			params = dict(customerid=inparams['icustomerid'],
			                payment=total,
			                paymenttypeid=paymenttype.customerpaymenttypeid,
			                actualdate=inparams["payment_date"],
			                vat=inparams["vat"])

			allocations = simplejson.loads(inparams["allocations"])
			unallocated = 0
			for row in allocations:
				unallocated += toInt(row["amount"])
			params["unallocated"] = total - unallocated

			payment = CustomerPayments(**params)
			session.add(payment)
			session.flush()

			for row in allocations:
				keyid = int(row["keyid"][1:])
				params = dict(source_paymentid=payment.customerpaymentid,
												amount=row["amount"] * 100)
				if not row["amount"]:
					continue
				if row["keyid"][0] == "I":
					params["alloc_invoiceid"] = keyid
					customerinvoice = CustomerInvoice.query.get(keyid)
					customerinvoice.unpaidamount -= (row["amount"] * 100)
					if customerinvoice.unpaidamount < 0:
						customerinvoice.unpaidamount = 0
				elif row["keyid"][0] == "A":
					params["alloc_adjustmentid"] = keyid
					adjustment = Adjustments.query.get(keyid)
					adjustment.unallocated -= (row["amount"] * 100)
					if adjustment.unallocated < 0:
						adjustment.unallocated = 0
				elif row["keyid"][0] == "P":
					params["alloc_paymentid"] = keyid
					customerpayment = CustomerPayments.query.get(keyid)
					customerpayment.unallocated -= (row["amount"] * 100)
					if customerpayment.unallocated < 0:
						customerpayment.unallocated = 0

				session.add(CustomerAllocation(**params))

			audittext = "Credit %.2f" % (float(inparams['gross']) / 100,)
			auditparams = dict(audittypeid=Constants.audit_credit,
												  audittext=audittext,
												  userid=inparams['user_id'],
												  customerid=inparams['icustomerid'],
												  customerpaymentid=payment.customerpaymentid)

			# complete auti trail
			audit = AuditTrail(**auditparams)
			session.add(audit)

			session.flush()

			reportoptions = inparams
			reportoptions["audittrailid"] = audit.audittrailid
			reportoptions["customerpaymentid"] = payment.customerpaymentid
			reportoptions["creditnotedate"] = inparams["payment_date"].strftime("%d/%m/%Y")

			reportoptions["cost"] = inparams["cost"]
			reportoptions["vat"] = inparams["vat"]
			reportoptions["total"] = inparams["gross"]

			Report.add(
				customer.customerid,
				Constants.Report_Output_pdf,
				reportoptions,
				{},
				Constants.Report_Template_Credit_Note)

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("credit")
			raise

	@classmethod
	def adjustment(cls, inparams):
		""" Credit the account """

		transaction = session.begin(subtransactions=True)
		try:
			total = inparams["value"] * 100.00

			params = dict(customerid=inparams['icustomerid'],
											amount=total,
											reason=inparams["message"],
											adjustmenttypeid=inparams["adjustmenttypeid"],
											actualdate=datetime.now(),
			                adjustmentdate=inparams["adjustmentdate"])

			allocations = simplejson.loads(inparams["allocations"])
			unallocated = 0
			for row in allocations:
				unallocated += row["amount"] * 100
			params["unallocated"] = abs(total) - unallocated

			# these are payments not charges
			if inparams["adjustmenttypeid"] in (4, 6):
				params["amount"] = total * -1
			adjustment = Adjustments(**params)
			session.add(adjustment)
			session.flush()

			# add allocations
			for row in allocations:
				if not row["amount"]:
					continue
				keyid = int(row["keyid"][1:])
				params = dict(source_adjustmentid=adjustment.adjustmentid,
												amount=row["amount"] * 100)
				if row["keyid"][0] == "I":
					params["alloc_invoiceid"] = keyid
					customerinvoice = CustomerInvoice.query.get(keyid)
					customerinvoice.unpaidamount -= (row["amount"] * 100)
					if customerinvoice.unpaidamount < 0:
						customerinvoice.unpaidamount = 0
				elif row["keyid"][0] == "A":
					params["alloc_adjustmentid"] = keyid
					adjustments = Adjustments.query.get(keyid)
					adjustments.unallocated -= (row["amount"] * 100)
					if adjustments.unallocated < 0:
						adjustments.unallocated = 0
				elif row["keyid"][0] == "P":
					params["alloc_paymentid"] = keyid
					customerpayment = CustomerPayments.query.get(keyid)
					customerpayment.unallocated -= (row["amount"] * 100)
					if customerpayment.unallocated < 0:
						customerpayment.unallocated = 0

				session.add(CustomerAllocation(**params))

			auditparams = dict(audittypeid=Constants.audit_adjustment,
												  audittext="Adjustment %s" % inparams['value'],
												  userid=inparams['user_id'],
												  customerid=inparams['icustomerid'],
												  adjustmentid=adjustment.adjustmentid)
			session.add(AuditTrail(**auditparams))

			transaction.commit()
		except:
			LOGGER.exception("Adjustment")
			transaction.rollback()
			raise

	@classmethod
	def dd_first_month(cls, params):
		""" Take the first monlty payment for a customer """
		# verify we are in the right place?
		transaction = session.begin(subtransactions=True)
		try:
			customer = Customer.query.get(params["icustomerid"])

			customer.isdemo = False
			customer.useemail = True
			customer.customerstatusid = Constants.Customer_Active

			customer.dd_ref = params["dd_ref"] if params["dd_ref"] else None
			customer.dd_collectiondate = params["dd_collectiondate"]
			customer.first_month_value = toInt(float(params["first_month_value"]))
			customer.pay_monthly_value = toInt(float(params["value"]))
			customer.pay_montly_day = params["pay_montly_day"]
			customer.dd_monitoring_value = params["dd_monitoring_value"]
			customer.sub_start_day = params["sub_start_day"]
			customer.next_invoice_message = params["message"]

			params['customerstatusid'] = Constants.Customer_Active

			cls.dd_create_invoice(
			  params,
			  customer,
			  round(float(params['first_month_value'].replace(",", "")), 2) * 100,
			  0,
			  0,
			  0,
			  0,
			  0)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("dd_first_month")
			transaction.rollback()
			raise

	@classmethod
	def _date_range(cls, customer, take_date):
		""" get the date raneg for a dd """
		year = take_date.year
		month = take_date.month
		if customer.dd_start_month > 0:
			# go back 1 month
			month -= customer.dd_start_month
			if month <= 0:
				month = 12 + month
				year -= 1
		from_d = date(year, month, customer.dd_start_day)

		# reset end month
		if customer.dd_start_month > 1:
			year = take_date.year
			month = take_date.month

		day = customer.dd_start_day - 1
		if day == 0:
			(dummy, day) = calendar.monthrange(year, month)
		else:
			month = month + 1
			if month == 13:
				year = year + 1
				month = 1

		to_date = date(year, month, day)

		return(from_d, to_date)


	@classmethod
	def dd_create_invoice(cls, inparams, customer, corevalue,  monitoringvalue, seovalue, advvalue, intvalue, clippingscost, clippingsfee):
		""" Setup dd invooice """
		vat = VatCodes.query.get(Countries.query.get(customer.countryid).vatcodeid)

		# add record to customer payment history
		# setup payment details
		if vat.rate > 0:
			cost = round((100 / (100 + (vat.rate / 10.0))) * (corevalue+seovalue+monitoringvalue+advvalue+intvalue+clippingscost+clippingsfee), 2)
			corevat = vat.calc_vat_amount_int(corevalue)
			seovat = vat.calc_vat_amount_int(seovalue)
			monitoringvat = vat.calc_vat_amount_int(monitoringvalue)
			advvaluevat = vat.calc_vat_amount_int(advvalue)
			intvaluevat = vat.calc_vat_amount_int(intvalue)
			clippingscostvat = vat.calc_vat_amount_int(clippingscost)
			clippingsfeevat = vat.calc_vat_amount_int(clippingsfee)

		else:
			cost = corevalue + seovalue + monitoringvalue + advvalue + intvalue + clippingsfee + clippingscost
			corevat = seovat = monitoringvat = advvaluevat = intvaluevat = clippingscostvat = clippingsfeevat = 0

		params = dict(customerid=customer.customerid,
								    payment=corevalue + seovalue + monitoringvalue + advvalue + intvalue + clippingscost + clippingsfee,
								    paymenttypeid=Constants.Payment_DD,
								    vat=corevalue + seovalue + monitoringvalue + advvalue + intvalue + clippingscost + clippingsfee - cost,
								    actualdate=customer.dd_collectiondate)

		payment = CustomerPayments(**params)
		session.add(payment)
		session.flush()

		auditparams = dict(audittypeid=Constants.audit_dd_invoice,
		                   audittext="DD Invoice %.2f" % (float(corevalue + seovalue + monitoringvalue + advvalue + intvalue+clippingscost+clippingsfee)/100,),
		                   userid=inparams['user_id'],
		                   customerid=customer.customerid,
		                   customerpaymentid=payment.customerpaymentid)

		session.add(AuditTrail(**auditparams))

		# create report options
		reportdatainfo = {}
		reportoptions = params
		# setup payment line

		datevalue = datetime.strptime(customer.dd_collectiondate, "%Y-%m-%d")
		date_string = datevalue.strftime("%d %b %Y")
		paymentline = Constants.Payment_Line_dd.decode("utf-8") % (date_string, )
		reportoptions['licencedetails'] = ""
		# user payment
		customer.last_paid = "%s-%s-01" % (datevalue.year, datevalue.month)

		reportoptions['total'] = corevalue + seovalue + monitoringvalue + advvalue + intvalue + clippingscost + clippingsfee
		reportoptions['vat'] = corevalue + seovalue +  monitoringvalue + advvalue + intvalue + clippingscost + clippingsfee - cost
		reportoptions['cost'] = cost

		# just set the value for the next month it's need to create csv
		customer.dd_collection_value = corevalue + seovalue + monitoringvalue + advvalue + intvalue + clippingscost + clippingsfee

		# this allows for breakdown
		if seovalue or monitoringvalue or advvalue or intvalue or clippingscost or clippingsfee:
			if customer.has_bundled_invoice:
				reportoptions["has_bundled_invoice"] = True

			reportoptions["corecost"] = corevalue - corevat
			if seovalue:
				reportoptions["seocost"] = seovalue - seovat
			if monitoringvalue:
				reportoptions["updatumcost"] = monitoringvalue -  monitoringvat
				reportoptions["monitoringnbr"] = customer.maxmonitoringusers
			if advvalue:
				reportoptions["advcost"] = advvalue - advvaluevat
			if intvalue:
				reportoptions["intcost"] = intvalue - intvaluevat
			if clippingscost:
				reportoptions["clippingscost"] = clippingscost - clippingscostvat
			if clippingsfee:
				reportoptions["clippingsfeevat"] = clippingsfee - clippingsfeevat

			reportoptions["modules"] = True

		reportoptions['customerid'] = customer.customerid
		reportoptions['paymentline'] = paymentline
		next_invoice_message = customer.next_invoice_message if customer.next_invoice_message else ""
		reportoptions['message'] = next_invoice_message

		# create date range
		if not reportoptions['message']:
			# create standard range

			(from_d, to_date) =  cls._date_range(customer, inparams["take_date"])
			template = Constants.Licence_Line5 if customer.isAdvanceActive() else Constants.Licence_Line4
			reportoptions['message'] = template % (customer.logins, from_d.strftime("%d/%m/%Y"), to_date.strftime("%d/%m/%Y"))

		reportoptions['message'] = reportoptions['message'].strip()
		customer.next_invoice_message = ""

		reportoptions['customerpaymentid'] = payment.customerpaymentid
		reportoptions['dd'] = True

		# if customer has seo press releases need to create payment line
		if seovalue:
			prmaxctrl = PRMaxControl.get()
			price = prmaxctrl.seo_not_prmax_price if customer.customertypeid == Constants.CustomerType_SEO else prmaxctrl.seo_prmax_price

			reportoptions['seolines'] = [ [ row[0].strftime("%d-%m-%y"), row[1][:60], "£%.2f" % (price / 100.0), price, row[2]] \
												            for row in session.query(SEORelease.seo_invoice_date, SEORelease.headline, SEORelease.seoreleaseid).\
												            filter(SEORelease.seostatusid == Constants.SEO_Status_Live).\
												            filter(SEORelease.seo_invoiced == False).\
												            filter(SEORelease.customerid == customer.customerid).\
			                              filter(SEORelease.seopaymenttypeid == Constants.SEO_PaymentType_DD).\
												            order_by(SEORelease.published).all() ]
			# set the seo as invoice
			session.query(SEORelease).\
				filter(SEORelease.seostatusid == Constants.SEO_Status_Live).\
				filter(SEORelease.seo_invoiced == False).\
			  filter(SEORelease.seopaymenttypeid == Constants.SEO_PaymentType_DD).\
				filter(SEORelease.customerid == customer.customerid).update(dict(seo_invoiced = True))
			session.flush()

		# add report options
		Report.add(
			customer.customerid,
			Constants.Report_Output_pdf,
			reportoptions,
			reportdatainfo,
			Constants.Report_Template_Invoice)

	_DDCustomerList = """SELECT customerid FROM internal.customers AS c
	WHERE c.customerstatusid IN(1,2,3,5) AND
	(paymentmethodid = 2 OR seopaymenttypeid = 2) AND  c.isinternal = false AND
	((dd_collectiondate NOT BETWEEN :fromdate AND :todate) OR dd_collectiondate IS NULL) """

	_DDCustomerStandardQuery = """ AND pay_montly_day IN(%s) AND financialstatusid != 2"""

	@classmethod
	def dd_invoice_run(cls, inparams):
		""" Create invoices for all customers """
		transaction = session.begin(subtransactions=True)
		nbr = 0
		try:
			params = cls.get_dd_invoice_run_params(inparams)

			results = session.execute(
			  text(params["query"]),
			  params,
			  PrmaxCustomerInfo).fetchall()
			for(customerid,) in results:
				customer = Customer.query.get(customerid)
				if customer.next_month_value:
					corevalue = customer.next_month_value
					advvalue = 0
					monitoringvalue = 0
					intvalue = 0
					clippingcore = 0
					clippingfee = 0
				else:
					corevalue = customer.pay_monthly_value
					advvalue = customer.dd_advance_value
					monitoringvalue = customer.dd_monitoring_value
					intvalue = customer.dd_international_data_value
					clippingcore = PaymentSystem.get_clipping_sub_value(customer, params["dd_collectiondate"])
					clippingfee = PaymentSystem.get_clippings_fee(customer, params["dd_collectiondate"])

				seovalue = cls._get_seo_value(customer)

				customer.dd_collectiondate = params["dd_collectiondate"]
				customer.last_paid = params["last_paid"]

				# only create an invoice if value
				if corevalue + seovalue + monitoringvalue + advvalue + intvalue + clippingcore + clippingfee != 0:
					cls.dd_create_invoice(params,
																customer,
																corevalue,
					                      monitoringvalue,
																seovalue,
					                      advvalue,
					                      intvalue,
					                      clippingcore,
					                      clippingfee)
					customer.dd_collection_value = corevalue + monitoringvalue + seovalue + advvalue + intvalue + clippingcore + clippingfee
				nbr += 1

			transaction.commit()
			return nbr
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("dd_invoice_run")
			raise

	@classmethod
	def get_dd_invoice_run_params(cls, params):
		""" get DD invoice params """

		tmp = date.today()
		days = []
		day = 0
		while day < 10:
			tmp = tmp + timedelta(days = 1)
			if tmp.weekday() in(5, 6):
				continue
			# bank holidays
			day += 1
			days.append(str(tmp.day))

		query = PaymentSystem._DDCustomerList + \
			" AND pay_montly_day = " + str(params["pay_montly_day"]) +  " ORDER BY c.customerid"

		return dict(fromdate = date.today().strftime("%Y-%m-%d"),
		              todate = tmp.strftime("%Y-%m-%d"),
		              tmp = params["take_date"],
		              days = days,
		              dd_collectiondate = params["take_date"].strftime("%Y-%m-%d"),
		              last_paid = tmp.strftime("%Y-%m-1"),
		              query = query,
		              dd_coll_date_display = params["take_date"].strftime("%d-%m-%y"),
		              user_id = params["user_id"],
		              take_date = params["take_date"])

	@classmethod
	def dd_invoice_run_draft(cls, inparams):
		""" Create invoices for all customers
		look at customer whi either have core set as dd or seo set as dd and create a list
		"""
		ret = []
		try:
			params = cls.get_dd_invoice_run_params(inparams)
			totalcore = totalseo = totalmonitoringvalue = totaladv = totalint = totalclipcore = totalclipfee = 0
			results = session.execute(text(params["query"]),
												        params,
												        PrmaxCustomerInfo).fetchall()
			for(customerid,) in results:
				customer = Customer.query.get(customerid)
				seovalue =  cls._get_seo_value(customer)
				if customer.next_month_value:
					corevalue = customer.next_month_value
					monitoringvalue = 0
					advvalue = 0
					intvalue = 0
					clippingcore = 0
					clippingfee = 0
				else:
					corevalue = customer.pay_monthly_value
					monitoringvalue = customer.dd_monitoring_value
					advvalue =  customer.dd_advance_value
					intvalue = customer.dd_international_data_value
					clippingcore = PaymentSystem.get_clipping_sub_value(customer, params["dd_collectiondate"])
					clippingfee = PaymentSystem.get_clippings_fee(customer, params["dd_collectiondate"])


				totalcore += corevalue
				totalseo += seovalue
				totalmonitoringvalue += monitoringvalue
				totaladv += advvalue
				totalint += intvalue
				totalclipcore += clippingcore
				totalclipfee += clippingfee

				(from_d, to_date) =  cls._date_range(customer, inparams["take_date"])
				ret.append([ customer.customerid,
				               customer.customername,
				               customer.next_invoice_message,
				               params["tmp"],
				               "%.2f" % (float(corevalue) / 100,),
				               "%.2f" % (float(monitoringvalue) / 100,),
				               "%.2f" % (float(seovalue) / 100,),
				               "%.2f" % (float(advvalue) / 100,),
				               "%.2f" % (float(intvalue) / 100,),
				               "%.2f" % (float(clippingcore) / 100,),
				               "%.2f" % (float(clippingfee) / 100,),
				               "%.2f" % (float(seovalue+corevalue+monitoringvalue+advvalue+intvalue+clippingcore+clippingfee)/100,),
				               customer.dd_start_day,
				               from_d.strftime("%d/%m/%y"),
				               to_date.strftime("%d/%m/%y")])
			ret.append(["", "Batch Total", "", "",
			            "%.2f" % (float(totalcore) / 100,),
			            "%.2f" % (float(totalmonitoringvalue) / 100,),
			            "%.2f" % (float(totalseo) / 100,),
			            "%.2f" % (float(totaladv) / 100,),
			            "%.2f" % (float(totalint) / 100,),
			            "%.2f" % (float(totalclipcore) / 100,),
			            "%.2f" % (float(totalclipfee) / 100,),
			            "%.2f" % (float(totaladv+totalseo+totalcore+totalmonitoringvalue+totalint+totalclipcore+totalclipfee)/100,),
			            "", "", "", ""])
		except Exception, ex:
			ret = [[str(ex), "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]

		return ret

	@classmethod
	def _get_seo_value(cls, customer):
		" Get the value of seo for a customer that need to be dd "
		seovalue =  0

		#return seovalue
		# get the default price for an seo ?
		prmaxctrl = PRMaxControl.get()
		price = prmaxctrl.seo_not_prmax_price if customer.customertypeid == Constants.CustomerType_SEO else prmaxctrl.seo_prmax_price

		# customer specific price ?

		if customer.seopaymenttypeid == Constants.SEO_PaymentType_DD:
			seovalue = session.query(func.sum(price)).\
				filter(SEORelease.seostatusid == Constants.SEO_Status_Live).\
				filter(SEORelease.seo_invoiced == False).\
				filter(SEORelease.customerid == customer.customerid).\
			  filter(SEORelease.seopaymenttypeid == Constants.SEO_PaymentType_DD).\
				all()[0][0]
		return seovalue if seovalue else 0

	_DDCustomerCsv = """SELECT customerid
	FROM internal.customers AS c
	WHERE
	c.customerstatusid IN(1,2,3,5) AND
		paymentmethodid = 2 AND pay_montly_day = :pay_montly_day AND
			dd_collectiondate BETWEEN :fromdate AND :todate"""


#row = ["", 									#Reserved
#customer.dd_ref, 		#Payer reference
#customer.bank_account_name,			#Payer account name
#customer.bank_sort_code,					#Payer account sort code
#customer.bank_account_nbr, 			#Payer account number
#config.get("prmax.dd.account"),	#Credit account id
#"",															#Suppress 01 enabled
#"",															#Suppress 19 enabled
#"",															#Catch up enabled
#"",															#Empty frequency enabled
#"",															#Suppress expiry enabled
#"",															#Letters enabled
#"",															#Paperless debits enabled
#"",															#Account validation enabled
#customer.contact_title,					#Title
#customer.contact_firstname,			#Forename
#customer.contact_surname,				#Surname
#customer.customername if not customer.individual else "",	#Company name
#address.address1, 								#Address line 1
#address.address2,								#Address line 2
#"",															#Address line 3
#address.townname,								#City/Town
#address.county,									#County
#address.postcode,								#Postal code
#"",															#Country
#customer.tel,										#Phone number
#"",															#Fax number
#customer.email,									#Email
#"1" if customer.first_month_value else "0" #New frequency
#"M",															#Frequency type
#"",															#Regular amount
#"",															#First amount
#"",															#Last amount
#"%.2f" % total,									#Total amount
#"",															#Start year
#"",															#Start month
#"",															#Start day
#"",															#End year
#"",															#End month
#"",															#End day
#"",															#Number of debits
#"",															#Reserved
#"",															#Reserved
#"",															#Reserved
#"",															#Alternate key
#""																#Status
#]


	@classmethod
	def dd_create_csv(cls, inparams):
		""" create the csv file """

		transaction = session.begin(subtransactions=True)
		rows = []
		try:
			control = PRMaxControl.get()
			fromdate = "2001-01-01"
			if control.last_dd_payment_run:
				fromdate =(control.last_dd_payment_run + timedelta(days = 1)).strftime("%Y-%m-%d")

			todate = date.today() + timedelta(days = 20)
			params = dict(fromdate = fromdate,
											todate = todate.strftime("%Y-%m-%d"),
											pay_montly_day = inparams["pay_montly_day"])

			results = session.execute(text(PaymentSystem._DDCustomerCsv),
												        params,
												        PRMaxControl)
			for customerid in results:
				customer = Customer.query.get(customerid[0])
				total = customer.dd_collection_value
				row = ["", 																		# Reserved
							 customer.dd_ref, 															# Payer reference
							 "%.2f" %(total/100.0,),											# value
							 customer.dd_collectiondate.strftime("%Y%m%d"),# date
							 "",
							 "",
							 ""]
				rows.append(row)

			output = StringIO.StringIO()
			csv_write = csv.writer(output)
			csv_write.writerows(rows)
			output.flush()
			rdata = output.getvalue()

			control.last_dd_payment_run = date.today().strftime("%Y-%m-%d")
			transaction.commit()

			return rdata

		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("dd_create_csv")
			raise


	@classmethod
	def dd_clear_post_csv(cls, inparams):
		""" Clear down the monlty figures"""

		transaction = session.begin(subtransactions=True)
		try:
			control = PRMaxControl.get()
			fromdate = "2001-01-01"
			if control.last_dd_payment_run:
				fromdate =(control.last_dd_payment_run + timedelta(days = 1)).strftime("%Y-%m-%d")

				todate = date.today() + timedelta(days = 20)
				params = dict(fromdate = fromdate,
												todate = todate.strftime("%Y-%m-%d"),
												pay_montly_day = inparams["pay_montly_day"])

				results = session.execute(text(PaymentSystem._DDCustomerCsv),
																  params,
																  PRMaxControl)
				for customerid in results:
					customer = Customer.query.get(customerid[0])
					total = customer.dd_collectiondate

					session.add(AuditTrail(audittypeid = Constants.audit_dd_csv,
																		audittext="Export For DD %.2f" %(total/100.0,),
																		userid = params['user_id'],
																		customerid = customerid[0]))

					customer.next_month_value = 0
					customer.first_month_value = 0

			control.last_dd_payment_run = date.today().strftime("%Y-%m-%d")
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("dd_clear_post_csv")
			raise


	@classmethod
	def dd_create_csv_draft(cls, params):
		""" create a draft csv file"""

		ret = []
		try:
			control = PRMaxControl.get()
			fromdate = "2001-01-01"
			if control.last_dd_payment_run:
				fromdate =(control.last_dd_payment_run + timedelta(days = 1)).strftime("%Y-%m-%d")

			todate = date.today() + timedelta(days = 20)
			params = dict(fromdate = fromdate,
											todate = todate.strftime("%Y-%m-%d"),
											pay_montly_day = params["pay_montly_day"])

			results = session.execute(text(PaymentSystem._DDCustomerCsv),
												        params,
												        PRMaxControl)
			total = 0
			tcount = 0
			for customerid in results:
				customer = Customer.query.get(customerid[0])
				value = customer.dd_collection_value
				total += value
				tcount += 1
				ret.append([ customer.customerid,
				               customer.customername,
				               customer.next_invoice_message,
				               "", "", "", "", "", "",
				               "%.2f" %(float(value)/100,),
				               "", "", ""])
			ret.append([ "", "Batch Total",
			               "Nbr(%d)" % tcount,
			               "", "", "", "", "", "",
			               "%.2f" %(float(total)/100,),
			               "", "", ""])
		except Exception,  ex:
			ret = [[str(ex), "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]

		return ret

	@classmethod
	def fail_last_dd(cls, params):
		""" Fail a DD """

		transaction = session.begin(subtransactions=True)
		try:
			# find last payment for customer
			# cancel payment
			# add to auditrail
			# set custoemr financial status
			payment = session.query(CustomerPayments).filter_by(customerid = params["icustomerid"])\
				.filter_by(paymenttypeid = Constants.Payment_DD)\
				.order_by(CustomerPayments.customerpaymentid).all()[-1]

			customer = Customer.query.get(params["icustomerid"])
			customer.financialstatusid = Constants.Customer_Finacial_Payment_Overdue
			customer.last_paid = None

			payment.reason = params["reason"]
			payment.paymentreturnreasonid = params["paymentreturnreasonid"]
			if payment.payment:
				payment.org_payment = payment.payment
				payment.payment = 0

				fields = dict(customerpaymentid = payment.customerpaymentid)

				session.add(AuditTrail(
					audittypeid = Constants.audit_dd_rejected,
					audittext="Payment Rejected",
					userid = params["user_id"],
					customerid = params["icustomerid"],
					auditextfields = DBCompress.encode2(fields)))

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except: pass
			LOGGER.exception("fail_last_dd")
			raise

	@classmethod
	def add_manual_invoice(cls, params):
		""" add a manual invoice too the system """

		transaction = session.begin(subtransactions=True)
		try:
			# get internal invoice nbr
			invoicenbr = CustomerInvoice.getNextInvoiceId()

			# add entry to audit trail with a copy of the actual invoice
			audittext = "Invoice"
			if params["invoice_ref"]:
				audittext += " "
				audittext += params["invoice_ref"]

			audit = AuditTrail(
				audittypeid = Constants.audit_invoice,
				audittext= audittext,
				userid = params["userid"],
				customerid = params["icustomerid"],
				invoicenbr = invoicenbr,
				document = DBCompress.encode2(params["invoice_file"].file.read()))
			session.add(audit)
			session.flush()

			# add invoice record
			session.add(CustomerInvoice(
				invoicenbr = invoicenbr,
				invoiceamount  = int(round(float(params["amount"])*100,0)),
				vat  = int(round(float(params["vat"])*100,0)),
				invoicedate = params["invoice_date"],
				invoiceref = params["invoice_ref"],
				audittrailid = audit.audittrailid,
				unpaidamount = int(round(float(params["unpaidamount"])*100,0)),
				subject = "Invoice",
				customerid = params["icustomerid"]))
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("addManualInvoice")
			raise

	@classmethod
	def send_pre_invoice(cls, iparams):
		""" Send an invoice before we have the money """

		transaction = session.begin(subtransactions=True)
		try:
			# get tables
			customer = Customer.query.get(iparams["icustomerid"])
			vat = VatCodes.query.get(Countries.query.get(customer.countryid) .vatcodeid)

			# setup expire dates
			licence_start_date = iparams["licence_start_date"]
			licence_expire = DateAddMonths(licence_start_date, iparams["months_free"] + iparams["months_paid"])

			# update po number
			customer.purchase_order = iparams["purchase_order"]

			# exclude vat
			cost = iparams["cost"]
			mediacost = cost
			if customer.advancefeatures:
				advcost = iparams["advcost"]
				cost += iparams["advcost"]
			if customer.updatum:
				updatumcost = iparams["updatumcost"]
				cost += iparams["updatumcost"]

			cost = round(cost, 2)

			if vat.rate > 0:
				total = round(cost + vat.calc_vat_required(cost), 2)
			else:
				total = cost

			# now setup invoice print details
			reportdatainfo = {}
			reportoptions = iparams
			reportdatainfo["show_bank"] = True
			# Clean out options
			if not customer.advancefeatures:
				reportoptions.pop("advcost", None)
			if not customer.updatum:
				reportoptions.pop("updatumcost", None)

			# setup text
			if iparams["isdd"]:
				if iparams["advancefeatures"]:
					reportoptions['licencedetails'] = Constants.Licence_Line8
				else:
					reportoptions['licencedetails'] = Constants.Licence_Line7
			else:
				template = Constants.Licence_Line5 if customer.advancefeatures else Constants.Licence_Line4
				reportoptions['licencedetails'] = template %(customer.logins,
																                       licence_start_date.strftime("%d/%m/%Y"),
																                       licence_expire.strftime("%d/%m/%Y"))
			reportoptions['modules'] = True
			reportoptions['corecost'] = toInt(mediacost)
			if customer.advancefeatures:
				reportoptions['advcost'] = toInt(advcost)
			if customer.updatum:
				reportoptions['updatumcost'] = toInt(updatumcost)
			# setup the fields
			reportoptions['total'] = toInt(total)
			reportoptions['vat'] = toInt(total - cost)
			reportoptions['cost'] = toInt(cost)
			reportoptions['customerid'] = iparams["icustomerid"]
			reportoptions['paymentline'] = ""
			reportoptions['message'] = iparams.get("message","")
			reportoptions["invoicedate"]  = iparams["invoice_date"]
			reportoptions['purchase_order'] = iparams["purchase_order"]

			# add report to queue
			Report.add(
				iparams['icustomerid'],
				Constants.Report_Output_pdf,
				reportoptions,
				reportdatainfo,
				Constants.Report_Template_Invoice)

			transaction.commit()
		except:
			LOGGER.exception("send_pre_invoice")
			transaction.rollback()
			raise

	@classmethod
	def invoice_one_off_send(cls, params):
		"""Send One off invoice"""

		transaction = session.begin(subtransactions=True)
		try:
			# exclude vat
			reportoptions = dict(
			  show_bank = True,
				total = toInt(params["amount"]),
				vat = toInt(params["vat"]),
				cost = toInt(params["amount"] - params["vat"]),
				customerid = params["icustomerid"],
				message = params.get("message",""),
			  email = params.get("email", ""),
				invoicedate = params["invoice_date"],
				licencedetails = "",
				purchase_order = params.get("purchase_order", ""),
			  oneoff = True)

			# add report options
			Report.add(
				params['icustomerid'],
				Constants.Report_Output_pdf,
				reportoptions,
				{},
				Constants.Report_Template_Invoice)

			transaction.commit()
		except:
			LOGGER.exception("invoice_one_off_send")
			transaction.rollback()
			raise

	@classmethod
	def add_manual_credit(cls, params):
		""" Add a manual credit note """

		transaction = session.begin(subtransactions=True)
		try:
			paymenttype = CustomerPaymentTypes.query.get(Constants.Payment_Credit)

			creditnotenbr = None
			tmp =  session.query(PRMaxSettings).all()
			if tmp:
				creditnotenbr = tmp[0].lastcreditnotenbr + 1
				tmp[0].lastcreditnotenbr = creditnotenbr

			creditfiledata = params["credit_file"].file.read()

			payment = CustomerPayments(
				customerid = params['icustomerid'],
				payment = toInt(params["amount"]),
				paymenttypeid = paymenttype.customerpaymenttypeid,
				actualdate = params["credit_date"],
				unallocated = toInt(params["unpaidamount"]),
			  creditnotenbr = creditnotenbr,
				document = DBCompress.encode2(creditfiledata),
				ref = params["ref"],
				vat = toInt(params["vat"]))
			session.add(payment)
			session.flush()
			# complete auti trail
			audit = AuditTrail(
				audittypeid = Constants.audit_credit,
				audittext="Credit %s - %s" %(params['amount'], params["ref"]),
				userid = params['userid'],
				customerid = params['icustomerid'],
				customerpaymentid = payment.customerpaymentid,
				document = DBCompress.encode2(creditfiledata))
			session.add(audit)
			transaction.commit()
		except:
			LOGGER.exception("add_manual_credit")
			raise

	@staticmethod
	def get_clipping_sub_value(customer, last_paid):
		"""Get active orders for period and get a price"""
		subvalue = 0
		for row in session.query(ClippingsOrder, ClippingsPrices).\
				  join(ClippingsPrices, ClippingsOrder.clippingspriceid == ClippingsPrices.clippingspriceid).\
		      filter(ClippingsOrder.customerid == customer.customerid).\
		      filter(and_(ClippingsOrder.startdate<=last_paid,ClippingsOrder.enddate>=last_paid)):
			subvalue += row[1].price

		return subvalue

	@staticmethod
	def get_clippings_fee(customer, last_paid):
		"""nbr of clips requring a payment """

		perclipvalue = 0

		for row in session.query(ClippingsOrder, ClippingsPrices, ClippingPriceServiceLevel).\
				  join(ClippingsPrices, ClippingsOrder.clippingspriceid == ClippingsPrices.clippingspriceid).\
					join(ClippingPriceServiceLevel, ClippingPriceServiceLevel.clippingpriceservicelevelid == ClippingsPrices.clippingpriceservicelevelid).\
		      filter(ClippingsOrder.customerid == customer.customerid).\
		      filter(and_(ClippingsOrder.startdate<=last_paid,ClippingsOrder.enddate>=last_paid)):
			if row[1].extraperclip:
				# need to be last full calandar month ?
				last_month = date.today() - timedelta(days=25)
				(_, upper_date) = calendar.monthrange (last_month.year, last_month.month)
				params = {"icustomerid" : customer.customerid,
				          start_date : date(last_month.year, last_month.month, 1),
				          end_date : date(last_month.year, last_month.month, upper_date),}
				nbrclips = session.execute(text("""SELECT IFNULL(COUNT(*),0) FROM userdata.clippings WHERE customerid=:icustomerid AND
				CAST(created_date AS DATE) BETWEEN :start_date AND :end_date"""), Clipping, params).fetchall()[0][0]
				perclipvalue += (row[1].extraperclip * nbrclips)

		return perclipvalue

class PrmaxCustomerInfo(BaseSql):
	""" front screen specific info """
	@classmethod
	def get(cls, customerid, specific = False):
		""" get the front screen for a spcific customer"""
		inforec = cls.query.filter_by(customerid  = customerid,
								                   customerinfotypeid = 1)
		if(inforec.count() == 0 and customerid != -1 and specific == False) or\
			(inforec.count() == 1 and len(inforec.one().info)==0):
			inforec = cls.query.filter_by(customerid=-1, customerinfotypeid=1)

		return "" if inforec.count() == 0 else inforec.one().info

	@classmethod
	def change(cls, customerid, info):
		""" chnage """
		transaction = cls.sa_get_active_transaction()
		try:
			info = info.strip()
			if info == "\n":
				info = ""
			inforec = cls.query.filter_by(customerid  = customerid,
												             customerinfotypeid = 1)
			if inforec.count():
				inforec.one().info = info
			else:
				session.add(PrmaxCustomerInfo(customerid = customerid,
																          customerinfotypeid = 1,
																          info = info))
				session.flush()
			transaction.commit()
		except:
			LOGGER.exception("prmaxcustomerinfo_change")
			transaction.rollback()
			raise

class DemoRequests(BaseSql):
	""" Demo list """

	@classmethod
	def add(cls, params):
		""" add an entry into the demo request list """

		transaction = cls.sa_get_active_transaction()
		try:

			session.add(DemoRequests(**params))

			EmailQueue.send_email_and_attachments(
				Constants.SalesEmail,
				Constants.SalesEmail,
				"Demo Request Submitted",
				"Demo Request Submitted",
				[],
				Constants.EmailQueueType_Internal,
				"text/html",
			    Constants.Email_Html_Only,
			    None)

		except:
			LOGGER.exception("DemoRequests_Add")
			transaction.rollback()
			raise

	@classmethod
	def delete(cls, demorequestid):
		""" request a demo delete record """

		transaction = cls.sa_get_active_transaction()
		try:
			demorequest = DemoRequests.query.get(demorequestid)
			session.delete(demorequest)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("DemoRequest_Delete")
			transaction.rollback()
			raise

	ListData = """
	SELECT
		demorequestid,
	  customername,
	  ContactName(contact_title,contact_firstname,'',contact_surname,'') as contactname,
	  job_title,
	  email,
	  address1,
	  address2,
	  townname,
	  county,
	  postcode,
	  telephone,
	  ct.customertypename
	  FROM internal.demorequests AS dr
	  LEFT OUTER JOIN internal.customertypes AS ct ON ct.customertypeid = dr.customertypeid
		ORDER BY  %s %s
		LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM internal.demorequests"""

	@classmethod
	def getGridPage(cls, params):
		return BaseSql.getGridPage(params,
		                           'customername',
		                           'demorequestid',
		                           DemoRequests.ListData,
		                           DemoRequests.ListDataCount,
		                           cls)

	@classmethod
	def reactive_demo(cls, params):
		""" Reactive this as a demo """

		cust = Customer.query.get(params["icustomerid"])

		# reset-date passed thr
		cust.setExtpireDateInternal(params["icustomerid"],
								                params["licence_expire"],
								                params["licence_expire"],
								                cust.licence_start_date,
								                cust.advance_licence_start,
								                cust.updatum_start_date,
								                cust.updatum_end_date,
								                params["userid"],
								                cust.advancefeatures,
								                None)
		cust.customerstatusid=2
		# find task
		tasks = session.query(Task).filter_by(userid=params["assigntoid"]).\
		  filter_by(tasktypeid=Constants.TaskType_Trial).\
		  filter_by(ref_customerid=params["icustomerid"]).all()
		if tasks:
			# update the current task
			task = tasks[0]
			task.userid = params["assigntoid"]
			task.tasktypeid = Constants.TaskType_Trial
			task.taskstatusid = Constants.TaskStatus_InProgress
			task.ref_customerid = params["icustomerid"]
			task.due_date = TtlDate.addWorkingDates(datetime.now(), days=5)
		else:
			# add Task
			task = Task(userid=params["assigntoid"],
			           tasktypeid =Constants.TaskType_Trial,
			           taskstatusid=Constants.TaskStatus_InProgress,
			           ref_customerid =params["icustomerid"],
			           due_date=TtlDate.addWorkingDates(datetime.now(), days=5))
			session.add(task)
			session.flush()

		session.add(ContactHistory(
			ref_customerid=params["icustomerid"],
			userid=params["userid"],
			details="Demo Request",
			customerid=params["customerid"],
			subject="Demo Request",
			contacthistorysourceid=Constants.Contact_History_Type_Sales,
			taskid=task.taskid))

PrmaxCustomerInfo.mapping = Table('prmaxcustomerinfo', metadata, autoload=True, schema="internal")
DemoRequests.mapping = Table('demorequests', metadata, autoload=True, schema="internal")

mapper(CustomerExternal, CustomerExternal.mapping)
mapper(PrmaxCustomerInfo, PrmaxCustomerInfo.mapping)
mapper(DemoRequests, DemoRequests.mapping)
