# -*- coding: utf-8 -*-
""" mediatoolkit search and import"""
#-----------------------------------------------------------------------------
# Name:        mediatoolkitSearch.py
# Purpose:		 To do a search on the mediatoolkit system
#
# Author:      Chris Hoy
#
# Created:	   27/6/2016
# Copyright:   (c) 2016

#-----------------------------------------------------------------------------
import logging
from datetime import datetime, timedelta
from prcommon.model.mediatoolkit.mediatoolkitaccess import MediaToolKitAccess
from prcommon.model.common import BaseSql


LOGGER = logging.getLogger("prcommon.model")

class MediaToolKitSearch(object):
	"mediatoolkitSearch"

	@staticmethod
	def do_search(clippingorder):

		now = datetime.now()
		tmp = clippingorder.supplierreference.split(":")
		if not len(tmp):
			raise Exception("%d:%s - invalid supplier ref", clippingorder.customerid, clippingorder.description)

		results = MediaToolKitAccess.execute_search(int(tmp[0]),
		                                            int(tmp[1]),
		                                            from_time=clippingorder.last_completed)
		# at this point we need to create all the details
		transaction = BaseSql.sa_get_active_transaction()
		try:
			for clip in results:
				print clip
				# check exits
				# yes check for update
				# check customer and if no add
				# no add and to store
				# add to customer


			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("MediaToolKitSearch-do_search")


