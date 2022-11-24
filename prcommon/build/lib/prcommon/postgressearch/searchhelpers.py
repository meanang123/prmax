# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from types import StringType, ListType
import prcommon.Constants as Constants
from prcommon.lib.DBIndexer import IndexEntry
from prcommon.postgressearch.postgres import PostGresControl
from ttl.plpython import DBCompress, CustomType

CIRCULATIONRANGE = (
	(1, '1-500', 1, 500),
	(2, '501-2500', 501, 2500),
	(3, '2501-10k', 2501, 10000),
	(4, '10001-50k', 10001, 50000),
	(5, '50001-100k', 50001, 100000),
	(6, '100001+', 100001, 4294967295),
	(0, '', 0, 0))

def encodeCirculation(circulation):
	" Encode the cirucation into a search type"
	for row in CIRCULATIONRANGE:
		if circulation >= row[2] and circulation <= row[3]:
			return r[0]
	return 0

class PostGresSearch(object):
	""" search database """
	def __init__(self, customerid):
		""" init """
		self.customerid = customerid
		self.rows = []

class PostGresSearchGroup(object):
	""" searchy level """
	def __init__(self, keytypeid, word, logic, partial, grouplogic):
		self.keytypeid = keytypeid
		self.word = word
		self.logic = logic
		self.partial = partial
		self.grouplogic = grouplogic
		self._type = Constants.Search_Data_Outlet

	def _typeget(self):
		""" get level type"""
		return self._type

	def _typeset(self, value):
		"""sets"""
		self._type = value

	type = property(fget=_typeget, fset=_typeset)

class SearchIndex(object):
	""" search index controller """
	def doLevelGroup(self, indexs, logic):
		""" search level"""
		result = None
		for row in indexs:
			rowData = self.addPrivateIndex(row)
			if result == None:
				result = rowData
				continue
			if logic == Constants.Search_And:
				result.index.intersection_update(rowData.index)
				if len(result) == 0:
					break
			elif logic == Constants.Search_Or:
				result.index.union_update(rowData.index)
			else:
				raise Exception("Unknow Logic Type %d"%logic)
		return result

	def addPrivateIndex(self, indexs):
		""" add the customer specific data """
		result = indexs[0]
		if result == None:
			result = IndexEntry()
		if indexs[1] != None:
			result.index.union_update(indexs[1].index)
		return result

def doIndexGroup(SD, plpy, extended, logic, indexs, customerid):
	""" do a search on a level """
	if SD.has_key("prmax_index_get"):
		plan_std = SD["prmax_index_get"]
		plan_private_std = SD["prmax_index_get_private"]
	else:
		plan_std = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname=$3 AND prmaxdatasetid IN ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = $4)", ["int", "int", "text", "int"])
		SD["prmax_index_get"] = plan_std
		plan_private_std = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname=$3", ["int", "int", "text", "int"])
		SD["prmax_index_get_private"] = plan_private_std

	if SD.has_key("prmax_index_get_extended"):
		plan_std_ext = SD["prmax_index_get_extended"]
		plan_std_ext_private = SD["prmax_index_get_extended_private"]
	else:
		plan_std_ext = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname like $3 AND prmaxdatasetid IN ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = $4)", ["int", "int", "text", "int"])
		SD["prmax_index_get_extended"] = plan_std_ext
		plan_std_ext_private = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname like $3", ["int", "int", "text", "int"])
		SD["prmax_index_get_extended_private"] = plan_std_ext_private

	if extended:
		plan = plan_std_ext
		private_plan = plan_std_ext_private
	else:
		plan = plan_std
		private_plan = plan_private_std

	#control system
	controlSettings = PostGresControl(plpy)
	controlSettings.doDebug("doIndexGroup")
	controlSettings.doDebug(SD)
	controlSettings.doDebug(plpy)
	controlSettings.doDebug(extended)
	controlSettings.doDebug(logic)
	controlSettings.doDebug(indexs)
	controlSettings.doDebug(customerid)

	def _formatword(word):
		""" format word"""

		if extended:
			return str(word) + "%"
		else:
			return str(word)

	def _convert(row):
		""" convert"""
		rowPublic = plpy.execute(plan, [-1, row[1], _formatword(row[0]), customerid])
		rowPrivate = plpy.execute(private_plan, [customerid, row[1], _formatword(row[0]), customerid])
		dprivate = dpublic = None

		controlSettings.doDebug("Row =" + str(row))

		controlSettings.doDebug("Prob =" + str(extended))

		dprivate = None
		dpublic = None
		# we need or all these together to generate a songle private public pair
		for row in rowPrivate:
			if dprivate == None:
				dprivate = DBCompress.decode(row['data'])
			else:
				t = DBCompress.decode(row['data'])
				dprivate.index.union_update(t.index)
		for row in rowPublic:
			if dpublic == None:
				dpublic = DBCompress.decode(row['data'])
			else:
				t = DBCompress.decode(row['data'])
				dpublic.index.union_update(t.index)

		return (dprivate, dpublic)

	final = []
	if type(indexs) == ListType:
		for row in [_convert(CustomType.fromStringToList(row)) for row in indexs]:
			final.append(row)
	else:
		for row in [_convert(row) for row in CustomType.fromStringArray(indexs)]:
			final.append(row)

	controlSettings.doDebug(final)
	controlSettings.doDebug(logic)

	if len(final):
		iEngine = SearchIndex()
		return iEngine.doLevelGroup(final, logic)
	else:
		return IndexEntry()

def doQuickSearch(SD, plpy, customerid, data, includetree, logic):
	""" qicj search """
	if SD.has_key("prmax_result_plan_outlet"):
		plan = SD['search_quick_interest_plan']
		plan_outlet = SD['prmax_result_plan_outlet']
		plan_employee = SD['prmax_result_plan_employee']
	else:
		# outlet_interest,employee_employeeid_interestid,freelance_employeeid_interestid,mp_employeeid_interestid
		# 6, 7 ,14 , 18
		plan = plpy.prepare("""SELECT keytypeid,datatypeid,data FROM userdata.setindex
		WHERE keytypeid in ( 6, 7 ,14 , 18 ) and keyname = $2
		AND (
			(customerid = -1 AND prmaxdatasetid IN (SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = $3)) OR
		  (customerid = $1 AND prmaxdatasetid IS NULL))
		  """, ["int", "text", "int"])
		plan_outlet = plpy.prepare("""SELECT * FROM OutletToPrimaryEmployee($1)""", ["text"])
		plan_employee = plpy.prepare("""SELECT * FROM EmployeeAddOutletTree($1)""", ["text"])
		SD['prmax_result_plan_outlet'] = plan_outlet
		SD['prmax_result_plan_employee'] = plan_employee
		SD['search_quick_interest_plan'] = plan

	index = None
	for interest  in data.split(","):
		level = None
		for row in plpy.execute(plan, [customerid, interest, customerid]):
			if row['datatypeid'] == Constants.Search_Data_Outlet:
				rowData = DBCompress.decode(plpy.execute(plan_outlet, [row['data']])[0]['outlettoprimaryemployee'])
			else:
				rowData = DBCompress.decode(plpy.execute(plan_employee, [row['data']])[0]['employeeaddoutlettree'])
			if level == None:
				level = rowData
			else:
				level.index.union_update(rowData.index)
				if includetree:
					for (key, value) in rowData.tree.iteritems():
						level.tree[key] = value
		if index == None:
			index = level
		else:
			if level == None:
				level = index
			else:
				if logic == Constants.Search_Or:
					index.index.union_update(level.index)
					if includetree:
						for (key, value) in level.tree.iteritems():
							index.tree[key] = value
				else:
					index.index.intersection_update(level.index)
					if includetree:
						for (key, value) in level.tree.iteritems():
							index.tree[key] = value

	return index

def doEmployeeEmail(SD, plpy, customerid, data, byemployeeid):
	""" do employee email """
	if SD.has_key("search_employee_email_plan"):
		plan = SD['search_employee_email_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN communications as c ON c.communicationid = e.communicationid
		JOIN outlets as o on e.outletid = o.outletid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
			o.outlettypeid NOT IN ( 19, 41 ) AND
			(
		  (e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1) AND
		      get_override(ecc.email, c.email ) ILIKE $2""", ["int", "text"])
		SD['search_employee_email_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doEmployeeTel(SD, plpy, customerid, data, byemployeeid):
	"doEmployeeTel"
	if SD.has_key("search_employee_tel_plan"):
		plan = SD['search_employee_tel_plan']
	else:
		plan = plpy.prepare("""select e.employeeid,e.outletid
		from employees as e
		join communications as c ON c.communicationid = e.communicationid
		join outlets as o on e.outletid = o.outletid
		left outer join employeecustomers as ec ON ec.customerid = $1 and ec.employeeid = e.employeeid
		left outer join communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
		  ((e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1 ) AND
			(o.outlettypeid !=19 AND o.outlettypeid !=41 ) AND
			( e.customerid=-1 OR e.customerid=$1) AND
			(tidy_telephone_for_search(c.tel)ILIKE $2 OR tidy_telephone_for_search(ecc.tel) ILIKE $2)""", ["int", "text"])
		SD['search_employee_tel_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletEmail(SD, plpy, customerid, data, byemployeeid):
	"doOutletEmail"
	if SD.has_key("search_outlet_email_plan"):
		plan = SD['search_outlet_email_plan']
	else:
		plan = plpy.prepare("""select o.primaryemployeeid as employeeid,o.outletid
		from outlets as o
		join communications as c ON c.communicationid = o.communicationid
		left outer join outletcustomers as oc ON oc.customerid = $1 and oc.outletid = o.outletid
		left outer join communications as ecc ON ecc.communicationid = oc.communicationid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
			(o.outlettypeid !=19 AND o.outlettypeid !=41 ) AND
			( o.customerid=-1 OR o.customerid=$1) AND
			(c.email ILIKE $2 OR ecc.email ILIKE $2)""", ["int", "text"])
		SD['search_outlet_email_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletTel(SD, plpy, customerid, data, byemployeeid):
	"doOutletTel"
	if SD.has_key("search_outlet_tel_plan"):
		plan = SD['search_outlet_tel_plan']
	else:
		plan = plpy.prepare("""select o.primaryemployeeid as employeeid,o.outletid
		from outlets as o
		join communications as c ON c.communicationid = o.communicationid
		left outer join outletcustomers as oc ON oc.customerid = $1 and oc.outletid = o.outletid
		left outer join communications as ecc ON ecc.communicationid = oc.communicationid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		  (o.outlettypeid !=19 AND o.outlettypeid !=41 ) AND
		  ( o.customerid=-1 OR o.customerid=$1) AND
		  (tidy_telephone_for_search(c.tel) ILIKE $2 OR tidy_telephone_for_search(ecc.tel) ILIKE $2)""", ["int", "text"])
		SD['search_outlet_tel_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletPublisher(SD, plpy, customerid, data, byemployeeid):
	"doOutletPublisher"
	if SD.has_key("search_outlet_publisher_plan"):
		plan = SD['search_outlet_publisher_plan']
	else:
		if data == None:
			data = -1
		plan = plpy.prepare("""select o.primaryemployeeid as employeeid,o.outletid
		from outlets as o
		join communications as c ON c.communicationid = o.communicationid
		left outer join outletcustomers as oc ON oc.customerid = $1 and oc.outletid = o.outletid
		left outer join communications as ecc ON ecc.communicationid = oc.communicationid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		  (o.outlettypeid !=19 AND o.outlettypeid !=41 ) AND
		  ( o.customerid=-1 OR o.customerid=$1) AND
		  (o.publisherid = $2)""", ["int", "int"])
		SD['search_outlet_publisher_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, int(data)]):
		entry.index.add(row[keyfield])

	return entry

def doFreelanceEmail(SD, plpy, customerid, data, byemployeeid):
	"doFreelanceEmail"
	if SD.has_key("search_outlet_tel_plan"):
		plan = SD['search_outlet_tel_plan']
	else:
		plan = plpy.prepare("""SELECT o.primaryemployeeid as employeeid,o.outletid
	FROM outlets AS o
	JOIN communications as c ON c.communicationid = o.communicationid
	LEFT OUTER JOIN outletcustomers as oc ON oc.customerid = $1 and oc.outletid = o.outletid
	LEFT OUTER JOIN communications as ecc ON ecc.communicationid = oc.communicationid
	WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		o.outlettypeid = 19 AND
		( o.customerid=-1 OR o.customerid=$1) AND
		(c.email ILIKE $2 OR ecc.email ILIKE $2)""", ["int", "text"])
		SD['search_outlet_tel_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletProfile(SD, plpy, customerid, data, byemployeeid):
	"doOutletProfile"
	if SD.has_key("search_outlet_profile_plan"):
		plan = SD['search_outlet_profile_plan']
	else:
		plan = plpy.prepare("""SELECT o.primaryemployeeid as employeeid,o.outletid
		FROM outlets as o
		LEFT OUTER JOIN outletcustomers AS oc ON oc.customerid = $1 and oc.outletid = o.outletid
			LEFT JOIN  outletprofile as op on o.outletid = op.outletid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
			(o.outlettypeid !=19 AND o.outlettypeid !=41 ) AND
			( o.customerid=-1 OR o.customerid=$1) AND
			(op.editorialprofile ILIKE $2 ) AND
		  (o.countryid in ( SELECT countryid FROM internal.customerprmaxdatasets WHERE customerid = $3) OR
		  o.nationid IS NOT NULL AND o.nationid in ( SELECT countryid FROM internal.customerprmaxdatasets WHERE customerid = $3))
		  """, ["int", "text", "int"])
		SD['search_outlet_profile_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	data = '%%%s%%' % data

	for row in plpy.execute(plan, [customerid, data, customerid]):
		entry.index.add(row[keyfield])

	return entry

def doFreelanceProfile(SD, plpy, customerid, data, byemployeeid):
	"doFreelanceProfile"
	if SD.has_key("search_freelance_profile_plan"):
		plan = SD['search_freelance_profile_plan']
	else:
		plan = plpy.prepare("""SELECT o.primaryemployeeid as employeeid,o.outletid
		FROM outlets as o
		LEFT OUTER JOIN outletcustomers AS oc ON oc.customerid = $1 and oc.outletid = o.outletid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
			o.outlettypeid =19 AND
			( o.customerid=-1 OR o.customerid=$1) AND
			(o.profile ILIKE $2  OR oc.profile ILIKE $2)""", ["int", "text"])
		SD['search_freelance_profile_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	data = '%%%s%%' % data

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doFreelanceTel(SD, plpy, customerid, data, byemployeeid):
	"doFreelanceTel"
	if SD.has_key("search_freelance_tel_plan"):
		plan = SD['search_freelance_tel_plan']
	else:
		plan = plpy.prepare("""SELECT o.primaryemployeeid AS employeeid,o.outletid
		FROM outlets AS o
		JOIN communications AS c ON c.communicationid = o.communicationid
		LEFT OUTER JOIN outletcustomers AS ec ON ec.customerid = $1 AND ec.outletid =o.outletid
		LEFT OUTER JOIN communications AS ecc ON ecc.communicationid = ec.communicationid
		where
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
			o.outlettypeid =19 AND
			( o.customerid=-1 OR o.customerid=$1) AND
			(tidy_telephone_for_search(c.tel) ILIKE $2 OR tidy_telephone_for_search(ecc.tel) ILIKE $2)""", ["int", "text"])
		SD['search_employee_tel_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def _EncodeTypeData(data):
	"_EncodeTypeData"
	return data

def doCommonSearch(commands, plpy, byemployeedid=True):
	"doCommonSearch"
	levellists = [[] for i in xrange(0, Constants.Search_Data_Count)]
	byemailtext = 'true' if byemployeedid else 'false'

	controlSettings = PostGresControl(plpy)

	controlSettings.doDebug("doCommonSearch222 " + byemailtext)
	for command in commands.rows:
		controlSettings.doDebug("command.keytypeid " + str(command.keytypeid))
		controlSettings.doDebug("command.keytypeid " + str(type(command.keytypeid)))
		if type(command.keytypeid) == StringType:
			data = _EncodeTypeData(command.word)
			controlSettings.doDebug("Encodeed Data " + str(data))
			action = """select * from %s( %d,'%s',%s,%d);""" % (command.keytypeid,
														   commands.customerid,
														   data,
														   byemailtext,
														   command.logic)
			result = plpy.execute(action.encode("utf-8"))[0]
			itemkey = command.keytypeid.lower()
		else:
			controlSettings.doDebug("command.keytypeid1 " + str(command.word))

			indexItems = ",".join(["('%s',%d)::IndexElement"%
								   (value, command.keytypeid)
								   for value in command.word])
			controlSettings.doDebug("doCommonSearch333 " + str(indexItems))

			#logic = Constants.Search_Or if command.partial else command.logic
			controlSettings.doDebug("pre doIndex")
			result = plpy.execute("select * from doIndexGroup(ARRAY[%s],%d,%d,%d);" %
								   (indexItems,
									commands.customerid,
									command.logic,
									command.partial))[0]
			itemkey = "doindexgroup1"
			controlSettings.doDebug("post doIndex")

		controlSettings.doDebug("command.type " + str(command.type))

		levellists[command.type].append(DBCompress.decode(result[itemkey]))

	return levellists

def doQuickEmail(SD, plpy, customerid, data, byemployeeid):
	""" Do a search of all the email address in the system for a specific part of one """
	if SD.has_key("search_quick_email_plan"):
		plan = SD['search_quick_email_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN communications as c ON c.communicationid = e.communicationid
		JOIN outlets as o on e.outletid = o.outletid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
		  ((e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1 ) AND
			o.outlettypeid NOT IN ( 19, 41 ) AND
			( e.customerid=-1 OR e.customerid=$1) AND
		    get_override(ecc.email, c.email ) ILIKE $2
	UNION
		SELECT
		o.primaryemployeeid,o.outletid
		FROM outlets AS o
		JOIN communications as c ON c.communicationid = o.communicationid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		  o.outlettypeid NOT IN (41) AND
		  o.customerid IN (-1,$1) AND
		  c.email like $2
	UNION
		SELECT
		o.primaryemployeeid,o.outletid
		FROM outletcustomers as oc
		JOIN communications as occ ON occ.communicationid = oc.communicationid
		JOIN outlets AS o on oc.outletid = o.outletid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		  o.outlettypeid NOT IN (41) AND
		  o.customerid IN (-1,$1) AND
		  occ.email like $2""", ["int", "text"])
		SD['search_quick_email_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doQuickTel(SD, plpy, customerid, data, byemployeeid):
	""" Do a search of all the tel in the system for a specific part of one """
	if SD.has_key("search_quick_tel_plan"):
		plan = SD['search_quick_tel_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN communications as c ON c.communicationid = e.communicationid
		JOIN outlets as o on e.outletid = o.outletid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
		  ((e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1 ) AND
			o.outlettypeid NOT IN ( 19, 41 ) AND
			( e.customerid=-1 OR e.customerid=$1) AND
		   tidy_telephone_for_search(get_override(ecc.tel, c.tel )) ILIKE $2
	UNION
		SELECT
		o.primaryemployeeid,o.outletid
		FROM outlets AS o
		JOIN communications as c ON c.communicationid = o.communicationid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		  o.outlettypeid NOT IN (19,41) AND
		  o.customerid IN (-1,$1) AND
		  tidy_telephone_for_search(c.tel) like $2
		UNION
		SELECT
		o.outletid,o.primaryemployeeid
		FROM outletcustomers as oc
		JOIN communications as occ ON occ.communicationid = oc.communicationid
		JOIN outlets AS o on oc.outletid = o.outletid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
		  o.outlettypeid NOT IN (19,41) AND
		  o.customerid IN (-1,$1) AND
		  occ.email like $2""", ["int", "text"])
		SD['search_quick_tel_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	for row in plpy.execute(plan, [customerid, data]):
		entry.index.add(row[keyfield])

	return entry
