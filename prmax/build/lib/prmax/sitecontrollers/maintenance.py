# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        maintenance.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from prmax.utilities.common import addConfigDetails
from prmax.model import PrmaxCommon
from ttl.tg.validators import std_state_factory, PrFormSchema

##################################################################
## validators
##################################################################

class PRUpdateFieldSchema(PrFormSchema):
	""" validate table form"""
	tableid = validators.Int()

###########################################################
## Controller
###########################################################

class MaintenanceController(SecureController):
	""" Maintanence controller"""

	@expose("")
	def global_data_store(self, *args, **kw):
		""" global data store template"""
		return self._cache("global_data_store",
						   "prmax.templates.maintenance/global_data_store",
						   addConfigDetails(kw))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRUpdateFieldSchema(), state_factory=std_state_factory)
	def updatefield(self, *args, **kw):
		""" update a specific field """
		return PrmaxCommon.updateField(kw)
