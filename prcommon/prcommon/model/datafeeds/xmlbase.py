# -*- coding: utf-8 -*-
""" Handle xml """
#-----------------------------------------------------------------------------
# Name:        xmlbase.py
# Purpose:		 Base Import of data
#
# Author:      Chris Hoy
#
# Created:     14/4/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from xml.sax import make_parser
from xml.sax import ContentHandler

import codecs

import logging
LOG = logging.getLogger("prmax")

class XMLBaseImport(object):
	"""Basic framework for importing 3rdpart data from waymaker xml"""

	def __init__(self, sourcefile):
		"init"
		self._sourcefile = sourcefile
		self._handle_pre = None
		self._handle_load = None

	@property
	def parse_handler_pre(self):
		""
		return self._handle_pre

	@parse_handler_pre.setter
	def parse_handler_pre(self, parse_handler):
		"set pre handle"

		self._handle_pre = parse_handler

	@property
	def parse_handler_load(self):
		""
		return self._handle_load

	@parse_handler_load.setter
	def parse_handler_load(self, parse_handler):
		"set pre handle"

		self._handle_load = parse_handler


	def _parse_xml(self, parse_handler ):
		"""Start the parse"""

		parser = make_parser()

		parser.setContentHandler(parse_handler)
		with codecs.open(self.sourcefile) as infile:
			parser.parse(infile)

	def do_pre_phase(self):
		"""Do all the verifications"""

		self._parse_xml(self._handle_pre)

	def do_load_phase(self):
		"""Do all the verifications"""

		self._parse_xml(self._handle_load)

class BaseContent(ContentHandler):
	"base context"
	def __init__(self, _db_interface=None):
		"""Content Handler"""
		self._data = ""
		self._db_interface = _db_interface
		self._name = None


class PreLoadInfo(object):
	"Pre load info"
	def __init__(self, sourcedir):
		"__init__"
		pass

	def _load_translation(self):
		"""Load lookup tables"""
		pass

