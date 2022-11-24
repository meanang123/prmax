# -*- coding: utf-8 -*-
"GeographicalController"
#-----------------------------------------------------------------------------
# Name:        geographical
# Purpose:
#
# Author:      Chris Hoy
# Created:
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, RestSchema
from prcommon.model import Geographical, OutletCoverageView

class GeographicalController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **kw ):
		""" list all the roles int the system"""

		return Geographical.get_rest_list(kw)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def coverage(self, *args, **kw ):
		""" list all the roles int the system"""

		return OutletCoverageView.get_rest_list(kw)
