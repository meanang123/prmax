# -*- coding: utf-8 -*-
""" Issue controller """
#-----------------------------------------------------------------------------
# Name:        issue.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     16/06/2014
# Copyright:  (c) 2014

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, Int2Null, RestSchema
from ttl.base import stdreturn, duplicatereturn
from prcommon.model import IssuesGeneral, IssueHistory, BriefingNotesGeneral, SolidMediaGeneral
import ttl.Constants as Constants

class IssueAddSchema(PrFormSchema):
	""" shema """
	documentid = Int2Null()
	approvedbyid = Int2Null()
	briefingnotesstatusid = validators.Int()
	clientid = Int2Null()

class IssueUpdateSchema(PrFormSchema):
	""" shema """
	documentid = Int2Null()
	issueid = validators.Int()
	approvedbyid = Int2Null()
	briefingnotesstatusid = validators.Int()
	clientid = Int2Null()

class IssueIdSchema(PrFormSchema):
	"schema"
	issueid = validators.Int()

class IssueHistoryIdSchema(PrFormSchema):
	"schema"
	issuehistoryid = validators.Int()

class BriefingNoteidSchema(PrFormSchema):
	"schema"
	briefingnotesstatusid = validators.Int()

class IssueController(SecureController):
	""" Client Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def issues_list(self, *args, **params):
		""" retrive details about a seopress release """

		return IssuesGeneral.list_issues(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def issues_list_rest(self, *args, **params):
		""" retrive details about a seopress release """

		if args:
			params["issueid"] = int(args[0])

		return IssuesGeneral.list_issues(params, True)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def issue_history(self, *args, **params):
		""" retrive details about a seopress release """

		return IssuesGeneral.issue_history(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueAddSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" add a new client to the system  """

		if IssuesGeneral.exists(params):
			return duplicatereturn(message="Issue Already Exists")

		issueid = IssuesGeneral.add(params)

		return stdreturn(data=IssuesGeneral.get(issueid, True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueUpdateSchema(), state_factory=std_state_factory)
	def update(self, *args, **params):
		""" archive issue """

		IssuesGeneral.update(params)

		return stdreturn(data=IssuesGeneral.get(params["issueid"], extended=True))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def archive(self, *args, **params):
		""" archive issue """

		IssuesGeneral.archive(params)

		return stdreturn(data=IssuesGeneral.get(params["issueid"], extended=True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" archive issue """

		IssuesGeneral.delete(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def unarchive(self, *args, **params):
		""" archive issue """

		IssuesGeneral.archive(params, 1)

		return stdreturn(data=IssuesGeneral.get(params["issueid"], extended=True))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" Get a record """

		return stdreturn(data=IssuesGeneral.get(params["issueid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **params):
		"""gets a list of issues based upon the user selection"""

		return  dict(success=Constants.Return_Success,
		             transactionid=params["transactionid"],
		             data=IssuesGeneral.get_user_selection(params))

	@expose(template="mako:prmax.templates.display.issue_history")
	@validate(validators=IssueHistoryIdSchema(), state_factory=std_state_factory)
	def history_view(self, *args, **params):
		"""History View """

		return dict(ih=IssueHistory.query.get(params["issuehistoryid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def issue_engagements(self, *args, **params):
		""" Issue Engaements list """

		return IssuesGeneral.issue_engagements(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def briefingnoteadd(self, *args, **params):
		""" Add a new Briefing Record """

		if BriefingNotesGeneral.exists(params):
			return duplicatereturn()

		briefingnotesstatusid = BriefingNotesGeneral.add(params)

		return stdreturn(data=BriefingNotesGeneral.get(briefingnotesstatusid))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BriefingNoteidSchema(), state_factory=std_state_factory)
	def briefingnoteupdate(self, *args, **params):
		""" Update Briefing Record """

		if BriefingNotesGeneral.exists(params):
			return duplicatereturn()

		BriefingNotesGeneral.update(params)

		return stdreturn(data=BriefingNotesGeneral.get(params["briefingnotesstatusid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BriefingNoteidSchema(), state_factory=std_state_factory)
	def briefingnoteget(self, *args, **params):
		""" Get a Briefing Record """

		return stdreturn(data=BriefingNotesGeneral.get(params["briefingnotesstatusid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BriefingNoteidSchema(), state_factory=std_state_factory)
	def briefingnotedelete(self, *args, **params):
		""" Delete a Briefing Record """

		BriefingNotesGeneral.delete(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def briefingnotelist(self, *args, **params):
		""" list of briefing notes status """

		return BriefingNotesGeneral.briefingnote_list(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def has_coverage(self, *args, **params):
		""" has a coverage item go social media  """

		return stdreturn(has_coverage=IssuesGeneral.has_coverage(params))

	@expose(template="mako:prmax.templates.display.coverage_view")
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def coverage_view(self, *args, **params):
		"""Coverage View """

		return dict(sm=SolidMediaGeneral.search(params["issueid"], params["customerid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def addsearchprofile(self, *args, **params):
		""" Add a search profile for an issue """

		SolidMediaGeneral.add_solid_profile(params)

		return stdreturn(has_coverage=IssuesGeneral.has_coverage(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=IssueIdSchema(), state_factory=std_state_factory)
	def get_briefing_notes(self, *args, **params):
		""" get brefing notes """

		return stdreturn(data=IssuesGeneral.get_briefingnotes(params["issueid"]))


