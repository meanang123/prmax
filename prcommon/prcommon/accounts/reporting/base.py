# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        base.py
# Purpose:		 Quick On-line Reporting for accounts
#
# Author:      Chris Hoy
#
# Created:     24/03/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from turbogears.database import session
import prmax.Constants as Constants

from mako.template import Template
from mako.lookup import TemplateLookup
import slimmer

import os
from tempfile import gettempdir

class ReportBuilder ( object ) :
	""" class to build an html questionnaire"""
	def __init__(self):
		self._templatepath = os.path.normpath(os.path.join(os.path.dirname(__file__),'templates'))
		self._querypath = os.path.normpath(os.path.join(os.path.dirname(__file__),'queries'))
		self._temppath = os.path.normpath(os.path.join(gettempdir(),'mako_modules'))
		self._lookup = TemplateLookup(directories=[self._templatepath],
		                          module_directory=self._temppath,
		                           output_encoding='utf-8',
		                           encoding_errors='replace')

	def start(self, basename):
		""" setup the basic details """
		self._out_data = None
		self._basename = basename
		self.data = dict ( )

	def run(self):
		""" do the converstion """
		self._captureData()
		mytemplate = self._lookup.get_template(self._basename + ".html")
		self._out_data = mytemplate.render(**self.data)


	def _captureData(self):
		pass



	## use in 2.6 prmax uses 2.5 !!! @property.fget
	def _get_output(self):
		return self._out_data

	def _get_output_compressed(self):
		""" compress the html output stream """

		return slimmer.xhtml_slimmer(self.output)

	output = property ( _get_output )
	output_compressed = property ( _get_output_compressed )
