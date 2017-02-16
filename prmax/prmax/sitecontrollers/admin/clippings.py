# -*- coding: utf-8 -*-
"""prospect regions """
#-----------------------------------------------------------------------------
# Name:        clippings.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     20/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, ISODateValidator, Int2Null, BooleanValidator, JSONValidator
from prcommon.model import ClippingsOrderGeneral, ClippingsPrices, Client, IssuesGeneral
from prcommon.model.lookups import ClippingSource

from ttl.base import stdreturn

class AddOrderSchema(PrFormSchema):
	"schema"
	icustomerid = validators.Int()
	startdate = ISODateValidator()
	enddate = ISODateValidator()
	clippingspriceid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	pricecodeid = validators.Int()
	clippingsourceid = validators.Int()
	countries = JSONValidator()
	languages = JSONValidator()
	clippingstypes = JSONValidator()

class UpdateOrderSchema(PrFormSchema):
	"schema"
	clippingsorderid = validators.Int()
	icustomerid = validators.Int()
	startdate = ISODateValidator()
	enddate = ISODateValidator()
	clippingspriceid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	pricecodeid = validators.Int()
	resendsupemail = BooleanValidator()
	clippingsourceid = validators.Int()
	countries = JSONValidator()
	languages = JSONValidator()
	clippingstypes = JSONValidator()

class CancelOrderSchema(PrFormSchema):
	"schema"
	clippingsorderid = validators.Int()
	icustomerid = validators.Int()
	startdate = ISODateValidator()
	enddate = ISODateValidator()
	clippingspriceid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	pricecodeid = validators.Int()
	clippingsourceid = validators.Int()
	countries = JSONValidator()
	languages = JSONValidator()
	clippingstypes = JSONValidator()


class ClippingsOrderSchema(PrFormSchema):
	"schema"
	clippingsorderid = validators.Int()

class ClippingsController(SecureController):
	""" handles all soe stuff for admin """

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_orders(self, *args, **params):
		""" list of regions """

		if args:
			params["clippingsorderid"] = int(args[0])

		return ClippingsOrderGeneral.list_orders(params)

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=AddOrderSchema(), state_factory=std_state_factory)
	def add_order(self, *argv, **params):
		""" Add """

		return stdreturn(data=ClippingsOrderGeneral.get(ClippingsOrderGeneral.add(params)))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateOrderSchema(), state_factory=std_state_factory)
	def update_order(self, *argv, **params):
		""" Update """

		ClippingsOrderGeneral.update(params)

		return stdreturn(data=ClippingsOrderGeneral.get(params["clippingsorderid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=CancelOrderSchema(), state_factory=std_state_factory)
	def cancel_order(self, *argv, **params):
		""" Update """

		ClippingsOrderGeneral.cancel(params)

		return stdreturn(data=ClippingsOrderGeneral.get(params["clippingsorderid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateOrderSchema(), state_factory=std_state_factory)
	def reactivate_order(self, *argv, **params):
		""" Update """

		ClippingsOrderGeneral.reactivate(params)

		return stdreturn(data=ClippingsOrderGeneral.get(params["clippingsorderid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=UpdateOrderSchema(), state_factory=std_state_factory)
	def resend_conformation(self, *argv, **params):
		""" Update """

		params["send_order_conf"] = True
		ClippingsOrderGeneral.update(params)

		return stdreturn(data=ClippingsOrderGeneral.get(params["clippingsorderid"]))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingsOrderSchema(), state_factory=std_state_factory)
	def get_order(self, *argv, **params):
		""" Update """

		return stdreturn(order=ClippingsOrderGeneral.get(params["clippingsorderid"]))


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_clippingsprices(self, *args, **params):
		""" list of regions """

		if args:
			params["clippingspriceid"] = int(args[0])

		return ClippingsPrices.get_list_clippingsprice(params)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_clients(self, *args, **params):
		""" Get a list of items to display for a combo via the rest store  """

		if args:
			params["clientid"] = int(args[0])

		return Client.list_by_customer(params)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_issues(self, *args, **params):
		""" issues """

		if args:
			params["issueid"] = int(args[0])

		return IssuesGeneral.list_by_customer(params)

