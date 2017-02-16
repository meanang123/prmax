# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        Search_Options.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     1/11/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
#-----------------------------------------------------------------------------
# Search Logic Types
Search_And = 1
Search_Or = 2
# search Data
Search_Data_Outlet = 0
Search_Data_Employee = 1
Search_Data_Mixed = 2
Search_Data_Advance = 3
Search_Data_Crm = 4
Search_Data_Types = (Search_Data_Outlet, Search_Data_Employee,\
					 Search_Data_Mixed)
Search_Data_Count = 5

#search types
Search_Standard_Type = 1
Search_Standard_Lookup = 2
Search_Standard_Research = 3
Search_Standard_Distribute = 4
Search_Standard_Projects = 5

Search_Standard_All  = (Search_Standard_Type,Search_Standard_Lookup)

# selection types
Search_SelectedAll=-1
Search_Selection=0
Search_UnSelected=1

# clear search options
Session_Mark_All = 0
Session_Mark_Invert = 1
Session_Mark_Clear = 2
Session_Mark_Clear_Append = 3
Session_Mark_Appended = 4

# Index Actions
# only 2 actions possible updated is an add and a delete
index_Add = 1
index_Delete = 2

# defualt for no search results
no_search_results = dict( total = 0,
		appended  = 0 ,
		selected = 0 ,
		outletid = -1 ,
		employeeid = -1 ,
		outlettypeid = -1,
		customerid = -1,
		ecustomerid = -1,
		outletname = "",
		contactname = "",
		sessionsearchid = -1)

Search_Mode_Append 	= 0
Search_Mode_Add 	= 1

#list types

List_Standard_Type = 1
List_Release_Type = 2

