# -*- coding: utf-8 -*-
""" Clients controller """
#-----------------------------------------------------------------------------
# Name:        clients.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     23/09/2011
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from turbogears.database import session
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema , \
     RestSchema, BooleanValidator
from ttl.base import stdreturn, duplicatereturn, formreturn, errorreturn
from ttl.ttlemail import ext_to_content_type
from ttl.tg.common import set_default_response_settings
from ttl.postgres import DBCompress
from prcommon.model import Client, ClientNewsRoom, UserSession, UserSession, \
     UserSessionImage, ClientNewsRoomImage
from cherrypy import response

#########################################################
## validators
#########################################################

class ClientSchema(PrFormSchema):
	""" shema """
	clientid = validators.Int()
	extended = BooleanValidator()

class ClientSaveSchema(PrFormSchema):
	""" shema """
	clientid = validators.Int()
	has_news_room =  BooleanValidator()

class ClientHeaderSchema(PrFormSchema):
	"""schema"""
	clientid = validators.Int()
	imagetypeid = validators.Int()

class ClientNewsRoomImageSchema(PrFormSchema):
	"""schema"""
	imagetypeid = validators.Int()

#########################################################
## controlllers
#########################################################

class ClientController(SecureController):
	""" Client Interface """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" retrive details about a seopress release """

		return Client.list( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClientSaveSchema(), state_factory=std_state_factory)
	def save(self, *args, **params):
		""" add a new client to the system  """

		if Client.exists( params ) :
			return duplicatereturn( message ="Client Already Exists")

		# check for existing news room here
		if params["has_news_room"] and ClientNewsRoom.exists(params):
			return duplicatereturn( message = "Newsroom root already exists")

		if params["clientid"] != -1:
			clientid = params["clientid"]
			Client.update ( params )
		else:
			clientid = Client.add ( params )

		return stdreturn ( data = Client.get( clientid , True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = ClientSchema(), state_factory=std_state_factory)
	def delete(self, *args, **params):
		""" Delete a client record """

		if Client.inuse( params["clientid"] ) :
			return duplicatereturn()

		Client.delete( params )

		return stdreturn ( )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = ClientSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" Get a record """

		return stdreturn ( data = Client.get( params["clientid"],
		                                      params["extended"]) )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = PrGridSchema(), state_factory=std_state_factory)
	def combo(self, *args, **params):
		""" Get a record """

		return Client.combo ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = RestSchema(), state_factory=std_state_factory)
	def rest_combo(self, *args, **params):
		""" Get a list of items to display for a combo via the rest store  """

		if args:
			params["id"] = int(args[0])

		return Client.rest_combo ( params )

	@expose("")
	@validate(validators = ClientNewsRoomImageSchema(), state_factory=std_state_factory)
	def header_load(self, *args, **params):
		""" Load a image and covert to a thumbnail"""

		try:
			ClientNewsRoomImage.upload_and_convert ( params )
			retd = stdreturn()
		except:
			retd = errorreturn ( message = "Problem Converting Image")

		return formreturn( retd )

	@expose("")
	@validate(validators = ClientNewsRoomImageSchema(), state_factory=std_state_factory)
	def load_header_temp(self, *args, **params):
		""" get the current soe_temp_thumbnail"""

		imagestore = session.query( UserSessionImage ).filter_by(
		  imagetypeid = params["imagetypeid"],
		  userid = params["userid"]).scalar()
		if imagestore:
			image_data = DBCompress.decode ( imagestore.image )
			set_default_response_settings()
			response.headers["Content-Length"] = len( image_data )
			response.headers["Content-type"] = ext_to_content_type( ".png" )
		else:
			image_data = ""

		return image_data

	@expose("")
	@validate(validators = ClientHeaderSchema(), state_factory=std_state_factory)
	def header_image(self, *args, **params):
		""" get """

		header_logo =  ""
		headerimage = session.query( ClientNewsRoomImage).filter_by (
		  clientid = params["clientid"],  imagetypeid = params["imagetypeid"]).scalar()
		if headerimage:
			header_logo = DBCompress.decode ( headerimage.image )
			# return data
			set_default_response_settings()
			response.headers["Content-Length"] = len( header_logo )
			response.headers["Content-type"] = ext_to_content_type( "png" )

		return header_logo




