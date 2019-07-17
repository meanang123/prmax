# -*- coding: utf-8 -*-
"""OutletDeskController """
#-----------------------------------------------------------------------------
# Name:        desks.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     04/03/2013
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler, identity
from prcommon.model import OutletDeskGeneral
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory, PrFormSchema, OpenRestSchema, BooleanValidator, ISODateValidator
from ttl.base import stdreturn, duplicatereturn

class OutletDeskAddSchema(PrFormSchema):
	""" schema """
	outletid = validators.Int()
	research_required = BooleanValidator()
	researchfrequencyid = validators.Int()
	quest_month_1 = validators.Int()
	quest_month_2 = validators.Int()
	quest_month_3 = validators.Int()
	quest_month_4 = validators.Int()
	has_address = BooleanValidator()

class OutletDeskUpdateSchema(PrFormSchema):
	""" schema """
	outletdeskid = validators.Int()
	research_required = BooleanValidator()
	researchfrequencyid = validators.Int()
	quest_month_1 = validators.Int()
	quest_month_2 = validators.Int()
	quest_month_3 = validators.Int()
	quest_month_4 = validators.Int()
	has_address = BooleanValidator()
	last_research_completed = ISODateValidator()
	last_questionaire_sent = ISODateValidator()
	required_old = BooleanValidator()
	required_new = BooleanValidator()
	has_address_old = BooleanValidator()
	has_address_new = BooleanValidator()

class OutletDeskGetSchema(PrFormSchema):
	""" schema """
	outletdeskid = validators.Int()


class OutletDeskController(object):
	""" OutletDeskController """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of outletdesks  """

		if len(args) > 0:
			params["outletdeskid"] = int(args[0])

		return OutletDeskGeneral.get_list_desks(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list_outlet_desks(self, *args, **params):
		""" list of outletdesks from lookup"""

		if len(args) > 0:
			params["outletid"] = int(args[0])

		if len(args) > 1:
			params["outletdeskid"] = int(args[1])

		return OutletDeskGeneral.get_list_desks(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletDeskAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Add a new outlet desk """

		if OutletDeskGeneral.exists(params["deskname"], -1, params["outletid"]):
			return duplicatereturn()

		outletdeskid = OutletDeskGeneral.add(params)

		return stdreturn(data=OutletDeskGeneral.get(outletdeskid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletDeskUpdateSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" update a outlet desk """

		if OutletDeskGeneral.exists(params["deskname"], params["outletdeskid"], -1):
			return duplicatereturn()

		OutletDeskGeneral.update(params)

		return stdreturn(data=OutletDeskGeneral.get(params["outletdeskid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletDeskGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get details for outlet desk  """

		return stdreturn(data=OutletDeskGeneral.get(params["outletdeskid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OutletDeskGetSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" delete """

		OutletDeskGeneral.delete(params)

		return stdreturn()
