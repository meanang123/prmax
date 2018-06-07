# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        list.py
# Purpose:     Hold all the logic to interact with the users standing list
#  List have an interesting delete issue with public data when a outlet record
#  is delete and it's on a activity list we need to keep the outlet put mark it as s
#  delete and remove it from all the searchs !!! as well as deleteing it from all
#  the standing lists
#
# Author:      Chris Hoy (over greenland ice cap)
#
# Created:     14/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table,  func, text, not_
from prcommon.model.common import BaseSql
from prcommon.model.lookups import SortOrder
import prcommon.Constants as Constants
import logging

LOGGER = logging.getLogger("prcommon.model")

class List(BaseSql):
	""" Class that handles the control of the lsit system """
	Where_Used_Data = """SELECT l.listid, l.listname, lt.listtypedescription, l.update_time
	FROM
	userdata.listmembers as lm
	JOIN userdata.list as l ON l.listid = lm.listid
	JOIN outlets as o ON o.outletid = lm.outletid AND lm.outletid = ( SELECT outletid from employees WHERE employeeid = :employeeid LIMIT 1)
	JOIN internal.listtypes AS lt ON lt.listtypeid = l.listtypeid

	WHERE ( ( lm.employeeid = :employeeid) OR ( lm.employeeid IS NULL AND o.primaryemployeeid=:employeeid)) AND l.customerid = :customerid
	GROUP BY  l.listid, l.listname, lt.listtypedescription, l.update_time
	ORDER BY  %s %s
	LIMIT :limit OFFSET :offset
	"""
	Where_Used_Data_Count = """SELECT COUNT(*) FROM (SELECT l.listid, l.listname, lt.listtypedescription, l.update_time
	FROM
	userdata.listmembers as lm
	JOIN userdata.list as l ON l.listid = lm.listid
	JOIN outlets as o ON o.outletid = lm.outletid AND lm.outletid = ( SELECT outletid from employees WHERE employeeid = :employeeid LIMIT 1)
	JOIN internal.listtypes AS lt ON lt.listtypeid = l.listtypeid

	WHERE ( ( lm.employeeid = :employeeid) OR ( lm.employeeid IS NULL AND o.primaryemployeeid=:employeeid)) AND l.customerid = :customerid
	GROUP BY  l.listid, l.listname, lt.listtypedescription, l.update_time) AS t """

	Command_List_Data = """SELECT CASE WHEN o.selected is NULL THEN false ELSE o.selected END as selected,l.listname as name, l.listid as listid FROM userdata.list as l left outer join userdata.listusers as o ON o.listid = l.listid AND o.userid = :userid  WHERE l.customerid = :customerid ORDER BY l.listname LIMIT :limit OFFSET :offset"""
	Command_List_Count = """SELECT COUNT(*) FROM userdata.list  WHERE customerid = :customerid AND listname ILIKE :listname %s"""
	Command_List_GetByName = """SELECT listid,listname FROM userdata.list  WHERE customerid = :customerid AND listname ILIKE :listname"""
	Command_List_Update_Members = """SELECT * FROM saveToList(:listid,:userid,:searchtypeid,:overwrite,:selected)"""
	Command_List_Delete = """DELETE FROM userdata.list WHERE listid= :listid"""
	Command_List_Delete_Selection = """SELECT * FROM listdeleteselection(:userid, :listtypeid)"""
	Command_List_Duplicate = """SELECT * FROM listduplicate(:listid, :listname, :customerid)"""
	Command_List_Refesh = """SELECT list_refresh(:listid)"""

	Command_List_Info = """
	SELECT l.listid, l.listname,l.clientid,
	(SELECT COUNT(*) FROM userdata.listmembers WHERE listid=:listid ) as nbr,  (SELECT COUNT(*) FROM userdata.listmembers WHERE listid = l.listid AND selected=true ) as selectednbr,
	COALESCE((SELECT COUNT(*) FROM userdata.listmembers AS lm JOIN employees AS e ON e.employeeid  = lm.employeeid WHERE lm.listid = l.listid AND e.prmaxstatusid = 2),0) as nbr_deleted,
	l.emailtemplateid
	FROM userdata.list AS l WHERE listid=:listid"""

	Command_List_Count_All = """SELECT * FROM listmaintcount(:customerid,:userid,:listtypeid)"""
	Command_List_Rename = """UPDATE userdata.list set listname=:listname WHERE listid= :listid"""
	Command_List_Project_To_Add = """SELECT p.projectid,p.projectname FROM userdata.projects as p WHERE  p.customerid=:customerid AND p.projectid NOT IN (select  projectid FROM userdata.projectmembers WHERE listid=:listid) AND projectname ilike :projectname ORDER BY p.projectname LIMIT :limit OFFSET :offset"""
	Command_List_List_Selection = """SELECT l.listid FROM userdata.list as l JOIN userdata.listusers as lu ON lu.listid = l.listid AND lu.userid = :userid WHERE l.customerid = :customerid AND lu.selected=true AND l.listtypeid = :listtypeid"""

	Command_List_Data_Grid = """SELECT l.listname, l.listid,CASE WHEN lu.selected=true THEN true ELSE false END as selected,
	(SELECT COUNT(*)  FROM userdata.listmembers WHERE listid = l.listid) as qty,
	lt.listtypedescription,
	COALESCE((SELECT COUNT(*) FROM userdata.listmembers AS lm JOIN employees AS e ON e.employeeid  = lm.employeeid WHERE listid = l.listid  AND e.prmaxstatusid = 2),0) as nbr_deleted,
	cl.clientname,
	l.clientid
	FROM userdata.list as l
	LEFT OUTER JOIN userdata.listusers AS lu ON lu.listid = l.listid AND userid = :userid
	LEFT OUTER JOIN userdata.client AS cl ON l.clientid = cl.clientid
	JOIN internal.listtypes AS lt ON lt.listtypeid = l.listtypeid
	WHERE l.customerid = :customerid %s ORDER BY %s %s  LIMIT :limit OFFSET :offset"""
	Command_List_Data_Grid_Count = """SELECT COUNT(*) FROM userdata.list  WHERE customerid = :customerid %s"""

	Command_List_Data_Grid_Single  = """SELECT l.listname, l.listid,CASE WHEN lu.selected=true THEN true ELSE false END as selected,
	(SELECT COUNT(*)  FROM userdata.listmembers WHERE listid = l.listid) as qty,
	lt.listtypedescription,
	l.update_time,
	COALESCE((SELECT COUNT(*) FROM userdata.listmembers AS lm JOIN employees AS e ON e.employeeid  = lm.employeeid WHERE listid = l.listid  AND e.prmaxstatusid = 2),0) as nbr_deleted
	FROM userdata.list as l LEFT OUTER JOIN userdata.listusers as lu ON lu.listid = l.listid AND userid = :userid JOIN internal.listtypes AS lt ON lt.listtypeid = l.listtypeid WHERE l.listid = :id"""

	Command_List_Data_Grid_byName  = """SELECT l.listname, l.listid,CASE WHEN lu.selected=true THEN true ELSE false END as selected,
	(SELECT COUNT(*)  FROM userdata.listmembers WHERE listid  = l.listid) as qty,
	lt.listtypedescription,
	l.update_time,
	COALESCE((SELECT COUNT(*) FROM userdata.listmembers AS lm JOIN employees AS e ON e.employeeid  = lm.employeeid WHERE listid = l.listid  AND e.prmaxstatusid = 2),0) as nbr_deleted,
	cl.clientname
	FROM userdata.list as l
	LEFT OUTER JOIN userdata.listusers as lu ON lu.listid = l.listid AND userid = :userid
	LEFT OUTER JOIN userdata.client AS cl ON cl.clientid = l.clientid
	JOIN internal.listtypes AS lt ON lt.listtypeid = l.listtypeid
	WHERE l.listname ilike :listname AND l.customerid = :customerid """

	Command_List_Order_by = """ORDER BY %s %s  LIMIT :limit OFFSET :offset"""
	Command_List_Data_Grid_byName_Count  = """SELECT COUNT(*) FROM userdata.list as l WHERE l.listname ilike :listname AND l.customerid = :customerid"""

	@classmethod
	def getPageList(cls, kw):
		""" getPageList """
		data = cls.sqlExecuteCommand (
			text(List.Command_List_Data) ,
			kw,
			BaseSql.ResultAsEncodedDict)

		numRows = cls.sqlExecuteCommand (
			text(List.Command_List_Count%("",)) ,
			kw,
			cls.singleFieldInteger)

		return dict (
			numRows = numRows,
			items = data,
			identifier = "listid")

	@classmethod
	def get_rest_page(cls,  params):
		"""List of list for rest controller """

		single = True if "listid" in params else False
		return cls.grid_to_rest ( cls.getPageListGrid ( params ),
		                          params['offset'],
		                          single )

	@classmethod
	def getPageListGrid( cls, kw):
		""" getPageListGrid """
		params = cls.getPageDispayStd2(kw, "UPPER(listname)", {"listname":"UPPER(listname)"})
		whereclause = ""
		whereclausecount = ""
		if kw.has_key("projectid"):
			whereclause += " AND l.listid IN (SELECT listid from userdata.projectmembers WHERE projectid = :projectid) "
			whereclausecount += " AND listid IN (SELECT listid from userdata.projectmembers WHERE projectid = :projectid) "
			params['projectid'] = kw['projectid']

		if kw.has_key("listtypeid"):
			whereclause += " AND l.listtypeid = %d" % int ( kw["listtypeid"] )
			whereclausecount += " AND listtypeid = %d" % int ( kw["listtypeid"] )

		if "listname_filter" in kw:
			whereclause += " AND l.listname ilike :listname_filter"
			whereclausecount += " AND listname ilike :listname_filter"
			params["listname_filter"] = "%" + kw["listname_filter"] + "%"

		if "clientid" in kw:
			whereclause += " AND l.clientid = :clientid"
			whereclausecount += " AND clientid = :clientid"
			params["clientid"] = int(kw["clientid"])

		if "id" in kw:
			# single row
			data = cls.sqlExecuteCommand (
				text(List.Command_List_Data_Grid_Single),
				kw,
				BaseSql.ResultAsEncodedDict)
			numRows = len(data)
		elif kw.has_key("listname"):
			data = cls.sqlExecuteCommand (
				text(List.Command_List_Data_Grid_byName + whereclause +  (List.Command_List_Order_by % (params['sortby'], params['direction']))),
				params,
				BaseSql.ResultAsEncodedDict)
			numRows = cls.sqlExecuteCommand (
				text(List.Command_List_Data_Grid_byName_Count +whereclausecount),
				params,
				BaseSql.ResultAsEncodedDict)[0]['count']
		else:
			data = cls.sqlExecuteCommand (
				text(List.Command_List_Data_Grid %(whereclause,
												   params['sortby'],
												   params['direction'])),
				params,
				BaseSql.ResultAsEncodedDict)

			numRows = cls.sqlExecuteCommand (
				text(List.Command_List_Data_Grid_Count%(whereclausecount,)) ,
				params,
				BaseSql.ResultAsEncodedDict)[0]['count']

		return dict ( numRows = numRows,
					  items = data,
					  identifier = "listid")

	@classmethod
	def getByName( cls, customerid , listname ) :
		""" getByName """
		data = cls.sqlExecuteCommand (
			text(List.Command_List_GetByName) ,
			dict( customerid=customerid,listname=listname.lower()),
			BaseSql.ResultAsEncodedDict)

		return data[0]['listid'] if len(data) else -1

	@classmethod
	def get(cls, listid ):
		""" get the details of a list record """

		record = List.query.get(listid)
		ret = dict(listid = record.listid, listname = record.listname,
		           clientname = "",
		           clientid = record.clientid,
		           qty = 0)

		tmp = session.query(func.count()).filter(ListMembers.listid == listid).all()
		if tmp and tmp[0]:
			ret["qty"] = tmp[0][0]

		if record.clientid:
			from prcommon.model.client import Client
			client = Client.query.get(record.clientid)
			ret["clientname"] = client.clientname

		return ret

	@classmethod
	def add_list( cls, customerid, listname,  clientid) :
		""" add a new list too thesystem   """

		transaction = cls.sa_get_active_transaction()
		try:
			clientid = None if clientid == -1 else clientid

			record = List(customerid = customerid,
			         listname = listname,
			         clientid = clientid )
			session.add(record)
			session.flush()
			transaction.commit()
			return cls.get(record.listid )
		except:
			LOGGER.exception("add_list")
			transaction.rollback()
			raise

	@classmethod
	def add_list_add_results( cls, params ) :
		""" add a new list too thesystem   """

		transaction = cls.sa_get_active_transaction()
		try:
			# add list
			clientid = None if params["clientid"] == -1 else params["clientid"]
			record = List(customerid = params["customerid"],
			         listname = params["listname"],
			         clientid = clientid )
			session.add(record)
			session.flush()

			# load content of the list
			data = cls.sqlExecuteCommand (
			  text(List.Command_List_Update_Members) ,
			  dict( listid = record.listid,
			        userid = params["userid"],
			        overwrite = 1,
			        searchtypeid = Constants.Search_Standard_Type,
			        selected = params["selection"]),
			  BaseSql.ResultAsEncodedDict,
			  True)[0]
			transaction.commit()

			return data
		except:
			LOGGER.exception("add_list_add_results")
			transaction.rollback()
			raise

	__AddToStanding = """INSERT INTO userdata.listmembers(listid,outletid,employeeid)
	SELECT :listid,outletid,employeeid FROM userdata.listmembers
	WHERE listid = (SELECT listid FROM userdata.emailtemplates WHERE emailtemplateid = :emailtemplateid )
	GROUP BY outletid,employeeid"""

	__List_Count = """(SELECT COUNT(*) FROM userdata.listmembers WHERE listid=:listid )"""

	@classmethod
	def addFromDistribution( cls, customerid, listname, emailtemplateid) :
		""" add a new list and fill it with the result of a distribution  """

		transaction = cls.sa_get_active_transaction()

		try:
			l = List(customerid = customerid, listname = listname)
			session.add(l)
			session.flush()
			# now we need too add too the list
			session.execute( text ( List.__AddToStanding) ,
			                 dict(listid = l.listid, emailtemplateid = emailtemplateid ) ,
			                 cls )

			qty = cls.sqlExecuteCommand ( text ( List.__List_Count) ,
			                              dict ( listid = l.listid ) ,
			                              BaseSql.singleFieldInteger )

			transaction.commit()
			l.qty = qty
			return l
		except:
			LOGGER.exception("addFromDistribution")
			transaction.rollback()
			raise

	@classmethod
	def addToList(cls, listid, overwrite, selected, userid, searchtypeid):
		""" add a search session to a specific list use the selection
		to determine which record should be moved"""

		return cls.sqlExecuteCommand (
			text(List.Command_List_Update_Members) ,
			dict( listid = listid,
				  userid = userid,
				  overwrite = overwrite,
				  searchtypeid = searchtypeid,
				  selected = selected),
			BaseSql.ResultAsEncodedDict,
			True)[0]

	@classmethod
	def listDelete(cls, listid):
		""" Delete a list from the system"""
		return cls.sqlExecuteCommand (
			text(List.Command_List_Delete) ,
			dict(listid = listid),
			None,
			True)

	@classmethod
	def listDeleteSelection(cls, kw):
		""" Delete a list from the system"""
		return cls.sqlExecuteCommand (
			text(List.Command_List_Delete_Selection) ,
			kw,
			None,
			True)

	@classmethod
	def listSelection(cls, kw ):
		""" Select a list """
		return cls.sqlExecuteCommand (
			text(List.Command_List_List_Selection) ,
			kw,
			BaseSql.ResultAsList,
			True)



	@classmethod
	def listDuplicate(cls, listid, listname, customerid):
		""" create a copy of a list"""
		return cls.sqlExecuteCommand (
			text(List.Command_List_Duplicate) ,
			dict(listid = listid,
				 listname = listname,
				 customerid = customerid),
			BaseSql.ResultAsEncodedDict,
			True)

	@classmethod
	def getDetails(cls, listid):
		""" get the details about a specific list """
		return cls.sqlExecuteCommand (
			text(List.Command_List_Info) ,
			dict(listid = listid),
			cls._singleResultAsDict)

	@classmethod
	def Exits( cls, customerid, listname):
		""" Exits"""
		result = session.query(List.listid).filter_by(customerid = customerid,
													  listname = listname)
		return True if result.count() else False

	@classmethod
	def rename(cls, customerid, listid, listname, clientid):
		""" Rename a list """

		try:
			transaction = cls.sa_get_active_transaction()

			record = List.query.get( listid )
			record.listname = listname
			record.clientid = None if clientid == -1 else clientid

			transaction.commit()
		except:
			LOGGER.exception("list_rename")
			raise

	@classmethod
	def getListMaintCount(cls, kw):
		""" get information about the list selected """

		return cls.sqlExecuteCommand(
			text(List.Command_List_Count_All),
			kw,
			BaseSql._singleResultAsDict)

	@classmethod
	def getProjectSelectList(cls, listid, customerid, name, count,  start):
		""" getProjectSelectList """
		return cls.sqlExecuteCommand(
			text(List.Command_List_Project_To_Add),
			dict(listid = listid,
				 customerid = customerid,
				 projectname=name.replace("*","")+"%",
				 name = name,
				 limit = count,
				 offset= start ),
			BaseSql.ResultAsEncodedDict)

	@classmethod
	def get_where_used(cls, params):
		""" where used data  """

		if "employeeid" in params and params["employeeid"] != "-1":
			params["employeeid"] =  int(params["employeeid"])
			return BaseSql.getGridPage(
			  params,
			  'l.listname',
			  'listid',
			  List.Where_Used_Data,
			  List.Where_Used_Data_Count,
			  cls )
		else:
			return dict (
			  numRows = 0,
			  items = [],
			  identifier = "listid")

	Select_Release_Data = """SELECT
        l.listid, l.listname, lt.listtypedescription,
        (SELECT COUNT(*) FROM userdata.listmembers AS lm WHERE lm.listid = l.listid) AS qty,
        c.clientname
    FROM userdata.list AS l
    JOIN internal.listtypes AS lt ON l.listtypeid = lt.listtypeid
    LEFT OUTER JOIN userdata.client AS c ON c.clientid = l.clientid
    WHERE l.customerid = :customerid AND
        l.listid NOT IN (select listid FROM userdata.emailtemplatelist WHERE emailtemplateid = :emailtemplateid) AND
        l.listtypeid = 1 %s
        ORDER BY   %s %s
        LIMIT :limit OFFSET :offset"""
	Select_Release_Data_Count = """SELECT COUNT(*) FROM userdata.list AS l
	WHERE l.customerid = :customerid AND
		l.listid NOT IN (select listid FROM userdata.emailtemplatelist WHERE emailtemplateid = :emailtemplateid) AND
		l.listtypeid = 1 %s"""

	@classmethod
	def get_selected_for_release(cls, kw):
		""" List of list that need to be selected for this list """

		from prcommon.model.emails import EmailTemplates

		if kw.has_key("emailtemplateid"):
			emailtemplate = EmailTemplates.query.get(kw['emailtemplateid'])
			sortname = "UPPER(listname)"
			direction = "ASC"
			if kw.has_key("sort") and len(kw["sort"]) :
				if kw["sort"][0] == "-":
					direction = "ASC"
					sortname = kw["sort"][1:]
				else:
					direction = "DESC"
					sortname = kw["sort"]
			if sortname == "listname":
				sortname = "UPPER(listname)"

			if emailtemplate and emailtemplate.clientid != None:
				kw['clientid'] = emailtemplate.clientid
				query = List.Select_Release_Data % ('AND l.clientid = :clientid', sortname, direction)
				query_count = List.Select_Release_Data_Count % ('AND l.clientid = :clientid')
			elif emailtemplate and emailtemplate.clientid == None:
				query = List.Select_Release_Data % ('', sortname, direction)
				query_count = List.Select_Release_Data_Count % ('')

			data = cls.sqlExecuteCommand (
				text(query) ,
				kw,
				BaseSql.ResultAsEncodedDict)

			numRows = cls.sqlExecuteCommand (
				text(query_count) ,
				kw,
				cls.singleFieldInteger)
		else:
			data = []
			numRows = 0

		return dict (
			numRows = numRows,
			items = data,
			identifier = "listid")

	@classmethod
	def refresh(cls, kw, use_transaction = True):
		""" refresh a list """

		try:
			if use_transaction:
				transaction = cls.sa_get_active_transaction()

			cls.sqlExecuteCommand (
			  text(List.Command_List_Refesh) ,
			  dict(listid = kw["listid"]))
			if use_transaction:
				transaction.commit()
		except:
			LOGGER.exception("List refresh: %s")
			if use_transaction:
				transaction.rollback()
			raise

	@classmethod
	def do_exclusion(cls, listid, customerid):
		""" remove the exclustion from a list """

		data = session.execute (text ( "SELECT * FROM list_exclusion(:listid,:customerid)") ,
		                        dict(listid = listid, customerid = customerid),
		                        cls ).fetchall()
		rvalue = data[0][0]
		return rvalue

class ListMembers(BaseSql):
	""" a entry in a list"""

	SortFields = None
	View_Data = """SELECT lm.*,
	get_override(occ_c.email, e_c.email,oc_c.email, o_c.email) as email, false as selected
	FROM ListMember_View as lm
	JOIN userdata.list as l ON lm.listid = l.listid
	JOIN outlets AS o ON lm.outletid = o.outletid
	JOIN communications as o_c ON o.communicationid = o_c.communicationid
	LEFT OUTER JOIN outletcustomers as oc ON lm.outletid = oc.outletid AND l.customerid = oc.customerid
	LEFT OUTER JOIN communications as oc_c ON oc.communicationid = oc_c.communicationid
	LEFT OUTER JOIN employees AS e ON e.employeeid = COALESCE(lm.employeeid, o.primaryemployeeid)
	LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
	LEFT OUTER JOIN communications as e_c ON e.communicationid = e_c.communicationid
	LEFT OUTER JOIN employeecustomers as occ ON e.employeeid = occ.employeeid AND l.customerid = occ.customerid
	LEFT OUTER JOIN communications as occ_c ON occ_c.communicationid = occ.communicationid
	WHERE lm.listid = :listid
	ORDER BY %s
	LIMIT :limit OFFSET :offset"""

	View_Data_Count = """SELECT COUNT(*) FROM ListMember_View as lm WHERE lm.listid = :listid """

	@classmethod
	def getSortCommand(cls, kw):
		"""get the correct sort order """

		if not ListMembers.SortFields :
			ListMembers.SortFields = {}
			for row in session.query(SortOrder).filter_by().all():
				ListMembers.SortFields[row.sortorderid] = row.sortorderfieldname

		sortfield = ListMembers.SortFields[6]
		direction = "ASC"
		if kw.has_key("sort") and kw["sort"]:
			if kw["sort"][0] == "-":
				direction = "DESC"
			sortfield = kw["sort"].replace("-","")
			if sortfield == "contactname":
				sortfield = "UPPER(lm.familyname) %order%, UPPER(lm.firstname) %order%"
			for data in ListMembers.SortFields.values():
				if data.startswith(sortfield):
					sortfield = data
					break

		return sortfield.replace("%order%", direction)

	@classmethod
	def get_selected_for_release(cls, params):
		""" List of list that need to be selected for this list """

		if "listid" in params:
			sortorder = cls.getSortCommand(params).replace("UPPER(sortname)", "UPPER(lm.sortname)")
			data = cls.sqlExecuteCommand (
				text(ListMembers.View_Data % sortorder) ,
				params,
				BaseSql.ResultAsEncodedDict)

			numrows = cls.sqlExecuteCommand (
				text(ListMembers.View_Data_Count) ,
				params,
				cls.singleFieldInteger)
		else:
			data = []
			numrows = 0

		return dict (
			numRows = numrows,
			items = data,
			identifier = "listmemberid")


	@classmethod
	def getFirstRecord(cls, params ):
		""" get the first record from the list """
		if "listid" in params:
			params["limit"] = 1
			params["offset"] = 0
			sortorder = cls.getSortCommand(params).replace("UPPER(sortname)", "UPPER(lm.sortname)")

			data = cls.sqlExecuteCommand (
			  text(ListMembers.View_Data % sortorder ) ,
				params,
				BaseSql.ResultAsEncodedDict)

		else:
			data = []

		return data

	@classmethod
	def delete(cls, kw):
		""" delete a specific memebr from the list """

		transaction = cls.sa_get_active_transaction()
		try:
			l = ListMembers.query.get ( kw["listmemberid"])
			if l :
				session.delete(l)
			transaction.commit()
		except:
			LOGGER.exception("listmember_delete")
			transaction.rollback()
			raise

	@classmethod
	def delete_selected(cls, kw):
		""" delete all selected members from the list """

		transaction = BaseSql.sa_get_active_transaction()
		if 'option' in kw:
			if kw['option'] == 0 or kw['option'] == '0':
				listmembers = kw['selected_listmemberids']
			else:
				listmembers = session.query(ListMembers.listmemberid).\
				    filter(ListMembers.listid == kw['listid']).\
				    filter(not_(ListMembers.listmemberid.in_(kw['selected_listmemberids']))).all()
		for listmemberid in listmembers:
			try:
				lm = ListMembers.query.get(listmemberid)
				if lm :
					session.delete(lm)
			except:
				LOGGER.exception("listmember_delete")
				try:
					transaction.rollback()
				except:
					pass
				raise

class ExclusionList(BaseSql):
	""" entry that the user doen't when too sent too """

	@classmethod
	def outlet_add(cls, kw ):
		""" Add an outlet too the exclustion list """

		transaction = cls.sa_get_active_transaction()
		try:
			session.add ( ExclusionList ( **kw ) )
			transaction.commit()
		except:
			LOGGER.exception("ExclusionList_outlet_add")
			transaction.rollback()
			raise

	@classmethod
	def employee_add(cls, kw):
		""" Add an employee too the exlution list """

		transaction = cls.sa_get_active_transaction()
		try:
			session.add ( ExclusionList ( **kw ) )
			transaction.commit()
		except:
			LOGGER.exception("ExclusionList_employee_add")
			transaction.rollback()
			raise

	@classmethod
	def ExistsOutlet(cls, kw ) :
		""" Check too see if an outlet already exists on in the list """

		t = session.query(ExclusionList).filter_by( outletid = kw["outletid"] ,
		                                            employeeid = None,
		                                            customerid = kw["customerid"] ).all()

		return True if t else False


	@classmethod
	def ExistsEmployee(cls, kw ) :
		""" Check too see if an employee already exists on in the list """

		t = session.query(ExclusionList).filter_by( employeeid = kw["employeeid"] ,
		                                        customerid = kw["customerid"] ).all()
		return True if t else False


	@classmethod
	def exclusion_delete(cls, kw):
		""" delete an extry from the exclustion list """
		transaction = cls.sa_get_active_transaction()
		try:
			t = ExclusionList.query.get( kw["exclusionlistid"] )
			if t:
				session.delete ( t )
			transaction.commit()
		except:
			LOGGER.exception("ExclusionList_delete")
			transaction.rollback()
			raise

	View_Data = """ SELECT el.exclusionlistid,o.outletname,e.job_title,ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname
	FROM userdata.exclusionlist AS el
	LEFT OUTER JOIN employees AS e ON e.employeeid = el.employeeid
	LEFT OUTER JOIN outlets AS o ON o.outletid = COALESCE(el.outletid,e.outletid)
	LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
	WHERE el.customerid = :customerid
	ORDER BY %s %s NULLS LAST
	LIMIT :limit  OFFSET :offset	"""

	View_Data_Count = """ SELECT COUNT(*) FROM userdata.exclusionlist AS el WHERE el.customerid = :customerid"""

	@classmethod
	def getDisplayPage(cls, kw):
		""" get the exclustion list """

		sortfield = kw.get('sortfield','UPPER(o.outletname)')
		if sortfield == "contactname" :
			kw["sortfield"] = "UPPER(con.familyname)"

		return BaseSql.getGridPage( kw,
								"UPPER(o.outletname)",
								'exclusionlistid',
								ExclusionList.View_Data,
								ExclusionList.View_Data_Count,
								cls )


#########################################################
## Map object to db
#########################################################

List.mapping = Table('list', metadata, autoload = True, schema='userdata')
ListMembers.mapping = Table('listmembers', metadata, autoload = True, schema='userdata')
ExclusionList.mapping = Table('exclusionlist', metadata, autoload = True, schema='userdata')

mapper(List, List.mapping)
mapper(ListMembers, ListMembers.mapping)
mapper(ExclusionList, ExclusionList.mapping)
