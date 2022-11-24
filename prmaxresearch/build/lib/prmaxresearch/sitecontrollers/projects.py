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
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, exception_handler, identity, validators, config
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
import ttl.tg.validators as tgvalidators
from ttl.tg.validators import std_state_factory, PrFormSchema, BooleanValidator, RestSchema, JSONValidatorInterests, \
     ISODateValidator, ISODateValidatorNull, Int2Null
from prcommon.model import ResearchProjects, ResearchProjectItems, ProjectGeneral, QuestionnairesGeneral, Outlet, \
     ResearchProjectItems, ResearchProjectChanges, Employee, ProjectEmails
from ttl.base import stdreturn, duplicatereturn

class PRMaxEmployeeChangeForm(PrFormSchema):
	""" Validator for a employee chnage form"""
	employeeid = validators.Int()
	researchprojectitemid = validators.Int()
	researchprojectitemchangeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	jobroles = tgvalidators.JSONValidatorInterests()
	no_address = tgvalidators.BooleanValidator()
	outletdeskid = validators.Int()

class ProjectAddSchema(PrFormSchema):
	""" project add form schema """
	sendq = BooleanValidator()
	ismonthly = BooleanValidator()
	iuserid = validators.Int()
	startdate = ISODateValidatorNull()
	questionnaire_completion = ISODateValidator()

class ProjectUpdateSchema(PrFormSchema):
	""" project add form schema """
	researchprojectid = validators.Int()
	ownerid = Int2Null()
	startdate = ISODateValidatorNull()
	questionnaire_completion = ISODateValidator()

class ProjectGetSchema(PrFormSchema):
	""" project add form schema """
	researchprojectid = validators.Int()

class ProjectDeleteSchema(PrFormSchema):
	""" project delete form schema """
	researchprojectid = validators.Int()

class ProjectAddDesksSchema(PrFormSchema):
	""" project delete form schema """
	researchprojectid = validators.Int()

class OutletResearchSaveSchema(PrFormSchema):
	"""validates form for outler save """
	circulation = validators.Int()
	#webbrowsers = tgvalidators.IntNull()
	frequencyid = validators.Int()
	countryid = validators.Int()
	researchprojectitemid = validators.Int()
	circulationsourceid = tgvalidators.IntNull()
	circulationauditdateid = tgvalidators.IntNull()
	websourceid = tgvalidators.IntNull()
	webauditdateid = tgvalidators.IntNull()
	outletpriceid = validators.Int()

class ProjectItemUpdateSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()
	researchprojectstatusid = validators.Int()
	#researcheddate = BooleanValidator()

class ProjectItemSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()

class ProjectFreelanceFeedBackSchema(PrFormSchema):
	"schema"
	countryid = validators.Int()
	researchprojectitemid = validators.Int()
	interests = JSONValidatorInterests()

class ProjectDeskFeedBackSchema(PrFormSchema):
	"schema"
	researchprojectitemid = validators.Int()

class ProjectResentItemSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()
	iuserid = validators.Int()

class ProjectProfileFeedBackSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()
	publisherid = validators.Int()

class ProjectCodingFeedBackSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()
	prmax_outlettypeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	reasoncodeid = validators.Int()

class ProjectCoverageFeedBackSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()
	coverage = tgvalidators.JSONValidatorInterests()

class ProjectUserFeedBackSchema(PrFormSchema):
	""" schema"""
	researchprojectitemid = validators.Int()

class ProjectUserFeedBackEmployeeSchema(PrFormSchema):
	""" schema"""
	delete_option = validators.Int()

class ProjectUserFeedBackNewEmployeeSchema(PrFormSchema):
	""" schema"""
	objectid = validators.Int()
	researchprojectitemid = validators.Int()

class ProjectEmployeeSchema(PrFormSchema):
	""" schema"""
	objectid = validators.Int()

class ProjectResearchProjectSchema(PrFormSchema):
	""" schema"""
	researchprojectid = validators.Int()

class GenerateMonthlySchema(PrFormSchema):
	""" schema"""
	month = validators.Int()


class ProjectsController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectAddSchema(), state_factory=std_state_factory)
	def projects_add(self, *args, **params):
		""" Projects add """

		if ResearchProjects.exists(params):
			return duplicatereturn()

		researchprojectid = ResearchProjects.add(params)

		return stdreturn(data=ResearchProjects.get(researchprojectid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectGetSchema(), state_factory=std_state_factory)
	def projects_get(self, *args, **params):
		""" Projects add """

		return stdreturn(data=ResearchProjects.get(params["researchprojectid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectUpdateSchema(), state_factory=std_state_factory)
	def projects_update(self, *args, **params):
		""" Projects Update """

		if ResearchProjects.exists(params):
			return duplicatereturn()

		ResearchProjects.update(params)

		return stdreturn(data=ResearchProjects.get(params["researchprojectid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectDeleteSchema(), state_factory=std_state_factory)
	def project_delete(self, *args, **params):
		""" Projects delete """

		ResearchProjects.delete(params["researchprojectid"])

		return stdreturn(researchprojectid=params["researchprojectid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectAddDesksSchema(), state_factory=std_state_factory)
	def project_add_desks(self, *args, **params):
		""" Projects delete """

		ResearchProjects.add_desks(params["researchprojectid"])

		return stdreturn(researchprojectid=params["researchprojectid"])


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectDeleteSchema(), state_factory=std_state_factory)
	def project_send(self, *args, **params):
		""" Projects delete """

		ResearchProjects.project_send(params["researchprojectid"])

		return stdreturn(data=ResearchProjects.display_line(params["researchprojectid"]))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectResearchProjectSchema(), state_factory=std_state_factory)
	def projects_append(self, *args, **params):
		""" list of project for service"""

		ResearchProjects.projects_append(params)

		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def projects_list(self, *args, **params):
		""" list of project for service"""

		return ResearchProjects.get_rest_page(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def get_list(self, *args, **params):
		""" list of project for service"""

		return ResearchProjects.get_list(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def projects_members(self, *args, **params):
		""" list of project for service"""

		return ResearchProjectItems.get_rest_page(params)

	@expose('prmaxresearch.templates.projects.status')
	@validate(validators=ProjectResearchProjectSchema(), state_factory=std_state_factory)
	def projects_status(self, *args, **params):
		""" list of project for service"""

		return ResearchProjects.get_status(params["researchprojectid"])

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectItemUpdateSchema(), state_factory=std_state_factory)
	def project_item_update(self, *args, **params):
		""" chnage the status of a provject item """

		ResearchProjectItems.update(params)

		return stdreturn(data=ResearchProjectItems.get(params["researchprojectitemid"]))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectItemSchema(), state_factory=std_state_factory)
	def project_item_update_complete(self, *args, **params):
		""" chnage the status of a provject item """

		ResearchProjectItems.research_completed(params["researchprojectitemid"],
		                                        params["userid"],
		                                        params["notes"] if ('notes' in params and params['notes'] != '') else None)

		return stdreturn(data=ResearchProjectItems.get(params["researchprojectitemid"]))


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GenerateMonthlySchema, state_factory=std_state_factory)
	def generate_monthly(self, *args, **params):
		""" chnage the status of a provject item """

		ProjectGeneral.generate_monthly(params)

		return stdreturn()


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectUserFeedBackSchema(), state_factory=std_state_factory)
	def load_user_feedback(self, *args, **params):
		""" Load user feed back from questionaiires  """

		return stdreturn(data=QuestionnairesGeneral.load_user_feedback(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletResearchSaveSchema(), state_factory=std_state_factory)
	def user_feed_accept_main(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_user_feedback(params)

		projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])
		params["outletid"] = projectitem.outletid
		return stdreturn(data=Outlet.getBasicDetails(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectProfileFeedBackSchema(), state_factory=std_state_factory)
	def user_feed_accept_profile(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_profile_feedback(params)

		projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])
		params["outletid"] = projectitem.outletid

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectCodingFeedBackSchema(), state_factory=std_state_factory)
	def user_feed_coding(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_feedback_coding(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectItemSchema(), state_factory=std_state_factory)
	def user_feed_research(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_feedback_research(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectCoverageFeedBackSchema(), state_factory=std_state_factory)
	def user_feed_coverage(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_feedback_coverage(params)

		return stdreturn()



	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def journalist_changes(self, *args, **params):
		""" list of  journalist chnaged for a questionnaire """

		return ResearchProjectChanges.journalist_changes(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectUserFeedBackEmployeeSchema(), state_factory=std_state_factory)
	def delete_employee_feedback(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		data = QuestionnairesGeneral.delete_employee_feedback(params)
		data['objectid'] = params['objectid']
		return stdreturn(data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectUserFeedBackNewEmployeeSchema(), state_factory=std_state_factory)
	def load_new_employee_feedback(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		return stdreturn(data=dict(data=QuestionnairesGeneral.get_new_feedback(params), user_changes=None))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectUserFeedBackNewEmployeeSchema(), state_factory=std_state_factory)
	def load_employee_feedback(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		return stdreturn(data=QuestionnairesGeneral.load_employee_feedback(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectEmployeeSchema(), state_factory=std_state_factory)
	def load_employee(self, *args, **params):
		""" Load details """

		return stdreturn(data=QuestionnairesGeneral.load_employee(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxEmployeeChangeForm(), state_factory=std_state_factory)
	def new_employee(self, *args, **params):
		"""New Contact"""

		QuestionnairesGeneral.add_new_employee(params)

		return stdreturn(objectid=params["researchprojectitemchangeid"])


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRMaxEmployeeChangeForm(), state_factory=std_state_factory)
	def update_employee(self, *args, **params):
		""" Update contact """

		QuestionnairesGeneral.update_employee(params)

		return stdreturn(researchprojectitemid=params["researchprojectitemid"],
		                 data=Employee.getEmployeeExt(params["employeeid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectResentItemSchema(), state_factory=std_state_factory)
	def project_quest_resend(self, *args, **params):
		""" Update contact """

		ProjectEmails.re_send_email(params["researchprojectitemid"],
		                            params["email"],
		                            params["subject"],
		                            params["bodytext"],
		                            False,
		                            params["iuserid"],
		                            config.get("questionnaire.test_mode", False))

		return stdreturn(data=ResearchProjectItems.get(params["researchprojectitemid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectItemSchema(), state_factory=std_state_factory)
	def project_item_details(self, *args, **params):
		""" project_item_details """

		return stdreturn(data=ProjectEmails.get_research_details(params["researchprojectitemid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectItemSchema(), state_factory=std_state_factory)
	def project_item_delete(self, *args, **params):
		""" project_item_delete """

		ResearchProjectItems.delete(params["researchprojectitemid"])

		return stdreturn(researchprojectitemid=params["researchprojectitemid"])


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectFreelanceFeedBackSchema(), state_factory=std_state_factory)
	def user_feed_accept_freelance(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_feedback_freelance(params)

		projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])
		params["outletid"] = projectitem.outletid

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectDeskFeedBackSchema(), state_factory=std_state_factory)
	def user_feed_accept_desk(self, *args, **params):
		""" Save user feed back from questionaiires to live """

		QuestionnairesGeneral.save_feedback_desk(params)

		return stdreturn()


















