# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        md_Interests.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, Integer
from sqlalchemy.sql import text,not_

from prmax.prmaxmodel.md_Common import BaseSql
import prmax.Constants as Constants
from prcommon.lib.caching import Invalidate_Cache_Object_Research
from prcommon.model import OutletInterestView, EmployeeInterestView, \
     InterestGroups
from prcommon.model import Interests as InterestsBase

import logging
log = logging.getLogger("prmax.interests")

class Interests(InterestsBase):
	"""Prmax Main Applicartion Interests"""

	@classmethod
	def tagExists(cls, interestname, customerid, interesttypeid = Constants.Interest_Type_Tag):
		""" check to see if a specific tag exists or the customer"""

		result = session.query(Interests.interestid).filter_by(
			interestname = interestname,customerid = customerid,
			interesttypeid = interesttypeid)
		return True if result.count() else False

	@classmethod
	def addTag(cls, interestname, customerid):
		"""
		Adds a tag to the customer
		this is an interest that specific to a customer
		"""
		transaction = session.begin(subtransactions = True)
		try:
			# add interest record
			i = Interests(interestname = interestname,
						  customerid = customerid,
						  interesttypeid = Constants.Interest_Type_Tag)
			session.add(i)
			session.flush()
			# need to add the interest to the tag list
			parentinterestid = session.query(Interests.interestid).filter_by(
				interestname = Constants.Interest_Tag_Root_Name).first()[0]
			ig = InterestGroups ( parentinterestid = parentinterestid,
								  childinterestid = i.interestid)
			session.add(ig)
			session.flush()
			transaction.commit()
			# returns new tags id
			return i.interestid
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("Interest add tag : %s"% str(ex))
			raise ex

	@classmethod
	def deleteTag(cls, interestid):
		"""
		Delete a tag from the system
		"""
		transaction = session.begin(subtransactions = True)
		try:
			# get interest  and delete
			result = session.query(Interests).filter_by(interestid = interestid).first()
			session.delete(result)
			session.flush()
			transaction.commit()
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("Interest delete tag : %s"% str(ex))
			raise ex

	@classmethod
	def updateTag(cls, interestname, interestid):
		""" Update the text of a tag
		"""
		transaction = session.begin(subtransactions = True)
		try:
			# find the interest and chnage name
			interest = cls.getTag(interestid)
			interest.interestname = interestname
			session.flush()
			transaction.commit()
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("Interest update tag : %s"% str(ex))
			raise ex

	@classmethod
	def getTag(cls, interestid):
		""" get the details of a specific interest/tag"""
		return Interests.query.get(interestid)

	@classmethod
	def tags(cls, customerid):
		"""
		returns a list of tags for a specific customer account
		"""
		return session.query(Interests).filter_by(
			customerid = customerid,
			interesttypeid=Constants.Interest_Type_Tag).order_by(
				Interests.interestname).all()

	ListData = """
		SELECT
			i.interestid,
			i.interestname,
	    ign.interestname as parentname,
	    IFNULL( ign.interestid,-1) as parentinterestid,
	    ( SELECT true FROM interestgroups as tmp WHERE tmp.parentinterestid IS NULL AND i.interestid =  tmp.childinterestid) AS is_section

		FROM interests AS i
	    LEFT OUTER JOIN interestgroups AS ig ON ig.childinterestid = i.interestid
	    LEFT OUTER JOIN interests AS ign ON ig.parentinterestid = ign.interestid
	    %s
	    GROUP BY i.interestid, i.interestname,ign.interestname,ign.interestid
		%s
		LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM interests AS i %s"""

	@classmethod
	def getGridPageResearch( cls, kw ) :
		""" get a grid list of intreste"""

		whereclause = "WHERE i.customerid = -1 "
		if kw.has_key("filter") and kw["filter"]:
			whereclause += " AND i.interestname ilike :filter"
			kw["filter"] = kw["filter"]  + "%"

		return BaseSql.getGridPage( kw,
									'interestname',
									'',
									Interests.ListData % (whereclause,"ORDER BY  %s %s"),
									Interests.ListDataCount % whereclause,
									cls )

	ListData_Outlet = """
		SELECT
			ov.outletid,
			o.outletname,
	        ov.interestid
		FROM outletinterest_view AS ov
	    JOIN outlets AS o ON ov.outletid = o.outletid
	    WHERE ov.customerid = -1 AND ov.interestid = :interestid
		ORDER BY  %s %s
		LIMIT :limit  OFFSET :offset """

	ListDataCount_Outlet = """SELECT COUNT(*) FROM outletinterest_view WHERE customerid = -1 AND interestid = :interestid"""

	@classmethod
	def research_get_where_used_outlet( cls, kw ) :
		""" get a grid list of intreste"""

		if not kw.has_key("interestid"):
			return dict (numRows  = 0,	items = [] , identifier = 'outletid' )

		return BaseSql.getGridPage( kw,
									'interestname',
									'outletid',
									Interests.ListData_Outlet,
									Interests.ListDataCount_Outlet,
									cls )

	ListData_Employee = """
		SELECT ev.employeeid,ev.interestname,o.outletname,e.job_title,ContactName(c.familyname,c.firstname,c.prefix,'','') as contactname,
	    ev.interestid
	    FROM employeeinterest_view AS ev
	    JOIN employees AS e ON e.employeeid = ev.employeeid
	    JOIN outlets AS o ON o.outletid = e.outletid
	    LEFT OUTER JOIN contacts as c on c.contactid = e.contactid
	    WHERE interestid = :interestid AND ev.customerid = -1
	    ORDER BY  %s %s
		LIMIT :limit  OFFSET :offset """

	ListDataCount_Employee= """SELECT COUNT(*) FROM employeeinterest_view as ev WHERE interestid = :interestid AND ev.customerid = -1"""

	@classmethod
	def research_get_where_used_employee( cls, kw ) :
		""" get a grid list of intreste"""

		if not kw.has_key("interestid"):
			return dict (numRows  = 0,	items = [] , identifier = 'employeeid' )

		return BaseSql.getGridPage( kw,
									'interestname',
									'employeeid',
									Interests.ListData_Employee,
									Interests.ListDataCount_Employee,
									cls )

	@classmethod
	def research_add(cls, kw):
		"""
		Add a interest to the system for gemeral use"""

		transaction = cls.sa_get_active_transaction()

		try:
			# add interest record
			i = Interests(interestname = kw["interestname"],
						  customerid = -1,
						  interesttypeid = Constants.Interest_Type_Standard)
			session.add(i)
			session.flush()
			if kw["parentinterestid"] != -1:
				ig = InterestGroups ( parentinterestid = kw["parentinterestid"],
				                      childinterestid = i.interestid)

			if kw.has_key("is_section"):
				ig = InterestGroups ( childinterestid = i.interestid )

			transaction.commit()
			# returns new tags id
			return i.interestid
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("research_add_interest : %s"% str(ex))
			raise ex

	@classmethod
	def research_exists(cls, interestname, interestid):
		""" check to see if a specific tag exists or the customer"""

		result = session.query(Interests.interestid).filter_by(
		    interestname = interestname).filter_by(
		    customerid = -1).filter(
		    not_(Interests.interestid == interestid)).filter_by(
			interesttypeid = Constants.Interest_Type_Standard)
		return True if result.count() else False


	@classmethod
	def research_update(cls, kw):
		"""
		Add a interest to the system for gemeral use"""

		transaction = cls.sa_get_active_transaction()

		try:
			# add interest record
			i = Interests.query.get( kw["interestid"] )
			i.interestname = kw["interestname"]

			# find filter
			result = session.query(InterestGroups).filter_by(
			    childinterestid = i.interestid).all()

			if result and kw["parentinterestid"]  != result[0].parentinterestid:
				# filter exists and chnaged
				if kw["parentinterestid"] == -1:
					session.delete ( result[0] )
				else:
					result[0].parentinterestid = kw["parentinterestid"]
			elif not result and ( kw["parentinterestid"] != -1 and  kw["parentinterestid"] != None):
				# no filter but filter added
				ig = InterestGroups ( parentinterestid = kw["parentinterestid"],
				                      childinterestid = i.interestid)

			result = session.query(InterestGroups).filter_by(
			  childinterestid = i.interestid, parentinterestid = None).all()
			if kw.has_key("is_section"):
				if not result:
					ig = InterestGroups ( childinterestid = i.interestid )
					session.add ( ig )
			else:
				if result:
					session.delete ( result[0] )

			Invalidate_Cache_Object_Research(cls, None ,
			                                 Constants.Cache_Search_Outlet_Interests )

			transaction.commit()
			return i.interestid
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("research_update_interest : %s"% str(ex))
			raise ex

	@classmethod
	def get(cls, interestid):
		""" get the details of a specific interest/tag"""
		interest = Interests.query.get(interestid)
		result = session.query(InterestGroups).filter_by(
		  childinterestid = interest.interestid, parentinterestid = None).all()
		parent = session.query(InterestGroups).filter_by(
		    childinterestid = interestid).first()
		return dict ( interest = interest , parentinterest = parent ,
		              is_section = True if result else False)

	@classmethod
	def research_delete(cls, kw):
		""" Delete an interest from the system research only """

		transaction = cls.sa_get_active_transaction()

		try:
			# get interest  and delete
			i = Interests.query.get( kw["interestid"]  )
			session.delete(i)

			Invalidate_Cache_Object_Research(cls, None ,
			                        Constants.Cache_Search_Outlet_Interests )

			transaction.commit()
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("research Interest delete  : %s"% str(ex))
			raise ex

	_MoveScript = """
	INSERT INTO outletinterests(customerid,interestid,outletid)
		SELECT customerid,:tointerestid,outletid FROM outletinterests WHERE interestid=:frominterestid
	    	AND outletid NOT IN (SELECT outletid FROM outletinterests WHERE interestid = :tointerestid);
	DELETE FROM outletinterests WHERE interestid=:frominterestid ;
	INSERT INTO employeeinterests(customerid,interestid,employeeid,outletid)
	    SELECT customerid,:tointerestid,employeeid,outletid FROM employeeinterests WHERE interestid=:frominterestid
	    	AND employeeid NOT IN (SELECT employeeid FROM employeeinterests WHERE interestid = :tointerestid);
	DELETE FROM employeeinterests WHERE interestid=:frominterestid ;"""

	@classmethod
	def move(cls, kw):
		""" move one interest's coverage to another """

		transaction = cls.sa_get_active_transaction()

		try:
			session.execute(text(Interests._MoveScript),kw, cls)
			transaction.commit()
		except Exception,ex:
			try:
				transaction.rollback()
			except : pass
			log.error("research Interest delete  : %s"% str(ex))
			raise ex


# load tables from db
interestwords_table = Table('interests', metadata, autoload=True)
mapper(Interests, InterestsBase.mapping)
