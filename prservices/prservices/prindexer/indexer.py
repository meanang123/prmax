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
import gc
import prmax.Constants as Constants
from ttl.postgres import DBConnect, DBCompress
from prmax.utilities.DBIndexer import IndexEntry
from prmax.utilities.DBHelper import DBUtilities
import getopt
import sys

WHERECLAUSE = ""

import logging
#LOGGER = logging.getLogger("prcommon.model")

IS_OUTLET = (Constants.outlet_name,
             Constants.outlet_statusid ,
             Constants.outlet_frequencyid ,
             Constants.outlet_circulationid,
             Constants.outlet_searchtypeid,
             Constants.outlet_interest,
             Constants.outlet_outlettypeid,
             Constants.outlet_countryid,
             Constants.freelance_outletid_interestid,
             Constants.freelance_countryid,
             Constants.mp_outletid_interestid,
             Constants.mp_countryid,
             Constants.outlet_coverage,
             Constants.outlet_tel,
             Constants.outlet_email,
             Constants.outlet_profile,
             Constants.outlet_job_role,
             Constants.freelance_tel,
             Constants.freelance_email,
             Constants.freelance_profile,
             Constants.freelance_countryid,
             Constants.employee_outletid_interestid,
             Constants.employee_contact_outletid,
             Constants.mp_employee_outletid,
             Constants.freelance_employee_outletid,
              Constants.employee_outletid_countryid,
             )

IS_EMPLOYEE = (
             Constants.employee_contact_employeeid,
             Constants.employee_employeeid_interestid,
             Constants.employee_contactfull_employeeid,
             Constants.freelance_employeeid_interestid,
             Constants.freelance_employeeid,
             Constants.freelance_employeeid_countryid,
             Constants.mp_employeeid_interestid,
             Constants.mp_employeeid,
             Constants.mp_countryid,
             Constants.employee_tel,
             Constants.employee_email,
             Constants.employee_job_role,
             Constants.employee_prmaxoutlettypeid,
             Constants.employee_countryid,
             Constants.employee_contact_ext_employeeid,
             Constants.freelance_contact_ext_employeeid,
             Constants.employee_contactfull_ext_employeeid

)

IS_ADVANCE = (# advance features
             Constants.advance_search_name,
             Constants.advance_interest,
             Constants.advance_pub_date,
             Constants.advance_outletname,
             Constants.advance_outlettypeid,
             Constants.advance_search_name_outletid
)

class IndexController(object):
	""" Indexer process control class"""
	def __init__(self):
		"""Init System"""

		self._prmaxdatasets = {}
		self._rest_of_world = [3, ]
		self._all_prmaxdatasets = []

	def heartbeat(self):
		"""heartbeat"""
		pass

	def _setup_data_sets(self,  db):
		"""Setup Data sets"""
		cur = db.getCursor()
		cur.execute("""SELECT prmaxdatasetid,countryid FROM internal.prmaxdatasetcountries""")
		for row in cur.fetchall():
			if row[1] in self._prmaxdatasets:
				self._prmaxdatasets[row[1]].append(row[0])
			else:
				self._prmaxdatasets[row[1]] = [row[0]]

		# full set for delete
		cur.execute("""SELECT prmaxdatasetid FROM internal.prmaxdatasets""")
		self._all_prmaxdatasets = [ row[0] for row in cur.fetchall()]

		# set the default up
		self._rest_of_world = [3, ]

		db.closeCursor(cur)


	def run(self, no_output=False):
		""" run process """
		try:
			db = DBConnect(Constants.db_Command_Service)
			self._setup_data_sets(db)
			cur = db.getCursor()
			cur.execute("""SELECT customerid,objecttype,data,objectid,action,indexerqueueid,data_string FROM queues.indexerqueue %s ORDER BY objecttype,customerid,data,indexerqueueid LIMIT 2000""" % WHERECLAUSE)
			rows = cur.fetchall()

			records = {}
			records_delete = []
			for row in rows:
				# at this point we need too over object to country to licence list and appaend to row
				if row[3] ==  None:
					records_delete.append(row[5])
					continue

				country = None

				if row[1] in IS_OUTLET:
					# this is an outlet
					cur.execute("""SELECT countryid,nationid FROM outlets WHERE outletid = %d""" % row[3])
					country = cur.fetchone()
				elif  row[1] in IS_EMPLOYEE:
					#this is employee
					cur.execute("""SELECT o.countryid,o.nationid FROM outlets AS o JOIN employees AS e ON e.outletid = o.outletid WHERE e.employeeid = %d""" % row[3])
					country = cur.fetchone()
				elif  row[1] in IS_ADVANCE:
					# uk only
					country = [1, None]
				else:
					print ("Missing Type", row[1])

				# this ensure that a delete is applied over all the data sets for consistency
				if row[4] == Constants.index_Delete:
					prmaxdatasets = self._all_prmaxdatasets
				else:
					if country:
						countryid = country[1] if country[1] else country[0]
						# now get a list of data sets for country
						# this should be ignored for a private record as we only need the one entry
						if row[0] == -1:
							prmaxdatasets = self._prmaxdatasets.get(countryid, self._rest_of_world)
						else:
							prmaxdatasets = [-1]
					else:
						# if action is delete and the outlet has been delete then need too us all the data sets to ensure delete
						if row[4] == Constants.index_Delete:
							prmaxdatasets = self._all_prmaxdatasets
						else:
							print ("Problem Row", row)
							# check
							records_delete.append( row[5] )
							continue

				# fix up date
				try:
					keyid = 2
					if row[6]:
						keyid = 6
					tmp = str(row[keyid]).decode("utf-8", "replace")[:44]
					row[2] = tmp
				except Exception, ex:
					print ("Problem", ex)
					records_delete.append( row[5] )
					continue

				# created all keys to indexs
				for prmaxdatasetid in prmaxdatasets:
					key = u"%d-%d-%d-%s" % (prmaxdatasetid, row[0], row[1], row[2])
					tmp = list ( row )
					tmp.append(prmaxdatasetid)
					if key in records:
						records[key].append(tmp)
					else:
						records[key] = [ tmp, ]

				# add for a private record yes in reallity this could replace above but safe than sorry

				if row[4] == Constants.index_Delete and  row[0] != -1:
					key = u"None-%d-%d-%s" % (row[0], row[1], row[2])
					tmp = list ( row )
					tmp.append(-1)
					records[key] = [ tmp, ]

			maxrows = len(records)
			if maxrows and not no_output:
				print ("Found (%d) at %s" % (maxrows, datetime.datetime.now()))

			for record in records.itervalues():
				# get the index
				db.startTransaction(cur)
				if record[0][7] == -1:
					cur.execute("""SELECT  data,setindexid FROM userdata.setindex WHERE customerid=%d AND keytypeid=%d AND keyname = %%(keyname)s AND prmaxdatasetid IS NULL""" % (record[0][0], record[0][1]),
					            dict(keyname = record[0][2] ))
				else:
					cur.execute("""SELECT  data,setindexid FROM userdata.setindex WHERE customerid=%d AND keytypeid=%d AND keyname = %%(keyname)s AND prmaxdatasetid = %d""" % (record[0][0], record[0][1], record[0][7]),
					            dict(keyname = record[0][2] ))

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
							if record[0][7] == -1:
								# private record only single emtry
								cur.execute("""DELETE FROM userdata.setindex WHERE keytypeid=%(keytypeid)s AND keyname=%(keyname)s AND customerid = %(customerid)s AND prmaxdatasetid IS NULL """,
								            dict(keytypeid = record[0][1],
								                 keyname = str(record[0][2]),
								                 customerid = record[0][0]))
							else:
								cur.execute("""DELETE FROM userdata.setindex WHERE keytypeid=%(keytypeid)s AND keyname=%(keyname)s AND customerid = %(customerid)s AND prmaxdatasetid = %(prmaxdatasetid)s""",
								            dict(keytypeid = record[0][1],
								                 keyname = str(record[0][2]),
								                 customerid = record[0][0]),
								            prmaxdatasetid = record[0][7])
						else:
							index.index.discard(line[3])
				if doDelete == False:
					if len(drecord):
						cur.execute("""UPDATE userdata.setindex set data = %(data)s, nbr = %(nbr)s WHERE setindexid = %(setindexid)s""",
					        dict(
					          setindexid = drecord[0][1],
					          nbr = len(index),
					          data =DBCompress.encode(index)))
					else:
						# add new record but only if has length
						if len(index):
							prmaxdatasetid = record[0][7]
							if prmaxdatasetid == -1:
								prmaxdatasetid = None

							cur.execute("""INSERT INTO userdata.setindex(customerid,keytypeid,keyname,nbr,data,datatypeid,prmaxdatasetid) VALUES(%(customerid)s,%(keytypeid)s,%(keyname)s,%(nbr)s,%(data)s,%(datatypeid)s,%(prmaxdatasetid)s)""",
							            dict(customerid = record[0][0],
							                 keytypeid = record[0][1],
							                 keyname = record[0][2],
							                 nbr = len(index),
							                 data = DBCompress.encode(index),
							                 datatypeid=DBUtilities.searchkeytodatatype(record[0][1]),
							                 prmaxdatasetid = prmaxdatasetid))

				# Completed indexing delete group
				ids = set([ line[5] for line in record])
				cur.execute("""DELETE FROM queues.indexerqueue WHERE indexerqueueid IN (%s)"""% ",".join([ str(line) for line in list(ids)]))
				db.commitTransaction(cur)

			if not no_output:
				print ("Completed", datetime.datetime.now())
			if records_delete:
				if not no_output:
					print ("Do Final Deletes %d" % (len(set(records_delete)), ))
				db.startTransaction(cur)
				cur.execute("""DELETE FROM queues.indexerqueue WHERE indexerqueueid IN (%s)"""% ",".join([ str(line) for line in set(records_delete)]))
				db.commitTransaction(cur)
			db.Close()
		except Exception, ex:
			print (ex)

		return maxrows

	def run_single(self):
		""" run once"""
		maxrows = 1
		while maxrows:
			maxrows = self.run(True)

options, dummy = getopt.getopt(sys.argv[1:],"" , ["filter="])

for option, params in options:
	if option in ("--filter",) and params:
			WHERECLAUSE = "WHERE objecttype=" + params

if WHERECLAUSE:
	reportctl = IndexController()
	reportctl.run_single()
else:
	# need to add a timing loop in here to run every 1 second if not already running
	while (1==1):
		sleep(Constants.sleepintervals)
		reportctl = IndexController()
		reportctl.heartbeat()
		reportctl.run()
		del reportctl
		gc.collect()
