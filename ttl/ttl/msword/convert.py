# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import subprocess
import os

class WordToHtml:
	__Command = r"c:\Program Files\Zapadoo\WordCleaner4\WordCleaner4.exe"
	__Command2 = r"C:\Program Files (x86)\Zapadoo\WordCleaner4\WordCleaner4.exe"
	__Command_V5 = r"C:\Program Files (x86)\WordCleaner5\WordCleaner5.exe"

	_DefaultTemplate = "cgh"

	def __init__(self, data, mswordqueueid, orgfilename , template , working = r"c:\temp", version = 4 ):
		self._defaulttemplate  = template
		self.working = working
		self._version = version
		self._filestem = os.path.join(self.working,str(mswordqueueid))
		self._file = self._filestem+ os.path.splitext(orgfilename)[-1]
		tmp = file (self._file,"wb")
		try:
			tmp.write(data)
		finally:
			tmp.close()

	def CleanUp(self):
		os.unlink(self._file)

	def getOutPutName(self):
		return self._filestem + ".html"

	def _getData(self):
		tmp = file(self._filestem + ".html")
		try:
			data = tmp.read()
		finally:
			tmp.close()
		return data

	def run(self):
		if self._version == 4 :
			command = WordToHtml.__Command
			if not os.path.exists ( WordToHtml.__Command ):
				command = WordToHtml.__Command2
		else:
			command = WordToHtml.__Command_V5

		result  = subprocess.call (
		    [command,  	# program
		     "/q",															# quite mode
		     "/o",															# output folder
		     self.working,
		     "/of",
		     self._filestem + ".html",
		     "/t",															# conversion template
		     self._defaulttemplate,
		     "/f",															# imput file
		     self._file
		    ])
		print result


	def getFixUpHtmlForIE(self):
		html = self._getData()

		# this confused the edit control on dojo.IE8
		html = html.replace("<br />","</p><p>")
		html = html.replace("<br/>","</p><p>")

		return html


#a = WordToHtml ( file(r"d:\downloads\Word doc for Nick (4) (1).doc","rb").read(),"tmp.doc",ConvertWordToHtml._DefaultTemplate)
#a.run()
