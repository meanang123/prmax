# -*- coding: utf-8 -*-
"""ClippingsOrderType Record """
#-----------------------------------------------------------------------------
# Name:        clippingsordertype.py
# Purpose:
# Author:      
# Created:     June 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingsOrderType(object):
 """ clippings order country record """

pass




ClippingsOrderType.mapping = Table('clippingsordertype', metadata, autoload=True, schema="internal")

mapper(ClippingsOrderType, ClippingsOrderType.mapping)

