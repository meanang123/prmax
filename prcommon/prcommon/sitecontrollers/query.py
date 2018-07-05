# -*- coding: utf-8 -*-
"""query"""
#-----------------------------------------------------------------------------
# Name:        query.py
# Purpose:     handle basic interest information
# Author:       Chris Hoy
#
# Created:     16/01/2013
# RCS-ID:      $Id:  $
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler, \
     pr_std_exception_handler_text
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, PrGridSchema, BooleanValidator
from ttl.tg.controllers import SecureController, set_output_as
from ttl.base import stdreturn
from prcommon.model import AdHocQuery, QueryHistory
from cherrypy import response

class LoadSchema(PrFormSchema):
	""" load a query schema"""

	queryhistoryid = validators.Int()

class  SaveSchema(PrFormSchema):
	""" load a query schema"""

	subject = validators.String(not_empty=True)
	query_text = validators.String(not_empty=True)
	typeid = validators.Int()

class  QuerySchema(PrFormSchema):
	""" load a query schema"""
	query_text = validators.String(not_empty=True)

class  ToResearchSchema(PrFormSchema):
	""" make a query visible to research"""
	visibletoresearch = BooleanValidator()
	queryhistoryid = validators.Int()

class QueryController( SecureController ):
	""" Common interest for all prmax applications """

	require = identity.in_any_group("admin", "research")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def execute(self, *args, **params):
		""" Execute a specific query and return the beasic results """

		return  stdreturn( data = AdHocQuery.execute ( params["query_text"] ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def queries_research(self, *args, **params):
		""" Execute a specific query and return the beasic results """

		params["typeid"] = 1
		return  QueryHistory.get_list_rest_page ( params )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def queries(self, *args, **params):
		""" Execute a specific query and return the beasic results """

		return  QueryHistory.getListPage ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def queries2(self, *args, **params):
		""" Execute a specific query and return the beasic results """

		return  QueryHistory.get_list_rest_page ( params )
	
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=LoadSchema(), state_factory=std_state_factory)
	def load(self, *args, **params):
		""" Execute a specific query and return the beasic results """

		return  stdreturn(data = QueryHistory.load ( params ) )

	@expose("")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators= QuerySchema(), state_factory=std_state_factory)
	def to_excel(self, *args, **params):
		""" Execute a specific query and return the beasic results """

		reportoutput = "\xEF\xBB\xBF" +  AdHocQuery.toexcel ( params["query_text"] )

		response_data =  set_output_as ( "csv" , reportoutput )

		response.headers["Content-type"] = "application/csv; charset=utf-8"

		return response_data

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def save(self, *args, **params):
		""" Save query """

		QueryHistory.save ( params )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SaveSchema(), state_factory=std_state_factory)
	def save2(self, *args, **params):
		""" Save query """

		QueryHistory.save ( params )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ToResearchSchema(), state_factory=std_state_factory)
	def toresearch(self, *args, **params):
		""" update query """

		QueryHistory.toresearch(params)

		return stdreturn()


__all__ = ["QueryController"]
