# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        md_List.py
# Purpose:    functionality moved to common function
#
# Author:      Chris Hoy (over greenland ice cap)
#
# Created:     16/09/2010
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import mapper
from prcommon.model import List as ListBase
from prcommon.model import ListMembers as ListMembersBase

class List(ListBase):
	""" prmax version of list """

class ListMembers(ListMembersBase):
	""" prmax version of list memebrs """

# remap from sqlachemy
mapper(List, List.mapping)
mapper(ListMembers, ListMembers.mapping)
