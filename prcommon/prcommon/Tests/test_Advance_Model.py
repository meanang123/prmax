# -*- coding: utf-8 -*-

from turbogears.testutil import DBTest
from turbogears.util import get_model
from ttl.testsbase import initTestController

from turbogears.database import session
from sqlalchemy.sql import text, func
from sqlalchemy.exc import DataError

initTestController()

from prcommon.model import AdvanceFeaturesList, AdvanceFeaturesListMembers, \
     AdvanceFeature


class TestAdvanceList(DBTest):
	def setUp(self):
		self._params = dict ( customerid = -1 ,
								          userid = 1 ,
								          listname="Test",
								          searchtypeid = 10,
								          selector = -1 )

		if not self.model:
			self.model = get_model()
			if not self.model:
				raise Exception("Unable to run database tests without a model")
		self.tearDown()

	def _add_entries_list(self):
		session.execute("INSERT INTO userdata.advancefeatureslistmembers(advancefeatureslistid,advancefeatureid) SELECT :advancefeatureslistid,advancefeatureid FROM advancefeatures LIMIT 100",
								    self._params,
								    AdvanceFeaturesList)
		session.flush()

	def tearDown(self):
		try:
			listid = AdvanceFeaturesList.Exists( self._params)
			if listid :
				AdvanceFeaturesList.Delete ( listid )
		except : pass
		try:
			result = session.execute ( text("DELETE FROM userdata.searchsession WHERE userid = :userid AND searchtypeid =:searchtypeid") ,
												         self._params,
												         AdvanceFeaturesList)
		except : pass
		try:
			if self._params.has_key("destinationid"):
				AdvanceFeaturesList.Delete ( self._params["destinationid"] )
		except : pass


	def test_list_add(self):
		""" Add a new list name """

		assert AdvanceFeaturesList.Add ( self._params ) > 0

	def test_list_delete(self):
		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		assert AdvanceFeaturesList.Exists( self._params ) != None
		AdvanceFeaturesList.Delete ( self._params["advancefeatureslistid"] )
		assert AdvanceFeaturesList.Exists( self._params ) == None

	def test_list_exists(self):
		""" Check list Exists function """
		assert AdvanceFeaturesList.Exists( self._params ) == None

	def test_list_exists2(self):
		""" Check list Exists function """
		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		assert AdvanceFeaturesList.Exists2( self._params ) == None
		AdvanceFeaturesList.Delete ( self._params["advancefeatureslistid"] )


	def test_toTempStandingList(self):
		""" Move too a standing list """

		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		self._add_entries_list()
		AdvanceFeaturesList.toTempStandingList(self._params )
		result = session.execute ( text("SELECT COUNT(*) FROM userdata.searchsession WHERE userid = :userid AND searchtypeid =:searchtypeid") ,
								               self._params,
								               AdvanceFeaturesList)
		assert result.fetchone()[0]>0

	def test_list_Copy(self):
		""" Test the opy list funtion """

		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		self._add_entries_list()
		tmp = dict( self._params )
		tmp["listname"] = "Test2"
		AdvanceFeaturesList.Copy(tmp)
		assert tmp.has_key("destinationid")


		c = session.query(func.count()).filter(AdvanceFeaturesListMembers.advancefeatureslistid == tmp["destinationid"]).one()[0]
		assert ( c == 100 )

		AdvanceFeaturesList.Copy(tmp)

		c = session.query(func.count()).filter(AdvanceFeaturesListMembers.advancefeatureslistid == tmp["destinationid"]).one()[0]
		assert ( c == 100 )

		self._params["destinationid"] = tmp["destinationid"]

	def test_list_getCount(self):
		""" get the count for a list """
		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		c = session.query(func.count()).filter(AdvanceFeaturesListMembers.advancefeatureslistid == self._params["advancefeatureslistid"]).one()[0]
		assert ( c == 0 )
		self._add_entries_list()
		c = session.query(func.count()).filter(AdvanceFeaturesListMembers.advancefeatureslistid == self._params["advancefeatureslistid"]).one()[0]
		assert ( c == 100 )

	def test_list_Rename(self):
		""" Test the rename list function """

		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		AdvanceFeaturesList.Exists( self._params )
		tmp = dict ( self._params )
		tmp["listname"] = "Renamed List"
		AdvanceFeaturesList.Rename ( tmp )
		r = AdvanceFeaturesList.get ( self._params["advancefeatureslistid"])

		assert ( r.advancefeatureslistdescription == tmp["listname"] )


	def test_advancelist_getExt(self):
		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )
		r = AdvanceFeaturesList.get ( self._params["advancefeatureslistid"])
		assert ( r != None )


	def test_advancelist_get(self):
		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )

		r = AdvanceFeaturesList.getExt ( self._params["advancefeatureslistid"])
		assert ( r != None )

		def test_deleteSelectedList(self):
			""" Test he delete selected list """

		self._params["advancefeatureslistid"] = AdvanceFeaturesList.Add ( self._params )

	def _get_sample_feature(self):
		self.adv_rec = session.query( AdvanceFeature ).limit(1).one()


	def test_advance_getExt(self):
		""" test get extended record """

		self._get_sample_feature()
		r = AdvanceFeature.getExt ( dict ( advancefeatureid = self.adv_rec.advancefeatureid ) )


	def _test_delete(self):
		r = AdvanceFeature.getExt ( dict ( advancefeatureid = self.test_data.advancefeatureid ) )

	def test_advance_add_delete(self):
		""" add and then delete and advance record """
		self.test_data = dict ( advancefeatureid = 	-1,
		                   cover = dict(text= "c", date="2011-1-17", month = 1 ),
		                   editorial = dict(text = "ed", date = "2011-1-18", month = False),
		                   employeeid	 = 227006,
		                   outletid	= 70493,
		                   feature	 = "This is a test advance entt",
		                   featuredescription	= "Full details line 2",
		                   interests = [1100,57],
		                   publicationdate = dict ( text = "p",date = "2011-1-19", month = False),
		                   reason	= "Testing System",
		                   reasoncodeid	= "8" )
		self.test_data.update ( self._params )
		self.test_data["advancefeatureid"] = AdvanceFeature.research_new ( self.test_data )
		AdvanceFeature.research_delete ( self.test_data )

		self.assertRaises ( DataError, self._test_delete )


