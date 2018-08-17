# -*- coding: utf-8 -*-
""" Contact details """
#-----------------------------------------------------------------------------
# Name:        details.py
# Purpose:
# Author:      Stamatia Vatsi
#
# Created:     11/07/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
from turbogears import expose, validate, exception_handler, view, redirect
from turbogears.database import session
from cherrypy import request
from sqlalchemy import and_
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler, pr_std_exception_handler_text
from ttl.tg.validators import std_state_factory, PrFormSchema, PRmaxFormSchema
from ttl.tg.controllers import EmbeddedBaseController
from ttl.model import PPRApplication
from datetime import datetime
from prcommon.model import Employee, Contact, ContactHistory, Communication, Address, Client, User
from prcommon.model.touch.utils.utils import Utilities
from prcommon.lib.common import add_config_details
import slimmer
import json
import urllib

from cherrypy import response

import prcommon.Constants as Constants

PRMAXTOUCH = PPRApplication("Prmaxtouch", True)

class DetailsContactController(EmbeddedBaseController):
	""" Contact details controller """
	
	@staticmethod
	def view_data(params):
		""" get the summary data """
		
		#user = TGUser.query.get(params["userid"])

		employee = Employee.query.get(params["iemployeeid"])
		communication = Communication.query.get(employee.communicationid)
		if communication and communication.addressid != None:
			address = Address.query.get(communication.addressid)
		else:
			address = None

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
	
		params["employeeid"] = params["iemployeeid"]
		params["outletid"] = params["ioutletid"]
	
		params["username"] = params["prstate"].u.user_name
	
		data = add_config_details(
			{"employee": employee,
		     "communication":communication,
			 "address": address.address1 if address else "",
		     "familyname": params['familyname'].upper(),
		     "firstname": params['firstname'].upper(),
		     "clientitems":params["clientitems"],
		     "takenbyitems":params["takenbyitems"],
		     "employeeid":params["employeeid"],
		     "outletid":params["outletid"],
		     "username":params["username"],
		     "userid":params["userid"]
		     },
			True,
			PRMAXTOUCH)
	
		html = view.render(data, 'prmaxtouch.templates.enquiries.add')
	
		#response.headers['Referrer-Policy'] = "unsafe-url"
	
		return slimmer.xhtml_slimmer(html)
		

	@expose('text/html')
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def view(self, *args, **params):
		""" return the summary page"""
		
		if args:
			params["iemployeeid"] = int(args[-1])

		#check_access_rights("customer", params)
			
		return DetailsContactController.view_data(params)

def _fix_characters(value):

	return value.replace(u'\xa3', 'poundsymbol')




#	@expose("json")
#	@exception_handler(pr_std_exception_handler)
#	@validate(validators=PRmaxFormSchema(), state_factory=std_state_factory)
#	def basic_settings(self, *args, **params ):
#		"Get basic Details of a customer "
#
#		return stdreturn( customer = CustomerGeneral.basic_settings( params["icustomerid"]))