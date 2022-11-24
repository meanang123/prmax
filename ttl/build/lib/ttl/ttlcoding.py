# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        ttlconding.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     04/10/2011
# RCS-ID:      $Id: EmailLibrary.py $
# Copyright:   (c) 2008
# Licence:
#-----------------------------------------------------------------------------

from Crypto.Cipher import DES

class TTLCoding(object):
	""" handles the encoding of stuff """
	def __init__(self, key = None ):
		_key = key if key else "7538Dj2c"
		self._des = DES.new(_key, DES.MODE_ECB)

	def encode(self, inData):
		""" encode """
		if inData:
			tmp = len(inData) + ( 8 - len(inData)%8)
			inData = inData.ljust( tmp )

			return self._des.encrypt( inData )
		return ""

	def decode(self, inData):
		""" decode """
		if inData:
			return self._des.decrypt( inData ).strip()
		else:
			return ""

__all__ = ["TTLCoding"]
