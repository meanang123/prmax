# -*- coding: utf-8 -*-
"""ClippingsIssues Record """
#-----------------------------------------------------------------------------
# Name:        clippingsissues.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingsIssues(object):
	""" clippings record """
	pass

ClippingsIssues.mapping = Table('clippingsissues', metadata, autoload=True, schema="userdata")

mapper(ClippingsIssues, ClippingsIssues.mapping)

