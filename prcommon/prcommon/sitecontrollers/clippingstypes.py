# -*- coding: utf-8 -*-
"ClippingsTypeController"
#-----------------------------------------------------------------------------
# Name:        clippingsType
# Purpose:
#
# Author:      
# Created:     June 2016
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler,  \
     validators, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model.clippings.clippingstype import ClippingsType
from ttl.base import stdreturn, duplicatereturn

class ClippingsTypeGetSchema(PrFormSchema):
 "schema"
 clippingstypeid = validators.Int()

class ClippingsTypeController(SecureController):
 """ ClippingsTypeController """

 
 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def list(self, *args, **params ):
  """ return a list of clippings types """

  return stdreturn (data = ClippingsType.get_list(params))
 
 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def listuserselection(self, *args, **params ):
  """ return a list of clippings types """

  return stdreturn (data = ClippingsType.get_user_selection(params))
 
