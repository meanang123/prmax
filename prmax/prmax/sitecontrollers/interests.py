# -*- coding: utf-8 -*-
"""Interests"""
#-----------------------------------------------------------------------------
# Name:        interest.py
# Purpose:     handle basic interest information
# Author:       Chris Hoy
#
# Created:     11/07/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, identity
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator, PrGridSchema
from prmax.model import Interests, OutletInterests, EmployeeInterests, \
     EmployeeInterests, Employee
import prmax.Constants as Constants
from ttl.base import stdreturn, duplicatereturn
import ttl.tg.validators as tgvalidators

#########################################################
##  Validators
#########################################################
@SimpleFormValidator
def interest_type_schema_post(value_dict, state, validator):
	"""creats all the parameters needed be passed to the list user selection
method"""
	value_dict['word'] = value_dict.get('word','').lower()+"%"
	value_dict['filter'] = value_dict.get('filter','')

class InterestTypeSchema(PrFormSchema):
	"""
    is used to validate and capture the information for the interest selection
    based upon a user criteria
    This validate what type of interest is required standard or tags
    the fill the value_dict with the word and filter fields
    """
	interesttypeid = validators.Int()
	filter = validators.Int()
	chained_validators = (interest_type_schema_post,)

class InterestNameSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	interestname = validators.String(not_empty=True)

class InterestDetailsSchema(PrFormSchema):
	""" validates a form that has the interestname and interestid"""
	interestname = validators.String(not_empty=True)
	interestid = validators.Int()

class InterestIdSchema(PrFormSchema):
	""" validates a form that has the interestid"""
	interestid = validators.Int()

class InterestNameFilterSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	interestname = validators.String(not_empty=True)
	parentinterestid = validators.Int()

class InterestWhereOutletSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	outletid = validators.Int()
	interestid = validators.Int()

class InterestWhereEmployeeSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	employeeid = validators.Int()
	interestid = validators.Int()

class InterestMoveSchema(PrFormSchema):
	"""validates a form that has an interestname"""
	frominterestid = validators.Int()
	tointerestid = validators.Int()

class EmployeeInterestSchema(PrFormSchema):
	""" Validator for a employee chnage form"""
	employeeid = validators.Int()
	interests = tgvalidators.JSONValidatorInterests()



#########################################################
## Interest Controller
#########################################################
class InterestController(SecureController):
	""" Interest Control"""
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestTypeSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **kw):
		"""gets a list of interests based upon the user selection
	and the filter type"""
		return  stdreturn( transactionid = kw["transactionid"] ,
		                   data = Interests.get_user_selection(kw))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def tags(self, *args, **kw):
		""" get a list of tags based up the user customers  record """

		return stdreturn( data = Interests.tags(kw['customerid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestNameSchema(), state_factory=std_state_factory)
	def addtag(self, *args, **kw):
		"""
	Add a new tag the the customer
	check to see if it exists
	returns the created tags details
	"""
		if Interests.tagExists(kw['interestname'], kw['customerid']):
			return duplicatereturn()

		interestid = Interests.addTag(kw['interestname'], kw['customerid'])

		return stdreturn( data = Interests.getTag(interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestDetailsSchema(), state_factory = std_state_factory)
	def updatetag(self, interestname, interestid, *args, **kw):
		"""
		Changes the name of an existing tag
		"""
		if Interests.tagExists(interestname, kw['customerid']):
			return duplicatereturn()

		Interests.updateTag(interestname, interestid)

		return stdreturn( data = Interests.getTag(interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestIdSchema(), state_factory = std_state_factory)
	def deletetag( self, interestid, *args, **kw):
		"""
		This removes a tag from the customer and cascades all it usages
		"""

		Interests.deleteTag(interestid)

		return stdreturn( data = dict(interestid = interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory = std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_where_used_outlet( self, *args, **kw):
		""" returns list of outlet where interest used """

		return Interests.research_get_where_used_outlet(kw)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory = std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_where_used_employee( self, *args, **kw):
		""" returns list of employees where interest used """

		return Interests.research_get_where_used_employee(kw)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestNameFilterSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_add(self, *args, **kw):
		"""Add a new interest for the research system"""

		if Interests.tagExists(kw['interestname'], -1 ,
		                       Constants.Interest_Type_Standard):
			return duplicatereturn()

		interestid = Interests.research_add(kw )

		return stdreturn( data = Interests.get(interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestNameFilterSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_rename(self, *args, **kw):
		"""Add a new interest for the research system"""

		if Interests.research_exists(kw['interestname'], kw["interestid"]):
			return duplicatereturn()

		interestid = Interests.research_update(kw )

		return stdreturn(data = Interests.get(interestid))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestIdSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete	(self, *args, **kw):
		""" Delete an interest """

		data = Interests.get(kw["interestid"])
		Interests.research_delete( kw )

		return stdreturn( data = data  )


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestWhereOutletSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete_from_outlet	(self, *args, **kw):
		""" Delete the interest from the outlet """

		OutletInterests.delete ( kw )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestWhereEmployeeSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_delete_from_employee(self, *args, **kw):
		""" Delete the interest from the employee """

		EmployeeInterests.delete ( kw )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestMoveSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_move_interest(self, *args, **kw):
		""" Move all the location from one interest to another """

		Interests.move ( kw )

		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmployeeInterestSchema(), state_factory=std_state_factory)
	@identity.require(identity.in_group("dataadmin"))
	def research_interest_only(self, *args, **kw):
		""" Update the interest on a contact only don't take over the reocrd """

		Employee.research_update_interests( kw )

		return stdreturn()




