# -*- coding: utf-8 -*-
"""This module contains the data model of the application."""

# symbols which are imported by "from prmaxservices.model import *"
__all__ = ['Group', 'Permission', 'User', 'Visit', 'VisitIdentity']

from turbogears.database import get_engine, create_session

get_engine()
create_session()

from datetime import datetime

import pkg_resources
pkg_resources.require('SQLAlchemy>=0.4.3')

from turbogears.database import get_engine, metadata, session
# import the standard SQLAlchemy mapper
from sqlalchemy.orm import mapper
# To use the session-aware mapper use this import instead
# from turbogears.database import session_mapper as mapper
# import some basic SQLAlchemy classes for declaring the data model
# (see http://www.sqlalchemy.org/docs/05/ormtutorial.html)
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.orm import relation
# import some datatypes for table columns from SQLAlchemy
# (see http://www.sqlalchemy.org/docs/05/reference/sqlalchemy/types.html for more)
from sqlalchemy import String, Unicode, Integer, DateTime
from turbogears import identity


from  pprcommon.model import Group, Permission,User, Visit, VisitIdentity
