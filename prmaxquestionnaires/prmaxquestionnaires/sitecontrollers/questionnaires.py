# -*- coding: utf-8 -*-
"GeographicalController"
#-----------------------------------------------------------------------------
# Name:        questionnaires.py
# Purpose:
#
# Author:      Chris Hoy
# Created:    21/03/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler, validators
from prcommon.model import QuestionnairesGeneral, CirculationDates, CirculationSources, Publisher, ProductionCompany
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from ttl.tg.errorhandlers import pr_form_error_handler
from ttl.tg.validators import PRmaxOpenFormSchema, OpenRestSchema, BooleanValidator, IntNull
from ttl.base import stdreturn

class PRmaxIdSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()

class PRmaxJournalistGetSchema(PRmaxOpenFormSchema):
	"schema"

	objectid = validators.Int()
	questionnaireid = validators.Int()

class PRmaxJournalAddSchema(PRmaxOpenFormSchema):
	"schema"

	questionnaireid = validators.Int()
	alt_address = BooleanValidator()

class PRmaxUpdateJournalistSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()
	objectid = validators.Int()
	alt_address = BooleanValidator()

class PRmaxUpdateSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()

class PRmaxMainUpdateSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()
	countryid = validators.Int()

class PRmaxDeskUpdateSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()
	countryid = validators.Int()

class PRmaxUpdateResearchDetailsSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()
	right_person = BooleanValidator()

class PRmaxUpdateProfileSchema(PRmaxOpenFormSchema):
	"schema"
	questionnaireid = validators.Int()
	publisherid = IntNull()
	language1id = IntNull()
	language2id = IntNull()
	productioncompanyid = IntNull()
	circulation = IntNull()
	circulationsourceid = IntNull()
	circulationauditdateid = IntNull()
	frequencyid = IntNull()
	outletpriceid = IntNull()

class QuestionnaireidController(OpenSecureController):
	""" internal security user must be part of admin group """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxMainUpdateSchema())
	def update_main(self, *args, **params):
		""" add to cjhnage log details  """

		QuestionnairesGeneral.update_question_details(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxMainUpdateSchema())
	def update_freelance(self, *args, **params):
		""" save the freelance changes """

		QuestionnairesGeneral.update_freelance_details(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxJournalistGetSchema())
	def get_journalist(self, *args, **params):
		""" get employee details  for edit """

		return stdreturn(data=QuestionnairesGeneral.get_journalist_details(
		  params["objectid"],
		  params["questionnaireid"],
		  params["typeid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def journalists(self, *args, **params):
		""" list of live journalists  """

		if len(args) > 0:
			params["employeeid"] = int(args[0])

		return QuestionnairesGeneral.list_journalists(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def coverage(self, *args, **params):
		""" list of coverage for an outlet """

		return QuestionnairesGeneral.list_coverage(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxUpdateJournalistSchema())
	def update_contact(self, *args, **params):
		""" apply changes to a employee """

		QuestionnairesGeneral.save_feedback_contact(params)

		return stdreturn(data=QuestionnairesGeneral.get_journalist_row(params["objectid"], params["typeid"], params["questionnaireid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxUpdateProfileSchema())
	def update_profile(self, *args, **params):
		""" apply changes to a employee """

		QuestionnairesGeneral.update_profile(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxUpdateResearchDetailsSchema())
	def	update_related_outlets(self, *args, **params):
		""" update related publications """

		QuestionnairesGeneral.update_related_outlets(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxUpdateSchema())
	def	update_coverage(self, *args, **params):
		""" update coverage """

		QuestionnairesGeneral.update_coverage(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxJournalAddSchema())
	def add_contact(self, *args, **params):
		""" add  nnew contact """

		return stdreturn(data=QuestionnairesGeneral.add_contact(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxJournalistGetSchema())
	def delete_contact(self, *args, **params):
		""" delete contact """

		data = QuestionnairesGeneral.get_journalist_row(params["objectid"], params["typeid"], params["questionnaireid"])
		QuestionnairesGeneral.remove_contact(params)

		return stdreturn(data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def list_circulationdates(self, *args, **params):
		""" list of circulationdates  """

		if len(args) > 0:
			params["circulationauditdateid"] = int(args[0])

		return CirculationDates.get_list_circulationdates(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def list_circulationsources(self, *args, **params):
		""" list of circulationsources """

		if len(args) > 0:
			params["circulationsourceid"] = int(args[0])

		return CirculationSources.get_list_circulationsources(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def list_publisher(self, *args, **params):
		""" list of publisher  """

		if len(args) > 0:
			if args[0].startswith('questionnaireid'):
				params['questionnaireid'] = args[0][16:len(args[0])]
			else:
				params["publisherid"] = int(args[0])

		return Publisher.get_list_publisher_questionnaires(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema())
	def list_production(self, *args, **params):
		""" list of publisher  """

		if len(args) > 0:
			params["productioncompanyid"] = int(args[0])

		return ProductionCompany.get_list_production_companies(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxIdSchema())
	def get_details(self, *args, **params):
		""" add to cjhnage log details  """

		return stdreturn(data=QuestionnairesGeneral.get_question_details(params["questionnaireid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PRmaxDeskUpdateSchema())
	def update_desk_details(self, *args, **params):
		""" add to cjhnage log details  """

		QuestionnairesGeneral.update_question_desk(params)

		return stdreturn()
