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
import datetime, calendar
import prmax.Constants as Constants
from ttl.postgres import DBConnect

def SycnInfoForCacheDB():
	dbMain = DBConnect(Constants.db_Command_Service)
	dbCache = DBConnect(Constants.db_Cache_Command_Service)
	cur = dbMain.getCursor()
	cCache = dbCache.getCursor()

	print ("Syncing Users" , datetime.datetime.now())
	cur.execute("""SELECT user_id,display_name,customerid FROM public.tg_user""")
	rows = cur.fetchall()
	for row in rows:
		cCache.execute("""SELECT user_id FROM public.user_tmp WHERE user_id = %(user_id)s""" , dict ( user_id = row[0]))
		exists = cCache.fetchone()
		params = dict ( user_id = row[0] , user_name = row[1] , customerid = row[2] )
		if not exists:
			print ("Adding User" , row)
			cCache.execute("""INSERT INTO public.user_tmp ( user_id,user_name,customerid) VALUES( %(user_id)s,%(user_name)s,%(customerid)s)""", params )
		else:
			cCache.execute("""UPDATE public.user_tmp SET user_name = %(user_name)s WHERE user_id = %(user_id)s""", params)

	print ("Syncing Customers")
	cur.execute("""SELECT customerid, customername FROM internal.customers""")
	rows = cur.fetchall()
	for row in rows:
		cCache.execute("""SELECT customerid FROM public.customer_tmp WHERE customerid = %(customerid)s""" , dict ( customerid = row[0]))
		exists = cCache.fetchone()
		params = dict ( customerid = row[0] , customername = row[1] )
		if not exists:
			print ("Adding Customer" , row)
			cCache.execute("""INSERT INTO public.customer_tmp ( customerid,customername) VALUES( %(customerid)s,%(customername)s)""", params )
		else:
			cCache.execute("""UPDATE public.customer_tmp SET customername = %(customername)s WHERE customerid = %(customerid)s""", params )

	dbCache.commitTransaction ( cCache )
	dbCache.closeCursor( cCache )
	dbMain.Close()
	dbCache.Close()


def deleteAdvanceFeatures():
	dbMain = DBConnect(Constants.db_Command_Service)
	cur = dbMain.getCursor()

	print ("Delete Out of Date Fetures" , datetime.datetime.now())

	one_year_only = datetime.date.today() - datetime.timedelta( days = 365 )

	cur.execute("""DELETE FROM advancefeatures WHERE publicationdate_date <= %(one_year_only)s""",
	            dict ( one_year_only = one_year_only))

	dbMain.commitTransaction ( cur )
	dbMain.Close()
