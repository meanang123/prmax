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

sPath = """/tmp/lostdata.csv"""
_db =  DBConnect(Constants.db_Command_Service)
# Load records
print "Running Import "
c = _db.getCursor()
_db.startTransaction(c)
# load outlets/interests
for row in csv.reader(file(sPath)):
	outletid = int(row[1])
	listid = int(row[0])
	exists = _db.executeOne("SELECT employeeid FROM employees WHERE outletid =  %(outletid)s and job_title = %(job_title)s", dict(outletid = outletid, job_title = row[2].strip()))
	if not exists:
		print "Missing Job title", row[2]
		continue

	# remove existing interests
	try:
		_db.execute("""INSERT INTO userdata.listmembers(
		listid, outletid, employeeid , appended )
		VALUES(%(listid)s, %(outletid)s, %(employeeid)s , %(appended)s) """,
		dict ( listid = listid , outletid = outletid , employeeid = exists[0] , appended = False ))
	except psycopg2.IntegrityError, e :
		print row
		print e

	_db.commitTransaction(c)

_db.Close()


