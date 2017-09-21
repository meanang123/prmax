# -*- coding: utf-8 -*-from
""" Identity module """
#-----------------------------------------------------------------------------
# Name:        Identity.py
# Purpose:			Handles access to the user and customers
#
# Author:      Chris Hoy
#
# Created:     14/09/2010
# RCS-ID:      $Id:  $
# Copyright:  (c) 2010

#-----------------------------------------------------------------------------
from turbogears import identity, config, visit
import copy
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, text, Integer, func
from sqlalchemy.orm import relation
from prcommon.model.common import BaseSql
from prcommon.model.lookups import CustomerTypes, Countries, CustomerSources
from prcommon.model.internal import AuditTrail, NbrOfLogins
from prcommon.model.communications import Address
from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.customer.customermediaaccesstypes import CustomerMediaAccessTypes

from simplejson import JSONEncoder
from ttl.postgres import DBCompress
from ttl.ttldate import DatetoStdString
from ttl.PasswordGenerator import Pgenerate
from datetime import date, datetime, timedelta
import prcommon.Constants as Constants
from ttl.ttlcoding import TTLCoding
from types import ListType

import logging
LOGGER = logging.getLogger("prcommon.model")

class UserView(object):
	""" Access to the external user_external_view view in the database
	this can only be read  write is not avaliable """

	@classmethod
	def get(cls):
		""" get the user view record """
		if not identity.current.anonymous:
			return UserView.query.get(identity.current.user.user_id)
		else:
			return None

	@classmethod
	def get_as_dict(cls):
		""" get the user view as a dictionary  """
		res = {}
		for(key, data) in UserView.query.get(identity.current.user.user_id).__dict__.items():
			if key[0] == "_":
				continue
			res[key] = data
		return res

class User(BaseSql):
	"""
    Reasonably basic User definition.
    Probably would want additional attributes.
    """
	Customer_Data_Grid = """SELECT u.user_id, u.user_name, u.display_name, u.email_address FROM tg_user  AS u WHERE u.customerid =:icustomerid ORDER BY %s %s  LIMIT :limit OFFSET :offset"""
	Customer_Data_Count = """SELECT COUNT(*) FROM tg_user AS u WHERE u.customerid =:icustomerid """
	Customer_Data_Single_Grid = """SELECT u.user_id, u.user_name, u.display_name, u.email_address FROM tg_user  AS u WHERE u.user_id =:id ORDER BY %s %s  LIMIT :limit OFFSET :offset"""
	Customer_Data_Single_Count = """SELECT COUNT(*) FROM tg_user AS u WHERE u.user_id =:id """

	User_Clear_logins = """UPDATE visit SET expiry = '2001-01-01 00:00:00'
					  WHERE visit_key IN
					(SELECT vi.visit_key FROM visit_identity AS vi WHERE vi.user_id =:user_id AND vi.visit_key !=:visit_key)"""




	def __repr__(self):
		return '<User: name="%s", email="%s", display name="%s">' %(
			self.user_name, self.email_address, self.display_name)

	def __unicode__(self):
		return self.display_name or self.user_name

	@property
	def permissions(self):
		"""Return all permissions of all groups the user belongs to."""
		perm = set()
		for group in self.groups:
			perm |= set(group.permissions)
		return perm

	@classmethod
	def by_email_address(cls, email_address):
		"""Look up User by given email address.

		This class method that can be used to search users based on their email
		addresses since it is unique.

		"""
		return session.query(cls).filter_by(email_address=email_address).first()

	@classmethod
	def by_user_name(cls, user_name):
		"""Look up User by given user name.

		This class method that permits to search users based on their
		user_name attribute.

		"""
		return session.query(cls).filter_by(user_name=user_name).first()
	by_name = by_user_name

	def _set_password(self, password):
		"""Run cleartext password through the hash algorithm before saving."""
		self._password = identity.encrypt_password(password)

	def _get_password(self):
		"""Returns password."""
		return self._password

	password = property(_get_password, _set_password)

	def _get_customerid(self):
		""" get the customerid"""
		return self.customerid

	customerextid = property(_get_customerid, None)

	@classmethod
	def get_customer(cls, userid):
		""" get the customerid for a userid """

		return User.query.get(userid).customerid

	def get_display_project_name(self):
		""" get project name """
		if self.projectname:
			return self.projectname
		else:
			return Constants.project_name_base

	def get_display_info(self):
		""" Get the banner display line. If this is the support user then display the
		compnay as well """
		if self.usertypeid == Constants.UserType_Support:
			cust = Customer.query.get(self.customerid)
			return "%s <span class=&#39;support_companyname&#39;>(%s)</span>" %(self.display_name, cust.customername)
		else:
			return self.display_name

	@classmethod
	def logout_other_users(cls, vist_key, userid):
		""" remove other users form system when loggin in """
		cls.sqlExecuteCommand(text(User.User_Clear_logins),
							  dict(user_id=userid, visit_key=vist_key), None, True)

	@classmethod
	def exists(cls, name, userid=None):
		""" user name exists?"""
		data = session.query(User).filter_by(user_name=name).all()
		length = len(data)
		if length > 0 and userid and data[0].user_id == userid:
			length -= 1

		return True if length else False

	_Ignore_Domains = ("gmail.com", "live.co.uk")
	@classmethod
	def domain_exists(cls, emailaddress):
		""" user name exists?"""

		fields = emailaddress.split("@")
		if len(fields) > 0:
			if fields[0].lower() in User._Ignore_Domains:
				return False

			if session.query(User).filter(User.mapping.c.user_name.like("%" + fields[1])).count():
				return True

		return False

	@classmethod
	def exists_email(cls, email, userid=None):
		""" email address exists """
		data = session.query(User).filter_by(email_address=email).all()
		length = len(data)
		if length > 0 and userid and data[0].user_id == userid:
			length -= 1

		return True if length else False

	def get_json_settings(self):
		""" return the setting object for the user inthe current browser"""

		customer = session.query(Customer).filter_by(customerid=self.customerid).one()
		# groups
		groups = ""
		gs_rec = session.query(Group).filter(Group.group_id == UserGroups.group_id).\
		  filter(UserGroups.user_id == self.user_id).all()
		if gs_rec:
			groups = ",".join([g.group_name for g in gs_rec])

		# get user default countries list
		countries = [dict(countryid=country.countryid,
		                  countryname=country.countryname.replace("'", r"\u0027"))
		             for DUMMY, country in session.query(UserDefaultCountries, Countries).
		             filter(UserDefaultCountries.countryid == Countries.countryid).
		             filter(UserDefaultCountries.userid == self.user_id).all()]

		# see if the user has monitoring
		monitoring = False
		if customer.is_monitoring_active() and self.hasmonitoring:
			monitoring = True

		client_name = self.client_name if self.client_name else "Client"
		issue_description = self.issue_description if self.issue_description else "Issue"

		data = dict(
		  autoselectfirstrecord=self.autoselectfirstrecord,
			 showmenubartext=self.showmenubartext,
			 show_dialog_on_load=self.show_dialog_on_load,
			 collateralurl=config.get('collateral.link'),
		   questionnaireurl=config.get("questionnaire.web"),
			 productid=customer.productid,
		   useemail=customer.useemail,
		   usepartialmatch=self.usepartialmatch,
		   searchappend=self.searchappend,
		   emailreplyaddress=self.emailreplyaddress,
		   test_extensions=self.test_extensions,
		   stdview_sortorder=self.stdview_sortorder,
		   base_plus=customer.base_plus,
		   crm=customer.crm,
		   advancefeatures=customer.isAdvanceActive(),
		   updatum=monitoring,
		   seo=customer.seo,
		   isdemo=customer.isdemo,
		   isadvancedemo=customer.isadvancedemo,
		   ismonitoringdemo=customer.ismonitoringdemo,
		   groups=groups,
		   countries=countries,
		   client_name=client_name,
		   cid=customer.customerid,
		   has_news_rooms=customer.has_news_rooms,
		   has_journorequests=customer.has_journorequests,
		   has_e_e_s=customer.has_extended_email_subject,
		   is_r_adm=self._is_research_admin(),
		   uid=self.user_id,
		   crm_user_define_1=customer.crm_user_define_1,
		   crm_user_define_2=customer.crm_user_define_2,
		   crm_user_define_3=customer.crm_user_define_3,
		   crm_user_define_4=customer.crm_user_define_4,
		   issue_description=issue_description,
		   clippings=customer.has_clippings,
		   no_distribution=customer.no_distribution,
		   no_export=customer.no_export,
		   customertypeid=customer.customertypeid,
		   distributionistemplated=customer.distributionistemplated,
		   uctid=self.customertypeid,
		   has_ct=customer.has_clickthrought,
		   extended_security=customer.extended_security,
		   required_client=customer.required_client,
		   crm_outcome=customer.crm_outcome,
		   crm_subject=customer.crm_subject
		  )

		return JSONEncoder().encode(data).replace("'", "\'")


	def get_settings(self):
		""" return the setting object for the user inthe current browser"""

		customer = session.query(Customer).filter_by(customerid=self.customerid).one()
		# groups
		groups = ""
		gs_rec = session.query(Group).filter(Group.group_id == UserGroups.group_id).\
		  filter(UserGroups.user_id == self.user_id).all()
		if gs_rec:
			groups = ",".join([g.group_name for g in gs_rec])

		# get user default countries list
		countries = [dict(countryid=country.countryid,
		                  countryname=country.countryname.replace("'", r"\u0027"))
		             for DUMMY, country in session.query(UserDefaultCountries, Countries).
		             filter(UserDefaultCountries.countryid == Countries.countryid).
		             filter(UserDefaultCountries.userid == self.user_id).all()]

		# see if the user has monitoring
		monitoring = False
		if customer.is_monitoring_active() and self.hasmonitoring:
			monitoring = True

		client_name = self.client_name if self.client_name else "Client"
		issue_description = self.issue_description if self.issue_description else "Issue"

		data = dict(
		  autoselectfirstrecord=self.autoselectfirstrecord,
			 showmenubartext=self.showmenubartext,
			 show_dialog_on_load=self.show_dialog_on_load,
			 collateralurl=config.get('collateral.link'),
		   questionnaireurl=config.get("questionnaire.web"),
			 productid=customer.productid,
		   useemail=customer.useemail,
		   usepartialmatch=self.usepartialmatch,
		   searchappend=self.searchappend,
		   emailreplyaddress=self.emailreplyaddress,
		   test_extensions=self.test_extensions,
		   stdview_sortorder=self.stdview_sortorder,
		   base_plus=customer.base_plus,
		   crm=customer.crm,
		   advancefeatures=customer.isAdvanceActive(),
		   updatum=monitoring,
		   seo=customer.seo,
		   isdemo=customer.isdemo,
		   isadvancedemo=customer.isadvancedemo,
		   ismonitoringdemo=customer.ismonitoringdemo,
		   groups=groups,
		   countries=countries,
		   client_name=client_name,
		   cid=customer.customerid,
		   has_news_rooms=customer.has_news_rooms,
		   has_journorequests=customer.has_journorequests,
		   has_e_e_s=customer.has_extended_email_subject,
		   is_r_adm=self._is_research_admin(),
		   uid=self.user_id,
		   crm_user_define_1=customer.crm_user_define_1,
		   crm_user_define_2=customer.crm_user_define_2,
		   crm_user_define_3=customer.crm_user_define_3,
		   crm_user_define_4=customer.crm_user_define_4,
		   issue_description=issue_description,
		   clippings=customer.has_clippings,
		   no_distribution=customer.no_distribution,
		   no_export=customer.no_export,
		   customertypeid=customer.customertypeid,
		   distributionistemplated=customer.distributionistemplated,
		   uctid=self.customertypeid,
		   has_ct=customer.has_clickthrought,
		   extended_security = customer.extended_security,
		   required_client = customer.required_client
		  )

		return data


	def _is_research_admin(self):
		"""determine is user is a research admin """

		return True if self.user_id in(1, 600) else False


	@classmethod
	def get_as_rest(cls, params):
		"""get as rest store """
		return cls.grid_to_rest_ext(cls.getDataGridPage(params),
		      params["offset"],
		      True if "iuserid" in params else False)

	@classmethod
	def getDataGridPage(cls, kw):
		""" get page"""

		kw['sortfield'] = kw.get('sortfield', 'user_name')
		if not kw['sortfield']:
			kw['sortfield'] = 'user_name'


		if "icustomerid" in kw:
			if "id" in  kw:
				command = (User.Customer_Data_Single_Grid, User.Customer_Data_Single_Count)
			else:
				command = (User.Customer_Data_Grid, User.Customer_Data_Count)

			items = cls.sqlExecuteCommand(
				text(command[0] %(kw['sortfield'], kw['direction'])),
				kw,
				BaseSql.ResultAsEncodedDict)

			numRows = cls.sqlExecuteCommand(
				text(command[1]),
				kw,
				BaseSql._singleResult)[0]
		else:
			items = []
			numRows = 0

		return dict(
			identifier="user_id",
			numRows=numRows,
			items=items)

	@classmethod
	def addUser(cls, kw):
		""" add a user to the system
		1. verify that customer has slot avaliable
		2.
		"""
		transaction = cls.sa_get_active_transaction()
		userid = None
		try:
			user = User(user_name=kw['email'],
			            email_address=kw['email'],
			            display_name=kw['displayname'],
			            password=kw['password'],
			            customerid=kw.get("icustomerid", kw["customerid"]),
			            force_change_pssw=True if kw['extended_security'] == 'true' else False,
			            last_change_pssw=datetime.now() if kw['extended_security'] == 'true' else None,
			            external_key=kw.get("external_key", None)
			            )

			session.add(user)
			session.flush()
			userid = user.user_id
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("addUser")
			raise
		return userid

	@classmethod
	def update(cls, params):
		""" update the user details
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(params["ruserid"])

			user.user_name = params['email']
			user.email_address = params['email']
			user.display_name = params['displayname']
			external_key = params.get("external_key", None)
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("update")
			raise

	@staticmethod
	def update_ext(params):
		""" update the user details
		"""
		transaction = BaseSql.sa_get_active_transaction()
		try:
			user = User.query.get(params["iuserid"])

			user.user_name = params['email']
			user.email_address = params['email']
			user.display_name = params['display_name']
			user.isuseradmin = params["isuseradmin"]
			user.nodirectmail = params["nodirectmail"]
			user.canviewfinancial = params["canviewfinancial"]

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("update")
			raise

	@classmethod
	def DeleteUser(cls, userid):
		""" update the user details
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(userid)
			session.delete(user)
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("DeleteUser")
			raise

	@classmethod
	def UnlockUser(cls, userid):
		""" update the user details
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(userid)
			user.invalid_login_tries = 0
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("UnlockUser")
			raise


	@classmethod
	def update_password(cls, params):
		""" update the user password
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(params["iuserid"])

			user.password = params['password']
			user.last_change_pssw = datetime.today()
			user.force_change_pssw = False
			user.invalid_login_tries = 0
			transaction.commit()
		except:
			LOGGER.exception("update_password")
			transaction.rollback()
			raise

	@classmethod
	def update_details(cls, params):
		""" update the user basic details """

		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(params["iuserid"])

			user.email_address = params["email_address"]
			user.user_name = params["user_name"]
			user.display_name = params["display_name"]
			user.canviewfinancial = params["canviewfinancial"]
			user.isuseradmin = params["isuseradmin"]
			user.nodirectmail = params["nodirectmail"]
			user.external_key = params.get("external_key", None)
			transaction.commit()

		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("update_details")
			raise

	@classmethod
	def update_updatum_details(cls, params):
		""" update the monitoring details """
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(params["iuserid"])
			enc = TTLCoding()

			user.hasmonitoring = params["hasmonitoring"]
			if user.hasmonitoring:
				user.updatum_username = params["updatum_username"]
				user.updatum_password = enc.encode(params["updatum_password"])
			else:
				user.updatum_username = ""
				user.updatum_password = enc.encode("")

			transaction.commit()
		except:
			LOGGER.exception("update_updatum_details")
			try:
				transaction.rollback()
			except:
				pass
			raise

	# Support Users
	Support_Users = """SELECT u.user_id AS id, u.user_name AS name FROM tg_user  AS u WHERE u.usertypeid = 2 ORDER BY %s %s  LIMIT :limit OFFSET :offset"""
	Support_Users_Count = """SELECT COUNT(*) FROM tg_user AS u WHERE u.usertypeid = 2"""

	@classmethod
	def getSupportUserPage(cls, kw):
		""" Get a page of user of type support user """

		kw['sortfield'] = kw.get('sortfield', 'user_name')
		if not kw['sortfield']:
			kw['sortfield'] = 'user_name'

		items = cls.sqlExecuteCommand(
			text(User.Support_Users%(kw['sortfield'], kw['direction'])),
			kw,
			BaseSql.ResultAsEncodedDict)

		numRows = cls.sqlExecuteCommand(
			text(User.Support_Users_Count),
			kw,
			BaseSql._singleResult)

		return dict(
		  identifier="id",
		  numRows=numRows,
		  items=items)


	@classmethod
	def exceeds_monitor_count(cls, iuserid):
		""" Determine if the licence has been exceeded """

		user = User.query.get(iuserid)

		# user already has monitoring
		if user.hasmonitoring == True:
			return False

		customer = Customer.query.get(user.customerid)
		nbr = session.query(func.count()).\
		  filter(User.customerid == user.customerid).\
		  filter(User.hasmonitoring == True).one()[0]
		if nbr >= customer.maxmonitoringusers:
			return True

	@classmethod
	def setSupportCustomer(cls, iuserid, icustomerid):
		""" Set the  support user  """
		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(iuserid)

			user.customerid = icustomerid
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception(ex, "User_Details - setSupportCustomer")
			raise ex

	@classmethod
	def research_get_settings(cls, params):
		""" get the setting for a researcher """

		from prcommon.model.researchext.researcherdetails import ResearcherDetails


		user = User.query.get(params["userid"])
		research = ResearcherDetails.get(params["userid"])

		return dict(display_name=user.display_name,
		             job_title=user.job_title,
		             email_address=user.email_address,
		             tel=user.tel,
		             research_display_name=research["research_display_name"],
		             research_job_title=research["research_job_title"],
		             research_email=research["research_email"],
		             research_tel=research["research_tel"]
		            )

	@classmethod
	def research_update_settings(cls, params):
		""" update reserach settings """

		from prcommon.model.researchext.researcherdetails import ResearcherDetails

		transaction = BaseSql.sa_get_active_transaction()

		try:
			user = User.query.get(params["userid"])

			user.display_name = params["display_name"]
			user.job_title = params["job_title"]
			user.email_address = params["email_address"]
			user.tel = params["tel"]

			ResearcherDetails.update(params)

			session.flush()
			transaction.commit()

		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("research_update_settings")
			raise

	List_Types = """SELECT user_id,user_name FROM tg_user """

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.user_id, name=row.user_name)
					for row in data.fetchall()]
		whereused = ""
		if params.has_key("group"):
			whereused = " WHERE user_id IN(SELECT user_id FROM user_group WHERE group_id IN(SELECT group_id from tg_group WHERE group_name IN(%s)))" % \
			         ("'" + "','".join(params["group"].split(",")) + "'",)


		return cls.sqlExecuteCommand(text(User.List_Types + whereused), params, _convert)

	@classmethod
	def setLoggedIn(cls, userid):
		"""The user has successfully logged in set time """

		try:
			u = User.query.get(userid)
			u.last_logged_in = datetime.now()
		except:
			LOGGER.exception("setLoggedIn", extra=dict(userid=userid))

	@classmethod
	def reset_invalid_login_tries(cls, userid):
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(userid)
			user.invalid_login_tries = 0
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("reset_invalid_login_tries")
			raise


	@classmethod
	def setTriedToLogin(cls, sess):
		"""The user has tried to login ?
		Not sure if this will work
		"""

		# no session
		if not sess:
			return

		try:
			# get session info
			vi = VisitIdentity.query.get(sess.value)
			# session present get user detils
			if vi:
				u = User.query.get(vi.user_id)
				if u:
					u.last_attempted_login = datetime.now()
		except:
			LOGGER.exception("setTriedToLogin", extra=dict(sess=sess))

	@classmethod
	def Reset(cls, email, icustomerid, displayname):
		""" reset or create a new user for a customer """

		data = session.query(User).filter_by(email_address=email).all()
		password = Pgenerate().generate_password_simple(6)[0:6]

		if data:
			# reset password
			user = data[0]
			user.password = password
		else:
			# new add customer
			cust = Customer.query.get(icustomerid)
			user = User(user_name=email,
			            email_address=email,
			            display_name=displayname,
			            password=password,
			            customerid=cust.customerid)
			session.add(user)

		return dict(password=password, user=user)

	@classmethod
	def EmailUsedElseWhere(cls, email, icustomerid):
		""" email address used on another customer """

		data = session.query(User).filter_by(email_address=email).all()
		if data:
			if data[0].customerid != icustomerid:
				return True
		return False

	@classmethod
	def getASalesUser(cls):
		""" Pick a sales user """

		group = session.query(Group).filter_by(group_name="sales").one()
		if group:
			user = session.query(UserGroups).filter_by(group_id=group.group_id).all()
			if user:
				return user[0].user_id

		return None

	@classmethod
	def get_user_internal(cls, userid):
		""" get internal user settings """

		user = User.query.get(userid)
		enc = TTLCoding()

		return dict(
		  email_address=user.email_address,
		  display_name=user.display_name,
		  user_name=user.user_name,
		  canviewfinancial=user.canviewfinancial,
		  isuseradmin=user.isuseradmin,
		  nodirectmail=user.nodirectmail,
		  updatum_username=user.updatum_username,
		  updatum_pwd_display=enc.decode(user.updatum_password),
		  user_id=user.user_id,
		  hasmonitoring=user.hasmonitoring,
		  invalid_login_tries=user.invalid_login_tries,
		  external_key=user.external_key
		)


	def force_logout(self):
		"""For a logout"""

		identity.current.logout()

		# delete all the visit keys
		try:
			sessionid = visit.current().key
			session.query(Visit).filter(Visit.visit_key == sessionid).delete()
			session.query(VisitIdentity).filter(VisitIdentity.visit_key == sessionid).delete()
			session.query(VisitIdentity).filter(VisitIdentity.user_id == self.user_id).delete()
		except:
			LOGGER.exception("force_logout")


class Customer(BaseSql):
	""" interface to the customer details
	"""

	def has_expired(self):
		""" check to see if the licence has expired"""
		return self.licence_expire < date.today()

	def has_started(self):
		""" check too see if system can be started """
		if self.licence_start_date == None:
			return True

		return self.licence_start_date <= date.today()

	def abouttoexpire(self):
		""" checks to see if the licence is about to expire"""
		days = (self.licence_expire - date.today()).days
		nbrdays = 3 if self.isdemo else 7
		return  True if(days >= 0 and days <= nbrdays)  else False

	def isAdvanceActive(self):
		""" determine if the advance features is active """
		if self.advancefeatures:
			t = date.today()
			if self.advance_licence_start != None and self.advance_licence_expired != None:
				if self.advance_licence_start <= t and t <= self.advance_licence_expired:
					return True
				else:
					return False
			elif self.advance_licence_start == None and self.advance_licence_expired != None:
				if t <= self.advance_licence_expired:
					return True
				else:
					return False
			elif self.advance_licence_start != None and self.advance_licence_expired == None:
				if self.advance_licence_start <= t:
					return True
				else:
					return False

			return True

		return False


	def fail_ip_test(self, ip):
		"""check to see if ip is in db """

		if self.valid_ips:
			if ip not in self.valid_ips:
				print "sucess"
				return True

		return False


	@classmethod
	def update(cls, kw):
		""" update the fields that a user have access to for their customer
		record.
		"""
		transaction = session.begin(subtransactions=True)
		try:
			customer = Customer.query.get(kw['customerid'])
			address = Address.query.get(customer.addressid)
			customer.customername = kw['customername']
			customer.contactname = kw.get('contactname', '')
			customer.contact_title = kw.get('contact_title', '')
			customer.contact_firstname = kw.get('contact_firstname', '')
			customer.contact_surname = kw.get('contact_surname', '')

			address.address1 = kw['address1']
			address.address2 = kw['address2']
			address.townname = kw['townname']
			address.county = kw['county']
			address.postcode = kw['postcode']
			customer.email = kw['email']
			customer.tel = kw['tel']
			session.flush()
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("update")
			raise

		return dict(success="OK")

	@classmethod
	def DeleteCustomer(cls, customerid):
		""" Delete a customer record """

		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(customerid)
			# check at this point if the customer has invoices/payments doen't delete make as financial
			temp = [acc for acc in session.query(AuditTrail).filter_by(customerid=customerid).all() if acc.audittypeid in(4, 8, 14, 15, 16)]

			# only delete if has no financial info
			if temp:
				customer.customerstatusid = Constants.Customer_Awaiting_Deletion
				return "FD"
			else:
				session.delete(customer)
			session.flush()
			transaction.commit()
			return "OK"
		except:
			LOGGER.exception("DeleteCustomer")
			transaction.rollback()
			raise

	@classmethod
	def update_customertypeid(cls, kw):
		""" Update a customer type """

		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(kw["icustomerid"])
			from_type = CustomerTypes.query.get(customer.customertypeid)
			to_type = CustomerTypes.query.get(kw["customertypeid"])
			if  customer.customertypeid != kw["customertypeid"]:
				customer.customertypeid = kw["customertypeid"]
				session.add(AuditTrail(
				  audittypeid=Constants.audit_customer_typeid,
				  audittext="From %s To %s" % (from_type.customertypename, to_type.customertypename),
				  userid=kw["userid"],
				  customerid=kw["icustomerid"]))

			customer.set_type_defaults()

			transaction.commit()
		except:
			LOGGER.exception("update_customertypeid")
			transaction.rollback()
			raise

	@classmethod
	def update_internal_status(cls, kw):
		""" Change the isinternal flag """

		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(kw["icustomerid"])
			if customer.isinternal != kw["isinternal"]:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_status_changed,
				  audittext="isInternal Changed From %s To %s" % (str(customer.isinternal), str(kw["isinternal"])),
				  userid=kw["userid"],
				  customerid=kw["icustomerid"]))

			customer.isinternal = kw["isinternal"]
			transaction.commit()
		except:
			LOGGER.exception("update_internal_status")
			transaction.rollback()
			raise

	@classmethod
	def update_internal(cls, kw):
		""" 	update all the fields on a customer record
		"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(kw['icustomerid'])
			address = Address.query.get(customer.addressid)

			customer.customername = kw['customername']
			customer.contact_title = kw['contact_title']
			customer.contact_firstname = kw['contact_firstname']
			customer.contact_surname = kw['contact_surname']
			customer.individual = True if kw.has_key('individual') else False
			if "customersourceid" in kw:
				customer.customersourceid = kw["customersourceid"]
			address.address1 = kw['address1']
			address.address2 = kw['address2']
			address.townname = kw['townname']
			address.county = kw['county']
			address.postcode = kw['postcode']
			customer.email = kw['email']
			customer.tel = kw['tel']
			customer.vatnumber = kw["vatnumber"]
			customer.countryid = kw["countryid"]
			customer.contactjobtitle = kw["contactjobtitle"]
			customer.contactname = customer.getContactName()


			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("update_internal")
			transaction.rollback()
			raise

	@classmethod
	def update_modules(cls, params):
		""" 	update the module fields
		"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(params['icustomerid'])

			if customer.crm != params["crm"]:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Crm Turned %s" % "On" if params["crm"] else "Off",
				  userid=params["userid"],
				  customerid=params["icustomerid"]))

			if customer.advancefeatures != params["advancefeatures"]:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Features Turned %s" % "On" if params["advancefeatures"] else "Off",
				  userid=params["userid"],
				  customerid=params["icustomerid"]))

			if customer.updatum != params["updatum"]:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Monitoring Turned %s" % "On" if params["updatum"] else "Off",
				  userid=params["userid"],
				  customerid=params["icustomerid"]))

			if params["updatum"] and customer.maxmonitoringusers != params["maxmonitoringusers"]:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_trail_monitoring_user_count,
				  audittext="Monitoring Users From %d to %d" %(customer.maxmonitoringusers, params["maxmonitoringusers"]),
				  userid=params["userid"],
				  customerid=params["icustomerid"]))

			if customer.seo != params["seo"]:
				session.add(AuditTrail(
						audittypeid=Constants.audit_expire_date_changed,
						audittext="SEO Turned %s" % "On" if params["seo"] else "Off",
						userid=params["userid"],
						customerid=params["icustomerid"]))

			if customer.is_bundle != params["is_bundle"]:
				session.add(AuditTrail(
						audittypeid=Constants.audit_expire_date_changed,
						audittext="Bundle %s" % "On" if params["is_bundle"] else "Off",
						userid=params["userid"],
						customerid=params["icustomerid"]))

			if customer.has_news_rooms != params["has_news_rooms"]:
				session.add(AuditTrail(
						audittypeid=Constants.audit_expire_date_changed,
						audittext="News Room %s" % "On" if params["has_news_rooms"] else "Off",
						userid=params["userid"],
						customerid=params["icustomerid"]))

				if customer.has_journorequests != params["has_journorequests"]:
					session.add(AuditTrail(
						  audittypeid=Constants.audit_expire_date_changed,
						  audittext="Journo Requests %s" % "On" if params["has_journorequests"] else "Off",
						  userid=params["userid"],
						  customerid=params["icustomerid"]))

			if customer.has_international_data != params["has_international_data"]:
				session.add(AuditTrail(
						audittypeid=Constants.audit_expire_date_changed,
						audittext="International Data %s" % "On" if params["has_international_data"] else "Off",
						userid=params["userid"],
						customerid=params["icustomerid"]))

			if customer.has_clippings != params["has_clippings"]:
				session.add(AuditTrail(
						audittypeid=Constants.audit_expire_date_changed,
				    audittext="Clippings %s" % "On" if params["has_clippings"] else "Off",
				    userid=params["userid"],
				    customerid=params["icustomerid"]))

			customer.has_news_rooms = params["has_news_rooms"]
			customer.has_journorequests = params["has_journorequests"]
			customer.is_bundle = params["is_bundle"]
			customer.crm = params["crm"]
			customer.seo = params["seo"]
			customer.advancefeatures = params["advancefeatures"]
			customer.updatum = params["updatum"]
			customer.maxmonitoringusers = params["maxmonitoringusers"]
			customer.has_international_data = params["has_international_data"]
			customer.has_clippings = params["has_clippings"]

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("update_modules")
			transaction.rollback()
			raise

	@staticmethod
	def update_extendedsettings(params):
		""" 	update the extended fields
		"""
		transaction = BaseSql.sa_get_active_transaction()
		try:
			customer = Customer.query.get(params['icustomerid'])
			customer.search_show_job_roles = params["search_show_job_roles"]
			customer.search_show_coverage = params["search_show_coverage"]
			customer.search_show_profile = params["search_show_profile"]
			customer.search_show_smart = params["search_show_smart"]
			customer.view_outlet_results_colours = params["view_outlet_results_colours"]
			customer.no_distribution = params["no_distribution"]
			customer.no_export = params["no_export"]
			customer.has_clickthrought = params["has_clickthrought"]
			customer.distributionistemplated = params["distributionistemplated"]
			customer.extended_security = params["extended_security"]
			customer.required_client = params["required_client"]

			if params["extended_security"] == True:
				users = session.query(User).filter(User.customerid == params['icustomerid']).all()
				for user in users:
					user.last_change_pssw = datetime.today()
			customer.valid_ips = params["valid_ips"]

			cmat = [row.mediaaccesstypeid for row in session.query(CustomerMediaAccessTypes).\
			        filter(CustomerMediaAccessTypes.customerid == customer.customerid).all()]

			# CLA licence
			if "cla" in params:
				if int(params['cla']) not in cmat:
					session.add(CustomerMediaAccessTypes(customerid=customer.customerid, mediaaccesstypeid=int(params["cla"])))
					session.flush()
			else:
				if 2 in cmat:
					cla = session.query(CustomerMediaAccessTypes).\
						filter(CustomerMediaAccessTypes.customerid == customer.customerid,
						CustomerMediaAccessTypes.mediaaccesstypeid == 2).scalar()
					session.delete(cla)
					session.flush()
			# NLA licence
			if "nla" in params:
				if int(params['nla']) not in cmat:
					session.add(CustomerMediaAccessTypes(customerid=customer.customerid, mediaaccesstypeid=int(params["nla"])))
					session.flush()
			else:
				if 3 in cmat:
					nla = session.query(CustomerMediaAccessTypes).\
						filter(CustomerMediaAccessTypes.customerid == customer.customerid,
						CustomerMediaAccessTypes.mediaaccesstypeid == 3).scalar()
					session.delete(nla)
					session.flush()

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("update_modules")
			transaction.rollback()
			raise

	@classmethod
	def ddRefUnique(cls, icustomerid, dd_ref):
		""" see if a dd_ref is in user """
		dd_ref = dd_ref if dd_ref else None
		if dd_ref:
			tmp = [row for row in session.query(Customer).filter(
			  Customer.dd_ref == dd_ref).all() if row.customerid != icustomerid]
			if tmp:
				return tmp[0].customername

		return None

	@classmethod
	def update_customer_financial(cls, inparams):
		""" update all the finacial fields
		"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(inparams['icustomerid'])

			customer.paymentmethodid = inparams["paymentmethodid"]
			customer.financialstatusid = inparams["financialstatusid"]
			customer.bank_name = inparams["bank_name"]
			customer.bank_account_name = inparams["bank_account_name"]
			customer.bank_sort_code = inparams["bank_sort_code"]
			customer.bank_account_nbr = inparams["bank_account_nbr"]
			customer.pay_monthly_value = inparams["pay_monthly_value"]
			customer.dd_advance_value = inparams["dd_advance_value"]
			customer.dd_monitoring_value = inparams["dd_monitoring_value"]
			customer.next_month_value = inparams["next_month_value"]
			customer.dd_international_data_value = inparams["dd_international_data_value"]
			customer.next_month_value = inparams["next_month_value"]
			customer.purchase_order = inparams["purchase_order"]
			customer.next_invoice_message = inparams["next_invoice_message"]
			customer.renewal_date = inparams.get("renewal_date", None)
			renewal_date_features = inparams.get("renewal_date_features", None)
			if renewal_date_features == "":
				renewal_date_features = None
			customer.renewal_date_features = renewal_date_features
			customer.customerorderstatusid = inparams["customerorderstatusid"]
			customer.sub_start_day = inparams["sub_start_day"]
			customer.dd_ref = inparams["dd_ref"] if inparams["dd_ref"] else None
			customer.pay_montly_day = inparams["pay_montly_day"]
			customer.seopaymenttypeid = inparams["seopaymenttypeid"]
			customer.dd_start_day = inparams["dd_start_day"]
			customer.dd_start_month = inparams["dd_start_month"]
			customer.has_bundled_invoice = inparams["has_bundled_invoice"]
			customer.invoiceemail = inparams["invoiceemail"]

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("update_customer_financial")
			transaction.rollback()
			raise

	@classmethod
	def update_customer_salesanalysis(cls, inparams):
		""" update customers sales analysis fields	"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(inparams['icustomerid'])

			customer.pricecodeid = inparams["pricecodeid"]
			customer.advpricecodeid = inparams["advpricecodeid"]
			customer.updatumpricecodeid = inparams["updatumpricecodeid"]
			customer.intpricecodeid = inparams["intpricecodeid"]
			customer.clippingspricecodeid = inparams["clippingspricecodeid"]

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("update_customer_salesanalysis")
			transaction.rollback()
			raise


	@classmethod
	def update_customer_address(cls, inparams):
		""" update all the finacial fields
		"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(inparams['icustomerid'])

			customer.invoiceemail = inparams["invoiceemail"]

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("update_customer_address")
			transaction.rollback()
			raise


	@classmethod
	def customer_seo_qty_update(cls, icustomerid, seonbrincredit, iuserid):
		""" set the seo free count
		"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(icustomerid)
			if customer.seonbrincredit != seonbrincredit:
				# add loggin
				session.add(AuditTrail(audittypeid=Constants.audit_trail_seo_free_changed,
				                          audittext="SEO free from %d to %d" % (customer.seonbrincredit, seonbrincredit),
				                          userid=iuserid,
				                          customerid=icustomerid))
			customer.seonbrincredit = seonbrincredit
			transaction.commit()
		except:
			LOGGER.exception("customer_seo_qty_update")
			transaction.rollback()
			raise

	def isFinancialOnly(self):
		""" check too see if this is a finacial only customer """

		return True if self.customertypeid == Constants.Customer_Financial_Only else False

	@classmethod
	def getForEdit(cls, customerid):
		""" return the customer date for edit"""
		return CustomerView.query.get(customerid)

	ListData = """
		SELECT
		c.customerid,
		JSON_ENCODE(c.customername) as customername,
	  JSON_ENCODE(COALESCE(NULLIF(ContactName(c.contact_title,c.contact_firstname,'',c.contact_surname,''),''),c.contactname)) as contactname,
		TO_CHAR(c.licence_expire,'DD-MM-YY') AS licence_expire,
		c.email,
		c.tel,
		cs.customerstatusname,
	  TO_CHAR(c.created,'DD-MM-YY') AS created,
	  ct.customertypename,
	  advancefeatures,
	  '' AS last_login_display,
	 '' AS last_login_sort
		FROM internal.customers AS c
		JOIN internal.customerstatus AS cs ON cs.customerstatusid = c.customerstatusid
	  JOIN internal.customertypes AS ct ON ct.customertypeid = c.customertypeid
	  %s
		ORDER BY  %s %s
		LIMIT :limit  OFFSET :offset """

	ListData_Limited = """
		  SELECT
		  c.customerid,
		  JSON_ENCODE(c.customername) as customername,
		  JSON_ENCODE(COALESCE(NULLIF(ContactName(c.contact_title,c.contact_firstname,'',c.contact_surname,''),''),c.contactname)) as contactname,
		  TO_CHAR(c.licence_expire,'DD-MM-YY') AS licence_expire,
		  c.email,
		  c.tel,
		  cs.customerstatusname,
		  TO_CHAR(c.created,'DD-MM-YY') AS created,
		  ct.customertypename,
		  advancefeatures
		  FROM internal.customers AS c
		  JOIN internal.customerstatus AS cs ON cs.customerstatusid = c.customerstatusid
		  JOIN internal.customertypes AS ct ON ct.customertypeid = c.customertypeid
		  %s
		  ORDER BY  %s %s
		  LIMIT :limit  OFFSET :offset """

	ListDataCount = """
		SELECT COUNT(*) FROM internal.customers AS c %s"""

	@staticmethod
	def __addstartclause(whereclause):
		""" add and/where to caluse"""
		if whereclause:
			whereclause += " AND "
		else:
			whereclause += " WHERE "
		return whereclause

	@classmethod
	def getSearchPage(cls, kw):
		""" get customer search page """
		whereclause = ""
		if "statusid" in kw and kw["statusid"] != "-1" and  len(kw["statusid"]):
			whereclause = " WHERE c.customerstatusid = " + kw["statusid"]

		if kw.get("isinternal", False):
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += "c.isinternal = true "

		if "customername" in kw and len(kw["customername"]) and kw["customername"] != "*":
			whereclause = Customer.__addstartclause(whereclause)

			if kw["customername"].endswith("*"):
				kw["customername"] = kw["customername"][:-1]
				whereclause += " c.customername ILIKE '%s%%'" % kw["customername"]
			else:
				whereclause += " c.customername ILIKE '%%%s%%'" % kw["customername"]

		if "email" in kw and len(kw["email"]) and kw["email"] != "*":
			whereclause = Customer.__addstartclause(whereclause)

			if kw["email"].endswith("*"):
				kw["email"] = kw["email"][:-1]
				whereclause += " c.email ILIKE '%s%%'" % kw["email"]
			else:
				whereclause += "(c.email ILIKE '%%%s%%' OR c.customerid IN(SELECT customerid FROM tg_user where user_name ilike '%%%s%%'))" % (kw["email"], kw["email"])

		if "licence_expired" in kw and len(kw["licence_expired"]):
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.licence_expire >= CURRENT_DATE"

		if "accountnbr" in kw and len(kw["accountnbr"]):
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.customerid = %s" % kw["accountnbr"]

		if "customertypeid" in kw and kw["customertypeid"] != "-1":
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.customertypeid = %d" % int(kw["customertypeid"])

		if "financialstatusid" in kw and kw["financialstatusid"] != "-1":
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.financialstatusid = %d" % int(kw["financialstatusid"])

		if "customersourceid" in kw and kw["customersourceid"] != "-1":
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.customersourceid = %d" % int(kw["customersourceid"])

		if kw.get("contactname", ""):
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.customerid in(SELECT customerid FROM tg_user where display_name ilike '%%%s%%')" % kw["contactname"]

		if "monitoringstatusid" in kw:
			monitoringstatusid = int(kw["monitoringstatusid"])
			if "clippingsourceid" in kw:
				clippingsourceid = int(kw["clippingsourceid"])
				kw["clippingsourceid"] = clippingsourceid
			else:
				clippingsourceid = None
			whereclause = Customer.__addstartclause(whereclause)
			if monitoringstatusid == 1:
				whereclause += " c.has_clippings=true"
				if clippingsourceid:
					whereclause += """ AND EXISTS(SELECT co.clippingsorderid FROM internal.clippingsorder AS co WHERE
					co.customerid = c.customerid AND co.clippingsourceid = :clippingsourceid)"""

			elif monitoringstatusid == 2:
				command = """ (c.has_clippings=true AND EXISTS(SELECT co.clippingsorderid FROM internal.clippingsorder AS co WHERE
				co.customerid = c.customerid AND CURRENT_DATE BETWEEN co.startdate AND co.enddate AND co.has_been_deleted = false"""
				if clippingsourceid:
					command += " AND co.clippingsourceid = :clippingsourceid"
				command += "))"
				whereclause += command
			elif monitoringstatusid == 3:
				command = """ (c.has_clippings=true AND NOT EXISTS(SELECT co.clippingsorderid FROM internal.clippingsorder AS co WHERE
				co.customerid = c.customerid"""
				if clippingsourceid:
					command += " AND co.clippingsourceid = :clippingsourceid"
				command += "))"
				whereclause += command
			elif monitoringstatusid == 4:
				whereclause += """ (c.has_clippings=true AND
				NOT EXISTS(SELECT co.clippingsorderid FROM internal.clippingsorder AS co WHERE
				co.customerid = c.customerid AND CURRENT_DATE BETWEEN co.startdate AND co.enddate AND co.has_been_deleted = false) AND
				EXISTS (SELECT co.clippingsorderid FROM internal.clippingsorder AS co WHERE
				co.customerid = c.customerid AND CURRENT_DATE NOT BETWEEN co.startdate AND co.enddate OR co.has_been_deleted = false)
				)"""
		elif "clippingsourceid" in kw:
			clippingsourceid = int(kw["clippingsourceid"])
			kw["clippingsourceid"] = clippingsourceid
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += """ (c.has_clippings=true AND EXISTS(SELECT co.clippingsorderid FROM internal.clippingsorder AS co WHERE
						  co.customerid = c.customerid AND CURRENT_DATE BETWEEN co.startdate AND co.enddate AND co.has_been_deleted = false AND co.
			        clippingsourceid = :clippingsourceid))"""

		# search by invoice nbr
		if kw.get("invoicenbr", ""):
			whereclause = Customer.__addstartclause(whereclause)
			try:
				invoicenbr = int(kw["invoicenbr"])
			except:
				invoicenbr = -1

			whereclause += " c.customerid in(SELECT customerid FROM accounts.customerinvoices WHERE invoicenbr = %d)" % invoicenbr

		# search by credit note
		if kw.get("creditnotenbr", ""):
			whereclause = Customer.__addstartclause(whereclause)
			try:
				creditnotenbr = int(kw["creditnotenbr"])
			except:
				creditnotenbr = -1

			whereclause += " c.customerid in(SELECT customerid FROM accounts.customerpayments WHERE creditnotenbr = %d)" % creditnotenbr


		if kw.get("unallocated", False):
			whereclause = Customer.__addstartclause(whereclause)
			whereclause += " c.customerid in(SELECT customerid FROM accounts.customerinvoices WHERE unpaidamount >0.0 GROUP BY customerid)"

		# initial filter
		if "active_only" in kw:
			whereclause = BaseSql.addclause(whereclause, "( c.customerstatusid IN (2,5) AND (c.licence_expire >= CURRENT_DATE OR c.licence_expire IS NULL))")

		# restriction for 3rd party view
		if kw["prstate"].u.customertypeid:
			whereclause = BaseSql.addclause(whereclause, "(c.customertypeid = :rescustomertypeid)")
			kw["rescustomertypeid"] = kw["prstate"].u.customertypeid

		kw['sortfield'] = kw.get('sortfield', 'customername')
		if not kw['sortfield']:
			kw['sortfield'] = 'lower(customername)'
		elif kw['sortfield'] == "customername":
			kw['sortfield'] = 'lower(customername)'
		elif kw['sortfield'] == "contacttname":
			kw['sortfield'] = 'COALESCE(NULLIF(c.contact_surname,''),c.contactname) '
		elif kw['sortfield'] == "licence_expire":
			kw['sortfield'] = 'c.licence_expire'
		elif kw['sortfield'] == "last_login_display":
			kw['sortfield'] = 'last_login_sort'

		if "limited_view" in kw:
			command = Customer.ListData_Limited
		else:
			command = Customer.ListData


		items = cls.sqlExecuteCommand(
			text(command%(whereclause, kw['sortfield'], kw['direction'])),
			kw,
			BaseSql.ResultAsEncodedDict)

		numRows = cls.sqlExecuteCommand(
			text(Customer.ListDataCount % whereclause),
			kw,
			BaseSql._singleResult)

		if type(numRows) == ListType:
			numRows = numRows[0]

		return dict(
			numRows=numRows,
			items=items,
			identifier="customerid")

	@classmethod
	def get_search_rest(cls, params):
		"""as rest page"""
		return cls.grid_to_rest_ext(cls.getSearchPage(params),
		                         params["offset"],
		                         True if "icustomerid" in params else False)

	List_Combo_Customers = """
		SELECT JSON_ENCODE(c.customername) as customername, c.customerid
		FROM internal.customers AS c
		WHERE
		c.customername ilike :customername
		ORDER BY c.customername
		LIMIT :limit  OFFSET :offset """
	List_Combo_Customers_Id = """
		SELECT JSON_ENCODE(c.customername) as customername, c.customerid
		FROM internal.customers AS c
		WHERE c.customerid =:id"""

	List_Partners_Customers = """
		SELECT JSON_ENCODE(c.customername) as customername, c.contactname, cs.customerstatusname
		FROM internal.customers AS c
	    LEFT OUTER JOIN internal.customerstatus AS cs ON cs.customerstatusid = c.customerstatusid
		WHERE c.customersourceid = :customersourceid"""

	List_Partners_Customers_Count = """
		SELECT count(*)
		FROM internal.customers AS c
	    LEFT OUTER JOIN internal.customerstatus AS cs ON cs.customerstatusid = c.customerstatusid
		WHERE c.customersourceid = :customersourceid"""
	List_Partners_Customers_Order = """ ORDER BY %s %s NULLS LAST """
	@classmethod
	def get_list_page(cls, params):
		"""Get a list of customer for internal use """

		# this is the no selection option
		if params.has_key("id") and params["id"] == "-2":
			return dict(identifier="customerid",
			              numRows=1,
			              items=[dict(customerid=-2, customername="No Selection")])

		# return coplete list based on selection
		return BaseSql.getListPage(params,
				                     "customername",
				                     "customerid",
				                     Customer.List_Combo_Customers,
				                     Customer.List_Combo_Customers_Id,
				                     cls)

	@classmethod
	def get_list_partners_page(cls, params):
		"""Get a list of customer for internal use """

		andclause = ''
		if params.get('sortfield', "") == "customername":
			params["sortfield"] = params["sortfield"].replace("customername", "c.customername")
		if not params.get('sortfield', ""):
			params["sortfield"] = "c.customername"
			params['direction'] = "asc"
		if params.get('sortfield', "") == "contactname":
			params["sortfield"] = "c.contactname"

		if params.get('sortfield', "") == "customerstatusname":
			params["sortfield"] = "cs.customerstatusname"

		if "customersourceid" not in params:
			params["customersourceid"] = -1

		if "customerstatus" in params and 0 != int(params['customerstatus']):
			params['customerstatusid'] = params['customerstatus']
			andclause = ' AND c.customerstatusid = :customerstatusid'
			if Constants.Customer_Active == int(params['customerstatusid']):
				andclause += ' AND licence_expire > CURRENT_DATE'

		# return complete list based on selection
		return BaseSql.getGridPage(params,
				                     "customername",
				                     "customersourceid",
				                     Customer.List_Partners_Customers + andclause + Customer.List_Partners_Customers_Order,
				                     Customer.List_Partners_Customers_Count + andclause,
				                     cls)

	@classmethod
	def get_internal(cls, kw):
		""" get actual customer id """
		cust = Customer.query.get(kw['icustomerid'])
		if cust:
			cust = copy.deepcopy(cust)
			if cust.addressid:
				address = Address.query.get(cust.addressid)
			else:
				address = None

			licence_expire_display = ""
			core_expire = cust.licence_expire.strftime("%d/%m/%y")
			licence_expire_display = "Core(%s)" % core_expire
			cust.end_date = cust.licence_expire

			cust.licence_expire = dict(year=cust.licence_expire.year,
						                 month=cust.licence_expire.month,
						                 day=cust.licence_expire.day)

			if cust.licence_start_date:
				cust.licence_start_date_d = dict(year=cust.licence_start_date.year,
				                                 month=cust.licence_start_date.month,
				                                 day=cust.licence_start_date.day)
			else:
				cust.licence_start_date_d = None

			if cust.advance_licence_expired:
				cust.advance_licence_expired_d = dict(year=cust.advance_licence_expired.year,
				                                      month=cust.advance_licence_expired.month,
				                                      day=cust.advance_licence_expired.day)
				licence_expire_display += " Advance(%s)" % cust.advance_licence_expired.strftime("%d/%m/%y")
			else:
				if cust.advancefeatures:
					licence_expire_display += " Advance(%s)" % core_expire
				cust.advance_licence_expired_d = None

			if cust.advance_licence_start:
				cust.advance_licence_start_d = dict(year=cust.advance_licence_start.year,
				                                    month=cust.advance_licence_start.month,
				                                    day=cust.advance_licence_start.day)
			else:
				cust.advance_licence_start_d = None

			if cust.updatum_start_date:
				cust.updatum_start_date_d = dict(year=cust.updatum_start_date.year,
				                                 month=cust.updatum_start_date.month,
				                                   day=cust.updatum_start_date.day)
			else:
				cust.updatum_start_date_d = None

			if cust.updatum_end_date:
				cust.updatum_end_date_d = dict(year=cust.updatum_end_date.year,
				                               month=cust.updatum_end_date.month,
				                               day=cust.updatum_end_date.day)
				licence_expire_display += " Monitoring(%s)" % cust.updatum_end_date.strftime("%d/%m/%y")
			else:
				if cust.updatum:
					licence_expire_display += " Monitoring(%s)" % core_expire

				cust.updatum_end_date_d = None


			cust.licence_expire_display = licence_expire_display

			if cust.renewal_date:
				cust.renewal_date_d = dict(year=cust.renewal_date.year,
				                           month=cust.renewal_date.month,
				                           day=cust.renewal_date.day)
			else:
				cust.renewal_date_d = None

			if cust.renewal_date_features:
				cust.renewal_date_features_d = dict(year=cust.renewal_date_features.year,
				                                    month=cust.renewal_date_features.month,
				                                    day=cust.renewal_date_features.day)
			else:
				cust.renewal_date_features_d = None

			if cust.last_paid == None:
				cust.last_paid_date_display = ""
			else:
				cust.last_paid_date_display = cust.last_paid.strftime("%b%y")

			if cust.dd_collectiondate == None:
				cust.dd_collectiondate_display = ""
			else:
				cust.dd_collectiondate_display = cust.dd_collectiondate.strftime("%d/%m/%y")

			if cust.invoiceaddressid:
				iaddress = Address.query.get(cust.invoiceaddressid)
			else:
				iaddress = None

			custsource = CustomerSources.query.get(cust.customersourceid)

			cust_mediaaccesstype = [row.mediaaccesstypeid for row in session.query(CustomerMediaAccessTypes).
			                        filter(CustomerMediaAccessTypes.customerid == cust.customerid).all()]

		return dict(cust=cust,
		            address=address,
		            iaddress=iaddress,
		            custsource=custsource,
		            mediaaccesstype = cust_mediaaccesstype)

	@classmethod
	def setExtpireDateInternal(cls, customerid, licence_expire, advance_licence_expired,
	                           licence_start_date, advance_licence_start,
	                           updatum_start_date, updatum_end_date,
	                           userid, advancefeatures, contacthistoryid):
		""" Set the expire date with no transactions etc"""
		customer = Customer.query.get(customerid)
		if customer.licence_expire != licence_expire:
			session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
			                          audittext="Media Expire Date %s to %s" %(DatetoStdString(customer.licence_expire), DatetoStdString(licence_expire)),
			                          userid=userid,
			                          customerid=customerid,
			                          contacthistoryid=contacthistoryid))
		customer.licence_expire = licence_expire
		customer.licence_start_date = licence_start_date
		if advancefeatures:
			if customer.advance_licence_expired != advance_licence_expired:
				session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
				                          audittext="Features Expire Date %s to %s" % (DatetoStdString(customer.advance_licence_expired), DatetoStdString(advance_licence_expired)),
				                          userid=userid,
				                          customerid=customerid))
			if advance_licence_expired:
				customer.advance_licence_expired = advance_licence_expired
			if advance_licence_start:
				customer.advance_licence_start = advance_licence_start

		if customer.updatum:
			if customer.updatum_start_date != updatum_end_date:
				session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
				                          audittext="Monitoring Expire Date %s to %s" % (DatetoStdString(customer.updatum_start_date), DatetoStdString(updatum_end_date)),
				                          userid=userid,
				                          customerid=customerid))
			if updatum_start_date:
				customer.updatum_start_date = updatum_start_date
			if updatum_end_date:
				customer.updatum_end_date = updatum_end_date



	@classmethod
	def set_expire_date(cls, params):
		""" Set customer expiry date """
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(params["icustomerid"])
			if params["reason"]:
				taskid = None
				if params.get("taskid", "") != "":
					taskid = params["taskid"]

				from prcommon.model.crm import ContactHistory
				contacthistory = ContactHistory(ref_customerid=params["icustomerid"],
				                 taken_by=params["userid"],
				                 subject="Expire Date Altered",
				                 details=params["reason"],
				                 taskid=taskid,
				                 contacthistorysourceid=Constants.Contact_History_Type_Sales)
				session.add(contacthistory)
				session.flush()
				contacthistoryid = contacthistory.contacthistoryid
			else:
				contacthistoryid = None

			cls.setExtpireDateInternal(params["icustomerid"],
			                           params["licence_expire"],
			                           params["advance_licence_expired"],
			                           params["licence_start_date"],
			                           params["advance_licence_start"],
			                           params["updatum_start_date"],
			                           params["updatum_end_date"],
			                           params["userid"],
			                           customer.advancefeatures,
			                           contacthistoryid)
			transaction.commit()
		except:
			LOGGER.exception("set_expire_date")
			transaction.rollback()
			raise

	@classmethod
	def set_collateral_size(cls, customerid, collateral_size):
		""" Set the collateral store size for a customer"""

		transaction = cls.sa_get_active_transaction()
		try:
			customer = Customer.query.get(customerid)
			customer.collateral_size = collateral_size

			transaction.commit()
		except:
			LOGGER.exception("set_collateral_size")
			transaction.rollback()
			raise

	@staticmethod
	def set_max_emails_for_day(customerid, max_emails_for_day):
		""" Set the collateral store size for a customer"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			customer = Customer.query.get(customerid)
			customer.max_emails_for_day = int(max_emails_for_day)

			transaction.commit()
		except:
			LOGGER.exception("set_max_emails_for_day")
			transaction.rollback()
			raise

	def set_type_defaults(self):
		"""Set the default settings for a type """

		if self.customertypeid == Constants.CustomerType_DePerslijst:
			std_options = False
			self.no_distribution = True
		else:
			std_options = True
			self.no_distribution = False

		if self.customertypeid == Constants.CustomerType_StereoTribes:
			self.no_export = True

		self.search_show_job_roles = std_options
		self.search_show_coverage = std_options
		self.search_show_profile = std_options
		self.search_show_smart = std_options
		self.view_outlet_results_colours = std_options
		self.distributionistemplated = False

	@classmethod
	def set_login_count(cls, customerid, logins, userid):
		""" Set customer login count"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(customerid)
			session.add(AuditTrail(audittypeid=Constants.audit_logins_changed,
						              audittext="Logins changed from %s to %s" % (str(customer.logins), str(logins)),
						              userid=userid,
						              customerid=customerid))
			customer.logins = logins
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("set_login_count")
			transaction.rollback()
			raise

	@classmethod
	def set_user_count(cls, customerid, maxnbrofusersaccounts, userid):
		""" Set customer login count"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(customerid)
			session.add(AuditTrail(audittypeid=Constants.audit_expire_date_changed,
						              audittext="User Count changed from %s to %s" % (customer.maxnbrofusersaccounts, maxnbrofusersaccounts),
						              userid=userid,
						              customerid=customerid))
			customer.maxnbrofusersaccounts = maxnbrofusersaccounts
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("set_user_count")
			transaction.rollback()
			raise

	@classmethod
	def set_demo_status(cls, customerid, status, isadvancedemo, ismonitoringdemo, userid):
		""" Set customer demo flag"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(customerid)

			if customer.isdemo != status:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Core Demo Status Changed from %s to %s" % (customer.isdemo, status),
				  userid=userid,
				  customerid=customerid))

			if customer.isadvancedemo != isadvancedemo:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Features Demo Status Changed from %s to %s" % (customer.isadvancedemo, isadvancedemo),
				  userid=userid,
				  customerid=customerid))
			if customer.ismonitoringdemo != ismonitoringdemo:
				session.add(AuditTrail(
				  audittypeid=Constants.audit_expire_date_changed,
				  audittext="Monitoring Demo Status Changed from %s to %s" % (customer.ismonitoringdemo, ismonitoringdemo),
				  userid=userid,
				  customerid=customerid))

			customer.isdemo = status
			customer.isadvancedemo = isadvancedemo
			customer.ismonitoringdemo = ismonitoringdemo
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("set_demo_status")
			transaction.rollback()
			raise

	@classmethod
	def set_email_status(cls, customerid, status, emailistestmode, userid):
		""" Set customer demo flag"""
		transaction = cls.sa_get_active_transaction()

		try:
			customer = Customer.query.get(customerid)
			session.add(AuditTrail(audittypeid=Constants.audit_email_status_changed,
						              audittext="Email Status Changed from %s to %s" %(customer.isdemo, status),
						              userid=userid,
						              customerid=customerid))
			customer.useemail = status
			customer.emailistestmode = emailistestmode
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("setEmailStatus Failed")
			transaction.rollback()
			raise

	@classmethod
	def user_able_to_add_check(cls, params):
		""" check customer licence to see if we are able to add a new user
		"""
		# get the customer id for internal main
		customerid = params.get("icustomerid", params["customerid"])

		customer = cls.query.get(customerid)
		result = session.query(User.user_id).filter_by(customerid=customerid)

		return True if result.count() < customer.maxnbrofusersaccounts else False


	@classmethod
	def change_status_internal(cls, params):
		""" Chnage the status of a customer """
		customer = Customer.query.get(params['customerid'])
		if customer.customerstatusid != params['customerstatusid']:
			session.add(AuditTrail(audittypeid=Constants.audit_status_changed,
						             audittext="Status Changed",
						             userid=params['user_id'],
						             customerid=params['customerid'],
						             auditextfields=DBCompress.encode2(
			                     dict(from_code=customer.customerstatusid,
			                          to_code=params['customerstatusid']))))
			customer.customerstatusid = params['customerstatusid']

	@classmethod
	def change_status(cls, params):
		""" Chnage the status of a customer """
		transaction = session.begin(subtransactions=True)
		try:
			cls.change_status_internal(params)
			transaction.commit()
		except:
			LOGGER.exception("change_status")
			transaction.rollback()
			raise

	_GetConcurrentCount = """SELECT u.user_id
	FROM visit_identity AS vi
	JOIN tg_user AS u  ON u.user_id = vi.user_id
	JOIN visit AS v on v.visit_key = vi.visit_key
	WHERE v.expiry > now() AND u.customerid =:customerid AND
	u.usertypeid =  1
	GROUP BY u.user_id"""

	def getConcurrentExeeded(self, userid):
		""" Determine if the concurrent users have been exceeded """

		# if this is a sport user then bypass this step
		u = User.query.get(userid)
		if u.usertypeid == Constants.UserType_Support:
			return False


		nbr = self.sqlExecuteCommand(Customer._GetConcurrentCount,
				                      dict(customerid=self.customerid),
				                      BaseSql.NbrOfRows)
		return True if self.logins < nbr else False

	_UserList = """SELECT u.user_id, u.user_name
	FROM visit_identity AS vi
	JOIN tg_user AS u  ON u.user_id = vi.user_id
	JOIN visit AS v on v.visit_key = vi.visit_key
	WHERE v.expiry > now() AND u.usertypeid = 1
	AND u.customerid =:customerid AND u.user_id !=:userid
	GROUP by u.user_id, u.user_name"""

	def getLoggedinUserExclude(self, userid):
		""" Get count of user logged in for customer """
		return self.sqlExecuteCommand(Customer._UserList,
				                       dict(customerid=self.customerid, userid=userid),
				                       BaseSql.ResultAsEncodedDict)

	@classmethod
	def useEmail(cls, customerid):
		""" get the use email flag"""
		return cls.query.get(customerid).useemail

	@classmethod
	def checkExists(cls, kw):
		""" Check to see if a customer or part of the customer already exists """
		if User.exists(kw['email']) or User.exists_email(kw['email']):
			return dict(success="DU", message="Email address already exists")

		result = session.query(Customer).filter_by(customername=kw["customername"])
		if result.count():
			return dict(success="DU", message="Company Already Exists")

		return None

	@classmethod
	def new(cls, kw):
		""" add a new customer account """
		try:
			logins = NbrOfLogins.query.get(kw['nbrofloginsid'])

			transaction = cls.sa_get_active_transaction()
			# add address
			addr = Address(address1=kw['address1'],
						   address2=kw['address2'],
						   county=kw['county'],
						   postcode=kw['postcode'],
						   townname=kw['townname'],
						   addresstypeid=Address.customerAddress)
			session.add(addr)
			session.flush()
			# add external customer
			cust = Customer(
				customerstatusid=kw["customerstatusid"],
				customertypeid=kw["customertypeid"],
				customername=kw['customername'],
				contactname=kw.get('contactname', ''),
			  contact_title=kw.get('contact_title', ''),
			  contact_firstname=kw.get('contact_firstname', ''),
			  contact_surname=kw.get('contact_surname', ''),
				contactjobtitle=kw["contactjobtitle"],
				logins=logins.nbroflogins,
				maxnbrofusersaccounts=logins.maxnbrofusersaccounts,
				addressid=addr.addressid,
				email=kw['email'],
				tel=kw['tel'],
				termid=kw['termid'],
				licence_expire=kw["licence_expire"],
				nbrofloginsid=kw['nbrofloginsid'],
				proforma=False,
				vatnumber=kw["vatnumber"] if kw.has_key("vatnumber") else "",
				countryid=kw["countryid"],
			  advancefeatures=kw["advancefeatures"],
			  crm=kw["crm"])

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
			user = User(user_name=kw['email'],
						  email_address=kw['email'],
						  display_name=cust.getContactName(),
						  password=kw['password'],
						  customerid=cust.customerid)
			session.add(user)

			# add primary data set
			CustomerPrmaxDataSets.set_primary(cust.customerid)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("customer_external_new")
			transaction.rollback()
			raise

		return dict(user=user, cust=cust)

	@classmethod
	def is_valid_newsroom(cls, root):
		"""check too see if this is avalid root for a news room """
		try:
			customerid = int(root)
			customer = Customer.query.get(customerid)
			if customer and customer.has_news_rooms:
				return customer
		except:
			pass

		return None

	def is_active(self):
		"""check too if a customer is active"""
		if(self.customerstatusid == Constants.Customer_Awaiting_Activation or not self.has_started()) or \
		    self.has_expired() or \
		    self.customerstatusid == Constants.Customer_Inactive:
			return False
		return True


	def remove_demo_status(self):
		"""Remove the demo status from a customer """

		# remove all demo flag off account
		self.isdemo = False
		self.isadvancedemo = False
		self.ismonitoringdemo = False

		# remove email flag
		self.useemail = True

	List_DD = """
		SELECT JSON_ENCODE(c.customername) AS customername,
	    to_char(c.last_paid, 'Mon/yy') AS last_paid_display,
	    c.licence_expire,
	    ROUND(c.pay_monthly_value/100.0,2) as pay_monthly_value,
	    c.email,
	    c.customerid,
	    p.paymentmethodname,
	    p.paymentmethodid,
	    f.financialstatusdescription
		FROM internal.customers AS c
	  JOIN internal.paymentmethods AS p ON c.paymentmethodid = p.paymentmethodid
	  JOIN internal.financialstatus AS f ON c.financialstatusid = f.financialstatusid
		WHERE c.paymentmethodid  IN(2,3) AND c.licence_expire > CURRENT_DATE %s
		ORDER BY %s %s
		LIMIT :limit  OFFSET :offset """

	List_DD_Count = """
		SELECT COUNT(*)
		FROM internal.customers AS c
		WHERE c.paymentmethodid  IN(2,3) AND c.licence_expire > CURRENT_DATE %s """

	List_DD_Data_Id = """
		SELECT JSON_ENCODE(c.customername) AS customername,
	    to_char(c.last_paid, 'Mon/yy') AS last_paid_display,
	    c.licence_expire,
	    ROUND(c.pay_monthly_value/100.0,2) as pay_monthly_value,
	    c.email,
	    c.customerid
		FROM internal.customers AS c
		WHERE c.customerid =:icustomerid"""

	@classmethod
	def getMonltyPage(cls, kw):
		""" get customer search page """
		whereclause = ""
		if not kw['sortfield']:
			kw['sortfield'] = "customername"

		if kw.get("showall", "0") == "1":
			whereclause = " AND NOT(EXTRACT(MONTH FROM c.last_paid) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM c.last_paid) = EXTRACT(YEAR FROM CURRENT_DATE)) "

		items = cls.sqlExecuteCommand(
			text(Customer.List_DD%(whereclause, kw['sortfield'], kw['direction'])),
			kw,
			BaseSql.ResultAsEncodedDict)

		numRows = cls.sqlExecuteCommand(
			text(Customer.List_DD_Count % whereclause),
			None,
			BaseSql._singleResult)

		return dict(
			numRows=numRows,
			items=items,
			identifier="customerid")

	@classmethod
	def getPaymentValue(cls, icustomerid):
		""" get the standard payment value for a dd customer """
		return cls.sqlExecuteCommand(
			text(Customer.List_DD_Data_Id),
			dict(icustomerid=icustomerid),
			BaseSql.SingleResultAsEncodedDict)

	Template_Map = {
	  Constants.CustomerType_AIMedia: 'prmax.templates.startai',
	  Constants.CustomerType_Updatum:'prmax.templates.updatum',
	  Constants.CustomerType_Fens: 'prmax.templates.startfens',
	  Constants.CustomerType_KantarMedia: 'prmax.templates.startkantar',
	  Constants.CustomerType_Phoenixpb: 'prmax.templates.startphoenixpd',
	  Constants.CustomerType_SEO: 'mako:prmax.templates.startseo',
	  Constants.CustomerType_BlueBoo:'prmax.templates.startblueboo',
	  Constants.CustomerType_IPCB: 'prmax.templates.startipcb',
	  Constants.CustomerType_SolididMedia: 'prmax.templates.solidmedia',
	  Constants.CustomerType_DePerslijst: 'prmax.templates.deperslijst',
	  Constants.CustomerType_MyNewsdesk: 'prmax.templates.mynewsdesk',
	  Constants.CustomerType_Professional: 'prmax.templates.professional',
	  Constants.CustomerType_LevelCert: 'prmax.templates.start_levelcert',
	  Constants.CustomerType_StereoTribes: 'prmax.templates.start_stereotribes',
	  Constants.CustomerType_PressData: 'prmax.templates.start_pressdata',
	}

	def get_start_point(self):
		""" Where a customer should start from """
		return Customer.Template_Map.get(self.customertypeid, 'prmax.templates.start2')

	def getContactName(self):
		""" get the contact name"""
		if self.contact_firstname == None:
			return self.contactname

		r = self.contact_title
		if r:
			r += " "
		r = r + self.contact_firstname + " " + self.contact_surname

		return r.strip()

	@classmethod
	def update_settings(cls, kw):
		""" update setting from the tracking syystem """
		try:
			transaction = cls.sa_get_active_transaction()

			c = Customer.query.get(kw["icustomerid"])
			c.customersourceid = kw["customersourceid"]
			transaction.commit()
		except:
			LOGGER.exception("update_settings")
			transaction.rollback()
			raise

	def resetEmailActionStatus(self):
		""" this reset the email trail to the first status the emailer will determine
		which email to sent out
		If this is out of date then it will set the status to such """

		if  self.createddate + timedelta(days=5) < datetime.now():
			self.emailactionstatusid = Constants.EmailActionStatus_PostPeriod
		else:
			self.emailactionstatusid = Constants.EmailActionStatus_TrailCreated

	@classmethod
	def getBalances(cls, icustomerid):
		""" get the current balance info for a customer """

		return cls.sqlExecuteCommand(text("SELECT * FROM customerbalance(:icustomerid)"),
		                             dict(icustomerid=icustomerid),
		                             BaseSql.SingleResultAsEncodedDict)

	@classmethod
	def accept_order_confirmation(cls, kw):
		""" user has accepted order confirmation """

		try:
			transaction = cls.sa_get_active_transaction()

			cust = Customer.query.get(kw["customerid"])
			cust.confirmation_accepted = False

			session.add(AuditTrail(audittypeid=Constants.audit_order_confirmation_confirmed,
				                audittext="Order Confirmation Accepted",
				                userid=kw["userid"],
				                customerid=kw["customerid"]))

			transaction.commit()
		except:
			LOGGER.exception("accept_order_confirmation")
			transaction.rollback()
			raise

	@classmethod
	def upgrade_upgrade_confirmation(cls, params):
		""" user has accepted upgrade order confirmation """

		try:
			transaction = cls.sa_get_active_transaction()

			cust = Customer.query.get(params["customerid"])
			cust.upgrade_confirmation_accepted = False

			session.add(AuditTrail(
			  audittypeid=Constants.audit_order_confirmation_confirmed,
			  audittext="Upgrade Confirmation Accepted",
			  userid=params["userid"],
			  customerid=params["customerid"]))

			transaction.commit()
		except:
			LOGGER.exception("upgrade_upgrade_confirmation")
			transaction.rollback()
			raise

	@classmethod
	def accept_monitoring_confirmation(cls, params):
		""" user has accepted monitoring info """

		try:
			transaction = cls.sa_get_active_transaction()

			cust = User.query.get(params["userid"])
			cust.monitoring_accepted = True

			session.add(AuditTrail(
			  audittypeid=Constants.audit_order_confirmation_confirmed,
			  audittext="Monitoring Confirmation Accepted",
			  userid=params["userid"],
			  customerid=params["customerid"]))

			transaction.commit()
		except:
			LOGGER.exception("accept_monitoring_confirmation")
			transaction.rollback()
			raise

	def is_monitoring_active(self):
		""" Check too see if a  """
		if self.updatum:
			t = date.today()
			if self.updatum_start_date != None and self.updatum_end_date != None:
				if self.updatum_start_date <= t and t <= self.updatum_end_date:
					return True
				else:
					return False
			elif self.updatum_start_date == None and self.updatum_end_date != None:
				if t <= self.updatum_end_date:
					return True
				else:
					return False
			elif self.updatum_start_date != None and self.updatum_end_date == None:
				if self.updatum_start_date <= t:
					return True
				else:
					return False

			return True

		return False

	def is_partner(self):
		""" Is a paretner interface """

		return True if self.customertypeid in Constants.Customer_Is_Partner else False


	@classmethod
	def update_extended_subject(cls, icustomerid, has_extended_email_subject):
		""" Updte the customers update_extended_subject """

		try:
			transaction = cls.sa_get_active_transaction()

			cust = Customer.query.get(icustomerid)
			cust.has_extended_email_subject = has_extended_email_subject

			transaction.commit()
		except:
			LOGGER.exception("update_extended_subject")
			transaction.rollback()
			raise

class Visit(BaseSql):
	"""
    A visit to your site
    """
	def lookup_visit(cls, visit_key):
		""" lookup """
		return cls.query.get(visit_key)
	lookup_visit = classmethod(lookup_visit)


	def has_expired(self):
		""" expired """
		if self.expiry < datetime.now():
			return True
		else:
			return False

	List_Logged_in = """SELECT v.expiry, u.user_name, v.visit_key, c.customername,vi.user_id
	FROM
	public.visit as v
	JOIN public.visit_identity AS vi ON  v.visit_key = vi.visit_key
	JOIN public.tg_user AS u ON u.user_id = vi.user_id
	JOIN internal.customers as c ON c.customerid = u.customerid
	WHERE
		v.expiry >= current_timestamp
	ORDER BY  %s %s
	LIMIT :limit  OFFSET :offset"""

	List_Logged_in_Count = """SELECT COUNT(*)
	FROM public.visit AS v
	JOIN public.visit_identity AS vi ON  v.visit_key = vi.visit_key
	JOIN public.tg_user AS u ON u.user_id = vi.user_id
	WHERE v.expiry >= current_timestamp"""

	@classmethod
	def getGridPage(cls, kw):
		""" Get alist of visits"""
		return BaseSql.getGridPage(kw, "expiry",
								   "visit_key",
								   Visit.List_Logged_in,
								   Visit.List_Logged_in_Count,
								   cls)


class VisitIdentity(object):
	"""A Visit that is linked to a User object."""

	@classmethod
	def by_visit_key(cls, visit_key):
		"""Look up VisitIdentity by given visit key."""
		return session.query(cls).get(visit_key)


class Group(object):
	"""An ultra-simple group definition."""

	def __repr__(self):
		return '<Group: name="%s", display_name="%s">' %(
			self.group_name, self.display_name)

	def __unicode__(self):
		return self.display_name or self.group_name

	@classmethod
	def by_group_name(cls, group_name):
		"""Look up Group by given group name."""
		return session.query(cls).filter_by(group_name=group_name).first()
	by_name = by_group_name


class Permission(object):
	"""A relationship that determines what each Group can do."""

	def __repr__(self):
		return '<Permission: name="%s">' % self.permission_name

	def __unicode__(self):
		return self.permission_name

	@classmethod
	def by_permission_name(cls, permission_name):
		"""Look up Permission by given permission name."""
		return session.query(cls).filter_by(permission_name=permission_name).first()
	by_name = by_permission_name


class CustomerView(object):
	""" CustomerView """
	@classmethod
	def get(cls):
		""" get """
		if not identity.current.anonymous:
			return CustomerView.query.get(identity.current.user.customerextid)
		else:
			return None

	@classmethod
	def getProductId(cls):
		""" get """
		if not identity.current.anonymous:
			return CustomerView.query.get(identity.current.user.customerextid).productid
		else:
			return None

class UserGroups(object):
	pass


class UserDefaultCountries(BaseSql):
	""" default country for user """



CustomerView.mapping =	Table('customer_external_view', metadata,
                                Column('customerid', Integer, primary_key=True),
                                autoload=True)


User.mapping = Table('tg_user', metadata, autoload=True)
Customer.mapping = Table('customers', metadata, autoload=True, schema="internal")

user_external_view_table = Table('user_external_view', metadata,
                                 Column('user_id', Integer, primary_key=True),
                                 autoload=True)
Visit.mapping = Table('visit', metadata, autoload=True)
VisitIdentity.mapping = Table('visit_identity', metadata, autoload=True)
groups_table = Table('tg_group', metadata, autoload=True)
permissions_table = Table('permission', metadata, autoload=True)
user_group_table = Table('user_group', metadata, autoload=True)
group_permission_table = Table('group_permission', metadata, autoload=True)

UserDefaultCountries.mapping = Table('user_default_countries', metadata, autoload=True)

mapper(UserGroups, user_group_table)
mapper(Visit, Visit.mapping)
mapper(VisitIdentity, VisitIdentity.mapping,
        properties=dict(user=relation(User, backref='visit_identity')))

mapper(User, User.mapping, properties=dict(_password=User.mapping.c.password))
mapper(Group, groups_table,
        properties=dict(users=relation(User,
                secondary=user_group_table, backref='groups')))

mapper(Permission, permissions_table,
        properties=dict(groups=relation(Group,
                secondary=group_permission_table, backref='permissions')))
mapper(UserView, user_external_view_table)
mapper(Customer, Customer.mapping)
mapper(CustomerView, CustomerView.mapping)
mapper(UserDefaultCountries, UserDefaultCountries.mapping)


