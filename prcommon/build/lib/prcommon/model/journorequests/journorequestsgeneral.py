# -*- coding: utf-8 -*-
""" JournoRequestsGeneral """
#-----------------------------------------------------------------------------
# Name:       journorequestsgeneral.py
# Purpose:
#
# Author:     Chris Hoy
#
# Created:    06/12/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears import config
import urllib2, urllib
import simplejson
import logging
LOGGER = logging.getLogger("prmax")

AUTH_TOKEN = "4dDRVhzhmdGr3d"
TEST_URL = "https://private-anon-95e99f508-journorequests.apiary-mock.com"
LIVE_URL = "https://www.journorequests.com"

if config.get('prmax.release', 'False'):
	JOURNO_URL = LIVE_URL
	DEV_API = ""
else:
	JOURNO_URL = TEST_URL
	DEV_API = "dev/"


class JournoRequestsGeneral(object):
	""" JournoRequestsGeneral """

	TOPICS = (
	  ("journorequests_tech", "Tech"),
		("journorequests_business", "Business"),
		("journorequests_legal", "Legal"),
		("journorequests_property", "Property"),
		("journorequests_education", "Education"),
		("journorequests_entertainment", "Entertainment"),
		("journorequests_fashion", "Fashion"),
		("journorequests_health", "Health"),
		("journorequests_lifestyle", "Lifestyle"),
		("journorequests_charity", "Charity"),
		("journorequests_relationships", "Relationships"),
		("journorequests_parents", "Parents"),
		("journorequests_food", "Food"),
		("journorequests_travel", "Travel"),
		("journorequests_general", "General"),
		("journorequests_serious", "Serious"),
	  )

	@staticmethod
	def get_default_settings(customersettings=None):
		"""get dict with default """

		retdata = {"auth_token": AUTH_TOKEN }
		if customersettings:
			retdata["user_token"] = customersettings.journorequests_user_token

		return retdata

	@staticmethod
	def execute_command(command, customersettings, invalues=None):
		"""Execute the command """

		if invalues:
			values = invalues
		else:
			values = JournoRequestsGeneral.get_default_settings(customersettings)

		req = urllib2.Request(JOURNO_URL + "/api/v1/%s%s" % (DEV_API, command),
                          urllib.urlencode(values))
		req.get_method = lambda: "POST"

		return simplejson.load(urllib2.urlopen(req).fp)



	@staticmethod
	def add(customer, customersettings):
		"""Add a customer"""

		values = JournoRequestsGeneral.get_default_settings()
		values["email"] = customersettings.journorequests_email
		values["paid_amount"] = "15"

		try:
			customersettings.journorequests_user_token = JournoRequestsGeneral.execute_command("user/sign_up", customersettings, values)["user_token"]
		except:
			LOGGER.exception("JournoRequestsGeneral_add")
			raise

	@staticmethod
	def delete(customersettings):
		"""Delete customer"""
		try:
			req = urllib2.Request(JOURNO_URL + "/api/v1/%suser/unsubscribe" % DEV_API,
			                      urllib.urlencode(JournoRequestsGeneral.get_default_settings(customersettings)))
			req.get_method = lambda: "POST"
			retdata = simplejson.load(urllib2.urlopen(req).fp)
			return True
		except:
			LOGGER.exception("JournoRequestsGeneral_delete")
			raise

	@staticmethod
	def set_categories(customersettings):
		"""Set the settings"""
		values = JournoRequestsGeneral.get_default_settings(customersettings)
		topics = []
		for topic in JournoRequestsGeneral.TOPICS:
			if getattr(customersettings, topic[0], False):
				topics.append(topic[1])
		values["topics"] = simplejson.dumps(topics)
		values["keywords"] = simplejson.dumps([customersettings.journorequests_phrase])

		try:
			req = urllib2.Request(JOURNO_URL + "/api/v1/%suser/set_alerts" % DEV_API,
			                      urllib.urlencode(JournoRequestsGeneral.get_default_settings(customersettings)))
			req.get_method = lambda: "POST"
			retdata = simplejson.load(urllib2.urlopen(req).fp)
			return True
		except:
			LOGGER.exception("JournoRequestsGeneral_delete")
			raise







