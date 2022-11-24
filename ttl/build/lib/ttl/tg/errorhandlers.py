# -*- coding: utf-8 -*-
"""tg error handling"""
#-----------------------------------------------------------------------------
# Name:        errorhandlers.py
# Purpose:		stamdard error handlers for the tg system
#
# Author:      Chris Hoy
#
# Created:     /2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
# todo
#					add abiloty to LOGGER into database action list for real error
#					and option for info when validator fails
#-----------------------------------------------------------------------------

import logging
LOGGER = logging.getLogger("ttl.error")

class SecurityException(Exception):
	""" This exeption is raised when the system encounters a problem with
	permission ususlaly to access a record
	"""
	def __str__(self):
		return "SecurityException "

def pr_std_error_handler(self, tg_errors = None):
	"""Standard tg error handler """
	if tg_errors:
		try:
			errors = [(param, str(inv)) for param, inv in
			          tg_errors.items()]
			LOGGER.error("**** ERROR *****: " + str(errors) )
			return dict(error_message = errors, success="VF")
		except:
			LOGGER.error("**** ERROR *****: No Details" )
	else:
		LOGGER.error("**** ERROR *****: No Details" )
	return dict(success="FA")

def pr_std_error_handler_text(self, tg_errors = None ):
	""" Standard tg error handler """
	return str(pr_std_error_handler(self, tg_errors))

def pr_form_error_handler(self, tg_errors = None):
	"""Standard tg error handler """
	if tg_errors:
		LOGGER.error("**** ERROR *****: " + str(tg_errors) )
		return dict(error_message = tg_errors, success="VF")
	else:
		LOGGER.error("**** ERROR *****: No Details" )

	return dict(success = "FA")

def pr_std_exception_handler(self, tg_exceptions = None, tg_source = None, tg_errors = None, *args, **kw):
	"""Standard tg error handler for exceptions"""
	return _pr_std_exception_handler(tg_exceptions, tg_source, tg_errors, True, None, *args, **kw)

def pr_std_exception_handler_text(self, tg_exceptions = None, tg_source = None, tg_errors = None, *args, **kw):
	"""Standard tg error handler for exceptions"""
	return str(_pr_std_exception_handler(tg_exceptions, tg_source, tg_errors, False, None, *args, **kw))

def pr_report_exception_handler(self, tg_exceptions = None, tg_source = None, tg_errors = None, *args, **kw):
	"""Standard tg error handler for exceptions"""
	return _pr_std_exception_handler(tg_exceptions, tg_source, tg_errors, False, "No report Found", *args, **kw)

def _pr_std_exception_handler(tg_exceptions, tg_source, tg_errors, out_is_dict, respone_message, *args, **kw):
	"""Standard Exception pr handler """
	message = "\n*********EXCEPTION***********\n"
	if tg_exceptions:
		message += "Exception:" + str(tg_exceptions)  + "\n"
	if tg_source:
		message += "Source:" + str(tg_source) +"\n"
	if tg_errors:
		message += "TG Error:" + str(tg_errors) +"\n"
	message += "Params:" + str(kw) +"\n"
	if args:
		message += "Args:" + str(args) +"\n"

	message += "--------------------"
	LOGGER.error( message)

	if respone_message:
		return respone_message

	if type(tg_exceptions) == SecurityException :
		return dict(success="FS") if out_is_dict else "Access Denied"

	return dict(success="FA")




