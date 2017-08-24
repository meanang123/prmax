# -*- coding: utf-8 -*-
""" Clippings controller """
#-----------------------------------------------------------------------------
# Name:        clippings.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     02/06/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler, pr_std_exception_handler_text
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, RestSchema, DateRangeValidator, BooleanValidator, Int2Null, \
     ISODateValidator, FloatToIntValidator, ListofIntsValidator
from ttl.base import stdreturn
from prcommon.model import ClippingsGeneral, ClippingCache, User
from prcommon.lib.common import add_config_details
from prmax.sitecontrollers.clippings.questions import QuestionsController
from prmax.sitecontrollers.clippings.analyse import AnalyseController
from prmax.sitecontrollers.clippings.charting import ChartingController
from prmax.sitecontrollers.clippings.clippingemailsend import ClippingSelectionSenderController
from prmax.model import EmailTemplates, EmailQueue
from prcommon.model.clippings.clippingselectionsender import ClippingSelectionSend
from prcommon.model.queues import ProcessQueue

class ClippingIdSchema(PrFormSchema):
	"schema"
	clippingid = validators.Int()

class ClippingUpdateSchema(PrFormSchema):
	"schema"
	clippingid = validators.Int()
	clientid = Int2Null()
	issueid = Int2Null()
	outletid = Int2Null()
	clippingstoneid = validators.Int()

class ClippingListSchema(RestSchema):
	"schema"
	drange = DateRangeValidator()
	unprocessed = BooleanValidator()
	tones = ListofIntsValidator()

class ClippingPrivateAddSchema(PrFormSchema):
	clippingid = validators.Int()
	outletid = validators.Int()
	clip_source_date = ISODateValidator()
	clip_article_size = validators.Int()
	clip_words = validators.Int()
	clip_circulation = validators.Int()
	clip_readership = validators.Int()
	clip_disrate = FloatToIntValidator()
	clientid = Int2Null()
	issueid = Int2Null()
	clippingstypeid = Int2Null()
	clippingstoneid = Int2Null()

class ClippingPrivateUpdateSchema(PrFormSchema):
	clippingid = validators.Int()
	outletid = validators.Int()
	clip_source_date = ISODateValidator()
	clip_article_size = validators.Int()
	clip_words = validators.Int()
	clip_circulation = validators.Int()
	clip_readership = validators.Int()
	clip_disrate = FloatToIntValidator()
	clientid = Int2Null()
	issueid = Int2Null()

class ClippingStartFrame(PrFormSchema):
	as_frame = Int2Null()

#########################################################
## controlllers
#########################################################

class ClippingsController(SecureController):
	""" Clippings Interface """

	questions = QuestionsController()
	analyse = AnalyseController()
	charting = ChartingController()
	emailsender = ClippingSelectionSenderController()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingListSchema(), state_factory=std_state_factory)
	def list_clippings(self, *args, **params):
		""" list of clipps """

		if args:
			params['clippingid'] = int(args[0])

		return ClippingsGeneral.list_clippings(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingListSchema(), state_factory=std_state_factory)
	def list_selected_clippings(self, *args, **params):
		""" list of clipps """

		if args:
			params['clippingid'] = int(args[0])
		params['selected'] = True

		return ClippingsGeneral.list_clippings(params)

	@expose('text/html')
	@validate(validators=ClippingIdSchema(), state_factory=std_state_factory)
	def display_page(self, *args, **params):
		"""get display text """

		return ClippingCache.get_clippings_page(params["clippingid"], params["userid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingIdSchema(), state_factory=std_state_factory)
	def get_for_edit(self, *args, **params):
		""" get_for_edit """

		return stdreturn(data=ClippingsGeneral.get_for_edit(params["clippingid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingUpdateSchema(), state_factory=std_state_factory)
	def update_clipping(self, *args, **params):
		""" get_for_edit """

		ClippingsGeneral.update_clipping(params)

		return stdreturn(data=ClippingsGeneral.get_for_display(params["clippingid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingIdSchema(), state_factory=std_state_factory)
	def delete_clipping(self, *args, **params):
		""" delete a clipping """

		ClippingsGeneral.delete_clipping(params)

		return stdreturn(data=params["clippingid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingIdSchema(), state_factory=std_state_factory)
	def user_select(self, *args, **params):
		""" user clippings selection"""

		if params['selected'] == 'true':
			ClippingsGeneral.add_user_selection(params)
		else:
			ClippingsGeneral.delete_user_selection(params)
		
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def clear_user_selection(self, *args, **params):
		""" user clippings selection"""

		ClippingsGeneral.clear_user_selection(params)
		
		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingPrivateAddSchema(), state_factory=std_state_factory)
	def private_clipping_add(self, *args, **params):
		""" add """

		params["clippingid"] = ClippingsGeneral.private_clipping_add(params)

		return stdreturn(data=ClippingsGeneral.get_for_display(params["clippingid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingPrivateUpdateSchema(), state_factory=std_state_factory)
	def private_clipping_update(self, *args, **params):
		""" update """

		ClippingsGeneral.private_clipping_update(params)

		return stdreturn(data=ClippingsGeneral.get_for_display(params["clippingid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ClippingIdSchema(), state_factory=std_state_factory)
	def private_clipping_get_for_edit(self, *args, **params):
		""" get_for_edit """

		return stdreturn(data=ClippingsGeneral.private_clipping_get_for_edit(params["clippingid"]))


	@expose("mako:prmax.templates.clippings.clippings_main")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=ClippingStartFrame(), state_factory=std_state_factory)
	def frame(self, *args, **params):
		"""get display text """

		user = User.query.get(params["userid"])
		return add_config_details(dict(control=user.get_json_settings(),
		                               as_frame=1 if params["as_frame"] else 0,
		                               top_border="border-top:3px solid white" if params["as_frame"] else ""))

	@expose("html/text")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def open_clipping_view(self, *args, **params):

		return """<iframe scrolling="no" frameborder="0" width="100%" height="100%" src="/clippings/frame?as_frame=1"></iframe>"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	def send_clippings_email(self, *args, **params):
		""" send email with all selected clippings """
	
		EmailQueue.send_email_clippings(params)
		return stdreturn()
