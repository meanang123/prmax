# -*- coding: utf-8 -*-
"Research frame"
#-----------------------------------------------------------------------------
# Name:					frame.py
# Purpose:			controller for frame of control
#
#
# Author:      Chris Hoy
#
# Created:
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import SecureControllerExt
from ttl.tg.validators import std_state_factory, PrFormSchema

class FrameController(SecureControllerExt):
	""" internal security user must be part of admin group """
	require = identity.in_group("admin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def options(self, *args, **kw):
		""" data options"""

		if kw['prstate'].u.customertypeid:
			retdata = dict(identifier='id', label="name", items=[dict(id=1, type=0, name="""Add Customer""", content="control/customer/partner_add")])
		else:
			retdata = dict(identifier='id', label="name",
				        items=[
				            dict(id=2, type=0, name="Options", children=[dict(_reference=20), dict(_reference=10)]),
				            dict(id=10, type=1, name="Accounts", children=[dict(_reference=11), dict(_reference=12), dict(_reference=13), dict(_reference=14), dict(_reference=15)]),
				            dict(id=20, type=1, name="Support", children=[dict(_reference=21), dict(_reference=22), dict(_reference=23), dict(_reference=24)]),
				            dict(id=11, type=2, name="Price Codes", content="control/accounts/PriceCodes"),
				            dict(id=12, type=2, name="DD Invoices's", content="control/customer/dd_invoices"),
				            dict(id=13, type=2, name="DD Csv", content="control/customer/dd_csv"),
				            dict(id=14, type=2, name="Sales Partner", content="control/accounts/SalesPartner"),
				            dict(id=15, type=2, name="Data Partner", content="control/accounts/DataPartner"),
				            dict(id=21, type=2, name="Query", content="control/support/query"),
				            dict(id=22, type=2, name="Private Data", content="control/support/PrivateData"),
			                dict(id=23, type=2, name="SPF", content="control/support/spfcontrol"),
			                dict(id=24, type=2, name="Distribution", content="control/support/Distribution")

			            ])

		return retdata

