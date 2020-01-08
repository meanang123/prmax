# -*- coding: utf-8 -*-
"""Contact"""
#-----------------------------------------------------------------------------
# Name:        contact.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     25/03/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import logging
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from prcommon.model.research import Activity, ActivityDetails
from prcommon.model.internal import SourceType
from prcommon.model.indexer import IndexerQueue, StandardIndexer
from prcommon.model.deletionhistory import DeletionHistory
from prcommon.model import Customer

import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

class Contact(BaseSql):
	"""
	Contact object
    """
	__Contact_List = """
	SELECT ContactName(con.familyname,con.firstname,con.prefix,'','') as contactname,
		con.contactid
	FROM contacts as con
	WHERE con.customerid=:customerid AND
	con.familyname ILIKE :contactname
	ORDER BY con.familyname
	LIMIT :count OFFSET :start"""

	__Contact_List_Research = """
	SELECT ContactName(con.familyname,con.firstname,con.prefix,'','')||' ('||con.contactid||')' as contactname,
		con.contactid,
	  con.contactid AS id

	FROM contacts as con
	WHERE con.familyname||' '||con.firstname ILIKE :contactname AND
		con.customerid=-1 AND sourcetypeid in (1,2)
	ORDER BY con.familyname, con.firstname
	LIMIT :count OFFSET :start"""

	__Contact_List_Research_Count = """
	SELECT COUNT(*)
	FROM contacts as con
	WHERE con.familyname||' '||con.firstname ILIKE :contactname AND
		con.customerid=-1"""

	__Contact_List_Single = """
	SELECT ContactName(con.familyname,con.firstname,con.prefix,'','') as contactname,
		con.contactid
	FROM contacts as con
	WHERE con.customerid=:customerid AND
	ContactName(con.familyname,con.firstname,con.prefix,'','')||' ('||con.contactid||')'  ILIKE :contactname
	LIMIT :count OFFSET :start"""

	__Contact_List_Research_Single = """
	SELECT ContactName(con.familyname,con.firstname,con.prefix,'','')||' ('||con.contactid||')' as contactname,
		con.contactid
	FROM contacts as con
	WHERE con.customerid=-1 AND sourcetypeid in (1,2) AND
	ContactName(con.familyname,con.firstname,con.prefix,'','')||' ('||con.contactid||')'  ILIKE :contactname
	LIMIT :count OFFSET :start"""


	__Contact_List_Single_By_Id = """
		SELECT ContactName(con.familyname,con.firstname,con.prefix,'','')||' ('||con.contactid||')' as contactname,
		con.contactid,
	  con.contactid AS id
	FROM contacts as con
	WHERE con.contactid = :id"""

	__Contact_Exists = """
	SELECT con.contactid
	FROM contacts as con
	WHERE con.customerid=:customerid AND
		con.firstname ILIKE :firstname AND
		con.familyname ILIKE :familyname"""

	def getName(self):
		""" return the contact name"""
		fields = (self.prefix, self.firstname, self.middlename, self.familyname, self.suffix)
		return " ".join([f for f in fields if f != None and len(f)]).strip()

	@classmethod
	def getLookUpList(cls, params):
		""" get a lookup list"""

		if not "count" in params:
			params['count'] = '20'

		if params.get('outletid', "") == -1:
			return dict(identifier="contactid",
						  numRows=0,
						  items=[])

		if "id" in params:
			command = Contact.__Contact_List_Single_By_Id
		else:
			params['contactname'] = params['contactname'].replace("*", "%")
			if params['contactname'].find("%") == -1:
				command = Contact.__Contact_List_Single
			else:
				command = Contact.__Contact_List

		items = cls.sqlExecuteCommand(
			text(command),
			params,
			BaseSql.ResultAsEncodedDict)

		return dict(identifier="contactid",
					numRows=len(items),
					items=items)

	@classmethod
	def getLookUpListResearch(cls, params):
		""" get a lookup list"""

		num_rows = None
		if not "count" in params:
			params['count'] = '20'

		if params.get('outletid', "") == -1:
			return dict(identifier="contactid",
			            numRows=0,
			            items=[])

		if "id" in params:
			command = Contact.__Contact_List_Single_By_Id
			num_rows = 1
		else:
			params['contactname'] = params['contactname'].replace("*", "%")
			if params['contactname'].find("%") == -1:
				command = Contact.__Contact_List_Research_Single
				if "start" not  in params:
					params["start"] = 0
					params["count"] = 1

				num_rows = 1
			else:
				command = Contact.__Contact_List_Research
				num_rows = cls.sqlExecuteCommand(text(Contact.__Contact_List_Research_Count),
				                                  params,
				                                  BaseSql.singleFieldInteger)

		items = cls.sqlExecuteCommand(
			text(command),
			params,
			BaseSql.ResultAsEncodedDict)

		return dict(identifier="contactid",
					numRows=num_rows,
					items=items)

	@classmethod
	def get_look_up_list_research(cls, params):
		""" Rest version"""

		data = cls.getLookUpListResearch(params)

		return cls.grid_to_rest(
		  data,
		  params["offset"],
		  True if "id" in params else False
		)

	@classmethod
	def add(cls, params):
		""" Add a new private contact"""

		contactid = None
		transaction = cls.sa_get_active_transaction()
		try:
			contact = Contact(familyname=params['familyname'],
			                  firstname=params['firstname'],
			                  prefix=params['prefix'],
			                  customerid=params['customerid'],
			                  sourcetypeid=Constants.Research_Source_Private)
			session.add(contact)
			session.flush()
			contactid = contact.contactid
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("contact add")
			raise

		return cls.getContactExt(contactid)

	@classmethod
	def research_add(cls, params):
		""" Add a research contact"""

		contactid = None
		transaction = BaseSql.sa_get_active_transaction()
		try:
			contact = Contact(familyname=params['familyname'],
			                  firstname=params['firstname'],
			                  prefix=params['prefix'],
			                  customerid=-1,
			                  sourcetypeid=params['sourcetypeid'] if 'sourcetypeid' in params else Constants.Research_Source_Prmax,
			                  countryid=params['countryid'])
			session.add(contact)
			session.flush()
			contactid = contact.contactid

			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                reason=params.get("reason", ""),
			                objecttypeid=Constants.Object_Type_Contact,
			                objectid=contact.contactid,
			                actiontypeid=Constants.Research_Record_Add,
			                userid=params['userid'],
			                parentobjectid=contact.contactid,
			                parentobjecttypeid=Constants.Object_Type_Contact
			                )
			session.add(activity)
			session.flush()

			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("research_contact add")
			raise

		return cls.getContactExt(contactid)

	@classmethod
	def addprivate(cls, params):
		""" Add a new private contact to th system """
		contact = Contact(familyname=params['familyname'],
		                  firstname=params['firstname'],
		                  prefix=params['prefix'],
		                  customerid=params['customerid'],
		                  sourcetypeid=Constants.Research_Source_Private)
		session.add(contact)
		session.flush()
		return contact.contactid

	@classmethod
	def research_update(cls, params):
		""" update a research contact """

		transaction = cls.sa_get_active_transaction()
		try:
			contact = Contact.query.get(params["contactid"])

			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                    reason="",
			                    objecttypeid=Constants.Object_Type_Contact,
			                    objectid=contact.contactid,
			                    actiontypeid=Constants.Research_Record_Update,
			                    userid=params['userid'],
			                    parentobjectid=contact.contactid,
			                    parentobjecttypeid=Constants.Object_Type_Contact
			                    )
			session.add(activity)
			session.flush()
			ActivityDetails.AddChange(contact.familyname, params['familyname'], activity.activityid, Constants.Field_FamilyName)
			ActivityDetails.AddChange(contact.firstname, params['firstname'], activity.activityid, Constants.Field_Firstname)
			ActivityDetails.AddChange(contact.prefix, params['prefix'], activity.activityid, Constants.Field_Prefix)

			if contact.sourcetypeid:
				old_source = SourceType.query.get(contact.sourcetypeid)
			if 'sourcetypeid' in params:
				new_source = SourceType.query.get(int(params['sourcetypeid']))
			ActivityDetails.AddChange(old_source.sourcename, new_source.sourcename, activity.activityid, Constants.Field_Sourcetypeid)

			# contact name has chnaged do index
			if contact.familyname != params['familyname']:
				Contact.do_index_contact(contact, params["familyname"])

			contact.familyname = params['familyname']
			contact.firstname = params['firstname']
			contact.prefix = params['prefix']
			contact.middlename = params.get('middlename', '')

			# set source to us
			contact.sourcetypeid = int(params['sourcetypeid'])
			contact.sourcekey = contact.contactid
			
			contact.countryid = params.get('countryid', '')

			session.flush()
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("research_update")
			raise

		return cls.getContactExt(contact.contactid)

	@staticmethod
	def do_index_contact(contact, familyname, delete_only=False):
		"Do all del etes "
		from prcommon.model.employee import Employee
		# we need to delete all reference too the old name
		# send deletes

		for row in session.query(Employee).filter(Employee.contactid == contact.contactid).all():
			for searchtypeid in Constants.FAMILY_INDEX:
				# send deletes
				indx = IndexerQueue(
				  action=Constants.index_Delete,
				  customerid=-1,
				  objecttype=searchtypeid,
				  objectid=row.employeeid,
				  data_string=StandardIndexer.standardise_string(contact.familyname))
				session.add(indx)
				# send adds but only for active rows
				if delete_only is False and row.prmaxstatusid == 1:
					indx = IndexerQueue(
					  action=Constants.index_Add,
					  customerid=-1,
					  objecttype=searchtypeid,
					  objectid=row.employeeid,
					  data_string=StandardIndexer.standardise_string(familyname))
					session.add(indx)
			for searchtypeid in Constants.FAMILY_OUTLET_INDEX:
				indx = IndexerQueue(
				  action=Constants.index_Delete,
				  customerid=-1,
				  objecttype=searchtypeid,
				  objectid=row.outletid,
				  data_string=StandardIndexer.standardise_string(contact.familyname))
				session.add(indx)
				# send adds but only for active rows
				if delete_only is False and row.prmaxstatusid == 1:
					indx = IndexerQueue(
					  action=Constants.index_Add,
					  customerid=-1,
					  objecttype=searchtypeid,
					  objectid=row.outletid,
					  data_string=StandardIndexer.standardise_string(familyname))

	@classmethod
	def research_delete(cls, params):
		""" delete  a research contact """

		transaction = cls.sa_get_active_transaction()
		try:
			contact = Contact.query.get(params["contactid"])

			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                reason=params["reason"],
			                objecttypeid=Constants.Object_Type_Contact,
			                objectid=contact.contactid,
			                actiontypeid=Constants.Research_Record_Delete,
			                userid=params['userid'],
			                parentobjectid=contact.contactid,
			                parentobjecttypeid=Constants.Object_Type_Contact,
			                name=contact.getName()
			                )
			session.add(activity)
			
			deletionhistory = DeletionHistory(objectid=contact.contactid,
					                          familyname=contact.familyname,
			                                  firstname=contact.firstname,
					                          reasoncodeid=30, #Contact request to remove
					                          deletionhistorytypeid=3, #Contact
					                          userid=params['userid']
					                          )
			session.add(deletionhistory)
			# force delete  of index
			Contact.do_index_contact(contact, None, True)

			session.delete(contact)
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("research_contact_delete")
			raise


	@classmethod
	def research_merge_contacts(cls, params):
		"""Merge contacts and delete the source contact"""

		transaction = cls.sa_get_active_transaction()
		try:
			session.execute(text("UPDATE employees SET contactid = :contactid WHERE contactid = :sourcecontactid"), params, Contact)
			session.execute(text("UPDATE userdata.contacthistory SET contactid = :contactid WHERE contactid = :sourcecontactid"), params, Contact)
			session.execute(text("DELETE from contacts WHERE contactid = :sourcecontactid"), params, Contact)

			transaction.commit()
			session.expunge_all()

		except:
			LOGGER.exception("research_merge_contacts")
			transaction.rollback()
			raise

	@classmethod
	def getContactExt(cls, contactid):
		""" get the extended details of a contact """

		from prcommon.model.employee import Employee

		contact = cls.query.get(contactid)
		contact.contactname = contact.getName()
		if contact.sourcetypeid:
			source = SourceType.query.get(contact.sourcetypeid)
			contact.sourcename = source.sourcename

		tmp = session.query(Employee.employeeid).filter(Employee.contactid == contactid).limit(1).all()
		contact.inuse = True if tmp else False
		return contact

	@classmethod
	def getContactForEdit(cls, contactid):
		""" get a contact record or empty fields"""

		if contactid > 0:
			return Contact.query.get(contactid)
		else:
			return dict(prefix="",
			            firstname="",
			            familyname="",
			            change_name="")

	@classmethod
	def exists(cls, params):
		""" check to see if a contact exist for a customer"""

		return cls.sqlExecuteCommand(
			text(Contact.__Contact_Exists),
			params,
			BaseSql.ResultExists)

	@classmethod
	def find(cls, params):
		""" check to see if a contact exist for a customer"""

		return cls.sqlExecuteCommand(
			text(Contact.__Contact_Exists),
			params,
			BaseSql.SingleFieldIntNone)


	@classmethod
	def getContactByName(cls, params):
		""" get a contact by it's firstname/familyname combination"""

		return cls.sqlExecuteCommand(
			text(Contact.__Contact_Exists),
			params,
			BaseSql.ResultAsEncodedDict)

	__Contact_List_Research_Grid_1 = """
	SELECT ContactName(con.familyname,con.firstname,con.prefix,'','') as contactname,
	con.contactid,
	st.sourcename
	FROM contacts as con
	JOIN internal.sourcetypes as st ON st.sourcetypeid = con.sourcetypeid
	WHERE con.familyname ILIKE :filter AND con.customerid=-1 AND con.sourcetypeid IN (1,2) %s
	ORDER BY %%s %%s
	LIMIT :count OFFSET :start"""

	__Contact_List_Research_Grid_Count = """
	SELECT COUNT(*) FROM contacts AS con
	WHERE con.familyname ILIKE :filter AND con.customerid=-1 AND con.sourcetypeid IN (1,2) %s"""

	EMPTYGRID = dict (numRows = 0, items = [], identifier = 'activityid')

	@classmethod
	def getGridPageResearch(cls, params):
		""" Return a page of contactsd for the research system"""
		if not params.has_key("filter"):
			return dict(identifier="contactid", numRows=0, items=[])
		else:
			return BaseSql.getGridPage(params,
									'contactname',
									'contactid',
									Contact.__Contact_List_Research_Grid_1,
									Contact.__Contact_List_Research_Grid_Count,
									cls)

	@classmethod
	def get_research_page(cls, params):
		""" page for rest controller """
		if not "filter" in params:
			data = dict(identifier="contactid", numRows=0, items=[])
		else:
			whereclause = ""
			if "contactid" in params:
				whereclause += " AND con.contactid=:contactid"
				params["contactid"] = int(params["contactid"])
			if "sourcetypeid" in params:
				whereclause += " AND con.sourcetypeid=:sourcetypeid"
				params['sourcetypeid'] = int(params["sourcetypeid"])

			if 'outletid' in params:
				from prcommon.model.outlet import Outlet
				outlet = Outlet.query.get(int(params['outletid']))
				params['countryid'] = outlet.countryid
				whereclause += """ AND (con.countryid in (SELECT countryid 
				                                         FROM internal.prmaxdatasetcountries
				                                         WHERE prmaxdatasetid in (SELECT distinct(prmaxdatasetid)
				                                                                  FROM internal.prmaxdatasetcountries
				                                                                  WHERE countryid = :countryid)
				                       OR con.countryid is null))"""

			data = BaseSql.get_grid_page(
			  params,
			  'contactname',
			  'contactid',
			  Contact.__Contact_List_Research_Grid_1 % whereclause,
			  Contact.__Contact_List_Research_Grid_Count % whereclause,
			  cls)
		return cls.grid_to_rest(data, params["offset"], False)

	__Contact_List_Research_Employee_1 = """
	SELECT e.employeeid, o.outletname, e.job_title, ot.prmax_outlettypename,ot.prmax_outlettypeid,st.sourcename,
	c.countryname
	FROM employees AS e
	JOIN outlets AS o ON e.outletid = o.outletid
	LEFT OUTER JOIN internal.prmax_outlettypes AS ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
	LEFT OUTER JOIN internal.sourcetypes as st ON st.sourcetypeid = e.sourcetypeid
	LEFT OUTER JOIN internal.countries AS c ON c.countryid = o.countryid

	WHERE  e.contactid = :contactid AND e.customerid=-1
	--AND e.sourcetypeid in (1,2,3)
	ORDER BY %s %s
	LIMIT :count OFFSET :start"""

	__Contact_List_Research_Employee_Count = """
	SELECT COUNT(*)
	FROM employees AS e WHERE  e.contactid = :contactid AND e.customerid=-1"""

	@classmethod
	def getGridPageResearchEmployed(cls, params):
		""" where used for a contact in research """
		if not params.has_key("contactid"):
			return dict(identifier="employeeid", numRows=0, items=[])
		else:
			return BaseSql.getGridPage(params,
									'outletname',
									'employeeid',
									Contact.__Contact_List_Research_Employee_1,
									Contact.__Contact_List_Research_Employee_Count,
									cls)

	@classmethod
	def get_rest_page_research_employed(cls, params):
		""" page as grid"""

		return cls.grid_to_rest(
		  cls.getGridPageResearchEmployed(params),
		  params["offset"]
		)


Contact.mapping = Table('contacts', metadata, autoload=True)
mapper(Contact, Contact.mapping)

__all__ = ["Contact",]
