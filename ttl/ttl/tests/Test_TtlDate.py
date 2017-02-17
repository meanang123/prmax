# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:				test_ttldate
# Purpose:     test case for dates
#
# Author:       Chris Hoy
#
# Created:		23/02/2011
# RCS-ID:        $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import unittest
import os

from ttl.ttldate import TtlDate
from datetime import timedelta, datetime


class TtlDateTest(unittest.TestCase):
	def setUp(self):
		pass

	def tearDown(self):
		pass

	def test_no_weekend(self):
		t = datetime(2011,04,04)
		d = TtlDate.addWorkingDates(t,4)
		t += timedelta( days = 4 )
		assert ( d == t )

	def test_weekend(self):
		t = datetime(2011,04,04)
		d = TtlDate.addWorkingDates(t,5)
		t += timedelta( days = 7 )
		assert ( d == t )

	def test_bankholiday(self):
		t = datetime(2011,04,18)
		d = TtlDate.addWorkingDates(t,5)
		t += timedelta( days = 9 )
		#assert ( d == t )

