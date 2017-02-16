# -*- coding: utf-8 -*-
"research ProjectGeneral"
#-----------------------------------------------------------------------------
# Name:        projectgenral.py
# Purpose:     Research Project Details
# Author:      Chris Hoy
#
# Created:     16/11/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy import text
from  prcommon.model.research import ResearchDetails

class ProjectGeneral(object):
	""" ProjectGeneral """

	MONTHLY_COMMAND_MONTH = """INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,customerid)
	SELECT :userid,5,o.outletid,:customerid FROM outlets AS o
	LEFT OUTER JOIN research.researchdetails AS rd ON rd.outletid = o.outletid
	WHERE (rd.quest_month_1 = :month OR
		rd.quest_month_2 = :month OR
	  rd.quest_month_3 = :month OR
	  rd.quest_month_4 = :month) AND
	  o.outletid NOT IN (select outletid FROM userdata.searchsession WHERE userid = :userid AND searchtypeid=5 GROUP BY outletid)"""

	MONTHLY_COMMAND_DESKS = """INSERT INTO userdata.searchsession(userid,searchtypeid,outletid,customerid,outletdeskid)
	SELECT :userid,5,od.outletid,:customerid,od.outletdeskid
	FROM outletdesk AS od
	JOIN research.researchdetailsdesk AS rd ON rd.outletdeskid = od.outletdeskid
	WHERE (
		rd.quest_month_1 = :month OR
		rd.quest_month_2 = :month OR
	  rd.quest_month_3 = :month OR
	  rd.quest_month_4 = :month) AND
	  od.outletdeskid NOT IN (select outletdeskid FROM userdata.searchsession WHERE userid = :userid AND searchtypeid=5 AND outletdeskid IS NOT NULL GROUP BY outletdeskid)"""

	@staticmethod
	def generate_monthly(params):
		""" Generate a montly set"""
		params2 = {
		  "userid" :  params["userid"],
		  "customerid": params["customerid"],
		  "month": params["month"],
			}

		# this adds the outlets
		session.execute(text(ProjectGeneral.MONTHLY_COMMAND_MONTH), params2, ResearchDetails)

		# we need to add the desk as well
		session.execute(text(ProjectGeneral.MONTHLY_COMMAND_DESKS), params2, ResearchDetails)






