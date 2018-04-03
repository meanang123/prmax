# -*- coding: utf-8 -*-
"""Admin Site Controller"""
#-----------------------------------------------------------------------------
# Name:        admin.py
# Purpose:     Holds all the functions that a sure required to administrat
#              functions would include password add/delete uses in their
#              group, interaction with their part of the bill paying and
#              history systems
#
# Author:      Chris Hoy(over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:  (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, validators, error_handler, \
     exception_handler, controllers, identity, config
from ttl.tg.errorhandlers import pr_std_error_handler, pr_std_exception_handler, \
     pr_form_error_handler
from ttl.tg.controllers import SecureController, set_output_as
from ttl.tg.validators import PrGridSchema, std_state_factory, PrFormSchema, \
     BooleanValidator, FloatToIntValidator, RestSchema, IntNull
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn, \
     licence_exceeded_return
import ttl.tg.validators as tgvalidators
from prcommon.model.customer.customergeneral import Customer


import prcommon.Const as Constants

import logging
LOGGER = logging.getLogger("prmax")

class EmailServerSchema(PrFormSchema):
	"schema"
	icustomerid = validators.Int()
	customerid = validators.Int()
#	emailserverid = validators.Int()
	thirdparty = BooleanValidator()


class EmailServerController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmailServerSchema(), state_factory=std_state_factory)
	def update_emailserver(self, *argc, **params):
		""" update extended Settings """

		Customer.update_emailserver(params)
		params['icustomerid'] = params['customerid']

		return stdreturn(data=Customer.get_internal(params))


