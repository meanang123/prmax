# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        layout.py
# Purpose:     Holds the standard layout pages for the system
#
# Author:       Chris Hoy
#
# Created:     23/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, exception_handler, validate
from prmax.utilities.common import addConfigDetails
from prmax.utilities.prlogger import logError
from prmax.utilities.validators import PrFormSchema
from ttl.dict import DictExt
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, SimpleFormValidator, \
     PrFormSchema

from ttl.tg.errorhandlers import  pr_std_exception_handler_text
from prmax.model import PrmaxCustomerInfo, Customer
import prmax.Constants as Constants

@SimpleFormValidator
def Source_post(value_dict, state, validator):
	"""creats all the parameters needed be passed to the list user selection
method"""
	value_dict['searchtypeid'] = value_dict.get('searchtypeid', Constants.Search_Standard_Type)

class SearchLayoutSchema(PrFormSchema):
	""" scehma """
	chained_validators = (Source_post,)

#########################################################
## Controller
#########################################################
class LayoutController(SecureController):
	""" controller to expose general template function"""

	@expose(template="mako:prcommon.templates.search/std_search_outlet")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_search_outlet(self, *args, **kw):
		""" return outlet form based on version """

		kw["prefix"] = kw.get("prefix","")

		return addConfigDetails(DictExt(kw))

	@expose(template="prcommon.templates.search/std_search_freelance")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_search_freelance(self, *args, **kw):
		""" return outlet form based on version """

		kw["prefix"] = kw.get("prefix","")

		return addConfigDetails(DictExt(kw))

	@expose(template="genshi:prmax.templates.layout/std_search")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_search(self, *args, **kw):
		""" return outlet form based on version """

		options = addConfigDetails(DictExt(kw))
		customer = Customer.query.get(kw["customerid"])
		options["advancefeatures"] = customer.isAdvanceActive()

		if options.prmax.user.usepartialmatch :
			partial = dict( checked = True )
		else:
			partial = {}
		options.prmax.user.partial  = partial
		if kw.get("mode","") == "features":
			options.features = dict(selected = "selected" )
			options.outlet = dict()
		else:
			options.outlet = dict(selected = "selected" )
			options.features = dict()

		return options

	#######################################################
	## standard pages send back a common page that can be cached
	## restricted to the the _exposed_templates list
	#######################################################
	# dict contains name of template and location sub-folder
	_exposed_templates = {
		# general templates
		"std_user_admin_view" : "layout", # customer user admin  view
		"std_collateral_view" : "layout", # collateral maintanence view
	  "std_exclusions_view" : "layout", #
		"std_start_view" : "layout",  #
		"std_outlet_view_startup" : "layout", # default view when you load the dipslay details pane
		"std_projects_view": "layout" , # default view for project maintanence
		"std_output_view": "layout" , # outlet view
	  "std_distribution_view":"layout", # distribution view
	  "std_advance_view":"layout", # advance view panel
	  "customer_financial":"layout", # customer invoice view
	  "clients" : "layout", # client view
	  "issues": "layout",  # issues view

		# search templates
		"std_search_quick" : "search", # quick search form
		"std_search_employee" : "search", # employee search form
		"std_search_mps" : "search", # mps search form
		"std_search_advance" : "search", # advance features
		"std_search_crm" : "search", # crm
		# help system
		"help_system": "layout" ,  # help system template
	}

	@expose("")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def default(self, *args, **kw):
		""" Standard way of accessing a template this assumes that the
		template will not change so we can cache it
		default these are single we
		"""
		# check to see if we have arguments
		if len(args)>0 and args[0].lower() in self._exposed_templates:
			template = args[0].lower()
			folder = self._exposed_templates[template]
			return self._cache(template,
							   "prcommon.templates.%s.%s" % (folder, template),
							   addConfigDetails(DictExt(kw)))

		logError("layout.default", args, kw, None, "Unknown layout", )
		return "Not Found"




