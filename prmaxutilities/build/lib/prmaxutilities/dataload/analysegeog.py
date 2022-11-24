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

_regions = {}
_db =  DBConnect(Constants.db_Command_Service)
c = _db.getCursor()

for row in _db.executeAll("select geographicallookuptypeid, geographicalid, geographicalname from geographical_lookup_view WHERE geographicallookuptypeid in (3)",None):
	_regions[row[2].strip().lower()] = [row[1],True,3]

# now we need to append all the regions that exisit in the geog but arn't used
# later if we use then then we need to add an entry to the lookup mapping
for row in _db.executeAll("select geographicaltypeid, geographicalid, geographicalname from internal.geographical WHERE geographicaltypeid in (2421)",None):
	key = row[2].strip().lower()
	if not _regions.has_key( key ):
		_regions[key] = [row[1],False,3]

_db.startTransaction(c)
reader = csv.reader(file(os.path.join(sfolder,"geog_full.csv")))
reader.next()
for row in reader:
	if not row or not len(row[0].strip()):
		continue
	regionname = row[0].strip()

	if _regions.has_key( regionname.lower()):
		ctrl = _regions[ regionname.lower() ]
		regionid = ctrl[0]
	else:
		print "Missing Added" , regionname
		_db.execute("INSERT INTO internal.geographical(geographicalname, geographicaltypeid) VALUES(%(regionname)s,2421)" , dict ( regionname = regionname ) )
		regionid = _db.executeOne("SELECT geographicalid FROM internal.geographical WHERE geographicalname = %(geographicalname)s AND geographicaltypeid = 2421" , dict ( geographicalname = regionname ) )[0]
		_db.execute("INSERT INTO internal.geographicallookup(geographicalid,geographicallookuptypeid) VALUES(%(regionid)s,3)", dict(regionid=regionid))
		_regions[regionname.lower()] = [regionid,True,3]
		ctrl = _regions[regionname.lower()]
	if ctrl:
		# need to add a lookup record
		#_db.execute("INSERT INTO internal.geographicallookup(geographicalid,geographicallookuptypeid) VALUES(%(geographicalid)s,%(typeid)s)", dict(geographicalid=countryid, typeid = ctrl[2]))

		if row[1].strip():
			countyid = int(row[1])
			if not _db.executeOne("SELECT parentgeographicalareaid FROM internal.geographicaltree WHERE parentgeographicalareaid = %(regionid)s AND childgeographicalareaid = %(countyid)s" , dict ( regionid = regionid,  countyid = countyid)):
				_db.execute("INSERT INTO internal.geographicaltree(parentgeographicalareaid, childgeographicalareaid) VALUES(%(regionid)s,%(countyid)s)" , dict ( regionid = regionid,  countyid = countyid))
		ctrl[1] = True

		# add cascade
	if row[1]:
		countyid = int(row[1])
		if _db.executeOne("SELECT geographicalid FROM internal.geographical WHERE geographicalid = %(countyid)s ", dict ( countyid = countyid) ):
			if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(regionid)s AND geographicalrelationid = %(countyid)s" , dict ( regionid = regionid,  countyid = countyid) ):
				_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(regionid)s,%(countyid)s)" , dict ( regionid = regionid, countyid = countyid ) )
			if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(countyid)s AND geographicalrelationid = %(regionid)s" , dict ( regionid = regionid,  countyid = countyid) ):
				_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(countyid)s,%(regionid)s)" , dict ( regionid = regionid, countyid = countyid ) )

	if len(row)>7 and row[7]:
		_db.execute("UPDATE internal.geographical SET geographicalname = %(geographicalname)s WHERE  geographicalid = %(geographicalid)s" , dict ( geographicalname = row[7].strip(), geographicalid = int(row[1])))

	if len(row)>6 and row[6] and ctrl:
		# this is a new county
		# attemt to find a county in the list we use with out the UA
		countryname = row[6].replace("UA","").strip()
		exists = _db.executeOne("SELECT geographicalid FROM internal.geographical WHERE geographicalname= %(countryname)s AND geographicaltypeid = 2417", dict ( countryname = countryname) )
		if exists:
			# need to rename
			_db.execute("UPDATE  internal.geographical SET geographicalname= %(countryname)s WHERE geographicalid = %(geographicalid)s", dict ( countryname = row[6].strip(), geographicalid = exists[0]) )
		else:
			_db.execute("INSERT INTO  internal.geographical(geographicalname,geographicaltypeid) VALUES(%(countryname)s,2417)", dict ( countryname = row[6].strip()) )

		countyid = _db.executeOne("SELECT geographicalid FROM internal.geographical WHERE geographicalname = %(geographicalname)s  AND geographicaltypeid  = 2417", dict ( geographicalname = row[6].strip()))[0]
		if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookup WHERE geographicalid = %(geographicalid)s AND geographicallookuptypeid = 2" , dict ( geographicalid = countyid) ):
			_db.execute("INSERT INTO internal.geographicallookup(geographicalid,geographicallookuptypeid) VALUES(%(geographicalid)s,%(typeid)s)", dict(geographicalid=countyid, typeid = 2))

		if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(countyid)s AND geographicalrelationid = %(regionid)s" , dict ( regionid = ctrl[0],  countyid = countyid) ):
			_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(countyid)s,%(regionid)s)" , dict ( regionid = ctrl[0], countyid = countyid ) )
		if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(regionid)s AND geographicalrelationid = %(countyid)s" , dict ( regionid = ctrl[0],  countyid = countyid) ):
			_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(regionid)s,%(countyid)s)" , dict ( regionid = ctrl[0], countyid = countyid ) )
			if row[3].strip():
				townid = int(row[3])
				if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(countyid)s AND geographicalrelationid = %(townid)s" , dict ( townid = townid,  countyid = countyid) ):
					_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(countyid)s,%(townid)s)" , dict ( townid = townid, countyid = countyid ) )


		# now find the region
		if not _db.executeOne("SELECT parentgeographicalareaid FROM internal.geographicaltree WHERE parentgeographicalareaid = %(regionid)s AND childgeographicalareaid = %(countyid)s" , dict (regionid = ctrl[0],  countyid = countyid) ):
			_db.execute("INSERT INTO internal.geographicaltree(parentgeographicalareaid, childgeographicalareaid) VALUES(%(regionid)s,%(countyid)s)" , dict ( regionid = ctrl[0],  countyid = countyid ) )
		# now link town to county
		if row[3].strip():
			townid = int(row[3])
			if not _db.executeOne("SELECT parentgeographicalareaid FROM internal.geographicaltree WHERE parentgeographicalareaid = %(countyid)s AND childgeographicalareaid = %(townid)s" , dict (townid = townid,  countyid = countyid) ):
				_db.execute("INSERT INTO internal.geographicaltree(parentgeographicalareaid, childgeographicalareaid) VALUES(%(countyid)s,%(townid)s)" , dict ( townid = townid,  countyid = countyid ) )

			if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(townid)s AND geographicalrelationid = %(countyid)s" , dict ( townid = townid,  countyid = countyid) ):
				_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(townid)s,%(countyid)s)" , dict ( townid = townid, countyid = countyid ) )
			if not _db.executeOne("SELECT geographicalid FROM internal.geographicallookupcascade WHERE geographicalid = %(countyid)s AND geographicalrelationid = %(townid)s" , dict ( townid = townid,  countyid = countyid) ):
				_db.execute("INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) VALUES(%(countyid)s,%(townid)s)" , dict ( townid = townid, countyid = countyid ) )

	#move parent
	if len(row)>9 and row[9] and ctrl:
		# move in tree
		_db.execute("UPDATE internal.geographicaltree set parentgeographicalareaid = %(newparentid)s WHERE parentgeographicalareaid = %(oldparentid)s AND childgeographicalareaid  = %(childid)s" ,
		            dict ( newparentid = int(row[9]) , oldparentid = int(row[1]) , childid = int(row[3])))
		# move in cascade?
		# move coverage
		_db.execute("UPDATE outletcoverage set geographicalid = %(newparentid)s WHERE geographicalid = %(oldparentid)s" ,
		            dict ( newparentid = int(row[9]) , oldparentid = int(row[1]) , childid = int(row[3])))

		# delete from lookup
		_db.execute("DELETE FROM  internal.geographicallookup WHERE geographicalid = %(oldparentid)s" ,
		            dict ( oldparentid = int(row[1]) , childid = int(row[3])))


_db.commitTransaction(c)
_db.Close()



