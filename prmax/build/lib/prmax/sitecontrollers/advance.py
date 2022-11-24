# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        advance.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     09/10/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator, JSONValidatorListInt, PrGridSchema

from prcommon.sitecontrollers import AdvanceCommonController

#########################################################
## geographical Controller
#########################################################
class AdvanceController( AdvanceCommonController):
	""" Features contoller"""
	pass
