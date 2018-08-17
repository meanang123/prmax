# -*- coding: utf-8 -*-
""" utils """
#-----------------------------------------------------------------------------
# Name:        utils.py
# Purpose:
#
# Author:      Stamatia Vatsi
#
# Created:	   17/07/2018
# $Revision$
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------

class Utilities(object):
	""" utilities """

	def __init__(self, value=None):

		self._value = value


	def _to_unicode(self):
		return self._value.replace("\\", "\\\\").replace("'","\u0027").replace('"','\u0022').replace('\n', '\u000d').replace('poundsymbol', '\u00a3')

	def _to_date(self):
		return self._value.strftime("%d %B %Y")
		
		
	def _fix_characters(self):
	
		if self._value:
			return self._value.replace( u'\u201c', u'"').\
				   replace(u'\u201d', u'"').\
				   replace(u'\u2018', u"'").\
				   replace(u'\u2019', u"'")
