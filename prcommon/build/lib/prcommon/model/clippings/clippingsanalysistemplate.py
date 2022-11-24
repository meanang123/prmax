# -*- coding: utf-8 -*-
"""ClippingsAnalysisTemplate Record """
#-----------------------------------------------------------------------------
# Name:        clippingsanalysistemplate.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from prcommon.model.common import BaseSql
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingsAnalysisTemplate(BaseSql):
	""" clippings record """
	pass

ClippingsAnalysisTemplate.mapping = Table('clippingsanalysistemplate', metadata, autoload=True, schema="userdata")

mapper(ClippingsAnalysisTemplate, ClippingsAnalysisTemplate.mapping)

