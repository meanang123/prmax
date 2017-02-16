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

_interests = {}
_interests_missing = {}
_subjects = {}

def _Import():
	print "Running Import Mode"
	c = _db.getCursor()
	_db.startTransaction(c)
	_db.execute("TRUNCATE interestsubjects",None)
	_db.execute("TRUNCATE internal.subjects CASCADE",None)

	reader = csv.reader(file(os.path.join(sfolder,"subjects.csv")))
	reader.next()
	# load outlets/interests
	for row in reader:
		# find outletname in field1
		subjectname = row[0].strip()
		subjectname = subjectname.strip('\xc2\xa0')

		if subjectname.lower() in _subjects:
			continue

		_subjects[subjectname.lower()] = True
		subject = _db.executeOne("SELECT subjectid FROM internal.subjects WHERE subjectname = %(subjectname)s", dict(subjectname = subjectname) )
		if not subject:
			_db.execute("INSERT INTO internal.subjects(subjectname) VALUES( %(subjectname)s)", dict(subjectname = subjectname))
			subject = _db.executeOne("SELECT subjectid FROM internal.subjects WHERE subjectname = %(subjectname)s", dict(subjectname = subjectname) )


		for interestname in set([row[x].strip().lower().strip('\xa0') for x in xrange(1, len(row)) ] ):

			# empy column
			if not interestname: continue

			# missing interest
			if  not _interests.has_key(interestname):
				if not _interests_missing.has_key( interestname):
					_interests_missing[interestname] = True
				continue

			# insert new interest
			_db.execute("INSERT INTO interestsubjects(subjectid, interestid) VALUES( %(subjectid)s, %(interestid)s)",
					        dict(subjectid = subject[0],
					             interestid = _interests[interestname]))

	_db.commitTransaction(c)
	print "MISSING Interests"
	for key in _interests_missing:
		print key

if platform.system().lower()=="windows":
	sfolder = """/tmp"""
else:
	sfolder = """/tmp"""

_db =  DBConnect(Constants.db_Command_Service)
# Load interests
for row in _db.executeAll("SELECT interestid, interestname FROM interests" , None):
	_interests[row[1].lower().strip()] = row[0]

opts, args = getopt.getopt(sys.argv[1:],"" , ["import","test"])
for o, a in opts:
	if o in ("--import",):
		_Import()
		break
	if o in ("--test",):
		break
else:
	print " --import or --test"

_db.Close()


