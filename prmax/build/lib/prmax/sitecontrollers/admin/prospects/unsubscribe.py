# -*- coding: utf-8 -*-
"""SOE admin"""
#-----------------------------------------------------------------------------
# Name:        unsubscribe.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     03/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model import UnSubscribe
from ttl.base import stdreturn, duplicatereturn

class PPRUnsubscribeDelete(PrFormSchema):
	"""Schema """
	unsubscribeid = validators.Int()

class UnSubscribeController(SecureController):
	""" UnSubscribe """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list of prospects """

		if args:
			params["unsubscribeid"] = int( args[0])

		return UnSubscribe.list_of_unsubscribe( params )

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PPRUnsubscribeDelete(), state_factory = std_state_factory)
	def delete_unsubscribe(self, *argv, **params):
		""" Delete Company """

		data = UnSubscribe.get ( params["unsubscribeid"] )

		UnSubscribe.delete( params["unsubscribeid"] )

		return stdreturn ( data = data )
