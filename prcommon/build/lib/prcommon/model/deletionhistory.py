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

import logging
LOGGER = logging.getLogger("prcommon.model")

class DeletionHistory(BaseSql):
	""" Deletionhistory Record"""
	ListData = """
		SELECT deletionhistoryid, objectid, deletionhistorydescription, outlet_name, firstname, familyname, domain, 
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

	ListDataNames = """SELECT deletionhistoryid, outlet_name
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
		if "outlet_name" in params:
			whereused = BaseSql.addclause(whereused, "dh.outlet_name ilike :outlet_name")
			if params["outlet_name"]:
				params["outlet_name"] = params["outlet_name"].replace("*", "")
				params["outlet_name"] = "%" + params["outlet_name"] +  "%"
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
			    outlet_name=params["outlet_name"],
			    firstname=params["firstname"],
			    familyname=params["familyname"],
			    domain=params["domain"],
			    researchprojectid=params["researchprojectid"],
			    reasoncodeid=params["reasoncodeid"],
			    deletionhistorytypeid=params["deletionhistorytypeid"],
			    userid=params["iuserid"] if ("iuserid" in params and int(params['iuserid']) != -1) else params['user_id'],
			    deletiondate=params["deletiondate"],
			    objectid=params['objectid']
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
			deletionhistory.outlet_name = params["outlet_name"]
			deletionhistory.firstname = params["firstname"]
			deletionhistory.familyname = params["familyname"]
			deletionhistory.domain = params["domain"]
			deletionhistory.researchprojectid = params["researchprojectid"]
			deletionhistory.reasoncodeid = params["reasoncodeid"]
			deletionhistory.deletionhistorytypeid = params["deletionhistorytypeid"]
			deletionhistory.userid = params["iuserid"] if ("iuserid" in params and int(params['iuserid']) != -1) else params['user_id']
			deletionhistory.deletiondate = params["deletiondate"]
			deletionhistory.objectid = params["objectid"]

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
		if params['mode'] == 'outlet':
			if 'www' in params and params['www'] != '' and params['www'] != None:
				if 'www.' in params['www']:
					params['domain'] = params['www'].split("www.")[1].lower()
				elif params['www'].startswith('http://'):
					params['domain'] = params['www'][7:]
				elif params['www'].startswith('https://'):
					params['domain'] = params['www'][8:]
				params["domain"] = "%" + params["domain"] + "%"
				deletionhistory = session.query(DeletionHistory).\
				    filter(DeletionHistory.domain.ilike(params['domain'])).\
				    filter(DeletionHistory.deletionhistorytypeid == 1).first()
			else:
				deletionhistory = session.query(DeletionHistory).\
				    filter(DeletionHistory.outlet_name.ilike(params['outletname'])).\
				    filter(DeletionHistory.deletionhistorytypeid == 1).first()
		elif params['mode'] == 'freelance':
			from prcommon.model.contact import Contact
			
			contact = Contact.query.get(params["contactid"])
			deletionhistory = session.query(DeletionHistory).\
		        filter(DeletionHistory.outlet_name.ilike(contact.getName())).\
		        filter(DeletionHistory.deletionhistorytypeid == 2).first()
		elif params['mode'] == 'contact':
			deletionhistory = session.query(DeletionHistory).\
			    filter(DeletionHistory.firstname.ilike(params['firstname'].lower())).\
			    filter(DeletionHistory.familyname.ilike(params['familyname'].lower())).\
			    filter(DeletionHistory.deletionhistorytypeid == 3).first()
			
		if deletionhistory:
			return deletionhistory

	@classmethod
	def delete(cls, deletionhistoryid):
		""" Delete deletionhistory record """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			deletionhistory = DeletionHistory.query.get(deletionhistoryid)
			session.delete(deletionhistory)
			transaction.commit()
		except:
			LOGGER.exception("Deletion History Delete")
			try:
				transaction.rollback()
			except :
				pass
			raise

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
