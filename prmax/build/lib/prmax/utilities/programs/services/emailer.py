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

import platform
from time import sleep
from datetime import datetime
from random import randint
import dkim
import prmax.Constants as Constants
from ttl.postgres import DBCompress, DBConnect
from ttl.ttlemail import SendMessage, SMTPOpenRelay, SMTP360Relay, SMTPBasicOpenRelay

from ttl.sqlalchemy.ttlcoding import CryptyInfo

TESTMODE = False
if platform.system().lower() == "windows":
	TESTMODE = True

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

PRMAXCLIENTDKIMPUB = """-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBR9MokMLqBZZ7rPCSsEiPVeKN
VLy9I+dgYIYgxZ1PYjx7ARrJfhAG+zW1bAEzC3aYtUymf+oq59X4ljsi6xBx8+Az
kVp8L3uMe7ag15WlYe/5/1JCr1WgCfJ75mU9VEn0Tq6FT/CB22v3UOSytVfmvnbU
8QHwoHjqYvh9JhzxswIDAQAB
-----END PUBLIC KEY-----"""
PRMAXCLIENTDKIM = """-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDBR9MokMLqBZZ7rPCSsEiPVeKNVLy9I+dgYIYgxZ1PYjx7ARrJ
fhAG+zW1bAEzC3aYtUymf+oq59X4ljsi6xBx8+AzkVp8L3uMe7ag15WlYe/5/1JC
r1WgCfJ75mU9VEn0Tq6FT/CB22v3UOSytVfmvnbU8QHwoHjqYvh9JhzxswIDAQAB
AoGBAJdbodawlpMhURkE81hMSGZHAaVf6HXNuhHVRPRBDNHvwiEpWkrUN8Tf0M2E
CORqY7NuttnkbgKvjvae3yyXHEZi/bSYKtBEOv/CG6l9oab5RMz1GnOQ5oPYLg7X
Ki9piucPc2bnKAF50iaszG4cEumSCxgfTq5LeQpsUy6Ql+FRAkEA8XuWB/uB9RHE
JsjYwVdrIvRgQw8Wv+E5WMMFdRAZmOyGCuuG14vpXNAlt5kfc+oRJDSWMGeEnBVh
rt9wQ5cgvQJBAMzmaH5exArFOYbIbr5JdS5VZ8jvZdxPVfLUWD0SbPf/uJNraTQC
58GuQydKlUIfTaRKomII10A4NS+JI4gyGy8CQFzm2+B0TRn4XMtDB8jSFeCbvZDu
9CSbxFE2rhnMONzRWfxHglfYds4DMg+BNE2G5lNUe9dha+4Ud8EsKueF880CQEPc
N1VK+3B5u0CpVwwMdhO/U10X9EtPty5yJzsqxA4qki240CHaqHjbxv/XUrGQfn1f
/oGrXea19t9kcvEjbx8CQQDL1IzKcqyYMSPCnbQUMHf7cz3LdFut/ka8LBesE6bg
aYWtCz+LWZgbWlgr2Sc5wFFHnqVFLhQuvFy6pkcHchcS
-----END RSA PRIVATE KEY-----"""
PRMAXCKIENTSELECTOR = "prmax"


SQL_GET_DOMAINS = "SELECT host FROM internal.hostspf WHERE is_valid_source = true"
SSQL_GET_DOMAINS_KEYS_SELECTORS = "SELECT host, privatekey, selector FROM internal.hostspf WHERE is_valid_source = true and privatekey is not null and privatekey != ''"

COL_SERVERTYPEID = 5
COL_SERVEREMAILHOST = 6
COL_USERNAME = 10
COL_PASSWORD = 11

CRYPTENGINE  = CryptyInfo(Constants.KEY1)

class EmailController(object):
	"""  Email send controller """
	def __init__(self):
		"""__intit__"""
		self._domains = {}
		self._privatekeys = {}
		self._selectors = {}

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

	def _std_email(self, emailrec, fields):
		"""Standard Emails"""
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

		(fields['error'], _) = SendMessage(
		    Constants.email_host,
		    Constants.email_post,
		    emailrec,
		    TESTMODE,
		    sender)
		print ("Result", fields['error'])

	def _open_relay(self, emailrec, host, fields):
		"""Open Replay"""

		try:
			stmp = SMTPOpenRelay(host)

			stmp.send(emailrec)
		except Exception, e:
			print (e)

	def _open_relay_basic(self, emailrec, host, fields):
		"""Open Replay Basic version http only """

		try:
			stmp = SMTPBasicOpenRelay(host)

			stmp.send(emailrec)
		except Exception, e:
			print (e)


	def _365_relay(self, emailrec, username, password):
		"""Open Replay"""

		try:
			stmp = SMTP360Relay(CRYPTENGINE.aes_decrypt(username),
			                    CRYPTENGINE.aes_decrypt(password))

			stmp.send(emailrec)
		except Exception, e:
			print (e)

	def run(self):
		""" run """

		self._domains = {}
		self._privatekeys = {}
		self._selectors = {}

		try:
			db_connect = DBConnect(Constants.db_Command_Service)
			cur = db_connect.getCursor()
			# get the next bacth of email to be sent
			# all email that hav't been sent and who have no embargo time
			# all email that hav't been sent but who embargo time has expired
			cur.execute("""SELECT emq.emailqueueid,emq.emailaddress,emq.subject,emq.message,emq.customerid,em.emailservertypeid,em.email_host,em.email_port,em.email_https,em.email_authorise,em.email_username,em.email_password,em.mailedby
			FROM queues.emailqueue AS emq
			LEFT OUTER JOIN internal.customers AS c ON c.customerid = emq.customerid
			LEFT OUTER JOIN userdata.emailserver AS em ON em.emailserverid = c.emailserverid
			WHERE statusid = 1 AND (embargo is NULL OR embargo < now())
			ORDER BY emailqueueid LIMIT %d """ % randint(50, 150))
			rows = cur.fetchall()
			if len(rows):
				for domain in db_connect.executeAll(SQL_GET_DOMAINS, None, False):
					self._domains[domain[0]] = True
				for dom_keys in db_connect.executeAll(SSQL_GET_DOMAINS_KEYS_SELECTORS, None, False):
					self._privatekeys[dom_keys[0]] = dom_keys[1]
					self._selectors[dom_keys[0]] = dom_keys[2]
				for row in rows:
					fields = dict(statusid=2, error="", emailqueueid=row[0])
					try:
						# get email record
						emailrec = DBCompress.decode(row[3])
						# check send type
						if row[COL_SERVERTYPEID] == 2:
							self._open_relay(emailrec, row[COL_SERVEREMAILHOST], fields)
						elif row[COL_SERVERTYPEID] == 3:
							self._365_relay(emailrec, row[COL_USERNAME], row[COL_PASSWORD])
						elif row[COL_SERVERTYPEID] == 4:
							self._open_relay_basic(emailrec, row[COL_SERVEREMAILHOST], fields)

						else:
							self._std_email(emailrec, fields)

					finally:
						# message sent remove message details from queue it too large too store
						db_connect.startTransaction(cur)
						cur.execute("""UPDATE queues.emailqueue
									SET statusid = %(statusid)s,
									error = %(error)s,
						      message = NULL,
									sent = now()
									WHERE emailqueueid =  %(emailqueueid)s""", fields)

						db_connect.commitTransaction(cur)
				print ("Complete (%d) %s" % (len(rows), datetime.now()))
			db_connect.Close()
		except Exception, ex:
			print (ex)

# need to add a timing loop in here to run every 60 second if not already running
EMAILCTRL = EmailController()
while 1 == 1:
	EMAILCTRL.heartbeat()
	EMAILCTRL.run()
	sleep(randint(1, 30))
