# -*- coding: utf-8 -*-
""" newsfeed """
#-----------------------------------------------------------------------------
# Name:        newsfeed.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     23/09/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler,  identity
from cherrypy import response
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController, OpenSecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, \
     ISODateValidator
from ttl.base import stdreturn

from prcommon.model import NewsFeed

class NewsFeedAddSchema(PrFormSchema):
	""" list name only schema """
	embargo = ISODateValidator()
	expire = ISODateValidator()
	newsfeedtypeid = validators.Int()

class NewsFeedUpdateSchema(PrFormSchema):
	""" update """
	newsfeedid = validators.Int()
	newsfeedtypeid = validators.Int()
	embargo = ISODateValidator()
	expire = ISODateValidator()

class NewsFeedIdSchema(PrFormSchema):
	""" update """
	newsfeedid = validators.Int()


#########################################################
## controlllers
#########################################################

class NewsFeedController(SecureController):
	""" news feed controller """

	# security for internal only
	require = identity.in_group("admin")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def news(self, *args, **params):
		""" returns a list of list this is for a grid """

		if args:
			params["newsfeedid"] = int(args[0])

		return NewsFeed.get_rest_page (params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsFeedAddSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" add a new news"""

		params["newsfeedid"] =  NewsFeed.add( params)

		return stdreturn ( news = NewsFeed.get(params["newsfeedid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsFeedUpdateSchema(), state_factory=std_state_factory)
	def update(self, *args, **params):
		"""update news"""

		NewsFeed.update( params )

		return stdreturn ( news = NewsFeed.get(params["newsfeedid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsFeedIdSchema(), state_factory=std_state_factory)
	def delete(self, newsfeedid, *args, **params):
		"""delete news"""

		NewsFeed.delete( newsfeedid )

		return stdreturn ( )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=NewsFeedIdSchema(), state_factory=std_state_factory)
	def get(self, newsfeedid, *args, **params):
		"""delete news"""

		return stdreturn ( news = NewsFeed.get( newsfeedid, True ))



class NewsFeedExternalController(OpenSecureController):
	""" Default page viewer """

	@expose("text/html")
	def default(self, *argv, **kw):
		""" get the news item details"""

		if len(argv) > 0:
			temp = argv[0].split(".")
			if len(temp)>1:
				try:
					response.headers["Content-type"] = "text/html;charset=utf-8"
					return NewsFeed.get_external_page(int ( temp[0] ))
				except:
					pass
		return ""




