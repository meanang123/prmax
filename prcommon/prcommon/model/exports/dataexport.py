# -*- coding: utf-8 -*-
"""DataExport """
#-----------------------------------------------------------------------------
# Name:        DataExport.py
# Purpose:		 Export Data to a file for a feed to another supplier
#								This is the base function and can be run from command line or other type
# Author:      Chris Hoy
#
# Created:    27/02/2014
# Copyright:   (c) 2014

#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy import text
import codecs
from prcommon.model.interests import Interests, InterestGroups
from prcommon.model.lookups import PRmaxOutletTypes, Countries, Frequencies, OutletPrices
from prcommon.model.circulationdates import CirculationDates
from prcommon.model.circulationsources import CirculationSources
from prcommon.model.interests import EmployeeInterestView
from prcommon.model.publisher import Publisher
from prcommon.model.outlet import Outlet, OutletCoverageView, OutletInterestView
from prcommon.model.outletprofile import OutletProfile
from prcommon.model.communications import Communication, Address
from prcommon.model.employee import Employee
from prcommon.model.contact import Contact
from prcommon.model.geographical import GeographicalLookupView, GeographicalTree
from xml.etree.ElementTree import Element, SubElement, Comment, ElementTree
from datetime import date
import zipfile
import os
from types import TupleType, ListType, StringType, UnicodeType
import gc
import platform

if platform.system() in ('Microsoft', "Windows"):
	COMMANDFILE = r'\Projects\tg15env\Scripts\python \Projects\prmax\development\prservices\prservices\prexport\prexporter.py --countryid=%d --outdir=%s'
else:
	COMMANDFILE = 'python2.7 /usr/local/lib/python2.7/dist-packages/prservices-1.0.0.1-py2.7.egg/prservices/prexport/prexporter.py  --countryid=%d --outdir=%s'

class CsvTable(object):
	def __init__(self, export_dir, name):
		self._data = []
		self._row = unicode('')
		self._export_dir = export_dir
		self._name = name

	def new_row(self):
		self._row = unicode('')

	def add(self, data):
		if len(self._row) == 0:

			self._row += unicode('"')
		else:
			self._row += unicode('","')

		if data == None:
			data = unicode('')

		data = data.replace('\n', ' ')
		data = data.replace('\t', ' ')
		data = data.replace('"', "'")

		self._row += data

	def add_record(self, record, s_field):
		"""Add field to xml """

		if type(s_field) in (TupleType, ListType):
			(out_field, in_field) = s_field
		else:
			out_field = s_field
			in_field = None

		if record:
			data = getattr(record, in_field if in_field else out_field)
			if data == None:
				data = ''
			else:
				data = unicode(data)
		else:
			data = ''
		if type(data) in (StringType, UnicodeType):
			self.add(data)
		else:
			self.add(data)

	def add_query(self, exp_field_list, command):
		#  build data
		for record in command.all():
			self.new_row()
			for field in exp_field_list:
				if type(field) in (TupleType, ListType):
					(in_field, out_field) = field
				else:
					in_field = out_field = field
				data = getattr(record, in_field)
				if data == None:
					data = unichr('')
				if type(data) in (StringType, UnicodeType):
					text = data
				else:
					text = unicode(str(data)).encode("utf-8")
				self.add(text)
			self.end_row()

	def end_row(self):
		self._row += unicode('"\n')
		self._data.append(self._row)
		self.new_row()

	def write(self):

		# write to file
		with codecs.open(os.path.join(self._export_dir, self._name + ".csv"), "wb", "utf-8") as outfile:
			outfile.write(unicode("").join(self._data))

	def add_header(self, headings):
		self.new_row()
		for heading in headings:
			self.add(heading)
		self.end_row()

class DataExport(object):
	"""Export Data to XML """

	def __init__(self, export_dir, limit = None, sql_filter = None, zipped_file = False, zip_password=None, countryid=None, is_csv=False):
		""" get the basic settings """

		# setup the root for the exrpot
		self._limit = limit
		self._sql_filter = sql_filter
		self._zipped_file = zipped_file
		self._export_dir = export_dir
		self._zip_password = zip_password
		self._nbrexported = 0
		self._countryid = countryid
		self._is_csv = is_csv

		# check and created dir
		if not os.path.exists(self._export_dir):
			os.makedirs(self._export_dir)

	def _export_to_csv(self, rootnode=None, sectionheadingname=None, sectionname=None, exp_field_list=None, command=None):
		"""Export a query to a file """

		output = CsvTable(self._export_dir, sectionheadingname)
		# heading rows
		output.new_row()
		for field in exp_field_list:
			if type(field) in (TupleType, ListType):
				(_, out_field) = field
			else:
				out_field = field
			output.add(out_field)
		output.end_row()

		#  build data
		for record in command.all():
			output.new_row()
			for field in exp_field_list:
				if type(field) in (TupleType, ListType):
					(in_field, out_field) = field
				else:
					in_field = out_field = field
				data = getattr(record, in_field)
				if data == None:
					data = unichr('')
				if type(data) in (StringType, UnicodeType):
					text = data
				else:
					text = unicode(str(data)).encode("utf-8")
				output.add(text)
			output.end_row()

		# write to file
		output.write()

	def get_xml_root(self):
		"""Get root"""

		_root = Element('prmax')
		_root.append(Comment('Generated by PRMax on %s' % (date.today().strftime("%d/%m/%Y"))))

		return _root

	def _export_query(self, rootnode, sectionheadingname, sectionname, exp_field_list, command):
		"""Export a query """

		sectionheading = SubElement(rootnode, sectionheadingname )
		for record in command.all():
			section = SubElement(sectionheading, sectionname)
			for field in exp_field_list:
				if type(field) in (TupleType, ListType):
					(in_field, out_field) = field
				else:
					in_field = out_field = field

				item = SubElement(section, out_field)
				data = getattr(record, in_field)
				if data == None:
					data = ''
				if type(data) in (StringType, UnicodeType):
					item.text = data
				else:
					item.text = str(data)

	def _get_base_query(self, limit=None, offset=None, countryid=None):
		"get the base query"

		session.expunge_all()

		command = session.query(Outlet, Communication, Address, OutletProfile).\
		       join(Communication, Communication.communicationid == Outlet.communicationid).\
		       join(Address, Communication.addressid == Address.addressid ).\
		       outerjoin(OutletProfile, OutletProfile.outletid==Outlet.outletid).\
		       filter(Outlet.customerid==-1)

		if self._sql_filter:
			command = command.filter(text(self._sql_filter))

		if countryid:
			command = command.filter(Outlet.countryid==countryid)

		if limit:
			command = command.limit(limit)

		if offset:
			command = command.offset(offset)

		return command

	def _get_country_list(self):
		"get the base query"

		command = session.query(Outlet.countryid).filter(Outlet.customerid==-1)

		if self._sql_filter:
			command = command.filter(text(self._sql_filter))

		return command.group_by(Outlet.countryid).all()

	def _export_outlets(self):
		"""export outlets"""

		if self._is_csv:
			export_command = self._export_outlet_query_csv
			ext = ""
		else:
			export_command = self._export_outlet_query
			ext = ".xml"
		if self._limit:
			command = self._get_base_query(self._limit)
			print "To Export   : %d" % command.count()
			export_command(command, "1%s" % ext)
		else:
			if self._countryid:
				command = self._get_base_query(None, None, self._countryid)
				print "To Export   : %d" % command.count()
				export_command(command, "%d.%s" % (self._countryid, ext))

	def _export_outlet_query(self, command, outfilename):
		"export set of outlets"
		session.begin()
		root = self.get_xml_root()
		outlets = SubElement(root, "outlets")
		for outlet in command.all():
			self._nbrexported += 1
			outlet_root = SubElement(outlets, "outlet")
			for fields in DataExport.EXPORTOUTLET:
				for field in fields[0]:
					self._add_item(outlet_root, outlet[fields[1]], field)

			# export contact
			contacts = SubElement(outlet_root, "contacts")
			for employee in session.query(Employee, Communication, Address, Contact).\
					outerjoin(Communication, Communication.communicationid == Employee.communicationid ).\
			    outerjoin(Address, Communication.addressid == Address.addressid ).\
			    outerjoin(Contact, Contact.contactid==Employee.contactid).\
			    filter(Employee.outletid == outlet[0].outletid).\
			    filter(Employee.prmaxstatusid==1).\
			    filter(Employee.customerid==-1).all():
				contact = SubElement(contacts, "contact")
				for field in DataExport.EXPORTEMPLOYEE:
					self._add_item(contact, employee[0], field)
				for field in DataExport.EXPORTCOMMS:
					self._add_item(contact, employee[1], field)
				for field in DataExport.EXPORTADDRESSES:
					self._add_item(contact, employee[2], field)

				if employee[3]:
					familyname = employee[3].familyname
					firstname = employee[3].firstname
					prefix = employee[3].prefix
				else:
					familyname = ""
					firstname = ""
					prefix = ""
				self._add_item_simple(contact, familyname, "familyname")
				self._add_item_simple(contact, firstname, "firstname")
				self._add_item_simple(contact, prefix, "prefix")
				#contact interests
				self._export_query(contact, "interests", "interest", ("interestname", "interestid"),
				                   session.query(EmployeeInterestView).filter(EmployeeInterestView.employeeid==employee.Employee.employeeid).\
				    filter(EmployeeInterestView.customerid == -1))

			# export interests
			self._export_query( outlet_root, "interests", "interest", ("interestname", "interestid"),
			                   session.query(OutletInterestView).filter(OutletInterestView.outletid==outlet.Outlet.outletid).\
			                   filter(OutletInterestView.customerid == -1))
			# export coverage
			self._export_query( outlet_root, "coverage", "area", ("geographicalname", ),
			                    session.query(OutletCoverageView).filter(OutletCoverageView.outletid==outlet.Outlet.outletid))
			# missing export of profiles !!
			if outlet[3]:
				for field in DataExport.EXPORTPROFILE:
					self._add_item(outlet_root, outlet[3], field)
			else:
				self._add_item_simple(outlet_root, outlet.Outlet.profile, "editorialprofile")

		with file(os.path.join(self._export_dir, outfilename), "w") as outfile:
			ElementTree(root).write(outfile)

		session.commit()
		root.clear()
		root = None
		gc.collect()

	def _export_outlet_query_csv(self, command, outfilename):
		"export set of outlets"

		output_outlets = CsvTable(self._export_dir, outfilename + "_outlets")
		output_contacts = CsvTable(self._export_dir, outfilename + "_contacts")
		contacts_interest = CsvTable(self._export_dir, outfilename + "_contact_interests")
		outlet_interest = CsvTable(self._export_dir, outfilename + "_outlet_interests")
		outlet_coverage = CsvTable(self._export_dir, outfilename + "_outlet_coverages")

		# add headings
		headings = []
		for fields in DataExport.EXPORTOUTLET:
			for s_field in fields[0]:
				if type(s_field) in (TupleType, ListType):
					field = s_field[0]
				else:
					field = s_field
				headings.append(field)
		for s_field in DataExport.EXPORTPROFILE:
			if type(s_field) in (TupleType, ListType):
				field = s_field[0]
			else:
				field = s_field
			headings.append(field)
		output_outlets.add_header(headings)

		output_contacts.add_header([field for field in DataExport.EXPORTCSVEMPLOYEE] + \
			[field for field in DataExport.EXPORTCOMMS] + \
			[field for field in DataExport.EXPORTADDRESSES] + \
			["familyname", "firstname", "prefix"])

		contacts_interest.add_header(DataExport.EXPORTEMPLOYEEINTERESTS)
		outlet_interest.add_header(DataExport.EXPORTOUTLETINTERESTS)
		outlet_coverage.add_header(DataExport.EXPORTOUTLETCOVERAGE)

		for outlet in command.all():
			self._nbrexported += 1
			output_outlets.new_row()
			for fields in DataExport.EXPORTOUTLET:
				for field in fields[0]:
					output_outlets.add_record(outlet[fields[1]], field)

			# export contact
			for employee in session.query(Employee, Communication, Address, Contact).\
					outerjoin(Communication, Communication.communicationid == Employee.communicationid ).\
			    outerjoin(Address, Communication.addressid == Address.addressid ).\
			    outerjoin(Contact, Contact.contactid==Employee.contactid).\
			    filter(Employee.outletid == outlet[0].outletid).\
			    filter(Employee.prmaxstatusid==1).\
			    filter(Employee.customerid==-1).all():
				output_contacts.new_row()
				for field in DataExport.EXPORTCSVEMPLOYEE:
					output_contacts.add_record(employee[0], field)
				for field in DataExport.EXPORTCOMMS:
					output_contacts.add_record(employee[1], field)
				for field in DataExport.EXPORTADDRESSES:
					output_contacts.add_record(employee[2], field)

				if employee[3]:
					familyname = employee[3].familyname
					firstname = employee[3].firstname
					prefix = employee[3].prefix
				else:
					familyname = ""
					firstname = ""
					prefix = ""
				output_contacts.add(familyname)
				output_contacts.add(firstname)
				output_contacts.add(prefix)

				output_contacts.end_row()
				#contact interests
				contacts_interest.add_query(DataExport.EXPORTEMPLOYEEINTERESTS,
											session.query(EmployeeInterestView).filter(EmployeeInterestView.employeeid==employee.Employee.employeeid).\
											filter(EmployeeInterestView.customerid == -1))

			# export interests
			outlet_interest.add_query(DataExport.EXPORTOUTLETINTERESTS,
									  session.query(OutletInterestView).filter(OutletInterestView.outletid==outlet.Outlet.outletid).\
									  filter(OutletInterestView.customerid == -1))
			# export coverage
			outlet_coverage.add_query(DataExport.EXPORTOUTLETCOVERAGE,
									 session.query(OutletCoverageView).filter(OutletCoverageView.outletid==outlet.Outlet.outletid))
			# missing export of profiles !!
			if outlet[3]:
				for field in DataExport.EXPORTPROFILE:
					output_outlets.add_record(outlet[3], field)
			else:
				output_outlets.add(outlet.Outlet.profile)

			output_outlets.end_row()

		output_outlets.write()
		output_contacts.write()
		contacts_interest.write()
		outlet_interest.write()
		outlet_coverage.write()


	def _add_item_simple(self, root, data, s_field):
		"""Add field to xml """

		item = SubElement(root, s_field)
		if data == None:
			data = ''

		if type(data) in (StringType, UnicodeType):
			item.text = data
		else:
			item.text = str(data)

	def _add_item(self, root, record, s_field):
		"""Add field to xml """

		if type(s_field) in (TupleType, ListType):
			(out_field, in_field) = s_field
		else:
			out_field = s_field
			in_field = None

		item = SubElement(root, out_field)
		if record:
			data = getattr(record, in_field if in_field else out_field)
			if data == None:
				data = ''
		else:
			data = ''
		if type(data) in (StringType, UnicodeType):
			item.text = data
		else:
			item.text = str(data)

	def _export_lookups(self):
		"""Export the lookup tables """

		if self._is_csv:
			export_command = self._export_to_csv
			root = None
			lookups = None
		else:
			export_command = self._export_query
			root = self.get_xml_root()
			lookups = SubElement(root, "lookups")

		export_command(
		  lookups,
		  "interests",
		  "interest",
		  ('interestid', 'interestname'),
		  session.query(Interests).\
		  join(InterestGroups, InterestGroups.childinterestid==Interests.interestid).\
		  filter(Interests.customerid == -1).\
		  filter(Interests.interesttypeid==1))

		# groups
		export_command(
		  lookups,
		  "interestgroups",
		  "interestgroup",
		  ('interestid', 'interestname'),
		  session.query(Interests).\
		  join(InterestGroups, InterestGroups.childinterestid==Interests.interestid).\
		  filter(Interests.customerid == -1).\
		  filter(InterestGroups.parentinterestid==None))

		# mapping
		parentids = [ row[1].interestid for row in session.query(InterestGroups, Interests).\
		              join(Interests, InterestGroups.childinterestid==Interests.interestid).\
		              filter(Interests.customerid == -1).\
		              filter(InterestGroups.parentinterestid==None).all()]

		export_command(
		  lookups,
		  "interestgroupmembers",
		  "interestgroupmember",
		  ('parentinterestid', 'childinterestid'),
		  session.query(InterestGroups).\
		  filter(InterestGroups.parentinterestid.in_(parentids)))

		export_command(
		  lookups,
		  "outlettypes",
		  "outlettype",
		  (('prmax_outlettypeid', 'outlettypeid'), ('prmax_outlettypename', 'outlettypename')),
		  session.query(PRmaxOutletTypes))

		export_command(
		  lookups,
		  "countries",
		  "country",
		  ('countryid', 'countryname'),
		  session.query(Countries))

		export_command(
		  lookups,
		  "frequencies",
		  "frequency",
		  ('frequencyid', 'frequencyname'),
		  session.query(Frequencies))

		export_command(
		  lookups,
		  "publisheries",
		  "publisher",
		  ('publisherid', 'publishername'),
		  session.query(Publisher))

		export_command(
		  lookups,
		  "circulationsources",
		  "circulationsource",
		  ('circulationsourceid', 'circulationsourcedescription'),
		  session.query(CirculationSources))

		export_command(
		  lookups,
		  "circulationauditdates",
		  "circulationauditdate",
		  ('circulationauditdateid', 'circulationauditdatedescription'),
		  session.query(CirculationDates))

		export_command(
		  lookups,
		  "outletprices",
		  "outletprice",
		  ('outletpriceid', 'outletpricedescription'),
		  session.query(OutletPrices))

		export_command(
		  lookups,
		  "geographicalareas",
		  "geographical",
		  ('geographicallookuptypeid', 'geographicalid', 'geographicalname'),
		  session.query(GeographicalLookupView))

		export_command(
		  lookups,
		  "geographicaltree",
		  "geographicalitem",
		  ('parentgeographicalareaid', 'childgeographicalareaid'),
		  session.query(GeographicalTree))

		if not self._is_csv:
			with file(os.path.join(self._export_dir, "lookups.xml"), "w") as outfile:
				ElementTree(root).write(outfile)

	def _export_results(self):
		"""Output Results to a file
		will compress if required
		If password need to do it using a different library
		# https://github.com/smihica/pyminizip
		"""
		if self._zipped_file:
			if self._zip_password:
				print("NOT POSSIBLE TO ZIP DIRECTLY WITH A PASSWORD")
			else:
				with zipfile.ZipFile(os.path.join(self._export_dir, "prmax.zip"), "w") as  zipped:
					# need to write all files in the dir
					for name in os.listdir(self._export_dir):
						if os.path.isfile(os.path.join(self._export_dir, name)) and name != "prmax.zip":
							zipped.write(os.path.join(self._export_dir, name), os.path.basename(name), zipfile.ZIP_DEFLATED)

	# export list

	EXPORTCOMMS = ("email", "tel", "fax", "mobile", "facebook", "linkedin", "twitter", "blog")
	EXPORTADDRESSES = ("address1", "address2", "county", "postcode", "townname")
	EXPORTPROFILE = ("readership", "editorialprofile", "nrsreadership", "jicregreadership", "subtitle", "officialjournalof",
	                  "incorporating", "deadline", "frequencynotes", "broadcasttimes")

	EXPORTOUTLET = (
	  (("outletid", "outletname", "countryid", ("outlettypeid", "prmax_outlettypeid"), "frequencyid", "circulation", \
	    "www", "publisherid", "circulationauditdateid", "circulationsourceid", "outletpriceid", "primaryemployeeid"), 0),
	  (("email", "tel", "fax", "mobile", "facebook", "linkedin", "twitter", "blog"), 1),
	  (("address1", "address2", "county", "postcode", "townname"), 2)
	)
	EXPORTOUTLETINTERESTS = ("outletid", "interestname", "interestid")
	EXPORTOUTLETCOVERAGE = ("outletid", "geographicalname", "geographicalid")

	EXPORTEMPLOYEE = ("employeeid", "job_title")
	EXPORTCSVEMPLOYEE = ("outletid", "employeeid", "job_title")

	EXPORTEMPLOYEEINTERESTS = ("employeeid", "interestname", "interestid")

	def _export_by_country(self):
		"export by country"

		command = self._get_base_query(self._limit)
		# get list of countries in set
		countries = self._get_country_list()
		for countryid in countries:
			print "Exporting Country %3d (%3d of %3d)" % (countryid[0], countries.index(countryid) + 1, len(countries))
			command = COMMANDFILE
			if self._limit:
				command += " --limit=%d" % self._limit
			if self._is_csv:
				command += " --csv"

			os.system(command % (countryid[0], self._export_dir))

	def export(self):
		"""Export All Data for each set"""

		if not self._countryid:
			# export lookups
			self._export_lookups()
			# export outlets
			self._export_by_country()
			# output result
			self._export_results()
		else:
			self._export_lookups()
			self._export_outlets()

