# -*- coding: utf-8 -*-
"""User General """
#-----------------------------------------------------------------------------
# Name:        usergeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     23/06/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from prcommon.model import BaseSql
import prcommon.Constants as Constants
from prcommon.model.identity import User, Customer
from ttl.ttlemail import EmailMessage, SMTPServer
import smtplib

import logging
LOGGER = logging.getLogger("prcommon.model")

class UserGeneral(object):
	"""User General """

	List_View = "SELECT u.user_id AS id, u.display_name AS name FROM tg_user as u"
	List_View_Count = "SELECT COUNT(*) FROM tg_user AS u"

	@staticmethod
	def user_list(params):
		"""Return a list of valid user """

		whereclause = BaseSql.addclause("", "u.customerid =:icustomerid")
	# filter
		if "iuserid" in params:
			whereclause = BaseSql.addclause(whereclause, "u.user_id = :iuserid")
			params["iuserid"] = int(params["iuserid"])
		if "id" in params:
			whereclause = BaseSql.addclause(whereclause, "u.user_id = :id")
			params["id"] = int(params["id"])

		data = BaseSql.getGridPage(
		  params,
		  'name',
		  'id',
		  UserGeneral.List_View  + whereclause + BaseSql.Standard_View_Order,
		  UserGeneral.List_View_Count + whereclause,
		  User)

		data['label'] = 'name'

		return data

	@staticmethod
	def get_user_details(iuserid):
		"Get User "

		user = User.query.get(iuserid)

		return dict(userid=user.id,
		            email=user.user_name,
		            displayname=user.display_name)

	@staticmethod
	def send_login_details(params):
		"""Update password and send an email
		email base on customer type and login or welcome details

		"""
		transaction = BaseSql.sa_get_active_transaction()
		try:
			user = User.query.get(params["iuserid"])
			user.password = params["password"]
			transaction.commit()
		except:
			LOGGER.exception("send_login_details")
			transaction.rollback()
			raise

		# now send emais
		customer = Customer.query.get(user.customerid)
		if customer.customertypeid == Constants.CustomerType_SolididMedia:
			email = EmailMessage("password@solidmediagroup.com",
			                     params["email"],
			                     Constants.Solid_User_Details_Subject,
			                     Constants.Solid_User_Details_Body % (user.user_name, params["password"]),
			                     "text/html",
			                     "password@solidmediagroup.com",
			                     None,
			                     False,
			                     None,
			                     None,
			                     "solidmediagroup.com"
			                     )
			email.BuildMessage()
			smtp = smtplib.SMTP_SSL(host="in.mailjet.com", port=465)
			smtp.ehlo()
			smtp.login("f2a8b0069a579aa7e8d3130bc372de84", "335ba75186aae076943c3334c73741c3")
			smtp.sendmail("password@solidmediagroup.com",
			              email.toAddress,
			              email.serialise())
			smtp.quit()
		else:
			email = EmailMessage(Constants.SupportEmail,
			                     params["email"],
			                     Constants.PRMax_User_Details_Subject,
			                     Constants.PRMax_User_Details_Body % (user.user_name, params["password"]),
			                     "text/html")
			email.BuildMessage()
			#email.bcc = Constants.CopyEmail
			emailserver = SMTPServer("smtp.gmail.com", 465, True, True, Constants.SupportEmail_Email, Constants.SupportEmail_Password)
			(error, statusid) = emailserver.send(email, Constants.SupportEmail_Email)
			if not statusid:
				raise Exception(error)
