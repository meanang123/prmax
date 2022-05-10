# -*- coding: utf-8 -*-
"""MarketSector """
#-----------------------------------------------------------------------------
# Name:        marketsector.py
# Purpose:
# Author:      Stamatia Vatsi
#
# Created:     May 2022
# Copyright:   (c) 2022

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  PrFormSchema, OpenRestSchema
from prcommon.model import MarketSector
from ttl.base import stdreturn, duplicatereturn

class MarketSectorAddSchema(PrFormSchema):
	""" schema """
	pass

class MarketSectorGetSchema(PrFormSchema):
	""" schema """
	marketsectorid = validators.Int()


class MarketSectorController(object):
	""" MarketSector Controller """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenRestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of market sectors"""

		if len(args) > 0:
			params["marketsectorid"] = int(args[0])
			
		return MarketSector.get_list_marketsector(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MarketSectorAddSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def add(self, *args, **params):
		""" Save the details about an advance feature  """

		if MarketSector.exists ( params["marketsectordescription"]):
			return duplicatereturn()

		marketsectorid = MarketSector.add( params)

		return stdreturn( data = MarketSector.get(marketsectorid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MarketSectorGetSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def update(self, *args, **params):
		""" Save the details about an advance feature  """

		if MarketSector.exists( params["marketsectordescription"],  params["marketsectorid"]):
			return duplicatereturn()

		MarketSector.update( params)

		return stdreturn(data = MarketSector.get( params["marketsectorid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MarketSectorGetSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get market sectors  """

		return stdreturn(data = MarketSector.get( params["marketsectorid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MarketSectorGetSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" delete """

		MarketSector.delete(params["marketsectorid"])

		return stdreturn()
