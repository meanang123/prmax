# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        test_controllers.py
# Purpose:     This test the root controller
#
# Author:       Chris Hoy
#
# Created:     25/02/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
import datetime
from turbogears.database import session
from prmax.tests.tg._base import PRMaxBase
from prmax.model import User, CustomerExternal

from webtest import AppError

class TestSecurity( PRMaxBase ):
	""" Test interaction with the interst controller """

	def test_set_user_security(self):
		" test to see if we can access a controlled object"
		# should throw exception

