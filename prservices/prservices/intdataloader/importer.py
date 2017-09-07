# -*- coding: utf-8 -*-
"""Importer """
#-----------------------------------------------------------------------------
# Name:        Importer
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     01/05/2013
# Copyright:  (c) 2013
#
#-----------------------------------------------------------------------------
from datetime import datetime
import prcommon.Constants as Constants
from turbogears import database
from turbogears.database import session
from sqlalchemy.sql import text
from ttl.tg.config import read_config
import os
import logging
import getopt
import sys
import csv
import os.path
import types

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model import Countries, Interests, Outlet, Communication, \
     Address, Frequencies, Employee, OutletInterests, PRmaxOutletTypes, \
     Contact, PRMaxRoles, EmployeePrmaxRole, Subject, SubjectInterest, OutletCoverage, \
     Geographical, GeographicalLookup, ResearchControRecord, EmployeeInterests

logging.basicConfig(level = logging.DEBUG )
LOGGER = logging.getLogger("prmax.importrt")
INTERNATIONAL_DATA = 0
USA_DATA = 1

class Columns(object):
	"""Comumns"""

	def __init__(self, datatype = 0):
		"define "
		self._datatype = datatype

	def get_column(self, fieldname):
		"get mammong"

		return Columns.colum_def[fieldname.upper()]

	def get_sep(self):
		"""get set"""

		return "|" if self._datatype == 0 else "|"


	Field_Map = {
	"Contact name": None,
	"Outlet name":"OUTLETNAME",
	"Outlet type":"OUTLETTYPE2",
	"Outlet media type": "OUTLETTYPE",
	"Outlet pitching profile":"OUTLETPROFILE",
	"Outlet fax number" : None,
	"Outlet mobile number": None,
	"Outlet phone number":"OUTLETPHONE",
	"Outlet address line 1":"OUTLETADDRESS1",
	"Outlet address line 2":"OUTLETADDRESS2",
	"Outlet city":"OUTLETCITY",
	"Outlet country":"COUNTRY",
	"Outlet county": None,
	"Outlet state":"OUTLETSTATE",
	"Outlet zip/post code":"OUTLETPOSTCODE",
	"Outlet email":"OUTLETEMAIL",
	"Outlet ID":"OUTLET_UNIQUEID",
	"Outlet subjects":"OUTLETSUBJECTS",
	"Outlet ad rate": None,
	"Outlet working languages": "OUTLETLANGUAGES",
	"Outlet preferred contact method":"PREFEREDCONTACTMETHOD",
	"Outlet website":"OUTLETURL",
	"Outlet news focus": None,
	"Outlet frequency":"OUTLETFREQUENCY",
	"Outlet product type": None,
	"Outlet DMA":"DMA",
	"Contact prefix": "CONTACTTITLE",
	"Employee ID":"EMPLOYEE_UNIQUEID",
	"Contact suffix": None,
	"Contact roles":"ROLES",
	"Contact working languages":"OUTLETLANGUAGES",
	"Contact preferred contact method": None,
	"Contact social profile": None,
	"Contact linkedin handle":"CONTACTLINKEDIN",
	"Contact twitter handle":"CONTACTTWITTER",
	"Contact activity notes": None,
	"Contact pitching profile":"CONTACTPROFILE",
	"Contact fax number": None,
	"Contact mobile number": None,
	"Contact subjects":"CONTACTSUBJECTS",
	"Contact last name":"LASTNAME",
	"Contact first name":"FIRSTNAME",
	"Contact email":"CONTACTEMAIL",
	"Job title":"JOBTITLE",
	"Contact address line 1":"CONTACTADDRESS1",
	"Contact address line 2":"CONTACTADDRESS2",
	"Contact city":"CONTACTCITY",
	"Contact country": None,
	"Contact county": None,
	"Contact state":"CONTACTSTATE",
	"Contact zip/post code":"CONTACTPOSTCODE",
	"Contact phone number": "CONTACTPHONE",
	"Outlet audience": None,
	"Outlet ad rates": None,
	}

	@staticmethod
	def setup_columns(row):
		"setup datatype"
		colum = Columns()

		Columns.SEP = colum.get_sep()

		for org_field in row:
			field = org_field.replace("\xef\xbb\xbf", "")
			if not field:
				continue

			if Columns.Field_Map[field]:
				setattr(Columns, Columns.Field_Map[field], row.index(org_field))

class PRMaxImporter(object):
	""" DO"""

	def __init__(self, sourcefile, offset =None, istest = False, upper_limit=None):
		"""Start"""

		self._istest = istest
		self._sourcefile = sourcefile
		self._offset = offset
		self._upper_limit = upper_limit
		self._countries = {}
		self._interests = {}
		self._frequencies = {}
		self._outlet_done = {}
		self._coverage = {}
		self._exclude_countries = {}

		self._missing_countries = {}
		self._missing_coverage = {}
		self._missing_outlettypes = {}
		self._missing_interests = {}
		self._missing_frequencies = {}

		self._load_translation_matrix()

		#outlet types
		self._outlet_types = {
		  'Freelancer': (42, 19),
		  'Freelancer journalists outlet': (42, 19),
		  'Newspaper - National' : (1, 12),
		  'Newspaper National' : (1, 12),
		  'Newspaper - Regional': (6, 12),
		  'Newspaper Regional': (6, 12),
		  'Supplement/Column': (3, 12),
		  'Supplement Column': (3, 12),
		  'News Agency/Media Service' :  (43, 8) ,
		  'News Agency' :  (43, 8) ,
		  'Television - National' : (25, 16),
		  'TV National' : (25, 16),
		  'Television - Regional': (25, 16),
		  'TV Regional': (25, 16),
		  'Radio - National': (64, 16),
		  'Radio National': (64, 16),
		  'Radio - Regional': (64, 16),
		  'Radio Regional': (64, 16),
		  'Online Media': (45, 12),
		  'Online': (45, 12),
		  'Magazine/Newsletter -  Trade': (13, 12),
		  'Magazine Trade': (13, 12),
		  'Magazine/Newsletter -  Consumer': (15, 12),
		  'Magazine Consumer': (15, 12),
		  'Other': (45, 12),
		  'Weblog': (29, 12),
		  'Magazine/Newsletter - Consumer': (15, 12),
		  'Magazine/Newsletter - Consumer|Magazine/Newsletter - Trade' : (15, 12),
		  'Magazine/Newsletter - Consumer|Magazine/Newsletter - Trade|Online|Supplement/Column' : (30, 12),
		  'Magazine/Newsletter - Consumer|Magazine/Newsletter - Trade|Supplement/Column' :  (15, 12),
		  'Magazine/Newsletter - Consumer|Magazine/Newsletter - Trade|Television, National|Television, Regional' : (13, 12),
		  'Magazine/Newsletter - Consumer|News Agency/Media Service': (43, 8 ),
		  'Magazine/Newsletter - Consumer|Newspaper, National': (1, 12),
		  'Magazine/Newsletter - Consumer|Newspaper, National|Newspaper, Regional': (15, 12),
		  'Magazine/Newsletter - Consumer|Newspaper, National|Supplement/Column': (1, 12),
		  'Magazine/Newsletter - Consumer|Newspaper, Regional': (6, 12),
		  'Magazine/Newsletter - Consumer|Newspaper, Regional|Online': (31, 12),
		  'Magazine/Newsletter - Consumer|Newspaper, Regional|Supplement/Column': (6, 12),
		  'Magazine/Newsletter - Consumer|Online': (31, 12),
		  'Magazine/Newsletter - Consumer|Online|Supplement/Column': (31, 12),
		  'Magazine/Newsletter - Consumer|Supplement/Column': (16, 12),
		  'Magazine/Newsletter - Trade': (13, 12),
		  'Magazine/Newsletter - Trade|News Agency/Media Service': (43, 8),
		  'Magazine/Newsletter - Trade|Newspaper, National':  (6, 12),
		  'Magazine/Newsletter - Trade|Newspaper, National|Newspaper, Regional|Online': (13, 12),
		  'Magazine/Newsletter - Trade|Newspaper, National|Supplement/Column': (1, 12),
		  'Magazine/Newsletter - Trade|Newspaper, Regional': (13, 12),
		  'Magazine/Newsletter - Trade|Online': (30, 12),
		  'Magazine/Newsletter - Trade|Online|Supplement/Column':(30, 12),
		  'Magazine/Newsletter - Trade|Supplement/Column': (14, 12),
		  'News Agency/Media Service|Newspaper, National': (43, 8),
		  'News Agency/Media Service|Online': (43, 8),
		  'Newspaper, National': (1, 12),
		  'Newspaper, National|Newspaper, Regional': dict(sourcecolumn = 12, fields = dict(daily = (6, 12), weekly= (10, 2))),
		  'Newspaper, National|Newspaper, Regional|Online': (6, 12),
		  'Newspaper, National|Newspaper, Regional|Online|Supplement/Column': (10, 2),
		  'Newspaper, National|Newspaper, Regional|Supplement/Column': (6, 12),
		  'Newspaper, National|Online': (29, 12) ,
		  'Newspaper, National|Online|Supplement/Column': (29, 12) ,
		  'Newspaper, National|Supplement/Column': (3, 12),
		  'Newspaper, Regional': (6, 12),
		  'Newspaper, Regional|Online': (29, 12) ,
		  'Newspaper, Regional|Online|Supplement/Column': (10, 2),
		  'Newspaper, Regional|Supplement/Column': (8, 12),
		  'Online|Radio, National': (31, 12),
		  'Online|Radio, Regional': (24, 16),
		  'Online|Supplement/Column': (21, 16),
		  'Online|Television, National': (29, 12),
		  'Online|Television, National|Television, Regional': (25, 16),
		  'Online|Television, Regional': (25, 16),
		  'Radio, National': (64, 16),
		  'Radio, National|Radio, Regional': (21, 16),
		  'Radio, National|Television, National': (24, 16),
		  'Radio, Regional': (21, 16),
		  'Radio, Regional|Television, National': (41, 16),
		  'Radio, Regional|Television, Regional': (21, 16),
		  'Supplement/Column|Television, National': (3, 12),
		  'Television, National': (27, 16),
		  'Television, National|Television, Regional': (25, 16),
		  'Television, Regional': (25, 16),
		  'Newspaper, Regional|Radio, Regional': (6, 12),
		  'News Agency/Media Service|Television, Regional':  (25, 16),
		}

	def get_outlettype_for_row(self, row, offset=0):
		"""return the correct outletype for row"""


		ret_value = self._outlet_types.get(row[Columns.OUTLETTYPE], None)

		if ret_value:
			if type(ret_value) == types.DictionaryType:
				key = row[ret_value["sourcecolumn"]].lower()
				ret_value = ret_value["fields"].get(key, ret_value["fields"].values()[0])
			return ret_value[offset]
		else:
			if row[Columns.OUTLETTYPE2].lower() == "freelancer journalists outlet":
				return self._outlet_types.get("Freelancer", None)

			return None

	def _load_translation_matrix(self):
		"""Load the international data translation"""

		# countries
		for row in session.query(Countries).all():
			tmp =  [row.countryid, row.countryid]
			if row.regioncountryid:
				tmp[0] = row.regioncountryid

			self._countries[row.countryname.lower().encode("utf-8")] = tmp


		self._countries["united states"] = self._countries["united states of america"]
		self._countries["united statesunited states"] = self._countries["united states of america"]
		self._countries["vietnam"] = self._countries["viet nam"]
		self._countries["russia"] = self._countries["russian federation"]
		self._countries["ireland"] = self._countries["republic of ireland"]
		self._countries["são tomé & principe"] = self._countries["sao tome & principe"]
		self._countries["south korea"] = self._countries["republic of korea"]
		self._countries["brunei"] =  self._countries["brunei darussalam"]
		self._countries["antigua"] = self._countries["antigua & barbuda"]
		self._countries["canary islands"] = self._countries["spain"]
		self._countries["cape verde islands"] = self._countries["cape verde"]
		self._countries["democratic republic of congo"] = self._countries["democratic republic of the congo"]
		self._countries["federated states of micronesia"] =  self._countries["micronesia"]
		self._countries["hong kong"] = self._countries["china"]
		self._countries["macau"] = self._countries["china"]
		self._countries["ivory coast"] = self._countries["cote d'ivoire"]
		self._countries["madeira"] = self._countries["portugal"]
		self._countries["moldova"] = self._countries["republic of moldova"]
		self._countries["palestinian authority"] = self._countries["state of palestine"]
		self._countries["republic of congo"] = self._countries["congo"]
		self._countries["republic of sudan"] = self._countries["sudan"]
		self._countries["syria"] = self._countries["syrian arab republic"]
		#self._countries["antigua"] = self._countries["antigua and barbuda"]

		# coverage
		for row in session.query(GeographicalLookup, Geographical).\
		    join(Geographical, Geographical.geographicalid == GeographicalLookup.geographicalid).\
		    filter(GeographicalLookup.geographicallookuptypeid.in_((6, 7))).all():
			self._coverage[row[1].geographicalname.lower()] =  row[0].geographicalid

		# interests
		for row in session.query(Interests).filter(Interests.customerid == -1).all():
			self._interests[row.interestname.lower()] = [row.interestid]

		# now load the translations
		for row in session.query(Subject, SubjectInterest).\
		    join(SubjectInterest, Subject.subjectid == SubjectInterest.subjectid).all():
			if not row[0].subjectname.lower() in self._interests:
				self._interests[row[0].subjectname.lower()] = [row[1].interestid]
			else:
				self._interests[row[0].subjectname.lower()].append(row[1].interestid)


		# frequencies
		for  row in session.query(Frequencies).all():
			self._frequencies[row.frequencyname.lower()] = row.frequencyid

		self._frequencies["more than once a day"] = 4

		# add overrides
		self._frequencies[""] = 4


	def _ignore_row(self, row):
		""" Ignore this row"""

		if row[Columns.FIRSTNAME].lower().strip() == "contact first name" and \
		   row[Columns.OUTLETFREQUENCY].lower().strip() == "outlet frequency":
			return True
		return False

	def verify(self):
		"""Check all """

		print "Verify Run"
		is_missing = False

		# load ignore
		sfolder = """/tmp/prmax"""
		reader = csv.reader(file(os.path.join(sfolder,"subjects.csv")))
		reader.next()
		# load outlets/interests
		_ignore_list = {}
		for row in reader:
			# find outletname in field1
			subjectname = row[0].strip()
			_ignore_list[subjectname.strip('\xc2\xa0')] = True

		for row in self._get_rows():
			if self._ignore_row(row):
				continue

			row = self._fix_up_row( row )

			try:
				# Check outlettype
				outlettype = self.get_outlettype_for_row(row)
				if outlettype == None:
					if row[Columns.OUTLETTYPE] not in self._missing_outlettypes:
						self._missing_outlettypes[row[Columns.OUTLETTYPE]] = True
					is_missing = True

				#Check Subjects
				for subject in row[Columns.OUTLETSUBJECTS].lower().strip().split(Columns.SEP):
					if subject in _ignore_list:
						continue

					if subject and subject not  in self._interests and subject not in self._missing_interests:
						self._missing_interests[subject] = True
						is_missing = True

				for subject in row[Columns.CONTACTSUBJECTS].lower().strip().split(Columns.SEP):
					if subject in _ignore_list:
						continue

					if subject and subject not  in self._interests and subject not in self._missing_interests:
						self._missing_interests[subject] = True
						is_missing = True
				# Check Working_Languages

				# countrys
				country = row[Columns.COUNTRY].lower().strip()
				if country and country not in self._countries:
					if country not in self._missing_countries and  country not in self._missing_countries:
						self._missing_countries[country] =  True
						is_missing = True

				#freqnencies
				frequency = row[Columns.OUTLETFREQUENCY].lower().strip()
				if frequency and frequency not in self._frequencies:
					if frequency not in self._missing_frequencies and  frequency not in self._missing_frequencies:
						self._missing_frequencies[frequency] =  True
						is_missing = True


				#fixup job roles
				job_title = row[Columns.JOBTITLE][:127]
				if not session.query(PRMaxRoles).filter(PRMaxRoles.prmaxrole == job_title).scalar():
					session.begin()
					session.add(PRMaxRoles(prmaxrole = job_title))
					session.commit()

			except:
				LOGGER.exception ( "verify Failure" )
				raise

		if self._missing_countries:
			print "Missing Countries"
			print "\n".join(self._missing_countries.keys())
		if self._missing_outlettypes:
			print "Missing Outlet Types"
			print "\n".join(self._missing_outlettypes.keys())
		if self._missing_interests:
			print "Missing Interests"
			print "\n".join(self._missing_interests.keys())
		if self._missing_frequencies:
			print "Missing Frequencies"
			print "\n".join(self._missing_frequencies.keys())

		return is_missing

	def _get_rows(self):
		"""get rows """
		reader = csv.reader( file(self._sourcefile))
		Columns.setup_columns(reader.next())

		return reader

	def _get_rows_len(self):
		"""Get count of rows"""

		return len([row for row in self._get_rows()])

	def _clean_cell(self, cell):
		"""lean up a cell"""
		if cell.lower() in ("n/a", "."):
			return ""
		return cell

	def _fix_up_row(self, row):
		"Fixup row"

		datarows = [self._clean_cell(element.strip()) for element in row]

		if datarows[Columns.JOBTITLE].find("  ") != -1:
			while datarows[Columns.JOBTITLE].find("  ") != -1:
				datarows[Columns.JOBTITLE] = datarows[Columns.JOBTITLE].replace("  " , " ")

		# cleanup email addresses
		if datarows[Columns.OUTLETEMAIL]:
			datarows[Columns.OUTLETEMAIL] = datarows[Columns.OUTLETEMAIL].split(" ")[0][:79]

		datarows[Columns.LASTNAME] = datarows[Columns.LASTNAME].replace("\\'","'")

		datarows[Columns.OUTLETADDRESS1] = datarows[Columns.OUTLETADDRESS1][:119]
		datarows[Columns.OUTLETADDRESS2] = datarows[Columns.OUTLETADDRESS2][:119]
		datarows[Columns.CONTACTLINKEDIN] = datarows[Columns.CONTACTLINKEDIN][:84]
		datarows[Columns.CONTACTTWITTER] = datarows[Columns.CONTACTTWITTER][:84]
		datarows[Columns.OUTLETURL] = datarows[Columns.OUTLETURL][:119]

		datarows[Columns.OUTLETEMAIL] = datarows[Columns.OUTLETEMAIL].split(' ')[0][:79]
		datarows[Columns.CONTACTEMAIL] = datarows[Columns.CONTACTEMAIL].split(' ')[0][:79]
		if datarows[Columns.OUTLETEMAIL] == datarows[Columns.CONTACTEMAIL]:
			datarows[Columns.CONTACTEMAIL] = ''

		datarows[Columns.OUTLETPOSTCODE] = datarows[Columns.OUTLETPOSTCODE].replace(".0", "")[:20]
		datarows[Columns.CONTACTPOSTCODE] = datarows[Columns.CONTACTPOSTCODE].replace(".0", "")[:20]


		return datarows

	def do_import(self):
		""" Do import for real"""
		self._do_command("Update Outlets 1 of 3",  self._do_outlet_updates)
		self._do_command("Main Pass 2 of 3",  self._do_adds_updates)
		sys.stdout.write("Completed\n")

	def do_delete(self):
		"""Do Delete """
		self._do_deletes()
		sys.stdout.write("Completed\n")

	def _do_command(self, phasename, phase_command):
		"""Do the add record """
		nbrofrows = self._get_rows_len()
		count = 0

		for row in self._get_rows():
			count += 1
			if count % 1000 == 0:
				sys.stdout.write(phasename+"\n")
				sys.stdout.write('\r')
				sys.stdout.flush()
				sys.stdout.write('%.2f%% %d %d ' % ((float(count) / float(nbrofrows)) * 100.00, count, nbrofrows))
				sys.stdout.flush()

			if self._offset and self._offset > count:
				continue

			if self._upper_limit and self._upper_limit < count:
				sys.stdout.write('Upper Limit Reached %d\n' % self._upper_limit)
				return

			if self._ignore_row(row):
				continue

			row = self._fix_up_row(row)

			try:
				# Skip UK titles
				if row[Columns.COUNTRY].lower() in ("united kingdom", "ireland", "switzerland", "germany", "austria", "australia"):
					continue

				session.begin()
				phase_command(row)
				session.commit()

			except:
				LOGGER.exception ( "Process Failure" )
				session.rollback()
				raise

	def _do_adds_updates(self, row):
		"""Do athe adds"""

		employee = session.query(Employee).filter(Employee.sourcekey2 == row[Columns.EMPLOYEE_UNIQUEID]).scalar()
		if not employee:
			if self.get_outlettype_for_row(row) == 42:
				unique_keyid = Columns.EMPLOYEE_UNIQUEID
			else:
				unique_keyid = Columns.OUTLET_UNIQUEID

			# find outlet
			outlet = session.query(Outlet).filter(Outlet.sourcetypeid == 4).\
				filter(Outlet.sourcekey2 == row[unique_keyid]).scalar()
			if not outlet:
				# build a new outlet
				tmp = self._countries.get(row[Columns.COUNTRY].lower(), None)
				if not tmp:
					return

				(countryid, nationid) = tmp

				isprimary = 1
				outletsearchtypeid = PRmaxOutletTypes.query.get ( self.get_outlettype_for_row(row, 1)).outletsearchtypeid

				# add outlet
				address = Address(address1 = row[Columns.OUTLETADDRESS1],
			                    address2 = row[Columns.OUTLETADDRESS2],
			                    county = row[Columns.OUTLETSTATE],
			                    townname = row[Columns.OUTLETCITY],
				                  postcode = row[Columns.OUTLETPOSTCODE][:20],
			                    countryid = countryid if not nationid else nationid,
			                    addresstypeid = Address.editorialAddress)
				session.add(address)
				session.flush()

				com = Communication (addressid = address.addressid,
			                       tel = row[Columns.OUTLETPHONE],
			                       email= row[Columns.OUTLETEMAIL],
			                       fax="",
				                     mobile="",
				                     webphone="",
			                       twitter = "", facebook = "", linkedin = "", instagram = "")
				session.add(com)
				session.flush()

				outlet = Outlet(outletname = row[Columns.OUTLETNAME][:119],
			               sortname = row[Columns.OUTLETNAME].lower()[:119],
			               addressid = address.addressid ,
			               communicationid = com.communicationid,
			               customerid = -1,
			               outlettypeid=Constants.Outlet_Type_Standard,
			               prmax_outlettypeid = self.get_outlettype_for_row(row),
			               frequencyid=self._frequencies[row[Columns.OUTLETFREQUENCY].lower()],
			               profile = row[Columns.OUTLETPROFILE],
			               www = row[Columns.OUTLETURL][:119],
			               statusid = Outlet.Live,
			               outletsearchtypeid = outletsearchtypeid,
			               sourcetypeid = 4,
			               sourcekey2 = row[unique_keyid],
			               countryid = countryid,
				             nationid = nationid)
				session.add(outlet)
				session.flush()
				outletid = outlet.outletid

				# coverage
				geographicalid = self._coverage.get(row[Columns.COUNTRY].lower(), None)
				if  geographicalid:
					# add coverage if possible
					session.add(OutletCoverage(
					  geographicalid = geographicalid,
					  outletid = outletid))


				# control
				control = session.query(ResearchControRecord).filter(ResearchControRecord.objectid == outlet.outletid).scalar()
				if control:
					control.created_date = datetime.today()
					control.updated_date = datetime.today()
					control.last_research_date = datetime.today()

			else:
				isprimary = 0
				outletid = outlet.outletid

			# get primary contact  id
			contactid = None
			if row[Columns.LASTNAME]:
				contact = session.query(Contact).\
			    filter(Contact.familyname == row[Columns.LASTNAME]).\
			    filter(Contact.firstname == row[Columns.FIRSTNAME]).\
			    filter(Contact.sourcetypeid == 4 ).scalar()

				if not contact:
					contact = Contact(
				    familyname = row[Columns.LASTNAME],
				    firstname = row[Columns.FIRSTNAME],
				    sourcetypeid = 4 )

					session.add(contact)
					session.flush()
				contactid = contact.contactid

			email = "" if row[Columns.CONTACTEMAIL] == row[Columns.OUTLETEMAIL] else row[Columns.CONTACTEMAIL]
			contact_com = Communication (
		      email = email ,
		      webphone = "",
			    linkedin = row[Columns.CONTACTLINKEDIN],
			    twitter = row[Columns.CONTACTTWITTER])
			session.add(contact_com)
			session.flush()

			empl = Employee (
		    outletid = outletid ,
		    contactid = contactid,
		    isprimary = isprimary,
		    job_title = row[Columns.JOBTITLE][:127],
		    customerid = -1,
		    communicationid= contact_com.communicationid ,
		    sourcetypeid = 4,
		    sourcekey2 =row[Columns.EMPLOYEE_UNIQUEID])

			session.add(empl)
			session.flush()
			prmaxroles = {}
			# get all the job roles
			for prmaxrole in  row[Columns.ROLES].split(Columns.SEP):
				for roleids in session.execute(text("""SELECT parentprmaxroleid FROM internal.prmaxrolesynonyms AS prs JOIN internal.prmaxroles AS pr ON pr.prmaxroleid = prs.parentprmaxroleid
					WHERE childprmaxroleid = ( SELECT prmaxroleid FROM internal.prmaxroles WHERE prmaxrole = :prmaxrole )  AND pr.visible = true
					UNION SELECT prmaxroleid FROM internal.prmaxroles WHERE prmaxrole = :prmaxrole AND visible = true"""),
				                dict(prmaxrole =prmaxrole.strip()), PRMaxRoles).fetchall():
					prmaxroles[roleids[0]] = roleids[0]
			if prmaxroles.values():
				# add if required
				session.execute(EmployeePrmaxRole.mapping.insert(),
				                [dict (customerid = -1,
				                       employeeid = empl.employeeid,
				                       outletid = outletid,
				                       prmaxroleid = prmaxroleid) for prmaxroleid in prmaxroles.values()])

			# contact subjects
			contactinterests = {}
			exists = {}
			session.flush()
			for interestid in session.query(EmployeeInterests.interestid).filter(EmployeeInterests.employeeid==empl.employeeid).all():
				exists[interestid[0]] = interestid[0]
			for conttactsubject in row[Columns.CONTACTSUBJECTS].lower().split(Columns.SEP):
				if conttactsubject in self._interests:
					for interestid in self._interests[conttactsubject]:
						if interestid not in contactinterests and interestid not in exists:
							contactinterests[interestid] = interestid

			if contactinterests:
				session.execute(EmployeeInterests.mapping.insert(),
				                [dict (customerid = -1,
				                       employeeid = empl.employeeid,
				                       interestid = interestid) for interestid in contactinterests.values()])

			if isprimary:
				outlet.primaryemployeeid = empl.employeeid

				interests = []
				for subject in row[Columns.OUTLETSUBJECTS].lower().split(Columns.SEP):
					for interestid in self._interests.get(subject.strip(), []):
						interests.append(interestid)
				# add interests
				for interestid in list(set(interests)):
					if interestid:
						session.add(OutletInterests(outletid = outlet.outletid,
					                              interestid = interestid ))
			# add languages

		else:
			# already exist is an update
			if employee.job_title != row[Columns.JOBTITLE][:127]:
				employee.job_title = row[Columns.JOBTITLE][:127]
			comm = Communication.query.get(employee.communicationid)
			if comm.email !=  row[Columns.CONTACTEMAIL]:
				comm.email = row[Columns.CONTACTEMAIL]

			outlet = session.query(Outlet).filter(Outlet.sourcetypeid == 4).\
			  filter(Outlet.sourcekey2 == row[Columns.OUTLET_UNIQUEID]).scalar()
			if outlet:
				# now check for changes

				# do interests deletes
				#existing_interests = {}
				#for tmp in session.query(OutletInterests).filter(OutletInterests.outletid == outlet.outletid):
				#	existing_interests[tmp.interestid] =  tmp.outletinterestid

				#new_interests = list(set([self._interests.get(subject.strip(), None) for subject in row[Columns.OUTLETSUBJECTS].lower().split(Columns.SEP)]))
				# do add's
				#new_interests_dict = {}
				to_delete = []
				#for interestid in  new_interests:
				#	new_interests_dict[interestid] = True
				#	if interestid and interestid not in existing_interests:
				#		session.add(OutletInterests(outletid = outlet.outletid,
				#		                            interestid = interestid ))
				# do deletes
				#for (interestid, outletinterestid) in existing_interests.items():
				#	if interestid not in new_interests_dict:
				#		to_delete.append(outletinterestid)

				if to_delete:
					session.query(OutletInterests).filter(OutletInterests.outletinterestid.in_(to_delete)).delete(synchronize_session = "fetch")


	def _do_outlet_updates(self, row):
		"""update outlets"""
		outletid = session.query(Outlet.outletid).filter(Outlet.sourcekey2 == row[Columns.OUTLET_UNIQUEID]).scalar()
		if outletid:
			# already handled
			if outletid in  self._outlet_done:
				return

			self._outlet_done[outletid] = True

			outlet = Outlet.query.get(outletid)
			control = session.query(ResearchControRecord).filter(ResearchControRecord.objectid == outlet.outletid).scalar()
			# main outlet details
			if outlet.outletname != row[Columns.OUTLETNAME]:
				outlet.outletname = row[Columns.OUTLETNAME]
				outlet.sortname = row[Columns.OUTLETNAME].lower()

			if outlet.prmax_outlettypeid != self.get_outlettype_for_row(row):
				outlet.prmax_outlettypeid = self.get_outlettype_for_row(row)

			if outlet.profile != row[Columns.OUTLETPROFILE]:
				outlet.profile = row[Columns.OUTLETPROFILE]

			if outlet.www != row[Columns.OUTLETURL]:
				outlet.www = row[Columns.OUTLETURL]

			frequencyid = self._frequencies[row[Columns.OUTLETFREQUENCY].lower()]
			if frequencyid != outlet.frequencyid:
				outlet.frequencyid = frequencyid

			# types
			if control is None or control.international_override == False :
				# no override so we can setet if requred
				pass

			# communications
			comm = Communication.query.get(outlet.communicationid)
			if comm.tel != row[Columns.OUTLETPHONE]:
				comm.tel = row[Columns.OUTLETPHONE]

			if comm.email != row[Columns.OUTLETEMAIL]:
				comm.email = row[Columns.OUTLETEMAIL]

			# address
			address = Address.query.get(comm.addressid)
			if address.address1 !=  row[Columns.OUTLETADDRESS1]:
				address.address1 = row[Columns.OUTLETADDRESS1]

			if address.address2 !=  row[Columns.OUTLETADDRESS2]:
				address.address2 = row[Columns.OUTLETADDRESS2]

			if address.townname != row[Columns.OUTLETCITY]:
				address.townname = row[Columns.OUTLETCITY]

			if address.county != row[Columns.OUTLETSTATE]:
				address.county = row[Columns.OUTLETSTATE]

			if address.postcode != row[Columns.OUTLETPOSTCODE][:20]:
				address.postcode = row[Columns.OUTLETPOSTCODE][:20]

			# do interests

			new_interests = {}
			old_interests = {}
			for subject in row[Columns.OUTLETSUBJECTS].lower().split(Columns.SEP):
				for interestid in self._interests.get(subject.strip(), []):
					new_interests[interestid] = interestid

			# existing interest
			for interest in session.query(OutletInterests).filter(OutletInterests.outletid == outletid).\
			    filter(OutletInterests.customerid == -1):
				old_interests[interest.interestid] = interest

			# do adds
			for interestid in new_interests.keys():
				if interestid not in old_interests:
					session.add(OutletInterests(
					  outletid = outletid,
					  interestid = interestid ))

			# do delelets
			for interestid in old_interests.keys():
				if interestid not in new_interests:
					session.delete(old_interests[interestid])


			# controls
			if control:
				control.updated_date = datetime.today()
				control.last_research_date = datetime.today()

	def _do_deletes(self):
		"""SO Deletes"""
		sys.stdout.write("Deletion Phase\n")

		sys.stdout.write("Outlets")
		valid_keys = {}
		count = deleted = total_rows = 0
		countries_in_file = {}
		# create dict of all valid id's for outlet/employees
		for sourcefile in ("int.csv", "us.csv"):
			reader = csv.reader( file(os.path.join (self._sourcefile, sourcefile)))
			Columns.setup_columns(reader.next())
			for row in reader:
				total_rows += 1
				valid_keys[row[Columns.OUTLET_UNIQUEID]] = row[Columns.OUTLET_UNIQUEID]
				tmp = self._countries.get(row[Columns.COUNTRY].lower(), None)
				if tmp:
					countries_in_file[tmp[0]] = tmp[0]


		# now we need to get current keys in db for file
		for row in session.query(Outlet.outletid, Outlet.sourcekey2).\
		  filter(Outlet.customerid == -1).\
		  filter(Outlet.sourcetypeid == 4).\
		  filter(Outlet.countryid.in_(countries_in_file.values())).all():
			if row[1] not in valid_keys:
				session.begin()
				session.execute(text("SELECT outlet_delete(outletid) FROM outlets WHERE outletid =:outletid"), dict(outletid = row[0]), Outlet)
				session.commit()
				deleted += 1
				if deleted % 1000 == 0:
					sys.stdout.write('\n%d %d (%d)' % (count, deleted, total_rows))
					sys.stdout.flush()
			count += 1
		sys.stdout.write("\nEmployees")
		sys.stdout.flush()

		valid_keys = {}
		count = deleted = total_rows = 0
		# create dict of all valid id's for outlet/employees
		for sourcefile in ("int.csv", "us.csv"):
			reader = csv.reader( file(os.path.join (self._sourcefile, sourcefile)))
			Columns.setup_columns(reader.next())
			for row in reader:
				total_rows += 1
				valid_keys[row[Columns.EMPLOYEE_UNIQUEID]] = row[Columns.EMPLOYEE_UNIQUEID]
		for row in session.query(Employee.employeeid, Employee.sourcekey2, Outlet.primaryemployeeid, Outlet.outletid ).\
				join(Outlet, Employee.outletid == Outlet.outletid ).\
		    filter(Employee.customerid == -1).\
		    filter(Employee.sourcetypeid == 4).all():
			if row[1] not in valid_keys:
				# check for primary contact
				session.begin()
				if row[0] == row[2]:
					# attempt to find alternative before delete
					contacts = session.query(Employee.employeeid).filter(Employee.outletid == row[3]).filter(Employee.prmaxstatusid == 1 ).all()
					if contacts:
						session.execute(text("UPDATE outlets SET primaryemployeeid = :employeeid WHERE outletid = :outletid"),
						                dict(employeeid = contacts[0][0], outletid =  row[3]), Employee)

				session.execute(text("SELECT employee_research_force_delete(employeeid) FROM employees WHERE employeeid =:employeeid"), dict(employeeid = row[0]), Employee)
				session.commit()
				deleted += 1
				if deleted % 1000 == 0:
					sys.stdout.write('\n%d %d (%d)' % (count, deleted, total_rows))
					sys.stdout.flush()
			count += 1

def _run( ):
	""" run the application """
	#
	options, dummy = getopt.getopt(sys.argv[1:],"" , ["source=", "verify", "test", "datatype=", "offset=", "upper_limit=", "delete"])
	sourcefile = None
	datatype = None
	verify = False
	istest = False
	offset = None
	upper_limit = None
	delete_mode = False

	for option, params in options:
		if option in ("--source",):
			sourcefile = params

		if option in ("--verify", ):
			verify = True

		if option in ("--test", ):
			istest = True

		if option in ("--delete", ):
			delete_mode = True

		if option in ("--datatype"):
			datatype = int(params)

		if option in ("--offset"):
			offset = int(params)

		if option in ("--upper_limit"):
			upper_limit = int(params)


	if sourcefile == None:
		print "Missing Source"
		return

	if datatype == None:
		print "Missing data type"
		return

	ctrl = PRMaxImporter(sourcefile, offset, istest, upper_limit)
	if verify:
		ctrl.verify()
	else:
		if delete_mode:
			ctrl.do_delete()
		else:
			ctrl.do_import()

if __name__ == '__main__':
	print "Starting ", datetime.now()
	_run(  )
	print "Existing ", datetime.now()
