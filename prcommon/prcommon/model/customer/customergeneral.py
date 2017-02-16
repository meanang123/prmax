# -*- coding: utf-8 -*-
""" Customer General """
#-----------------------------------------------------------------------------
# Name:       customergeneral.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     20/07/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
import logging
from turbogears.database import session
from sqlalchemy.sql import func
from ttl.model.common import BaseSql
from ttl.PasswordGenerator import Pgenerate
from ttl.ttlemail import send_gmail_server, EmailMessage
from prcommon.model.internal import AuditTrail
from prcommon.model.identity import Customer
from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.lookups import CustomerTypes, CustomerStatus, CustomerSources
from prcommon.model.communications import Address
from prcommon.model.identity import User
from prcommon.model.customer.customeraccesslog import CustomerAccessLog
import prcommon.Constants as Constants
from prcommon.Const.Email_Templates import Demo_Body, Demo_Subject
LOGGER = logging.getLogger("prcommon.model")

PARTNER_EMAIL = "chris.g.hoy@gmail.com"  #Constants.SalesEmail_Basic

class CustomerGeneral(object):
	""" Customer General"""

	@staticmethod
	def new_tanc_accepted(params):
		""" user has accepted upgrade order confirmation """

		try:
			transaction = BaseSql.sa_get_active_transaction()

			cust = Customer.query.get(params["customerid"])
			cust.confirmation_new_tandc = False

			session.add(AuditTrail(
			  audittypeid=Constants.audit_order_confirmation_confirmed,
			  audittext="New Terms and Condition Accepted",
			  userid=params["userid"],
			  customerid=params["customerid"]))

			transaction.commit()
		except:
			LOGGER.exception("new_tanc_accepted")
			transaction.rollback()
			raise

	@staticmethod
	def get_admin_summary(params):
		"""get summary """

		retdata = dict(customer=Customer.query.get(params["icustomerid"]))
		retdata["status"] = CustomerStatus.query.get(retdata["customer"].customerstatusid)

		# access details
		retdata["last_logged_in"] = session.query(func.max(CustomerAccessLog.accessed)).\
		  filter(CustomerAccessLog.customerid == params["icustomerid"]).\
		  filter(CustomerAccessLog.levelid == CustomerAccessLog.LOGGEDIN).scalar()

		retdata["last_accessed"] = session.query(func.max(CustomerAccessLog.accessed)).\
		  filter(CustomerAccessLog.customerid == params["icustomerid"]).\
		  filter(CustomerAccessLog.levelid == CustomerAccessLog.MAINSYSTEMACCESSED).scalar()

		retdata["last_accessed_count"] = session.query(func.count(CustomerAccessLog.accessed)).\
		  filter(CustomerAccessLog.customerid == params["icustomerid"]).\
		  filter(CustomerAccessLog.levelid == CustomerAccessLog.MAINSYSTEMACCESSED).scalar()

		retdata["last_searched_in"] = session.query(func.max(CustomerAccessLog.accessed)).\
		  filter(CustomerAccessLog.customerid == params["icustomerid"]).\
		  filter(CustomerAccessLog.levelid == CustomerAccessLog.DOSEARCH).scalar()


		return retdata

	@staticmethod
	def add_partner_customer(params):
		"""Add a customer for a partner """

		try:

			custtype = CustomerTypes.query.get(params["prstate"].u.customertypeid)

			transaction = BaseSql.sa_get_active_transaction()

			addr = Address(address1=params["address1"],
					           address2=params["address2"],
					           county=params["county"],
					           postcode=params["postcode"],
					           townname=params["townname"],
					           addresstypeid=Address.customerAddress)
			session.add(addr)
			session.flush()

			cust = Customer(
					customertypeid=params["prstate"].u.customertypeid,
					customerstatusid=Constants.Customer_Active,
					customername=params["customername"],
					contactname="",
					contact_title=params["contact_title"],
					contact_firstname=params["contact_firstname"],
					contact_surname=params["contact_surname"],
					contactjobtitle=params["contactjobtitle"],
					logins=params["logins"],
					addressid=addr.addressid,
					email=params["email"],
					tel=params["tel"],
					termid=1,
					licence_expire=params["enddate"],
					nbrofloginsid=1,
			    maxnbrofusersaccounts=params["maxnbrofusersaccounts"],
					proforma=False,
					isdemo=params["isdemo"],
					useemail=False,
					countryid=params["countryid"],
					advancefeatures=params["advancefeatures"],
					licence_start_date=params["startdate"])

			cust.set_type_defaults()

			session.add(cust)
			session.flush()

			# add defaults
			session.add(CustomerAccountsDetails(customerid=cust.customerid))
			session.add(CustomerSettings(customerid=cust.customerid))
			CustomerPrmaxDataSets.set_primary(cust.customerid)

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

			transaction.commit()

			# send sales/accounts email of details
			subject = custtype.customertypename + " - "
			subject += "Demo" if params["isdemo"] else "Live"
			field = {}
			field["Customerid Id"] = str(cust.customerid)
			field["Customer Name"] = params["customername"]
			field["Type"] = "Demo" if params["isdemo"] else "Live"
			field["Concurrent Logins"] = str(params["logins"])
			field["Max Logins"] = str(params["nbrofusersaccounts"])
			field["End Date"] = params["enddate"].strftime("%d/%m/%y")
			field["Notes"] = params["details"].replace("\n", "<br/>")

			body_text = "<table>" + "".join(["<tr><td>%15s</td><td>%s</td></tr>" % row for row in field.items()]) + "</table>"

			email = EmailMessage(Constants.SalesEmail,
					                 PARTNER_EMAIL,
			                     subject,
					                 body_text,
					                 "text/html")
			#email.cc = Constants.AccountsEmail
			email.BuildMessageHtmlOnly()
			try:
				send_gmail_server(email, Constants.SalesEmail_Basic, Constants.SalesEmail_Password)
			except:
				LOGGER.exception("add_partner_customer_send_sales_email")

			if params["isdemo"] and params["prstate"].u.customertypeid is None:
				# is required
				email = EmailMessage(Constants.SalesEmail,
				                     "chris.g.hoy@gmail.com",  #user.email_address
				                     Demo_Subject,
				                     Demo_Body % (user.display_name, user.email_address, password,
				                                  cust.licence_expire.strftime("%d %b %y")),
							                "text/html")
				email.BuildMessageHtmlOnly()
				try:
					send_gmail_server(email, Constants.SalesEmail_Basic, Constants.SalesEmail_Password)
				except:
					LOGGER.exception("add_partner_customer_send_demo_email")

			return cust.customerid
		except:
			LOGGER.exception("add_partner_customer")
			transaction.rollback()
			raise

	@staticmethod
	def partner_account_exists(params):
		"check to see if username compnay name exists"

		if User.exists(params['email']) or User.exists_email(params['email']):
			return dict(success="DU", message="Email address already exists")

		result = session.query(Customer).filter_by(customername=params["customername"])
		if result.count():
			return dict(success="DU", message="Company Already Exists")

		return None


	@staticmethod
	def display_row(customerid):
		"Dispay row"

		customer = Customer.query.get(customerid)
		custtype = CustomerTypes.query.get(customer.customertypeid)
		custstatus = CustomerStatus.query.get(customer.customerstatusid)
		custsource = CustomerS

		return dict(
		  customerid=customerid,
		  customername=customer.customername,
		  customertypename=custtype.customertypename,
		  contactname=customer.contactname,
		  licence_expire=customer.licence_expire.strftime("%d/%m/%y"),
		  customerstatusname=custstatus.customerstatusname,
		  created=customer.created.strftime("%d/%m/%y"),
		  last_login_display="")

	@staticmethod
	def partner_demo_to_live(params):
		"""Demo to Live"""
		try:
			transaction = BaseSql.sa_get_active_transaction()

			customer = Customer.query.get(params["icustomerid"])
			custtype = CustomerTypes.query.get(customer.customertypeid)
			customer.isdemo = False
			customer.useemail = False
			customer.emailistestmode = False
			session.add(AuditTrail(
					audittypeid=Constants.audit_expire_date_changed,
			    audittext="Core Demo Status Changed from %s to %s" % (customer.isdemo, False),
					userid=params["userid"],
					customerid=params["icustomerid"]))

			if customer.licence_expire != params["enddate"]:
				customer.licence_expire = params["enddate"]
				session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
						                   audittext="Core Expire Date %s" % (params["enddate"].strftime("%d/%m/%y")),
						                   userid=params["userid"],
						                   customerid=params['icustomerid']))

			customer.licence_start_date = params["startdate"]

			transaction.commit()

			subject = custtype.customertypename + " - Demo to Live"
			field = {}
			field["Customerid Id"] = str(customer.customerid)
			field["Customer Name"] = customer.customername
			field["Concurrent Logins"] = customer.logins
			field["Max Logins"] = customer.maxnbrofusersaccounts
			field["Start Date"] = params["startdate"].strftime("%d/%m/%y")
			field["End Date"] = params["enddate"].strftime("%d/%m/%y")

			body_text = "<table>" + "".join(["<tr><td>%15s</td><td>%s</td></tr>" % row for row in field.items()]) + "</table>"

			email = EmailMessage(Constants.SalesEmail,
					                 PARTNER_EMAIL,
			                     subject,
					                 body_text,
					                 "text/html")
			#email.cc = Constants.AccountsEmail
			email.BuildMessageHtmlOnly()
			try:
				send_gmail_server(email, Constants.SalesEmail_Basic, Constants.SalesEmail_Password)
			except:
				LOGGER.exception("apartner_demo_to_live_send_sales_email")

		except:
				LOGGER.exception("partner_demo_to_live")
				transaction.rollback()
				raise

	@staticmethod
	def partner_extend_live(params):
		"""Extended Live"""
		try:
			transaction = BaseSql.sa_get_active_transaction()

			customer = Customer.query.get(params["icustomerid"])
			custtype = CustomerTypes.query.get(customer.customertypeid)
			if customer.licence_expire != params["enddate"]:
				customer.licence_expire = params["enddate"]
				session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
						                   audittext="Core Expire Date %s" % (params["enddate"].strftime("%d/%m/%y")),
						                   userid=params["userid"],
						                   customerid=params['icustomerid']))

			if customer.advancefeatures != params["advancefeatures"]:
				customer.advancefeatures = params["advancefeatures"]
				session.add(AuditTrail(
					audittypeid=Constants.audit_expire_date_changed,
					audittext="Features Turned %s" % "On" if params["advancefeatures"] else "Off",
					userid=params["userid"],
					customerid=params["icustomerid"]))

			if customer.maxnbrofusersaccounts != params["maxnbrofusersaccounts"]:
				session.add(AuditTrail(audittypeid=Constants.audit_logins_changed,
								               audittext="User Count changed from %s to %s" % (customer.maxnbrofusersaccounts, params["maxnbrofusersaccounts"]),
								               userid=params["userid"],
								               customerid=params["icustomerid"]))
				customer.maxnbrofusersaccounts = params["maxnbrofusersaccounts"]

			if customer.logins != params["logins"]:
				session.add(AuditTrail(audittypeid=Constants.audit_logins_changed,
				                       audittext="Concurrent Count changed from %s to %s" % (customer.logins, params["logins"]),
				                       userid=params["userid"],
				                      customerid=params["icustomerid"]))
				customer.logins = params["logins"]

			transaction.commit()

			subject = custtype.customertypename + " - Extend Live"
			field = {}
			field["Customerid Id"] = str(customer.customerid)
			field["Customer Name"] = customer.customername
			field["Concurrent Logins"] = customer.logins
			field["Max Logins"] = customer.maxnbrofusersaccounts
			field["End Date"] = params["enddate"].strftime("%d/%m/%y")
			field["Features"] = "Yes" if params["advancefeatures"] else "No"

			body_text = "<table>" + "".join(["<tr><td>%15s</td><td>%s</td></tr>" % row for row in field.items()]) + "</table>"

			email = EmailMessage(Constants.SalesEmail,
					                 PARTNER_EMAIL,
			                     subject,
					                 body_text,
					                 "text/html")
			#email.cc = Constants.AccountsEmail
			email.BuildMessageHtmlOnly()
			try:
				send_gmail_server(email, Constants.SalesEmail_Basic, Constants.SalesEmail_Password)
			except:
				LOGGER.exception("partner_extend_live_send_sales_email")

		except:
				LOGGER.exception("partner_extend_live")
				transaction.rollback()
				raise

