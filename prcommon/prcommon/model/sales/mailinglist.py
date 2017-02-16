# -*- coding: utf-8 -*-
"""Mailing List"""
#-----------------------------------------------------------------------------
# Name:        mailinglist.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     01/08/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from ttl.model import BaseSql
from datetime import date

import prcommon.Constants as Constants
import logging
LOG = logging.getLogger("prcommon")

class MailingList(object):
	""" Prmax Prospect Mailng List"""


MailingList.mapping = Table('mailinglist', metadata, autoload=True, schema="sales" )
mapper(MailingList, MailingList.mapping)