# -*- coding: utf-8 -*-
"""This module contains the data model of the application."""

from prcommon.model import LoginTokens, List,  User, Customer
from prmaxapi.apimodel.lists import ListMemberAiView
#from prmaxapi.model import List,  User, ListMemberAiView

__all__ = ["LoginTokens" , "ListMemberAiView", "List",  "User", "Customer"]

