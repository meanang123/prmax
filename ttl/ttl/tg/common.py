# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        common.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     26-07-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

from turbogears.database import config
from ttl.dict import DictExt
from cherrypy import response
from ttl.ttlemail import ext_to_content_type
import time

GLOBALDDATA = None

def BaseConfigDetails(inDict, nocache = True, appname="prmax" , app_extended = None, user_extended = None ):
	"""Append the common information used by the template to an incomming
	dictionary.
	returns the original dictionary with the settings including all the configuration
	information and the external user options appended to it
	"""
	def _appendDict():
		""" append """
		global GLOBALDDATA
		if not GLOBALDDATA:
			GLOBALDDATA = DictExt (
				dict(
				retrieve_css = "", # need for genshi
				retrieve_javascript = "", # need for genshi
				build = config.get( appname + '.build' ),
				dojopath = config.get( appname + '.dojopath'),
				dojodebug = config.get( appname + '.dojodebug'),
				release = config.get( appname + '.release'),
				dojoversion= config.get( appname + '.dojoversion'),
				prodpath = config.get( appname + '.prodpath','rel'),
			    url = config.get( appname + '.web'),
				copyright =  config.get( appname + '.copyright').decode('utf-8')
			))
			# append application specific settings
			if app_extended:
				app_extended ( globalD )

		# add user specific data
		adict = DictExt(inDict)
		adict[ appname ] = globalD
		user_extended( adict )

		if nocache:
			set_default_response_settings()

		return adict

	return _appendDict()

def set_default_response_settings():
	""" set the reponse details for no caching probably need to run this
	manually on	json response	"""

	response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
	response.headers['Pragma'] = 'no-cache'
	response.headers['Expires'] = 0


def set_response_type( intype ):
	""" set the respose to standard html text"""

	if intype == "html":
		response.headers["Content-type"] = "text/html;charset=utf-8"
	elif intype == "json":
		response.headers["Content-type"] = "application/json;charset=utf-8"
	else:
		response.headers["Content-type"] = ext_to_content_type( intype )

def set_output_as( typestring, reportdata , infilename = None) :
	""" rest the response header details for a non json call """

	filename = infilename if infilename != None else "%.0f.csv" % time.time()

	if typestring == "csv":
		response.headers["Content-disposition"] = "inline; filename=%s"% filename
		response.headers["Content-type"] = "text/csv"
	elif typestring == "pdf":
		response.headers["Content-disposition"] = "inline; filename=%s"% filename
		response.headers["Content-type"] = "application/pdf"

	response.headers["Content-Length"] = len( reportdata )
	response.headers['Cache-Control'] = 'max-age=100'

	return reportdata
