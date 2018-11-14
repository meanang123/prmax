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
from prcommon.model.datafeeds.xmlbase import XMLBaseImport, BaseContent


LOGGER = logging.getLogger("prcommon.model")

class PressDataAccess(XMLBaseImport):
	"""PressDataAccess"""


	def __init__(self, filename):
		"init"
		XMLBaseImport.__init__(self, filename)

		self._parse_handler = PressDataXmlProcesser()


class PressDataXmlProcesser(BaseContent):
	"pre load check"
	def __init__(self):
		"""prephase"""

		BaseContent.__init__(self)
		self._level = None

	def startDocument(self):
		pass

	def endDocument(self):
		pass

	def endElement(self, name):

		self._data = self._data.strip()
		if self._data and self._data[-1] == '\n':
			self._data = self._data[:-1]

		self._level[name] = self._data

		self._data = ""

	def startElement(self, name, attrs):

		level = None


	def characters(self, charac):
		self._data = self._data + charac



	
