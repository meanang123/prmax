# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			test_msword
# Purpose:     test case for labels
#
# Author:       Chris Hoy
#
# Created:		20/11/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
import unittest
import os

from ttl.msword.convert import WordToHtml
from ttl.msword.AnalyseHtmlWordDocument import AnalyseHtmlWordDocument

outputpath = "c:/output"
if not os.path.exists( outputpath ) :
	os.mkdir(outputpath)


class msWordTest(unittest.TestCase):
	def setUp(self):
		pass

	def tearDown(self):
		pass

	def test_msword(self):
		""" """
		for(dirpath,dirnames, filenames) in os.walk( os.path.join(os.path.dirname(__file__),"examples")):
			for filename in filenames:
				c = filenames.index(filename)
				data = file( os.path.join(dirpath,filename),"rb").read()
				a = WordToHtml(data,
				               c,
				               filename,"cgh",outputpath)
				a.run()
				a.CleanUp()

	def test_analyse_html(self):
		""" """
		url = "http://localhost"
		inname = "C:\\output\\4.html"
		outfile = "c:\\output\\4_f.html"
		infolder = "c:\\output"
		analyse = AnalyseHtmlWordDocument( file(inname).read(),
		                                   infolder,
		                                   url)
		analyse.parse()
		for image in analyse._images:
			image.setNewUrl( url )
		analyse.fixImageLinks()
		tmp = file (outfile,"w")
		tmp.write ( analyse._sourcedata )
		tmp.close()

		assert url in analyse._sourcedata
