# -*- coding: utf-8 -*-
""" Import Usa Data """
#-----------------------------------------------------------------------------
# Name:        usa.py
# Purpose:     Import Usa Data
#
# Author:      Chris Hoy
#
# Created:     14/4/2014
# Copyright:   (c) 2014
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
from prcommon.model.employee import Employee, Contact, EmployeePrmaxRole
from prcommon.model.communications import Communication, Address
from prcommon.model.lookups import PRmaxOutletTypes
from prcommon.model.research import DataSourceTranslations, FrequencyCodes
from prcommon.model import Interests
from prcommon.model.queues import ProcessQueue
from prcommon.model.publisher import Publisher

import prcommon.Constants as Constants

DEFAULTREGIONALDAILY = 6
DEFAULTREGIONALWEEKLY = 10
DEFAULTREGIONALMAGAZINE = 67
DEFAULTREGIONRADIO = 21
DEFAULTREGIONTV = 25

DEFAULTCOUNTRYID = 103

FREQUENCYDAILY = 4
FREQUENCYWEEKLY = 3

OUTLETNAMECOLUMN = 0
ADDRESS1COLUMN = 1
CITYCOLUMN = 2
COUNTYCOLUMN = 3
POSTCODECOLUMN = 4
PHONECOLUMN = 5
FAXCOLUMN = 6

#constants for daily and weekly xls files
CIRCULATIONCOLUMN = 7
WWWCOLUMN = 8
EMAILCOLUMN = 9

#constants for magazines xls file
CATEGORYMAGAZINECOLUMN = 7
PRMAXKEYWORDCOLUMN = 8
CIRCULATIONMAGAZINECOLUMN = 9
WWWMAGAZINECOLUMN = 13
EMAILMAGAZINECOLUMN = 14
PROFILEMAGAZINECOLUMN = 11
CONTACTNAMEMAGAZINECOLUMN = 12
FREQUENCYMAGAZINECOLUMN = 15
FREQUENCYMAGAZINECOLUMNBEFORE = 10

#constants for radio xls file
ADDRESS1RADIOCOLUMN = 3
CITYRADIOCOLUMN = 4
COUNTYRADIOCOLUMN = 5
POSTCODERADIOCOLUMN = 6
PHONERADIOCOLUMN = 7
FAXRADIOCOLUMN = 8
WWWRADIOCOLUMN = 10
EMAILRADIOCOLUMN = 11

#constants for TV xls file
WWWTVCOLUMN = 9
EMAILTVCOLUMN = 10



class USADataImport(object):

	def __init__(self, sourcedir, check):
		"construct"
		self._sourcedir = sourcedir
		self._check = check
		self._prefixes={}
		self._frequencies={}
		self._translations = {}
		
	def _load_prefixes(self):
		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == 4).\
		    filter(DataSourceTranslations.fieldname == 'prefix').all():
			self._prefixes[row.sourcetext.lower()] = row.sourcetypeid

	def _load_frequencies(self):
		for row in session.query(FrequencyCodes).all():
			self._frequencies[row.frequencyname.lower()] = row.frequencyid
			
	def _load_translations(self):
		self._translations = {}
		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Usa).all():
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
					translation = simplejson.loads(row.translation)
				self._translations[row.fieldname.strip()][row.sourcetext.lower().strip()] = (translation, extended_function, extra)	
				

	def run_import(self):
		"Runs the import"
		
		files = os.listdir(self._sourcedir)
		for filename in files:
			if os.path.isdir(os.path.join(self._sourcedir, filename)) == False:
				
				if ('spanishtv' in filename.lower()):
					regionaltypeid = DEFAULTREGIONTV
					self.import_spanish_tv(filename, regionaltypeid)
				elif ('spanishradio' in filename.lower()):
					regionaltypeid = DEFAULTREGIONRADIO
					self.import_spanish_radio(filename, regionaltypeid)
				elif ('blackradio' in filename.lower()):
					pass
				
				if 'magazine' in filename.lower():
					#copy original file to original folder
					shutil.copy(os.path.join(self._sourcedir, filename), os.path.normpath(os.path.join(self._sourcedir, 'original', filename)))
					#add another column to the file for frequency
					self._get_magazine_frequency(filename)
					self.import_magazine(filename)
				elif 'radio' in filename.lower():
					regionaltypeid = DEFAULTREGIONRADIO
					self.import_radio(filename, regionaltypeid)
				elif 'tv' in filename.lower():
					regionaltypeid = DEFAULTREGIONTV
					self.import_tv(filename, regionaltypeid)
				elif 'daily' in filename.lower():
					regionaltypeid = DEFAULTREGIONALDAILY
					frequency = FREQUENCYDAILY
					self.import_daily_weekly(filename, regionaltypeid, frequency)
				elif 'weekly' in filename.lower():
					regionaltypeid = DEFAULTREGIONALWEEKLY
					frequency = FREQUENCYWEEKLY
					self.import_daily_weekly(filename, regionaltypeid, frequency)
		
	def run_update(self):
		"Runs the update"
		
		files = os.listdir(self._sourcedir)
		
		for filename in files:
			counter = 0
			if os.path.isdir(os.path.join(self._sourcedir, filename)) == False:
				if 'daily' in filename.lower() or 'weekly' in filename.lower() or 'tv' in filename.lower() or 'radio' in filename.lower():
					if 'radio' in filename.lower():
						address1column = 3
						citycolumn = 4
						statecolumn = 5
						postcode = 6
						phonecolumn = 7
						faxcolumn = 8
						wwwcolumn = 10
						emailcolumn = 11
						matchedidcolumn = 12
					else: 
						address1column = 1
						citycolumn = 2
						statecolumn = 3
						postcode = 4
						phonecolumn = 5
						faxcolumn = 6
						if 'daily' in filename.lower() or 'weekly' in filename.lower():
							wwwcolumn = 8
							emailcolumn = 9
							matchedidcolumn = 10					
						elif 'tv' in filename.lower():
							wwwcolumn = 9
							emailcolumn = 10
							matchedidcolumn = 11	
					self.update_daily_weekly_tv_radio(counter, filename, address1column, citycolumn, statecolumn, postcode, phonecolumn, faxcolumn, wwwcolumn, emailcolumn, matchedidcolumn)
	
				if 'magazine' in filename.lower():
					shutil.copy(os.path.join(self._sourcedir, filename), os.path.normpath(os.path.join(self._sourcedir, 'original', filename)))
					#add another column to the file for frequency
					self._get_magazine_frequency(filename)
					frequencymagazinecolumn = 16
					matchedidmagazinecolumn = 15
					self.update_magazine(counter, filename, frequencymagazinecolumn, matchedidmagazinecolumn)
		
	def update_magazine(self, counter, filename, frequencymagazinecolumn, matchedidmagazinecolumn):

		self._load_prefixes()
		self._load_frequencies()
		self._load_translations()
		
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
		xls_sheet = workbook.sheet_by_index(0)	
	
		for rnum_read in xrange(1, xls_sheet.nrows):
			session.begin()
			
			outletid = int(xls_sheet.cell_value(rnum_read, matchedidmagazinecolumn))
			outletname = xls_sheet.cell_value(rnum_read, OUTLETNAMECOLUMN).strip()
			address1 = xls_sheet.cell_value(rnum_read, ADDRESS1COLUMN).strip()
			city = xls_sheet.cell_value(rnum_read, CITYCOLUMN).strip()
			state = xls_sheet.cell_value(rnum_read, COUNTYCOLUMN).strip()
			zipcode = xls_sheet.cell_value(rnum_read, POSTCODECOLUMN)
			if type(zipcode) is float:
				zipcode = unicode(int(zipcode)).strip()
			else:
				zipcode = unicode(zipcode).strip()
			phone = xls_sheet.cell_value(rnum_read, PHONECOLUMN).strip()
			fax = xls_sheet.cell_value(rnum_read, FAXCOLUMN).strip()
			circulation = xls_sheet.cell_value(rnum_read, CIRCULATIONMAGAZINECOLUMN) if xls_sheet.cell_value(rnum_read, CIRCULATIONMAGAZINECOLUMN) else None
			www = xls_sheet.cell_value(rnum_read, WWWMAGAZINECOLUMN).strip()
			email = xls_sheet.cell_value(rnum_read, EMAILMAGAZINECOLUMN).strip()
			mag_category = self._get_as_string(xls_sheet.cell_value(rnum_read, CATEGORYMAGAZINECOLUMN)).lower()
			readership = xls_sheet.cell_value(rnum_read, PROFILEMAGAZINECOLUMN).strip()
			contact_fullname = xls_sheet.cell_value(rnum_read, CONTACTNAMEMAGAZINECOLUMN).strip()
			frequency_text = xls_sheet.cell_value(rnum_read,frequencymagazinecolumn).strip()
			if frequency_text and frequency_text.lower() in self._frequencies:
				frequencyid = self._frequencies[frequency_text.lower()]			
			else:
				frequencyid = 5
	
			publication = session.query(Outlet).\
		        filter(Outlet.countryid == 103).\
		        filter(Outlet.sourcetypeid == 7).\
		        filter(Outlet.outletid == outletid).scalar()

			if publication:
				com = session.query(Communication).\
			        filter(Communication.communicationid == publication.communicationid).scalar()
				addr = session.query(Address).\
			        filter(Address.addressid == com.addressid).scalar()
				profile = session.query(OutletProfile).\
			        filter(OutletProfile.outletid == publication.outletid).scalar()
				cont = session.query(Contact).\
			        join(Employee, Employee.contactid == Contact.contactid).\
			        filter(Employee.employeeid == publication.primaryemployeeid).scalar()
				if cont:
					contact = '%s %s %s' %(cont.prefix, cont.firstname, cont.familyname)
				else:
					contact = ""
				prmax_outlettypeid = self._get_outlettype(mag_category)
				contactsource = {}
				changed = False
				
				if (outletname != publication.outletname \
			        or (www != publication.www and www != None) \
			        or (phone != com.tel and phone != None) \
			        or (fax != com.fax and fax != None) \
				    or (circulation != publication.circulation and circulation != None) \
			        or (email != com.email and email != None) \
			        or (address1 != addr.address1 and address1 != None) \
			        or (city != addr.townname and city != None) \
			        or (state != addr.county and state != None) \
			        or (zipcode != addr.postcode and zipcode != None) \
			        or (readership != profile.readership and readership != None) \
				    or (prmax_outlettypeid != publication.prmax_outlettypeid and prmax_outlettypeid != None) \
				    or (contact_fullname.replace(" ", "") != contact.replace(" ", ""))
				    or (frequencyid != publication.frequencyid and frequencyid != None)):
	
					if (contact_fullname.replace(" ", "") != contact.replace(" ", "") and contact_fullname.replace(" ", "") != "" ):
						contact = contact_fullname.split()
						contactsource["surname"] = contact[len(contact)-1]
						contactsource["first-name"] = ' '.join(contact[0:len(contact)-1])
						contactsource["title"] = ''
						if len(contact) > 2:
							prefix = contact[0]
							if prefix.lower() in self._prefixes:
								contactsource["title"] = prefix
								contactsource["first-name"] =  ' '.join(contact[1:len(contact)-1])
						contactid = self._get_contactid(contactsource)
						primaryemployeeid = self._add_employee(contactid, contactsource, publication, com)	
						changed = True
					else:
						primaryemployeeid = publication.primaryemployeeid
						

					session.execute(text("UPDATE outlets SET outletname = :outletname, circulation = :circulation, www = :www, frequencyid = :frequencyid, prmax_outlettypeid= :prmax_outlettypeid, primaryemployeeid = :primaryemployeeid where outletid = :outletid"), \
				                    {'outletname': outletname, 'circulation': circulation,'www': www, 'frequencyid': frequencyid, 'prmax_outlettypeid': prmax_outlettypeid, 'primaryemployeeid': primaryemployeeid,'outletid': publication.outletid}, Outlet)
	
					session.execute(text("UPDATE outletprofile SET readership = :readership where outletid = :outletid"), \
				                    {'readership': readership, 'outletid': publication.outletid}, OutletProfile)
					
					session.execute(text("UPDATE communications SET tel = :phone, fax = :fax, email = :email where communicationid = :communicationid"), \
				                    {'phone': phone, 'fax': fax, 'email':email, 'communicationid': publication.communicationid}, Communication)
					
					session.execute(text("UPDATE addresses SET address1 = :address1, townname = :city, county = :state, postcode = :zipcode where addressid = :addressid"), \
				                    {'address1': address1, 'city': city, 'state': state, 'zipcode': zipcode, 'addressid': addr.addressid}, Address)
					
					if changed:
						session.execute(text('DELETE FROM employees WHERE employeeid = :employeeid'), {'employeeid': publication.primaryemployeeid}, Employee)
					counter = counter + 1
				session.commit()
		print '%s records updated for file %s' %(counter, filename) 
	
	
	def update_daily_weekly_tv_radio(self, counter, filename, address1column, citycolumn, statecolumn, postcode, phonecolumn, faxcolumn, wwwcolumn, emailcolumn, matchedidcolumn):
	
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
		xls_sheet = workbook.sheet_by_index(0)	
	
		for rnum_read in xrange(1, xls_sheet.nrows):
			session.begin()
			outletid = int(xls_sheet.cell_value(rnum_read, matchedidcolumn))
			outletname = xls_sheet.cell_value(rnum_read, OUTLETNAMECOLUMN).strip()
			address1 = xls_sheet.cell_value(rnum_read, address1column).strip()
			city = xls_sheet.cell_value(rnum_read, citycolumn).strip()
			state = xls_sheet.cell_value(rnum_read, statecolumn).strip()
			zipcode = xls_sheet.cell_value(rnum_read, postcode)
			if type(zipcode) is float:
				zipcode = unicode(int(zipcode)).strip()
			else:
				zipcode = unicode(zipcode).strip()
			phone = xls_sheet.cell_value(rnum_read, phonecolumn).strip()
			fax = xls_sheet.cell_value(rnum_read, faxcolumn).strip()
			www = xls_sheet.cell_value(rnum_read, wwwcolumn).strip()
			email = xls_sheet.cell_value(rnum_read, emailcolumn).strip()
	
			publication = session.query(Outlet).\
		        filter(Outlet.countryid == 103).\
		        filter(Outlet.sourcetypeid == 7).\
		        filter(Outlet.outletid == outletid).scalar()
	
			if publication:
				com = session.query(Communication).\
			        filter(Communication.communicationid == publication.communicationid).scalar()
				addr = session.query(Address).\
			        filter(Address.addressid == com.addressid).scalar()
	
				if (outletname != publication.outletname \
			        or (www != publication.www and www != None) \
			        or (phone != com.tel and phone != None) \
			        or (fax != com.fax and fax != None) \
			        or (email != com.email and email != None) \
			        or (address1 != addr.address1 and address1 != None) \
			        or (city != addr.townname and city != None) \
			        or (state != addr.county and state != None) \
			        or (zipcode != addr.postcode and zipcode != None)):
	
					session.execute(text("UPDATE outlets SET outletname = :outletname, circulation = null, www = :www where outletid = :outletid"), \
				                    {'outletname': outletname, 'www': www, 'outletid': publication.outletid}, Outlet)
	
					session.execute(text("UPDATE communications SET tel = :phone, fax = :fax, email = :email where communicationid = :communicationid"), \
				                    {'phone': phone, 'fax': fax, 'email':email, 'communicationid': publication.communicationid}, Communication)
	
					session.execute(text("UPDATE addresses SET address1 = :address1, townname = :city, county = :state, postcode = :zipcode where addressid = :addressid"), \
				                    {'address1': address1, 'city': city, 'state': state, 'zipcode': zipcode, 'addressid': addr.addressid}, Address)
					counter = counter + 1
					print outletname
				session.commit()
		print '%s records updated for file %s' %(counter, filename) 

	def _find_outlet(self, outletname, address1, email):
		publication = session.query(Outlet).\
		        join(Communication, Communication.communicationid ==  Outlet.communicationid).\
		        join(Address, Address.addressid == Communication.addressid).\
		        outerjoin(OutletProfile, OutletProfile.outletid == Outlet.outletid).\
                        filter(Outlet.sourcetypeid == Constants.Source_Type_Usa).\
                        filter(Outlet.outletname.ilike(outletname)).\
		        filter(Address.address1.ilike(address1)).\
		        filter(Communication.email.ilike(email)).scalar()	
		
		if email == '' and not publication:
			existing_outlets_with_email = session.query(Outlet).\
				join(Communication, Communication.communicationid ==  Outlet.communicationid).\
				join(Address, Address.addressid == Communication.addressid).\
				outerjoin(OutletProfile, OutletProfile.outletid == Outlet.outletid).\
				filter(Outlet.sourcetypeid == Constants.Source_Type_Usa).\
				filter(Outlet.outletname.ilike(outletname)).\
				filter(Address.address1.ilike(address1)).\
				filter(Communication.email != '').first()			
			if existing_outlets_with_email:
				publication = existing_outlets_with_email
		
		return publication
				
	
	
	def import_spanish_tv(self, filename, regionaltypeid):
		
		if self._check:
			return 
		
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))

		#for sheetnum in range (0, workbook.nsheets):
		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(1, xls_sheet.nrows):
			session.begin()	

			outletname=xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN).strip()
			address1=xls_sheet.cell_value(rnum,ADDRESS1COLUMN).strip()
			email=xls_sheet.cell_value(rnum,EMAILTVCOLUMN).strip()

			publication = self._find_outlet(outletname, address1, email)
			
			# add new record to outletLanguages table
			if publication:
				found_outlet_language = session.query(OutletLanguages).\
					filter(OutletLanguages.outletid == publication.outletid).\
					filter(OutletLanguages.languageid == '1920').scalar()
								
				if not found_outlet_language:
					outlet_language = OutletLanguages(
				        outletid = publication.outletid,
				        languageid = '1920', #or 1947
				        ispreferred = 1
						)
					session.add(outlet_language)
					session.flush()		
			
			session.commit()


	def import_spanish_radio(self, filename, regionaltypeid):
		if self._check:
			return 
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
		xls_sheet = workbook.sheet_by_index(0)	
		for rnum in xrange(1, xls_sheet.nrows):
			session.begin()	

			outletname=xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN).strip()
			address1=xls_sheet.cell_value(rnum,ADDRESS1RADIOCOLUMN).strip()
			email=xls_sheet.cell_value(rnum,EMAILRADIOCOLUMN).strip()

			publication = self._find_outlet(outletname, address1, email)
			
			# add new record to outletLanguages table
			if publication:
				found_outlet_language = session.query(OutletLanguages).\
					filter(OutletLanguages.outletid == publication.outletid).\
					filter(OutletLanguages.languageid == '1920').scalar()
								
				if not found_outlet_language:
					outlet_language = OutletLanguages(
				        outletid = publication.outletid,
				        languageid = '1920', #or 1947
				        ispreferred = 1
						)
					session.add(outlet_language)
					session.flush()		
			
			session.commit()
	
	def import_daily_weekly(self, filename, regionaltypeid, frequency):
		
		if self._check:
			return 
		counter = 0
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))

		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(1, xls_sheet.nrows):
			
			session.begin()	

			outletname=xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN).strip()

			pc = self._get_as_string(xls_sheet.cell_value(rnum,POSTCODECOLUMN))
			
			#publication = self._find_outlet(outletname)
			
			# add new outlet
			#if not publication:
			address = Address(
		          address1 = xls_sheet.cell_value(rnum,ADDRESS1COLUMN).strip(),
		          address2 = '',
		          address3 = '',
		          county = xls_sheet.cell_value(rnum,COUNTYCOLUMN).strip(),
		          townname = xls_sheet.cell_value(rnum,CITYCOLUMN).strip(),
		          postcode = pc,
		          countryid = DEFAULTCOUNTRYID,
		          addresstypeid = Address.editorialAddress)
			session.add(address)
			session.flush()
				
			outlet_com = Communication(
		          addressid=address.addressid,
		          tel=xls_sheet.cell_value(rnum,PHONECOLUMN).strip(),
		          email=xls_sheet.cell_value(rnum,EMAILCOLUMN).strip(),
		          fax=xls_sheet.cell_value(rnum,FAXCOLUMN).strip())
			session.add(outlet_com)
			session.flush()
										
			outlet = Outlet(
		          outletname=outletname,
		          sortname=outletname.lower()[:119],
		          addressid=address.addressid,
		          communicationid=outlet_com.communicationid,
		          customerid=-1,
		          outlettypeid=Constants.Outlet_Type_Standard,
		          prmax_outlettypeid=regionaltypeid,
		          www=xls_sheet.cell_value(rnum, WWWCOLUMN).strip()[:119],
		          statusid=Outlet.Live,
			  outletsearchtypeid=Constants.Source_Type_Usa,
			  sourcetypeid=Constants.Source_Type_Usa,
		          #sourcekey=publication["mediaid"],
		          countryid=DEFAULTCOUNTRYID,
		          frequencyid=frequency
		        )
			session.add(outlet)
			session.flush()		
		
			tmp_emp = Employee(outletid=outlet.outletid,
		                           job_title="Editor",
			                   sourcetypeid=Constants.Source_Type_Usa,
		                           isprimary=1)
			session.add(tmp_emp)
			session.flush()
			outlet.primaryemployeeid = tmp_emp.employeeid
			
			counter = counter + 1
			session.commit()
		print '%s records imported for file %s' %(counter, filename) 

	def import_radio(self, filename, regionaltypeid):
		
		if self._check:
			return 
		counter = 0
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))

		#for sheetnum in range (0, workbook.nsheets):
		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(1, xls_sheet.nrows):
			session.begin()	

			outletname=xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN).strip()
			address1=xls_sheet.cell_value(rnum,ADDRESS1RADIOCOLUMN).strip()
			email=xls_sheet.cell_value(rnum,EMAILRADIOCOLUMN).strip()

			pc = self._get_as_string(xls_sheet.cell_value(rnum,POSTCODERADIOCOLUMN))
				
			#publication = self._find_outlet(outletname, address1, email)
			
			# add new outlet
			#if not publication:
			address = Address(
		      address1 = xls_sheet.cell_value(rnum,ADDRESS1RADIOCOLUMN).strip(),
		      address2 = '',
		      address3 = '',
		      county = xls_sheet.cell_value(rnum,COUNTYRADIOCOLUMN).strip(),
		      townname = xls_sheet.cell_value(rnum,CITYRADIOCOLUMN).strip(),
		      postcode = pc,
		      countryid = DEFAULTCOUNTRYID,
		      addresstypeid = Address.editorialAddress)
			session.add(address)
			session.flush()
				
			outlet_com = Communication(
		      addressid=address.addressid,
		      tel=xls_sheet.cell_value(rnum,PHONERADIOCOLUMN).strip(),
		      email=xls_sheet.cell_value(rnum,EMAILRADIOCOLUMN).strip(),
		      fax=xls_sheet.cell_value(rnum,FAXRADIOCOLUMN).strip())
			session.add(outlet_com)
			session.flush()
										
			outlet = Outlet(
		      outletname=outletname,
		      sortname=outletname.lower()[:119],
		      addressid=address.addressid,
		      communicationid=outlet_com.communicationid,
		      customerid=-1,
		      outlettypeid=Constants.Outlet_Type_Standard,
		      prmax_outlettypeid=regionaltypeid,
		      www=xls_sheet.cell_value(rnum, WWWRADIOCOLUMN).strip()[:119],
		      statusid=Outlet.Live,
		      outletsearchtypeid=Constants.Source_Type_Usa,
		      sourcetypeid=Constants.Source_Type_Usa,
		      #sourcekey=publication["mediaid"],
		      countryid=DEFAULTCOUNTRYID
		    )
			session.add(outlet)
			session.flush()		
		
			tmp_emp = Employee(outletid=outlet.outletid,
		                   job_title="Editor",
		                   sourcetypeid=Constants.Source_Type_Usa,
		                   isprimary=1)
			session.add(tmp_emp)
			session.flush()
			outlet.primaryemployeeid = tmp_emp.employeeid
			
			counter = counter + 1	
			session.commit()
		print '%s records imported for file %s' %(counter, filename) 


	def import_tv(self, filename, regionaltypeid):
		
		if self._check:
			return 
		
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))

		#for sheetnum in range (0, workbook.nsheets):
		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(1, xls_sheet.nrows):
			session.begin()	

			outletname=xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN).strip()
			address1=xls_sheet.cell_value(rnum,ADDRESS1COLUMN).strip()
			email=xls_sheet.cell_value(rnum,EMAILTVCOLUMN).strip()

			pc = self._get_as_string(xls_sheet.cell_value(rnum,POSTCODECOLUMN))

			publication = self._find_outlet(outletname, address1, email)
			
			# add new outlet
			if not publication:
				address = Address(
				  address1 = xls_sheet.cell_value(rnum,ADDRESS1COLUMN).strip(),
				  address2 = '',
				  address3 = '',
				  county = xls_sheet.cell_value(rnum,COUNTYCOLUMN).strip(),
				  townname = xls_sheet.cell_value(rnum,CITYCOLUMN).strip(),
				  postcode = pc,
				  countryid = DEFAULTCOUNTRYID,
				  addresstypeid = Address.editorialAddress)
				session.add(address)
				session.flush()
					
				outlet_com = Communication(
				  addressid=address.addressid,
				  tel=xls_sheet.cell_value(rnum,PHONECOLUMN).strip(),
				  email=xls_sheet.cell_value(rnum,EMAILTVCOLUMN).strip(),
				  fax=xls_sheet.cell_value(rnum,FAXCOLUMN).strip())
				session.add(outlet_com)
				session.flush()
											
				outlet = Outlet(
				  outletname=outletname,
				  sortname=outletname.lower()[:119],
				  addressid=address.addressid,
				  communicationid=outlet_com.communicationid,
				  customerid=-1,
				  outlettypeid=Constants.Outlet_Type_Standard,
				  prmax_outlettypeid=regionaltypeid,
				  www=xls_sheet.cell_value(rnum, WWWTVCOLUMN).strip()[:119],
				  statusid=Outlet.Live,
				  outletsearchtypeid=Constants.Source_Type_Usa,
				  sourcetypeid=Constants.Source_Type_Usa,
				  #sourcekey=publication["mediaid"],
				  countryid=DEFAULTCOUNTRYID
				  
				)
				session.add(outlet)
				session.flush()		
			
				tmp_emp = Employee(outletid=outlet.outletid,
					           job_title="Editor",
					           sourcetypeid=Constants.Source_Type_Usa,
					           isprimary=1)
				session.add(tmp_emp)
				session.flush()
				outlet.primaryemployeeid = tmp_emp.employeeid
					
			session.commit()




	def import_magazine(self, filename):
		
		if self._check:
			return 
		counter = 0
		contact = {}
		self._load_prefixes()
		self._load_frequencies()
		self._load_translations()
		
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))

		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(1, xls_sheet.nrows):
			
			session.begin()	
			
			outletname=xls_sheet.cell_value(rnum, OUTLETNAMECOLUMN).strip()
			address1=xls_sheet.cell_value(rnum,ADDRESS1COLUMN).strip()
			email=xls_sheet.cell_value(rnum,EMAILMAGAZINECOLUMN).strip()

			pc = self._get_as_string(xls_sheet.cell_value(rnum,POSTCODECOLUMN))
				
			frequency = 5
			frequency_text = xls_sheet.cell_value(rnum,FREQUENCYMAGAZINECOLUMN).strip()
			if frequency_text.lower() in self._frequencies:
				frequency = self._frequencies[frequency_text]
			
			
			publication = self._find_outlet(outletname, address1, email)

			# add new outlet
			if not publication:
				contactsource = {}
					
				address = Address(
				  address1 = xls_sheet.cell_value(rnum,ADDRESS1COLUMN).strip(),
				  address2 = '',
				  address3 = '',
				  county = xls_sheet.cell_value(rnum,COUNTYCOLUMN).strip(),
				  townname = xls_sheet.cell_value(rnum,CITYCOLUMN).strip(),
				  postcode = pc,
				  countryid = DEFAULTCOUNTRYID,
				  addresstypeid = Address.editorialAddress)
				session.add(address)
				session.flush()
					
				outlet_com = Communication(
				  addressid=address.addressid,
				  tel=xls_sheet.cell_value(rnum,PHONECOLUMN).strip(),
				  email=xls_sheet.cell_value(rnum,EMAILMAGAZINECOLUMN).strip(),
				  fax=xls_sheet.cell_value(rnum,FAXCOLUMN).strip())
				session.add(outlet_com)
				session.flush()
							
				mag_category = self._get_as_string(xls_sheet.cell_value(rnum, CATEGORYMAGAZINECOLUMN)).lower()
			
	
				outlettypeid = self._get_outlettype(mag_category)
							
				outlet = Outlet(
				  outletname=outletname,
				  sortname=outletname.lower()[:119],
				  addressid=address.addressid,
				  communicationid=outlet_com.communicationid,
				  customerid=-1,
				  outlettypeid=Constants.Outlet_Type_Standard,
				  #prmax_outlettypeid=DEFAULTREGIONALMAGAZINE,
				  prmax_outlettypeid=outlettypeid,
				  profile = xls_sheet.cell_value(rnum, PROFILEMAGAZINECOLUMN).strip(),
				  www=xls_sheet.cell_value(rnum, WWWMAGAZINECOLUMN).strip()[:119],
				  statusid=Outlet.Live,
				  outletsearchtypeid=Constants.Source_Type_Usa,
				  sourcetypeid=Constants.Source_Type_Usa,
				  circulation =  None if xls_sheet.cell_value(rnum, CIRCULATIONMAGAZINECOLUMN) == '' else xls_sheet.cell_value(rnum, CIRCULATIONMAGAZINECOLUMN),
				  #sourcekey=publication["mediaid"],
				  frequencyid=frequency,
				  countryid=DEFAULTCOUNTRYID
				)
				session.add(outlet)
				session.flush()		
	
				interests_done = {}
				prmax_keyword =  xls_sheet.cell_value(rnum, PRMAXKEYWORDCOLUMN).strip()
				for interestid in self._get_interest_outlet(mag_category, outlet.outletid, prmax_keyword):
					if interestid and interestid not in interests_done:
						interests_done[interestid] = True
						session.add(OutletInterests(
							outletid=outlet.outletid,
							interestid=interestid))
			
				#get contact details, search if exists and if doesnt insert new dummy employee
				contact_fullname = xls_sheet.cell_value(rnum, CONTACTNAMEMAGAZINECOLUMN).strip()
				if contact_fullname:
					contact = contact_fullname.split()
					contactsource["surname"] = contact[len(contact)-1]
					contactsource["first-name"] = ' '.join(contact[0:len(contact)-1])
					contactsource["title"] = ''
						
					if len(contact) > 2:
						prefix = contact[0]
						
						if prefix.lower() in self._prefixes:
							contactsource["title"] = prefix
							contactsource["first-name"] =  ' '.join(contact[1:len(contact)-1])
							
					contactid = self._get_contactid(contactsource)
	
					self._add_employee(contactid, contactsource, outlet, outlet_com)
					
	
				if not outlet.primaryemployeeid:
					# add dummy emplyee
					tmp_emp = Employee(outletid=outlet.outletid,
						           job_title="Editor",
					                   sourcetypeid=Constants.Source_Type_Usa,
						           isprimary=1)
					session.add(tmp_emp)
					session.flush()
					outlet.primaryemployeeid = tmp_emp.employeeid
	
					
				#Readership
				readership = xls_sheet.cell_value(rnum, PROFILEMAGAZINECOLUMN).strip()
				outletprofile = OutletProfile(
					outletid=outlet.outletid,
					readership=readership
				)
			
				session.add(outletprofile)
			
			#session.add(ProcessQueue(
			#	objecttypeid=Constants.Process_Outlet_Profile,
			#	objectid=outlet.outletid))
			counter = counter + 1
			session.commit()
		print '%s records imported for file %s' %(counter, filename) 


	def _get_contactid(self, contact):
		"""get the contact id """

		if not contact["surname"]:
			return None

		contact_record = session.query(Contact).\
			filter(Contact.familyname == contact["surname"]).\
			filter(Contact.firstname == contact["first-name"]).\
			filter(Contact.sourcetypeid == Constants.Source_Type_Usa).scalar()
		
		if contact_record:
			return contact_record.contactid

		if contact["surname"]:
			contact_record = Contact(
				familyname=contact["surname"],
				firstname=contact["first-name"],
				prefix=contact.get("title", ""),
			        sourcetypeid=Constants.Source_Type_Usa
			)
			session.add(contact_record)
			session.flush()
			return contact_record.contactid
		return None	
	
	def _add_employee(self, contactid, contactsource, outlet, outlet_com):
		"""add a contact """

		# address ?
		contact_com = Communication(
			email=outlet_com.email,
			tel=outlet_com.tel,
			fax=outlet_com.fax,
			webphone="",
			linkedin="",
			twitter="")
		session.add(contact_com)
		session.flush()

		employee = Employee(
			outletid=outlet.outletid,
			contactid=contactid,
			job_title="Editor",
			customerid=-1,
			communicationid=contact_com.communicationid,
		        sourcetypeid=Constants.Source_Type_Usa)

		session.add(employee)
		session.flush()

		if not outlet.primaryemployeeid:
			outlet.primaryemployeeid = employee.employeeid

		return employee.employeeid
	
	def _get_magazine_frequency(self, filename):
		
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
		wb = xlwt.Workbook()
		ws = wb.add_sheet('Full')
		
		#for sheetnum in range (0, workbook.nsheets):
		xls_sheet = workbook.sheet_by_index(0)	

		for rnum in xrange(0, xls_sheet.nrows):		
			
			if rnum == 0:
				freq = 'Frequency'
			else:
				freq = 'no'
				
			for cnum in xrange(0, xls_sheet.ncols):
				ws.write(rnum, cnum, xls_sheet.cell_value(rnum, cnum))
				
			if 'biweekly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "twice a month"
			elif 'bi-weekly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "twice a month"
			elif 'bi-wkly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "twice a month"
			elif 'Semi-mo' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "twice a month"
			elif 'weekly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "weekly"
			elif 'wkly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "weekly"
			elif 'bimonthly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif 'bi-monthly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif 'bi_mo' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif 'bimo' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif 'bi-mo' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif 'bimnthly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif "every other month" in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "every other month"
			elif 'mo.' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "monthly"
			elif 'monthly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "monthly"
			elif 'twice a week' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "twice a week"
			elif "three times a week" in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "three times a week"
			elif 'quarterly' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "quarterly"
			elif 'online' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "online"
			elif 'daily' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "daily"
			elif 'annually' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "annually"
			elif 'twice a year' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "twice a year"
			elif "three times a year" in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "three times a year"
			elif "irregular" in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "irregular"
			elif "none" in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "none"
			elif '3-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "Three times a year"
			elif '3 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "Three times a year"
			elif '4-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "quarterly"
			elif '4 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "quarterly"
			elif '5-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "quarterly"
			elif '5 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "quarterly"
			elif '6-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '6 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '7-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '7 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '8-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '8 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '8-isseu' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '9-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "Every other month"
			elif '9 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "Every other month"
			elif '10-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '10 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '11-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "monthly"
			elif '11 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():
				freq = "monthly"
			elif '12-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '12 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '13-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '13 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '14-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '14 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '15-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '15 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '16-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '16 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '17-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '17 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '18-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '18 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif '20-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '20 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '21-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '21 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '22-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '22 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '23-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '23 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '24-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '24 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '25-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '25 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '26-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '26 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '31-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '31 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '37-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '37 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '39-issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '39 issue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Twice a month"
			elif '10pissue' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "Every other month"
			elif '9 iss.' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "monthly"
			elif 'qu.' in xls_sheet.cell_value(rnum, FREQUENCYMAGAZINECOLUMNBEFORE).lower():	
				freq = "quarterly"


			ws.write(rnum, xls_sheet.ncols, freq)

		wb.save(os.path.join(self._sourcedir, filename))
		
		
	def _get_outlettype(self, mag_category):
		
		if mag_category in self._translations['interests']:
			return self._translations['interests'][mag_category][0]
		else:
			return None

	def _get_interest_outlet(self, category, outletname, prmax_keyword):
		"GEt interests"
		interests = []
		if not prmax_keyword:
			interests = self._translations["interests"][category][2]
		else:
			interestnames = prmax_keyword.strip().split(':')
			for interestname in interestnames:
				interestname = interestname.strip()
				interestid = session.query(Interests.interestid).\
					filter(Interests.interestname.ilike(interestname)).\
				        filter(Interests.customerid == -1).scalar()
				interests.append(interestid)
			
		return [int(interestid) for interestid in interests]
	
	def _get_as_string(self, value):
		if type(value) is float:
			value = str(int(value)).strip()
		else:
			value = str(value).strip()    
		return value