# -*- coding: utf-8 -*-
"""Email system"""
#-----------------------------------------------------------------------------
# Name:        email.py
# Purpose:	   Email object templates and queuee
#
# Author:      Chris Hoy
#
# Created:     12-12-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import os
import os.path
import email
import StringIO
import logging
import uuid
from urlparse import urlparse
from datetime import datetime, date, timedelta
from turbogears.database import metadata, mapper, session, config
from sqlalchemy import Table, text, func, or_, and_
from bs4 import BeautifulSoup
from ttl.ttlemail import EmailMessage, SMTPSERVERBYTYPE
from ttl.postgres import DBCompress
from ttl.sqlalchemy.ttlcoding import CryptyInfo
import ttl.Constants as ttlConstants
from prcommon.model.common import BaseSql
from prcommon.model.identity import User, Customer
from prcommon.model.list import List, ListMembers
from prcommon.model.lookups import Selection
from prcommon.model.searchsession import SearchSession
from prcommon.model.collateral import ECollateral, Collateral
from prcommon.model.seopressreleases import SEORelease
from prcommon.model.distribution.distributiontemplates import DistributionTemplates
from prcommon.Const.Email_Templates import Demo_Body, Demo_Subject
from prcommon.lib.distribution import MailMerge
import prcommon.Constants as Constants
from prcommon.lib.bouncedemails import AnalysisMessage
from prcommon.model.customer.customeremailserver import CustomerEmailServer
from prcommon.model.contact import Contact
from prcommon.model.employee import Employee
from prcommon.model.outlet import Outlet

CRYPTENGINE = CryptyInfo(Constants.KEY1)
LOGGER = logging.getLogger("prcommon.model")

class EmailQueue(BaseSql):
	""" Instance of the email queueue"""

	@classmethod
	def send_password(cls, emailaddress):
		""" send a password email"""

		user = User.query.filter_by(email_address=emailaddress).one()

		emailm = EmailMessage(Constants.SupportEmail,
							 emailaddress,
							 'Prmax access details',
							 'Password %s' % user.password)
		emailm.BuildMessage()

		transaction = cls.sa_get_active_transaction()
		try:
			emailq = EmailQueue(emailaddress=emailaddress,
							  subject=emailm.Subject,
							  message=DBCompress.encode2(emailm),
							  emailqueuetypeid=Constants.EmailQueueType_Internal)
			session.add(emailq)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("outlet_add")
			transaction.rollback()
			raise

	@classmethod
	def send_demo_email(cls, user, password, customer):
		""" send a password email"""

		emailm = EmailMessage(Constants.SalesEmail,
		                      user.email_address,
		                      Demo_Subject,
		                      Demo_Body % (user.display_name, user.email_address, password, customer.licence_expire.strftime("%d %b %y")),
		                      "text/html"
							 )
		emailm.bcc = Constants.CopyEmail
		emailm.BuildMessage()

		transaction = cls.sa_get_active_transaction()
		try:
			emailq = EmailQueue(
			  emailaddress=user.email_address,
			  subject=emailm.Subject,
			  message=DBCompress.encode2(emailm),
			  emailqueuetypeid=Constants.EmailQueueType_Internal)
			session.add(emailq)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("send_demo_email")
			transaction.rollback()
			raise

	@classmethod
	def send_email_and_attachments(cls, fromemailaddress, toaddress,
	              subject, body, files,
	              emailqueuetypeid=Constants.EmailQueueType_Internal,
								newtype="text/plain", emailsendtypeid=Constants.Email_Html_And_Plain):
		""" Send an email wiith an attachment by default the type is plain text """

		emailm = EmailMessage(fromemailaddress,
							 toaddress,
							 subject,
							 body)
		emailm.bodytype = newtype

		# attach files
		if files:
			for (data, name) in files:
				emailm.addAttachment(data, name)

		if emailsendtypeid == Constants.Email_Html_Only:
			emailm.BuildMessageHtmlOnly()
		else:
			emailm.BuildMessage()

		# do transactions
		transaction = cls.sa_get_active_transaction()
		try:
			emailq = EmailQueue(
			  emailaddress=toaddress,
			  subject=emailm.Subject,
			  emailqueuetypeid=emailqueuetypeid,
			  message=DBCompress.encode2(emailm))
			session.add(emailq)
			session.flush()
			transaction.commit()

		except:
			LOGGER.exception("send_email_and_attachments")
			transaction.rollback()
			raise

	# get the email address for a list look at the contact and then the outlet
	List_Emails = """SELECT
	    get_override(occ_c.email, e_c.email,oc_c.email, o_c.email) as sendemail,
	    e.job_title,
	    c.firstname,
	    c.familyname,
	    c.prefix,
	    s.listmemberid
		FROM userdata.listmembers AS s
	    JOIN userdata.list AS l ON l.listid = s.listid
		JOIN outlets as o on o.outletid = s.outletid
		JOIN communications as o_c ON o.communicationid = o_c.communicationid
		LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND l.customerid = oc.customerid
		LEFT OUTER JOIN communications as oc_c ON oc.communicationid = oc_c.communicationid
		JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
		LEFT OUTER JOIN communications as e_c ON e.communicationid = e_c.communicationid
		LEFT OUTER JOIN employeecustomers as occ ON e.employeeid = occ.employeeid AND l.customerid = occ.customerid
		LEFT OUTER JOIN communications as occ_c ON occ_c.communicationid = occ.communicationid
	    LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
	    WHERE
	    	l.listid = (SELECT listid from userdata.emailtemplates WHERE emailtemplateid = :emailtemplateid ) AND
	        SELECTION(s.selected, :selected)=true AND
	        length(get_override(occ_c.email, e_c.email,oc_c.email, o_c.email))>0"""

	List_Emails_Count = """SELECT get_override(occ_c.email, e_c.email,oc_c.email, o_c.email) as sendemail, e.job_title,
	    c.firstname,c.familyname,c.prefix
		FROM userdata.listmembers AS s
	    JOIN userdata.list AS l ON l.listid = s.listid
		JOIN outlets as o on o.outletid = s.outletid
		JOIN communications as o_c ON o.communicationid = o_c.communicationid
		LEFT OUTER JOIN outletcustomers as oc ON s.outletid = oc.outletid AND l.customerid = oc.customerid
		LEFT OUTER JOIN communications as oc_c ON oc.communicationid = oc_c.communicationid
		JOIN employees as e on COALESCE(s.employeeid,oc.primaryemployeeid,o.primaryemployeeid)= e.employeeid
		LEFT OUTER JOIN communications as e_c ON e.communicationid = e_c.communicationid
		LEFT OUTER JOIN employeecustomers as occ ON e.employeeid = occ.employeeid AND l.customerid = occ.customerid
		LEFT OUTER JOIN communications as occ_c ON occ_c.communicationid = occ.communicationid
	    LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
		WHERE
			l.listid = (SELECT listid from userdata.emailtemplates WHERE emailtemplateid = :emailtemplateid ) AND
			SELECTION(s.selected, :selected)=true AND
	        length(get_override(occ_c.email, e_c.email,oc_c.email, o_c.email))>0
	    group by sendemail, e.job_title,c.firstname,c.familyname,c.prefix"""

	@classmethod
	def send_email_list_count(cls, params):
		""" Get the count of the email to be send """

		return dict(success="OK",
		            nbr=cls.sqlExecuteCommand(EmailQueue.List_Emails_Count,
		                                      params, BaseSql.NbrOfRows))


class EmailTemplates(BaseSql):
	""" Email templates """

	ListData = """ SELECT
		t.emailtemplateid,
	  t.emailtemplatename,
	  t.emailtemplatename AS name,
	  t.emailtemplateid AS id
		FROM userdata.emailtemplates AS t
		WHERE
		t.customerid = :customerid AND
		t.emailtemplatename ILIKE :emailtemplatename
	    %s
		ORDER BY  UPPER(t.emailtemplatename)
		LIMIT :limit  OFFSET :offset """

	ListDataId = """ SELECT
		t.emailtemplateid,
	  t.emailtemplatename,
	  t.emailtemplateid AS id

		FROM userdata.emailtemplates AS t
		WHERE
		t.customerid = :customerid AND
		t.emailtemplateid = :id
	    %s
		ORDER BY  UPPER(t.emailtemplatename)
		LIMIT :limit  OFFSET :offset """

	Exists_SQL = """SELECT emailtemplateid FROM  userdata.emailtemplates WHERE customerid = :customerid AND emailtemplatename ILIKE :emailtemplatename"""

	@classmethod
	def get_list(cls, params):
		""" get alist of templates """
		whereclause = " AND pressreleasestatusid = 1"
		if "include_sent" in params:
			whereclause = ""

		if params.get("restrict", "") == "sent":
			whereclause = " AND pressreleasestatusid = 2 "
			d_value = date.today()
			d_value -= timedelta(days=182)
			whereclause += (" AND sent_time > '%s'" % d_value.strftime("%Y-%m-%d"))

		if "id" in params and params["id"] == "-1":
			data = dict(identifier="emailtemplateid",
			            numRows=1,
			            items=[dict(id=-1, emailtemplateid=-1, name="No Selection", emailtemplatename="No Selection")])
		else:
			data = BaseSql.getListPage(params,
			                           'emailtemplatename',
			                           'emailtemplateid',
			                           EmailTemplates.ListData%whereclause,
			                           EmailTemplates.ListDataId%whereclause,
			                           cls)

			if "include_no_select" in params and "id" not in params:
				data['numRows'] += 1
				data['items'].insert(0, dict(id=-1, emailtemplateid=-1, name="No Selection", emailtemplatename="No Selection"))

		if "is_combo" in params:
			data["identifier"] = "id"

		return data

	@classmethod
	def get_list_rest(cls, params):
		""" as rest"""

		single = True if "id" in params else False
		params["restrict"] = "sent"
		params["include_no_select"] = True
		return cls.grid_to_rest(cls.get_list(params), params["offset"], single)

	# This is for the grid
	List_Data_View = """SELECT et.emailtemplateid,et.emailtemplatename,pressreleasestatusid,
	(SELECT COUNT(*) FROM userdata.listmembers as lm WHERE lm.listid = et.listid ) AS nbr,
	to_char(sent_time,'DD-MM-YYYY HH24:MI') AS display_sent_time,
	to_char(et.embargo,'DD-MM-YYYY HH24:MI') AS embargo_display,
	CASE WHEN et.pressreleasestatusid = 1 THEN 'Draft' ELSE 'Sent' END AS status,
	CASE WHEN et.seopressrelease = true THEN 'Yes' ELSE '' END AS seopressrelease_display,
	seo.seoreleaseid,
	cli.clientname,
	et.pressreleasestatusid,
	et.listid,
	issue.name AS issuename
	FROM  userdata.emailtemplates AS et
	LEFT OUTER JOIN seoreleases.seorelease AS seo ON seo.emailtemplateid = et.emailtemplateid
	LEFT OUTER JOIN userdata.client AS cli ON cli.clientid = et.clientid
	LEFT OUTER JOIN userdata.issues AS issue ON issue.issueid = et.issueid
	WHERE et.customerid = :customerid """

	List_Data_View_Sort = """
	ORDER BY  %s %s NULLS LAST
	LIMIT :limit OFFSET :offset
	"""
	List_Data_Count = """SELECT COUNT(*) FROM  userdata.emailtemplates AS et
	WHERE et.customerid = :customerid """

	@classmethod
	def rest_grid_page(cls, params):
		""" rest controler """

		single = True if "emailtemplateid" in params else False
		return cls.grid_to_rest(cls.get_grid_page(params),
		                        params['offset'],
		                        single)

	@classmethod
	def get_grid_page(cls, params):
		""" vget a grid of distributions """

		whereclause = ""

		params['sortfield'] = params.get('sortfield', 'UPPER(emailtemplatename)')
		if params['sortfield'] == 'display_sent_time':
			params['sortfield'] = 'sent_time'
		if params['sortfield'] == 'embargo_display':
			params['sortfield'] = 'et.embargo'
		if params['sortfield'] == 'seopressrelease_display':
			params['sortfield'] = 'seopressrelease'
		if params['sortfield'] == 'issuename':
			params['sortfield'] = 'UPPER(issue.name)'

		if params.has_key("restrict"):
			if params["restrict"].lower() == "display draft":
				whereclause = " AND pressreleasestatusid = 1"
			if params["restrict"].lower() == "display sent":
				whereclause = " AND pressreleasestatusid = 2 "
				# check too see if we have a time limit
				if params.has_key("timerestriction") and params["timerestriction"] != "All":
					d_value = date.today()
					if params["timerestriction"] == "6 Months":
						d_value -= timedelta(days=182)
					elif params["timerestriction"] == "Year":
						d_value -= timedelta(days=365)

					whereclause += (" AND sent_time > '%s'" % d_value.strftime("%Y-%m-%d"))

		# extra option
		if "restriction" in params:
			params["restriction"] = int(params["restriction"])

			if params["restriction"] == 2:
				whereclause += " AND pressreleasestatusid = 1 "
			elif params["restriction"] in (4, 5, 6):
				whereclause = " AND pressreleasestatusid = 2 "
				d_value = date.today()
				if params["restriction"] == 4:
					d_value -= timedelta(days=182)
				elif params["restriction"] == 5:
					d_value -= timedelta(days=365)

				if params["restriction"] != 6:
					whereclause += (" AND sent_time > '%s'" % d_value.strftime("%Y-%m-%d"))

		if  "clientid" in params and params["clientid"] not in (-1, "-1", ""):
			params["clientid"] = int(params["clientid"])
			whereclause += " AND et.clientid = :clientid"

		return BaseSql.getGridPage(
		  params,
		  'UPPER(emailtemplatename)',
		  'emailtemplateid',
		  EmailTemplates.List_Data_View + whereclause + EmailTemplates.List_Data_View_Sort,
		  EmailTemplates.List_Data_Count + whereclause,
		  cls)


	@classmethod
	def exists(cls, params):
		""" does the template name exist"""

		command = session.query(EmailTemplates).\
		  filter(EmailTemplates.customerid == params["customerid"]).\
		  filter(EmailTemplates.emailtemplatename.ilike(params["emailtemplatename"]))

		if "emailtemplateid" in params:
			command = command.filter(EmailTemplates.emailtemplateid != params["emailtemplateid"])

		data = command.all()

		return True if data else False

	@classmethod
	def add(cls, params):
		""" add an email template """

		transaction = cls.sa_get_active_transaction()
		try:

			seopressrelease = True if date.today() < date(2011, 12, 31) else False

			user = User.query.get(params["user_id"])
			# create control record
			emailtemplate = EmailTemplates(
			  customerid=params['customerid'],
			  emailtemplatename=params['emailtemplatename'],
			  emailtemplatecontent=DBCompress.encode2(params['emailtemplatecontent']),
			  issueid=params["issueid"],
			  previewaddress=user.emailreplyaddress,
			  returnaddress=user.emailreplyaddress,
			  seopressrelease=seopressrelease,
			  clientid=params["clientid"]
			)
			session.add(emailtemplate)
			session.flush()
			transaction.commit()
			return emailtemplate.emailtemplateid
		except:
			LOGGER.exception("EmailTemplate_add")
			transaction.rollback()
			raise

	@classmethod
	def duplicate(cls, params):
		""" Duplicate a press release """
		transaction = cls.sa_get_active_transaction()
		try:
			user = User.query.get(params["user_id"])
			oldtemp = EmailTemplates.query.get(params["emailtemplateid"])

			emailtemplatecontent = oldtemp.remove_has_clickthrought()

			# create control record
			newtemp = EmailTemplates(customerid=params['customerid'],
			                         emailtemplatename=params['emailtemplatename'],
			                         emailtemplatecontent=emailtemplatecontent,
			                         documentname=oldtemp.documentname,
			                         clientid=oldtemp.clientid,
			                         subject=oldtemp.subject,
			                         previewaddress=user.emailreplyaddress,
			                         returnaddress=user.emailreplyaddress)
			session.add(newtemp)
			session.flush()
			transaction.commit()
			return newtemp.emailtemplateid
		except:
			LOGGER.exception("EmailTemplate_duplicate")
			transaction.rollback()
			raise

	@classmethod
	def delete(cls, params):
		""" delete an email template handle the collateral if app"""
		transaction = cls.sa_get_active_transaction()
		try:
			# stop cascade
			if not params["delete_collateral"]:
				session.execute("UPDATE userdata.collateral set emailtemplateid = NULL WHERE emailtemplateid = :emailtemplateid",
				                dict(emailtemplateid=params["emailtemplateid"]), EmailTemplates)

			emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])
			# we need to deal with the soe link if the list has been distributed then the link should be broken
			# if the list is still a draft then it should be deleted
			seoreleases = session.query(SEORelease).filter_by(emailtemplateid=params["emailtemplateid"]).all()
			if seoreleases:
				# their are seo attached
					for seo in seoreleases:
						seo.emailtemplateid = None
						session.flush()
						# if not sent then delete as this is just a draft
						if emailtemplate.pressreleasestatusid == Constants.Distribution_Draft:
							session.delete(seo)

			# delete the distribution
			session.delete(emailtemplate)
			transaction.commit()
		except:
			LOGGER.exception("EmailTemplate_delete")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" update the content of a template """

		transaction = cls.sa_get_active_transaction()

		try:
			# create control record
			emailtemplate = EmailTemplates.query.get(params['emailtemplateid'])
			emailtemplate.emailtemplatecontent = DBCompress.encode2(params['emailtemplatecontent'])
			if params.has_key("subject"):
				emailtemplate.subject = params["subject"]
			if params.has_key("documentname"):
				emailtemplate.documentname = params["documentname"]
			if params.has_key("include_view_as_link"):
				emailtemplate.include_view_as_link = params["include_view_as_link"]

			if params.has_key("embargoed"):
				if params["embargoed"]:
					edate = params["embargo_date"]
					tdate = params["embargo_time"]
					emailtemplate.embargo = datetime(edate.year, edate.month, edate.day, tdate.hour, tdate.minute, tdate.second)
				else:
					emailtemplate.embargo = None

			if params.has_key("returnaddress"):
				emailtemplate.returnaddress = params["returnaddress"]

			if params.has_key("returnname"):
				emailtemplate.returnname = params["returnname"]

			if "emailsendtypeid" in  params:
				emailtemplate.emailsendtypeid = params['emailsendtypeid']

			if "clientid" in params:
				emailtemplate.clientid = params["clientid"]

			if "issueid" in params:
				emailtemplate.issueid = params["issueid"]

			transaction.commit()

		except:
			LOGGER.exception("EmailTemplate_update")
			transaction.rollback()
			raise

	@classmethod
	def update_text(cls, params):
		""" update the content of a template """

		transaction = cls.sa_get_active_transaction()

		try:
			# create control record
			emailtemplate = EmailTemplates.query.get(params['emailtemplateid'])
			emailtemplate.emailtemplatename = params['emailtemplatename']
			emailtemplate.emailtemplatecontent = DBCompress.encode2(params['emailtemplatecontent'])
			if "clientid" in params:
				emailtemplate.clientid = params["clientid"]

			if "issueid" in params:
				emailtemplate.issueid = params["issueid"]

			transaction.commit()

		except:
			LOGGER.exception("EmailTemplateText_update")
			transaction.rollback()
			raise


	@classmethod
	def update_content(cls, params):
		""" update the content of a template """
		try:

			#session.execute(text("SET LOCAL lock_timeout=60"), None, EmailTemplates)

			emailtemplate = EmailTemplates.query.get(params['emailtemplateid'])

			# update subject if avaliable
			if params.has_key("subject"):
				emailtemplate.subject = params["subject"]

			if params.has_key("returnaddress"):
				emailtemplate.returnaddress = params["returnaddress"]

			if params.has_key("returnname"):
				emailtemplate.returnname = params["returnname"]

			if params.has_key("include_view_as_link"):
				emailtemplate.include_view_as_link = params["include_view_as_link"]

			if "emailsendtypeid" in params:
				emailtemplate.emailsendtypeid = params['emailsendtypeid']

			if "templateheaderid" in params:
				emailtemplate.templateheaderid = params["templateheaderid"]

			if "templatefooterid" in params:
				emailtemplate.templatefooterid = params["templatefooterid"]

			if params.has_key("embargoed"):
				if params["embargoed"]:
					edate = params["embargo_date"]
					tdate = params["embargo_time"]
					emailtemplate.embargo = datetime(edate.year, edate.month, edate.day, tdate.hour, tdate.minute, tdate.second)
				else:
					emailtemplate.embargo = None

			# update content
			emailtemplate.emailtemplatecontent = DBCompress.encode2(params['emailtemplatecontent'])
			session.flush()
		except:
			LOGGER.exception("EmailTemplate_update_content")
			raise

	@classmethod
	def get(cls, params, extended=False):
		""" get the record and return dict"""
		obj = EmailTemplates.query.get(params["emailtemplateid"])
		if obj:
			dobject = dict(customerid=obj.customerid,
			               emailtemplatename=obj.emailtemplatename,
			               emailtemplateid=obj.emailtemplateid,
			               subject=obj.subject,
			               documentname=obj.documentname,
			               previewaddress=obj.previewaddress,
			               returnaddress=obj.returnaddress,
			               listid=obj.listid,
			               returnname=obj.returnname,
			               emailsendtypeid=obj.emailsendtypeid,
			               include_view_as_link=obj.include_view_as_link,
			               embargo=True if obj.embargo else False,
			               pull=False,
			               seopressrelease=obj.seopressrelease,
			               clientid=obj.clientid,
			               clientname="",
			               issueid=obj.issueid,
			               issuename="",
			               templatefooterid=obj.templatefooterid,
			               templateheaderid=obj.templateheaderid)
			# can pull
			if obj.pressreleasestatusid == 2 and obj.embargo and obj.embargo > datetime.now():
				dobject["pull"] = True

			if obj.embargo:
				dobject["embargo_date"] = dict(year=obj.embargo.year,
				                               month=obj.embargo.month,
				                               day=obj.embargo.day)
				dobject["embargo_time"] = "T" + obj.embargo.strftime("%H:%M:%S")
			if extended:
				dobject['emailtemplatecontent'] = DBCompress.decode(obj.emailtemplatecontent)
			else:
				if obj.clientid:
					from prcommon.model.client import Client

					client = Client.query.get(obj.clientid)
					dobject["clientname"] = client.clientname

				if obj.issueid:
					from prcommon.model.crm2.issues import Issue
					issue = Issue.query.get(obj.issueid)
					dobject["issuename"] = issue.name
		else:
			dobject = dict()
		return dobject

	@classmethod
	def get_text(cls, params):
		""" get the distriction text"""
		obj = EmailTemplates.query.get(params['emailtemplateid'])
		return DBCompress.decode(obj.emailtemplatecontent)

	@staticmethod
	def get_analysis(params):
		"""build a list of links that have been clicked """

		clickthrough = []
		for row in session.execute(text("""SELECT url,SUM(nbrclick)
			  FROM userdata.emailtemplateslinkthrough AS etl WHERE emailtemplateid = :emailtemplateid
			  GROUP BY url
			  ORDER BY url"""), params, EmailTemplates).fetchall():
			url = urlparse(row[0])
			clickthrough.append((url.hostname, row[1], row[0]))

		# status
		return dict(
		  emailstatus=session.execute(text("""SELECT
		  CASE WHEN emailstatusid = 0 THEN 'Delivered'
		  WHEN emailstatusid = 1 THEN 'Viewed'
		  WHEN emailstatusid = 2 THEN 'Processing'
		  WHEN emailstatusid = 3 THEN 'Emailing'
		  WHEN emailstatusid = 5 THEN 'Duplicate'
		  WHEN emailstatusid = 4 THEN 'No Address'
		  WHEN emailstatusid = 6 THEN 'Sent'
		  WHEN emailstatusid = 7 THEN 'Responded'
		  WHEN emailstatusid = 8 THEN 'Unsubscribed'
		  ELSE '' END as status,
		  COUNT(*) qty
		  FROM userdata.emailtemplates AS et
		  JOIN userdata.listmemberdistribution AS lmd ON et.listid = lmd.listid
		  WHERE et.emailtemplateid = :emailtemplateid
		  GROUP BY emailstatusid"""), params, EmailTemplates).fetchall(),
		  clickthrough=clickthrough,
		  customer=Customer.query.get(params["customerid"])
		  )

	@classmethod
	def preview(cls, params):
		""" send a preview email """

		merge = MailMerge()
		header = footer = ""
		release = EmailTemplates.query.get(params["emailtemplateid"])
		# get header/footer
		if release.templateheaderid:
			tempatedata = DistributionTemplates.query.get(release.templateheaderid)
			header = DBCompress.decode(tempatedata.templatecontent) + "<br/>"
		if release.templatefooterid:
			tempatedata = DistributionTemplates.query.get(release.templatefooterid)
			footer = "<br/>" + DBCompress.decode(tempatedata.templatecontent)

		body = merge.do_merge_test(header + DBCompress.decode(release.emailtemplatecontent) + footer)
		if "returnaddress" in params and params["returnaddress"]:
			fromaddress = params["returnaddress"]
		else:
			fromaddress = Constants.PreviewEmail

		if "emailsendtypeid" in params and  params["emailsendtypeid"]:
			emailsendtypeid = int(params["emailsendtypeid"])
		else:
			emailsendtypeid = Constants.Email_Html_And_Plain

		EmailQueue.send_email_and_attachments(
		  fromaddress,
		  params['emailaddress'],
		  params['subject'],
		  release.get_view_link() + body,
		  EmailTemplates.get_attachments(params["emailtemplateid"]),
		  Constants.EmailQueueType_Internal,
		  "text/html",
		  emailsendtypeid)

	@classmethod
	def build_list(cls, params):
		""" Build the list for the press released based on the selected lists"""

		transaction = cls.sa_get_active_transaction()
		try:
			emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])

			# check status of release !!
			if emailtemplate.pressreleasestatusid == Constants.Distribution_Sent:
				raise Exception("Distribution Already Sent")

			# check to see if exist if does then us this
			nlist = session.query(List).filter_by(listname=emailtemplate.emailtemplatename,
			                                      customerid=params["customerid"],
			                                      listtypeid=Constants.List_Release_Type).all()
			if not nlist:
				# doesn't exist this should be the norm
				nlist = List(listname=emailtemplate.emailtemplatename,
				          customerid=params["customerid"],
				          listtypeid=Constants.List_Release_Type)
				session.add(nlist)
				session.flush()
			else:
				nlist = nlist[0]

			emailtemplate.listid = nlist.listid

			cls._build_distrib(emailtemplate, params)

			session.flush()
			List.do_exclusion(emailtemplate.listid, params["customerid"])

			transaction.commit()

			return nlist.listid
		except:
			LOGGER.exception("Distribute_build_list")
			transaction.rollback()
			raise

	@classmethod
	def _build_distrib(cls, template, params):
		"""Internal build/rebuild a distbution list """
		# execute build list memthod !!!
		SearchSession.Delete(params["userid"], Constants.Search_Standard_Distribute,
		                     Constants.Search_SelectedAll)

		for row in EmailTemplateList.query.filter_by(emailtemplateid=params["emailtemplateid"]).all():
			SearchSession.moveListToSession(
			    (row.listid, ),
			    params["userid"],
			    Constants.Search_Standard_Distribute,
			    0,
			    row.selectionid, 1, True)

		List.addToList(template.listid,
		               1,
		               Constants.Search_SelectedAll,
		               params['userid'],
		               Constants.Search_Standard_Distribute)

		List.do_exclusion(template.listid, params["customerid"])

	@classmethod
	def rebuild_list(cls, params):
		""" Build the list for the press released based on the selected lists"""
		transaction = cls.sa_get_active_transaction()
		try:
			emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])

			# check status of release !!
			if emailtemplate.pressreleasestatusid == Constants.Distribution_Sent:
				raise Exception("Distribution Already Sent")

			cls._build_distrib(emailtemplate, params)

			transaction.commit()

			return emailtemplate.listid
		except:
			LOGGER.exception("Distribute_rebuild_list")
			transaction.rollback()
			raise

	@classmethod
	def rename(cls, params):
		""" rename a template """

		transaction = cls.sa_get_active_transaction()
		try:
			emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])
			emailtemplate.emailtemplatename = params["emailtemplatename"]
			emailtemplate.clientid = params["clientid"]
			emailtemplate.issueid = params["issueid"]

			transaction.commit()
		except:
			LOGGER.exception("EmailTemplate_rename")
			transaction.rollback()
			raise

	@classmethod
	def markassent(cls, params):
		""" Mark a reselease as sent"""

		transaction = cls.sa_get_active_transaction()
		try:
			EmailTemplates.update_content(params)

			emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])

			if emailtemplate.pressreleasestatusid == Constants.Distribution_Sent:
				raise Exception("Distribution Already Sent")

			emailtemplate.pressreleasestatusid = Constants.Distribution_Sent
			emailtemplate.sent_time = datetime.now()
			# at this point we need to fix the list
			# remove duplicates
			session.execute(text("SELECT list_remove_deduplicate(:listid)"), dict(listid=emailtemplate.listid), cls)
			# 1. created a fix data area
			# 2. tell the list it's fixed
			session.execute(text("SELECT fix_distribution_list(:emailtemplateid)"), params, cls)

			# at this point we need to move the
			customer = Customer.query.get(params['customerid'])
			seorelease = None
			tmp = session.query(SEORelease).filter_by(emailtemplateid=params["emailtemplateid"]).all()
			if tmp:
				seorelease = tmp[0]
			if emailtemplate.seopressrelease:
				if seorelease:
					# need to release if embargoed then us that date
					# release now
					seorelease.published = emailtemplate.embargo if emailtemplate.embargo else datetime.now()
					if customer.seonbrincredit > 0:
						# customer has some free ones or prepaid do it here
						customer.seonbrincredit -= 1
						seorelease.seostatusid = Constants.SEO_Live
						seorelease.seopaymenttypeid = Constants.SEO_PaymentType_Sales
					else:
						seorelease.seopaymenttypeid = customer.seopaymenttypeid
						if customer.seopaymenttypeid in (Constants.SEO_PaymentType_DD, Constants.SEO_PaymentType_PO, Constants.SEO_PaymentType_Beta):
							seorelease.seostatusid = Constants.SEO_Live
						elif customer.seopaymenttypeid == Constants.SEO_PaymentType_CC:
							seorelease.seostatusid = Constants.SEO_Waiting_Payment

			elif seorelease and not emailtemplate.seopressrelease:
				# need to clean up
				session.delete(seorelease)

			# reset release to click through
			# when a release is clone etc it need these resetting backward
			if customer.has_clickthrought:
				emailtemplate.setup_clickthrought()

			transaction.commit()
		except:
			LOGGER.exception("EmailTemplate_markassent")
			transaction.rollback()
			raise

	@staticmethod
	def check_for_email_limit_exceeded(emailtemplateid):
		"check_for_email_limit_exceeded"

		# if template no delay then check today
		# if template has deley then check that day

		emailtemplate = EmailTemplates.query.get(emailtemplateid)
		cust = Customer.query.get(emailtemplate.customerid)

		if emailtemplate.embargo:
			datetocheck = emailtemplate.embargo.date()
			cust_sent_dist = session.query(EmailTemplates).\
				filter(EmailTemplates.customerid == cust.customerid).\
				filter(or_(
			        and_(func.DATE(EmailTemplates.embargo) == datetocheck, EmailTemplates.pressreleasestatusid != 1),\
			        and_(func.DATE(EmailTemplates.embargo) is None, func.DATE(EmailTemplates.sent_time) == datetocheck),\
			        EmailTemplates.emailtemplateid == emailtemplate.emailtemplateid)).all()
		else:
			datetocheck = date.today()
			cust_sent_dist = session.query(EmailTemplates).\
				filter(EmailTemplates.customerid == cust.customerid).\
				filter(or_(
			        func.DATE(EmailTemplates.sent_time) == datetocheck, \
			        EmailTemplates.emailtemplateid == emailtemplate.emailtemplateid)).all()
		if cust_sent_dist:
			nbr = 0
			params = {}
			for temp in cust_sent_dist:
				params['emailtemplateid'] = temp.emailtemplateid
				params['selected'] = -1
				counter = EmailQueue.send_email_list_count(params)
				nbr += counter['nbr']
			if nbr > cust.max_emails_for_day:
				return True
		return False

	def get_view_link(self):
		""" get the view as web page link"""

		if self.include_view_as_link:
			return Constants.Distribution_LinkView % (config.get('prmax.web'), self.emailtemplateid)
		else:
			return ""

	@classmethod
	def get_attachments(cls, emailtemplateid):
		""" Load the data for attachments """

		ret = []
		for att in session.query(EmailTemplatesAttachements).filter_by(emailtemplateid=emailtemplateid).all():
			if att.collateralid:
				data = ECollateral.get(att.collateralid)
			else:
				try:
					data = DBCompress.decode(att.content)
				except:
					LOGGER.exception("getAttachments")
					continue
			ret.append((data, att.filename))

		return ret

	@classmethod
	def pull_release(cls, params):
		""" pull a sent emabargoed release """

		# check to see if this is possible
		if EmailTemplates.get(params)["pull"] is False:
			return ttlConstants.Return_Excluded

		transaction = cls.sa_get_active_transaction()
		try:
			# create control record
			emailtemplate = EmailTemplates.query.get(params['emailtemplateid'])
			emailtemplate.emailstatusid = 2
			emailtemplate.embargo = None
			emailtemplate.pressreleasestatusid = 1
			emailtemplate.sent_time = None

			# unfix list
			listd = List.query.get(emailtemplate.listid)
			listd.fixed = False
			# remove all distribution details
			session.execute(text("DELETE FROM userdata.listmemberdistribution WHERE listid = :listid"),
			                dict(listid=emailtemplate.listid), cls)

			# pull seorelease
			seorelease = SEORelease.query.get(params['emailtemplateid'])
			if seorelease:
				# we also need to pull the reference count as well if the customer is paying by
				# credit card
				seorelease.published = None
				seorelease.seostatusid = Constants.SEO_Customer_Withdrawn

			transaction.commit()
			return ttlConstants.Return_Success
		except:
			LOGGER.exception("EmailTemplate_pull_release")
			transaction.rollback()
			raise

	def setup_clickthrought(self):
		"""Process to go thought all a links in the html and replace then with the corrected internal link
		at tis point it's not possible to setup the link that can only be done as the email is sent """

		# need to buill out all "a" with and href
		soup = BeautifulSoup(DBCompress.decode(self.emailtemplatecontent))
		for link in soup.find_all('a', href=True):
			# need to check valid protocol
			fields = link['href'].lower().split(":")
			if len(fields) > 1 and fields[0] not in ("http", "https"):
				continue

			if session.query(EmailTemplatesLinkThrough.emailtemplateslinkthroughid).\
			   filter(EmailTemplatesLinkThrough.emailtemplateid == self.emailtemplateid).\
			   filter(EmailTemplatesLinkThrough.url == link['href']).scalar() is None:
				session.add(EmailTemplatesLinkThrough(
				  emailtemplateid=self.emailtemplateid,
				  url=link['href'],
				  linkname=uuid.uuid1()
				))
				session.flush()

	def remove_has_clickthrought(self):
		"""Go through and remove all a link that have an internal name replacing them with the external name
		I don't think we need this here but
		"""

		return self.emailtemplatecontent

	@classmethod
	def test_email_server(cls, params):
		""" send a test email """

		emailmessaage = EmailMessage(params['fromemailaddress'],
		                             'support@prmax.co.uk',
		                             'Email Account Verification',
		                             'The email account %s has been verified.' %(params['fromemailaddress']),
		                             "text/html"
		                             )
		emailmessaage.BuildMessage()

		if int(params['host']) in SMTPSERVERBYTYPE:
			emailserver = SMTPSERVERBYTYPE[int(params['host'])](
				username=params["username"],
				password=params["password"],
			    host=params["hostname"])
			sender = params['fromemailaddress']
			emailserver.send(emailmessaage, sender)

	@classmethod
	def resend(cls, params):
		"""  Resent an press release"""
		transaction = BaseSql.sa_get_active_transaction()
		try:
			ces = CustomerEmailServer.get(params['customeremailserverid'])
			emailtemplate = EmailTemplates.query.get(params['emailtemplateid'])

			emailmessaage = EmailMessage(ces.fromemailaddress,
			                     params['toemailaddress'],
			                     emailtemplate.subject,
			                     DBCompress.decode(emailtemplate.emailtemplatecontent),
			                     "text/html"
			                     )
			emailmessaage.BuildMessage()
			emailmessaage.cc = params['ccemailaddresses']			

			if ces.servertypeid in SMTPSERVERBYTYPE:
				emailserver = SMTPSERVERBYTYPE[ces.servertypeid](
				    username=CRYPTENGINE.aes_decrypt(ces.username),
				    password=CRYPTENGINE.aes_decrypt(ces.password),
				    host=ces.host)
				sender = ces.fromemailaddress

				(error, statusid) = emailserver.send(emailmessaage, sender)
				if not statusid:
					raise Exception("Problem Sending Email")
				else:
					employee = Employee.query.get(params['employeeid'])
					outlet = Outlet.query.get(employee.outletid)
					contact = Contact.query.get(employee.contactid)					

					listmember = session.query(ListMembers).filter(ListMembers.listid == emailtemplate.listid).filter(ListMembers.outletid == employee.outletid).filter(ListMembers.employeeid == employee.employeeid).scalar()
					if not listmember:
						lm = ListMembers(
							listid = emailtemplate.listid,
							outletid = employee.outletid,
							employeeid = employee.employeeid
						)
						session.add(lm)
						session.flush()
					
						lmd = ListMemberDistribution(
						    listmemberid = lm.listmemberid,
							listid = emailtemplate.listid,
						    job_title = employee.job_title,
						    familyname = contact.familyname,
						    firstname = contact.firstname,
						    prefix = contact.prefix,
						    suffix = contact.suffix,
						    outletname = outlet.outletname,
						    emailaddress = params['toemailaddress'],
						    emailstatusid = 0 #delivered
						)
						session.add(lmd)
						session.flush()

						session.commit()
					
		except:
			transaction.rollback()
			LOGGER.exception("resend emailtemplate")
			raise


class EmailTemplateList(BaseSql):
	""" List of list that are used to create the distribution list """

	Select_Release_Data = """SELECT elt.emailtemplatelistid, l.listname,s.selectionname as selection,
	(SELECT COUNT(*) FROM userdata.listmembers as lm WHERE lm.listid = elt.listid ) AS qty,
	l.listid
	FROM  userdata.emailtemplatelist AS elt
	JOIN userdata.list AS l ON elt.listid = l.listid
	JOIN internal.selection AS s ON elt.selectionid = s.selectionid
	WHERE elt.emailtemplateid = :emailtemplateid
	ORDER BY %s %s
	LIMIT :limit OFFSET :offset
	"""
	Select_Release_Data_Count = """SELECT COUNT(*) FROM userdata.emailtemplatelist AS elt
	JOIN userdata.list AS l ON elt.listid = l.listid
	JOIN internal.selection AS s ON elt.selectionid = s.selectionid
	WHERE elt.emailtemplateid = :emailtemplateid"""

	Select_List_Count = """SELECT COUNT(*) FROM  userdata.listmembers WHERE listid = :listid"""

	@classmethod
	def get_list(cls, params):
		""" List of list that need to be selected for this list """
		if params.has_key("emailtemplateid"):
			params['sortfield'] = params.get('sortfield', 'UPPER(listname)')
			if params['sortfield'] == "listname":
				params['listname'] = 'UPPER(listname)'

			return cls.getGridPage(params,
			                       'UPPER(listname)',
			                       'emailtemplatelistid',
			                       EmailTemplateList.Select_Release_Data,
			                       EmailTemplateList.Select_Release_Data_Count,
			                       cls)
		else:
			return dict(numRows=0, items=[], identifier="emailtemplatelistid")

	@classmethod
	def add_list(cls, params):
		""" Add a list to the list of selected list for a press release """

		transaction = cls.sa_get_active_transaction()
		try:
			lobj = List.query.get(params["listid"])
			obj = session.query(EmailTemplateList).filter_by(
			    emailtemplateid=params["emailtemplateid"],
			    listid=params["listid"]).all()
			if obj:
				emailtemplate = obj[0]
			else:
				emailtemplate = EmailTemplateList(emailtemplateid=params["emailtemplateid"],
				                                  listid=params["listid"])
				session.add(emailtemplate)
				session.flush()

			qty = cls.sqlExecuteCommand(text(EmailTemplateList.Select_List_Count), params, BaseSql.singleFieldInteger)
			transaction.commit()
			return dict(emailtemplatelistid=emailtemplate.emailtemplatelistid,
			            listname=lobj.listname,
			            qty=qty,
			            listid=lobj.listid,
			            selection="All")
		except:
			LOGGER.exception("Emailtemplatelist_addList")
			transaction.rollback()
			raise

	@classmethod
	def  exists(cls, params):
		""" Add a list to the list of selected list for a press release """

		try:
			obj = session.query(EmailTemplateList).filter_by(
			    emailtemplateid=params["emailtemplateid"],
			    listid=params["listid"]).all()

			return True if len(obj) else False

		except:
			LOGGER.exception("Emailtemplatelist_exists")
			raise

	@classmethod
	def update(cls, params):
		""" Add a list to the list of selected list for a press release """

		transaction = cls.sa_get_active_transaction()
		try:
			emailtemplate = EmailTemplateList.query.get(params["emailtemplatelistid"])
			emailtemplate.selectionid = params["selectionid"]
			data = dict(emailtemplatelistid=emailtemplate.emailtemplatelistid,
			            selectionname=Selection.query.get(params["selectionid"]).selectionname)
			transaction.commit()
			return data
		except:
			LOGGER.exception("Emailtemplatelist_update")
			transaction.rollback()
			raise

	@classmethod
	def delete(cls, params):
		""" Delete a list from the email templates list of lists """

		transaction = cls.sa_get_active_transaction()
		try:
			session.delete(EmailTemplateList.query.get(params["emailtemplatelistid"]))
			transaction.commit()
		except:
			LOGGER.exception("Emailtemplatelist_delete")
			transaction.rollback()
			raise

class ListMemberDistribution(BaseSql):
	"""Distributed details of a list"""

	Release_View_Data = """SELECT
	listmemberdistributionid, outletname,job_title,
	ContactName(prefix, firstname, '', familyname, suffix) as contactname,
	emailstatusid,
	emailaddress,
	CASE WHEN emailstatusid = 0 THEN 'Delivered'
	WHEN emailstatusid = 1 THEN 'Viewed'
	WHEN emailstatusid = 2 THEN 'Processing'
	WHEN emailstatusid = 3 THEN 'Emailing'
	WHEN emailstatusid = 5 THEN 'Duplicate'
	WHEN emailstatusid = 4 THEN 'No Address'
	WHEN emailstatusid = 6 THEN 'Sent'
	WHEN emailstatusid = 7 THEN 'Responded'
	WHEN emailstatusid = 8 THEN 'Unsubscribed'
	ELSE '' END as status,
	CASE WHEN msg IS NULL THEN false ELSE true END as hasmsg
	FROM  userdata.listmemberdistribution AS lmd
	WHERE lmd.listid = :listid
	ORDER BY %s %s
	LIMIT :limit OFFSET :offset
	"""

	Release_View_Data_Count = """SELECT COUNT(*) FROM  userdata.listmemberdistribution WHERE listid = :listid"""

	Release_View_Data_LM = """SELECT
	lm.listmemberid AS listmemberdistributionid,
	o.outletname,
	e.job_title,
	ContactName(c.prefix, c.firstname, '', c.familyname, c.suffix) as contactname,
	-1 AS emailstatusid,
	'Pending' as status,
	false AS hasmsg
	FROM  userdata.listmembers AS lm
	JOIN outlets AS o ON o.outletid = lm.outletid
	JOIN employees AS e ON e.employeeid = COALESCE ( lm.employeeid,o.primaryemployeeid)
	LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
	WHERE lm.listid = :listid
	ORDER BY %s %s
	LIMIT :limit OFFSET :offset
	"""

	Release_View_Data_Count_LM = """SELECT COUNT(*) FROM  userdata.listmembers WHERE listid = :listid"""

	@classmethod
	def get_grid_page(cls, params):
		""" get the details """

		if not params.has_key("emailtemplateid"):
			return dict(identity="listmemberdistributionid", numRows=0, items=[])
		else:
			emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])
			params["listid"] = emailtemplate.listid

			params['sortfield'] = params.get('sortfield', 'UPPER(outletname)')
			if params['sortfield'] == "job_title":
				params['sortfield'] = "UPPER(job_title)"
			if params['sortfield'] == "contactname":
				params['sortfield'] = "UPPER(familyname)"
			if params['sortfield'] == "emailaddress":
				params['sortfield'] = "UPPER(emailaddress)"

			if emailtemplate.pressreleasestatusid == Constants.Distribution_Sent:
				return BaseSql.getGridPage(params,
				                           'UPPER(outletname)',
				                           'listmemberdistributionid',
				                           ListMemberDistribution.Release_View_Data,
				                           ListMemberDistribution.Release_View_Data_Count,
				                           cls)
			else:
				return BaseSql.getGridPage(params,
				                           'UPPER(outletname)',
				                           'listmemberdistributionid',
				                           ListMemberDistribution.Release_View_Data_LM,
				                           ListMemberDistribution.Release_View_Data_Count_LM,
				                           cls)

	@classmethod
	def markasread(cls, listmember):
		""" mark distribution as read"""
		try:
			listmemberid = int(listmember)
			listm = ListMemberDistribution.query.filter_by(listmemberid=listmemberid).all()
			if listm:
				transaction = cls.sa_get_active_transaction()
				# set view but not if this is comming from an email tht may have bounced
				if listm[0].emailstatusid not in (6, 7):
					listm[0].emailstatusid = 1
					listm[0].nbrviews += 1
				transaction.commit()
		except:
			LOGGER.exception("listmemberdistribution_markasread")
			transaction.rollback()

	@staticmethod
	def addlink_clicked(listmemberdistribution, linkname):
		""" update link clicked """
		try:
			listmemberdistributionid = int(listmemberdistribution)
			listm = ListMemberDistribution.query.filter_by(listmemberdistributionid=listmemberdistributionid).all()
			emaillinks = session.query(EmailTemplatesLinkThrough).filter(EmailTemplatesLinkThrough.linkname == linkname).scalar()
			# we need update the actual link that was pressed as well it may be good to keep an audit?
			if listm:
				transaction = BaseSql.sa_get_active_transaction()
				#
				if listm[0].emailstatusid not in (6, 7):
					listm[0].nbrclicks += 1
					if emaillinks:
						emaillinks.nbrclick += 1

				transaction.commit()
			# at this point we want to return the actual url we need
			if emaillinks:
				return emaillinks.url
			return None
		except:
			LOGGER.exception("listmemberdistribution_addlink_clicked")
			transaction.rollback()

	@classmethod
	def get_message_details(cls, listmemberdistributionid):
		""" get the text part of a message """

		lmdist = ListMemberDistribution.query.get(listmemberdistributionid)
		if lmdist.msg_as_text:
			return lmdist.msg
		else:
			# why this works and the other don't i have no idea
			msg = email.message_from_file(StringIO.StringIO(lmdist.msg))
			analysis = AnalysisMessage(msg, False)

			return analysis._getMessageBody()[0:4000].replace("\n", "<br/>")

class EmailTemplatesAttachements(BaseSql):
	""" attachement for an email"""

	Release_View_Data = """SELECT
	emailtemplatesattachementid, filename,size
	FROM  userdata.emailtemplatesattachements
	WHERE emailtemplateid = :emailtemplateid
	ORDER BY %s %s
	LIMIT :limit OFFSET :offset
	"""

	Release_View_Data_Count = """SELECT COUNT(*) FROM  userdata.emailtemplatesattachements WHERE emailtemplateid = :emailtemplateid"""

	@classmethod
	def get_grid_page(cls, params):
		""" get the details """

		if not params.has_key("emailtemplateid"):
			return dict(identity="emailtemplatesattachementid", numRows=0, items=[])
		else:
			return BaseSql.getGridPage(params,
			                           'UPPER(filename)',
			                           'emailtemplatesattachementid',
			                           EmailTemplatesAttachements.Release_View_Data,
			                           EmailTemplatesAttachements.Release_View_Data_Count,
			                           cls)

	@classmethod
	def attachement_add_file(cls, params):
		""" add an file as attachment """

		transaction = cls.sa_get_active_transaction()
		try:
			data = params["attfilename"].file.read()
			attachment = EmailTemplatesAttachements(
								content=DBCompress.encode2(data),
			          size=len(data),
			          filename=os.path.split(params["attfilename"].filename)[1],
			          emailtemplateid=params["emailtemplateid"])
			session.add(attachment)
			session.flush()
			emailtemplatesattachementid = attachment.emailtemplatesattachementid
			transaction.commit()
			return emailtemplatesattachementid
		except:
			LOGGER.exception("attachement_add_file")
			transaction.rollback()
			raise

	@classmethod
	def attachement_add_collateral(cls, params):
		""" add a link from an attachment """
		transaction = cls.sa_get_active_transaction()
		try:
			coll = Collateral.query.get(params["collateralid"])

			attachment = EmailTemplatesAttachements(
			  size=coll.collaterallength,
			  filename=os.path.split(coll.filename)[1],
			  collateralid=params["collateralid"],
			  emailtemplateid=params["emailtemplateid"])
			session.add(attachment)
			session.flush()
			emailtemplatesattachementid = attachment.emailtemplatesattachementid
			transaction.commit()
			return emailtemplatesattachementid
		except:
			LOGGER.exception("attachement_add_collateral")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, params):
		""" get record no content """

		attachment = EmailTemplatesAttachements.query.get(params["emailtemplatesattachementid"])
		return dict(emailtemplatesattachementid=attachment.emailtemplatesattachementid,
		            size=attachment.size,
		            filename=attachment.filename)

	@classmethod
	def attachement_delete(cls, params):
		""" Delete an attachment """
		transaction = cls.sa_get_active_transaction()
		try:
			emailattachment = EmailTemplatesAttachements.query.get(params["emailtemplatesattachementid"])
			if emailattachment:
				session.delete(emailattachment)
			transaction.commit()
		except:
			LOGGER.exception("attachement_delete")
			transaction.rollback()
			raise

class EmailTemplatesLinkThrough(object):
	"""link throught fake to real emails"""

	def prmax_url(self, listmemberid):
		"Get the prmax_encoded url"

		return "%s/%d/click/%s" % (config.get('prmax.clickthrought'), listmemberid, self.linkname)

class EmailHeader(BaseSql):

	List_Email_Headers = """SELECT emailheaderdescription FROM internal.emailheader"""
	List_Email_Headers_count = """SELECT count(*) FROM internal.emailheader"""

	@classmethod
	def getLookUp(cls, params):
		data = [dict(id=row.emailheaderid, name=row.emailheaderdescription)
		        for row in session.query(EmailHeader).\
		        filter(or_(EmailHeader.customerid == int(params["customerid"]), EmailHeader.customerid is None)).\
		        order_by(EmailHeader.emailheaderdescription).all()]
		return data

	@classmethod
	def add(cls, params):
		""" add a new emailheader record """

		try:
			transaction = cls.sa_get_active_transaction()
			emailheader = EmailHeader(
			    emailheaderdescription=params["emailheaderdescription"],
			    customerid=params.get("customerid", None),
			    htmltext=params["htmltext"])
			session.add(emailheader)
			session.flush()
			transaction.commit()
			return emailheader.emailheaderid
		except:
			LOGGER.exception("Email_header_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, emailheaderid):

		return EmailHeader.query.get(emailheaderid)

class EmailFooter(BaseSql):

	List_Email_Footers = """SELECT emailfooterdescription FROM internal.emailfooter"""
	List_Email_Servers_count = """SELECT count(*) FROM internal.emailfooter"""

	@classmethod
	def getLookUp(cls, params):
		data = [dict(id=row.emailfooterid, name=row.emailfooterdescription)
		        for row in session.query(EmailFooter).\
		        filter(or_(EmailFooter.customerid == int(params["customerid"]), EmailFooter.customerid is None)).\
		        order_by(EmailFooter.emailfooterdescription).all()]
		return data

	@classmethod
	def add(cls, params):
		""" add a new emailfooter record """

		try:
			transaction = cls.sa_get_active_transaction()
			emailfooter = EmailFooter(
			    emailfooterdescription=params["emailfooterdescription"],
			    customerid=params.get("customerid", None),
			    htmltext=params["htmltext"])
			session.add(emailfooter)
			session.flush()
			transaction.commit()
			return emailfooter.emailfooterid
		except:
			LOGGER.exception("Email_footer_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, emailfooterid):

		return EmailFooter.query.get(emailfooterid)

class EmailLayout(BaseSql):

	List_Email_Layouts = """SELECT emaillayoutdescription FROM internal.emaillayout"""
	List_Email_Servers_count = """SELECT count(*) FROM internal.emaillayout"""

	@classmethod
	def getLookUp(cls, params):
		data = [dict(id=row.emaillayoutid, name=row.emaillayoutdescription)
		        for row in session.query(EmailLayout).order_by(EmailLayout.emaillayoutdescription).all()]
		return data

	@classmethod
	def add(cls, params):
		""" add a new emaillayout record """

		try:
			transaction = cls.sa_get_active_transaction()
			emaillayout = EmailLayout(
			    emaillayoutdescription=params["emaillayoutdescription"],
			    customerid=params.get("icustomerid", None))
			session.add(emaillayout)
			session.flush()
			transaction.commit()
			return emaillayout.emaillayoutid
		except:
			LOGGER.exception("Email_layout_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, emaillayoutid):

		return EmailLayout.query.get(emaillayoutid)




################################################################################
## get definitions from the database
################################################################################

EmailQueue.mapping = Table('emailqueue', metadata, autoload=True, schema="queues")
EmailTemplates.mapping = Table('emailtemplates', metadata, autoload=True, schema="userdata")
EmailTemplateList.mapping = Table('emailtemplatelist', metadata, autoload=True, schema="userdata")
ListMemberDistribution.mapping = Table('listmemberdistribution', metadata, autoload=True, schema="userdata")
EmailTemplatesAttachements.mapping = Table('emailtemplatesattachements', metadata, autoload=True, schema="userdata")
EmailTemplatesLinkThrough.mapping = Table('emailtemplateslinkthrough', metadata, autoload=True, schema="userdata")
EmailHeader.mapping = Table('emailheader', metadata, autoload=True, schema="internal")
EmailFooter.mapping = Table('emailfooter', metadata, autoload=True, schema="internal")
EmailLayout.mapping = Table('emaillayout', metadata, autoload=True, schema="internal")

mapper(EmailQueue, EmailQueue.mapping)
mapper(EmailTemplates, EmailTemplates.mapping)
mapper(EmailTemplateList, EmailTemplateList.mapping)
mapper(ListMemberDistribution, ListMemberDistribution.mapping)
mapper(EmailTemplatesAttachements, EmailTemplatesAttachements.mapping)
mapper(EmailTemplatesLinkThrough, EmailTemplatesLinkThrough.mapping)
mapper(EmailHeader, EmailHeader.mapping)
mapper(EmailFooter, EmailFooter.mapping)
mapper(EmailLayout, EmailLayout.mapping)
