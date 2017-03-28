# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:				bouncedemails.py
# Purpose:		Access a mail box and looks as the source of bounce and anaalyses
#							the email if it's possible will link the email up to the distribtuion
#							record it will also then set the entry in the
#
# Author:			Chris Hoy
#
# Created:		23/06/2011
# RCS-ID:			$Id:  $
# Copyright:	(c) 2011

#-----------------------------------------------------------------------------

import imaplib
import email
from ttl.postgres import DBConnect
import prcommon.Constants as Constants

class ConnectToImap(object):
	""" access the dump email box for all bounced emails
	"""
	# email server settings
	_Email_IMAP_host = "imap.gmail.com"
	_Email_Support_User = "feedback_all@prmax.co.uk"
	_Email_Support_Password = "u3J5jwHP"

	def __init__(self):
		""" init the connection too the email server """
		self._msg_ids = []
		self._connection = imaplib.IMAP4_SSL ( ConnectToImap._Email_IMAP_host )

	def login(self, account, password ):
		""" login to the account """
		self._connection.login ( account, password )

	def close(self):
		""" close email server collection """
		self._connection.close()

	def selectINBOX(self):
		""" select the inbox"""
		typ, data = self._connection.select('INBOX')

	def getEmailList(self):
		""" get a list of msgs id's in the inbox """
		typ, msg_ids = self._connection.search(None, 'UNSEEN')
		self._msg_ids = [ r for r in msg_ids[0].split(' ') if r ]

	def getMessage(self, msg_id):
		""" get the content of a specific message using it's message id"""
		msg = None
		msg_text = ""
		typ,msg_data = self._connection.fetch(msg_id, '(RFC822)')
		for response_part in msg_data:
			if isinstance(response_part, tuple):
				msg = email.message_from_string( response_part[1])
				msg_text = response_part[1]
				break
		return msg, msg_text

	def archiveMessage(self , msg_id):
		""" move a message to the archive mail store """
		self._connection.store(msg_id, '+FLAGS', '\\Seen')
		self._connection.store(msg_id, '+FLAGS', '\\Deleted')
		self._connection.expunge()

	def restEmail(self, msg_id):
		""" convert the message back too unread"""
		self._connection.store(msg_id, '+FLAGS', '\\UnSeen')

	def updateMessage(self):
		""" update mail box """
		self._connection.expunge()

class AnalysisMessage(object):
	# strings that are out off of office
	__bounced_subjects = ("mail delivery failed",
	                      "mail delivery failure",
	                      "delivery status notification (failure)",
	                      "undelivered mail returned to sender",
	                      "there was an error sending your mail",
	                      "mail delivery failed: returning message to sender",
	                      "undeliverable mail",
	                      "delivery has failed",
	                      "undeliverable",
	                      "the recipient's e-mail address was not found in the recipient's e-mail system",
	                      "i will no longer be working at",
	                      "i am no longer at",
	                      "failed recipients",
	                      "recipient unknown",
	                      "unknown user account",
	                      "remote host said: 550 5.1.1 user unknown",
	                      "the email address that you entered couldn't be found",
	                      "delivery has failed to these recipients or distribution lists:")
	def __init__(self, msg, istest ) :
		""" setup default settings"""
		self._msg = msg
		self._to = ""
		self._isdistbounce = False
		self._listmemberdistributionid = None
		self._emailstatusid = Constants.Distribution_Email_OutofOffice
		self._key = "D" if not istest else "T"
		self._subject = ""
		self._wrongtype = False

	@property
	def wrongEnvironment(self):
		return self._wrongtype

	@property
	def subject(self):
		""" subject line of email """
		return self._subject

	@property
	def body(self):
		""" get the body test """

		return self._getMessageBody()

	@property
	def listmemberdistributionid(self):
		""" list memeber id extracted from return email address"""
		return self._listmemberdistributionid

	@property
	def emailstatusid(self):
		""" email status id """
		return self._emailstatusid

	@property
	def isdist(self):
		""" is the message a bounce from a distribution record """
		return self._isdistbounce

	# email address too ignore
	_IgnoreEmails = { 'info@prmax.co.uk': True ,
	                  'root@prmax.co.uk': True,}


	@property
	def isIgnoreEmailAddress(self):
		""" check too see if the email address is in the potential ignore list """
		if self._msg["to"] == None:
			return True
		return self._msg["to"].lower().strip("<>") in AnalysisMessage._IgnoreEmails

	@property
	def emailaddress(self):
		""" return the email address """
		self._msg["to"].lower().strip("<>")


# we need to entend the anlysis to bounced research items as well


	def analysis(self):
		""" analyse an email message"""

		# extract the too address
		if self._msg["to"]:
			self._to = self._msg["to"].strip("<>")
		else:
			self._to

		t = self._to.split(".")

		# this is a bounced email from a distribution
		# only link up if we are sending from the correct source
		if len(t)>1 and t[0].upper() == self._key:
			self._isdistbounce = True
			try:
				ename = t[1].split("@")[0]
				if ename.find("-") != -1:
					ename = ename.split("-")[0]
				self._listmemberdistributionid = int(ename)
			except : pass
		elif len(t)>1 and t[0] in ("T","D"):
			self._wrongtype = True

		# determine reason
		self._subject  = self._msg["subject"].lower()
		for row in AnalysisMessage.__bounced_subjects:
			if self._subject.find(row) != -1 :
				self._emailstatusid = Constants.Distribution_Email_Bounced
				break
		else:
			body = self._getMessageBody().lower()
			for row in AnalysisMessage.__bounced_subjects:
				if body.find(row) != -1 :
					self._emailstatusid = Constants.Distribution_Email_Bounced
					break

	def _getMessageBody(self):
		""" retrive the text part of the message box to analyse """
		body = ""
		for part in self._msg.walk():
			if part.get_content_type() == "text/plain":
				if not body:
					body += "\n\r"
				try:
					body += part.get_payload(None, True).decode("utf-8",'replace')
				except:
					body += part.get_payload(None, True)

		if not body:
			for part in self._msg.walk():
				if part.get_content_type() == "text/html":
					if not body:
						body += "\n\r"
					try:
						body += part.get_payload(None, True).decode("utf-8",'replace')
					except:
						body += part.get_payload(None, True)

		return body

class AnalysisMessages(ConnectToImap,DBConnect):
	""" Class to analyse bounceded email message and then update the database based
	on the respose """

	# sql statements
	_sql_set_status = """ UPDATE userdata.listmemberdistribution SET emailstatusid = %(emailstatusid)s, msg = %(emailmessage)s, msg_as_text = %(msg_as_text)s  WHERE listmemberdistributionid = %(listmemberdistributionid)s"""
	_sql_get_dist = """SELECT outletid,employeeid FROM userdata.listmemberdistribution AS lmd JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid WHERE lmd.listmemberdistributionid = %(listmemberdistributionid)s"""
	_sql_research_record = """INSERT INTO research.bounceddistribution(listmemberdistributionid, emailmessage, outletid, employeeid, subject, isautomated, emailaddress)
															VALUES(%(listmemberdistributionid)s, %(emailmessage)s, %(outletid)s, %(employeeid)s, %(subject)s,%(isautomated)s,%(emailaddress)s)"""
	_sql_research_record_Exists = """SELECT listmemberdistributionid FROM research.bounceddistribution WHERE listmemberdistributionid = %(listmemberdistributionid)s"""

	def __init__(self, log , istest ):
		""" setup all the connection"""
		DBConnect.__init__(self, Constants.db_Command_Service)
		ConnectToImap.__init__(self)
		self._log = log
		self._istest = istest

	def run(self):
		""" do process"""

		# get emails
		self.login( AnalysisMessages._Email_Support_User, AnalysisMessages._Email_Support_Password )
		self.selectINBOX()
		self.getEmailList()

		# analyse email
		for i, msg_id in enumerate(self._msg_ids):
			self._log.info("Processing %d" % i )
			msg, msg_text = self.getMessage(msg_id)
			if not msg:
				continue
			a = AnalysisMessage ( msg , self._istest)
			a.analysis()
			if a.wrongEnvironment:
				self.restEmail( msg_id )
				continue

			# is an ignore message move to archive and ignore
			if a.isIgnoreEmailAddress:
				self.archiveMessage(msg_id)
				self.updateMessage()
				continue


			try:
				msg_text2 = msg_text.encode("utf8")
				msg_text2 = msg_text
			except:
				msg_text2 = msg_text.decode("utf8",'replace')

			params = dict (
			  mailstatusid = a.emailstatusid ,
			  outletid = None,
				employeeid = None ,
			  listmemberdistributionid = None,
				subject = a.subject,
			  emailmessage = msg_text2,
			  emailstatusid = a.emailstatusid,
			  emailaddress = a.emailaddress,
			  isautomated = False)

			cur = self.getCursor()
			self.startTransaction ( cur )

			if a.isdist:
				params["listmemberdistributionid"] = a.listmemberdistributionid
				params["isautomated"] = False
				if a.emailstatusid == Constants.Distribution_Email_OutofOffice:
					params["isautomated"] = True

				# only log if not a double process
				cur.execute(AnalysisMessages._sql_research_record_Exists, params )
				t = cur.fetchall()
				if not t:
					# log the record into the action queue
					cur.execute ( AnalysisMessages._sql_get_dist, params )
					t = cur.fetchall()
					if t:
						params["outletid"] = t[0][0]
						params["employeeid"] = t[0][1]
					else:
						params["listmemberdistributionid"] = None
					cur.execute ( AnalysisMessages._sql_research_record , params )
				# if this is a distribution bounce then update database and add entry
				# too the research queue
				# set mail status and bounced//out off office
				if a.emailstatusid == Constants.Distribution_Email_Bounced:
					params["emailmessage"] = None
					params["msg_as_text"] = False
				else:
					params["emailmessage"] = a._getMessageBody()
					params["msg_as_text"] = True

				cur.execute( AnalysisMessages._sql_set_status , params )

			# only add to bounced email that can be linked to a distribution/outlet
			#else:
			#	cur.execute ( AnalysisMessages._sql_research_record , params )

			self.commitTransaction ( cur )
			cur.close()
			self.archiveMessage(msg_id)
		self.updateMessage()

		return len(self._msg_ids)
