# -*- coding: utf-8 -*-
"InterestController"
#-----------------------------------------------------------------------------
# Name:        interests
# Purpose:
#
# Author:      Chris Hoy
# Created:
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, exception_handler, identity, \
     error_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema
from prcommon.model import InterestsResearch, Interests, OutletInterests, \
     EmployeeInterests, EmployeeInterests
from prcommon.sitecontrollers.interests import InterestCommonController
from ttl.base import stdreturn, duplicatereturn
import ttl.tg.validators as tgvalidators
import prcommon.Constants as Constants


class InterestIdSchema(PrFormSchema):
	""" validates a form that has the interestid"""
	interestid = validators.Int()

class InterestNameFilterSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	interestname = validators.String(not_empty=True)
	parentinterestid = validators.Int()

class InterestWhereOutletSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	outletid = validators.Int()
	interestid = validators.Int()

class InterestWhereEmployeeSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	employeeid = validators.Int()
	interestid = validators.Int()

class InterestMoveSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	frominterestid = validators.Int()
	tointerestid = validators.Int()


class InterestController(SecureController, InterestCommonController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" Interests """

		if args:
			params["interestid"] = int(args[0])

		return InterestsResearch.get_rest_page_research(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory = std_state_factory)
	def research_where_used_outlet( self, *args, **params):
		""" returns list of outlet where interest used """

		return InterestsResearch.research_get_where_used_outlet_rest(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory = std_state_factory)
	def research_where_used_employee( self, *args, **params):
		""" returns list of employees where interest used """

		return InterestsResearch.research_get_where_used_employee_rest(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestNameFilterSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_add(self, *args, **params):
		"""Add a new interest for the research system"""

		if Interests.tag_exists(params['interestname'], -1 ,
		                       Constants.Interest_Type_Standard):
			return duplicatereturn()

		interestid = Interests.research_add(params )

		return stdreturn( data = Interests.get(interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestNameFilterSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_rename(self, *args, **params):
		"""Add a new interest for the research system"""

		if InterestsResearch.research_exists(params['interestname'], params["interestid"]):
			return duplicatereturn()

		interestid = InterestsResearch.research_update(params )

		return stdreturn(data = Interests.get(interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestIdSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete	(self, *args, **params):
		""" Delete an interest """

		data = Interests.get(params["interestid"])
		InterestsResearch.research_delete( params )

		return stdreturn( data = data  )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestWhereOutletSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete_from_outlet	(self, *args, **params):
		""" Delete the interest from the outlet """

		OutletInterests.delete ( params )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestWhereEmployeeSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete_from_employee(self, *args, **params):
		""" Delete the interest from the employee """

		EmployeeInterests.delete ( params )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestMoveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_move_interest(self, *args, **params):
		""" Move all the location from one interest to another """

		InterestsResearch.move ( params )

		return stdreturn()
