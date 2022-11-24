# -*- coding: utf-8 -*-
""" Solid Media controller """
#-----------------------------------------------------------------------------
# Name:        sm.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     16/06/2014
# Copyright:   (c) 2014

#-----------------------------------------------------------------------------
from turbogears import expose, validate
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, BooleanValidator
from prcommon.model import SolidSearch, CustomerSolidMedia


class SMPreviewSchema(PrFormSchema):
	"schema"
	exact = BooleanValidator()

class SolidMediaController(SecureController):
	""" Solid Media Interface """

	@expose(template="mako:prmax.templates.sm.preview_page")
	@validate(validators=SMPreviewSchema(), state_factory=std_state_factory)
	def preview_page(self, *args, **params):
		"""History View """

		csm = CustomerSolidMedia.query.get(params["customerid"])

		sm = SolidSearch(csm.auth_token)
		sm.set_search_defaults()
		sm.set_page_size(10)
		sm.add_query(params["keywords"],
		             "Exact" if params["exact"] else ""
		             )
		sm.run_search()

		return dict(results=sm.results)


