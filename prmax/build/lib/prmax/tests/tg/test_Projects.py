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
import datetime, time
from turbogears import testutil
from turbogears.database import session
from prmax.tests.tg._base import PRMaxBase, PRMaxBaseModel
from prmax.model import User, Customer, Interests
from prmax import model
from sqlalchemy.exceptions import IntegrityError


from webtest import AppError

class TestProjectsController( PRMaxBase ):
	""" Test interaction with the interst controller """

	def test_security(self):
		" test to see if we can access a controlled object"
		# should throw exception
		self.closeSecurity()
		try:
			response = self.app.get('/projects/listuserselection')
		except AppError, ex:
			assert str(ex).find("403") != -1
		else:
			assert response.status == 403

		#know we should have access
		self.initSecurity()
		response = self.app.get('/projects/listuserselection')
		assert response.status == '200 OK'

	def test_listuserselection_list_all(self):
		""" get a list of all the interest in the system"""

		self.initSecurity()
		response = self.app.get('/projects/listuserselection',
								{"word":"*"},
								headers={'Cookie': self.session_id })
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  > 100

	def test_listuserselection_list_all(self):
		""" get a list of all the interest in the system"""

		self.initSecurity()
		response = self.app.get('/interests/listuserselection',
								{"interesttypeid":1,
								 "filter":-1,
								 "word":""},
								headers={'Cookie': self.session_id })
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  > 100


	def test_listuserselection_filter (self):
		""" get a list of all the interest in the system"""
		# setup test info
		self.initSecurity()
		params = dict ( interesttypeid = 1, filter = -1,word = "Accounting")
		headers={'Cookie': self.session_id }

		# get the accounting interest no filter
		response = self.app.get('/interests/listuserselection', params,
								headers=headers)
		obj = response.json
		assert obj['success'] == "OK"
		assert len(obj['data'] )  == 1

class TestProjectsModel( PRMaxBaseModel):
	""" Test interaction with the interst controller """

	def test_projects_basic_function(self):
		""" Test  Add, Delete, Exists, Unique"""

		def _TestNotValid():
			session.begin()
			try:
				proj = model.Project(projectname="Test")
				session.add(proj)
				session.flush()
				session.commit()
			finally:
				session.rollback()

		# should raise an itegerity error
		self.assertRaises (IntegrityError , _TestNotValid )

		# add project
		projectname = "Test_" + time.ctime() + "_Project"
		projectid = model.Project.AddProject ( -1, projectname ).projectid

		# check exists
		assert model.Project.Exits(-1, projectname ) == True

		# delete project
		model.Project.Delete ( projectid )
		assert model.Project.Exits(-1, projectname )  == False




