# -*- coding: utf-8 -*-
""" usersession """
#-----------------------------------------------------------------------------
# Name:        usersession.py
# Purpose:
# Author:      Chris Hoy
#
# Created:    15/10/203
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------
import logging
from turbogears import identity
from turbogears.database import session
from prcommon.model.logintokens import LoginTokens
from prcommon.model.admin import CustomerExternal
from prcommon.model.customer.customeraccesslog import CustomerAccessLog
from prcommon.model.identity import User, Customer

LOGGER = logging.getLogger("prcommon.model")

class ApiUserSession(object):
	""" session """

	@staticmethod
	def login(params):
		"""Get the correct login token"""

		error = CustomerExternal.can_login(None, params["tokenid"], True)
		if error:
			return (None, error)

		userid = LoginTokens.dologin(params)

		user = User.query.get(userid)

		session.add(CustomerAccessLog(customerid=user.customerid,
		                              userid=user.user_id,
		                              levelid=CustomerAccessLog.LOGGEDIN,
		                              username=user.user_name))

		return (identity.current.visit_key, "")

	@staticmethod
	def logout(params):
		"""Get the correct login token"""

		CustomerExternal.logout()

		identity.current.logout()

