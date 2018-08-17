# -*- coding: utf-8 -*-
""" Search """
#-----------------------------------------------------------------------------
# Name:        search.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     28/06/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
import slimmer
from sqlalchemy import Table, or_, text, and_
from turbogears import expose, validate, exception_handler, view
from turbogears.database import metadata, mapper, session
from ttl.tg.controllers import EmbeddedBaseController
from ttl.tg.validators import std_state_factory, RestSchema
from ttl.tg.errorhandlers import pr_std_exception_handler
from prcommon.lib.common import add_config_details
from prcommon.model.contact import Contact
from prcommon.model.crm import ContactHistory
from prcommon.model.employee import Employee
from prcommon.model.touch.utils.utils import Utilities
from ttl.model import PPRApplication
from prcommon import Constants
from ttl.postgres  import DBConnect, DBCompress
from prmaxtouch.sitecontrollers.search import SearchController
from prcommon.model import ApiSearch


PRMAXTOUCH = PPRApplication("Prmaxtouch", True)

class SearchContactController(EmbeddedBaseController):
	""" Search controller """

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def search(self, *args, **params):
		""" return the search criteria page"""

		data = add_config_details(params)
		html = view.render(data, 'prmaxtouch.templates.contacts.search')

		return slimmer.xhtml_slimmer(html)

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def results(self, *args, **params):
		""" return the search results page """
		listpage = 1
		familyname = params['familyname'] if 'familyname' in params else ''
		firstname = params['firstname'] if 'firstname' in params else ''
		outletname = params['outletname'] if 'outletname' in params else ''
		
		params['search_type'] = 'quick'
		params['mode'] = 1
		params['search_partial'] = 2
		params['quick_contact_ext'] =  u'{"data":{"surname":"%s","firstname":"%s"},"logic":2}' %(familyname, firstname)
		params['quick_searchname'] = outletname
		params['searchtypeid'] = 7

		data = ApiSearch.do_search(params)

		if "listpage" in params:
			listpage = int(params["listpage"])

		data = add_config_details({"familyname":familyname, "firstname":firstname, "outletname":params['quick_searchname'], "listpage":listpage, "total": data['results']['total']} )
		html = view.render(data, 'prmaxtouch.templates.contacts.results')

		return slimmer.xhtml_slimmer(html)

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" return the search results page """
		listpage = 1
		familyname = params['familyname'] if 'familyname' in params else ''
		firstname = params['firstname'] if 'firstname' in params else ''
		outletname = params['outletname'] if 'outletname' in params else ''
		
		params['search_type'] = 'quick'
		params['mode'] = 1
		params['search_partial'] = 2
		params['quick_contact_ext'] =  u'{"data":{"surname":"%s","firstname":"%s"},"logic":2}' %(familyname, firstname)
		params['quick_searchname'] = outletname
		params['searchtypeid'] = 7
	
		if "listpage" in params:
			listpage = int(params["listpage"])			

		params['offset'] = listpage * 6 - 6
		data2 = ApiSearch.results_view(params)


		items = {"listpage": listpage}
		row = 1
		for num in range(listpage*6-6, len(data2['items'])):
			iemployeeid = data2['items'][num]['employeeid']
			ioutletid = data2['items'][num]['outletid']
			ijobtitle =  data2['items'][num]['job_title']
			ioutletname = data2['items'][num]['outletname']
			icolour = "icon-blue"
			iicon = "<i class='fa fa-user fa-2x'></i>"
			ifamilyname = data2['items'][num]['contactname']
			ifirstname = ''
			irowclass = ""
			ilocation = "javascript:window.location = '/enquiries/add/add?&employeeid=%s&outletid=%s'" % (iemployeeid, ioutletid)

			newitem2 = {
			    "employeeid%s" %row: iemployeeid,
			    "outletid%s" %row: ioutletid,
			    "jobtitle%s" %row: ijobtitle if ijobtitle else "",
		        "familyname%s" %row:ifamilyname if ifamilyname else "",
		        "firstname%s" %row: ifirstname if ifirstname else "",
			    "outletname%s" %row: ioutletname if ioutletname else "",
		        "colour%s" %row: "icon-blue", 
		        "rowclass%s" %row: "item-row item-row-click",
			    "icon%s" %row: "<i class='fa fa-user fa-2x'></i>",
			    "location%s" %row: ilocation
			    
		    }
			
			items.update(newitem2)
			row += 1
		
		data = add_config_details(items, True, PRMAXTOUCH)
		html = view.render(data, 'prmaxtouch.templates.contacts.list')

		return slimmer.xhtml_slimmer(html)
	

def _fix_db_characters(value):
	return value.replace('\xe2\x80\x99', "'").\
	    replace('\xe2\x80\x9c', '"').\
	    replace('\xe2\x80\x9d', '"').\
	    replace('\xe2\x80\x9e', '"').\
	    replace('\xe2\x80\x9f', '"').\
	    replace('\xc3\xa7', 'c').\
	    replace("\xc2\xa3", 'poundsymbol')
		