# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        customer.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.validators import std_state_factory, PrFormSchema, SimpleFormValidator
from prmax.model import OutletSearchType, Frequencies, \
	 CustomerStatus, GeographicalLookupView, OutletTypes, \
	 Labels, NbrOfLogins, Terms, PRmaxOutletTypes, SortOrder, \
     GeographicalLookupTypes, ReasonCodes, CustomerPaymentTypes, \
     ReasonCategories, ResearchFrequencies, Countries, ContactHistorySources, \
     PaymentMethods
from prcommon.model import BriefingNotesStatus
from ttl.tg.controllers import OpenSecureController
import prcommon.sitecontrollers.open as OpenControllerBase

#########################################################
## validators
#########################################################
@SimpleFormValidator
def LookupSchema_post(value_dict, state, validator):
	""" check and add types to form data"""
	value_dict['searchtype'] = value_dict.get("searchtype", "")

class GeneralLookupSchema(PrFormSchema):
	""" lookup info exposed method validator"""
	chained_validators = (LookupSchema_post, )

#########################################################
## controlllers
#########################################################

class OpenController(OpenSecureController):
	""" Open Controller allows access to stuff that would require a restruction
	not sure at the moment what this would be but it could be usefull for pre
	loading common cache elements such as list of types etc"""
	_lookupinfo = {
					"outletsearchtypes": OutletSearchType,
					"outlettypes": OutletTypes,
					"frequencies": Frequencies,
					"customerstatus": CustomerStatus,
					"geographicallookups": GeographicalLookupView,
					"labels": Labels,
					"nbroflogins": NbrOfLogins,
					"terms": Terms,
	        "prmaxoutlettypes" : PRmaxOutletTypes,
	        "sortorder" : SortOrder,
	        "paymenttypes": CustomerPaymentTypes,
	        "geographicallookuptypes": GeographicalLookupTypes,
	        "reasoncodes": ReasonCodes,
	        "reasoncategories": ReasonCategories,
	        "researchfrequencies": ResearchFrequencies,
	        'countries': Countries,
	        "contacthistorytypes": ContactHistorySources,
	        "paymentmethods": PaymentMethods,
	        "briefingnotesstatus": BriefingNotesStatus,
	}

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeneralLookupSchema(), state_factory=std_state_factory)
	def lookups(self, *args, **kw):
		""" Standard lookup for combo boxs"""

		# these never chnage in a session we could add a forward cache at
		# this point if we wanted to

		if kw['searchtype'] in OpenController._lookupinfo:
			data = OpenController._lookupinfo[kw['searchtype']].getLookUp(kw)
		else:
			if kw['searchtype'] in OpenControllerBase.OpenController._lookupinfo:
				data = OpenControllerBase.OpenController._lookupinfo[kw['searchtype']].getLookUp(kw)
			else:
				data = []
		if kw['searchtype'] == "frequencies" and "ignoreoption" in kw:
			data.insert(0, dict(id=-1, name="All"))

		if kw['searchtype'] in OpenControllerBase.OpenController._AddFilter and "nofilter" in kw:
			data.insert(0, dict(id=-1, name="No Selection"))

		return dict(
		  identifier="id",
		  label='name',
		  items=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def lookups_restricted(self, *args, **inparams):
		""" Standard lookup for combo boxs"""

		# these never chnage in a session we could add a forward cache at
		# this point if we wanted to
		if "searchtype" not in inparams and args:
			inparams["searchtype"] = args[0]

		if inparams.get('searchtype', '') in OpenController._lookupinfo:
			data = OpenController._lookupinfo[inparams['searchtype']].get_look_up(inparams)
		else:
			if inparams['searchtype'] in OpenControllerBase.OpenController._lookupinfo:
				data = OpenControllerBase.OpenController._lookupinfo[inparams['searchtype']].getLookUp(inparams)
			else:
				data = []

		if inparams['searchtype'] in OpenControllerBase.OpenController._AddFilter and "nofilter" in inparams:
			data.insert(0, dict(id=-1, name="No Selection"))

		return dict(identifier="id",
				    label='name',
				    items=data)
