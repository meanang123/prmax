# -*- coding: utf-8 -*-
"""ClippingsOrderCountry Record """
#-----------------------------------------------------------------------------
# Name:        clippingsordercountry.py
# Purpose:
# Author:      
# Created:     June 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingsOrderCountry(object):
 """ clippings order country record """

pass




ClippingsOrderCountry.mapping = Table('clippingsordercountry', metadata, autoload=True, schema="internal")

mapper(ClippingsOrderCountry, ClippingsOrderCountry.mapping)

