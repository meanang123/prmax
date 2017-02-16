# -*- coding: utf-8 -*-
"""Employee Controller"""
#-----------------------------------------------------------------------------
# Name:        employee.py
# Purpose:
#
# Author:      Chris Hoy (over greenland ice shelf)
#
# Created:     29/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, exception_handler, \
     identity
from prmax.model import EmployeeDisplay, Employee, SearchSession, \
     Outlet, EmployeeInterests
import ttl.tg.validators as tgvalidators
from ttl.dict import DictExt
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from prmax.utilities.validators import PrEmployeeIdFormSchema, std_state_factory_extended, \
     std_state_factory
from ttl.tg.validators import PrFormSchema, RestSchema, PrGridSchema
from prmax.utilities.Security import check_access_rights
import prmax.Constants as Constants
from ttl.base import stdreturn
from cherrypy import response

#########################################################
## Employee validators
#########################################################

class PrEmployeeChangeForm(PrFormSchema):
	""" Validator for a employee chnage form"""
	employeeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	jobroles = tgvalidators.JSONValidatorInterests()
	no_address = tgvalidators.BooleanValidator()
	outletdeskid = validators.Int()

class PrDeleteEmployeeIdFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	employeeid = validators.Int()
	reasoncodeid = validators.Int()


class PrEmployeeInterestsFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	interests = tgvalidators.JSONValidatorInterests()
	append_mode = tgvalidators.BooleanValidator()

class PrMergeEmployeeSchema(PrFormSchema):
	""" schema """
	employeeid = validators.Int()
	newemployeeid = validators.Int()


#########################################################
## Employee controllers
#########################################################

class EmployeeController(SecureController):
	""" Employee exposed methods"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def contactlist(self, *args, **params):
		""" List of contact"""
		return EmployeeDisplay.getDisplayPage (DictExt(
			EmployeeDisplay.getPageDisplayParams(params)))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def contactlist_rest(self, *args, **params):
		""" List of contact"""
		return EmployeeDisplay.get_display_page (EmployeeDisplay.getPageDisplayParams(params))

	@expose("")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory_extended)
	#@check_access_rights("employee")
	def employeedisplay(self, *args, **params):
		""" return the details to be displayed avout an emplyeee"""

		response.headers["Content-type"] = "application/json"
		return EmployeeDisplay.getEmployeeDisplay (params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def listcombo(self, *argv, **params):
		""" List of employees for a specific outlet"""
		return Employee.getLookUpList ( params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=tgvalidators.RestSchema, state_factory=std_state_factory)
	def listcombo_extended_nocontact(self, *argv, **params):
		""" List of employees for a specific outlet"""

		params["nocontact"] = 1
		params["extended"] = 1
		if argv:
			params["outletid"] = int (argv[0])
			if len(argv) > 1:
				params["id"] = int(argv[1])

		return Employee.get_look_up_list ( params )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@check_access_rights("employee")
	def get(self, *argv, **params):
		""" get the details about a specific employee"""

		return stdreturn ( data = Employee.query.get(params['employeeid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@check_access_rights("employee")
	def getedit(self, *argv, **params):
		""" get the details about a specific employee"""

		return stdreturn ( data = Employee.getForEdit(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@check_access_rights("employee")
	def addnew(self, *argv, **params):
		""" Add a new private employee to the system"""
		if params['employeeid'] == -1:
			params["sourcetypeid"] = Constants.Research_Source_Private
			employeeid = Employee.add(params)
			if params.has_key("addsession"):
				params["employeeid"] = employeeid
				searchsessionid = SearchSession.EmployeeAddTOSession( params )
				session = SearchSession.getStringSearchSessionRow ( searchsessionid )
				count  = SearchSession.getSessionCount(dict ( searchtypeid = Constants.Search_Standard_Type,
				                                              userid = params["userid"]))
			else:
				session = None
				count = None

			return stdreturn (
			  employee = Employee.getEmployeeExt(employeeid),
			  session = session,
			  count = count)
		else:
			return stdreturn (
			  employee = Employee.getEmployeeExt(Employee.update(params)),
			  sessionsearchid = SearchSession.getWhereUsedEmployee ( params["employeeid"],
			                                                         Constants.Search_Standard_Type,
			                                                         params["userid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_new(self, *argv, **params):
		""" Add a new global employee to the system"""

		return stdreturn( employee = Employee.getEmployeeExt(Employee.research_add(params)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update(self, *argv, **params):
		""" Add a new global employee to the system"""
		return stdreturn(employee = Employee.getEmployeeExt(Employee.research_update(params)))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_media(self, *argv, **params):
		""" Update the solida media onlly """

		Employee.research_update_media(params)

		return stdreturn ( employee = Employee.getEmployeeExt(params["employeeid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_set_primary(self, *argv, **params):
		""" Add a new global employee to the system"""
		Outlet.research_set_primary(params)

		return stdreturn( employee = Employee.getEmployeeExt(params["employeeid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	def employee_override_get(self, *args, **params):
		""" get the current override details for an employee tat this customer"""
		return Employee.getOverrides(params['employeeid'], params['customerid'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	def employee_override_save(self, *args, **params):
		""" save the changes for a customer employee override"""
		Employee.saveOverrides(params)

		return  stdreturn(employee = dict(employeeid = params["employeeid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	def employee_delete(self, *args, **params):
		""" delete a specific employee must be private """

		# response data
		data = dict ( employee = Employee.getEmployeeExt(params['employeeid'], True),
					  search = SearchSession.employeeWhereUsed(params))

		Employee.delete(params)
		return stdreturn( data = data )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrDeleteEmployeeIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_employee_delete(self, *args, **params):
		""" delete a specific employee must be public """

		# response data
		data = Employee.getEmployeeExt(params['employeeid'], True)
		data["has_deleted"] = Employee.research_delete(params)

		return stdreturn( data = data )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_get_edit(self, *argv, **params):
		""" get the details about a specific employee"""

		return stdreturn ( data = Employee.research_get_edit(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeInterestsFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_contact_interests(self, *argv, **params):
		""" Change the interests on employee """

		EmployeeInterests.research_contact_interests( params )
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrMergeEmployeeSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def merge_contacts(self, *argv, **params):
		""" Merge 2 contact for research """

		return stdreturn( employee = Employee.research_merge_contacts(params))






