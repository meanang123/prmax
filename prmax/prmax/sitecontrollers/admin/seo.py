# -*- coding: utf-8 -*-
"""SOE admin"""
#-----------------------------------------------------------------------------
# Name:        seo.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     11/01/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, PrGridSchema, TgInt
from prcommon.model import SEOSite , SEORelease

import prmax.Constants as Constants

from ttl.base import stdreturn

class SEOReleaseSchema(PrFormSchema):
	""" shema """
	seoreleaseid = validators.Int()
class SeoPage(RestSchema):
	""" schema"""
	icustomerid = TgInt()

class SeoAdminController(SecureController):
	""" handles all soe stuff for admin """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SeoPage(), state_factory=std_state_factory)
	def seo_list_shop(self, *args, **params ):
		""" list all the roles int the system"""

		if args:
			params["seoreleaseid"] = args[0]

		return SEORelease.get_rest_page_shop( params )

	@expose("")
	def generate_test_data(self, *args, **params):
		""" generate test"""

		SEOSite.generate_test_data( int(params["limit"]) )

		return "Completed"

	@expose("")
	def generate_test_from_live(self, *args, **params):
		""" generate test"""

		SEOSite.generate_test_from_live( int(params["limit"]) )

		return "Completed"


	@expose("")
	def generate_soe_from_customer_live(self, customerid, *args, **params):
		""" add efault release for a shop """

		SEOSite.generate_soe_from_customer_live( int( customerid ) )

		return "Completed"


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def seo_list(self, *args, **params):
		""" list of seo release """

		return SEORelease.get_grid_page ( params, True )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOReleaseSchema(), state_factory=std_state_factory)
	def seo_withdraw(self, *args, **params):
		""" withdraw a press release by us"""

		SEORelease.withdraw ( params, Constants.SEO_PRmax_Withdrawn)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOReleaseSchema(), state_factory=std_state_factory)
	def seo_delete(self, *args, **params ):
		""" delete a seo release"""

		SEORelease.delete( params )
		return stdreturn()

