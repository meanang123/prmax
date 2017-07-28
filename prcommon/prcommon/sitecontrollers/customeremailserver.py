# -*- coding: utf-8 -*-
"CustomerEmailServerController"
#-----------------------------------------------------------------------------
# Name:        customeremailserver.py
# Purpose:
#
# Author:      
# Created:     July 2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, error_handler,  \
     validators, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model.customer.customeremailserver import CustomerEmailServer
from ttl.base import stdreturn, duplicatereturn


class CustomerEmailServerController(SecureController):
 """ CustomerEmailServerController """

 
 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def add(self, *args, **params ):
  """ return a list"""

  customeremailserverid = CustomerEmailServer.add(params)
  return stdreturn(data = CustomerEmailServer.get(customeremailserverid))
 
 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def get_list(self, *argv, **params):
  """ list of customeremailservers"""

  return CustomerEmailServer.get_list(params)

