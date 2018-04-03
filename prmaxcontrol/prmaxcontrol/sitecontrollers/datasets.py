# -*- coding: utf-8 -*-
"""Extended Settings Controller"""
#-----------------------------------------------------------------------------
# Name:        extendedsettings.py
# Purpose:
# Author:
#
# Created:     March 2018
# RCS-ID:      $Id:  $
# Copyright:  (c) 2018

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, validators, error_handler, \
     exception_handler, controllers, identity, config
from ttl.tg.errorhandlers import pr_std_error_handler, pr_std_exception_handler, \
     pr_form_error_handler
from ttl.tg.controllers import SecureController, set_output_as
from ttl.tg.validators import PrGridSchema, std_state_factory, PrFormSchema, \
     BooleanValidator, FloatToIntValidator, RestSchema, IntNull
from ttl.base import stdreturn, formreturn, duplicatereturn, errorreturn, \
     licence_exceeded_return
import ttl.tg.validators as tgvalidators
from prcommon.model.customer.customergeneral import Customer
from  prcommon.model import CustomerPrmaxDataSets, UserGeneral
from ttl.model import BaseSql


import prcommon.Const as Constants

import logging
LOGGER = logging.getLogger("prmaxcontrol")

class PrUPdateDataSetsSchema(PrFormSchema):
	"schema"
	icustomerid = validators.Int()
	prmaxdatasetid = validators.Int()
	customerprmaxdatasetid = IntNull()

class DataSetsController(SecureController):
	""" internal security user must be part of admin group """
	require = identity.in_group("admin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def customer_data_sets(self, *argv, **params):
		""" return a list of datasets with those that you have selected  """

		if argv:
			params["prmaxdatasetid"] = int(argv[0])
			
		return CustomerPrmaxDataSets.grid_to_rest_ext(
	        CustomerPrmaxDataSets.get_grid_page(params),
	        params["offset"],
	        True if "prmaxdatasetid" in params else False)			

	@expose("json")
	@error_handler(pr_std_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrUPdateDataSetsSchema(), state_factory=std_state_factory)
	def customer_data_set_update(self, *argc, **params):
		""" Add/Delete the data set from a customer """

		return stdreturn(data=CustomerPrmaxDataSets.update_datasets(params))
	