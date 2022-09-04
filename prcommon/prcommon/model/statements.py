# -*- coding: utf-8 -*-
"""statements"""
#-----------------------------------------------------------------------------
# Name:        statement.py
# Purpose:	   To control statements
#
# Author:      
#
# Created:    Sept 2017
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


class Statements(BaseSql):
        """ Statements table"""

        List_Types = """SELECT statementdescription FROM userdata.statements ORDER BY statementdescription"""

        @classmethod
        def getLookUp(cls, params):
                """ get a lookup list """
                def _convert(data):
                        """"local convert"""
                        return [dict(id=row.statementid, name=row.statementdescription) for row in data.fetchall()]

                return cls.sqlExecuteCommand(text(Statements.List_Types), None, _convert)

#        @classmethod
#        def exists(cls, params):
#                """ Check to see if a host exists """
#                if "statementdescription" in params:
#                        result = session.execute(text("SELECT statementdescription FROM userdata.statements WHERE statementdescription ILIKE :statementdescription"), params, cls)
#                        tmp = result.fetchall()
#                        return True if tmp else False
#                return False

        @classmethod
        def delete(cls, params):
                """ delete a host """

                try:
                        transaction = cls.sa_get_active_transaction()
                        statement = Statement.query.get(params["statementid"])
                        session.delete(statement)
                        transaction.commit()
                except:
                        LOGGER.exception("Statement_delete")
                        transaction.rollback()
                        raise

        @classmethod
        def add(cls, params):
                """ add a new statement """
                try:
                        transaction = cls.sa_get_active_transaction()
                        statement = Statements(
                                statementdescription=params["statementdescription"],
                                output=params["output"],
                                clientid=params.get("clientid", None),
                                selector=params.get("issueid", None))
                        session.add(statement)
                        session.flush()
                        transaction.commit()
                        return statement.statementid
                except:
                        LOGGER.exception("Host_add")
                        transaction.rollback()
                        raise

        @classmethod
        def update(cls, params):
                """ update a statement """
                try:
                        transaction = cls.sa_get_active_transaction()
                        statementid = params["statementid"]
                        statement = Statements.query.get(statementid)
                        statement.statementdescription = params["statementdescription"]
                        statement.clientid = params["clientid"]
                        statement.issueid = params["client"]

                        transaction.commit()
                except:
                        LOGGER.exception("Statement_update")
                        transaction.rollback()
                        raise

        ListData = """SELECT statementdescription, output, clientid, issueid
        FROM userdata.statements
        ORDER BY  %s %s
        LIMIT :limit  OFFSET :offset """

        ListDataCount = """SELECT COUNT(*) FROM userdata.statements"""

        @classmethod
        def get_grid_page(cls, params):
                """ get a page of statements"""

                params["sort"] = 'UPPER(statementdescription)'

                return BaseSql.getGridPage(params,
                                           'UPPER(statementdescription)',
                                           'statementid',
                                           Statements.ListData,
                                           Statements.ListDataCount,
                                           cls)

        @classmethod
        def get(cls, params):
                """ get a statement"""

                statementid = params['statementid']
                statement = Statements.query.get(statementid)
                return dict(statementdescripiton=statement.statementid,
                            clientid=statement.clientid,
                            issueid=statement.issueid)


#########################################################
# load tables from db
Statements.mapping = Table("statemetns", metadata, autoload=True, schema="userdata")

mapper(Statements, Statements.mapping)
