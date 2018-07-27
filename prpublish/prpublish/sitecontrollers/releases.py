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
		newsroomid = -1
		is_newsroom = False
		actual_field = 0
		prefix = argv[0][0]
		if argv[0][0] == "c":
			layout = 1
			actual_field = 1
			newsroomid = argv[0][1:]
		elif argv[0][0] == "w":
			layout = 2
			actual_field = 1
			newsroomid = argv[0][1:]
		elif argv[0] == "nr":
			is_newsroom = True
			layout = 3
			prefix = argv[1][0]
			if argv[1][0] == "g":
				newsroomid = argv[1][1:]
				actual_field = 2
			elif argv[1][0] == "e":
				newsroomid = argv[1][1:]
				actual_field = 2
		elif argv[0] == 'e2014':
			newsroomid = 24
			actual_field = 1
		elif argv[0] == 'e1966':
			newsroomid = 65
			actual_field = 1
		else:
			if len(argv) > 1:
				newsroomid = argv[0][1:]
				actual_field = 1

		if len(argv) > 0:
			temp = argv[actual_field].split(".")
			if len(temp) > 1:
				try:
					# get the id
					emailtemplateid = int(temp[0])

					#is it cached
					html = SEOCache.get_cached(emailtemplateid, newsroomid, layout)
					if html:
						return html

					#get details
					seorelease = SEORelease.get_for_display(emailtemplateid, newsroomid, prefix)
					if seorelease == None:
						return "Page Not Found"
				except:
					pass

		# build page and compress and cache is applicable
		ret = page_settings_basic()
		ret["seorelease"] = seorelease
		ret["layout"] = layout
		ret["newsroomid"] = newsroomid
		if seorelease:
			ret['newsroom'] = seorelease['newsroom']
		template = "prpublish.templates.release"
		if is_newsroom:
			template = "prpublish.templates.newsroom.release"
		if layout == 1:
			template = "prpublish.templates.newsroom.cardiff.release_cardiff"
		if layout == 2:
			template = "prpublish.templates.newsroom.cardiff.release_welsh"
		html = html_slimmer( view.render( ret, template = template ))
		if emailtemplateid:
			SEOCache.add_cache(emailtemplateid, newsroomid, html, layout)
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
	def epage(self, seoreleaseid, newsroomid, prefix, *args, **kw):
		""" send email to address """

		ret = page_settings_basic()
		if prefix == "e":
#			if newsroomid == -1 or newsroomid == '-1':#it is a seorelease that the newsroom is marked as client but it is not linked with a client
			seorelease = SEORelease.query.get(seoreleaseid)
			ret['email'] = seorelease.email
			ret['prefix'] = prefix
			ret['newsroomid'] = newsroomid
			ret['seoreleaseid'] = seoreleaseid
		else:
			from prcommon.model import ClientNewsRoomContactDetails
			ns_contact = ClientNewsRoomContactDetails.query.get(newsroomid)
			ret['email'] = ns_contact.email
			ret['prefix'] = prefix
			ret['newsroomid'] = newsroomid
			ret['seoreleaseid'] = seoreleaseid
		return ret







