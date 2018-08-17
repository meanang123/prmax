# -*- coding: utf-8 -*-
""" Add """
#-----------------------------------------------------------------------------
# Name:        add.py
# Purpose:
# Author:      Stamatia Vatsi
#
# Created:     27/06/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
import slimmer
from turbogears import expose, validate, validators, error_handler, exception_handler, view
from turbogears.database import session
from ttl.tg.controllers import EmbeddedBaseController
from ttl.tg.validators import std_state_factory, RestSchema, PrFormSchema, IntNull, JSONValidator, BooleanValidator, \
     ISODateValidator, ISODateTimeValidator, DateRangeValidator, Int2Null
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from prcommon.lib.common import add_config_details

from prcommon.model import ContactHistory, Client, User
from prcommon.model.crm2.contacthistorygeneral import ContactHistoryGeneral

from ttl.base import stdreturn, duplicatereturn, formreturn, errorreturn

import json
import urllib
import slimmer

class EnquiryUpdateSchema(PrFormSchema):
	clientid = validators.Int()
	taken = ISODateTimeValidator()
	contacthistoryid = validators.Int()

class UpdateController(EmbeddedBaseController):
	""" Add controller """

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def update(self, *args, **params):
		""" return the add enquiry page"""

		clients = session.query(Client.clientid, Client.clientname).\
			    filter(Client.customerid == params["customerid"]).order_by(Client.clientname).all()

		clientdata = []
		clientdata.append(dict(id=-1, name="No Selection"))
		for client in clients:
			clientdata.append(dict(id=client.clientid, name=client.clientname))
		params["clientitems"] = urllib.quote(json.dumps(clientdata), "")

		users = session.query(User.user_id, User.user_name).\
		    filter(User.customerid == params["customerid"]).order_by(User.user_name).all()
		takenbydata = []
		for user in users:
			takenbydata.append(dict(id=user.user_id, name=user.user_name))
		params["takenbyitems"] = urllib.quote(json.dumps(takenbydata), "")

		if "employeeid" not in params:
			params["employeeid"] = ""
		if "outletid" not in params:
			params["outletid"] = ""

		params["username"] = params["prstate"].u.user_name

		data = add_config_details(params)

		html = view.render(data, 'prmaxtouch.templates.enquiries.add')

		return slimmer.xhtml_slimmer(html)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EnquiryUpdateSchema(), state_factory=std_state_factory)
	def submit(self, *args, **params):
		"""Add enquiry details"""

		if 'clientid' in params and params['clientid'] == -1:
			params['clientid'] = None
		ContactHistoryGeneral.update_note(params)
	
		return stdreturn(data=ContactHistory.getRecord(params["contacthistoryid"], True))
