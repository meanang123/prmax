# -*- coding: utf-8 -*-
"""Virtual Newsroom"""
#-----------------------------------------------------------------------------
# Name: 		newsroom.py
# Purpose:	forward cache store access
#
# Author:   Chris Hoy
#
# Created:     26/04/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
import logging
import copy
from turbogears import view
from turbogears.database import session, config
from cherrypy import response
from prcommon.model.identity import Customer
from prcommon.model.newsroom.clientnewsroom import ClientNewsRoom
from prcommon.model.newsroom.clientnewsroomimage import ClientNewsRoomImage
from prcommon.model.newsroom.clientnewsroomcustumlinks import ClientNewsRoomCustumLinks
from prcommon.model.seopressreleases import SEOSite, SEORelease
from prcommon.model.collateral import Collateral
from prcommon.model import SEORelease, SEOSite, SEOCategories
import prcommon.Constants as Constants
from ttl.postgres import DBCompress
CARDIFF_ENGLISH = 25
CARDIFF_WELSH = 66
LOGGER = logging.getLogger("prcommon.model")

try:
	CATEGORY_PAGES = SEOCategories.get_page_map()
except:
	pass

class NewsRoom(object):
	"""actual news room"""

	_standard_pages_html = {
	  "about": "about",
	  "collateral": "collateral",
	  "contact": "contact",
	  "contacts_cardiff": "contacts_cardiff",
	  "contacts_welsh": "contacts_welsh",
	  "searchmodal_cardiff": "searchmodal_cardiff",
	  "searchmodal_welsh": "searchmodal_welsh",
	  None: "newsround"
	}

	_standard_pages_images = {"nr_logo_1.png": "",
	                          "nr_logo_2.png": "",}
	_standard_pages_rss = {
	    "rss.xml": "",
	    "rss_cardiff.xml": "",
	    "rss_welsh.xml": "",
	}

	_standard_pages_search_cardiff_welsh = {
		"searchcardiff": "searchcardiff",
		"searchwelsh": "searchwelsh",
	    "search_results_cardiff": "search_results_cardiff",
	    "search_results_welsh": "search_results_welsh",
	}

	def __init__(self, client, mode='client', page=None, params=None):
		""" setup news desk """

#		self._customer = customer
		self._client = client
		self._page = None if not page else page
		self._params = params
		self._mode=mode

		self._images = {}
		for row in session.query(ClientNewsRoomImage).\
		    filter_by(newsroomid=client[0].newsroomid).all():
			self._images[row.imagetypeid] = row

	def get_page(self, envir, params):
		"""return the requested page """
		data = ""
		data_type = "html"

		# handle the page to return html or collateral
		if self._page == None:
			lparams = self.get_env(envir)
			if self._client[1].clientid == -1 or self._client[1].clientid == 2014 or self._client[1].clientid == 1966:
				lparams.update(SEORelease.do_search(dict(nid=self._client[0].newsroomid,nr=True)))
			else:
				lparams.update(SEORelease.do_search(dict(cid=self._client[1].clientid,nr=True)))
			template = "prpublish.templates.newsroom.main_page"
			if self._client[0].newsroomid == CARDIFF_ENGLISH: #Cardiff - English
				template = "prpublish.templates.newsroom.cardiff.main_page"
			if self._client[0].newsroomid == CARDIFF_WELSH: #Cardiff - Welsh
				template = "prpublish.templates.newsroom.cardiff.main_page_welsh"

			data = view.render(
			  lparams,
			  template=template)
		elif self._page[0] in NewsRoom._standard_pages_html:
			lparams = self.get_env(envir)
			lparams.update(dict(client=self._client[1]))
			if self._page[0] == "collateral":
				if self._client[1].clientid != -1 and self._client[1].clientid != '-1' and self._client[1].clientid != None:
					lparams["clientcollateral"] = session.query(Collateral).filter_by(clientid=self._client[1].clientid).all()
				else:
					lparams['clientcollateral'] = session.query(Collateral).filter_by(newsroomid=self._client[0].newsroomid).all()
			base_template = "prpublish.templates.newsroom."
			if self._client[0].newsroomid == CARDIFF_ENGLISH or self._client[0].newsroomid == CARDIFF_WELSH: #Cardiff/Welsh
				base_template = "prpublish.templates.newsroom.cardiff."
			data = view.render(
			  lparams,
			  template=base_template + NewsRoom._standard_pages_html[self._page[0]])
		elif self._page[0] in NewsRoom._standard_pages_images:
			if self._page[0].startswith("nr_logo_"):
				key = int(self._page[0][self._page[0].rfind("_") + 1:].split(".")[0])
				if key in self._images:
					data = DBCompress.decode(self._images[key].image)
				else:
					data = ""
				response.headers["Content-Length"] = len(data)
				data_type = "png"
		elif self._page[0] in NewsRoom._standard_pages_rss:
			if self._client[0].newsroomid in (25, 66):
				data = SEOSite.get_rss_cardiff(self._client[0].newsroomid)
			else:
				data = SEOSite.get_rss(None,
			                       self._client[0].newsroomid,
			                       title=self._client[1].clientname + " News",
			                       description='Current News From '+ self._client[1].clientname)
			data_type = "xml"
		elif self._page[0] in NewsRoom._standard_pages_search_cardiff_welsh:
			lparams = self.get_env(envir)
			params['nid'] = self._client[0].newsroomid
			lparams.update(SEORelease.do_search(params))
			template = ""
			if self._client[0].newsroomid == CARDIFF_ENGLISH:
				template = "prpublish.templates.newsroom.cardiff.main_page"
			elif self._client[0].newsroomid == CARDIFF_WELSH:
				template = "prpublish.templates.newsroom.cardiff.main_page_welsh"
			data = view.render(
			  lparams,
			  template=template)
		elif self._page[0] in CATEGORY_PAGES:
			lparams = self.get_env(envir)
			params['nid'] = self._client[0].newsroomid
			params['seocategoryid'] = CATEGORY_PAGES[self._page[0].lower()].seocategoryid
			lparams.update(SEORelease.do_search(params))
			template = ""
			if self._client[0].newsroomid == CARDIFF_ENGLISH:
				template = "prpublish.templates.newsroom.cardiff.main_page"
			elif self._client[0].newsroomid == CARDIFF_WELSH:
				template = "prpublish.templates.newsroom.cardiff.main_page_welsh"
			data = view.render(
			  lparams,
			  template=template)

		return (data, data_type)

	def get_env(self, envir):
		"""get the environment"""

		prms = copy.copy(envir)
		prms['client'] = self._client[1]
		prms['clientnewsroom'] = self._client[0]
#		prms['customer'] = self._customer
		prms['newsroom'] = self

		return prms

	def _get_base_url(self):
		"""get the basic bit of the url"""

		if self._mode == 'client':
			retval = "/nr/e%d" % self._client[0].clientid
		else:
			retval = "/nr/g%d" % self._client[0].newsroomid
		return retval

#		return "/nr/%d/%s" % (self._client[1].customerid, self._client[0].news_room_root)

	def get_home_page(self):
		"""Get home page"""

		return self._get_base_url()

	def get_rss(self):
		""" get rss feed"""

		return "%s/rss.xml" % self._get_base_url()

	def get_about_page(self):
		""" about page"""

		return "%s/about" % self._get_base_url()

	def get_contact_details_page(self):
		""" ontact details page"""

		return "%s/contact" % self._get_base_url()

	def get_collateral_page(self):
		""" collateral page """

		return "%s/collateral" % self._get_base_url()

	def get_client_logo_link(self, imagetypeid):
		""" get client link for logo """

		return "%s/nr_logo_%d.png" % (self._get_base_url(), imagetypeid)

	def get_client_logo_link_width(self, imagetypeid):
		"""width"""

		if imagetypeid in self._images:
			return self._images[imagetypeid].width

		return Constants.Newsroom_image_width

	def get_client_logo_link_height(self, imagetypeid):
		"""width"""

		if imagetypeid in self._images:
			return self._images[imagetypeid].height

		return Constants.Newsroom_image_height

	def get_about_contents(self):
		""" get the """

		return self._client[0].about_template

	def get_client_background_colour(self):
		""" Get the background color """

		return self._client[0].header_colour

	def get_custom_links(self):
		""" return the list of custom links """

		return session.query(ClientNewsRoomCustumLinks).\
	       filter_by(newsroomid=self._client[0].newsroomid).all()

class VirtualNewsRoom(object):
	"""Virtual News root """

	_standard_pages = ("about.html",
	                   "collateral.html",
	                   "collateral"
	                   "contact.html",
	                   "rss")

	@classmethod
	def is_news_room_file(cls, address, params):
		"""Determine if the path is part of a valid news room"""
		if len(address) >= 1:
			# first is the customerid or customer root
#			customer = Customer.is_valid_newsroom(address[0])
#			if not customer:
#				return None
			mode = None
			if address[0][0] == 'e':
				mode = 'client'
			if address[0][0] == 'g':
				mode = 'global'
			client = ClientNewsRoom.is_valid_newsroow(address[0], mode)
			if not client:
				return None

			return NewsRoom(client, mode, address[1:], params)
#		return NewsRoom(customer, client, address[2:], params)
		return None

	@classmethod
	def get_newsroom_info(cls, newsroomid, mode):

		client = []
		if mode == 'client':
			if int(newsroomid) in (CARDIFF_ENGLISH, CARDIFF_WELSH): #cardiff
				cl = ClientNewsRoom.query.get(newsroomid)
			else:
				cl = session.query(ClientNewsRoom).filter(ClientNewsRoom.clientid==newsroomid).scalar()
		elif mode == 'global':
			cl = ClientNewsRoom.query.get(newsroomid)
		client.insert(0,cl)
		x = NewsRoom(client, mode)
		return x
