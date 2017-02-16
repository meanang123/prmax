# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        private.py
# Purpose:     hold exposed method to handle access to  the list and project
#				maintanece and collect functions
#
# Author:      Chris Hoy (over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from prmax.model import List, SearchSession, Project, ProjectMember, \
     EmailTemplateList, ListMembers
import prmax.Constants as Constants
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema,  RestSchema
from prmax.utilities.validators import PrEmployeeIdFormSchema

from ttl.base import stdreturn, duplicatereturn, errorreturn


#########################################################
## validators
#########################################################
class SaveToListSchema(PrFormSchema):
	""" save to list """
	listid = validators.Int()
	overwrite = tgvalidators.IntExt(default=0)
	selection = tgvalidators.IntExt(default=-1)

class OpenListSchema(PrFormSchema):
	""" open list schema"""
	lists = tgvalidators.JSONValidatorListInt()
	overwrite = validators.Int()
	selected = tgvalidators.Int()
	listtypeid = validators.Int()

class ListIdSchema(PrFormSchema):
	""" listId sechema"""
	listid = validators.Int()

class ListNameSchema(PrFormSchema):
	""" list name only schema """
	listname = validators.String(not_empty=True)
	clientid = validators.Int()

class ListChangeSchema(PrFormSchema):
	""" list name and id schema"""
	listid = validators.Int()
	clientid = validators.Int()
	listname = validators.String(not_empty=True)

class ListProjectSchema(PrFormSchema):
	""" list id and project id """
	listid = validators.Int()
	projectid = validators.Int()

class ListProjectListSchema(PrFormSchema):
	""" list and a list of projects """
	listid = validators.Int()
	projects = tgvalidators.JSONValidatorListInt()

class ListWithTypeSchema(PrFormSchema):
	""" """
	listtypeid = validators.Int()

class ListMemberSchema(PrFormSchema):
	""" """
	listmemberid = validators.Int()


#########################################################
## controlllers
#########################################################

class ListController(SecureController):
	""" tg controller hold all the methods to access list and projects"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def lists(self, *args, **params):
		""" returns a list of list this is for a grid """
		return List.getPageListGrid(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def rest_lists_standing(self, *args, **params):
		""" returns a list of list this is for a grid """

		if args:
			params["listid"] = args[0]
		params["listtypeid"] = 1

		return List.get_rest_page (params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def listall(self, *args, **params):
		""" List all the list for specific customer this is for list maintanance
		"""
		return List.getPageListGrid(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SaveToListSchema(), state_factory=std_state_factory)
	def savetolist(self, *args, **params):
		"""Save the current session to aspecific list """

		return dict ( success="OK",
					  data = List.addToList(params['listid'],
											params['overwrite'],
											params['selection'],
											params['user_id'],
											Constants.Search_Standard_Type))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=OpenListSchema(), state_factory=std_state_factory)
	def open(self, *args, **params):
		""" open a list """
		if params.has_key("refresh"):
			params2  = dict ( listid = params["lists"][0])
			params2.update ( params )
			List.refresh ( params2, False )

		return dict(
			success = "OK" ,
			data = SearchSession.moveListToSession (
				params['lists'],
				params['user_id'],
				Constants.Search_Standard_Type,
				params['overwrite'],
				params['selected'],
		    params["listtypeid"]) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListIdSchema(), state_factory=std_state_factory)
	def info(self, listid, *args, **params):
		""" return the info about a specific list"""

		return stdreturn (list = List.getDetails(listid),
		                  projects = Project.getForList(listid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListNameSchema(), state_factory=std_state_factory)
	def addnew(self, *args, **params):
		""" Add a new list to the system"""

		if List.Exits(params['customerid'], params['listname']):
			return dict(success ="DU" )

		return stdreturn ( list = List.add_list( params['customerid'],
		                                        params['listname'],
		                                        params["clientid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListNameSchema(), state_factory=std_state_factory)
	def addsavetolist(self, *args, **params):
		""" Add a new list to the system and then add the current search buffer
		to it """

		# check to see if exists
		if List.Exits(params['customerid'], params['listname']):
			return duplicatereturn()

		# create new list and copy across
		return stdreturn(data = List.add_list_add_results( params ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListChangeSchema(), state_factory=std_state_factory)
	def rename(self, *args, **params):
		""" Renames a list from it current description to the new description
		1. check to see if new list exists
		2. renames
		returns list details """

		if List.Exits(params['customerid'], params['listname']):
			return duplicatereturn()

		List.rename( params['customerid'],
		             params['listid'],
		             params['listname'],
		             params['clientid'])

		return stdreturn(list = List.getDetails(params['listid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListChangeSchema(), state_factory=std_state_factory)
	def duplicate(self, *args, **params):
		"""Duplicate a list to a new list name """

		if List.Exits(params['customerid'], params['listname']):
			return dict(success = "DU" )

		return dict(success = "OK" ,  list =
					List.listDuplicate( params['listid'], params['listname'],params['customerid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListWithTypeSchema(), state_factory=std_state_factory)
	def listmaintcount(self, *args, **params):
		""" Get """
		return dict(data = List.getListMaintCount( params ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators = ListWithTypeSchema(), state_factory=std_state_factory)
	def deleteselection(self, *args, **params):
		""" Deletes the selected list for a user
		Error are captured and logged by the exception handler"""
		lists = List.listSelection(params )
		List.listDeleteSelection ( params)
		return dict(success = "OK" , lists = lists )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListIdSchema(), state_factory=std_state_factory)
	def deletelist(self, *args, **params):
		""" Deletes the selected list for a user
		Error are captured and logged by the exception handler"""
		List.listDelete(params['listid'])
		return dict(success = "OK" )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def projectforlist(self, *args, **params):
		""" returns a list of projects for a specific list """

		if params.has_key("listid"):
			data = List.getProjectSelectList(
				params['listid'],
				params['customerid'],
				params.get('projectname',''),
				params.get('count',"1"),
				params['start'])
		else:
			data = []

		return dict(identifier="projectname",
					label='projectname',
					items=data )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListProjectSchema(), state_factory=std_state_factory)
	def addprojecttolist(self, *args, **params):
		""" Add A list to a project """
		if ProjectMember.Exists(params['listid'], params['projectid']):
			return dict(success="DU")

		ProjectMember.add(params['listid'], params['projectid'])

		return dict(success = "OK" ,
					project = ProjectMember.getMember(params['listid'], params['projectid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListProjectListSchema(), state_factory=std_state_factory)
	def deletelistprojects(self, *argv, **params):
		""" Delete the selected projects from a specific list"""

		ProjectMember.delete(params['listid'], params['projects'])
		return dict ( success = "OK" )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def whereused(self, *argv, **params):
		""" return a list of list where an employee is used """
		return List.get_where_used(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def release_select(self, *argv, **params):
		""" list of list that can be selected"""

		return List.get_selected_for_release( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def release_selected(self, *argv, **params):
		""" list of selected list for the current press release"""
		return EmailTemplateList.get_list ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list_members(self, *argv, **params):
		""" List of members for a specific list """

		return ListMembers.get_selected_for_release ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list_member_first(self, *argv, **params):
		""" List of members for a specific list """
		return dict ( success="OK" , data = ListMembers.getFirstRecord ( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListIdSchema(), state_factory=std_state_factory)
	def refresh(self, *args, **params):
		""" refresh a list """

		List.refresh( params )

		return dict(success = "OK",
					list = List.getDetails(params["listid"]),
					projects = Project.getForList(params["listid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListMemberSchema(), state_factory=std_state_factory)
	def list_member_delete(self, *argv, **params):
		""" Delete a specific member from the list """
		return dict ( success="OK" , data = ListMembers.delete ( params ) )





