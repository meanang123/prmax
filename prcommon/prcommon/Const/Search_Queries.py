# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        Data.py
# Purpose:		Data  constants
#
# Author:      Chris Hoy
#
# Created:     01/11/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
#-----------------------------------------------------------------------------
#Customer

# List display

SearchSession_ListData = """
	SELECT s.*
	FROM	Search_Results_View_Standard  AS s
	WHERE
		s.userid = :userid and s.searchtypeid= :searchtypeid
	ORDER BY  %s
	LIMIT :limit  OFFSET :offset """

SearchSession_Api_ListData = """
	SELECT s.sessionsearchid,s.outletid,s.employeeid,s.outletname,s.contactname,s.job_title,s.sortname
	FROM	Search_Results_View_Standard  AS s
	WHERE
		s.userid = :userid and s.searchtypeid= :searchtypeid
	ORDER BY  %s
	LIMIT :limit  OFFSET :offset """

SearchSession_ListData_Ext = """
	SELECT s.*,st.sourcename,o.sourcetypeid
	FROM	Search_Results_View_Standard  AS s
    JOIN outlets AS o ON s.outletid = o.outletid
    LEFT OUTER JOIN internal.sourcetypes AS st ON st.sourcetypeid = o.sourcetypeid
	WHERE
		s.userid = :userid and s.searchtypeid= :searchtypeid
	ORDER BY  %s
	LIMIT :limit  OFFSET :offset """




Standard_SQL_Sort = """
	ORDER BY %s %s
	LIMIT :limit  OFFSET :offset """
