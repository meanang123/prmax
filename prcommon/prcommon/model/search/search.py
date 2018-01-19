# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        search.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     30/01/2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------

import logging
import types
from sqlalchemy.sql import text
from turbogears.database import session
from simplejson import JSONDecoder
from prcommon.model.common import BaseSql
from prcommon.model.caching import CacheQueue
from prcommon.postgressearch.searchhelpers import PostGresSearch, PostGresSearchGroup
from prcommon.model.searchsession import SearchSession
from prcommon.model.customer.customeraccesslog import CustomerAccessLog
import prcommon.Constants as Constants
from ttl.dict import DictExt
from ttl.string import encodeforpostgres, splitoutletname
from ttl.postgres import DBCompress
from ttl.model.common import ParamCtrl

LOGGER = logging.getLogger("prmedia.model")

class ApiSearch(object):
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
	  Constants.advance_search_name_outletid:"SearchOutletAdvanceCount"
	}

	Search_Count_Single = """SELECT IFNULL(SUM(si.nbr),0) as nbr from userdata.setindex as si WHERE ( si.customerid=-1 OR customerid = :customerid) AND keytypeid = :keytypeid AND keyname = :keyname AND prmaxdatasetid in ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = :customerid)"""
	Search_Count_Partial = """SELECT IFNULL(SUM(si.nbr),0) as nbr from userdata.setindex as si WHERE ( si.customerid=-1 OR customerid = :customerid) AND keytypeid = :keytypeid AND keyname like :keyname AND prmaxdatasetid in ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = :customerid)"""
	Search_Count_List = """SELECT IFNULL(SUM(si.nbr),0) as nbr from userdata.setindex as si WHERE ( si.customerid=-1 OR customerid = :customerid) AND keytypeid = :keytypeid AND keyname IN (%s) AND prmaxdatasetid in ( SELECT prmaxdatasetid FROM internal.customerprmaxdatasets WHERE customerid = :customerid)"""

	@classmethod
	def get_search_count(cls, params):
		""" This returns the number of entries that the search would return for
		this specific search
		"""
		command = None
		if params.keytypeid in Constants.Search_Extended_Data:
			array = ",".join(["('%s',%d)::IndexElement"%(value, params.keytypeid)
							  for value in params['keyname']['data']])
			command = """SELECT * FROM doIndexGroupCount(  ARRAY[%s],:customerid,:logic,:partial);""" % (array)
		elif params.keytypeid in (Constants.outlet_circulationid,
							  Constants.outlet_searchtypeid,):
			command = ApiSearch.Search_Count_List % ",".join(
				["'%d'"%f for f in params.keyname])
		elif params.keytypeid in ApiSearch._countproc:
			if params.keytypeid in (Constants.quick_search_interests,):
				params.data = ",".join([str(r) for r in params.keyname['data']])
			elif params.keytypeid in (Constants.outlet_coverage,):
				params.data = DBCompress.encode2(params.keyname)
			elif params.keytypeid in Constants.isEmailAddress or \
			     params.keytypeid in Constants.isTelNumber or \
			     params.keytypeid in Constants.isProfile:
				if isinstance(params.keyname, types.ListType):
					params.keyname = "".join(params.keyname)
				params.data = "%" + params.keyname + "%"
			elif params.keytypeid == Constants.advance_outletname:
				if isinstance(params.keyname, types.ListType):
					ddata = params.keyname
				else:
					ddata = [encodeforpostgres(params.keyname.lower())]
				commands = PostGresSearch(params["customerid"])
				command1 = PostGresSearchGroup(
				  Constants.outlet_name,
				  ddata,
				  params.logic,
				  params["partial"],
				  Constants.Search_And)
				commands.rows.append(command1)
				params.data = DBCompress.encode2(commands)
			elif params.keytypeid in (Constants.advance_outlettypeid, Constants.advance_search_name_outletid):

				nid = Constants.outlet_outlettypeid
				if params.keytypeid == Constants.advance_search_name_outletid:
					nid = Constants.advance_search_name
					n_data = (params.keyname, )
				else:
					n_data = params.keyname["data"]

				commands = PostGresSearch(params["customerid"])
				command1 = PostGresSearchGroup(
				  nid,
				  n_data,
				  params.logic,
				  params["partial"],
				  Constants.Search_Or)
				commands.rows.append(command1)
				params.data = DBCompress.encode2(commands)
			elif params.keytypeid == Constants.advance_pub_date:
				params.data = _minisearch_advance_pub_date(params.keyname, params)["data"]
			elif params.keytypeid == Constants.quick_search_countryid:
				params.data = DBCompress.encode2(JSONDecoder().decode(params["value"]))
			else:
				params.data = params.keyname

			command = "select * from %s(:customerid,:data,true,:logic);" % ApiSearch._countproc[params.keytypeid]
		else:
			if isinstance(params['keyname'], types.ListType):
				params.logic = Constants.Search_And
				array = ",".join(["('%s',%d)::IndexElement" % (value, params.keytypeid) for value in params['keyname']])
				command = "select * from doIndexGroupCount(  ARRAY[%s],:customerid,:logic,:partial);" % (array, )
			else:
				if params.partial:
					if params.keytypeid in (Constants.employee_contact_employeeid, ):
						command = """select * from doIndexGroupCount( ARRAY[('%s',:keytypeid)::IndexElement],:customerid,:logic,:partial);""" % params.keyname
					else:
						command = """select * from doIndexGroupCount( ARRAY[('%(keyname)s',%(keytypeid)s)::IndexElement],%(customerid)s,%(logic)s,%(partial)s);""" % params
						#command = """select * from doIndexGroupCount(  ARRAY[('o''l',1)::IndexElement],2693,2,2)"""

				else:
					command = ApiSearch.Search_Count_Single

		if command:
			return SearchSession.sqlExecuteCommand(text(command),
			                                       params,
			                                       BaseSql.singleFieldInteger)
		else:
			return 0

def _covertdata_or_logic(data, params):
	""" cobvert """
	return _convertdata2(data, Constants.Search_Or)

def _convert_number(number, params):
		return DictExt(dict(data=[number, ], logic=Constants.Search_And))

def _check_role_required(data, params):

	result = _convertdata2(data, Constants.Search_Or)

	return result.has_key("search_only")

def _convertdata(data, params):
	return _convertdata2(data)

def _convertdata2(data, logic=Constants.Search_And):
	""" convert """
	data = ParamCtrl.convertJSonListsParams(data)
	if type(data) not in (types.DictionaryType, DictExt):
		return DictExt(dict(data=data, logic=logic))
	else:
		data['logic'] = int(data.get('logic', '0'))
		if data['logic'] == 0:
			data['logic'] = Constants.Search_And
		return data

def _convertobj(data, params):
	""" convert """
	tmp = DictExt()
	tmp.data = DBCompress.encode2(ParamCtrl.convertJSonListsParamsStd(data))
	tmp.logic = Constants.Search_And
	return tmp

def _convertoutletname(data, params):
	""" convert """
	data = encodeforpostgres(data)

	return DictExt(dict(data=splitoutletname(data.strip()), logic=Constants.Search_And))

def _convertstringdata(data, params):
	""" convert """
	return DictExt(dict(data=data.strip().lower().split(" "), logic=Constants.Search_And))

def _convertdata_email(data, params):
	""" convert """
	return DictExt(dict(data="%" + data.lower() + "%", logic=Constants.Search_And))

def _convertdata_tel(data, params):
	""" convert """

	return DictExt(dict(data="%" + data.lower().replace(' ', '')  + "%", logic=Constants.Search_And))

def _noconvertdata(data, params):
	""" convert """
	return DictExt(dict(data=[data, ], logic=Constants.Search_And))

def _noconvertnolistdata(data, params):
	""" convert """
	return DictExt(dict(data=data, logic=Constants.Search_And))

def _convertdatalower(data, params):
	""" convert """
	return DictExt(dict(data=[encodeforpostgres(data.lower()), ], logic=Constants.Search_And))

def _listostring(data, params):
	""" convert """
	data = ParamCtrl.convertJSonListsParams(data)
	data['logic'] = int(data['logic'])
	data['data'] = ",".join([str(d) for d in data.data])
	if data['logic'] == 0:
		data['logic'] = Constants.Search_And
	return data

def _minisearch_advance_outletname(data, params):
	""" convert to a mii search """

	return _search_common(params,
	                      Constants.outlet_name,
	                      _convertoutletname(data, None)["data"],
	                      Constants.Search_And)

def _minisearch_advance_channel(data, params):
	""" media channels """

	return _search_common(params,
	                      Constants.outlet_outlettypeid,
	                      _convertdata2(data, None)["data"],
	                      Constants.Search_Or)


def _minisearch_outlet_advance(data, params):
	""" advance feeatures outlet search """

	return _search_common(params,
	                      Constants.advance_search_name,
	                      _convertdatalower(data, None)["data"],
	                      Constants.Search_And)


def _search_common(params, keytypeid, data, logic):
	commands = PostGresSearch(params["customerid"])
	command = PostGresSearchGroup(
	  keytypeid,
	  data,
	  logic,
	  params["partial"],
	  logic)
	commands.rows.append(command)

	return DictExt(dict(logic=Constants.Search_And, data=DBCompress.encode2(commands)))

def _minisearch_advance_pub_date(data, params):
	""" convert to a mii search """

	return DictExt(dict(logic=Constants.Search_And, data=DBCompress.encode2(dict(logic=Constants.Search_And, data=data))))

def _minisearch_advance_pub_date2(data, params):
	""" convert to a mii search """

	decode = JSONDecoder()
	control = DBCompress.encode2(decode.decode(data))

	return DictExt(dict(data=control, logic=Constants.Search_And))

def _post_search(searchtype, params):
	""" Post search fix's to data """

	# apply roles to results
	key = searchtype + "_roles"
	if params.has_key(key) and params[key]:
		decode = JSONDecoder()
		control = decode.decode(params[key])

		SearchSession._ApplyRoles(control,
		                          dict(searchtypeid=Constants.Search_Standard_Type,
		                               userid=params["userid"],
		                               customerid=params["customerid"],
		                               selected=-1))

class ApiSearching(object):
	" search the database "

	_quick_kw = (
		('quick_contact', Constants.employee_contactfull_employeeid, _convertdatalower, Constants.Search_Data_Employee, True),
		('quick_types', Constants.outlet_searchtypeid, _covertdata_or_logic, Constants.Search_Data_Outlet, False),
		('quick_outlettypes', Constants.outlet_outlettypeid, _covertdata_or_logic, Constants.Search_Data_Outlet, False),
		('quick_interests', "SearchInterestsAll", _listostring, Constants.Search_Data_Employee, False),
		('quick_searchname', Constants.outlet_name, _convertoutletname, Constants.Search_Data_Outlet, True),
		('quick_coverage', "SearchCoverageAll", _convertobj, Constants.Search_Data_Outlet, False),
		('quick_email', "SearchQuickEmail", _convertdata_email, Constants.Search_Data_Employee, False),
		('quick_tel', "SearchQuickTel", _convertdata_tel, Constants.Search_Data_Employee, False),
		('quick_countryid', "SearchQuickCountry",_convertobj, Constants.Search_Data_Outlet, False),
		)

	_outlet_kw = (
		('outlet_types', Constants.outlet_searchtypeid, _covertdata_or_logic, None, False),
		('outlet_outlettypes', Constants.outlet_outlettypeid, _covertdata_or_logic, None, False),
		('outlet_searchname', Constants.outlet_name, _convertoutletname, None, True),
		('outlet_interests', Constants.outlet_interest, _convertdata, None, False),
		('outlet_coverage', "SearchCoverageAll", _convertobj, Constants.Search_Data_Outlet, None, False),
		('outlet_circulation', Constants.outlet_circulationid, _covertdata_or_logic, None, False),
		('outlet_profile', 'SearchOutletProfile', _noconvertnolistdata, None, False),
		('outlet_tags', Constants.outlet_interest, _convertdata, None, False),
		('outlet_roles', Constants.outlet_job_role, _convertdata, None, False),
	  ('outlet_frequency', Constants.outlet_frequencyid, _convert_number, None, False),
	  ('outlet_advance_feature', "SearchOutletAdvance", _minisearch_outlet_advance, None, True),
		('outlet_countryid', Constants.outlet_countryid, _convertdata, None, False)
		#('outlet_tel', 'SearchOutletTel', _convertdata_tel, None , True ),
		#('outlet_email', 'SearchOutletEmail',_convertdata_email, None, True ),
	)

	_employee_kw = (
		('employee_searchname', Constants.employee_contact_employeeid, _convertdatalower, None, True),
	    ('employee_searchname_ext', "SearchEmployeeContactExt",_convertobj, None, True ),
		('employee_interests', Constants.employee_employeeid_interestid, _convertdata, None, False),
		('employee_outlettypes', Constants.employee_prmaxoutlettypeid, _covertdata_or_logic, None, False),
	  ('employee_roles', Constants.employee_job_role, _convertdata, None, False),
		('employee_countryid', Constants.employee_countryid, _covertdata_or_logic, None, False)
		#('employee_email',"SearchEmployeeEmail",_convertdata_email, None, True ),
		#('employee_tel',"SearchEmployeeTel",_convertdata_tel, None, True ),
	)
	_freelance_kw = (
		('freelance_searchname', Constants.freelance_employeeid, _convertdatalower, None, True),
		('freelance_email', "SearchFreelanceEmail", _convertdata_email, None, True),
		('freelance_tel', "SearchFreelanceTel", _convertdata_tel, None, True),
		('freelance_interests', Constants.freelance_employeeid_interestid, _convertdata, None, False),
		('freelance_profile', 'SearchFreelanceProfile', _noconvertnolistdata, None, True),
		('freelance_countryid', Constants.freelance_employeeid_countryid, _convertdata, None, True)
	)

	_advance_kw = (
		('advance_advancename', Constants.advance_search_name, _convertoutletname, None, True),
	  ('advance_outletname', "SearchAdvanceOutletName", _minisearch_advance_outletname, None, True),
	  ('advance_publicationdate', "SearchAdvancePubDate", _minisearch_advance_pub_date2, None, True),
		('advance_interests', Constants.advance_interest, _convertdata, None, False),
	  ('advance_outlettypes', "SearchAdvanceMediaChannel", _minisearch_advance_channel, None, True)
	  )

	_crm_kw = ()

	_searchs = {
		"quick" : (_quick_kw, Constants.Search_Data_Employee, None, "loadSession", "outlet"),
		"outlet": (_outlet_kw, Constants.Search_Data_Outlet, _post_search, "loadSession", "outlet"),
		"employee": (_employee_kw, Constants.Search_Data_Employee, None, "loadSession", "outlet"),
		"freelance": (_freelance_kw, Constants.Search_Data_Employee, None, "loadSession", "outlet"),
	  "advance": (_advance_kw, Constants.Search_Data_Advance, None, "loadAdvance", "advance"),
	  "crm": (_crm_kw, Constants.Search_Data_Crm, None, "loadCrm", "crm")
	}

	_search_ignores = dict(outlet_roles=_check_role_required)

	@classmethod
	def do_search(cls, params):
		""" do a search and load the current session table """
		data = cls._search(params,)

		# add entry tp re cache
		session.add(CacheQueue(
			objectid=params['userid'],
			objecttypeid=Constants.Cache_Search_List_Standard,
			customerid=params['customerid'],
			params=DBCompress.encode2(("o.outletname", "desc"))))

		# add entry to the log count of search's done
		session.add(CustomerAccessLog(customerid=params["prstate"].u.customerid,
			                            userid=params["prstate"].u.user_id,
			                            levelid=CustomerAccessLog.DOSEARCH,
			                            username=params["prstate"].u.user_name))
		return data

	@classmethod
	def do_search_count(cls, params):
		""" do a search and return the number of records found"""

		return cls._search(params, "countSession")

	@classmethod
	def _search(cls, params, procedure=None):
		""" basis search function
		the procedure is used to chnage the output """
		partial = int(params.get('search_partial', '0'))
		params["partial"] = partial
		customerid = -1 if "research" in params else params['customerid']
		criteriaset = ApiSearching._searchs[params.search_type]
		commands = PostGresSearch(customerid)
		for cri in criteriaset[0]:
			if cri[0] not in params or not len(params[cri[0]]):
				continue

			# criteria in actually used in the post phase and not the search phase
			# so it can be skipped at this point
			if ApiSearching._search_ignores.has_key(cri[0]) and \
			   ApiSearching._search_ignores[cri[0]](params.get(cri[0]), params):
				continue

			data = cri[2](params.get(cri[0]), params)
			command = PostGresSearchGroup(
				cri[1],
				data.data,
				data.logic,
				partial if cri[4] else 0,
				Constants.Search_And)
			command.type = criteriaset[1]
			commands.rows.append(command)
			if cri[3] != None:
				command.type = cri[3]

		searchtypeid = params.get("searchtypeid", Constants.Search_Standard_Type)
		# no criteria return no results
		if len(commands.rows) == 0:
			return SearchSession.getSessionCount(
				dict(userid=params['user_id'], searchtypeid=searchtypeid))


		# do actual search
		command = "SELECT * FROM %s(:data,:userid,:searchtypeid,:newsession,:searchby)" % criteriaset[3] if procedure == None else procedure
		data = SearchSession.sqlExecuteCommand(text(command),
									   dict(data=DBCompress.encode(commands),
											userid=params['userid'],
											searchtypeid=searchtypeid,
											newsession=params.mode,
											searchby=params.search_type),
									   BaseSql.SingleResultAsEncodedDict,
									   True)
		if criteriaset[2]:
			criteriaset[2](params.search_type, params)

		# need to add the data type to the result
		data["searchby"] = criteriaset[4]

		return data
