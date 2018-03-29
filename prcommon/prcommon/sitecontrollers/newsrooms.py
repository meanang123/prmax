# -*- coding: utf-8 -*-
""" Newsrooms controller """
#-----------------------------------------------------------------------------
# Name:        newsrooms.py
# Purpose:
#
# Author:
# Created:     March 2018
# Copyright:  (c) 2018

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, ISODateValidatorNull, Int2Null, RestSchema
from ttl.base import stdreturn
from prcommon.model import User
from prcommon.model.newsroom.newsrooms import Newsrooms

class NewsroomAddSchema(PrFormSchema):
	""" schema """
	customerid = validators.Int()

class NewsroomUpdateSchema(PrFormSchema):
	""" schema """
	newsroomid = validators.Int()
	customerid = validators.Int()

class NewsroomIdSchema(PrFormSchema):
	"schema"
	newsroomid = validators.Int()

class NewsroomSchema(PrFormSchema):
	"schema"
	newsroomid = validators.Int()
	customerid = validators.Int()

class NewsroomController(SecureController):
	""" Newsroom Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsroomAddSchema(), state_factory=std_state_factory)
	def newsroom_add(self, *args, **params):
		""" add a new newsroom to the system  """

		newsroomid = Newsrooms.add(params)

		return stdreturn(data=Newsrooms.get(newsroomid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsroomUpdateSchema(), state_factory=std_state_factory)
	def newsroom_update(self, *args, **params):
		""" update a newsroom """

		Newsrooms.update(params)

		return stdreturn(data=Newsrooms.get(params["newsroomid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsroomSchema(), state_factory=std_state_factory)
	def newsroom_get(self, *args, **params):
		""" Get a record """

		return stdreturn(data=Newsrooms.get(params["newsroomid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def newsroom_grid(self, *argv, **params):
		""" return a page of newsrooms for the grid"""

		x = Newsrooms.get_grid_page(params)
		return x

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsroomIdSchema(), state_factory=std_state_factory)
	def newsroom_delete(self, *args, **params):
		"""Delete the items selected by the user """

		Newsrooms.delete(params)
		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def combo(self, *argv, **params):
		""" list of newsrooms for a combo box """

#		params["is_combo"] = True

		return Newsrooms.combo(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **params):
		""" list of seleced global newsrooms"""
		return stdreturn( data = Newsrooms.get_user_selection( params ))