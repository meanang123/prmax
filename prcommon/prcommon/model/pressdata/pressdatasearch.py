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
import logging, os, codecs, shutil
from xml.sax import make_parser

from datetime import datetime
from urlparse import urlparse
from turbogears.database import session
from prcommon.model.pressdata.pressdataaccess import PressDataAccess
from prcommon.model.clippings.clippingstore import ClippingStore
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.clippings.clippingsorder import ClippingsOrder
from prcommon.model.clippings.clippingstype import ClippingsType
from prcommon.model.clippings.clippingsordercountry import ClippingsOrderCountry
from prcommon.model.clippings.clippingsorderlanguage import ClippingsOrderLanguage

from prcommon.model import Countries, Languages

from prcommon.model.common import BaseSql
import prcommon.Constants as Constants
from prcommon.model.queues import ProcessQueue
from prcommon.model.research import DataSourceTranslations
from prcommon.model.researchext.outletexternallinks import OutletExternalLink
from prcommon.model.datafeeds.xmlbase import XMLBaseImport, BaseContent
from cStringIO import StringIO
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")
CLIPPINGSTONE_NEUTRAL = 3
class PressDataImport(object):
	"MadaptiveSearch"

	def __init__(self, customerpath, clippingorder, startpath, customerdirname):
		self._customerpath = customerpath
		self._startpath = startpath
		self._clippingorder = clippingorder
		self._customerdirname = customerdirname

		self._translations_outlets = {}
		self._missing_outlets = {}
		
		self._load_translation_outlets()
		

	def do_process(self):
		"""process file"""

		_db_interface = PressDataDbImport()
		cliptypeid = 3 #news
		
		files = os.listdir(self._customerpath)
		for filename in files:
			fullcustomerpath = os.path.join(self._customerpath, filename)
			if os.path.isdir(fullcustomerpath) or filename.startswith('.') or not filename.endswith('xml'):
				continue

			print "Processing File", filename
			importer = PressDataImportFile(fullcustomerpath, _db_interface)
			results = importer.do_phase()
			
			transaction = session.begin()
			try:
			
				if 'id'not in results or results['id'] is None:
					return
					
				store = session.query(ClippingStore).\
					filter(ClippingStore.clippingsourceid == self._clippingorder.clippingsourceid). \
					filter(ClippingStore.clippingstypeid == cliptypeid ).\
					filter(ClippingStore.source_id == results['id']).first()
				if not store:
					store = self.add_stores(results, cliptypeid)

				clipping = session.query(Clipping).\
			        filter(Clipping.clippingstoreid == store.clippingstoreid).\
			        filter(Clipping.clippingsorderid == self._clippingorder.clippingsorderid).first()
				if not clipping:
					clipping = self.add_clipping(store,results)
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
				if not os.path.exists(os.path.join(self._startpath, 'processed', self._customerdirname)):
					os.makedirs(os.path.join(self._startpath, 'processed', self._customerdirname))
				shutil.move(fullcustomerpath,  os.path.join(self._startpath, 'processed', self._customerdirname))					
			except:
				transaction.rollback()
				LOGGER.exception("Import PressData Clippings")		

		self._update_translations_outlets()
			
	def add_stores(self, clip, cliptypeid):
		
		
		outletname = clip["publication"] if "publication" in clip else ""
		if outletname != "" and outletname.strip().lower() not in self._translations_outlets and outletname.strip().lower() not in self._missing_outlets:
			self._missing_outlets[outletname.strip().lower()] = (outletname.strip(), clip["httplink"])
		outletname = outletname.strip().lower()
		if outletname in self._translations_outlets:
			clip['outletid'] = self._translations_outlets[outletname]
		
		store = ClippingStore(
		    clippingsourceid=self._clippingorder.clippingsourceid,
		    clippingstypeid=cliptypeid,
		    url=clip["httplink"].strip() if 'httplink' in clip else "",
		    source_id=str(clip["id"]).strip() if 'id' in clip else "",
		    title=clip["headline"].strip() if 'headline' in clip else "",
		    documenttext=clip["body"].strip() if 'body' in clip else "",
		    abstract=clip["abstract"].strip() if 'abstract' in clip else documenttext,
		    published_date=clip["newsdate"] if 'newsdate' in clip else None,
		    outletid=clip["outletid"] if "outletid" in clip else None
		)
		session.add(store)
		session.flush()
		return store


	def add_clipping(self, store, clip):
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
		    clippingstoneid=CLIPPINGSTONE_NEUTRAL,
		    authorname=store.authorname,
		    clip_article_size=clip['size'] if 'size' in clip and clip['size'].strip() != '' else None,
		    clip_source_page=str(clip['articlename']) if 'articlename' in clip else None,
		    clip_words=clip['wordcount'] if 'wordcount' in clip and clip['wordcount'].strip() != '' else None,
		    clip_circulation=clip['circulation'] if 'circulation' in clip and clip['circulation'].strip() != '' else None
		)

		return clipping

	def _load_translation_outlets(self):
		"""Load translation matrix"""

		for row in session.query(OutletExternalLink).\
		    filter(OutletExternalLink.linktypeid == Constants.Clipping_Source_PressData).all():
			self._translations_outlets[row.linktext.strip().lower()] = row.outletid
			
	def _update_translations_outlets(self):
		inserts = []

		outlets_to_add = self._missing_outlets.values()
		for i in range(len(outlets_to_add)):
			inserts.append({"linktext": outlets_to_add[i][0],
			                "linkdescription": outlets_to_add[i][0],
			                'url': outlets_to_add[i][1],
			                "linktypeid" : Constants.Clipping_Source_PressData,
			                'ignore': False,}
			               )

		if inserts:
			session.begin()
			session.execute(OutletExternalLink.mapping.insert(), inserts)
			session.commit()			
			
class PressDataDbImport(object):
	"StammDbImport"
	def __init__(self):
		"""__init__"""
		pass

	def test(self):
		pass



class PressDataImportFile(XMLBaseImport):
	"""Basic framework for importing 3rdpart data from waymaker xml"""
	def __init__(self, filename, _db_interface):
		"init"
		XMLBaseImport.__init__(self, filename)

		self._parse_handler = PressDataXmlProcesser(_db_interface)

	def _parse_xml(self, parse_handler):
		"""Start the parse"""

		parser = make_parser()

		parser.setContentHandler(parse_handler)
		with codecs.open(self._sourcefile, encoding="utf-8", errors='ignore') as infile:
			tmp = infile.read().replace(u'<!DOCTYPE update-file SYSTEM "wayXML.dtd">', u"")
			tmp = tmp.replace(u"\x95 ", u"").replace(u"\x1f", u"").replace(u"\x1c", u"").replace(u'\x01', u'').replace(u'\x1d', u'')
			parser.parse(StringIO(tmp.encode("utf-8")))

	def do_phase(self):
		"""Do all the verifications"""

		self._parse_xml(self._parse_handler)
		return self._parse_handler._results
		
				
class PressDataXmlProcesser(BaseContent):
	"pre load check"
	def __init__(self, _db_interface=None):
		"""prephase"""

		BaseContent.__init__(self, _db_interface)
		self._results = {}
		

	def startDocument(self):
		pass

	def endDocument(self):
		return self._results

	def endElement(self, name):

		self._results[name.lower()] = self._data
		self._data = ""

	def startElement(self, name, attrs):
		pass

	def characters(self, charac):
		self._data = self._data + charac
	