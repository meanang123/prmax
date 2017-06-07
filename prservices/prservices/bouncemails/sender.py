# -*- coding: utf-8 -*-
"""bounce emails sender"""
#-----------------------------------------------------------------------------
# Name:        sender.py
# Purpose:     run queries, create csv files, attach the files to email and send email.
#
# Author:      
#
# Created:     12/01/2017
# Copyright:  (c) 2017
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
from ttl.ttlemail import EmailMessage
LOGGER = logging.getLogger("prcommon.model")


def _run():
	""" run the application """

	todate = date.today().strftime("%Y-%m-%d")
	fromdate =  (date.today() - timedelta(days = 30)).strftime("%Y-%m-%d")
	
	query1 = "SELECT * FROM monthly_highest_bounces('%s', '%s')" %(fromdate, todate)
	query2 = "SELECT * FROM monthly_top_50_breakdown('%s', '%s')" %(fromdate, todate)

	rows1 = session.execute(text(query1), None, Outlet).fetchall()
	output1 = StringIO.StringIO()
	csv_write1 = csv.writer ( output1 )
	csv_write1.writerows( rows1 )

	rows2 = session.execute(text(query2), None, Outlet).fetchall()
	output2 = StringIO.StringIO()
	csv_write2 = csv.writer ( output2 )
	csv_write2.writerows( rows2 )

	EmailQueue.send_email_and_attachments(
	    Constants.SupportEmail,
	    'david.mahoney@prmax.co.uk',
	    "Bounce emails",
	    "",
	    [(output1.getvalue(), 'Monthly highest bounces.csv'), (output2.getvalue(), 'Monthly top 50 breakdown.csv')],
	    Constants.EmailQueueType_Internal,
	    "text/html")

if __name__ == '__main__':
	_run()
