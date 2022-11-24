# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		caching.py
# Purpose:     common database function for caching
#
# Author:       Chris Hoy
#
# Created:	20/03/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import prmax.utilities3.common.constants as Constants

def _getObjectIdKey( typeid ) :
	""" get correct key for type"""
	if typeid in Constants.Cache_Outlet_Objects:
		return "outletid"
	elif typeid in Constants.Cache_Employee_Objects:
		return "employeeid"

def invalidate_cache_object(plpy, SD, TD, objecttypeid ):
	""" remove records fro cache"""
	if "prmax_cache_outletcustomer_plan" is SD:
		plan = SD['prmax_cache_outletcustomer_plan']
	else:
		plan = plpy.prepare("""DELETE FROM cache.cachestore WHERE objecttypeid = $1 AND objectid = $2""", ["int", "int"])

	index = "new" if TD['event'] == "INSERT" else "old"
	if type( objecttypeid) == tuple:
		for typeid in objecttypeid:
			plpy.execute(plan, [typeid, TD[index][_getObjectIdKey(typeid)]])
	else:
		plpy.execute(plan, [objecttypeid, TD[index][_getObjectIdKey(objecttypeid)]])

Invalidate_Cache_Object_Interests_Types = {
	Constants.Cache_Display_Outlet : ("outletid", "outletinterests",),
	Constants.Cache_Display_Employee : ("employeeid", "employeeinterests",),
}

def invalidate_cache_object_interests(plpy, SD, TD, objecttypeid ):
	""" remove records fro cache"""
	key = "prmax_cache_interests_plan_" + str(objecttypeid)
	control = Invalidate_Cache_Object_Interests_Types[objecttypeid]

	if key in SD:
		plan = SD[key]
	else:
		command = """DELETE FROM cache.cachestore WHERE objecttypeid = $1 AND
		objectid IN (SELECT %s FROM %s WHERE interestid = $2)
		AND customerid = $3 """ % control
		plan = plpy.prepare(command , ["int", "int", "int"])

	index = "new" if TD['event'] == "INSERT" else "old"
	interestid = TD[index]["interestid"]

	if type(objecttypeid) == tuple:
		for typeid in objecttypeid:
			plpy.execute(plan, [typeid, interestid, TD[index]["customerid"] ])
	else:
		plpy.execute(plan, [objecttypeid, interestid, TD[index]["customerid"] ])


_Cache_Clear_Command  = """DELETE FROM cache.cachestore WHERE objecttypeid = :objecttypeid AND objectid = :objectid"""
_Cache_Clear_Command_ByType  = """DELETE FROM cache.cachestore WHERE objecttypeid = :objecttypeid"""

def Invalidate_Cache_Object_Research( cls, objectid , objecttypeid ):
	""" Research has made a chnage invalidate cache """

	from turbogears.database import session
	from sqlalchemy.sql import text

	command = _Cache_Clear_Command if objectid else _Cache_Clear_Command_ByType

	if type( objecttypeid) == tuple:
		for typeid in objecttypeid:
			session.execute (text(command),
			                dict(objectid = objectid,
			                    objecttypeid = typeid), cls)
	else:
			session.execute(text(command),
			                dict(objectid=objectid,
			                    objecttypeid=objecttypeid), cls)
