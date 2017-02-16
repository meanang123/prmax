# -*- coding: utf-8 -*-
""" Questions controller """
#-----------------------------------------------------------------------------
# Name:        questions.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     02/06/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, BooleanValidator, FloatToIntValidator, Int2Null
from ttl.base import stdreturn, duplicatereturn
from prcommon.model import QuestionsGeneral, AnalyseGeneral

class QuestionAddSchema(PrFormSchema):
	"schema"

	questiontypeid = validators.Int()
	default_answer_boolean = BooleanValidator()
	default_answer_number = validators.Int()
	default_answer_currency = FloatToIntValidator()
	clientid = Int2Null()
	issueid = Int2Null()
	restrict = validators.Int()

class QuestionUpdateSchema(PrFormSchema):
	"schema"

	questionid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	restrict = validators.Int()

class QuestionIDSchema(PrFormSchema):
	"schema"

	questionid = validators.Int()

class QuestionUpdateDefaultsSchema(PrFormSchema):
	"schema"

	questionid = validators.Int()
	default_answer_boolean = BooleanValidator()
	default_answer_number = validators.Int()
	default_answer_currency = FloatToIntValidator()
	default_answer_answerid = Int2Null()

class QuestionAnswerUpdateSchema(PrFormSchema):
	"schema"

	questionid = validators.Int()
	questionanswerid = validators.Int()

class QuestionAnswerAddSchema(PrFormSchema):
	"schema"

	questionid = validators.Int()

class QuestionAnswerIdSchema(PrFormSchema):
	"schema"
	questionanswerid = validators.Int()


#########################################################
## controlllers
#########################################################

class QuestionsController(SecureController):
	""" Questions Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_by_source(self, *args, **params):
		""" list of questions """

		if args:
			params['questionid'] = int(args[0])

		return QuestionsGeneral.list_by_source(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionAddSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" add  """

		if QuestionsGeneral.question_exists(params["questiontext"],
		                                    None,
		                                    params["clientid"],
		                                    params["issueid"],
		                                    params["customerid"]):
			return duplicatereturn()

		(params["questionid"], params["clippingsanalysistemplateid"]) = QuestionsGeneral.add_question(params)
		if params["questionid"]:
			data = QuestionsGeneral.get_display_line(params["questionid"])
		else:
			data = AnalyseGeneral.get_display_line(params["clippingsanalysistemplateid"])

		return stdreturn(data=data)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionIDSchema(), state_factory=std_state_factory)
	def restore_question(self, *args, **params):
		""" restore_question  """

		QuestionsGeneral.restore_question(params)

		return stdreturn(data=QuestionsGeneral.get_display_line(params["questionid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionIDSchema(), state_factory=std_state_factory)
	def remove_question(self, *args, **params):
		""" remove question  """

		return stdreturn(msg=QuestionsGeneral.remove_question(params["questionid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionIDSchema(), state_factory=std_state_factory)
	def get_question_from_edit(self, *args, **params):
		""" remove question  """


		return stdreturn(data=QuestionsGeneral.get_question_from_edit(params["questionid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def answers_list(self, *args, **params):
		""" list of questions """

		if args:
			params['questionanswerid'] = int(args[0])

		return QuestionsGeneral.answers_list(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionUpdateSchema(), state_factory=std_state_factory)
	def update_question_details(self, *args, **params):
		""" update_question_details  """

		if QuestionsGeneral.question_exists(params["questiontext"],
		                                    params["questionid"],
		                                    params["clientid"],
		                                    params["issueid"],
		                                    params["customerid"]):
			return duplicatereturn()

		QuestionsGeneral.update_question(params)

		return stdreturn(data=QuestionsGeneral.get_display_line(params["questionid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionUpdateDefaultsSchema(), state_factory=std_state_factory)
	def update_question_defaults(self, *args, **params):
		""" update_question_defaults  """

		QuestionsGeneral.update_question_defaults(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionAnswerUpdateSchema(), state_factory=std_state_factory)
	def rename_answer(self, *args, **params):
		""" rename_answer  """

		if QuestionsGeneral.answer_exists(params["questionid"],
		                                  params["questionanswerid"],
		                                  params["answertext"]):
			return duplicatereturn()

		QuestionsGeneral.rename_answer(params)

		return stdreturn(data=QuestionsGeneral.get_answer_for_display(params["questionanswerid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionAnswerAddSchema(), state_factory=std_state_factory)
	def add_answer(self, *args, **params):
		""" add_answer  """

		if QuestionsGeneral.answer_exists(params["questionid"],
		                                  None,
		                                  params["answertext"]):
			return duplicatereturn()

		questionanswerid = QuestionsGeneral.add_answer(params)

		return stdreturn(data=QuestionsGeneral.get_answer_for_display(questionanswerid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionAnswerIdSchema(), state_factory=std_state_factory)
	def answer_delete(self, *args, **params):
		""" delete_answer  """

		QuestionsGeneral.answer_delete(params)

		return stdreturn()
