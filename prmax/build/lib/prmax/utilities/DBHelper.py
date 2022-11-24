# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		DBUtilities.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:	20/03/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import prmax.Constants as Constants

class DBUtilities(object):
	""" database heklpers """
	@staticmethod
	def formatsearchword(word, expand):
		"format word search"
		if expand:
			return word + "%"
		else:
			return word

	@staticmethod
	def employeeindextooutlettree( index, SD, plpy):
		"get a set of outletid's for a set of employeeid"
		if SD.has_key("employeeindextooutlettree"):
			plan = SD["employeeindextooutlettree"]
		else:
			plan = plpy.prepare("SELECT e.employeeid,e.outletid FROM SetToIdList($1) as ls JOIN employees as e ON ls.dataid = e.employeeid", ["text", ])
		SD['employeeindextooutlettree'] = plan
		# need to conver and return data at this point
		from ttl.postgres import DBCompress
		res = dict()
		for dataRow in plpy.execute(plan, [ DBCompress.encode(index)]):
			res[dataRow['employeeid']] = dataRow['outletid']

		return res

	@staticmethod
	def searchkeytodatatype(searchtype):
		"searchkeytodatatype"
		if searchtype in Constants.Search_Data_IsOutlet:
			return Constants.Search_Data_Outlet
		else:
			return Constants.Search_Data_Employee

