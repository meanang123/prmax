# -*- coding: utf-8 -*-
"""Advance Features"""
#-----------------------------------------------------------------------------
# Name:        advance.py
# Purpose:     handle basic advance information
# Author:      Chris Hoy
#
# Created:     10/08/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, \
     PrGridSchema, ExtendedDateValidator, RestSchema
import ttl.tg.validators as tgvalidators
from prcommon.model import AdvanceFeature, ResearchControRecord, AdvanceFeatureResultView, \
     AdvanceFeaturesList, AdvanceFeaturesListMembers, List
from ttl.base import stdreturn, duplicatereturn, samereturn

class AdvanceBasicSchema(PrFormSchema):
	"""Schema"""
	advancefeatureid = validators.Int()

class AdvanceFeatureSchema(PrFormSchema):
	"""Schema"""
	advancefeatureid = validators.Int()
	editorial = ExtendedDateValidator()
	cover = ExtendedDateValidator()
	publicationdate = ExtendedDateValidator()
	interests = tgvalidators.JSONValidatorInterests()
	employeeid = validators.Int()

class AdvanceDeleteSchema(PrFormSchema):
	"""Shecma"""
	advancefeatureid = validators.Int()
	reasoncodeid = validators.Int()

class AdvanceResearchSchema(PrFormSchema):
	"""Schema"""
	outletid = validators.Int()

class AdvanceBasicListSchema(PrFormSchema):
	"""Schema"""
	advancefeatureslistid = validators.Int()

class AdvanceBasicListAddSchema(PrFormSchema):
	"""Schema"""
	advancefeatureslistid = validators.Int()
	destinationid = validators.Int()
	overwrite = validators.Int()
	selection = validators.Int()

class AdvanceBasicListRenameSchema(PrFormSchema):
	"""Schema"""
	advancefeatureslistid = validators.Int()
	listname = validators.String ()

class AdvanceListAddSchema(PrFormSchema):
	"""Schema"""
	listname = validators.String(not_empty=True)

class OpenListSchema(PrFormSchema):
	""" open list schema"""
	lists = tgvalidators.JSONValidatorListInt()

class SaveToStandingSchema(PrFormSchema):
	""" open list schema"""
	listid = validators.Int()
	advancefeatureslistid = validators.Int()
	selection = validators.Int()

class SaveToStandingNewSchema(PrFormSchema):
	""" open list schema"""
	advancefeatureslistid = validators.Int()
	selection = validators.Int()
	listname = validators.String(not_empty=True)


class DeleteSelectionSchema(PrFormSchema):
	""" open list schema"""
	advancefeatureslistid = validators.Int()
	deleteoptions = validators.Int()

class ListSelectionSchema(PrFormSchema):
	""" open list schema"""
	advancefeatureslistid = validators.Int()
	selection = validators.Int()


#########################################################
## Interest Controller
#########################################################
class AdvanceCommonController( object ):
	""" Common interest for all prmax applications """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicSchema(), state_factory=std_state_factory)
	def get_ext(self, *args, **params):
		""" get the details about an advance feature """

		return  stdreturn ( data = AdvanceFeature.getExt(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceFeatureSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def save(self, *args, **params):
		""" Save the details about an advance feature  """

		if params["employeeid"] == -1 :
			params.pop("employeeid")

		if params["advancefeatureid"] == -1:
			params["advancefeatureid"] = AdvanceFeature.research_new( params )
		else:
			params["advancefeatureid"] = AdvanceFeature.research_update ( params )

		return stdreturn( data = AdvanceFeature.query.get(params["advancefeatureid"]) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def listoutlet(self, *args, **params):
		""" List the advance featured for a outlet """

		return AdvanceFeature.getGridPageOutlet ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def listoutlet_all(self, *args, **params):
		""" List the advance featured for a outlet """

		params["showall"] = 1
		return AdvanceFeature.get_rest_outlet ( params )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceDeleteSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete(self, *args, **params):
		""" delete an advance feature """

		AdvanceFeature.research_delete ( params )

		return stdreturn( data = dict(advancefeatureid = params["advancefeatureid"]) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceResearchSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def getResearchExt(self, *args, **params):
		""" get the resrach details  """

		return stdreturn ( data = ResearchControRecord.getAdvaneResearchDict( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceResearchSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_details_save(self, *args, **params):
		""" update the research fields """

		ResearchControRecord.updateAdvanceResearch(params )

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_duplicate(self, *args, **params):
		""" update the research fields """

		params["advancefeatureid"] = AdvanceFeature.research_duplicate( params )

		return stdreturn ( data = AdvanceFeature.query.get ( params["advancefeatureid"]) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def viewpage(self, *args, **kw):
		""" update the research fields """

		return AdvanceFeatureResultView.getGridPage( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def viewpage_rest(self, *args, **params):
		""" update the research fields """

		return AdvanceFeatureResultView.get_rest_page( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicListSchema(), state_factory=std_state_factory)
	def count(self, *args, **params):
		""" update the research fields """

		return stdreturn ( data = AdvanceFeaturesList.getCount ( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicListAddSchema(), state_factory=std_state_factory)
	def saveas(self, *args, **params):
		""" Save the details about an advance feature  """

		if params["destinationid"] == params["advancefeatureslistid"]:
			return samereturn()

		AdvanceFeaturesList.Copy( params )

		params["advancefeatureslistid"] = params["destinationid"]

		return stdreturn ( data = AdvanceFeaturesList.getCount ( params ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicListRenameSchema(), state_factory=std_state_factory)
	def saveas_new(self, *args, **params):
		""" save as a new list"""

		if AdvanceFeaturesList.Exists ( params ) :
			return duplicatereturn()

		params["advancefeatureslistid"] = AdvanceFeaturesList.AddCopy( params )

		return stdreturn ( data = AdvanceFeaturesList.getCount ( params ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def lists(self, *args, **params):
		""" update the research fields """

		return AdvanceFeaturesList.getGridPage( params )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicListSchema(), state_factory=std_state_factory)
	def info(self, *args, **params):
		""" update the research fields """

		return stdreturn ( data = AdvanceFeaturesList.getExt ( params["advancefeatureslistid"] ) )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def listmaintcount(self, *args, **params):
		""" list of advance list info """
		return dict(data = AdvanceFeaturesList.getListMaintCount( params['customerid'], params['user_id']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def createlist(self, *args, **params):
		""" Create a list"""
		if params.has_key("advancefeatureslistid") and params["advancefeatureslistid"]:
			if AdvanceFeaturesList.Exists2 ( params ) :
				return duplicatereturn()
			else:
				AdvanceFeaturesList.Rename ( params )
				return stdreturn ( data = AdvanceFeaturesList.getExt ( params["advancefeaturelistid"] ) )
		else:
			if AdvanceFeaturesList.Exists ( params ) :
				return duplicatereturn()

			advancefeaturelistid = AdvanceFeaturesList.Add ( params )
			return stdreturn ( data = AdvanceFeaturesList.getExt ( advancefeaturelistid ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicListRenameSchema(), state_factory=std_state_factory)
	def renamelist(self, *args, **params):
		""" Rename a list """
		if AdvanceFeaturesList.Exists ( params ) :
			return duplicatereturn()

		AdvanceFeaturesList.Rename( params )

		return stdreturn ( data = AdvanceFeaturesList.getExt ( params["advancefeatureslistid"] ) )



	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AdvanceBasicListSchema(), state_factory=std_state_factory)
	def deletelist(self, *args, **params):
		""" delete a list  """

		AdvanceFeaturesList.Delete ( params["advancefeatureslistid"] )
		return stdreturn ( data = params["advancefeatureslistid"] )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def deleteselection(self, *args, **params):
		""" delete selected liss """

		return stdreturn ( lists = AdvanceFeaturesList.deleteSelectedList ( params ) )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeleteSelectionSchema(), state_factory=std_state_factory)
	def delete_list_entries(self, *args, **params):
		""" delete the selected entries from the current list """

		return stdreturn ( data = AdvanceFeaturesListMembers.DeleteSelection ( params ) )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenListSchema(), state_factory=std_state_factory)
	def open(self, *args, **params):
		""" open a list or a group of lists into the results buffer"""

		return stdreturn ( data = AdvanceFeaturesList.Open ( params ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SaveToStandingSchema(), state_factory=std_state_factory)
	def save_to_standing(self, *args, **params):
		""" Save a advance list too a standing list """

		return stdreturn ( data = AdvanceFeaturesList.SaveToStanding ( params ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SaveToStandingNewSchema(), state_factory=std_state_factory)
	def save_to_standing_new(self, *args, **params):
		""" Save a advance list too a standing list """

		if List.Exits ( params["customerid"] , params["listname"] ) :
			return duplicatereturn()

		return stdreturn ( data = AdvanceFeaturesList.SaveToNewStanding ( params ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListSelectionSchema(), state_factory=std_state_factory)
	def results_to_list(self, *args, **params):
		""" Save a result set too a list """

		AdvanceFeaturesList.ResultsTolist ( params )

		return stdreturn ( data = AdvanceFeaturesList.getCount (params ) )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def delete_list_all(self, *args, **params):
		""" Delete all the enries in a list  """
		return stdreturn ( data = AdvanceFeaturesListMembers.DeleteMembers(params))

