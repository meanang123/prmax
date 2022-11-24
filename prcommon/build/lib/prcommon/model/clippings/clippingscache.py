# -*- coding: utf-8 -*-
""" ClippingCache """
#-----------------------------------------------------------------------------
# Name:       ClippingCache.py
# Purpose:		Creates the profile display page and put it on the cache
# Author:     Chris Hoy
#
# Created:    08/05/2015
# Copyright:  (c) 2015

#-----------------------------------------------------------------------------
import os.path
import logging
from datetime import datetime
from turbogears.database import session
from  ttl.ttlmako import MakoBase
import prcommon.Constants as Constants
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.analysegeneral import AnalyseGeneral
from prcommon.model.client import Client
from prcommon.model.outlet import Outlet
from prcommon.model.customer.customermediaaccesstypes import CustomerMediaAccessTypes
from prcommon.model.caching import CachePreBuildPageStore
from prcommon.model.lookups import ClippingSource, ClippingsTone, ClippingsTypes, MediaAccessTypes
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.crm2.issues import Issue
from prcommon.model.identity import User, Customer
from prcommon.model.crm2.statements import Statements
from prcommon.model.emails import EmailTemplates

LOGGER = logging.getLogger("prcommon.model")

class ClippingCache(MakoBase):
	""" ClippingCache """

	def __init__(self, processrecord):
		""" init """
		MakoBase.__init__(self, os.path.dirname(__file__))
		self.templatename = "clippings_profile.mak"
		self._processrecord = processrecord

	def run(self):
		"""interface for app server """

		# setup data
		clippings = Clipping.query.get(self._processrecord.objectid)

		outlet = Outlet.query.get(clippings.outletid) if clippings.outletid else None
		client = Client.query.get(clippings.clientid) if clippings.clientid else None
		clippingstone = ClippingsTone.query.get(clippings.clippingstoneid) if clippings.clippingstoneid else None
		clippingstype = ClippingsTypes.query.get(clippings.clippingstypeid) if clippings.clippingstypeid else None
		issues = ",".join([issue[1].name for issue in session.query(ClippingsIssues, Issue).\
		                   join(Issue, ClippingsIssues.issueid == Issue.issueid).\
		                   filter(ClippingsIssues.clippingid == self._processrecord.objectid)])

		customer = Customer.query.get(clippings.customerid)
		mediaaccesstypes = []
		cmat = [ row.mediaaccesstypeid for row in session.query(CustomerMediaAccessTypes).\
	             filter(CustomerMediaAccessTypes.customerid == customer.customerid).all()]

		statement = Statements.query.get(clippings.statementid) if clippings.statementid else None
		prrelease = EmailTemplates.query.get(clippings.emailtemplateid) if clippings.emailtemplateid else None

		self._data["pr"] = dict(
		  clippings=clippings,
		  outlet=outlet,
		  client=client,
		  analytics=AnalyseGeneral.get_analyse_view_info(clippings.clippingid)["analytics"],
		  issues=issues,
		  updated=datetime.now().strftime("%d/%m/%y %H:%M:%S"),
		  clippingsource=ClippingSource.query.get(clippings.clippingsourceid),
		  clippingstone=clippingstone,
		  clippingstype=clippingstype,
		  customer=customer,
		  mediaaccesstype=cmat,
		  prrelease=prrelease,
		  statement=statement
		)

		# create html
		super(ClippingCache, self).run()

		# add to cached prfile
		cached_record = session.query(CachePreBuildPageStore).\
		  filter(CachePreBuildPageStore.objectid == self._processrecord.objectid).\
		  filter(CachePreBuildPageStore.objecttypeid == Constants.Process_Clipping_View).scalar()
		if cached_record:
			cached_record.data = self.output_compressed
		else:
			session.add(CachePreBuildPageStore(
			  objectid=self._processrecord.objectid,
			  objecttypeid=Constants.Process_Clipping_View,
			  data=self.output_compressed
			))

	@staticmethod
	def get_clippings_page(clippingid, userid):
		""" get the profile from the cache if present and add the customer private
		profile in as well"""

		cached_record = session.query(CachePreBuildPageStore).\
		  filter(CachePreBuildPageStore.objectid == clippingid).\
		  filter(CachePreBuildPageStore.objecttypeid == Constants.Process_Clipping_View).scalar()
		if cached_record:
			user = User.query.get(userid)
			rdata = cached_record.data.decode("utf-8")
			rdata = rdata.replace(u"%CLIENTNAME%", user.client_name)
			rdata = rdata.replace(u"%ISSUENAME%", user.issue_description)

			return rdata

		return "<p>Page Under Construction Please try again later</p>"
