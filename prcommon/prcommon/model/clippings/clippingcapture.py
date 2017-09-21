# -*- coding: utf-8 -*-
"""ClippingsCapture"""
#-----------------------------------------------------------------------------
# Name:        clippingscapture.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
import logging
from turbogears.database import session
from sqlalchemy import text
from prcommon.model.clippings.clippingsorder import ClippingsOrder
from prcommon.model.identity import Customer
#from prcommon.model.cyberwatch.cyberwatchsearch import CyberWatchSearch
from prcommon.model.mediatoolkit.mediatoolkitsearch import MediaToolKitSearch
from prcommon.model.madaptive.madaptivesearch import MadaptiveSearch
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

def execute_capture():
	"""Process to start the capture of clipping from the source that don't have a feed
	clyperwatch etc"""

	results = []
	# list of clippings orders
	for order in session.query(ClippingsOrder).\
	    join(Customer, Customer.customerid == ClippingsOrder.customerid).\
	    filter(Customer.customerstatusid.in_((1, 2))).\
	    filter(text("CURRENT_DATE BETWEEN clippingsorder.startdate AND clippingsorder.enddate")).\
	    filter(ClippingsOrder.has_been_deleted == False).\
	    order_by(Customer.customerid).all():
		resultdata = None
		try:
#			if order.clippingsourceid == Constants.Clipping_Source_Cyberwatch:
				# cyperwatch
#				resultdata = CyberWatchSearch.do_search(order)
#			elif order.clippingsourceid == Constants.Clipping_Source_MediaToolKit:
#				resultdata = MediaToolKitSearch.do_search(order)
			if order.clippingsourceid == Constants.Clipping_Source_Madaptive:
				search = MadaptiveSearch(order)
				search.do_search()
		except Exception, ex:
			LOGGER.exception("general")

	print results
