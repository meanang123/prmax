# -*- coding: utf-8 -*-
"""issue record"""
#-----------------------------------------------------------------------------
# Name:       contacthistorytypes.py
# Purpose:
# Author:      Chris Hoy
# Created:     13/06/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, or_
from ttl.model import BaseSql

class ContactHistoryTypes(BaseSql):
	""" contacthistorytypes """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [ dict (id = row.contacthistorytypeid, name = row.contacthistorytypedescription)
		         for row in session.query(ContactHistoryTypes).\
		         filter(or_(ContactHistoryTypes.customerid == None, ContactHistoryTypes.customerid == params["customerid"])).\
		                order_by( ContactHistoryTypes.contacthistorytypedescription).all() ]

ContactHistoryTypes.mapping = Table('contacthistorytypes', metadata, autoload = True, schema="internal")

mapper(ContactHistoryTypes, ContactHistoryTypes.mapping )
