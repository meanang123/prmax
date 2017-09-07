# -*- coding: utf-8 -*-
"Research ProjectGeneral"
#-----------------------------------------------------------------------------
# Name:        questionnairesgeneral.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     26/11/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
import datetime
import logging
import simplejson
from turbogears.database import session
from sqlalchemy import  text
import prcommon.Constants as Constants
from prcommon.model.researchprojects.projects import ResearchProjectItems, ResearchProjectChanges, ResearchProjects
from prcommon.model.outlet import Outlet
from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.outletlanguages import OutletLanguages
from prcommon.model.outletprofile import OutletProfile
from prcommon.model.communications import Address, Communication
from prcommon.model.research import Activity, ActivityDetails, ResearchDetails
from prcommon.model.research import ResearchDetailsDesk
from prcommon.model.employee import Employee, EmployeeInterests
from prcommon.model.contact import Contact
from prcommon.model.queues import ProcessQueue
from prcommon.model.lookups import Countries, PRmaxOutletTypes
from prcommon.model.interests import EmployeeInterestView, OutletInterestView
from prcommon.model.publisher import Publisher
from prcommon.lib.caching import Invalidate_Cache_Object_Research
from ttl.model import  BaseSql

LOGGER = logging.getLogger("prcommon.model")

class QuestionnairesGeneral(object):
	""" QuestionnairesGeneral """


	OVERRIDE_MAP = {
	  Constants.Field_Outlet_Name: "outletname",
	  Constants.Field_CountryId: "countryid",
	  Constants.Field_Address_Www: "www",
	  Constants.Field_Subtitle_name: "subtitle",
	  Constants.Field_Incorporating: "incorporating",
	  Constants.Field_Officejournalof: "officialjournalof",
	  Constants.Field_Address_1: "address1",
	  Constants.Field_Address_2: "address2",
	  Constants.Field_Address_Town: "townname",
	  Constants.Field_Address_County: "county",
	  Constants.Field_Address_Postcode: "postcode",
	  Constants.Field_Tel: "tel",
	  Constants.Field_Fax: "fax",
	  Constants.Field_Mobile: "mobile",
	  Constants.Field_Email: "email",
	  Constants.Field_Facebook: "facebook",
	  Constants.Field_Twitter: "twitter",
	  Constants.Field_LinkedIn: "linkedin",
	  Constants.Field_Instagram: "instagram",
	  Constants.Field_Research_Surname: "research_surname",
	  Constants.Field_Research_Firstname: "research_firstname",
	  Constants.Field_Research_Prefix: "research_prefix",
	  Constants.Field_Research_Email: "research_email",
	  Constants.Field_Research_Tel: "research_tel",
	  Constants.Field_Research_Job_Title: "research_job_title",
		Constants.Field_Readership : "readership",
		Constants.Field_Profile : "editorialprofile",
		Constants.Field_Nrsreadership: "nrsreadership",
		Constants.Field_Jicregreadership: "jicregreadership",
	  Constants.Field_Deadline: "deadline",
	  Constants.Field_Frequency_Notes: "frequencynotes",
	  Constants.Field_Broadcasttimes: "broadcasttimes",
	  Constants.Field_Coverage: "geognotes",
	  Constants.Field_Publisher: "publisherid",
	  Constants.Field_Language1 : "language1id",
	  Constants.Field_Language2 : "language2id",
	  Constants.Field_Productioncompany: "productioncompanyid",
	  Constants.Field_Circulation:"circulation",
	  Constants.Field_Outlet_Circulation_Source: "circulationsourceid",
	  Constants.Field_Outlet_Circulation_Dates:  "circulationauditdateid",
	  Constants.Field_Frequency: "frequencyid",
	  Constants.Field_Cost : "outletpriceid",
	  Constants.Field_Research_Right_Person :  "right_person",
	  Constants.Field_FamilyName :  "familyname",
	  Constants.Field_Firstname: "firstname",
	  Constants.Field_Prefix: "prefix",
	  Constants.Field_Blog: "blog",
	  Constants.Field_Interest: "interests",
	  Constants.Field_Profile: "editorialprofile",
	  Constants.Field_RelatedOutlets: "relatedoutlets",
	  Constants.Field_PublisherName: "publishername",
	}

	@staticmethod
	def is_valid(researchprojectitemid):
		""" Check too see if valid
		"""

		researchitem = ResearchProjectItems.query.get(researchprojectitemid)
		if researchitem:
			researchproject = ResearchProjects.query.get(researchitem.researchprojectid)
			# check to see if expired
			if researchproject.questionnaire_completion and researchproject.questionnaire_completion < datetime.date.today():
				return None
			return researchitem
		return None


	@staticmethod
	def get_question_details(researchprojectitemid, as_dict=False):
		""" Load the basic details for display
		other bit will be loaded as required
		"""

		researchitem = ResearchProjectItems.query.get(researchprojectitemid)
		if researchitem:
			researchproject = ResearchProjects.query.get(researchitem.researchprojectid)
			# check to see if expired
			if researchproject.questionnaire_completion and researchproject.questionnaire_completion < datetime.date.today():
				return None

			seriesparentname = ""
			editionofname = ""
			supplementofname = ""
			relatedoutlets_view = ""
			seriesparentid = None
			editionofid = None
			supplementofid = None
			publishername = ""

			outlet = Outlet.query.get(researchitem.outletid)
			outletprofile = OutletProfile.query.get(researchitem.outletid)
			prmaxoutlettype = PRmaxOutletTypes.query.get(outlet.prmax_outlettypeid)
			research = session.query(ResearchDetails).filter(ResearchDetails.outletid == researchitem.outletid).all()
			if outletprofile:
				subtitle = outletprofile.subtitle
				incorporating = outletprofile.incorporating
				officialjournalof = outletprofile.officialjournalof
				editorialprofile = outletprofile.editorialprofile
				readership = outletprofile.readership
				productioncompanyid = outletprofile.productioncompanyid
				broadcasttimes = outletprofile.broadcasttimes
				frequencynotes = outletprofile.frequencynotes
				if outletprofile.seriesparentid:
					tmp = Outlet.query.get(outletprofile.seriesparentid)
					seriesparentname = tmp.outletname
				if outletprofile.supplementofid:
					tmp = Outlet.query.get(outletprofile.supplementofid)
					supplementofname = tmp.outletname
			else:
				subtitle = ""
				incorporating = ""
				officialjournalof = ""
				editorialprofile = outlet.profile
				readership = ""
				productioncompanyid = None
				broadcasttimes = ""
				frequencynotes = ""

			deskname = desktel = deskfax = deskmobile = deskemail = ""
			deskaddress1 = deskaddress2 = desktownname = deskcounty = deskpostcode = ""
			desktwitter = deskfacebook = desklinkedin = deskinstagram = ""

			if researchitem.outletdeskid:
				outletdesk = OutletDesk.query.get(researchitem.outletdeskid)
				outletdeskcomms = Communication.query.get(outletdesk.communicationid)
				if outletdeskcomms.addressid:
					outletdeskaddress = Address.query.get(outletdeskcomms.addressid)
					deskaddress1 = outletdeskaddress.address1
					deskaddress2 = outletdeskaddress.address2
					desktownname = outletdeskaddress.townname
					deskcounty = outletdeskaddress.county
					deskpostcode = outletdeskaddress.postcode
				deskname = outletdesk.deskname
				desktel = outletdeskcomms.tel
				deskfax = outletdeskcomms.fax
				deskmobile = outletdeskcomms.mobile
				deskemail = outletdeskcomms.email
				desktwitter = outletdeskcomms.twitter
				deskfacebook = outletdeskcomms.facebook
				desklinkedin = outletdeskcomms.linkedin
				deskinstagram = outletdeskcomms.instagram
				deskresearch = session.query(ResearchDetailsDesk).filter(ResearchDetailsDesk.outletdeskid == researchitem.outletdeskid).scalar()
			else:
				deskresearch = None
				outletdesk = None

			if outlet.publisherid:
				publishername = session.query(Publisher.publishername).filter(Publisher.publisherid == outlet.publisherid).scalar()

			communications = Communication.query.get(outlet.communicationid)
			address = Address.query.get(communications.addressid)
			language1id = None
			language2id = None
			for row in session.query(OutletLanguages).\
			    filter(OutletLanguages.outletid == outlet.outletid).all():
				if row.isprefered:
					language1id = row.languageid
				else:
					if language2id is None:
						language2id = row.languageid
					elif language1id is None:
						language1id = row.languageid

			outletpriceid = outlet.outletpriceid
			if not outletpriceid:
				outletpriceid = 1
			supplements = [row[1].outletname for row in session.query(OutletProfile, Outlet).\
			               join(Outlet, Outlet.outletid == OutletProfile.outletid).\
			               filter(OutletProfile.supplementofid == outlet.outletid).all()]

			editions = [row[1].outletname for row in session.query(OutletProfile, Outlet).\
			            join(Outlet, Outlet.outletid == OutletProfile.outletid).\
			            filter(OutletProfile.editionofid == outlet.outletid).all()]

			if outletprofile:
				relatedoutlets_view = "<br/>".join([row[1].outletname for row in session.query(OutletProfile, Outlet).\
				                                    join(Outlet, Outlet.outletid == OutletProfile.outletid).\
				                                    filter(OutletProfile.seriesparentid == outlet.outletid).all()])

			if outlet.is_freelance():
				contact = QuestionnairesGeneral.get_journalist_details(
				  outlet.primaryemployeeid,
				  -1,
				  "E")
			else:
				contact = None

			if as_dict:
				tel_display = communications.tel
				fax_display = communications.fax
				email_display = communications.email
				if researchitem.outletdeskid:
					tel_display = desktel
					fax_display = deskfax
					email_display = deskemail

				rdata = dict(outletname=outlet.outletname,
				             countryid=outlet.countryid,
				             www=outlet.www,
				             subtitle=subtitle,
				             incorporating=incorporating,
				             officialjournalof=officialjournalof,
				             address1=address.address1,
				             address2=address.address2,
				             townname=address.townname,
				             county=address.county,
				             postcode=address.postcode,
				             tel=tel_display,
				             fax=fax_display,
				             mobile=communications.mobile,
				             email=email_display,
				             twitter=communications.twitter,
				             facebook=communications.facebook,
				             linkedin=communications.linkedin,
				             instagram=communications.instagram,
				             outletpriceid=outletpriceid,
				             editorialprofile=editorialprofile,
				             readership=readership,
				             publisherid=outlet.publisherid,
				             circulationsourceid=outlet.circulationsourceid,
				             circulationauditdateid=outlet.circulationauditdateid,
				             frequencyid=outlet.frequencyid,
				             frequencynotes=frequencynotes,
				             circulation=outlet.circulation,
				             prmax_outlettypeid=outlet.prmax_outlettypeid,
				             productioncompanyid=productioncompanyid,
				             broadcasttimes=broadcasttimes,
				             seriesparentid=seriesparentid,
				             editionofid=editionofid,
				             supplementofid=supplementofid,
				             language1id=language1id,
				             language2id=language2id,
				             supplements=supplements,
				             editions=editions,
				             research_surname="",
				             research_firstname="",
				             research_prefix="",
				             research_email="",
				             research_tel="",
				             research_job_title="",
				             geognotes="",
				             right_person=True,
				             familyname="",
				             firstname="",
				             prefix="",
				             interests_org="",
				             interests="",
				             profile="",
				             blog=communications.blog,
				             relatedoutlets="",
				             publishername="",
				             deskname=deskname,
				             desktel=desktel,
				             deskfax=deskfax,
				             deskmobile=deskmobile,
				             deskemail=deskemail

				             )
				if  contact:
					rdata["familyname"] = contact["familyname"]
					rdata["firstname"] = contact["firstname"]
					rdata["prefix"] = contact["prefix"]
					rdata["interests_org"] = contact["interests_org"]
					rdata["interests"] = contact["interests"]

				if deskresearch:
					rdata["research_surname"] = deskresearch.surname
					rdata["research_firstname"] = deskresearch.firstname
					rdata["research_prefix"] = deskresearch.prefix
					rdata["research_email"] = deskresearch.email
					rdata["research_tel"] = deskresearch.tel
					rdata["research_job_title"] = deskresearch.job_title
				elif research:
					rdata["research_surname"] = research[0].surname
					rdata["research_firstname"] = research[0].firstname
					rdata["research_prefix"] = research[0].prefix
					rdata["research_email"] = research[0].email
					rdata["research_tel"] = research[0].tel
					rdata["research_job_title"] = research[0].job_title
				rdata["right_person"] = True

				if outletdesk:
					if deskaddress1:
						rdata["address1"] = deskaddress1
						rdata["address2"] = deskaddress2
						rdata["townname"] = desktownname
						rdata["county"] = deskcounty
						rdata["postcode"] = deskpostcode
					if desktwitter:
						rdata["twitter"] = desktwitter
					if deskfacebook:
						rdata["facebook"] = deskfacebook
					if desklinkedin:
						rdata["linkedin"] = desklinkedin
					if deskinstagram:
						rdata["instagram"] = deskinstagram

				return rdata
			else:
				countries = [dict(countryid=country.countryid,
				                  countryname=country.countryname)
				               for country in session.query(Countries).order_by(Countries.countryid).all()]
				outfields = {
				  "outletname" : outlet.outletname,
				  "countryid" : outlet.countryid,
				  "www" : outlet.www,
				  "circulationsourceid" : outlet.circulationsourceid,
				  "circulationauditdateid" : outlet.circulationauditdateid,
				  "publisherid" : outlet.publisherid,
				  "publishername" : publishername,
				  "frequencyid" : outlet.frequencyid,
				  "circulation" : outlet.circulation,
				  "prmax_outlettypeid" : outlet.prmax_outlettypeid,
				  "prmax_outletgroupid" : prmaxoutlettype.prmax_outletgroupid if prmaxoutlettype else "",
				  "outletpriceid" : outletpriceid,
				  "language1id" : language1id,
				  "language2id" : language2id,
				  "supplements" : supplements,
				  "editions" : editions,
				  "address1" : address.address1,
				  "address2" : address.address2,
				  "townname" : address.townname,
				  "county" : address.county,
				  "postcode" : address.postcode,
				  "email" : communications.email,
				  "mobile" :  communications.mobile,
				  "tel" : communications.tel,
				  "fax" : communications.fax,
				  "linkedin" : communications.linkedin,
				  "twitter" : communications.twitter,
				  "facebook" : communications.facebook,
				  "instagram" : communications.instagram,
				  "blog": communications.blog,
					"familyname" : "",
					"firstname": "",
					"prefix" : "",
				  "interests_org": "",
				  "interests": "",
				  "relatedoutlets": "",
				  "deskname": deskname,
				  "desktel": desktel,
				  "deskfax": deskfax,
				  "deskmobile": deskmobile,
				  "deskemail": deskemail}

				if deskresearch:
					outfields["research_surname"] = deskresearch.surname
					outfields["research_firstname"] = deskresearch.firstname
					outfields["research_prefix"] = deskresearch.prefix
					outfields["research_email"] = deskresearch.email
					outfields["research_tel"] = deskresearch.tel
					outfields["research_job_title"] = deskresearch.job_title
				elif research:
					outfields["research_surname"] = research[0].surname
					outfields["research_firstname"] = research[0].firstname
					outfields["research_prefix"] = research[0].prefix
					outfields["research_email"] = research[0].email
					outfields["research_tel"] = research[0].tel
					outfields["research_job_title"] = research[0].job_title
				outfields["right_person"] = True

				if contact:
					outfields["familyname"] = contact["familyname"]
					outfields["firstname"] = contact["firstname"]
					outfields["prefix"] = contact["prefix"]
					outfields["interests_org"] = contact["interests_org"]
					outfields["interests"] = contact["interests"]

				if outletprofile:
					outfields.update(outletprofile.__json__())
					profile = outletprofile.__json__()
				else:
					profile = OutletProfile.get_default_dict()
					profile["editorialprofile"] = editorialprofile

				# override interests
				if outlet.is_freelance():
					tmp = ", ".join([row.interestname for row in session.query(OutletInterestView).filter_by(
					  outletid=outlet.outletid,
					  interesttypeid=Constants.Interest_Type_Standard).all()])
					if tmp:
						outfields["interests_org"] = tmp

			if outletdesk:
				if deskaddress1:
					outfields["address1"] = deskaddress1
					outfields["address2"] = deskaddress2
					outfields["townname"] = desktownname
					outfields["county"] = deskcounty
					outfields["postcode"] = deskpostcode
				if desktwitter:
					outfields["twitter"] = desktwitter
				if deskfacebook:
					outfields["facebook"] = deskfacebook
				if desklinkedin:
					outfields["linkedin"] = desklinkedin
				if deskinstagram:
					outfields["instagram"] = deskinstagram

				# always from desk
				outfields["email"] = deskemail
				outfields["tel"] = desktel
				outfields["fax"] = deskfax


			# this is for the questionannair interface
			# need to get the changes as supplied by the user and mix them in
			for change in session.query(ResearchProjectChanges).\
			    filter(ResearchProjectChanges.researchprojectitemid == researchprojectitemid).\
			    filter(ResearchProjectChanges.employeeid == None).all():
				if change.fieldid in QuestionnairesGeneral.OVERRIDE_MAP:
					outfields[QuestionnairesGeneral.OVERRIDE_MAP[change.fieldid]] = change.value

			# fix profile record
			for key in profile:
				if key in outfields:
					profile[key] = outfields[key]

			return dict(
					outlet=dict(
			      outlet=dict(outletid=outlet.outletid,
				                outletname=outfields["outletname"],
				                countryid=outfields["countryid"],
				                www=outfields["www"],
				                outletpriceid=outfields["outletpriceid"],
				                circulationsourceid=outfields["circulationsourceid"],
				                circulationauditdateid=outfields["circulationauditdateid"],
				                publisherid=outfields["publisherid"],
				                frequencyid=outfields["frequencyid"],
				                circulation=outfields["circulation"],
				                prmax_outlettypeid=outfields["prmax_outlettypeid"],
				                prmax_outletgroupid=outfields["prmax_outletgroupid"],
				                supplements=outfields["supplements"],
				                editions=outfields["editions"],
				                isbroadcast=outlet.is_questionannaire_broadcast()
				                ),
				    publishername=outfields["publishername"],
				    language1id=outfields["language1id"],
				    language2id=outfields["language2id"],
				    relatedoutlets=outfields["relatedoutlets"],
				    research=dict(
				      research_surname=outfields.get("research_surname", ""),
				      research_firstname=outfields.get("research_firstname", ""),
				      research_prefix=outfields.get("research_prefix", ""),
				      research_email=outfields.get("research_email", ""),
				      research_tel=outfields.get("research_tel", ""),
				      research_job_title=outfields.get("research_job_title", ""),
				      right_person=outfields.get("right_person", "")),
					  address=dict(
					    address1=outfields["address1"],
					    address2=outfields["address2"],
					    townname=outfields["townname"],
					    county=outfields["county"],
					    postcode=outfields["postcode"]
					  ),
				    desk=dict(deskname=outfields["deskname"],
				              desktel=outfields["desktel"],
				              deskfax=outfields["deskfax"],
				              deskmobile=outfields["deskmobile"],
				              deskemail=outfields["deskemail"]),
					  communications=dict(
				      email=outfields["email"],
				      tel=outfields["tel"],
					    fax=outfields["fax"],
				      mobile=outfields["mobile"],
				      linkedin=outfields["linkedin"],
					    twitter=outfields["twitter"],
			            facebook=outfields["facebook"],
			            instagram=outfields["instagram"],
				      blog=outfields["blog"]),
					  outletprofile=dict(profile=profile,
				                       seriesparentname=seriesparentname,
				                       editionofname=editionofname,
				                       supplementofname=supplementofname
				                       )),
					questionnaireid=researchitem.researchprojectitemid,
				  geognotes=outfields.get("geognotes", ""),
				  expire_date=researchproject.questionnaire_completion.strftime("%d %B %Y") if researchproject.questionnaire_completion else "",
				  control=dict(countries=countries),
				  contact={"familyname" : outfields["familyname"],
				           "firstname" : outfields["firstname"],
				           "prefix" : outfields["prefix"],
				           "interests" : outfields["interests"],
				           "interests_org":  outfields["interests_org"],
				           },
				relatedoutlets_view=relatedoutlets_view)
		else:
			return None

	DetailsFields = (
	  ("outletname", Constants.Field_Outlet_Name),
	  ("subtitle", Constants.Field_Subtitle_name),
	  ("incorporating", Constants.Field_Incorporating),
	  ("officialjournalof", Constants.Field_Officejournalof),
	  ("address1", Constants.Field_Address_1),
	  ("address2", Constants.Field_Address_2),
	  ("townname", Constants.Field_Address_Town),
	  ("county", Constants.Field_Address_County),
	  ("postcode", Constants.Field_Address_Postcode),
	  ("tel", Constants.Field_Tel),
	  ("fax", Constants.Field_Fax),
	  ("www", Constants.Field_Address_Www),
	  ("email", Constants.Field_Email),
	  ("twitter", Constants.Field_Twitter),
	  ("facebook", Constants.Field_Facebook),
	  ("linkedin", Constants.Field_LinkedIn),
	  ("instagram", Constants.Field_Instagram),
		("countryid", Constants.Field_CountryId)
	)
	FreelanceFields = (
	  ("address1", Constants.Field_Address_1),
	  ("address2", Constants.Field_Address_2),
	  ("townname", Constants.Field_Address_Town),
	  ("county", Constants.Field_Address_County),
	  ("postcode", Constants.Field_Address_Postcode),
	  ("tel", Constants.Field_Tel),
	  ("fax", Constants.Field_Fax),
	  ("mobile", Constants.Field_Mobile),
	  ("www", Constants.Field_Address_Www),
	  ("blog", Constants.Field_Blog),
	  ("email", Constants.Field_Email),
	  ("twitter", Constants.Field_Twitter),
	  ("facebook", Constants.Field_Facebook),
	  ("linkedin", Constants.Field_LinkedIn),
	  ("instagram", Constants.Field_Instagram),
		("countryid", Constants.Field_CountryId),
	  ("familyname", Constants.Field_FamilyName),
	  ("firstname", Constants.Field_Firstname),
	  ("prefix", Constants.Field_Prefix),
	  ("interests", Constants.Field_Interest),
	  ("editorialprofile", Constants.Field_Profile)
	)
	DESKFIELDS = (
		  ("deskname", Constants.Field_DeskName),
		  ("address1", Constants.Field_Address_1),
		  ("address2", Constants.Field_Address_2),
		  ("townname", Constants.Field_Address_Town),
		  ("county", Constants.Field_Address_County),
		  ("postcode", Constants.Field_Address_Postcode),
		  ("tel", Constants.Field_Tel),
		  ("fax", Constants.Field_Fax),
		  ("email", Constants.Field_Email),
		  ("twitter", Constants.Field_Twitter),
		  ("facebook", Constants.Field_Facebook),
	      ("linkedin", Constants.Field_LinkedIn),
	      ("instagram", Constants.Field_Instagram),
		  ("countryid", Constants.Field_CountryId)
		)

	@staticmethod
	def update_question_details(params):
		""" Update the details """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)
			QuestionnairesGeneral.common_save_changes(
			  rpi,
			  QuestionnairesGeneral.DetailsFields,
			  params)
			transaction.commit()
		except:
			LOGGER.exception("update_question_details")
			transaction.rollback()
			raise

	@staticmethod
	def update_question_desk(params):
		""" Update the details """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)

			QuestionnairesGeneral.common_save_changes(
				  rpi,
				  QuestionnairesGeneral.DESKFIELDS,
				  params)

			transaction.commit()
		except:
			LOGGER.exception("update_question_desk")
			transaction.rollback()
			raise

	@staticmethod
	def update_freelance_details(params):
		""" Update the details """


		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)
			QuestionnairesGeneral.common_save_changes(
			  rpi,
			  QuestionnairesGeneral.FreelanceFields,
			  params)
			transaction.commit()
		except:
			LOGGER.exception("update_freelance_details")
			transaction.rollback()
			raise

	RelatedFields = (
	  ("research_surname", Constants.Field_Research_Surname),
	  ("research_firstname", Constants.Field_Research_Firstname),
	  ("research_prefix", Constants.Field_Research_Prefix),
	  ("research_email", Constants.Field_Research_Email),
	  ("research_tel", Constants.Field_Research_Tel),
	  ("research_job_title", Constants.Field_Research_Job_Title),
	  ("right_person", Constants.Field_Research_Right_Person)

	)
	@staticmethod
	def update_related_outlets(params):
		""" update_related_outlets """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)
			QuestionnairesGeneral.common_save_changes(
			 rpi,
			 QuestionnairesGeneral.RelatedFields,
			params)

			# at this point we need to loog the right_person if check
			if params["right_person"]:
				QuestionnairesGeneral.log_right_person(params)

			transaction.commit()
		except:
			LOGGER.exception("update_related_outlets")
			transaction.rollback()
			raise

	@staticmethod
	def update_coverage(params):
		"""Update coverage """

		geognotes = params.get("geognotes")
		if not geognotes:
			return

		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)

			rpic = session.query(ResearchProjectChanges).\
			  filter(ResearchProjectChanges.fieldid == Constants.Field_Coverage).\
			  filter(ResearchProjectChanges.researchprojectitemid == rpi.researchprojectitemid).scalar()
			if rpic:
				rpic.value = geognotes
				rpic.changed = datetime.datetime.now()
			else:
				session.add(ResearchProjectChanges(fieldid=Constants.Field_Coverage,
				                                   value=geognotes,
				                                   researchprojectitemid=rpi.researchprojectitemid))
			transaction.commit()
		except:
			LOGGER.exception("update_coverage")
			transaction.rollback()
			raise


	@staticmethod
	def common_rpi_settings(params):
		""" commpon get and set for questionaiire """
		rpi = ResearchProjectItems.query.get(params["questionnaireid"])
		rpi.researchprojectstatusid = Constants.Research_Project_Status_Customer_Completed
		rpi.lastationdate = datetime.datetime.now()

		# update the reserch details to set last customeractiondate
		if rpi.outletdeskid:
			research = session.query(ResearchDetailsDesk).filter(ResearchDetailsDesk.outletdeskid == rpi.outletdeskid).scalar()
		else:
			research = session.query(ResearchDetails).filter(ResearchDetails.outletid == rpi.outletid).scalar()

		research.last_customer_questionaire_action = datetime.datetime.now()

		return rpi

	@staticmethod
	def common_save_changes(rpi, fields_list, params):
		"""comment save details"""
		current = QuestionnairesGeneral.get_question_details(rpi.researchprojectitemid, True)

		for field in fields_list:
			rpic = session.query(ResearchProjectChanges).\
			  filter(ResearchProjectChanges.fieldid == field[1]).\
			  filter(ResearchProjectChanges.researchprojectitemid == rpi.researchprojectitemid).\
			  filter(ResearchProjectChanges.employeeid == None).scalar()
			# changed
			if params.get(field[0], None) != current[field[0]]:
				if rpic:
					rpic.value = params[field[0]]
					rpic.changed = datetime.datetime.now()
				else:
					session.add(ResearchProjectChanges(
					  fieldid=field[1],
					  value=params[field[0]],
					  researchprojectitemid=rpi.researchprojectitemid))
			# exists but same therefore delete
			elif rpic:
				session.delete(rpic)

	@staticmethod
	def load_user_feedback(params):
		"""load data dor uset chnaged """

		projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])

		retdata = Outlet.getForEdit(projectitem.outletid, -1)
		if projectitem.outletdeskid:
			research = session.query(ResearchDetailsDesk).filter(ResearchDetailsDesk.outletdeskid == projectitem.outletdeskid).all()
		else:
			research = session.query(ResearchDetails).filter(ResearchDetails.outletid == projectitem.outletid).all()

		if research:
			retdata["research"] = research[0]
		else:
			retdata["research"] = dict(surname="", firstname="",
			                           prefix="", email="", tel="", job_title="")

		if projectitem.outletdeskid:
			desk = OutletDesk.query.get(projectitem.outletdeskid)
			deskcomms = Communication.query.get(desk.communicationid)
			if deskcomms.addressid:
				deskaddress = Address.query.get(deskcomms.addressid)
			else:
				deskaddress = None
			retdata["outlet"]["desk"] = dict(desk=desk, comms=deskcomms, address=deskaddress)

		retdata["user_changes"] = session.query(ResearchProjectChanges).\
		  filter(ResearchProjectChanges.researchprojectitemid == params["researchprojectitemid"]).\
			filter(ResearchProjectChanges.employeeid == None).all()
		prefix = firstname = familyname = ""
		for change in retdata["user_changes"]:
			if change.fieldid == Constants.Field_FamilyName:
				familyname = change.value
			if change.fieldid == Constants.Field_Firstname:
				firstname = change.value
			if change.fieldid == Constants.Field_Prefix:
				prefix = change.value

		retdata["projectitem"] = projectitem
		retdata["primary"]["change_name"] = "%s %s %s" % (prefix, firstname, familyname)

		return retdata

	@staticmethod
	def save_user_feedback(params):
		""" resarch system update the main part of a cotact record """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])

			outlet = Outlet.query.get(projectitem.outletid)
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)
			profile = OutletProfile.query.get(projectitem.outletid)
			if not profile:
				profile = OutletProfile(outletid=projectitem.outletid)


			# add the audit trail header record
			activity = Activity(
			  reasoncodeid=Constants.ReasonCode_Questionnaire,
			  reason="",
			  objecttypeid=Constants.Object_Type_Outlet,
			  objectid=outlet.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outlet.outletid,
			  parentobjecttypeid=Constants.Object_Type_Outlet
			)
			session.add(activity)
			session.flush()
			# set source to us
			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			ActivityDetails.AddChange(outlet.outletname, params['outletname'], activity.activityid, Constants.Field_Outlet_Name)
			ActivityDetails.AddChange(outlet.sortname, params['sortname'], activity.activityid, Constants.Field_Outlet_SortName)
			ActivityDetails.AddChange(outlet.www, params['www'], activity.activityid, Constants.Field_Address_Www)
			ActivityDetails.AddChange(outlet.outletpriceid, params['outletpriceid'], activity.activityid, Constants.Field_Cost)
			ActivityDetails.AddChange(outlet.countryid, params['countryid'], activity.activityid, Constants.Field_CountryId)
			ActivityDetails.AddChange(outlet.frequencyid, params['frequencyid'], activity.activityid, Constants.Field_Frequency)
			ActivityDetails.AddChange(outlet.circulationauditdateid, params['circulationauditdateid'], activity.activityid, Constants.Field_Outlet_Circulation_Dates)
			ActivityDetails.AddChange(outlet.circulationsourceid, params['circulationsourceid'], activity.activityid, Constants.Field_Outlet_Circulation_Source)
			ActivityDetails.AddChange(outlet.circulation, params['circulation'], activity.activityid, Constants.Field_Circulation)

			ActivityDetails.AddChange(address.address1, params['address1'], activity.activityid, Constants.Field_Address_1)
			ActivityDetails.AddChange(address.address2, params['address2'], activity.activityid, Constants.Field_Address_2)
			ActivityDetails.AddChange(address.townname, params['townname'], activity.activityid, Constants.Field_Address_Town)
			ActivityDetails.AddChange(address.county, params['county'], activity.activityid, Constants.Field_Address_County)
			ActivityDetails.AddChange(address.postcode, params['postcode'], activity.activityid, Constants.Field_Address_Postcode)

			ActivityDetails.AddChange(comm.email, params['email'], activity.activityid, Constants.Field_Email)
			ActivityDetails.AddChange(comm.tel, params['tel'], activity.activityid, Constants.Field_Tel)
			ActivityDetails.AddChange(comm.fax, params['fax'], activity.activityid, Constants.Field_Fax)
			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)

			ActivityDetails.AddChange(profile.subtitle, params['subtitle'], activity.activityid, Constants.Field_Subtitle_name)
			ActivityDetails.AddChange(profile.officialjournalof, params['officialjournalof'], activity.activityid, Constants.Field_Officejournalof)
			ActivityDetails.AddChange(profile.incorporating, params['incorporating'], activity.activityid, Constants.Field_Incorporating)
			ActivityDetails.AddChange(profile.frequencynotes, params['frequencynotes'], activity.activityid, Constants.Field_Frequency_Notes)

			outlet.outletname = params['outletname']
			outlet.sortname = params['sortname']
			outlet.www = params['www']
			outlet.countryid = params["countryid"]
			outlet.outletpriceid = params['outletpriceid']
			outlet.frequencyid = params['frequencyid']
			outlet.circulationauditdateid = params["circulationauditdateid"]
			outlet.circulationsourceid = params["circulationsourceid"]
			outlet.circulation = params['circulation']

			address.address1 = params['address1']
			address.address2 = params['address2']
			address.townname = params['townname']
			address.county = params['county']
			address.postcode = params['postcode']

			comm.email = params['email']
			comm.tel = params['tel']
			comm.fax = params['fax']
			comm.facebook = params['facebook']
			comm.twitter = params['twitter']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']

			profile.subtitle = params['subtitle']
			profile.officialjournalof = params['officialjournalof']
			profile.incorporating = params['incorporating']
			profile.frequencynotes = params['frequencynotes']

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(
			  Outlet,
			  projectitem.outletid,
			  Constants.Cache_Outlet_Objects)

			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=projectitem.outletid))

			ResearchDetails.set_research_modified(outlet.outletid)

			transaction.commit()
		except:
			LOGGER.exception("save_user_feedback")
			transaction.rollback()
			raise

	@staticmethod
	def save_profile_feedback(params):
		""" resarch system update the main part of a cotact record """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])

			outlet = Outlet.query.get(projectitem.outletid)
			profile = OutletProfile.query.get(projectitem.outletid)
			if not profile:
				profile = OutletProfile(outletid=projectitem.outletid)

			# add the audit trail header record
			activity = Activity(
			  reasoncodeid=Constants.ReasonCode_Questionnaire,
			  reason="",
			  objecttypeid=Constants.Object_Type_Outlet,
			  objectid=outlet.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outlet.outletid,
			  parentobjecttypeid=Constants.Object_Type_Outlet
			)
			session.add(activity)
			session.flush()
			# set source to us
			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			ActivityDetails.AddChange(profile.readership, params['readership'], activity.activityid, Constants.Field_Readership)
			ActivityDetails.AddChange(profile.editorialprofile, params['editorialprofile'], activity.activityid, Constants.Field_Profile)
			ActivityDetails.AddChange(profile.nrsreadership, params['nrsreadership'], activity.activityid, Constants.Field_Nrsreadership)
			ActivityDetails.AddChange(profile.jicregreadership, params['jicregreadership'], activity.activityid, Constants.Field_Jicregreadership)
			ActivityDetails.AddChange(profile.deadline, params['deadline'], activity.activityid, Constants.Field_Deadline)
			ActivityDetails.AddChange(profile.broadcasttimes, params['broadcasttimes'], activity.activityid, Constants.Field_Broadcasttimes)
			ActivityDetails.AddChange(outlet.publisherid, params['publisherid'], activity.activityid, Constants.Field_Publisher)


			outlet.publisherid = params['publisherid']

			profile.readership = params['readership']
			profile.editorialprofile = params['editorialprofile']
			profile.nrsreadership = params['nrsreadership']
			profile.jicregreadership = params['jicregreadership']
			profile.deadline = params['deadline']
			profile.broadcasttimes = params['broadcasttimes']

			OutletLanguages.update(outlet.outletid,
			                       params["language1id"],
			                       params["language2id"],
			                       activity)

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(
			  Outlet,
			  projectitem.outletid,
			  Constants.Cache_Outlet_Objects)

			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=outlet.outletid))

			ResearchDetails.set_research_modified(outlet.outletid)

			transaction.commit()
		except:
			LOGGER.exception("save_profile_feedback")
			transaction.rollback()
			raise

	@staticmethod
	def save_feedback_coding(params):
		"""Save coding feedback"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])

			outlet = Outlet.query.get(projectitem.outletid)
			profile = OutletProfile.query.get(projectitem.outletid)
			if not profile:
				profile = OutletProfile(outletid=projectitem.outletid)


			# add the audit trail header record
			activity = Activity(
			  reasoncodeid=Constants.ReasonCode_Questionnaire,
			  reason="",
			  objecttypeid=Constants.Object_Type_Outlet,
			  objectid=outlet.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outlet.outletid,
			  parentobjecttypeid=Constants.Object_Type_Outlet
			)
			session.add(activity)
			session.flush()

			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			ActivityDetails.AddChange(outlet.prmax_outlettypeid, params['prmax_outlettypeid'], activity.activityid, Constants.Field_Outlet_Type)

			outlet.prmax_outlettypeid = params['prmax_outlettypeid']

			profile = OutletProfile.query.get(outlet.outletid)
			if not profile:
				profile = OutletProfile(outletid=outlet.outletid)
				session.add(profile)

			ActivityDetails.AddChange(profile.seriesparentid, params.get("seriesparentid", None), activity.activityid, Constants.Field_Series_Parent)
			ActivityDetails.AddChange(profile.supplementofid, params.get("supplementofid", None), activity.activityid, Constants.Field_Supplement_Of)

			profile.seriesparentid = params.get("seriesparentid", None)
			profile.supplementofid = params.get("supplementofid", None)

			Outlet.do_outlet_interests(outlet, activity, params)

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 outlet.outletid,
			                                 Constants.Cache_Outlet_Objects)

			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=outlet.outletid))

			ResearchDetails.set_research_modified(outlet.outletid)

			transaction.commit()
		except:
			LOGGER.exception("save_feedback_coding")
			transaction.rollback()
			raise

	@staticmethod
	def save_feedback_coverage(params):
		"""Save coverage feedback"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])

			outlet = Outlet.query.get(projectitem.outletid)

			# add the audit trail header record
			activity = Activity(
			  reasoncodeid=Constants.ReasonCode_Questionnaire,
			  reason="",
			  objecttypeid=Constants.Object_Type_Outlet,
			  objectid=outlet.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outlet.outletid,
			  parentobjecttypeid=Constants.Object_Type_Outlet
			)
			session.add(activity)
			session.flush()

			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			Outlet.do_outlet_coverage(outlet, activity, params)

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 outlet.outletid,
			                                 Constants.Cache_Outlet_Objects)

			ResearchDetails.set_research_modified(outlet.outletid)

			transaction.commit()
		except:
			LOGGER.exception("save_feedback_coverage")
			transaction.rollback()
			raise

	@staticmethod
	def save_feedback_research(params):
		"""Save coverage feedback"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])

			if projectitem.outletdeskid:
				research = session.query(ResearchDetailsDesk).filter(ResearchDetailsDesk.outletdeskid == projectitem.outletdeskid).scalar()
				if not research:
					research = ResearchDetails(outletdeskid=projectitem.outletdeskid)
					session.add(research)
				else:
					research.surname = params["surname"]
					research.firstname = params["firstname"]
					research.prefix = params["prefix"]
					research.email = params["email"]
					research.tel = params["tel"]
					research.job_title = params["job_title"]
			else:
				research = session.query(ResearchDetails).filter(ResearchDetails.outletid == projectitem.outletid).all()
				if not research:
					research = ResearchDetails(outletid=projectitem.outletid)
					session.add(research)
				else:
					research = research[0]
					research.surname = params["surname"]
					research.firstname = params["firstname"]
					research.prefix = params["prefix"]
					research.email = params["email"]
					research.tel = params["tel"]
					research.job_title = params["job_title"]

			transaction.commit()
		except:
			LOGGER.exception("save_feedback_research")
			transaction.rollback()
			raise


	Journalists_list = """
	SELECT 'A'|| chi.researchprojectchangeid AS key,
		'A' AS typeid,
	  chi.researchprojectchangeid AS objectid,
		JSON_ENCODE(ContactName(Json_Extract(chi.value,'prefix'),Json_Extract(chi.value,'firstname'),'',Json_Extract(chi.value,'familyname'),'')) AS contactname,
	  JSON_ENCODE(Json_Extract(chi.value,'job_title')) AS job_title,
	  Json_Extract(chi.value,'firstname') AS familyname
	  FROM research.researchprojectchanges AS chi WHERE researchprojectitemid = :researchprojectitemid AND actiontypeid = 1 AND fieldid = 1
	UNION
	SELECT
		'E' || e.employeeid AS keyid,
	  'E' AS typeid,
		e.employeeid  AS objectid,
		JSON_ENCODE(ContactName(
	  COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid = :researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 21),c.prefix),
	  COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid = :researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 22),c.firstname),
	  c.middlename,
	  COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid = :researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 23),c.familyname),
	  c.suffix)) AS contactname,
	  JSON_ENCODE(COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid = :researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 2),e.job_title)) AS job_title,
	  COALESCE((SELECT value FROM research.researchprojectchanges AS chi WHERE researchprojectitemid = :researchprojectitemid AND chi.employeeid = e.employeeid AND actiontypeid = 2 AND fieldid = 23),c.familyname) AS familyname
		FROM employees AS e
		LEFT OUTER JOIN contacts AS c ON e.contactid = c.contactid
	  """

	Journalists_count = """
	SELECT COUNT(*)
	  FROM research.researchprojectchanges AS chi WHERE  researchprojectitemid = :researchprojectitemid AND actiontypeid = 1 AND fieldid = 1
	UNION
	SELECT COUNT(*) FROM employees AS e """

	Journalists_whereused = """ WHERE
		e.outletid = :outletid AND
		e.customerid = -1 AND
	  e.prmaxstatusid = 1 AND e.employeeid NOT IN (select employeeid FROM research.researchprojectchanges WHERE researchprojectitemid = :researchprojectitemid AND actiontypeid = 3)"""

	@staticmethod
	def list_journalists(params):
		"""List of journalists """

		if "outletid" in params:
			whereclause = QuestionnairesGeneral.Journalists_whereused
			params["outletid"] = int(params["outletid"])
			params["researchprojectitemid"] = int(params["researchprojectitemid"])
			outletdeskid = session.query(ResearchProjectItems.outletdeskid).\
			  filter(ResearchProjectItems.researchprojectitemid == params["researchprojectitemid"]).scalar()
			if outletdeskid:
				whereclause += " AND e.outletdeskid=:outletdeskid"
				params["outletdeskid"] = outletdeskid

			if params.get("sortfield", "") == "contactname":
				params["sortfield"] = "familyname"

			return BaseSql.get_rest_page_base(
			  params,
			  'keyid',
			  'familyname',
			  QuestionnairesGeneral.Journalists_list + whereclause + BaseSql.Standard_View_Order,
			  (QuestionnairesGeneral.Journalists_count + whereclause, BaseSql.sum_of_rows),
			  Outlet)
		else:
			return dict(identifier="keyid",
			             numRows=0,
			             items=[])

	Coverage_list = """
	SELECT g.geographicalid,
		g.geographicalname,
	  glt.geographicallookupdescription
		FROM outletcoverage AS oc
	  JOIN internal.geographical AS g ON g.geographicalid = oc.geographicalid
	  JOIN internal.geographicallookuptypes AS glt ON glt.geographicallookuptypeid = g.geographicallookuptypeid
	  """

	Coverage_count = """SELECT COUNT(*) FROM outletcoverage AS oc """
	Coverage_whereused = """ WHERE
		oc.outletid = :outletid AND
		oc.customerid = -1 """

	@staticmethod
	def list_coverage(params):
		"""List of journalists """

		if "outletid" in params:
			params["outletid"] = int(params["outletid"])

			return BaseSql.get_rest_page_base(
			  params,
			  'geographicalid',
			  'geographicalname',
			  QuestionnairesGeneral.Coverage_list + QuestionnairesGeneral.Coverage_whereused + BaseSql.Standard_View_Order,
			  QuestionnairesGeneral.Coverage_count + QuestionnairesGeneral.Coverage_whereused,
			  Outlet)
		else:
			return dict(identifier="geographicalid",
			             numRows=0,
			             items=[])

	@staticmethod
	def get_journalist_details(objectid, researchprojectitemid, typeid):
		"""get details for edit"""
		fields = dict(
		  objectid=objectid,
		  prefix="",
		  firstname="",
		  familyname="",
		  job_title="",
		  tel="",
		  fax="",
		  mobile="",
		  email="",
		  twitter="",
		  facebook="",
		  linkedin="",
		  instagram="",
		  address1="",
		  address2="",
		  county="",
		  postcode="",
		  townname="",
			alt_address=False,
		  interests="",
		  interests_org="",
		  typeid=typeid)

		if typeid == "E":
			employee = Employee.query.get(objectid)
			fields["job_title"] = employee.job_title

			if employee.communicationid:
				comm = Communication.query.get(employee.communicationid)
				fields["tel"] = comm.tel
				fields["fax"] = comm.fax
				fields["mobile"] = comm.mobile
				fields["email"] = comm.email
				fields["twitter"] = comm.twitter
				fields["facebook"] = comm.facebook
				fields["linkedin"] = comm.linkedin
				fields["instagram"] = comm.instagram
				if comm.addressid:
					address = Address.query.get(comm.addressid)
					fields["address1"] = address.address1
					fields["address2"] = address.address2
					fields["county"] = address.county
					fields["postcode"] = address.postcode
					fields["townname"] = address.townname
					fields["alt_address"] = True

			if employee.contactid:
				contact = Contact.query.get(employee.contactid)
				fields["prefix"] = contact.prefix
				fields["firstname"] = contact.firstname
				fields["familyname"] = contact.familyname

			fields["interests_org"] = ", ".join([row.interestname for row in session.query(EmployeeInterestView).filter_by(
			  employeeid=objectid,
			  interesttypeid=Constants.Interest_Type_Standard).all()])

			for change in session.query(ResearchProjectChanges).\
			    filter(ResearchProjectChanges.researchprojectitemid == researchprojectitemid).\
			    filter(ResearchProjectChanges.employeeid == objectid).all():
				if change.fieldid == Constants.Field_Prefix:
					fields["prefix"] = change.value
				elif change.fieldid == Constants.Field_Firstname:
					fields["firstname"] = change.value
				elif change.fieldid == Constants.Field_FamilyName:
					fields["familyname"] = change.value
				elif change.fieldid == Constants.Field_Job_Title:
					fields["job_title"] = change.value
				elif change.fieldid == Constants.Field_Tel:
					fields["tel"] = change.value
				elif change.fieldid == Constants.Field_Fax:
					fields["fax"] = change.value
				elif change.fieldid == Constants.Field_Mobile:
					fields["mobile"] = change.value
				elif change.fieldid == Constants.Field_Email:
					fields["email"] = change.value
				elif change.fieldid == Constants.Field_Twitter:
					fields["twitter"] = change.value
				elif change.fieldid == Constants.Field_Facebook:
					fields["facebook"] = change.value
				elif change.fieldid == Constants.Field_LinkedIn:
					fields["linkedin"] = change.value
				elif change.fieldid == Constants.Field_Instagram:
					fields["instagram"] = change.value
				elif change.fieldid == Constants.Field_Address_1:
					fields["address1"] = change.value
				elif change.fieldid == Constants.Field_Address_2:
					fields["address2"] = change.value
				elif change.fieldid == Constants.Field_Address_Town:
					fields["townname"] = change.value
				elif change.fieldid == Constants.Field_Address_County:
					fields["county"] = change.value
				elif change.fieldid == Constants.Field_Address_Postcode:
					fields["postcode"] = change.value
				elif change.fieldid == Constants.Field_No_Address:
					fields["alt_address"] = change.value
				elif change.fieldid == Constants.Field_Interest:
					fields["interests"] = change.value
		else:
			# this is fields for a new journalist
			rpc = session.query(ResearchProjectChanges).\
			  filter(ResearchProjectChanges.researchprojectchangeid == objectid).scalar()
			if rpc:
				fields = simplejson.loads(rpc.value)
				fields["objectid"] = objectid
				fields["typeid"] = 'A'
				fields["interests_org"] = ""

		return fields

	Contact_Details_Fields = (
	  ("prefix", Constants.Field_Prefix, cmp, None),
	  ("firstname", Constants.Field_Firstname, cmp, None),
	  ("familyname", Constants.Field_FamilyName, cmp, None),
	  ("job_title", Constants.Field_Job_Title, cmp, None),
	  ("tel", Constants.Field_Tel, cmp, None),
	  ("fax", Constants.Field_Fax, cmp, None),
	  ("mobile", Constants.Field_Mobile, cmp, None),
	  ("email", Constants.Field_Email, cmp, None),
	  ("twitter", Constants.Field_Twitter, cmp, None),
	  ("facebook", Constants.Field_Facebook, cmp, None),
	  ("linkedin", Constants.Field_LinkedIn, cmp, None),
	  ("instagram", Constants.Field_Instagram, cmp, None),
	  ("address1", Constants.Field_Address_1, cmp, None),
	  ("address2", Constants.Field_Address_2, cmp, None),
	  ("townname", Constants.Field_Address_Town, cmp, None),
	  ("county", Constants.Field_Address_County, cmp, None),
	  ("postcode", Constants.Field_Address_Postcode, cmp, None),
	  ("alt_address", Constants.Field_No_Address, cmp, None),
	  ("interests", Constants.Field_Interest, cmp, None)
	  )

	@staticmethod
	def save_feedback_contact(params):
		""" Capture contact changes  """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)

			if params["typeid"] == "E":
				current = QuestionnairesGeneral.get_journalist_details(
				  params["objectid"],
				  params["questionnaireid"],
				  params["typeid"])

				for field in QuestionnairesGeneral.Contact_Details_Fields:
					if field[2](params[field[0]], current[field[0]]) != 0:
						# chnage
						rpic = session.query(ResearchProjectChanges).\
							filter(ResearchProjectChanges.fieldid == field[1]).\
							filter(ResearchProjectChanges.researchprojectitemid == rpi.researchprojectitemid).\
						  filter(ResearchProjectChanges.employeeid == params["objectid"]).scalar()
						if field[3]:
							value = simplejson.dumps(params[field[0]])
						else:
							value = params[field[0]]
						if rpic:
							rpic.value = value
							rpic.changed = datetime.datetime.now()
						else:
							session.add(ResearchProjectChanges(
								fieldid=field[1],
								value=value,
								researchprojectitemid=rpi.researchprojectitemid,
								employeeid=params["objectid"]))
			else:
				rpc = session.query(ResearchProjectChanges).\
				  filter(ResearchProjectChanges.researchprojectchangeid == params["objectid"]).scalar()
				rpc.value = simplejson.dumps(params)

			transaction.commit()
		except:
			LOGGER.exception("save_feedback_contact")
			transaction.rollback()
			raise

	Details_Profile = (
	  ("editorialprofile", Constants.Field_Profile),
	  ("readership", Constants.Field_Readership),
	  ("publisherid", Constants.Field_Publisher),
	  ("language1id", Constants.Field_Language1),
	  ("language2id", Constants.Field_Language2),
	  ("productioncompanyid", Constants.Field_Productioncompany),
	  ("broadcasttimes", Constants.Field_Broadcasttimes),
	  ("circulation", Constants.Field_Circulation),
	  ("circulationsourceid", Constants.Field_Outlet_Circulation_Source),
	  ("circulationauditdateid", Constants.Field_Outlet_Circulation_Dates),
	  ("frequencyid", Constants.Field_Frequency),
	  ("frequencynotes", Constants.Field_Frequency_Notes),
	  ("outletpriceid", Constants.Field_Cost),
	  ("relatedoutlets", Constants.Field_RelatedOutlets),
	  ("publishername", Constants.Field_PublisherName)
	  )

	@staticmethod
	def update_profile(params):
		""" profile details """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			rpi = QuestionnairesGeneral.common_rpi_settings(params)
			QuestionnairesGeneral.common_save_changes(
			  rpi,
			  QuestionnairesGeneral.Details_Profile,
			params)
			transaction.commit()
		except:
			LOGGER.exception("update_contact")
			transaction.rollback()
			raise

	@staticmethod
	def add_contact(params):
		""" Add a new contact from the questionannaire too the system """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			# get and update questionannaire details
			rpi = QuestionnairesGeneral.common_rpi_settings(params)

			fields = {}
			for field in QuestionnairesGeneral.Contact_Details_Fields:
				fields[field[0]] = params[field[0]]

			chi = ResearchProjectChanges(
			  researchprojectitemid=rpi.researchprojectitemid,
			  actiontypeid=Constants.Research_Reason_Add,
			  fieldid=Constants.Field_Contactid,
			  value=simplejson.dumps(fields)
			  )
			session.add(chi)
			session.flush()

			transaction.commit()

			familyname = " ".join((params["prefix"], params["firstname"], params["familyname"]))
			familyname = familyname.replace("  ", " ")

			return dict(
			  key='A%d' % chi.researchprojectchangeid,
			  typeid='A',
			  objectid=chi.researchprojectchangeid,
			  contactname=familyname,
			  job_title=params["job_title"])
		except:
			LOGGER.exception("add_contact")
			transaction.rollback()
			raise

	@staticmethod
	def remove_contact(params):
		""" Capture contact changes  """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			if params["typeid"] == "E":
				rpi = QuestionnairesGeneral.common_rpi_settings(params)

				rpic = session.query(ResearchProjectChanges).\
				  filter(ResearchProjectChanges.fieldid == None).\
				  filter(ResearchProjectChanges.employeeid == params["objectid"]).\
				  filter(ResearchProjectChanges.researchprojectitemid == rpi.researchprojectitemid).scalar()

				if not rpic:
					session.add(ResearchProjectChanges(
					  researchprojectitemid=rpi.researchprojectitemid,
					  actiontypeid=Constants.Research_Record_Delete,
					  employeeid=params["objectid"]))
			else:
				rpc = session.query(ResearchProjectChanges).\
				  filter(ResearchProjectChanges.researchprojectchangeid == params["objectid"]).scalar()
				session.delete(rpc)

			transaction.commit()
		except:
			LOGGER.exception("remove_contact")
			transaction.rollback()
			raise

	@staticmethod
	def get_journalist_row(objectid, typeid, questionnaireid):
		""" get display row """

		if typeid == 'E':
			overrides = {}
			for record in session.query(ResearchProjectChanges).\
			    filter(ResearchProjectChanges.researchprojectitemid == questionnaireid).\
					filter(ResearchProjectChanges.employeeid == objectid).\
			    filter(ResearchProjectChanges.fieldid.in_((Constants.Field_FamilyName,
			                                              Constants.Field_Prefix,
			                                              Constants.Field_Firstname,
			                                              Constants.Field_Job_Title))).all():
				overrides[record.fieldid] = record

			employee = Employee.query.get(objectid)
			if employee.contactid:
				contact = Contact.query.get(employee.contactid)
				contact_fields = [contact.prefix, contact.firstname, contact.middlename, contact.familyname, contact.suffix]
			else:
				contact_fields = ["", "", "", "", "", ""]

			if Constants.Field_FamilyName in  overrides:
				contact_fields[3] = overrides[Constants.Field_FamilyName].value
			if Constants.Field_Prefix in overrides:
				contact_fields[0] = overrides[Constants.Field_Prefix].value
			if Constants.Field_Firstname in overrides:
				contact_fields[1] = overrides[Constants.Field_Firstname].value

			contactname = " ".join([field for field in contact_fields if field != None and len(field)]).strip()
			job_title = overrides[Constants.Field_Job_Title].value if Constants.Field_Job_Title in overrides else employee.job_title
		else:
			rpc = session.query(ResearchProjectChanges).\
			  filter(ResearchProjectChanges.researchprojectchangeid == objectid).scalar()
			fields = simplejson.loads(rpc.value)
			contactname = "%s %s %s" % (fields["prefix"], fields["firstname"], fields["familyname"])
			job_title = fields["job_title"]

		return dict(key='%s%d' % (typeid, objectid),
		            typeid=typeid,
		            objectid=objectid,
		            contactname=contactname,
		            job_title=job_title)


	@staticmethod
	def delete_employee_feedback(params):
		"""Delete an Employee"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			if params["objectid"][0] in ('A', 'D'):
				rpc = ResearchProjectChanges.query.get(int(params["objectid"][1:]))
				rpc.applied = True
				employee = Employee.query.get(rpc.employeeid)
			elif params["objectid"][0] == 'E':
				employee = Employee.query.get(int(params["objectid"][1:]))

			if params["delete_option"] == 2:
				comm = Communication.query.get(employee.communicationid)
				if comm:
					comm.email = ""
					comm.tel = ""
					comm.addressid = None
					comm.fax = ""
					comm.mobile = ""
					comm.webphone = ""
					comm.twitter = ""
					comm.facebook = ""
					comm.linkedin = ""
					comm.instagram = ""
					comm.blog = ""
				employee.contactid = None

				activity = Activity(reasoncodeid=Constants.ReasonCode_Questionnaire,
				                    reason="",
				                    objecttypeid=Constants.Object_Type_Employee,
				                    objectid=employee.employeeid,
				                    actiontypeid=Constants.Research_Record_Update,
				                    userid=params['userid'],
				                    parentobjectid=employee.outletid,
				                    parentobjecttypeid=Constants.Object_Type_Outlet,
				                    name=employee.job_title
				                    )
				session.add(activity)
				session.flush()

			else:
				cname = ""

				if employee.contactid:
					cname = Contact.query.get(employee.contactid).getName()

				# add audit trail record
				activity = Activity(reasoncodeid=Constants.ReasonCode_Questionnaire,
				                    reason="",
				                    objecttypeid=Constants.Object_Type_Employee,
				                    objectid=employee.employeeid,
				                    actiontypeid=Constants.Research_Record_Delete,
				                    userid=params['userid'],
				                    parentobjectid=employee.outletid,
				                    parentobjecttypeid=Constants.Object_Type_Outlet,
				                    name=employee.job_title + " : " + cname
				                    )
				session.add(activity)
				session.flush()
				# delete contact
				session.execute(text(Employee.Delete_Employee),
					              dict(employeeid=employee.employeeid), Employee)
				session.flush()

			transaction.commit()
		except:
			LOGGER.exception("delete_employee_feedback")
			transaction.rollback()
			raise

	@staticmethod
	def get_new_feedback(params):
		""" get and return a new record """

		rpi = ResearchProjectItems.query.get(params["researchprojectitemid"])
		rpc = ResearchProjectChanges.query.get(params["objectid"])
		# get fields
		fields = simplejson.loads(rpc.value)
		# setup required fields
		fields["outletid"] = rpi.outletid
		fields["researchprojectitemid"] = rpi.researchprojectitemid
		fields["researchprojectitemchangeid"] = params["objectid"]
		fields["contact_name_display"] = fields["prefix"] + " " + fields["firstname"] +  " " + fields["familyname"]
		fields["outletdeskid"] = rpi.outletdeskid

		return fields

	@staticmethod
	def load_employee_feedback(params):
		"""load employee details"""

		rpi = ResearchProjectItems.query.get(params["researchprojectitemid"])

		data = Employee.research_get_edit(dict(employeeid=params["objectid"]))
		data["researchprojectitemid"] = rpi.researchprojectitemid
		data["researchprojectitemchangeid"] = -1

		data["contact_name_display"] = ""
		prefix = familyname = firstname = ""
		user_changes = session.query(ResearchProjectChanges).\
		  filter(ResearchProjectChanges.researchprojectitemid == rpi.researchprojectitemid).\
		  filter(ResearchProjectChanges.employeeid == params["objectid"]) .all()
		# get name for display
		for row in user_changes:
			if row.fieldid == Constants.Field_Prefix:
				prefix = row.value
			elif row.fieldid == Constants.Field_FamilyName:
				familyname = row.value
			elif row.fieldid == Constants.Field_Firstname:
				firstname = row.value

		if prefix or firstname or familyname:
			data["contact_name_display"] = "%s %s %s" % (prefix, firstname, familyname)

		return dict(data=data, user_changes=user_changes)

	@staticmethod
	def load_employee(params):
		"""load employee details"""

		return dict(
		  data=Employee.research_get_edit(dict(employeeid=params["objectid"])),
		  user_changes=[])

	@staticmethod
	def add_new_employee(params):
		"""add a new employee"""

		# handle done
		rpci = ResearchProjectChanges.query.get(params["researchprojectitemchangeid"])
		rpci.applied = True

		if params.get("outletdeskid", -1) == -1:
			params["outletdeskid"] = None

		return Employee.research_add(params)

	@staticmethod
	def update_employee(params):
		"""Update Customer """
		session.query(ResearchProjectChanges).\
		  filter(ResearchProjectChanges.researchprojectitemid == params["researchprojectitemid"]).\
		  filter(ResearchProjectChanges.employeeid == params["employeeid"]).\
		  update(dict(applied=True))

		Employee.research_update(params)


	@staticmethod
	def log_right_person(params):
		"""Log right person """

		rpi = ResearchProjectItems.query.get(params["questionnaireid"])

		activity = Activity(
		  reasoncodeid=Constants.ReasonCode_Questionnaire,
		  reason="Research Contact Confirmation",
		  objecttypeid=Constants.Object_Type_Outlet,
		  objectid=rpi.outletid,
		  actiontypeid=Constants.Research_Reason_Update,
		  userid=0,
		  parentobjectid=rpi.outletid,
		  parentobjecttypeid=Constants.Object_Type_Outlet
		)
		session.add(activity)
		session.flush()

		tovalue = "%s %s %s %s" %  (params["research_prefix"],
		                            params["research_firstname"],
		                            params["research_surname"],
		                            params["research_job_title"])

		activitydetail = ActivityDetails(
		  activityid=activity.activityid,
		  fieldid=Constants.Field_Research_Right_Person,
		  fromvalue="",
		  tovalue=tovalue)
		session.add(activitydetail)

	@staticmethod
	def save_feedback_freelance(params):
		""" update a public freelance record"""

		transaction = BaseSql.sa_get_active_transaction()
		try:

			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])
			outlet = Outlet.query.get(projectitem.outletid)
			employee = Employee.query.get(outlet.primaryemployeeid)
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)
			# update
			activity = Activity(
			  reasoncodeid=Constants.ReasonCode_Questionnaire,
			  reason="",
			  objecttypeid=Constants.Object_Type_Freelance,
			  objectid=outlet.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outlet.outletid,
			  parentobjecttypeid=Constants.Object_Type_Freelance
			)

			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(comm.tel, params['tel'], activity.activityid, Constants.Field_Tel)
			ActivityDetails.AddChange(comm.email, params['email'], activity.activityid, Constants.Field_Email)
			ActivityDetails.AddChange(comm.fax, params['fax'], activity.activityid, Constants.Field_Fax)
			ActivityDetails.AddChange(comm.mobile, params['mobile'], activity.activityid, Constants.Field_Mobile)
			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)
			ActivityDetails.AddChange(comm.blog, params['blog'], activity.activityid, Constants.Field_Blog)

			comm.tel = params['tel']
			comm.email = params['email']
			comm.fax = params['fax']
			comm.mobile = params['mobile']
			comm.twitter = params["twitter"]
			comm.facebook = params["facebook"]
			comm.linkedin = params["linkedin"]
			comm.instagram = params["instagram"]
			comm.blog = params["blog"]

			contact = Contact.query.get(employee.contactid)
			if contact.familyname != params["familyname"]:
				# delete freelance index
				Contact.do_index_contact(contact, params["familyname"])

				ActivityDetails.AddChange(contact.familyname, params['familyname'], activity.activityid, Constants.Field_FamilyName)
				contact.familyname = params["familyname"]

			if contact.prefix != params["prefix"]:
				ActivityDetails.AddChange(contact.prefix, params['prefix'], activity.activityid, Constants.Field_Prefix)
				contact.prefix = params["prefix"]

			if contact.firstname != params["firstname"]:
				ActivityDetails.AddChange(contact.firstname, params['firstname'], activity.activityid, Constants.Field_FamilyName)
				contact.firstname = params["firstname"]

			ActivityDetails.AddChange(employee.job_title, params['job_title'], activity.activityid, Constants.Field_Job_Title)
			employee.job_title = params['job_title']

			outlet.outletname = contact.getName()

			ActivityDetails.AddChange(outlet.www, params['www'], activity.activityid, Constants.Field_Address_Www)
			ActivityDetails.AddChange(outlet.countryid, params['countryid'], activity.activityid, Constants.Field_CountryId)

			profile = params.get('profile', "")
			if not profile:
				profile = params.get('editorialprofile', "")

			# missing profile record
			profile_record = OutletProfile.query.get(outlet.outletid)
			if not profile_record:
				profile_record = OutletProfile(outletid=outlet.outletid)
				session.add(profile_record)

			ActivityDetails.AddChange(profile_record.editorialprofile, profile, activity.activityid, Constants.Field_Profile)
			profile_record.editorialprofile = profile

			outlet.www = params['www']
			outlet.countryid = params["countryid"]
			outlet.sortname = params["sortname"]

			if 'prmax_outlettypeid' in params:
				ActivityDetails.AddChange(outlet.prmax_outlettypeid, params['prmax_outlettypeid'], activity.activityid, Constants.Field_Outlet_Type)
				outlet.prmax_outlettypeid = params["prmax_outlettypeid"]

			ActivityDetails.AddChange(address.address1, params['address1'], activity.activityid, Constants.Field_Address_1)
			ActivityDetails.AddChange(address.address2, params['address2'], activity.activityid, Constants.Field_Address_2)
			ActivityDetails.AddChange(address.county, params['county'], activity.activityid, Constants.Field_Address_County)
			ActivityDetails.AddChange(address.postcode, params['postcode'], activity.activityid, Constants.Field_Address_Postcode)
			ActivityDetails.AddChange(address.townname, params['townname'], activity.activityid, Constants.Field_Address_Town)

			address.address1 = params['address1']
			address.address2 = params['address2']
			address.county = params['county']
			address.postcode = params['postcode']
			address.townname = params['townname']

			# interests
			dbinterest = session.query(EmployeeInterests).filter_by(
				employeeid=outlet.primaryemployeeid)
			dbinterest2 = []
			interests = params['interests'] if params['interests'] else []
			# do deletes
			for outletinterest in dbinterest:
				dbinterest2.append(outletinterest.interestid)
				if not outletinterest.interestid in interests:
					ActivityDetails.AddDelete(outletinterest.interestid, activity.activityid, Constants.Field_Interest)
					session.delete(outletinterest)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = EmployeeInterests(
						employeeid=outlet.primaryemployeeid,
					    outletid=outlet.outletid,
						interestid=interestid)
					session.add(interest)
					ActivityDetails.AddAdd(interestid, activity.activityid, Constants.Field_Interest)

			# set source to us
			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 outlet.outletid,
			                                 Constants.Cache_Outlet_Objects)

			# rebuild profiles
			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=outlet.outletid))

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("research_freelance_update")
			transaction.rollback()
			raise

	@staticmethod
	def save_feedback_desk(params):
		""" update a public desk record"""

		transaction = BaseSql.sa_get_active_transaction()
		try:

			projectitem = ResearchProjectItems.query.get(params["researchprojectitemid"])
			outletdesk = OutletDesk.query.get(projectitem.outletdeskid)
			outlet = Outlet.query.get(outletdesk.outletid)
			outletcomm = Communication.query.get(outlet.communicationid)
			outletaddress = Address.query.get(outletcomm.addressid)

			deskcomm = Communication.query.get(outletdesk.communicationid)

			# update
			activity = Activity(
			  reasoncodeid=Constants.ReasonCode_Questionnaire,
			  reason="",
			  objecttypeid=Constants.Object_Type_Outlet,
			  objectid=outletdesk.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outletdesk.outletid,
			  parentobjecttypeid=Constants.Object_Type_Outlet
			)

			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(outletdesk.deskname, params['deskname'], activity.activityid, Constants.Field_DeskName)
			outletdesk.deskname = params['deskname']

			ActivityDetails.AddChange(deskcomm.tel, params['tel'], activity.activityid, Constants.Field_Tel)
			ActivityDetails.AddChange(deskcomm.email, params['email'], activity.activityid, Constants.Field_Email)
			ActivityDetails.AddChange(deskcomm.fax, params['fax'], activity.activityid, Constants.Field_Fax)
			ActivityDetails.AddChange(deskcomm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(deskcomm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(deskcomm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(deskcomm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)

			def set_value(desk, outlet, field, value):
				setvalue = "" if value == getattr(outlet, field) else value
				setattr(desk, field, setvalue)

			set_value(deskcomm, outletcomm, 'tel', params['tel'])
			set_value(deskcomm, outletcomm, 'email', params['email'])
			set_value(deskcomm, outletcomm, 'fax', params['fax'])
			set_value(deskcomm, outletcomm, 'twitter', params['twitter'])
			set_value(deskcomm, outletcomm, 'facebook', params['facebook'])
			set_value(deskcomm, outletcomm, 'linkedin', params['linkedin'])
			set_value(deskcomm, outletcomm, 'instagram', params['instagram'])

			# check to see if we have an different address
			if params['address1'] != outletaddress.address1 and params['address1']:
				# different and has address
				if deskcomm.addressid:
					deskaddress = Address.query.get(deskcomm.addressid)
				else:
					deskaddress = Address(addresstypeid=Address.customerAddress)
					session.add(deskaddress)
					session.flush()
					deskcomm.addressid = deskaddress.addressid

				ActivityDetails.AddChange(deskaddress.address1, params['address1'], activity.activityid, Constants.Field_Address_1)
				ActivityDetails.AddChange(deskaddress.address2, params['address2'], activity.activityid, Constants.Field_Address_2)
				ActivityDetails.AddChange(deskaddress.county, params['county'], activity.activityid, Constants.Field_Address_County)
				ActivityDetails.AddChange(deskaddress.postcode, params['postcode'], activity.activityid, Constants.Field_Address_Postcode)
				ActivityDetails.AddChange(deskaddress.townname, params['townname'], activity.activityid, Constants.Field_Address_Town)

				set_value(deskaddress, outletaddress, 'address1', params['address1'])
				set_value(deskaddress, outletaddress, 'address2', params['address2'])
				set_value(deskaddress, outletaddress, 'county', params['county'])
				set_value(deskaddress, outletaddress, 'postcode', params['postcode'])
				set_value(deskaddress, outletaddress, 'townname', params['townname'])
			else:
				# address same check to see if we need to delete desk address
				if deskcomm.addressid:
					deskaddress = Address.query.get(deskcomm.addressid)
					session.delete(deskaddress)
					deskcomm.addressid = None

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 outlet.outletid,
			                                 Constants.Cache_Outlet_Objects)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("save_feedback_desk")
			transaction.rollback()
			raise

