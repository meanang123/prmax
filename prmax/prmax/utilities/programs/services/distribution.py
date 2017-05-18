# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        distribution
# Purpose:     take a distributed and convert it to email
#
# Author:      Chris Hoy
#
# Created:     15/05/2011
# RCS-ID:       $Id:  $
# Copyright:  (c) 2010

# look at sub-process.py look at better
#-----------------------------------------------------------------------------
from time import sleep
import logging
import prmax.Constants as Constants
import threading, Queue, thread
from ttl.postgres import DBCompress, DBConnect
from ttl.ttlemail import EmailMessage, SendSupportEmailMessage
from prcommon.lib.distribution import MailMerge, get_view_link, add_read_link, get_view_link_to_seo, get_unsubscribe
from ttl.ttlemail import getTestMode, SMTPServer
from ttl.ttldict import NotTooOften
from ttl.ttlenv import getConfigFile
import turbogears
import gc
import sys
from os import getcwd
from os.path import exists, join, split
import getopt
import dkim

PRMAXDKIM = """
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDDDVUc1oeJW2uvqdOlbtO7kNqDWTu/Oo5WfUuj8M87q6YnZK8i
JObt1RQBgLLvF/i5zJWMKDgGzm8m+gHA/D/Na+Ts8pXYkA/hUEyxLJVhpRC9DfU9
teuUEa4xcZTS2RhBSrlDVmkvLBwiDSWqceRuf+GTXWCOnGLm02NnsGUqTwIDAQAB
AoGBAKmH8wxHojJO1YAu+Zf2he2m72XurzF8sa6W5KGvck+I17exmU7yCA17gBH2
TI/no/XJzcmuQ1QXJSEZd2DHXqOmBaRIoSJvvxNiyFqv/gibG0nz9AtG9L/orEiy
c633Vjm2ICoLzWYQazDbzCJRXbkWGssuLSLJ9yMVt0DXP3VhAkEA7gF3RiIOzlAs
LuEK8zxIba1qYS3k26ajMw1Bo+ousitMtwI+ENEEYiMItlvDEBm8ltgRZzh8fJLQ
k/8XPraHCQJBANHMgsJ1aQTpqRh8tjaBI6x9bfw394DTO67fRkKM9+3GtG8Rz+hX
fKN6lv4641t/6wPCpVzZHvRvVupp3dkcZJcCQBEqq+a0GCtLXxR2iOqoY3T9uBmQ
TNyG9Wh+QUjIYFvbgaoFkGJ4IP/PFRbKIZSstoyOwxqV2WzGziKOmKeeVLkCQEfz
Z3ThZ17z87YeLy+KIn3plmrFlvBrgTB8ClCQoAa/+umMpkz8lBZM2LPf5lFfEW58
ttGc9OzHsns6S4dGIYkCQQCCdXx0eB//msce15vqSkTY0DXVxJmmURjljSdT+6Ai
DpgA1tXPHUdkjAkOSme8dODXKAnrU3so6vLNVaNjpRXT
-----END RSA PRIVATE KEY-----
"""
PRMAXSELECTOR = 'dkim'
PRMAXDOMAIN = 'prmax.co.uk'

EMAILSERVICES = (
  "aol.", "gmail.", "googlemail.", "outlook.", "hotmail.", "yahoo.", "btconnect.", "btinternet.", "btclick.", \
  "btopenworld.", "talktalk.", "virginmedia.")

def _is_global_email_service(emailaddress):
	"""check email address for email authentication if it not the customer owserver
	"""
	splitemail = emailaddress.split("@")
	if len(splitemail) == 2:
		for provider in EMAILSERVICES:
			if splitemail[1].startswith(provider) == True:
				return True

	return False

# initialise basic settings
def _initLogger():
	level = logging.INFO
	testmode = getTestMode()
	if testmode:
		level = logging.INFO
	logging.basicConfig(level=level)
	logger = logging.getLogger("dist")

	if testmode:
		hdlr = logging.FileHandler('c:/temp/dist.log')
	else:
		hdlr = logging.FileHandler('/var/log/prmax/dist.log')
	formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
	hdlr.setFormatter(formatter)
	logger.addHandler(hdlr)
	logger.info("Debug Mode")

	return logger

log = _initLogger()

Sleepintervals = 4# seconds

def updatePRmaxSettings():
	""" update the setting that are generic too the prmax/tg system
	These are store in the cfg file """

	curdir = getcwd()
	configfile = getConfigFile()

	if exists(join(curdir, "dev-15.cfg")):
		configfile = join(curdir, "dev-15.cfg")

	if exists(join(curdir, "prmax-prod.cfg")):
		configfile = join(curdir, "prmax-prod.cfg")

	turbogears.update_config(configfile=configfile,
	                         modulename="prmax.config")


# These are the sql statements
_sql_processing = """SELECT lmd.listmemberdistributionid,lmd.listmemberid,lmd.job_title,lmd.familyname,lmd.firstname,lmd.prefix,
lmd.suffix,lmd.emailaddress, et.emailtemplateid, et.emailtemplatecontent,et.returnaddress,et.returnname,et.include_view_as_link,et.subject, et.customerid,
COALESCE((SELECT COUNT(*) FROM userdata.emailtemplatesattachements AS eta WHERE eta.emailtemplateid = et.emailtemplateid),0) AS attcount,seo.seoreleaseid,
COALESCE( es.email_host, 'localhost') AS email_host,
COALESCE( es.email_port, 0) AS email_port,
COALESCE( es.email_https, false) AS email_https,
COALESCE( es.email_authorise, false) AS email_authorise,
COALESCE( es.email_username,'') AS email_username,
COALESCE( es.email_password,'') AS email_password,
et.emailsendtypeid,
COALESCE( es.mailedby,'prmax.co.uk') AS mailedby,
dtf.templatecontent AS footercontent,
dth.templatecontent AS headercontent

FROM userdata.listmemberdistribution AS lmd
JOIN userdata.emailtemplates AS et ON et.listid = lmd.listid
LEFT OUTER JOIN seoreleases.seorelease AS seo ON seo.emailtemplateid = et.emailtemplateid
LEFT OUTER JOIN internal.customers AS c ON c.customerid = et.customerid
LEFT OUTER JOIN userdata.emailserver AS es ON es.emailserverid = c.emailserverid
LEFT OUTER JOIN userdata.distributiontemplates AS dtf ON dtf.distributiontemplateid = et.templatefooterid
LEFT OUTER JOIN userdata.distributiontemplates AS dth ON dtf.distributiontemplateid = et.templateheaderid

WHERE lmd.emailstatusid = 2 AND ( et.embargo IS NULL OR et.embargo < LOCALTIMESTAMP ) AND et.sendpriority = %%(sendpriority)s %s ORDER BY et.embargo"""

_sql_processing_limit = """ LIMIT %(nbr)s """

_sql_set_processing = """ UPDATE userdata.listmemberdistribution SET emailstatusid = %(emailstatusid)s,queued_time = LOCALTIMESTAMP WHERE listmemberdistributionid = %(listmemberdistributionid)s"""

_sql_get_attachments = """ SELECT collateralid,content,filename FROM userdata.emailtemplatesattachements WHERE emailtemplateid = %(emailtemplateid)s"""
_sql_get_collateral = """ SELECT data FROM collateralfiles WHERE collateralid = %(collateralid)s """
_sql_add_queue = """ INSERT INTO queues.emailqueue( emailaddress, subject, emailqueuetypeid, message, customerid,statusid,error)
VALUES( %(emailaddress)s, %(subject)s, %(emailqueuetypeid)s, %(message)s, %(customerid)s, %(statusid)s, %(error)s)"""


_sql_get_failed_send_list = """
UPDATE userdata.listmemberdistribution AS lm
SET emailstatusid = 2, retried = true
WHERE emailstatusid = 3 AND queued_time -  interval '2 hours' < CURRENT_DATE AND retried = false"""

_sql_get_failed_on_start = """UPDATE userdata.listmemberdistribution SET emailstatusid = 2, retried = true WHERE emailstatusid = 3 AND retried = false"""
_sql_get_failed_count = """SELECT COUNT(*) AS queue_count FROM userdata.listmemberdistribution WHERE emailstatusid = 3 AND retried = false"""

_sql_get_clickthrought = """SELECT url,linkname FROM userdata.emailtemplateslinkthrough WHERE emailtemplateid = %(emailtemplateid)s """

_sql_get_domains = "SELECT host FROM internal.hostspf WHERE is_valid_source = true"

class ValidSender(object):
	"check to see if we can send direclty for domain"

	def __init__(self):
		""" get data from database and add to domain dictionary"""

		self.init_list()

	def init_list(self):
		self._domains = {}
		db = DBConnect(Constants.db_Command_Service)
		for domain in db.executeAll(_sql_get_domains, None, False):
			self._domains[domain[0]] = True

		db.Close()

	def is_valid_domain_email(self, email):
		"""check """
		try:
			domain = email.split("@")[1].lower()
			if domain in self._domains:
				return True
		except:
			pass

		return False

class WorkerController(threading.Thread):
	""" thread waits for a distribution record, then process email and log it """
	def __init__(self, queue, lock, domainlist, do_email=True, isTest=False):
		""" setup """
		threading.Thread.__init__(self)
		self._queue = queue
		self._lock = lock
		self._do_email = do_email
		self._istest = isTest
		self._domain = domainlist
		self._typ = "T" if isTest else "D"
		self._un_link = Constants.UNSUB_TEST if isTest else Constants.UNSUB_LIVE


	def run(self):
		""" wait for a distribution record then generates, sends and logs the email"""

		# global items
		merge = MailMerge()
		email = None
		clicklink = turbogears.config.get('prmax.clickthrought')

		while True:
			db = DBConnect(Constants.db_Command_Service)
			dbCache = DBConnect(Constants.db_Collateral_Command_Service)
			sender = None
			try:
				# wait for an item to bebore avaliable
				record = self._queue.get()
				log.info("Processing %d, Thread: %d", record["listmemberdistributionid"], thread.get_ident())

				# set this up as a standard link
				viewlink = get_view_link(record["include_view_as_link"], record["emailtemplateid"])
				# if the customer sent and seo replace link with seo link
				if record["seoreleaseid"]:
					viewlink = get_view_link_to_seo(viewlink, record["seoreleaseid"])

				is_valid_email_domain = self._domain.is_valid_domain_email(record["returnaddress"])

				if is_valid_email_domain:
					send_address = record["returnaddress"]
				else:
					send_address = '"%s" <%s@prmax.co.uk>' % (record["returnname"], record["returnaddress"].replace("@", "="))

				header = footer = ""
				if record["footercontent"]:
					footer = "<br/>" + DBCompress.decode(record['footer'])
				if record["headercontent"]:
					header = DBCompress.decode(record['header']) + "<br/>"

				sourcebody = DBCompress.decode(record['emailtemplatecontent'])
				# at this point we need to do click throught management
				# check for links
				# translate links
				links = db.executeAll(_sql_get_clickthrought, dict(emailtemplateid=record["emailtemplateid"]))
				if links:
					for link in links:
						try:
							sourcebody = sourcebody.replace('"' + link[0].replace("&", "&amp;") + '"',
							                                "%s/%d/click/%s" % (clicklink, record["listmemberdistributionid"], link[1]))
						except:
							pass
				#
				bodytext = header + sourcebody + footer

				# build email record
				email = EmailMessage('"%s" <%s>' % (record["returnname"], record["returnaddress"]),
					             record["emailaddress"],
					             record['subject'],
					             viewlink +
					             get_unsubscribe(add_read_link(merge.do_merge_fields(record, bodytext), record["listmemberid"]), record["listmemberdistributionid"]),
					             "text/html",
					             "",
					             None,
					             False,
					             senderaddress=send_address,
					             sendAddress=send_address,
				               mailedby=record["mailedby"])

				# add List-Unsubscribe:
				# need for autoun-subscribe
				email.set_list_unsubscribe(self._un_link % (record["listmemberdistributionid"], record["listmemberdistributionid"]))
				email.set_x_mailer("PRMax")

				# get and add the attachments
				for row in db.executeAll(_sql_get_attachments, record, True):
					if row["collateralid"]:
						ret = dbCache.executeAll(_sql_get_collateral, row)
						if ret:
							data = DBCompress.decode(ret[0][0])
						else:
							continue
					else:
						try:
							# get document if we can't decompress why not sure but ...
							data = DBCompress.decode(row["content"])
						except:
							# problem with the attachment remove from the email so it can be sent
							continue

					filename = row["filename"]
					tmp = split(row["filename"])
					if len(tmp) == 2:
						filename = tmp[1]

					email.addAttachment(data, filename)
					del data, row

				if record['emailsendtypeid'] == 2:
					email.BuildMessageHtmlOnly()
				else:
					email.BuildMessage()

				if not is_valid_email_domain:
					# sign message
					sig = dkim.sign(
					  email.serialise(),
					  PRMAXSELECTOR,
					  PRMAXDOMAIN,
					  PRMAXDKIM,
					  canonicalize=(dkim.Relaxed, dkim.Relaxed),
					  include_headers=['from', 'to', 'subject'])

					email.set_dkim(sig[len("DKIM-Signature: "):])

				# build the email message
				# dependant on type
				# are we sending email ? if then tag us as sender
				if record["email_host"] == "localhost":
					if is_valid_email_domain:
						sender = "%s.%d@prmax.co.uk" % (self._typ, record["listmemberdistributionid"])
					else:
						sender = "%s.%d-%s@prmax.co.uk" % (self._typ, record["listmemberdistributionid"], record["returnaddress"].replace("@", "="))
				else:
					sender = record["returnaddress"]

				# send email and update database
				cur2 = db.getCursor()
				try:

					# emailer
					if self._do_email:
						emailserver = SMTPServer(
							record["email_host"],
							record["email_port"],
							record["email_https"],
							record["email_authorise"],
							record["email_username"],
							record["email_password"])
						(error, _) = emailserver.send(email, sender)
						#emailserver.send(email, sender)
						#(error, ignore) = SendMessage(
						#  Constants.email_host ,
						#  Constants.email_post,
						#  email,
						#  testMode,
						#  sender)
					else:
						email.serialise()
						error = ""

					self._lock.acquire()
					try:
						db.startTransaction(cur2)
						# set email as created
						cur2.execute(_sql_set_processing, record)
						# add email to send queue but as sent
						cur2.execute(_sql_add_queue, dict(emailaddress=record["emailaddress"],
						                                  subject=record["subject"],
						                                  emailqueuetypeid=Constants.EmailQueueType_Standard,
						                                  message=None,
						                                  statusid=2,
						                                  error=error,
						                                  customerid=record["customerid"]))
						db.commitTransaction(cur2)
					finally:
						self._lock.release()
				except:
					log.exception("Id = %d", record["listmemberdistributionid"])
					db.rollbackTransaction(cur2)
				cur2.close()
				del cur2

			except:
				if record and record.has_key("listmemberdistributionid"):
					log.exception("Id = %d", record["listmemberdistributionid"])

			log.info("Processed %d, Thread: %d", record["listmemberdistributionid"], thread.get_ident())
			try:
				del email
				del record
			except:
				pass
			gc.collect()
			db.Close()
			dbCache.Close()

class DistController(threading.Thread):
	""" Access the database and capture any distributions not sent
	It then process each record and send out the email, and added a done entry too the email log

	"""
	def __init__(self, nbr=5, do_email=True, istest=False, restriction_p=None, customer_restrict=None, sendpriority=0):
		""" Start the distribution systen """
		self._do_email = do_email
		self._istest = istest
		self._lock = threading.Lock()
		self._nbr = int(nbr * 1.5)
		self._restriction = restriction_p
		self._sendpriority = sendpriority
		self._customer_restrict = customer_restrict
		self._spamming_control = NotTooOften()
		threading.Thread.__init__(self)
		self._queue = Queue.Queue()
		self._validsender = ValidSender()
		for _ in xrange(0, nbr - 1):
			t = WorkerController(self._queue, self._lock, self._validsender, self._do_email, self._istest)
			t.setDaemon(True)
			t.start()

	def run(self):
		while True:
			try:
				db = DBConnect(Constants.db_Command_Service)
				cur2 = db.getCursor()

				log.info("Queue Count %d", self._queue.qsize())
				# if items on queue then wait
				while self._queue.qsize() > 0:
					sleep(Sleepintervals)

				attCount = 0
				# added this to fix issue on windows where timestamp is confused
				#test = db.executeAll( "SELECT CURRENT_TIMESTAMP", None, True)
				#log.info("Time %s" % str(test[0]) )
				command = _sql_processing
				if self._restriction:
					command = command  % self._restriction
				elif self._customer_restrict:
					if self._customer_restrict.find(",") != -1:
						restric = " AND et.customerid IN (%s) " % self._customer_restrict
					else:
						restric = " AND et.customerid=%d " % int(self._customer_restrict)
					command = command % restric
				else:
					command = command % ""

				command += _sql_processing_limit

				rows = db.executeAll(command, dict(nbr=self._nbr, sendpriority=self._sendpriority), True)
				log.info("Query Count %d", len(rows))

				# single customer for close of app
				if self._customer_restrict and not rows:
					return

				for row in rows:
					# don't sent too many too a single domain at any one time
					if not self._spamming_control.able_to_send(row["emailaddress"]):
						continue
					self._spamming_control.set_sent(row["emailaddress"])

					# we need to restrict the number of attachment email running at any one
					# moment
					if row["attcount"]:
						attCount = attCount + 1
					if attCount > 4:
						continue

					# if test mode then swap to me
					if self._istest:
						row["email_host"] = "smtp.gmail.com"
						row["email_port"] = 465
						row["email_https"] = True
						row["email_authorise"] = True
						row["email_username"] = "chris.hoy@prmax.co.uk"
						row["email_password"] = "Ignore" # "RO9JWPqV"

					try:
						# it's now on the processing queue
						db.startTransaction(cur2)
						row["emailstatusid"] = Constants.Distribution_Email_Processing
						cur2.execute(_sql_set_processing, row)
						db.commitTransaction(cur2)

						# put on queue
						row["emailstatusid"] = Constants.Distribution_Email_Sent
						self._queue.put(row)
					except:
						log.exception("Distribution Failure")
						SendSupportEmailMessage("Distribution Failure",
						                        "Id %d" % row['listmemberdistributionid'],
						                        "support@prmax.co.uk",
						                        "support@prmax.co.uk")
						db.rollbackTransaction(cur2)
				db.Close()

				sleep(Sleepintervals)
			except:
				log.exception("run")

	def initApp(self):
		""" Check too see if their are any stalled entries in the queue
		If their are then retry but only once """

		db = DBConnect(Constants.db_Command_Service)
		cur2 = db.getCursor()
		row = db.executeAll(_sql_get_failed_count, None, True)
		if row[0]['queue_count'] > 0:
			db.startTransaction(cur2)
			cur2.execute(_sql_get_failed_on_start, None)
			db.commitTransaction(cur2)

		db.closeCursor(cur2)
		db.Close()

def _run(test_environment, run_restriction, single_customer, sendpriority):
	""" run the application """
	# create an instance of the report server and run the threading application

	do_email = True
	if singlecustomer:
		print "Single Customer", singlecustomer
	ctrl = DistController(10, do_email, test_environment, run_restriction, single_customer, sendpriority)
	ctrl.setDaemon(True)
	ctrl.initApp()
	ctrl.start()
	while True:
		try:
			ctrl.join(3)
			if not ctrl.is_alive():
				if singlecustomer:
					print "Endinging Customer", singlecustomer
				return

		except KeyboardInterrupt:
			break

if __name__ == '__main__':
	restriction = None
	singlecustomer = None
	testEnvironment = None
	sendpriority = 0
	updatePRmaxSettings()
	opts, args = getopt.getopt(sys.argv[1:], "", ["live", "test", "cfg=", "customerid=", "ispriority"])
	for option, params in opts:
		if option in ("--live",):
			testEnvironment = False
		if option in ("--test",):
			testEnvironment = True
		if option in ("--customerid",):
			singlecustomer = params
		if option in ("--ispriority"):
			sendpriority = 1
	if testEnvironment == None:
		print "No Environment Specific --live or --test"
		exit(-1)

	# find restruction
	restriction = turbogears.config.get("dist_restriction", None)

	_run(testEnvironment, restriction, singlecustomer, sendpriority)
