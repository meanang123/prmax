# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        prexporter.py
# Purpose:     Export System
#
# Author:      Chris Hoy
#
# Created:     27/02/2014
# Copyright:  (c) 2014
#
#-----------------------------------------------------------------------------
import os
import sys
from datetime import datetime
from turbogears import database
import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config
from SPF2IP import SPF2IP
import csv

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from turbogears.database import session
from sqlalchemy import text
from prcommon.model import Outlet

domainstested = {}

def check_all():
	results = []
	for row in session.execute(text("""select c.customerid,c.customername,returnaddress,COUNT(*)
FROM userdata.emailtemplates AS et
JOIN internal.customers AS c on et.customerid = c.customerid
WHERE LENGTH(returnaddress)>1 AND
c.customerstatusid = 2 AND c.licence_expire > CURRENT_DATE
GROUP BY c.customerid,c.customername,returnaddress
ORDER BY c.customerid"""), None, Outlet).fetchall():
		result = [str(row[0]), row[2]]
		try:
			domain = row[2].split("@")[1]

			if domain in domainstested:
				continue

			lookup = SPF2IP(domain)
			spf = lookup.IPArray('4')
			message = "MISSING"
			if spf:
				message = "SETUP"
				for ip in spf:
					if ip.find(u'89.16.167.250') != -1:
						message = "PASSED"
						break

			domainstested[domain] = True
			result.append(message)
		except:
			result.append("INVALID DOMAIN")
			print "INVALID DOMAIN", domain
		results.append(result)

	with file("/tmp/spf.csv", "wb") as outfile:
		csv_write = csv.writer(outfile)
		csv_write.writerows(results)

def _run( ):
	""" run the application """
	#
	check_all()


if __name__ == '__main__':
	_run(  )
