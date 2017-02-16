# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        dataimport.py
# Purpose:    To handle importation of private data
#			sence
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

from prcommon.model import Outlet, Contact, Employee, Interests, User, \
     GeographicalLookupView, PRmaxOutletTypes, Freelance
from  prcommon.model import Countries
from turbogears.database import  session

import prcommon.Constants as Constants

import csv
import logging
log = logging.getLogger("prmax.model")

########################################################################

class OutletFields(object):
	""" OutletFields """
	def __init__(self, customerid, userid):
		""" """
		self._userid = userid
		self._customerid = customerid
		self._sequence = 1
		tmp = session.query(Interests.interestid).filter_by(interestname="Private", customerid=-1).first()
		if tmp:
			self._private_interest = tmp[0]
		else:
			self._private_interest = None
		self.Clear()
		self._outlettypes = {}
		for r in session.query(PRmaxOutletTypes).all():
			self._outlettypes[r.prmax_outlettypename.strip().lower()] = r.prmax_outlettypeid

	def Clear(self):
		self.common = dict(userid=self._userid, customerid=self._customerid)
		self.primary_contact_com = dict(contact_tel="", contact_email="",
		                             contact_fax="", contact_mobile="",
		                             contact_twitter="", contact_linkedin="",
		                             contact_facebook="",
		                             job_title="", profile="", tel="", fax="",
		                             mobile="", sourcetypeid=Constants.Research_Source_Private)

		self.outlet_address = dict(address1="", address2="", county="",
		                             postcode="", townname="")
		self.primary_com = dict(outlet_tel="", outlet_email="", outlet_fax="",
		                          outlet_twitter="", outlet_facebook="", outlet_linkedin="")
		self.outlet = dict(outlettypeid=45,
		                     outlet_circulation=0, outletname="",
		                     prmax_outlettypeid=45,
		                     countryid=1, countryname="",
		                     frequencyid=5, outlet_profile="", outlet_www="",
		                     sourcetypeid=Constants.Research_Source_Private,
		                     twitter="", facebook="", linkedin="")

		self.employee = dict(contacttype="N", contactid=None,
		                     contact_jobtitle="",
		                     sourcetypeid=Constants.Research_Source_Private)

		self.interest = dict(contact_interest=[], outlet_interest=[], interests=[])
		if self._private_interest:
			self.interest["contact_interest"] = [self._private_interest]
			self.interest["outlet_interest"] = [self._private_interest]

		self.coverage = dict(geographicalid=[])

		self.contact = dict(prefix="", firstname="", familyname="")

		self.dict_list = (self.primary_contact_com, self.outlet_address,
		                  self.primary_com, self.outlet, self.common, self.employee,
		                  self.interest, self.contact, self.coverage)

	def getKwList(self):
		""" get a complete list of keyword for the add function"""
		ret = {}
		for d in self.dict_list:
			ret.update(d)

		return ret

	def set(self, key, data):
		if key == "prmax_outlettypeid":
			self.outlet["prmax_outlettypeid"] = self._outlettypes.get(data.strip().lower(), self.outlet["prmax_outlettypeid"])
			if self.outlet["prmax_outlettypeid"] == 42:
				self.outlet["outlettypeid"] = 19
			return

		for a in self.dict_list:
			if a.has_key(key):
				a[key] = data
				break
		else:
			if key == "contact":
				self.doContact(data, self.common["customerid"])
			if  key in ("interestid", "interestid1", "interestid2", "interestid3", "interestid4"):

				for interestname in data.replace(";", ",").split(","):
					interestname = interestname.strip()
					interestid = session.query(Interests.interestid).filter(
					    Interests.interestname == interestname.strip()).filter(Interests.customerid == -1).first()
					if not interestid:
						interestid = session.query(Interests.interestid).filter(
						    Interests.interestname == interestname.strip()).filter(Interests.customerid == self._customerid).first()
					if not interestid:
						i = Interests(interestname=interestname,
						              customerid=self._customerid,
						              interesttypeid=Constants.Interest_Type_Standard)
						session.add(i)
						session.flush()
						interestid = i.interestid
					else:
						interestid = interestid[0]
					if not interestid in self.interest["contact_interest"]:
						self.interest["contact_interest"].append(interestid)
						self.interest["outlet_interest"].append(interestid)
			if key in ("coverage", "coverage2", "coverage3"):
				for areaname in data.split(","):
					areaname = areaname.strip()
					geoggraphicalid = session.query(GeographicalLookupView.geographicalid).filter(
					  GeographicalLookupView.cmp_geographicalname == areaname.lower()).first()
					if geoggraphicalid:
						for g in self.coverage["geographicalid"]:
							if g == geoggraphicalid[0]:
								break
						else:
							self.coverage["geographicalid"].append(geoggraphicalid[0])

	def fixUp(self):
		"""  missing fields"""
		if not self.outlet["outletname"]:
			if self.outlet["prmax_outlettypeid"] == 42:
				self.outlet["outletname"] = "%s %s" % (self.contact["familyname"], self.contact["firstname"])
			else:
				self.outlet["outletname"] = "Private %d" % self._sequence
			self._sequence += 1
		if "countryname" in self.outlet and self.outlet["countryname"]:
			tmp = session.query(Countries).filter(Countries.countryname == self.outlet["countryname"].strip()).all()
			if tmp:
				self.outlet["countryid"] = tmp[0].countryid
		self.outlet["outletname"] = self.outlet["outletname"][:89]

		# fix up tel
		self.primary_com["outlet_tel"] = self.primary_com["outlet_tel"][:44]
		self.primary_contact_com["contact_tel"] = self.primary_contact_com["contact_tel"][:44]

	def fixContact(self):
		if self.contact["familyname"]:
			self.employee["contacttype"] = "T"
			if self.contact["familyname"].find(",") != -1:
				tmp = self.contact["familyname"].split(",")
				self.contact["familyname"] = tmp[0]
				self.contact["firstname"] = tmp[1]

			fields = dict(surname=self.contact["familyname"],
			                familyname=self.contact["familyname"],
			                firstname=self.contact["firstname"],
			                prefix=self.contact["prefix"],
			                suffix=self.contact.get("suffix", ""))
			fields.update(self.common)
			result = Contact.getContactByName(fields)
			if result:
				self.employee["contactid"] = result[0]["contactid"]
			else:
				# add new contact
				contact = Contact(familyname=self.contact["familyname"],
				                  firstname=self.contact["firstname"],
				                  prefix=self.contact["prefix"],
				                  customerid=self._customerid,
				                  sourcetypeid=Constants.Research_Source_Private)
				session.add(contact)
				session.flush()
				self.employee["contactid"] = contact.contactid

	def doContact(self, name, customerid):
		""" doContact """
		tname = name.strip()
		surname = ""
		if tname:
			f = tname.split(" ")
			if len(f) > 1:
				surname = " ".join(f[1:])
				firstname = f[0]
			elif len(f) > 0:
				surname = f[0]
				firstname = ""
			else:
				surname = ""
				firstname = ""
		if surname:
			# find/createcontact
			self.employee["contacttype"] = "T"
			fields = dict(surname=surname, firstname=firstname, familyname=surname)
			fields.update(self.common)
			result = Contact.getContactByName(fields)
			if result:
				self.employee["contactid"] = result[0]["contactid"]
			else:
				# add new contact
				contact = Contact(familyname=surname,
				                  firstname=firstname,
				                  prefix='',
				                  customerid=customerid,
				                  sourcetypeid=Constants.Research_Source_Private)
				session.add(contact)
				session.flush()
				self.employee["contactid"] = contact.contactid

	def findOutletByName(self):
		if self.outlet["outletname"]:
			tmp = session.query(Outlet.outletid).filter(Outlet.outletname.ilike(self.outlet["outletname"])).filter(Outlet.customerid == self._customerid).first()
			if tmp:
				return tmp[0]
		return None

	def fixAddress(self):
		"""Fix up Address"""

		self.outlet_address["address1"] = self.outlet_address["address1"][:119]


class DataImport(object):
	""" Import data"""

	def __init__(self, customerid, outletadd=True):
		self._customerid = customerid
		try:
			self._userid = session.query(User.user_id).filter_by(customerid=customerid).all()[0][0]
		except:
			self._userid = 0

		self._addoutlet = outletadd

	def importOutlet(self, datafile):
		""" importOutlet """
		added = 0
		message = ""
		reader = csv.reader(datafile)
		hfields = []
		for f in reader.next():
			hfields.append(f.replace('\xef\xbb\xbf', '').replace("\"", ""))

		transaction = Outlet.sa_get_active_transaction()
		try:

			out = OutletFields(self._customerid, self._userid)

			for row in reader:
				print row
				out.Clear()
				for x in xrange(0, len(row)):
					out.set(hfields[x], row[x])

				out.fixUp()
				out.fixContact()
				out.fixAddress()
				fields = out.getKwList()
				if self._addoutlet:
					fields["outletid"] = out.findOutletByName()
				else:
					fields["outletid"] = None

				if  self._addoutlet and fields["outletid"]:
					if fields.has_key("contact_email"):
						fields["email"] = fields["contact_email"]

					if fields.has_key("contact_interest"):
						fields["interests"] = fields["contact_interest"]
					fields["twitter"] = fields["contact_twitter"]
					fields["linkedin"] = fields["contact_linkedin"]
					fields["facebook"] = fields["contact_facebook"]
					if "contact_jobtitle" in fields and  fields["contact_jobtitle"]:
						fields["job_title"] = fields["contact_jobtitle"]

					Employee.add(fields)
				else:
					if out.outlet["prmax_outlettypeid"] == 42:
						fields["title"] = fields["prefix"]
						fields["tel"] = fields['contact_tel']
						fields["email"] = fields['contact_email']
						fields["fax"] = fields['contact_fax']
						fields["www"] = fields['outlet_www']
						fields["profile"] = fields['outlet_profile']
						fields["interests"] = fields['outlet_interest']

						Freelance.add(19, fields)
					else:
						Outlet.add(fields)

				added += 1

			transaction.commit()
		except Exception, ex:
			message = str(row) + "|||" + str(ex)
			try:
				transaction.rollback()
			except:
				pass
			print ex
			raise Exception(message)

		return added




