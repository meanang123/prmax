# -*- coding: utf-8 -*-
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
from turbogears.database import  metadata, mapper, session
from turbogears import errorhandling
from turbogears.decorator import weak_signature_decorator

from prmax.model import List, Outlet, Employee, Contact

# valid object names
_valid_types = dict( list = dict( key = "listid" , obj = List ),
					 outlet = dict ( key = "outletid" , obj = Outlet ) ,
					 employee = dict ( key = "employeeid" , obj = Employee ),
					 contact = dict(key='contactid',  obj = Contact )
					 )

def check_access_rights( table_type ):
	''' Check to see if a user has access right to a specific object
    '''
	def decorator(fn):
		def decorated(*args,**kw):
			customerid = None
			record = _valid_types.get(table_type, None)
			if kw[record['key']] != -1 and kw[record['key']]!="-1":
				if record and ( kw[record['key']] != -1 and kw[record['key']] != '-1'):
					params = {}
					params[record['key']] = kw[record['key']]
					customerid = session.query(record['obj'].customerid).filter_by(
						**params ).one()[0]

			# special case for research
			if kw['customerid'] != 39 :
				if customerid and ( customerid != -1 and customerid != \
				                    kw['customerid']):
					raise SecurityException("Access Denied")

			# use what the tg expose does
			return errorhandling.run_with_errors({}, fn, *args, **kw)
		return decorated
	# use what the tg expose does
	return weak_signature_decorator(decorator)

