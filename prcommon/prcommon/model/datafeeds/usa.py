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
#from xlutils.copy import copy
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
from prcommon.model import Subject, SubjectInterest, Interests

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
#--------------------------
OUTLETNAME_OLD = 5
ADDRESS1_OLD = 21
ADDRESS2_OLD = 22
CITY_OLD = 23
COUNTY_OLD = 25
POSTCODE_OLD= 27
PHONE_OLD = 20
EMAIL_OLD = 28
FAX_OLD = 18
WWW_OLD = 10
PROFILE_OLD = 17
FREQUENCY_OLD = 12
JOBTITLE_OLD = 3
PRMAX_OUTLETTYPE = 16
FAMILYNAME_OLD = 43
FIRSTNAME_OLD = 44
PREFIX_OLD = 30
CIRCULATION_OLD = 52
LINKEDIN_OLD = 37
TWITTER_OLD = 38
CONTACT_EMAIL_OLD = 2
SUBJECT_OLD = 6


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
				
				elif 'magazine' in filename.lower():
					#copy original file to original folder
					shutil.copy(os.path.join(self._sourcedir, filename), os.path.normpath(os.path.join(self._sourcedir, 'original', filename)))
					#add another column to the file for frequency
					self._get_magazine_frequency(filename)
					self.import_magazine(filename)
				elif 'radio' in filename.lower():
					regionaltypeid = DEFAULTREGIONRADIO
					frequency = FREQUENCYDAILY
					self.import_radio(filename, regionaltypeid, frequency)
				elif 'tv' in filename.lower():
					regionaltypeid = DEFAULTREGIONTV
					frequency = FREQUENCYDAILY
					self.import_tv(filename, regionaltypeid, frequency)
				elif 'daily' in filename.lower():
					regionaltypeid = DEFAULTREGIONALDAILY
					frequency = FREQUENCYDAILY
					self.import_daily_weekly(filename, regionaltypeid, frequency)
				elif 'weekly' in filename.lower():
					regionaltypeid = DEFAULTREGIONALWEEKLY
					frequency = FREQUENCYWEEKLY
					self.import_daily_weekly(filename, regionaltypeid, frequency)
				elif 'd2_d_usmedia_' in filename.lower():
					self._import_old_ping_outlets(filename)

	def run_update(self):
		"Runs the update"

		files = os.listdir(self._sourcedir)

		for filename in files:
			print 'start updating file: %s' % filename
			counter = 0
			if os.path.isdir(os.path.join(self._sourcedir, filename)) == False:

				if 'radio' in filename.lower() \
			       or 'daily' in filename.lower() \
			       or 'weekly' in filename.lower()\
			       or 'tv' in filename.lower():
					frequencyid = 4
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
					elif 'daily' in filename.lower() or 'weekly' in filename.lower():
						address1column = 1
						citycolumn = 2
						statecolumn = 3
						postcode = 4
						phonecolumn = 5
						faxcolumn = 6
						wwwcolumn = 8
						emailcolumn = 9
						matchedidcolumn = 10
						if 'weekly' in filename.lower():
							frequencyid = 3
					elif 'tv' in filename.lower():
						address1column = 1
						citycolumn = 2
						statecolumn = 3
						postcode = 4
						phonecolumn = 5
						faxcolumn = 6
						wwwcolumn = 9
						emailcolumn = 10
						matchedidcolumn = 11

					self.update_daily_weekly_tv_radio(counter, filename, address1column, citycolumn, statecolumn, postcode, phonecolumn,
				                                     faxcolumn, wwwcolumn, emailcolumn, matchedidcolumn, frequencyid)
				elif 'magazine' in filename.lower():
					address1column = 1
					citycolumn = 2
					statecolumn = 3
					postcode = 4
					phonecolumn = 5
					faxcolumn = 6
					circulationcolumn = 8
					profilecolumn = 10
					contactnamecolumn = 11
					wwwcolumn = 12
					emailcolumn = 13
					matchedidcolumn = 14
					frequencycolumn = 15

					shutil.copy(os.path.join(self._sourcedir, filename), os.path.normpath(os.path.join(self._sourcedir, 'original', filename)))
					#add another column to the file for frequency
					self._get_magazine_frequency(filename)
					self.update_magazine(counter, filename, address1column, citycolumn, statecolumn, postcode, phonecolumn, faxcolumn,
				                         circulationcolumn, profilecolumn, contactnamecolumn, wwwcolumn, emailcolumn, matchedidcolumn, frequencycolumn)


	def update_magazine(self, counter, filename, address1column, citycolumn, statecolumn, postcode, phonecolumn, faxcolumn,
	                    circulationcolumn, profilecolumn, contactnamecolumn, wwwcolumn, emailcolumn, matchedidcolumn, frequencycolumn):

		self._load_prefixes()
		self._load_frequencies()
		#self._load_translations()
		
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
			circulation = xls_sheet.cell_value(rnum_read, circulationcolumn) if xls_sheet.cell_value(rnum_read, circulationcolumn) else None
			www = xls_sheet.cell_value(rnum_read, wwwcolumn).strip()
			email = xls_sheet.cell_value(rnum_read, emailcolumn).strip()
			#mag_category = self._get_as_string(xls_sheet.cell_value(rnum_read, CATEGORYMAGAZINECOLUMN)).lower()
			readership = xls_sheet.cell_value(rnum_read, profilecolumn).strip()
			contact_fullname = xls_sheet.cell_value(rnum_read, contactnamecolumn).strip()
			frequency_text = xls_sheet.cell_value(rnum_read,frequencycolumn).strip()
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
				#prmax_outlettypeid = self._get_outlettype(mag_category)
				contactsource = {}
				changed = False
				
				if (outletname != publication.outletname \
			        or (www != publication.www) \
			        or (phone != com.tel) \
			        or (fax != com.fax) \
				    or (circulation != publication.circulation) \
			        or (email != com.email) \
			        or (address1 != addr.address1) \
			        or (city != addr.townname) \
			        or (state != addr.county) \
			        or (zipcode != addr.postcode) \
			        or (readership != profile.readership) \
				    or (contact_fullname.replace(" ", "") != contact.replace(" ", ""))
				    or (frequencyid != publication.frequencyid)):
	
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
						primaryemployeeid = self._add_employee(contactid, contactsource, publication, com, xls_sheet, rnum)	
						changed = True
					else:
						primaryemployeeid = publication.primaryemployeeid

					circulationsourceid = None
					if circulation:
						circulationsourceid = 3 #Publisher's statement

					session.execute(text("UPDATE outlets SET outletname = :outletname, circulation = :circulation, www = :www, frequencyid = :frequencyid, primaryemployeeid = :primaryemployeeid where outletid = :outletid"), \
				                    {'outletname': outletname, 'circulation': circulation, 'circulationsourceid': circulationsourceid, 'www': www, 'frequencyid': frequencyid, 'primaryemployeeid': primaryemployeeid,'outletid': publication.outletid}, Outlet)
	
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
	
	def update_daily_weekly_tv_radio(self, counter, filename, address1column, citycolumn, statecolumn, postcode, phonecolumn, faxcolumn, wwwcolumn, emailcolumn, matchedidcolumn, frequencyid):
	
		workbook = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
		xls_sheet = workbook.sheet_by_index(0)	
	
		for rnum_read in xrange(1, xls_sheet.nrows):
			session.begin()
			if xls_sheet.cell_value(rnum_read, matchedidcolumn) != 'No match':

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
					if com:
						addr = session.query(Address).\
						    filter(Address.addressid == com.addressid).scalar()
	
					if (outletname != publication.outletname \
					    or (www != publication.www) \
					    or (phone != com.tel) \
					    or (fax != com.fax) \
					    or (email != com.email) \
					    or (address1 != addr.address1) \
					    or (city != addr.townname) \
					    or (state != addr.county) \
					    or (zipcode != addr.postcode) \
					    or (frequencyid != publication.frequencyid)):
	
						session.execute(text("UPDATE outlets SET outletname = :outletname, www = :www, frequencyid = :frequencyid where outletid = :outletid"), \
						                {'outletname': outletname, 'www': www, 'frequencyid': frequencyid, 'outletid': publication.outletid}, Outlet)

						session.execute(text("UPDATE communications SET tel = :phone, fax = :fax, email = :email where communicationid = :communicationid"), \
						                {'phone': phone, 'fax': fax, 'email':email, 'communicationid': publication.communicationid}, Communication)

						session.execute(text("UPDATE addresses SET address1 = :address1, townname = :city, county = :state, postcode = :zipcode where addressid = :addressid"), \
						                {'address1': address1, 'city': city, 'state': state, 'zipcode': zipcode, 'addressid': addr.addressid}, Address)
						counter = counter + 1
						print outletname
			session.commit()
		print '%s records updated for file %s' %(counter, filename) 

	def _find_outlet(self, outletname, address1, email, regionaltypeid):
		if regionaltypeid != None:
			publication = session.query(Outlet).\
		        join(Communication, Communication.communicationid ==  Outlet.communicationid).\
		        join(Address, Address.addressid == Communication.addressid).\
		        outerjoin(OutletProfile, OutletProfile.outletid == Outlet.outletid).\
                        filter(Outlet.sourcetypeid == Constants.Source_Type_Usa).\
                        filter(Outlet.outletname.ilike(outletname)).\
						filter(Outlet.prmax_outlettypeid == regionaltypeid).\
		        filter(Address.address1.ilike(address1)).\
		        filter(Communication.email.ilike(email)).scalar()
		else:
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

			publication = self._find_outlet(outletname, address1, email, regionaltypeid)
			
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

			publication = self._find_outlet(outletname, address1, email, regionaltypeid)
			
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

	def import_radio(self, filename, regionaltypeid, frequency):
		
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


	def import_tv(self, filename, regionaltypeid, frequency):
		
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

			publication = self._find_outlet(outletname, address1, email, regionaltypeid)
			
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
				frequency = self._frequencies[frequency_text.lower()]
			
			
			publication = self._find_outlet(outletname, address1, email, None)

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
	
					self._add_employee(contactid, contactsource, outlet, outlet_com, xls_sheet, rnum)
					
	
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

	def _import_old_ping_outlets(self, filename):
		
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

			outletname = self._get_as_string(xls_sheet.cell_value(rnum,OUTLETNAME_OLD))
			pc = self._get_as_string(xls_sheet.cell_value(rnum,POSTCODE_OLD))
			address1 = self._get_as_string(xls_sheet.cell_value(rnum,ADDRESS1_OLD))
			
			frequency_text = xls_sheet.cell_value(rnum,FREQUENCY_OLD).strip().lower()
			frequency = self._translations['frequency'][frequency_text][0] if frequency_text in self._translations['frequency'] else None
#			if frequency_text in self._translations['frequency']:
#				frequency = self._translations['frequency'][frequency_text][0]
				
			contactsource = {}
			address = Address(
		      address1 = address1,
		      address2 = self._get_as_string(xls_sheet.cell_value(rnum,ADDRESS2_OLD)),
		      address3 = '',
		      county = xls_sheet.cell_value(rnum,COUNTY_OLD).strip(),
		      townname = xls_sheet.cell_value(rnum,CITY_OLD).strip(),
		      postcode = pc,
		      countryid = DEFAULTCOUNTRYID)
			session.add(address)
			session.flush()
				
			outlet_com = Communication(
		      addressid=address.addressid,
		      tel=self._get_as_string(xls_sheet.cell_value(rnum,PHONE_OLD)),
		      email=self._get_as_string(xls_sheet.cell_value(rnum,EMAIL_OLD)),
		      fax=self._get_as_string(xls_sheet.cell_value(rnum,FAX_OLD)))
			session.add(outlet_com)
			session.flush()
						
						
			prmax_outlettype = ''
			prmax_outlettypename = self._get_as_string(xls_sheet.cell_value(rnum,PRMAX_OUTLETTYPE)).lower()
			if prmax_outlettypename in self._translations['mediatype']:
				prmax_outlettype = self._translations['mediatype'][prmax_outlettypename][0]
						
			outlet = Outlet(
		      outletname=outletname[:119],
		      sortname=outletname.lower()[:119],
		      addressid=address.addressid,
		      communicationid=outlet_com.communicationid,
		      customerid=-1,
		      outlettypeid=Constants.Outlet_Type_Standard,
		      prmax_outlettypeid=prmax_outlettype,
		      profile = self._get_as_string(xls_sheet.cell_value(rnum, PROFILE_OLD)),
		      www=self._get_as_string(xls_sheet.cell_value(rnum, WWW_OLD))[:119],
		      statusid=Outlet.Live,
		      outletsearchtypeid=Constants.Source_Type_Usa,
		      sourcetypeid=Constants.Source_Type_Usa,
		      circulation =  None if xls_sheet.cell_value(rnum, CIRCULATION_OLD) == '' else xls_sheet.cell_value(rnum, CIRCULATION_OLD),
		      #sourcekey=publication["mediaid"],
		      frequencyid=frequency,
		      countryid=DEFAULTCOUNTRYID
		    )
			session.add(outlet)
			session.flush()		

			interests_done = {}
			prmax_keyword =  xls_sheet.cell_value(rnum, SUBJECT_OLD).strip()
			
			for interestname in prmax_keyword.strip().split("|"):
				
				interest = session.query(SubjectInterest).\
				    join(Subject, Subject.subjectid == SubjectInterest.subjectid).\
					join(Interests, Interests.interestid == SubjectInterest.interestid).\
				    filter(Subject.subjectname.ilike(interestname.lower())).all()
				
				if interest:
					for x in xrange(0, len(interest)):
						if interest[x] and interest[x].interestid not in interests_done:
							interests_done[interest[x].interestid] = True
							session.add(OutletInterests(
								outletid=outlet.outletid,
								interestid=interest[x].interestid))
		
			#if jobtitle is editor add the contact otherwise add a dummy employee
			jobtitle = xls_sheet.cell_value(rnum, JOBTITLE_OLD).strip()
			if jobtitle.lower() == 'editor':
				contactsource = {}
				contactsource["surname"] = self._get_as_string(xls_sheet.cell_value(rnum, FAMILYNAME_OLD))
				contactsource["first-name"] = xls_sheet.cell_value(rnum, FIRSTNAME_OLD).strip()
				contactsource["title"] = xls_sheet.cell_value(rnum, PREFIX_OLD).strip()
							
				contactid = self._get_contactid(contactsource)
	
				self._add_employee(contactid, contactsource, outlet, outlet_com, xls_sheet, rnum)

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
			readership = xls_sheet.cell_value(rnum, PROFILE_OLD).strip()
			outletprofile = OutletProfile(
		        outletid=outlet.outletid,
		        readership=readership
		    )
		
			session.add(outletprofile)

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
	
	def _add_employee(self, contactid, contactsource, outlet, outlet_com, xls_sheet, rnum):
		"""add a contact """

		# address
		contact_com = Communication(
#			email= xls_sheet.cell_value(rnum, CONTACT_EMAIL_OLD).strip() if xls_sheet.cell_value(rnum, CONTACT_EMAIL_OLD).strip() else outlet_com.email,
			email=outlet_com.email,
			tel=outlet_com.tel,
			fax=outlet_com.fax,
			webphone="",
#			linkedin= xls_sheet.cell_value(rnum, LINKEDIN_OLD)[:84].strip(),
#			twitter= xls_sheet.cell_value(rnum, TWITTER_OLD)[:84].strip())
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
		elif type(value) is int:
			value = str(value).strip()    
		else:
			value = value.encode('utf8').strip()

		return value

"""	def run_prechecks(self):
		"Runs the check before update"

		files = os.listdir(self._sourcedir)

		for filename in files:
			print filename
			if os.path.isdir(os.path.join(self._sourcedir, filename)) == False:
				read = xlrd.open_workbook(os.path.join(self._sourcedir, filename))
				read_sheet = read.sheet_by_index(0)
				wr = copy(read)
				wr_sheet = wr.get_sheet(0)
				for rnum_read in xrange(1, read_sheet.nrows):
					outletname = read_sheet.cell_value(rnum_read, OUTLETNAMECOLUMN).strip()
					prmax_outlettype = None

					if 'radio' in filename.lower():
						emailcolumn = 11
						wwwcolumn = 10
						address1column = 3
						idcolumn = 12
						phonecolumn = 7
						prmax_outlettypeid = 21
					if 'daily' in filename.lower() or 'weekly' in filename.lower():
						emailcolumn = 9
						wwwcolumn = 8
						address1column = 1
						idcolumn = 10
						phonecolumn = 5
						if 'daily' in filename.lower():
							prmax_outlettypeid = 6
						else:
							prmax_outlettypeid = 10
					if 'tv' in filename.lower():
						emailcolumn = 10
						wwwcolumn = 9
						address1column = 1
						idcolumn = 11
						phonecolumn = 5
						prmax_outlettypeid = 25
					if 'magazine' in filename.lower():
						emailcolumn = 13
						wwwcolumn = 12
						address1column = 1
						idcolumn = 14
						phonecolumn = 5

					email = read_sheet.cell_value(rnum_read, emailcolumn).strip()
					www = read_sheet.cell_value(rnum_read, wwwcolumn).strip()
					phone = str(read_sheet.cell_value(rnum_read, phonecolumn)).strip()
					address1 = read_sheet.cell_value(rnum_read, address1column).strip()
					matchedid = str(read_sheet.cell_value(rnum_read, idcolumn)).strip()

					if 'No match' in matchedid:
						publication = session.query(Outlet).\
							filter(Outlet.sourcetypeid == Constants.Source_Type_Usa).\
							filter(Outlet.outletname.ilike(outletname)).\
							filter(Outlet.frequencyid == 4).all()

						if not publication or len(publication) > 1:
							wr_sheet.write(rnum_read, idcolumn, 'No match')
						if publication and len(publication) == 1:
							wr_sheet.write(rnum_read, idcolumn, publication[0].outletid)
				wr.save(os.path.join(self._sourcedir, 'c9_%s' % filename))"""	