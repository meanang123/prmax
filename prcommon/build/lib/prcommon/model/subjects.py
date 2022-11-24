# -*- coding: utf-8 -*-
"""Translations for Subjects to Interests for International Data"""
#-----------------------------------------------------------------------------
# Name:       subjects.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     21/05/2013
# Copyright:   (c) 2013
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prcommon.model")

class Subject(BaseSql):
	""" Subject record """

	VIew_Data = """
	SELECT s.subjectid,s.subjectname,ins.interestid, i.interestname
	FROM internal.subjects AS s
	LEFT OUTER JOIN interestsubjects AS ins ON ins.subjectid = s.subjectid
	LEFT OUTER JOIN interests AS i ON i.interestid = ins.interestid"""

	VIew_Data_Count = """
	SELECT COUNT(*)
	FROM internal.subjects AS s
	LEFT OUTER JOIN interestsubjects AS ins ON ins.subjectid = s.subjectid
	LEFT OUTER JOIN interests AS i ON i.interestid = ins.interestid"""

	@classmethod
	def get_rest_page_research( cls, params ) :
		""" get a grid list of subjects and mapping"""

		whereclause = ""

		if "unmapped" in params and params["unmapped"]:
			whereclause = BaseSql.addclause(whereclause,"ins.interestid IS NULL")

		if params["sortfield"] == "interestname" :
			params["sortfield"] = "UPPER(i.interestname) "
		if params["sortfield"] == "subjectname" :
			params["sortfield"] = "UPPER(s.subjectname) "

		data = BaseSql.getGridPage(
		  params,
		  'subjectname',
		  'subjectid',
		  Subject.VIew_Data + whereclause + BaseSql.Standard_View_Order,
		  Subject.VIew_Data_Count + whereclause,
		  cls )

		return cls.grid_to_rest(data, params["offset"], False)

	@classmethod
	def exists(cls, subjectname, subjectid):
		"""Check too see if it exists"""

		tmp = session.query(Subject).filter(Subject.subjectname == subjectname).all()
		return True if tmp else False

	@classmethod
	def delete(cls, subjectid):
		"""Delete Mapping"""

		transaction = BaseSql.get_active_transaction()

		try:
			session.execute(text("DELETE FROM outletsubjects WHERE subjectid = :subjectid"),
			                dict(subjectid = subjectid), Subject)

			session.delete (Subject.query.get(subjectid))

			transaction.commit()
		except:
			LOGGER.exception("delete")
			transaction.rollback()
			raise


class SubjectInterest(BaseSql):
	""" SubjectInterest record """

	@classmethod
	def get_row(cls, params):
		"""get row"""

		from prcommon.model.interests import Interests

		subject = Subject.query.get(params["subjectid"])
		interest = Interests.query.get(params["interestid"])

		return dict (
		  subjectid = params["subjectid"],
		  interestid = params["interestid"],
		  interestname = interest.interestname,
		  subjectname = subject.subjectname
		)

	@classmethod
	def add_mapping(cls, params):
		"""add mapping"""

		transaction = BaseSql.get_active_transaction()

		try:
			# add interest record
			if not params.get("subjectid", None):
				# add subject
				subject = Subject(subjectname = params["subjectname"])
				session.add(subject)
				session.flush()
				params["subjectid"] =  subject.subjectid

			tmp = session.query(SubjectInterest).\
			  filter(SubjectInterest.interestid == params["interestid"]).\
			  filter(SubjectInterest.subjectid == params["subjectid"]).all()
			if not tmp:
				session.add(SubjectInterest(
				  interestid = params["interestid"],
				  subjectid =params["subjectid"]))
				session.flush()

			transaction.commit()
		except:
			LOGGER.exception("add_mapping")
			transaction.rollback()
			raise

#########################################################
## Map object to db
#########################################################

Subject.mapping = Table('subjects', metadata, autoload = True, schema='internal')
SubjectInterest.mapping = Table('interestsubjects', metadata, autoload = True)

mapper(Subject, Subject.mapping )
mapper(SubjectInterest, SubjectInterest.mapping )
