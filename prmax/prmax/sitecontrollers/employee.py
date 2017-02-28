# -*- coding: utf-8 -*-
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
from prmax.utilities.validators import PrEmployeeIdFormSchema, \
	 PrOutletIdFormSchema, std_state_factory_extended, std_state_factory
from ttl.tg.validators import PrFormSchema, PrGridSchema
from prmax.utilities.Security import check_access_rights
import prmax.Constants as Constants
from simplejson import JSONEncoder
from ttl.base import stdreturn
from cherrypy import response

#########################################################
## Employee validators
#########################################################

class PrEmployeeChangeForm(PrFormSchema):
	""" Validator for a employee chnage form"""
	employeeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()
	no_address = tgvalidators.BooleanValidator()

class PrDeleteEmployeeIdFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	employeeid = validators.Int()
	reasoncodeid = validators.Int()


class PrEmployeeInterestsFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	interests = tgvalidators.JSONValidatorInterests()
	append_mode = tgvalidators.BooleanValidator()


#########################################################
## Employee controllers
#########################################################

class EmployeeController(SecureController):
	""" Employee exposed methods"""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def contactlist(self, *args, **kw):
		""" List of contact"""
		return EmployeeDisplay.getDisplayPage (DictExt(
			EmployeeDisplay.getPageDisplayParams(kw)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory_extended)
	#@check_access_rights("employee")
	def employeedisplay(self, *args, **kw):
		""" return the details to be displayed avout an emplyeee"""

		#response.headers["Content-type"] = "application/json"
		return EmployeeDisplay.getEmployeeDisplay (kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def listcombo(self, *argv, **kw):
		""" List of employees for a specific outlet"""
		return Employee.getLookUpList ( kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@check_access_rights("employee")
	def get(self, *argv, **kw):
		""" get the details about a specific employee"""
		return dict( success="OK" ,
					 data = Employee.query.get(kw['employeeid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@check_access_rights("employee")
	def getedit(self, *argv, **kw):
		""" get the details about a specific employee"""
		return dict( success="OK" ,
					 data = Employee.getForEdit(kw))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@check_access_rights("employee")
	def addnew(self, *argv, **kw):
		""" Add a new private employee to the system"""
		if kw['employeeid'] == -1:
			kw["sourcetypeid"] = Constants.Research_Source_Private
			employeeid = Employee.add(kw)
			if kw.has_key("addsession"):
				kw["employeeid"] = employeeid
				searchsessionid = SearchSession.EmployeeAddTOSession( kw )
				session = SearchSession.getStringSearchSessionRow ( searchsessionid )
				count  = SearchSession.getSessionCount(dict ( searchtypeid = Constants.Search_Standard_Type,
				                                              userid = kw["userid"]))
			else:
				session = None
				count = None

			return stdreturn (
			  employee = Employee.getEmployeeExt(employeeid),
			  session = session,
			  count = count)
		else:
			return stdreturn (
			  employee = Employee.getEmployeeExt(Employee.update(kw)),
			  sessionsearchid = SearchSession.getWhereUsedEmployee ( kw["employeeid"],
			                                                         Constants.Search_Standard_Type,
			                                                         kw["userid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_new(self, *argv, **kw):
		""" Add a new global employee to the system"""
		return dict(success="OK" ,
		            employee = Employee.getEmployeeExt(Employee.research_add(kw)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update(self, *argv, **kw):
		""" Add a new global employee to the system"""
		return dict(success="OK" ,
		            employee = Employee.getEmployeeExt(Employee.research_update(kw)))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_update_media(self, *argv, **kw):
		""" Update the solida media onlly """

		Employee.research_update_media(kw)

		return stdreturn ( employee = Employee.getEmployeeExt(kw["employeeid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_set_primary(self, *argv, **kw):
		""" Add a new global employee to the system"""
		Outlet.research_set_primary(kw)
		return dict(success="OK" ,
		            employee = Employee.getEmployeeExt(kw["employeeid"]))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	def employee_override_get(self, *args, **kw):
		""" get the current override details for an employee tat this customer"""
		return Employee.getOverrides(kw['employeeid'], kw['customerid'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeChangeForm(), state_factory=std_state_factory)
	def employee_override_save(self, *args, **kw):
		""" save the changes for a customer employee override"""
		Employee.saveOverrides(kw)

		return  dict(success="OK",
					 employee=dict(employeeid=kw["employeeid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	def employee_delete(self, *args, **kw):
		""" delete a specific employee must be private """

		# response data
		data = dict ( employee = Employee.getEmployeeExt(kw['employeeid'], True),
					  search = SearchSession.employeeWhereUsed(kw))

		Employee.delete(kw)
		return dict( success="OK" , data = data )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrDeleteEmployeeIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_employee_delete(self, *args, **kw):
		""" delete a specific employee must be private """

		# response data
		data = dict ( employee = Employee.getEmployeeExt(kw['employeeid'], True))
		Employee.research_delete(kw)
		return dict( success="OK" , data = data )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_get_edit(self, *argv, **kw):
		""" get the details about a specific employee"""
		return dict( success="OK" ,
					 data = Employee.research_get_edit(kw))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmployeeInterestsFormSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_contact_interests(self, *argv, **kw):
		""" Change the interests on employee """

		EmployeeInterests.research_contact_interests( kw )
		return stdreturn()





