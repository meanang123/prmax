# -*- coding: utf-8 -*-
"""HostSpf methods"""
#-----------------------------------------------------------------------------
# Name:        hostspf.py
# Purpose:		To control hostspf records
#
# Author:      
#
# Created:    26/06/2017
# RCS-ID:      $Id:  $
# Copyright:  (c) 2017

#-----------------------------------------------------------------------------
import datetime
import logging
from copy import deepcopy
from turbogears.database import metadata, mapper, session
from turbogears import visit, identity
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from prcommon.model.identity import VisitIdentity, User, Customer, Visit
from prcommon.model.internal import Cost, Terms, NbrOfLogins, AuditTrail
from prcommon.model.lookups import PrmaxModules, CustomerSources, CustomerProducts
from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.crm import Task
from prcommon.model.communications import Address
import prcommon.Constants as Constants
from prcommon.model.crm import ContactHistory
from prcommon.model.lookups import VatCodes, Countries, CustomerTypes
from prcommon.model.report import Report
from prcommon.model.crm2.solidmediageneral import SolidMediaGeneral
from prcommon.sales.salesorderconformation import SendOrderConfirmationBuilder, UpgradeConfirmationBuilder
from ttl.string import Translate25UTF8ToHtml
from ttl.PasswordGenerator import Pgenerate
from ttl.postgres import DBCompress
from ttl.ttldate import TtlDate, DateAddMonths
from ttl.ttlmaths import toInt, from_int


LOGGER = logging.getLogger("prcommon")


class Hostspf(BaseSql):
	""" Hostspf table"""

	List_Types = """SELECT host FROM internal.hostspf ORDER BY host"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.host) for row in data.fetchall()]

		return cls.sqlExecuteCommand(text(Hostspf.List_Types), None, _convert)

	@classmethod
	def exists(cls, params):
		""" Check to see if a host exists """
		if "host" in params:
			result = session.execute(text("SELECT host FROM internal.hostspf WHERE host ILIKE :host"), params, cls)
			tmp = result.fetchall()
			return True if tmp else False
		return False
		
	@classmethod
	def delete(cls, params):
		""" delete a host """

		try:
			transaction = cls.sa_get_active_transaction()
			hostspf = Hostspf.query.get(params["host"])
			session.delete(hostspf)
			transaction.commit()
		except:
			LOGGER.exception("Host_delete")
			transaction.rollback()
			raise

	@classmethod
	def add(cls, params):
		""" add a new hostspf """
		try:
			transaction = cls.sa_get_active_transaction()
			hostspf = Hostspf(
			  host=params["host"],
			  is_valid_source=params["is_valid_source"],
			  privatekey=params["privatekey"],
			  selector=params["selector"])
			session.add(hostspf)
			session.flush()
			transaction.commit()
			return hostspf.host
		except:
			LOGGER.exception("Host_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" update a hostspf """
		try:
			transaction = cls.sa_get_active_transaction()
			host = params["host"] if "host" in params else params['host2']
			hostspf = Hostspf.query.get(host)
			hostspf.is_valid_source = params["is_valid_source"] if "is_valid_source" in params else params["is_valid_source2"]
			hostspf.privatekey = params["privatekey"] if "privatekey" in params else params["privatekey2"]
			hostspf.selector = params["selector"] if "selector" in params else params["selector2"]

			transaction.commit()
		except:
			LOGGER.exception("Host_update")
			transaction.rollback()
			raise

	ListData = """
	SELECT
		host,
	  is_valid_source,
	  privatekey,
	  selector
	FROM internal.hostspf
	ORDER BY  %s %s
	LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM internal.hostspf"""

	@classmethod
	def get_grid_page(cls, params):
		""" get a page of hosts"""

		params["sort"] = 'UPPER(host)'

		return BaseSql.getGridPage(params,
								                'UPPER(host)',
								                'host',
								                Hostspf.ListData,
								                Hostspf.ListDataCount,
								                cls)

	@classmethod
	def get(cls, params):
		""" get a hostspf"""

		host = params['host'] if "host" in params else params["host2"]
  		hostspf = Hostspf.query.get(host)
		return dict(host=hostspf.host,
				    is_valid_source=hostspf.is_valid_source,
				    privatekey=hostspf.privatekey,
		            selector=hostspf.selector)


#########################################################
# load tables from db
Hostspf.mapping = Table("hostspf", metadata, autoload=True, schema="internal")

mapper(Hostspf, Hostspf.mapping)
