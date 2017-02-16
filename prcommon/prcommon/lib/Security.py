# -*- coding: utf-8 -*-
"Secuirty"
#-----------------------------------------------------------------------------
# Name:        Security.py
# Purpose:	   Check to see if a record is accessable by the current user
#
# Author:      Chris Hoy
#
# Created:     08/02/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009
#
# todo
#-----------------------------------------------------------------------------

from ttl.tg.errorhandlers import SecurityException
from turbogears.database import  session
from turbogears import errorhandling
from turbogears.decorator import weak_signature_decorator

from prmax.model import List, Outlet, Employee, Contact

# valid object names
_VALID_TYPES = dict( list = dict( key = "listid" , obj = List ),
					 outlet = dict ( key = "outletid" , obj = Outlet ) ,
					 employee = dict ( key = "employeeid" , obj = Employee ),
					 contact = dict(key='contactid',  obj = Contact )
					 )

def check_access_rights( table_type ):
	''' Check to see if a user has access right to a specific object
    '''
	def decorator(fn_name):
		"decorator"
		def decorated(*args, **params):
			"decorated"
			customerid = None
			record = _VALID_TYPES.get(table_type, None)
			if params[record['key']] != -1 and params[record['key']] != "-1":
				if record and ( params[record['key']] != -1 and params[record['key']] != '-1'):
					params = {}
					params[record['key']] = params[record['key']]
					customerid = session.query(record['obj'].customerid).filter_by(
						**params ).one()[0]

			# special case for research
			if params['customerid'] != 39 :
				if customerid and ( customerid != -1 and customerid != \
				                    params['customerid']):
					raise SecurityException("Access Denied")

			# use what the tg expose does
			return errorhandling.run_with_errors({}, fn_name, *args, **params)
		return decorated
	# use what the tg expose does
	return weak_signature_decorator(decorator)

