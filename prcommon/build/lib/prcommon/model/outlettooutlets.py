# -*- coding: utf-8 -*-
"""outlettooutlets record """
#-----------------------------------------------------------------------------
# Name:       outlettooutlets.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     12/11/2012
# Copyright:   (c) 2012
#
#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prcommon.model")

class OutletToOutlets(BaseSql):
	""" outlettooutlets Record"""

	@classmethod
	def update(cls,  parentoutletid,  outlets,  ac,  typeid):
		""" update the list of outletids for an oulets"""

		new_outlets = {}
		for outletid in outlets:
			new_outlets[outletid] =  outletid

		# check for deletes
		existing = {}
		for row in session.query(OutletToOutlets).\
		    filter(OutletToOutlets.parentid == parentoutletid).\
		    filter(OutletToOutlets.typeid == typeid).all():
			existing[row.outletid] = True
			if row.outletid not in new_outlets:
				session.delete( row )

		# check for add
		for outletid in outlets:
			if outletid not in existing:
				session.add( OutletToOutlets(
				  parentid = parentoutletid,
				  childid= outletid,
				  typeid = typeid))

OutletToOutlets.mapping = Table('outlettooutlets', metadata, autoload = True)

mapper(OutletToOutlets, OutletToOutlets.mapping )
