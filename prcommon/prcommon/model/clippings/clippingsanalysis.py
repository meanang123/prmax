# -*- coding: utf-8 -*-
"""ClippingAnalysis Record """
#-----------------------------------------------------------------------------
# Name:        clippingsanalysis.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingAnalysis(object):
	""" clippings record """
	pass

ClippingAnalysis.mapping = Table('clippingsanalysis', metadata, autoload=True, schema="userdata")

mapper(ClippingAnalysis, ClippingAnalysis.mapping)

