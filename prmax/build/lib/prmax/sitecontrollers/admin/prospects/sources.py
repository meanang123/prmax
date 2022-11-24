# -*- coding: utf-8 -*-
"""prospect sources"""
#-----------------------------------------------------------------------------
# Name:        sources.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     20/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import ProspectSource
from ttl.base import stdreturn, duplicatereturn

class PPRSourceUpdate(PrFormSchema):
	"""Schema """
	prospectsourceid = validators.Int()

class SourceController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of prospects """

		if args:
			params["prospectsourceid"] =  int( args[0])


		return ProspectSource.list_of_sources( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def add_source(self, *argv, **params):
		""" Add Prospect Source """

		if ProspectSource.exists( -1,  params["prospectsourcename"]):
			return duplicatereturn()

		return stdreturn ( data = ProspectSource.get ( ProspectSource.add ( params ) ))
