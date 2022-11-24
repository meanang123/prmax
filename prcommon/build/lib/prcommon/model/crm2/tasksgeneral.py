# -*- coding: utf-8 -*-
"""tasksgeneral record"""
#-----------------------------------------------------------------------------
# Name:       tasksgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     28/07/2014
# Copyright:  (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import session
from sqlalchemy import text
from ttl.model import BaseSql
from prcommon.model.crm import Task, ContactHistory
from prcommon.model.crm2.tasktypes import TaskType
from ttl.ttldate import to_json_date
import logging
LOGGER = logging.getLogger("prmax")

class TasksGeneral(object):
	""" task general"""

	List_Data_View = """SELECT
		t.taskid,
		t.description,
	  to_char(t.due_date,'DD-MM-YY') as due_date_display,
	  ts.taskstatusdescription,
	  ts.taskstatusid,
	  u.display_name,
	  CASE WHEN t.due_date IS NOT NULL AND t.due_date<=CURRENT_DATE AND t.taskstatusid IN (1) THEN true ELSE false END AS isoverdue,
	  o.outletname,
	  ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
	  CASE WHEN t.created_date::date=CURRENT_DATE THEN true ELSE false END AS istoday


		FROM userdata.tasks AS t
	  LEFT OUTER JOIN internal.taskstatus AS ts ON ts.taskstatusid = t.taskstatusid
	  LEFT OUTER JOIN tg_user AS u ON u.user_id = t.userid
	  LEFT OUTER JOIN userdata.contacthistory AS ch ON ch.contacthistoryid = t.contacthistoryid
	  LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	  LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	  LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
	  """

	List_Data_View2 = """SELECT
		t.taskid,
		t.description,
	  to_char(t.due_date,'DD-MM-YY') as due_date_display,
	  ts.taskstatusdescription,
	  ts.taskstatusid,
	  u.display_name,
	  CASE WHEN t.due_date IS NOT NULL AND t.due_date<=CURRENT_DATE AND t.taskstatusid IN (1) THEN true ELSE false END AS isoverdue,
	  o.outletname,
	  o.outletid,
	  e.employeeid,
	  ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
	  ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) || '====' || o.outletname as contactdetails_display,
	  t.description || '====' || 'Owner: ' || u.display_name as details_display,
	  to_char(t.due_date,'DD-MM-YY') || '====' || ts.taskstatusdescription as status_display,
	  CASE WHEN t.created_date::date=CURRENT_DATE THEN true ELSE false END AS istoday
	  FROM userdata.tasks AS t
	  LEFT OUTER JOIN internal.taskstatus AS ts ON ts.taskstatusid = t.taskstatusid
	  LEFT OUTER JOIN tg_user AS u ON u.user_id = t.userid
	  LEFT OUTER JOIN userdata.contacthistory AS ch ON ch.contacthistoryid = t.contacthistoryid
	  LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	  LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	  LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
	  """
	List_Data_Count = """SELECT COUNT(*) FROM userdata.tasks AS t"""

	@staticmethod
	def list_tasks(params):
		"""List of issues """

		whereclause = BaseSql.addclause("", "t.ref_customerid = :customerid")

		if "description" in params:
			whereclause = BaseSql.addclause(whereclause, "t.description ilike :description")
			params["description"] = params["description"].replace("*", "%")

		if "taskstatusid" in  params:
			whereclause = BaseSql.addclause(whereclause, "t.taskstatusid = :taskstatusid")
			params["taskstatusid"] = int(params["taskstatusid"])

		if "ownerid" in  params:
			whereclause = BaseSql.addclause(whereclause, "t.userid = :ownerid")
			params["ownerid"] = int(params["ownerid"])

		if "subject" in params:
			whereclause = BaseSql.addclause(whereclause, "t.description ilike :subject")
			params["subject"] = "%" + params["subject"] + "%"

		if "overdue" in params:
			whereclause = BaseSql.addclause(whereclause, "(t.due_date IS NOT NULL AND t.due_date < current_date)")

		if params.get("sortfield", "description") == "description":
			params["sortfield"] = 'UPPER(description)'

		if params.get("sortfield", "") == "due_date_display":
			params["sortfield"] = 'due_date'

		if "id" in params:
			whereclause = BaseSql.addclause(whereclause, "i.taskid = :taskid")
			params["taskid"] = int(params["id"])

		return BaseSql.getGridPage(
				params,
		    'UPPER(description)',
		    'taskid',
		    TasksGeneral.List_Data_View2 + whereclause + BaseSql.Standard_View_Order,
		    TasksGeneral.List_Data_Count + whereclause,
		    Task)

	@staticmethod
	def add(params):
		"""Add a task"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			task = Task(
					taskstatusid=params["taskstatusid"],
			    due_date=params["due_date"],
			    userid=params["assigntoid"],
			    description=params["description"],
			    tasktypeid=params["tasktypeid"],
			    ref_customerid=params["customerid"])
			session.add(task)
			session.flush()
			transaction.commit()
			return task.taskid
		except:
			transaction.rollback()
			LOGGER.exception("Task add")
			raise

	@staticmethod
	def update(params):
		"""Update a task"""

		transaction = BaseSql.sa_get_active_transaction()
		tasktype = TaskType.query.get(params['tasktypeid'])
		if tasktype.tasktypestatusid == 2:
			params["tasktypeid"] = None

		try:
			task = Task.query.get(params["taskid"])
			task.taskstatusid = params["taskstatusid"]
			task.due_date = params["due_date"]
			task.userid = params["assigntoid"]
			task.description = params["description"]
			task.tasktypeid = params["tasktypeid"]
			if task.contacthistoryid:
				contacthistory = ContactHistory.query.get(task.contacthistoryid)
				contacthistory.outcome = params["outcome"]
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("Task Update")
			raise

	View_Single2 = """SELECT t.taskid,
			to_char(t.due_date, 'DD/MM/YY') as due_date_display,
			CASE WHEN t.due_date IS NOT NULL AND t.due_date<CURRENT_DATE THEN true ELSE false END AS isoverdue,
			u.user_name,
			ts.taskstatusdescription,
			t.description,
	    t.userid as assigntoid,
	    t.tasktypeid,
	    t.taskstatusid,
	    t.contacthistoryid,
	    t.issueid,
	    o.outletname,
	    ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
	    u.display_name,
	    ch.outcome
			FROM userdata.tasks AS t
			JOIN tg_user AS u ON u.user_id = t.userid
			JOIN internal.tasktypes AS tt ON tt.tasktypeid = t.tasktypeid
			JOIN internal.taskstatus AS ts ON ts.taskstatusid = t.taskstatusid
	    LEFT OUTER JOIN userdata.contacthistory AS ch ON ch.contacthistoryid = t.contacthistoryid
	    LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	    LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	    LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
			WHERE t.taskid = :taskid """

	View_Single = """SELECT t.taskid,
			to_char(t.due_date, 'DD/MM/YY') as due_date_display,
			CASE WHEN t.due_date IS NOT NULL AND t.due_date<CURRENT_DATE THEN true ELSE false END AS isoverdue,
			u.user_name,
			ts.taskstatusdescription,
			t.description,
	    t.userid as assigntoid,
	    t.tasktypeid,
	    t.taskstatusid,
	    t.contacthistoryid,
	    t.issueid,
	    o.outletname,
	    o.outletid,
	    e.employeeid,
	    ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
	    u.display_name,
	    ch.clientid,
	    ch.outcome,
	    to_char(ch.taken, 'DD/MM/YY') as taken_display,
	    to_char(ch.taken, 'DD/MM/YY') || '====' || ts.taskstatusdescription as status_display,
	    taken.display_name,
	    ch.taken_by,
	    i.name,
	    chi.issueid
	    
	    FROM userdata.tasks AS t
	    JOIN tg_user AS u ON u.user_id = t.userid
	    JOIN internal.tasktypes AS tt ON tt.tasktypeid = t.tasktypeid
	    JOIN internal.taskstatus AS ts ON ts.taskstatusid = t.taskstatusid
	    LEFT OUTER JOIN userdata.contacthistory AS ch ON ch.contacthistoryid = t.contacthistoryid
	    LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	    LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	    LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
	    LEFT OUTER JOIN tg_user AS taken ON taken.user_id = ch.taken_by
	    LEFT OUTER JOIN userdata.contacthistoryissues AS chi ON chi.contacthistoryid = ch.contacthistoryid
	    LEFT OUTER JOIN userdata.issues AS i ON i.issueid = chi.issueid
	    WHERE t.taskid = :taskid """

	@staticmethod
	def get(taskid, extended=False):
		"get"

		data = Task.sqlExecuteCommand(text(TasksGeneral.View_Single),
		                              dict(taskid=taskid),
		                              BaseSql.SingleResultAsEncodedDict)

		task = Task.query.get(taskid)
		data["due_date"] = to_json_date(task.due_date)

		# we

		return data




	@staticmethod
	def get_source(taskid):
		"""Get the source for a task"""

		task = Task.query.get(taskid)

		if task.contacthistoryid:
			chrecord = ContactHistory.query.get(task.contacthistoryid)
		else:
			chrecord = None

		return dict(ch=chrecord)
