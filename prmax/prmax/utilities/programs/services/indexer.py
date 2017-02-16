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
import datetime
import prmax.Constants as Constants
from ttl.postgres import DBConnect, DBCompress
from prmax.utilities.DBIndexer import IndexEntry
from prmax.utilities.DBHelper import DBUtilities

class IndexController(object):
	""" Indexer process control class"""
	def heartbeat(self):
		"""heartbeat"""
		pass

	def run(self):
		""" run process """
		try:
			db = DBConnect(Constants.db_Command_Service)
			cur = db.getCursor()
			cur.execute("""SELECT customerid,objecttype,data,objectid,action,indexerqueueid,data_string FROM queues.indexerqueue ORDER BY objecttype,customerid,indexerqueueid""")
			rows = cur.fetchall()

			records = {}
			records_delete = []
			for row in rows:
				# at this point we need too over object to country to licence list and appaend to row
				try:
					keyid = 2
					if row[6]:
						keyid = 6
					tmp = str(row[keyid]).decode("utf-8")
				except Exception, ex:
					print ex
					records_delete.append( row[5] )
					continue
				key = "%d-%d-%s" % (row[0], row[1], str(row[keyid]))
				if keyid != 2:
					row[2] = row[keyid]
				if records.has_key(key):
					records[key].append(row)
				else:
					records[key] = [row, ]

			maxrows = len(records)
			if maxrows:
				print "Found (%d) at %s" % (maxrows, datetime.datetime.now())
			for record in records.itervalues():
				# get the index
				db.startTransaction(cur)
				cur.execute("""SELECT  data,setindexid FROM userdata.setindex WHERE customerid=%(customerid)s AND keytypeid=%(keytypeid)s AND keyname = %(keyname)s""", \
			        dict(customerid = record[0][0], keytypeid = record[0][1], keyname = str(record[0][2])))

				drecord = cur.fetchall()
				if len(drecord):
					index = DBCompress.decode(drecord[0][0])
				else:
					index = IndexEntry()
				# do action  on index
				doDelete = False
				for line in record:
					if line[4] == Constants.index_Add:
						index.index.add(line[3])
					elif line[4] == Constants.index_Delete:
						if line[3] == None:
							doDelete = True
							cur.execute("""DELETE  FROM userdata.setindex WHERE keytypeid=%(keytypeid)s AND keyname=%(keyname)s AND customerid = %(customerid)s""",
						        dict(keytypeid = record[0][1],
						           keyname = str(record[0][2]),
						           customerid = record[0][0]))
						else:
							index.index.discard(line[3])
				if doDelete == False:
					if len(drecord):
						cur.execute("""UPDATE  userdata.setindex set data = %(data)s, nbr = %(nbr)s WHERE setindexid = %(setindexid)s""",
					        dict(
					          setindexid = drecord[0][1],
					          nbr = len(index),
					          data =DBCompress.encode(index)))
					else:
						cur.execute("""INSERT INTO  userdata.setindex(customerid,keytypeid,keyname,nbr,data,datatypeid) VALUES(%(customerid)s,%(keytypeid)s,%(keyname)s,%(nbr)s,%(data)s,%(datatypeid)s)""",
					        dict(customerid = record[0][0],
					           keytypeid = record[0][1],
					           keyname = str(record[0][2]),
					           nbr = len(index),
					           data = DBCompress.encode(index),
					           datatypeid=DBUtilities.searchkeytodatatype(record[0][1])))

				# Completed indexing delete group
				cur.execute("""DELETE FROM  queues.indexerqueue WHERE indexerqueueid IN (%s)"""% ",".join([ str(line[5]) for line in record]))
				db.commitTransaction(cur)
				print "Complete %s" % (datetime.datetime.now())


			if records_delete:
				db.startTransaction(cur)
				cur.execute("""DELETE FROM queues.indexerqueue WHERE indexerqueueid IN (%s)"""% ",".join([ str(line) for line in records_delete]))
				db.commitTransaction(cur)
			db.Close()
		except Exception, ex:
			print ex

	def RunSingle(self):
		""" run once"""
		self.doIndex()

# need to add a timing loop in here to run every 1 second if not already running
reportctl = IndexController()
while (1==1):
	sleep(Constants.sleepintervals)
	reportctl.heartbeat()
	reportctl.run()








