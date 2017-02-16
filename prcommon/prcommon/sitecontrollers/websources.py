# -*- coding: utf-8 -*-
"""BrowerSources """
#-----------------------------------------------------------------------------
# Name:        websources.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     March/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, \
     PrGridSchema, ExtendedDateValidator, OpenRestSchema
import ttl.tg.validators as tgvalidators
from prcommon.model import WebSources
from ttl.base import stdreturn, duplicatereturn, samereturn

class WebSourcesAddSchema(PrFormSchema):
	""" schema """
	pass

class WebSourcesGetSchema(PrFormSchema):
	""" schema """
	websourceid = validators.Int()


class WebSourcesController( object ):
	""" WebSources Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of websources  """

		if len(args) > 0:
			params["websourceid"] = int(args[0])

		return  WebSources.get_list_websources ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebSourcesAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if WebSources.exists ( params["websourcedescription"]):
			return duplicatereturn()

		websourceid = WebSources.add( params)

		return stdreturn( data = WebSources.get( websourceid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebSourcesGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if WebSources.exists ( params["websourcedescription"],  params["websourceid"]):
			return duplicatereturn()

		WebSources.update( params)

		return stdreturn( data = WebSources.get( params["websourceid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WebSourcesGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get websources  """

		return stdreturn( data = WebSources.get( params["websourceid"]))
