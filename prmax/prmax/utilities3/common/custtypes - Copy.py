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
from prmax.utilities3.common.postgres import PostGresControl

class CustomType(object):		
	@staticmethod
	def strip( f ) :
		f = f.lstrip("\\")
		f = f.rstrip("\\")
		return f.replace("\\\\","\\")

	@staticmethod
	def fromstringtolist(plpy, data):
		controlSettings = PostGresControl(plpy)
		
		if type(data) == tuple:
			controlSettings.dodebug("type(data)==tuple")
			return  [ str(row) for row in data]
		elif type(data) == dict:
			controlSettings.dodebug("type(data)==dict")
			return  [ str(row) for row in data.values()]			
		else:
			controlSettings.dodebug("type(data)==else")
			for c in ('"()'):
				data = data.replace(c,"")
			return  [ CustomType.strip(row) for row in data.split(",")]

	@staticmethod
	def fromstringarray(plpy, data):
		for c in ("{()}"):
			data = data.replace(c,"")
		d = data.split('","')
		return [ CustomType.fromstringtolist(row) for row in d]
