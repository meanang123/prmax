# -*- coding: utf-8 -*-
"""This module contains the controller classes of the application."""

# symbols which are imported by "from prpublish.controllers import *"
__all__ = ['Root']

from turbogears import controllers, expose, view
from turbogears.database import config, get_engine, create_session
from cherrypy import request, response

get_engine()
create_session()

from sitecontrollers.releases import ReleasesController
from sitecontrollers.feed import FeedController
from sitecontrollers.newsroom import NewsRoomController
from cherrypy import response
from prcommon.model import SEORelease, SEOSite, SEOCategories
from lib.common import page_settings_basic

CATEGORY_PAGES = SEOCategories.get_page_map()
CARDIFF_ENGLISH = 25
CARDIFF_WELSH = 66
CARDIFF_LS_TITLE_ENGLISH = 'Latest Releases'
CARDIFF_LS_TITLE_WELSH = 'Datganiadau Diweddaraf'
CARDIFF_KT_TITLE_ENGLISH = 'Stronger, Fairer, Greener'
CARDIFF_KT_TITLE_WELSH = 'Cryfach, Tecach, Gwyrddach'

class Root(controllers.RootController):
	"""The root controller of the application."""

	releases = ReleasesController()
	feed = FeedController()
	r = ReleasesController()
	nr = NewsRoomController()

	@expose(template="prpublish.templates.main")
	def index(self, *args, **kw ):
		""" Show the default page """

		# we need deal with the esearch and sets
		ret = page_settings_basic()
		#kw['nr'] = False
		ret.update ( SEORelease.get_for_release( kw ))
		return ret

	@expose(template="prpublish.templates.search")
	def search_view(self, *args, **kw ):
		""" Show the default page """

		# we need deal with the esearch and sets
		return page_settings_basic()

	@expose(template="prpublish.templates.main")
	def search(self, *args, **kw ):
		""" search """
		ret = page_settings_basic()
		ret.update ( SEORelease.do_search( kw ))
		return ret

	@expose(template="prpublish.templates.newsroom.cardiff.main_page")
	def searchcardiff(self, *args, **kw ):
		""" search """
		ret = page_settings_basic()
		kw['nid'] = CARDIFF_ENGLISH
		kw['page_title'] = CARDIFF_LS_TITLE_ENGLISH
		if 'keytopics' in kw and kw['keytopics'] != 0 and kw['keytopics'] != '0':
			kw['page_title'] = CARDIFF_KT_TITLE_ENGLISH
		ret.update ( SEORelease.do_search( kw ))
		return ret

	@expose(template="prpublish.templates.newsroom.cardiff.main_page_welsh")
	def searchwelsh(self, *args, **kw ):
		""" search """
		ret = page_settings_basic()
		kw['nid'] = CARDIFF_WELSH
		kw['page_title'] = CARDIFF_LS_TITLE_WELSH
		if 'keytopics' in kw and kw['keytopics'] != 0 and kw['keytopics'] != '0':
			kw['page_title'] = CARDIFF_KT_TITLE_WELSH
		ret.update ( SEORelease.do_search( kw ))
		return ret

	@expose(template="prpublish.templates.newsroom.cardiff.main_page")
	def search_results_cardiff(self, *args, **kw ):
		""" search """
		ret = page_settings_basic()
		#kw['nr'] = False
		kw['nid'] = CARDIFF_ENGLISH
		ret.update ( SEORelease.do_search( kw ))
		return ret

	@expose(template="prpublish.templates.newsroom.cardiff.main_page_welsh")
	def search_results_welsh(self, *args, **kw ):
		""" search """
		ret = page_settings_basic()
		#kw['nr'] = False
		kw['nid'] = CARDIFF_WELSH
		ret.update ( SEORelease.do_search( kw ))
		return ret

	@expose(template="prpublish.templates.contactus")
	def contactus(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()

	@expose(template="prpublish.templates.searchmodal")
	def searchmodal(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()


	@expose(template="prpublish.templates.sitemap")
	def sitemap(self, *args, **kw ):
		""" Contact Us Page """
		return page_settings_basic()

	@expose(template="prpublish.templates.copyright")
	def copyright(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()

	@expose(template="prpublish.templates.categories")
	def categories(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()

	@expose(template="prpublish.templates.aboutus")
	def aboutus(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()

	@expose(template="prpublish.templates.privacypolicy")
	def privacypolicy(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()

	@expose(template="prpublish.templates.privacypolicy2")
	def privacypolicy2(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()


	@expose(template="prpublish.templates.termsconditions")
	def termsconditions(self, *args, **kw ):
		""" Contact Us Page """
		#kw['nr'] = False
		return page_settings_basic()

	@expose(template="prpublish.templates.main")
	def search_results(self, *args, **kw ):
		""" search """
		ret = page_settings_basic()
		#kw['nr'] = False
		ret.update ( SEORelease.do_search( kw ))

		return ret

	@expose("")
	def default(self, *args,  **kw ):
		""" default files """

		response.headers["Content-type"] = "text/html;charset=utf-8"
		#kw['nr'] = False

		if args and args[0].lower() == "robots.txt":
			return """User-agent: *
			Disallow: /static/
			Sitemap: %sSitemap.xml""" % config.get('prpublish.web','')
		if args and args[0].lower() == "sitemap.xml":
			response.headers["Content-type"] = "text/xml;charset=utf-8"
			return SEOSite.sitemap()
		if args and args[0].lower() in ("news_sitemap.xml", "news_sitemap"):
			response.headers["Content-type"] = "text/xml;charset=utf-8"
			return SEOSite.news_sitemap()

		if args and args[0].lower() == "google5379e74cac1ecb0a.html":
			return "google-site-verification: google5379e74cac1ecb0a.html"

		if args and args[0].lower() == "bingsiteauth.xml":
			return """<?xml version="1.0"?><users><user>647F7E6AADD8D311E8505623B5C67405</user></users>"""

		if args and args[0].lower() == "rss_cardiff.xml":
			response.headers["Content-type"] = "text/xml;charset=utf-8"
			newsroomid = CARDIFF_ENGLISH
			return SEOSite.get_rss_cardiff(newsroomid)

		if args and args[0].lower() == "rss_welsh.xml":
			response.headers["Content-type"] = "text/xml;charset=utf-8"
			newsroomid = CARDIFF_WELSH
			return SEOSite.get_rss_cardiff(newsroomid)

		if args and args[0].lower() == "rss.xml":
			response.headers["Content-type"] = "text/xml;charset=utf-8"
			seocategoryid = kw.get("seocategoryid", None)
			if seocategoryid:
				seocategoryid = int ( seocategoryid )
			return SEOSite.get_rss(seocategoryid)

		if args and args[0].lower() in CATEGORY_PAGES:
			ret = page_settings_basic()
			ret["seocategoryid"] = CATEGORY_PAGES[args[0].lower()].seocategoryid
			ret.update ( SEORelease.do_search( ret ))
			newsroomid = request.headers.get("X-Custom-Forwarded-For", None)
			if newsroomid == "25": #Cardiff - english
				ret['nid'] = CARDIFF_ENGLISH
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.newsroom.cardiff.main_page")
			elif newsroomid == "66": #Cardiff - welsh
				ret['nid'] = CARDIFF_WELSH
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.newsroom.cardiff.main_page_welsh")
			else:
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.main" )

		if args and (args[0].lower() == 'searchcardiff' or args[0].lower() == 'searchwelsh'):
			ret = page_settings_basic()
			newsroomid = request.headers.get("X-Custom-Forwarded-For", None)
			if newsroomid == "25": #Cardiff - english
				ret['nid'] = CARDIFF_ENGLISH
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.newsroom.cardiff.main_page")
			elif newsroomid == "66": #Cardiff - welsh
				ret['nid'] = CARDIFF_WELSH
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.newsroom.cardiff.main_page_welsh")
			else:
				return view.render( ret, template = "prpublish.templates.main" )

		if args and (args[0].lower() == 'search_results_cardiff' or args[0].lower() == 'search_results_welsh'):
			ret = page_settings_basic()
			newsroomid = request.headers.get("X-Custom-Forwarded-For", None)
			if newsroomid == "25": #Cardiff - english
				ret['nid'] = CARDIFF_ENGLISH
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.newsroom.cardiff.main_page")
			elif clientid == "66": #Cardiff - welsh
				ret['nid'] = CARDIFF_WELSH
				ret.update ( SEORelease.do_search( ret ))
				return view.render( ret, template = "prpublish.templates.newsroom.cardiff.main_page_welsh")
			else:
				return view.render( ret, template = "prpublish.templates.main" )

		return ""

