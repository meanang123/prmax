# -*- coding: utf-8 -*-
"research Projects"
#-----------------------------------------------------------------------------
# Name:        projects.py
# Purpose:     Research Project Details
# Author:      Chris Hoy
#
# Created:     09/09/2011
# RCS-ID:      $Id:  $
# Copyright:  (c) 2011

#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, not_
from sqlalchemy.sql import text, func
from prcommon.model import BaseSql, SearchSession
from prcommon.model.research import ResearchControRecord, ResearchDetails
from prcommon.model.lookups import ResearchProjectStatus
from prcommon.model.identity import User
from ttl.ttldate import to_json_date
import datetime
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prmax.model")

class ResearchProjects(BaseSql):
	""" Research Projects """

	@classmethod
	def exists(cls, args):
		""" check too see if a project exiast"""
		if "researchprojectid" in args:
			result = session.query(ResearchProjects.researchprojectid).\
			  filter(ResearchProjects.researchprojectname == args["researchprojectname"]).\
			  filter(ResearchProjects.researchprojectid != args["researchprojectid"])
		else:
			result = session.query(ResearchProjects.researchprojectid).filter_by(researchprojectname=args["researchprojectname"])

		return True if result.count() else False

	@classmethod
	def add(cls, args):
		""" add a project too the system """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			# add projects
			rpc = ResearchProjects(
			  researchprojectname=args["researchprojectname"],
			  ismonthly=args["ismonthly"],
			  startdate=args["startdate"],
			  questionnaire_completion=args["questionnaire_completion"])

			if args["iuserid"] != -1:
				rpc.ownerid = args["iuserid"]

			session.add(rpc)
			session.flush()
			# copy
			session.execute("""SELECT research_project_add(:searchtypeid,:userid,:researchprojectid,:researchprojectstatusid)""",
			  dict(searchtypeid=Constants.Search_Standard_Projects,
			        userid=args["userid"],
			        researchprojectid=rpc.researchprojectid,
			        researchprojectstatusid=Constants.Research_Project_Status_Send_Email \
			        if args["ismonthly"] else Constants.Research_Project_Status_No_Email),
			  ResearchProjects).scalar()
			# clear up
			SearchSession.Delete(args["userid"],
			                     Constants.Search_Standard_Projects,
			                     Constants.Search_SelectedAll)
			transaction.commit()
			return rpc.researchprojectid
		except:
			LOGGER.exception("ResearchProjects add")
			transaction.rollback()
			raise

	@staticmethod
	def delete(researchprojectid):
		""" Delete a project"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			# add projects
			rpc = ResearchProjects.query.get(researchprojectid)
			if rpc:
				session.delete(rpc)
			transaction.commit()
		except:
			LOGGER.exception("ResearchProjects delete")
			transaction.rollback()
			raise

	@staticmethod
	def update(params):
		""" Update a project"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			# add projects
			rpc = ResearchProjects.query.get(params["researchprojectid"])
			rpc.ownerid = params["ownerid"]
			rpc.startdate = params["startdate"]
			rpc.questionnaire_completion = params["questionnaire_completion"]

			transaction.commit()
		except:
			LOGGER.exception("ResearchProjects update")
			transaction.rollback()
			raise

	@staticmethod
	def project_send(researchprojectid):
		""" Send a project """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			# send a projects
			session.query(ResearchProjectItems).\
			  filter(ResearchProjectItems.researchprojectid == researchprojectid).\
			  filter(not_(ResearchProjectItems.researchprojectstatusid.in_((Constants.Research_Project_Status_Customer_Completed, Constants.Research_Project_Status_Research_Completed)))).\
 			  update({ResearchProjectItems.researchprojectstatusid: Constants.Research_Project_Status_Send_Email}, synchronize_session=False)

			transaction.commit()
		except:
			LOGGER.exception("ResearchProjects delete")
			transaction.rollback()
			raise

	@staticmethod
	def display_line(researchprojectid):
		""" get a display line """

		project = ResearchProjects.query.get(researchprojectid)
		if project.ownerid:
			user = User.query.get(project.ownerid)
			ownername = user.user_name
		else:
			ownername = 'Open'
		count = completed = customer_completed = nbr_to_email = 0
		for item in session.query(ResearchProjectItems).filter(ResearchProjectItems.researchprojectid == researchprojectid).all():
			count += 1
			if item.researchprojectstatusid in(6, 7):
				completed += 1
			elif item.researchprojectstatusid == 3:
				customer_completed += 1
			elif item.researchprojectstatusid == 1:
				nbr_to_email += 1

		return dict(researchprojectid=project.researchprojectid,
		            researchprojectname=project.researchprojectname,
		            ownername=ownername,
		            count=count,
		            completed=completed,
		            customer_completed=customer_completed,
		            nbr_to_email=nbr_to_email)

	@classmethod
	def projects_append(cls, args):
		""" append results to project """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			session.execute(""" SELECT research_project_update(:searchtypeid,:userid,:researchprojectid,:researchprojectstatusid)""",
			  dict(searchtypeid=Constants.Search_Standard_Projects,
			       userid=args["userid"],
			       researchprojectid=args["researchprojectid"],
			       researchprojectstatusid=Constants.Research_Project_Status_No_Email),
			  ResearchProjects).scalar()
			# clear up
			SearchSession.Delete(args["userid"],
			                     Constants.Search_Standard_Projects,
			                     Constants.Search_SelectedAll)
			transaction.commit()
		except:
			LOGGER.exception("ResearchProjects projects_append")
			transaction.rollback()
			raise


	Grid_View_Main = """SELECT
		p.researchprojectid,
		p.researchprojectname,
	  to_char(startdate, 'DD/MM/YY') AS start_date_display,
	  to_char(questionnaire_completion, 'DD/MM/YY') AS questionnaire_completed_display,
		COALESCE(u.user_name, 'Open') AS ownername,
	 (SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid) AS count,
	 (SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid AND rpi.researchprojectstatusid IN(6,7)) AS completed,
	  COALESCE((SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid AND rpi.researchprojectstatusid =3),0) AS customer_completed,
	  COALESCE((SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid AND rpi.researchprojectstatusid =1),0) AS nbr_to_email,
	  ismonthly
		FROM research.researchprojects AS p
		LEFT OUTER JOIN tg_user AS u on u.user_id = p.ownerid"""
	Grid_View_Order = """ ORDER BY  %s %s LIMIT :limit OFFSET :offset"""
	Grid_View_Count = """SELECT COUNT(*) FROM research.researchprojects AS p """

	ListData = """
		SELECT
		researchprojectid,
	    researchprojectid AS id,
	    researchprojectname
		FROM research.researchprojects"""

	ListDataCount = """
		SELECT COUNT(*) FROM research.researchprojects """

	@classmethod
	def getgridpage(cls, args):
		""" get a list of the research projects"""

		if args.get("sortfield", "") == "researchprojectname":
			args["sortfield"] = "UPPER(researchprojectname)"
		elif args.get("sortfield", "") == "start_date_display":
			args["sortfield"] = "startdate"
		elif args.get("sortfield", "") == "questionnaire_completed_display":
			args["sortfield"] = "questionnaire_completion"

		whereused = ""

		if "researchprojectname" in args:
			whereused = BaseSql.addclause("", "researchprojectname ilike :researchprojectname")
			args["researchprojectname"] = "%" + args["researchprojectname"] + "%"

		return BaseSql.getGridPage(args,
		                           'UPPER(researchprojectname)',
		                           'researchprojectid',
		                           ResearchProjects.Grid_View_Main + whereused + ResearchProjects.Grid_View_Order,
		                           ResearchProjects.Grid_View_Count + whereused,
		                           cls)

	@classmethod
	def get_rest_page(cls, params):
		"""get rest page """

		return cls.grid_to_rest(cls.getgridpage(params),
		                        params["offset"],
		                        True if "researchprojectid" in params else False)

	@classmethod
	def get_list(cls, params):
		""" get list  """
		whereused = ""

		if "researchprojectname" in params:
			whereused = BaseSql.addclause("", "researchprojectname ilike :researchprojectname")
			if params["researchprojectname"]:
				params["researchprojectname"] = params["researchprojectname"].replace("*", "")
				params["researchprojectname"] = params["researchprojectname"] +  "%"

		if "researchprojectid" in  params:
			whereused = BaseSql.addclause(whereused, "researchprojectid = :researchprojectid")


		return cls.get_rest_page_base(
		    params,
		    'researchprojectid',
		    'researchprojectname',
		    ResearchProjects.ListData + whereused + BaseSql.Standard_View_Order,
		    ResearchProjects.ListDataCount + whereused,
		    cls)

	@classmethod
	def get(cls, researchprojectid):
		"""Get pojects details"""

		project = ResearchProjects.query.get(researchprojectid)
		if project.ownerid:
			owner = User.query.get(project.ownerid)
			ownername = owner.user_name
		else:
			ownername = "Open"
		start_date_display = project.startdate.strftime("%d/%m/%y") if project.startdate else ""
		questionnaire_completed_display = project.questionnaire_completion.strftime("%d/%m/%y") if project.questionnaire_completion else ""

		r_data = dict(
		  researchprojectid=project.researchprojectid,
		  researchprojectname=project.researchprojectname,
		  ownerid=project.ownerid,
		  startdate_json=to_json_date(project.startdate),
		  questionnaire_completion_json=to_json_date(project.questionnaire_completion),
		  ownername=ownername,
		  start_date_display=start_date_display,
		  questionnaire_completed_display=questionnaire_completed_display,
		  count=0,
		  completed=0,
		  customer_completed=0,
		  nbr_to_email=0
		)
		project_details = session.execute(text("""SELECT
			(SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid) AS count,
			(SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid AND rpi.researchprojectstatusid IN(6,7)) AS completed,
			COALESCE((SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid AND rpi.researchprojectstatusid =3),0) AS customer_completed,
			COALESCE((SELECT COUNT(*) FROM research.researchprojectitem AS rpi WHERE rpi.researchprojectid = p.researchprojectid AND rpi.researchprojectstatusid =1),0) AS nbr_to_email
			FROM research.researchprojects AS p WHERE p.researchprojectid = :researchprojectid"""), dict(researchprojectid=researchprojectid), ResearchProjects).fetchone()
		if project_details:
			r_data["count"] = project_details[0]
			r_data["completed"] = project_details[1]
			r_data["customer_completed"] = project_details[2]
			r_data["nbr_to_email"] = project_details[3]

		return r_data

	@staticmethod
	def get_status(researchprojectid):
		"""Get status of project"""

		# need to get break down by category
		status = session.query(ResearchProjectStatus.researchprojectstatusdescription, func.count()).\
			join(ResearchProjectItems, ResearchProjectItems.researchprojectstatusid == ResearchProjectStatus.researchprojectstatusid).\
		  filter(ResearchProjectItems.researchprojectid == researchprojectid).\
		  group_by(ResearchProjectStatus.researchprojectstatusdescription).all()
		total_records = 0
		for row in status:
			total_records += row[1]

		return dict(researchproject=ResearchProjects.query.get(researchprojectid),
		            status=status,
		            total_records=total_records)

class ResearchProjectItems(BaseSql):
	""" research prpjects items """

	def __json__(self):
		"too json"
		props = {}
		for key in self.__dict__:
			if not key.startswith('_sa_') and key != "lastationdate":
				props[key] = getattr(self, key)
			if key == "lastationdate":
				props[key] = to_json_date(self.lastationdate)

		return props

	Grid_View_Main = """SELECT
		pi.researchprojectitemid,
		o.outletname,
	  o.outletid,
	  COALESCE(u.user_name, '') AS ownername,
	  o.prmax_outlettypeid,
	  pr.prmax_outletgroupid,
	  ps.researchprojectstatusid,
	  ps.researchprojectstatusdescription,
	  COALESCE(rdd.surname,rd.surname) AS surname,
	  COALESCE(rdd.firstname,rd.firstname) AS firstname,
	 (SELECT COUNT(*) FROM research.researchprojectchanges AS rpc WHERE rpc.researchprojectitemid = pi.researchprojectitemid LIMIT 1) as wizard,
	  CASE WHEN pi.researchprojectstatusid IN(2,5,4,7,12) THEN 'R' ELSE '' END AS resend,
	  od.deskname,
	  pi.outletdeskid
		FROM research.researchprojectitem AS pi
	  LEFT JOIN internal.researchprojectstatus AS ps ON ps.researchprojectstatusid = pi.researchprojectstatusid
	  LEFT JOIN outlets AS o ON o.outletid = pi.outletid
	  LEFT OUTER JOIN outletdesk AS od ON od.outletdeskid = pi.outletdeskid
		LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
		LEFT OUTER JOIN tg_user AS u on u.user_id = pi.lastactionownerid
	  LEFT OUTER JOIN research.researchdetails AS rd ON rd.outletid=pi.outletid
	  LEFT OUTER JOIN research.researchdetailsdesk AS rdd ON rdd.outletdeskid = pi.outletdeskid"""
	Grid_View_Order = """ ORDER BY  %s %s LIMIT :limit OFFSET :offset"""
	Grid_View_Count = """SELECT COUNT(*) FROM research.researchprojectitem AS pi
		LEFT JOIN outlets AS o ON o.outletid = pi.outletid
	  LEFT OUTER JOIN research.researchdetails AS rd ON rd.outletid=pi.outletid"""

	@classmethod
	def getgridpage(cls, params):
		""" get a page of project items """

		if "researchprojectid" not in params:
			return dict(numRows=0, items=[], identifier="researchprojectitemid")

		if params.get("sortfield", "") == "outletname":
			params["sortfield"] = "UPPER(sortname)"

		whereused = BaseSql.addclause("", "pi.researchprojectid =:researchprojectid")
		params["researchprojectid"] = int(params["researchprojectid"])
		if "researchprojectstatusid" in params:
			whereused = BaseSql.addclause(whereused, "pi.researchprojectstatusid =:researchprojectstatusid")
			params["researchprojectstatusid"] = int(params["researchprojectstatusid"])

		if "outletname" in params:
			whereused = BaseSql.addclause(whereused, "o.outletname ILIKE :outletname")
			params["outletname"] = "%" + params["outletname"] + "%"

		if "emailaddress" in params:
			whereused = BaseSql.addclause(whereused, "rd.email ILIKE :emailaddress")
			params["emailaddress"] = "%" + params["emailaddress"] + "%"


		return BaseSql.getGridPage(params,
		                           'UPPER(outletname)',
		                           'researchprojectitemid',
		                           ResearchProjectItems.Grid_View_Main + whereused + ResearchProjectItems.Grid_View_Order,
		                           ResearchProjectItems.Grid_View_Count + whereused,
		                           cls)

	@classmethod
	def get_rest_page(cls, params):
		"""et rest page """

		return cls.grid_to_rest(cls.getgridpage(params),
		                        params["offset"],
		                        True if "researchprojectitemid" in params else False)

	@classmethod
	def get(cls, researchprojectitemid):
		""" get extended single record """

		result = session.execute(text(ResearchProjectItems.Grid_View_Main + " WHERE pi.researchprojectitemid =:researchprojectitemid"),
		                         dict(researchprojectitemid=researchprojectitemid),
		                         cls)
		return cls.SingleResultAsEncodedDict(result)


	@classmethod
	def update(cls, args):
		""" Update the status of item """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = ResearchProjectItems.query.get(args["researchprojectitemid"])
			rpi.researchprojectstatusid = args["researchprojectstatusid"]
			rpi.lastationdate = datetime.datetime.now()
			rpi.lastactionownerid = args["userid"]
#			if "notes" in args:
#				rpi.notes = args["notes"]

			# update complete
#			if args["researcheddate"]:
			rcr = ResearchControRecord.query.filter_by(
		      objectid=rpi.outletid,
		      objecttypeid=Constants.Object_Type_Outlet).one()
			rcr.last_research_date = datetime.datetime.now()
			research = session.query(ResearchDetails).filter(ResearchDetails.outletid == rpi.outletid).scalar()
			if research:
				research.last_research_date = datetime.date.today()
			else:
				session.add(ResearchDetails(outletid=rpi.outletid,
			                                last_research_date=datetime.date.today()))

			transaction.commit()
		except:
			LOGGER.exception("ResearchProjectItems update ")
			transaction.rollback()
			raise

	@classmethod
	def research_completed(cls, researchprojectitemid, userid, notes=None):
		""" Update the status of item """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = ResearchProjectItems.query.get(researchprojectitemid)
			rpi.researchprojectstatusid = 6
			rpi.lastationdate = datetime.datetime.now()
			rpi.lastactionownerid = userid
			if notes != None:
				rpi.notes = notes

			rcr = ResearchControRecord.query.filter_by(
			  objectid=rpi.outletid,
			  objecttypeid=Constants.Object_Type_Outlet).one()
			rcr.last_research_date = datetime.datetime.now()
			research = session.query(ResearchDetails).filter(ResearchDetails.outletid == rpi.outletid).scalar()
			if research:
				research.last_research_date = datetime.date.today()
			else:
				session.add(ResearchDetails(outletid=rpi.outletid,
				                            last_research_date=datetime.date.today()))
			transaction.commit()
		except:
			LOGGER.exception("research_completed")
			transaction.rollback()
			raise

	@classmethod
	def delete(cls, researchprojectitemid):
		""" Delete the probject item  """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = ResearchProjectItems.query.get(researchprojectitemid)
			if rpi:
				session.delete(rpi)
			transaction.commit()
		except:
			LOGGER.exception("delete")
			transaction.rollback()
			raise

class ResearchProjectChanges(BaseSql):
	""" ResearchProjectChanges"""
	Journalists_list = """
	SELECT 'A'|| chi.researchprojectchangeid AS key,
		'A' AS typeid,
	  chi.researchprojectchangeid AS objectid,
		JSON_ENCODE(ContactName(Json_Extract(chi.value,'prefix'),Json_Extract(chi.value,'firstname'),'',Json_Extract(chi.value,'familyname'),'')) AS contactname,
	  JSON_ENCODE(Json_Extract(chi.value,'job_title')) AS job_title,
	  UPPER(Json_Extract(chi.value,'firstname')) AS familyname,
	  chi.actiontypeid,
	  chi.applied::int,
	  'New' AS actiontypedescription,
	  false AS isprimary
	  FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND actiontypeid = 1 AND fieldid = 1
	UNION
	SELECT 'D'|| chi.researchprojectchangeid AS key,
		'D' AS typeid,
	  chi.researchprojectchangeid AS objectid,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,'',c.familyname,'')) AS contactname,
	  JSON_ENCODE(e.job_title) AS job_title,
	  UPPER(c.firstname) AS familyname,
	  chi.actiontypeid,
	  chi.applied::int,
	  'Delete' AS actiontypedescription,
	  CASE WHEN o.primaryemployeeid = e.employeeid THEN true ELSE false END AS isprimary
	  FROM research.researchprojectchanges AS chi
		JOIN employees AS e ON chi.employeeid = e.employeeid
	  JOIN outlets AS o ON o.outletid = e.outletid
		LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
	  WHERE researchprojectitemid =:researchprojectitemid AND chi.actiontypeid = 3
	  AND e.outletid = (select outletid FROM research.researchprojectitem WHERE researchprojectitemid =:researchprojectitemid LIMIT 1)
	UNION
	SELECT
		'E' || e.employeeid AS keyid,
	  'E' AS typeid,
		e.employeeid  AS objectid,
	  JSON_ENCODE(ContactName(COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 21),c.prefix),
	  COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 22),c.firstname),
	  c.middlename,
	  COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 23),c.familyname),
	  c.suffix)) AS contactname,
	  JSON_ENCODE(COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 2 ORDER BY chi.researchprojectchangeid desc LIMIT 1),e.job_title)) AS job_title,
	  UPPER(COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 23 ORDER BY chi.researchprojectchangeid desc LIMIT 1),c.familyname)) AS familyname,
	  IFNULL((SELECT actiontypeid FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 ORDER BY chi.researchprojectchangeid desc LIMIT 1),-1) AS actiontypeid,
	  IFNULL((SELECT MAX(applied::int) FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 LIMIT 1),0) AS applied,
	  CASE WHEN(SELECT actiontypeid FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 LIMIT 1) IS NULL THEN
	  'Not Modified' ELSE  'Change' END AS actiontypedescription,
	  CASE WHEN o.primaryemployeeid = e.employeeid THEN true ELSE false END AS isprimary
		FROM employees AS e
	  INNER JOIN outlets AS o On o.outletid = e.outletid
		LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
	  """

	Journalists_count = """
	SELECT COUNT(*)
	  FROM research.researchprojectchanges AS chi WHERE  researchprojectitemid =:researchprojectitemid AND(( actiontypeid = 1 AND fieldid = 1) OR(actiontypeid = 3))
	UNION
	SELECT COUNT(*) FROM employees AS e WHERE
		e.outletid = (select outletid FROM research.researchprojectitem WHERE researchprojectitemid =:researchprojectitemid LIMIT 1) AND
		e.customerid = -1 AND
	  e.prmaxstatusid = 1"""

	Journalists_whereused = """ WHERE
		e.outletid = (select outletid FROM research.researchprojectitem WHERE researchprojectitemid =:researchprojectitemid LIMIT 1) AND
	  e.employeeid NOT IN(SELECT employeeid FROM research.researchprojectchanges AS chi WHERE researchprojectitemid =:researchprojectitemid AND actiontypeid = 3) AND
		e.customerid = -1 AND
	  e.prmaxstatusid = 1"""

	@classmethod
	def journalist_changes(cls, params):
		"""et rest page """

		if "researchprojectitemid" in params:
			whereused = ResearchProjectChanges.Journalists_whereused
			used_count = ResearchProjectChanges.Journalists_count
			if "outletdeskid" in params:
				whereused += " AND e.outletdeskid =:outletdeskid"
				used_count += " AND e.outletdeskid =:outletdeskid"
				params["outletdeskid"] = int(params["outletdeskid"])

			data = cls.get_grid_page(
			  params,
			  'familyname',
			  'key',
			  ResearchProjectChanges.Journalists_list + whereused + BaseSql.Standard_View_Order,
			  used_count,
			  cls)
		else:
			data = dict(numRows=0, items=[], identifier="key")

		return cls.grid_to_rest(
		  data,
		  params["offset"],
		  True if "key" in params else False)

#########################################################
## Map object to db
#########################################################

ResearchProjectChanges.mapping = Table('researchprojectchanges', metadata, autoload=True, schema='research')
ResearchProjects.mapping = Table('researchprojects', metadata, autoload=True, schema='research')
ResearchProjectItems.mapping = Table('researchprojectitem', metadata, autoload=True, schema='research')

mapper(ResearchProjects, ResearchProjects.mapping)
mapper(ResearchProjectItems, ResearchProjectItems.mapping)
mapper(ResearchProjectChanges, ResearchProjectChanges.mapping)
