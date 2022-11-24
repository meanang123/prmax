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
import cPickle as pickle
from prcommon.model.common import BaseSql
from prcommon.model.identity import VisitIdentity, User, Customer, Visit
from prcommon.model.internal import Cost, Terms, NbrOfLogins, AuditTrail
from prcommon.model.lookups import PrmaxModules, CustomerSources, CustomerProducts
from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.crm import Task
from prcommon.model import Client, Issue
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
from ttl.ttlemail import EmailMessage, SMTPSERVERBYTYPE
from prcommon.model.customer.customeremailserver import CustomerEmailServer
from ttl.sqlalchemy.ttlcoding import CryptyInfo


CRYPTENGINE = CryptyInfo(Constants.KEY1)
LOGGER = logging.getLogger("prcommon")


class Statements(BaseSql):
	""" Statements table"""

	List_Types = """SELECT statementdescription FROM userdata.statements ORDER BY statementdescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		data = [dict(id=row.statementid, name=row.statementdescription)
				        for row in session.query(Statements).filter(Statements.customerid == params['customerid']).all()]
		return data

	@classmethod
	def delete(cls, params):
		""" delete a statement """

		try:
			transaction = cls.sa_get_active_transaction()
			statement = Statements.query.get(params["statementid"])
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
						        customerid=params["customerid"],
						        clientid=params["clientid"],
						        issueid=params["issueid"])
			session.add(statement)
			session.flush()
			transaction.commit()
			return statement.statementid
		except:
			LOGGER.exception("Statement_add")
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
			statement.issueid = params["issueid"]
			statement.output = params["output"]

			transaction.commit()
			return statement.statementid
		except:
			LOGGER.exception("Statement_update")
			transaction.rollback()
			raise

	ListData = """SELECT statementid, statementdescription, c.clientid, c.clientname, i.issueid, i.name as issuename, output, 
	to_char(s.created,'DD/MM/YYYY') AS created
        FROM userdata.statements AS s
        LEFT OUTER JOIN userdata.client AS c ON c.clientid = s.clientid
        LEFT OUTER JOIN userdata.issues AS i ON i.issueid = s.issueid
        WHERE s.customerid = :customerid
        ORDER BY  %s %s
        LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM userdata.statements WHERE customerid = :customerid"""


	ListDataEngagements = """SELECT chresp.contacthistoryresponseid, statementid, crm_subject, chresp.contacthistoryid, chresp.contacthistoryresponseid, outletname,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
        to_char(chresp.taken, 'DD/MM/YY') AS taken
        FROM userdata.contacthistoryresponses AS chresp
        JOIN userdata.contacthistory AS ch ON chresp.contacthistoryid = ch.contacthistoryid
	LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	LEFT OUTER JOIN employees AS e ON ch.employeeid = e.employeeid
	LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
        """

	ListDataEngagementsCount = """
        SELECT COUNT(*)
        FROM userdata.contacthistoryresponses AS chresp
        JOIN userdata.contacthistory AS ch ON chresp.contacthistoryid = ch.contacthistoryid
        """

	ListDataClippings = """SELECT clip.clippingid, statementid, outletname,
        to_char(clip.clip_source_date, 'DD/MM/YY') AS sourcedate
        FROM userdata.clippings AS clip
	    LEFT OUTER JOIN outlets AS o ON o.outletid = clip.outletid
        """

	ListDataClippingsCount = """
        SELECT COUNT(*)
        FROM userdata.clippings AS clip
        """

	EMPTYGRID = dict (numRows = 0, items = [], identifier = 'statementid')

	@classmethod
	def get_grid_page(cls, params):
		""" get a page of statements"""

		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "s.created"
			params['direction'] = "DESC"

		return Statements.getGridPage(params,
				                           'created',
				                           'statementid',
				                           Statements.ListData,
				                           Statements.ListDataCount,
				                           cls)

	@classmethod
	def get_engagements_grid_page(cls, params):
		""" get a page of engagements that have used in a specific statementid"""

		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "chresp.taken"
			params['direction'] = "DESC"

		whereclause = ' WHERE statementid = %s ' % params['statementid']

		return  Statements.getGridPage(params,
		                                   'taken',
				                           'contacthistoryresponseid',
				                           Statements.ListDataEngagements + whereclause + BaseSql.Standard_View_Order,
				                           Statements.ListDataEngagementsCount + whereclause,
				                           cls)

	@classmethod
	def get_clippings_grid_page(cls, params):
		""" get a page of engagements that have used in a specific statementid"""

		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "clip.clip_source_date"
			params['direction'] = "DESC"

		whereclause = ' WHERE statementid = %s ' % params['statementid']

		return  Statements.getGridPage(params,
		                                   'clip_source_date',
				                           'clippingid',
				                           Statements.ListDataClippings + whereclause + BaseSql.Standard_View_Order,
				                           Statements.ListDataClippingsCount + whereclause,
				                           cls)


	@classmethod
	def get(cls, statementid):
		""" get a statement"""

		statement = Statements.query.get(statementid)
		clientname = issuename = ''
		if statement and statement.clientid:
			client = Client.query.get(statement.clientid)
			clientname = client.clientname
		if statement and statement.issueid:
			issue = Issue.query.get(statement.issueid)
			issuename = issue.name

		return dict(statementid = statementid,
				            statementdescription=statement.statementdescription,
				            clientid=statement.clientid if statement.clientid else None,
				            clientname=clientname,
				            issueid=statement.issueid if statement.issueid else None,
				            issuename=issuename,
				            output=statement.output)

	@classmethod
	def get_list_rest(cls, params):
		""" list of statementf ro """

		single = True if "id" in params else False

		return cls.grid_to_rest(cls.combo(params),
				                        params['offset'],
				                        single)

	_Single_Record = """SELECT statementid AS id,statementdescription FROM userdata.statements WHERE statementid = :id"""
	_List_Combo = """SELECT statementid AS id,statementdescription FROM userdata.statements WHERE customerid = :customerid AND statementdescription ilike :statementdescription ORDER BY statementdescription"""

	@classmethod
	def combo(cls, params):
		"""client conbo list """

		if "id" in params:
			if params["id"] == "-1":
				command = None
			else:
				command = Statements._Single_Record
		else:
			command = Statements._List_Combo
			if not "statementdescription" in params:
				params["statementdescription"] = "%"
			else:
				if params["statementdescription"] == "*":
					params["statementdescription"] = "%"
				else:
					params["statementdescription"] += "%"

		if command:
			items = cls.sqlExecuteCommand(
			    text(command),
			    params,
			    BaseSql.ResultAsEncodedDict)
		else:
			items = []

		if (not params.get("id", None) or params.get("id", "") in("-1", -1)):
			items.insert(0, dict(id=-1, statementid=-1, name="No Selection", statementdescription="No Selection"))

		return dict(
		    identifier="id",
		    numRows=len(items),
		    items=items)

	@classmethod
	def resend(cls, params):
		"""  """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			ces = CustomerEmailServer.get(params['customeremailserverid'])
			statement = Statements.query.get(params['statementid'])
			
			email = EmailMessage(ces.fromemailaddress,
			                     params['toemailaddress'],
			                     statement.statementdescription,
			                     statement.output,
			                     "text/html"
			                     )
			email.BuildMessage()
			email.cc = params['ccemailaddresses']

			if ces.servertypeid in SMTPSERVERBYTYPE:
				emailserver = SMTPSERVERBYTYPE[ces.servertypeid](
				    username=CRYPTENGINE.aes_decrypt(ces.username),
				    password=CRYPTENGINE.aes_decrypt(ces.password),
					host=ces.host)
				sender = ces.fromemailaddress

				(error, statusid) = emailserver.send(email, sender)
				if not statusid:
					raise Exception("Problem Sending Email")	
		except:
			transaction.rollback()
			LOGGER.exception("resend statement")
			raise

#########################################################
# load tables from db
Statements.mapping = Table("statements", metadata, autoload=True, schema="userdata")

mapper(Statements, Statements.mapping)
