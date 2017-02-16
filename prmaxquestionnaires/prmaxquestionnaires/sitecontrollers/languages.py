# -*- coding: utf-8 -*-
"OpenLangaugeController"
#-----------------------------------------------------------------------------
# Name:        languages
# Purpose:
#
# Author:      Chris Hoy
# Created:    25/01/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from  ttl.tg.errorhandlers import pr_form_error_handler
from ttl.tg.validators import PRmaxOpenFormSchema
from prcommon.model import Languages
from ttl.base import stdreturn


class OpenLangaugeController(OpenSecureController):
	""" internal security user must be part of admin group """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxOpenFormSchema())
	def listuserselection(self, *args, **params):
		""" list of seleced languages"""

		return stdreturn( data = Languages.get_user_selection( params ))