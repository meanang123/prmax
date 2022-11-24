# -*- coding: utf-8 -*-
"""base tg return dictioonaries"""
#-----------------------------------------------------------------------------
# Name:        base.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:     14/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010
#-----------------------------------------------------------------------------

import ttl.Constants as Constants
from simplejson import JSONEncoder

def stdreturn( ** params ) :
	"""Return standard function"""
	if not Constants.Status_Key in params:
		params[Constants.Status_Key] = Constants.Return_Success

	return params

def errorreturn( message, level = None ) :
	""" return as an error """
	ret = { Constants.Status_Key : Constants.Return_Failed ,
	        Constants.Return_Message  : message }
	if level:
		ret["level"] = level

	return ret

def duplicatereturn( ** params ) :
	"""Return as a duplicate """
	if not Constants.Status_Key in params:
		params[Constants.Status_Key] = Constants.Return_Duplicate

	return params

def licence_exceeded_return( ** params ) :
	""" Licence exceeded"""
	if not Constants.Status_Key in params:
		params[Constants.Status_Key] = Constants.Return_Licence

	return params

def samereturn( ** params ) :
	"""is the same return """
	if not Constants.Status_Key in params:
		params[Constants.Status_Key] = Constants.Return_Same

	return params

def invalidreturn( ** params ) :
	"""is the same return """

	params[Constants.Status_Key] = Constants.Return_Invalid

	return params


def formreturn( formdata ):
	""" return is a form of jason """

	return "<div><textarea>%s</textarea></div>" %  JSONEncoder().encode(formdata)


def lockedreturn( ** params ) :
	"""record locked return """
	if not Constants.Status_Key in params:
		params[Constants.Status_Key] = Constants.Return_Locked

	return params

def statusreturn( success, ** params ) :
	""" define status and return """
	params[Constants.Status_Key] = success

	return params
