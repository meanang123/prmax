# -*- coding: utf-8 -*-
"searchexclusions"
#-----------------------------------------------------------------------------
# Name:        searchexclusions.py
# Purpose:     option to add/delete/list outlets/employees from exclustion list
#
# Author:      Chris Hoy
#
# Created:     30/06/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from prcommon.model import ExclusionList, UnsubscribeGeneral
from ttl.tg.errorhandlers import pr_form_error_handler, \
	 pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema
from ttl.base import stdreturn, duplicatereturn



############################################################
## Validators
############################################################
class ExclusionAddOutletSchema(PrFormSchema):
	""" add an outlet """
	outletid = validators.Int()

class ExclusionAddEmployeeSchema(PrFormSchema):
	"""  add an employee """
	employeeid = validators.Int()

class ExclusionDeleteSchema(PrFormSchema):
	""" delete an entry """
	exclusionlistid = validators.Int()

############################################################
## Controller
############################################################
class SearchExclusionController(SecureController):
	""" Exclustion from search controller """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" get a list of all the exclustion
		"""
		return ExclusionList.getDisplayPage( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ExclusionAddOutletSchema(), state_factory=std_state_factory)
	def outlet_add(self, *argv, **params):
		""" Add a outlet too the exclusion list"""

		if ExclusionList.ExistsOutlet ( params ) :
			return duplicatereturn()

		ExclusionList.outlet_add ( params )
		return stdreturn ( )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ExclusionAddEmployeeSchema(), state_factory=std_state_factory)
	def employee_add(self, *argv, **params):
		""" Add a outlet too the exclusion list"""

		if ExclusionList.ExistsEmployee ( params ) :
			return duplicatereturn()

		ExclusionList.employee_add ( params )
		return stdreturn ( )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ExclusionDeleteSchema(), state_factory=std_state_factory)
	def exclusion_delete(self, *argv, **params):
		""" Delete entry from exclusion list """

		ExclusionList.exclusion_delete ( params )
		return stdreturn ( )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list_unsub(self, *args, **params):
		""" get a list of all the unsubscribed email addresses
		"""
		return UnsubscribeGeneral.list_unsub( params )
