# -*- coding: utf-8 -*-
""" Activity Log """
#-----------------------------------------------------------------------------
# Name:       activity.py
# Purpose:
#
# Author:
#
# Created:     Jan 2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model.common import BaseSql
from ttl.tg.validators import DateRangeResult
from ttl.ttldate import to_json_date
from ttl.ttlmaths import from_int
import prcommon.Constants as Constants

class Activity(BaseSql):
	""" log when an action happens"""


	ListData = """SELECT a.activityid, a.description, to_char(a.activitydate, 'DD/MM/YYYY HH24:MI:SS') as activitydate, u.user_name, at.actiontypedescription,
	CASE
		WHEN (a.objecttypeid = 1) THEN (SELECT crm_engagement FROM internal.customers where customerid = :customerid)
	    ELSE (SELECT aot.activityobjecttypedescription FROM internal.activityobjecttypes as aot where a.objecttypeid = aot.activityobjecttypeid)
	END as type
	FROM userdata.activity AS a
	JOIN tg_user AS u ON u.user_id = a.userid
	JOIN internal.actiontypes AS at ON at.actiontypeid = a.actiontypeid"""

	ListDataCount = """SELECT COUNT(*) FROM userdata.activity as a"""

	ListData_ObjectTypes = """SELECT aot.activityobjecttypeid AS id,
	CASE
		WHEN (aot.activityobjecttypeid = 1) THEN (SELECT crm_engagement FROM internal.customers AS c WHERE c.customerid = :customerid)
	    ELSE (aot.activityobjecttypedescription )
	END AS name
	FROM internal.activityobjecttypes AS aot"""
	ListData_ObjectTypes_Count = """SELECT COUNT(*) FROM internal.activityobjecttypes AS aot"""

	EMPTYGRID = dict (numRows = 0, items = [], identifier = 'activityid')

	@classmethod
	def get_grid_page(cls, params):
		""" get a page of statements"""

		whereclause = BaseSql.addclause("","a.customerid = :icustomerid")
		if "icustomerid" not in params:
			params["icustomerid"] = params["customerid"]

		if "user" in params:
			whereclause = BaseSql.addclause(whereclause, "a.userid = :user")
			params["user"] = int(params["user"])

		if "objecttypeid" in params:
			whereclause = BaseSql.addclause(whereclause, "a.objecttypeid = :objecttypeid")
			params["objecttypeid"] = int(params["objecttypeid"])

		# date range
		if "drange" in params and params["drange"].option != DateRangeResult.NOSELECTION:
			drange =  params["drange"]
			if drange.option == DateRangeResult.BEFORE:
				# BEfore
				params["from_date"] = drange.from_date
				whereclause = BaseSql.addclause( whereclause, 'a.activitydate <= :from_date')
			elif drange.option == DateRangeResult.AFTER:
				# After
				params["from_date"] = drange.from_date
				whereclause = BaseSql.addclause( whereclause, 'a.activitydate >= :from_date')
			elif drange.option == DateRangeResult.BETWEEN:
				# ABetween
				params["from_date"] = drange.from_date
				params["to_date"] = drange.to_date
				whereclause = BaseSql.addclause( whereclause, 'a.activitydate BETWEEN :from_date AND :to_date')

		# default is date reverse order
		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "a.activitydate"
			params['direction'] = "DESC"

		return BaseSql.get_grid_page(params,
			                          'activitydate',
			                          'activityid',
			                          Activity.ListData + whereclause + BaseSql.Standard_View_Order,
			                          Activity.ListDataCount + whereclause,
			                          Activity)


	@classmethod
	def objecttype_list(cls, params):
		"""Return a list of activity object types"""

		data = BaseSql.getGridPage(
		    params,
		    'name',
		    'id',
		    Activity.ListData_ObjectTypes + BaseSql.Standard_View_Order,
		    Activity.ListData_ObjectTypes_Count,
		    cls)

		data['label'] = 'name'
		return data


Activity.mapping = Table('activity', metadata, autoload=True, schema = "userdata")

mapper(Activity, Activity.mapping)

