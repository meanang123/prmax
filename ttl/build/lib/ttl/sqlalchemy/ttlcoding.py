# -*- coding: utf-8 -*-
"""CryptyInfo"""
#-----------------------------------------------------------------------------
# Name:         ttlcoding.py
# Purpose:
# Author:       Chris Hoy
#
# Created:      05/04/2016
# Copyright:    (c) 2016
#-----------------------------------------------------------------------------

import binascii
from Crypto.Cipher import AES

class CryptyInfo(object):
	"""CryptyInfo"""

	def __init__(self, key):
		"__init__"
		self._key = key

	def aes_encrypt(self, data):
		"encrypt"

		if data is None:
			return None

		cipher = AES.new(self._key)
		data = data + (" " * (16 - (len(data) % 16)))

		return binascii.hexlify(cipher.encrypt(data))

	def aes_decrypt(self, data):
		"decrypt"

		if data is None:
			return None

		cipher = AES.new(self._key)

		return cipher.decrypt(binascii.unhexlify(data)).rstrip()
