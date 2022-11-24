# -*- coding: utf-8 -*-
"""Partner function"""
#-----------------------------------------------------------------------------
# Name:        partners.py
# Purpose:			Allow the partner to submit a demo request
#
# Author:      Chris Hoy
#
# Created:     12/01/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators, view
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, PrGridSchema, TgInt
from prmax.model import DemoRequests, CustomerExternal
from prcommon.model import CustomerTypes
from prmax.utilities.common import addConfigDetails
import prmax.Constants as Constants

from ttl.base import stdreturn

class DemoRequestController(OpenSecureController):
	""" demo request """

	@expose("")
	def default(self, *args, **params):
		""" handles request """

		if args > 1:
			custtype = CustomerTypes.get_by_sortname ( args[0].lower())
			params2 =  dict(customertypeid = custtype.customertypeid,
			                customersourceid = custtype.customersourceid,
			                marketingroot = "/eadmin/partners/requests/%s" % custtype.shortname)

			if args[1] == "demo":
				return view.render(
				  addConfigDetails(params2),
				  template = "mako:prmax.templates.marketingpartner.requestdemo")

			if args[1] == "buy":
				params2['cost']  = CustomerExternal.cost(dict(termid = 4, nbrofloginsid = 1))[0]/100.0
				return view.render(
				  addConfigDetails(params2),
				  template = "mako:prmax.templates.marketingpartner.new_customer")

			if args[1] in ("info", "aboutus", "contactus", "pricing", "productinfo"):
				return view.render(
				  addConfigDetails(params2),
				  template = "mako:prmax.templates.marketingpartner." + args[1])

		return ""

	@expose(template="prmax.templates.eadmin/new_customer")
	def newaccountform(self, *args, **params):
		""" Display the new account form"""
		# default cost is 12 months and 1 user
		return addConfigDetails(params)

