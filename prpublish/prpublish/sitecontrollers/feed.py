# -*- coding: utf-8 -*-
""" SEO Press Release Detailed record View """
#-----------------------------------------------------------------------------
# Name:        releases.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     22/09/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import json
from turbogears import controllers, expose
from cherrypy import response
from prcommon.model import SEORelease, SEOSite

class FeedController(controllers.RootController):
	""" Details of feed"""

	@expose("")
	def default(self, *argv, **kw):
		""" default handler """

		seoreleases = None
		customerid = argv[0]
		export_type = argv[len(argv)-1]
		clientid = '-1'
		if len(argv) > 2:
			clientid = argv[1]

		params = {'customerid':customerid, 'export_type':export_type, 'clientid':clientid, 'days':300,}
		seoreleases = SEORelease.get_list(params)

		if seoreleases == None:
			return ""

		if export_type == "json":
			response.headers["Content-type"] = "application/json;charset=utf-8"
			seoreleases = json.dumps(seoreleases)
			return seoreleases
		elif  export_type == "rss":
			response.headers["Content-type"] = "text/xml;charset=utf-8"
			return SEOSite.get_rss_limited_feed(seoreleases)

		return ""








