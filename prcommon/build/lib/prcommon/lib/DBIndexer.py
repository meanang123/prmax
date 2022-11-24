# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2011
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from sets import Set
from types import ListType

from ttl.dict import DictExt

import prcommon.Constants as Constants

class StandardIndexer(object):
	""" StandardIndexer """
	__CustomerName = "customerid"
	def __init__(self, SD, plpy, indexField, TD, indexFields,
				 search_index_rebuild_mode):
		"""Constructor"""
		self.SD = SD
		self.TD = TD
		self.plpy = plpy
		self.indexField = indexField
		self.customerid = -1
		self.indexKey = -1
		self.deleteIndex = "statusid"
		self.index_Fields = indexFields
		self.search_index_rebuild_mode = search_index_rebuild_mode
		self._customerid_field = StandardIndexer.__CustomerName
		self.stdIndexSql()


	def set_no_customer(self):
		self._customerid_field = None

	def _getCustomer(self, source):
		""" get the cistoemr """
		if self._customerid_field:
			if source[self._customerid_field] != None:
				self.customerid = source[self._customerid_field]

	def stdIndexer( self, source, op):
		""" Standard index function """
		self._getCustomer(source)
		self.indexKey = source[self.indexField]

		for index in self.index_Fields:
			self.doIndex(source, op, index)

	def checkDeleted(self, source):
		""" check for deleted"""
		if source.has_key(self.deleteIndex) and\
		   source[self.deleteIndex] == Constants.Record_Deleted:
			self.stdIndexer(source, Constants.index_Delete, self.indexField)
			self.doIndex(source, Constants.index_Add,
						 self.customerid,
						 self.indexFields[0],
						 self.indexKey)
			return True
		return False

	def updateIndex(self):
		""" update index"""
		new = self.TD['new']
		old = self.TD['old']
		self._getCustomer(new)
		self.indexKey = new[self.indexField]
		if self.checkDeleted(new) == False:
			# normal update
			for index in self.index_Fields:
				# field has changed
				if new[index[1]] != old[index[1]]:
					if old[index[1]] != None:
						self.doIndex(old, Constants.index_Delete, index)
					if new[index[1]] != None:
						self.doIndex(new, Constants.index_Add, index)

	def doIndex(self, source, op, index):
		""" do the index operation """
		if source[index[1]] == None:
			return # no index for null fields
		iData = str(source[index[1]])
		# check to see if we have a restriction on the index for the records
		# at this point
		if len(index) == 3 and index[3] != None and index[3](self.TD):
			return None

		# now run index
		if index[2]:
			iData = index[2](source[index[1]])
		if type(iData) != ListType:
			iData = [str(iData), ]
		for itemData in iData:
			if not len(itemData):
				continue # no index for empty fields
			self.plpy.execute(self.indexer_std_plan, [ op ,
													   self.customerid,
													   index[0],
													   self.indexKey,
													   itemData])

	def stdIndexSql(self):
		""" setup standard sql """
		if self.SD.has_key("prmax_contact_add_index"):
			plan = self.SD["prmax_contact_add_index"]
		else:
			plan = self.plpy.prepare("INSERT  INTO queues.indexerqueue(action,customerid,objecttype,objectid,data) VALUES($1,$2,$3,$4,$5)", [ "int", "int", "int", "int", "bytea"])
			self.SD["prmax_contact_add_index"] = plan

		self.indexer_std_plan = plan

	@staticmethod
	def restictoutletindex(TD):
		""" get outlet type """
		if TD.has_key("new"):
			outlettypeid = TD['new']['outlettypeid']
		elif TD.has_key("old"):
			outlettypeid = TD['old']['outlettypeid']
		else:
			outlettypeid = -1
		if outlettypeid == Constants.Outlet_Type_Freelance:
			return True
		else:
			return False

	@staticmethod
	def standardise_string(f):
		""" standardise the string """
		return f.lower()


	def RunIndexer(self):
		""" run the index function """
		# create index queue entries
		if self.TD["event"] == "INSERT":
			self.stdIndexer(self.TD['new'], Constants.index_Add)
		elif self.TD["event"] == "UPDATE":
			if self.search_index_rebuild_mode == 1:
				self.stdIndexer(self.TD['new'], Constants.index_Add)
			else:
				self.updateIndex()
		elif self.TD["event"] == "DELETE":
			self.stdIndexer(self.TD['old'], Constants.index_Delete,)

class IndexEntry(object):
	""" This is the base for all entries in the set index system"""
	def __init__(self):
		self.index = Set()
		self.tree = DictExt()
		self.list = []

	def __len__(self):
		return len(self.index)

def getEmployeeOutletFind(SD, plpy):
	""" setup empoyee find sql"""
	if SD.has_key("prmax_employee_outletid_find"):
		plan_outlet = SD["prmax_employee_outletid_find"]
	else:
		plan_outlet = plpy.prepare("SELECT e.outletid,o.outlettypeid,o.prmax_outlettypeid FROM employees as e JOIN outlets as o ON e.outletid=o.outletid WHERE e.employeeid = $1", [ "int"])
		SD["prmax_employee_outletid_find"] = plan_outlet
	return plan_outlet

def getOutletFind(SD, plpy):
	"""setup outlet find sql """
	if SD.has_key("prmax_outlet_type_find"):
		plan_1 = SD["prmax_outlet_type_find"]
	else:
		plan_1 = plpy.prepare("SELECT outlettypeid,statusid,prmax_outlettypeid,countryid FROM outlets WHERE outletid = $1 LIMIT 1", [ "int"])
	return plan_1



