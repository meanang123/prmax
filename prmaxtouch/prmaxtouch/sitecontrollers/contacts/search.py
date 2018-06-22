# -*- coding: utf-8 -*-
""" Search """
#-----------------------------------------------------------------------------
# Name:        search.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     28/06/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
import slimmer
from turbogears import expose, validate, exception_handler, view
from ttl.tg.controllers import EmbeddedBaseController
from ttl.tg.validators import std_state_factory, RestSchema
from ttl.tg.errorhandlers import pr_std_exception_handler
from prcommon.lib.common import add_config_details

class SearchContactController(EmbeddedBaseController):
	""" Search controller """

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def search(self, *args, **params):
		""" return the search criteria page"""

		data = add_config_details(params)
		html = view.render(data, 'prmaxtouch.templates.contacts.search')

		return slimmer.xhtml_slimmer(html)

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def results(self, *args, **params):
		""" return the search results page """

		data = add_config_details(params)
		html = view.render(data, 'prmaxtouch.templates.contacts.results')

		return slimmer.xhtml_slimmer(html)



