# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        SearchSession.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import logging
from sqlalchemy import Table
from sqlalchemy.sql import text
from turbogears import identity
from turbogears.database import  metadata, mapper, session
import prcommon.Constants as Constants
from prcommon.Const.Search_Queries import SearchSession_ListData, SearchSession_ListData_Ext, SearchSession_Api_ListData
from prcommon.model.identity import User
from prcommon.model.list import List
from prcommon.model.common import BaseSql
from prcommon.model.session import UserSession
from prcommon.model.caching import CacheStoreList
from prcommon.model.employee import Employee
from prcommon.model.lookups import SortOrder
from prcommon.model.advance import AdvanceFeaturesList

LOGGER = logging.getLogger("prmedia.model")

class SearchSession(BaseSql):
	""" Search session interface """
	SortFields = None
	SearchSession_Clear_Appended = "UPDATE userdata.searchsession SET appended = False WHERE userid = :userid AND searchtypeid =:searchtypeid"
	SearchSession_Delete = "DELETE FROM userdata.searchsession WHERE userid = :user_id AND searchtypeid =:searchtypeid"
	SearchSession_Count = "SELECT COUNT(*) FROM userdata.searchsession WHERE userid = :userid AND searchtypeid =:searchtypeid"
	SearchSession_Mark = "SELECT * FROM marksession(:userid,:searchtypeid, :markstyle)"
	SearchSession_Delete = "SELECT * FROM deletesession(:userid,:searchtypeid, :deleteoptions)"
	SearchSession_Move = "SELECT * FROM listtosession(:listid, :userid, :searchtypeid, :overwrite, :selected)"
	SearchSession_Move_Get_Sel = "SELECT * FROM listmoveselected(:userid, :searchtypeid, :overwrite, :selected, :listtypeid)"
	SearchSession_Count_All = "SELECT * FROM sessioncount(:searchtypeid,:userid)"
	SearchSession_MarkGroup = "SELECT * FROM sessionmarkgroup(:userid,:searchtypeid,:row_offset,:row_limit )"


	SearchSession_ListData_Single = "SELECT * FROM Search_Results_View_Standard AS s WHERE s.sessionsearchid  = :sessionsearchid "

	@classmethod
	def DeleteSelection(cls, userid, searchtypeid, deleteoptions):
		""" Delete selectected items"""

		def _rowcount(result):
			"internal"
			return result.rowcount

		return cls.sqlExecuteCommand(text(SearchSession.SearchSession_Delete),
									   dict(userid=userid,
											searchtypeid=searchtypeid,
											deleteoptions=deleteoptions),
									   _rowcount,
									   True)
	@classmethod
	def getCount(cls, params):
		""" get count info about session """
		def _rowcount(result):
			"internal"
			return result.fetchone()[0]
		return cls.sqlExecuteCommand(
			text(SearchSession.SearchSession_Count),
			params,
			_rowcount)

	@classmethod
	def getSessionCount(cls, params):
		" get session count info """
		return cls.sqlExecuteCommand(
			text(SearchSession.SearchSession_Count_All),
			params,
			BaseSql.SingleResultAsEncodedDict)

	@classmethod
	def getDisplayPage(cls, inkw):
		""" get a display grid"""
		params = SearchSession.getPageDisplayParams(inkw)

		sortfield = inkw.get("sort", "").strip("+").strip("-").strip()
		if sortfield == "contactname":
			params["sortby"] = "UPPER(familyname) %order%"
		elif sortfield == "outletid":
			params["sortby"] = "outletid %order%"
		elif sortfield == "sourcename":
			params["sortby"] = "sourcename %order%"
		else:
			params["sortby"] = params["sortby"].replace("UPPER(sortname)", "UPPER(s.sortname)")

		if "sortfield" in inkw:
			params["direction"] = inkw.get("direction", "asc")
			sortfield = inkw.get("sortfield", "")
			if sortfield == "outletname":
				params["sortby"] = "UPPER(s.outletname) %order%"
			elif sortfield == "outletid":
				params["sortby"] = "s.outletid %order%"
			elif sortfield == "contactname":
				params["sortby"] = "UPPER(familyname) %order%"
			elif sortfield == "sourcename":
				params["sortby"] = "sourcename %order%"
			else:
				params["sortby"] = params["sortby"].replace("UPPER(sortname)", "UPPER(s.sortname)")


		if "id" in inkw:
			params["sessionsearchid"] = inkw["id"]
			items = cls.sqlExecuteCommand(
				text(SearchSession.SearchSession_ListData_Single),
				params,
				BaseSql.ResultAsEncodedDict)

			return dict(
				numRows=SearchSession.getCount(params),
				items=items,
				identifier="sessionsearchid")

		data = CacheStoreList.getDisplayStore(
			params['customerid'],
			params['userid'],
			3,
			params['offset'],
			params['limit'])

		if data:
			return data
		else:
			orderby = params['sortby'].replace("%order%", params['direction'])
			query = SearchSession_ListData if not 'research' in inkw else SearchSession_ListData_Ext
			if 'apiview'in inkw:
				query = SearchSession_Api_ListData

			items = cls.sqlExecuteCommand(
				text(query % orderby),
				params,
				BaseSql.ResultAsEncodedDict)

			return dict(
				numRows=SearchSession.getCount(params),
				items=items,
				identifier="sessionsearchid")

	@classmethod
	def get_display_page_rest(cls, params):
		"""Gte rest page """

		return cls.grid_to_rest(
		  cls.getDisplayPage(params),
		  params["offset"],
		  False)

	@classmethod
	def getPageDisplayParams(cls, inkw):
		""" Get parameters for search display data page"""

		if not SearchSession.SortFields:
			SearchSession.SortFields = {}
			for row in session.query(SortOrder).filter_by().all():
				SearchSession.SortFields[row.sortorderid] = row.sortorderfieldname

		sortdefault = session.query(User.stdview_sortorder).filter_by(user_id=inkw["userid"]).one()[0]
		params = cls.getPageDispayStd(inkw, SearchSession.SortFields, sortdefault)
		if inkw.get("searchtypeid", "") not in ("-", "+"):
			params.searchtypeid = int(inkw.get("searchtypeid", "1"))

		return params

	@classmethod
	def moveListToSession(cls, listid, userid, searchtypeid, overwrite, selected, listtypeid, intrans=False):
		""" Move the list to the current session """

		if not intrans:
			transaction = cls.sa_get_active_transaction()

		try:
			if listid[0] == -1:
				# delete the existing session detials
				overwrite = 0
				cls.Delete(userid, searchtypeid, -1)
				# append all the list in to the session
				cls.sqlExecuteCommand(
					text(SearchSession.SearchSession_Move_Get_Select),
					dict(
					    userid=userid,
					    searchtypeid=searchtypeid,
					    overwrite=overwrite,
					    selected=selected,
				      listtypeid=listtypeid),
					None,
					True)
				# set to 1 to make ssure all the appends are deleted
				overwrite = 1
				# remove link from list to search area
				UserSession.setListNoTrans(userid, None)
			else:
				for listnbr in listid:
					if listnbr == 0:
						continue

					cls.sqlExecuteCommand(
						text(SearchSession.SearchSession_Move),
						dict(listid=listnbr,
					       userid=userid,
					       searchtypeid=searchtypeid,
					       overwrite=overwrite,
					       selected=selected),
						None,
						True)
				# setip
				if len(listid) == 2:
					UserSession.setListNoTrans(userid, listid[0])

			if overwrite:
				cls.sqlExecuteCommand(
				text(SearchSession.SearchSession_Clear_Appended),
				dict(userid=userid, searchtypeid=searchtypeid),
				None)

			data = cls.getSessionCount(
			  dict(userid=identity.current.user.user_id,
			       searchtypeid=Constants.Search_Standard_Type))
			if not intrans:
				transaction.commit()
			return data
		except:
			LOGGER.exception("moveListToSession")
			if not intrans:
				transaction.rollback()
			raise

	@classmethod
	def Mark(cls, userid, searchtypeid, markstyle):
		""" Mark the entries in the search session and return the control data """
		# change marks returns counts
		count = cls.sqlExecuteCommand(
			text(SearchSession.SearchSession_Mark),
			dict(userid=userid,
		       searchtypeid=searchtypeid,
		       markstyle=markstyle),
			BaseSql.ResultAsEncodedDict,
			True)[0]
		# capture the marked entries
		marked = session.query(SearchSession.sessionsearchid).\
			   filter_by(userid=userid, searchtypeid=searchtypeid,
							selected=True).all()
		# return dict info
		return dict(count=count, marked=marked, markstyle=markstyle)


	@classmethod
	def MarkGroup(cls, inkw):
		""" Mark a group of row in the search result buffer"""

		transaction = cls.sa_get_active_transaction()

		try:
			data = cls.sqlExecuteCommand(
			  text(SearchSession.SearchSession_MarkGroup),
			  inkw,
			  BaseSql.ResultAsEncodedDict)[0]

			transaction.commit()
			return data
		except:
			LOGGER.exception("MarkGroup")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def Delete(cls, userid, searchtypeid, deleteoptions):
		""" Delete entries from the list depending on the user options """
		return cls.sqlExecuteCommand(
			text(SearchSession.SearchSession_Delete),
			dict(userid=userid,
		       searchtypeid=searchtypeid,
		       deleteoptions=deleteoptions),
		  BaseSql.ResultAsEncodedDict,
		  True)[0]

	@classmethod
	def applyTags(cls, params):
		""" Apply tags to the search results """
		command = "SELECT * FROM listapplytags(:userid,:searchtypeid,ARRAY[%s],:selected, :applyto )" %\
		(",".join([str(row) for row in params['interests']]), )
		return cls.sqlExecuteCommand(
			text(command),
			params,
			BaseSql.ResultAsEncodedDict,
			True)[0]

	@classmethod
	def DeDuplicates(cls, inkw):
		""" execute the deduplidate process """

		return cls.sqlExecuteCommand(
			text("SELECT * FROM sessiondeduplicate(:userid,:searchtypeid,:deduplicateby )"),
			inkw,
			BaseSql.ResultAsEncodedDict,
			True)[0]

	EmployeeExists_Command = """SELECT s.sessionsearchid
	FROM userdata.searchsession as s
	JOIN outlets AS o ON o.outletid = s.outletid
	LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND s.customerid = oc.customerid
	WHERE
		s.userid = :userid AND
		s.searchtypeid= :searchtypeid AND
		(s.employeeid = :employeeid OR
			( s.employeeid IS NULL AND COALESCE( oc.primaryemployeeid,o.primaryemployeeid)= :employeeid ))"""

	@classmethod
	def EmployeeExists(cls, inkw):
		""" Checkt to see if an employee is in the search results"""

		success = cls.sqlExecuteCommand(
			text(SearchSession.EmployeeExists_Command),
			inkw,
			BaseSql.ResultExists)

		return success

	@classmethod
	def EmployeeAddTOSession(cls, inkw):
		""" Add a new record into the system for this employee
		return a new object of details that the same as the page
		"""
		sessionsearchid = None
		transaction = session.begin(subtransactions=True)
		try:
			employee = Employee.query.get(inkw['employeeid'])
			searchentry = SearchSession(
			  userid=inkw['userid'],
			  searchtypeid=inkw.get('searchtypeid', Constants.Search_Standard_Type),
			  outletid=employee.outletid,
			  employeeid=inkw['employeeid'],
			  customerid=inkw['customerid'])
			session.add(searchentry)
			session.flush()
			sessionsearchid = searchentry.sessionsearchid
			transaction.commit()
		except:
			LOGGER.exception("EmployeeAddTOSession")
			transaction.rollback()
			raise
		return sessionsearchid

	@classmethod
	def EmployeeDelete(cls, inkw):
		""" Delete entries from the list based on user id
		need to return list of delete id's so we can delety them from the view
		"""
		# get a list of the id's that need to be deleted
		data = cls.employeeWhereUsed(inkw)
		if data:
			# now we need to do the delete
			# build command
			command = "DELETE FROM userdata.searchsession  WHERE  sessionsearchid IN (%s)" % ",".join([str(row[0]) for row in data])
			cls.sqlExecuteCommand(
				text(command),
				None,
				None,
				True)

		return data

	@classmethod
	def getStringSearchSessionRow(cls, sessionsearchid):
		""" return a single line of the  grid"""
		return cls.sqlExecuteCommand(text(SearchSession.SearchSession_ListData_Single),
									   dict(sessionsearchid=sessionsearchid),
									   BaseSql.SingleResultAsEncodedDict,
									   False)

	@classmethod
	def EmployeeExistsElseWhere(cls, inkw):
		""" employe where used """
		result = cls.sqlExecuteCommand(
			text(SearchSession.EmployeeExists_Command),
			inkw,
			BaseSql.ResultAsEncodedDict)
		# now take out row that ==sessionsearchid length of left
		ret = False
		for row in result:
			if row['sessionsearchid'] == inkw['sessionsearchid']:
				continue
			ret = True

		return ret

	@classmethod
	def updateEmployeeOnRow(cls, employeeid, sessionsearchid):
		""" change  the employee on a specific row """
		transaction = session.begin(subtransactions=True)
		try:
			searchsession = SearchSession.query.get(sessionsearchid)
			searchsession.employeeid = employeeid
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("updateEmployeeOnRow")
			transaction.rollback()
			raise

	Employee_Where_Used = """
	SELECT s.sessionsearchid
	FROM userdata.searchsession AS s
	JOIN outlets AS o ON o.outletid = s.outletid
	WHERE
		s.searchtypeid =:searchtypeid and s.userid = :userid AND
		( employeeid = :employeeid OR ( employeeid IS NULL and o.primaryemployeeid = :employeeid )) """

	@classmethod
	def employeeWhereUsed(cls, inkw):
		""" returns a list of where the employee is used on the search sessoion"""
		inkw['searchtypeid'] = Constants.Search_Standard_Type

		return cls.sqlExecuteCommand(
			text(SearchSession.Employee_Where_Used),
			inkw,
			BaseSql.ResultAsList)

	@classmethod
	def outlet_where_used(cls, inkw):
		""" returns a list of where the outlets is used on the search sessoion"""

		return [row[0] for row in session.query(SearchSession.sessionsearchid).filter_by(
			outletid=inkw['outletid'],
			userid=inkw['userid'],
			searchtypeid=Constants.Search_Standard_Type if not inkw.has_key("searchtypeid") else inkw["searchtypeid"]).all()]

	# employee role on session
	Update_Employee_From_Role = """UPDATE userdata.searchsession as s
	SET employeeid = epr.employeeid
	FROM employeeprmaxroles AS epr
	WHERE epr.outletid = s.outletid AND epr.prmaxroleid = :prmaxroleid
	AND s.userid = :userid AND s.searchtypeid = :searchtypeid
	AND SELECTION(s.selected, :selected) = true
	AND IFNULL(s.employeeid,-1) NOT IN ( SELECT employeeid FROM employeeprmaxroles WHERE prmaxroleid = :prmaxroleid)"""

	Update_Employee_Set_Primary = """UPDATE userdata.searchsession as s
	SET employeeid = o.primaryemployeeid
	FROM outlets AS o
	WHERE o.outletid = s.outletid
	AND s.userid = :userid AND s.searchtypeid = :searchtypeid"""

	Delete_Dedupe = "select * from sessiondeleteduplidate(:userid,:searchtypeid)"

	@classmethod
	def ApplyRoleTOSession(cls, inkw):
		""" apply a list of job titles to the current search session """

		# have an issue with duplicate as this point !!!
		transaction = cls.sa_get_active_transaction()
		try:
			# check to see if the default flag has been set ?
			# if yet then re-set all the outlets to the default value
			# could potentially create duplicates

			if inkw.get("deduplicate"):
				cls.sqlExecuteCommand(
				text(SearchSession.Delete_Dedupe),
					inkw,
					None)

			if inkw.has_key("setprimary"):
				# remove duplciate ?
				cls.sqlExecuteCommand(
					text(SearchSession.Update_Employee_Set_Primary),
					inkw,
					None)

			if inkw["roles"]:
				cls._ApplyRoles(inkw["roles"], inkw)

			transaction.commit()
		except:
			LOGGER.error("ApplyRoleTOSessions")
			transaction.rollback()
			raise

	@classmethod
	def _ApplyRoles(cls, roles, inkw):
		""" Apply the roles to the outlets """
		roles["data"].reverse()
		for prmaxroleid in roles["data"]:
			inkw["prmaxroleid"] = prmaxroleid
			cls.sqlExecuteCommand(
			  text(SearchSession.Update_Employee_From_Role),
			  inkw,
			  None)

	__Primary_Contact_Find = """
	SELECT sessionsearchid
	FROM userdata.searchsession AS s
	JOIN outlets AS o ON o.outletid = s.outletid
	WHERE s.employeeid IS NULL AND o.primaryemployeeid = :employeeid AND
		s.searchtypeid = :searchtypeid AND s.userid = :userid"""

	@classmethod
	def getWhereUsedEmployee(cls, employeeid, searchtypeid, userid):
		""" this will return a single sessionid """

		data = session.query(SearchSession).filter_by(userid=userid,
		                                              employeeid=employeeid,
		                                              searchtypeid=searchtypeid).all()
		if not data:
			data = session.execute(text(SearchSession.__Primary_Contact_Find),
			                       dict(employeeid=employeeid,
			                            searchtypeid=searchtypeid,
			                            userid=userid),
			                       cls).fetchall()
			if data:
				return data[0][0]
			else:
				return None
		else:
			return data[0].sessionsearchid

	@classmethod
	def do_delete_row(cls, searchsessionid):
		""" Delete a search session record  """

		transaction = cls.sa_get_active_transaction()
		try:
			searchsession = SearchSession.query.get(searchsessionid)
			if searchsession:
				session.delete(searchsession)

			transaction.commit()
		except:
			LOGGER.exception("do_delete_row")
			transaction.rollback()
			raise

class PrmaxCommon(BaseSql):
	""" common operations """
	Table_Mapping = {
		1 : ("userdata.searchsession", "sessionsearchid", None),
		2 : ("userdata.list", "listid", "listmaintselectupdate"),
		3 : ("internal.prmaxroles", "prmaxroleid", None),
	  4 : ("userdata.listmembers", "listmemberid", None),
	  5 : ("userdata.advancefeatureslistmembers", "advancefeatureslistmemberid", None),
		6 : ("userdata.advancefeatureslist", "advancefeatureslistid", "advancelistmaintselectupdate"),
	  7 : ("userdata.collateral", "collateralid", "listcollateralselectupdate"),
	}

	Field_Update = """ UPDATE %s set %s=:value WHERE %s=:key"""

	@classmethod
	def updateField(cls, inkw):
		""" update a field """
		tmap = PrmaxCommon.Table_Mapping[inkw['tableid']]
		if tmap[2]:
			inkw['value'] = True if inkw['value'] == 'true' else False
			inkw['key'] = int(inkw['key'])
			success = cls.sqlExecuteCommand(
				text("SELECT * FROM %s(:key, :userid, :value)" % tmap[2]),
				inkw,
				None)
		else:
			success = cls.sqlExecuteCommand(
				text(PrmaxCommon.Field_Update % (tmap[0], inkw['attribute'], tmap[1])),
				inkw,
				None)

		if inkw['tableid'] == 1:
			data = SearchSession.getSessionCount(
				dict(userid=inkw['user_id'],
					 searchtypeid=Constants.Search_Standard_Type))
		elif inkw['tableid'] == 2:
			data = List.getListMaintCount(inkw)
		elif inkw['tableid'] == 5:
			# advance ;ist
			data = AdvanceFeaturesList.getCount(inkw)
		elif inkw['tableid'] == 6:
			# advance list of list
			data = AdvanceFeaturesList.getListMaintCount(inkw['customerid'], inkw['user_id'])
		else:
			data = {}

		return dict(success=success, data=data)

########################################################
SearchSession.mapping = Table('searchsession', metadata, autoload=True, schema='userdata')
PrmaxCommon.mapping = Table('addresses', metadata, autoload=True)

mapper(PrmaxCommon, PrmaxCommon.mapping)
mapper(SearchSession, SearchSession.mapping)
