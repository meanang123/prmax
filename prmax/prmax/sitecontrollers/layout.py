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

	# list of standard banners from embedded options
	__std_banner = {
	  Constants.CustomerType_AIMedia:"prmax.ai.banner",
	  Constants.CustomerType_NewsLive:"prmax.newslive.banner",
	  Constants.CustomerType_Updatum:"prmax.updatum.banner",
	  Constants.CustomerType_PRmax:"prmax.display.StdBanner",
	  Constants.CustomerType_Fens:"prmax.fens.banner",
	  Constants.CustomerType_KantarMedia:"prmax.kantar.banner",
	  Constants.CustomerType_Phoenixpb:"prmax.phoenixpd.banner",
	  Constants.CustomerType_BlueBoo:"prmax.blueboo.banner",
	  Constants.CustomerType_IPCB:"prmax.ipcb.banner",
	  Constants.CustomerType_SolididMedia:"prmax.solidmedia.banner",
	  Constants.CustomerType_MyNewsdesk:"prmax.mynewsdesk.banner",
	  Constants.CustomerType_DePerslijst:"prmax.deperslijst.banner",
	  Constants.CustomerType_Professional:"prmax.professional.banner",
	  Constants.CustomerType_LevelCert:"prmax.levelcert.banner",
	  Constants.CustomerType_StereoTribes: "prmax.stereotribes.banner",
	  Constants.CustomerType_PressData: "prmax.pressdata.banner",
	}
	__std_start_view = {
	  Constants.CustomerType_SolididMedia:"prmax.solidmedia.stdview",
	  Constants.CustomerType_MyNewsdesk:"prmax.mynewsdesk.stdview",
	  Constants.CustomerType_DePerslijst:"prmax.deperslijst.stdview",
	  Constants.CustomerType_Professional:"prmax.professional.stdview",
	  Constants.CustomerType_LevelCert:"prmax.levelcert.stdview",
	  Constants.CustomerType_StereoTribes: "prmax.stereotribes.stdview",
	  Constants.CustomerType_PressData: "prmax.pressdata.stdview",
	}

	#######################################################
	## non-standard controllers have specific templates requirments
	#######################################################
	@expose(template="genshi:prmax.templates.layout/std_banner")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def std_banner(self, *args, **params):
		""" returns the standard banner page
		no cache it's user specific """

		data = addConfigDetails(DictExt(params))
		data["dojoComponent"] = LayoutController.__std_banner.get(data['prmax']['customer'].customertypeid, "prmax.display.StdBanner")

		return data

	@expose(template="genshi:prmax.templates.layout/std_view_outlet")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def std_view_outlet(self, *args, **params):
		""" returns the standard view for an outlet with or withoutprivate data
		based upon the type of customer """

		data = addConfigDetails(DictExt(params))
		data["private_data"] = "true" \
		    if  data['prmax']['customer'].customertypeid in Constants.Customer_Has_Private_Data else "false"

		return data

	@expose("text/html")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def front_panel_1(self, *args, **params):
		""" display text for the front page should be collected from a db table
		standard
		customer specific
		"""

		return PrmaxCustomerInfo.get(params["customerid"])

	@expose("prmax.templates.layout/std_view")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def std_view(self, *args, **params):
		""" returns the standard view needs to check if customer is a demo """

		data = addConfigDetails(DictExt(params))

		if "result_view" not in params and params["result_view"]:
			params["result_view"] = "outlet_view"

		data["advancefeatureslistid"] = -1 if "advancefeatureslistid" not in params else params["advancefeatureslistid"]
		data["dojoComponent"] = LayoutController.__std_start_view.get(data['prmax']['customer'].customertypeid, "prmax.display.StdView")

		return data

	@expose(template="genshi:prmax.templates.search/std_search_outlet")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_search_outlet(self, *args, **params):
		""" return outlet form based on version """

		params["prefix"] = params.get("prefix", "")

		return addConfigDetails(DictExt(params))

	@expose(template="prmax.templates.search/std_search_freelance")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_search_freelance(self, *args, **params):
		""" return outlet form based on version """

		params["prefix"] = params.get("prefix", "")

		return addConfigDetails(DictExt(params))

	@expose(template="genshi:prmax.templates.layout/std_distribute_panel_view")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_distribute_panel_view(self, *args, **params):
		""" return outlet form based on version """

		return addConfigDetails(DictExt(params))

	@expose(template="genshi:prmax.templates.layout/std_search")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=SearchLayoutSchema(), state_factory=std_state_factory)
	def std_search(self, *args, **params):
		""" return outlet form based on version """

		options = addConfigDetails(DictExt(params))
		customer = Customer.query.get(params["customerid"])
		options["advancefeatures"] = customer.isAdvanceActive()

		if options.prmax.user.usepartialmatch:
			partial = dict(checked=True)
		else:
			partial = {}
		options.prmax.user.partial = partial
		if params.get("mode", "") == "features":
			options.features = dict(selected="selected")
			options.outlet = dict()
		else:
			options.outlet = dict(selected="selected")
			options.features = dict()

		return options

	@expose("prmax.templates.layout/std_view_lists")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def std_view_lists(self, *args, **params):
		""" returns the standard view needs to check if customer is a demo """

		if params.get("selectedview", "") == "distributions":
			params["startup_standing"] = ""
			params["startup_distributions"] = "selected"
			params["startup_mode"] = params.get("startup_mode", "All")
		else:
			params["startup_standing"] = "selected"
			params["startup_distributions"] = ""
			params["startup_mode"] = "All"

		data = addConfigDetails(DictExt(params))
		if  data['prmax']['customer'].customertypeid == Constants.CustomerType_AIMedia:
			data["dojoComponent"] = "prmax.ai.listsview"
		else:
			data["dojoComponent"] = "prmax.lists.view"

		return data

	#######################################################
	## standard pages send back a common page that can be cached
	## restricted to the the _exposed_templates list
	#######################################################
	# dict contains name of template and location sub-folder
	_exposed_templates = {
		# general templates
		"std_user_admin_view":"layout", # customer user admin  view
		"std_collateral_view":"layout", # collateral maintanence view
	  "std_exclusions_view":"layout", #
		"std_start_view":"layout",  #
		"std_outlet_view_startup":"layout", # default view when you load the dipslay details pane
		"std_projects_view": "layout", # default view for project maintanence
		"std_output_view": "layout", # outlet view
	  "std_distribution_view":"layout", # distribution view
	  "std_advance_view":"layout", # advance view panel
	  "customer_financial":"layout", # customer invoice view
	  "prrequest": "layout",  #pprrequests
	  "clients":"layout", # client view
	  "issues":"layout",  # issues view
	  "statements":"layout",  # issues view
	  "crm_view":"layout", # crm viewer
	  "monitoring": "layout", # layout view
	  "tasks": "layout", # task view
	  "documents_view": "layout",
	  "clippings_view": "layout",  #clippins main view
	  "questions_view": "layout",
	  "distributiontemplate": "layout",
	  "global_analysis_questions": "layout",

	  # embedded version
	  "ai_start_view":"layout", # ai
	  "newslive_start_view":"layout", # aebquity
	  "updatum_start_view":"layout", # updatum
	  "fens_start_view":"layout", # fens
	  "kantar_start_view":"layout", # kantar
	  "phoenixpd_start_view":"layout", # phoenixpd
	  "blueboo_start_view": "layout", # blue boo
	  "ipcb_start_view": "layout",  #ipcb
	  "solidmedia_start_view": "layout",  #solidmedia
	  "mynewsdesk_start_view":"layout",  #mynewsdesk
	  "deperslijst_start_view":"layout",  #deperslijst
	  "professional_start_view":"layout",  #professional
	  "levelcert_start_view":"layout",  #levelcert
	  "stereotribes_start_view": "layout",
	  "pressdata_start_view": "layout",


		# search templates
		"std_search_quick":"search", # quick search form
		"std_search_employee":"search", # employee search form
		"std_search_mps":"search", # mps search form
		"std_search_advance":"search", # advance features
		"std_search_crm":"search", # crm
		# help system
		"help_system": "layout",  # help system template
	}

	@expose("")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def default(self, *args, **params):
		""" Standard way of accessing a template this assumes that the
		template will not change so we can cache it
		default these are single we
		"""
		# check to see if we have arguments
		if len(args) > 0 and args[0].lower() in self._exposed_templates:
			template = args[0].lower()
			folder = self._exposed_templates[template]
			return self._cache(template,
							   "prmax.templates.%s/%s" % (folder, template),
							   addConfigDetails(DictExt(params)))

		logError("layout.default", args, params, None, "Unknown layout", )
		return "Not Found"




