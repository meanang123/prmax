# -*- coding: utf-8 -*-
"""ClippingsImport"""
#-----------------------------------------------------------------------------
# Name:        clippingsimport.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import session
from xml.dom import minidom
from types import ListType
from dateutil.parser import parse
from ttl.ttlmaths import to_int
from prcommon.model.researchext.outletexternallinks import OutletExternalLink
from prcommon.model.clippings.clippingsorder import ClippingsOrder
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.queues import ProcessQueue
import os
from cStringIO import StringIO
import codecs
import prcommon.Constants as Constants
import logging
import shutil
LOGGER = logging.getLogger("prcommon")

class ClipDbLoad(object):
	"ClippingDbLoad"
	FIELD_CLIPID = 'clip_id'
	FIELD_CLIPREF = 'ref'
	FIELD_SOURCEDATE = 'sourcedate'
	FIELD_OUTLETSOURCEID = 'outletsourceid'
	FIELD_OUTLETSOURCENAME = 'outletsourcename'
	FIELD_TITLE = 'title'
	FIELD_KEYWORDS = 'keywordmatch'
	FIELD_SOURCEPAGES = 'sourcepage'
	FIELD_ARTICALSIZE = 'articlesize'
	FIELD_WORDS = 'words'
	FIELD_CIRCULATION = 'circulation'
	FIELD_READERSHIP = 'readership'
	FIELD_DISRATE = 'disrate'
	FIELD_LINK = 'link'
	FIELD_ABSTRACT = 'abstract'
	FIELD_OCRTEXT = 'ocrtext'

	def __init__(self):
		"__init__"
		pass

	def load_save(self, fields):
		"""load save record"""
		# do all links

		# get outlet or add to translation table
		outletid = None
		record = session.query(OutletExternalLink).\
			filter(OutletExternalLink.linktypeid == Constants.Outlet_link_source_ipcb).\
			filter(OutletExternalLink.linktext == fields[ClipDbLoad.FIELD_OUTLETSOURCEID]).all()

		if not record:
			transaction = session.begin()
			try:
				session.add(OutletExternalLink(
				  linktypeid=Constants.Outlet_link_source_ipcb,
				  linktext=fields[ClipDbLoad.FIELD_OUTLETSOURCEID],
				  linkdescription=fields[ClipDbLoad.FIELD_OUTLETSOURCENAME]))
				session.flush()
				transaction.commit()
			except:
				try:
					transaction.rollback()
				except:
					pass
				LOGGER.exception("load_save_ouler")
				raise
		else:
			outletid = record[0].outletid

		#clippinsg order
		cliporder = session.query(ClippingsOrder).\
			filter(ClippingsOrder.supplierreference.ilike(fields[ClipDbLoad.FIELD_CLIPREF])).scalar()
		if not cliporder:
			LOGGER.error("Missing Order : %s", fields[ClipDbLoad.FIELD_CLIPREF])
			return False

		transaction = session.begin()

		try:
			clippings = session.query(Clipping).filter(Clipping.clip_source_id == fields[ClipDbLoad.FIELD_CLIPID]).\
			  filter(Clipping.clippingsourceid == Constants.Clipping_Source_IPCB).all()

			if not clippings:
				clipping = Clipping(
					customerid=cliporder.customerid,
					clippingsstatusid=Constants.Clipping_Status_Unallocated,
					outletid=outletid,
					clippingsorderid=cliporder.clippingsorderid,
					clientid=cliporder.defaultclientid,
					clip_source_id=fields[ClipDbLoad.FIELD_CLIPID],
					clip_client_ref=fields[ClipDbLoad.FIELD_CLIPREF],
					clip_source_date=fields[ClipDbLoad.FIELD_SOURCEDATE],
					clip_outlet_source_id=fields[ClipDbLoad.FIELD_OUTLETSOURCEID],
					clip_outlet_source_name=fields[ClipDbLoad.FIELD_OUTLETSOURCENAME],
					clip_title=fields[ClipDbLoad.FIELD_TITLE],
					clip_keywords=fields[ClipDbLoad.FIELD_KEYWORDS],
					clip_source_page=fields[ClipDbLoad.FIELD_SOURCEPAGES],
					clip_article_size=fields[ClipDbLoad.FIELD_ARTICALSIZE],
					clip_words=fields[ClipDbLoad.FIELD_WORDS],
					clip_circulation=fields[ClipDbLoad.FIELD_CIRCULATION],
					clip_readership=fields[ClipDbLoad.FIELD_READERSHIP],
					clip_disrate=fields[ClipDbLoad.FIELD_DISRATE],
					clip_link=fields[ClipDbLoad.FIELD_LINK],
					clip_abstract=fields[ClipDbLoad.FIELD_ABSTRACT],
					clip_text=fields[ClipDbLoad.FIELD_OCRTEXT],
					clippingsourceid=Constants.Clipping_Source_IPCB)
				session.add(clipping)
				session.flush()
				if cliporder.defaultissueid:
					session.add(ClippingsIssues(clippingid=clipping.clippingid,
						                          issueid=cliporder.defaultissueid))
				session.add(ProcessQueue(
				      processid=Constants.Process_Clipping_View,
				      objectid=clipping.clippingid))

			else:
				# update
				for clipping in clippings:
					clipping.clip_client_ref = fields[ClipDbLoad.FIELD_CLIPREF]
					clipping.clip_source_date = fields[ClipDbLoad.FIELD_SOURCEDATE]
					clipping.clip_title = fields[ClipDbLoad.FIELD_TITLE]
					clipping.clip_keywords = fields[ClipDbLoad.FIELD_KEYWORDS]
					clipping.clip_source_page = fields[ClipDbLoad.FIELD_SOURCEPAGES]
					clipping.clip_article_size = fields[ClipDbLoad.FIELD_ARTICALSIZE]
					clipping.clip_words = fields[ClipDbLoad.FIELD_WORDS]
					clipping.clip_circulation = fields[ClipDbLoad.FIELD_CIRCULATION]
					clipping.clip_readership = fields[ClipDbLoad.FIELD_READERSHIP]
					clipping.clip_disrate = fields[ClipDbLoad.FIELD_DISRATE]
					clipping.clip_link = fields[ClipDbLoad.FIELD_LINK]
					clipping.clip_abstract = fields[ClipDbLoad.FIELD_ABSTRACT]
					clipping.clip_text = fields[ClipDbLoad.FIELD_OCRTEXT]

					session.add(ProcessQueue(
					  processid=Constants.Process_Clipping_View,
					  objectid=clipping.clippingid))

			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("load_save")
			raise

		return True

class ClippingsIpcb(object):
	"ClippingsIpcb"

	FIELDS = (
        ('cl_id', 'text', 'id'),
	      ('clip_id', 'text', 'clip_id'),
        ('cl_ref', 'text', 'ref'),
        ('x_SourceDate', 'datetime', 'sourcedate'),
				('IDSource', 'text', 'outletsourceid'),
				('x_SourceName', 'text', 'outletsourcename'),
				('x_Title', 'text', 'title'),
				('wd_keywordMatch', 'text', 'keywordmatch'),
				('x_SourcePage', 'text', 'sourcepage'),
				('x_ArticleSize', 'int', 'articlesize'),
				('x_Words', 'int', 'words'),
				('x_Circulation', 'int', 'circulation'),
				('x_readership', 'int', 'readership'),
	      ('x_disrate', 'currency', 'disrate'),
				('Links', 'text', 'link'),
				('x_AutoAbstract', 'text', 'abstract'),
				('x_ocrtext', 'text', 'ocrtext'))

	#def __init__(self, filename, db):
	def __init__(self, filename=None, fileobj=None, db=None):
		"init"

		if fileobj:
			self._clips = minidom.parse(fileobj)
		else:   
			with codecs.open(filename, encoding="utf-8", errors='ignore') as infile:
				tmp = infile.read()
				tmpfile = StringIO(tmp.encode("utf-8"))
				self._clips = minidom.parse(tmpfile)
		self._db = db
		
		
	def _get_element_info(self, clip, nodename, as_type='text'):
		"""get the text for a specific node """
		r_text = []
		nodes = clip.getElementsByTagName(nodename)
		if not isinstance(nodes, ListType):
			nodes = [nodes, ]
		for node in nodes:
			if node.nodeType == node.ELEMENT_NODE:
				for lnode in node.childNodes:
					r_text.append(lnode.data)
			elif node.nodeType == node.TEXT_NODE:
				r_text.append(node.data)

		r_data = None
		if as_type == 'text':
			r_data = ''.join(r_text)
		elif as_type == 'int':
			r_data = int(''.join(r_text))
		elif as_type == 'datetime':
			r_data = parse(''.join(r_text))
		elif as_type == 'currency':
			r_data = to_int(float(''.join(r_text)))

		try:
			display = str(r_data.encode("utf-8"))
		except:
			display = str(r_data)

		#print "%.15s : %s" % (nodename, display)

		if r_data == None:
			raise Exception("Missing Type translation")

		return r_data


	def do_import(self):
		"""analyse and import clips"""

		for clip in self._clips.getElementsByTagName('vwXmlClient'):
			fields = {}
			for field in ClippingsIpcb.FIELDS:
				fields[field[2]] = self._get_element_info(clip, field[0], field[1])
			self._db.load_save(fields)

class ClippingsImport(object):
	""" ClippingsImport """

	@staticmethod
	def import_ipcb_file(filename, fileobj):
		"""Import a file"""

		db = ClipDbLoad()

		cliphandler = ClippingsIpcb(filename, fileobj, db)
		cliphandler.do_import()


	@staticmethod
	def import_ipcb_folder(source_dir):
		"""Import a diectory"""

		for filename in os.listdir(source_dir):
			fullpath = os.path.join(source_dir, filename)
			if os.path.isdir(fullpath) or filename.startswith('.'):
				continue

			db = ClipDbLoad()

			cliphandler = ClippingsIpcb(fullpath, None, db)
			cliphandler.do_import()

			shutil.move(fullpath, os.path.join(source_dir, "processed", filename))

