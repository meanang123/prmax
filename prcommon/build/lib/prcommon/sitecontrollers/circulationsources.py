# -*- coding: utf-8 -*-
"""CirculationSources """
#-----------------------------------------------------------------------------
# Name:        circulationsources.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     07/11/2012
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, \
     PrGridSchema, ExtendedDateValidator, OpenRestSchema
import ttl.tg.validators as tgvalidators
from prcommon.model import CirculationSources
from ttl.base import stdreturn, duplicatereturn, samereturn

class CirculationSourcesAddSchema(PrFormSchema):
	""" schema """
	pass

class CirculationSourcesGetSchema(PrFormSchema):
	""" schema """
	circulationsourceid = validators.Int()


class CirculationSourcesController( object ):
	""" CirculationSources Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of circulationsources  """

		if len(args) > 0:
			params["circulationsourceid"] = int(args[0])

		return  CirculationSources.get_list_circulationsources ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationSourcesAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if CirculationSources.exists ( params["circulationsourcedescription"]):
			return duplicatereturn()

		circulationsourceid = CirculationSources.add( params)

		return stdreturn( data = CirculationSources.get( circulationsourceid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationSourcesGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if CirculationSources.exists ( params["circulationsourcedescription"],  params["circulationsourceid"]):
			return duplicatereturn()

		CirculationSources.update( params)

		return stdreturn( data = CirculationSources.get( params["circulationsourceid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CirculationSourcesGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get circulationsources  """

		return stdreturn( data = CirculationSources.get( params["circulationsourceid"]))
