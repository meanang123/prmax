# -*- coding: utf-8 -*-
"""outletprofile"""
#-----------------------------------------------------------------------------
# Name:        outletprofile
# Purpose:
# Author:      Chris Hoy
#
# Created:     09/11/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from ttl.model import BaseSql
import prcommon.Constants as Constants
from prcommon.model.outletlanguages import OutletLanguages
from prcommon.model.outlettooutlets import OutletToOutlets
from prcommon.model.language import Languages

import logging
LOGGER = logging.getLogger("prcommon")

class OutletProfile(BaseSql):
	""" outletprofile  """

	def __json__(self):
		""" json record """
		props = {}
		for key in self.__dict__:
			if not key.startswith('_sa_'):
				props[key] = getattr(self, key)

		return props


	@staticmethod
	def get_default_dict():
		"""Default Details"""
		return dict (cost = None,
		             readership = None,
		             editorialprofile = None,
		             nrsreadership = None,
		             jicregreadership = None,
		             subtitle = None,
		             officialjournalof = None,
		             incorporating = None,
		             deadline = None,
		             frequencynotes = None,
		             seriesparentid = None,
		             supplementofid = None,
		             broadcasttimes = None,
		             productioncompanyid = None,
		             )


	@classmethod
	def get_for_research_edit( cls,  outletid ):
		"""get for profile """

		from  outlet import Outlet

		profile = OutletProfile.query.get( outletid )
		seriesparentname =  ""
		editionofname =  ""
		supplementofname = ""
		if profile:
			if profile.seriesparentid:
				tmp = Outlet.query.get ( profile.seriesparentid )
				seriesparentname =  tmp.outletname
			if profile.supplementofid:
				tmp = Outlet.query.get ( profile.supplementofid )
				supplementofname = tmp.outletname

		return dict (
		  profile = profile,
		  languages = [ row[1] for row in session.query( OutletLanguages, Languages).\
		  join(Languages, Languages.languageid == OutletLanguages.languageid).\
		  filter(OutletLanguages.outletid == outletid).all()],
		  broadcast = [dict(outletid =row[1].outletid,  outletname = row[1].outletname)
		               for row in session.query( OutletToOutlets,  Outlet).\
		               join(Outlet,  Outlet.outletid == OutletToOutlets.parentid).\
		               filter(OutletToOutlets.parentid == outletid). \
		               filter(OutletToOutlets.typeid == 1).all()],
		  seriesparentname = seriesparentname,
		  editionofname =  editionofname,
		  supplementofname = supplementofname
		)


	@classmethod
	def do_supplements(cls,  outletid, supplements, activity ):
		""" update the supplements of a publications"""

		supplements = [] if  supplements == None else supplements
		existing = {}
		for row in  session.query( OutletProfile).\
		    filter(OutletProfile.supplementofid == outletid).all():
			existing[row.supplementofid] = True
			if row.supplementofid not in supplements:
				session.delete( row )

		# check for add
		for supplementid in supplements:
			if supplementid not in existing:
				outlet = OutletProfile.query.get(supplementid)
				if outlet:
					outlet.supplementofid = outletid
				else:
					outletprofile = OutletProfile(
					  outletid = supplementid,
					  supplementofid = outletid )
					session.add( outletprofile )

	@classmethod
	def do_editions(cls,  outletid, editions, activity ):
		""" editpions """

		# existing details + do deletes
		editions = [] if  editions == None else editions

		existing = {}
		for row in  session.query( OutletProfile).\
		    filter(OutletProfile.editionofid == outletid).all():
			existing[row.editionofid] = True
			if row.editionofid not in editions:
				session.delete( row )

		# check for add
		for editionid in editions:
			if editionid not in existing:
				outlet = OutletProfile.query.get(editionid)
				if outlet:
					outlet.editionofid = outletid
				else:
					outletprofile = OutletProfile(
					  outletid = editionid,
					  editionofid = outletid )
					session.add( outletprofile )


# load tables from db
OutletProfile.mapping = Table('outletprofile', metadata, autoload=True)

mapper(OutletProfile, OutletProfile.mapping)
