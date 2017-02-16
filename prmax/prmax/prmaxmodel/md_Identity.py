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
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, Integer, DateTime
from turbogears import identity
from prcommon.model import AuditTrail, Terms, NbrOfLogins, Address, \
     UserView, Customer, CustomerView, User, UserDefaultCountries, Countries

import logging
log = logging.getLogger("prmax.model")

#########################################################
class Preferences(object):
	""" user preferences """

	@classmethod
	def get(cls, user_id):
		""" get items"""
		return dict (user = UserView.query.get(user_id),
		             countries  = [ dict( countryid = country.countryid,
		                                  countryname  = country.countryname)
		              for user,country in session.query(UserDefaultCountries, Countries).
		              filter(UserDefaultCountries.countryid == Countries.countryid).
		              filter(UserDefaultCountries.userid == user_id).all()])

	@classmethod
	def update_projectname(cls, kw):
		""" update the customer project name settings"""
		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(kw['user_id'])
			user.projectname = kw.get("projectname")
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			log.exception(ex)
			raise ex

	@classmethod
	def update_password(cls, kw):
		""" Update the current users passsword"""
		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(kw['user_id'])
			user.password = kw.get("pssw_name")
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			log.exception(ex)
			raise ex

	@staticmethod
	def _get_field( f , kw ) :
		""" get a field """
		value = kw.get(f, False)
		if value == "1":
			value = True
		return value

	_general_check_fields = ("autoselectfirstrecord", "usepartialmatch",
	                         "searchappend" )

	@classmethod
	def update_general(cls, kw):
		""" update the users general settings"""
		for f in Preferences._general_check_fields:
			kw[f] = Preferences._get_field ( f, kw)

		transaction = session.begin(subtransactions=True)
		try:
			user = User.query.get(kw['user_id'])
			user.display_name = kw['displayname']
			user.email_address = kw['email']
			user.autoselectfirstrecord = kw["autoselectfirstrecord"]
			user.usepartialmatch = kw["usepartialmatch"]
			user.searchappend = kw["searchappend"]
			user.emailreplyaddress = kw["emailreplyaddress"]
			user.stdview_sortorder =  kw["stdview_sortorder"]
			user.client_name = kw["client_name"]
			user.issue_description =  kw["issue_description"]

			session.flush()

			#need to add/delete the user_countries
			dbExists = {}
			for row in session.query(UserDefaultCountries).filter(UserDefaultCountries.userid == kw["userid"]).all():
				dbExists[row.countryid] = row
			for r in kw["user_countries"] if kw["user_countries"] else [] :
				if dbExists.has_key(r):
					dbExists.pop ( r )
				else:
					session.add ( UserDefaultCountries ( userid = kw["userid"],
					                                     countryid = r ))
			for d in dbExists.values():
				session.delete ( d )

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			log.exception("update_general")
			raise

	@classmethod
	def update_itf(cls, kw):
		""" update the current users interface settings"""

		transaction = session.begin(subtransactions = True)
		try:
			user = User.query.get(kw['user_id'])
			user.interface_font_size = kw['interface_font_size']
			user.showmenubartext = True if kw.get("showmenubartext","0") == "1" else False
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			log.exception(ex)
			raise ex

	@classmethod
	def update_show_startup(cls, kw):
		""" update the current users startup dialog oprtion"""

		transaction = session.begin(subtransactions = True)
		try:
			user = User.query.get(kw['user_id'])
			user.show_dialog_on_load = True if kw['show_dialog_on_load'] == "on" else False
			session.flush()
			transaction.commit()
		except Exception, ex:
			try:
				transaction.rollback()
			except:
				pass
			log.exception(ex)
			raise ex
