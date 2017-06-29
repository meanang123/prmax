# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        hostspf.py
# Purpose:
#
# Author:
#
# Created:     26/06/2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, identity, validators, error_handler
from prcommon.model import User, BaseSql
from prcommon.model.hostspf import Hostspf
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_std_error_handler, pr_form_error_handler
from ttl.tg.controllers import SecureControllerAdmin
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, BooleanValidator, ISODateValidator, PrGridSchema
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn
from prmaxcontrol.sitecontrollers.user import UserController
import prcommon.Constants as Constants
import ttl.tg.validators as tgvalidators


class HostspfController(SecureControllerAdmin):

	user = UserController()

	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def hostspf_add(self, *argv, **params):
		""" add new host  """

		if Hostspf.exists(params):
			return duplicatereturn()

		params["host"] = Hostspf.add(params)
		return stdreturn(data=Hostspf.get(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def hostspf_delete(self, *argv, **params):
		""" delete a host if not in use """

		Hostspf.delete(params)

		return stdreturn()

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def hostspf_update(self, *argv, **params):
		""" update a host """

		Hostspf.update(params)
		return stdreturn(data=Hostspf.get(params))

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def hostspf_list(self, *argv, **params):
		""" list of hosts """

		return Hostspf.grid_to_rest_ext(
		    Hostspf.get_grid_page(params),
		    params["offset"],
		    True if "host" in params else False)


