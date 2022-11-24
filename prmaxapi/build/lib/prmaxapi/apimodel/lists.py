# -*- coding: utf-8 -*-
"""List access for the partners"""
#-----------------------------------------------------------------------------
# Name:        list.py
# Purpose:     Hold all the logic to interact with the users standing list
#  List have an interesting delete issue with public data when a outlet record
#  is delete and it's on a activity list we need to keep the outlet put mark it as s
#  delete and remove it from all the searchs !!! as well as deleteing it from all
#  the standing lists
#
# Author:      Chris Hoy (over greenland ice cap)
#
# Created:     14/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, Column, Integer, text
from prcommon.model import BaseSql, OutletInterestView, EmployeeInterestView, EmployeeRoleView


class ListMemberAiView(BaseSql):
	"""List view for aimedia """
	View_Data = """SELECT * FROM ListMember_Ai_View as lm
	WHERE lm.listid = :listid
	    ORDER BY   outletname
	    LIMIT :limit OFFSET :offset"""

	View_Data_Count = """SELECT COUNT(*) FROM ListMember_Ai_View as lm WHERE lm.listid = :listid """

	@classmethod
	def get_data(cls, params):
		""" List of list that need to be selected for this list """

		# get the basic data
		data = cls.sqlExecuteCommand (
		    text(ListMemberAiView.View_Data) ,
		    params,
		    BaseSql.ResultAsEncodedDict)

		# add the extra repleating data as lists
		for row in data:
			row["interests"] = [ irow[0] for irow in session.query(EmployeeInterestView.interestname).\
			                     filter(EmployeeInterestView.employeeid == row["employeeid"]).all()]
			if not row["interests"]:
				row["interests"] = [ irow[0] for irow in session.query(OutletInterestView.interestname).\
				                     filter(OutletInterestView.outletid == row["outletid"]).all()]

			row["roles"] = [ irow[0] for irow in session.query(EmployeeRoleView.rolename).\
			                 filter(EmployeeRoleView.employeeid == row["employeeid"]).all()]

		num_rows = cls.sqlExecuteCommand (
		    text(ListMemberAiView.View_Data_Count) ,
		    params,
		    cls.singleFieldInteger)

		return dict (
			numRows = num_rows,
			items = data)


ListMemberAiView.mapping = Table('listmember_ai_view', metadata,
                      Column("listid", Integer, primary_key=True), # needed to load a view
                      Column("outletid", Integer, primary_key=True), # needed to load a view
                      Column("employeeid", Integer, primary_key=True), # needed to load a view
                      autoload = True)
mapper(ListMemberAiView, ListMemberAiView.mapping )
