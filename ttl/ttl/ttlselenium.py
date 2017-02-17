# -*- coding: utf-8 -*-
""" Base stuff for selenimu testing"""
#-----------------------------------------------------------------------------
# Name:        base.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:	   29/03/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
#
import os

try:
	from selenium import webdriver
except:
	print "Test Framework not avaliable"

class SeleniumWebInterface(object):
	"SeleniumWebInterface"
	BROWSER_FIREFOX = "F"
	BROWSER_CHROME = "C"
	BROWSER_IE = "I"

	BROWSERS_ALL = "FCI"

	def __init__(self, browers=None):
		"init"
		if browers:
			# list of browsers
			tmp = []
			for typeid in browers.upper():
				if typeid == SeleniumWebInterface.BROWSER_CHROME:
					tmp.append((webdriver.Chrome(), SeleniumWebInterface.BROWSER_CHROME))
				elif typeid == SeleniumWebInterface.BROWSER_FIREFOX:
					tmp.append((webdriver.Firefox(), SeleniumWebInterface.BROWSER_FIREFOX))
				elif typeid == SeleniumWebInterface.BROWSER_IE:
					tmp.append((webdriver.Ie(), SeleniumWebInterface.BROWSER_IE))

			self._browsers = tuple(tmp)
		else:
			self._browsers = ((webdriver.Firefox(), SeleniumWebInterface.BROWSER_FIREFOX), )

	@property
	def browsers(self):
		"list of browsers"
		return self._browsers

	def clear(self):
		"clear down "
		for browser in self._browsers:
			try:
				browser[0].close()
			except Exception, ex:
				print ex

		self._browsers = ()

	def __delete__(self):
		"final cleardown "

		self.clear()
		
		
class PrmaxWebEnvironment(object):
	""" Prmax evironment """

	EMBEDDED_LOCAL = "prmaxtest.localhost"

	def __init__(self, host_name=None):
		""" init """

		self._protocol = "http"
		self._host_name = host_name
		self._basic_auth = False

		# default test user assigned to shop 46
		self._username = 'stamatia.vatsi@prmax.co.uk'
		self._password = '4UWSDfQ4'

		self._env_matrix = {
		  "em_local": (PrmaxWebEnvironment.EMBEDDED_LOCAL, False),
		}

	@property
	def hostname(self):
		"hostname"

		return self._protocol + "://" + self._host_name

	@property
	def username(self):
		"hostname"

		return self._username

	@username.setter
	def username(self, value):
		"value"
		self._username = value

	@property
	def password(self):
		"hostname"

		return self._password

	@password.setter
	def password(self, value):
		"""set password """
		self._password = value

	def set_environment(self):
		"set the environment"

		env = self._env_matrix.get(os.environ.get('PRMAXENV', "em_local"), "")
		if  env:
			self._host_name = env[0]
			self._basic_auth = env[1]
		elif not self._host_name:
			raise Exception("Missing or Unknown Enviroment %s" % os.environ.get('PRMAXENV', ""))

	def build_full_url(self, path, browser=None, objectid=None):
		"""build login url"""

		if  self._basic_auth:
			base = "%s://%s:%s@%s/%s" % (self._protocol, self._username, self._password, self._host_name, path)
		else:
			base = "%s://%s/%s" % (self._protocol, self._host_name, path)

		if objectid:
			base = base + "/" + str(objectid)

		return base

	def get_login(self):
		"""Get login key"""

		return "login_as?&username=%s&password=%s" % (self._username, self._password)





class PPRWebEnvironment(object):
	""" Paperround evironment """

	EMBEDDED_LIVE = "newspoint.paperround.net/customer/"
	EMBEDDED_TEST = "pprembedded.test.paperround.net/customer/"
	EMBEDDED_LOCAL = "pprembedded.localhost/customer/"

	IMOVO_LIVE = "imovo.paperround.net"
	IMOVO_TEST = "voucherpoint.test.paperround.net"

	def __init__(self, host_name=None):
		""" init """

		self._protocol = "http"
		self._host_name = host_name
		self._basic_auth = False

		# default test user assigned to shop 46
		self._username = 'selenium@paperround.net'
		self._password = 'hGw^o9nv'
		self._dev_key = '0QxENtVZXWvjmdGnV4J9'

		self._env_matrix = {
		  "em_local": (PPRWebEnvironment.EMBEDDED_LOCAL, False),
		  "em_test": (PPRWebEnvironment.EMBEDDED_TEST, False),
		  "em_live": (PPRWebEnvironment.EMBEDDED_LIVE, False),
		  "imovo_test": (PPRWebEnvironment.IMOVO_TEST, False),
		  "imovo_live": (PPRWebEnvironment.IMOVO_LIVE, False),
		}

	@property
	def hostname(self):
		"hostname"

		return self._protocol + "//" + self._host_name

	@property
	def username(self):
		"hostname"

		return self._username

	@username.setter
	def username(self, value):
		"value"
		self._username = value

	@property
	def password(self):
		"hostname"

		return self._password

	@password.setter
	def password(self, value):
		"""set password """
		self._password = value

	@property
	def basic_auth(self):
		"basic_auth"

		return self._basic_auth

	@basic_auth.setter
	def basic_auth(self, value):
		"basic_auth"
		self._basic_auth = value

	def set_environment(self):
		"set the environment"

		env = self._env_matrix.get(os.environ.get('PPRENV', ""), "")
		if  env:
			self._host_name = env[0]
			self._basic_auth = env[1]
		elif not self._host_name:
			raise Exception("Missing or Unknown Enviroment %s" % os.environ.get('PPRENV', ""))

	def build_full_url(self, path, browser=None, objectid=None):
		"""build login url"""

		if  self._basic_auth:
			base = "%s://%s:%s@%s/%s" % (self._protocol, self._username, self._password, self._host_name, path)
		else:
			base = "%s://%s/%s" % (self._protocol, self._host_name, path)

		if objectid:
			base = base + "/" + str(objectid)

		return base

	def get_login(self):
		"""Get login key"""

		return "login_as?devappkey=%s&username=%s&password=%s" % (self._dev_key, self._username, self._password)



