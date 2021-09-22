# -*- coding: utf-8 -*-
"""prspfcheck"""
#-----------------------------------------------------------------------------
# Name:        prspfcheck.py
# Purpose:		check emails/domains before send distibutions
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
import spf
import dns.resolver
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
	for row in session.execute(text("""select c.customerid,c.customername,returnaddress,c.contact_title||' '||c.contact_firstname||' '||c.contact_surname as contact,c.email,c.tel
FROM userdata.emailtemplates AS et
JOIN internal.customers AS c on et.customerid = c.customerid
WHERE LENGTH(returnaddress)>1 AND
c.customerstatusid = 2 AND c.licence_expire > CURRENT_DATE
GROUP BY c.customerid,c.customername,returnaddress, c.contact_title ||' '|| c.contact_firstname ||' '|| c.contact_surname, c.email, c.tel
ORDER BY c.customerid"""), None, Outlet).fetchall():
		
		try:
			domain = row[2].split("@")[1]
			email=row[2]
			if domain in domainstested:
				continue

			ans1 = dns.resolver.query(domain, 'MX')
			ans2 = dns.resolver.query(domain, 'A')
			
#			message='PASSED'
#			if not ans1 or not ans2:
#				message='FAILED'
			if ans2:
				for rdata in ans2:
					check = spf.check(i=unicode(rdata), s=email, h=domain)
					if check[0] != 'pass':
						results.append([str(row[0]), row[1].encode('ascii','ignore') if row[1] else '', row[2], row[3].encode('ascii','ignore') if row[3] else '', row[4], str(row[5]), check[0]])
			domainstested[domain] = True
			#result.append(message)
		except:
			results.append([str(row[0]), row[1].encode('ascii','ignore') if row[1] else '', row[2], row[3].encode('ascii','ignore') if row[3] else '', row[4], str(row[5]), 'INVALID DOMAIN'])
			#result.append("INVALID DOMAIN")
		print (domain)
#		results.append(result)

	with file("/tmp/spf2.csv", "wb") as outfile:
		csv_write = csv.writer(outfile)
		csv_write.writerows(results)

def _run( ):
	""" run the application """
	check_all()


if __name__ == '__main__':
	_run(  )
