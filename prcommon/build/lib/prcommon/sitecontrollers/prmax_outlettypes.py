# -*- coding: utf-8 -*-
"Prmax_OutlettypesController"
#-----------------------------------------------------------------------------
# Name:        prmax_outlettypes
# Purpose:
#
# Author:      Stamatia Vatsi
# Created:     May 2019
# Copyright:   (c) 2019
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler,  \
     validators, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler, pr_std_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, ISODateValidatorNull, Int2Null, RestSchema
from prcommon.model.prmax_outlettypes import Prmax_Outlettypes
from ttl.base import stdreturn, duplicatereturn

import prcommon.Const as Constants

import logging
LOGGER = logging.getLogger("prmax")

class Prmax_OutlettypesAddSchema(PrFormSchema):
 "schema"
 outletsearchtypeid = validators.Int()
 customerid = validators.Int()

class Prmax_OutlettypesGetSchema(PrFormSchema):
 """ schema """
 prmax_outlettypeid = validators.Int()
 customerid = validators.Int()
 
class Prmax_OutlettypesController(SecureController):
 """ prmax_outlettypes controller """
 
 @expose("json")
 @error_handler(pr_std_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=Prmax_OutlettypesAddSchema(), state_factory=std_state_factory)
 def add(self, *argc, **params):
  """  """

  if Prmax_Outlettypes.exists(params["prmax_outlettypename"], params['customerid']):
   return duplicatereturn()
 
  prmax_outlettypeid = Prmax_Outlettypes.add(params)
 
  return stdreturn(data = Prmax_Outlettypes.get(prmax_outlettypeid))  


 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=Prmax_OutlettypesGetSchema(), state_factory=std_state_factory)
 @identity.require(identity.in_group("dataadmin"))
 def update(self, *args, **params):
  """ Save the details about an advance feature  """

  Prmax_Outlettypes.update(params)

  return stdreturn(data = Prmax_Outlettypes.get(params["prmax_outlettypeid"]))


 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=Prmax_OutlettypesGetSchema(), state_factory=std_state_factory)
 def get(self, *args, **params):
  """ get prmax_outlettypes  """

  return stdreturn(data = Prmax_Outlettypes.get(params["prmax_outlettypeid"]))

 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=Prmax_OutlettypesGetSchema(), state_factory=std_state_factory)
 def delete(self, *args, **params):
  """ delete """

  Prmax_Outlettypes.delete(params["prmax_outlettypeid"] )

  return stdreturn()
 
 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrGridSchema(), state_factory=std_state_factory)
 def get_list_prmax_outlettypes(self, *argv, **params):
  """ return a page of prmax_outlettypes for the grid"""

  return Prmax_Outlettypes.get_grid_page_private(params)