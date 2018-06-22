# -*- coding: utf-8 -*-
"""This module contains the controller classes of the application."""
import logging

from turbogears import controllers, expose, redirect, visit, view, identity, validate
from turbogears.database import get_engine, create_session
from cherrypy import request
from ttl.base import stdreturn
from ttl.tg.validators import std_state_factory, PRmaxFormSchema, PrFormSchema
from prcommon.lib.common import add_config_details

get_engine()
create_session()
LOGGER = logging.getLogger("prmaxtouch")

from prcommon.sitecontrollers import OpenController
from prmaxtouch.sitecontrollers.contacts.contacts import ContactsController
from model import User

__all__ = ['Root']

class Root(controllers.RootController):
    """The root controller of the application."""
    lookups = OpenController()
    contact = ContactsController()

    @expose("")
    def index(self, *args, **params):
        """ index"""
        raise redirect("/start")

    @expose('prmaxtouch.templates.login')
    def login(self, forward_url=None, *args, **params):
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
            redirect(forward_url or '/start', params)

        if identity.was_login_attempted():
            if new_visit:
                msg = u"Cannot log in because your browser does not support session cookies."
            else:
                msg = u"The credentials you supplied were not correct or did not grant access to this resource."
        elif identity.get_identity_errors():
            msg = u"You must provide your credentials before accessing this resource."
        else:
            msg = u"Please log in."
            if not forward_url:
                forward_url = request.headers.get('Referer', '/start')

        # we do not set the response status here anymore since it
        # is now handled in the identity exception.
        data_dict = dict(logging_in=True, message=msg,
                                 forward_url=forward_url,
                                  previous_url=request.path_info,
                                  original_parameters=request.params)

        return add_config_details(data_dict)

    @expose()
    def logout(self):
        """Log out the current identity and redirect to start page."""
        identity.current.logout()
        redirect('/start')

    @expose("")
    def default(self, *args, **params):
        """ Default page handler for a missing page
        captures and log it"""

        LOGGER.error("**** MISSING COMMAND *****\nInfo : %s ", dict(args=args, params=params))

        return ""

    @expose('prmaxtouch.templates.home')
    @identity.require(identity.not_anonymous())
    @identity.require(identity.in_all_groups("active"))
    @validate(validators=PRmaxFormSchema(), state_factory=std_state_factory)
    def start(self, *args, **params):
        """Show the welcome page."""

        user = User.query.get(params["userid"])
        data = dict(control=user.get_json_settings())
        return add_config_details(data)
