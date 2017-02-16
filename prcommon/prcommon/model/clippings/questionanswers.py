# -*- coding: utf-8 -*-
"""QuestionAnswers Record """
#-----------------------------------------------------------------------------
# Name:        questionanswers.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class QuestionAnswers(object):
	""" Question record """
	pass


QuestionAnswers.mapping = Table('questionanswers', metadata, autoload=True, schema="userdata")

mapper(QuestionAnswers, QuestionAnswers.mapping)

