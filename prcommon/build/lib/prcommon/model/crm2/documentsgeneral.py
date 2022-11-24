# -*- coding: utf-8 -*-
"""documentsgeneral record"""
#-----------------------------------------------------------------------------
# Name:       documentsgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     17/09/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import session
from ttl.model import BaseSql
from ttl.postgres import DBCompress
from  datetime import datetime
from prcommon.model.crm2.documents import Documents
from prcommon.model.crm2.documentfiles import DocumentFiles
from prcommon.model.identity import User
import os
import logging
LOGGER = logging.getLogger("prcommon")

class DocumentsGeneral(object):
	""" documentsgeneral """

	@staticmethod
	def add(params):
		"Add a document to the system"

		fobj = params['document_file']
		data = fobj.file.read()


		transaction = BaseSql.sa_get_active_transaction()
		try:
			(root, ext) = os.path.splitext(fobj.filename.strip())
			# create control record
			document = Documents (
			  customerid = params['customerid'],
			  description = params['documentname'],
			  filename = fobj.filename.strip(),
			  ext = ext.strip().lower(),
			  createdbyid = params["userid"],
			  created = datetime.now(),
			  documentlength = len(data))
			session.add(document)
			session.flush()
			# create cache record
			documentd = DocumentFiles (
				documentid = document.documentid,
				customerid = params['customerid'],
				data = DBCompress.encode2( data ) )
			session.add(documentd)
			session.flush()
			transaction.commit()
			return document.documentid
		except:
			LOGGER.exception("Document_add")
			transaction.rollback()
			raise

	@staticmethod
	def update(params):
		"Update a document"

		transaction = BaseSql.sa_get_active_transaction()
		try:
			document = Documents.query.get(params["documentid"])
			document.description = params["description"]
			document.modified = datetime.now()
			document.modifiedbyid = params["userid"]
			transaction.commit()
		except:
			LOGGER.exception("Document_Update")
			transaction.rollback()
			raise

	@staticmethod
	def delete(documentid):
		"Delete a document"

		transaction = BaseSql.sa_get_active_transaction()
		try:
			document = Documents.query.get(documentid)
			session.delete(document)
			transaction.commit()
		except:
			LOGGER.exception("Document_Delete")
			transaction.rollback()
			raise

	@staticmethod
	def get(documentid):
		"""Get details"""

		document = Documents.query.get(documentid)
		if document.created:
			created_display = document.created.strftime("%d/%m/%y")
		else:
			created_display = ""

		if document.createdbyid:
			user = User.query.get(document.createdbyid)
			user_name = user.user_name
		else:
			user_name = ""

		return dict (
		  documentid = document.documentid,
		  description = document.description,
		  ext = document.ext,
		  created_display = created_display,
		  user_name = user_name
		)

	List_Data_View = """
	SELECT d.documentid, d.documentid AS id,
	d.description,
	d.ext,
	to_char(d.created,'DD-MM-YY') AS created_display,
	u.user_name
	FROM userdata.documents AS d
	LEFT OUTER JOIN tg_user AS u ON u.user_id = d.createdbyid """
	List_Data_Count = """SELECT COUNT(*) FROM userdata.documents AS d """

	@staticmethod
	def list_documents(params):
		"""return list of documents"""

		whereclause = BaseSql.addclause("", "d.customerid = :customerid")

		if "name" in params:
			whereclause = BaseSql.addclause(whereclause, "d.description ilike :description")
			params["description"] = params["description"].replace("*", "%")

		if "description" in params:
			whereclause = BaseSql.addclause(whereclause, "d.description ilike :description")
			params["description"] = params["description"].replace("*", "%")

		if "filter_description" in params:
			whereclause = BaseSql.addclause(whereclause, "d.description ilike :filter_description")
			params["filter_description"] = "%" + params["filter_description"] + "%"

		if params.get("sortfield","description"):
			params["sortfield"] = 'UPPER(description)'

		if params.get("sortfield","") == "created_display":
			params["sortfield"] = 'd.created'

		if "id" in params:
			whereclause = BaseSql.addclause(whereclause, "d.documentid = :documentid")
			params["documentid"] = int(params["id"])

		return BaseSql.getGridPage(
		  params,
		  'UPPER(description)',
		  'documentid',
		  DocumentsGeneral.List_Data_View + whereclause + BaseSql.Standard_View_Order,
		  DocumentsGeneral.List_Data_Count + whereclause,
		  Documents )

	@staticmethod
	def get_data(documentid):
		"""Gte Data """

		documentd = DocumentFiles.query.get( documentid )

		return DBCompress.decode ( documentd.data )

	@staticmethod
	def rest_combo( params):
		""" get via rest store"""

		single = True if "id" in params else False
		data = DocumentsGeneral.list_documents ( params )
		if not params.get("id", None) or \
		   params.get("id", "") == "-1" or  params.get("id", "") == -1:
			data["items"].insert(0, dict(id=-1, description = "No Selection"))
			if params.get("id", "") == "-1" or  params.get("id", "") == -1:
				single = True

		return BaseSql.grid_to_rest ( data,
		                          params['offset'],
		                          single )
