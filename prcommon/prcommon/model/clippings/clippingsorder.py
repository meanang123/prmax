# -*- coding: utf-8 -*-
"""ClippingsOrder Record """
#-----------------------------------------------------------------------------
# Name:        clippingsorder.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from prcommon.model.clippings.clippingsprices import ClippingsPrices
from prcommon.model.lookups import ClippingPriceServiceLevel


import logging
LOG = logging.getLogger("prcommon")

class ClippingsOrder(object):
	""" ClippingsOrder record """

	def get_description(self):
		"""Text description of order"""

		clippingsprice = ClippingsPrices.query.get(self.clippingspriceid)
		cpl = ClippingPriceServiceLevel.query.get(clippingsprice.clippingpriceservicelevelid)


		return "Desc: %s Keyword: %s Dates: %s - %s Level: %d-%s" %(
		  self.description,
		  self.keywords,
		  self.startdate.strftime("%d/%m/%y"),
		  self.enddate.strftime("%d/%m/%y"),
		  clippingsprice.nbrclips,
		  cpl.clippingpriceserviceleveldescription)

	def get_as_dict(self):
		"return dict version "

		return dict(
		  clippingsorderid=self.clippingsorderid,
		  customerid=self.customerid,
		  startdate=self.startdate,
		  enddate=self.enddate,
		  keywords=self.keywords,
		  rss_feed=self.rss_feed,
		  clippingspriceid=self.clippingspriceid,
		  defaultclientid=self.defaultclientid,
		  defaultissueid=self.defaultissueid,
		  description=self.description,
		  purchaseorder=self.purchaseorder,
		  supplierreference=self.supplierreference,
		  pricecodeid=self.pricecodeid,
		  clippingsourceid=self.clippingsourceid,
		  clippingorderstatusid=self.clippingorderstatusid
		)

ClippingsOrder.mapping = Table('clippingsorder', metadata, autoload=True, schema="internal")

mapper(ClippingsOrder, ClippingsOrder.mapping)

