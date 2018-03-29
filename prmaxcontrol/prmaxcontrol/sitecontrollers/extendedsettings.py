# -*- coding: utf-8 -*-
"""Extended Settings Controller"""
#-----------------------------------------------------------------------------
# Name:        extendedsettings.py
# Purpose:
# Author:
#
# Created:     March 2018
# RCS-ID:      $Id:  $
# Copyright:  (c) 2018

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


class ExtendedSettingsSchema(PrFormSchema):
	"schema"
	icustomerid = validators.Int()
	search_show_job_roles = BooleanValidator()
	search_show_coverage = BooleanValidator()
	search_show_profile = BooleanValidator()
	search_show_smart = BooleanValidator()
	view_outlet_results_colours = BooleanValidator()
	no_distribution = BooleanValidator()
	no_export = BooleanValidator()
	distributionistemplated = BooleanValidator()
	has_clickthrought = BooleanValidator()
	extended_security = BooleanValidator()
	required_client = BooleanValidator()


class ExtendedSettingsController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ExtendedSettingsSchema(), state_factory=std_state_factory)
	def update_extendedsettings(self, *argc, **params):
		""" update extended Settings """

		Customer.update_extendedsettings(params)

		return stdreturn(data=Customer.get_internal(params))