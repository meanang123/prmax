# -*- coding: utf-8 -*-
"""This module contains the controller classes of the application."""

# symbols which are imported by "from prmaxapi.controllers import *"
__all__ = ['Root']

# third-party imports
from turbogears import controllers
from turbogears.database import get_engine, create_session
get_engine()
create_session()
from prmaxapi.sitecontrollers.lists import ListController
from prmaxapi.sitecontrollers.user import TokenController
from prcommon.sitecontrollers import OpenController
from prmaxapi.sitecontrollers.usersession import SessionController


class Root(controllers.RootController):
    """The root controller of the application."""
    user = TokenController()
    lists = ListController()
    lookups = OpenController()
    session = SessionController()
