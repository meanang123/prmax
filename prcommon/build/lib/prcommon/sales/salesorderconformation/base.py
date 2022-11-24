# -*- coding: utf-8 -*-
"""Confirmation Classes"""
#-----------------------------------------------------------------------------
# Name:        base.py
# Purpose:		 create  html email for the order confirmation to be sent to a client
#
# Author:      Chris Hoy
#
# Created:     26/05/2011
# RCS-ID:      $Id:  $
# Copyright:  (c) 2011

#-----------------------------------------------------------------------------
from turbogears.database import session
from prcommon.model.identity import Customer, CustomerTypes, CustomerPrmaxDataSets
from prcommon.model.customer.datasets import PrmaxDataSets
from prcommon.model.emails import EmailQueue
from prcommon.model.internal import AuditTrail
from prcommon.model.communications import Address
from prcommon.model.clippings.clippingsorder import ClippingsOrder, ClippingPriceServiceLevel, ClippingsPrices

import prcommon.Constants as Constants
import sys, os

from ttl.ttlmako import MakoBase
from ttl.ttlemail import EmailMessage, send_paperround_message
from ttl.postgres import DBCompress

class ConfirmationBase(object):
	"""Base for confirmations"""
	def __init__(self):
		"""setup basic info"""
		self._data["style"]["sheader"] = "background-color:#e9e9e9;font-family:Verdana;margin:0px;padding:0px;font-weight:bold;font-size:15pt"
		self._data["style"]["p"] = "font-family:Verdana;margin:0px;padding:0px;font-size:11pt"
		self._data["style"]["ssheader"] = "font-family:Verdana;margin:0px;padding:0px;font-weight:bold;font-size:11pt"
		self._data["style"]["plabel"] = "font-family:Verdana;margin:0px;padding:0px;font-weight:bold;font-size:11pt"
		self._data["style"]["pheader"] = "font-family:Verdana;margin:0px;padding:0px;font-weight:bold;font-size:15pt"
		self._data["style"]["psmall"] = "font-family:Verdana;margin:0px;padding:0px;font-size:9pt"
		self._data["lu"] = dict(has_user=False, email="", password="")
		self._data["datasetdescription"] = ""
		self._email_subject = "PRMax Order Confirmation"
		self._audittext = "Order Confirmation Sent"
		self._load_extra_func = None
		self._load_extra_data = None

	def _set_load_extra(self, func):
		""" extra data """
		self._load_extra_func = func

	def _set_load_extra_data(self, data):
		""" extra data """
		self._load_extra_data = data

	def _set_audit_text(self, value):
		"""set text"""
		self._audittext = value

	def _set_subject(self, value):
		""" Set subject email"""
		self._email_subject = value

	audittext = property(None, _set_audit_text)
	subject = property(None, _set_subject)
	load_extra_func = property(None, _set_load_extra)
	load_extra_data = property(None, _set_load_extra_data)

	def send_email(self, emailaddress):
		""" send and log the email """

		tmp = self.output_compressed
		if sys.version_info[0] == 2 and sys.version_info[1] == 5:
			from ttl.string import Translate25UTF8ToHtml
			tmp = Translate25UTF8ToHtml(tmp)
			use_utf8 = True
		else:
			use_utf8 = True

		# convert images to embedded to send as nice file
		emdedded = []
		for row in(("/static/images/prmax/footer.png", "footer.png", "cid1", "image/jpeg"),
		           ("/static/images/prmax/header.png", "header.png", "cid2", "image/jpeg")):
			tmp = tmp.replace(row[0], "cid:" + row[2])
			try:
				tfile = file(os.path.join(self._templatepath, row[1]), "rb")
				emdedded.append((row[2], tfile.read(), row[3]))
			finally:
				tfile.close()

		# now do the email
		email = EmailMessage(Constants.SalesEmail,
	             emailaddress,
	             self._email_subject,
	             tmp,
	             "text/html",
	             "",
	             None,
	             use_utf8)
		email.bcc = Constants.CopyEmail
		for row in emdedded:
			email.addEmbeddedImages(*row)

		email.BuildMessage()
		emailentry = EmailQueue(
	    emailaddress=emailaddress,
	    subject=email.Subject,
	    message=DBCompress.encode2(email),
	    emailqueuetypeid=Constants.EmailQueueType_Internal)
		session.add(emailentry)
		session.flush()

		# now add too the audit trail
		audit = AuditTrail(audittypeid=Constants.audit_order_confirmation,
		                   audittext=self._audittext,
		                   userid=self._userid,
		                   customerid=self._data['c'].customerid,
		                   document=tmp)
		session.add(audit)


class SendOrderConfirmationBuilder(MakoBase, ConfirmationBase):
	""" class to build an html questionnaire"""
	def __init__(self):
		MakoBase.__init__(self, os.path.dirname(__file__))
		ConfirmationBase.__init__(self)

	def setUser(self, email=None, password=None):
		""" set the detaild for the order confirmation """

		if password:
			self._data["lu"]["has_user"] = True
			self._data["lu"]["email"] = email
			self._data["lu"]["password"] = password

	def start(self, customerid):
		""" setup the basic details """

		self._data["c"] = Customer.query.get(customerid)
		self._data["a"] = Address.query.get(self._data["c"].addressid)
		self._data["ct"] = CustomerTypes.query.get(self._data["c"].customertypeid)
		self._data["cds"] = session.query(PrmaxDataSets).\
			join(CustomerPrmaxDataSets, CustomerPrmaxDataSets.prmaxdatasetid == PrmaxDataSets.prmaxdatasetid).\
		    filter(CustomerPrmaxDataSets.customerid == customerid).all()
		if len(self._data["cds"]) == 1 and self._data['cds'][0] == 1:
			self._data["datasetdescription"] = self._data['cds'][0].prmaxdatasetdescription
		elif len(self._data["cds"]) == 12:
			self._data["datasetdescription"] = 'Global media data'
		else:
			datasetlist = []
			for x in range(0, len(self._data["cds"])):
				datasetlist.append(self._data["cds"][x].prmaxdatasetid)
			if len(datasetlist) == 7 and 1 in datasetlist and 2 in datasetlist and 3 in datasetlist and 4 in datasetlist and 5 in datasetlist and 6 in datasetlist and 7 in datasetlist:
				self._data["datasetdescription"] = 'European'
			else:
				for x in range(0,len(self._data["cds"])):
					if x == 0:
						self._data["datasetdescription"] = self._data['cds'][x].prmaxdatasetdescription
					else:
						self._data["datasetdescription"] = '%s/%s' %(self._data["datasetdescription"], self._data['cds'][x].prmaxdatasetdescription)

		# attach extra data via function
		if self._load_extra_func:
			self._load_extra_func(self._data, self._load_extra_data)


	def run(self, customerid, emailaddress, userid, preview=False):
		""" run the confrmation and sent it too thhe customer """

		# build the data
		self.start(customerid)
		# do the actual template build
		super(SendOrderConfirmationBuilder, self).run()

		tmp = self.output_compressed
		if not preview:
			if sys.version_info[0] == 2 and sys.version_info[1] == 5:
				from ttl.string import Translate25UTF8ToHtml
				tmp = Translate25UTF8ToHtml(tmp)
				use_utf8 = True
			else:
				use_utf8 = True

			# convert images to embedded to send as nice file
			emdedded = []
			for row in(("/static/images/prmax/footer.png", "footer.png", "cid1", "image/jpeg"),
			            ("/static/images/prmax/header.png", "header.png", "cid2", "image/jpeg")):
				tmp = tmp.replace(row[0], "cid:" + row[2])
				try:
					tfile = file(os.path.join(self._templatepath, row[1]), "rb")
					emdedded.append((row[2], tfile.read(), row[3]))
				finally:
					tfile.close()

			# now do the email
			email = EmailMessage(Constants.SalesEmail,
			                     emailaddress,
			                     self._email_subject,
			                     tmp,
			                     "text/html",
			                     "",
			                     None,
			                     use_utf8)
			email.bcc = Constants.CopyEmail
			for row in emdedded:
				email.addEmbeddedImages(*row)

			email.BuildMessage()
			emailq = EmailQueue(
			  emailaddress=emailaddress,
				subject=email.Subject,
			  message=DBCompress.encode2(email),
			  emailqueuetypeid=Constants.EmailQueueType_Internal)
			session.add(emailq)
			session.flush()

			# now add too the audit trail
			audit = AuditTrail(audittypeid=Constants.audit_order_confirmation,
			                   audittext=self._audittext,
			                   userid=userid,
			                   customerid=customerid,
			                   document=tmp)
			session.add(audit)
		else:
			return tmp

	def custconfirm(self, customerid):
		""" get screen display version """
		self.templatename = "screen_standard.html"
		self._data["c"] = Customer.query.get(customerid)
		self._data["ct"] = CustomerTypes.query.get(self._data["c"].customertypeid)
		self._data["cds"] = session.query(PrmaxDataSets).\
			join(CustomerPrmaxDataSets, CustomerPrmaxDataSets.prmaxdatasetid == PrmaxDataSets.prmaxdatasetid).\
		    filter(CustomerPrmaxDataSets.customerid == customerid).all()
		if len(self._data["cds"]) == 1 and self._data['cds'][0] == 1:
			self._data["datasetdescription"] = self._data['cds'][0].prmaxdatasetdescription
		elif len(self._data["cds"]) == 12:
			self._data["datasetdescription"] = 'Global media data'
		else:
			datasetlist = []
			for x in range(0, len(self._data["cds"])):
				datasetlist.append(self._data["cds"][x].prmaxdatasetid)
			if len(datasetlist) == 7 and 1 in datasetlist and 2 in datasetlist and 3 in datasetlist and 4 in datasetlist and 5 in datasetlist and 6 in datasetlist and 7 in datasetlist:
				self._data["datasetdescription"] = 'European'
			else:
				for x in range(0,len(self._data["cds"])):
					if x == 0:
						self._data["datasetdescription"] = self._data['cds'][x].prmaxdatasetdescription
					else:
						self._data["datasetdescription"] = '%s/%s' %(self._data["datasetdescription"], self._data['cds'][x].prmaxdatasetdescription)

		super(SendOrderConfirmationBuilder, self).run()

		return self.output_compressed

class UpgradeConfirmationBuilder(MakoBase, ConfirmationBase):
	""" upgrade conformation"""
	def __init__(self):
		MakoBase.__init__(self, os.path.dirname(__file__))
		ConfirmationBase.__init__(self)
		self._email_subject = "PRMax Upgrade Confirmation"
		self._audittext = "Upgrade Confirmation Sent"

	def run(self, customer, userid):
		""" run the confrmation and sent it too thhe customer """

		self.templatename = "upgrade.html"
		self._data["c"] = customer
		self._data["a"] = Address.query.get(customer.addressid)
		self._data["ct"] = CustomerTypes.query.get(self._data["c"].customertypeid)
		self._data["cds"] = session.query(PrmaxDataSets).\
			join(CustomerPrmaxDataSets, CustomerPrmaxDataSets.prmaxdatasetid == PrmaxDataSets.prmaxdatasetid).\
		    filter(CustomerPrmaxDataSets.customerid == self._data["c"].customerid).all()
		if len(self._data["cds"]) == 1 and self._data['cds'][0] == 1:
			self._data["datasetdescription"] = self._data['cds'][0].prmaxdatasetdescription
		elif len(self._data["cds"]) == 12:
			self._data["datasetdescription"] = 'Global media data'
		else:
			datasetlist = []
			for x in range(0, len(self._data["cds"])):
				datasetlist.append(self._data["cds"][x].prmaxdatasetid)
			if len(datasetlist) == 7 and 1 in datasetlist and 2 in datasetlist and 3 in datasetlist and 4 in datasetlist and 5 in datasetlist and 6 in datasetlist and 7 in datasetlist:
				self._data["datasetdescription"] = 'European'
			else:
				for x in range(0,len(self._data["cds"])):
					if x == 0:
						self._data["datasetdescription"] = self._data['cds'][x].prmaxdatasetdescription
					else:
						self._data["datasetdescription"] = '%s/%s' %(self._data["datasetdescription"], self._data['cds'][x].prmaxdatasetdescription)

		self._userid = userid

		super(UpgradeConfirmationBuilder, self).run()

		return self.output_compressed



	def custconfirm(self, customerid):
		""" get screen display version """
		self.templatename = "screen_upgrade_standard.html"
		self._data["c"] = Customer.query.get(customerid)

		super(UpgradeConfirmationBuilder, self).run()

		return self.output_compressed


class SendClippingOrderConfirmationBuilder(MakoBase, ConfirmationBase):
	""" class to build and send a clipping order confirmation"""
	def __init__(self):
		MakoBase.__init__(self, os.path.dirname(__file__))
		ConfirmationBase.__init__(self)
		self._email_subject = "PRMax Clippings Order Confirmation"
		self._audittext = "Clippings Order Confirmation Sent"
		self._templatename = "clippings_template.html"

	def start(self, clippingsorderid):
		""" setup the basic details """

		self._data["co"] = ClippingsOrder.query.get(clippingsorderid)
		self._data["c"] = Customer.query.get(self._data["co"].customerid)
		self._data["a"] = Address.query.get(self._data["c"].addressid)
		self._data["ct"] = CustomerTypes.query.get(self._data["c"].customertypeid)
		self._data["cp"] = ClippingsPrices.query.get(self._data["co"].clippingspriceid)
		self._data["cpsl"] = ClippingPriceServiceLevel.query.get(self._data["cp"].clippingpriceservicelevelid)
		self._data["cds"] = session.query(PrmaxDataSets).\
			join(CustomerPrmaxDataSets, CustomerPrmaxDataSets.prmaxdatasetid == PrmaxDataSets.prmaxdatasetid).\
		    filter(CustomerPrmaxDataSets.customerid == self._data["co"].customerid).all()
		if len(self._data["cds"]) == 1 and self._data['cds'][0] == 1:
			self._data["datasetdescription"] = self._data['cds'][0].prmaxdatasetdescription
		elif len(self._data["cds"]) == 12:
			self._data["datasetdescription"] = 'Global media data'
		else:
			datasetlist = []
			for x in range(0, len(self._data["cds"])):
				datasetlist.append(self._data["cds"][x].prmaxdatasetid)
			if len(datasetlist) == 7 and 1 in datasetlist and 2 in datasetlist and 3 in datasetlist and 4 in datasetlist and 5 in datasetlist and 6 in datasetlist and 7 in datasetlist:
				self._data["datasetdescription"] = 'European'
			else:
				for x in range(0,len(self._data["cds"])):
					if x == 0:
						self._data["datasetdescription"] = self._data['cds'][x].prmaxdatasetdescription
					else:
						self._data["datasetdescription"] = '%s/%s' %(self._data["datasetdescription"], self._data['cds'][x].prmaxdatasetdescription)

	def run(self, clippingsorderid, emailaddress, preview=False):
		""" run the confrmation and sent it too thhe customer """

		# build the data
		self.start(clippingsorderid)
		# do the actual template build
		super(SendClippingOrderConfirmationBuilder, self).run()

		tmp = self.output_compressed
		if not preview:
			if sys.version_info[0] == 2 and sys.version_info[1] == 5:
				from ttl.string import Translate25UTF8ToHtml
				tmp = Translate25UTF8ToHtml(tmp)
				use_utf8 = True
			else:
				use_utf8 = True

			# convert images to embedded to send as nice file
			emdedded = []
			for row in(("/static/images/prmax/footer.png", "footer.png", "cid1", "image/jpeg"),
			            ("/static/images/prmax/header.png", "header.png", "cid2", "image/jpeg")):
				tmp = tmp.replace(row[0], "cid:" + row[2])
				try:
					tfile = file(os.path.join(self._templatepath, row[1]), "rb")
					emdedded.append((row[2], tfile.read(), row[3]))
				finally:
					tfile.close()

			# now do the email
			email = EmailMessage(Constants.SalesEmail,
			                     emailaddress,
			                     self._email_subject,
			                     tmp,
			                     "text/html",
			                     "",
			                     None,
			                     use_utf8)
			email.bcc = Constants.CopyEmail
			for row in emdedded:
				email.addEmbeddedImages(*row)

			email.BuildMessage()

			send_paperround_message(email, Constants.SupportEmail_Email, Constants.SupportEmail_Password)

			# now add too the audit trail
			audit = AuditTrail(audittypeid=Constants.audit_clipping_order_confirmation,
			                   audittext="Clippings Order Confirmation",
			                   customerid=self._data["c"].customerid,
			                   document=tmp)
			session.add(audit)
		else:
			return tmp
