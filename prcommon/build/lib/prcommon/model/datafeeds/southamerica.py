# -*- coding: utf-8 -*-
""" Import South America Data """
#-----------------------------------------------------------------------------
# Name:        southamerica.py
# Purpose:     Import South America Data
#
# Author:      
#
# Created:     09/01/2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy.sql import text
import xlrd
import xlwt
import os
import logging
LOG = logging.getLogger("prmax")
from types import ListType, DictionaryType
import simplejson
import shutil

from prcommon.model import Countries, DataSourceTranslations
from prcommon.model.datafeeds.xmlbase import XMLBaseImport, BaseContent
from prcommon.model.outlet import Outlet, OutletInterests, OutletProfile, OutletLanguages
from prcommon.model.employee import Employee, EmployeePrmaxRole
from prcommon.model.contact import Contact
from prcommon.model.communications import Communication, Address
from prcommon.model.lookups import PRmaxOutletTypes
from prcommon.model.research import DataSourceTranslations, FrequencyCodes
from prcommon.model import Interests
from prcommon.model.queues import ProcessQueue
from prcommon.model.publisher import Publisher

import prcommon.Constants as Constants

DEFAULTREGIONALDAILY = 6

DEFAULTCOUNTRYID = 171

CONTACTCOLUMN = 0
OUTLETNAMECOLUMN = 1
JOBTITLECOLUMN = 3
KEYWORDSCOLUMN = 4
PHONECOLUMN = 5
MOBILECOLUMN = 6
EMAILCOLUMN = 7
TOWNCOLUMN = 9
COUNTYCOLUMN = 10
COUNTRYCOLUMN = 11
MEDIACHANNELCOLUMN1 = 12
MEDIACHANNELCOLUMN2 = 13
TWITTERCOLUMN = 14

class SADataImport(object):

	def __init__(self, sourcedir, check):
		"construct"
		self._sourcedir = sourcedir
		self._check = check
		self._prefixes={}
		self._suffixes={}
		self._translations = {}
		
	def _load_prefixes(self):
		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == 4).\
		    filter(DataSourceTranslations.fieldname == 'prefix').all():
			self._prefixes[row.sourcetext.lower()] = row.sourcetypeid
	def _load_suffixes(self):
		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == 4).\
		    filter(DataSourceTranslations.fieldname == 'suffix').all():
			self._suffixes[row.sourcetext.lower()] = row.sourcetypeid
		
	def _load_translations(self):
		self._translations = {}
		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_SouthAmerica).all():
			extra = []
			if row.translation or row.extended_function:
				translation = row.translation

				extended_function = row.extended_function
				if row.extended_function:
					extended_function = getattr(self, extended_function)
				if row.fieldname.strip() not in self._translations:
					self._translations[row.fieldname.strip()] = {}
				if row.extended_translation:
					extra = simplejson.loads(row.extended_translation)
				if row.fieldname.strip() == "interests":
					translation = row.translation
				self._translations[row.fieldname.strip()][row.sourcetext.lower().strip()] = (translation, extended_function, extra)	
				

	def run_import(self):
		"Runs the import"
		
		files = os.listdir(self._sourcedir)
		for filename in files:
			if os.path.isdir(os.path.join(self._sourcedir, filename)) == False:
				print ('Processing file %s' %filename)
#				if 'salvador' in filename.lower():
#				regionaltypeid = DEFAULTREGIONALDAILY
				self.import_south_america(filename)
		

	def import_south_america(self, filename):
		
		if self._check:
			return 
		contact = {}

		self._load_prefixes()
		self._load_suffixes()
		self._load_translations()		
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(1, xls_sheet.nrows):
			session.begin()	

			outletname=self._get_as_string(xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN))
			phone=self._get_as_string(xls_sheet.cell_value(rnum, PHONECOLUMN))
			mobile=self._get_as_string(xls_sheet.cell_value(rnum, MOBILECOLUMN))
			email=self._get_as_string(xls_sheet.cell_value(rnum, EMAILCOLUMN))
			twitter = self._get_as_string(xls_sheet.cell_value(rnum,TWITTERCOLUMN))
			job_title = self._get_as_string(xls_sheet.cell_value(rnum,JOBTITLECOLUMN))
			city=self._get_as_string(xls_sheet.cell_value(rnum, TOWNCOLUMN))
			county=self._get_as_string(xls_sheet.cell_value(rnum, COUNTYCOLUMN))
			countryname=self._get_as_string(xls_sheet.cell_value(rnum, COUNTRYCOLUMN))
			countryid = session.query(Countries.countryid).filter(Countries.countryname.ilike(countryname)).scalar()
			contact_fullname = xls_sheet.cell_value(rnum, CONTACTCOLUMN).strip()
			mediatype=self._get_as_string(xls_sheet.cell_value(rnum, MEDIACHANNELCOLUMN1)) 
			if self._get_as_string(xls_sheet.cell_value(rnum, MEDIACHANNELCOLUMN1)).lower() !=  self._get_as_string(xls_sheet.cell_value(rnum, MEDIACHANNELCOLUMN2)).lower():
				mediatype= '%s %s' %(self._get_as_string(xls_sheet.cell_value(rnum, MEDIACHANNELCOLUMN1)), self._get_as_string(xls_sheet.cell_value(rnum, MEDIACHANNELCOLUMN2)))

			publication = self._find_outlet(outletname, phone, email, city, countryid)
			if publication: #check if is a new employee to existing outlet
				contactsource = {}
				if contact_fullname:
					contactsource = self._get_contactsource(contact_fullname, contactsource)
					contactid = self._get_contactid(contactsource)
					emp = self._find_employee(publication, contactid)
					if not emp:
						self._add_employee(contactid, contactsource, publication, phone, email, job_title, mobile, twitter)
			else: #add a new outlet			
				address = Address(
					  address1 = '',
					  address2 = '',
					  address3 = '',
					  county = county,
					  townname = city,
					  postcode = '',
					  countryid = countryid,
					  addresstypeid = Address.editorialAddress)
				session.add(address)
				session.flush()
					
				outlet_com = Communication(
					  addressid=address.addressid,
					  tel=phone,
				      mobile=mobile,
				      email=email,
				      twitter=twitter)
				session.add(outlet_com)
				session.flush()
						
				if mediatype.lower().strip() in self._translations['mediatype']:
					prmax_outlettypeid = self._translations['mediatype'][mediatype.lower()][0]
									
				outlet = Outlet(
					  outletname=outletname,
					  sortname=outletname.lower()[:119],
					  addressid=address.addressid,
					  communicationid=outlet_com.communicationid,
					  customerid=-1,
					  outlettypeid=Constants.Outlet_Type_Standard,
					  prmax_outlettypeid=prmax_outlettypeid,
					  www='',
					  statusid=Outlet.Live,
					  outletsearchtypeid=Constants.Source_Type_SouthAmerica,
					  sourcetypeid=Constants.Source_Type_SouthAmerica,
					  countryid=countryid,
					  frequencyid=4
					)
				session.add(outlet)
				session.flush()		

				interests_done = {}
				keywords =  xls_sheet.cell_value(rnum, KEYWORDSCOLUMN).strip().split(',')
				for keyword in keywords:
					if keyword.lower().strip() in self._translations['interests']:
						prmax_keywords = self._translations['interests'][keyword.lower().strip()][2]
						for interestid in prmax_keywords:
							if interestid and interestid not in interests_done:
								interests_done[interestid] = True
								session.add(OutletInterests(
									outletid=outlet.outletid,
									interestid=interestid))
					else:
						interestid = session.query(Interests.interestid).\
							filter(Interests.interestname.ilike(keyword.strip())).\
							filter(Interests.customerid == -1).scalar()
						if interestid and interestid not in interests_done:
							interests_done[interestid] = True
							session.add(OutletInterests(
						        outletid=outlet.outletid,
						        interestid=interestid))

	
				#get contact details, search if exists and if doesnt insert new dummy employee
				contactsource = {}
				if contact_fullname:
					contactsource = self._get_contactsource(contact_fullname, contactsource)
					contactid = self._get_contactid(contactsource)
					self._add_employee(contactid, contactsource, outlet, phone, email, job_title, mobile, twitter)
			
				if not outlet.primaryemployeeid:
					# add dummy emplyee
					tmp_emp = Employee(outletid=outlet.outletid,
						               job_title="Editor",
						               sourcetypeid=Constants.Source_Type_SouthAmerica,
						               isprimary=1)
					session.add(tmp_emp)
					session.flush()
					outlet.primaryemployeeid = tmp_emp.employeeid		
			
			session.commit()

	def _find_outlet(self, outletname, phone, email, city, countryid):
		publication = session.query(Outlet).\
		    join(Communication, Communication.communicationid ==  Outlet.communicationid).\
		    join(Address, Address.addressid == Communication.addressid).\
		    filter(Outlet.outletname.ilike(outletname)).\
		    filter(Outlet.sourcetypeid == Constants.Source_Type_SouthAmerica).\
		    filter(Outlet.countryid == countryid).\
		    filter(Address.townname.ilike(city)).scalar()
		return publication

	def _find_employee(self, publication, contactid):
		emp = session.query(Employee).\
		    filter(Employee.outletid == publication.outletid).\
		    filter(Employee.contactid == contactid).scalar()
		return emp

	def _get_contactsource1(self, contact_fullname, contactsource):
		contact = contact_fullname.split()
		contactsource["surname"] = contact[len(contact)-1]
		contactsource["first-name"] = ' '.join(contact[0:len(contact)-1])
		contactsource["title"] = ''
		if len(contact) > 2:
			prefix = contact[0]
			if prefix.lower() in self._prefixes:
				contactsource["title"] = prefix
				contactsource["first-name"] =  ' '.join(contact[1:len(contact)-1])
		return contactsource


	def _get_contactsource(self, contact_fullname, contactsource):
		contact = contact_fullname.split()
		
		contactsource["title"] = ''
		contactsource["first-name"] = ''
		contactsource["surname"] = ''
		contactsource["suffix"] = ''
		tmpname = ''
		
		if contact[0].lower() in self._prefixes:
			contactsource["title"] = contact[0]
			tmpname = ' '.join(contact[1:len(contact)])
			contact = tmpname.split()
		if contact[len(contact)-1].lower() in self._suffixes:
			if contact[len(contact)-2].lower() in self._suffixes:
				contactsource["suffix"] = '%s %s' %(contact[len(contact)-2], contact[len(contact)-1])
				tmpname = ' '.join(contact[0:len(contact)-2])
				contact = tmpname.split()
			else:
				contactsource["suffix"] = contact[len(contact)-1]
				tmpname = ' '.join(contact[0:len(contact)-1])
				contact = tmpname.split()
		contactsource["surname"] = contact[len(contact)-1]
		contactsource["first-name"] = ' '.join(contact[0:len(contact)-1])
					
		return contactsource


	def _get_contactid(self, contact):
		"""get the contact id """

		if not contact["surname"]:
			return None

		contact_record = session.query(Contact).\
		    filter(Contact.firstname == contact["first-name"]).\
		    filter(Contact.familyname == contact["surname"]).\
			filter(Contact.sourcetypeid == Constants.Source_Type_SouthAmerica).scalar()
		
		if contact_record:
			return contact_record.contactid

		if contact["surname"]:
			contact_record = Contact(
				familyname=unicode(contact["surname"]),
				firstname=unicode(contact["first-name"]),
			    prefix=contact.get("title", ""),
			    suffix=contact.get("suffix", ""),
			        sourcetypeid=Constants.Source_Type_SouthAmerica
			)
			session.add(contact_record)
			session.flush()
			return contact_record.contactid
		return None	
	
	def _add_employee(self, contactid, contactsource, outlet, phone, email, job_title, mobile, twitter):
		"""add a contact """

		com = Communication(
			email=email,
			tel=phone,
		    mobile=mobile,
			twitter=twitter)
		session.add(com)
		session.flush()

		employee = Employee(
			outletid=outlet.outletid,
			contactid=contactid,
			job_title=job_title,
			customerid=-1,
			communicationid=com.communicationid,
		    sourcetypeid=Constants.Source_Type_SouthAmerica)

		session.add(employee)
		session.flush()

		if not outlet.primaryemployeeid:
			outlet.primaryemployeeid = employee.employeeid

		return employee.employeeid

	def _get_as_string(self, value):
		if type(value) is float:
			value = str(int(value)).strip()
		else:
			value = value.strip()    
		return value
	
	
	def _get_interest_outlet(self, outletname, prmax_keyword):
		"GEt interests"
		interests = []
		interestnames = prmax_keyword.strip().split(':')
		for interestname in interestnames:
			interestname = interestname.strip()
			interestid = session.query(Interests.interestid).\
		        filter(Interests.interestname.ilike(interestname)).\
		        filter(Interests.customerid == -1).scalar()
			interests.append(interestid)

		return [int(interestid) for interestid in interests]	