# -*- coding: utf-8 -*-
"""Deletionhistory record """
#-----------------------------------------------------------------------------
# Name:       deletionhistory.py
# Purpose:
# Author:     Stamatia Vatsi
#
# Created:     August/2019
# Copyright:   (c) 2019
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from prcommon.model.contact import Contact

import logging
LOGGER = logging.getLogger("prcommon.model")

class DeletionHistory(BaseSql):
	""" Deletionhistory Record"""
	ListData = """
		SELECT deletionhistoryid, deletionhistorydescription, outletname, firstname, familyname, domain, 
	    researchprojectname, reasoncodedescription, deletionhistorytypedescription, user_name, 
	    to_char(deletiondate, 'YYYY-MM-DD') as deletiondate
		FROM userdata.deletionhistory AS dh
	    LEFT OUTER JOIN research.researchprojects AS rp ON rp.researchprojectid = dh.researchprojectid
	    LEFT OUTER JOIN internal.reasoncodes AS rc ON rc.reasoncodeid = dh.reasoncodeid 
	    LEFT OUTER JOIN internal.deletionhistorytype AS dht ON dht.deletionhistorytypeid = dh.deletionhistorytypeid
	    LEFT OUTER JOIN tg_user AS u ON u.user_id = dh.userid
	    """

	ListDataCount = """
		SELECT COUNT(*) FROM userdata.deletionhistory AS dh """

	ListDataNames = """SELECT deletionhistoryid, outletname
		FROM userdata.deletionhistory AS dh"""
	ListDataNamesCount = """SELECT COUNT(*) FROM userdata.deletionhistory AS dh """

	@classmethod
	def get_list_deletionhistory(cls, params):
		""" get rest page  """
		whereused = ""

		if "deletionhistoryid" in  params:
			whereused = BaseSql.addclause(whereused, "dh.deletionhistoryid = :deletionhistoryid")
		if "deletiondate" in  params:
			whereused = BaseSql.addclause(whereused, "dh.deletiondate >= :deletiondate")
		if "deletionhistorydescription" in params:
			whereused = BaseSql.addclause(whereused, "dh.deletionhistorydescription ilike :deletionhistorydescription")
			if params["deletionhistorydescription"]:
				params["deletionhistorydescription"] = params["deletionhistorydescription"].replace("*", "")
				params["deletionhistorydescription"] = "%" + params["deletionhistorydescription"] +  "%"
		if "outletname" in params:
			whereused = BaseSql.addclause(whereused, "dh.outletname ilike :outletname")
			if params["outletname"]:
				params["outletname"] = params["outletname"].replace("*", "")
				params["outletname"] = "%" + params["outletname"] +  "%"
		if "firstname" in params:
			whereused = BaseSql.addclause(whereused, "dh.firstname ilike :firstname")
			if params["firstname"]:
				params["firstname"] = params["firstname"].replace("*", "")
				params["firstname"] = "%" + params["firstname"] +  "%"
		if "familyname" in params:
			whereused = BaseSql.addclause(whereused, "dh.familyname ilike :familyname")
			if params["familyname"]:
				params["familyname"] = params["familyname"].replace("*", "")
				params["familyname"] = "%" + params["familyname"] +  "%"
		if "domain" in params:
			whereused = BaseSql.addclause(whereused, "dh.domain ilike :domain")
			if params["domain"]:
				params["domain"] = params["domain"].replace("*", "")
				params["domain"] = "%" + params["domain"] +  "%"
		if "researchprojectid" in params:
			whereused = BaseSql.addclause(whereused, "dh.researchprojectid = :researchprojectid")
			if params['researchprojectid']:
				params['researchprojectid'] = int(params['researchprojectid'])
		if "reasoncodeid" in params:
			whereused = BaseSql.addclause(whereused, "dh.reasoncodeid = :reasoncodeid")
			if params['reasoncodeid']:
				params['reasoncodeid'] = int(params['reasoncodeid'])
		if "deletionhistorytypeid" in params:
			whereused = BaseSql.addclause(whereused, "dh.deletionhistorytypeid = :deletionhistorytypeid")
			if params['deletionhistorytypeid']:
				params['deletionhistorytypeid'] = int(params['deletionhistorytypeid'])
		if "iuserid" in params:
			whereused = BaseSql.addclause(whereused, "dh.userid = :iuserid")
			if params['iuserid']:
				params['iuserid'] = int(params['iuserid'])


		return cls.get_rest_page_base(
									params,
									'dh.deletionhistoryid',
									'dh.deletionhistorydescription',
									DeletionHistory.ListData + whereused + BaseSql.Standard_View_Order,
									DeletionHistory.ListDataCount + whereused,
									cls)


	@classmethod
	def add(cls, params):
		""" add a new deletionhistory to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			deletionhistory = DeletionHistory(
			    deletionhistorydescription=params["deletionhistorydescription"],
			    outletname = params["outletname"],
			    firstname = params["firstname"],
			    familyname = params["familyname"],
			    domain = params["domain"],
			    researchprojectid = params["researchprojectid"],
			    reasoncodeid = params["reasoncodeid"],
			    deletionhistorytypeid = params["deletionhistorytypeid"],
			    userid = params["iuserid"] if ("iuserid" in params and int(params['iuserid']) != -1) else params['user_id'],
			    deletiondate = params["deletiondate"]
			)
			session.add(deletionhistory)
			session.flush()
			transaction.commit()
			return deletionhistory.deletionhistoryid
		except:
			LOGGER.exception("DeletionHistory Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def update(cls, params):
		""" update deletionhistory to the system """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			deletionhistory = DeletionHistory.query.get(params["deletionhistoryid"])

			deletionhistory.deletionhistorydescription = params["deletionhistorydescription"]
			deletionhistory.outletname = params["outletname"]
			deletionhistory.firstname = params["firstname"]
			deletionhistory.familyname = params["familyname"]
			deletionhistory.domain = params["domain"]
			deletionhistory.researchprojectid = params["researchprojectid"]
			deletionhistory.reasoncodeid = params["reasoncodeid"]
			deletionhistory.deletionhistorytypeid = params["deletionhistorytypeid"]
			deletionhistory.userid = params["iuserid"] if ("iuserid" in params and int(params['iuserid']) != -1) else params['user_id']
			deletionhistory.deletiondate = params["deletiondate"]

			transaction.commit()
		except:
			LOGGER.exception("DeletionHistory Update")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def exist(cls, params):
		if 'contactid' in params:
			contact = Contact.query.get(params["contactid"])

			deletionhistory = session.query(DeletionHistory).\
			    filter(DeletionHistory.outletname.ilike(contact.getName())).\
			    filter(DeletionHistory.firstname.ilike(contact.firstname)).\
			    filter(DeletionHistory.familyname.ilike(contact.familyname)).\
			    filter(DeletionHistory.deletionhistorytypeid == 2).first()
		elif 'outletname' in params and params['outletname'] != None:
			deletionhistory = session.query(DeletionHistory).\
			    filter(DeletionHistory.outletname.ilike(params['outletname'])).\
			    filter(DeletionHistory.deletionhistorytypeid == 1).first()
		elif 'firstname' in params and params['firstname'] != None \
		   and 'familyname' in params and params['familyname'] != None:
			deletionhistory = session.query(DeletionHistory).\
			    filter(DeletionHistory.firstname.ilike(params['firstname'].lower())).\
			    filter(DeletionHistory.familyname.ilike(params['familyname'].lower())).\
			    filter(DeletionHistory.deletionhistorytypeid == 3).first()
			
		if deletionhistory:
			return deletionhistory


	@classmethod
	def get(cls, deletionhistoryid):
		""" Get prmaxrole details and extended details"""

		return DeletionHistory.query.get(deletionhistoryid)

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """

		return [dict(id=row.deletionhistoryid, name=row.deletionhistorydescription)
				       for row in session.query(DeletionHistory).order_by(DeletionHistory.deletionhistoryid).all()]

#########################################################
## Map object to db
#########################################################

DeletionHistory.mapping = Table('deletionhistory', metadata, autoload=True, schema='userdata')

mapper(DeletionHistory, DeletionHistory.mapping)
