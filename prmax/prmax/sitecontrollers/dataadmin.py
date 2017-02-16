# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        dataadmin.py.py
# Purpose:     Holds all the functions that a sure required to administrat
#              functions
#
# Author:      Chris Hoy
#
# Created:     02/07/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 PrGridSchema, JSONValidatorListInt, JSONValidatorInterests, BooleanValidator

from prmax.utilities.common import addConfigDetails
from prmax.model import PRMaxRoles, Outlet, Interests, Geographical, \
     OutletCoverageView, ReasonCodes, Activity, ActivityDetails, ResearchDetails
from prcommon.model import Countries, ResearchProjects, ResearchProjectItems
from prcommon.research.questionnaires import QuestionnaireEmailer

from bouncedemail import BouncedEmailsController

from ttl.base import stdreturn, duplicatereturn

class PRMaxRolesSchema(PrFormSchema):
	""" prmax role schema"""
	prmaxroleid = validators.Int()

class OutletOverridesSchema(PrFormSchema):
	"""validates form for outler override save """
	outletid = validators.Int()
	prmax_outletsearchtypeid = validators.Int()

class PRMaxRolesSchema2(PrFormSchema):
	""" prmax role schema"""
	prmaxroleid = validators.Int()
	roles = JSONValidatorListInt()
	interests = JSONValidatorInterests()

class ReseachDetailsSchema(PrFormSchema):
	""" reseach details """
	outletid = validators.Int()


class SendQuestionnaireSchema(PrFormSchema):
	""" reseach  """
	objectid = validators.Int()
	objecttypeid = validators.Int()

class ProjectAddSchema(PrFormSchema):
	""" project add form schema """
	sendq = BooleanValidator()
	iuserid = validators.Int()

class ProjectItemUpdateSchema(PrFormSchema):
	""" """
	researchprojectitemid = validators.Int()
	researchprojectstatusid = validators.Int()
	researcheddate = BooleanValidator()

class DataAdminController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")
	bemails = BouncedEmailsController()

	@expose(template="prmax.templates.dataadmin/main")
	def main(self, *args, **kw):
		"""main screen for internal management"""
		return addConfigDetails(kw)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def options(self, *args, **kw ):
		""" data options"""

		return dict ( identifier = 'id', label = "name" ,
					  items = [
						  dict( id = 1 , type=1, name = "Forms" , children =
								[dict(_reference=12),
								 dict(_reference=3),
		             dict(_reference=18),
								 dict(_reference=5),
								 dict(_reference=20),
		             dict(_reference=24),
		             dict(_reference=26),
								 ]),
						  dict( id = 12 , type=3, name = "Lookups" , children = [ dict(_reference=2),dict(_reference=11),dict(_reference=10),dict(_reference=8),dict(_reference = 15),dict(_reference = 23),dict(_reference = 25)]),
						  dict( id = 2 , type=0, name = "Roles" , content="prmax.dataadmin.Roles"),
		          dict( id = 11 , type=0, name = "Geographical" , content="prmax.dataadmin.Geographical"),
		          dict( id = 8 , type=0, name = "Reason Codes" , content="prmax.dataadmin.ReasonCodes"),
						  dict( id = 15 , type=0, name = "People" , content="prmax.dataadmin.employees.People"),
						  dict( id = 3 , type=3, name = "Outlets" , children = [ dict(_reference=6),dict(_reference=7),dict(_reference=14),dict(_reference=16),dict(_reference=17)]),
						  dict( id = 6 , type=0, name = "Search & Edit" , content="prmax.dataadmin.outlets.Outlets"),
						  dict( id = 7 , type=0, name = "New Outlet" , content="prmax.dataadmin.outlets.OutletNew"),
		          dict( id = 16 , type=0, name = "Outlet Delete Audit" , content="prmax.dataadmin.AuditDelete"),
						  dict( id = 4 , type=2, name = "Logout of Prmax" , page="/logout"),
						  dict( id = 5 , type=3, name = "Logout" , children = [dict(_reference=4)]),
						  dict( id = 10 , type=0, name = "Interests"  , content="prmax.dataadmin.Interests"),
						  dict( id = 14 , type=0, name = "New Freelance" , content="prmax.dataadmin.freelance.FreelanceNew"),
						  dict( id = 17 , type=0, name = "Freelance Changes" , content="prmax.dataadmin.freelance.FreelanceChanges"),
		          dict( id = 18 , type=3, name = "Features" , children = [ dict(_reference=19)]),
		          dict( id = 19 , type=0, name = "Search & Edit" , content="prmax.dataadmin.advance.view"),
		          dict( id = 20 , type=3, name = "Settings" , children = [ dict(_reference=21)]),
		          dict( id = 21 , type=0, name = "Researcher" , content="prmax.dataadmin.usersettings"),
		          dict( id = 22 , type=0, name = "Bounced Emails" , content="prmax.dataadmin.feedback.BouncedEmails"),
		          dict( id = 23 , type=0, name = "PRN Subjects" , content="prmax.dataadmin.lookups.PRNSubjeectMapping"),
						  dict( id = 24 , type=3, name = "Emails" , children = [ dict(_reference=22) ]),
		          dict( id = 25 , type=0, name = "Countries" , content="prmax.dataadmin.Countries"),
		          dict( id = 26 , type=0, name = "Projects" , children = [ dict( _reference=27), dict( _reference=28)]),
		          dict( id = 27 , type=0, name = "View" , content="prmax.dataadmin.projects.view"),
		          dict( id = 28 , type=0, name = "Create" , content="prmax.dataadmin.projects.create")
		        ] )

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def search(self, *args, **kw ):
		""" list all the roles int the system"""
		return dict (numRows  = 0, items = [], identifier = "outletid" )

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def rolesall(self, *args, **kw ):
		""" list all the roles int the system"""
		return PRMaxRoles.get_grid_page(kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def add(self, *args, **kw):
		""" Add a new role"""
		if PRMaxRoles.exists ( kw ) :
			return dict ( success = "DU" )

		return  dict(success = "OK", data = PRMaxRoles.add ( kw ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRolesSchema(), state_factory=std_state_factory)
	def role_set_visible(self, *args, **kw):
		""" get the extended prmax role details"""
		return  dict(success = "OK", data = PRMaxRoles.set_visible ( kw ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxRolesSchema2(), state_factory=std_state_factory)
	def update_synonims(self, *args, **kw):
		""" get the extended prmax role details"""

		return  dict(success = "OK", data = PRMaxRoles.update_synonims ( kw) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletOverridesSchema(), state_factory=std_state_factory)
	def outlet_update_overrides(self, *args, **kw):
		""" Update all the role mapping in the database in the database """

		Outlet.update_prmax_settings( kw )

		return  dict(success = "OK" )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def interests(self, *args, **kw):
		""" Interests """

		return Interests.getGridPageResearch(kw)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def geographical(self, *args, **kw ):
		""" list all the roles int the system"""
		return Geographical.getGridPage(kw)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def coverage(self, *args, **kw ):
		""" list all the roles int the system"""
		return OutletCoverageView.getGridPageByArea(kw)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def reasoncodes(self, *args, **kw ):
		""" list all the roles int the system"""
		return ReasonCodes.getGridPage( kw )


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def reason_code_add(self, *args, **kw ):
		""" list all the roles int the system"""

		if ReasonCodes.Exists ( kw ) :
			return dict(success = "DU" )

		kw["reasoncodeid"] = ReasonCodes.reason_code_add( kw )

		return dict ( success = "OK" ,  data = ReasonCodes.get ( kw ) )


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def audit_trail(self, *args, **kw ):
		""" get the main audit trail for an object """
		return Activity.getGridPage ( kw )

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def audit_delete_trail(self, *args, **kw ):
		""" get the deleted outlets audit trails """
		return Activity.getGridPageDeleted ( kw )


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def audit_details(self, *args, **kw ):
		""" get the details for an audit event """
		return ActivityDetails.getGridPage ( kw )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReseachDetailsSchema(), state_factory=std_state_factory)
	def reseach_details_get(self, *args, **kw):
		""" Update all the role mapping in the database in the database """

		return  stdreturn( data = ResearchDetails.get( kw ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReseachDetailsSchema(), state_factory=std_state_factory)
	def reseach_details_update(self, *args, **kw):
		""" Update the reseach details """

		ResearchDetails.update ( kw )
		return  stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SendQuestionnaireSchema(), state_factory=std_state_factory)
	def send_questionnaire(self, *args, **kw):
		""" Update the reseach details """

		QuestionnaireEmailer.runsingle ( kw )

		return stdreturn()

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SendQuestionnaireSchema(), state_factory=std_state_factory)
	def preview_questionnaire(self, *args, **kw):

		return QuestionnaireEmailer.preview_questionnaire( kw )

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def countries(self, *args, **kw ):
		""" get list of countries """

		return Countries.getGridPage ( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def countries_add(self, *args, **kw):
		""" add a country """

		if Countries.Exists ( kw ):
			return duplicatereturn()

		kw["countryid"] = Countries.add ( kw )

		return stdreturn( country = Countries.get ( kw["countryid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def countries_delete(self, *args, **kw):
		""" add a country """

		if Countries.inUse ( kw ):
			return errorreturn("Is In Use")

		Countries.delete ( kw )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def countries_update(self, *args, **kw):
		""" update a country record  """

		if Countries.Exists ( kw ):
			return duplicatereturn()

		Countries.update ( kw )

		return stdreturn( country = Countries.get ( kw["countryid"] ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectAddSchema(), state_factory=std_state_factory)
	def projects_add(self, *args, **kw):
		""" Projects add """

		if ResearchProjects.exists ( kw ) :
			return duplicatereturn()

		ResearchProjects.add ( kw )

		return stdreturn( )

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def projects_list(self, *args, **kw ):
		""" list of project for service"""

		return ResearchProjects.getgridpage(kw)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def projects_members(self, *args, **kw ):
		""" list of project for service"""

		return ResearchProjectItems.getgridpage(kw)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectItemUpdateSchema(), state_factory=std_state_factory)
	def project_item_update(self, *args, **kw ):
		""" chnage the status of a provject item """

		ResearchProjectItems.update ( kw )

		return stdreturn ( data = ResearchProjectItems.get ( kw["researchprojectitemid"] ) )





