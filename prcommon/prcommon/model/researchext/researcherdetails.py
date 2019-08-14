# -*- coding: utf-8 -*-
"Research Details"
#-----------------------------------------------------------------------------
# Name:        researcherdetails.py
# Purpose:     Researcher Project Details
# Author:      Chris Hoy
#
# Created:     30/05/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
import logging
LOGGER = logging.getLogger("prmax.model")

class ResearcherDetails(object):
	""" Research Details """

	@staticmethod
	def get(userid):
		"""Get Research Details"""
		research = session.query(ResearcherDetails).filter(ResearcherDetails.userid == userid).scalar()
		result = dict(research_display_name = "",
		              research_job_title = "",
		              research_email = "",
		              research_tel = "")
		#if research:
		#	result["research_display_name"] = research.research_display_name
		#	result["research_job_title"] = research.research_job_title
		#	result["research_email"] = research.research_email
		#	result["research_tel"] = research.research_tel

		return result

	@staticmethod
	def update(params):
		"""Update or create record """
		research = session.query(ResearcherDetails).filter(ResearcherDetails.userid == params["userid"]).scalar()
		#if research:
		#	research.research_display_name = params["research_display_name"]
		#	research.research_job_title = params["research_job_title"]
		#	research.research_email = params["research_email"]
		#	research.research_tel = params["research_tel"]
		#else:
		session.add(ResearcherDetails(**params))

ResearcherDetails.mapping = Table('researcher_details', metadata, autoload = True, schema='research')

mapper(ResearcherDetails, ResearcherDetails.mapping)
