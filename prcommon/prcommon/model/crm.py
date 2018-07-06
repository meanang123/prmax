# -*- coding: utf-8 -*-
"""Crm """
#-----------------------------------------------------------------------------
# Name:        crm.py
# Purpose:	   Customer Relationship management, This is used to store notes agains
#				publications, role and contacts, This will be developed initially
#				for the research system but will also work with the prmax+ system
#
# Author:      Chris Hoy
#
# Created:     02-09-2009
# RCS-ID:      $Id:  $
# Copyright:  (c) 2009

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model import BaseSql
from prcommon.model.identity import Group, Customer
from prcommon.model.customer.activity import Activity
from datetime import datetime
from ttl.ttldate import to_json_date

import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon.model")

class ContactHistorySources(BaseSql):
	""" Sources of contact history """

	List_of_Types = """
	SELECT contacthistorysourceid AS id, contacthistorydescription AS name
	FROM internal.contacthistorysources
	ORDER BY contacthistorydescription"""
	@classmethod
	def getLookUp(cls, params):
		""" get lookups for history types"""
		def _convert(data):
			"internal"
			return  [dict(id=row.id, name=row.name) for row in data.fetchall()]

		rdata = cls.sqlExecuteCommand(text(ContactHistorySources.List_of_Types),
									   params,
									   _convert)
		if params.has_key("nofilter"):
			rdata.insert(0, dict(id=-1, name="No Filter"))
		if params.has_key("include_no_option"):
			rdata.insert(0, dict(id=-1, name="No Selection"))

		return rdata


class ContactHistory(BaseSql):
	""" Contact Hisotry Record """

	List_View_Single = """SELECT ch.contacthistoryid,
	ch.contacthistorysourceid,
	to_char(ch.taken, 'DD/MM/YY') as taken,
	to_char(ch.taken, 'DD/MM/YY HH24:MI') as taken_display,
	to_char(ch.modified, 'DD/MM/YY') as modified,
	ch.subject,
	chs.contacthistorydescription,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	o.outletname,
	e.job_title,
	COALESCE(o.outletname,cust.customername) AS source,
	ch.details,
	taken.user_name AS takenbyname,
	mod.user_name AS modifiedbyname,
	chstatus.contacthistorystatusdescription,
	ch.outletid,
	ch.employeeid
	FROM userdata.contacthistory AS ch
	LEFT OUTER JOIN internal.contacthistorysources as chs ON chs.contacthistorysourceid = ch.contacthistorysourceid
	LEFT OUTER JOIN internal.contacthistorystatus as chstatus ON chstatus.contacthistorystatusid = ch.contacthistorystatusid
	LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	LEFT OUTER JOIN contacts AS c ON c.contactid = COALESCE(ch.contactid,e.contactid)
	LEFT OUTER JOIN internal.customers AS cust ON cust.customerid = ch.ref_customerid
	LEFT OUTER JOIN tg_user AS taken ON taken.user_id = ch.taken_by
	LEFT OUTER JOIN tg_user AS mod ON mod.user_id = ch.modifiedby
	WHERE ch.contacthistoryid = :contacthistoryid"""

	@classmethod
	def getRecord(cls, contacthistoryid, ashtml=False):
		""" Get a specific note record
		convert cr to html if required """
		data = cls.sqlExecuteCommand(
			text(ContactHistory.List_View_Single),
			dict(contacthistoryid=contacthistoryid),
			BaseSql.ResultAsEncodedDict)[0]
		if ashtml:
			data["details"] = data["details"].replace("\n", "<br/>")
		return data

	@classmethod
	def add(cls, params):
		""" add a new notes record """
		transaction = cls.sa_get_active_transaction()
		try:
			for field in("contactid", "employeeid", "outletid", "ref_customerid"):
				if not params[field]:
					params[field] = None
			if not params["ref_customerid"]:
				params["ref_customerid"] = params["customerid"]

			if params.has_key("taskid") and not params["taskid"]:
				del params["taskid"]

			params["taken_by"] = params["user_id"]

			if params.has_key("contacthistoryid"):
				del params["contacthistoryid"]

			a = ContactHistory(**params)
			session.flush()
			contacthistoryid = a.contacthistoryid
			transaction.commit()
			return contacthistoryid
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory add")
			raise

	@classmethod
	def update(cls, params):
		""" Update a notes record """
		transaction = cls.sa_get_active_transaction()
		try:
			#contacthistoryid
			ch = ContactHistory.query.get(params["contacthistoryid"])
			ch.subject = params["subject"]
			ch.contacthistorysourceid = params["contacthistorysourceid"]
			ch.details = params["details"]
			ch.modifiedby = params["userid"]
			ch.modified = datetime.now().strftime("%Y/%m/%d %H:%M:%S")

			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory update")
			raise

	@classmethod
	def deleteNote(cls, params):
		""" Delete a note record """
		transaction = cls.sa_get_active_transaction()
		try:
			#contacthistoryid
			ch = ContactHistory.query.get(params["contacthistoryid"])
			if ch:
				activity = Activity(
					customerid=params['customerid'],
					userid=params['user_id'],
					objectid=ch.contacthistoryid,
				    objecttypeid=1, #engagement
				    actiontypeid=3, #delete
				    description=ch.subject
				)
				session.add(activity)
				session.flush()

			session.delete(ch)
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory delete")
			raise


	@staticmethod
	def add_note(params):
		""" add a new notes record """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			for field in("employeeid", "outletid"):
				if not params[field] or params[field] == "-1":
					params[field] = None

			params["ref_customerid"] = params["customerid"]
			subject = None
			if 'crm_subject' in params and params['crm_subject'] != "":
				subject = params['crm_subject']
			elif 'outcome' in params and params['outcome'] != "":
				subject = params['outcome']

			if params.has_key("contacthistoryid"):
				del params["contacthistoryid"]

			contacthistory = ContactHistory(**params)
			session.flush()
			contacthistoryid = contacthistory.contacthistoryid
			# now we need too handle issue

			transaction.commit()

			return contacthistoryid
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory add_note")
			raise


	List_View = """SELECT ch.contacthistoryid,
	to_char(ch.taken, 'DD/MM/YY HH24:MI') as taken_display,
	ch.subject,
	chs.contacthistorydescription,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	o.outletname,
	e.job_title,
	COALESCE(o.outletname,cust.customername) AS source,
	chstatus.contacthistorystatusdescription
	FROM userdata.contacthistory AS ch
	LEFT OUTER JOIN internal.contacthistorysources as chs ON chs.contacthistorysourceid = ch.contacthistorysourceid
	LEFT OUTER JOIN internal.contacthistorystatus as chstatus ON chstatus.contacthistorystatusid = ch.contacthistorystatusid
	LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	LEFT OUTER JOIN contacts AS c ON c.contactid = COALESCE(ch.contactid,e.contactid)
	LEFT OUTER JOIN internal.customers AS cust ON cust.customerid = ch.ref_customerid
	%s %s
	LIMIT :limit  OFFSET :offset """

	List_View_Count = """SELECT COUNT(*) FROM userdata.contacthistory AS ch %s"""

	@classmethod
	def getGridPage(cls, params):
		""" get alist of notes"""

		whereclause = BaseSql.addclause("", "ch.ref_customerid = :icustomerid")
		if "icustomerid" not in params:
			params["icustomerid"] = params["customerid"]

		if "contacthistorysourceid" in params and params["contacthistorysourceid"] != '-1':
			whereclause = BaseSql.addclause(whereclause, "ch.contacthistorysourceid = :contacthistorysourceid")
			params["contacthistorysourceid"] = int(params["contacthistorysourceid"])

		if "taskid" in params:
			whereclause = BaseSql.addclause(whereclause, "ch.taskid = :taskid")
			params["taskid"] = int(params["taskid"])

		if "outletid" in params:
			whereclause = BaseSql.addclause(whereclause, "ch.outletid = :outletid")
			params["outletid"] = int(params["outletid"])

		if "employeeid" in params:
			whereclause = BaseSql.addclause(whereclause, "ch.employeeid = :employeeid")
			params["employeeid"] = int(params["employeeid"])

		if "sort" in params and params["sort"] == "taken_display":
			params["sort"] = "ch.taken"

		# default is date reverse order
		if "sort" not in params:
			params["sort"] = "ch.taken"
			params['direction'] = "DESC"

		return BaseSql.getGridPage(params,
									'taken',
									'contacthistoryid',
									ContactHistory.List_View % (whereclause, "ORDER BY  %s %s"),
									ContactHistory.List_View_Count % whereclause,
									cls)

	EMPTYGRID = dict(numRows=0, items=[], identifier='contacthistoryid')

class Task(BaseSql):
	""" Individual task for a user """

	def __json__(self):
		"too json"
		props = {}
		for key in self.__dict__:
			if not key.startswith('_sa_') and key != "due_date":
				props[key] = getattr(self, key)
			if key == "due_date":
				props[key] = to_json_date(self.due_date)

		return props


	List_View = """SELECT t.taskid,
	c.customerid,
	c.customername,
	ContactName(c.contact_title,c.contact_firstname,'',c.contact_surname,'') as contactname,
	to_char(t.due_date, 'DD/MM/YY') as due_date_display,
	to_char(c.created, 'DD/MM/YY') as created_display,
	to_char(t.due_date, 'FMDD/FMMM/YYYY') as due_date_full,
	CASE WHEN t.due_date<CURRENT_DATE THEN true ELSE false END AS isoverdue,
	c.tel,
	t.userid,
	u.user_name,
	tt.tasktypedescription,
	ts.taskstatusdescription,
	t.taskstatusid,
	es.emailactionstatusdescription,
	es.emailactionstatusid,
	t.tasktagid,
	tg.tasktagdescription,
	(SELECT MAX(last_logged_in) FROM tg_user AS u WHERE u.customerid = c.customerid AND u.usertypeid = 1) AS last_login,
	COALESCE(to_char((SELECT MAX(last_logged_in) FROM tg_user AS u WHERE u.customerid = c.customerid AND u.usertypeid = 1), 'DD/MM/YY'),'') as last_login_display,
	t.subject,
	ct.customertypename,
	CASE WHEN t.created_date::date=CURRENT_DATE THEN true ELSE false END AS istoday,
	t.contacthistoryid


	FROM userdata.tasks AS t
	JOIN internal.customers as c ON c.customerid = t.ref_customerid
	JOIN tg_user AS u ON u.user_id = t.userid
	JOIN internal.tasktypes AS tt ON tt.tasktypeid = t.tasktypeid
	JOIN internal.taskstatus AS ts ON ts.taskstatusid = t.taskstatusid
	JOIN internal.emailactionstatus AS es ON es.emailactionstatusid = c.emailactionstatusid
	LEFT OUTER JOIN internal.tasktags AS tg ON tg.tasktagid = t.tasktagid
	LEFT OUTER JOIN internal.customertypes AS ct ON ct.customertypeid = c.customertypeid
	LEFT OUTER JOIN userdata.contacthistory AS ch on ch.contacthistoryid = t.contacthistoryid"""

	List_View_Order = """
	 ORDER BY %s %s
	LIMIT :limit  OFFSET :offset """

	List_View_Count = """SELECT COUNT(*) FROM userdata.tasks AS t
	JOIN internal.customers as c ON c.customerid = t.ref_customerid %s"""

	View_Single = """SELECT t.taskid,
	c.customerid,
	c.customername,
	ContactName(c.contact_title,c.contact_firstname,'',c.contact_surname,'') as contactname,
	to_char(t.due_date, 'DD/MM/YY') as due_date_display,
	to_char(c.created, 'DD/MM/YY') as created_display,
	to_char(t.due_date, 'FMDD/FMMM/YYYY') as due_date_full,
	CASE WHEN t.due_date<CURRENT_DATE THEN true ELSE false END AS isoverdue,
	c.tel,
	t.userid,
	u.user_name,
	tt.tasktypedescription,
	ts.taskstatusdescription,
	t.taskstatusid,
	es.emailactionstatusdescription,
	es.emailactionstatusid,
	t.tasktagid,
	tg.tasktagdescription,
	(SELECT MAX(last_logged_in) FROM tg_user AS u WHERE u.customerid = c.customerid AND u.usertypeid = 1) AS last_login,
	COALESCE(to_char((SELECT MAX(last_logged_in) FROM tg_user AS u WHERE u.customerid = c.customerid AND u.usertypeid = 1), 'DD/MM/YY'),'') as last_login_display,
	t.subject,
	CASE WHEN t.created_date::date=CURRENT_DATE THEN true ELSE false END AS istoday
	FROM userdata.tasks AS t
	JOIN internal.customers as c ON c.customerid = t.ref_customerid
	JOIN tg_user AS u ON u.user_id = t.userid
	JOIN internal.tasktypes AS tt ON tt.tasktypeid = t.tasktypeid
	JOIN internal.taskstatus AS ts ON ts.taskstatusid = t.taskstatusid
	JOIN internal.emailactionstatus AS es ON es.emailactionstatusid = c.emailactionstatusid
	LEFT OUTER JOIN internal.tasktags AS tg ON tg.tasktagid = t.tasktagid
	WHERE t.taskid = :taskid """

	@classmethod
	def getGridPage(cls, params):
		""" get alist of notes"""

		whereclause = ""
		# filter
		if params.has_key("iuserid"):
			whereclause = BaseSql.addclause(whereclause, "t.userid = :iuserid")
		if params.has_key("icustomerid"):
			params["icustomerid"] = int(params["icustomerid"])
			whereclause = BaseSql.addclause(whereclause, "t.ref_customerid = :icustomerid")
		if params.has_key("tasktypeid"):
			whereclause = BaseSql.addclause(whereclause, "t.tasktypeid = :tasktypeid")
		if params.has_key("tasktagid"):
			params["tasktagid"] = int(params["tasktagid"])
			whereclause = BaseSql.addclause(whereclause, "t.tasktagid = :tasktagid")
		if params.has_key("taskstatusid"):
			whereclause = BaseSql.addclause(whereclause, "t.taskstatusid = :taskstatusid")
		else:
			whereclause = BaseSql.addclause(whereclause, "t.taskstatusid IN(1,2,5)")

		if "customertypeid" in params:
			whereclause = BaseSql.addclause(whereclause, "c.customertypeid = :customertypeid")
			params["customertypeid"] = int(params["customertypeid"])

		if params.get("overdue", False):
			whereclause = BaseSql.addclause(whereclause, "t.due_date < '%s'" %datetime.now().strftime("%Y-%m-%d"))

		if params.has_key("group"):
			whereclause = BaseSql.addclause(whereclause, "t.userid IN(SELECT user_id FROM user_group WHERE group_id IN(SELECT group_id FROM tg_group WHERE group_name in(%s)))" %("'" + "','".join(params["group"].split(",")) + "'",))

		if not whereclause:
			return dict(numRows=0, items=[], identifier='taskid')
		#sort
		if params.get('sortfield', '') == '':
			params['direction'] = "ASC"

		params['sortfield'] = params.get('sortfield', 'due_date')
		if params['sortfield'] == "customername":
			params['sortfield'] = "UPPER(customername)"
		elif params['sortfield'] == "contactnme":
			params['sortfield'] = "UPPER(c.contact_surname)"
		elif params['sortfield'] == "last_login_display":
			params['sortfield'] = "last_login"
		elif params['sortfield'] == "due_date_display":
			params['sortfield'] = "due_date"
		elif params['sortfield'] == "created_display":
			params['sortfield'] = "c.created"

		return BaseSql.getGridPage(params,
									'due_date',
									'taskid',
									Task.List_View  + whereclause + Task.List_View_Order,
									Task.List_View_Count % whereclause,
									cls)


	@classmethod
	def update(cls, params):
		""" Update Task"""

		transaction = cls.sa_get_active_transaction()
		try:
			task = Task.query.get(params["taskid"])
			cust = Customer.query.get(task.ref_customerid)
			task.taskstatusid = params["taskstatusid"]
			task.due_date = params["due_date"]
			task.userid = params["assigntoid"]

			if params["emailactionstatus"]:
				cust.emailactionstatusid = Constants.EmailActionStatus_NoEmails
			else:
				cust.resetEmailActionStatus()

			t = ContactHistory(ref_customerid=task.ref_customerid,
			                     taken_by=params["userid"],
			                     subject=params["reason"][:50],
			                     details=params["reason"],
			                     taskid=params["taskid"],
			                     contacthistorysourceid=Constants.Contact_History_Type_Sales)
			session.add(t)
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("Task update")
			raise

	@classmethod
	def add(cls, params):
		""" Add a new """

		transaction = cls.sa_get_active_transaction()
		try:
			task = Task(
			  taskstatusid=params["taskstatusid"],
			  due_date=params["due_date"],
			  userid=params["assigntoid"],
			  subject=params["subject"],
			  tasktypeid=params["tasktypeid"],
			  ref_customerid=params["icustomerid"])
			session.add(task)
			if params.has_key("tasktagid") and params["tasktagid"]:
				task.tasktagid = params["tasktagid"]
			session.flush()
			transaction.commit()
			return task.taskid
		except:
			transaction.rollback()
			LOGGER.exception("Task add")
			raise

	@classmethod
	def getDisplay(cls, taskid):
		"get display "

		return cls.sqlExecuteCommand(text(Task.View_Single),
		                              dict(taskid=taskid),
		                              BaseSql.SingleResultAsEncodedDict)


class TaskTags(BaseSql):
	""" tags associated with a task allows each group sales/accoutns to have their
	own internal status"""

	List_Types = """SELECT tasktagid,tasktagdescription FROM internal.tasktags WHERE(groupid is NULL %s ) ORDER BY tasktagdescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.tasktagid, name=row.tasktagdescription)
					for row in data.fetchall()]

		restrict = " OR groupid IN(SELECT group_id FROM tg_group WHERE group_name in(%s))" %("'" + "','".join(params["group"].split(","))+ "'",)

		return cls.sqlExecuteCommand(text(TaskTags.List_Types % restrict), None, _convert)


	List_View = "SELECT tasktagid, tasktagdescription FROM internal.tasktags "
	List_View_Count = "SELECT COUNT(*) FROM internal.tasktags "

	@classmethod
	def getGridPage(cls, params):
		""" get alist of notes"""

		whereclause = " WHERE groupid IN(SELECT group_id FROM tg_group WHERE group_name in(%s))" %("'" + "','".join(params["group"].split(","))+ "'",)

		#sort
		#params['sortfield'] = "UPPER(tasktagdescription)"

		return BaseSql.getGridPage(params,
									"UPPER(tasktagdescription)",
									'tasktagid',
									TaskTags.List_View  + whereclause + Constants.Standard_SQL_Sort,
									TaskTags.List_View_Count + whereclause,
									cls)

	@classmethod
	def update(cls, params):
		""" Update TaskTags"""

		transaction = cls.sa_get_active_transaction()

		try:
			task = TaskTags.query.get(params["tasktagid"])
			task.tasktagdescription = params["tasktagdescription"]

			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("TaskTags update")
			raise


	@classmethod
	def add(cls, params):
		""" Add TaskTags"""

		transaction = cls.sa_get_active_transaction()

		try:

			g = session.query(Group).filter_by(group_name=params["group"]).all()[0]
			task = TaskTags(tasktagdescription=params["tasktagdescription"],
			                 groupid=g.group_id)
			session.add(task)
			session.flush()
			transaction.commit()
			return task.tasktagid

		except:
			transaction.rollback()
			LOGGER.exception("TaskTags add")
			raise

	@classmethod
	def Exists(cls, params):
		""" Check to see if a name exists """
		params["groupid"] = session.query(Group).filter_by(group_name=params["group"]).all()[0].group_id
		if params.has_key("tasktagid"):
			result = session.execute(text("SELECT tasktagid FROM internal.tasktags WHERE tasktagdescription ILIKE :tasktagdescription AND tasktagid != :tasktagid AND groupid = :groupid"),
			                         params, cls)
			tmp = result.fetchall()
			return True if tmp else False
		else:
			result = session.execute(text("SELECT tasktagid FROM internal.tasktags WHERE tasktagdescription ILIKE :tasktagdescription AND groupid = :groupid"),
			                         params, cls)
			tmp = result.fetchall()
			return True if tmp else False

	@classmethod
	def delete(cls, params):
		""" delete a task code will fail if in use """

		try:
			transaction = cls.sa_get_active_transaction()
			t = TaskTags.query.get(params["tasktagid"])
			session.delete(t)
			transaction.commit()
		except:
			LOGGER.exception("TaskTags_delete")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, params):
		""" get a record """

		return TaskTags.query.get(params["tasktagid"])


################################################################################
## get definitions from the database
################################################################################

ContactHistorySources.mapping = Table('contacthistorysources', metadata, autoload=True, schema="internal")
ContactHistory.mapping = Table('contacthistory', metadata, autoload=True, schema="userdata")
Task.mapping = Table('tasks', metadata, autoload=True, schema="userdata")
TaskTags.mapping = Table('tasktags', metadata, autoload=True, schema="internal")

mapper(ContactHistorySources, ContactHistorySources.mapping)
mapper(ContactHistory, ContactHistory.mapping)
mapper(Task, Task.mapping)
mapper(TaskTags, TaskTags.mapping)


