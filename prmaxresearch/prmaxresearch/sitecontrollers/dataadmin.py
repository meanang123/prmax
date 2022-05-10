# -*- coding: utf-8 -*-
"data admin"
#-----------------------------------------------------------------------------
# Name:
# Purpose:
#              functions
#
# Author:      Chris Hoy
#
# Created:
# Copyright:  (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators, database
from turbogears.database import session
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	  JSONValidatorListInt, JSONValidatorInterests, BooleanValidator, RestSchema, \
    ISODateValidator, Int2Null
from prcommon.model import  Outlet, ReasonCodes, Activity, ActivityDetails, ResearchDetails
from prcommon.research.questionnaires import QuestionnaireEmailer
from ttl.base import stdreturn, duplicatereturn

from roles import RolesController
from geographical import GeographicalController
from interests import InterestController
from contact import ContactController
from countries import CountriesController
from  outlets import OutletController
from  user import UserController
from  bouncedemail import BouncedEmailsController
from  employee import EmployeeController
from  projects import ProjectsController
from  subjects import SubjectController

from prcommon.sitecontrollers.publisher import PublisherController
from prcommon.sitecontrollers.circulationsources import CirculationSourcesController
from prcommon.sitecontrollers.circulationdates import CirculationDatesController
from prcommon.sitecontrollers.websources import WebSourcesController
from prcommon.sitecontrollers.webdates import WebDatesController
from prcommon.sitecontrollers.production import ProductionCompanyController
from prcommon.sitecontrollers.outletdesks import OutletDeskController
from prcommon.sitecontrollers.marketsector import MarketSectorController

from prcommon.model.outlets.emplsynchronisation import EmployeeSynchronise
from prcommon.model.outlet import OutletProfile
from prcommon.model.research import ResearchDetails

from prmaxresearch.sitecontrollers.deletionhistory import DeletionHistoryController

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

class ReseachDetailsUpdateSchema(PrFormSchema):
	""" reseach details """
	outletid = validators.Int()
	researchfrequencyid =  validators.Int()
	last_research_completed = ISODateValidator()
	last_questionaire_sent = ISODateValidator()
	quest_month_1 = Int2Null()
	quest_month_2 = Int2Null()
	quest_month_3 = Int2Null()
	quest_month_4 = Int2Null()
	no_sync = BooleanValidator()
	italian_export = BooleanValidator()

class SendQuestionnaireSchema(PrFormSchema):
	""" reseach  """
	objectid = validators.Int()
	objecttypeid = validators.Int()

class ProjectAddSchema(PrFormSchema):
	""" project add form schema """
	sendq = BooleanValidator()
	iuserid = validators.Int()

class ProjectItemUpdateSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()
	researchprojectstatusid = validators.Int()
	#researcheddate = BooleanValidator()

class DataAdminController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	roles =  RolesController()
	geographical = GeographicalController()
	interests = InterestController()
	contacts = ContactController()
	countries = CountriesController()
	outlets = OutletController()
	user =  UserController()
	bemails =  BouncedEmailsController()
	employees = EmployeeController()
	publisher = PublisherController()
	circulationsources = CirculationSourcesController()
	circulationdates = CirculationDatesController()
	websources = WebSourcesController()
	webdates = WebDatesController()
	production = ProductionCompanyController()
	projects = ProjectsController()
	desks = OutletDeskController()
	subjects = SubjectController()
	deletionhistory = DeletionHistoryController()
	marketsector = MarketSectorController()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletOverridesSchema(), state_factory=std_state_factory)
	def outlet_update_overrides(self, *args, **params):
		""" Update all the role mapping in the database in the database """

		Outlet.update_prmax_settings(params)

		return  stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def reasoncodes(self, *args, **params):
		""" list all the roles int the system"""

		return ReasonCodes.get_rest_page(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def reason_code_add(self, *args, **params):
		""" list all the roles int the system"""

		if ReasonCodes.Exists(params) :
			return duplicatereturn()

		params["reasoncodeid"] = ReasonCodes.reason_code_add(params)

		return stdreturn(data=ReasonCodes.get(params))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators = RestSchema(),  state_factory=std_state_factory)
	def audit_trail(self, *args, **params):
		""" get the main audit trail for an object """

		return Activity.get_rest_page(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def audit_delete_trail(self, *args, **params):
		""" get the deleted outlets audit trails """

		return Activity.get_grid_page_deleted(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def audit_delete_trail_list(self, *args, **params):
		""" List of deleted outlets for research"""

		return Activity.get_list_deleted(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def audit_details(self, *args, **params):
		""" get the details for an audit event """

		return ActivityDetails.get_rest_page(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReseachDetailsSchema(), state_factory=std_state_factory)
	def reseach_details_get(self, *args, **params):
		""" Update all the role mapping in the database in the database """

		return  stdreturn(data=ResearchDetails.get_extended(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReseachDetailsUpdateSchema(), state_factory=std_state_factory)
	def reseach_details_update(self, *args, **params):
		""" Update the reseach details """

		ResearchDetails.update(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SendQuestionnaireSchema(), state_factory=std_state_factory)
	def send_questionnaire(self, *args, **params):
		""" Update the reseach details """

		QuestionnaireEmailer.runsingle(params)

		return stdreturn()

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SendQuestionnaireSchema(), state_factory=std_state_factory)
	def preview_questionnaire(self, *args, **params):
		"preview questionaiie"

		return QuestionnaireEmailer.preview_questionnaire(params)
