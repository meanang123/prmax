# -*- coding: utf-8 -*-
"""Crm """
#-----------------------------------------------------------------------------
# Name:        contacthisotrygeneral.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     23/07/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from datetime import datetime
import logging
from turbogears.database import session
from sqlalchemy import text
from prcommon.model.common import BaseSql
from prcommon.model.identity import Customer, User
from prcommon.model.crm import ContactHistory
from prcommon.model.employee import Employee
from prcommon.model.crm2.contacthistoryissues import ContactHistoryIssues
from prcommon.model.crm2.contacthistoryhistory import ContactHistoryHistory
from prcommon.model.crm2.contacthistoryresponses import ContactHistoryResponses
from prcommon.model.crm2.issues import Issue
from prcommon.model.crm2.documents import Documents
from prcommon.model.crm import Task
from prcommon.model.crm2.contacthistoryuserdefine import ContactHistoryUserDefine
from prcommon.model.customer.customeremailserver import CustomerEmailServer
from prcommon.model.lookups import ContactHistoryStatus
import prcommon.Constants as Constants
from ttl.tg.validators import DateRangeResult
from ttl.ttlemail import EmailMessage, SMTPSERVERBYTYPE
from ttl.sqlalchemy.ttlcoding import CryptyInfo

CRYPTENGINE = CryptyInfo(Constants.KEY1)
LOGGER = logging.getLogger("prcommon.model")

class ContactHistoryGeneral():
	""" Contact History General Record """

	List_View_Single = """SELECT ch.contacthistoryid,
	ch.contacthistorysourceid,
	to_char(ch.taken, 'DD/MM/YY') as taken,
	to_char(ch.taken, 'DD/MM/YY') as taken_display,
	to_char(ch.modified, 'DD/MM/YY') as modified,
	CASE WHEN LENGTH(ch.crm_subject)>0 THEN ch.crm_subject ELSE ch.subject END AS subject,
	chs.contacthistorydescription,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	o.outletname,
	e.job_title,
	COALESCE(o.outletname,cust.customername) AS source,
	ch.details,
	taken.user_name AS takenbyname,
	mod.user_name AS modifiedbyname,
	chstatus.contacthistorystatusdescription,
	ch.outletid,
	ch.employeeid,
	taken.display_name
	FROM userdata.contacthistory AS ch
	LEFT OUTER JOIN internal.contacthistorysources as chs ON chs.contacthistorysourceid = ch.contacthistorysourceid
	LEFT OUTER JOIN internal.contacthistorystatus as chstatus ON chstatus.contacthistorystatusid = ch.contacthistorystatusid
	LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	LEFT OUTER JOIN contacts AS c ON c.contactid = COALESCE(ch.contactid,e.contactid)
	LEFT OUTER JOIN internal.customers AS cust ON cust.customerid = ch.ref_customerid
	LEFT OUTER JOIN tg_user AS taken ON taken.user_id = ch.taken_by
	LEFT OUTER JOIN tg_user AS mod ON mod.user_id = ch.modifiedby
	WHERE ch.contacthistoryid = :contacthistoryid"""

	@staticmethod
	def get_record(contacthistoryid, ashtml=False):
		""" Get a specific note record
		convert cr to html if required """
		data =  ContactHistory.sqlExecuteCommand(
			text(ContactHistoryGeneral.List_View_Single),
			dict ( contacthistoryid=contacthistoryid),
			BaseSql.ResultAsEncodedDict)[0]
		if ashtml:
			data["details"] = data["details"].replace("\n", "<br/>")
		return data

	@staticmethod
	def add_note( params ) :
		""" add a new notes record """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			for field in ("employeeid", "outletid", "clientid", "documentid"):
				if not params[field] or params[field] == "-1" or params[field] == -1:
					params[field] = None

			params["ref_customerid"] = params["customerid"]
			params["subject"] = params["details"][:254]

			if "employeeid" in params and params["employeeid"]:
				params["outletid"] = session.query(Employee.outletid).filter(Employee.employeeid == params["employeeid"]).scalar()

			if "contacthistoryid" in params:
				del params["contacthistoryid"]

			contacthistory = ContactHistory(**params)
			session.flush()
			contacthistoryid = contacthistory.contacthistoryid
			# now we need too handle issue
			if params["issueid"]:
				chi = ContactHistoryIssues(contacthistoryid=contacthistoryid,
				                           issueid=params["issueid"],
				                           isprimary=True)
				session.add(chi)
			if params["extraissues"] and params["extraissues"]["data"]:
				for issueid in params["extraissues"]["data"]:
					if issueid != params["issueid"]:
						chi = ContactHistoryIssues(contacthistoryid=contacthistoryid,
						                           issueid=issueid)
						session.add(chi)

			# add task ?
			if params["follow_up_view_check"]:
				task = Task(
				    taskstatusid=Constants.TaskStatus_InProgress,
				    due_date=params["follow_up_date"],
				    userid=params["follow_up_ownerid"],
				    description=params["details"][:255],
				    tasktypeid=Constants.TaskType_Standard,
				    ref_customerid=params["customerid"],
				    contacthistoryid=contacthistory.contacthistoryid)
				session.add(task)
				session.flush()
				# linked task back to contact
				contacthistory.taskid = task.taskid
				taskid = task.taskid
			else:
				taskid = None

			transaction.commit()

			return (contacthistoryid, taskid)
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory add_note")
			raise

	List_View = """SELECT ch.contacthistoryid,
	to_char(ch.taken, 'DD/MM/YY') as taken_display,
	CASE WHEN LENGTH(ch.crm_subject)>0 THEN ch.crm_subject ELSE ch.subject END AS subject,
	chs.contacthistorydescription,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
	com.email as contactemail,
	o.outletname,
	e.job_title,
	COALESCE(o.outletname,cust.customername) AS source,
	chstatus.contacthistorystatusdescription,
	taken.display_name,
	follow.display_name as follow_up_by
	FROM userdata.contacthistory AS ch
	LEFT OUTER JOIN internal.contacthistorysources as chs ON chs.contacthistorysourceid = ch.contacthistorysourceid
	LEFT OUTER JOIN internal.contacthistorystatus as chstatus ON chstatus.contacthistorystatusid = ch.contacthistorystatusid
	LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
	LEFT OUTER JOIN employees AS e ON e.employeeid = ch.employeeid
	LEFT OUTER JOIN communications AS com ON com.communicationid = e.communicationid
	LEFT OUTER JOIN contacts AS c ON c.contactid = COALESCE(ch.contactid,e.contactid)
	LEFT OUTER JOIN internal.customers AS cust ON cust.customerid = ch.ref_customerid
	LEFT OUTER JOIN tg_user AS taken ON taken.user_id = ch.taken_by
	LEFT OUTER JOIN tg_user AS follow ON follow.user_id = ch.follow_up_ownerid"""
	List_View_Count = """SELECT COUNT(*) FROM userdata.contacthistory AS ch %s"""


	@staticmethod
	def get_grid_page( params ) :
		""" get alist of notes"""

		whereclause = BaseSql.addclause("","ch.ref_customerid = :icustomerid")
		if "icustomerid" not in params:
			params["icustomerid"] = params["customerid"]

		for fieldid in ("contacthistorysourceid", "contacthistorystatusid", "followup_by",
		                "taken_by", "taskid", "outletid", "employeeid", "clientid"):
			if fieldid in params and params[fieldid] != '-1' :
				whereclause = BaseSql.addclause(whereclause, "ch.%s = :%s" % (fieldid, fieldid))
				params[fieldid] = int(params[fieldid])

		if "issueid" in params:
			whereclause = BaseSql.addclause(whereclause, "EXISTS ( SELECT contacthistoryissueid FROM userdata.contacthistoryissues AS chi WHERE chi.contacthistoryid = ch.contacthistoryid AND chi.issueid=:issueid)")
			params["issueid"] = int(params["issueid"])

		if "subject" in params:
			whereclause = BaseSql.addclause(whereclause, "ch.subject ilike :subject")
			params["subject"] = "%" +  params["subject"] +  "%"

		if "sort" in params and params["sort"] == "taken_display":
			params["sort"] = "ch.taken"

		# date range
		if "drange" in params and params["drange"].option != DateRangeResult.NOSELECTION:
			drange =  params["drange"]
			if drange.option == DateRangeResult.BEFORE:
				# BEfore
				params["from_date"] = drange.from_date
				whereclause = BaseSql.addclause( whereclause, 'ch.taken <= :from_date')
			elif drange.option == DateRangeResult.AFTER:
				# After
				params["from_date"] = drange.from_date
				whereclause = BaseSql.addclause( whereclause, 'ch.taken >= :from_date')
			elif drange.option == DateRangeResult.BETWEEN:
				# ABetween
				params["from_date"] = drange.from_date
				params["to_date"] = drange.to_date
				whereclause = BaseSql.addclause( whereclause, 'ch.taken BETWEEN :from_date AND :to_date')

		# default is date reverse order
		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "ch.taken"
			params['direction'] = "DESC"

		if params.get("sortfield") == "taken_display":
			params["sortfield"] = "ch.taken"

		return BaseSql.get_grid_page(params,
									'taken',
									'contacthistoryid',
									ContactHistoryGeneral.List_View + whereclause + BaseSql.Standard_View_Order,
									ContactHistoryGeneral.List_View_Count % whereclause,
									ContactHistory )

	@staticmethod
	def update_note( params ) :
		""" update a note record """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			contacthistory = ContactHistory.query.get(params["contacthistoryid"])

			if params["details"] != contacthistory.details or\
			   contacthistory.contacthistorytypeid != params["contacthistorytypeid"] or\
			   contacthistory.contacthistorystatusid != params["contacthistorystatusid"] or \
			   contacthistory.taken != params["taken"] or \
			   contacthistory.taken_by != params["taken_by"]:
				session.add(ContactHistoryHistory(
				    from_notes=contacthistory.details,
				    to_notes=params["details"],
				  contacthistoryid = contacthistory.contacthistoryid,
				  userid = params["userid"],
				  created=datetime.now(),
				  contacthistoryhistorytypeid=1 #Changed
				))

			if contacthistory.details != params["details"]:
				contacthistory.subject = params["details"][:255]

			contacthistory.details = params["details"]
			contacthistory.outcome = params["outcome"]

			contacthistory.contacthistorytypeid = params["contacthistorytypeid"]
			contacthistory.contacthistorystatusid = params["contacthistorystatusid"]
			contacthistory.crm_subject = params["crm_subject"]
			contacthistory.crm_response = params["crm_response"]
			contacthistory.taken = params["taken"]
			contacthistory.taken_by = params["taken_by"]
			contacthistory.chud1id = params["chud1id"]
			contacthistory.chud2id = params["chud2id"]
			contacthistory.chud3id = params["chud3id"]
			contacthistory.chud4id = params["chud4id"]

			contacthistory.clientid = params["clientid"]
			contacthistory.documentid = params["documentid"]

			if params["follow_up_view_check"] and contacthistory.taskid is None:
				task = Task(
						taskstatusid = Constants.TaskStatus_InProgress,
				    due_date = params["follow_up_date"],
				    userid = params["follow_up_ownerid"],
				    description = params["details"][:255],
				    tasktypeid = Constants.TaskType_Standard,
				    ref_customerid = params["customerid"],
				    contacthistoryid = contacthistory.contacthistoryid)
				session.add(task)
				session.flush()
				# linked task back to contact
				contacthistory.taskid = task.taskid
				taskid = task.taskid
				contacthistory.follow_up_date = params["follow_up_date"]
				contacthistory.follow_up_ownerid = params["follow_up_ownerid"]
			elif contacthistory.taskid is not None and params["follow_up_view_check"]:
				# an update of task?
				task = Task.query.get(contacthistory.taskid)
				task.due_date = params["follow_up_date"]
				task.userid = params["follow_up_ownerid"]
				contacthistory.follow_up_date = params["follow_up_date"]
				contacthistory.follow_up_ownerid = params["follow_up_ownerid"]
			elif contacthistory.taskid is not None:
				# break connection but leave task
				task = Task.query.get(contacthistory.taskid)
				contacthistory.taskid = None
				task.contacthistoryid = None

			# update issue
			issues = session.query(ContactHistoryIssues).\
				filter(ContactHistoryIssues.contacthistoryid == params["contacthistoryid"]).\
				filter (ContactHistoryIssues.isprimary == False).all()

			primary = session.query(ContactHistoryIssues).\
				filter(ContactHistoryIssues.contacthistoryid == params["contacthistoryid"]).\
				filter (ContactHistoryIssues.isprimary == True).scalar()

			if primary and primary.issueid != params["issueid"]:
				# issue update or delete
				if params["issueid"]:
					for issue in issues:
						if issue.issueid == params["issueid"]:
							issue.isprimary =True
							session.delete(primary)
							primary = issue
						primary.issueid = params["issueid"]
			elif not primary and params["issueid"]:
				# this is an add
				# need to check is not a move from others too main
				for issue in issues:
					if issue.issueid == params["issueid"]:
						primary = issue
						primary.isprimary = True
					else:
						issue.isprimary = False

				# needs to be added
				if not primary:
					primary = ContactHistoryIssues(
					  contacthistoryid = params["contacthistoryid"],
					  issueid = params["issueid"],
					  isprimary = True)
					session.add(primary)
					session.flush()

			# now add.delete from secondary list
			issues_existing = {}
			for issue in issues:
				issues_existing[issue.issueid] = issue
			if primary:
				issues_existing[primary.issueid] = primary

			newissues = {}
			if params["issueid"]:
				newissues[params["issueid"]] = True

			# adds
			if params["extraissues"] and params["extraissues"]["data"]:
				for issueid in params["extraissues"]["data"]:
					newissues[issueid] = issueid
					if issueid not in issues_existing:
						issue = ContactHistoryIssues(
							contacthistoryid = params["contacthistoryid"],
							issueid = issueid)
						session.add(issue)
						issues_existing[issue.issueid] = issue
			#deletes
			for issue in issues_existing.values():
				if issue.issueid not in newissues:
					session.delete(issue)

			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory update note")
			raise

	@staticmethod
	def update_response(params):
		""" update a response record """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			ces = CustomerEmailServer.get(params['customeremailserverid'])
			email = EmailMessage(ces.fromemailaddress,
			                     params['toemailaddress'],
			                     params['emailsubject'],
			                     params['emailbody'],
			                     "text/html"
			                     )
			email.BuildMessage()
			email.cc = params['ccemailaddresses']

			if ces.servertypeid in SMTPSERVERBYTYPE:
				emailserver = SMTPSERVERBYTYPE[ces.servertypeid](
				    username=CRYPTENGINE.aes_decrypt(ces.username),
				    password=CRYPTENGINE.aes_decrypt(ces.password),
					host=ces.host)
				sender = ces.fromemailaddress

				(error, statusid) = emailserver.send(email, sender)
				if not statusid:
					raise Exception("Problem Sending Email")				
				else:
					user = session.query(User).filter(User.user_id == int(params['userid'])).scalar()
					chresp = ContactHistoryResponses(contacthistoryid=int(params['contacthistoryid']),
					                                 contacthistorystatusid=1,
					                                 response=params['emailbody'],
					                                 taken=datetime.now(),
					                                 contacthistorytypeid=3, #by email
					                                 send_by=user.display_name,
					                                 toemailaddress=params['toemailaddress'],
					                                 statementid=params['statementid'])
					session.add(chresp)
					session.flush()

					chh = ContactHistoryHistory(
					    contacthistoryresponseid=chresp.contacthistoryresponseid,
					    contacthistoryid=chresp.contacthistoryid,
					    userid=int(params['userid']),
						created=datetime.now(),
						contacthistoryhistorytypeid=2) #Response
					session.add(chh)
					session.flush()					
					transaction.commit()
					return chh
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistoryHistory update history")
			raise

	@staticmethod
	def get_edit(contacthistoryid):
		"""Contact Hisotry id"""

		contacthistory = ContactHistory.query.get(contacthistoryid)
		task = Task.query.get(contacthistory.taskid) if contacthistory.taskid else None
		primary = session.query(Issue).\
		  join(ContactHistoryIssues, Issue.issueid == ContactHistoryIssues.issueid).\
		  filter(ContactHistoryIssues.contacthistoryid == contacthistoryid).\
		  filter (ContactHistoryIssues.isprimary == True).scalar()
		issues = session.query(Issue).\
		  join(ContactHistoryIssues, Issue.issueid == ContactHistoryIssues.issueid).\
		  filter(ContactHistoryIssues.contacthistoryid == contacthistoryid).\
		  filter (ContactHistoryIssues.isprimary == False).all()
		if contacthistory.documentid:
			document = Documents.query.get(contacthistory.documentid)
		else:
			document = None
		status = session.query(ContactHistoryStatus).filter(ContactHistoryStatus.contacthistorystatusid == contacthistory.contacthistorystatusid).scalar()
		display_name = session.query(User.display_name).filter(User.user_id == contacthistory.taken_by).scalar()
		return dict(
		  ch = contacthistory,
		  chi = dict( primary = primary, si = issues),
		  status = status.contacthistorystatusdescription,
		  display_name = display_name,
		  task = task,
		  taken_date = datetime.strftime(contacthistory.taken, "%d/%m/%y"),
		  document = document)

	EMPTYGRID = dict (numRows = 0, items = [], identifier = 'contacthistoryid')

	List_Chh_View = """SELECT
	chh.contacthistoryhistoryid,
	to_char(chh.created, 'DD/MM/YY') AS created_display,
	CASE WHEN (chh.userid IS NULL) THEN '' ELSE u.user_name END,
	chht.contacthistoryhistorytypedescription AS changetype
	FROM userdata.contacthistoryhistory AS chh
	JOIN internal.contacthistoryhistorytypes AS chht ON chh.contacthistoryhistorytypeid = chht.contacthistoryhistorytypeid
	LEFT OUTER JOIN tg_user AS u ON u.user_id = chh.userid
	%s %s
	LIMIT :limit  OFFSET :offset"""
	List_Chh_View_Count = """SELECT COUNT(*) FROM userdata.contacthistoryhistory AS chh %s"""
	EMPTYGRID_CHH = dict(numRows=0, items=[], identifier='contacthistoryhistoryid')

	@staticmethod
	def ch_history( params ) :
		""" get alist of notes"""

		if "contacthistoryid" in  params:
			whereclause = BaseSql.addclause("","chh.contacthistoryid = :contacthistoryid")

			if "sort" in params and params["sort"] == "created_display":
				params["sort"] = "chh.created"

			return BaseSql.get_grid_page(
			  params,
			  'chh.created',
			  'contacthistoryhistoryid',
			  ContactHistoryGeneral.List_Chh_View % (whereclause,"ORDER BY  %s %s"),
			  ContactHistoryGeneral.List_Chh_View_Count % whereclause,
			  ContactHistoryHistory )
		else:
			return ContactHistoryGeneral.EMPTYGRID_CHH

	List_UD_View = """SELECT contacthistoryuserdefinid AS id, chu.contacthistoryuserdefinid,chu.description FROM userdata.contacthistoryuserdefine AS chu """
	List_UD_Count = """SELECT COUNT(*) FROM userdata.contacthistoryuserdefine AS chu """

	@staticmethod
	def user_defined( params ) :
		""" get alist of notes"""

		whereclause = BaseSql.addclause("","chu.customerid = :customerid")
		whereclause = BaseSql.addclause(whereclause,"chu.fieldid = :fieldid")

		if "id" in params:
			whereclause = BaseSql.addclause(whereclause,"chu.contacthistoryuserdefinid = :id")

		if "description" in params:
			params["description"] = params["description"].replace("*", "%")
			whereclause = BaseSql.addclause(whereclause,"chu.description ILIKE :description")

		return BaseSql.get_grid_page(
		  params,
		  'chu.description',
		  'contacthistoryuserdefinid',
		  ContactHistoryGeneral.List_UD_View + whereclause + BaseSql.Standard_View_Order,
		  ContactHistoryGeneral.List_UD_Count + whereclause,
		  ContactHistoryHistory )

	@staticmethod
	def load_settings(params):
		"""Load Settings"""

		customer = Customer.query.get(params["customerid"])

		return dict (crm_user_define_1 = customer.crm_user_define_1,
		             crm_user_define_2 = customer.crm_user_define_2,
		             crm_user_define_3 = customer.crm_user_define_3,
		             crm_user_define_4 = customer.crm_user_define_4)


	@staticmethod
	def update_settings(params):
		"""Load Settings"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			customer = Customer.query.get(params["customerid"])
			for fieldid in  ("1", "2", "3", "4"):
				if params["crm_user_define_" + fieldid] and params["crm_user_define_"+ fieldid + "_on"]:
					setattr(customer, "crm_user_define_" + fieldid,params["crm_user_define_" + fieldid])
				else:
					setattr(customer, "c" + fieldid, None)

			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory update_settings")
			raise

		return dict (crm_user_define_1 = customer.crm_user_define_1,
		             crm_user_define_2 = customer.crm_user_define_2,
		             crm_user_define_3 = customer.crm_user_define_3,
		             crm_user_define_4 = customer.crm_user_define_4)

	@staticmethod
	def user_defined_add(params):
		"""Ad a new user defined field"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			chud = ContactHistoryUserDefine(customerid = params["customerid"],
			                                 fieldid = params["fieldid"],
			                                 description =  params["description"])
			session.add(chud)
			session.flush()
			transaction.commit()
			return chud.contacthistoryuserdefinid
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory user_defined_add")
			raise

	@staticmethod
	def user_defined_exists(params):
		"""does it exist"""

		return True if session.query(ContactHistoryUserDefine).filter(ContactHistoryUserDefine.fieldid == params["fieldid"]).\
		       filter(ContactHistoryUserDefine.customerid == params["customerid"]).\
		       filter(ContactHistoryUserDefine.description.ilike(params["description"])).all() else False

	@staticmethod
	def user_defined_delete(params):
		"""delete a user defined field"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			chud = ContactHistoryUserDefine.query.get(params["contacthistoryuserdefinid"])
			session.delete(chud)
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("ContactHistory user_defined_delete")
			raise
