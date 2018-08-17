# -*- coding: utf-8 -*-
""" Edit """
#-----------------------------------------------------------------------------
# Name:        edit.py
# Purpose:
# Author:      Stamatia Vatsi
#
# Created:     16/07/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
from turbogears import expose, validate, exception_handler, error_handler, view, redirect
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler, pr_std_exception_handler_text
from turbogears.database import session
from cherrypy import request
from sqlalchemy import and_
from ttl.tg.validators import std_state_factory, PrFormSchema, PRmaxFormSchema
from ttl.tg.controllers import EmbeddedBaseController
from ttl.model import PPRApplication
from datetime import datetime
from prcommon.model import Employee, Contact, ContactHistory, Communication, Address, Client, User
from prcommon.lib.common import add_config_details
import slimmer
import json
import urllib

class EnquiryUpdateSchema(PrFormSchema):
	"""Update customer details"""
	pass

class EditContactController(EmbeddedBaseController):
	""" Edit controller """

	@expose('text/html;charset=utf-8')
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def edit(self, *args, **params):
		""" return the edit page"""
		if args:
			contactid = int(args[0])
		
			contact = Contact.query.get(contactid)

			redirect("/contact/details/view/%s" % contactid)
			
		params["icontactid"] = contactid

		data = add_config_details(params, contactid)

		return slimmer.xhtml_slimmer(view.render(data, 'prmaxtouch.templates.contacts.edit.edit'))
	
'''
@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PPRCustomerUpdateSchema(), state_factory=ppr_std_state_factory)
	def update(self, *args, **params):
		"""Update customer details"""

		for rid in range(1, 6):
			if "roundid%s" % rid in params:
				params["roundid%s" % rid] = (int(params["roundid%s" % rid]), None, None)
			else:
				params["roundid%s" % rid] = None
		if "billingroundid" in params:
			params["billingroundid"] = (int(params["billingroundid"]), None, None)
		else:
			params["billingroundid"] = None
		CustomerGeneral.save_combined(params)

		return stdreturn(customerid=params["icustomerid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PPRCustomerDeleteSchema(), state_factory=ppr_std_state_factory)
	def delete(self, *args, **params):
		"""Delete customer"""

		CustomerGeneral.customer_delete(params)

		return stdreturn(customerid=params["icustomerid"])
'''