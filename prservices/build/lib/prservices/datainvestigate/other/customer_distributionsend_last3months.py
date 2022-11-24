# -*- coding: utf-8 -*-
"""France data"""
#-----------------------------------------------------------------------------
# Name:        emailsender.py
# Purpose:     
#
# Author:      Stamatia Vatsi
#
# Created:     03/05/2017
# Copyright:  (c) 2017
#
#-----------------------------------------------------------------------------
import os
import getopt
import sys
import csv
from turbogears import database
from sqlalchemy import text
from datetime import date, timedelta
import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config
import prcommon.Constants as Constants

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlet import Outlet, OutletProfile, Employee, Contact, Communication
from prcommon.model.communications import Communication, Address
LOGGER = logging.getLogger("prcommon.model")
from prcommon.model import DataSourceTranslations, PRmaxOutletTypes, PRMaxRoles, Interests
from turbogears.database import session

DOMAINS = ["aol", "gmail", "googlemail", "outlook", "hotmail", "yahoo", "btconnect", "btinternet", "btclick", "btopenworld", "talktalk", "virginmedia"]

def _run():
	""" run the application """

	fromdate =  (date.today() - timedelta(days = 190)).strftime("%Y-%m-%d")

	query1 = """SELECT et.customerid, c.customername, count(*) 
	FROM userdata.emailtemplates AS et
	JOIN internal.customers AS c on c.customerid = et.customerid
	WHERE sent_time > '%s'
	GROUP BY et.customerid, customername
	ORDER BY et.customerid	
	""" %fromdate

	rows1 = session.execute(text(query1), None, Outlet).fetchall()

	with file("/tmp/dist_sent_last_3_months.csv", "wb") as outfile1:
		csv_write1 = csv.writer(outfile1)
		csv_write1.writerows(rows1)


	query2 = """SELECT et.customerid, c.customername, returnaddress
    FROM userdata.emailtemplates AS et
    JOIN internal.customers AS c on c.customerid = et.customerid
    WHERE sent_time > '%s'
    GROUP BY et.customerid, customername, returnaddress
    ORDER BY et.customerid	
    """ %fromdate

	rows2 = session.execute(text(query2), None, Outlet).fetchall()

	results2 = []
	for row in rows2:
		if row[2] != '':
			domain = row[2].split("@")[1].split('.')[0]
			if domain in DOMAINS:
				results2.append([str(row[0]), row[1] if row[1] else '', row[2] if row[2] else ''])

	with file("/tmp/dist_sent_last_3_months_domains.csv", "wb") as outfile2:
		csv_write2 = csv.writer(outfile2)
		csv_write2.writerows(results2)

	query3 = """select c.customerid, c.customername, c.licence_expire, co.description, co.enddate 
	from internal.customers as c
	join internal.clippingsorder as co on co.customerid = c.customerid
	where has_clippings = 't'
	and licence_expire > now()
	and customerstatusid = 2
	and co.enddate > now() 
	"""

	rows3 = session.execute(text(query3), None, Outlet).fetchall()

	with file("/tmp/customer_clippingsorders.csv", "wb") as outfile3:
		csv_write3 = csv.writer(outfile3)
		csv_write3.writerows(rows3)


if __name__ == '__main__':
	_run()
