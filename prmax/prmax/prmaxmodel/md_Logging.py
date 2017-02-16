# -*- coding: utf-8 -*-
"Logging"
#-----------------------------------------------------------------------------
# Name:        md_Logging.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import config
from turbogears.database import mapper
from sqlalchemy import Table, MetaData
from sqlalchemy.sql import text

from prcommon.model.common import BaseSql

from cherrypy import request
from StringIO import StringIO
from traceback import print_exc

import logging
log = logging.getLogger("prmedia.model.logging")

cache_metadata = MetaData(config.get("prmaxcache.dburi"))

class ActionLog(BaseSql):
	""" logging """
	_Command = text("""INSERT INTO actionlog(user_id,url,data,ip) VALUES(:user_id,:url,:params,:ip)""")


	Command_EventList_Grid = """
	SELECT a.actionlogid, a.url, a.when, a.ip, u.user_name  from actionlog as a left outer join user_tmp as u on u.user_id = a.user_id
	WHERE %s %s"""
	Command_EventList_Customer_Grid = """
	SELECT a.actionlogid, a.url, a.when, a.ip, u.user_name, c.customername  FROM actionlog AS a
	LEFT OUTER JOIN user_tmp AS u ON u.user_id = a.user_id
	LEFT OUTER JOIN customer_tmp AS c ON u.customerid = c.customerid
	WHERE %s AND u.customerid=:icustomerid %s """

	Command_EventList_Grid2 = """ORDER BY "%s" %s  LIMIT :limit OFFSET :offset"""
	Command_EventList_Grid_Count = """ SELECT COUNT(*) from actionlog as a WHERE %s"""
	Command_EventList_Grid_Customer_Count = """ SELECT COUNT(*) from actionlog AS a  LEFT OUTER JOIN user_tmp AS u ON u.user_id = a.user_id WHERE %s AND u.customerid=:icustomerid"""

	@classmethod
	def getGridPage(cls, kw):
		"getGridPage"
		cfilterid = kw.get("filter", "1")
		if cfilterid == "2":
			cfilter = "a.when_date IN ( current_date, current_date - interval '1 day') "
		elif cfilterid == "3":
			cfilter = "a.when_date  BETWEEN current_date - interval '7 day' AND  current_date"
		else:
			cfilter = " a.when_date = current_date"
		if kw.has_key("icustomerid"):
			q1 = ActionLog.Command_EventList_Customer_Grid
			q2 = ActionLog.Command_EventList_Grid_Customer_Count
		else:
			q1 = ActionLog.Command_EventList_Grid
			q2 = ActionLog.Command_EventList_Grid_Count

		return BaseSql.getGridPage(kw,
		                           'when',
		                           'actionlogid',
		                           q1 % (cfilter, ActionLog.Command_EventList_Grid2),
		                           q2 % cfilter,
		                           cls)

	@classmethod
	def logAction(cls, user_id, ip):
		""" Create log details and tehn add to database"""

		# make sure ip address is less than 45 characterw
		if ip and len(ip) > 44:
			ip = ip[0:44]
		try:
			url = request.path
		except:
			url = request.path_info

		if url and len(url) > 45:
			url = url[0:127]

		params = dict(user_id=user_id,
		              url=url,
		              ip=ip,
		              params=str(dict(query=request.query_string,
		                              params=request.params)).replace("\"", "'"))

		ActionLog.sqlExecuteCommand(
			ActionLog._Command,
									params,
									None,
									True)

	@classmethod
	def internalLogError(cls, user_id, ex, message, kw, function, err_args):
		""" attempt to add the error to the log """

		ip = request.headers.get("X-Forwarded-For", request.remote.ip)

		s = StringIO()
		print_exc(file=s)

		info = str(
			dict(query=request.query_string,
				 params=request.params,
				 ex=str(ex),
				 message=message,
				 stack=s.getvalue(),
				 args=err_args,
				 kw=str(kw))).replace("\"", "'")

		params = dict(user_id=user_id,
						url=function,
						ip=ip,
						params=info)

		ActionLog.sqlExecuteCommand(
			ActionLog._Command,
									params,
									None,
									True)




action_table = Table('actionlog', cache_metadata, autoload=True)
mapper(ActionLog, action_table)
