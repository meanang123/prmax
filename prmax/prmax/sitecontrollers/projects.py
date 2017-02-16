# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        private.py
# Purpose:     Holds all the functions that allow the user to add/update/edit
#              Their private data,
#
#
# Author:      Chris Hoy (over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, PrGridSchema, \
	 SimpleFormValidator
from prmax.model import Project, ProjectMember, ProjectCollateral

##################################################################
## validators
##################################################################
class ListProjectSchema(PrFormSchema):
	""" project list add validator"""
	listid = validators.Int()
	projectname = validators.String(not_empty=True)

class ProjectNameSchema(PrFormSchema):
	""" project name add validator"""
	projectname = validators.String(not_empty=True)

class ProjectSchema(PrFormSchema):
	""" project list add validator"""
	projectid = validators.Int()

@SimpleFormValidator
def ProjectSelectionSchema_post(value_dict, state, validator):
	"""creats all the parameters needed be passed to the list user selection
method"""
	value_dict['word'] = value_dict.get('word','').lower()+"%"


class ProjectSelectionSchema(PrFormSchema):
	"""
    is used to validate and capture the information for the interest selection
    based upon a user criteria
    This validate what type of interest is required standard or tags
    the fill the value_dict with the word and filter fields
    """
	chained_validators = (ProjectSelectionSchema_post,)


##################################################################
## controllers
##################################################################
class ProjectController(SecureController):
	""" Project controller """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ListProjectSchema(), state_factory=std_state_factory)
	def addnewandtolist(self, *args, **kw):
		""" add a list to a projecte"""

		if Project.Exits( kw['customerid'], kw['projectname']):
			return dict(success="DU")

		return dict(success = "OK" ,  project = Project.AddProjectAddList(
			kw['customerid'], kw['listid'], kw['projectname']) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def list(self, *args, **kw):
		""" list all the list  avaliable to a customer/project
		"""
		return dict(identifier="projectid",
					numRows = Project.getProjectListCount(
						kw['customerid'],
						kw['projectname']),
					items= Project.getProjectList(
						kw['customerid'],
						kw['projectname'],
						kw.get('count',"1"),
						kw['start']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def projects(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		return Project.getGridPage( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def projects_combo(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		return Project.getListPage( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectSelectionSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		return  dict(success="OK", data=Project.get_user_selection(kw))



	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectNameSchema(), state_factory=std_state_factory)
	def addnew(self, *args, **kw):
		""" add a project"""

		if Project.Exits( kw['customerid'], kw['projectname']):
			return dict(success="DU")

		return dict(success = "OK" ,  project = Project.AddProject(
			kw['customerid'], kw['projectname']) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def listmembers(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		return ProjectMember.getGridPage( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def collateral(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		return ProjectCollateral.getGridPage( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectSchema(), state_factory=std_state_factory)
	def get(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		return dict(success="OK" , project = Project.get( kw ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ProjectSchema(), state_factory=std_state_factory)
	def delete(self, *args, **kw):
		""" list all the project avaliable to a customer
		"""
		Project.Delete ( kw["projectid"] )
		return dict(success="OK" , projectid = kw["projectid"] )




