# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        email.py
# Purpose:     Class and function to handles access to a pop sever
#
# Author:      Chris Hoy
#
# Created:     16/12/2008
# RCS-ID:      $Id: EmailLibrary.py $
# Copyright:   (c) 2008
# Licence:
#-----------------------------------------------------------------------------

import smtplib
import cStringIO
import base64
import email
import mimetypes
import os.path
import platform
import logging
import chardet
import types

log = logging.getLogger("ttl")

try:
	from bs4 import BeautifulSoup
	BSV4 = True
except:
	print ("Need to Install BeautifulSoup 4")
	from BeautifulSoup import BeautifulSoup
	BSV4 = False
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email.MIMEImage import MIMEImage
from email import Encoders
from email.charset import Charset, QP,BASE64
from ttl.string import TranslateToHtmlEntities


class EmailMessage:
	def __init__(self, fromAddress, toAddress, Subject, Body,
				       bodytype="text/plain", bounce= "support@prmax.co.uk",
	             replyTo= None,
				       useUTF8 = False , senderaddress = None,
				       sendAddress = None, mailedby = "prmax.co.uk"):
		#toAddress = "pr@kinton.biz"

		self.toAddress = toAddress
		self.Subject = Subject
		self.Body = Body
		self.Bounce = bounce
		self._mailedby = mailedby
		self.fromAddress = fromAddress
		self.sendAddress = sendAddress
		self.replyTo = replyTo if replyTo else fromAddress
		if senderaddress != None:
			self.sender = senderaddress
		else:
			self.sender = fromAddress
		# fix up sender to just email address
		if self.sender:
			self.sender = ExtractEmailAddress ( self.sender )

		self.attachments = []
		self._embedd = []
		self.bodytype = bodytype
		self.bcc = None
		self.coding = "iso-8859-1"
		self._charset = "iso-8859-1"
		self._useUTF8 = useUTF8
		self._cc = None
		self._list_unsubscribe = None
		self._x_mailer = None
		self._dkim = None

		if useUTF8:
			self.coding = Charset("utf-8")
			self._charset = "utf-8"
			#self.coding.header_encoding = QP
			#self.coding.body_encoding = QP

	def addAttachment(self, fileData , fileName):
		self.attachments.append((fileData, fileName ))

	def addEmbeddedImages(self, linkid , fileData, content):
		self._embedd.append ( ( linkid, fileData, content ) )

	def set_cc(self,  ccaddress):
		"Set the cc address"
		self._cc =  ccaddress

	def get_cc(self):
		"""get cc"""

		return self._cc

	cc = property(get_cc, set_cc)

	def set_list_unsubscribe(self,  list_unsubscribe):
		"Set _list_unsubscribe"
		self._list_unsubscribe = list_unsubscribe

	def set_x_mailer(self, xmailer):
		"set x mailer"
		self._x_mailer = xmailer

	def set_dkim(self, dkim):
		self._dkim = dkim
		self.mainMsg["DKIM-Signature"] = self._dkim

	def get_list_unsubscribe(self):
		"""get _list_unsubscribe"""

		return self._list_unsubscribe

	def BuildMessage(self):
		""" """

		# set basic coding same

		self.mainMsg=MIMEMultipart('related')

		# make sure encoding is consistant
		# chnage encoding format
		if not self._useUTF8:
			self.mainMsg["Content-Transfer-Encoding"] = "quoted-printable"

		self.mainMsg.set_charset(self.coding)

		self.mainMsg["To"]=self.toAddress
		self.mainMsg["From"]=self.fromAddress
		if self.cc:
			if type(self.cc) == types.ListType:
				self.mainMsg["Cc"] = ",".join([row for row in self.cc])
			else:
				self.mainMsg["Cc"] = self.cc

		self.mainMsg["reply-To"]=self.replyTo
		self.mainMsg["Subject"]=self.Subject
		self.mainMsg["Date"]= email.Utils.formatdate(localtime=1)
		if self._mailedby:
			self.mainMsg["mailed-by"]  = self._mailedby
		self.mainMsg["Sender"] = self.sender

		self.messageid = email.Utils.make_msgid()
		self.mainMsg["Message-ID"] = self.messageid

		if self._x_mailer:
			self.mainMsg["X-Mailer"] = self._x_mailer

		if self._dkim:
			self.mainMsg["DKIM-Signature"] = self._dkim

		#self.mainMsg["Precedence"] = "bulk"

		if self.bcc:
			self.mainMsg["bcc"] = self.bcc

		if self._list_unsubscribe:
			self.mainMsg["List-Unsubscribe"] =  self._list_unsubscribe

		if self.Bounce:
			self.mainMsg["Errors-To"] = self.Bounce
			self.mainMsg["Bounces-to"]= self.Bounce

		self.mainMsg.preamble="This is a multi-part message in MIME format.\n\n"
		self.mainMsg.epilogue=""

		self._msgAlternative = MIMEMultipart('alternative')
		self._msgAlternative.set_charset(self.coding)
		self.mainMsg.attach(self._msgAlternative)

		if not self._useUTF8:
			try:
				text = self.Body.encode(self.coding,'xmlcharrefreplace')
			except:
				text = self.Body
			# fixup
			text = TranslateToHtmlEntities ( text )
		else:
				text = self.Body

		# fixeup html
		text = text.replace("<p>&nbsp;</p><br />","<br/>")
		text = text.replace("<p>&nbsp;</p><br/>","<br/>")
		# add shape
		html = "<html><body>" + text + "</body></html>"
		# need  too add code here at end of line self.coding this may fix the outlook issue?
		# at this point we need to add a plain section
		# convert the html too text only and add
		try:
			soup = BeautifulSoup(html)
			if BSV4:
				plain = soup.get_text()
			else:
				plain = "".join(soup.findAll(text=True))

			plain = plain.encode(self._charset, "ignore")

		except Exception, e:
			print (e)
			plain = "Please view in HTML mode"

		self._msgAlternative.attach(MIMEText(plain, 'plain', self._charset))
		self._msgAlternative.attach(MIMEText(html, 'html', self._charset))

		for (fileData,fileName) in self.attachments:
			ctype, encoding = mimetypes.guess_type(fileName)
			if ctype is None or encoding is not None:
				ctype = getContentType(fileName)
				if not ctype:
					ctype = 'application/octet-stream'

			maintype, subtype = ctype.split('/', 1)

			# !!! at this point we need to add code for types !!!!!
			part = MIMEBase(maintype, subtype)
			part.set_payload( fileData )
			Encoders.encode_base64(part)
			part.add_header('Content-Disposition', 'attachment; filename="%s"' % fileName)
			self.mainMsg.attach( part )

		for (linkid,fileData, contenttype) in self._embedd:
			msgImage = MIMEImage(fileData, contenttype)
			msgImage.add_header('Content-ID', '<'+linkid+'>')
			self.mainMsg.attach(msgImage)

	def setBcc( self ):
		""" Chnage to end bcc"""

		del self.mainMsg["To"]
		self.mainMsg["To"] = self.bcc

	def setCc( self ):
		""" Chnage to end bcc"""

		del self.mainMsg["To"]
		self.mainMsg["To"] = self.cc


	def serialise(self):
		return self.mainMsg.as_string()

	def BuildMessageHtmlOnly(self):
		"""
		Because of a bug in apple we can no longer send text and html views as the attachment are hidden on the macs
		"""

		# crete message
		self.mainMsg = MIMEMultipart()

		# make sure encoding is consistant
		# chnage encoding format
		if not self._useUTF8:
			self.mainMsg["Content-Transfer-Encoding"] = "quoted-printable"
		self.mainMsg.set_charset(self.coding)

		# setup basic details
		self.mainMsg["To"] = self.toAddress
		self.mainMsg["From"] = self.fromAddress
		self.mainMsg["reply-To"] = self.replyTo
		self.mainMsg["Subject"] = self.Subject
		self.mainMsg["Date"]= email.Utils.formatdate(localtime=1)
		self.mainMsg["mailed-by"]  = self._mailedby
		self.mainMsg["Sender"] = self.sender
		self.messageid = email.Utils.make_msgid()
		self.mainMsg["Message-ID"] = self.messageid
		#self.mainMsg["Precedence"] = "bulk"
		if self._cc:
			if type(self._cc) == types.ListType:
				self.mainMsg["Cc"] = ",".join([row for row in self._cc])
			else:
				self.mainMsg["Cc"] = self._cc

		# copies
		if self.bcc:
			self.mainMsg["bcc"] = self.bcc

		# error handling
		self.mainMsg["Errors-To"] = self.Bounce
		self.mainMsg["Bounces-to"]= self.Bounce

		self.mainMsg.preamble="This is a multi-part message in MIME format.\n"
		self.mainMsg.epilogue=""

		# if sending as utf8
		if not self._useUTF8:
			try:
				text = self.Body.encode(self.coding,'xmlcharrefreplace')
			except:
				text = self.Body
			# fixup
			text = TranslateToHtmlEntities ( text )
		else:
				text = self.Body

		# fixeup html
		text = text.replace("<p>&nbsp;</p><br />","<br/>")
		text = text.replace("<p>&nbsp;</p><br/>","<br/>")

		# add body to html
		html = "<html><body>" + text + "</body></html>"

		self.mainMsg.attach(MIMEText(html, 'html', self._charset))

		# add attachements
		for (fileData,fileName) in self.attachments:
			ctype, encoding = mimetypes.guess_type(fileName)
			if ctype is None or encoding is not None:
				ctype = getContentType(fileName)
				if not ctype:
					ctype = 'application/octet-stream'

			maintype, subtype = ctype.split('/', 1)

			# !!! at this point we need to add code for types !!!!!
			part = MIMEBase(maintype, '%s; name="%s"' %(subtype, fileName))
			part.set_payload( fileData )
			Encoders.encode_base64(part)
			part.add_header('Content-Disposition', 'attachment; filename="%s"' % fileName)
			self.mainMsg.attach( part )

		for (linkid,fileData, contenttype) in self._embedd:
			msgImage = MIMEImage(fileData, contenttype)
			msgImage.add_header('Content-ID', '<'+linkid+'>')
			self.mainMsg.attach(msgImage)

class GoogelEmailAccounts(object):
	""" Handle the list of email address that need to be sent out via the google email
	account. This allows 1 complete audit trail. Improved any spam as google will think
	it's coming from it even thougth aer machine in a defined sender"""

	################### this required python 2.6 ######################
	# list of accounts
	_AccountDetails = {
	  "support@prmax.co.uk": ("support@prmax.co.uk", "RxeuSIw4"),
	  # "accounts@prmax.co.uk": ("accounts@prmax.co.uk", "william222"),
	}

	def isPrmaxSender(self, emailaddress):
		""" Chec  too see if an address has a specific account """

		if emailaddress:
			tmp  = ExtractEmailAddress(emailaddress.lower())
			if GoogelEmailAccounts._AccountDetails.has_key ( tmp ) :
				return True
		return False

	def getLoginDetails(self, emailaddress ):
		""" return the login details for a specific address """

		tmp  = ExtractEmailAddress(emailaddress.lower())
		return GoogelEmailAccounts._AccountDetails[tmp]

# module instance
prmaxCtrl = GoogelEmailAccounts()

class SMTPServer(object):
	""" handle and send an email to any server
	"""
	def __init__(self, host = "localhost",
	             port = 0 ,
	             https = False,
	             authorise = False,
	             username = None ,
	             password = None ):
		"settings"
		self._host = host
		self._port = port
		self._https = https
		self._authorise =  authorise
		self._username = username
		self._password = password
		self._smtp = None

	def open(self):
		"""open connection"""

		self.close()

		if self._https:
			self._smtp = smtplib.SMTP_SSL(host=self._host, port=self._port)
			self._smtp.ehlo()
			if self._authorise:
				self._smtp.login(self._username, self._password)
		else:
			self._smtp = smtplib.SMTP(host=self._host, port=self._port)

	def close(self):
		"close connnection"

		if self._smtp:
			try:
				self._smtp.quit()
			except:
				pass
		self._smtp =  None

	def send(self, message, sender = None):
		" send "
		failurem = ''
		statusid = True
		try:

			addr = sender if sender else "feedback_all@prmax.co.uk"

			self.open()
			toAddress = message.toAddress
			result = self._smtp.sendmail( addr,
				                            toAddress,
				                            message.serialise() )
			if message.bcc:
				message.setBcc()
				self._smtp.sendmail( message.fromAddress,
					             message.bcc,
					             message.serialise() )

			self.close()

			if result :
				statusid = False
				failurem = 'Code %s:%s' % (result[0][0],result[0][1])

		except Exception, details:
			statusid = False
			failurem = str(details)

		return (failurem, statusid)

class SMTPServerBase(object):
	def __init__(self, host=None,
	             port=-1,
               https=True,
               authorise=True,
               username=None,
               password=None,
	             limit=500,
	             starttls=True):
		self._limit = limit
		self._host = host
		self._port = port
		self._https = https
		self._authorise = authorise
		self._username = username
		self._password = password
		self._smtp = None
		self._starttls = starttls

	@property
	def limit(self):
		return self._limit

	def open(self):
		"""open connection"""

		self.close()

		if self._https:
			self._smtp = smtplib.SMTP_SSL(host=self._host, port=self._port)
		else:
			self._smtp = smtplib.SMTP(host=self._host, port=self._port)

		self._smtp.ehlo()
		if self._starttls:
			self._smtp.starttls()
		if self._authorise:
			self._smtp.login(self._username, self._password)

	def close(self):
		"close connnection"

		if self._smtp:
			try:
				self._smtp.quit()
			except:
				pass
		self._smtp =  None

	def send(self, message, sender = None):
		" send "
		failurem = ''
		statusid = True
		try:

			addr = sender if sender else message.fromAddress

			self.open()
			toAddress = message.toAddress.split(',')
			result = self._smtp.sendmail(addr,
		                               toAddress,
		                               message.serialise())
			if message.bcc:
				message.setBcc()
				self._smtp.sendmail(message.fromAddress,
			                      message.bcc,
			                      message.serialise())
			if message.cc:
				message.setCc()
				cc = message.cc.split(',')
				self._smtp.sendmail(message.fromAddress,
			                      cc,
			                      message.serialise())
			self.close()

			if result :
				statusid = False
				failurem = 'Code %s:%s' % (result[0][0], result[0][1])

		except Exception, details:
			statusid = False
			failurem = str(details)

		return (failurem, statusid)

	def send_no_close(self, message, sender = None):
		" send "
		failurem = ''
		statusid = True
		try:

			addr = sender if sender else message.fromAddress
			toAddress = message.toAddress
			result = self._smtp.sendmail(addr,
					                           toAddress,
					                           message.serialise())
			if message.bcc:
				message.setBcc()
				self._smtp.sendmail(message.fromAddress,
				                    message.bcc,
				                    message.serialise())
			if result :
				statusid = False
				failurem = 'Code %s:%s' % (result[0][0], result[0][1])

		except Exception, details:
			statusid = False
			failurem = str(details)

		return (failurem, statusid)

class SMTPServerGMail(SMTPServerBase):
	""" handle and send an email to any server
	"""
	def __init__(self, username=None, password=None, host=None):
		"settings"

		SMTPServerBase.__init__(self,
		                        host="smtp.gmail.com",
		                        port=587,
		                        https=False,
		                        authorise=True,
		                        username=username,
		                        password=password,
		                        limit=2000)

class SMTPServerYahoo(SMTPServerBase):
	""" handle and send an email to any server
	"""
	def __init__(self, username, password, host=None):
		"settings"

		SMTPServerBase.__init__(self,
		                        host="smtp.mail.yahoo.com",
		                        port=465,
		                        https=True,
		                        authorise=True,
		                        username=username,
		                        password=password,
		                        limit=500,
		                        starttls=False)
class SMTPServerHotmail(SMTPServerBase):
	""" handle hot mail
	"""
	def __init__(self, username, password, host=None):
		"settings"

		SMTPServerBase.__init__(self,
		                        host="smtp-mail.outlook.com",
		                        port=587,
		                        https=False,
		                        authorise=True,
		                        username=username,
		                        password=password,
		                        limit=300,
		                        starttls=True)
class SMTPServer1to1(SMTPServerBase):
	""" handle hot mail
	"""
	def __init__(self, username, password, host=None):
		"settings"

		SMTPServerBase.__init__(self,
		                        host="auth.smtp.1and1.co.uk",
		                        port=587,
		                        https=False,
		                        authorise=True,
		                        username=username,
		                        password=password,
		                        limit=300,
		                        starttls=True)

class SMTPExchange(SMTPServerBase):
	""" handle hot mail
	"""
	def __init__(self, username, password, host):
		"settings"

		SMTPServerBase.__init__(self,
		                        host=host,
		                        port=25,
		                        https=True,
		                        authorise=True,
		                        username=username,
		                        password=password,
		                        limit=300,
		                        starttls=True)

class SMTPOpenRelay(SMTPServerBase):
	""" handle hot mail
	"""
	def __init__(self, host=None):
		"settings"

		SMTPServerBase.__init__(self,
		                        host=host,
		                        port=587,
		                        https=False,
		                        authorise=False,
		                        username="",
		                        password="",
		                        limit=300,
		                        starttls=True)

class SMTPBasicOpenRelay(SMTPServerBase):
	""" handle all http emails
	"""
	def __init__(self, host=None):
		"settings"

		SMTPServerBase.__init__(self,
		                        host=host,
		                        port=25,
		                        https=False,
		                        authorise=False,
		                        username="",
		                        password="",
		                        limit=300,
		                        starttls=False)

class SMTP360Relay(SMTPServerBase):
	""" handle 260 release"""
	def __init__(self, username, password):
		"settings"

		SMTPServerBase.__init__(self,
		                        host="smtp.office365.com",
		                        port=587,
		                        https=False,
		                        authorise=True,
		                        username=username,
		                        password=password,
		                        limit=30000,
		                        starttls=True)

SMTPSERVERBYTYPE = {2: SMTPServerGMail,
                    3: SMTPServerYahoo,
                    4: SMTPServerHotmail,
                    5: SMTPServer1to1,
                    6: SMTPExchange,
                    7: SMTPOpenRelay,
                    8: SMTP360Relay}

class STMPUsage(object):
	def __init__(self, limit):
		self._limit = limit
		self._data = set()

	def add(self, email):
		""
		self._data.add(email)

		return False if self._limit > len(self._data) else True

def SendMessage( host, port, message, test = False, sender = None ):
	failurem = ''
	statusid = True
	# try:

	addr = sender if sender else "feedback_all@prmax.co.uk"

	if test:
		smtp = smtplib.SMTP_SSL(host= "smtp.gmail.com", port=465)
		smtp.ehlo()
		#smtp.login("chris.hoy@prmax.co.uk", "RO9JWPqV")
		smtp.login("chris.hoy@prmax.co.uk", "Ignore")
	else:
		if prmaxCtrl.isPrmaxSender( sender ):
			smtp = smtplib.SMTP_SSL(host= "smtp.gmail.com", port=465)
			smtp.ehlo()
			c = prmaxCtrl.getLoginDetails ( sender )
			smtp.login(c[0], c[1])
		else:
			smtp = smtplib.SMTP(host=host, port=port)

	result = smtp.sendmail( addr,
										message.toAddress,
										message.serialise() )
	if message.bcc and not test:
		message.setBcc()
		smtp.sendmail( message.fromAddress,
									 message.bcc,
									 message.serialise() )

	smtp.quit()
	if result :
		statusid = False
		failurem = 'Code %s:%s' % (result[0][0],result[0][1])
	# except Exception, details:
	# 	statusid = False
	# 	failurem = str(details)

	return (failurem, statusid)


def SendSupportEmailMessage( subject, body, fromAddress = "support@prmax.co.uk", toAddress = "feedback@prmax.co.uk" ):
	try:
		if prmaxCtrl.isPrmaxSender( fromAddress ):
			smtp = smtplib.SMTP_SSL(host= "smtp.gmail.com", port=465)
			smtp.ehlo()
			c = prmaxCtrl.getLoginDetails ( fromAddress )
			smtp.login(c[0], c[1])
		else:
			smtp = smtplib.SMTP(host="localhost")

		message = EmailMessage(fromAddress,toAddress,
								           subject, body, "text/html")
		message.BuildMessage()
		result = smtp.sendmail( fromAddress, toAddress, message.serialise()  )
		smtp.quit()
	except Exception, ex:
		log.exception ( ex, dict ( subject = subject, body = body,
		                           fromAddress  = fromAddress ,
		                           toAddress = toAddress ))

CONTENTHEADERS = dict (
  zip = "application/zip",
  acx = "application/internet-property-stream",
  ai = "application/postscript",
  aif = "audio/x-aiff",
  aifc = "audio/x-aiff",
  aiff = "audio/x-aiff",
  asf = "video/x-ms-asf",
  asr = "video/x-ms-asf",
  asx = "video/x-ms-asf",
  au = "audio/basic",
  avi = "video/x-msvideo",
  axs = "application/olescript",
  bas = "text/plain",
  bcpio = "application/x-bcpio",
  bin = "application/octet-stream",
  bmp = "image/bmp",
  c = "text/plain",
  cat = "application/vnd.ms-pkiseccat",
  cdf = "application/x-cdf",
  cer = "application/x-x509-ca-cert",
  clp = "application/x-msclip",
  cmx = "image/x-cmx",
  cod = "image/cis-cod",
  cpio = "application/x-cpio",
  crd = "application/x-mscardfile",
  crl = "application/pkix-crl",
  crt = "application/x-x509-ca-cert",
  csh = "application/x-csh",
  css = "text/css",
  dcr = "application/x-director",
  der = "application/x-x509-ca-cert",
  dir = "application/x-director",
  dll = "application/x-msdownload",
  dms = "application/octet-stream",
  doc = "application/msword",
  docx = "application/msword",
  dot = "application/msword",
  dvi = "application/x-dvi",
  dxr = "application/x-director",
  eps = "application/postscript",
  etx = "text/x-setext",
  evy = "application/envoy",
  exe = "application/octet-stream",
  fif = "application/fractals",
  flr = "x-world/x-vrml",
  gif = "image/gif",
  gtar = "application/x-gtar",
  gz = "application/x-gzip",
  h = "text/plain",
  hdf = "application/x-hdf",
  hlp = "application/winhlp",
  hqx = "application/mac-binhex40",
  hta = "application/hta",
  htc = "text/x-component",
  htm = "text/html",
  html = "text/html",
  htt = "text/webviewhtml",
  ico = "image/x-icon",
  ief = "image/ief",
  iii = "application/x-iphone",
  ins = "application/x-internet-signup",
  isp = "application/x-internet-signup",
  jfif = "image/pipeg",
  jpe = "image/jpeg",
  jpeg = "image/jpeg",
  jpg = "image/jpeg",
  js = "application/x-javascript",
  latex = "application/x-latex",
  lha = "application/octet-stream",
  lsf = "video/x-la-asf",
  lsx = "video/x-la-asf",
  lzh = "application/octet-stream",
  m13 = "application/x-msmediaview",
  m14 = "application/x-msmediaview",
  m3u = "audio/x-mpegurl",
  man = "application/x-troff-man",
  mdb = "application/x-msaccess",
  me = "application/x-troff-me",
  mht = "message/rfc822",
  mhtml = "message/rfc822",
  mid = "audio/mid",
  mny = "application/x-msmoney",
  mov = "video/quicktime",
  movie = "video/x-sgi-movie",
  mp2 = "video/mpeg",
  mp3 = "audio/mpeg",
  mpa = "video/mpeg",
  mpe = "video/mpeg",
  mpeg = "video/mpeg",
  mpg = "video/mpeg",
  mpp = "application/vnd.ms-project",
  mpv2 = "video/mpeg",
  ms = "application/x-troff-ms",
  mvb = "application/x-msmediaview",
  nws = "message/rfc822",
  oda = "application/oda",
  p10 = "application/pkcs10",
  p12 = "application/x-pkcs12",
  p7b = "application/x-pkcs7-certificates",
  p7c = "application/x-pkcs7-mime",
  p7m = "application/x-pkcs7-mime",
  p7r = "application/x-pkcs7-certreqresp",
  p7s = "application/x-pkcs7-signature",
  pbm = "image/x-portable-bitmap",
  pdf = "application/pdf",
  pfx = "application/x-pkcs12",
  pgm = "image/x-portable-graymap",
  pko = "application/ynd.ms-pkipko",
  pma = "application/x-perfmon",
  pmc = "application/x-perfmon",
  pml = "application/x-perfmon",
  pmr = "application/x-perfmon",
  pmw = "application/x-perfmon",
  pnm = "image/x-portable-anymap",
  pot = "application/vnd.ms-powerpoint",
  ppm = "image/x-portable-pixmap",
  pps = "application/vnd.ms-powerpoint",
  ppt = "application/vnd.ms-powerpoint",
  prf = "application/pics-rules",
  ps = "application/postscript",
  pub = "application/x-mspublisher",
  qt = "video/quicktime",
  ra = "audio/x-pn-realaudio",
  ram = "audio/x-pn-realaudio",
  ras = "image/x-cmu-raster",
  rgb = "image/x-rgb",
  rmi = "audio/mid",
  roff = "application/x-troff",
  rtf = "application/rtf",
  rtx = "text/richtext",
  scd = "application/x-msschedule",
  sct = "text/scriptlet",
  setpay = "application/set-payment-initiation",
  setreg = "application/set-registration-initiation",
  sh = "application/x-sh",
  shar = "application/x-shar",
  sit = "application/x-stuffit",
  snd = "audio/basic",
  spc = "application/x-pkcs7-certificates",
  spl = "application/futuresplash",
  src = "application/x-wais-source",
  sst = "application/vnd.ms-pkicertstore",
  stl = "application/vnd.ms-pkistl",
  stm = "text/html",
  svg = "image/svg+xml",
  sv4cpio = "application/x-sv4cpio",
  sv4crc = "application/x-sv4crc",
  swf = "application/x-shockwave-flash",
  t = "application/x-troff",
  tar = "application/x-tar",
  tcl = "application/x-tcl",
  tex = "application/x-tex",
  texi = "application/x-texinfo",
  texinfo = "application/x-texinfo",
  tgz = "application/x-compressed",
  tif = "image/tiff",
  tiff = "image/tiff",
  tr = "application/x-troff",
  trm = "application/x-msterminal",
  tsv = "text/tab-separated-values",
  txt = "text/plain",
  uls = "text/iuls",
  ustar = "application/x-ustar",
  vcf = "text/x-vcard",
  vrml = "x-world/x-vrml",
  wav = "audio/x-wav",
  wcm = "application/vnd.ms-works",
  wdb = "application/vnd.ms-works",
  wks = "application/vnd.ms-works",
  wmf = "application/x-msmetafile",
  wps = "application/vnd.ms-works",
  wri = "application/x-mswrite",
  wrl = "x-world/x-vrml",
  wrz = "x-world/x-vrml",
  xaf = "x-world/x-vrml",
  xbm = "image/x-xbitmap",
  xla = "application/vnd.ms-excel",
  xlc = "application/vnd.ms-excel",
  xlm = "application/vnd.ms-excel",
  xls = "application/vnd.ms-excel",
  xlsx = "application/vnd.ms-excel",
  xlt = "application/vnd.ms-excel",
  xlw = "application/vnd.ms-excel",
  xof = "x-world/x-vrml",
  xpm = "image/x-xpixmap",
  xwd = "image/x-xwindowdump",
  z = "application/x-compress" )

_content_headers = CONTENTHEADERS

def getContentType( filename ):
	""" get the content type for an extension """
	(dummy,ext) = os.path.splitext ( filename )

	return CONTENTHEADERS.get ( ext.lower() )

def ext_to_content_type( ext ):
	""" get the content type for an extension """

	return CONTENTHEADERS.get ( ext.lower(), "")



def getTestMode( ):
	""" Look too see if we should run the emailer in test mode """
	testMode = False

	if platform.system().lower()in ("windows",'microsoft'):
		testMode = True

	return testMode

def ExtractEmailAddress ( emailaddr ):
	""" extract the email address from a name/email address pair"""
	t = emailaddr.split("<")
	if len(t) == 2:
		return t[1].replace(">","")

	return emailaddr

class TTLEmailMessage(object):
	def __init__(self, msgtext = None):
		self._msg = None
		if msgtext != None:
			self.load(msgtext)

	def load(self, msg ) :
		""" Load message """

		self._msg = email.message_from_file( cStringIO.StringIO(msg))

	@property
	def bodytext(self):
		""" return the body text """

		html = ""
		text = ""
		for part in self._msg.walk():
			if part.get_content_charset() is None:
				charset = chardet.detect(str(part))['encoding']
			else:
				charset = part.get_content_charset()
			if part.get_content_type() == 'text/plain':
				text = unicode(part.get_payload(decode=True),str(charset),"ignore").encode('utf8','replace')
				if part.get_content_type() == 'text/html':
					html = unicode(part.get_payload(decode=True),str(charset),"ignore").encode('utf8','replace')
		if html:
			return html.strip()
		else:
			return text.strip().replace("\n","<br/>")

	def getMessageBody(self):
		""" retrive the text part of the message box to analyse """
		body = ""
		for part in self._msg.walk():
			if part.get_content_type() == "text/plain":
				if not body:
					body += "\n\r"
				body += part.get_payload(None, True).decode("utf-8",'replace')
		return body

def send_paperround_message(message, from_email, from_password, test=False):
	failurem = ''
	statusid = True
	try:

		smtp = smtplib.SMTP_SSL(host="smtp.gmail.com", port=465)
		smtp.ehlo()
		smtp.login(from_email, from_password)

		if not test:
			send_lists =  [message.toAddress, ]
			if message.cc:
				if type(message.cc) == types.ListType:
					send_lists.extend(message.cc)
				else:
					send_lists.append(message.cc)
			result = smtp.sendmail(from_email,
			                       send_lists,
			                       message.serialise())
		else:
			result = None
		smtp.quit()
		if result :
			statusid = False
			failurem = 'Code %s:%s' % (result[0][0],result[0][1])
	except Exception, details:
		statusid = False
		failurem = str(details)


	return (failurem, statusid)

def send_smiths_message( message, from_email, test=False):
	failurem = ''
	statusid = True
	try:

		smtp = smtplib.SMTP(host="smtpDCA.smithsnews.co.uk")
		smtp.ehlo()

		if not test:
			send_lists = [message.toAddress, ]
			if message.cc:
				if type(message.cc) == types.ListType:
					send_lists.extend(message.cc)
				else:
					send_lists.append(message.cc)
			result = smtp.sendmail(from_email,
			                       send_lists,
			                       message.serialise())
		smtp.quit()
		if result :
			statusid = False
			failurem = 'Code %s:%s' % (result[0][0], result[0][1])
	except Exception, details:
		statusid = False
		failurem = str(details)

	return (failurem, statusid)



def send_gmail_server(message, from_email, from_password, test=False):

	emailserver = SMTPServerGMail(from_email, from_password)

	(error, statusid) = emailserver.send(message, from_email)
	if not statusid:
		raise Exception("Problem Sending Email")

	print (error, statusid)

