# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     17/10/2018
#
# Author:       --<>
#
# Created:
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import prmax.utilities3.common.constants as Constants
from prmax.utilities3.common.dbhelper import DBCompress

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
		if self.deleteIndex in source and\
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
		iData = source[index[1]]
		# check to see if we have a restriction on the index for the records
		# at this point
		if len(index) == 3 and index[3] != None and index[3](self.TD):
			return None

		# now run index
		if index[2]:
			iData = index[2](source[index[1]])
		if type(iData) != list:
			iData = [iData, ]
		for itemData in iData:
			if itemData is None or (type(itemData) == str and not len(itemData)):
				continue # no index for empty fields
			if itemData != str:
				itemData = str(itemData)
			self.plpy.execute(self.indexer_std_plan, [ op ,
													   self.customerid,
													   index[0],
													   self.indexKey,
													   bytes(itemData,"utf8")])

	def stdIndexSql(self):
		""" setup standard sql """
		if "prmax_contact_add_index" in self.SD:
			plan = self.SD["prmax_contact_add_index"]
		else:
			plan = self.plpy.prepare("INSERT  INTO queues.indexerqueue(action,customerid,objecttype,objectid,data) VALUES($1,$2,$3,$4,$5)", [ "int", "int", "int", "int", "bytea"])
			self.SD["prmax_contact_add_index"] = plan

		self.indexer_std_plan = plan

	@staticmethod
	def restictoutletindex(TD):
		""" get outlet type """
		if "new" in TD:
			outlettypeid = TD['new']['outlettypeid']
		elif "old" in TD:
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


	def runindexer(self):
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
		self.index = set()
		self.tree = {}
		self.list = []

	def __len__(self):
		return len(self.index)

def getEmployeeOutletFind(SD, plpy):
	""" setup empoyee find sql"""
	if "prmax_employee_outletid_find" in SD:
		plan_outlet = SD["prmax_employee_outletid_find"]
	else:
		plan_outlet = plpy.prepare("SELECT e.outletid,o.outlettypeid,o.prmax_outlettypeid FROM employees as e JOIN outlets as o ON e.outletid=o.outletid WHERE e.employeeid = $1", [ "int"])
		SD["prmax_employee_outletid_find"] = plan_outlet
	return plan_outlet

def getOutletFind(SD, plpy):
	"""setup outlet find sql """
	if "prmax_outlet_type_find" in SD:
		plan_1 = SD["prmax_outlet_type_find"]
	else:
		plan_1 = plpy.prepare("SELECT outlettypeid,statusid,prmax_outlettypeid,countryid FROM outlets WHERE outletid = $1 LIMIT 1", [ "int"])
	return plan_1




