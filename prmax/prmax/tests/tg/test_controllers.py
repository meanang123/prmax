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
from prmax.model import User, Customer

from webtest import AppError

class TestMainController( PRMaxBase ):
	""" Test for the  root controller of prmax"""

	def test_security(self):
		" test to see if we can access a controlled object"
		# should throw exception
		self.closeSecurity()
		try:
			response = self.app.get('/interests/listuserselection')
		except AppError, ex:
			assert str(ex).find("403") != 0
		else:
			assert response.status == 403

		#know we should have access
		self.initSecurity()
		response = self.app.get('/interests/listuserselection')
		assert response.status == '200 OK'


	def test_indextitle(self):
		"""Test to see if a basic connection can be made """
		response = self.app.get('/index')
		assert "<title>prmax</title>" in response.body.lower()

	def test_to_start_page(self):
		"""Test to see if we can make it all the way to the start page """
		# ensure that the users licence is in date
		self._setlicence(31)
		# now access the page
		response = self.app.get(PRMaxBase.std_login_string % self.std_login_details )
		response = response.follow()
		assert "<title>prmax main</title>" in response.body.lower()

	def test_to_licence_expired_page(self):
		""" test to check that the licence expired gors to the correct page """
		# ensure that the licence has expired
		self._setlicence(-31)
		# now access the page
		response = self.app.get(PRMaxBase.std_login_string % self.std_login_details )
		response = response.follow()

		assert "<title>prmax licence expired</title>" in response.body.lower()

		self._setlicence(31)


	def test_licence_about_to_expired(self):
		""" test to check that the licence is about to expired """
		# ensure that the licence has expired
		self._setlicence(1)
		# now access the page
		response = self.app.get(PRMaxBase.std_login_string % self.std_login_details )
		response = response.follow()

		assert "<title>prmax licence about to expired</title>" in response.body.lower()

		self._setlicence(31)

	def _setlicence(self, days):
		""" set the database licence details for the user"""
		transaction = session.begin()
		user = session.query( User ).filter_by( user_name = self.user_name).one()
		customer = Customer.query.get(user.customerid)
		customer.licence_expire = datetime.datetime.now() + datetime.timedelta ( days = days )
		session.flush()
		transaction.commit()

