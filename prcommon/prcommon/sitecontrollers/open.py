# -*- coding: utf-8 -*-
"lookups"
#-----------------------------------------------------------------------------
# Name:        open.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     06-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import expose, validate, error_handler, exception_handler
from prcommon.model import InterestGroups, MessageTypes, CustomerTypes, UserTypes, Frequencies, PRmaxOutletTypes, SortOrder, \
     AdvanceFeaturesStatus, FinancialStatus, PaymentReturnReason, Months, Years, DaysOfMonth, CustomerOrderStatus, \
     AdjustmentsTypes, TaskStatus, TaskTypeStatus, TaskType, User, PriceCode, PrmaxModules, CustomerSources, TaskTags, CountryTypes, CustomerProducts,\
     OrderConformationPaymentMethods, ResearchProjectStatus, SEOStatus, SeoPaymentTypes, NewsFeedTypes, ProspectSource, ProspectType, \
     UnSubscribeReason, ProspectRegion, GeographicalLookupTypes, ReasonCategories, ReasonCodes, Countries, OutletPrices, \
     ResearchFrequencies, PRMaxRoles, EmailSendTypes, Languages, Continents, ContactHistoryStatus,\
     ContactHistoryTypes, CirculationSources, WebSources, ClippingsReport, CustomerStatus, ClippingSource, ClippingsTypes, ServerTypes, \
     ClippingsTone, MediaAccessTypes, PaymentMethods, CustomerPaymentTypes, Statements, ChartView, DateRanges, GroupBy, DashboardSettingsMode, \
     DashboardSettingsStandard, DashboardSettingsStandardSearchBy, Prmax_Outlettypes
from prcommon.model.hostspf import Hostspf
from prcommon.model.emails import EmailFooter, EmailHeader, EmailLayout
from prcommon.model.customer.customeremailserver import CustomerEmailServer
from prcommon.model.lookups import Publishers, EmailServerTypes
from prcommon.model.newsroom.newsrooms import Newsrooms
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.validators import  SimpleFormValidator, Schema
from ttl.tg.controllers import OpenSecureController

@SimpleFormValidator
def lookup_schema_post(value_dict, state, validator):
	""" check and add types to form data"""
	value_dict['searchtype '] = value_dict.get("searchtype", "")

class GeneralLookupSchema(Schema):
	""" lookup info exposed method validator"""
	chained_validators = (lookup_schema_post,)
	allow_extra_fields = True

#########################################################
## controlllers
#########################################################

class OpenController(OpenSecureController):
	""" Open Controller allows access to stuff that would require a restruction
	not sure at the moment what this would be but it could be usefull for pre
	loading common cache elements such as list of types etc"""
	_lookupinfo = {"interestcategories": InterestGroups,
		            "interestgroups": InterestGroups,
	              "messagetypes": MessageTypes,
	              "customertypes" : CustomerTypes,
	              "usertypes": UserTypes,
		            "sortorder" : SortOrder,
		            "prmaxoutlettypes" : PRmaxOutletTypes,
		            "frequencies": Frequencies,
	              "advancefeaturestatus" : AdvanceFeaturesStatus,
	              "financialstatus" :FinancialStatus,
	              "paymentreturnreasons" : PaymentReturnReason,
		            "months": Months,
		            "years": Years,
	              "daysofmonth" : DaysOfMonth,
	              "customerorderstatus" : CustomerOrderStatus,
	              "adjustmenttypes": AdjustmentsTypes,
	              "taskstatus": TaskStatus,
	              "tasktypestatus": TaskTypeStatus,
	              "tasktype" : TaskType,
	              "tasktypes" : TaskType,
	              "users":  User,
	              "pricecodes": PriceCode,
	              "hostspf": Hostspf,
	              "clippingsource": ClippingSource,
	              "prmaxmodules": PrmaxModules,
	              "customersources": CustomerSources,
	              "customerproducts": CustomerProducts,
	              "tasktags": TaskTags,
	              "countrytypes" : CountryTypes,
	              "orderpaymentmethods" : OrderConformationPaymentMethods,
	              "researchprojectstatus" : ResearchProjectStatus,
	              "seostatus" : SEOStatus,
	              "seopaymenttypes" : SeoPaymentTypes,
	              "newsfeedtypes" :  NewsFeedTypes,
	              "prospectsource" : ProspectSource,
	              "prospecttype" : ProspectType,
	              "unsubscribereason" : UnSubscribeReason,
	              "prospectregions" :  ProspectRegion,
	              "outletprices" :  OutletPrices,
	              "emailsendtypes" :  EmailSendTypes,
		            "geographicallookuptypes": GeographicalLookupTypes,
		            "reasoncodes": ReasonCodes,
		            "reasoncategories": ReasonCategories,
		            "researchfrequencies": ResearchFrequencies,
		            'countries': Countries,
	              'jobroles': PRMaxRoles,
	              'languages' :  Languages,
	              "continents": Continents,
	              "contacthistorystatus": ContactHistoryStatus,
	              "prmaxcontacthistorytypes": ContactHistoryTypes,
	              "circulationsource": CirculationSources,
	              "websource": WebSources,
	              "clippingreports": ClippingsReport,
	              "customerstatus": CustomerStatus,
	              "clippingstypes": ClippingsTypes,
	              "clippingtones": ClippingsTone,
	              "mediaaccesstypes" :  MediaAccessTypes,
	              "paymentmethods" : PaymentMethods,
	              "paymenttypes": CustomerPaymentTypes,
	              "publishers" :  Publishers,
	              "servertypes": ServerTypes,
	              "customeremailserver": CustomerEmailServer,
	              "emailheader": EmailHeader,
	              "emailfooter": EmailFooter,
	              "emaillayout": EmailLayout,
	              "statements": Statements,
	              "newsrooms": Newsrooms,
	              "emailservertypes": EmailServerTypes,
	              "chartview":ChartView,
	              "dateranges": DateRanges,
	              "groupby": GroupBy,
	              "dashboardsettingsmode": DashboardSettingsMode,
	              "dashboardsettingsstandard": DashboardSettingsStandard,
	              "dashboardsettingsstandardsearchby": DashboardSettingsStandardSearchBy,
	              "privatechannels":Prmax_Outlettypes
		            }

	_AddFilter = ("taskstatus", "users", "tasktype", "tasktags", "countrytypes", "seostatus", "newsfeedtypes", "customertypes",
	              "reasoncategories", "countries", "researchprojectstatus", "languages", "contacthistorystatus",
	              "briefingnotesstatus", "customerstatus", "financialstatus", "clippingsource", "customersources")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeneralLookupSchema(), state_factory=None)
	def lookups(self, *args, **params):
		""" Standard lookup for combo boxs"""

		# these never chnage in a session we could add a forward cache at
		# this point if we wanted to

		if params['searchtype'] in OpenController._lookupinfo:
			data = OpenController._lookupinfo[params['searchtype']].getLookUp(params)
		else:
			data = []
		if params['searchtype'] == "frequencies" and "ignoreoption" in params:
			data.insert(0, dict(id=-1, name="All"))

		if params['searchtype'] in OpenController._AddFilter and "nofilter" in params:
			data.insert(0, dict(id=-1, name="No Selection"))

		return dict(identifier="id",
				    label='name',
				    items=data )
