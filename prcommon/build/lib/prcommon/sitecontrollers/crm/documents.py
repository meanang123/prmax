# -*- coding: utf-8 -*-
"""Documents """
#-----------------------------------------------------------------------------
# Name:        documents.py
# Purpose:     Handles all the action to documents
# Author:      Chris Hoy
#
# Created:     30/9/2014
# Copyright:   (c) 2014

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, \
	 error_handler, validators
from ttl.tg.validators import std_state_factory
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from datetime import datetime, timedelta
from ttl.tg.controllers import SecureController
from ttl.tg.validators import PrGridSchema, PrFormSchema, RestSchema
from ttl.base import stdreturn
from  prcommon.model import DocumentsGeneral
from ttl.ttlemail import CONTENTHEADERS
from cherrypy import response

class DocumentIdSchema(PrFormSchema):
	""" schema """
	documentid = validators.Int()

class DocumentController(SecureController):
	""" Document Controller"""

	@expose("")
	def add(self, *args,  **params):
		""" Adds a document to the system"""

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id

		try:
			# add the file
			documentid = DocumentsGeneral.add( params )
			dobject = dict ( success="OK" , data = DocumentsGeneral.get( documentid ) )
		except:
			dobject = dict ( success="FA" , message="Problem Adding Document")

		# this is needed because it's a form submit to get the file up here
		return "<div><textarea>%s</textarea></div>" %  \
		       self.jsonencoder.encode ( dobject )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def document_list(self, *args, **params):
		""" list of documents """

		return DocumentsGeneral.list_documents( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DocumentIdSchema(), state_factory=std_state_factory)
	def get(self, *args, **params):
		""" get single document """

		return stdreturn(data = DocumentsGeneral.get( params["documentid"] ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DocumentIdSchema(), state_factory=std_state_factory)
	def update (self, *args, **params):
		""" update single document """

		DocumentsGeneral.update(params)

		return stdreturn(data = DocumentsGeneral.get( params["documentid"] ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DocumentIdSchema(), state_factory=std_state_factory)
	def delete (self, *args, **params):
		""" delete single document """

		DocumentsGeneral.delete(params["documentid"])

		return stdreturn()

	@expose("")
	def download(self, *args):
		""" Download Document"""

		try :
			(documentid, ext) = args[0].split(".")
			data = DocumentsGeneral.get_data( documentid )
		except:
			return "Not Found"

		if ext.lower() in CONTENTHEADERS :
			response.headers["Content-disposition"] = \
		          "inline; filename=%s.%s" % (documentid,ext)
			response.headers["Content-Length"] = len(data)
			response.headers["Content-type"] = CONTENTHEADERS[ext.lower()]

		tday = datetime.now().strftime("%a, %d %b %Y %M:%H:%S GMT")
		response.headers["Age"] = 30
		response.headers["Date"] = tday
		response.headers["Last-Modified"] = tday
		response.headers["Expires"] = (datetime.now()+ timedelta(days=1)).strftime("%a, %d %b %Y %M:%H:%S GMT")

		return data

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = RestSchema(), state_factory=std_state_factory)
	def rest_combo(self, *args, **params):
		""" Get a list of items to display for a combo via the rest store  """

		if args:
			params["id"] = int(args[0])

		return DocumentsGeneral.rest_combo ( params )
