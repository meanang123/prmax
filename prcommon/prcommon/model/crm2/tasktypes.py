# -*- coding: utf-8 -*-
"""issue record"""
#-----------------------------------------------------------------------------
# Name:       issuehistory.py
# Purpose:
# Author:      Chris Hoy
# Created:     1/8/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, text
from ttl.model import BaseSql
from prcommon.model.outlet import Outlet
import logging
LOGGER = logging.getLogger("prmax")

class TaskType(BaseSql):
	List_Types = """SELECT tasktypeid,tasktypedescription,tasktypestatusid FROM internal.tasktypes WHERE %s ORDER BY tasktypeid"""
	List_Types2 = """SELECT tasktypeid,tasktypedescription,tasktypestatusdescription
	FROM internal.tasktypes AS t
	LEFT OUTER JOIN internal.tasktypestatus AS ts ON t.tasktypestatusid = ts.tasktypestatusid WHERE t.customerid = :customerid"""
	View_Single = """SELECT tasktypeid,tasktypedescription,tasktypestatusid FROM internal.tasktypes WHERE tasktypeid = :tasktypeid"""
	
	List_Types_Count = """SELECT count(*) FROM internal.tasktypes  WHERE customerid = :customerid"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.tasktypeid, name=row.tasktypedescription)
					for row in data.fetchall()]

		restrict = "( groupid = 6 OR customerid = :customerid) "
		if 'show_active' in params:
			restrict += " AND tasktypestatusid = 1"

		if params.get("searchtype", "") == "tasktype":
			if params.get("group"):
				restrict = "( groupid is NULL OR groupid IN (SELECT group_id FROM tg_group WHERE group_name in (%s)))" % ("'" + "','".join(params["group"].split(","))+ "'",)

		return cls.sqlExecuteCommand(text(TaskType.List_Types % restrict), params, _convert)

	@staticmethod
	def addtype(params):
		"""Add a tasktype"""

		transaction = BaseSql.sa_get_active_transaction()
		maxtasktypeid = session.execute(text("SELECT max(tasktypeid) FROM internal.tasktypes"), None, Outlet).fetchall()[0][0]
		try:
			tasktype = TaskType(
			    tasktypeid = maxtasktypeid + 1,
			    tasktypedescription=params["tasktypedescription"],
			    tasktypestatusid=1,
			    groupid = None,
			    customerid=params["customerid"])
			session.add(tasktype)
			session.flush()
			transaction.commit()
			return tasktype.tasktypeid
		except:
			transaction.rollback()
			LOGGER.exception("Task type add")
			raise


	@staticmethod
	def get(tasktypeid, extended=False):
		"get"

		data = TaskType.sqlExecuteCommand(text(TaskType.View_Single),
		                                  dict(tasktypeid=tasktypeid),
		                                  BaseSql.SingleResultAsEncodedDict)

#		tasktype = TaskType.query.get(tasktypeid)
		return data
		

	@staticmethod
	def list_tasktypes(params):
		"get list of tasktypes"

		return BaseSql.getGridPage(
		    params,
		    'tasktypedescription',
		    'tasktypeid',
		    TaskType.List_Types2 + BaseSql.Standard_View_Order,
		    TaskType.List_Types_Count,
		    TaskType)

	@staticmethod
	def update(params):
		"""Update a tasktype"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			tasktype = TaskType.query.get(params["tasktypeid"])
			tasktype.tasktypedescription = params["tasktypedescription"]
			tasktype.tasktypestatusid = params["tasktypestatusid"]
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("TaskType Update")
			raise

	
TaskType.mapping = Table('tasktypes', metadata, autoload=True, schema="internal")

mapper(TaskType, TaskType.mapping)
