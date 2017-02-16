# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        projects.py
# Purpose:     Hold all the project info
# Author:      Chris Hoy
#
# Created:     08/06/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from sqlalchemy.sql import text
from types import ListType, TupleType
from prcommon.model.common import BaseSql
from prcommon.model.list import List

import logging
log = logging.getLogger("prmax.model")

class Project(BaseSql):
	""" a way of grouping lists together a kust can be a memebr
    of a  multiple projects"""
	Command_List_Projects = """SELECT p.projectname,pj.projectid FROM userdata.projectmembers as pj JOIN userdata.projects as p ON pj.projectid = p.projectid WHERE pj.listid = :listid ORDER BY p.projectname"""
	Command_List_Customer_Projects = """SELECT p.projectname,p.projectid FROM userdata.projects as p WHERE p.customerid = :customerid  AND p.projectname ILIKE :projectname ORDER BY p.projectname"""
	Command_List_Customer_Projects_Count = """SELECT COUNT(*) FROM userdata.projects WHERE customerid = :customerid AND projectname ILIKE :projectname """


	List_Customer_Projects = """
		SELECT JSON_ENCODE(p.projectname )  as projectname,p.projectid
		FROM userdata.projects AS p
		WHERE p.customerid = :customerid
		ORDER BY  %s %s
		LIMIT :limit  OFFSET :offset """

	List_Combo_Projects = """
		SELECT JSON_ENCODE(p.projectname )  as projectname,p.projectid
		FROM userdata.projects AS p
		WHERE p.customerid = :customerid AND
		p.projectname ilike :projectname
		LIMIT :limit  OFFSET :offset """


	List_Customer_Projects_Count = """
		SELECT COUNT(*) FROM userdata.projects WHERE customerid = :customerid"""

	@classmethod
	def getForList(cls, listid):
		""" returns a list of project that the listy is a memebr of """
		return cls.sqlExecuteCommand (
			text(Project.Command_List_Projects) ,
			dict(listid = listid),
			BaseSql.ResultAsEncodedDict)

	@classmethod
	def Exits( cls, customerid, projectname):
		""" Check to see if a project exists """
		result = session.query(Project.projectid).filter_by(
			customerid = customerid,
			projectname = projectname)
		return True if result.count() else False

	@classmethod
	def AddProjectAddList(cls, customerid, listid, projectname):
		""" Add a new project and add the list to the project """

		transaction = session.begin(subtransactions=True)
		try:
			project = Project (customerid = customerid,
			       projectname = projectname)
			session.add(project)
			session.flush()
			session.add(ProjectMember ( listid = listid ,
										 projectid = project.projectid ) )
			transaction.commit()
			return project
		except Exception, ex:
			try:
				transaction.rollback()
			except:pass
			log.exception(ex)
			raise ex

	@classmethod
	def AddProject(cls, customerid,  projectname):
		""" Add a new project"""

		transaction = cls.sa_get_active_transaction()
		try:
			project = Project (customerid = customerid,
			       projectname = projectname)
			session.add(project)
			session.flush()
			transaction.commit()
			return project
		except Exception, ex:
			try:
				transaction.rollback()
			except:pass
			log.exception(ex)
			raise ex

	@classmethod
	def Delete(cls, projectid ):
		""" Delete a project """

		transaction = cls.sa_get_active_transaction()
		try:
			project = Project.query.get( projectid )
			session.delete ( project )
			session.flush()
			transaction.commit()
			return project
		except Exception, ex:
			try:
				transaction.rollback()
			except:pass
			log.exception(ex)
			raise ex


	@classmethod
	def getProjectList(cls, customerid, name, count,  start):
		""" return a list of projects """
		return cls.sqlExecuteCommand(
			text(Project.Command_List_Customer_Projects),
			dict( customerid = customerid,
				  projectname = name.replace("*","")+"%",
				  name = name,
				  limit = count,
				  offset= start ),
			BaseSql.ResultAsEncodedDict)

	@classmethod
	def getProjectListCount(cls, customerid, name ):
		""" get project list count """
		return cls.sqlExecuteCommand(
			text(Project.Command_List_Customer_Projects_Count),
			dict( customerid=customerid,
				  projectname=name.replace("*","")+"%"),
			cls.singleFieldInteger)

	@classmethod
	def getGridPage(cls, kw ):
		""" get a page of collateral for a grid"""
		return BaseSql.getGridPage( kw,
								'projectname',
								'projectid',
								Project.List_Customer_Projects,
								Project.List_Customer_Projects_Count,
								cls )

	@classmethod
	def getListPage(cls, kw ):
		return BaseSql.getListPage( kw,
									'projectname',
									'projectid',
									Project.List_Combo_Projects,
									'projectid',
									cls)


	@classmethod
	def get( cls, kw ) :
		return cls.query.get(kw["projectid"])

	List_User_selection = """ SELECT p.projectname,p.projectid from userdata.projects as p
	WHERE p.projectname ilike :word AND
	p.customerid=:customerid
	ORDER BY p.projectname"""
	List_User_selection_All = """ SELECT p.projectname,p.projectid from userdata.projects as p
	WHERE p.customerid=:customerid
	ORDER BY p.projectname"""

	@classmethod
	def get_user_selection(cls, kw):
		"""	select a list of project based on the user criteria"""
		def _convert(data):
			"internal"
			return [(row.projectname, row.projectid)
					for row in data.fetchall()]

		command = Project.List_User_selection_All if kw["word"] == "*%" \
				else Project.List_User_selection

		return cls.sqlExecuteCommand ( text( command ),	kw, _convert)

class ProjectMember(BaseSql):
	""" an entry in a project"""
	Command_Projects_List = """SELECT p.projectname,pj.projectid,pj.listid FROM userdata.projectmembers as pj JOIN userdata.projects as p ON pj.projectid = p.projectid WHERE pj.listid = :listid AND pj.projectid = :projectid"""

	Lists_Projects = """SELECT l.listname,
	pj.listid,
	(SELECT COUNT(*) FROM userdata.listmembers as lm WHERE lm.listid = l.listid) as count
	FROM userdata.projectmembers as pj JOIN userdata.list as l ON pj.listid = l.listid
	WHERE pj.projectid = :projectid
	ORDER BY  %s %s
	LIMIT :limit  OFFSET :offset """

	Lists_Projects_Count = """SELECT COUNT(*)
	FROM userdata.projectmembers
	WHERE projectid = :projectid"""


	@classmethod
	def Exists(cls, listid, projectid):
		""" check to see if the list is a member of a project"""
		result = session.query(ProjectMember.projectid).filter_by(
			projectid = projectid,
			listid = listid)
		return True if result.count() else False

	@classmethod
	def add(cls, listid, projectid):
		""" add a project """
		transaction = session.begin(subtransactions=True)
		try:
			p = ProjectMember(
				listid = listid,
				projectid = projectid)
			session.add(p)
			session.flush()
			transaction.commit()
			return p
		except Exception,ex:
			log.error("ProjectMember : %s"% str(ex))
			try:
				transaction.rollback()
			except : pass
			raise ex

	@classmethod
	def getMember(cls, listid, projectid):
		""" get details of a a single list/project combination"""
		return cls.sqlExecuteCommand (
			text(ProjectMember.Command_Projects_List) ,
			dict(listid = listid,
				 projectid = projectid),
			cls._singleResultAsDict,
			True)

	@classmethod
	def delete(cls, listid, projects):
		""" Delete list/lists from a project"""
		if type(projects) in (ListType, TupleType):
			command = """DELETE from userdata.projectmembers where listid=:listid AND projectid in (%s)""" \
					% ",".join([str(f) for f in projects])
		else:
			command = "DELETE from userdata.projectmembers WHERE listid=:listid AND projectid=:projectid"
		return cls.sqlExecuteCommand (
			text(command) ,
			dict(listid = listid,
				 projectid = projects),
			None,
			True)

	@classmethod
	def getGridPage(cls, kw ):
		""" get a page of project list members  for a grid"""
		return BaseSql.getGridPage( kw,
								'listname',
								'listid',
								ProjectMember.Lists_Projects,
								ProjectMember.Lists_Projects_Count,
								cls )

class ProjectCollateral(BaseSql):

	Lists_Projects = """SELECT c.collateralname,
	pc.collateralid
	FROM userdata.projectcollateral as pc JOIN userdata.collateral as c ON pc.collateralid = c.collateralid
	WHERE pc.projectid = :projectid
	ORDER BY  %s %s
	LIMIT :limit  OFFSET :offset """

	Lists_Projects_Count = """SELECT COUNT(*)
	FROM userdata.projectcollateral
	WHERE projectid = :projectid"""

	@classmethod
	def getGridPage(cls, kw ):
		""" get a page of collateral for a grid"""
		return BaseSql.getGridPage( kw,
								'collateralname',
								'collateralid',
								ProjectCollateral.Lists_Projects,
								ProjectCollateral.Lists_Projects_Count,
								cls )


#########################################################
## Map object to db
#########################################################

Project.mapping = Table('projectmembers', metadata, autoload = True, schema='userdata')
ProjectMember.mapping = Table('projects', metadata, autoload = True, schema='userdata')
ProjectCollateral.mapping = Table('projectcollateral', metadata, autoload = True, schema='userdata')

mapper(Project, Project.mapping)
mapper(ProjectMember, Project.mapping)
mapper(ProjectCollateral, ProjectCollateral.mapping)