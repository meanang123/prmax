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
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, ISODateValidatorNull, Int2Null
from ttl.base import stdreturn
from prcommon.model import TasksGeneral, User, Statements
from prcommon.model.crm2.tasktypes import TaskType

class StatementAddSchema(PrFormSchema):
	""" schema """
#	statementid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	customerid = validators.Int()

class StatementUpdateSchema(PrFormSchema):
	""" schema """
	statementid = validators.Int()
	customerid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()

class StatementIdSchema(PrFormSchema):
	"schema"

	statementid = validators.Int()
	
class StatementSchema(PrFormSchema):
	"schema"

	statementid = validators.Int()
	customerid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	

class StatementController(SecureController):
	""" Statement Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=StatementAddSchema(), state_factory=std_state_factory)
	def statement_add(self, *args, **params):
		""" add a new statement to the system  """

		statementid = Statements.add(params)

		return stdreturn(data=Statements.get(statementid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=StatementUpdateSchema(), state_factory=std_state_factory)
	def statement_update(self, *args, **params):
		""" update a task system  """

		Statements.update(params)

		return stdreturn(data=Statements.get(params["statementid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=StatementSchema(), state_factory=std_state_factory)
	def statement_get(self, *args, **params):
		""" Get a record """

		return stdreturn(data=Statements.get(params["statementid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)	
	def statement_grid(self, *argv, **params):
		""" return a page of statements for the grid"""

		return Statements.get_grid_page(params)	


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=StatementIdSchema(), state_factory=std_state_factory)
	def statement_delete(self, *args, **params):
		"""Delete the items selected by the user """

		Statements.delete(params)

		return stdreturn()
	

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)	
	def statement_engagements_grid(self, *argv, **params):
		""" return a page of engagements for the grid"""

		if 'statementid' not in params:
			return Statements.EMPTYGRID
		else:
			params['statementid'] = int(params['statementid'])

		return Statements.get_engagements_grid_page(params)	
	