# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        geographical.py
# Purpose:
# Author:       Chris Hoy
#
# Created:     28/01/09
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler, pr_form_error_handler
from ttl.tg.controllers import SecureController
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator, JSONValidatorListInt, PrGridSchema

from prcommon.model import GeographicalLookupView, Geographical , \
     OutletCoverage, GeographicalLookupView, Countries

from ttl.base import stdreturn, duplicatereturn

from StringIO import StringIO
import simplejson

#########################################################
##  Validators
#########################################################
def _fixUpLookupList( value ):
	""" fix function """
	if value == "*%":
		value = "%"
	return value

@SimpleFormValidator
def GeographicalLookupSchema_post(value_dict, state, validator):
	""" Schema post fucntion """
	# creats all the parameters needed be passed to the list user selection
	# method
	value_dict['word'] = _fixUpLookupList(value_dict.get('word','').lower()+"%")

class GeographicalLookupSchema(PrFormSchema):
	""" validates a form that has the geographicallookuptypeid"""
	filter = validators.Int()

	chained_validators = (GeographicalLookupSchema_post,)

class GeographicalSchema(PrFormSchema):
	""" validates a form that has the geographicallookuptypeid"""
	geographicalid = validators.Int()

	chained_validators = (GeographicalLookupSchema_post,)

class GeographicalSchemaForm(PrFormSchema):
	""" validates a form that has the geographicallookuptypeid"""
	geographicalid = validators.Int()
	geographicallookuptypeid = validators.Int()
	parents = JSONValidatorListInt()
	children = JSONValidatorListInt()

class GeographicalSchemaGrid(PrGridSchema):
	""" validates a form that has the """
	geographicalid = validators.Int()

class GeographicalCoverageMove(PrGridSchema):
	""" validates a form that has the """
	fromgeographicalid = validators.Int()
	togeographicalid = validators.Int()



#########################################################
## geographical Controller
#########################################################
class GeographicalBaseController(SecureController):
	""" Geographical contoller"""
	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeographicalLookupSchema(), state_factory=std_state_factory)
	def listbytype(self, *args, **params):
		"""gets a list of geographical areas based upon the user selection
	and the filter type"""

		# can add forward cache here
		return  dict(transactionid = params["transactionid"] ,
		             data=GeographicalLookupView.getLookupList(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeographicalSchema(), state_factory=std_state_factory)
	def getdetails(self, *args, **params):
		""" get data for internal edit form"""

		return dict( success = "OK" , data = Geographical.getDataForEdit(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeographicalSchemaForm(), state_factory=std_state_factory)
	def add(self, *args, **params):
		""" add a new geographical area"""

		if Geographical.exists( params ):
			return duplicatereturn()

		return stdreturn(data = Geographical.add ( params ) )

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeographicalSchemaForm(), state_factory=std_state_factory)
	def update(self, *args, **params):
		""" add a new geographical area"""

		return dict(success = Geographical.update ( params ) ,
		            data = Geographical.getDataForEdit(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeographicalSchema(), state_factory=std_state_factory)
	def delete_geographical(self, *args, **params):
		""" get data for internal edit form"""

		return stdreturn ( data = Geographical.delete(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=GeographicalCoverageMove(), state_factory=std_state_factory)
	def move_coverage(self, *args, **params):
		""" move coverage from one to other """

		OutletCoverage.moveCoverage(params)

		return stdreturn()

	@expose("")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def resttree(self, *args, **params):
		""" Tree view from rest controller """

		tmp = StringIO()
		simplejson.dump ( GeographicalLookupView.geogtree( params, args[0]), tmp )
		tmp.flush()
		return tmp.getvalue()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def countries_listselection(self, *args, **params ):
		""" return a list of countries from """

		return stdreturn ( transactionid = params["transactionid"] ,
		                   data = Countries.get_user_selection(params))












