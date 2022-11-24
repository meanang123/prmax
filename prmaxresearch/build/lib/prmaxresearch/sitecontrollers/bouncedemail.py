# -*- coding: utf-8 -*-
"""Bounced"""
#-----------------------------------------------------------------------------
# Name:        bouncedemails.py
# Purpose:     Handles the interface too the bounced email
#
# Author:      Chris Hoy
#
# Created:     27/06/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, error_handler, \
	 exception_handler, identity, validators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureControllerExt
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 PrGridSchema, JSONValidatorListInt, JSONValidatorInterests,  BooleanValidator, \
   RestSchema

from prcommon.model import BouncedEmails

from ttl.base import stdreturn

class BouncedEmailSchema(PrFormSchema):
	""" prmax role schema"""
	bounceddistributionid = validators.Int()

class BouncedEmailCompletedSchema(PrFormSchema):
	""" prmax role schema"""
	bounceddistributionid = validators.Int()
	reasoncodeid = validators.Int()
	has_been_research = BooleanValidator()

class BouncedEmailGrid(PrGridSchema):
	"schema"
	top50 = BooleanValidator()

class BouncedEmailRest(RestSchema):
	"schema"
	top50 = BooleanValidator()


class BouncedEmailsController(SecureControllerExt):
	""" handles the bounced email """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailGrid(), state_factory=std_state_factory)
	def list(self, *args, **params ):
		""" list all the roles int the system"""

		return BouncedEmails.get_grid_page( params )

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailRest(), state_factory=std_state_factory)
	def list_rest(self, *args, **params ):
		""" list all the bounced emails"""

		return BouncedEmails.get_rest_page( params )

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailSchema(), state_factory=std_state_factory)
	def msg_display(self, *args, **kw ):
		""" Get the Text of the message """

		return BouncedEmails.getMsgText ( kw["bounceddistributionid"] )

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailSchema(), state_factory=std_state_factory)
	def msg_basic_display(self, *args, **kw ):
		""" Get the Text of the message """

		return BouncedEmails.getMsgBasicText ( kw["bounceddistributionid"] )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailCompletedSchema(), state_factory=std_state_factory)
	def completed(self, *args, **params ):
		""" Set the message as completed """

		BouncedEmails.completed( params )
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailSchema(), state_factory=std_state_factory)
	def mark_as_ignore(self, *args, **kw ):
		""" Set the message as completed """

		BouncedEmails.MarkAsCompleted( kw )
		return stdreturn()



	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=BouncedEmailSchema(), state_factory=std_state_factory)
	def get_and_lock(self, *args, **kw ):
		""" Get the Text of the message """

		return BouncedEmails.get_and_lock ( kw["bounceddistributionid"],
		                                    kw["userid"])










