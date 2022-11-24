# -*- coding: utf-8 -*-
"""Interest Model"""
#-----------------------------------------------------------------------------
# Name:        Interests.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     06-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
import logging
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, Integer, text, not_
from ttl.model import BaseSql
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")


class InterestGroups(BaseSql):
	"""InterestGroups"""
	List_Top_Groups = """
	SELECT ig.childinterestid,JSON_ENCODE(i.interestname) as interestname
	FROM interestgroups  as ig
	JOIN interests as i ON i.interestid = ig.childinterestid
	WHERE  ig.parentinterestid is NULL AND (i.customerid=-1 OR i.customerid=:customerid)
	GROUP BY ig.childinterestid,i.interestname
	ORDER BY i.interestname"""

	@classmethod
	def getLookUp(cls, params):
		""" get lookups for igroups"""

		if "customerid" not  in params:
			params["customerid"] = -1

		def _convert(data):
			"internal"

			if "sections" in params:
				return  [dict(id=-1, name="All Categories")] +\
				        [dict(id=row.childinterestid, name=row.interestname)
				         for row in data.fetchall()]
			else:
				return  [dict(id=-1, name="No Filter")] +\
				        [dict(id=row.childinterestid, name=row.interestname)
				         for row in data.fetchall()]

		return cls.sqlExecuteCommand(text(InterestGroups.List_Top_Groups),
		                            params,
		                            _convert)

class Interests(BaseSql):
	"""Interests"""
	Interest_User_Selection = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	LEFT OUTER JOIN userdata.setindex AS si ON  ( si.customerid=-1 OR si.customerid=:customerid) AND si.keytypeid = :keytypeid AND i.interestid = si.keyname::int
	WHERE iw.interestword ilike :word AND
	(i.customerid=-1 OR i.customerid =:customerid) AND
	( ig.parentinterestid = :filter OR :filter=-1) AND
	i.interesttypeid = :interesttypeid AND
	( si IS NOT NULL OR si.nbr> 0 )
	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	Interest_User_Selection_All_Level = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	LEFT OUTER JOIN userdata.setindex AS si ON  ( si.customerid=-1 OR si.customerid=:customerid) AND si.keytypeid = :keytypeid AND i.interestid = si.keyname::int
	WHERE
	(i.customerid=-1 OR i.customerid =:customerid) AND
	 ig.parentinterestid = :filter AND
	i.interesttypeid = :interesttypeid AND
	( si IS NOT NULL OR si.nbr> 0 )
	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	Interest_User_Selection_NoNbr_Restrict = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	WHERE iw.interestword ilike :word AND
	(i.customerid=-1 OR i.customerid =:customerid) AND
	( ig.parentinterestid = :filter OR :filter=-1) AND
	i.interesttypeid = :interesttypeid
	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	Interest_User_Selection_All_Level_NoNbr_Restrict = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	WHERE
	(i.customerid=-1 OR i.customerid =:customerid) AND
	 ig.parentinterestid = :filter AND
	i.interesttypeid = :interesttypeid
	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	Interest_User_Selection_Restrict_Range_NoNbr = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	WHERE iw.interestword ilike :word AND
	(i.customerid=-1 OR i.customerid =:customerid) AND
	( ig.parentinterestid = :filter OR :filter=-1) AND
	i.interesttypeid = :interesttypeid
	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	Interest_User_Selection_All_Level_Restrict_Range_NoNbr = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	WHERE
	(i.customerid=-1 OR i.customerid =:customerid) AND
	 ig.parentinterestid = :filter AND
	i.interesttypeid = :interesttypeid
	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	Interest_User_Selection_All_Tags = """
	SELECT i.interestname,i.interestid from interestwords as iw
	JOIN interests as i ON i.interestid = iw.interestid
	LEFT OUTER JOIN interestgroups as ig on ig.childinterestid=i.interestid
	WHERE
	(i.customerid=-1 OR i.customerid =:customerid) AND
	i.interesttypeid = :interesttypeid

	GROUP BY i.interestname,i.interestid
	ORDER BY i.interestname"""

	@classmethod
	def get_user_selection(cls, params):
		""" gets a list onterest based upon the user seelction in the params
		      Sql is in the Interest_User_Selection field
			  params
			  filter is a -1 to ignore or a number
			  customerid is the current customer to add in private ones
			  interesttypeid restrict the list to a specific type of interest ie standard
			  or tags
		"""
		def _sort_funct(pone, ptwo):
			"""Sort Function"""
			return cmp(pone[0], ptwo[0])

		def _convert(data):
			"internal"
			try:
				rdata = [(row.interestname, row.interestid)
					         for row in data.fetchall()]
			except:
				rdata = []

			if params["word"] == "*%" and params["filter"] != -1:
				i = Interests.query.get(params["filter"])
				rdata.append((i.interestname, i.interestid))
				rdata.sort(_sort_funct)

			return rdata

		if params["word"] == "*%" and (params["filter"] != -1 or \
						params["interesttypeid"] == Constants.Interest_Type_Tag):
			if params["interesttypeid"] == Constants.Interest_Type_Tag:
				command = text(Interests.Interest_User_Selection_All_Tags)
			else:
				if params["restrict"] == "0":
					command = text(Interests.Interest_User_Selection_All_Level_NoNbr_Restrict)
				else:
					command = text(Interests.Interest_User_Selection_All_Level)

			return cls.sqlExecuteCommand(command,
										 params, _convert)
		else:
			if params["restrict"] == "0":
				command = text(Interests.Interest_User_Selection_NoNbr_Restrict)
			else:
				command = text(Interests.Interest_User_Selection)

			return cls.sqlExecuteCommand(command, params, _convert)


	@classmethod
	def get(cls, interestid):
		""" get the details of a specific interest/tag"""
		interest = Interests.query.get(interestid)
		parent = session.query(InterestGroups).filter_by(
		    childinterestid=interestid).first()
		if parent and parent.parentinterestid:
			parentinterest = Interests.query.get(parent.parentinterestid)
		else:
			parentinterest = None

		data = dict(interest=interest,
		            interestid=interest.interestid,
		            interestname=interest.interestname,
		            parentinterest=parent,
		            parentinterest_d=parentinterest)

		if parentinterest:
			data["parentinterestid"] = parentinterest.interestid
			data["parentname"] = parentinterest.interestname
		interestgroup = session.query(InterestGroups).\
		  filter(InterestGroups.childinterestid == interest.interestid).\
		  filter(InterestGroups.parentinterestid is None).all()
		data["is_section"] = True if interestgroup else False

		return data


	_TopLevel = """SELECT i.interestid, i.interestname"""
	@classmethod
	def interesttree(cls, params, key):
		""" Interest Tree """


		def _child_node(interest1):
			"""Cheild function"""
			data = {'$ref':interest1.interestid, 'name':interest1.interestidname, 'id':interest1.interestidid}
			if interest1.counts:
				data['children'] = True
			return data

		data = {}
		return data


	@classmethod
	def tag_exists(cls, interestname, customerid, interesttypeid=Constants.Interest_Type_Tag):
		""" check to see if a specific tag exists or the customer"""

		result = session.query(Interests.interestid).filter_by(
			interestname=interestname,
		    customerid=customerid,
			interesttypeid=interesttypeid)
		return True if result.count() else False

	@classmethod
	def add_tag(cls, interestname, customerid):
		"""
		Adds a tag to the customer
		this is an interest that specific to a customer
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			# add interest record
			interest = Interests(interestname=interestname,
						  customerid=customerid,
						  interesttypeid=Constants.Interest_Type_Tag)
			session.add(interest)
			session.flush()
			# need to add the interest to the tag list
			parentinterestid = session.query(Interests.interestid).filter_by(
				interestname=Constants.Interest_Tag_Root_Name).first()[0]
			interestgroup = InterestGroups(parentinterestid=parentinterestid,
								  childinterestid=interest.interestid)
			session.add(interestgroup)
			session.flush()
			transaction.commit()
			# returns new tags id
			return interest.interestid
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("Interest add tag")
			raise

	@classmethod
	def delete_tag(cls, interestid):
		"""
		Delete a tag from the system
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			# get interest  and delete
			result = session.query(Interests).filter_by(interestid=interestid).first()
			session.delete(result)
			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("Interest delete tag")
			raise

	@classmethod
	def update_tag(cls, interestname, interestid):
		""" Update the text of a tag
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			# find the interest and chnage name
			interest = cls.getTag(interestid)
			interest.interestname = interestname
			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("Interest update tag")
			raise

	@classmethod
	def research_add(cls, params):
		"""
		Add a interest to the system for gemeral use"""

		transaction = cls.sa_get_active_transaction()

		try:
			# add interest record
			interest = Interests(interestname=params["interestname"],
						  customerid=-1,
						  interesttypeid=Constants.Interest_Type_Standard)
			session.add(interest)
			session.flush()
			if params["parentinterestid"] != -1:
				interestgroup = InterestGroups(
				  parentinterestid=params["parentinterestid"],
				  childinterestid=interest.interestid)
				session.add(interestgroup)

			if params.has_key("is_section"):
				interestgroup = InterestGroups(childinterestid=interest.interestid)
				session.add(interestgroup)

			transaction.commit()
			# returns new tags id
			return interest.interestid
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("research_add_interest")
			raise

	@classmethod
	def research_exists(cls, interestname, interestid):
		""" check to see if a specific tag exists or the customer"""

		result = session.query(Interests.interestid).filter_by(
		    interestname=interestname).filter_by(
		    customerid=-1).filter(
		    not_(Interests.interestid == interestid)).filter_by(
			interesttypeid=Constants.Interest_Type_Standard)
		return True if result.count() else False


	@classmethod
	def research_update(cls, params):
		"""
		Add a interest to the system for gemeral use"""

		transaction = cls.sa_get_active_transaction()

		try:
			# add interest record
			interest = Interests.query.get(params["interestid"])
			i.interestname = params["interestname"]

			# find filter
			result = session.query(InterestGroups).filter_by(
			    childinterestid=interest.interestid).all()

			if result and params["parentinterestid"] != result[0].parentinterestid:
				# filter exists and chnaged
				if params["parentinterestid"] == -1:
					session.delete(result[0])
				else:
					result[0].parentinterestid = params["parentinterestid"]
			elif not result and (params["parentinterestid"] != -1 and  params["parentinterestid"] != None):
				# no filter but filter added
				interestgroup = InterestGroups(parentinterestid=params["parentinterestid"],
				                      childinterestid=interest.interestid)

			result = session.query(InterestGroups).filter_by(
			  childinterestid=interest.interestid, parentinterestid=None).all()
			if params.has_key("is_section"):
				if not result:
					session.add(InterestGroups(childinterestid=interest.interestid))
			else:
				if result:
					session.delete(result[0])

			Invalidate_Cache_Object_Research(cls, None,
			                                 Constants.Cache_Search_Outlet_Interests)

			transaction.commit()
			return interest.interestid
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("research_update_interest")
			raise

class OutletInterestView(object):
	"""OutletInterestView"""
	pass

class EmployeeInterestView(object):
	"""EmployeeInterestView"""
	pass


# load tables from db
Interests.mapping = Table('interests', metadata, autoload=True)
OutletInterestView.mapping = Table('outletinterest_view', metadata,
							Column("outletid", Integer, primary_key=True), # needed to load a view
							Column("interestid", Integer, primary_key=True), # needed to load a view
							autoload=True)
EmployeeInterestView.mapping = Table('employeeinterest_view', metadata,
							Column("employeeid", Integer, primary_key=True), # needed to load a view
							Column("interestid", Integer, primary_key=True), # needed to load a view
							autoload=True)
InterestGroups.mapping = Table('interestgroups', metadata, autoload=True)

mapper(Interests, Interests.mapping)
mapper(OutletInterestView, OutletInterestView.mapping)
mapper(EmployeeInterestView, EmployeeInterestView.mapping)
mapper(InterestGroups, InterestGroups.mapping)
