# -*- coding: utf-8 -*-
""" mediatoolkit  searching"""
#-----------------------------------------------------------------------------
# Name:        mediatoolkitaccess.py
# Purpose:		 To do a search and list of search's on the mediatoolkit system
#
# Author:      Chris Hoy
#
# Created:	   28/06/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
import logging
import urllib2
import urllib
import simplejson

# key and urls
ACCESS_TOKEN = "w5r9mcs64fk2uzdfwbcxb66f4nht7b0ubkmt9m3w52nrqe0dda"
BASEURL = "https://api.mediatoolkit.com/organizations/18206/"
KEYWORDSEARCH = "groups/%(groupid)s/keywords/%(keywordid)s/mentions"
GROUPSELECT = "groups/%(groupid)s"
PAGESIZE = 200

LOGGER = logging.getLogger("prcommon.model")

class MediaToolKitAccess(object):
	"""MediaToolKitAccess"""
	def __init__(self, debuglevel=0):
		self._opener = urllib2.build_opener(urllib2.HTTPHandler(debuglevel=debuglevel))

	def _build_basic_params(self, extra=None):
		"setup basic fields that are required by all queries"
		retdata = dict(access_token=ACCESS_TOKEN)
		if extra:
			retdata.update(extra)

		return retdata

	def execute_search(self, groupid, keywordid, from_time=None, to_time=None):
		"command to database and do search "

		urllib2.install_opener(self._opener)

		# setup start point
		command = (BASEURL + KEYWORDSEARCH) % dict(groupid=groupid, keywordid=keywordid)
		params = dict(offset=0, count=PAGESIZE)
		# restrictions
		if from_time:
			params["from_time"] = from_time.strftime("%d.%m.%Y. %H:%M GMT")
		more = True
		retdata = []
		while more:
			# do the search enought times to get all the record
			response = urllib2.urlopen(command + "?" + urllib.urlencode(self._build_basic_params(params)))
			results = simplejson.load(response.fp)
			if results["message"] == "OK":
				retdata.extend(results["data"]["response"])
				if len(results["data"]["response"]):
					params["offset"] = params["offset"] + params["count"]
					continue
			more = False

		return retdata

	def list_all_avaliable_searchs(self):
		"get all groups and keyword - will be used to selec"

		urllib2.install_opener(self._opener)

		# setup start point
		params = dict(offset=0, count=200)
		# restructions
		more = True
		retdata = []
		while more:
			# do the search enought times to get all the record
			response = urllib2.urlopen(BASEURL + "?" + urllib.urlencode(self._build_basic_params(params)))
			results = simplejson.load(response.fp)
			if results["message"] == "OK":
				for group in results["data"]["groups"]:
					command = (BASEURL + GROUPSELECT) % dict(groupid=group["id"])
					retgroup = dict(name=group["name"], keywords=[], id=group["id"])
					resp2 = urllib2.urlopen(command + "?" + urllib.urlencode(self._build_basic_params(None)))
					results2 = simplejson.load(resp2.fp)
					for keywords in results2["data"]["keywords"]:
						retgroup["keywords"].append(dict(id=keywords["id"], name=keywords["name"]))

					retdata.append(retgroup)

					params["offset"] = params["offset"] + params["count"]
					continue
			more = False

		return retdata




