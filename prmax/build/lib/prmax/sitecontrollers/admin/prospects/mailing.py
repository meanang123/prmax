# -*- coding: utf-8 -*-
"""Mailing"""
#-----------------------------------------------------------------------------
# Name:        mailing.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     14/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler, \
     pr_form_error_handler
from ttl.tg.controllers import SecureController, set_output_as
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import Mailing
from ttl.base import stdreturn, duplicatereturn

class PrFormMailingSchema(PrFormSchema):
	"schema"
	mailingid = validators.Int()

class MailingController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of mailings """

		return Mailing.list_of_mailings( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def add_mailing(self, *argv, **params):
		""" Add Mailing """

		if Mailing.exists( -1,  params["mailingname"]):
			return duplicatereturn()

		mailingid = Mailing.add ( params )

		return stdreturn ( data = Mailing.get ( mailingid ))

	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = PrFormMailingSchema(), state_factory=std_state_factory)
	def to_csv(self, *args, **params):
		""" view a specific csv report """

		reportoutput = Mailing.to_csv( params["mailingid"] )
		return set_output_as ( "csv" , reportoutput )
