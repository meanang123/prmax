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
from slimmer import html_slimmer
from prcommon.model import SEORelease, SEOCache, SEOImage
from prpublish.lib.common import page_settings_basic
from ttl.ttlemail import ext_to_content_type
from ttl.postgres import DBCompress


class ReleasesController(controllers.RootController):
	""" Details of release"""

	@expose("text/html")
	def default(self, *argv, **kw):
		""" default handler """
		seorelease = None
		layout = 0
		emailtemplateid = None
		actual_field = 0
		if argv[0] == "c":
			layout = 1
			actual_field = 1

		if len(argv) > 0:
			temp = argv[actual_field].split(".")
			if len(temp) > 1:
				try:
					# get the id
					emailtemplateid = int(temp[0])

					#is it cached
					html = SEOCache.get_cached(emailtemplateid, layout)
					if html:
						return html

					#get details
					seorelease = SEORelease.get_for_display(emailtemplateid, layout)
					if seorelease == None:
						return ""
				except:
					pass

		# build page and compress and cache is applicable
		ret = page_settings_basic()
		ret["seorelease"] = seorelease
		ret["layout"] = layout
		html = html_slimmer(view.render(ret, template="prpublish.templates.release"))
		if emailtemplateid:
			SEOCache.add_cache(emailtemplateid, html, layout)
		# return page
		return html

	@expose("")
	def images(self, imageid, *args, **kw):
		""" return a thmb mail imabe """

		try:
			seoimage = SEOImage.query.get(imageid)
			seodata = DBCompress.decode(seoimage.seoimage)

			# return data
			response.headers["Content-Length"] = len(seodata)
			response.headers["Content-type"] = ext_to_content_type(seoimage.seo_image_extension)
			response.headers["Age"] = 30
			tday = datetime.now().strftime("%a, %d %b %Y %M:%H:%S GMT")
			response.headers["Date"] = tday
			response.headers["Last-Modified"] = tday
			response.headers["Expires"] = (datetime.now()+ timedelta(days=1)).strftime("%a, %d %b %Y %M:%H:%S GMT")
			response.headers["Cookies"] = ""

			return seodata

		except:
			return ""

	@expose(template="prpublish.templates.epage")
	def epage(self, seoreleaseid, *args, **kw):
		""" send email to address """

		ret = page_settings_basic()
		ret["seorelease"] = SEORelease.query.get(seoreleaseid)
		return ret







