# -*- coding: utf-8 -*-
"""Login token System"""
#-----------------------------------------------------------------------------
# Name:        logintokens.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     10/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
import datetime
import logging
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from prcommon.model.identity import User, Customer
from prcommon.model.admin import CustomerExternal
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

#########################################################
## Map object to db
#########################################################
class LoginTokens(BaseSql):
	""" Seemless login system"""

	@classmethod
	def check_access(cls, params):
		""" check to see if we can give the system a token"""
		try:
			#  genral check
			if params["customertypeid"] not in Constants.Customer_Token_Login:
				return(2, "Invalid Account Information")

			# user check
			user = User.query.get(params["userid"])
			if not user:
				return (1, "Missing User")

			# customer check
			cust = Customer.query.get(user.customerid)
			if cust.customertypeid not in Constants.Customer_Token_Login:
				return(2, "Invalid Account Information")

			# licence expired to disabled
			if cust.has_expired():
				return(3, "Licence Expired")

			if cust.customerstatusid != Constants.Customer_Active:
				return(4, "Account Inactive")

		except:
			LOGGER.exception("check_access")
			return (5, "Problem")

		return None

	@classmethod
	def add_login(cls, userid, token_life=5):
		""" Add a new token to the login system and return """
		try:
			token = LoginTokens(userid=userid,
			                    expire_date=datetime.datetime.now() + datetime.timedelta(minutes=token_life))
			session.add(token)
			session.flush()
			return token.tokenid
		except:
			LOGGER.exception("add_login")
			raise

	@classmethod
	def dologin(cls, params):
		""" do a login based upon a token """

		logintoken = session.query(LoginTokens).filter_by(tokenid=params["tokenid"]).first()

		if not logintoken:
			raise Exception("No Login Token")

		tmp = logintoken.expire_date
		ctime = datetime.datetime.now()
		if tmp.replace(tzinfo=None) <= ctime:
			raise Exception("Request Expired")

		CustomerExternal.do_login(User.query.get(logintoken.userid))

		# token to be deleted when we fo live
		session.delete(logintoken)
		session.flush()

		return logintoken.userid

	@classmethod
	def get_from_external(cls, params):
		"""if we are using other peoples id"""

		user = session.query(User).\
		    join(Customer, Customer.customerid == User.customerid).\
		    filter(User.external_key == params["external_key"]).\
		    filter(Customer.customertypeid == params["customertypeid"]).all()
		if user:
			return user[0].user_id

		return None

LoginTokens.mapping = Table('logins_tokens', metadata, autoload=True)
mapper(LoginTokens, LoginTokens.mapping)
