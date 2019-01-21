# -*- coding: utf-8 -*-
""" Analyse controller """
#-----------------------------------------------------------------------------
# Name:        charting.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     25/07/2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, Int2Null, DateRangeValidator, BooleanValidator
from ttl.base import stdreturn
from prcommon.model import ClippingsChartGeneral

class ChartSchema(PrFormSchema):
	"schema"

	clientid = Int2Null()
	issueid = Int2Null()
	daterange = DateRangeValidator()
	
class QuestionChartSchema(PrFormSchema):
	"schema"
	questionid = validators.Int() 
	questiontypeid = validators.Int()
	option = Int2Null()
	daterange = DateRangeValidator()

class ChartDashboardNewSchema(PrFormSchema):
	"schema"

	customerid = validators.Int()

#########################################################
## controlllers
#########################################################

class ChartingController(SecureController):
	""" Charting Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ChartSchema(), state_factory=std_state_factory)
	def get_chart_data(self, *args, **params):
		""" get chart data """

		return stdreturn(data=ClippingsChartGeneral.get_chart_data(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=QuestionChartSchema(), state_factory=std_state_factory)
	def get_questions_chart_data(self, *args, **params):
		""" get chart data """

		return stdreturn(data=ClippingsChartGeneral.get_questions_chart_data(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ChartDashboardNewSchema(), state_factory=std_state_factory)
	def get_dashboard_chart_data(self, *args, **params):
		""" get chart data """

		return stdreturn(data=ClippingsChartGeneral.get_dashboard_chart_data(params))


