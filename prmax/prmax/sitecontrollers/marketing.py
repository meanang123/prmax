# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        marketing.py
# Purpose:    for the marketing site. This
#
# Author:      Chris Hoy
#
# Created:     07/09/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, view
from prmax.utilities.common import addConfigDetails
from ttl.tg.controllers import OpenSecureController
from ttl.dict import DictExt

#########################################################
## controlllers
#########################################################

class MarketingController( OpenSecureController ):
	""" marketing pages """

	@expose("")
	def index(self, *args, **kw):
		"missign links goto this page "

		return self._cache("main",
						   "prmax.templates.marketing/main" ,
						   addConfigDetails(DictExt(kw)))

	_exposed_templates = {"pricing":"pricing",
	                      "contactus":"contactus",
	                      "aboutus":"aboutus",
	                      "productinfo":"productinfo",
	                      "prplanner":"prplanner",
	                      "gadvpage":"prplanner"}

	@expose("")
	def default(self, *args, **kw):
		""" Standard way of accessing a template this assumes that the
		template will not change so we can cache it
		default these are single we
		"""
		template = "main"
		# check to see if we have arguments
		if len(args)>0 and args[0].lower() in self._exposed_templates:
			template = self._exposed_templates.get(args[0].lower(),"main")

		#return view.render( addConfigDetails(DictExt(kw)),
		#                   template = "prmax.templates.marketing/%s" % (template,))
		return self._cache(template,
		                   "prmax.templates.marketing/%s" % (template,) ,
		                   addConfigDetails(DictExt(kw)) )




