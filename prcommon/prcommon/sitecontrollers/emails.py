# -*- coding: utf-8 -*-
"""Emails """
#-----------------------------------------------------------------------------
# Name:        emalis.py
# Purpose:
# Author:      
#
# Created:     July/2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------
from turbogears import expose, validate, exception_handler, error_handler,  \
     validators, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema
from prcommon.model.emails import EmailFooter, EmailHeader, EmailLayout
from ttl.base import stdreturn, duplicatereturn



class EmailHeaderController(SecureController):
 """ EmailHeaderController """

 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def save(self, *args, **params ):
  """ """

  emailheaderid = EmailHeader.add(params)
  return stdreturn(data = EmailHeader.get(emailheaderid))


class EmailFooterController(SecureController):
 """ EmailFooterController """

 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def save(self, *args, **params ):
  """ """

  emailfooterid = EmailFooter.add(params)
  return stdreturn(data = EmailFooter.get(emailfooterid))


class EmailLayoutController(SecureController):
 """ EmailLayoutController """

 @expose("json")
 @error_handler(pr_form_error_handler)
 @exception_handler(pr_std_exception_handler)
 @validate(validators=PrFormSchema(), state_factory=std_state_factory)
 def save(self, *args, **params ):
  """ """

  emaillayoutid = EmailLayout.add(params)
  return stdreturn(data = EmailLayout.get(emaillayoutid))
