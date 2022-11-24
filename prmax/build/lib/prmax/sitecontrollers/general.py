# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        general.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:     22/02/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from cherrypy import response
from turbogears import  identity
import os, os.path

from  prcommon.model import NewsFeed
import logging
log = logging.getLogger("prmax")

#########################################################
## Controller
#########################################################

#ALTER TABLE customerstatus SET SCHEMA internal

class GeneralController(object):
	""" Geenral controller methods that i can't thin where else they should go
	"""

	@staticmethod
	def WebSiteCommonFile(pobject, args, kw):
		""" Handles the common or missign files """
		if len(args)>0:
			# collect the std robot.txt file
			if args[0] == "robots.txt":
				return """User-agent: *
				Disallow: /static/
				Disallow: /eadmin/
				Disallow: /static2/
				Disallow: /login
				Disallow: /login_as
				Disallow: /logout
				Disallow: /start
				Disallow: /collateral
				Disallow: /v
				Disallow: /r"""
			# get the site map
			if args[0] == "sitemap.xml":
				response.headers["Content-type"] = "text/xml"
				info = getattr(pobject, "_tsitedata", None)
				if not info:
					t = file ( os.path.normpath(os.path.join ( os.path.dirname(__file__) .replace("/sitecontrollers",""), "templates/marketing/sitemap.xml")))
					info = pobject._tsitedata = t.read()
					t.close()
				return info
			# bing control file
			if args[0] == "LiveSearchSiteAuth.xml":
				return  """<?xml version="1.0"?><users><user>7A090E8FD5E5590C36E0C5A35B4FB406</user></users>"""

			if args[0] == "y_key_3f7a7076aa3b5c5b.html":
				return """
				<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN"><HTML><!-- 9337d8878dca9426 --><HEAD><META name="y_key" value="9337d8878dca9426"><TITLE></TITLE></HEAD><BODY></BODY></HTML>"""

			if args[0] == "googlehostedservice.html":
				return "google8a48d28c04d26525"

			if args[0] == "BingSiteAuth.xml":
				return """<?xml version="1.0"?><users><user>7A090E8FD5E5590C36E0C5A35B4FB406</user></users>"""

			if args and args[0].lower() == "prmaxnews.xml":
				response.headers["Content-type"] = "text/xml;charset=utf-8"
				icustomerid = None
				if not identity.current.anonymous:
					icustomerid = identity.current.user.customerextid

				# used loged in to find user id
				return NewsFeed.get_news_feed( icustomerid )


		log.error("**** MISSING COMMAND *****: " + "\nurl : " + str(args)  +
				  "\nparams: " + str(kw))

		return "Not Found"

