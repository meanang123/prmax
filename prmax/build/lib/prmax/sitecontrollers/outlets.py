# -*- coding: utf-8 -*-
"""Outlets Controller"""
#-----------------------------------------------------------------------------
# Name:        outlets.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from prmax.utilities.common import addConfigDetails
from prcommon.model import Communication, Outlet, Freelance, SearchSession, OutletGeneral
import prmax.Constants as Constants
from prmax.utilities.validators import PrOutletIdFormSchema
from ttl.tg.validators import std_state_factory, PrFormSchema
from prmax.utilities.Security import check_access_rights
from ttl.base import stdreturn


class ProfileSaveSchema(PrFormSchema):
	"""validates form for outler save """
	objectid = validators.Int()
	objecttypeid = validators.Int()

class OutletSchema(PrFormSchema):
	"""validates form for outler save """
	outletid = validators.Int()


class OutletSaveSchema(PrFormSchema):
	"""validates form for outler save """
	outlet_interest = tgvalidators.JSONValidatorInterests()
	contact_interest = tgvalidators.JSONValidatorInterests()
	outletid = validators.Int()

class OutletResearchSaveSchema(PrFormSchema):
	"""validates form for outler save """
	outletid = validators.Int()
	prmax_outlettypeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	coverage = tgvalidators.JSONValidatorInterests()
	circulation = validators.Int()
	webbrowsers = validators.Int()
	frequencyid = validators.Int()
	countryid = validators.Int()

class OutletResearchPrnSchema(PrFormSchema):
	"""validates form for outler save """
	outletid = validators.Int()
	prmax_outlettypeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	coverage = tgvalidators.JSONValidatorInterests()

class OutletStdSaveSchema(PrFormSchema):
	"""validates form for outler override save """
	outletid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	countryid = validators.Int()

class FreeLanceOverrideSchema(PrFormSchema):
	"""validates form for outler override save """
	outletid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()

class OutletOverideSaveSchema(PrFormSchema):
	"""validates form for outler override save """
	outletid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()

class OutletController(SecureController):
	""" outlet controller """

	@expose(template="genshi:prmax.templates.maintenance/outlet_edit")
	def outlet_edit(self, *args, **params):
		""" outlet edit form"""

		return addConfigDetails(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletSaveSchema(), state_factory=std_state_factory)
	@check_access_rights("outlet")
	def outlet_save(self, *args, **params):
		""" Save an outlet"""
		if params['outletid'] == -1:
			params["sourcetypeid"] = Constants.Research_Source_Private
			params['outletid'] = Outlet.add(params)
		else:
			Outlet.update(params)

		return dict(success="OK", data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	@check_access_rights("outlet")
	def outlet_delete(self, *args, **params):
		""" Delete an outlet"""

		# get the basic data to allow the system to delete at the front end
		params["searchtypeid"] = Constants.Search_Standard_Type
		data = Outlet.getBasicDetails(params)

		Outlet.delete(params)
		data['statistics'] = SearchSession.getSessionCount(params)
		data['outletid'] = params['outletid']

		return stdreturn(data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	def outlet_override_get(self, *args, **params):
		""" get the override details for a specific customer outlet combination"""
		return Outlet.getOverrides(params['outletid'], params['customerid'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	@check_access_rights("outlet")
	def outlet_edit_get(self, *args, **params):
		""" get details fo editing """
		data = Outlet.getForEdit(params['outletid'], params['customerid'])
		data["success"] = "OK"
		return data

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletOverideSaveSchema(), state_factory=std_state_factory)
	def outlet_override_save(self, *args, **params):
		""" Save outlet override details"""
		return Outlet.saveOverrides(
			params['outletid'],
			params['customerid'],
			params)

	#######################################################
	## Freelance
	#######################################################

	@expose("")
	def freelance_add(self, *args, **params):
		""" add freelance template"""
		return self._cache("freelance_add",
						   "prmax.templates.maintenance/freelance_add",
						   addConfigDetails(params))

	@expose("")
	def freelance_edit(self, *args, **params):
		""" edit freelance template"""
		return self._cache("freelance_edit",
						   "prmax.templates.maintenance/freelance_edit",
						   addConfigDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletStdSaveSchema(), state_factory=std_state_factory)
	def freelance_save(self, *args, **params):
		""" save an outlet"""
		if params['outletid'] == -1:
			params['outletid'] = Freelance.add(Constants.Outlet_Type_Freelance, params)
		else:
			Freelance.update(Constants.Outlet_Type_Freelance, params)

		return stdreturn(data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletStdSaveSchema(), state_factory=std_state_factory)
	def freelance_update(self, *args, **params):
		""" update a freelance """

		if params['outletid'] != -1:
			Freelance.update(Constants.Outlet_Type_Freelance, params)

		return stdreturn

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	def freelance_load(self, *args, **params):
		""" return freelance details"""

		return Freelance.getForEdit(params['outletid'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	def freelance_get_for_load(self, *args, **params):
		""" return freelance details"""

		ret = stdreturn()
		ret["data"] = Freelance.getForEdit(params['outletid'])["data"]
		return ret

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	def freelance_delete(self, *args, **params):
		""" Delete a freelance """

		data = Outlet.getBasicDetails(params)
		Outlet.delete(params)
		data['statistics'] = SearchSession.getSessionCount(params)
		return stdreturn(data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=FreeLanceOverrideSchema(), state_factory=std_state_factory)
	def freelance_override_save(self, *args, **params):
		""" Save outlet override details"""
		return Outlet.saveOverrides(
			params['outletid'],
			params['customerid'],
			params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_main(self, *args, **params):
		""" Save an outlet"""

		Outlet.research_main_update(params)

		return stdreturn(data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchPrnSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_prn(self, *args, **params):
		""" Save an outlet"""

		Outlet.research_update_prn(params)

		return stdreturn(data=Outlet.getBasicDetails(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_add_main(self, *args, **params):
		""" Add a new global outlet"""

		params["outletid"] = Outlet.research_main_add(params)

		return stdreturn(data=Outlet.getBasicDetails(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProfileSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_profile(self, *args, **params):
		"""Update a profile"""

		params["outletid"] = params["objectid"]
		Outlet.research_profile_update(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletStdSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def freelance_research_add(self, *args, **params):
		""" save an freelance record for the research system """

		params['outletid'] = Freelance.research_add(params)

		return stdreturn(data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletStdSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def freelance_research_update(self, *args, **params):
		""" save an outlet"""

		Freelance.research_update(params)

		return stdreturn(data=Outlet.getBasicDetails(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete(self, *args, **params):
		""" Delete an outlet"""

		# get the basic data to allow the system to delete at the front end
		params["searchtypeid"] = Constants.Search_Standard_Research
		data = Outlet.getBasicDetails(params)
		Outlet.research_delete(params)

		return stdreturn(data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_outlet_edit_get(self, *args, **params):
		""" get details fo editing """
		data = Outlet.getForEdit(params['outletid'], -1)
		data["success"] = "OK"
		return data

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletSchema(), state_factory=std_state_factory)
	def check_outlet(self, *argc, **params):
		""" return the twitter handle and if outlet has features"""

		twitter = ""
		has_advancefeatures = False
		if params["outletid"] > 0:
			outlet = Outlet.query.get(params["outletid"])
			if outlet.communicationid and not outlet.prmax_outlettypeid in Constants.Outlet_Is_Mp:
				comm = Communication.query.get(outlet.communicationid)
				twitter = comm.twitter
			has_advancefeatures = OutletGeneral.has_advancefeatures(params)

		return stdreturn(twitter=twitter,
		                 has_advancefeatures=has_advancefeatures)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_media(self, *args, **params):
		""" update social media only """

		Outlet.research_update_media(params)

		return stdreturn()


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=tgvalidators.RestSchema(), state_factory=std_state_factory)
	def list_outlets(self, *args, **params):
		""" list all the roles int the system"""

		if args:
			params['outletid'] = int(args[0])

		return OutletGeneral.list_outlets(params)
