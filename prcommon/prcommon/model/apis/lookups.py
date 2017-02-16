# -*- coding: utf-8 -*-
""" lookups """
#-----------------------------------------------------------------------------
# Name:        lookups.py
# Purpose:
# Author:      Chris Hoy
#
# Created:    01/20/2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------
import logging
from turbogears.database import session
from prcommon.model.roles import PRMaxRoles
from prcommon.model.interests import Interests
from prcommon.model.lookups import Countries, PRmaxOutletTypes
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

def _split(lookupnames):
	'lookup names'

	retdata = dict()
	for name in lookupnames.split(','):
		if name.lower() not in ApiLookups.LOOKUPS:
			return Exception("%s not valid lookup")

		retdata[name.lower()] = True

	return retdata

class ApiLookups(object):
	""" session """
	ROLES = 'roles'
	INTERESTS = 'interests'
	MEDIACHANNELS = 'mediachannels'
	COUNTRIES = 'countries'
	LOOKUPS = {ROLES: True, INTERESTS: True, MEDIACHANNELS: True, COUNTRIES: True,}

	@staticmethod
	def api_lookup_get(params, lookupnames=None):
		"""Get lookup or all lookups"""

		lookupname = _split(lookupnames) if lookupnames else ApiLookups.LOOKUPS
		details = dict()

		if ApiLookups.ROLES in lookupname:
			details[ApiLookups.ROLES] = [dict(prmaxroleid=row.prmaxroleid, prmaxrole=row.prmaxrole) for row in session.query(PRMaxRoles).\
			                    filter(PRMaxRoles.visible == True).order_by(PRMaxRoles.prmaxroleid).all()]

		if ApiLookups.INTERESTS in lookupname:
			details[ApiLookups.INTERESTS] = [dict(interestid=row.interestid, interestname=row.interestname) for row in session.query(Interests).\
			                      filter(Interests.customerid == -1).\
			                      filter(Interests.isroot == 0).\
			                      filter(Interests.interesttypeid == Constants.Interest_Type_Standard).order_by(Interests.interestid).all()]

		if ApiLookups.COUNTRIES in lookupname:
			details[ApiLookups.COUNTRIES] = [dict(countryid=row.countryid, countryname=row.countryname) for row in session.query(Countries).\
			                      order_by(Countries.countryid).all()]

		if ApiLookups.MEDIACHANNELS in lookupname:
				details[ApiLookups.MEDIACHANNELS] = [dict(outlettypeid=row.prmax_outlettypeid, outlettypename=row.prmax_outlettypename)
				                          for row in session.query(PRmaxOutletTypes).order_by(PRmaxOutletTypes.prmax_outlettypeid).all()]

		return details

