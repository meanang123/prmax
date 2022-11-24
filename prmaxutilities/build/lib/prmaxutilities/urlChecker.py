# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:    15/04/2010
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------

import prmax.Constants as Constants
from urlparse import urlparse

from ttl.postgres import DBConnect
from ttl.ttlemail  import SendSupportEmailMessage

import prmax.Constants as Constants
import DNS
import datetime


def _Url():
	print "Url Checker" , datetime.datetime.now()
	for row in _db.executeAll ( "SELECT outletid,outletname,www FROM outlets AS o JOIN communications AS c ON c.communicationid = o.communicationid WHERE LENGTH(www)>0 AND o.customerid = -1",None ) :
		if row[2]:
			if not row[2].startswith("http://"):
				l = "http://" + row[2]
			else:
				l = row[2]
			loc = urlparse( l )
			try:
				a = DNS.DnsRequest  ()
				b = a.req ( loc.netloc )
				if not b.answers:
					_problems.append ( row )
					print row[1]
			except DNS.Base.DNSError, e :
				_problems.append ( row )
				print row[1]

	print "Completed" , datetime.datetime.now()


def _Email():
	print "Email Checker" , datetime.datetime.now()
	for row in _db.executeAll ( "SELECT outletid,outletname,c.email FROM outlets AS o JOIN communications AS c ON c.communicationid = o.communicationid WHERE LENGTH(c.email)>0 AND o.customerid = -1",None ) :
		if row[2]:
			fields = row[2].split("@")
			try:
				try:
					ml_record = DNS.mxlookup( fields[1] )
				except DNS.Base.DNSError:
					ml_record  = None
				if not ml_record :
					try:
						a = DNS.DnsRequest  ()
						b = a.req (  fields[1] )
						if not b.answers:
							print "MX ", row
						else:
							print "DNS ", row
					except Exception ,e:
						print "DNS ", row
				else:
					print OK
			except Exception, e :
				print "Missing Mx", row

	print "Completed" , datetime.datetime.now()

DNS.DiscoverNameServers()
_problems = []
_db =  DBConnect(Constants.db_Command_Service)
_Url()
#_Email()
SendSupportEmailMessage ("Problem Web Sites", "<br/>".join ([ "%-8d %-50s %s" % row for row in  _problems] ) )
_db.Close()

