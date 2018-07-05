# -*- coding: utf-8 -*-
""" Add """
#-----------------------------------------------------------------------------
# Name:        add.py
# Purpose:
# Author:      Stamatia Vatsi
#
# Created:     27/06/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
import slimmer
from turbogears import expose, validate, validators, error_handler, exception_handler, view
from ttl.tg.controllers import EmbeddedBaseController
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, IntNull, JSONValidator, BooleanValidator, \
     ISODateValidator, ISODateTimeValidator, DateRangeValidator, Int2Null
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from prcommon.lib.common import add_config_details
from prcommon.model.crm import ContactHistory
from ttl.base import stdreturn, duplicatereturn, formreturn, errorreturn

class EnquiryAddSchema(PrFormSchema):
	clientid = validators.Int()
	taken = ISODateTimeValidator()

class AddController(EmbeddedBaseController):
	""" Add controller """

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" return the add enquiry page"""

		data = add_config_details(params)
		html = view.render(data, 'prmaxtouch.templates.enquiries.add')

		return slimmer.xhtml_slimmer(html)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EnquiryAddSchema(), state_factory=std_state_factory)
	def submit(self, *args, **params):
		"""Add enquiry details"""

		contacthistoryid = ContactHistory.add_note(params)

		return stdreturn(contacthistoryid = contacthistoryid)
