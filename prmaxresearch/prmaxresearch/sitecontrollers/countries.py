# -*- coding: utf-8 -*-
"GeographicalController"
#-----------------------------------------------------------------------------
# Name:        geographical
# Purpose:
#
# Author:      Chris Hoy
# Created:
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, exception_handler, identity, \
     error_handler, validators
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import SecureController
from  ttl.tg.errorhandlers import pr_form_error_handler
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema
from prcommon.model import Countries
from ttl.base import stdreturn, duplicatereturn

class PPRCountryID(PrFormSchema):
	"schema"
	countryid = validators.Int()

class PPRCountryUpd(PrFormSchema):
	"schema"
	countryid = validators.Int()
	regioncountryid = validators.Int()
	countrytypeid = validators.Int()

class CountriesController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" get list of countries """

		return Countries.get_rest_page ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def countries_add(self, *args, **params):
		""" add a country """

		if Countries.Exists ( params ):
			return duplicatereturn()

		params["countryid"] = Countries.add ( params )

		return stdreturn( country = Countries.get ( params["countryid"] ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PPRCountryID(), state_factory=std_state_factory)
	def countries_delete(self, *args, **params):
		""" add a country """

		if Countries.inUse ( params ):
			return errorreturn("Is In Use")

		Countries.delete ( params )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PPRCountryUpd(), state_factory=std_state_factory)
	def countries_update(self, *args, **params):
		""" update a country record  """

		if Countries.Exists ( params ):
			return duplicatereturn()

		Countries.update ( params )

		return stdreturn( country = Countries.get ( params["countryid"] ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PPRCountryID(), state_factory=std_state_factory)
	def countries_get(self, *args, **params):
		""" update a country record  """

		return stdreturn( data = Countries.get ( params["countryid"] ))
