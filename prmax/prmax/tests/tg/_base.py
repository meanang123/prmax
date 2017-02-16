# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        _base.py
# Purpose:     basic function to allow testing of web functions
#
# Author:       Chris Hoy
#
# Created:     25/02/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import unittest
import turbogears
from turbogears.database import session
from turbogears import database, testutil

# setup default database connections
database.set_db_uri("postgres://prmax:mkjn_45@localhost/prmax","sqlalchemy")
database.set_db_uri("postgres://prmax:mkjn_45@localhost/prmaxcache","prmaxcache")
database.set_db_uri("postgres://prmax:mkjn_45@localhost/prmaxcollateral","prmaxcollateral")

from prmax.model import User
import prmax.controllers

_prmaxversion  = "prmaxtest"

class PRMaxBase( testutil.TGTest ):
	""" This is the basic controller it's an override of the standard webtest
    controller for tg"""

	# root node and text config file
	root = prmax.controllers.Root
	configfile = "/project/" + _prmaxversion + "/prmax/test.cfg"
	std_login_string  = '/login?user_name=%s&password=%s&login=Login'

	def __init__(self, *argc, **argv):
		""" created objects and sets default"""
		turbogears.testutil.TGTest.__init__(self, *argc, **argv)
		# setup basic details
		self.user_name = "Chris"
		self.session_id = ""
		user = session.query( User ).filter_by( user_name = self.user_name).one()
		self.std_login_details  = (user.user_name, "qwert")

	def initSecurity(self , force = False ):
		""" logs a user into the system
        capture the security cookie for later """
		if not self.session_id or force:
			user = session.query( User ).filter_by( user_name = self.user_name).one()
			response = self.app.get(PRMaxBase.std_login_string%(user.user_name,
															"qwert"))
			assert '/start' in response
			# capture cookie and setup details
			self.session_id = response.headers['Set-Cookie']
			self.std_login_details  = (user.user_name, user.password)

	def closeSecurity(self):
		"""closed the current users connection"""
		self.app.get('/logout', headers={'Cookie': self.session_id })
		self.session_id =""

	def setUp(self):
		""" override the standard setup to allow the configuration file to be set up
        this is needed as i can't et a defualt dir in wing"""

		turbogears.update_config(configfile=PRMaxBase.configfile,
								 modulename="prmax.config")
		turbogears.testutil.TGTest.setUp(self)

class PRMaxBaseModel( unittest.TestCase):
	pass
