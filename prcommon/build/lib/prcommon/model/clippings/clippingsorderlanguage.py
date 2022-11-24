# -*- coding: utf-8 -*-
"""ClippingsOrderLanguage Record """
#-----------------------------------------------------------------------------
# Name:        clippingsorderlanguage.py
# Purpose:
# Author:      
# Created:     June 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingsOrderLanguage(object):
 """ clippings order country record """

pass




ClippingsOrderLanguage.mapping = Table('clippingsorderlanguage', metadata, autoload=True, schema="internal")

mapper(ClippingsOrderLanguage, ClippingsOrderLanguage.mapping)

