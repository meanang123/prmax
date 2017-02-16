# -*- coding: utf-8 -*-
""" Solid Media """
#-----------------------------------------------------------------------------
# Name:        solidsearch.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     03/01/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears import config
import logging
LOGGER = logging.getLogger("prcommon.model")
import urllib2
import urllib

ISTEST = config.get('prmax.solidmedialive', True)
DEBUGLEVEL = 10 if ISTEST else 0

HANDLERS = [
  urllib2.HTTPHandler(debuglevel=DEBUGLEVEL),
  urllib2.HTTPSHandler(debuglevel=DEBUGLEVEL),
]

OPENER = urllib2.build_opener(*HANDLERS)

from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree

class SolidSearch(object):
	"""Solid Search """

	def __init__(self, apikey):
		"init"

		self._search_url = "http://service.cyberwatcher.com/nanosearchservice/search.asmx/XmlFind"
		self._api_key = apikey
		self._root = Element('SearchQuery')
		self._query_root = None
		self._language = None
		self._results = None

	@property
	def results(self):
		"get results"

		return self._results

	@property
	def language(self):
		"""language id"""

		return self._language

	@language.setter
	def language(self, value):
		"""set language"""

		self._language = value

	def start_document(self):
		"start"
		pass

	def set_search_defaults(self):
		"""Set Defaults"""

		element = SubElement(self._root, "SearchType" )
		element.text = "Boolean"
		boolean_set = SubElement(self._root, "BooleanSet" )
		element = SubElement(boolean_set, "Type" )
		element.text = "And"
		self._query_root = SubElement(boolean_set, "Queries")

	def set_page_size(self, page_size = 50):
		"""set page size"""

		SubElement(self._query_root, 'PageSize').text = str(page_size)

	def add_query(self, search_text, match = "Exact", case_sensitive = "false"):
		"""add query"""

		searchquery = SubElement(self._query_root, "SearchQuery" )
		SubElement(searchquery, "IncludeFulltext" ).text = "true"
		if match:
			SubElement(searchquery, "SearchType" ).text = match
		SubElement(searchquery, "SearchText" ).text = search_text
		SubElement(searchquery, "IsCaseSensitive" ).text = case_sensitive
		if self._language:
			node = SubElement(SubElement(SubElement(searchquery, "Subscription" ), "CategoryGroups" ), "SubscriptionCatGroup")
			catgroup = SubElement(node, "CategoryGroupId")
			catgroup.text = "4"
			SubElement(SubElement(node, "CategoryIds"), "int").text = str(self._language)

	def run_search(self):
		"""run search """

		req = urllib2.Request(self._search_url, urllib.urlencode(dict (
		  xmlQuery =  tostring(self._root),
		  apiKey = self._api_key)))


		print tostring(self._root)

		response = OPENER.open(req)
		tree = ElementTree()
		document = tree.parse(response)

		self._results = [ SolidResult(row) for row in document.findall("*/*")]

class SolidResult(object):
	"Solid Result Record"

	def __init__(self, record):
		"record"

		self._record = record

	def get(self, name):
		"get details for  tag"

		for el in  self._record:
			if el.tag.split("}")[1].lower() == name.lower():
				return el.text
