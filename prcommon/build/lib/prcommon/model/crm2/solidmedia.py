# -*- coding: utf-8 -*-
""" Solid Media """
#-----------------------------------------------------------------------------
# Name:        solidmedia.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     03/09/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from turbogears import database, config
from turbogears.database import session
import prcommon.Constants as Constants
import logging
LOGGER = logging.getLogger("prcommon.model")
import urllib
import urllib2
import simplejson
import ttl.Constants as BaseConstants

ISTEST = config.get('prmax.solidmedialive', True)
DEBUGLEVEL = 10 if ISTEST else 0

HANDLERS = [
  urllib2.HTTPHandler(debuglevel=DEBUGLEVEL),
  urllib2.HTTPSHandler(debuglevel=DEBUGLEVEL),
]

OPENER = urllib2.build_opener(*HANDLERS)

Authorization_Token = "ACV4DbIgjpnJhPhDfdPk3yCLgqdUGAUI"

class SolidMediaInterface(object):
	"Solid MEdia"
	SolidMedia_Url_Live = "http://api.solidmediagroup.com"
	SolidMedia_Url_Test = "http://social.solidmediagroup.com"

	@staticmethod
	def get_default_headers():
		"Default Headers"

		return { 'authorization-token' :  Authorization_Token,
						 'Content-type': 'application/json',
						 'Accept': 'text/plain'}

	@staticmethod
	def get_host():
		"get host name "

		return SolidMediaInterface.SolidMedia_Url_Test

class SolidMediaUsers():
	""" Solid Media """

	@staticmethod
	def get_path():
		"""Get Path"""

		return "/api/user"

	@staticmethod
	def get_user(sl_userid):
		""" add a user too the api """

		req = urllib2.Request(SolidMediaInterface.get_host() +  SolidMediaUsers.get_path() + "/" + str(sl_userid),
								          headers = SolidMediaInterface.get_default_headers())
		req.get_method = lambda: "POST"
		response = OPENER.open(req)
		print (simplejson.load(response))

	@staticmethod
	def add_user(customer):
		""" add a user too the api """

		params = dict (last_name = customer.customername,
								   email = "sm_l%d@prmax.co.uk" % customer.customerid,
								   first_name = customer.customername,
								   hits_per_month = 500,
								   search_profiles = 2)

		req = urllib2.Request(SolidMediaInterface.get_host() + SolidMediaUsers.get_path(),
								          headers = SolidMediaInterface.get_default_headers(),
								          data = simplejson.dumps(params) ) #, urllib.urlencode(params) )
		req.get_method = lambda: "POST"
		try:
			response = OPENER.open(req)
			retdata = simplejson.load(response)
			success = BaseConstants.Return_Success
		except Exception, ex:
			print (ex)
			success = BaseConstants.Return_Failed
			retdata = None

		return {"success" : success,  "data" : retdata}

class SolidMediaSearchProfiles():
	"Search Profiles"

	@staticmethod
	def get_host():
		"get host name "

		return "http://api.solidmediagroup.com"

	@staticmethod
	def get_path():
		"""get path element """

		return "/search-profile"


	@staticmethod
	def create_search_profile(name, languages, keyword, modifiers, auth_user ):
		"""Create Profile """

		headers = SolidMediaInterface.get_default_headers()
		headers["authorization-token"] =  auth_user

		req = urllib2.Request(SolidMediaSearchProfiles.get_host() +  SolidMediaSearchProfiles.get_path(),
								          headers = headers,
								          data = simplejson.dumps(dict (name = name,
								                                        languages = languages,
								                                        keyword = keyword,
								                                        modifiers = modifiers)))
		req.get_method = lambda: "POST"
		try:
			response = OPENER.open(req)
			retdata = simplejson.load(response)
			success = BaseConstants.Return_Success
		except Exception, ex:
			success = BaseConstants.Return_Failed
			retdata = None

		return dict(success = success, data = retdata)


	@staticmethod
	def search_profile(auth_user, profile_guid):
		"""Create Profile """

		headers = SolidMediaInterface.get_default_headers()
		headers["authorization-token"] =  auth_user

		print (SolidMediaSearchProfiles.get_host() +  SolidMediaSearchProfiles.get_path() + "/" + profile_guid)

		req = urllib2.Request(SolidMediaSearchProfiles.get_host() +  SolidMediaSearchProfiles.get_path() + "/" + profile_guid,
								          headers = headers)
		try:
			response = OPENER.open(req)
			retdata = response.read()
			success = BaseConstants.Return_Success
		except Exception, ex:
			success = BaseConstants.Return_Failed
			retdata = None

		return dict(success = success, data = retdata)

	@staticmethod
	def search(auth_user, profile_guid):
		""""""

		headers = SolidMediaInterface.get_default_headers()
		headers["authorization-token"] =  auth_user

		req = urllib2.Request(SolidMediaSearchProfiles.get_host() +  "/posts",
								          headers = headers)
		try:
			response = OPENER.open(req)
			retdata = response.read()
			success = BaseConstants.Return_Success
		except Exception, ex:
			success = BaseConstants.Return_Failed
			retdata = None

		return dict(success = success, data = retdata)



	#for beta:  http://beta-api.solidmediagroup.com/search-profile   OR   http://beta.solidmediagroup.com/api/search-profile
	#curl -X POST -H "authorization-token: 4eoyr7jp6jok4o0soooc0sgcswcoss04408cg40848o8c8kww8" -H "Content-type: application/json" -d '{"name":"about apple","languages":["en","ru"], "keyword": {"text":"apple"}, "modifiers" :[{"type":"and", "keyword":"iphone"}, {"exact":"1","type":"or", "keyword":"ipad"}]}' http://api.solidmediagroup.com/search-profile

if __name__=='__main__':
	import os
	from ttl.tg.config import read_config
	# initiale interface to tg to get at data model
	read_config(os.getcwd(), None, None)
	# connect to database
	database.bind_meta_data()

	from prcommon.model.identity import Customer

	#user_created = SolidMediaUsers.add_user(Customer.query.get(1))
	#SolidMediaUsers.get_user(3363)
	#retdata = SolidMediaSearchProfiles.create_search_profile("Chris Test 12",
	#                                             ["en"],
	#                                             {"text":"apple"},
	#                                             [{"type":"or", "keyword":"iphone"}],
	#                                             user_created["data"]["auth_token"] )

	print (SolidMediaSearchProfiles.search('ACV4DbIgjpnJhPhDfdPk3yCLgqdUGAUI'))




#	{u'first_name': u'Chris Test', u'last_name': u'Chris Test', u'auth_token': u'3k8r6n4eptmowg44o0ss4084wo40gwog8s4ocww88kkgwwg88s', u'hits_per_month': 500, u'email': u'SME_1@prmax.co.uk', u'search_profiles': 2, u'id': 3368}
#{u'status': u'active', u'modifiers': [{u'type': u'or', u'keyword': u'iphone'}], u'last_cyb_id': u'', u'keyword': u'apple', u'show': True, u'created_at': {u'usec': 199000, u'sec': 1415205738}, u'_id': {u'$id': u'545a536a4307921754649524'}, u'languages': [u'en'], u'datasift_historic': {u'status': u'new', u'source': [], u'dpu': 0, u'playback_id': u''}, u'key': u'Chris Test 6', u'oldstyle_key': u'', u'total': 0, u'exact': 0}
