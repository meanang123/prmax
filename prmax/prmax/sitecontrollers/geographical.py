# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        geographical.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     28/01/09
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator, JSONValidatorListInt, PrGridSchema

from prcommon.sitecontrollers import GeographicalBaseController

#########################################################
## geographical Controller
#########################################################
class GeographicalController( GeographicalBaseController):
	""" Geographical contoller"""
	pass
