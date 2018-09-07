# -*- coding: utf-8 -*-
"""crm and notes """
#-----------------------------------------------------------------------------
# Name:        crm.py
# Purpose:     Notes
#
# Author:      Chris Hoy
#
# Created:     29/05/2008
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, IntNull, JSONValidator, BooleanValidator, \
     ISODateValidator, ISODateTimeValidator, DateRangeValidator, Int2Null
from ttl.base import stdreturn, duplicatereturn

from prcommon.model import ContactHistory, PRNotesGeneral, ContactHistoryGeneral, TasksGeneral, ContactHistoryHistory, \
     ContactHistoryUserDefine, ContactHistoryResponses, EmailTemplates
from prcommon.model.crm2.statements import Statements
from prcommon.model import Customer
from prcommon.sitecontrollers.crm.issue import IssueController
from prcommon.sitecontrollers.crm.tasks import TaskController
from prcommon.sitecontrollers.crm.documents import DocumentController
#from prcommon.sitecontrollers.crm.sm import SolidMediaController


#########################################################
## validators
#########################################################

class PrCrmNoteSchema(PrFormSchema):
	"""schema """
	contacthistoryid = validators.Int()

class PRPrivateNotes(PrFormSchema):
	"schema"
	outletid = IntNull()
	employeeid = IntNull()

class AddNoteSchema(PrFormSchema):
	"schema"
	outletid = IntNull()
	employeeid = IntNull()
	issueid = IntNull()
	extraissues = JSONValidator()
	follow_up_view_check = BooleanValidator()
	chud1id = IntNull()
	chud2id = IntNull()
	chud3id = IntNull()
	chud4id = IntNull()
	clientid = IntNull()
	documentid = IntNull()
	emailtemplateid = Int2Null()

class UpdateNoteSchema(PrFormSchema):
	"schema"
	contacthistoryid = validators.Int()
	issueid = IntNull()
	extraissues = JSONValidator()
	follow_up_view_check = BooleanValidator()
	contacthistorytypeid = validators.Int()
	contacthistorystatusid = validators.Int()
	taken = ISODateTimeValidator()
	taken_by = validators.Int()
	follow_up_date = ISODateValidator()
	follow_up_ownerid = validators.Int()
	chud1id = IntNull()
	chud2id = IntNull()
	chud3id = IntNull()
	chud4id = IntNull()
	clientid = Int2Null()
	documentid = Int2Null()

class CrmHistorySchema(PrFormSchema):
	"""schema """
	contacthistoryhistoryid = validators.Int()

class UpdateHistorySchema(PrFormSchema):
	"""schema """
	contacthistoryhistoryid = validators.Int()
	contacthistoryid = validators.Int()

class CrmIdSchema(PrFormSchema):
	"""schema """
	contacthistoryid = validators.Int()

class UpdateResponseSchema(PrFormSchema):
	"""schema """
	contacthistoryid = validators.Int()
	exclude_images = BooleanValidator()
	statementid = Int2Null()

class PrUpdateSettingsSchema(PrFormSchema):
		"""schema """
		crm_user_define_1_on = BooleanValidator()
		crm_user_define_2_on = BooleanValidator()
		crm_user_define_3_on = BooleanValidator()
		crm_user_define_4_on = BooleanValidator()

class PrUpdateSettingsDescSchema(PrFormSchema):
		"""schema """
		pass

class PrUpdateSettingsLayoutSchema(PrFormSchema):
	"""schema"""
	crm_analysis_page_1 = BooleanValidator()
	crm_outcome_page_1 = BooleanValidator()
	crm_response_page_1 = BooleanValidator()
	crm_briefingnotes_page_1 = BooleanValidator()

class PrAddUserDefinedSchema(PrFormSchema):
	"""schema"""
	fieldid = validators.Int()

class PrDeleteUserDefinedSchema(PrFormSchema):
	"""schema"""
	contacthistoryuserdefinid = validators.Int()

class CrmNotesGridSchema(PrGridSchema):
	"schema"
	drange = DateRangeValidator()



#########################################################
## controlllers
#########################################################

class CrmController(SecureController):
	"""  Relationship management system """

	issues = IssueController()
	tasks = TaskController()
	documents = DocumentController()
	#sm = SolidMediaController()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def addnote(self, *args, **params):
		""" Add a not to the customers contact history """

		return stdreturn(data=ContactHistory.getRecord(ContactHistory.add(params)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CrmNotesGridSchema(), state_factory=std_state_factory)
	def filter(self, *args, **params):
		""" returns the grid details """

		return ContactHistoryGeneral.get_grid_page(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def filter_by_object(self, *args, **params):
		""" returns the grid details """

		if  "outletid" not  in params and "employeeid" not  in params:
			return ContactHistoryGeneral.EMPTYGRID

		return ContactHistoryGeneral.get_grid_page(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCrmNoteSchema(), state_factory=std_state_factory)
	def getnote(self, *args, **params):
		""" get notes """

		return stdreturn(data=ContactHistoryGeneral.get_record(params["contacthistoryid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCrmNoteSchema(), state_factory=std_state_factory)
	def updatenote(self, *args, **params):
		""" Update the details about a note """

		ContactHistory.update(params)

		return stdreturn(data=ContactHistory.getRecord(params["contacthistoryid"], True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCrmNoteSchema(), state_factory=std_state_factory)
	def deletenote(self, *args, **params):
		""" Delete a contact history note """

		ContactHistory.deleteNote(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRPrivateNotes(), state_factory=std_state_factory)
	def get_private_notes(self, *args, **params):
		"Get the private notes for "

		return stdreturn(data=PRNotesGeneral.get_notes(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRPrivateNotes(), state_factory=std_state_factory)
	def update_private_notes(self, *args, **params):
		"Get the private notes for "

		PRNotesGeneral.update_private_notes(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AddNoteSchema(), state_factory=std_state_factory)
	def add_note(self, *args, **params):
		""" Add a not to the customers contact history """

		(contacthistoryid, taskid) = ContactHistoryGeneral.add_note(params)
		if taskid:
			task = TasksGeneral.get(taskid)
		else:
			task = None

		return stdreturn(data=dict(ch=ContactHistoryGeneral.get_record(contacthistoryid),
		                           task=task))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateNoteSchema(), state_factory=std_state_factory)
	def update_note(self, *args, **params):
		""" Update contact history record """

		ContactHistoryGeneral.update_note(params)

		return stdreturn(data=ContactHistoryGeneral.get_edit(params["contacthistoryid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateResponseSchema(), state_factory=std_state_factory)
	def update_response(self, *args, **params):
		""" Update contact history response record """

		chh = ContactHistoryGeneral.update_response(params)

		return stdreturn(data=ContactHistoryHistory.query.get(chh.contacthistoryhistoryid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrCrmNoteSchema(), state_factory=std_state_factory)
	def get_edit(self, *args, **params):
		""" get notes for ecit  """

		return stdreturn(data=ContactHistoryGeneral.get_edit(params["contacthistoryid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def ch_history(self, *args, **params):
		""" returns usage """

		return ContactHistoryGeneral.ch_history(params)

	@expose(template="mako:prmax.templates.display.ch_history")
	@validate(validators=CrmHistorySchema(), state_factory=std_state_factory)
	def history_view(self, *args, **params):

		chh = ContactHistoryHistory.query.get(params["contacthistoryhistoryid"])
		chres = {}
		statementdescription = ''
		briefing_notes_description = Customer.query.get(params['customerid']).briefing_notes_description
		if chh and chh.contacthistoryresponseid:
			chres = ContactHistoryResponses.query.get(chh.contacthistoryresponseid)
			if chres and chres.statementid:
				statment = Statements.query.get(chres.statementid)
				statementdescription = statment.statementdescription

		return dict(chh=chh, chres=chres, statementdescription=statementdescription, briefing_notes_description=briefing_notes_description)


	@expose(template="mako:prmax.templates.display.basic_details_page")
	@validate(validators=CrmIdSchema(), state_factory=std_state_factory)
	def basic_details_page(self, *args, **params):

		return ContactHistoryGeneral.get_edit(params["contacthistoryid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def load_settings(self, *args, **params):
		""" Load Settings  """

		return stdreturn(data=ContactHistoryGeneral.load_settings(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUpdateSettingsSchema(), state_factory=std_state_factory)
	def update_settings(self, *args, **params):
		""" Update Settings  """

		ContactHistoryGeneral.update_settings(params)

		return stdreturn(data=ContactHistoryGeneral.load_settings(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUpdateSettingsDescSchema(), state_factory=std_state_factory)
	def update_settings_desc(self, *args, **params):
		""" Update Settings  """

		ContactHistoryGeneral.update_settings_desc(params)

		return stdreturn(data=ContactHistoryGeneral.load_settings(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUpdateSettingsLayoutSchema(), state_factory=std_state_factory)
	def update_settings_layout(self, *args, **params):
		""" Update Settings  """

		ContactHistoryGeneral.update_settings_layout(params)

		return stdreturn(data=ContactHistoryGeneral.load_settings(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def user_defined(self, *args, **params):
		""" returns usage """

		return ContactHistoryGeneral.user_defined(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrAddUserDefinedSchema(), state_factory=std_state_factory)
	def user_defined_add(self, *args, **params):
		""" add a field """

		if ContactHistoryGeneral.user_defined_exists(params):
			return duplicatereturn()

		contacthistoryuserdefinid = ContactHistoryGeneral.user_defined_add(params)

		return stdreturn(data=ContactHistoryUserDefine.query.get(contacthistoryuserdefinid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrDeleteUserDefinedSchema(), state_factory=std_state_factory)
	def user_defined_delete(self, *args, **params):
		""" remove a field """

		ContactHistoryGeneral.user_defined_delete(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def resend(self, *args, **params):
		""" remove a field """

		if 'statementid' in params:
			Statements.resend(params)
		elif 'emailtemplateid' in params:
			EmailTemplates.resend(params)

		return stdreturn()
