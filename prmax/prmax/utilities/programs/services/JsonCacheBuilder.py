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

# change to thread model
from time import sleep
import sets, psycopg2, datetime, sys
import prmax.Constants as Constants
from ttl.postgres import DBConnect,DBCompress
from prmax.utilities.DBIndexer import IndexEntry
from prmax.utilities.DBHelper import DBUtilities
from prcommon.Constants import SearchSession_ListData
from simplejson import JSONEncoder

class CacheController(object):
    def __init__(self):
        pass

    def heartbeat(self):
        pass

    def run(self):
        try:
	    jencode = JSONEncoder()
            db = DBConnect(Constants.db_Command_Service)
            cur = db.getCursor(False, True)
            cur.execute("""SELECT cachequeueid, customerid, objectid, objecttypeid, params  FROM queues.cachequeue ORDER BY cachequeueid""")
            control = cur.fetchone()
            if control:
                # get the index
                print "Started %s"%(datetime.datetime.now())
                # now we need to build and run query

                command = SearchSession_ListData%( DBCompress.decode(control[4]))
		command = command.replace(":limit", "32000")
		command = command.replace(":offset", "0")
		command = command.replace(":userid", "%(objectid)s")
		command = command.replace(":searchtypeid", "%(searchtypeid)s")
		params = dict(objectid = control[2],
			      objecttypeid =  control[3],
			      searchtypeid = Constants.Search_Standard_Type)
                cur.execute("""DELETE FROM  cache.cachestorelist WHERE objectid = %(objectid)s AND  objecttypeid = %(objecttypeid)s""", params)
		cur.execute(command,params)
		results = cur.fetchall()
		cache = dict (
		    numRows  = len(results),
		    identifier = "sessionsearchid")
		params2 = dict ( customerid = control[1],
				 objecttypeid = control[3],
				 objectid = control[2] ,
				 limit = 50)
		results = [ DBConnect.build_dict(db,cur,row) for row in results]

		for x in xrange(0 , len(results),50):
		    cache['items'] = results[x:50]
		    params2['offset'] = x
		    params2['cache'] =DBCompress.encode ( jencode.encode (cache))
		    cur.execute("""INSERT INTO cache.cachestorelist(customerid,objecttypeid,objectid,q_offset,q_limit,cache) VALUES (%(customerid)s,%(objecttypeid)s,%(objectid)s,%(offset)s,%(limit)s, %(cache)s)""", params2)

                cur.execute("""DELETE FROM  queues.cachequeue WHERE cachequeueid = %(cachequeueid)s """, dict(cachequeueid=control[0]))
                db.commitTransaction(cur)
                print "Complete %s"%(datetime.datetime.now())

            db.Close()
        except Exception, ex:
            print ex

    def RunSingle(self):
        self.doIndex()

    def RunLoop(self):
        # this is where we need to add the threads etc
        pass


# need to add a timing loop in here to run every 1 second if not already running
cachectl = CacheController()
while (1==1):
    sleep(Constants.sleepintervals)
    cachectl.heartbeat()
    cachectl.run()