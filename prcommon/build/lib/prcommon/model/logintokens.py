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
from datetime import timedelta
import logging
from turbogears.database import  metadata, mapper, session
from sqlalchemy.sql import text
from turbogears import visit
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from prcommon.model.identity import User, Customer, VisitIdentity, Visit
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
		if not user and params["customertypeid"] == 23:
			params["customertypeid"] = 24
			user = session.query(User).\
			    join(Customer, Customer.customerid == User.customerid).\
			    filter(User.external_key == params["external_key"]).\
			    filter(Customer.customertypeid == params["customertypeid"]).all()
		if user:
			return user[0].user_id

		return None

	@staticmethod
	def check_session_access(params):
		"""checks that the userid has permission to login """
		#  genral check
		try:
			if "customertypeid" in params and params["customertypeid"] not in Constants.Customer_Token_Login:
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

	@staticmethod
	def check_able_to_login_in(params):
		"""Check to see if the licence concurrent user has been exceeded"""

		retvalue = None

		user = User.query.get(params["userid"])
		cust = Customer.query.get(user.customerid)

		# check already logged in?
		# if so take over issue new login token later - here we just need to remove existing ones

		# check number of concurrent connections
		# if too many either return error or logout a connections

		return retvalue

	@staticmethod
	def active_users(params):
		"""List of active users base on either userid or customerid"""

		# collect list of active uses
		retvalue = []

		if "userid" in params and params['userid'] != None:
			customerid = session.query(User.customerid).filter(User.user_id== params['userid']).scalar()
			params['customerid'] = customerid

		if "customerid" in params:
			retvalue = [row.user_id for row in session.query(User.user_id).filter(User.customerid==params['customerid']).all()]

		return retvalue

	@staticmethod
	def get_active_session(userid, token_life=5):
		"""get a valid visitor key for TG """

		user = User.query.get(userid)

		# create visit session
		# attach session to user
		visittool = visit.VisitTool()
		visit_key = visittool._generate_key()

		# this in theory should be new every time but it's better to check
		link = session.query(VisitIdentity).filter_by(visit_key=visit_key)
		# link to current user
		if link.count() == 0:
			link = VisitIdentity(visit_key=visit_key, user_id=user.user_id)
			session.add(link)
		else:
			link.one()
			link.user_id = user.user_id

		vobject = Visit(
		    visit_key=visit_key,
		    expiry=datetime.datetime.now() + timedelta(seconds=token_life),
		    created=datetime.datetime.now())
		session.add(vobject)
		session.flush()

		return visit_key

	@staticmethod
	def close_session(params):
		"""Close a session either with tokenid or userid"""


		if "usersessionid" in params:
			userid = session.query(VisitIdentity.user_id).filter(VisitIdentity.visit_key == params['usersessionid']).scalar()
			params['userid'] = userid

		if "userid" in params:
			visits = session.query(VisitIdentity.visit_key).filter(VisitIdentity.user_id==params['userid']).all()
			for visit in visits:
				session.execute(text('DELETE from visit_identity WHERE visit_key = :visit_key'), {'visit_key': visit.visit_key}, VisitIdentity)
				session.execute(text('DELETE from visit WHERE visit_key = :visit_key'), {'visit_key': visit.visit_key}, VisitIdentity)
				session.flush()
		session.commit()



LoginTokens.mapping = Table('logins_tokens', metadata, autoload=True)
mapper(LoginTokens, LoginTokens.mapping)
