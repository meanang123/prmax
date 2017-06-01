# -*- coding: utf-8 -*-
""" madaptive search and import"""
#-----------------------------------------------------------------------------
# Name:        madaptiveSearch.py
# Purpose:		 To do a search on the madaptive system
#
# Author:      Chris Hoy
#
# Created:	   27/6/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
import logging
from datetime import datetime
from urlparse import urlparse
from turbogears.database import session
from prcommon.model.madaptive.madaptiveaccess import MadaptiveAccess
from prcommon.model.clippings.clippingstore import ClippingStore
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.common import BaseSql
import prcommon.Constants as Constants
from prcommon.model.queues import ProcessQueue
from prcommon.model.research import DataSourceTranslations
from prcommon.model.researchext.outletexternallinks import OutletExternalLink

LOGGER = logging.getLogger("prcommon.model")

MA_Index_News = "editorial"
MA_Index_Facebook = "facebook"
MA_Index_Twitter = "twitter"
MA_Index_Blog = "blog"
MA_Index_Forum = "forum"
MA_Index_GooglePlus = "googleplus"
MA_Index_Youtube = "youtube"
MA_Index_Tumblr = "tumblr"
MA_Index_Instagram = "instagram"
MA_Index_VKontakte = "vkontakte"
MA_Index_Chat = "chat"
MA_Index_Reddit = "reddit"

class MadaptiveSearch(object):
	"MadaptiveSearch"

	def __init__(self, clippingorder):
		self._clippingorder = clippingorder
		self._translations = {}
		self._translations_outlets = {}
		self._missing = {}
		self._missing_outlets = {}
		self.clippingstype_db_trans = {3:MA_Index_News,
					    4:MA_Index_Twitter,
					    5:MA_Index_Facebook,
					    6:MA_Index_Forum,
					    7:MA_Index_Blog,
					    8:MA_Index_Instagram,
					    9:MA_Index_Youtube,
					    10:MA_Index_GooglePlus,
					    11:MA_Index_Tumblr,
					    12:MA_Index_VKontakte,
		          13:MA_Index_Chat,
		          14:MA_Index_Reddit,
				        }
		self.translation_fields = ['language', 'tone']
		self._load_translation()
		self._load_translation_outlets()
		for field in self.translation_fields:
			self._missing[field] = []


	def do_search(self):

		#self._clippingorder.rss_feed = "http://new.m-adaptive.com/rss?feed_id=245&sig=1db0d1387c95816cb84733e1df53f7a9e414786d7bdfc1c9f4624671&t=1467802443"

		search = MadaptiveAccess()

		results = search.execute_search(self._clippingorder.rss_feed)
		if 'entries'not in results or results['entries'] is None:
			return


		transaction = session.begin()
		self._clippingorder.last_completed = datetime.now()

		try:
			for clip in results['entries']:

				cliptypeid = self.clippingstype_db_trans.keys()[list(self.clippingstype_db_trans.values()).index(clip['category']['category'])]
				for key in clip.keys():
					if key == 'category' and clip[key]['category'] == MA_Index_News:
						url = clip.get("href", "")
						if url:
							tmp = urlparse(url)
							url = "%s://%s" % (tmp.scheme, tmp.hostname)
						outletname = clip.get("authorName", "") if "authorName" in clip.keys() else ""
						if outletname != "" and outletname.strip().lower() not in self._translations_outlets and outletname.strip().lower() not in self._missing_outlets:
							self._missing_outlets[outletname.strip().lower()] = (outletname.strip(), url)
						if outletname in self._translations_outlets:
							clip['outletid'] = self._translations_outlets[outletname]

					if key in self.translation_fields:
						if clip[key] and clip[key] not in self._translations[key] and clip[key] not in self._missing[key]:
							self._missing[key].append(clip[key])
						if clip[key] in self._translations[key]:
							clip[key] = self._translations[key][clip[key]][1]
						else:
							clip[key] = None

				store = session.query(ClippingStore).\
			        filter(ClippingStore.clippingsourceid == self._clippingorder.clippingsourceid). \
				    filter(ClippingStore.clippingstypeid == cliptypeid).\
			        filter(ClippingStore.source_id == clip['id']).first()

				if not store:
					store = self.add_stores(clip, cliptypeid)
				else:
					# quick fix to allow for no long on clipstorr record
					store.clippingstoneid=clip.get("tone", None) if "tone" in clip.keys() else None

				clipping = session.query(Clipping).\
			        filter(Clipping.clippingstoreid == store.clippingstoreid).\
				    filter(Clipping.clippingsorderid == self._clippingorder.clippingsorderid).first()

				if not clipping:
					clipping = self.add_clipping(store)
					session.add(clipping)
					session.flush()
					# missing default issue
					if self._clippingorder.defaultissueid:
						clipissue = ClippingsIssues(clippingid=clipping.clippingid,
						                            issueid=self._clippingorder.defaultissueid)
						session.add(clipissue)

					session.add(ProcessQueue(
						processid=Constants.Process_Clipping_View,
						objectid=clipping.clippingid))

			transaction.commit()
			self._update_translations_outlets()
			self._update_translations()
		except:
			transaction.rollback()
			LOGGER.exception("MadaptiveSearch-do_search")


	def add_stores(self, clip, cliptypeid):
		store = ClippingStore(
	        clippingsourceid=self._clippingorder.clippingsourceid,
	        clippingstypeid=cliptypeid,
	        url=clip.get("href", "").strip(),
	        abstract=clip.get("context", "").strip(),
	        source_id=str(clip.get("id", "")).strip(),
	        title=clip.get("tite", "").strip(),
	        documenttext=clip.get("context", "").strip(),
	        published_date=clip.get("published", None),
		    outletid=clip.get("outletid", None) if "outletid" in clip.keys() else None,
		    languageid=clip.get("language", None) if "language" in clip.keys() else None,
		    clippingstoneid=clip.get("tone", None) if "tone" in clip.keys() else None,
		    authorname=clip.get("authorName", None) if "authorName" in clip.keys() else None
	    )
		session.add(store)
		session.flush()
		return store


	def add_clipping(self, store):
		clipping = Clipping(
	        customerid=self._clippingorder.customerid,
	        outletid=store.outletid,
	        clientid=self._clippingorder.defaultclientid,
	        clippingstoreid=store.clippingstoreid,
	        clippingstypeid=store.clippingstypeid,
	        clippingsourceid=store.clippingsourceid,
	        clippingsstatusid=Constants.Clipping_Status_Unallocated,
	        clippingsorderid=self._clippingorder.clippingsorderid,
	        clip_source_id=store.source_id,
	        clip_text=store.documenttext,
	        clip_title=store.title,
	        clip_keywords=self._clippingorder.keywords,
	        clip_link=store.url,
	        clip_abstract=store.abstract,
	        clip_source_date=store.published_date,
		    clippingstoneid=store.clippingstoneid,
		    authorname=store.authorname
	    )

		return clipping

	def _load_translation_outlets(self):
		"""Load translation matrix"""

		for row in session.query(OutletExternalLink).\
		    filter(OutletExternalLink.linktypeid == Constants.Clipping_Source_Madaptive).all():
			self._translations_outlets[row.linktext.strip().lower()] = row.outletid

	def _update_translations_outlets(self):
		inserts = []

		outlets_to_add = self._missing_outlets.values()
		for i in range(len(outlets_to_add)):
			inserts.append({"linktext": outlets_to_add[i][0],
			                "linkdescription": outlets_to_add[i][0],
			                'url': outlets_to_add[i][1],
			                "linktypeid" : Constants.Clipping_Source_Madaptive,
			                'ignore': False,}
			               )

		if inserts:
			session.begin()
			session.execute(OutletExternalLink.mapping.insert(), inserts)
			session.commit()

	def _load_translation(self):
		"""Load translation matrix"""

		for field in self.translation_fields:
			self._translations[field] = {}

		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Madaptive).all():
			self._translations[row.fieldname.strip()][row.english] = (row.sourcetext, row.translation)

	def _update_translations(self):
		inserts = []
		if self._missing:
			for fieldname in self._missing:
				for i in range(len(self._missing[fieldname])):
					inserts.append({"fieldname": fieldname,
					                "sourcetext": self._missing[fieldname][i],
					                "english": self._missing[fieldname][i],
					                "sourcetypeid" : Constants.Source_Type_Madaptive}
					               )
		if inserts:
			session.begin()
			session.execute(DataSourceTranslations.mapping.insert(), inserts)
			session.commit()
