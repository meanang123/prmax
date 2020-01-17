# -*- coding: utf-8 -*-
"""audit trail sender"""
#-----------------------------------------------------------------------------
# Name:        audit_trail_sender.py
# Purpose:     run query with changes, create csv files, attach the files to email and send email.
#
# Author:      Stamatia Vatsi
#
# Created:     09/09/2019
# Copyright:  (c) 2019
#
#-----------------------------------------------------------------------------

import logging
import os
import sys
import getopt
import csv
from turbogears import database
from turbogears.database import session
import prcommon.Constants as Constants
from sqlalchemy.sql import text
from ttl.tg.config import read_config
import StringIO
from datetime import date, datetime, timedelta
# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlet import Outlet
from prcommon.model  import EmailQueue
from ttl.ttlemail import EmailMessage, SendMessage
LOGGER = logging.getLogger("prcommon.model")


def _run():
	""" run the application """

	import sys
	reload(sys)
	sys.setdefaultencoding('utf8')

	fromdate = (datetime.now() - timedelta(hours = 24)).strftime('%Y-%m-%d %H:%M:%S')
	todate = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
	query = """SELECT * FROM audit_trail('%s', '%s') AS 
	(activitydate text,
	actiontypedescription character varying,
	reasoncodedescription character varying,
	reason character varying,
	display_name character varying,
	outletname character varying,
	job_title character varying,
	contact text,
	objecttypename character varying,
	fieldname character varying,
	fromvalue text,
	tovalue text)""" %(fromdate, todate)

	rows = session.execute(text(query), None, Outlet).fetchall()
	rows.insert(0, ('Date', 'Action', 'Reason', 'User', 'Outlet', 'Job Title', 'Contact', 'Type', 'Field', 'From Value', 'To Value'))
	output = StringIO.StringIO()
	csv_write = csv.writer(output)
	csv_write.writerows(rows)

	EmailQueue.send_email_and_attachments(
	    Constants.SupportEmail,
	    'david.mahoney@prmax.co.uk',
	    "Audit Trail daily changes",
	    "",
	    [(output.getvalue(), 'AuditTrail.csv')],
	    Constants.EmailQueueType_Internal,
	    "text/html",
	    None)

if __name__ == '__main__':
	_run()
