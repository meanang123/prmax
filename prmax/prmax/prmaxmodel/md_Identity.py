# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        md_Identity.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import logging
from datetime import datetime

from turbogears.database import session
from sqlalchemy import not_
from prcommon.model import UserView, Customer, User, UserDefaultCountries, Countries, BaseSql

LOGGER = logging.getLogger("prmax.model")

#########################################################
class Preferences(object):
	""" user preferences """

	@classmethod
	def get(cls, user_id):
		""" get items"""
		user = User.query.get(user_id)
		customer = Customer.query.get(user.customerid)

		control = user.get_settings()
		countries = []
		for country in control['countries']:
			countries.append(country['countryid'])

		return dict(control=control,
		            user=UserView.query.get(user_id),
		            countries=[dict(countryid=country.countryid,
		                            countryname=country.countryname)
		                       for user, country in session.query(UserDefaultCountries, Countries).
		                       filter(UserDefaultCountries.countryid == Countries.countryid).
		                       filter(UserDefaultCountries.userid == user_id).
		                       filter(not_(UserDefaultCountries.countryid.in_(countries))).all()],
		            customer=dict(crm_subject=customer.crm_subject, crm_outcome=customer.crm_outcome, crm_engagement=customer.crm_engagement))

	@classmethod
	def update_projectname(cls, params):
		""" update the customer project name settings"""
		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(params['user_id'])
			user.projectname = params.get("projectname")
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception(ex)
			raise ex

	@classmethod
	def is_valid_password(cls, psw):
		has_lower = False
		has_upper = False
		has_digit = False
		for i in xrange(0, len(psw)):
			if not psw.isdigit() and psw[i] == psw[i].lower():
				has_lower = True
			if not psw.isdigit() and psw[i] == psw[i].upper():
				has_upper = True
			if psw[i].isdigit():
				has_digit = True
		if len(psw) >= 8 and has_lower and has_upper and has_digit:
			return True
		return False

	@classmethod
	def update_password(cls, params):
		""" Update the current users passsword"""
		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(params['user_id'])
			customer = Customer.query.get(user.customerid)
			valid_password = True
			if customer and customer.extended_security == True:
				valid_password = Preferences.is_valid_password(params.get("pssw_name"))
			if valid_password:
				user.password = params.get("pssw_name")
				user.last_change_pssw = datetime.today()
				user.force_change_pssw = False
				session.flush()
				transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception(ex)
			raise ex

	@staticmethod
	def _get_field(field, params):
		""" get a field """
		value = params.get(field, False)
		if value == "1":
			value = True
		return value

	_general_check_fields = ("autoselectfirstrecord", "usepartialmatch", "searchappend")

	@classmethod
	def update_general(cls, params):
		""" update the users general settings"""
		for field in Preferences._general_check_fields:
			params[field] = Preferences._get_field(field, params)

		transaction = BaseSql.sa_get_active_transaction()
		try:
			user = User.query.get(params['user_id'])
			user.display_name = params['displayname']
			user.email_address = params['email']
			user.autoselectfirstrecord = params["autoselectfirstrecord"]
			user.usepartialmatch = params["usepartialmatch"]
			user.searchappend = params["searchappend"]
			user.emailreplyaddress = params["emailreplyaddress"]
			user.stdview_sortorder = params["stdview_sortorder"]
			user.client_name = params["client_name"]
			user.issue_description = params["issue_description"]


			# customer level
			customer = Customer.query.get(params["customerid"])
			if customer.crm:
				customer.crm_subject = params["crm_subject"]
				customer.crm_outcome = params["crm_outcome"]
				customer.crm_engagement = params["crm_engagement"]

			session.flush()

			#need to add/delete the user_countries
			db_exists = {}
			for row in session.query(UserDefaultCountries).filter(UserDefaultCountries.userid == params["userid"]).all():
				db_exists[row.countryid] = row
			for row2 in params["user_countries"] if params["user_countries"] else []:
				if db_exists.has_key(row2):
					db_exists.pop(row2)
				else:
					session.add(UserDefaultCountries(userid=params["userid"],
					                                 countryid=row2))
			for drow in db_exists.values():
				session.delete(drow)

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("update_general")
			raise

	@classmethod
	def update_cc(cls, params):
		""" update the users general settings"""
		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(params['user_id'])
			user.ccaddresses = params['ccaddresses']
			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("update_cc")
			raise


	@classmethod
	def update_itf(cls, params):
		""" update the current users interface settings"""

		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(params['user_id'])
			user.interface_font_size = params['interface_font_size']
			user.showmenubartext = True if params.get("showmenubartext", "0") == "1" else False
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception(ex)
			raise ex

	@classmethod
	def update_show_startup(cls, params):
		""" update the current users startup dialog oprtion"""

		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(params['user_id'])
			user.show_dialog_on_load = True if params['show_dialog_on_load'] == "on" else False
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception(ex)
			raise ex
