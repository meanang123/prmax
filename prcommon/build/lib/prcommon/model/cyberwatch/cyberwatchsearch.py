# -*- coding: utf-8 -*-
""" cyberwatch search ing"""
#-----------------------------------------------------------------------------
# Name:        cyberwatchsearch.py
# Purpose:	   To do a search on the cyberwatch system
#
# Author:      Chris Hoy
#
# Created:	   27/6/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
from turbogears.database import session
from types import StringTypes
import logging
from datetime import datetime, timedelta, date
from prcommon.model.cyberwatch.soapinterface import CSWSearchResult, CSWCommand
from prcommon.model.clippings.clippingsordertype import ClippingsOrderType
from prcommon.model.clippings.clippingstype import ClippingsType
from prcommon.model.clippings.clippingstore import ClippingStore
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.research import DataSourceTranslations
from prcommon.model.researchext.outletexternallinks import OutletExternalLink
import prcommon.Constants as Constants
from prcommon.model.queues import ProcessQueue
from prcommon.model.clippings.clippingsissues import ClippingsIssues
#import unidecode


LOGGER = logging.getLogger("prcommon.model")

CSW_METAELEMENTS = "MetaElements"
CSW_EXTRACTEDELEMENTS = "ExtractedElements"
CSW_ID = "Id"
CSW_ABSTRACT = "Abstract"
CSW_URL = "Url"
CSW_TITLE = "Title"
CSW_DATE = "Date"
CSW_DOCUMENTTEXT = "DocumentText"

CSW_SOURCE = "source"
CSW_TOPIC = "topic"
CSW_LANGUAGE = "language"
CSW_COUNTRY = "country"
CSW_CONTENTTYPE = "contenttype"
CSW_TOPICPATH = "topicpath"


class CyberWatchSearch(object):
	"CyberWatchSearch"

	@staticmethod
	def do_search(clippingorder):

		# get list of searchs

		results = CSWResultToClippings(clippingorder)
		# do each index
		
		cliptypes = [ row.clippingstypeid for row in session.query(ClippingsOrderType).\
				    filter(ClippingsOrderType.clippingsorderid == clippingorder.clippingsorderid).all()]		

		# parse command and create command
		for index in cliptypes:
			if index in (3, 4, 5, 6, 7):
				command = CSWCommand()
				command.search_all(start_date=datetime.now() - timedelta(days=50),
					               index=CSWCommand.Clippings_db_trans[index],
					               keywords=clippingorder.keywords,
					               field="text")
		
				command.do_search(results)

		# update the order with last accessed
		results.on_complete()

class CSWResultToClippings(CSWSearchResult):
	"""pass and add results to database
	check exists"""
	def __init__(self, clippingorder, no_print=False):
		self._clippingorder = clippingorder
		self._count = 0
		self._info = {}
		self._translations = {}
		self._translations_outlets = {}
		self._missing = {}
		self._missing_outlets = []
		self._metatags_fieldname = ['language', 'topic', 'country', 'topicpath', 'county', 'contenttype']
		self._load_translation()
		self._load_translation_outlets()
		CSWSearchResult.__init__(self)
		for field in self._metatags_fieldname:
			self._missing[field] = []


	def hand_result(self, doc, index):
		ENCODEING = (( u"\u2019", u"&rsquo;"),)
		
		for key in doc.__keylist__:
			
			cliptypeid = CSWCommand.Clippings_db_trans.keys()[list(CSWCommand.Clippings_db_trans.values()).index(index)]		

			if isinstance(doc[key], StringTypes):
				self._info[key] = doc[key].encode("utf-8") if doc[key] else ""
			#	self._info[key] = unidecode.unidecode(doc[key]) if doc[key] else ""
			else:
			#	if key == 'Title':
			#		self._info[key] = doc[key].encode("utf-8") if doc[key] else ""
			#	else:
				self._info[key] = doc[key] if doc[key] else ""


#			if key == 'Title'  and doc[key]:
#				a = doc[key].encode("utf-8")
#				self._info[key] = unidecode.unidecode(doc[key])
#			else:
#				self._info[key] = doc[key] if doc[key] else ""

#			if isinstance(doc[key], StringTypes):
#				self._info[key] = doc[key].encode("utf-8") if doc[key] else ""
#			else:
			#	if key == 'Title':
			#		self._info[key] = doc[key].encode("utf-8") if doc[key] else ""
			#	else:
#				self._info[key] = doc[key] if doc[key] else ""
		
			if index == CSWCommand.Index_Facebook or index == CSWCommand.Index_Twitter:
				if key == CSW_URL and doc[key]:
					self.setId(doc, key)
					
			if key == CSW_EXTRACTEDELEMENTS:
				documenttext = ''
				for value in doc[key].ExtractedElement:
					documenttext += (value.Value).encode("utf-8")
				self._info[CSW_DOCUMENTTEXT] = documenttext

			if key == CSW_METAELEMENTS and doc[key]:
				for (key2, values) in self.metatags(doc[key].MetaElement).items():
					tag_id = unicode(values[0][1])
					tag_name = values[0][0]
					if key2 == CSW_SOURCE:  
						self._info[CSW_SOURCE] = None
						if tag_id not in self._translations_outlets:
							name = tag_name[:tag_name.find('-')] if tag_name.find('-') != -1 else tag_name
							if (tag_id,name) not in self._missing_outlets:
								self._missing_outlets.append((tag_id,name))
						else:
							self._info[CSW_SOURCE] = self._translations_outlets[tag_id] if self._translations_outlets[tag_id] else None
							
					else:
						self._info[key2] = None
						if key2 in self._metatags_fieldname:
							if tag_id not in self._translations[key2]:
								if (tag_id,tag_name) not in self._missing[key2]:
									self._missing[key2].append((tag_id, tag_name))
							else:
								self._info[key2] = self._translations[key2][tag_id][1] if self._translations[key2][tag_id][1] else None
						

		store = session.query(ClippingStore).\
	        filter(ClippingStore.clippingsourceid == self._clippingorder.clippingsourceid). \
			filter(ClippingStore.clippingstypeid == cliptypeid).\
			filter(ClippingStore.source_id == str(self._info[CSW_ID])).first()

		session.begin()
		if not store:
			store = self.addStores(cliptypeid)
		clipping = self.addClipping(store)
				
		session.add(clipping)
		session.flush()

		session.add(ProcessQueue(
			processid=Constants.Process_Clipping_View,
			objectid=clipping.clippingid))		
			
		session.commit()


	def on_complete(self):
		self._update_translations_outlets()
		self._update_translations()
		
		
	def setId(self, doc, key):
		url = doc[key][:doc[key].find('?')] if doc[key].find('?') != -1 else doc[key]
		checkedId = url[url.rindex('/')+1:]
		if unicode(checkedId).isnumeric():
			self._info[CSW_ID] = checkedId
		else:
			self._info[CSW_ID] = url
		

	def addStores(self, cliptypeid):
		store = ClippingStore(
		    clippingsourceid = self._clippingorder.clippingsourceid,
		    clippingstypeid = cliptypeid,
		    url = self._info.get(CSW_URL, "").strip(),
		    abstract = self._info.get(CSW_ABSTRACT, "").strip(),
		    source_id = str(self._info[CSW_ID]),
		    title = self._info.get(CSW_TITLE, "").strip(),
		    documenttext = self._info.get(CSW_DOCUMENTTEXT, "").strip(),
		    published_date = self._info.get(CSW_DATE, None),
		    outletid = self._info.get(CSW_SOURCE, None) if CSW_SOURCE in self._info.keys() else None,
		    languageid = self._info.get("language", None) if 'language' in self._info.keys() else None,
		    countryid = self._info.get("country", None) if 'country' in self._info.keys() else None
		)
		session.add(store)
		session.flush()
		return store
		

	def addClipping(self, store):
		clipping = Clipping(
		    customerid = self._clippingorder.customerid,
		    outletid = store.outletid,
		    clientid = self._clippingorder.defaultclientid,
		    clippingstoreid = store.clippingstoreid,
		    clippingstypeid = store.clippingstypeid,
		    clippingsourceid = store.clippingsourceid,
		    clippingsstatusid = Constants.Clipping_Status_Unallocated,
		    clippingsorderid = self._clippingorder.clippingsorderid,
		    clip_source_id = store.source_id,
		    clip_text = store.documenttext,
		    clip_title = store.title,
		    clip_keywords = self._clippingorder.keywords,
		    clip_link = store.url,
		    clip_abstract = store.abstract,
		    clip_source_date = store.published_date
		)	
		
		return clipping

	def _load_translation_outlets(self):
		"""Load translation matrix"""

		for row in session.query(OutletExternalLink).\
		    filter(OutletExternalLink.linktypeid == Constants.Clipping_Source_Cyberwatch).all():
			self._translations_outlets[row.linktext.strip()] = row.outletid


	def _load_translation(self):
		"""Load translation matrix"""
		
		for field in self._metatags_fieldname:
			self._translations[field] = {}

		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Cyberwatch).all():
			self._translations[row.fieldname.strip()][row.english]  = (row.sourcetext, row.translation)

	def _update_translations(self):
		inserts = []
		if self._missing:
			for fieldname in self._missing:
				for i in range(len(self._missing[fieldname])):
					inserts.append({"fieldname": fieldname,
					            "sourcetext": self._missing[fieldname][i][1],
					            "english": self._missing[fieldname][i][0],
					            "sourcetypeid" : Constants.Source_Type_Cyberwatch}
					           )
		if inserts:
			session.begin()
			session.execute(DataSourceTranslations.mapping.insert(), inserts)
			session.commit()
		
	def _update_translations_outlets(self):
		inserts = []

		for i in range(len(self._missing_outlets)):
			inserts.append({"linktext": self._missing_outlets[i][0],
			                "linkdescription": self._missing_outlets[i][1],
			                "linktypeid" : Constants.Clipping_Source_Cyberwatch}
			               )
	
		if inserts:
			session.begin()
			session.execute(OutletExternalLink.mapping.insert(), inserts)
			session.commit()		


