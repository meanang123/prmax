# -*- coding: utf-8 -*-
""" Research Questionannaires - Preview and mass mail """
#-----------------------------------------------------------------------------
# Name:        base.py
# Purpose:		 Create a  html file to email to research contact
#
# Author:      Chris Hoy
#
# Created:     24/03/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from turbogears.database import session
from prcommon.model import Address, Communication, Frequencies, Employee, Contact, \
     OutletInterestView, OutletCoverageView, EmployeeInterestView, AdvanceFeature, \
     User, Activity, OutletProfile, Outlet, EmailQueue, Publisher, OutletLanguages, \
     Languages, ProductionCompany, Frequencies, OutletPrices

import prcommon.Constants as Constants
from ttl.string import Translate25UTF8ToHtml
from mako.lookup import TemplateLookup
import slimmer
import sys
import os
from tempfile import gettempdir
from ttl.ttlemail import EmailMessage
from ttl.postgres import DBCompress

class ResearchContact(object):
	""" an instance of a research contact """

	def __init__(self, firstname, surname, emailaddress):
		""" Init contact details"""
		self._firstname = firstname
		self._surname = surname
		self._emailaddress = emailaddress

	def _firstname_get(self):
		"""get first name """
		return self._firstname

	def _surname_get(self):
		""" get surname """
		return self._surname

	def _emailaddress_get(self):
		"""get email address"""
		if self._firstname:
			return '"%s" <%s>' % ( self._firstname, self._emailaddress )
		else:
			return self._emailaddress

	def _name_get(self):
		""" get name """
		return ("%s %s" % ( self._firstname, self._surname)).strip()

	firstname = property(_firstname_get)
	surname = property(_surname_get)
	emailaddress = property(_emailaddress_get)
	name = property(_name_get)


class QuestionnaireBuilder ( object ) :
	""" class to build an html questionnaire"""
	def __init__(self, preview = False ):
		self._templatepath = os.path.normpath(os.path.join(os.path.dirname(__file__),'templates'))
		self._temppath = os.path.normpath(os.path.join(gettempdir(),'mako_modules'))
		self._lookup = TemplateLookup(directories=[self._templatepath],
		                          module_directory=self._temppath,
		                           output_encoding='utf-8',
		                           input_encoding='utf-8',
		                           encoding_errors='replace')
		# capture lookup
		self._lookup_tables = {}
		self._lookup_tables["f"] = Frequencies.getLookupAsDict(None)
		self._preview = preview
		self.data = None
		self._out_data = None

	def start(self, outletid , researchcontact, researcher, body = "" ):
		""" setup the basic details """
		self._out_data = None
		self.data = dict ( preview = self._preview ,
		                   body_text = body.replace("\n","<br/>"))

		self.data["style"] = dict(p = "font-name:Arial;margin:0px;padding:0px;font-size:11pt",
		                          plabel = "font-name:Arial;margin:0px;padding:0px;font-weight:bold;font-size:11pt",
		                          pheader = "font-name:Arial;margin:0px;padding:0px;font-weight:bold;font-size:15pt",
		                          psmall = "font-name:Arial;margin:0px;padding:0px;font-size:9pt"
		                          )
		self.data["g"] = dict ()
		# common info
		self.data["l"] = self._lookup_tables
		self.data["r"] = dict ( rc = researchcontact, rp = researcher)

		# outlet details
		outlet = Outlet.query.get ( outletid )
		comm = Communication.query.get ( outlet.communicationid )

		if outlet.outlettypeid in Constants.Outlet_Is_Individual:
			dinterests = ", ".join ( [ row.interestname for row in session.query(EmployeeInterestView).filter_by(
			  employeeid = outlet.primaryemployeeid,
			  interesttypeid=Constants.Interest_Type_Standard).all()])
		else:
			dinterests = ", ".join ( [ row.interestname for row in session.query(OutletInterestView).filter_by(
			  outletid = outlet.outletid,
			  interesttypeid=Constants.Interest_Type_Standard).all()])

		dcoverage  = ", ".join ( [ row.geographicalname for row in session.query(OutletCoverageView).filter_by(
		  outletid = outlet.outletid).all()] )

		features = session.query( AdvanceFeature ).filter_by ( outletid = outlet.outletid ).order_by( AdvanceFeature.publicationdate_date ).all()
		frecord  = self._lookup_tables["f"].get(outlet.frequencyid, None)

		self.data["o"] = dict (
		  outlet = outlet,
		  comm = comm,
		  addr = Address.query.get ( comm.addressid ),
		  dinterests = dinterests.strip(","),
		  dcoverage  = dcoverage.strip(","),
		  profile = outlet.getProfileAsList(),
		  features = features,
		  fdescription = frecord["name"] if frecord else "Unknown"
		)

		outletprofile = OutletProfile.query.get ( outlet.outletid )
		if outletprofile:
			language1 = ""
			language2 = ""
			pcname = ""
			frequencyname = ""
			pricename = ""
			publishername = ""

			for row in session.query( OutletLanguages, Languages).\
			    join(Languages, Languages.languageid == OutletLanguages.languageid).\
			    filter(OutletLanguages.outletid == outlet.outletid).all():
				if row[0].isprefered:
					language1 = row[1].languagename
				else:
					if not language2:
						language2 = row[1].languagename
					elif not language1:
						language1 = row.languagename
				if outletprofile.productioncompanyid:
					pcname = ProductionCompany.query.get(outletprofile.productioncompanyid).productioncompanyname
				if outlet.frequencyid:
					frequencyname = Frequencies.query.get(outlet.frequencyid).frequencyname
				if outlet.frequencyid:
					pricename = OutletPrices.query.get(outlet.frequencyid).outletpricedescription
				if outlet.publisherid:
					publishername = Publisher.query.get(outlet.publisherid).publishername

				newprofile = dict (
				  outletprofile = outletprofile,
				  publishername = publishername,
				  language1 = language1,
				  language2 = language2,
				  pcname = pcname,
				  frequencyname = frequencyname,
				  pricename = pricename,
				)

				self.data['o']['newprofile'] = newprofile


		# primary contact
		if outlet.outlettypeid not in Constants.Outlet_Is_Individual:
			self.data["p"] = self._capture_employee (
			  outlet.primaryemployeeid,
			  comm)
			# now we need too load the contact etc
			self.data["c"] = [self._capture_employee ( emp.employeeid, comm )
			                  for emp in session.query ( Employee ).filter_by (
			                    outletid = outlet.outletid, customerid = -1, prmaxstatusid = 1 ).order_by ( Employee.job_title )
		                  if emp.employeeid != outlet.primaryemployeeid]

		# need the current researcher here

	def _capture_employee(self, employeeid , defvalue ):
		""" get a contact and convert it to a dict """

		caddress = ""
		emp = Employee.query.get ( employeeid )
		comm = Communication.query.get ( emp.communicationid )
		if comm.addressid and defvalue.addressid != comm.addressid:
			addr = Address.query.get(comm.addressid)
			caddress = addr.getAddressAsLine()
		if emp.contactid:
			con = Contact.query.get ( emp.contactid )
			dname = con.getName() + ", "
		else:
			dname = "To be appointed, "
		dname += emp.job_title

		# interest to display line
		dinterests = ", ".join ( [ row.interestname for row in session.query(EmployeeInterestView).filter_by(
		                employeeid = emp.employeeid ).all()])

		return dict ( emp = emp,
		              con = getattr(self,"con",None),
		              dname = dname,
		              comm = comm,
		              caddress = caddress,
		              dinterests = dinterests.strip(","),
		              defvalue = defvalue
		              )
	def run(self):
		""" do the converstion """

		mytemplate = self._lookup.get_template(self._gettemplatename())
		self._out_data = mytemplate.render(**self.data)

	def _gettemplatename(self ):
		""" get the correct template"""

		if self.data["o"]["outlet"].outlettypeid == Constants.Outlet_Type_Freelance:
			return "freelance_style_1.html"
		else:
			return "outlet_style_1.html"


	## use in 2.6 prmax uses 2.5 !!! @property.fget
	def _get_output(self):
		""" get output """
		return self._out_data

	def _get_output_compressed(self):
		""" compress the html output stream """

		return slimmer.xhtml_slimmer(self.output)

	output = property ( _get_output )
	output_compressed = property ( _get_output_compressed )



class QuestionnaireEmailer( object ):
	""" send out email or list of emails """

	@staticmethod
	def runsingle( params ):
		""" run a single """
		fromu = User.query.get(params["userid"])
		tou = ResearchContact ( params["toname"] , "" , params["toemail"] )
		question = QuestionnaireBuilder()

		# do questionarre
		if params["objecttypeid"] in (  Constants.Object_Type_Outlet, Constants.Object_Type_Freelance ) :
			question.start ( params["objectid"], tou, fromu , params["body"])
			question.run()


		tmp = question.output_compressed
		if sys.version_info[0] == 2 and sys.version_info[1] == 5:
			tmp = Translate25UTF8ToHtml( tmp )
			use_utf8 = True
		else:
			use_utf8 = True


		# do email
		email = EmailMessage(fromu.email_address,
							 tou.emailaddress,
							 params["subject"],
							 tmp,
		           "text/html",
		           "",
		           None,
		           use_utf8)

		email.BuildMessage()
		emailq = EmailQueue (
		  emailaddress = tou.emailaddress,
		  subject = email.Subject,
		  message = DBCompress.encode2(email),
		  emailqueuetypeid = Constants.EmailQueueType_Internal)
		session.add(emailq)
		session.flush()

		# no add to activity
		activity = Activity (
		  objecttypeid = params["objecttypeid"],
		  objectid = params["objectid"],
		  parentobjecttypeid = params["objecttypeid"],
		  parentobjectid = params["objectid"],
		  actiontypeid = Constants.Research_Reason_Quest,
		  userid = params['userid'],
		  reasoncodeid = params["reasoncodeid"])
		session.add(activity)

	@staticmethod
	def getfordistribution( outletid):
		""" run a single """
		question = QuestionnaireBuilder( True )
		fromu = ResearchContact ( "" , "" , "" )
		tou = ResearchContact ( "" , "" , "" )

		# do questionarre
		question.start ( outletid, tou, fromu )
		question.run()

		tmp = question.output_compressed
		if sys.version_info[0] == 2 and sys.version_info[1] == 5:
			tmp = Translate25UTF8ToHtml( tmp )

		return tmp

	@staticmethod
	def preview_questionnaire( params ):
		""" review """
		question = QuestionnaireBuilder( True )
		fromu = ResearchContact ( "" , "" , "" )
		tou = ResearchContact ( "" , "" , "" )

		# do questionarre
		if params["objecttypeid"] in (  Constants.Object_Type_Outlet, Constants.Object_Type_Freelance ) :
			question.start ( params["objectid"], tou, fromu )
			question.run()

		return question.output_compressed















