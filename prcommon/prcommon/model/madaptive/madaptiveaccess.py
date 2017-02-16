# -*- coding: utf-8 -*-
""" Madaptive  searching"""
#-----------------------------------------------------------------------------
# Name:        madaptiveaccess.py
# Purpose:		 To do a search and list of search's on the madaptive system
#
# Author:      Chris Hoy
#
# Created:	   28/06/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
import logging
import urllib2
import time
import simplejson
import ttl.Constants as Constants


LOGGER = logging.getLogger("prcommon.model")

class MadaptiveAccess(object):
	"""MadaptiveAccess"""
	def __init__(self, debuglevel=0):
		self._opener = urllib2.build_opener(urllib2.HTTPHandler(debuglevel=debuglevel))

	def execute_search(self, rss_feed, limit=500):
		"command to database and do search "

		retdata = dict(success=Constants.Return_Failed,
		               entries=None,
		               error_message=None,
		               complete=None)

		urllib2.install_opener(self._opener)

		# setup start point
		command = rss_feed + "&limit=%d" % limit
		# restrictions
		try:
			response = urllib2.urlopen(command)
			rdata = simplejson.load(response.fp)
			retdata["entries"] = rdata["entries"]
			retdata["complete"] = rdata
			retdata["success"] = Constants.Return_Success
		except Exception, e:
			LOGGER.exception("MadaptiveAccess-execute_search")
			retdata["error_message"] = str(e)

		return retdata
