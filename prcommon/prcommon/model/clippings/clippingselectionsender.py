# -*- coding: utf-8 -*-
"""Sending email with selected clippings """
#-----------------------------------------------------------------------------
# Name:        clippingselectionsender.py
# Purpose:
# Author:
# Created:     August 2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------
import logging
import cPickle as pickle
from turbogears.database import session
import prcommon.Constants as Constants
from prcommon.model.queues import ProcessQueue
from prcommon.lib.distribution import MailMerge
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.clippingselection import ClippingSelection
from prcommon.model.customer.customeremailserver import CustomerEmailServer
from prcommon.model.emails import EmailHeader, EmailFooter, EmailMessage
from prcommon.model.client import Client
from ttl.ttlemail import EmailMessage, SMTPSERVERBYTYPE
from ttl.sqlalchemy.ttlcoding import CryptyInfo

cryptengine = CryptyInfo(Constants.KEY1)

LOGGER = logging.getLogger("prcommon")

class ClippingSelectionSend(object):
	""" Sending email with selected clippings """

	def __init__(self, process):

		if process:
			self._userid = process.objectid
			self._processid = process.processqueueid


	def start_service(self):
		""" send email with clippings"""

		processqueue = session.query(ProcessQueue).filter(ProcessQueue.processqueueid == self._processid).scalar()
		params = pickle.loads(processqueue.processqueueoutput)
		merge = MailMerge()
		header = footer = headertext = footertext = ""
		bodytext = "<br/>"
		params2 = dict(params)
		clientname = ''


		if int(params['emaillayoutid']) == Constants.Email_Layout_Standard:
			for row in session.query(Clipping.clip_source_date, Clipping.clip_title, Clipping.clip_abstract, Clipping.clip_link).\
				join(ClippingSelection, Clipping.clippingid == ClippingSelection.clippingid).\
				filter(ClippingSelection.userid == self._userid):
				params2['clip_title'] = row.clip_title
				params2['clip_source_date'] = row.clip_source_date.strftime("%d/%m/%Y")
				params2['clip_link'] = row.clip_link.replace(".", ".<span></span>").replace("//", "//<span></span>")
				params2['clip_abstract'] = row.clip_abstract
				bodytext = bodytext + Constants.Email_Clippings_Body % params2

		elif int(params['emaillayoutid']) == Constants.Email_Layout_ByClient:
			for row in session.query(Clipping.clip_source_date, Clipping.clip_title, Clipping.clip_abstract, Clipping.clip_link, Clipping.clientid, Client.clientname).\
				join(ClippingSelection, Clipping.clippingid == ClippingSelection.clippingid).\
			    join(Client, Client.clientid == Clipping.clientid).\
				filter(ClippingSelection.userid == self._userid).order_by(Clipping.clientid):
				params2['clip_title'] = row.clip_title
				params2['clip_source_date'] = row.clip_source_date.strftime("%d/%m/%Y")
				params2['clip_link'] = row.clip_link.replace(".", ".<span></span>").replace("//", "//<span></span>")
				params2['clip_abstract'] = row.clip_abstract

				if (row.clientname != clientname):
					clientname = row.clientname
					client = '<p style="font-size:18px;font-weight:bold;color:brown;">'+ str(row.clientname) + '</p>'
					bodytext = bodytext + client + Constants.Email_Clippings_Body % params2
				else:
					bodytext = bodytext + Constants.Email_Clippings_Body % params2
					



		if 'emailheaderid' in params and params["emailheaderid"] != '':
			header = EmailHeader.query.get(params['emailheaderid'])
			headertext = "<p style='font-size:14px'>" + header.htmltext + "</p>" if header.htmltext else "<p></p>"
		if 'emailfooterid' in params and params["emailfooterid"] != '':
			footer = EmailFooter.query.get(params['emailfooterid'])
			footertext = "<p style='font-size:14px'>" + footer.htmltext + "</p>" if footer.htmltext else "<p></p>"

		bodytext = merge.do_merge_test(headertext + bodytext + footertext)
		if params['fromemailaddress']:
			customeremailserver = CustomerEmailServer.query.get(params['fromemailaddress'])
			fromemailaddress = customeremailserver.fromemailaddress
			servertype = customeremailserver.servertypeid

			email = EmailMessage(fromemailaddress,
				                 params['toemailaddress'],
				                 params['emailsubject'],
				                 bodytext,
				                 "text/html"
				                 )
			email.BuildMessageHtmlOnly()
	
			if int(servertype) in SMTPSERVERBYTYPE:
				emailserver = SMTPSERVERBYTYPE[int(customeremailserver.servertypeid)](
					username=cryptengine.aes_decrypt(customeremailserver.username),
					password=cryptengine.aes_decrypt(customeremailserver.password))
				sender = fromemailaddress
				emailserver.send(email, sender)

	def run(self):

		self.start_service()