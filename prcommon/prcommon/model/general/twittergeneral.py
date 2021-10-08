# -*- coding: utf-8 -*-
""" ProfileCache """
#-----------------------------------------------------------------------------
# Name:       twittergeneral.py
# Purpose:
# Author:     Chris Hoy
#
# Created:    080/08/2013
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------
from turbogears.database import session

import twitter
import logging
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

class TwitterSearch(object):
	""" twitter search 1.1 """

	# these are the twitter key for @PRnewslink
	__consumer_key = 'Y6ewryfrZSFGuUkDSVOfAg'
	__consumer_secret = 'ESk2aiideMCm7skAOWf9lYdQGr3y0EDIOKRNJtQ95s'
	__access_token_key = '438366129-VX0wCgcWwHyOGAqQBv0itCKdyy1HLYAhj3zCxP8S'
	__access_token_secret = '3oZyMzZBAm04wqPu8QVhSbOKpW7omvRhFCkC0Vfoh8'

	@staticmethod
	def do_search(twitterid):
		"""get a list of resutls from twitter"""

		api = twitter.Api(
		  consumer_key=TwitterSearch.__consumer_key,
		  consumer_secret=TwitterSearch.__consumer_secret,
			access_token_key=TwitterSearch.__access_token_key,
			access_token_secret=TwitterSearch.__access_token_secret,
		debugHTTP = False)
		# test to see if connection worked
		tmp =  api.VerifyCredentials()
		
	@staticmethod
	def get_twitter_profile_image_url(twitterlink):
		user_profile_image_url = ''
		if twitterlink != None and twitterlink != '':
			twitterid = twitterlink
			if twitterid.startswith("https:"):
				twitterid = twitterid[20:]
			elif twitterid.startswith("http:"):
				twitterid = twitterid[19:]
		
		api = twitter.Api(
		  consumer_key=TwitterSearch.__consumer_key,
		  consumer_secret=TwitterSearch.__consumer_secret,
			access_token_key=TwitterSearch.__access_token_key,
			access_token_secret=TwitterSearch.__access_token_secret,
			debugHTTP = False)
		
		user_profile_image_url = ''
		try:
			user = api.GetUser(screen_name=twitterid)
			user_profile_image_url = user.profile_image_url
		except:
			user_profile_image_url = ''
		return user_profile_image_url
