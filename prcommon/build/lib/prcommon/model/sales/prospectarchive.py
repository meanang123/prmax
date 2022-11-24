# -*- coding: utf-8 -*-
"""Prospect"""
#-----------------------------------------------------------------------------
# Name:        prospectarchive.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     25/07/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from ttl.model import BaseSql
from datetime import date

import prcommon.Constants as Constants
import logging
LOG = logging.getLogger("prcommon")

class ProspectArchive(object):
	""" Prmax Prospect """

	@staticmethod
	def exists( prospectid, email):
		"""checkt to see if a email address existing in the archive file """

		return True if session.query( ProspectArchive ).filter(ProspectArchive.email == email.lower()).count() else False


ProspectArchive.mapping = Table('prospectsarchive', metadata, autoload=True, schema="sales" )
mapper(ProspectArchive, ProspectArchive.mapping)