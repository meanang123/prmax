# -*- coding: utf-8 -*-
"""This module contains the controller classes of the application."""

# symbols which are imported by "from prmaxapi.controllers import *"
__all__ = ['Root']

# third-party imports
from turbogears import controllers
from turbogears import expose, validate, exception_handler, error_handler
from turbogears.database import get_engine, create_session
from ttl.base import stdreturn
get_engine()
create_session()
from prmaxapiext.sitecontrollers.search import SearchController
from prcommon.sitecontrollers import OpenController


class Root(controllers.RootController):
    """The root controller of the application."""
    search = SearchController()
    lookups = OpenController()


    @expose("json")
    def login(self, *args, **kw):
        "std login method"

        data = {"authentication":"failed"}
        return data

        