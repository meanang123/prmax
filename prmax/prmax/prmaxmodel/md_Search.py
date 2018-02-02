# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        md_Search.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from sqlalchemy import Table
from sqlalchemy.sql import text
from turbogears.database import  metadata, mapper, session
from md_Common import BaseSql
from prmax.prmaxmodel.md_Caching import CacheQueue
import prmax.Constants as Constants
from prmax.utilities.search import PostGresSearch, PostGresSearchGroup
from prmax.prmaxmodel.md_Common import ParamCtrl
from prmax.prmaxmodel.SearchSession import SearchSession
from prcommon.model.customer.customeraccesslog import CustomerAccessLog
from ttl.dict import DictExt
from ttl.string import encodeforpostgres, splitoutletname
from ttl.postgres import DBCompress
from simplejson import JSONDecoder
import logging, types

log = logging.getLogger("prmedia.model")


class UserSession(object):
	""" user search session """
	@classmethod
	def Clear(cls, userId):
		""" clear all the existign data """
		for typeid in Constants.Search_Standard_All:
			SearchSession.DeleteSelection(userId, typeid, Constants.Search_SelectedAll)

class Search(BaseSql):
	""" individual search counts"""
	_countproc = {
		Constants.quick_search_interests: "searchinterestsallcount",
		Constants.employee_email: "SearchEmployeeEmailCount",
		Constants.outlet_email: "SearchOutletEmailCount",
		Constants.freelance_email: "SearchFreelanceEmailCount",
		Constants.employee_tel: "SearchEmployeeTelCount",
		Constants.freelance_tel: "SearchFreelanceTelCount",
		Constants.outlet_tel: "SearchOutletTelCount",
		Constants.outlet_profile: "SearchOutletProfileCount",
		Constants.outlet_coverage: "SearchCoverageAllCount",
		Constants.freelance_profile:"SearchFreelanceProfileCount",
	    Constants.quick_search_email:"SearchQuickEmailCount",
	    Constants.quick_search_tel:"SearchQuickTelCount",
	    Constants.advance_outletname:"SearchAdvanceOutletNameCount",
	    Constants.advance_pub_date:"SearchAdvancePubDateCount",
	    Constants.advance_outlettypeid:"SearchAdvanceMediaChannelCount",
	    Constants.advance_search_name_outletid:"SearchOutletAdvanceCount",
	    Constants.quick_search_countryid: "SearchQuickCountryCount",
	    Constants.employee_contact_ext_employeeid: "SearchEmployeeContactExtCount",
	}

	Search_Count_Single = """SELECT IFNULL(SUM(si.nbr),0) as nbr from userdata.setindex as si WHERE ( si.customerid=-1 OR customerid = :customerid) AND keytypeid = :keytypeid AND keyname = :keyname AND prmaxdatasetid in ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = :customerid)"""
	Search_Count_Partial = """SELECT IFNULL(SUM(si.nbr),0) as nbr from userdata.setindex as si WHERE ( si.customerid=-1 OR customerid = :customerid) AND keytypeid = :keytypeid AND keyname like :keyname AND prmaxdatasetid in ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = :customerid)"""
	Search_Count_List = """SELECT IFNULL(SUM(si.nbr),0) as nbr from userdata.setindex as si WHERE ( si.customerid=-1 OR customerid = :customerid) AND keytypeid = :keytypeid AND keyname IN (%s) AND prmaxdatasetid in ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = :customerid)"""

	@classmethod
	def getSearchCount(cls, kw):
		""" This returns the number of entries that the search would return for
		this specific search
		"""
		command = None
		if kw.keytypeid in Constants.Search_Extended_Data:
			array = ",".join(["('%s',%d)::IndexElement"%(value, kw.keytypeid)
							  for value in kw['keyname']['data']])
			command = """SELECT * FROM doIndexGroupCount(  ARRAY[%s],:customerid,:logic,:partial);""" % (array)
		elif kw.keytypeid in (Constants.outlet_circulationid,
							  Constants.outlet_searchtypeid,):
			command = Search.Search_Count_List % ",".join(
				[ "'%d'"%f for f in kw.keyname])
		elif kw.keytypeid in Search._countproc:
			if kw.keytypeid in (Constants.quick_search_interests, ):
				kw.data = ",".join([str(r) for r in kw.keyname['data']])
			elif kw.keytypeid in (Constants.outlet_coverage, Constants.employee_contact_ext_employeeid):
				kw.data = DBCompress.encode2 ( kw.keyname )
			elif kw.keytypeid in Constants.isEmailAddress or \
			     kw.keytypeid in Constants.isTelNumber or \
			     kw.keytypeid in Constants.isProfile:
				if type(kw.keyname) == types.ListType:
					kw.keyname = "".join ( kw.keyname )
				kw.data = "%" + kw.keyname + "%"
			elif kw.keytypeid == Constants.advance_outletname:
				if type ( kw.keyname ) == types.ListType :
					ddata = kw.keyname
				else:
					ddata = [encodeforpostgres( kw.keyname.lower())]
				commands = PostGresSearch(kw["customerid"])
				command = PostGresSearchGroup(
				  Constants.outlet_name,
				  ddata,
				  kw.logic,
				  kw["partial"] ,
				  Constants.Search_And)
				commands.rows.append(command)
				kw.data  = DBCompress.encode2 ( commands )
			elif kw.keytypeid in (Constants.advance_outlettypeid, Constants.advance_search_name_outletid):

				nid = Constants.outlet_outlettypeid
				if kw.keytypeid == Constants.advance_search_name_outletid:
					nid = Constants.advance_search_name
					nData = (kw.keyname,)
				else:
					nData = kw.keyname["data"]

				commands = PostGresSearch(kw["customerid"])
				command = PostGresSearchGroup(
				  nid,
				  nData,
				  kw.logic,
				  kw["partial"] ,
				  Constants.Search_Or)
				commands.rows.append(command)
				kw.data  = DBCompress.encode2 ( commands )
			elif kw.keytypeid == Constants.advance_pub_date:
				kw.data = _minisearch_advance_pub_date ( kw.keyname , kw )["data"]
			elif kw.keytypeid == Constants.quick_search_countryid:
				kw.data = DBCompress.encode2(JSONDecoder().decode(kw["value"]))
			else:
				kw.data = kw.keyname

			command = "select * from %s(:customerid,:data,true,:logic);" % Search._countproc[kw.keytypeid]
		else:
			if type(kw['keyname']) == types.ListType:
				kw.logic = Constants.Search_And
				array = ",".join(["('%s',%d)::IndexElement" % (value, kw.keytypeid)
								  for value in kw['keyname']])
				command = "select * from doIndexGroupCount(  ARRAY[%s],:customerid,:logic,:partial);" % (array)
			else:
				if kw.partial:
					if kw.keytypeid in (Constants.employee_contact_employeeid,):
						command = """select * from doIndexGroupCount(  ARRAY[('%s',:keytypeid)::IndexElement],:customerid,:logic,:partial);"""%kw.keyname
					else:
						command = """select * from doIndexGroupCount(  ARRAY[('%(keyname)s',%(keytypeid)s)::IndexElement],%(customerid)s,%(logic)s,%(partial)s);""" %  kw
						#command = """select * from doIndexGroupCount(  ARRAY[('o''l',1)::IndexElement],2693,2,2)"""

				else:
					command = Search.Search_Count_Single

		if command:
			return cls.sqlExecuteCommand ( text(command),
										   kw,
										   BaseSql.singleFieldInteger)
		else:
			return 0

def _covertdata_or_logic(data, kw):
	""" cobvert """
	return _convertdata2( data, Constants.Search_Or )

def _convertNumber(number, kw):
		return DictExt(dict(data = [number,], logic = Constants.Search_And))


def _check_role_required(data , kw):
	result = _convertdata2( data, Constants.Search_Or )
	return result.has_key("search_only")


def _convertdata(data, kw ):
	return _convertdata2 ( data )

def _convertdata2(data, logic=Constants.Search_And):
	""" convert """
	data = ParamCtrl.convertJSonListsParams (data)
	if not type(data) in ( types.DictionaryType , DictExt):
		return DictExt(dict(data = data, logic = logic))
	else:
		data['logic'] = int(data.get('logic', '0'))
		if data['logic'] == 0:
			data['logic'] = Constants.Search_And
		return data

def _convertobj(data, kw):
	""" convert """
	d1 = DictExt()
	d1.data = DBCompress.encode2(ParamCtrl.convertJSonListsParamsStd (data))
	d1.logic = Constants.Search_And
	return d1

def _convertoutletname(data, kw):
	""" convert """
	data = encodeforpostgres ( data )
	return DictExt(dict(data = splitoutletname(data.strip()),
						logic = Constants.Search_And))


def _convertstringdata(data, kw):
	""" convert """
	return DictExt(dict(data = data.strip().lower().split(" "),
						logic = Constants.Search_And))

def _convertdata_email(data, kw):
	""" convert """
	return DictExt(dict(data = "%"+data.lower() + "%",
						logic = Constants.Search_And))

def _convertdata_tel(data, kw):
	""" convert """
	return DictExt(dict(data = "%"+data.lower().replace(' ', '' )  + "%",
						logic = Constants.Search_And))


def _noconvertdata(data, kw):
	""" convert """
	return DictExt(dict(data = [data, ], logic = Constants.Search_And))

def _noconvertnolistdata(data, kw):
	""" convert """
	return DictExt(dict(data = data, logic = Constants.Search_And))


def _convertdatalower(data, kw):
	""" convert """
	return DictExt(dict(data = [ encodeforpostgres( data.lower() ) , ], logic = Constants.Search_And))

def _listostring(data, kw):
	""" convert """
	data = ParamCtrl.convertJSonListsParams (data)
	data['logic'] = int(data['logic'])
	data['data'] = ",".join([str(d) for d in data.data])
	if data['logic'] == 0:
		data['logic'] = Constants.Search_And
	return data

def _minisearch_advance_outletname(data,kw ):
	""" convert to a mii search """

	return _search_Common(kw,
	                      Constants.outlet_name,
	                      _convertoutletname(data,None)["data"],
	                      Constants.Search_And)

def _minisearch_advance_mediachannel(data, kw ):
	""" media channels """

	return _search_Common(kw,
	                      Constants.outlet_outlettypeid,
	                      _convertdata2(data,None)["data"],
	                      Constants.Search_Or)


def _minisearch_outlet_advance(data, kw ):
	""" advance feeatures outlet search """

	return _search_Common(kw,
	                      Constants.advance_search_name,
	                      _convertdatalower(data,None)["data"],
	                      Constants.Search_And)


def _search_Common(kw, keytypeid, data, logic):
	commands = PostGresSearch(kw["customerid"])
	command = PostGresSearchGroup(
	  keytypeid,
	  data,
	  logic,
	  kw["partial"] ,
	  logic)
	commands.rows.append(command)
	return DictExt(dict( logic = Constants.Search_And ,
	             data = DBCompress.encode2 ( commands ) ))

def _minisearch_advance_pub_date(data,kw ):
	""" convert to a mii search """

	t = dict( logic = Constants.Search_And , data = data )
	return DictExt ( dict( logic = Constants.Search_And,
	                 data = DBCompress.encode2 ( t ) ))

def _minisearch_advance_pub_date2(data,kw ):
	""" convert to a mii search """

	decode = JSONDecoder()
	control = DBCompress.encode2( decode.decode(data) )

	return DictExt(dict( data = control, logic = Constants.Search_And))

def _Post_Search( searchtype, kw):
	""" Post search fix's to data """

	# apply roles to results
	key = searchtype + "_roles"
	if kw.has_key(key) and kw[key]:
		decode = JSONDecoder()
		control = decode.decode(kw[key])

		SearchSession._ApplyRoles(control,
		                          dict ( searchtypeid = Constants.Search_Standard_Type,
		                                 userid = kw["userid"],
		                                 customerid = kw["customerid"],
		                                 selected = -1))

class Searching(BaseSql):
	" search the database "

	_quick_kw = (
		('quick_contact', Constants.employee_contactfull_employeeid, _convertdatalower, Constants.Search_Data_Employee,True),
	    ('quick_contact_ext', "SearchEmployeeContactExt",_convertobj, None, True ),
		('quick_types', Constants.outlet_searchtypeid, _covertdata_or_logic, Constants.Search_Data_Outlet, False),
		('quick_outlettypes', Constants.outlet_outlettypeid,_covertdata_or_logic, Constants.Search_Data_Outlet, False),
		('quick_interests',"SearchInterestsAll", _listostring, Constants.Search_Data_Employee, False ),
		('quick_searchname', Constants.outlet_name, _convertoutletname, Constants.Search_Data_Outlet, True ),
		('quick_coverage', "SearchCoverageAll", _convertobj, Constants.Search_Data_Outlet, False ),
		('quick_email',"SearchQuickEmail",_convertdata_email, Constants.Search_Data_Employee, False ),
		('quick_tel',"SearchQuickTel",_convertdata_tel, Constants.Search_Data_Employee, False ),
		('quick_countryid', "SearchQuickCountry",_convertobj, Constants.Search_Data_Outlet, False),
		)

	_outlet_kw = (
		('outlet_types', Constants.outlet_searchtypeid,_covertdata_or_logic, None, False ),
		('outlet_outlettypes', Constants.outlet_outlettypeid,_covertdata_or_logic, None, False ),
		('outlet_searchname',Constants.outlet_name,_convertoutletname, None, True),
		('outlet_interests',Constants.outlet_interest,_convertdata, None, False ),
		('outlet_coverage',"SearchCoverageAll",_convertobj,Constants.Search_Data_Outlet, None, False ),
		('outlet_circulation',Constants.outlet_circulationid,_covertdata_or_logic, None, False ),
		('outlet_profile','SearchOutletProfile',_noconvertnolistdata, None, False ),
		('outlet_tags',Constants.outlet_interest,_convertdata, None, False ),
		('outlet_roles', Constants.outlet_job_role,_convertdata, None, False ),
	  ('outlet_frequency', Constants.outlet_frequencyid,_convertNumber, None, False ),
	  ('outlet_advance_feature',"SearchOutletAdvance",_minisearch_outlet_advance, None, True),
		('outlet_countryid',Constants.outlet_countryid,_convertdata, None, False )
		#('outlet_tel', 'SearchOutletTel', _convertdata_tel, None , True ),
		#('outlet_email', 'SearchOutletEmail',_convertdata_email, None, True ),
	)

	_employee_kw = (
		('employee_searchname',Constants.employee_contact_employeeid,_convertdatalower, None, True ),
	    ('employee_searchname_ext', "SearchEmployeeContactExt",_convertobj, None, True ),
		('employee_interests',Constants.employee_employeeid_interestid,_convertdata, None, False ),
		('employee_outlettypes', Constants.employee_prmaxoutlettypeid,_covertdata_or_logic, None, False ),
	  ('employee_roles', Constants.employee_job_role,_convertdata, None, False ),
		('employee_countryid', Constants.employee_countryid,_covertdata_or_logic, None, False )
		#('employee_email',"SearchEmployeeEmail",_convertdata_email, None, True ),
		#('employee_tel',"SearchEmployeeTel",_convertdata_tel, None, True ),
	)
	_freelance_kw = (
		('freelance_searchname',Constants.freelance_employeeid,_convertdatalower, None, True ),
		('freelance_email',"SearchFreelanceEmail",_convertdata_email, None, True),
		('freelance_tel',"SearchFreelanceTel",_convertdata_tel, None, True ),
		('freelance_interests',Constants.freelance_employeeid_interestid,_convertdata, None, False ),
		('freelance_profile','SearchFreelanceProfile',_noconvertnolistdata, None, True),
		('freelance_countryid',Constants.freelance_employeeid_countryid,_convertdata, None, True )
	)

	_advance_kw = (
		('advance_advancename',Constants.advance_search_name,_convertoutletname, None, True),
	  ('advance_outletname',"SearchAdvanceOutletName",_minisearch_advance_outletname, None, True),
	  ('advance_publicationdate',"SearchAdvancePubDate",_minisearch_advance_pub_date2, None, True),
		('advance_interests',Constants.advance_interest,_convertdata, None, False ),
	  ('advance_outlettypes',"SearchAdvanceMediaChannel",_minisearch_advance_mediachannel, None, True)
	  )

	_crm_kw = ()

	_searchs = {
		"quick" : (_quick_kw, Constants.Search_Data_Employee,None, "loadSession", "outlet"),
		"outlet":( _outlet_kw, Constants.Search_Data_Outlet,_Post_Search, "loadSession", "outlet"),
		"employee": (_employee_kw, Constants.Search_Data_Employee,None, "loadSession", "outlet"),
		"freelance": (_freelance_kw, Constants.Search_Data_Employee,None,"loadSession", "outlet"),
	  "advance":(_advance_kw, Constants.Search_Data_Advance, None, "loadAdvance", "advance" ),
	  "crm":(_crm_kw, Constants.Search_Data_Crm, None, "loadCrm", "crm")
	}

	_search_ignores = dict (outlet_roles = _check_role_required)


	@classmethod
	def doSearch(cls, kw):
		""" do a search and load the current session table """
		data = cls._Search(kw,)

		# add entry tp re cache
		session.add(CacheQueue(
			objectid=kw['userid'],
			objecttypeid=Constants.Cache_Search_List_Standard,
			customerid=kw['customerid'],
			params=DBCompress.encode2(("o.outletname","desc"))))

		# add entry to the log count of search's done
		session.add(CustomerAccessLog(customerid=kw["prstate"].u.customerid,
			                            userid=kw["prstate"].u.user_id,
			                            levelid=CustomerAccessLog.DOSEARCH,
			                            username=kw["prstate"].u.user_name))
		return data

	@classmethod
	def doSearchCount(cls, kw):
		""" do a search and return the number of records found"""
		return cls._Search(kw, "countSession")

	@classmethod
	def _Search(cls, kw , procedure = None ):
		""" basis search function
		the procedure is used to chnage the output """
		partial = int(kw.get('search_partial','0'))
		kw["partial"] = partial
		customerid = -1 if "research" in kw else kw['customerid']
		criteriaset = Searching._searchs[kw.search_type]
		commands = PostGresSearch(customerid)
		for cri in criteriaset[0]:
			if cri[0] not in kw or not len(kw[cri[0]]):
				continue

			# criteria in actually used in the post phase and not the search phase
			# so it can be skipped at this point
			if Searching._search_ignores.has_key(cri[0]) and \
			   Searching._search_ignores[cri[0]](kw.get(cri[0]), kw ):
				continue

			data = cri[2](kw.get(cri[0]), kw)
			command = PostGresSearchGroup(
				cri[1],
				data.data,
				data.logic,
				partial if cri[4] else 0 ,
				Constants.Search_And)
			command.type = criteriaset[1]
			commands.rows.append(command)
			if cri[3] != None:
				command.type = cri[3]

		searchtypeid = kw.get("searchtypeid", Constants.Search_Standard_Type)
		# no criteria return no results
		if len(commands.rows)==0:
			return SearchSession.getSessionCount (
				dict(userid=kw['user_id'],
					 searchtypeid = searchtypeid))


		# do actual search
		command = "SELECT * FROM %s(:data,:userid,:searchtypeid,:newsession,:searchby)" % criteriaset[3] if procedure == None else procedure
		data = cls.sqlExecuteCommand ( text(command),
									   dict(data=DBCompress.encode(commands),
											userid = kw['userid'],
											searchtypeid = searchtypeid,
											newsession = kw.mode,
											searchby = kw.search_type),
									   BaseSql.SingleResultAsEncodedDict,
									   True)
		if criteriaset[2]:
			criteriaset[2](kw.search_type, kw )

		# need to add the data type to the result
		data["searchby"] = criteriaset[4]

		return data

searchsession_table = Table('searchsession', metadata, autoload = True, schema = 'userdata')

mapper(Search, searchsession_table)
mapper(Searching, searchsession_table)
