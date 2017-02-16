# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        employee.py
# Purpose:
#
# Author:      Chris Hoy (over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrGridSchema
from prmax.utilities.validators import PrFormSchema, validators
from prmax.model import Contact
from prmax.utilities.Security import check_access_rights

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
	def lookuplist(self, *argv, **kw):
		""" return a list of contact that are valid for the currrent user/customer"""
		return Contact.getLookUpList ( kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_lookuplist(self, *argv, **kw):
		""" return a list of contact that are valid for the currrent user/customer"""
		return Contact.getLookUpListResearch ( kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_contactlist(self, *argv, **kw):
		""" return a list of contact that are valid for the currrent user/customer"""
		return Contact.getGridPageResearch ( kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_contact_employee(self, *argv, **kw):
		""" return a list of contact that are valid for the currrent user/customer"""
		return Contact.getGridPageResearchEmployed ( kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def addnew(self, *argv, **kw):
		""" a a new contact to the database """
		return dict( success = "OK" , contact = Contact.add(kw) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	@check_access_rights("contact")
	def get(self, *argv, **kw):
		""" get a specific contact details"""
		return dict( success = "OK" , contact = Contact.getContactExt(kw['contactid'] ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def exists(self, *argv, **kw):
		""" a a new contact to the database """
		return dict( success = "OK" , contact = Contact.add(kw) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_addnew(self, *argv, **kw):
		""" a a new contact to the database """
		kw['customerid'] = -1
		return dict( success = "OK" , contact = Contact.research_add(kw) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update(self, *argv, **kw):
		""" update a contact id"""

		kw['customerid'] = -1
		Contact.research_update(kw)

		return dict( success = "OK" , contact = Contact.getContactExt(kw['contactid'] ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrContactFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_person_delete(self, *argv, **kw):
		""" update a contact id"""

		kw['customerid'] = -1
		contact = Contact.getContactExt( kw['contactid'] )
		Contact.research_delete (kw)

		return dict( success = "OK" , contact = contact )
