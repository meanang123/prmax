# -*- coding: utf-8 -*-
""" Actual Process to twitter access the Db and post too twitter
"""
#-----------------------------------------------------------------------------
# Name:        prapi.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     16/12/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011
#-----------------------------------------------------------------------------

import twitter
from  turbogears import config
from sqlalchemy import cast, Date
from turbogears.database import session
from datetime import date
from prcommon.model import SEORelease
import prcommon.Constants as Constants

class PRTwitter(object):
	""" Manage twittets from the seo system """

	# these are the twitter key for @PRnewslink
	__consumer_key = 'Y6ewryfrZSFGuUkDSVOfAg'
	__consumer_secret = 'ESk2aiideMCm7skAOWf9lYdQGr3y0EDIOKRNJtQ95s'
	__access_token_key = '438366129-VX0wCgcWwHyOGAqQBv0itCKdyy1HLYAhj3zCxP8S'
	__access_token_secret = '3oZyMzZBAm04wqPu8QVhSbOKpW7omvRhFCkC0Vfoh8'

	def __init__(self, _logger, _istest ):
		"""__init__"""
		self._logger = _logger
		self._istest = _istest
		self._webroot = config.get('prpublish.web','')
		self._api = None

	def run(self):
		"""This look at all the seo that have been posted as live and then sent a tweet if
		a tweet has not been sent """
		nbr = 0
		self._open_twitter()
		for seo in session.query (SEORelease).\
		    filter(SEORelease.seostatusid == Constants.SEO_Live).\
		    filter(cast(SEORelease.published,Date) == date.today()).\
		    filter(SEORelease.seo_tweet_send == False).all():
			# start send tweet
			transaction = session.begin()
			try:

				self._twitter (seo)
				nbr += 1
				transaction.commit()
			except:
				self._logger.exception("post titter")
				transaction.rollback()

		return nbr

	def _open_twitter(self):
		"""Open a connection to the twitter account"""

		self._api = twitter.Api(
		  consumer_key=PRTwitter.__consumer_key,
		  consumer_secret=PRTwitter.__consumer_secret,
			access_token_key=PRTwitter.__access_token_key,
			access_token_secret=PRTwitter.__access_token_secret,
		debugHTTP = False)
		# test to see if connection worked
		tmp =  self._api.VerifyCredentials()
		if not tmp:
			raise Exception("Connection to twitter Failed")

	def _twitter(self, seo):
		"""Twitter and seo and mark as completed"""

		# check length
		webaddress = '%sr/%d.html' % (self._webroot , seo.seoreleaseid )
		if len(webaddress) + len(seo.headline) >= 140:
			headline = seo.headline[: (140 - len(webaddress))]
		else:
			headline = seo.headline

		# post tweet or log if in test mode
		if self._istest == False:
			self._api.PostUpdate('%s %s' % ( headline, webaddress ) )
		else:
			self._logger.info("Tweeting - %s %s" % (headline, webaddress))

		# set as posted
		seo.seo_tweet_send = True

	def search(self, hashtag, since_id=None):
		"search "

		params = {"term":hashtag, "count": 100, "lang": "en"}
		if since_id:
			params["since_id"] = since_id

		return self._api.GetSearch(**params )
