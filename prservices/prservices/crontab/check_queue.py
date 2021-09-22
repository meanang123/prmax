# -*- coding: utf-8 -*-
"""check_queue"""
#-----------------------------------------------------------------------------
# Name:        check_queue.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     04/06/2015
# Copyright:  (c) 2015
#
#-----------------------------------------------------------------------------
import os
from datetime import datetime
from turbogears import database
from sqlalchemy import text
from ttl.ttlemail import EmailMessage, SendMessage
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()
from turbogears.database import session
from prcommon.model import Customer

def _run():
	""" run the application """
	overdue = session.execute(text("""SELECT COUNT(*)
		FROM userdata.listmemberdistribution AS lm
	  JOIN userdata.emailtemplates AS l ON l.listid = lm.listid
	  WHERE emailstatusid=2 and embargo IS NULL AND l.sent_time < CURRENT_TIMESTAMP"""), None, Customer).fetchall()
	if overdue and overdue[0][0] > 3000:
		customers = session.execute(text("""SELECT l.customerid, COUNT(*)
		FROM userdata.listmemberdistribution AS lm
		JOIN userdata.emailtemplates AS l ON l.listid = lm.listid
		WHERE emailstatusid=2 and embargo IS NULL AND l.sent_time < CURRENT_TIMESTAMP GROUP BY l.customerid"""), None, Customer).fetchall()

		email = EmailMessage(Constants.SupportEmail,
		                     Constants.SupportEmail,
		                     "PRMax Email Queue May Needs Forcing",
		                     "<br/>".join(["%8d : %d" % (row[0], row[1]) for row in customers]),
		                     "text/html")
		email.BuildMessage()
		SendMessage(
			Constants.email_host,
			Constants.email_post,
			email,
			True,
			Constants.SupportEmail)

if __name__ == '__main__':
	print ("Starting ", datetime.now())
	_run()
	print ("Existing ", datetime.now())
