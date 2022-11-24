# -*- coding: utf-8 -*-
"""ClippingOutputPowerPoint"""
#-----------------------------------------------------------------------------
# Name:        clippingsgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     3/9/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import session
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.output.base import ClippingsReportObject
from prcommon.model.outlet import Outlet
from prcommon.model.client import Client
from StringIO import StringIO
import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon.model")

from pptx import Presentation

class PowerPointInterface(object):
	"PowerPointInterface"

	def __init__(self):
		"__init__"

		self._pp = Presentation()

	@property
	def pp(self):
		"pp"
		return self._pp

	def serialise(self):
		"serialise"
		target_stream = StringIO()
		self._pp.save(target_stream)
		target_stream.flush()

		return target_stream.getvalue()


class ClippingOutputPowerPoint(object):
	"ClippingOutputPowerPoint"
	def __init__(self, processrecord):
		""" init """

		self._pp = PowerPointInterface()
		self._control = ClippingsReportObject(processrecord)

	def run(self):

		record = self._control.next()
		while record:
			# build clipping record here

			record = self._control.next()


	def get_response(self):
		"""get response"""

		return self._control.serialise()

