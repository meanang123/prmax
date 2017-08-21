# -*- coding: utf-8 -*-
"""AnalyseGlobal"""
#-----------------------------------------------------------------------------
# Name:        analysegeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     18/08/2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------
import logging
from prcommon.model.common import BaseSql
from prcommon.model.clippings.clippingsanalysistemplate import ClippingsAnalysisTemplate

LOGGER = logging.getLogger("prcommon.model")

class AnalyseGlobal(object):
	""" AnalyseGlobal """

	List_Data = """SELECT
	cat.clippingsanalysistemplateid,
	q.questiontext,
	qt.questiondescription
	FROM userdata.clippingsanalysistemplate AS cat
	JOIN userdata.questions AS q ON q.questionid = cat.questionid
	JOIN internal.questiontypes AS qt ON qt.questiontypeid = q.questiontypeid """

	List_Data_Count = """SELECT COUNT(*)
	FROM userdata.clippingsanalysistemplate AS cat
	JOIN userdata.questions AS q ON q.questionid = cat.questionid
	JOIN internal.questiontypes AS qt ON qt.questiontypeid = q.questiontypeid"""

	List_Data_OrderBy = """ORDER BY cat.sortorder ASC"""

	@staticmethod
	def global_analysis(params):
		"""list of clippings for customer"""

		whereclause = BaseSql.addclause('', 'cat.customerid = :customerid AND cat.clientid IS NULL AND cat.issueid IS NULL')

		params["sortfield"] = "cat.sortorder"
		params["direction"] = "asc"

		return BaseSql.get_rest_page_base(
		  params,
		  'clippingsanalysistemplateid',
		  'sortorder',
		  AnalyseGlobal.List_Data + whereclause + BaseSql.Standard_View_Order,
		  AnalyseGlobal.List_Data_Count + whereclause,
		  ClippingsAnalysisTemplate)
