# -*- coding: utf-8 -*-
""" Prospect """
#-----------------------------------------------------------------------------
# Name:        prospect.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     25/07/2012
# Copyright:   (c) 2012
#
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler, \
     pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, PrGridSchema, TgInt
from prcommon.model import Prospect, UnSubscribe, ProspectArchive, User
import prmax.Constants as Constants
from ttl.base import stdreturn, duplicatereturn, errorreturn, samereturn

class PRAddProspect(PrFormSchema):
	""" schema"""
	email = validators.String()
	prospectsourceid = validators.Int()
	prospecttypeid = validators.Int()

class PRDeleteProspect(PrFormSchema):
	""" schema"""
	prospectid = validators.Int()
	deleteoption = validators.Int()
	unsubscribereasonid = validators.Int()

class PRProspectSchema(PrFormSchema):
	""" schema"""
	prospectid = validators.Int()

class PRProspectUpdateSchema(PrFormSchema):
	""" schema"""
	prospectid = validators.Int()
	prospectsourceid = validators.Int()
	prospecttypeid = validators.Int()

class ProspectController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of prospects """

		return Prospect.list_of_prospects( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRAddProspect(), state_factory = std_state_factory)
	def add_prospect(self, *argv, **params):
		""" Add a prospect """

		if Prospect.exists( -1,  params["email"]):
			return duplicatereturn()

		if User.exists( params["email"]):
			return errorreturn("Email exist in Admin System")

		if UnSubscribe.exists( params["email"]):
			return errorreturn("Email in Unsubscribe list")

		if ProspectArchive.exists( -1,  params["email"]):
			return errorreturn("Email in Archive")

		prospectid = Prospect.add ( params )
		return stdreturn ( data = Prospect.get_row ( prospectid ) )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRAddProspect(), state_factory = std_state_factory)
	def check_prospect_domain(self, *argv, **params):
		"""check too see if exosts """

		prospectid = int(params["prospectid"]) if "prospectid" in params and params["prospectid"] else -1

		if Prospect.exists( prospectid ,  params["email"]):
			return duplicatereturn()

		if User.exists( params["email"]):
			return errorreturn("Email exist in Admin System")

		if UnSubscribe.exists( params["email"]):
			return errorreturn("Email in Unsubscribe list")

		if ProspectArchive.exists( -1,  params["email"]):
			return errorreturn("Email in Archive")

		if User.domain_exists( params["email"]):
			return samereturn()

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRDeleteProspect(), state_factory = std_state_factory)
	def delete_prospect(self, *argv, **params):
		""" Add a prospect """

		data = Prospect.get_row ( params["prospectid"] )

		if params["deleteoption"] == 0:
			Prospect.archive ( params )
		elif params["deleteoption"] == 1:
			Prospect.delete ( params )

		return stdreturn ( data = data )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRProspectSchema(), state_factory = std_state_factory)
	def get(self, *argv, **params):
		""" Get a prospect """

		return stdreturn ( data = Prospect.get ( params["prospectid"] ) )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRProspectUpdateSchema(), state_factory = std_state_factory)
	def update_prospect(self, *argv, **params):
		""" Add a prospect """

		if Prospect.exists( params["prospectid"],  params["email"]):
			return duplicatereturn()

		if User.exists( params["email"]):
			return errorreturn("Email exist in Admin System")

		if UnSubscribe.exists( params["email"]):
			return errorreturn("Email in Unsubscribe list")

		if ProspectArchive.exists( params["prospectid"],  params["email"]):
			return errorreturn("Email in Archive")

		Prospect.update ( params )

		return stdreturn ( data = Prospect.get_row ( params["prospectid"] ) )


