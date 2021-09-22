# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			test_
# Purpose:     test
#
# Author:       Chris Hoy
#
# Created:		24/03/2011
# RCS-ID:        $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import unittest
import datetime
import os

from ttl.testsbase import initTestController

initTestController()

from prcommon.research.questionnaires.base import QuestionnaireBuilder, ResearchContact



class Testreports(unittest.TestCase):
	def setUp(self):
		# common test data
		pass
	def tearDown(self):
		pass

	def test_questionnaires(self):
		""" """
		a = QuestionnaireBuilder()
		a.start ( 72066 ,
		          ResearchContact("Brian","Day","test@pub.com"),
		          ResearchContact("Chris","Hoy","chris.g.hoy@gmail.com"),
		          "Main Message Text"
		          )
		a.run()
		t = file ("c:\\temp\\q.html","w")
		t.write ( a.output)
		t.close()
		print (a.output_compressed)

	def test_preview_questionnaires(self):
		""" """
		a = QuestionnaireBuilder(True)
		a.start ( 72066 ,
		          ResearchContact("","",""),
		          ResearchContact("","",""),
		          )
		a.run()
		t = file ("c:\\temp\\qp.html","w")
		t.write ( a.output)
		t.close()
		print (a.output_compressed)

