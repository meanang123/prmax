# -*- coding: utf-8 -*-
"""Indexers """
#-----------------------------------------------------------------------------
# Name:        indexer.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     03-02-2011
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from turbogears.database import metadata, mapper, session
from prcommon.model.common import BaseSql
from sqlalchemy import Table
from prcommon.lib.DBIndexer import StandardIndexer
from ttl.postgres import DBCompress
import prcommon.Constants as Constants
from types import  ListType

class SetIndex(BaseSql):
	""" index record
    """

class IndexerQueue(BaseSql):
	""" index queue record
	"""
	@classmethod
	def IndexFreelanceContact(cls, customerid, oldname, newname, employeeid):
		""" Freelance name changed need to to and delete on the old name
		followed by an an add on the new name"""
		indx = IndexerQueue (
			action = Constants.index_Delete,
			customerid = customerid,
			objecttype = Constants.freelance_employeeid,
			objectid = employeeid,
			data_string = StandardIndexer.standardise_string(oldname))
		session.add(indx)
		indx = IndexerQueue (
			action = Constants.index_Add,
			customerid = customerid,
			objecttype = Constants.freelance_employeeid,
			objectid = employeeid,
			data_string = StandardIndexer.standardise_string(newname))
		session.add(indx)

class StandardIndexerInternal(object):
	""" StandardIndexer """
	__CustomerName = "customerid"
	def __init__(self, index_fields, index_key, data, index_mode):
		"""Constructor"""
		self._customerid = -1
		self._index_key = index_key
		self._index_mode = index_mode
		self._index_fields = index_fields
		self._data = data
		self._customerid_field = StandardIndexerInternal.__CustomerName

	def std_indexer( self):
		""" Standard index function """

		for index in self._index_fields:
			self.do_index(index)


	def do_index(self, index):
		""" do the index operation """
		# now run index
		tmp_data = None

		for row in self._data:
			if hasattr(row, index[1]):
				tmp_data = getattr(row, index[1])
			if hasattr(row, self._index_key):
				objectid = getattr(row, self._index_key)

		if index[2]:
			tmp_data = index[2](tmp_data)

		if not tmp_data:
			return

		if type(tmp_data) != ListType:
			tmp_data = [str(tmp_data), ]


		for item_data in tmp_data:
			if not item_data:
				continue # no index for empty fields

			session.add ( IndexerQueue(
			  action = self._index_mode,
			  customerid =self._customerid,
			  objecttype = index[0],
			  objectid = objectid,
			  data = item_data)   )

	@staticmethod
	def standardise_string(source) :
		""" standardise the string """
		return source.lower()

	def run_indexer(self):
		""" run the index function """

		self.std_indexer()


# load tables
SetIndex.mapping = Table('setindex', metadata, autoload=True, schema="userdata")
IndexerQueue.mapping = Table('indexerqueue', metadata, autoload=True, schema="queues")

mapper(SetIndex, SetIndex.mapping)
mapper(IndexerQueue, IndexerQueue.mapping)