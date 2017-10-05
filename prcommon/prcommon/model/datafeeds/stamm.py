# -*- coding: utf-8 -*-
""" Import Stamm Data """
#-----------------------------------------------------------------------------
# Name:        stamm.py
# Purpose:		 Import Stamm Data
#
# Author:      Chris Hoy
#
# Created:     14/4/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy.sql import text
from sqlalchemy import or_
from xml.sax import make_parser
import codecs
import os
import logging
from cStringIO import StringIO
LOG = logging.getLogger("prmax")
from types import ListType, DictionaryType
import simplejson

from prcommon.model import Countries, DataSourceTranslations
from prcommon.model.datafeeds.xmlbase import XMLBaseImport, BaseContent
from prcommon.model.outlet import Outlet, OutletInterests, OutletProfile, OutletLanguages
from prcommon.model.employee import Employee, Contact, EmployeePrmaxRole, EmployeeInterests
from prcommon.model.communications import Communication, Address
from prcommon.model.lookups import PRmaxOutletTypes
from prcommon.model.research import DataSourceTranslations
from prcommon.model.queues import ProcessQueue
from prcommon.model.publisher import Publisher

import prcommon.Constants as Constants

class StammXmlProcesser(BaseContent):
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

		if  name in ("language", "frequency-type", "deptname-desktype",
		             "circulation-source", "circulation-audit-period", "free", "interest-words", "media-type", "organisation-type"):
			self._data = self._db_interface.do_translation(name, self._data)

		datatype = type(self._level.get(name, None))
		if datatype == ListType:
			self._level[name].append(self._data)
		elif datatype != DictionaryType:
			if name in ("classification", "jobtitle-areainterest"):
				if  name not  in  self._level:
					self._level[name] = []
				if isinstance(self._data, ListType):
					self._level[name].extend(self._data)
				else:
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

		if name in ("address", "tel-no", "fax-no", "organisation-details"):
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

class StammImport(object):
	"""Main Interface """
	def __init__(self, sourcedir, check=False):
		"""Setup"""
		self._sourcedir = sourcedir
		self._check = check

	def do_process(self):
		"""process file"""

		_db_interface = StammDbImport(self._check)

		files = os.listdir(self._sourcedir)
		for filename in files:
			fullpath = os.path.join(self._sourcedir, filename)
			if os.path.isdir(fullpath) or filename.startswith('.'):
				continue

			print "Processing File", filename

			importer = StammImportFile(fullpath, _db_interface)

			importer.do_phase()

		if self._check:
			print _db_interface.do_update_translations()
			_db_interface.do_import_completed()



class StammDbImport(object):
	"StammDbImport"
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
			if  publication["command"] in ("Change", "Add"):
				if publication["type"] not in ("Publication", "Organisation", "Freelance"):
					print publication["type"]
				outlet = session.query(Outlet).\
				  filter(Outlet.sourcetypeid == Constants.Source_Type_Stamm).\
				  filter(Outlet.sourcekey == publication["mediaid"]).scalar()
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
		  county=publication["address"]["state"],
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

		outlettypeid = self.to_outlettype(publication)
		outletsearchtypeid = PRmaxOutletTypes.query.get(outlettypeid).outletsearchtypeid


		outlet = Outlet(
		  outletname=self._create_outlet_name(publication),
		  sortname=publication["sort-title"].lower()[:119],
		  addressid=address.addressid,
		  communicationid=outlet_com.communicationid,
		  customerid=-1,
		  outlettypeid=Constants.Outlet_Type_Standard,
		  prmax_outlettypeid=outlettypeid,
		  www=publication.get("www-address", "")[:119],
		  statusid=Outlet.Live,
		  outletsearchtypeid=outletsearchtypeid,
		  sourcetypeid=Constants.Source_Type_Stamm,
		  sourcekey=publication["mediaid"],
		  countryid=publication["country"],
		  outletpriceid=publication.get('free', 1),
		  publisherid=self._get_publisher(publication)
		)
		session.add(outlet)
		session.flush()

		for contactsource in contacts:
			contactid = self._get_contactid(contactsource)
			self._add_employee(contactid, contactsource, outlet, outlet_com)

		if not contacts and not outlet.primaryemployeeid:
			# add dummy emplyee
			tmp_emp = Employee(outletid=outlet.outletid,
			                   job_title="No Contact",
			                   sourcetypeid=Constants.Source_Type_Stamm,
			                   isprimary=1)
			session.add(tmp_emp)
			session.flush()
			outlet.primaryemployeeid = tmp_emp.employeeid

		# out all other outlet stuff
		# coverage "interest-words"
		interests_done = {}
		for interestid in self._get_interest_outlet(publication):
			if interestid and interestid not in interests_done:
				interests_done[interestid] = True
				session.add(OutletInterests(
				  outletid=outlet.outletid,
				  interestid=interestid))

		# handle circulation
		circulationnotes = ""
		frequencynotes = ""

		try:
			outlet.circulation = int(publication["circulation-figure"])
		except:
			outlet.circulation = None

		outlet.circulationsourceid = publication.get("circulation-source", None)
		outlet.circulationauditdateid = publication.get("circulation-audit-period", None)
		circulationnotes = publication.get("circulation-notes", "")

			# handle frequency
		try:
			outlet.frequencyid = int(publication["frequency-type"])
		except:
			outlet.frequencyid = None
		frequencynotes = publication.get("frequency-notes", None)

		# languages
		if "languages" in publication:
			done_lan = {}
			for language in publication["languages"]:
				if language['language'] and language['language'] not in done_lan:
					done_lan[language['language']] = True
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
		  county=publication["address"]["state"],
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

		outlettypeid = self.to_outlettype(publication)
		outletsearchtypeid = PRmaxOutletTypes.query.get(outlettypeid).outletsearchtypeid

		outlet = Outlet(
		  outletname=self._create_outlet_name(publication),
		  sortname=publication["sort-title"].lower()[:119],
		  addressid=address.addressid,
		  communicationid=outlet_com.communicationid,
		  customerid=-1,
		  outlettypeid=Constants.Outlet_Type_Freelance,
		  prmax_outlettypeid=outlettypeid,
		  www=publication.get("www-address", "")[:119],
		  statusid=Outlet.Live,
		  outletsearchtypeid=outletsearchtypeid,
		  sourcetypeid=Constants.Source_Type_Stamm,
		  sourcekey=publication["mediaid"],
		  countryid=publication["country"],
		  outletpriceid=publication.get('free', 1)
		)
		session.add(outlet)
		session.flush()

		for contactsource in contacts:
			contactid = self._get_contactid(contactsource)
			self._add_employee(contactid, contactsource, outlet, outlet_com)

		# out all other outlet stuff
		# coverage classifications
		for interestid in self._get_interest_outlet(publication):
			if interestid:
				session.add(OutletInterests(
				  outletid=outlet.outletid,
				  interestid=interestid))

		# handle circulation

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
		  circulationnotes="",
		  frequencynotes="",
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
		outlet_com.publisherid = self._get_publisher(publication)

		address = Address.query.get(outlet_com.addressid)
		address.address1 = publication["address"]["address1"]
		address.address2 = publication["address"]["address2"]
		address.address3 = publication["address"]["address3"]
		address.county = publication["address"]["state"]
		address.townname = publication["address"]["town"]
		address.postcode = publication["address"]["postcode"]
		address.countryid = publication["country"]

		outlettypeid = self.to_outlettype(publication)
		outletsearchtypeid = PRmaxOutletTypes.query.get(outlettypeid).outletsearchtypeid
		outlet.outletname = self._create_outlet_name(publication)
		outlet.sortname = publication["sort-title"].lower()[:119]
		outlet.prmax_outlettypeid = outlettypeid
		outlet.www = publication.get("www-address", "")[:119]
		outlet.outletsearchtypeid = outletsearchtypeid
		outlet.countryid = publication["country"]
		outlet.outletpriceid = publication.get('free', 1)

		current_contacts = {}
		new_contacts = {}
		for employee in session.query(Employee).\
		    filter(Employee.outletid == outlet.outletid).\
		    filter(Employee.customerid == -1).all():
			if employee.job_title == "No Contact" and employee.contactid is None:
				continue
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

		for contactsource in contacts:
			sourcekey2 = "%s:%s" % (publication["mediaid"], contactsource["id"])
			contactid = self._get_contactid(contactsource)

			employee = session.query(Employee).\
			  filter(Employee.sourcetypeid == Constants.Source_Type_Stamm).\
			  filter(Employee.sourcekey2 == sourcekey2).scalar()
			if not employee:
				new_contacts[sourcekey2] = self._add_employee(contactid, contactsource, outlet, outlet_com)
			else:
				new_contacts[sourcekey2] = employee.employeeid

				email = contactsource.get("email-address", "")
				tel = self.to_tel_number(contactsource.get("tel-no", ""))
				fax = self.to_tel_number(contactsource.get("fax-no", ""))

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
				employee.job_title = contactsource.get("job-title", "")[:127]

				# chnage job roles
				roles = {}
				rolekeywords = {}
				for role in session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all():
					roles[role.prmaxroleid] = role
				for rolekeyword in session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == employee.employeeid).all():
					rolekeywords[rolekeyword.interestid] = rolekeyword

				# add roles
				new_roles = {}
				new_keywords = {}
				for prmaxroleid in contactsource.get("jobtitle-areainterest", []):
					if prmaxroleid:
						trans = self.do_translation("jobtitle-areainterest", str(prmaxroleid), True)
						if trans and trans[0]:
							new_roles[trans[0][0]] = True
							for i in range(0, len(trans[2])):
								new_keywords[trans[2][i]] = True
							if 	trans[0][0] not in roles:
								session.add(EmployeePrmaxRole(
									employeeid=employee.employeeid,
									outletid=employee.outletid,
									prmaxroleid=trans[0][0]))
								session.flush()
							
				
				# add role keywords
				keywords_done = {}
				for interestid in self._get_keywords_jobroles(contactsource):
					keyword_exists = session.query(EmployeeInterests).\
						filter(EmployeeInterests.employeeid == employee.employeeid).\
						filter(EmployeeInterests.outletid == employee.outletid).\
						filter(EmployeeInterests.customerid == employee.customerid).\
						filter(EmployeeInterests.interestid == interestid).all()
					if keyword_exists:
						keywords_done[interestid] = True					
					if interestid and interestid not in keywords_done and interestid not in rolekeywords:
						keywords_done[interestid] = True
						session.add(EmployeeInterests(
					        employeeid=employee.employeeid,
					        outletid=outlet.outletid,
					        interestid=interestid,
					        customerid=employee.customerid,
					        interesttypeid = Constants.Interest_Type_Standard))
						session.flush()
						
				# do deletes
				for role in roles.values():
					if role.prmaxroleid not in new_roles:
						session.delete(role)
						session.flush()
						
				#delete role interests
				for rolekeyword in rolekeywords.values():
					if rolekeyword.interestid not in new_keywords:
						session.delete(rolekeyword)
						session.flush()
				
			# out all other outlet stuff
			# coverage classifications
			interests = {}
			new_interests = {}
			for interest in session.query(OutletInterests).\
			    filter(OutletInterests.outletid == outlet.outletid).\
			    filter(OutletInterests.customerid == -1).all():
				interests[interest.interestid] = interest

			# add new
			for interestid in self._get_interest_outlet(publication):
				if interestid:
					if interestid not in interests and interestid not in new_interests:
						session.add(OutletInterests(
						  outletid=outlet.outletid,
						  interestid=interestid))
						session.flush()
					new_interests[interestid] = interestid
			# do deletes
			for interest in interests.values():
				if interest.interestid not in new_interests:
					session.delete(interest)

			# handle circulation
			circulationnotes = ""
			frequencynotes = ""

			try:
				outlet.circulation = int(publication["circulation-figure"])
			except:
				pass
			outlet.circulationsourceid = publication.get("circulation-source", None)
			outlet.circulationauditdateid = publication.get("circulation-audit-period", None)
			circulationnotes = publication.get("circulation-notes", "")

			# handle frequency
			try:
				outlet.frequencyid = int(publication.get("frequency-type", None))
			except:
				outlet.frequencyid = None
			frequencynotes = publication.get("frequency-notes", "")

			# languages
			current_languages = {}
			for language in session.query(OutletLanguages).filter(OutletLanguages.outletid == outlet.outletid).all():
				current_languages[language.languageid] = language

			new_languages = {}
			if "languages"in publication:
				done_lan = {}
				for language in publication["languages"]:
					if language['language']:
						languageid = int(language['language'])
						new_languages[languageid] = True
						if languageid not in current_languages and language["language"] not in done_lan:
							done_lan[language['language']] = True
							session.add(OutletLanguages(
							  outletid=outlet.outletid,
							  isprefered=1 if language.get('main-language', 'No') == 'Yes' else 0,
							  languageid=languageid))

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

	def _get_publisher(self, publication):
		"Get create publisher"

		publisherid = None

		if "publisher" in publication:
			publishersource = publication["publisher"][0]['organisation-details']
			publishername = (publishersource.get("title-prefix", " ") + " " + publishersource["main-title"]).strip()

			sourcekey = publishersource['org-ref'].strip()
			publisher = session.query(Publisher).\
		        filter(Publisher.publishername == publishername).\
		        filter(Publisher.sourcetypeid == Constants.Source_Type_Stamm).scalar()
			
#			if len(publisher) > 1:
#				for pub in publisher:
#					if pub.sourcekey == sourcekey:
#						publisher = pub
#				
#			    filter(or_(Publisher.publishername.ilike(publishername), Publisher.sourcekey == sourcekey)).\

			if publisher:
				publisher.publishername = publishername
				publisherid = publisher.publisherid
				publisher.www = publishersource.get("www-address", "")
			else:
				# need to check to see if name exists?
				publisher = session.query(Publisher).\
				  filter(Publisher.publishername == publishername).scalar()
				if publisher:
					publisherid = publisher.publisherid
				else:
					publisherrecord = Publisher(publishername=publishername,
					                            www=publishersource.get("www-address", ""),
					                            countryid=publication["country"],
					                            sourcetypeid=Constants.Source_Type_Stamm,
					                            sourcekey=sourcekey)
					session.add(publisherrecord)
					session.flush()
					publisherid = publisherrecord.publisherid

		return publisherid


	def to_outlettype(self, publication):
		"""return type"""

		data = publication.get("classification", [])
		if isinstance(data, ListType):
			data = data[0]

		trans = self.do_translation("classification", data, True)
		if not trans:
			return 1

		if  trans[0]:
			return int(trans[0])
		else:
			return trans[1](publication)

	def _get_interest_outlet(self, publication):
		"GEt interests"
		interests = []

		for classification in publication.get("classification", []):
			trans = self.do_translation("classification", classification, True)
			if trans and trans[2]:
				interests.extend(trans[2])

		return [int(interestid) for interestid in interests]

	def _get_keywords_jobroles(self, contactsource):
		"GEt interests"
		interests = []

		for jobrole in contactsource.get("jobtitle-areainterest", []):
			trans = self.do_translation("jobtitle-areainterest", str(jobrole), True)
			if trans and trans[2]:
				interests.extend(trans[2])

		return [int(interestid) for interestid in interests]



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
			self._translations['country'][row.countryname.lower()] = (row.countryid, None, [])

		self._translations['free'] = {'yes': (3, None, []), 'no': (2, None, []),}

		for row in session.query(DataSourceTranslations).\
		    filter(DataSourceTranslations.sourcetypeid == Constants.Source_Type_Stamm).all():
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
				if row.fieldname.strip() == "jobtitle-areainterest":
					translation = simplejson.loads(row.translation)
				self._translations[row.fieldname.strip()][row.sourcetext.lower().strip()] = (translation, extended_function, extra)

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
				                "sourcetypeid" : Constants.Source_Type_Stamm,}
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
			filter(Contact.sourcetypeid == Constants.Source_Type_Stamm).scalar()
		if contact_record:
			return contact_record.contactid

		if contact["contact"]["surname"]:
			contact_record = Contact(
				familyname=contact["contact"]["surname"],
				firstname=contact["contact"]["first-name"],
				prefix=contact["contact"]["title"],
				sourcetypeid=Constants.Source_Type_Stamm)
			session.add(contact_record)
			session.flush()
			return contact_record.contactid
		return None

	def _add_employee(self, contactid, contactsource, outlet, outlet_com):
		"""add a contact """

		email = contactsource.get("email-address", "")
		tel = self.to_tel_number(contactsource.get("tel-no", None))
		fax = self.to_tel_number(contactsource.get("fax-no", None))

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
			sourcetypeid=Constants.Source_Type_Stamm,
			sourcekey2="%s:%s" % (outlet.sourcekey, contactsource["id"]))

		session.add(employee)
		session.flush()

		if not outlet.primaryemployeeid:
			outlet.primaryemployeeid = employee.employeeid

		# add job roles
		for prmaxroleid in contactsource.get("jobtitle-areainterest", []):
			if prmaxroleid:
				trans = self.do_translation("jobtitle-areainterest", str(prmaxroleid), True)
				if trans and trans[0]:
					session.add(EmployeePrmaxRole(
						employeeid=employee.employeeid,
						outletid=employee.outletid,
						prmaxroleid=trans[0][0]))
					session.flush()
					
		# add keywords for job roles
		keywords_done = {}
		for interestid in self._get_keywords_jobroles(contactsource):
			keyword_exists = session.query(EmployeeInterests).\
			    filter(EmployeeInterests.employeeid == employee.employeeid).\
			    filter(EmployeeInterests.outletid == employee.outletid).\
			    filter(EmployeeInterests.customerid == employee.customerid).\
			    filter(EmployeeInterests.interestid == interestid).all()
			if keyword_exists:
				keywords_done[interestid] = True
			if interestid and interestid not in keywords_done:
				keywords_done[interestid] = True
				session.add(EmployeeInterests(
				    employeeid=employee.employeeid,
				    outletid=outlet.outletid,
				    interestid=interestid,
				    customerid=employee.customerid,
				    interesttypeid = Constants.Interest_Type_Standard))
				session.flush()
				
		return employee.employeeid
			
			
class StammImportFile(XMLBaseImport):
	"""Basic framework for importing 3rdpart data from waymaker xml"""
	def __init__(self, filename, _db_interface):
		"init"
		XMLBaseImport.__init__(self, filename)

		self._parse_handler = StammXmlProcesser(_db_interface)

	def _parse_xml(self, parse_handler):
		"""Start the parse"""

		parser = make_parser()

		parser.setContentHandler(parse_handler)
		with codecs.open(self._sourcefile, encoding="utf-8", errors='ignore') as infile:
			tmp = infile.read().replace(u'<!DOCTYPE update-file SYSTEM "wayXML.dtd">', u"")
			tmp = tmp.replace(u"\x95 ", u"").replace(u"\x1f", u"").replace(u"\x1c", u"").replace(u'\x01', u'').replace(u'\x1d', u'')
			parser.parse(StringIO(tmp.encode("utf-8")))

	def do_phase(self):
		"""Do all the verifications"""

		self._parse_xml(self._parse_handler)

