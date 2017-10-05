# -*- coding: utf-8 -*-
""" Import Nijgh Data """
#-----------------------------------------------------------------------------
# Name:        nijgh.py
# Purpose:		 Import Nijgh Data
#
# Author:      Chris Hoy
#
# Created:     14/4/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from types import ListType, DictionaryType

from xml.sax import make_parser
import codecs
import os
import logging
from cStringIO import StringIO
from turbogears.database import session
from sqlalchemy.sql import text
import simplejson

from prcommon.model import Countries, DataSourceTranslations
from prcommon.model.datafeeds.xmlbase import XMLBaseImport, BaseContent
from prcommon.model.outlet import Outlet, OutletInterests, OutletProfile, OutletLanguages
from prcommon.model.employee import Employee, Contact, EmployeePrmaxRole
from prcommon.model.communications import Communication, Address
from prcommon.model.lookups import PRmaxOutletTypes
from prcommon.model.research import DataSourceTranslations
from prcommon.model.research import DataSourceTranslations, CirculationSourceCodes

from prcommon.model.queues import ProcessQueue
import prcommon.Constants as Constants

LOG = logging.getLogger("prmax")

class NijghXmlProcesser(BaseContent):
	"pre load check"
	def __init__(self, _db_interface=None):
		"""prephase"""

		BaseContent.__init__(self, _db_interface)
		self._level = None
		self._parent_level = None

	def startDocument(self):
		pass

	def endDocument(self):
		pass

	def endElement(self, name):

		if name in ("update-file", ):
			return

		self._data = self._data.strip()
		if self._data and self._data[-1] == '\n':
			self._data = self._data[:-1]

		if name == "country" and  not self._parent_level:
			self._data = self._db_interface.do_translation(name, self._data)

		if  name in ("classification", "jobtitle-areainterest", "language", "supplier-code", "deptname-desktype", 
		             "free", "interest-words", "media-type", "organisation-type"):
			self._data = self._db_interface.do_translation(name, self._data)

		datatype = type(self._level.get(name, None))
		if datatype == ListType:
			self._level[name].append(self._data)
		elif datatype != DictionaryType:
			if name in ("classification", "jobtitle-areainterest"):
				if  name not  in  self._level:
					self._level[name] = []
				self._level[name].append(self._data)
			else:
				self._level[name] = self._data
		else:
			self._level[name] = self._data

		if name in ("address", "tel-no", "fax-no", "organisation-details", "contact", "alternate-titles", "memos", "languages", "pr-languages", "coverage", "advertising"):
			self._level = self._parent_level

		if name in  ("publisher", "contacts"):
			self._level = self._publication

		if name == "update-record":
			self._db_interface.do_record_update(self._publication, self._contacts)

		self._data = ""

	def startElement(self, name, attrs):

		level = None

		if name == "update-record":
			self._publication = {}
			self._publication.update(attrs)
			self._contacts = []
			level = self._publication
			self._parent_level = None

		if name == "publication":
			level = self._publication
			level = self._publication.update(attrs)
			self._parent_level = None

		if name in ("contacts", "freelance"):
			contact = {}
			contact.update(attrs)
			self._contacts.append(contact)
			level = contact
			self._parent_level = None

		if name in ("alternate-titles", "memos", "languages", "pr-languages", "coverage", "advertising", "publisher"):
			if name not in self._publication:
				self._publication[name] = []
			level = {}
			self._publication[name].append(level)

		if name in ("contact",):
			self._parent_level = self._level
			self._contacts[-1]["contact"] = {}
			self._level = self._contacts[-1]["contact"]

		if name in ("address", "tel-no", "fax-no", "organisation-details", "direct", "circulation"):
			if name not in self._level:
				level = {}
				self._level[name] = level
			else:
				level = self._level[name]
			self._parent_level = self._level

		if level is not None:
			self._level = level

		if self._level is None and getattr(self, "_publication", None):
			self._level = self._publication

	def characters(self, charac):
		self._data = self._data + charac

class NijghImport(object):
	"""Main Interface """
	def __init__(self, sourcedir, check=False):
		"""Setup"""
		self._sourcedir = sourcedir
		self._check = check

	def do_process(self):
		"""process file"""

		_db_interface = NijghDbImport(self._check)

		files = os.listdir(self._sourcedir)
		for filename in files:
			fullpath = os.path.join(self._sourcedir, filename)
			if os.path.isdir(fullpath) or filename.startswith('.'):
				continue

			print "Processing File", filename

			importer = NijghImportFile(fullpath, _db_interface)

			importer.do_phase()

		if self._check:
			print _db_interface.do_update_translations()
			_db_interface.do_import_completed()

class NijghDbImport(object):
	"NijghDbImport"
	def __init__(self, check=False):
		"""__init__"""
		self._check = check
		self._translations = {}
		self._load_translation()
		self._missing = {}
		self._captured = {}

	def do_record_update(self, publication, contacts):
		"""Handle a record """

		if not self._check:
			session.begin()
			if  publication["command"] in ("Update", "Add"):
				if publication["type"] not in ("Publication", "Organisation", "Freelance"):
					print publication["type"]
				outlet = session.query(Outlet).\
				  filter(Outlet.sourcetypeid == Constants.Source_Type_Nijgh).\
				  filter(Outlet.sourcekey2 == publication["mediaid"]).scalar()
				if outlet:
					# update
					if publication["type"] in ("Publication", "Organisation"):
						self._update_outlet(outlet, publication, contacts)
					if publication["type"] in ("Freelance", ):
						self._update_freelance_outlet(outlet, publication, contacts)
				else:
					# insert
					if publication["type"] in ("Publication", "Organisation"):
						self._add_outlet(publication, contacts)
					if publication["type"] in ("Freelance", ):
						self._add_freelance_outlet(publication, contacts)
			else:
				print publication["command"], publication["type"]

			session.commit()

	def do_import_completed(self):
		"""do_import_completed"""
		if  self._check:
			for key in self._captured:
				print "\n%s\n" % key.upper()
				for value in self._captured[key].keys():
					print value

	def _create_outlet_name(self, publication):
		actual_name = (publication.get("title-prefix", " ") + " " + publication["main-title"])
		actual_name = actual_name.strip()

		return actual_name[:119]


	def _add_outlet(self, publication, contacts):
		""" Add a publication """

		address = Address(
		  address1=publication["address"]["address1"],
		  address2=publication["address"]["address2"],
		  address3=publication["address"]["address3"],
		  county=publication["address"].get("state", ""),
		  townname=publication["address"]["town"],
		  postcode=publication["address"]["postcode"],
		  countryid=publication["country"],
		  addresstypeid=Address.editorialAddress)
		session.add(address)
		session.flush()

		outlet_com = Communication(
		  addressid=address.addressid,
		  tel=self.to_tel_number(publication.get("tel-no", None)),
		  email=publication.get("email-address", ""),
		  fax=self.to_tel_number(publication.get("fax-no", None)),
		  mobile="",
		  webphone="",
		  twitter="",
		  facebook="",
		  instagram="",
		  linkedin="")
		session.add(outlet_com)
		session.flush()


		if publication["media-type"] is None:
			mediatype = 45 #media-type Not Specified
		else:
			mediatype = int(publication.get("media-type", ""))

		outletsearchtypeid = PRmaxOutletTypes.query.get(self.to_outlettype(publication)).outletsearchtypeid


		outlet = Outlet(
		  outletname=self._create_outlet_name(publication),
		  sortname=publication.get("sort-title".lower(), publication["main-title"])[:119],
		  addressid=address.addressid,
		  communicationid=outlet_com.communicationid,
		  customerid=-1,
		  outlettypeid=Constants.Outlet_Type_Standard,
		  prmax_outlettypeid=mediatype,
		  www=publication.get("www-address", "")[:119],
		  statusid=Outlet.Live,
		  outletsearchtypeid=outletsearchtypeid,
		  sourcetypeid=Constants.Source_Type_Nijgh,
		  sourcekey2=publication["mediaid"],
		  countryid=publication["country"],
		  outletpriceid=publication.get('free', 1)
		)
		session.add(outlet)
		session.flush()


		for contactsource in contacts:
			contactid = self._get_contactid(contactsource)
			self._add_employee(contactid, contactsource, outlet, outlet_com)


		if not contacts and not outlet.primaryemployeeid:
			# add dummy employee
			tmp_emp = Employee(outletid=outlet.outletid,
				               job_title="Editor",
				               sourcetypeid=Constants.Source_Type_Nijgh,
				               isprimary=1)
			session.add(tmp_emp)
			session.flush()
			outlet.primaryemployeeid = tmp_emp.employeeid

		classification_code = publication['classification'][0] 
		tranlsations_classifications = self._translations['classification'][classification_code][2]
		if classification_code in self._translations['classification'].keys():
			for interestid in tranlsations_classifications:
				session.add(OutletInterests(
				  outletid=outlet.outletid,
				  interestid=interestid))
	
		# handle circulation
		circulationnotes = ""
		frequencynotes = ""
		circulationsource = ""

		if "circulation" in publication and  isinstance(publication["circulation"], dict):
			try:
				outlet.circulation = int(publication["circulation"].get("circulation-figure", None))
			except:
				pass
						
			if "circulation-source" in publication["circulation"]:
				circulationsource = publication["circulation"].get("circulation-source", None)
				outlet.circulationsourceid = session.query(CirculationSourceCodes.circulationsourceid).\
						filter(CirculationSourceCodes.circulationsourcedescription.ilike(circulationsource)).scalar()
					
			try:
				outlet.circulationauditdateid = int(publication["circulation"].get("circulation-audit-period", None))
			except:
				pass					
			circulationnotes = publication["circulation"].get("circulation-notes", "")

			# handle frequency
			try:
								
				frequency_code = publication["circulation"].get("frequency-type", None)
				tranlsations_frequency = self._translations['frequency-type'][frequency_code][3]
				outlet.frequencyid = int(tranlsations_frequency)
			except:
				outlet.frequencyid = None
			frequencynotes = publication["circulation"].get("frequency-notes", "")
		else:
			outlet.frequencyid = None
			outlet.circulation = None

		# languages
		if "languages" in publication:
			for language in publication["languages"]:
				if language['language']:
					session.add(OutletLanguages(
					  outletid=outlet.outletid,
					  isprefered=1 if language.get('main-language', 'No') == 'Yes' else 0,
					  languageid=language['language']))

		# profile
		editorialprofile = ""
		for memo in publication["memos"]:
			if memo['memo-type'] == 'Profile':
				editorialprofile += memo['memo-text']

		outletprofile = OutletProfile(
		  outletid=outlet.outletid,
		  circulationnotes=circulationnotes,
		  frequencynotes=frequencynotes,
		  editorialprofile=editorialprofile
		)

		session.add(outletprofile)

		session.add(ProcessQueue(
		  objecttypeid=Constants.Process_Outlet_Profile,
		  objectid=outlet.outletid))

	def _add_freelance_outlet(self, publication, contacts):
		""" Add a Freelancer """
		address = Address(
		  address1=publication["address"]["address1"],
		  address2=publication["address"]["address2"],
		  address3=publication["address"]["address3"],
		  county=publication["address"].get("state", ""),
		  townname=publication["address"]["town"],
		  postcode=publication["address"]["postcode"],
		  countryid=publication["country"],
		  addresstypeid=Address.editorialAddress)
		session.add(address)
		session.flush()

		outlet_com = Communication(
		  addressid=address.addressid,
		  tel=self.to_tel_number(publication.get("tel-no", None)),
		  email=publication.get("email-address", ""),
		  fax=self.to_tel_number(publication.get("fax-no", None)),
		  mobile="",
		  webphone="",
		  twitter="",
		  instagram="",
		  facebook="",
		  linkedin="")
		session.add(outlet_com)
		session.flush()

		outletsearchtypeid = PRmaxOutletTypes.query.get(self.to_outlettype(publication)).outletsearchtypeid

		outlet = Outlet(
		  outletname=self._create_outlet_name(publication),
		  sortname=publication.get("sort-title".lower(), publication["main-title"])[:119],
		  addressid=address.addressid,
		  communicationid=outlet_com.communicationid,
		  customerid=-1,
		  outlettypeid=Constants.Outlet_Type_Freelance,
		  prmax_outlettypeid=self.to_outlettype(publication),
		  www=publication.get("www-address", "")[:119],
		  statusid=Outlet.Live,
		  outletsearchtypeid=outletsearchtypeid,
		  sourcetypeid=Constants.Source_Type_Nijgh,
		  sourcekey2=publication["mediaid"],
		  countryid=publication["country"],
		  outletpriceid=publication.get('free', 1)
		)
		session.add(outlet)
		session.flush()

		for contactsource in contacts:
			contactid = self._get_contactid(contactsource)
			self._add_employee(contactid, contactsource, outlet, outlet_com)

		classification_code = publication['classification'][0] 
		tranlsations_classifications = self._translations['classification'][classification_code][2]
		if classification_code in self._translations['classification'].keys():
			for interestid in tranlsations_classifications:
				session.add(OutletInterests(
				  outletid=outlet.outletid,
				  interestid=interestid))
		
			
		# handle circulation
		circulationnotes = ""
		frequencynotes = ""
		circulationsource = ""

		if "circulation" in publication and  isinstance(publication["circulation"], dict):
			try:
				outlet.circulation = int(publication["circulation"].get("circulation-figure", None))
			except:
				pass
						
			if "circulation-source" in publication["circulation"]:
				circulationsource = publication["circulation"].get("circulation-source", None)
				outlet.circulationsourceid = session.query(CirculationSourceCodes.circulationsourceid).\
						filter(CirculationSourceCodes.circulationsourcedescription.ilike(circulationsource)).scalar()
					
			try:
				outlet.circulationauditdateid = int(publication["circulation"].get("circulation-audit-period", None))
			except:
				pass					
			circulationnotes = publication["circulation"].get("circulation-notes", "")

			# handle frequency
			try:
								
				frequency_code = publication["circulation"].get("frequency-type", None)
				tranlsations_frequency = self._translations['frequency-type'][frequency_code][3]
				outlet.frequencyid = int(tranlsations_frequency)
			except:
				outlet.frequencyid = None
			frequencynotes = publication["circulation"].get("frequency-notes", "")
		else:
			outlet.frequencyid = None
			outlet.circulation = None

		# languages
		if "languages" in publication:
			for language in publication["languages"]:
				if language['language']:
					session.add(OutletLanguages(
					  outletid=outlet.outletid,
					  isprefered=1 if language.get('main-language', 'No') == 'Yes' else 0,
					  languageid=language['language']))

		# profile
		editorialprofile = ""
		for memo in publication["memos"]:
			if memo['memo-type'] == 'Profile':
				editorialprofile += memo['memo-text']

		outletprofile = OutletProfile(
		  outletid=outlet.outletid,
		  circulationnotes=circulationnotes,
		  frequencynotes=frequencynotes,
		  editorialprofile=editorialprofile
		)

		session.add(outletprofile)

		session.add(ProcessQueue(
		  objecttypeid=Constants.Process_Outlet_Profile,
		  objectid=outlet.outletid))

	def _update_outlet(self, outlet, publication, contacts):
		""" Update an outlet  """

		outlet_com = Communication.query.get(outlet.communicationid)
		outlet_com.tel = self.to_tel_number(publication.get("tel-no", None))
		outlet_com.email = publication.get("email-address", "")
		outlet_com.fax = self.to_tel_number(publication.get("fax-no", None))

		address = Address.query.get(outlet_com.addressid)
		address.address1 = publication["address"]["address1"]
		address.address2 = publication["address"]["address2"]
		address.address3 = publication["address"]["address3"]
		address.county = publication["address"].get("state", "")
		address.townname = publication["address"]["town"]
		address.postcode = publication["address"]["postcode"]
		address.countryid = publication["country"]

		outletsearchtypeid = PRmaxOutletTypes.query.get(self.to_outlettype(publication)).outletsearchtypeid
		outlet.outletname = self._create_outlet_name(publication)
		outlet.sortname = publication.get("sort-title".lower(), publication["main-title"])[:119]
		outlet.prmax_outlettypeid = self.to_outlettype(publication)
		outlet.www = publication.get("www-address", "")[:119]
		outlet.outletsearchtypeid = outletsearchtypeid
		outlet.countryid = publication["country"]
		outlet.outletpriceid = publication.get('free', 1)

		current_contacts = {}
		new_contacts = {}
		for employee in session.query(Employee).\
		    filter(Employee.outletid == outlet.outletid).\
		    filter(Employee.customerid == -1).all():
			current_contacts[employee.sourcekey2] = employee

		if not contacts:
		# add dummy emplyee
			tmp_emp = Employee(outletid=outlet.outletid,
		                       job_title="No Contact",
		                       sourcetypeid=Constants.Source_Type_Stamm,
		                       isprimary=1)
			session.add(tmp_emp)
			session.flush()
			outlet.primaryemployeeid = tmp_emp.employeeid


		new_interests = {}
		for contactsource in contacts:
			sourcekey2 = "%s:%s:%s" % (publication["mediaid"], contactsource["id"], contactsource["job-role"])
			contactid = self._get_contactid(contactsource)

			employee = session.query(Employee).\
			  filter(Employee.sourcetypeid == Constants.Source_Type_Nijgh).\
			  filter(Employee.sourcekey2 == sourcekey2).scalar()
			if not employee:
				new_contacts[sourcekey2] = self._add_employee(contactid, contactsource, outlet, outlet_com)
			else:
				new_contacts[sourcekey2] = employee.employeeid

				if "direct" in contactsource["contact"]:
					email = contactsource["direct"].get("email-address", "")
					tel = self.to_tel_number(contactsource["direct"].get("tel-no", None))
					fax = self.to_tel_number(contactsource["direct"].get("fax-no", None))
				else:
					email = tel = fax = ""

				if employee.communicationid:
					comms = Communication.query.get(employee.communicationid)
				else:
					comms = Communication(
					  email=email if email != outlet_com.email else "",
					  tel=tel if tel != outlet_com.tel else "",
					  fax=fax if fax != outlet_com.fax else "",
					  webphone="",
					  linkedin="",
					  twitter="")
					session.add(comms)
					session.flush()
				comms.email = email if email != outlet_com.email else ""
				comms.tel = tel if tel != outlet_com.tel else ""
				comms.fax = fax if fax != outlet_com.fax else ""

				employee.contactid = contactid
				job_title = contactsource.get("job-title", "")[:127]
		
				if job_title.startswith('"'):
					job_title = contactsource["job-title"][2:]
				job_code = job_title.lower()
				if job_code in self._translations['job-title'].keys():
					job_title = self._translations['job-title'][job_code][3]
				employee.job_title = job_title

				# chnage job roles
				roles = {}
				for role in session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all():
					roles[role.prmaxroleid] = role

				# do adds
				new_roles = {}
				for prmaxroleid in publication.get("jobtitle-areainterest", []):
					if prmaxroleid:
						new_roles[prmaxroleid] = True
						if prmaxroleid not in roles:
							session.add(EmployeePrmaxRole(
							  employeeid=employee.employeeid,
							  outletid=employee.outletid,
							  prmaxroleid=prmaxroleid))

				# do deletes
				for role in roles.values():
					if role.prmaxroleid not in new_roles:
						session.delete(role)

			# out all other outlet stuff
			# coverage classifications
			interests = {}
			for interest in session.query(OutletInterests).\
			    filter(OutletInterests.outletid == outlet.outletid).\
			    filter(OutletInterests.customerid == -1).all():
				interests[interest.interestid] = interest

			# add new
			if publication['classification'][0] in self._translations['classification'].keys():
				for interestid in self._translations['classification'][publication['classification'][0]][2]:
					if interestid and interestid not in new_interests:
						new_interests[interestid] = True
						if interestid not in interests:
							session.add(OutletInterests(
							  outletid=outlet.outletid,
							  interestid=interestid))

			# do deletes
			for interest in interests.values():
				if interest.interestid not in new_interests:
					session.delete(interest)

			# handle circulation
			circulationnotes = ""
			frequencynotes = ""

			if "circulation" in publication and isinstance(publication["circulation"], dict) == DictionaryType:
				try:
					outlet.circulation = int(publication["circulation"]["circulation-figure"])
				except:
					pass
				outlet.circulationsourceid = publication["circulation"]["circulation-source"]
				outlet.circulationauditdateid = publication["circulation"]["circulation-audit-period"]
				circulationnotes = publication["circulation"]["circulation-notes"]

				# handle frequency
				try:
					outlet.frequencyid = int(publication["circulation"]["frequency-type"])
				except:
					outlet.frequencyid = None
				frequencynotes = publication["circulation"]["frequency-notes"]
			else:
				outlet.circulation = None
				outlet.frequencyid = None


			# languages
			current_languages = {}
			for language in session.query(OutletLanguages).filter(OutletLanguages.outletid == outlet.outletid).all():
				current_languages[language.languageid] = language

			new_languages = {}
			if "languages"in publication:
				for language in publication["languages"]:
					if language['language']:
						new_languages[language['language']] = True
						if language['language'] not in current_languages:
							session.add(OutletLanguages(
							  outletid=outlet.outletid,
							  isprefered=1 if language.get('main-language', 'No') == 'Yes' else 0,
							  languageid=language['language']))

			for language in current_languages.values():
				if language.languageid not  in new_languages:
					session.delete(language)

			# profile
			editorialprofile = ""
			for memo in publication["memos"]:
				if memo['memo-type'] == 'Profile':
					editorialprofile += memo['memo-text']

			outletprofile = OutletProfile.query.get(outlet.outletid)
			outletprofile.circulationnotes = circulationnotes
			outletprofile.frequencynotes = frequencynotes
			outletprofile.editorialprofile = editorialprofile

			session.add(ProcessQueue(
				objecttypeid=Constants.Process_Outlet_Profile,
				objectid=outlet.outletid))
		# do deletes
		for employee in current_contacts.values():
			if not new_contacts:
				session.execute(text("UPDATE outlets SET primaryemployeeid = :employeeid WHERE outletid = :outletid"),
						        dict(employeeid=tmp_emp.employeeid, outletid=outlet.outletid), Employee)					
				session.execute(text("SELECT employee_research_force_delete(employeeid) FROM employees WHERE employeeid =:employeeid"), dict(employeeid=employee.employeeid), Employee)
			elif new_contacts and employee.sourcekey2 not in new_contacts:			
				if employee.employeeid == outlet.primaryemployeeid:
					# we need to find a replacement here
					session.execute(text("UPDATE outlets SET primaryemployeeid = :employeeid WHERE outletid = :outletid"),
					                dict(employeeid=new_contacts.values()[0], outletid=outlet.outletid), Employee)

					session.execute(text("SELECT employee_research_force_delete(employeeid) FROM employees WHERE employeeid =:employeeid"), dict(employeeid=employee.employeeid), Employee)

	def to_outlettype(self, publication):
		"""return type"""

		command = "media-type"
		if  publication["type"] == "Organisation":
			command = "organisation-type"

		trans = self.do_translation(command, publication[command], True)
		if not trans:
			return 1

		if  trans[0]:
			return int(trans[0])
		else:
			return trans[1](publication)

	def to_tel_number(self, phone):
		"""build a phone number"""

		number = ""
		if phone:
			for element in ('dialling-info', 'area-code', 'local-number'):
				number += phone.get(element, "")

		return number

	def _load_translation(self):
		"""Load translation matrix"""

		self._translations['country'] = {}
		for row in session.query(Countries).all():
			self._translations['country'][row.countryname.lower()] = (row.countryid, None)
		self._translations['country']["26"] = (107, None)
		self._translations['country']["5"] = (122, None)

		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Nijgh).all():
			extra = []
			if row.translation or row.extended_function:
				translation = row.translation

				extended_function = row.extended_function
				english = row.english
				if row.extended_function:
					extended_function = getattr(self, extended_function)
				if row.fieldname.strip() not in self._translations:
					self._translations[row.fieldname.strip()] = {}
				if row.extended_translation:
					extra = simplejson.loads(row.extended_translation)
				if row.fieldname.strip() == "classification":
					translation = row.translation
				if row.fieldname.strip() == "frequency-type":
					translation = row.sourcetext
				self._translations[row.fieldname.strip()][row.sourcetext.lower().strip()] = (translation, extended_function, extra, english)


	def do_translation(self, typeid, indata, extended=False):
		"do translation "

		if not indata:
			return

		indata = indata.lower()

		transtables = self._translations.get(typeid, None)
		if transtables:
			result = self._translations[typeid].get(indata, None)
		else:
			result = None

		if not result and self._check:
			if  typeid not in self._missing:
				self._missing[typeid] = {}

			self._missing[typeid][indata] = True

		if self._check and  typeid in  ("country", ):
			if typeid not in  self._captured:
				self._captured[typeid] = {}
			if  indata not  in self._captured[typeid]:
				self._captured[typeid][indata] = True

		if extended:
			return result
		else:
			return result if not result else result[0]

	def do_update_translations(self):
		"""Do Update"""
		inserts = []
		for fieldname in self._missing:
			for sourcetext in self._missing[fieldname]:
				inserts.append({"fieldname": fieldname,
				                "sourcetext": sourcetext,
				                "sourcetypeid" : 6,}
				               )

		session.begin()
		session.execute(DataSourceTranslations.mapping.insert(), inserts)
		session.commit()


	def _get_contactid(self, contact):
		"""get the contact id """

		if not contact["contact"]["surname"]:
			return None

		contact_record = session.query(Contact).\
			filter(Contact.familyname == contact["contact"]["surname"]).\
			filter(Contact.firstname == contact["contact"]["first-name"]).\
			filter(Contact.sourcetypeid == Constants.Source_Type_Nijgh).scalar()
		if contact_record:
			return contact_record.contactid

		if contact["contact"]["surname"]:
			contact_record = Contact(
				familyname=contact["contact"]["surname"],
				firstname=contact["contact"]["first-name"],
				prefix=contact["contact"]["title"],
				sourcetypeid=Constants.Source_Type_Nijgh)
			session.add(contact_record)
			session.flush()
			return contact_record.contactid
		return None

	def _add_employee(self, contactid, contactsource, outlet, outlet_com):
		"""add a contact """

		if not contactsource.get("job-title", ""):
			return

		if contactsource["job-title"].startswith('"'):
			contactsource["job-title"] = contactsource["job-title"][2:]

		job_code = contactsource['job-title'].lower() #translation field should be the same as sourcetext e.g O353
		#tranlsations_jobs = self._translations['job-title'][job_code][2]
		if job_code in self._translations['job-title'].keys():
				contactsource["job-title"] = self._translations['job-title'][job_code][3]


		#ingore employee if already exists the same contact with job-role
		if not contactsource["job-role"] or contactsource["job-role"] == '':
				employee_sourcekey2 = "%s:%s:%s" % (outlet.sourcekey2, contactsource["id"], "%")
				if session.query(Employee).\
				   filter(Employee.sourcetypeid == Constants.Source_Type_Nijgh).\
				   filter(Employee.sourcekey2.ilike(employee_sourcekey2)).first():
						return

		#Ingore employees with same mediaid, contactid and job-role. Import only one of them.
		if session.query(Employee).\
		   filter(Employee.sourcetypeid == Constants.Source_Type_Nijgh).\
		   filter(Employee.sourcekey2 == "%s:%s:%s" % (outlet.sourcekey2, contactsource["id"], contactsource["job-role"])).scalar():
				return

		if "direct" in contactsource:
			email = contactsource["direct"].get("email-address", "")
			tel = self.to_tel_number(contactsource["direct"].get("tel-no", None))
			fax = self.to_tel_number(contactsource["direct"].get("fax-no", None))
		else:
			email = tel = fax = ""

		# address ?
		contact_com = Communication(
			email=email if email != outlet_com.email else "",
			tel=tel if tel != outlet_com.tel else "",
			fax=fax if fax != outlet_com.fax else "",
			webphone="",
			linkedin="",
			twitter="")
		session.add(contact_com)
		session.flush()

		employee = Employee(
			outletid=outlet.outletid,
			contactid=contactid,
			job_title=contactsource.get("job-title", "")[:127],
			customerid=-1,
			communicationid=contact_com.communicationid,
			sourcetypeid=Constants.Source_Type_Nijgh,
			sourcekey2="%s:%s:%s" % (outlet.sourcekey2, contactsource["id"], contactsource["job-role"]))

		session.add(employee)
		session.flush()

		if not outlet.primaryemployeeid:
			outlet.primaryemployeeid = employee.employeeid

		# add job roles
		for prmaxroleid in contactsource.get("jobtitle-areainterest", []):
			if prmaxroleid:
				session.add(EmployeePrmaxRole(
					employeeid=employee.employeeid,
					outletid=employee.outletid,
					prmaxroleid=prmaxroleid))

		return employee.employeeid

class NijghImportFile(XMLBaseImport):
	"""Basic framework for importing 3rdpart data from waymaker xml"""
	def __init__(self, filename, _db_interface):
		"init"
		XMLBaseImport.__init__(self, filename)

		self._parse_handler = NijghXmlProcesser(_db_interface)

	def _parse_xml(self, parse_handler):
		"""Start the parse"""

		parser = make_parser()

		parser.setContentHandler(parse_handler)
		with codecs.open(self._sourcefile, encoding="ISO-8859-1", errors='ignore') as infile:
			tmp = infile.read().replace(u'<!DOCTYPE update-file SYSTEM "wayxml.dtd">', u"")
			parser.parse(StringIO(tmp.encode("ISO-8859-1")))

	def do_phase(self):
		"""Do all the verifications"""

		self._parse_xml(self._parse_handler)

