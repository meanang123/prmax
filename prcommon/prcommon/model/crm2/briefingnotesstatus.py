# -*- coding: utf-8 -*-
"""briefingnotesstatus record"""
#-----------------------------------------------------------------------------
# Name:       briefingnotesstatus.py
# Purpose:
# Author:      Chris Hoy
# Created:     14/10/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, or_
from ttl.model import BaseSql

class BriefingNotesStatus(BaseSql):
	""" briefingnotesstatus """

	@classmethod
	def get_look_up(cls, params):
		""" get a lookup list """

		lines = [ dict(id = row.briefingnotesstatusid, name = row.briefingnotesstatusdescription) for row in session.query(BriefingNotesStatus).\
		  filter(or_(BriefingNotesStatus.customerid == None, BriefingNotesStatus.customerid == params["customerid"])).\
		  order_by( BriefingNotesStatus.briefingnotesstatusdescription).all()]
		return lines

BriefingNotesStatus.mapping = Table('briefingnotesstatus', metadata, autoload = True, schema="userdata")

mapper(BriefingNotesStatus, BriefingNotesStatus.mapping )
