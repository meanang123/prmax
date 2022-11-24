# -*- coding: utf-8 -*-
""" UnSubscribe """
#-----------------------------------------------------------------------------
# Name:       unsubscribe.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     23/10/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model.common import BaseSql

import logging
LOG = logging.getLogger("prcommon")

class UnSubscribe(BaseSql):
	""" has been unsubscribed"""
	pass


UnSubscribe.mapping = Table('unsubscribe', metadata, autoload=True, schema="userdata")

mapper(UnSubscribe, UnSubscribe.mapping)
