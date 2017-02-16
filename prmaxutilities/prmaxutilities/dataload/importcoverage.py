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

_towns = {}
_counties = {}
_missing = {}
_db =  DBConnect(Constants.db_Command_Service)
c = _db.getCursor()
for row in _db.executeAll("select geographicallookuptypeid, geographicalid, geographicalname from geographical_lookup_view WHERE geographicallookuptypeid in (1,2,3,5,6)",None):
	if row[0] == 1:
		_towns[row[2].strip().lower()] = [row[1],True,1]
	else:
		_counties[row[2].strip().lower()] = [row[1],True,2]

_db.startTransaction(c)
reader = csv.reader(file(os.path.join(sfolder,"coverage.csv")))
for row in reader:
	if not row or not len(row[0].strip()):
		continue
	try:
		outletid = int(row[0])
	except:
		continue
	doexists = _db.executeOne("SELECT outletid FROM outlets WHERE outletid = %(outletid)s", dict(outletid = outletid) )
	if not doexists:
		continue

	_db.execute("DELETE FROM outletcoverage WHERE outletid = %(outletid)s", dict(outletid = outletid) )
	for x in xrange(1,len(row)):
		garea = row[x].strip()
		garea = garea.replace("Rural Area","").strip()
		garea = garea.replace("Rural area","").strip()
		garea = garea.replace("rural area","").strip()
		garea = garea.replace("Rural","").strip()
		garea = garea.replace("rural","").strip()

		if not garea:
			continue

		geographicalid = None
		ctrl = None
		if _counties.has_key( garea.lower()):
			ctrl = _counties[ garea.lower() ]
			geographicalid = ctrl[0]
		elif _towns.has_key ( garea.lower()):
			ctrl = _towns[ garea.lower() ]
			geographicalid = ctrl[0]
		else:
			if _missing.has_key(garea.lower()):
				continue
			_missing[garea.lower()] = True
			print garea
			continue

		doexists  = _db.executeOne("SELECT outletcoverageid FROM outletcoverage WHERE outletid = %(outletid)s AND geographicalid = %(geographicalid)s", dict(outletid = outletid, geographicalid = geographicalid) )
		if not doexists:
			_db.execute("INSERT INTO outletcoverage( outletid, geographicalid) VALUES(%(outletid)s,%(geographicalid)s)", dict(outletid = outletid, geographicalid = geographicalid) )

	# update control record
	record = _db.executeOne("SELECT objectid FROM internal.research_control_record WHERE objectid = %(objectid)s AND objecttypeid = 1 " , dict ( objectid = outletid ) )
	if record:
		_db.execute("UPDATE internal.research_control_record SET coverage_by_prmax = true,updated_date=now() WHERE objectid = %(objectid)s AND objecttypeid = 1 " , dict ( objectid = outletid ) )
	else:
		_db.execute("INSERT INTO internal.research_control_record(objectid, objecttypeid, coverage_by_prmax) VALUES(%(objectid)s,1,true" , dict ( objectid = outletid ) )

_db.execute("TRUNCATE cache.cachestore",None)
_db.commitTransaction(c)
_db.Close()



