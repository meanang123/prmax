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

_counties = {}
_db =  DBConnect(Constants.db_Command_Service)
c = _db.getCursor()

_db.execute("UPDATE internal.geographical SET geographicalname = REPLACE(geographicalname,'Co ' , 'County') WHERE geographicalname like 'Co %'",None)

for row in _db.executeAll("select geographicallookuptypeid, geographicalid, geographicalname from geographical_lookup_view WHERE geographicallookuptypeid in (2)",None):
	_counties[row[2].strip().lower()] = [row[1],True,2]

# now we need to append all the town/counties that exisit in the geog but arn't used
# later if we use then then we need to add an entry to the lookup mapping
for row in _db.executeAll("select geographicaltypeid, geographicalid, geographicalname from internal.geographical WHERE geographicaltypeid in (2417)",None):
	key = row[2].strip().lower()
	if not _counties.has_key( key ):
		_counties[key] = [row[1],False,2]

_db.startTransaction(c)
reader = csv.reader(file(os.path.join(sfolder,"counties.csv")))
reader.next()
for row in reader:
	if not row or not len(row[0].strip()):
		continue
	countryname = row[2].strip()

	if _counties.has_key( countryname.lower()):
		ctrl = _counties[ countryname.lower() ]
		countryid = ctrl[0]
	else:
		print "Missing Added" , countryname
		_db.execute("INSERT INTO internal.geographical(geographicalname, geographicaltypeid) VALUES(%(countryname)s,2417)" , dict ( countryname = countryname ) )
		countryid = _db.executeOne("SELECT geographicalid FROM internal.geographical WHERE geographicalname = %(geographicalname)s AND geographicaltypeid = 2417" , dict ( geographicalname = countryname ) )[0]
		_db.execute("INSERT INTO internal.geographicallookup(geographicalid,geographicallookuptypeid) VALUES(%(countryid)s,2)", dict(countryid=countryid))
		_db.execute("INSERT INTO internal.geographicaltree(parentgeographicalareaid, childgeographicalareaid) VALUES(315162,%(countryid)s)" , dict ( countryid = countryid ) )
		_counties[countryname.lower()] = [countryid,True,2]
	if ctrl and not ctrl[1]:
		# need to add a lookup record
		_db.execute("INSERT INTO internal.geographicallookup(geographicalid,geographicallookuptypeid) VALUES(%(geographicalid)s,%(typeid)s)", dict(geographicalid=countryid, typeid = ctrl[2]))

		if not _db.executeOne("SELECT parentgeographicalareaid FROM internal.geographicaltree WHERE parentgeographicalareaid = 315162 AND childgeographicalareaid = %(countryid)s" , dict ( countryid = countryid ) ):
			_db.execute("INSERT INTO internal.geographicaltree(parentgeographicalareaid, childgeographicalareaid) VALUES(315162,%(countryid)s)" , dict ( countryid = countryid ) )
		ctrl[1] = True

	townid = int ( row[0] )
	if _db.executeOne("SELECT geographicalid FROM internal.geographical WHERE geographicalid = %(townid)s ", dict ( townid = townid) ):
		if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(townid)s AND geographicalrelationid = %(countryid)s" , dict ( townid = townid,  countryid = countryid) ):
			_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(townid)s,%(countryid)s)" , dict ( townid = townid, countryid = countryid ) )
		if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(countryid)s AND geographicalrelationid = %(townid)s" , dict ( townid = townid,  countryid = countryid) ):
			_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(countryid)s,%(townid)s)" , dict ( townid = townid, countryid = countryid ) )

_db.commitTransaction(c)
_db.Close()



