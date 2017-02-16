# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:					Handle thhe ...
# Purpose:     07/07/2011
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

import prmax.Constants as Constants
from ttl.postgres import DBConnect

from xml.sax import ContentHandler
from xml.sax import make_parser
import os
import types
import codecs
import datetime
import csv
import types
import platform, datetime
import csv

import prmax.Constants as Constants

if platform.system().lower()=="windows":
	dirSource = '/data/mediaproof/'
else:
	dirSource = '/home/prmax/data/'

def normalize_whitespace(text):
	"Remove redundant whitespace from a string"
	#return ' '.join(text.split())
	return text

class DocHandlerBase(ContentHandler):
	def __init__(self,filename):
		self._filename = filename
		ContentHandler.__init__(self)
		self._db =  DBConnect(Constants.db_Command_Service)
		self._d = {}

	def getFileName(self):
		return self._filename

	filename = property(getFileName,doc="get source file")

	def startElement(self, name, attrs):
		self._data = ""

	def endElement(self, name):
		pass

	def characters(self, ch):
		self._data = self._data + ch

class Employee(DocHandlerBase):
	def endDocument(self):
		DocHandlerBase.endDocument(self)
		c = self._db.getCursor()
		for key in self._d.values():
			c.execute ( "SELECT COUNT(*) FROM internal.prmaxroles WHERE prmaxrole = %(prmaxroles)s ", dict(prmaxroles = key))
			if c.fetchone()[0] == 0 :
				c.execute ( "INSERT INTO internal.prmaxroles(prmaxrole) VALUES(%(prmaxroles)s) ", dict(prmaxroles = key))
		self._db.commitTransaction(c)

	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_EMPLOYEE.xml")

	def endElement(self,name):
		if name == "JOB_TITLE" :
			tmp = self._data.strip()[:119]
			if not self._d.has_key(tmp):
				self._d[tmp] = tmp

def LoadPrnData():
	parser = make_parser()

	for classobj in ( Employee,   ) :
		dh=classobj()
		parser.setContentHandler(dh)
		parser.parse(codecs.open(os.path.normpath(os.path.join(dirSource,dh.filename))))


print "Start Pre Update Run", datetime.datetime.now()

LoadPrnData()

print "Complete", datetime.datetime.now()



