# -*- coding: utf-8 -*-
"""Interest"""
#-----------------------------------------------------------------------------
# Name:        interest.py
# Purpose:     handle basic interest information
# Author:       Chris Hoy
#
# Created:     10/08/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.validators import std_state_factory,  SimpleFormValidator, PrFormSchema
from prcommon.model import Interests
from cStringIO import StringIO
import simplejson

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

#########################################################
## Interest Controller
#########################################################
class InterestCommonController( object ):
	""" Common interest for all prmax applications """
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=InterestTypeSchema(), state_factory=std_state_factory)
	def listuserselection(self, *args, **kw):
		"""gets a list of interests based upon the user selection
	and the filter type"""
		return  dict(success = "OK",
		             transactionid = kw["transactionid"] ,
		             data = Interests.get_user_selection(kw))

	@expose("")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def resttree(self, *args, **kw):
		""" Tree view from rest controller """

		tmp = StringIO()
		simplejson.dump ( Interests.interesttree( kw, args[0]), tmp )
		tmp.flush()
		return tmp.getvalue()


