# -*- coding: utf-8 -*-
"""ClippingsPrices Record """
#-----------------------------------------------------------------------------
# Name:        clippingsprices.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model import BaseSql
from ttl.ttlmaths import from_int
from prcommon.model.lookups import VatCodes, Countries


import logging
LOG = logging.getLogger("prcommon")

class ClippingsPrices(BaseSql):
	""" ClippingsPrices record """

	ListData = """
	SELECT
		cp.clippingspriceid,
		cp.clippingspriceid AS id,
	  CASE WHEN LENGTH(cp.description) = 0 THEN cp.nbrclips||' - '||cpl.clippingpriceserviceleveldescription ELSE cp.description END AS description,
	  cp.nbrclips,
	  cp.price,
	  cp.extraperclip,
	  cpl.clippingpriceserviceleveldescription
	FROM internal.clippingsprices AS cp
	JOIN internal.clippingpriceservicelevel AS cpl ON cpl.clippingpriceservicelevelid = cp.clippingpriceservicelevelid"""

	ListDataCount = """
	SELECT COUNT(*)
	FROM internal.clippingsprices AS cp
	JOIN internal.clippingpriceservicelevel AS cpl ON cpl.clippingpriceservicelevelid = cp.clippingpriceservicelevelid"""

	@staticmethod
	def get_list_clippingsprice(params):
		""" get rest page  """

		whereclause = ""

		if "icustomerid" in params:
			whereclause = BaseSql.addclause(whereclause, "(cp.customerid = icustomerid OR cp.customerid IS NULL)")

		if "clippingpriceservicelevelid" in params:
			whereclause = BaseSql.addclause(whereclause, "cp.clippingpriceservicelevelid = :clippingpriceservicelevelid")
			params["clippingpriceservicelevelid"] = int(params["clippingpriceservicelevelid"])

		if "clippingspriceid" in params:
			whereclause = BaseSql.addclause(whereclause, "cp.clippingspriceid = :clippingspriceid")
			params["clippingspriceid"] = int(params['clippingspriceid'])

		if "description" in params:
			if params["description"] != "*":
				whereclause = BaseSql.addclause(whereclause, "CASE WHEN LENGTH(cp.description) = 0 THEN cp.nbrclips||' - '||cpl.clippingpriceserviceleveldescription ELSE cp.description END  ilike :description")
				if params["description"]:
					if params["description"][-1] == "*":
						params["description"] = params["description"][:-1]
					params["description"] = params["description"] + "%"

		return BaseSql.get_rest_page_base(
			params,
			'clippingspriceid',
			'description',
			ClippingsPrices.ListData + whereclause + BaseSql.Standard_View_Order,
			ClippingsPrices.ListDataCount + whereclause,
			ClippingsPrices)

	def actual_price_net(self):
		""" as float"""

		return from_int(self.price)

	def actual_price_vat(self, customer):
		""" as float"""

		vat = VatCodes.query.get(Countries.query.get(customer.countryid).vatcodeid)

		return vat.calc_vat_required(from_int(self.price))

	def actual_price_gross(self, customer):
		""" as float"""

		return self.actual_price_net() + self.actual_price_vat(customer)

ClippingsPrices.mapping = Table('clippingsprices', metadata, autoload=True, schema="internal")

mapper(ClippingsPrices, ClippingsPrices.mapping)

