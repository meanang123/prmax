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
from datetime import datetime, timedelta
from turbogears import controllers, expose, view
from cherrypy import response
from prcommon.model import SEORelease, SEOCache, SEOImage
from prpublish.lib.common import page_settings_basic
from ttl.ttlemail import ext_to_content_type
from ttl.postgres import DBCompress
import json

class FeedController(controllers.RootController):
	""" Details of feed"""

	@expose("json")
	def default(self, *argv, **kw):
		""" default handler """

		seoreleases = None
		customerid = argv[0]
		export_type = argv[len(argv)-1]
		clientid = '-1'
		if len(argv) > 2:
			clientid = argv[1]

		params = {'customerid':customerid, 'export_type':export_type, 'clientid':clientid}
		results = {}
		seoreleases = SEORelease.get_list(params)
		
		if seoreleases == None:
			return ""
		
		seoreleases = json.dumps(seoreleases)
		return seoreleases








