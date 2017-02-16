# -*- coding: utf-8 -*-
"""Question Record """
#-----------------------------------------------------------------------------
# Name:        question.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from prcommon.model.common import BaseSql

import logging
LOG = logging.getLogger("prcommon")

class Question(BaseSql):
	""" Question record """
	pass


Question.mapping = Table('questions', metadata, autoload=True, schema="userdata")

mapper(Question, Question.mapping)

