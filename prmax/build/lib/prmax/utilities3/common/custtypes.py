# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			custtypes
# Purpose:
#
# Author:       Chris Hoy
#
# Created:		17/10/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
class CustomType(object):
	@staticmethod
	def strip( f ) :
		f = f.lstrip("\\")
		f = f.rstrip("\\")
		return f.replace("\\\\","\\")

	@staticmethod
	def fromstringtolist(data):

		if type(data) == tuple:
			return  [ str(row) for row in data]
		elif type(data) == dict:
			return  [ str(row) for row in data.values()]
		else:
			for c in ('"()'):
				data = data.replace(c,"")
			return  [ CustomType.strip(row) for row in data.split(",")]

	@staticmethod
	def fromstringarray(data):
		for c in ("{()}"):
			data = data.replace(c,"")
		d = data.split('","')
		return [ CustomType.fromstringtolist(row) for row in d]
