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
from prcommon.model import DashboardSettingsGeneral

class DashboardSettingsSchema(PrFormSchema):
	"schema"
	customerid = validators.Int()
	windowid = validators.Int()

class DashboardSettingsUpdateSchema(PrFormSchema):
	"schema"
	windowid = validators.Int()
	customerid = validators.Int()
	dashboardsettingsmodeid = validators.Int()
	dashboardsettingsstandardid = Int2Null()
	dashboardsettingsstandardsearchbyid = Int2Null()
	questionid = Int2Null()
	questiontypeid = Int2Null()
	by_client = BooleanValidator()
	by_issue = BooleanValidator()
	clientid = Int2Null()
	issueid = Int2Null()
	chartviewid = validators.Int()
	daterangeid = validators.Int()
	groupbyid = validators.Int()

#########################################################
## controlllers
#########################################################

class DashboardSettingsController(SecureController):
	""" Charting Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DashboardSettingsUpdateSchema(), state_factory=std_state_factory)
	def dashboardsettings_update(self, *args, **params):
		""" get chart data """

		DashboardSettingsGeneral.settings_update(params)
	
		return stdreturn(data=DashboardSettingsGeneral.get_for_edit(params['customerid'],params['windowid']))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DashboardSettingsSchema(), state_factory=std_state_factory)
	def get_for_edit(self, *args, **params):
		""" get_for_edit """

		x = stdreturn(data=DashboardSettingsGeneral.get_for_edit(params['customerid'],params['windowid']))
		return x