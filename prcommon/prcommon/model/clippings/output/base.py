# -*- coding: utf-8 -*-
"""base record  """
#-----------------------------------------------------------------------------
# Name:        base.py
# Purpose:
# Author:      Chris Hoy
# Created:     03/09/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
import logging
LOG = logging.getLogger("prcommon")

class ClippingsReportObject(object):
	"ClippingsReportObject"

	def __init__(self, processobject):
		""

		self._processobject = processobject
		self._load_details()
		self._do_get_data()

	def _load_details(self):
		"load details"
		pass

	def _do_get_data(self):
		"get data"

		pass

	def next(self):
		"next"

		return None





