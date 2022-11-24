# -*- coding: utf-8 -*-
"messages"
#-----------------------------------------------------------------------------
# Name:        messages.py
# Purpose:     handle basic interest information
# Author:       Chris Hoy
#
# Created:     10/08/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema
from prcommon.model import MessageUser

class MessageAddSchema(PrFormSchema):
	"schema"
	messagetypeid = validators.Int()
	parentmessageid = validators.Int()

class MessageSchema(PrFormSchema):
	"schema"
	messageid = validators.Int()

#########################################################
## Interest Controller
#########################################################
class MessageBaseController( object ):
	""" Common interest for all prmax applications """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MessageAddSchema(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" Add a new message  """

		params["messageid"] = MessageUser.add( params )
		data = MessageUser.get( params["messageid"])
		data["u"] = params["prstate"].u

		return  dict(success = "OK", data = data )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def view(self, *args, **params):
		""" View a list of message that have been sent by or a to you """

		return MessageUser.getGridPage( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MessageSchema(), state_factory=std_state_factory)
	def delete_message(self, *args, **params):
		""" Delete a Message """

		MessageUser.delete_message( params )
		return dict ( success = "OK")

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MessageSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" Gert the details of a mesage for display """

		data = MessageUser.get( params["messageid"])
		data["u"] = params["prstate"].u
		return data





