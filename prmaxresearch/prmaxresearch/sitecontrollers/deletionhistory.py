# -*- coding: utf-8 -*-
"DeletionHistoryController"
#-----------------------------------------------------------------------------
# Name:        deletionhistory
# Purpose:
#
# Author:      Stamatia Vatsi
# Created:	   August 2019
# Copyright:   (c) 2019
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, exception_handler, identity, \
     error_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import SecureController
from  ttl.tg.errorhandlers import pr_form_error_handler
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, IntNull, BooleanValidator, ISODateValidator
from prcommon.model.deletionhistory import DeletionHistory
from ttl.base import stdreturn, duplicatereturn



class DeletionHistorySchema(PrFormSchema):
	"schema"
	deletionhistoryid = validators.Int()
	reasoncodeid = validators.Int()
	researchprojectid = IntNull()
	deletionhistorytypeid = IntNull()
	iuserid = validators.Int()
	deletiondate = ISODateValidator()

class DeletionHistoryAddSchema(PrFormSchema):
	"schema"
	reasoncodeid = validators.Int()
	researchprojectid = IntNull()
	deletionhistorytypeid = IntNull()
	iuserid = validators.Int()
	deletiondate = ISODateValidator()

class DeletionHistoryGetSchema(PrFormSchema):
	"schema"
	deletionhistoryid = validators.Int()

class DeletionHistoryController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" get list of countries """

		return DeletionHistory.get_list_deletionhistory(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeletionHistoryAddSchema(), state_factory=std_state_factory)
	def deletionhistory_add(self, *args, **params):
		""" add a deletionhistory"""

		params["deletionhistoryid"] = DeletionHistory.add(params)
		return stdreturn(deletionhistory = DeletionHistory.get(params["deletionhistoryid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeletionHistorySchema(), state_factory=std_state_factory)
	def deletionhistory_update(self, *args, **params):
		""" update a deletionhistory record  """

		DeletionHistory.update(params)
		return stdreturn(deletionhistory = DeletionHistory.get(params["deletionhistoryid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeletionHistoryGetSchema(), state_factory=std_state_factory)
	def deletionhistory_get(self, *args, **params):
		""" update a deletionhistory record  """

		data = DeletionHistory.get(params["deletionhistoryid"])
		return stdreturn(data = data)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def get_outlet_list(self, *args, **params ):
		""" get list of deleted outlets """

		return DeletionHistory.get_list_outlets(params)
