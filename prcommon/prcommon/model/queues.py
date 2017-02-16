# -*- coding: utf-8 -*-
"""quete handling"""
#-----------------------------------------------------------------------------
# Name:        queues.py
# Purpose:	   Handles access to the some of the process queues
#
# Author:      Chris Hoy
#
# Created:     03-12-2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
import os, os.path
from ttl.ttlhtml import clean_up_html
from ttl.postgres import DBCompress
from cherrypy import request
from types import StringTypes

import logging
LOGGER = logging.getLogger("prmax.model")

class WordToHtml(BaseSql):
	""" word to html queues """
	@classmethod
	def add(cls, params):
		""" add an entry to the word queueu  """

		# collect data
		fobj = params['wordtohtml_file']
		data = fobj.file.read()

		#determine the browser thsi is because the html editor parses out some of the styles
		try:
			cleanuphtmltypeid = 1 if request.headerMap["User-Agent"].lower().find("msie") != -1 else 0
		except:
			cleanuphtmltypeid = 1 if request.headers["User-Agent"].lower().find("msie") != -1 else 0

		emailtemplateid = int(params["emailtemplateid"]) if params["emailtemplateid"] != "-1" else None
		transaction = cls.sa_get_active_transaction()
		try:
			word = WordToHtml(
			  indata=DBCompress.encode2(data),
			  orgfilename=os.path.split(fobj.filename.strip())[1],
			  customerid=params["customerid"],
			  userid=params["userid"],
			  emailtemplateid=emailtemplateid,
			  template="cgh",
			  cleanuphtmltypeid=cleanuphtmltypeid
			)
			session.add(word)
			session.flush()
			transaction.commit()
			return word.mswordqueueid
		except:
			LOGGER.exception("msword_html_queue_add")
			transaction.rollback()
			raise

	@classmethod
	def add_as_html(cls, params):
		""" add an entry to the word queueu  """

		# collect data
		fobj = params['wordtohtml_file']
		data = fobj.file.read()
		try:
			# covert to utf-8 if possible
			if isinstance(data, StringTypes):
				data = data.decode("utf-8")
		except:
			pass

		#determine the browser thsi is because the html editor parses out some of the styles
		try:
			cleanuphtmltypeid = 1 if request.headerMap["User-Agent"].lower().find("msie") != -1 else 0
		except:
			cleanuphtmltypeid = 1 if request.headers["User-Agent"].lower().find("msie") != -1 else 0

		emailtemplateid = int(params["emailtemplateid"]) if params["emailtemplateid"] != "-1" else None
		transaction = cls.sa_get_active_transaction()
		try:
			word = WordToHtml(
			  outdata=DBCompress.b64encode(WordToHtml.get_text_as_html(data)),
			  orgfilename=os.path.split(fobj.filename.strip())[1],
			  customerid=params["customerid"],
			  userid=params["userid"],
			  emailtemplateid=emailtemplateid,
			  template="cgh",
			  cleanuphtmltypeid=cleanuphtmltypeid,
			  statusid=2
			)
			session.add(word)
			session.flush()
			transaction.commit()
			return word.mswordqueueid
		except:
			LOGGER.exception("add_as_html")
			transaction.rollback()
			raise

	@classmethod
	def is_word_file(cls, fobj):
		""" Determines if a file is word """
		name = fobj.filename.strip().lower()
		name = name.strip(",").strip("'")
		if os.path.splitext(name)[1] in (".doc", ".docx"):
			return True
		else:
			return False

	@classmethod
	def status(cls, mswordqueueid):
		""" Check status of report """
		return session.query(WordToHtml.statusid).filter_by(mswordqueueid=mswordqueueid).first()[0]


	@classmethod
	def gethtml(cls, mswordqueueid):
		""" Check status of report """
		data = session.query(WordToHtml.outdata).filter_by(mswordqueueid=mswordqueueid).first()[0]
		if data:
			return DBCompress.b64decode(data)
		else:
			return ""

	@classmethod
	def get_text_as_html(cls, data):
		""" return html as html """
		#replace
		data = clean_up_html(data)
		data = data.replace(u"\"", u"'")
		data = data.replace(u"\n", u"")
		data = data.replace(u"\r", u"")
		data = data.replace(u"\t", u"")
		data = data.replace(u"{", u"")
		data = data.replace(u"}", u"")
		data = data.replace(u"  ", u" ")
		data = data.replace(u"  ", u" ")
		data = data.replace(u"  ", u" ")
		data = data.replace(u"  ", u" ")

		return data.encode('utf8')


class ProcessQueue(BaseSql):
	"""Offline Command """

	@staticmethod
	def add(processid, processqueuesettings):
		"add to queue for report system"

		if 'prstate' in processqueuesettings:
			processqueuesettings['prstate'] = None

		transaction = BaseSql.get_active_transaction()
		try:
			# addreport
			process = ProcessQueue(
			  processid=processid,
			  processqueuesettings=DBCompress.encode2(processqueuesettings))
			session.add(process)
			session.flush()
			transaction.commit()
			return process.processqueueid
		except:
			LOGGER.exception("ProcessQueue add")
			transaction.rollback()
			raise

	@staticmethod
	def status(processqueueid):
		""" Check status of report """
		return session.query(ProcessQueue.statusid).filter(ProcessQueue.processqueueid == processqueueid).first()[0]


################################################################################
## get definitions from the database
################################################################################

WordToHtml.mapping = Table('mswordqueue', metadata, autoload=True, schema="queues")
ProcessQueue.mapping = Table('processqueue', metadata, autoload=True, schema="queues")

mapper(WordToHtml, WordToHtml.mapping)
mapper(ProcessQueue, ProcessQueue.mapping)

