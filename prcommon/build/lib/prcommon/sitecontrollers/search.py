# -*- coding: utf-8 -*-
""" Search research"""
#-----------------------------------------------------------------------------
# Name:        search.py
# Purpose:     Handles the access to the search list data
#
# Author:       Chris Hoy
#
# Created:     23/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, validators, error_handler, exception_handler
from prmax.model import Search, Searching, ParamCtrl
from prcommon.model import OutletGeneral, SearchSession
import prcommon.Constants as Constants
import types
import ttl.tg.validators as tgvalidators
from ttl.dict import DictExt
from ttl.tg.errorhandlers import pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, SimpleFormValidator, RestSchema
from ttl.string import encodeforpostgres
from ttl.base import stdreturn, duplicatereturn
from prcommon.sitecontrollers.searchexclusions import SearchExclusionController


############################################################
## Validators
############################################################
class MarkStyleSchema(PrFormSchema):
	""" mark style schema """
	markstyle = validators.Int()

class DeleteOptionSchema(PrFormSchema):
	""" delete options schema"""
	deleteoptions = validators.Int()

class ApplyTagsSchema(PrFormSchema):
	""" apply tags schema"""
	interests = tgvalidators.JSONValidatorInterests()
	applyto = validators.Int()
	selected = validators.Int()

class DeDuplicateSchema(PrFormSchema):
	""" De duplicate schema"""
	deduplicateby = validators.String(not_empty=True)

class ApplyMarksSchema(PrFormSchema):
	""" apply marks schema"""
	row_offset = validators.Int()
	row_limit = validators.Int()

@SimpleFormValidator
def session_fields(value_dict, state, validator):
	""" default field for session """
	value_dict['searchtypeid'] = int(value_dict.get('searchtypeid',
	                                                str(Constants.Search_Standard_Type)))

class SessionEmployeeSchema(PrFormSchema):
	""" De duplicate schema"""
	employeeid = validators.Int()

	chained_validators = (session_fields,)

class SessionSearchEmployeeSchema(PrFormSchema):
	""" De duplicate schema"""
	employeeid = validators.Int()
	sessionsearchid = validators.Int()

	chained_validators = (session_fields,)

class SessionExclusionSchema(PrFormSchema):
	""" Exclustion """
	restict = validators.Int()
	chained_validators = (session_fields,)

class SessionSearchDeleteItemSchema(PrFormSchema):
	""" schema"""
	sessionsearchid = validators.Int()



############################################################
## Controller
############################################################
class SearchController(SecureController):
	"""Handles required  information from the search function and does the
	searching"""

	exclude = SearchExclusionController()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" This function need to handle the access to the current search result
		"""
		return SearchSession.getDisplayPage(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_rest(self, *args, **params):
		""" This function need to handle the access to the current search result
		"""
		return SearchSession.get_display_page_rest(params)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def count(self, *args, **params):
		""" return count nbr of session"""
		return dict(success="OK",
					data=SearchSession.getSessionCount(
						dict(userid=params['user_id'],
		             searchtypeid=Constants.Search_Standard_Type)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def displaycount(self, *args, **params):
		"""return count of search would be found"""

		params2 = ParamCtrl.initParams(params)
		params2.partial = int(params.get('partial', 0))
		params2.keytypeid = int(params.get("keytypeid", '0'))
		ParamCtrl.getLogic(params2)
		# Call the standard function to return the count for the search result

		if params2.keytypeid in Constants.isListOfKeys:
			obj = self.jsondecoder.decode(params2.get("value", ""))
			if isinstance(obj, types.ListType) or isinstance(obj, types.DictionaryType):
				params2.keyname = obj
			else:
				params2.keyname = ",".join(["'%s'"% encodeforpostgres(key) for key in  obj.keys()])
		else:
			if params['fieldname'] == 'outlet_profile':
				val = params.get("value", "").lower()
				params2.keyname = encodeforpostgres(val)
			else:
				val = params.get("value", "").lower().strip().split(" ")
				if len(val) > 1:
					params2.keyname = encodeforpostgres(val)
					params2.logic = Constants.Search_And
				else:
					params2.keyname = encodeforpostgres(val[0])

		return dict(success="OK",
					 count=Search.getSearchCount(params2),
					 transactionid=params2.get("transactionid", ""))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def dosearch(self, *args, **params):
		""" This function does the actual searching
		used the search Controller module to do the work
		add/updates
		returns : dict of statistics
		"""
		return stdreturn(data=Searching.doSearch(DictExt(params)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def dosearchcount(self, *args, **params):
		""" this does the search but only returns the count
		"""
		data = Searching.doSearchCount(DictExt(params))

		return dict(success="OK", transaction=params['transaction'],
					count=data['countsession'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def sessionclear(self, *args, **params):
		""" clear the marks on a seach session
		"""
		return dict(success="OK", data=SearchSession.DeleteSelection(
			params['user_id'],
			params.get("searchtypeid", Constants.Search_Standard_Type),
			Constants.Search_SelectedAll))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeDuplicateSchema(), state_factory=std_state_factory)
	def deduplicate_session(self, *args, **params):
		""" Remove the duplicate entries
		"""
		params['searchtypeid'] = Constants.Search_Standard_Type
		return dict(success="OK", data=SearchSession.DeDuplicates(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ApplyMarksSchema(), state_factory=std_state_factory)
	def sessionmarkgroup(self, *args, **params):
		""" mark a group of records	"""

		params['searchtypeid'] = Constants.Search_Standard_Type
		return stdreturn(data=SearchSession.MarkGroup(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MarkStyleSchema(), state_factory=std_state_factory)
	def sessionmark(self, *args, **params):
		""" mark entries in a search session
		"""
		return dict(success="OK", data=SearchSession.Mark(
			params['user_id'],
			Constants.Search_Standard_Type,
			params['markstyle']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeleteOptionSchema(), state_factory=std_state_factory)
	def sessiondelete(self, *args, **params):
		""" delete entries in a search session
		"""
		return dict(success="OK", data=SearchSession.Delete(
			params['user_id'],
			Constants.Search_Standard_Type,
			params['deleteoptions']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ApplyTagsSchema(), state_factory=std_state_factory)
	def applytags(self, *argv, **params):
		""" apply tags to search sessions"""
		# apply tags
		params['searchtypeid'] = Constants.Search_Standard_Type
		params['applyto'] = True  if params['applyto'] else False

		return dict(success="OK",
					data=SearchSession.applyTags(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionEmployeeSchema(), state_factory=std_state_factory)
	def sessionaddemployee(self, *argv, **params):
		""" Add an employee to the search result return DU if existis"""
		# apply tags
		if SearchSession.EmployeeExists(params):
			return dict(success="DU", message="")

		params['sessionsearchid'] = SearchSession.EmployeeAddTOSession(params)
		return dict(success="OK",
					data=SearchSession.getStringSearchSessionRow(params["sessionsearchid"]),
					count=SearchSession.getSessionCount(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionEmployeeSchema(), state_factory=std_state_factory)
	def sessiondeleteemployee(self, *argv, **params):
		""" Delete an employee from the results check in fix and primarycontact field """

		return stdreturn(data=SearchSession.EmployeeDelete(params))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionSearchEmployeeSchema(), state_factory=std_state_factory)
	def sessionchangeemployee(self, *argv, **params):
		""" Change the employee on a outlet in the list """

		# verify that the current doesn't already exist in the database
		if SearchSession.EmployeeExistsElseWhere(params):
			return duplicatereturn()

		SearchSession.updateEmployeeOnRow(params['employeeid'], params['sessionsearchid'])

		return stdreturn(data=SearchSession.getStringSearchSessionRow(params["sessionsearchid"]))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionSearchDeleteItemSchema(), state_factory=std_state_factory)
	def delete_session_row(self, *argv, **params):
		""" delete a specific item from the session  """

		SearchSession.do_delete_row(params["sessionsearchid"])

		return stdreturn(sessionsearchid=params["sessionsearchid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list_outlet_rest(self, *args, **params):
		""" Simple search based on the outletname
		"""
		return OutletGeneral.get_research_list(params)







