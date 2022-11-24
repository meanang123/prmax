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
from prmax.model import User, Customer, Interests

from webtest import AppError

class TestInterestsController( PRMaxBase ):
	""" Test interaction with the interst controller """

	def test_security(self):
		" test to see if we can access a controlled object"
		# should throw exception
		self.closeSecurity()
		try:
			response = self.app.get('/interests/listuserselection')
		except AppError, ex:
			assert str(ex).find("403") != -1
		else:
			assert response.status == 403

		#know we should have access
		self.initSecurity()
		response = self.app.get('/interests/listuserselection')
		assert response.status == '200 OK'

	def test_listuserselection_list_all(self):
		""" get a list of all the interest in the system"""

		self.initSecurity()
		response = self.app.get('/interests/listuserselection',
		  {"interesttypeid":1,
		   "filter":-1,
		   "word":"a",
		   "restrict":"1",
		   "keytypeid":	"6",
		   "transactionid":"C48E94BA-DF70-0001-257C-140C1C8618FB"},
		  headers={'Cookie': self.session_id })
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  > 100


	def test_listuserselection_filter (self):
		""" get a list of all the interest in the system"""
		# setup test info
		self.initSecurity()
		params = dict ( interesttypeid = 1,
		                filter = -1,
		                word = "Accountancy",
		                transactionid = "C48E94BA-DF70-0001-257C-140C1C8618FB",
		                restrict = 0,
		                logic = 2 ,
		                keytypeid = 6)
		headers={'Cookie': self.session_id }

		# get the accounting interest no filter
		response = self.app.get('/interests/listuserselection', params,
								headers=headers)
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  == 1

		# get correct filter group
		interest  = Interests.query.filter_by(interestname="Finance").one()
		params['filter'] = interest.interestid
		response = self.app.get('/interests/listuserselection', params,
								headers=headers)
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  == 1

		# get incorrect filter group
		interest  = Interests.query.filter_by(interestname="Entertainment").one()
		params['filter'] = interest.interestid
		response = self.app.get('/interests/listuserselection', params,
								headers=headers)
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  == 0



