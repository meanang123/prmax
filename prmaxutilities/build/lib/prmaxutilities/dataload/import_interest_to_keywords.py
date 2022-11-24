# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import prmax.Constants as Constants
from ttl.postgres import DBConnect

import csv
import prmax.Constants as Constants
import platform
import csv
import os.path


if platform.system().lower()=="windows":
	sfolder = """D:/Projects/prmaxutilities/prmaxutilities/dataload/data"""
else:
	sfolder = """/usr/lib/python2.5/site-packages/prmaxutilities-1.0.0.1-py2.5.egg/prmaxutilities/dataload/data"""

_db =  DBConnect(Constants.db_Command_Service)
c = _db.getCursor()

# fix up interests
_db.startTransaction(c)
reader = csv.reader(file(os.path.join(sfolder,"re_layout_interests.csv")))
for row in reader:
	interestid = int(row[0])
	interestname = row[2].strip()
	print interestid, interestname
	allexists = _db.executeOne("SELECT interestid FROM interests WHERE interestname = %(interestname)s" , dict ( interestname =interestname ))
	if not allexists:
		_db.execute("UPDATE  interests SET interestname = %(interestname)s, isroot=1 WHERE interestid = %(interestid)s" , dict ( interestname = interestname,interestid = interestid ) )
	else:
		_db.execute("UPDATE  interests SET isroot=1 WHERE interestid = %(interestid)s" , dict ( interestid = interestid ) )

	for x in xrange(3, len(row)):
		interestname0 = row[x].strip()
		extraid = _db.executeOne("SELECT interestid FROM interests WHERE interestname = %(interestname)s" , dict ( interestname =interestname0 ) )
		if not extraid:
			_db.execute("INSERT INTO interests(interestname,isroot) VALUES( %(interestname)s,1)" , dict ( interestname = interestname0 ) )
			extraid = _db.executeOne("SELECT interestid FROM interests WHERE interestname = %(interestname)s" , dict ( interestname =interestname0 ) )
		else:
			_db.execute("UPDATE  interests SET isroot=1 WHERE interestid = %(interestid)s" , dict ( interestid = extraid[0] ) )

		# now insert into outlet keywords
		_db.execute("""INSERT INTO outletinterests(outletid,interestid,customerid)
		SELECT ou.outletid,%(extraid)s,ou.customerid FROM outletinterests AS ou WHERE ou.customerid = -1 AND ou.interestid = %(interestid)s AND NOT EXISTS (SELECT outletid FROM outletinterests AS oi2  WHERE ou.outletid = oi2.outletid  AND  interestid  = %(extraid)s)
		""" , dict ( interestid = interestid,extraid = extraid[0] ) )

		# now insert into employee keywords
		_db.execute("""INSERT INTO employeeinterests(employeeid,interestid,customerid)
		SELECT ou.employeeid,%(extraid)s,ou.customerid FROM employeeinterests AS ou WHERE ou.customerid = -1 AND ou.interestid = %(interestid)s AND NOT EXISTS (SELECT employeeid FROM employeeinterests AS ei WHERE ou.employeeid = ei.employeeid  AND  interestid  = %(extraid)s)
		""" , dict ( interestid = interestid,extraid = extraid[0] ) )
		if allexists:
			_db.execute("""INSERT INTO interestsubjects(interestid,subjectid) SELECT %(extraid)s,subjectid FROM interestsubjects WHERE interestid = %(interestid)s
			AND NOT EXISTS ( SELECT subjectid FROM interestsubjects AS is2 WHERE interestsubjects.subjectid = is2.subjectid AND interestid = %(extraid)s)""", dict ( interestid = interestid,extraid = extraid[0] ) )

	if allexists:
		if interestid != allexists[0] :
			# move outlets across
			_db.execute("""UPDATE outletinterests SET interestid = %(extraid)s WHERE interestid = %(interestid)s AND NOT EXISTS ( SELECT outletid FROM outletinterests AS oc2 WHERE oc2 .outletid = outletinterests.outletid AND interestid = %(extraid)s)""", dict ( interestid = interestid,extraid = allexists[0] ) )
			_db.execute("""UPDATE employeeinterests SET interestid = %(extraid)s WHERE interestid = %(interestid)s AND NOT EXISTS ( SELECT employeeid FROM employeeinterests AS oc2 WHERE oc2 .employeeid = employeeinterests.employeeid AND interestid = %(extraid)s)""", dict ( interestid = interestid,extraid = allexists[0] ) )
			## delete interest
			_db.execute("""DELETE FROM outletinterests WHERE interestid = %(interestid)s""", dict ( interestid = interestid) )
			_db.execute("""DELETE FROM employeeinterests WHERE interestid = %(interestid)s""", dict ( interestid = interestid) )

			#
			_db.execute("DELETE FROM interestsubjects WHERE interestid = %(interestid)s" , dict ( interestid = interestid ))
			_db.execute("DELETE FROM interests WHERE interestid = %(interestid)s" , dict ( interestid = interestid ))

		# mapping problem with ....
	# rename primary
	# for length add if required make copy of keywords

	# delete interestwords
	#

_db.commitTransaction(c)

_db.execute("TRUNCATE cache.cachestore",None)
_db.commitTransaction(c)
_db.Close()



