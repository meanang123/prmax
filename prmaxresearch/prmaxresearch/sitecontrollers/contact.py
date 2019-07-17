# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        contact.py
# Purpose:
#
# Author:      Chris Hoy(over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:  (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, validators, exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import Contact
from ttl.base import stdreturn

class PrContactFormSchema(PrFormSchema):
	""" Schema"""
	contactid = validators.Int()

class ContactController(SecureController):
	"""
	Contact specific exposed methods
	"""
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def lookuplist(self, *argv, **params):
		""" return a list of contact that are valid for the currrent user/customer"""
		return Contact.getLookUpList(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_lookuplist(self, *argv, **params):
		""" return a list of contact that are valid for the currrent user/customer"""
		return Contact.getLookUpListResearch(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def research_lookuplist_rest(self, *argv, **params):
		""" return a list of contact that are valid for the currrent user/customer"""

		if len(argv) > 0:
			params["id"] = int(argv[0])

		return Contact.get_look_up_list_research(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def research_contactlist(self, *argv, **params):
		""" return a list of contact that are valid for the currrent user/customer"""
		if "filter" in params:
			params["filter"] += "%"
		else:
			params["filter"] = "%"

		return Contact.get_research_page(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_contact_employee(self, *argv, **params):
		""" return a list of contact that are valid for the currrent user/customer"""

		return Contact.get_rest_page_research_employed(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def addnew(self, *argv, **params):
		""" a a new contact to the database """
		return dict(success="OK", contact=Contact.add(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	def get(self, *argv, **params):
		""" get a specific contact details"""

		return stdreturn(contact=Contact.getContactExt(params['contactid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def exists(self, *argv, **params):
		""" a a new contact to the database """
		return dict(success="OK", contact=Contact.add(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_addnew(self, *argv, **params):
		""" a a new contact to the database """

		params['customerid'] = -1
		return stdreturn(contact=Contact.research_add(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_exist(self, *argv, **params):
		""" check if a contact exists """

		params['customerid'] = -1
		return stdreturn(exist=Contact.exists(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update(self, *argv, **params):
		""" update a contact id"""

		params['customerid'] = -1
		Contact.research_update(params)

		return stdreturn(contact=Contact.getContactExt(params['contactid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_person_delete(self, *argv, **params):
		""" update a contact id"""

		params['customerid'] = -1
		contact = Contact.getContactExt(params['contactid'])
		Contact.research_delete(params)

		return stdreturn(contact=contact)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_merge(self, *argv, **params):
		""" merge contacts"""

		params['customerid'] = -1
		Contact.research_merge_contacts(params)

		return stdreturn(contact=Contact.getContactExt(int(params['contactid'])))
