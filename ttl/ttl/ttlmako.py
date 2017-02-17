# -*- coding: utf-8 -*-
"""ttlmako functions"""
#-----------------------------------------------------------------------------
# Name:         ttlmako.py
# Purpose:			Background mehods and class to make using mako templates easier
#
# Author:       Chris Hoy
#
# Created:      09/04/2011
# RCS-ID:       $Id:  $
# Copyright:    (c) 2011
# Licence:
#-----------------------------------------------------------------------------

import os
from mako.lookup import TemplateLookup
from mako.ext.turbogears import TGPlugin
from tempfile import gettempdir
import slimmer

def isnull( v, defvalue = ""):
	""" if null return the default value """
	if v == None or v == "":
		return defvalue

	return v


ENCODEING = (
  ( u"\u2019", u"&rsquo;"),
  )

def encode_utf8( data ):
	"""covert unicode to html """

	for row in  ENCODEING:
		data =  data.replace( row[0],  row[1])

	return data



def isblank(v, defvalue = ""):
	""" blank value"""
	return v if v else defvalue

def int_to_string(number):
	""" convert a nmber to a single for display purposes"""
	if number:
		s = '%d' % number
		groups = []
		while s and s[-1].isdigit():
			groups.append(s[-3:])
			s = s[:-3]
		return s + ','.join(reversed(groups))
	else:
		return ""

def text_html(v, defvalue = ""):
	""" cobvert a string to html """

	ret =  v if v else defvalue
	return ret.replace("\n","<br/>")


def correct_http_link( linkname ):
	"""fix up a url for a link"""
	if not linkname.startswith("http://") and  not linkname.startswith("https://"):
		return  "http://" + linkname
	return linkname

class MakoBase(object):
	""" Base class mak template system """
	def __init__(self, modulepath ):
		""" setup the path too the templates and all the cacheing and default settings"""
		self._templatepath = os.path.normpath(os.path.join(modulepath,'templates'))
		self._temppath = os.path.normpath(os.path.join(gettempdir(),'mako_modules'))
		self._lookup = TemplateLookup(directories=[self._templatepath],
		                          module_directory=self._temppath,
		                           output_encoding='utf-8',
		                           input_encoding='utf-8',
		                           encoding_errors='replace')

		self._lookup_tables = {}
		self._data = dict(style = self.getDefaultStyles())
		self._out_data = None
		self._templatename = "standard.html"

	def _settemplatename(self,name):
		""" set template name """
		self._templatename = name

	def _gettemplatename(self):
		"""get template name """
		return self._templatename

	# set template name
	templatename = property(_gettemplatename,_settemplatename)


	def getDefaultStyles(self):
		""" return a dict of the default styles for mako"""
		return dict(p = "font-name=Arial;margin:0px;padding:0px;font-size:11pt",
		            plabel = "font-name=Arial;margin:0px;padding:0px;font-weight:bold;font-size:11pt",
		            pheader = "font-name=Arial;margin:0px;padding:0px;font-weight:bold;font-size:15pt",
		            psmall = "font-name=Arial;margin:0px;padding:0px;font-size:9pt"
		            )

	def run(self):
		""" do the converstion """

		mytemplate = self._lookup.get_template(self._gettemplatename())
		self._out_data = mytemplate.render(**self._data)

	## use in 2.6 prmax uses 2.5 !!! @property.fget
	def _get_output(self):
		return self._out_data

	def _get_output_compressed(self):
		""" compress the html output stream """

		return slimmer.xhtml_slimmer(self.output)

	output = property ( _get_output )
	output_compressed = property ( _get_output_compressed )


class TGMakoExtPlugin(TGPlugin):
	""" extended mako"""

	def __init__(self, extra_vars_func=None, options=None, extension='mak'):

		options['mako.output_encoding'] = 'utf-8'

		if 'mako.directories' not in options:
			options['mako.directories'] =  ['']

		if 'ttlmakoext.directories' in options:
			options["mako.directories"] = options['ttlmakoext.directories']


		TGPlugin.__init__(self, extra_vars_func, options, extension)

	def render(self, info, format="html", fragment=False, template=None):
		""""""

		rendered = super(TGMakoExtPlugin, self).render(info, format, fragment, template)

		return slimmer.html_slimmer ( rendered )





