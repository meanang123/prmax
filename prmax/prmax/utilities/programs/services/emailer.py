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

testMode = False
import platform
if platform.system().lower() == "windows":
	testMode = True

class EmailController(object):
	"""  Email send controller """
	def heartbeat(self):
		"heartbeat"
		pass

	def run(self):
		""" run """
		try:
			db = DBConnect(Constants.db_Command_Service)
			cur = db.getCursor()
			# get the next bacth of email to be sent
			# all email that hav't been sent and who have no embargo time
			# all email that hav't been sent but who embargo time has expired
			cur.execute("""SELECT emailqueueid,emailaddress,subject,message
			FROM queues.emailqueue WHERE statusid = 1 AND ( embargo is NULL OR embargo < now() ) ORDER BY emailqueueid LIMIT %d """ % randint(50,150))
			rows = cur.fetchall()
			if len(rows):
				for row in rows:
					fields = dict( statusid = 2, error = "", emailqueueid = row[0])
					try:
						# get email record
						emailrec = DBCompress.decode(row[3])
						# get sender
						sender = None
						if emailrec.fromAddress.find("@prmax.co.uk") != -1:
							sender = emailrec.fromAddress
						else:
							sender = '<%s@prmax.co.uk>' % (emailrec.fromAddress.replace("@", "="))

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
while (1==1):
	emailCtrl.heartbeat()
	emailCtrl.run()
	sleep( randint(1,30))
