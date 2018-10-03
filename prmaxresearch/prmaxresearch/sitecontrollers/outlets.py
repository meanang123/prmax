# -*- coding: utf-8 -*-
"Outlet Controller"
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
from turbogears import expose, validate, validators, error_handler, exception_handler, identity
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import PrOutletIdFormSchema
from ttl.tg.validators import std_state_factory, PrFormSchema, IntNull, RestSchema
from ttl.base import  stdreturn
from prmax.utilities.common import addConfigDetails
from prcommon.model import Communication, Outlet, Freelance, SearchSession, OutletGeneral
from prcommon.lib.Security import check_access_rights
import prcommon.Constants as Constants


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

class OutletResearchSave2Schema(PrFormSchema):
	"""validates form for outler save """
	outletid = validators.Int()
	circulation = IntNull()
	webbrowsers = IntNull()
	frequencyid = validators.Int()
	countryid = validators.Int()
	circulationsourceid = IntNull()
	circulationauditdateid = IntNull()
	websourceid = IntNull()
	webauditdateid = IntNull()
	outletpriceid = IntNull()
	mediaaccesstypeid = IntNull()

class OutletResearchCodingSchema(PrFormSchema):
	"""validates form for outler save """
	prmax_outlettypeid = validators.Int()
	outletid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	coverage = tgvalidators.JSONValidatorInterests()
	supplements = tgvalidators.JSONValidatorInterests()
	editions = tgvalidators.JSONValidatorInterests()
	reasoncodeid = validators.Int()

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

class FreelanceUpdateSchema(PrFormSchema):
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

class OutletProfileFormSchema(PrFormSchema):
	"schema"
	outletid = validators.Int()
	reasoncodeid = validators.Int()
	seriesparentid = IntNull()
	supplementofid = IntNull()
	publisherid = IntNull()
	productioncompanyid = IntNull()
	languages = tgvalidators.JSONValidatorInterests()
	broadcast = tgvalidators.JSONValidatorInterests()


class PrMoveEmployeeFormSchema(PrFormSchema):
	"""schema"""
	outletid = validators.Int()
	outletdeskid = validators.Int()
	employeeid = validators.Int()

class OutletResearchIntSaveSchema(PrFormSchema):
	"""validates form for outler save """
	outletid = validators.Int()
	prmax_outlettypeid = validators.Int()

class OutletResearchInternationalSchema(PrFormSchema):
	prmax_outlettypeid = validators.Int()
	outletid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	reasoncodeid = validators.Int()

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
		data = Outlet.getBasicDetails(params)
		Outlet.delete(params)
		data['statistics'] = SearchSession.getSessionCount(params)

		return dict(success="OK", data=data)

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

		return stdreturn(data=Outlet.getForEdit(params['outletid'], params['customerid']))

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

		return dict(success="OK", data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletStdSaveSchema(), state_factory=std_state_factory)
	def freelance_update(self, *args, **params):
		""" update a freelance """
		if params['outletid'] != -1:
			Freelance.update(Constants.Outlet_Type_Freelance, params)
		return dict(success="OK")

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

		return stdreturn(data=Freelance.getForEdit(params['outletid'])["data"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	def freelance_delete(self, *args, **params):
		""" Delete a freelance """

		data = Outlet.getBasicDetails(params)
		Outlet.delete(params)
		data['statistics'] = SearchSession.getSessionCount(params)
		return dict(success="OK", data=data)

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
	@validate(validators=OutletResearchSave2Schema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_main_update(self, *args, **params):
		""" Save an outlet"""

		OutletGeneral.research_main_update(params)

		return stdreturn(data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchPrnSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_prn(self, *args, **params):
		""" Save an outlet"""

		Outlet.research_update_prn(params)

		return dict(success="OK", data=Outlet.getBasicDetails(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_add_main(self, *args, **params):
		""" Add a new global outlet"""

		params["outletid"] = Outlet.research_main_add(params)

		return dict(success="OK", data=Outlet.getBasicDetails(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProfileSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_profile(self, *args, **params):
		"""Update a profile"""

		params["outletid"] = params["objectid"]
		Outlet.research_profile_update(params)

		return dict(success="OK")


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletStdSaveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def freelance_research_add(self, *args, **params):
		""" save an freelance record for the research system """

		params['outletid'] = Freelance.research_add(params)

		return dict(success="OK", data=Outlet.getBasicDetails(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=FreelanceUpdateSchema(), state_factory=std_state_factory)
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

		return dict(success="OK", data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_outlet_edit_get(self, *args, **params):
		""" get details fo editing """

		data = Outlet.getForEdit(params['outletid'], -1)

		return stdreturn(outlet=data["outlet"], primary=data["primary"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletSchema(), state_factory=std_state_factory)
	def check_twitter(self, *argc, **params):
		""" return the twitter handle """

		twitter = ""
		if params["outletid"] > 0:
			outlet = Outlet.query.get(params["outletid"])
			if outlet.communicationid:
				comm = Communication.query.get(outlet.communicationid)
				twitter = comm.twitter

		return stdreturn(twitter=twitter)


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
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletProfileFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update_profile(self, *args, **params):
		""" update the profile record """

		OutletGeneral.update_profile(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchCodingSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update_coding(self, *args, **params):
		""" update the profile record """

		OutletGeneral.research_coding_update(params)

		data = Outlet.getForEdit(params['outletid'], -1)

		return stdreturn(outlet=data["outlet"], primary=data["primary"])

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def old_profile(self, *args, **params):
		"old_profile"

		return ''.join(['%s %s' % (row[1], row[0]) for row in Outlet.query.get(params["outletid"]).getProfileAsList()])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_research(self, *args, **params):
		""" List of outlets for research"""

		#params["prmaxdatasetids"] = "(1,)"
		return OutletGeneral.get_research_list(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrMoveEmployeeFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_move_contact(self, *args, **params):
		""" Move a contact between outlets"""

		Outlet.research_move_contact(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_outlet_is_child(self, *args, **params):
		""" """

		ret = dict( is_child = Outlet.research_outlet_is_child(params),outletid = params['outletid'])
		return ret

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrMoveEmployeeFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_copy_contact(self, *args, **params):
		""" Copy a contact to an outlet"""

		Outlet.research_copy_contact(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchInternationalSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update_international(self, *args, **params):
		""" update the internaltion research """

		OutletGeneral.update_international(params)

		return stdreturn()

