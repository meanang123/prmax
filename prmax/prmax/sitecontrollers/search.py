# -*- coding: utf-8 -*-
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

from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from prmax.model import Search, SearchSession, Searching, ParamCtrl
import prmax.Constants as Constants
import types
import ttl.tg.validators as tgvalidators
from ttl.dict import DictExt
from ttl.tg.errorhandlers import pr_form_error_handler, \
	 pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator
from ttl.string import encodeforpostgres
from ttl.base import stdreturn, duplicatereturn
from searchexclusions import SearchExclusionController


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
	def list(self, *args, **kw):
		""" This function need to handle the access to the current search result
		"""
		return SearchSession.getDisplayPage( kw )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def count(self, *args, **kw):
		""" return count nbr of session"""
		return dict(success="OK",
					data=SearchSession.getSessionCount(
						dict(userid=kw['user_id'],
							 searchtypeid = Constants.Search_Standard_Type)))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def displaycount(self, *args, **kw):
		"""return count of search would be found"""

		kw2 = ParamCtrl.initParams(kw)
		kw2.partial = int(kw.get('partial', 0))
		kw2.keytypeid = int(kw.get("keytypeid", '0'))
		ParamCtrl.getLogic(kw2)
		# Call the standard function to return the count for the search result

		if kw2.keytypeid in Constants.isListOfKeys:
			obj = self.jsondecoder.decode(kw2.get("value",""))
			if type(obj) in (types.ListType, types.DictionaryType):
				kw2.keyname = obj
			else:
				kw2.keyname =  ",".join(["'%s'"% encodeforpostgres( key  ) for key in  obj.keys()])
		else:
			val = kw.get("value", "").lower().strip().split(" ")
			if len(val)>1:
				kw2.keyname =  encodeforpostgres( val )
				kw2.logic = Constants.Search_And
			else:
				kw2.keyname =  encodeforpostgres ( val[0] )

		return dict( success="OK",
					 count = Search.getSearchCount(kw2),
					 transactionid = kw2.get("transactionid",""))

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
		data  = Searching.doSearchCount(DictExt(params))

		return stdreturn(
		  transaction=params['transaction'],
		  count = data['countsession'])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def sessionclear(self, *args, **kw):
		""" clear the marks on a seach session
		"""
		return dict(success="OK", data=SearchSession.DeleteSelection(
			kw['user_id'],
			kw.get("searchtypeid",Constants.Search_Standard_Type),
			Constants.Search_SelectedAll))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeDuplicateSchema(), state_factory=std_state_factory)
	def deduplicate_session(self, *args, **kw):
		""" Remove the duplicate entries
		"""
		kw['searchtypeid'] = Constants.Search_Standard_Type
		return dict(success="OK", data=SearchSession.DeDuplicates( kw ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ApplyMarksSchema(), state_factory=std_state_factory)
	def sessionmarkgroup(self, *args, **kw):
		""" mark a group of records	"""

		kw['searchtypeid'] = Constants.Search_Standard_Type
		return stdreturn ( data = SearchSession.MarkGroup( kw ))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=MarkStyleSchema(), state_factory=std_state_factory)
	def sessionmark(self, *args, **kw):
		""" mark entries in a search session
		"""
		return dict(success="OK", data = SearchSession.Mark (
			kw['user_id'],
			Constants.Search_Standard_Type,
			kw['markstyle']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=DeleteOptionSchema(), state_factory=std_state_factory)
	def sessiondelete(self, *args, **kw):
		""" delete entries in a search session
		"""
		return dict(success="OK", data = SearchSession.Delete (
			kw['user_id'],
			Constants.Search_Standard_Type,
			kw['deleteoptions']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ApplyTagsSchema(), state_factory=std_state_factory)
	def applytags(self, *argv, **kw):
		""" apply tags to search sessions"""
		# apply tags
		kw['searchtypeid'] = Constants.Search_Standard_Type
		kw['applyto'] = True  if kw['applyto'] else False

		return dict(success="OK",
					data = SearchSession.applyTags( kw ))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionEmployeeSchema(), state_factory=std_state_factory)
	def sessionaddemployee(self, *argv, **kw):
		""" Add an employee to the search result return DU if existis"""
		# apply tags
		if SearchSession.EmployeeExists(kw):
			return dict ( success="DU",  message = "")

		kw['sessionsearchid'] = SearchSession.EmployeeAddTOSession( kw )
		return dict(success="OK",
					data = SearchSession.getStringSearchSessionRow(kw["sessionsearchid"]),
					count  = SearchSession.getSessionCount(kw))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionEmployeeSchema(), state_factory=std_state_factory)
	def sessiondeleteemployee(self, *argv, **kw):
		""" Delete an employee from the results check in fix and primarycontact field """

		return stdreturn ( data = SearchSession.EmployeeDelete(kw))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SessionSearchEmployeeSchema(), state_factory=std_state_factory)
	def sessionchangeemployee(self, *argv, **kw):
		""" Change the employee on a outlet in the list """

		# verify that the current doesn't already exist in the database
		if SearchSession.EmployeeExistsElseWhere( kw ):
			return duplicatereturn()

		SearchSession.updateEmployeeOnRow( kw['employeeid'], kw['sessionsearchid'])

		return stdreturn ( data = SearchSession.getStringSearchSessionRow(kw["sessionsearchid"]))





