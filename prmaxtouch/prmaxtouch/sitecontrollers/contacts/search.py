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
from ttl.model import PPRApplication
from prcommon import Constants
from ttl.postgres  import DBConnect, DBCompress

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
		familyname = ''
		firstname = ''
		whereclause = ''
		whereclause2 = ''
		andclause = ''
		if 'familyname' in params and params['familyname'] != "":
			familyname = params['familyname']
			whereclause = "familyname ilike '%s%%'" %familyname
			whereclause2 = "(c.familyname ilike '%s%%' OR ec.familyname ilike '%s%%')" %(familyname,familyname)
		else:
			familyname = ""
		if 'firstname' in params and params['firstname'] != "":
			firstname = params['firstname']
			if whereclause != '':
				andclause += ' AND'
			whereclause += "%s firstname ilike '%s%%'" %(andclause, firstname)
			whereclause2 += "%s (c.firstname ilike '%s%%' OR ec.firstname ilike '%s%%')" %(andclause, firstname, firstname)
		else:
			firstname = ""
			
		if params['customerid']:
			if whereclause != '':
				andclause += ' AND'
			whereclause2 += '%s ref_customerid = %s' %(andclause, params['customerid'])
			
		contacts = [row.contactid for row in session.query(Contact.contactid).\
		    filter(text(whereclause)).\
		    filter(Contact.customerid == -1).all()]

		employees = [row.employeeid for row in session.query(Employee.employeeid).\
		    filter(Employee.contactid.in_(contacts)).\
		    filter(Employee.customerid == -1).all()]
		
		
		whereclause2 += '%s (ch.employeeid in %s or ch.contactid in %s)' %(andclause, tuple(employees), tuple(contacts))
		
		q = '''select ch.contacthistoryid, ch.crm_subject, c.familyname as csn, c.firstname as cfn, ec.familyname as ecsn, ec.firstname as ecfn
		from userdata.contacthistory as ch
		left outer join contacts as c on c.contactid = ch.contactid
		left outer join employees as e on e.employeeid = ch.employeeid
		left outer join contacts as ec on e.contactid = ec.contactid
		where %s order by ch.contacthistoryid offset(%s *6 - 6)''' %(whereclause2, listpage)
		contacthistories = DBConnect(Constants.db_Command_Service).executeAll(q, None, False)
		totalcontacthistories = session.query(ContactHistory).\
		    filter(ContactHistory.ref_customerid == params['customerid']).\
		    filter(or_(ContactHistory.employeeid.in_(employees), ContactHistory.contactid.in_(contacts))).count()

		if "listpage" in params:
			listpage = int(params["listpage"])

		data = add_config_details({"familyname":familyname, "firstname":firstname, "contacthistory":39575, "listpage":listpage, "total": totalcontacthistories} )
		html = view.render(data, 'prmaxtouch.templates.contacts.results')

		return slimmer.xhtml_slimmer(html)


	@expose('text/html')
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def list(self, *args, **params):
		""" return the search results page """

		listpage = 1
		familyname = ''
		firstname = ''
		whereclause = ''
		whereclause2 = ''
		andclause = ''
		if 'familyname' in params and params['familyname'] != "":
			familyname = params['familyname']
			whereclause = "familyname ilike '%s%%'" %familyname
			whereclause2 = "(c.familyname ilike '%s%%' OR ec.familyname ilike '%s%%')" %(familyname,familyname)
		else:
			familyname = ""
		if 'firstname' in params and params['firstname'] != "":
			firstname = params['firstname']
			if whereclause != '':
				andclause += ' AND'
			whereclause += "%s firstname ilike '%s%%'" %(andclause, firstname)
			whereclause2 += "%s (c.firstname ilike '%s%%' OR ec.firstname ilike '%s%%')" %(andclause, firstname, firstname)
		else:
			firstname = ""
			
		if params['customerid']:
			if whereclause != '':
				andclause += ' AND'
			whereclause2 += '%s ref_customerid = %s' %(andclause, params['customerid'])

		if "listpage" in params:
			listpage = int(params["listpage"])			

		contacts = [row.contactid for row in session.query(Contact.contactid).\
		    filter(text(whereclause)).\
		    filter(Contact.customerid == -1).all()]

		employees = [row.employeeid for row in session.query(Employee.employeeid).\
		    filter(Employee.contactid.in_(contacts)).\
		    filter(Employee.customerid == -1).all()]
		
		
		whereclause2 += '%s (ch.employeeid in %s or ch.contactid in %s)' %(andclause, tuple(employees), tuple(contacts))
		
		q = '''select ch.contacthistoryid, ch.crm_subject, c.familyname as csn, c.firstname as cfn, ec.familyname as ecsn, ec.firstname as ecfn
		from userdata.contacthistory as ch
		left outer join contacts as c on c.contactid = ch.contactid
		left outer join employees as e on e.employeeid = ch.employeeid
		left outer join contacts as ec on e.contactid = ec.contactid
		where %s order by ch.contacthistoryid offset (%s * 6 - 6)''' %(whereclause2, listpage)
		contacthistories = DBConnect(Constants.db_Command_Service).executeAll(q, None, False)

		items = {"listpage": listpage}
		row = 1
		for contacthistory in contacthistories:
			icolour = "icon-blue"
			iicon = "<i class='fa fa-user fa-2x'></i>"
			ifamilyname = ""
			ifirstname = ""
			irowclass = ""
		
			newitem2 = {
		        "contacthistoryid%s" %row : contacthistory[0],
		        "subject%s" %row : contacthistory[1].replace('\xe2\x80\x99', "'"),
		        "familyname%s" %row : contacthistory[2] if contacthistory[2] else contacthistory[4],
		        "firstname%s" %row : contacthistory[3] if contacthistory[3] else contacthistory[5],
		        "colour%s" %row : "icon-blue", 
		        "rowclass%s" %row : "item-row item-row-click",
			    "icon%s" %row: "<i class='fa fa-user fa-2x'></i>"
		    }
			items.update(newitem2)
			row += 1
				

		data = add_config_details(items, True, PRMAXTOUCH)
		html = view.render(data, 'prmaxtouch.templates.contacts.list')

		return slimmer.xhtml_slimmer(html)