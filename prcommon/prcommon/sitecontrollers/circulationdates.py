# -*- coding: utf-8 -*-
"""CirculationDates """
#-----------------------------------------------------------------------------
# Name:        circulationdates.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     07/11/2012
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, OpenRestSchema
from prcommon.model import CirculationDates
from ttl.base import stdreturn, duplicatereturn

class CirculationDatesAddSchema(PrFormSchema):
	""" schema """
	pass

class CirculationDatesGetSchema(PrFormSchema):
	""" schema """
	circulationauditdateid = validators.Int()


class CirculationDatesController( object ):
	""" CirculationDates Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of circulationdates  """

		if len(args) > 0:
			params["circulationauditdateid"] = int(args[0])

		return  CirculationDates.get_list_circulationdates ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationDatesAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if CirculationDates.exists ( params["circulationauditdatedescription"]):
			return duplicatereturn()

		circulationauditdateid = CirculationDates.add( params)

		return stdreturn( data = CirculationDates.get( circulationauditdateid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationDatesGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if CirculationDates.exists ( params["circulationauditdatedescription"],  params["circulationauditdateid"]):
			return duplicatereturn()

		CirculationDates.update( params)

		return stdreturn( data = CirculationDates.get( params["circulationauditdateid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationDatesGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get circulationdates  """

		return stdreturn( data = CirculationDates.get( params["circulationauditdateid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationDatesGetSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" delete """

		CirculationDates.delete ( params["circulationauditdateid"] )

		return stdreturn()
