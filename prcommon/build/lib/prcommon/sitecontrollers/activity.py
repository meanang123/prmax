# -*- coding: utf-8 -*-
""" Statements controller """
#-----------------------------------------------------------------------------
# Name:        statements.py
# Purpose:
#
# Author:
# Created:     Sept 2017
# Copyright:  (c) 2017

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, ISODateValidatorNull, Int2Null, RestSchema, DateRangeValidator
from ttl.base import stdreturn
from prcommon.model import TasksGeneral, User, Statements
from prcommon.model.customer.activity import Activity
from prcommon.model.crm2.tasktypes import TaskType

class ActivityIdSchema(PrFormSchema):
	"schema"

	activityid = validators.Int()

class ActivitySchema(PrGridSchema):
	"schema"

#	activityid = validators.Int()
#	customerid = validators.Int()
#	userid = validators.Int()
	drange = DateRangeValidator()
#	allow_extra_fields = True


class ActivityController(SecureController):
	""" Customer's Activity Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ActivitySchema(), state_factory=std_state_factory)
	def activity_grid(self, *argv, **params):
		""" return a page of statements for the grid"""

		return Activity.get_grid_page(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def objecttype_list(self, *argv, **params):
		""" return activity object type list"""

		params["icustomerid"] = params["customerid"]
		return Activity.objecttype_list(params)
