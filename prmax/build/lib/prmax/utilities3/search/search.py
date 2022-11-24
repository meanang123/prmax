# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2018
#
# Author:       --<>
#
# Created:
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from prmax.utilities3.common.custtypes import CustomType
from prmax.utilities3.common.index import IndexEntry
from prmax.utilities3.common.dbhelper import DBCompress
import prmax.utilities3.common.constants as Constants

from prmax.utilities3.common.postgres import PostGresControl

class SearchIndex(object):
	""" search index controller """
	def dolevelgroup( self, indexs , logic):
		""" search level"""
		result = None
		for row in indexs:
			rowdata = self.addprivateindex(row)
			if result == None:
				result = rowdata
				continue
			if logic == Constants.Search_And:
				result.index &= rowdata.index
				if len(result) == 0:
					break
			elif logic == Constants.Search_Or:
				result.index.update( result.index | rowdata.index )
			else:
				raise Exception("Unknow Logic Type %d" % logic)
		return result

	def addprivateindex(self, indexs):
		""" add the customer specific data """
		result = indexs[0]
		if result == None:
			result = IndexEntry()
		if indexs[1] != None:
			result.index.update(result.index | indexs[1].index)
		return result

def doIndexGroup( SD, plpy, extended, logic, indexs, customerid):
	""" do a search on a level """
	if "prmax_index_get" in SD:
		plan_std = SD["prmax_index_get"]
		plan_private_std = SD["prmax_index_get_private"]
	else:
		plan_std = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname=$3 AND prmaxdatasetid IN ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = $4)", [ "int", "int", "text", "int"])
		SD["prmax_index_get"] = plan_std
		plan_private_std = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname=$3", [ "int", "int", "text", "int"])
		SD["prmax_index_get_private"] = plan_private_std

	if "prmax_index_get_extended" in SD:
		plan_std_ext = SD["prmax_index_get_extended"]
		plan_std_ext_private = SD["prmax_index_get_extended_private"]
	else:
		plan_std_ext = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname like $3 AND prmaxdatasetid IN ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = $4)", [ "int", "int", "text", "int"])
		SD["prmax_index_get_extended"]  = plan_std_ext
		plan_std_ext_private = plpy.prepare("SELECT data,keyname FROM userdata.setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname like $3", [ "int", "int", "text", "int"])
		SD["prmax_index_get_extended_private"]  = plan_std_ext_private

	if extended:
		plan = plan_std_ext
		private_plan = plan_std_ext_private
	else:
		plan = plan_std
		private_plan = plan_private_std

	#control system
	controlSettings = PostGresControl(plpy)
	controlSettings.dodebug("doIndexGroup")

	def _formatword(word):
		""" format word"""

		if extended:
			return str(word) + "%"
		else:
			return str(word)

	def _convert(row):
		""" convert"""
		rowPublic  = plpy.execute(plan, [ -1, row[1], _formatword(row[0]), customerid])
		rowPrivate =  plpy.execute(private_plan, [ customerid, row[1], _formatword(row[0]), customerid])
		dprivate = dpublic = None

		#controlSettings.dodebug("Extended =" + str(extended))
		#controlSettings.dodebug("Row =" + str(row))
		#controlSettings.dodebug("Row =" + str(row))
		#controlSettings.dodebug("Row =" + str(row))

		dprivate = None
		dpublic = None
		# we need or all these together to generate a songle private public pair
		for row in rowPrivate:
			if dprivate == None:
				dprivate = DBCompress.decode(row['data'])
			else:
				t = DBCompress.decode(row['data'])
				dprivate.index.update(t.index)
		for row in rowPublic:
			if dpublic == None:
				dpublic = DBCompress.decode(row['data'])
			else:
				t = DBCompress.decode(row['data'])
				dpublic.index.update(t.index)

		return (dprivate, dpublic)

	final = []
	if type(indexs) == list:
		for row in [_convert(CustomType.fromstringtolist(row)) for row in indexs] :
			controlSettings.dodebug(str(row))
			final.append(row)
	else:
		for row in [_convert(row) for row in CustomType.fromstringarray(indexs)] :
			final.append(row)

	controlSettings.dodebug(final)
	controlSettings.dodebug(logic)
	
	if len(final):
		iEngine = SearchIndex()
		#controlSettings.dodebug(str(iEngine.dolevelgroup(final, logic)))
		return iEngine.dolevelgroup(final, logic)
	else:
		#controlSettings.dodebug("Hello")
		return IndexEntry()


def _encodetypedata(data):
	"_encodetypedata"
	return str(data)

def doCommonSearch(commands, plpy, byemployeedid = True ):
	"doCommonSearch"
	levellists = [[] for i in range(0,Constants.Search_Data_Count)]
	byemailtext = 'true' if byemployeedid else 'false'

	controlSettings = PostGresControl(plpy)
	
	controlSettings.dodebug("doCommonSearch " + byemailtext)
	for command in commands['rows']:
		controlSettings.dodebug("command[keytypeid] 1: " + str(command['keytypeid']))
		controlSettings.dodebug("command 1: " + str(command))
		if isinstance(command['keytypeid'], str):
			data = _encodetypedata(command['word'])
			controlSettings.dodebug("Encodeed Data " + str(data))
			
			action = """select * from %s( %d,'%s',%s,%d);""" % (command['keytypeid'],
			                                                    commands['customerid'],
			                                                    data,
			                                                    byemailtext,
			                                                    command['logic'])

			controlSettings.dodebug("Action: " + action)

			result = plpy.execute(action)[0]
			itemkey = command['keytypeid'].lower()
		else:
			controlSettings.dodebug("command['keytypeid'] " + str(command['word']))

			indexItems = ",".join(["('%s',%d)::IndexElement"%
			                       (value,command['keytypeid'])
			                       for value in command['word']])
			controlSettings.dodebug("doCommonSearch " + str(indexItems))

			#logic = Constants.Search_Or if command['partial'] else command['logic']
			controlSettings.dodebug("pre doIndex")
			x = "select * from doIndexGroup(ARRAY[%s],%d,%d,%d);" %(indexItems,commands['customerid'],command['logic'],command['partial'])
			controlSettings.dodebug("x = " + str(x) )
			
			result = plpy.execute( "select * from doIndexGroup(ARRAY[%s],%d,%d,%d);" %
			                       (indexItems,
			                        commands['customerid'],
			                        command['logic'],
			                        command['partial']))[0]
			itemkey = "doindexgroup"
			controlSettings.dodebug("result: " + str(result))
			controlSettings.dodebug("post doIndex2")
			controlSettings.dodebug("command: " + str(command))

		controlSettings.dodebug(("command['type'] " + str(command['type'])))
		controlSettings.dodebug(str(DBCompress.decode(result[itemkey])))

		levellists[command['type']].append(DBCompress.decode(result[itemkey]))
	controlSettings.dodebug(str(levellists))
	controlSettings.dodebug(str(levellists[3]))

	return levellists


def SearchEmployeeContactExt(SD, plpy, customerid, data, byemployeeid):
	""" do employee email """
	if SD.has_key("search_employee_contact_ext_plan"):
		plan = SD['search_employee_contact_ext_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN outlets as o on e.outletid = o.outletid
		JOIN contacts AS c ON c.contactid = e.contactid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
			o.outlettypeid NOT IN ( 19, 41 ) AND
			(
		  (e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1) AND
		      c.familyname ILIKE $2 AND
		      c.firstname ILIKE $3""", ["int", "text", "text"])
		SD['search_employee_contact_ext_plan'] = plan

	#controlSettings = PostGresControl(plpy)
	#controlSettings.doDebug(data)

	obj = DBCompress.decode(data)

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	if obj["data"]["firstname"]:
		for row in plpy.execute(plan, [ customerid, obj["data"]["surname"] + "%", obj["data"]["firstname"] + "%"]):
			entry.index.add(row[keyfield])
	else:
		entry = doIndexGroup(SD,plpy, True, Constants.Search_Or, [(obj["data"]["surname"].lower(), Constants.employee_contact_employeeid), ],customerid)

	return entry

def doEmployeeEmail(SD, plpy, customerid, data, byemployeeid):
	""" do employee email """
	if 'search_employee_email_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doEmployeeTel(SD, plpy, customerid, data, byemployeeid):
	"doEmployeeTel"
	if 'search_employee_tel_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doFreelanceEmail(SD, plpy, customerid, data, byemployeeid):
	"doFreelanceEmail"
	if 'search_outlet_tel_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doFreelanceProfile(SD, plpy, customerid, data, byemployeeid):
	"doFreelanceProfile"
	if 'search_freelance_profile_plan' in SD:
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

	data =  '%%%s%%' % data

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doFreelanceTel(SD, plpy, customerid, data, byemployeeid):
	"doFreelanceTel"
	if 'search_freelance_tel_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletPublisher(SD, plpy, customerid, data, byemployeeid):
	"doOutletPublisher"
	if 'search_outlet_publisher_plan' in SD:
		plan = SD['search_outlet_publisher_plan']
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

def doOutletEmail(SD, plpy, customerid, data, byemployeeid):
	"doOutletEmail"
	if 'search_outlet_email_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletTel(SD, plpy, customerid, data, byemployeeid):
	"doOutletTel"
	if 'search_outlet_tel_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def doOutletProfile(SD, plpy, customerid, data, byemployeeid):
	"doOutletProfile"
	if 'search_outlet_profile_plan' in SD:
		plan = SD['search_outlet_profile_plan']
	else:
		plan = plpy.prepare("""SELECT o.primaryemployeeid as employeeid,o.outletid
		FROM outlets as o
		LEFT OUTER JOIN outletcustomers AS oc ON oc.customerid = $1 and oc.outletid = o.outletid
			LEFT JOIN  outletprofile as op on o.outletid = op.outletid
			LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid
		WHERE
		  ((o.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR o.customerid=$1 ) AND
			(o.outlettypeid !=19 AND o.outlettypeid !=41 ) AND
			( o.customerid=-1 OR o.customerid=$1) AND
			(op.editorialprofile ILIKE $2 OR op.readership ILIKE $2 OR op.nrsreadership ILIKE $2 OR op.jicregreadership ILIKE $2 or pub.publishername ILIKE $2) AND
		  (o.countryid in ( SELECT pc.countryid FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid WHERE customerid = $3) OR
		  o.nationid IS NOT NULL AND o.nationid in ( SELECT pc.countryid  FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid WHERE customerid = $3))
		  """, ["int", "text", "int"])
		SD['search_outlet_profile_plan'] = plan

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	data =  '%%%s%%' % data

	for row in plpy.execute(plan, [ customerid, data, customerid]):
		entry.index.add(row[keyfield])

	return entry

def doQuickCountry(SD, plpy, customerid, data ):
	"""Search for countries for quick search
	need to be both outlets and freelancers
	"""

	if 'search_quick_country_plan' in SD:
		plan = SD['search_quick_country_plan']
	else:
		plan = plpy.prepare("""SELECT nbr,data FROM userdata.setindex WHERE keytypeid IN (24,25) AND (customerid = -1 OR customerid = $1 ) AND keyname = $2
		AND (prmaxdatasetid IN (SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = $1 ) OR prmaxdatasetid IS NULL)""",["int", "text"])

	controlSettings = PostGresControl(plpy)
	controlSettings.dodebug(data)
	controlSettings.dodebug(str(customerid))

	entry = IndexEntry()
	for countryid in data.split(','):
		for row in plpy.execute(plan, [ customerid, countryid]):
			indextmp = DBCompress.decode(row["data"])
			controlSettings.dodebug("row")
			entry.index.update(indextmp.index)

	controlSettings.dodebug("postrow")

	return entry

def doQuickEmail(SD, plpy, customerid, data, byemployeeid):
	""" Do a search of all the email address in the system for a specific part of one """
	if 'search_quick_email_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry


def doQuickSearch( SD, plpy, customerid, data, includetree, logic ):
	""" qicj search """
	if 'prmax_result_plan_outlet' in SD:
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

	controlSettings = PostGresControl(plpy)

	index = None
	for interest  in data.split(","):
		level = None
		for row in plpy.execute(plan, [ customerid, interest, customerid ]):
			if row['datatypeid'] == Constants.Search_Data_Outlet:
				rowData = DBCompress.decode(plpy.execute(plan_outlet, [row['data']])[0]['outlettoprimaryemployee'])
			else:
				rowData = DBCompress.decode(plpy.execute(plan_employee, [row['data']])[0]['employeeaddoutlettree'])
			if level == None:
				level = rowData
			else:
				level.index.update ( rowData.index)
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
					index.index.update ( level.index)
					if includetree:
						for (key, value) in level.tree.iteritems():
							index.tree[key] = value
				else:
					index.index.update ( level.index )
					if includetree:
						for (key, value) in level.tree.iteritems():
							index.tree[key] = value

	return index

def doQuickTel(SD, plpy, customerid, data, byemployeeid):
	""" Do a search of all the tel in the system for a specific part of one """
	if 'search_quick_tel_plan' in SD:
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

	for row in plpy.execute(plan, [ customerid, data]):
		entry.index.add(row[keyfield])

	return entry

def SearchEmployeeContactExt(SD, plpy, customerid, data, byemployeeid):
	""" do employee email """
	if 'search_employee_contact_ext_plan' in SD:
		plan = SD['search_employee_contact_ext_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN outlets as o on e.outletid = o.outletid
		JOIN contacts AS c ON c.contactid = e.contactid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
			o.outlettypeid NOT IN ( 19, 41 ) AND
			(
		  (e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1) AND
		      c.familyname ILIKE $2 AND
		      c.firstname ILIKE $3""", ["int", "text", "text"])
		SD['search_employee_contact_ext_plan'] = plan

	obj = DBCompress.decode(data)

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	if obj["data"]["firstname"]:
		for row in plpy.execute(plan, [ customerid, obj["data"]["surname"] + "%", obj["data"]["firstname"] + "%"]):
			entry.index.add(row[keyfield])
	else:
		entry = doIndexGroup(SD,plpy, True, Constants.Search_Or, [(obj["data"]["surname"].lower(), Constants.employee_contact_employeeid), ],customerid)

	return entry

def SearchFreelanceContactExt(SD, plpy, customerid, data, byemployeeid):
	""" freelancer contact """
	if 'search_freelance_contact_ext_plan' in SD:
		plan = SD['search_freelance_contact_ext_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN outlets as o on e.outletid = o.outletid
		JOIN contacts AS c ON c.contactid = e.contactid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
			o.outlettypeid IN ( 19, 41 ) AND
			(
		  (e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1) AND
		      c.familyname ILIKE $2 AND
		      c.firstname ILIKE $3""", ["int", "text", "text"])
		SD['search_freelance_contact_ext_plan'] = plan

	controlSettings = PostGresControl(plpy)
	controlSettings.doDebug(data)

	obj = DBCompress.decode(data)

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	if obj["data"]["firstname"]:
		for row in plpy.execute(plan, [ customerid, obj["data"]["surname"] + "%", obj["data"]["firstname"] + "%"]):
			entry.index.add(row[keyfield])
	else:
		entry = doIndexGroup(SD,plpy, True, Constants.Search_Or, [(obj["data"]["surname"].lower(), Constants.freelance_employeeid), ],customerid)

	return entry

def SearchEmployeeContactFullExt(SD, plpy, customerid, data, byemployeeid):
	""" employee contact full name """
	if 'search_employee_contactfull_ext_plan' in SD:
		plan = SD['search_employee_contactfull_ext_plan']
	else:
		plan = plpy.prepare("""SELECT e.employeeid,e.outletid
		FROM employees AS e
		JOIN outlets as o on e.outletid = o.outletid
		JOIN contacts AS c ON c.contactid = e.contactid
		LEFT OUTER JOIN employeecustomers as ec ON ec.customerid = $1 AND ec.employeeid = e.employeeid
		LEFT OUTER JOIN communications as ecc ON ecc.communicationid = ec.communicationid
		WHERE
			(
		  (e.customerid=-1 AND o.countryid IN (SELECT pc.countryid
		  		FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		      WHERE cpd.customerid = $1))
		      OR e.customerid=$1) AND
		      c.familyname ILIKE $2 AND
		      c.firstname ILIKE $3""", ["int", "text", "text"])
		SD['search_employee_contactfull_ext_plan'] = plan

	#controlSettings = PostGresControl(plpy)
	#controlSettings.doDebug(data)

	obj = DBCompress.decode(data)

	entry = IndexEntry()
	if byemployeeid:
		keyfield = "employeeid"
	else:
		keyfield = "outletid"

	if obj["data"]["firstname"]:
		for row in plpy.execute(plan, [ customerid, obj["data"]["surname"] + "%", obj["data"]["firstname"] + "%"]):
			entry.index.add(row[keyfield])
	else:
		entry = doIndexGroup(SD,plpy, True, Constants.Search_Or, [(obj["data"]["surname"].lower(), Constants.employee_contactfull_employeeid), ],customerid)

	return entry
