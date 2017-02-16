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
import prmax.Constants as Constants
import platform
import csv
import os.path
import sys
import getopt

def _ImportInterests():
	print "Running Import Mode"
	c = _db.getCursor()
	_db.startTransaction(c)
	# load outlets/interests
	for row in csv.reader(file(os.path.join(sfolder,"outlets_interests.csv"))):
		# find outletname in field1
		outletid = int(row[0])
		exists = _db.executeOne("SELECT outletid FROM outlets WHERE outletid =  %(outletid)s and customerid = -1", dict(outletid = outletid) )
		if not exists:
			print "Missing Outlets", row[0].strip()
			continue

		# remove existing interests
		_db.execute("DELETE FROM outletinterests WHERE outletid = %(outletid)s", dict(outletid = outletid) )

		for x in xrange(4, len(row)):
			interestname = row[x].strip().lower()

			# empy column
			if not interestname: continue

			# missing interest
			if  not _interests.has_key(interestname):
				if not _interests_missing.has_key( interestname):
					print "missing", interestname
					_interests_missing[interestname] = True
				continue

			# insert new interest
			outletinterestid = _db.executeOne("SELECT outletinterestid FROM outletinterests WHERE outletid =  %(outletid)s and customerid = -1 AND interestid = %(interestid)s", dict(outletid = outletid, interestid = _interests[interestname]) )
			if outletinterestid == None:
				_db.execute("INSERT INTO outletinterests(outletid, interestid,isprimary,interestleveltypeid) VALUES( %(outletid)s, %(interestid)s, %(isprimary)s,%(interestleveltypeid)s)",
					        dict(outletid = outletid,
					             interestid = _interests[interestname],
					             isprimary = True if x<=10 else False,
					             interestleveltypeid = _interestleveltypes.get(x,None)
					             ))

		# update control record
		record = _db.executeOne("SELECT objectid FROM internal.research_control_record WHERE objectid = %(objectid)s AND objecttypeid = 1 " , dict ( objectid = outletid ) )
		if record:
			_db.execute("UPDATE internal.research_control_record SET interests_by_prmax = true,updated_date=now(),reviewed_interests=true WHERE objectid = %(objectid)s AND objecttypeid = 1 " , dict ( objectid = outletid ) )
		else:
			_db.execute("INSERT INTO internal.research_control_record(objectid, objecttypeid, interests_by_prmax,reviewed_interests) VALUES(%(objectid)s,1,true,true" , dict ( objectid = outletid ) )

	_db.execute("TRUNCATE cache.cachestore",None)
	_db.commitTransaction(c)

def _TestInterests():
	print "Running Test Mode"
	c = _db.getCursor()
	# load outlets/interests
	for row in csv.reader(file(os.path.join(sfolder,"outlets_interests.csv"))):
		# find outletname in field1
		for x in xrange(4, len(row)):
			interestname = row[x].strip().lower()
			# empy column
			if not interestname: continue
			# missing interest
			if  not _interests.has_key(interestname):
				if not _interests_missing.has_key( interestname):
					print "missing", interestname
					_interests_missing[interestname] = True
				continue



if platform.system().lower()=="windows":
	sfolder = """/tmp"""
else:
	sfolder = """/tmp"""

_interestleveltypes = {9:1,10:2}
_interests = {}
_interests_missing= {}
_db =  DBConnect(Constants.db_Command_Service)
# Load interests
for row in _db.executeAll("SELECT interestid, interestname FROM interests" , None):
	_interests[row[1].lower().strip()] = row[0]

opts, args = getopt.getopt(sys.argv[1:],"" , ["import","test"])
for o, a in opts:
	if o in ("--import",):
		_ImportInterests()
		break
	if o in ("--test",):
		_TestInterests()
		break
else:
	print " --import or --test"

_db.Close()


