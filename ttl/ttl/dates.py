# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		dates.py
# Purpose:     extended date handling
#
# Author:       Chris Hoy
#
# Created:	12/10/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
_Months = ("", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", \
           "Oct", "Nov", "Dec")

def strftimeext(datet, strfromat = '%d %b %Y'):
	formatted = ""
	if datet:
		if datet.year> 1900:
			formatted = datet.strftime(strfromat)
		else:
			formatted = str(datet.day) + " " + _Months[datet.month]  + " " + str(datet.year)
	return formatted




class DateExtended(object):
	""" Handle and extended date object"""

	@staticmethod
	def to_db_fields( kw, name ):
		""" This function add the saved fields to the database list of names """

		kw[name+"_partial"] = True if kw[name]["month"] in ( "on", "1") else False
		kw[name+"_date"] = kw[name]["date"]
		kw[name+"_description"] = kw[name]["text"]

	@staticmethod
	def to_json_obj( advancerecord, name):
		""" Convert the date fields from the database fields to a dictionary to transfer
		to the view """

		dfield = getattr(advancerecord,name+"_date")
		if dfield:
			dvalue = dict ( year = dfield.year, month = dfield.month, day = dfield.day)
		else:
			dvalue = dict ( year = None, month = None, day = None)
		return	{"text" : getattr(advancerecord,name+"_description"),
		           "date" : dvalue,
		           "month": getattr(advancerecord,name+"_partial")}

