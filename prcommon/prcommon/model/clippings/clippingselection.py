# -*- coding: utf-8 -*-
"""User selections Record """
#-----------------------------------------------------------------------------
# Name:        clippingselection.py
# Purpose:
# Author:      
# Created:     July 2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table

import logging
LOG = logging.getLogger("prcommon")

class ClippingSelection(object):
 """ clippings user selection """

pass




ClippingSelection.mapping = Table('clippingselection', metadata, autoload=True, schema="userdata")

mapper(ClippingSelection, ClippingSelection.mapping)

