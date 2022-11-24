# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		import_delete_outlets
# Purpose:  09/11/09
#
# Author:	Chris Hoy
#
# Created:
# RCS-ID:    $Id:  $
# Copyright: (c) 2009

#-----------------------------------------------------------------------------

from ttl.postgres import DBConnect
import prmax.Constants as Constants
import csv
import platform
import os.path

if platform.system().lower()=="windows":
	sfolder = """D:/Projects/prmaxutilities/prmaxutilities/dataload/data"""
else:
	sfolder = """/usr/lib/python2.5/site-packages/prmaxutilties-1.0.0.1-py2.5.egg/prmaxutilities/dataload/data"""

_db =  DBConnect(Constants.db_Command_Service)
c = _db.getCursor()

_db.startTransaction(c)
reader = csv.reader(file( os.path.join( sfolder,"outlets_to_delete.csv")))
for row in reader:
	outlet = _db.executeOne("SELECT prn_key,outletname FROM outlets WHERE outletid = %(outletid)s" , dict ( outletid = row[0] ) )
	if outlet:
		_db.execute("INSERT INTO research.ignore_prn_outlets(prn_key,outletname) VALUES( %(prn_key)s, %(outletname)s)" , dict ( prn_key = outlet[0], outletname = outlet[1] ) )
		_db.executeOne("SELECT outlet_delete( %(outletid)s)" , dict ( outletid = row[0] ) )

_db.execute("TRUNCATE cache.cachestore",None)
_db.commitTransaction(c)
_db.Close()