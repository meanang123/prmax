#-----------------------------------------------------------------------------
# Name:					plpython
# Purpose:
#
# Author:       Chris Hoy
#
# Created:			07/11/2010
# RCS-ID:        $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

import cPickle, types, sets
from base64 import b64encode,b64decode
from  types import TupleType, DictionaryType

class DBCompress(object):
	""" Compression interface """
	@classmethod
	def decode(cls,data):
		"""decode data"""

		return cPickle.loads(b64decode(str(data).replace("::bytea", "")))

	@classmethod
	def decode2(cls,data):
		"""decode data"""
		print ("decode2")
		return cPickle.loads(b64decode(data))

	@classmethod
	def encode2(cls,data):
		"""encode data but not as postgres"""
		return b64encode(cPickle.dumps(data))

	@classmethod
	def b64encode(cls,data):
		return b64encode(data)

	@classmethod
	def b64decode(cls,data):
		return b64decode(str(data))

	@classmethod
	def encode(cls,data):
		""" encode and pass to postgres"""

		return b64encode(cPickle.dumps(data))

class CustomType(object):
	@staticmethod
	def _Strip( f ) :
		f = f.lstrip("\\")
		f = f.rstrip("\\")
		return f.replace("\\\\","\\")

	@classmethod
	def fromStringToList(cls,data):

		# new version?
		if type(data) == TupleType:
			return  [ str(row) for row in data]
		elif type(data) == DictionaryType:
			return [data["keyname"], data["keytype"]]
		else:
			for c in ('"()'):
				data = data.replace(c,"")
			return  [ CustomType._Strip( row ) for row in data.split(",")]


	@classmethod
	def fromStringArray(cls,data):

		for c in ("{()}"):
			data = data.replace(c,"")
		d = data.split('","')
		return [ cls.fromStringToList(row) for row in d]
