# -*- coding: utf-8 -*-
"""list for api"""
#-----------------------------------------------------------------------------
# Name:        user.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     14/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, \
	 error_handler
from ttl.tg.validators import GridNoIdentitySchema
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import OpenSecureController
from prmaxapi.model import List,  User, ListMemberAiView
from ttl.base import stdreturn, errorreturn

class GridNoIdentitySchema2(GridNoIdentitySchema):
	"""schema"""
	userid = tgvalidators.Int()
	customertypeid = tgvalidators.Int()

class GridNoIdentitySchema3(GridNoIdentitySchema):
	"""schema"""
	userid = tgvalidators.Int()
	customertypeid = tgvalidators.Int()
	listid = tgvalidators.Int()

class ListController(OpenSecureController):
	"""  function for lists """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GridNoIdentitySchema2())
	def lists(self, *args,  **params):
		""" add an entry into the research system for chnages """

		params['limit'] = 32000
		params["listtypeid"] = 1 # Standing Lists
		try:
			params["customerid"] = User.get_customer( params["userid"] )
		except Exception, ex :
			return errorreturn( str (ex ) )

		data = List.getPageListGrid( params )
		return stdreturn(items = data["items"] )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GridNoIdentitySchema3())
	def listmembers(self, *args,  **params):
		""" return the members of a list """

		params['limit'] = 32000
		try:
			params["customerid"] = User.get_customer( params["userid"] )
		except Exception, ex :
			return errorreturn( str (ex ) )
		data = ListMemberAiView.get_data(params )
		return stdreturn(items = data["items"] )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GridNoIdentitySchema3())
	def listmembers_page(self, *args,  **params):
		""" return the members of a list """

		try:
			params["customerid"] = User.get_customer( params["userid"] )
		except Exception, ex :
			return errorreturn( str (ex ) )

		return stdreturn(data = ListMemberAiView.get_data(params ) )


