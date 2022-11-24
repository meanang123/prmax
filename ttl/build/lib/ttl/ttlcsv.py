# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         ttlcsv.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     31/10/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010
# Licence:
#-----------------------------------------------------------------------------


def ToCsv( rows ):
	def _fixrow(row):
		def _fixtext(c):
			if isinstance(c, basestring):
				#return c.encode('ISO-8859-1','ignore')
				return c.encode('UTF-8','backslashreplace')
			else:
				return str(c)

		return "\"" + "\",\"".join ( _fixtext(c) for c in row) + "\""

	return "\n".join ( [ _fixrow ( row ) for row in rows ] )
