# -*- coding: utf-8 -*-
"""prospect regions """
#-----------------------------------------------------------------------------
# Name:        regions.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     20/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import ProspectRegion
from ttl.base import stdreturn, duplicatereturn

class RegionsController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of regions """

		if args:
			params["prospectregionid"] =  int( args[0])

		return ProspectRegion.list_of_regions( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def add_regions(self, *argv, **params):
		""" Add Prospect Region """

		if ProspectRegion.exists( -1,  params["prospectregionname"]):
			return duplicatereturn()

		return stdreturn ( data = ProspectRegion.get ( ProspectRegion.add ( params ) ))
