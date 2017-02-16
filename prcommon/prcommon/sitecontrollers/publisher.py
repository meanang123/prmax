# -*- coding: utf-8 -*-
"""Publisher """
#-----------------------------------------------------------------------------
# Name:        publisher.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     07/11/2012
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, RestSchema
from prcommon.model import Publisher
from ttl.base import stdreturn, duplicatereturn

class ListSelectionSchema(PrFormSchema):
	""" schema """
	advancefeatureslistid = validators.Int()
	selection = validators.Int()

class PublisherAddSchema(PrFormSchema):
	""" schema """
	pass

class PublisherGetSchema(PrFormSchema):
	""" schema """
	publisherid = validators.Int()


class PublisherController( object ):
	""" Publisher Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of publisher  """

		if len(args) > 0:
			params["publisherid"] = int(args[0])

		return  Publisher.get_list_publisher ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PublisherAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if Publisher.exists ( params["publishername"]):
			return duplicatereturn()

		publisherid = Publisher.add( params)

		return stdreturn( data = Publisher.get( publisherid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PublisherGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if Publisher.exists ( params["publishername"],  params["publisherid"]):
			return duplicatereturn()

		Publisher.update( params)

		return stdreturn( data = Publisher.get( params["publisherid"] ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PublisherGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get publisher  """

		return stdreturn( data = Publisher.get( params["publisherid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PublisherGetSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" delete publisher  """

		Publisher.delete ( params)

		return stdreturn()

