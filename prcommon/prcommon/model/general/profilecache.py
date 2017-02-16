# -*- coding: utf-8 -*-
""" ProfileCache """
#-----------------------------------------------------------------------------
# Name:        ProfileCache.py
# Purpose:		Creates the profile display page and put it on the cache
# Author:      Chris Hoy
#
# Created:    13/11/2012
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears.database import session
from prcommon.model.circulationdates import CirculationDates
from prcommon.model.circulationsources import CirculationSources
from prcommon.model.productioncompany import ProductionCompany
from prcommon.model import Outlet, OutletCustomer, OutletCoverageView
from prcommon.model.outletprofile import OutletProfile
from prcommon.model.outletlanguages import OutletLanguages
from prcommon.model.outlettooutlets import OutletToOutlets
from prcommon.model.publisher import Publisher
from prcommon.model.caching import CacheProfile
from prcommon.model.lookups import OutletPrices
from prcommon.model.language import Languages
from  ttl.ttlmako import MakoBase
import os.path
import logging
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")

class ProfileCache(MakoBase):
	""" ProfileCache """

	def __init__(self, processrecord):
		""" init """
		MakoBase.__init__(self, os.path.dirname( __file__ ))
		self.templatename = "outlet_profile.mak"
		self._processrecord =  processrecord

	def run( self ):
		"""interface for app server """

		# setup data
		profile =  OutletProfile.query.get( self._processrecord.objectid )
		outlet =  Outlet.query.get ( self._processrecord.objectid )
		publisher = None
		if outlet.publisherid:
			publisher = Publisher.query.get(outlet.publisherid)

		circulationdates = None
		if outlet.circulationauditdateid:
			circulationdates = CirculationDates.query.get( outlet.circulationauditdateid )

		circulationsource = None
		if outlet.circulationsourceid:
			circulationsource = CirculationSources.query.get( outlet.circulationsourceid )

		outletprice = None
		if outlet.outletpriceid:
			outletprice = OutletPrices.query.get ( outlet.outletpriceid)

		productioncompany =  None
		if profile.productioncompanyid:
			productioncompany = ProductionCompany.query.get( profile.productioncompanyid )

		languages = [row[1].languagename for row in session.query(OutletLanguages, Languages).\
		             join(Languages,  Languages.languageid == OutletLanguages.languageid).\
		             filter(OutletLanguages.outletid == outlet.outletid).all()
		             ]

		broadcaston = [row[1].outletname
		             for row in session.query( OutletToOutlets,  Outlet).\
		             join(Outlet,  Outlet.outletid == OutletToOutlets.parentid).\
		             filter(OutletToOutlets.parentid == outlet.outletid). \
		             filter(OutletToOutlets.typeid == 1).all()]

		coverage = [row.geographicalname for row in session.query(OutletCoverageView).\
		             filter(OutletCoverageView.outletid == outlet.outletid).all()
		             ]

		seriesparent = None
		if profile.seriesparentid:
			seriesparent = Outlet.query.get( profile.seriesparentid ).outletname

		seriesmembers = [ row[1].outletname for  row in  session.query( OutletProfile, Outlet).\
		                  join(Outlet, Outlet.outletid == OutletProfile.outletid).\
		                  filter(OutletProfile.seriesparentid == outlet.outletid).all()]

		supplementof =  None
		if profile.supplementofid:
			supplementof = Outlet.query.get( profile.supplementofid ).outletname

		supplements = [ row[1].outletname for  row in  session.query( OutletProfile, Outlet).\
		                join(Outlet, Outlet.outletid == OutletProfile.outletid).\
		                filter(OutletProfile.supplementofid == outlet.outletid).all()]

		editionof =  None
		editions = [ row[1].outletname for  row in  session.query( OutletProfile, Outlet).\
		                join(Outlet, Outlet.outletid == OutletProfile.outletid).\
		                filter(OutletProfile.editionofid == outlet.outletid).all()]

		self._data["pr"] = dict(
		  profile = profile,
		  outlet = outlet,
		  publisher = publisher,
		  circulationsource = circulationsource,
		  circulationdates = circulationdates,
		  outletprice =outletprice,
		  productioncompany = productioncompany,
		  languages = languages,
		  seriesparent = seriesparent,
		  seriesmembers = seriesmembers,
		  supplementof = supplementof,
		  supplements = supplements,
		  editionof = editionof,
		  editions = editions,
		  broadcaston = broadcaston,
		  coverage=coverage)

		# create html
		super(ProfileCache, self).run()

		# add to cached prfile
		cacheprofile = CacheProfile.query.get( self._processrecord.objectid )
		if cacheprofile:
			cacheprofile.displayprofile = self.output_compressed
		else:
			session.add( CacheProfile(
			  outletid = self._processrecord.objectid,
			  displayprofile =self.output_compressed
			))

	@staticmethod
	def get_profile_cache( outletid,  customerid ):
		""" get the profile from the cache if present and add the customer private
		profile in as well"""

		cacheprofile = CacheProfile.query.get( outletid )
		if cacheprofile:
			ret_data =  cacheprofile.displayprofile
			customer_profile = ""
			# now add private data
			customer = session.query( OutletCustomer ).\
			  filter( OutletCustomer.outletid == outletid).\
			  filter( OutletCustomer.customerid == customerid).scalar()
			if customer and customer.profile:
				customer_profile = customer.profile

			# clean up private
			return ret_data.replace('<span name="private"></span>', customer_profile.replace("\n", "<br/>"))

		return None


