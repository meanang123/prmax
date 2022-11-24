# -*- coding: utf-8 -*-
"""WebDates """
#-----------------------------------------------------------------------------
# Name:        webdates.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     March/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, OpenRestSchema
from prcommon.model import WebDates
from ttl.base import stdreturn, duplicatereturn

class WebDatesAddSchema(PrFormSchema):
	""" schema """
	pass

class WebDatesGetSchema(PrFormSchema):
	""" schema """
	webauditdateid = validators.Int()


class WebDatesController( object ):
	""" WebDates Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of webdates  """

		if len(args) > 0:
			params["webauditdateid"] = int(args[0])

		return  WebDates.get_list_webdates ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebDatesAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if WebDates.exists ( params["webauditdatedescription"]):
			return duplicatereturn()

		webauditdateid = WebDates.add( params)

		return stdreturn( data = WebDates.get( webauditdateid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebDatesGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if WebDates.exists ( params["webauditdatedescription"],  params["webauditdateid"]):
			return duplicatereturn()

		WebDates.update( params)

		return stdreturn( data = WebDates.get( params["webauditdateid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebDatesGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get webdates  """

		return stdreturn( data = WebDates.get( params["webauditdateid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebDatesGetSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" delete """

		WebDates.delete ( params["webauditdateid"] )

		return stdreturn()
