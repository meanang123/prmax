# -*- coding: utf-8 -*-
"""Unsubscribe Logic"""
#-----------------------------------------------------------------------------
# Name:         unsubscribe.py
# Purpose:      Handle client customers who wish to unsubscribe
# Author:       Chris Hoy
#
# Created:      22/10/2014
# Copyright:   (c) 2014

#-----------------------------------------------------------------------------

from turbogears import expose, exception_handler, error_handler, controllers, view
from prmax.utilities.validators import PrFormSchema, validators
from prcommon.model import UnsubscribeGeneral
from ttl.tg.errorhandlers import  pr_std_exception_handler_text

class ListMemberDistributionSchema(PrFormSchema):
	"schema"
	listmemberdistributionid = validators.Int()

class UnsubscribeController(controllers.RootController):
	""" Unsubscribe from list
	"""

	@expose("text/html")
	def default(self, *args, **params):
		""" Default page handler for a missing page
		captures and log it"""

		# check valid link listmemberdistributionid
		# not valid return someting
		# return unsubscribe to confirm with email address
		# confirm email address

		listmemberdistribution = UnsubscribeGeneral.get_unsubscribe(args)
		if "lm" in listmemberdistribution:
			template = "mako:prmax.templates.unsubscribe.unsubscribe"
		else:
			template = "mako:prmax.templates.unsubscribe.missing_unsubscribe"

		return view.render(listmemberdistribution, template=template )

	@expose(template="mako:prmax.templates.unsubscribe.unsubscribe_completed")
	@exception_handler(pr_std_exception_handler_text)
	@error_handler(error_handler)
	def confirm_unsubscribe (self, *args, **params):
		""" returns the grid details """

		UnsubscribeGeneral.do_unsubscribe(params)

		return {}

