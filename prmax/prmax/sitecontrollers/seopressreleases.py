# -*- coding: utf-8 -*-
""" Seo Press Release controller """
#-----------------------------------------------------------------------------
# Name:        seopressreleaes.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     23/09/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, \
     BooleanValidator
from ttl.base import stdreturn, formreturn, errorreturn
from ttl.ttlemail import ext_to_content_type
from ttl.postgres import DBCompress
from cherrypy import response
from prmax.utilities.common import set_default_response_settings


from prcommon.model import SEORelease, SEOImage, UserSession

#########################################################
## validators
#########################################################

class SEOReleaseSchema(PrFormSchema):
	""" shema """
	seoreleaseid = validators.Int()

class SEOPressReleaseSchema(PrFormSchema):
	""" shema """
	emailtemplateid = validators.Int()

class SEOPublishSchema(PrFormSchema):
	""" shema """
	clientid = validators.Int()
	seoimageid = validators.Int()
	newsrooms = validators.JSONValidator()
	cat_1 = BooleanValidator()
	cat_2 = BooleanValidator()
	cat_3 = BooleanValidator()
	cat_4 = BooleanValidator()
	cat_5 = BooleanValidator()
	cat_6 = BooleanValidator()
	cat_7 = BooleanValidator()
	cat_8 = BooleanValidator()
	cat_9 = BooleanValidator()
	cat_10 = BooleanValidator()
	cat_11 = BooleanValidator()
	cat_12 = BooleanValidator()
	cat_13 = BooleanValidator()
	cat_14 = BooleanValidator()
	cat_15 = BooleanValidator()
	cat_16 = BooleanValidator()
	cat_17 = BooleanValidator()
	cat_18 = BooleanValidator()
	cat_19 = BooleanValidator()
	cat_20 = BooleanValidator()
	cat_21 = BooleanValidator()
	cat_22 = BooleanValidator()
	cat_23 = BooleanValidator()
	cat_24 = BooleanValidator()
	cat_25 = BooleanValidator()
	is_client_newsroom = BooleanValidator()


#########################################################
## controlllers
#########################################################

class SEOPressReleaseController(SecureController):
	""" seo press releases """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOReleaseSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" retrive details about a seopress release """

		return stdreturn( data = SEORelease.get_for_edit( params["seoreleaseid"], None ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOPressReleaseSchema(), state_factory=std_state_factory)
	def get_by_pressrelease(self, *args, **params):
		""" retrive details about a seopress release """

		return stdreturn( data = SEORelease.get_for_edit( None, params["emailtemplateid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOPublishSchema(), state_factory=std_state_factory)
	def save(self, *args, **params):
		""" retrive details about a seo press release """

		seoreleaseid = SEORelease.save ( params )
		return stdreturn( data = SEORelease.get ( seoreleaseid ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOPublishSchema(), state_factory=std_state_factory)
	def save_and_publish(self, *args, **params):
		""" create and publish a seo release"""

		return stdreturn( data = SEORelease.save_and_publish ( params ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOReleaseSchema(), state_factory=std_state_factory)
	def withdraw(self, *args, **params):
		""" retrive details about a seo press release """

		SEORelease.withdraw ( params )
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOPublishSchema(), state_factory=std_state_factory)
	def republish(self, *args, **params):
		""" retrive details about a seo press release """

		#SEORelease.republish ( params )
		return stdreturn( data = SEORelease.republish ( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOReleaseSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" retrive details about a seo press release """

		SEORelease.delete ( params )
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" list of seo release """

		return SEORelease.get_grid_page ( params )

	@expose("")
	def thumbnail_image_load(self, *args, **params):
		""" Load a image and covert to a thumbnail"""

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id

		try:
			SEOImage.upload_and_convert ( params )
			retd = stdreturn()
		except:
			retd = errorreturn ( message = "Problem Converting Document")

		return formreturn( retd )

	@expose("")
	def load_seo_thumbnail(self, *args, **params):
		""" get the current soe_temp_thumbnail"""

		state = std_state_factory()
		usersession = UserSession.query.get(state.u.user_id)
		seoimage = DBCompress.decode ( usersession.seo_image )

		# return data
		set_default_response_settings()
		response.headers["Content-Length"] = len( seoimage )
		response.headers["Content-type"] = ext_to_content_type( usersession.seo_image_extension )

		return seoimage

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def link_to_thumbnail(self, *args, **params):
		""" load a thumbnail from a link """

		SEOImage.link_to_thumbnail(params["userid"], params["url"])

		return stdreturn()


	@expose("")
	def thumbnail_image(self, *args, **params):
		""" get the current soe_temp_thumbnail"""

		seoimage = SEOImage.query.get( params["seoimageid"] )
		seodata = DBCompress.decode ( seoimage.seoimage )

		# return data
		set_default_response_settings()
		response.headers["Content-Length"] = len( seodata )
		response.headers["Content-type"] = ext_to_content_type( seoimage.seo_image_extension )

		return seodata


