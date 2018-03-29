# -*- coding: utf-8 -*-
"""Email Server Record """
#-----------------------------------------------------------------------------
# Name:        emailserver.py
# Purpose:
# Author:
# Created:     March 2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from ttl.sqlalchemy.ttlcoding import CryptyInfo

import prcommon.Constants as Constants

import logging
LOG = logging.getLogger("prcommon")

CRYPTENGINE = CryptyInfo(Constants.KEY1)

class EmailServer(BaseSql):
	""" emailserver table"""
	pass
#	@classmethod
#	def add(cls, params):
#		""" add a new fromemailaddress record """
#
#		try:
#			transaction = cls.sa_get_active_transaction()
#			emailserver = EmailServer(
#		        email_host=params["hostname"],
#		        emailservertypeid=params["emailservertypeid"])
#			session.add(emailserver)
#			session.flush()
#			transaction.commit()
#			return emailserver.emailserverid
#		except:
#			LOG.exception("Email_server_add")
#			transaction.rollback()
#			raise

#	@classmethod
#	def get(cls, emailserverid):
#
#		return EmailServer.query.get(emailserverid);
#

EmailServer.mapping = Table('emailserver', metadata, autoload=True, schema="userdata")

mapper(EmailServer, EmailServer.mapping)
