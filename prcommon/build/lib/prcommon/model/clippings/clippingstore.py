# -*- coding: utf-8 -*-
"""ClippingStor Record """
#-----------------------------------------------------------------------------
# Name:        clippingstore.py
# Purpose:
# Author:      
# Created:     June 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingStore(object):
 "ClippingStore"
 pass



ClippingStore.mapping = Table('clippingstore', metadata, autoload=True, schema="public")

mapper(ClippingStore, ClippingStore.mapping)