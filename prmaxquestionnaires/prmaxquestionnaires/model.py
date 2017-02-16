# -*- coding: utf-8 -*-
"""This module contains the data model of the application."""

from turbogears.database import get_engine, create_session

get_engine()
create_session()

# symbols which are imported by "from pprcontrol.model import *"
from prcommon.model import QuestionnairesGeneral

__all__ = ['QuestionnairesGeneral']