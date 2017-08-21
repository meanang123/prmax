# -*- coding: utf-8 -*-
""" Analyse controller """
#-----------------------------------------------------------------------------
# Name:        analyse.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     02/07/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, Int2Null
from ttl.base import stdreturn
from prcommon.model import AnalyseGeneral, ClippingsGeneral, AnalyseGlobal

class ClippingsAnalysisTemplateidSchema(PrFormSchema):
	"schema"

	clippingsanalysistemplateid = validators.Int()

class ClippingsIdSchema(PrFormSchema):
	"schema"

	clippingid = validators.Int()

class QuestionToAnalysisSchema(PrFormSchema):
	"schema"

	questionid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()

#########################################################
## controlllers
#########################################################

class AnalyseController(SecureController):
	""" Questions Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_by_source(self, *args, **params):
		""" list of questions for client/issue"""

		return AnalyseGeneral.list_by_source(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingsAnalysisTemplateidSchema(), state_factory=std_state_factory)
	def remove_question(self, *args, **params):
		""" remove question  """

		AnalyseGeneral.remove_question(params["clippingsanalysistemplateid"])

		return stdreturn()


	@expose(template="mako:prmax.templates.clippings.analyis_view")
	@validate(validators=ClippingsIdSchema(), state_factory=std_state_factory)
	def analysis_clip_view(self, *args, **params):

		return AnalyseGeneral.get_analyse_view_info(params['clippingid'])

	@expose(template="mako:prmax.templates.clippings.analyis_view_amd")
	@validate(validators=ClippingsIdSchema(), state_factory=std_state_factory)
	def analysis_clip_view_amd(self, *args, **params):

		return AnalyseGeneral.get_analyse_view_info(params['clippingid'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingsIdSchema(), state_factory=std_state_factory)
	def update(self, *args, **params):
		""" remove question  """

		AnalyseGeneral.update(params)

		return stdreturn(data=ClippingsGeneral.get_for_display(params['clippingid']))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionToAnalysisSchema(), state_factory=std_state_factory)
	def add_question_to_analysis(self, *args, **params):
		""" Add question to client/campaign  """

		params["clippingsanalysistemplateid"] = AnalyseGeneral.add_question_to_analysis(params)

		return stdreturn(data=AnalyseGeneral.get_display_line(params["clippingsanalysistemplateid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingsAnalysisTemplateidSchema(), state_factory=std_state_factory)
	def delete_question_to_analysis(self, *args, **params):
		""" remove from global anlsysis """

		AnalyseGeneral.delete_question_to_analysis(params["clippingsanalysistemplateid"])

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def global_analysis(self, *args, **params):
		""" list of question that are marked as global"""

		return AnalyseGlobal.global_analysis(params)
