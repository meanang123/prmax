# -*- coding: utf-8 -*-
"""QuestionScope Record """
#-----------------------------------------------------------------------------
# Name:        questionscope.py
# Purpose:
# Author:      Chris Hoy
# Created:     01/07/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class QuestionScope(object):
	""" Question Scope """
	pass


QuestionScope.mapping = Table('questionscope', metadata, autoload=True, schema="userdata")

mapper(QuestionScope, QuestionScope.mapping)

