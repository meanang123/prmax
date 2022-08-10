# -*- coding: utf-8 -*-
"""This module contains the controller classes of the application."""

# symbols which are imported by "from prmaxservices.controllers import *"
__all__ = ['Root']

# standard library imports
# import logging
import datetime

from prmaxservices import model
from pprcommon.model import User, VisitIdentity
from  ttl.base import stdreturn, errorreturn

# third-party imports
from cherrypy import request
from turbogears import controllers, expose, flash, identity, redirect, visit
from turbogears.database import session
from ttl.base import stdreturn, errorreturn

# project specific imports
# from prmaxservices import jsonify

class Root(controllers.RootController):
	"""The root controller of the application."""


	@expose('prmaxservices.templates.login')
	def login(self, forward_url=None, *args, **kw):
		"""Show the login form or forward user to previously requested page."""

		if forward_url:
			if isinstance(forward_url, list):
				forward_url = forward_url.pop(0)
			else:
				del request.params['forward_url']

		new_visit = visit.current()
		if new_visit:
			new_visit = new_visit.is_new

		if (not new_visit and not identity.current.anonymous
				and identity.was_login_attempted()
				and not identity.get_identity_errors()):
			return dict ( deliveryappsessionid = identity.current.visit_key )

		if identity.was_login_attempted():
			if new_visit:
				msg = _(u"Cannot log in because your browser "
								"does not support session cookies.")
			else:
				msg = _(u"The credentials you supplied were not correct or "
								"did not grant access to this resource.")
		elif identity.get_identity_errors():
			msg = _(u"You must provide your credentials before accessing "
							"this resource.")
		else:
			msg = u"Please log in."
			if not forward_url:
				forward_url = request.headers.get('Referer', '/')

		# we do not set the response status here anymore since it
		# is now handled in the identity exception.
		return dict(logging_in=True, message=msg,
								forward_url=forward_url, previous_url=request.path_info,
								original_parameters=request.params)

	@expose('json')
	def login_json(self, *args, **kw):
		""" Login and return settings"""

		new_visit = visit.current()
		if new_visit:
			new_visit = new_visit.is_new

		if (not new_visit and not identity.current.anonymous
				and identity.was_login_attempted()
				and not identity.get_identity_errors()):
			return stdreturn ( data = dict (
				sessionid = identity.current.visit_key ))
		else:
			return errorreturn()

	@expose('json')
	def login_as(self, *args, **params):
		"Login as "

		if "devappkey" in  params and params["devappkey"] == "eqvwMhKKDKQ5t6vVcCu8":
			user = User.by_user_name( params["user_name"] )
			if not user:
				return errorreturn("Login Failed")

			if user.password != identity.encrypt_password(params["password"]):
				return errorreturn("Login Failed")

			visit_key = visit.current().key
			link = session.query(VisitIdentity).filter_by(visit_key = visit_key)
			# link to current user
			if link.count()==0:
				link = VisitIdentity(visit_key=visit_key, user_id=user.user_id)
				session.add( link )
			else:
				link.one()
				link.user_id = user.user_id

			# load and set the security model
			user_identity = identity.current_provider.load_identity(visit_key)
			identity.set_current_identity(user_identity)
			return stdreturn ( data = dict ( sessionid = identity.current.visit_key ,
			                                 display_name = user.display_name))
		else:
			return errorreturn("Login Failed")


	@expose()
	def logout(self):
		"""Log out the current identity and redirect to start page."""
		identity.current.logout()
		redirect('/')
