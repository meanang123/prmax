# -*- coding: utf-8 -*-
"research Projects Emails"
#-----------------------------------------------------------------------------
# Name:        projectemails.py
# Purpose:     Research Project Details
# Author:      Chris Hoy
#
# Created:     03/03/2013
# RCS-ID:      $Id:  $
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------
import datetime
import logging
import os
from time import sleep
from turbogears.database import session
from sqlalchemy import text
import prcommon.Constants as Constants
from prcommon.model.researchprojects.projects import ResearchProjectItems, ResearchProjects
from prcommon.model.questionnaires.questionnairertext import QuestionnaireText
from prcommon.model.research import ResearchDetails, ResearchDetailsDesk
from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.outlet import Outlet
from prcommon.model.identity import User
from prcommon.model.researchext.researcherdetails import ResearcherDetails
from ttl.ttldate import date_by_adding_business_days
from ttl.ttlemail import EmailMessage
from ttl.ttlemail import SMTPServer, SMTPServerGMail

LOGGER = logging.getLogger("prcommon.model")

LOGOFILE = None
try:
	with open(os.path.join(os.path.normpath(os.path.join(os.path.dirname(__file__), 'resources')), 'prmax_logo.png'), "rb") as fileobj:
		LOGOFILE = fileobj.read()
except:
	pass

EMAILSERVERS = {
  119:("researchgroup@prmax.co.uk", "fUnSyXSG4Pnh", Constants.Research_Quest_Email_Rest),
  -1:("updates@prmax.co.uk", "!xiQeV8EGJ", Constants.Research_Quest_Email)
}

BODYTEXTLINK = "<LINK TO DATABASE>"


class ProjectEmails(object):
	""" ProjectEmails """

	SUBECTLINE = "Editorial update for %s"
	SUBJECTLINEDESK = "Editorial update %s Desk - %s"
	STANDARDBODY = """
<p>Dear %(contact)s,</p>
<p>This is your opportunity to review all the information we hold about your outlet and amend or add to it as required. You have received this email as you are the main contact for updating your outlet's information on the PRmax database.</p>
<p>Please click on the link below. It will take you to an update wizard to review and amend the information in the database. Your outlet's record in the database is completely free of charge.</p>
<p>This round of updates ends on: %(deadline)s </p>
<p><a href="%(link)s">%(link)s</a></p>
<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
<p>Thank you for your help.</p>
<p>Kind regards,</p><br/>
%(researcher)s
"""

	FREELANCEBODY = """
	<p>Dear %(contact)s,</p>
	<p>This is your opportunity to review all the information we hold about you as a freelancer in the PRmax database and amend or add to it as required.</p>
	<p>Please click on the link below. It will take you to an update screen to review and amend the information in the database. Your freelance record in the database is completely free of charge.</p>
	<p>This round of updates ends on: %(deadline)s </p>
	<p><a href="%(link)s">%(link)s</a></p>
	<p>If you have trouble connecting to the database via the link please email <a href=mailto:"updates@prmax.co.uk">updates@prmax.co.uk</a></p>
	<p>Thank you for your help.</p>
	<p>Kind regards,</p><br/>
	%(researcher)s
	"""

	STANDARD_EMAIL_FOOTER = """<p>Causeway House</p>
			<p>13 The Causeway</p>
			<p>Teddington</p>
			<p>TW11 0JR</p>
			<p>United Kingdom</p><br/>
			<img height="51px" width="118px" src="cid:cid1" alt="PRmax Logo">"""

	RESENTFOOTER = """<br/>%(researcher)s"""

	FIRST_EMAIL_EXPIRE = 5
	SECOND_EMAIL_EXPIRE = 5

	class QuestionairreTextCtrl(object):
		"""QuestionairreTextCtrl"""
		def __init__(self):
			"init"
			ret = {}
			for row in session.query(QuestionnaireText).all():
				email_subject = row.email_subject if row.email_subject else ProjectEmails.SUBECTLINE
				key = (row.researchprojectstatusid, row.prmax_outlettypeid, row.isdesk)
				ret[key] = (email_subject, row.email_body_text)

			ret[(None, None, True)] = (ProjectEmails.SUBECTLINE, ProjectEmails.STANDARDBODY)
			ret[(None, None, False)] = (ProjectEmails.SUBECTLINE, ProjectEmails.STANDARDBODY)

			ret[(None, 42, False)] = (ProjectEmails.SUBECTLINE, ProjectEmails.FREELANCEBODY)

			self._details = ret

		def get(self, typeid, prmax_outlettypeid, isdesk=False):
			"""get text for type"""

			if prmax_outlettypeid != 42:
				prmax_outlettypeid = None

			key = (typeid, prmax_outlettypeid, isdesk)
			if key in self._details:
				return self._details[key]
			else:
				if prmax_outlettypeid:
					key = (None, 42, False)
				else:
					key = (None, None, False)

				return self._details[key]


	@staticmethod
	def get_link(istest, test_server=False):
		"return link for mode"
		if test_server:
			return "http://test.questionnaire.prmax.co.uk"
		if istest:
			return "https://questionnaire.pr-max.net"
		else:
			return "https://questionnaire.prmax.co.uk"

	@staticmethod
	def send_first_emails(istest=False, to_email=None, researchprojectid=None, test_mode=False, test_server=False):
		"""Sends a list of first email"""

		link = ProjectEmails.get_link(istest, test_server)
		email_text = ProjectEmails.QuestionairreTextCtrl()

		# find all email
		command = session.query(ResearchProjectItems, ResearchDetails, Outlet, ResearchProjects, User, ResearcherDetails, ResearchDetailsDesk, OutletDesk).\
				outerjoin(ResearchDetails, ResearchDetails.outletid == ResearchProjectItems.outletid).\
		    outerjoin(Outlet, Outlet.outletid == ResearchProjectItems.outletid).\
		    outerjoin(ResearchProjects, ResearchProjects.researchprojectid == ResearchProjectItems.researchprojectid).\
				outerjoin(User, User.user_id == ResearchProjects.ownerid).\
		    outerjoin(ResearcherDetails, ResearcherDetails.userid == ResearchProjects.ownerid).\
		    outerjoin(ResearchDetailsDesk, ResearchDetailsDesk.outletdeskid == ResearchProjectItems.outletdeskid).\
		    outerjoin(OutletDesk, OutletDesk.outletdeskid == ResearchProjectItems.outletdeskid)

		# specific projects
		if researchprojectid:
			command = command.filter(ResearchProjects.researchprojectid == researchprojectid)
		else:
			# normal run
			command = command.filter(ResearchProjectItems.researchprojectstatusid == Constants.Research_Project_Status_Send_Email)
			# If project has start date
			command = command.filter(text("""(ResearchProjects.ismonthly=false OR (ResearchProjects.ismonthly=true AND ResearchProjects.startdate=current_date))"""))

		first_expire = date_by_adding_business_days(datetime.date.today(), ProjectEmails.FIRST_EMAIL_EXPIRE, [])
		first_send_total = 0
		for research in command.all():
			first_send_total += 1
			session.begin()

			# now update status
			researchdetails = ProjectEmails.get_researcher_details(research[1], research[6])

			to_local_address = to_email if to_email else researchdetails.email

			if researchdetails and to_local_address:
				researchdetails.last_questionaire_sent = datetime.date.today()
				research[0].researchprojectstatusid = Constants.Research_Project_Status_First_Email_Send
				research[0].lastactiondate = datetime.date.today()
				research[0].expire_date = first_expire
			else:
				research[0].researchprojectstatusid = Constants.Research_Project_Status_No_Email
				research[0].lastactiondate = datetime.date.today()
				research[0].expire_date = first_expire


			if researchdetails and to_local_address:
				# now send email
				elements = ProjectEmails.fix_email_address_for_non_uk(
				  email_text.get(Constants.Research_Project_Status_First_Email_Send,
				                 research[2].prmax_outlettypeid,
				                 True if research[0].outletdeskid else False),
				  research[2].countryid)
				if research[0].outletdeskid:
					subjectfields = (research[7].deskname, research[2].outletname)
				else:
					subjectfields = (research[2].outletname, )

				ProjectEmails.send_email(
					  elements[0] % subjectfields,
					  elements[1] % dict(contact=researchdetails.get_salutation(),
										 deadline=research[3].questionnaire_completion.strftime("%d/%m/%y"),
										 link="%s/%d/quest" % (link, research[0].researchprojectitemid),
										 researcher=ProjectEmails.get_research_footer(research[4], research[2].countryid, research[5])),
					  to_local_address,
					  research[0].researchprojectitemid,
					  istest,
					  False,
					  ProjectEmails.get_from_address(research[2].countryid, test_server),
					  research[2].countryid,
					  test_mode,
					test_server
				)

			session.commit()

			# have a break after we send 50 email
			# I hope this allow the email server connection to close
			# otherwise we will have to rewrite email to have single connection open for whole session

			if first_send_total % 50 == 0:
				print ("Resting for 30 Seconds")
				sleep(30)

		if researchprojectid:
			session.begin()
			researchproject = ResearchProjects.query.get(researchprojectid)
			researchproject.first_send_total = first_send_total
			session.commit()

	@staticmethod
	def send_email(subject, body_text, toemail, researchprojectitemid, istest, isresend, from_email, countryid, test_mode, test_server=False):
		""" send tne eail"""

		# get email server access details
		if test_mode:
			print (toemail, subject, researchprojectitemid)
			return

		email = EmailMessage(from_email,
		                     toemail,
		                     subject,
		                     body_text,
		                     "text/html",
		                     "",
		                     None,
		                     False,
		                     senderaddress=None,
		                     sendAddress=from_email)

		if body_text.find("cid:cid1") != -1 and LOGOFILE:
			email.addEmbeddedImages("cid1", LOGOFILE, "image/png")

		email.BuildMessage()

		#sender = "%s.%d@prmax.co.uk" % ("R", researchprojectitemid)
		sender = from_email
		serversettings = EMAILSERVERS.get(countryid, None)
		if test_server:
			serversettings = (
				"takrim.rahman.albi@prmax.co.uk",
				"Prmax#1234",
				'"PRmax Research" <takrim.rahman.albi@prmax.co.uk>')
		if not serversettings:
			serversettings = EMAILSERVERS[-1]


		if istest:
			emailserver = SMTPServerGMail(serversettings[0], serversettings[1])
		else:
			if isresend:
				emailserver = SMTPServerGMail(serversettings[0], serversettings[1])
			else:
				# the automatic email have to be sent out via the server gmail has strict rules that stop us sending the mail email on the same day
				# via them we can only send out to 500 unique addresses int the day

				emailserver = SMTPServer()

		(error, statusid) = emailserver.send(email, sender)
		if not statusid:
			raise Exception("Problem Sending Email")

		print (error, statusid)

	@staticmethod
	def send_follow_up_emails(istest=True, to_email=None, test_mode=False):
		"""send the follow up emails"""

		# send follow up email

		ProjectEmails.send_follow_up_emails_do(
		  Constants.Research_Project_Status_First_Email_Send,
		  Constants.Research_Project_Status_Second_Email_Sent,
		  ProjectEmails.SECOND_EMAIL_EXPIRE,
		  istest,
		  to_email,
		  test_mode)

		ProjectEmails.send_follow_up_emails_do(
		  Constants.Research_Project_Status_Second_Email_Sent,
		  Constants.Research_Project_Status_Final_Email_Sent,
		  ProjectEmails.SECOND_EMAIL_EXPIRE,
		  istest,
		  to_email,
		  test_mode
		)

		# no respone to final email set status as failed
		ProjectEmails.set_as_no_response()

	@staticmethod
	def set_as_no_response():
		"""set all final email sent as no response"""
		session.begin()
		session.query(ResearchProjectItems).\
		  filter(ResearchProjectItems.researchprojectstatusid == Constants.Research_Project_Status_Final_Email_Sent).\
		  filter(ResearchProjectItems.expire_date < datetime.date.today()).update(
		    dict(researchprojectstatusid=Constants.Research_Project_Status_No_Response)
		 )
		session.commit()

	@staticmethod
	def get_researcher_details(outletresearch, deskresearch):
		"""get_researcher_details"""

		return deskresearch if deskresearch else outletresearch


	@staticmethod
	def send_follow_up_emails_do(oldstatusid, newstatusid, expire_value, istest, to_email, test_mode):
		"""For phase """

		link = ProjectEmails.get_link(istest)
		email_text = ProjectEmails.QuestionairreTextCtrl()
		next_expire = date_by_adding_business_days(datetime.date.today(), expire_value, [])
		sent_qty = 0

		# first email sent but no response in period
		for research in session.query(ResearchProjectItems, ResearchDetails, Outlet, ResearchProjects, User, ResearcherDetails, ResearchDetailsDesk, OutletDesk).\
				outerjoin(ResearchDetails, ResearchDetails.outletid == ResearchProjectItems.outletid).\
				outerjoin(Outlet, Outlet.outletid == ResearchProjectItems.outletid).\
				outerjoin(ResearchProjects, ResearchProjects.researchprojectid == ResearchProjectItems.researchprojectid).\
				outerjoin(User, User.user_id == ResearchProjects.ownerid).\
				outerjoin(ResearcherDetails, ResearcherDetails.userid == ResearchProjects.ownerid).\
				outerjoin(ResearchDetailsDesk, ResearchDetailsDesk.outletdeskid == ResearchProjectItems.outletdeskid). \
		    outerjoin(OutletDesk, OutletDesk.outletdeskid == ResearchProjectItems.outletdeskid). \
		    filter(ResearchProjectItems.researchprojectstatusid == oldstatusid).\
				filter(ResearchProjects.ismonthly == True).\
		    filter(ResearchProjectItems.expire_date <= datetime.date.today()).all():
			sent_qty += 1
			session.begin()

			researchdetails = ProjectEmails.get_researcher_details(research[1], research[6])

				# now update status
			researchdetails.last_questionaire_sent = datetime.date.today()
			research[0].researchprojectstatusid = newstatusid
			research[0].lastationdate = datetime.date.today()
			research[0].expire_date = next_expire

			emailaddress = researchdetails.email if to_email is None else to_email
			if emailaddress:
				elements = ProjectEmails.fix_email_address_for_non_uk(
				  email_text.get(newstatusid,
				                 research[2].prmax_outlettypeid,
				                 True if research[0].outletdeskid else False),
				  research[2].countryid)

				if research[0].outletdeskid:
					subjectfields = (research[7].deskname, research[2].outletname)
				else:
					subjectfields = (research[2].outletname, )


				ProjectEmails.send_email(
				  elements[0] % subjectfields,
				  elements[1] % dict(contact=researchdetails.get_salutation(),
				                     deadline=research[3].questionnaire_completion.strftime("%d/%m/%y"),
				                     link="%s/%d/quest" % (link, research[0].researchprojectitemid),
				                     researcher=ProjectEmails.get_research_footer(research[4], research[2].countryid, research[5])),
				  emailaddress,
				  research[0].researchprojectitemid,
				  istest,
			    False,
			    ProjectEmails.get_from_address(research[2].countryid),
				  research[2].countryid,
			    test_mode
				)
			else:
				research[0].researchprojectstatusid = Constants.Research_Project_Status_No_Email

			session.commit()

			if sent_qty % 50 == 0:
				print ("Resting for 30 Seconds")
				sleep(30)

	@staticmethod
	def re_send_email(researchprojectitemid, email, subject, bodytext, istest, iuserid, test_mode):
		"""Resend a link to a questionairre"""

		link = ProjectEmails.get_link(istest)

		if iuserid != -1:
			user = User.query.get(iuserid)
			researcher = session.query(ResearcherDetails).filter(ResearcherDetails.userid == iuserid).scalar()
			emailaddress = researcher.research_email if researcher and researcher.research_email else user.email_address
		else:
			user = None
			emailaddress = None
			researcher = None

		# first email sent but no response in period
		research = ResearchProjectItems.query.get(researchprojectitemid)
		research.last_questionaire_sent = datetime.date.today()
		research.researchprojectstatusid = 12

		#researchproject = ResearchProjects.query.get(research.researchprojectid)
		outlet = Outlet.query.get(research.outletid)

		finalt = bodytext.replace(BODYTEXTLINK, "%s/%d/quest" % (link, researchprojectitemid))
		finalt = finalt.replace("\n", "<br/>")
		finalt = "<p>" + finalt + "<p/>" + \
		  ProjectEmails.RESENTFOOTER % dict(researcher=ProjectEmails.get_research_footer(user, outlet.countryid, researcher))
		ProjectEmails.send_email(
		  subject,
		  finalt,
		  email,
		  researchprojectitemid,
		  istest,
		  True,
			emailaddress,
		  outlet.countryid,
		  test_mode)

	@staticmethod
	def get_research_details(researchprojectitemid):
		"""get research details from this entry if possible """

		item = ResearchProjectItems.query.get(researchprojectitemid)
		research = session.query(ResearchDetails).filter(ResearchDetails.outletid == item.outletid).scalar()

		return dict(salutation=research.get_salutation(),
		            subject="Editorial update for PRmax",
		            email=research.email,
		            item=item)

	@staticmethod
	def get_research_footer(user, countryid, research):
		"""Gte footer for email based on user"""

		#if research:
		#	ret_string = ""
		#	if research.research_display_name:
		#		ret_string += "<p>%s</p>" % research.research_display_name
		#	if research.research_job_title:
		#		ret_string += "<p>%s</p>" % research.research_job_title
		#	if research.research_tel:
		#		ret_string += "<p>Tel :%s</p>" % research.research_tel
		#	return ret_string + "<br/>" + ProjectEmails.STANDARD_EMAIL_FOOTER
		#elif user:
		if user:
			ret_string = ""
			if user.display_name:
				ret_string += "<p>%s</p>" % user.display_name
			if user.job_title:
				ret_string += "<p>%s</p>" % user.job_title
			if user.tel:
				ret_string += "<p>Tel :%s</p>" % user.tel
			return ret_string + "<br/>" + ProjectEmails.STANDARD_EMAIL_FOOTER
		else:

			if countryid == 119:
				return """<p>PRmax Research Team</p><p>www.prmax.co.uk</p><p><br/>""" + ProjectEmails.STANDARD_EMAIL_FOOTER
			else:
				return """<p>PRmax Research Team</p><p>www.prmax.co.uk</p><p>Tel: 01582 380 191</p><br/>""" + ProjectEmails.STANDARD_EMAIL_FOOTER


	@staticmethod
	def fix_email_address_for_non_uk(document, countryid):
		"fixup"

		if countryid == 119:
			return (document[0].replace("updates@prmax.co.uk", "researchgroup@prmax.co.uk"),
			        document[1].replace("updates@prmax.co.uk", "researchgroup@prmax.co.uk"))

		else:
			return document

	@staticmethod
	def get_from_address(countryid, test_server=False):
		"""get from address"""

		serversettings = EMAILSERVERS.get(countryid, None)
		if test_server:
			serversettings = (
				"takrim.rahman.albi@prmax.co.uk",
				"Prmax#1234",
				'"PRmax Research" <takrim.rahman.albi@prmax.co.uk>')

		if not serversettings:
			serversettings = EMAILSERVERS[-1]

		return serversettings[2]







