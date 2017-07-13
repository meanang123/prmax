# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		emailer.py
# Purpose:	To process the email queue
#
# Author:       Chris Hoy
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from time import sleep
from datetime import datetime
import prmax.Constants as Constants
from ttl.postgres import DBCompress, DBConnect
from ttl.ttlemail import SendMessage
from random import randint
import dkim

testMode = False
import platform
if platform.system().lower() == "windows":
	testMode = True

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

_sql_get_domains = "SELECT host FROM internal.hostspf WHERE is_valid_source = true"
_sql_get_domains_keys_selectors = "SELECT host, privatekey, selector FROM internal.hostspf WHERE is_valid_source = true and privatekey is not null and privatekey != ''"


class EmailController(object):
	"""  Email send controller """
	def heartbeat(self):
		"heartbeat"
		pass

	def is_valid_domain_email(self, email):
		"""check """
		try:
			domain = email.split("@")[1].lower()
			if domain[-1] == '>':
				domain = domain[:-1]
			if domain in self._domains:
				return True
		except:
			pass

		return False

	def has_privatekey(self, email):
		"""check """
		try:
			domain = email.split("@")[1].lower()
			if domain[-1] == '>':
				domain = domain[:-1]			
			if domain in self._privatekeys:
				return True
		except:
			pass
		return False

	def run(self):
		""" run """
		self._domains = {}
		self._privatekeys = {}
		self._selectors = {}		
		try:
			db = DBConnect(Constants.db_Command_Service)
			cur = db.getCursor()
			# get the next bacth of email to be sent
			# all email that hav't been sent and who have no embargo time
			# all email that hav't been sent but who embargo time has expired
			cur.execute("""SELECT emailqueueid,emailaddress,subject,message
			FROM queues.emailqueue WHERE statusid = 1 AND ( embargo is NULL OR embargo < now() ) ORDER BY emailqueueid LIMIT %d """ % randint(50, 150))
			rows = cur.fetchall()
			if len(rows):
				for domain in db.executeAll(_sql_get_domains, None, False):
					self._domains[domain[0]] = True
				for ks in db.executeAll(_sql_get_domains_keys_selectors, None, False):
					self._privatekeys[ks[0]] = ks[1]
					self._selectors[ks[0]] = ks[2]					
				for row in rows:
					fields = dict(statusid=2, error="", emailqueueid=row[0])
					try:
						# get email record
						emailrec = DBCompress.decode(row[3])
						# get sender
						sender = None

						is_valid_email_domain = self.is_valid_domain_email(emailrec.fromAddress)
						has_privatekey = self.has_privatekey(emailrec.fromAddress)
						if is_valid_email_domain:
							sender = emailrec.fromAddress
						else:
							sender = '<%s@prmax.co.uk>' % (emailrec.fromAddress.replace("@", "="))

						if is_valid_email_domain and has_privatekey:
							dom = emailrec.fromAddress.split("@")[1].lower()
							sig = dkim.sign(
						        emailrec.serialise(),
						        self._selectors[dom],
						        dom,
						        self._privatekeys[dom],
						        canonicalize=(dkim.Relaxed, dkim.Relaxed),
						        include_headers=['from', 'to', 'subject'])
					
							emailrec.set_dkim(sig[len("DKIM-Signature: "):])
					
						if not is_valid_email_domain:
							# sign message
							sig = dkim.sign(
						        emailrec.serialise(),
						        PRMAXSELECTOR,
						        PRMAXDOMAIN,
						        PRMAXDKIM,
						        canonicalize=(dkim.Relaxed, dkim.Relaxed),
						        include_headers=['from', 'to', 'subject'])
					
							emailrec.set_dkim(sig[len("DKIM-Signature: "):])

						(fields['error'], ignore) = SendMessage(
							Constants.email_host ,
							Constants.email_post,
							emailrec,
						  testMode,
						  sender)
						print "Result", fields['error']
					finally:
						# message sent remove message details from queue it too large too store
						db.startTransaction(cur)
						cur.execute("""UPDATE queues.emailqueue
									SET statusid = %(statusid)s,
									error = %(error)s,
						      message = NULL,
									sent = now()
									WHERE emailqueueid =  %(emailqueueid)s""", fields)

						db.commitTransaction(cur)
				print "Complete (%d) %s" % (len(rows), datetime.now())
			db.Close()
		except Exception, ex:
			print ex

# need to add a timing loop in here to run every 60 second if not already running
emailCtrl = EmailController()
while 1 == 1:
	emailCtrl.heartbeat()
	emailCtrl.run()
	sleep(randint(1, 30))
