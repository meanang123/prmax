# -*- coding: utf-8 -*-
"""prospect types """
#-----------------------------------------------------------------------------
# Name:        types.py
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
from prcommon.model import ProspectType
from ttl.base import stdreturn, duplicatereturn

class PPRSourceUpdate(PrFormSchema):
	"""Schema """
	prospecttypesid = validators.Int()

class TypesController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of types """

		if args:
			params["prospecttypeid"] =  int( args[0])


		return ProspectType.list_of_types( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory = std_state_factory)
	def add_type(self, *argv, **params):
		""" Add Prospect Source """

		if ProspectType.exists( -1,  params["prospecttypename"]):
			return duplicatereturn()

		return stdreturn ( data = ProspectType.get ( ProspectType.add ( params ) ))
