# -*- coding: utf-8 -*-
"""issuesgeneral record"""
#-----------------------------------------------------------------------------
# Name:       issuegeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     12/06/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from datetime import datetime
import logging
from turbogears.database import session
from ttl.model import BaseSql
from prcommon.model.crm2.issues import Issue
from prcommon.model.crm2.issuehistory import IssueHistory
from prcommon.model.crm2.documents import Documents
from prcommon.model.crm2.briefingnotesstatus import BriefingNotesStatus
from prcommon.model.lookups import IssueStatus
from prcommon.model.crm2.customersolidmediaprofiles import CustomerSolidMediaProfiles

LOGGER = logging.getLogger("prmax")

class IssuesGeneral(object):
	""" issues general"""

	List_Data_View = """SELECT
	i.issueid,
	i.name,
	iss.issuestatusdescription,
	to_char(i.created,'DD/MM/YY') AS created_display,
	0 AS newsitems_display,
	i.issuestatusid,
	i.issueid as id

	FROM userdata.issues AS i
	JOIN internal.issuestatus AS iss ON iss.issuestatusid = i.issuestatusid """

	List_Data_Combo_View = """SELECT
	i.issueid,
	i.name

	FROM userdata.issues AS i
	JOIN internal.issuestatus AS iss ON iss.issuestatusid = i.issuestatusid """

	List_Data_Count = """SELECT COUNT(*) FROM userdata.issues AS i JOIN internal.issuestatus AS iss ON iss.issuestatusid = i.issuestatusid"""

	@staticmethod
	def list_issues(params, as_rest=False):
		"""List of issues """

		whereclause = BaseSql.addclause("", "i.customerid = :customerid")

		if "all_issues"not in params:
			whereclause = BaseSql.addclause(whereclause, "i.issuestatusid = 1")

		if "name" in params:
			whereclause = BaseSql.addclause(whereclause, "i.name ilike :name")
			if params['name']:
				params["name"] = params["name"].replace("*", "%")

		if "issuename" in params:
			whereclause = BaseSql.addclause(whereclause, "i.name ilike :issuename")
			params["issuename"] = "%" + params["issuename"] + "%"

		if "briefingnotesstatusid" in params:
			whereclause = BaseSql.addclause(whereclause, "i.briefingnotesstatusid = :briefingnotesstatusid")

		if "approvedbyid" in params:
			whereclause = BaseSql.addclause(whereclause, "i.approvedbyid = :approvedbyid")

		if params.get("sortfield", "name"):
			params["sortfield"] = 'UPPER(name)'

		if params.get("sortfield", "created_display"):
			params["sortfield"] = 'i.created'

		if "id" in params:
			whereclause = BaseSql.addclause(whereclause, "i.issueid = :issueid")
			params["issueid"] = int(params["id"])

		if "issueid" in params:
			whereclause = BaseSql.addclause(whereclause, "i.issueid = :issueid")
			params["issueid"] = int(params["issueid"])

		if "clientid" in params and params.get("clientid") and params.get("clientid") != '-1':
			whereclause = BaseSql.addclause(whereclause, "i.clientid = :clientid")
			params["clientid"] = int(params["clientid"])

		data = BaseSql.getGridPage(
		  params,
		  'UPPER(name)',
		  'issueid',
		  IssuesGeneral.List_Data_View + whereclause + BaseSql.Standard_View_Order,
		  IssuesGeneral.List_Data_Count + whereclause,
		  Issue)

		if as_rest:
			if not params.get("issueid", None) or \
				 params.get("issueid", "") in ("-1", -1):
				data['items'].insert(0, dict(id=-1, name="No Selection", issueid=-1))
				data['numRows'] += 1

			data = BaseSql.grid_to_rest(data,
			                            params['offset'],
			                            True if 'issueid' in params else False)

		return data

	List_History_Data_View = "SELECT ih.issuehistoryid,to_char(ih.changed,'DD-MM-YY') AS changed_display FROM userdata.issuehistory AS ih"
	List_History_Data_Count = "SELECT COUNT(*) FROM userdata.issuehistory AS ih"

	@staticmethod
	def issue_history(params):
		"""List of hisotrical chnages  """

		if  "issueid" not in params:
			return dict(numRows=0, items=[], identifier="issuehistoryid")

		whereclause = BaseSql.addclause("", "ih.issueid = :issueid")
		params["issueid"] = int(params["issueid"])

		if params.get("sortfield", "changed_display") == "changed_display":
			params["sortfield"] = 'changed'

		return BaseSql.getGridPage(
		  params,
		  'changed',
		  'issuehistoryid',
		  IssuesGeneral.List_History_Data_View + whereclause + BaseSql.Standard_View_Order,
		  IssuesGeneral.List_History_Data_Count + whereclause,
		  Issue)

	List_Issue_Enagaements_Data_View = """SELECT ch.contacthistoryid,
	to_char(ch.taken, 'DD/MM/YY') as taken_display,
	ch.subject,
	chs.contacthistorydescription,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	o.outletname,
	e.job_title,
	COALESCE(o.outletname,cust.customername) AS source,
	chstatus.contacthistorystatusdescription
	FROM userdata.contacthistory AS ch
	LEFT OUTER JOIN internal.contacthistorysources as chs ON chs.contacthistorysourceid = ch.contacthistorysourceid
	LEFT OUTER JOIN internal.contacthistorystatus as chstatus ON chstatus.contacthistorystatusid = ch.contacthistorystatusid
	LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	LEFT OUTER JOIN contacts AS c ON c.contactid = COALESCE(ch.contactid,e.contactid)
	LEFT OUTER JOIN internal.customers AS cust ON cust.customerid = ch.ref_customerid"""

	List_Issue_Enagaements_Data_Count = "SELECT COUNT(*) FROM userdata.contacthistory AS ch "

	@staticmethod
	def issue_engagements(params):
		"""List of enagements for an issue """

		if  "issueid" not in params:
			return dict(numRows=0, items=[], identifier="contacthistoryid")

		whereclause = BaseSql.addclause("", "ch.contacthistoryid IN (SELECT contacthistoryid FROM userdata.contacthistoryissues WHERE issueid = :issueid)")
		params["issueid"] = int(params["issueid"])

		if params.get("sortfield", "taken_display") == "taken_display":
			params["sortfield"] = 'taken'


		return BaseSql.getGridPage(
		  params,
		  'taken',
		  'contacthistoryid',
		  IssuesGeneral.List_Issue_Enagaements_Data_View + whereclause + BaseSql.Standard_View_Order,
		  IssuesGeneral.List_Issue_Enagaements_Data_Count + whereclause,
		  Issue)

	@staticmethod
	def exists(params):
		""" Check too see if issue exists """

		tmp = session.query(Issue).filter(Issue.name.ilike(params["name"])).\
		  filter(Issue.customerid == params["customerid"]).all()

		return True if tmp else False


	@staticmethod
	def add(params):
		""" add a new issue too the database """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			issue = Issue(name=params["name"],
			              created=datetime.now(),
			              issuestatusid=1,
			              briefingnotes=params["briefingnotes"],
			              customerid=params["customerid"],
			              documentid=params["documentid"],
			              approvedbyid=params["approvedbyid"],
			              briefingnotesstatusid=params["briefingnotesstatusid"],
			              clientid=params["clientid"]
			             )
			session.add(issue)
			session.flush()
			transaction.commit()
			return issue.issueid
		except:
			LOGGER.exception("Issue_add")
			transaction.rollback()
			raise

	@staticmethod
	def update(params):
		""" Update a issue """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			issue = Issue.query.get(params["issueid"])
			issue.name = params["name"]
			issue.documentid = params["documentid"]
			issue.approvedbyid = params["approvedbyid"]
			issue.briefingnotesstatusid = params["briefingnotesstatusid"]
			issue.clientid = params["clientid"]

			if issue.briefingnotes != params["briefingnotes"]:
				session.add(IssueHistory(issueid=params["issueid"],
				                        changed=datetime.now(),
				                        old_briefingnotes=issue.briefingnotes,
				                        new_briefingnotes=params["briefingnotes"],
				                        documentid=params["documentid"]))
				issue.briefingnotes = params["briefingnotes"]

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("Issue_update")
			transaction.rollback()
			raise

	@staticmethod
	def archive(params, issuestatusid=2):
			""" archive an issue """

			transaction = BaseSql.sa_get_active_transaction()
			try:

				issue = Issue.query.get(params["issueid"])
				issue.issuestatusid = issuestatusid
				transaction.commit()
			except:
				LOGGER.exception("Issue_archive")
				transaction.rollback()
				raise

	@staticmethod
	def get(issueid, extended=False):
		"""Get details about an issue"""

		issue = Issue.query.get(issueid)
		idict = dict(issueid=issue.issueid,
		             name=issue.name,
		             issuestatusid=issue.issuestatusid,
		             briefingnotes=issue.briefingnotes,
		             documentid=issue.documentid,
		             approvedbyid=issue.approvedbyid,
		             briefingnotesstatusid=issue.briefingnotesstatusid,
		             ext="",
		             background_colour=None,
		             text_colour=None,
		             clientid=issue.clientid)
		if extended:
			idict["created_display"] = issue.created.strftime("%d/%m/%y")
			issuestatus = IssueStatus.query.get(issue.issuestatusid)
			idict["issuestatusdescription"] = issuestatus.issuestatusdescription
			if issue.documentid:
				document = Documents.query.get(issue.documentid)
				idict["ext"] = document.ext

		if issue.briefingnotesstatusid:
			briefingnote = BriefingNotesStatus.query.get(issue.briefingnotesstatusid)
			idict["background_colour"] = briefingnote.background_colour
			idict["text_colour"] = briefingnote.text_colour

		return idict

	@staticmethod
	def get_user_selection(params):
		"""List of """

		params["word"] = params["word"].replace("*", "")

		return session.query(Issue.issueid, Issue.name).\
		  filter(Issue.customerid == params["customerid"]).\
		  filter(Issue.name.ilike(params["word"] + "%")).\
			filter(Issue.issuestatusid == 1).\
		  order_by(Issue.name).all()

	@staticmethod
	def has_coverage(params):
		"check to see if coverage has been setup "

		if session.query(CustomerSolidMediaProfiles).filter(CustomerSolidMediaProfiles.issueid == params["issueid"]).all():
			return True
		else:
			return False

	@staticmethod
	def list_by_customer(params):
		"""list of clientid"""

		if params.get("sortfield", "issuename"):
			params["sortfield"] = 'UPPER(issuename)'

		whereclause = BaseSql.addclause("", "i.customerid=:icustomerid")
		params["icustomerid"] = int(params.get("icustomerid", "-1"))

		if "clientid" in params and params.get("clientid", "") != "":
			whereclause = BaseSql.addclause("", "i.clientid=:clientid")
			params["clientid"] = int(params.get("clientid", "-1"))

		if "issueid" in params:
			whereclause = BaseSql.addclause("", "i.issueid=:issueid")
			params["issueid"] = int(params["issueid"])

		if "name" in params:
			if params["name"] != "*":
				whereclause = BaseSql.addclause(whereclause, "name ilike :name")
				if params["name"]:
					if params["name"][-1] == "*":
						params["name"] = params["name"][:-1]
					params["name"] = params["name"] + "%"

		items = BaseSql.getGridPage(
		  params,
		  'UPPER(name)',
			'issueid',
		  IssuesGeneral.List_Data_Combo_View + whereclause + BaseSql.Standard_View_Order,
		  IssuesGeneral.List_Data_Count + whereclause,
		  Issue)

		return BaseSql.grid_to_rest(items, params['offset'], True if "issueid" in params else False)

	@staticmethod
	def get_briefingnotes(issueid):
		"""Get briefingnotes """
		issue = Issue.query.get(issueid)

		return dict(briefingnotes=issue.briefingnotes)
