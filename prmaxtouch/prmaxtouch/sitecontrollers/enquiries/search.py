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
import json
import urllib
from sqlalchemy import Table, or_, text, and_
from turbogears import expose, validate, exception_handler, view
from turbogears.database import metadata, mapper, session
from ttl.tg.controllers import EmbeddedBaseController
from ttl.tg.validators import std_state_factory, RestSchema, DateRangeValidator, DateRangeResult
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.model import BaseSql
from prcommon.lib.common import add_config_details
from prcommon.model.contact import Contact
from prcommon.model.crm import ContactHistory
from prcommon.model.employee import Employee
from prcommon.model.outlet import Outlet
from prcommon.model.touch.utils.utils import Utilities
from ttl.model import PPRApplication
from prcommon import Constants
from ttl.postgres  import DBConnect, DBCompress
from prcommon.model import ApiSearch

PRMAXTOUCH = PPRApplication("Prmaxtouch", True)


class SearchCHResultsSchema(RestSchema):
	"schema"
	daterange = DateRangeValidator()

class SearchContactHistoryController(EmbeddedBaseController):
	""" Search controller """

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def search(self, *args, **params):
		""" return the search criteria page"""

		data = add_config_details(params)
		html = view.render(data, 'prmaxtouch.templates.enquiries.search.search')
		
		return slimmer.xhtml_slimmer(html)

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SearchCHResultsSchema(), state_factory=std_state_factory)
	def results(self, *args, **params):
		""" return the search results page """
		listpage = 1
		familyname = params['familyname'] if 'familyname' in params else ''
		firstname = params['firstname'] if 'firstname' in params else ''
		subject = params['subject'] if 'subject' in params else ''
	
		params['search_type'] = 'crm'
		params['mode'] = 1
		params['search_partial'] = 2
		params['employee_searchname_ext'] =  u'{"data":{"surname":"%s","firstname":"%s"},"logic":2}' %(familyname, firstname)
		params['crm_subject'] = subject
		params['searchtypeid'] = 7
	
		data = ApiSearch.do_search(params)
	
		if "listpage" in params:
			listpage = int(params["listpage"])
	
		data = add_config_details({"familyname":familyname, "firstname":firstname, "subject":subject, "listpage":listpage, "total": data['results']['total']} )
		html = view.render(data, 'prmaxtouch.templates.contacts.results')
	
		return slimmer.xhtml_slimmer(html)

	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SearchCHResultsSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" return the search results page """

		listpage = 1
		familyname = ''
		firstname = ''
		subject = ''
		whereclause = ''
		whereclause2 = ' ref_customerid = %s' %params['customerid']
		andclause = ''
		if 'familyname' in params and params['familyname'] != "":
			familyname = params['familyname']
			whereclause = "familyname ilike '%s%%'" %familyname
			whereclause2 += " AND (c.familyname ilike '%s%%' OR ec.familyname ilike '%s%%')" %(familyname,familyname)
		if 'firstname' in params and params['firstname'] != "":
			firstname = params['firstname']
			if whereclause != '':
				andclause = ' AND'
			whereclause += "%s firstname ilike '%s%%'" %(andclause, firstname)
			whereclause2 += " AND (c.firstname ilike '%s%%' OR ec.firstname ilike '%s%%')" %(firstname, firstname)
		if 'subject' in params and params['subject'] != "":
			subject = params['subject']
			whereclause2 += " AND (ch.crm_subject ilike '%%%s%%')" %(subject)

		# Date range
		if "daterange" in params and params["daterange"].option != DateRangeResult.NOSELECTION:
			daterange =  params["daterange"]
			if daterange.option == DateRangeResult.BEFORE:
				# BEfore
				params["from_date"] = daterange.from_date
				whereclause2 += " AND ch.taken <= '%s'" % params['from_date'].strftime("%Y-%m-%d")
			elif daterange.option == DateRangeResult.AFTER:
				# After
				params["from_date"] = daterange.from_date
				whereclause2 = BaseSql.addclause( whereclause2, 'ch.taken >= :from_date')
				whereclause2 += " AND ch.taken >= '%s'" % params['from_date'].strftime("%Y-%m-%d")
			elif daterange.option == DateRangeResult.BETWEEN:
				# ABetween
				params["from_date"] = daterange.from_date
				params["to_date"] = daterange.to_date
				whereclause2 += " AND ch.taken >= '%s' AND ch.taken <= '%s'" %(params['from_date'].strftime("%Y-%m-%d"), params['to_date'].strftime("%Y-%m-%d"))		

		if "listpage" in params:
			listpage = int(params["listpage"])			

		if familyname != '' and firstname != '':
			contacts = [row.contactid for row in session.query(Contact.contactid).\
		        filter(text(whereclause)).all()]
			employees = [row.employeeid for row in session.query(Employee.employeeid).\
		        filter(Employee.contactid.in_(contacts)).all()]
			if len(contacts) == 1 and len(employees) == 1:
				whereclause2 += ' AND (ch.employeeid = %s or ch.contactid = %s)' %(employees[0], contacts[0])
			elif len(contacts) == 1 and len(employees) > 1:
				whereclause2 += ' AND (ch.employeeid in %s or ch.contactid = %s)' %(tuple(employees), contacts[0])
			elif len(contacts) > 1 and len(employees) == 1:
				whereclause2 += ' AND (ch.employeeid = %s or ch.contactid in %s)' %(employees[0], tuple(contacts))
			elif len(contacts) > 1 and len(employees) > 1:
				whereclause2 += ' AND (ch.employeeid in %s or ch.contactid in %s)' %(tuple(employees), tuple(contacts))
		
		q = '''select ch.contacthistoryid, ch.crm_subject, c.contactid, c.familyname as csn, c.firstname as cfn, ec.contactid, ec.familyname as ecsn, ec.firstname as ecfn, chs.contacthistorystatusdescription, ch.taken
		from userdata.contacthistory as ch
		left outer join contacts as c on c.contactid = ch.contactid
		left outer join employees as e on e.employeeid = ch.employeeid
		left outer join contacts as ec on e.contactid = ec.contactid
		left outer join internal.contacthistorystatus as chs on chs.contacthistorystatusid = ch.contacthistorystatusid
		where %s order by ch.contacthistoryid desc offset (%s * 6 - 6)''' %(whereclause2, listpage)
		contacthistories = DBConnect(Constants.db_Command_Service).executeAll(q, None, False)

		items = {"listpage": listpage}
		row = 1
		for contacthistory in contacthistories:
			ich = contacthistory[0]
			icontactid = contacthistory[2] if contacthistory[2] else contacthistory[5]
			icolour = "icon-blue"
			iicon = "<i class='fa fa-user fa-2x'></i>"
			ifamilyname = contacthistory[3] if contacthistory[3] else contacthistory[6]
			ifirstname = contacthistory[4] if contacthistory[4] else contacthistory[7]
			istatusdescription = contacthistory[8]
			itaken = contacthistory[9]
			irowclass = ""
			ilocation = "javascript:window.location = '/enquiries/details/view/%s'" % ich
			
			newitem2 = {
		        "contacthistoryid%s" %row : contacthistory[0],
			    "subject%s" %row : contacthistory[1].replace('\xe2\x80\x99', "'").\
			    replace('\xe2\x80\x9c', '"').\
			    replace('\xe2\x80\x9d', '"').\
			    replace('\xe2\x80\x9e', '"').\
			    replace('\xe2\x80\x9f', '"').\
			    replace("\xc2\xa3", 'poundsymbol') if contacthistory[1] else "",
		        "familyname%s" %row :ifamilyname,
		        "firstname%s" %row : ifirstname,
			    "status%s" %row: istatusdescription,
			    "taken%s" %row: Utilities(itaken),
		        "colour%s" %row : "icon-blue", 
		        "rowclass%s" %row : "item-row item-row-click",
			    "icon%s" %row: "<i class='fa fa-user fa-2x'></i>",
			    "location%s" %row : ilocation
			    
		    }
			#print ('%s - %s' %(row, newitem2['subject%s' %row]))
			items.update(newitem2)
			row += 1
				

		data = add_config_details(items, True, PRMAXTOUCH)
		html = view.render(data, 'prmaxtouch.templates.enquiries.search.list')

		return slimmer.xhtml_slimmer(html)