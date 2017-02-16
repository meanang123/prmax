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
from ttl.postgres import DBConnect

import csv
import psycopg2
import prmax.Constants as Constants
import platform
import csv
import os.path
import sys
import getopt

command = """update addresses set %s = %%(data)s
WHERE addressid = (select c.addressid
from outlets as o
join communications as c on o.communicationid = c.communicationid
where o.outletid = %%(outletid)s)"""

_fields = {}
_fields[12] = "address1"
_fields[13] = "address2"
_fields[14] = "townname"
_fields[15] = "county"
_fields[16] = "postcode"

_db =  DBConnect(Constants.db_Command_Service)
# Load records
print "Running Fix "
c = _db.getCursor()
_db.startTransaction(c)
for row in _db.executeAll("select o.outletid,fieldid,tovalue from research.activitydetails as rad JOIN research.activity as ra ON ra.activityid = rad.activityid JOIN outlets as o ON o.outletid = ra.parentobjectid where fieldid in (12,13,14,15,16)AND parentobjecttypeid = 1 AND o.prn_key > 0 ORDER BY o.outletid,fieldid",None):
	_db.execute ( command%(_fields[row[1]]), dict(data = row[2], outletid = row[0]))
_db.commitTransaction(c)

_db.Close()
print "Fix Run"


