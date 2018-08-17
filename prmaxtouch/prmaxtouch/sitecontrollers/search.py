# -*- coding: utf-8 -*-
""" Enquiries base controller """
#-----------------------------------------------------------------------------
# Name:        enquiries.py
# Purpose:
# Author:      Stamatia Vatsi
# Created:     26/06/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from ttl.tg.controllers import EmbeddedBaseController

from turbogears import expose, validate, exception_handler, error_handler
from ttl.tg.validators import std_state_factory
import ttl.tg.validators as tgvalidators
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler

from ttl.tg.controllers import SecureController
from ttl.base import stdreturn
from prcommon.model import ApiSearch

class SearchSchema(tgvalidators.PrFormSchema):
	""" Token adding schema """
	allow_extra_fields = True
	pass


class SearchController(EmbeddedBaseController):
	""" Customer root """

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SearchSchema(), state_factory=tgvalidators.std_state_factory)
	def search(self, *args, **params):
		""" do the search """

		params['search_type'] = 'employee'
		params['mode'] = 1
		params['employee_searchname_ext'] = u'{"data":{"surname":"%s","firstname":"%s"},"logic":2}' %(params['familyname'], params['firstname'] if 'firstname' in params else "")
		
#		params['quick_contact_ext'] = u'{"data":{"surname":"thomas","firstname":""},"logic":2}'
#		params['searchtypeid'] = 7
#		params['search_partial'] = 2
#		params['quick_searchname'] = 'the aust'
		
		data = ApiSearch.do_search(params)

		return stdreturn(data=data)
	
