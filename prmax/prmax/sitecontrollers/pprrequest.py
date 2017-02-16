# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        private.py
# Purpose:     hold exposed method to handle access to  the list and project
#				maintanece and collect functions
#
# Author:      Chris Hoy (over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from prcommon.model import PRRequestGeneral
import prmax.Constants as Constants
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema,  RestSchema
from prmax.utilities.validators import PrEmployeeIdFormSchema



#########################################################
## controlllers
#########################################################

class PRRequestController(SecureController):
	""" tg controller hold all the methods to access list and projects"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" returns a list of list this is for a grid """
		return PRRequestGeneral.get_grid(params)

