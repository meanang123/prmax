# -*- coding: utf-8 -*-
" Research Interests "
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
from sqlalchemy import Table
from sqlalchemy.sql import text, not_
from ttl.model import BaseSql
import prcommon.Constants as Constants
from prcommon.lib.caching import Invalidate_Cache_Object_Research
from prcommon.model import Interests,  InterestGroups

import logging
LOGGER = logging.getLogger("prmax.interests")

class InterestsResearch(Interests):
	"""Prmax Main Applicartion Interests"""

	@classmethod
	def tag_exists(cls, interestname, customerid, interesttypeid = Constants.Interest_Type_Tag):
		""" check to see if a specific tag exists or the customer"""

		result = session.query(Interests.interestid).filter_by(
			interestname = interestname,customerid = customerid,
			interesttypeid = interesttypeid)
		return True if result.count() else False

	@classmethod
	def add_tag(cls, interestname, customerid):
		"""
		Adds a tag to the customer
		this is an interest that specific to a customer
		"""
		transaction = BaseSql.get_active_transaction()
		try:
			# add interest record
			interest = Interests(interestname = interestname,
						  customerid = customerid,
						  interesttypeid = Constants.Interest_Type_Tag)
			session.add(interest)
			session.flush()
			# need to add the interest to the tag list
			parentinterestid = session.query(Interests.interestid).filter_by(
				interestname = Constants.Interest_Tag_Root_Name).first()[0]
			interestgroup = InterestGroups ( parentinterestid = parentinterestid,
			                      childinterestid = interest.interestid)
			session.add(interestgroup)
			session.flush()
			transaction.commit()
			# returns new tags id
			return interest.interestid
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("Interest add tag")
			raise

	@classmethod
	def delete_tag(cls, interestid):
		"""
		Delete a tag from the system
		"""
		transaction = BaseSql.get_active_transaction()
		try:
			# get interest  and delete
			result = session.query(Interests).filter_by(interestid = interestid).first()
			session.delete(result)
			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("Interest delete tag")
			raise

	@classmethod
	def update_tag(cls, interestname, interestid):
		""" Update the text of a tag
		"""
		transaction = BaseSql.get_active_transaction()
		try:
			# find the interest and chnage name
			interest = cls.getTag(interestid)
			interest.interestname = interestname
			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("Interest update tag")
			raise

	@classmethod
	def get_tag(cls, interestid):
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
	  interest.interestid AS id,
			interest.interestid,
			interest.interestname,
	    ign.interestname as parentname,
	    IFNULL( ign.interestid,-1) as parentinterestid,
	    ( SELECT true FROM interestgroups as tmp WHERE tmp.parentinterestid IS NULL AND interest.interestid =  tmp.childinterestid) AS is_section

		FROM interests AS interest
	    LEFT OUTER JOIN interestgroups AS interestgroup ON interestgroup.childinterestid = interest.interestid
	    LEFT OUTER JOIN interests AS ign ON interestgroup.parentinterestid = ign.interestid
	    %s
	    GROUP BY interest.interestid, interest.interestname,ign.interestname,ign.interestid
		%s
		LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM interests AS interest %s"""

	@classmethod
	def get_rest_page_research( cls, params ) :
		""" get a grid list of intreste"""

		whereclause = BaseSql.addclause("","interest.customerid = -1")

		if "filter" in params and params["filter"]:
			whereclause = BaseSql.addclause(whereclause,"interest.interestname ilike :filter")
			params["filter"] = params["filter"]  + "%"

		if "interestname" in  params:
			whereclause = BaseSql.addclause(whereclause, "interest.interestname ilike :interestname")
			params["interestname"] = params["interestname"].replace("*", "%")

		if "interestid" in params:
			whereclause = BaseSql.addclause(whereclause, "interest.interestid = :interestid")

		if params["sortfield"] == "interestname" :
			params["sortfield"] = "UPPER(interest.interestname) "



		data = BaseSql.getGridPage(
		  params,
		  'interestname',
		  'interestid',
		  InterestsResearch.ListData % (whereclause,"ORDER BY  %s %s"),
		  InterestsResearch.ListDataCount % whereclause,
		  cls )

		return cls.grid_to_rest(
		  data,
		  params["offset"],
		  True if "interestid" in params else False )

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
	def research_get_where_used_outlet_rest( cls, params ) :
		""" get a grid list of intreste"""
		data = cls.research_get_where_used_outlet( params)

		return cls.grid_to_rest(data, params["offset"], False)

	@classmethod
	def research_get_where_used_outlet( cls, params ) :
		""" get a grid list of intreste"""

		if not "interestid" in params:
			return dict (numRows  = 0,	items = [] , identifier = 'outletid' )

		return BaseSql.getGridPage( params,
									'interestname',
									'outletid',
									InterestsResearch.ListData_Outlet,
									InterestsResearch.ListDataCount_Outlet,
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

	ListDataCount_Employee = """SELECT COUNT(*) FROM employeeinterest_view as ev WHERE interestid = :interestid AND ev.customerid = -1"""

	@classmethod
	def research_get_where_used_employee_rest( cls, params ) :
		""" rest"""

		data =  cls.research_get_where_used_employee (params)

		return cls.grid_to_rest(data, params["offset"], False)


	@classmethod
	def research_get_where_used_employee( cls, params ) :
		""" get a grid list of intreste"""

		if not "interestid" in params:
			return dict (numRows  = 0,	items = [] , identifier = 'employeeid' )

		return BaseSql.getGridPage( params,
									'interestname',
									'employeeid',
									InterestsResearch.ListData_Employee,
									InterestsResearch.ListDataCount_Employee,
									cls )

	@classmethod
	def research_add(cls, params):
		"""
		Add a interest to the system for gemeral use"""

		transaction = BaseSql.get_active_transaction()

		try:
			# add interest record
			interest = Interests(interestname = params["interestname"],
						  customerid = -1,
						  interesttypeid = Constants.Interest_Type_Standard)
			session.add(interest)
			session.flush()

			if params["parentinterestid"] != -1:
				integrestgroup = InterestGroups ( parentinterestid = params["parentinterestid"],
				                      childinterestid = interest.interestid)
				session.add(integrestgroup)


			if "is_section" in params:
				integrestgroup = InterestGroups ( childinterestid = interest.interestid )
				session.add(integrestgroup)

			transaction.commit()
			# returns new tags id
			return interest.interestid
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("research_add_interest")
			raise

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
	def research_update(cls, params):
		"""
		Add a interest to the system for gemeral use"""

		transaction = BaseSql.get_active_transaction()

		try:
			# add interest record
			interest = Interests.query.get( params["interestid"] )
			interest.interestname = params["interestname"]

			# find filter
			result = session.query(InterestGroups).filter_by(
			    childinterestid = interest.interestid).all()

			if result and params["parentinterestid"]  != result[0].parentinterestid:
				# filter exists and chnaged
				if params["parentinterestid"] == -1:
					session.delete ( result[0] )
				else:
					result[0].parentinterestid = params["parentinterestid"]
			elif not result and ( params["parentinterestid"] != -1 and  params["parentinterestid"] != None):
				# no filter but filter added
				interestgroup = InterestGroups ( parentinterestid = params["parentinterestid"],
				                      childinterestid = interest.interestid)

			result = session.query(InterestGroups).filter_by(
			  childinterestid = interest.interestid, parentinterestid = None).all()
			if "is_section" in params:
				if not result:
					interestgroup = InterestGroups ( childinterestid = interest.interestid )
					session.add ( interestgroup )
			else:
				if result:
					session.delete ( result[0] )

			Invalidate_Cache_Object_Research(cls, None ,
			                                 Constants.Cache_Search_Outlet_Interests )

			transaction.commit()
			return interest.interestid
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("research_update_interest")
			raise

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
	def research_delete(cls, params):
		""" Delete an interest from the system research only """

		transaction = BaseSql.get_active_transaction()

		try:
			# get interest  and delete
			interest = Interests.query.get( params["interestid"]  )
			session.delete(interest)

			Invalidate_Cache_Object_Research(cls, None ,
			                        Constants.Cache_Search_Outlet_Interests )

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.error("research Interest delete")
			raise

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
	def move(cls, params):
		""" move one interest's coverage to another """

		transaction = BaseSql.get_active_transaction()

		try:
			session.execute(text(InterestsResearch._MoveScript), params, cls)
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("research Interest delete")
			raise


# load tables from db
mapper(InterestsResearch, Interests.mapping)
