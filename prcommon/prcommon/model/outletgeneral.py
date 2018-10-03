# -*- coding: utf-8 -*-
"""OutletGeneral """
#-----------------------------------------------------------------------------
# Name:        OutletGeneral.py
# Purpose:
# Author:      Chris Hoy
#
# Created:    08/11/2012
# Copyright:  (c) 2012

#-----------------------------------------------------------------------------
import logging

from turbogears.database import session
from prcommon.model.outlet import Outlet, Activity, ActivityDetails, OutletProfile
from prcommon.model.communications import Communication, Address
from prcommon.model.outletlanguages import OutletLanguages
from prcommon.model.research import ResearchControRecord, ResearchDetails
from prcommon.model.advance import AdvanceFeature
from prcommon.model.clippings.clipping import Clipping
from prcommon.lib.caching import Invalidate_Cache_Object_Research
import prcommon.Constants as Constants
from prcommon.model.queues import ProcessQueue
from ttl.model import BaseSql

LOGGER = logging.getLogger("prcommon.model")

class OutletGeneral(object):
	""" Outlet General """

	@staticmethod
	def update_profile(params):
		"""Update the research profile fields"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params["outletid"])

			# add the audit trail header record
			activity = Activity(
			  reasoncodeid=params["reasoncodeid"],
			  reason="",
			  objecttypeid=Constants.Object_Type_Outlet,
			  objectid=outlet.outletid,
			  actiontypeid=Constants.Research_Reason_Update,
			  userid=params['userid'],
			  parentobjectid=outlet.outletid,
			  parentobjecttypeid=Constants.Object_Type_Outlet
			)

			session.add(activity)
			session.flush()

			profile = OutletProfile.query.get(outlet.outletid)
			if not profile:
				profile = OutletProfile(outletid=outlet.outletid)
				session.add(profile)

			ActivityDetails.AddChange(profile.editorialprofile, params['editorialprofile'], activity.activityid, Constants.Field_Outlet_Publisher)
			ActivityDetails.AddChange(profile.readership, params["readership"], activity.activityid, Constants.Field_Readership)
			ActivityDetails.AddChange(profile.nrsreadership, params["nrsreadership"], activity.activityid, Constants.Field_Nrsreadership)
			ActivityDetails.AddChange(profile.jicregreadership, params["jicregreadership"], activity.activityid, Constants.Field_Jicregreadership)
			ActivityDetails.AddChange(profile.deadline, params["deadline"], activity.activityid, Constants.Field_Deadline)
			ActivityDetails.AddChange(profile.broadcasttimes, params["broadcasttimes"], activity.activityid, Constants.Field_Broadcasttimes)
			ActivityDetails.AddChange(profile.productioncompanyid, params["productioncompanyid"], activity.activityid, Constants.Field_Productioncompany)
			ActivityDetails.AddChange(outlet.publisherid, params["publisherid"], activity.activityid, Constants.Field_Publisher)
			ActivityDetails.AddChange(profile.web_profile_link, params["web_profile_link"], activity.activityid, Constants.Field_Web_Profile)

			profile.editorialprofile = params['editorialprofile']
			profile.readership = params["readership"]
			profile.nrsreadership = params["nrsreadership"]
			profile.jicregreadership = params["jicregreadership"]
			profile.deadline = params["deadline"]
			profile.broadcasttimes = params["broadcasttimes"]
			profile.productioncompanyid = params["productioncompanyid"]
			profile.web_profile_link = params["web_profile_link"]

			outlet.publisherid = params["publisherid"]

			# languages
			OutletLanguages.update(
			  params["outletid"],
			  params["language1id"],
			  params["language2id"],
			  activity)

			#OutletToOutlets.update(params["outletid"], params["broadcast"], activity, 1)


			# rebuild display record
			# old system and customer specific
			Invalidate_Cache_Object_Research(Outlet,
			                                 params["outletid"],
			                                 Constants.Cache_Outlet_Objects)

			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=outlet.outletid))

			ResearchDetails.set_research_modified(params["outletid"])

			transaction.commit()
		except:
			LOGGER.exception("profile_update")
			transaction.rollback()
			raise

	@staticmethod
	def research_main_update(params):
		""" resarch system update the main part of a cotact record """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params['outletid'])
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)

			# add the audit trail header record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                reason="",
			                objecttypeid=Constants.Object_Type_Outlet,
			                objectid=outlet.outletid,
			                actiontypeid=Constants.Research_Reason_Update,
			                userid=params['userid'],
			                parentobjectid=outlet.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet
			               )
			session.add(activity)
			session.flush()

			# set source to us
			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid


			ActivityDetails.AddChange(outlet.outletname, params['outletname'], activity.activityid, Constants.Field_Outlet_Name)
			ActivityDetails.AddChange(outlet.sortname, params['sortname'], activity.activityid, Constants.Field_Outlet_SortName)
			ActivityDetails.AddChange(outlet.www, params['www'], activity.activityid, Constants.Field_Address_Www)
			ActivityDetails.AddChange(outlet.circulation, params['circulation'], activity.activityid, Constants.Field_Circulation)
			ActivityDetails.AddChange(outlet.webbrowsers, params['webbrowsers'], activity.activityid, Constants.Field_WebBrowsers)
			ActivityDetails.AddChange(outlet.frequencyid, params['frequencyid'], activity.activityid, Constants.Field_Frequency)
			ActivityDetails.AddChange(outlet.countryid, params['countryid'], activity.activityid, Constants.Field_CountryId)
			ActivityDetails.AddChange(outlet.circulationsourceid, params['circulationsourceid'], activity.activityid, Constants.Field_Outlet_Circulation_Source)
			ActivityDetails.AddChange(outlet.circulationauditdateid, params['circulationauditdateid'], activity.activityid, Constants.Field_Outlet_Circulation_Dates)
			ActivityDetails.AddChange(outlet.websourceid, params['websourceid'], activity.activityid, Constants.Field_Outlet_Web_Source)
			ActivityDetails.AddChange(outlet.webauditdateid, params['webauditdateid'], activity.activityid, Constants.Field_Outlet_Web_Dates)
			ActivityDetails.AddChange(outlet.outletpriceid, params['outletpriceid'], activity.activityid, Constants.Field_Outlet_Price)
			ActivityDetails.AddChange(outlet.mediaaccesstypeid, params['mediaaccesstypeid'], activity.activityid, Constants.Field_Media_Access_Types)

			if 'address1' in params:
				ActivityDetails.AddChange(address.address1, params['address1'], activity.activityid, Constants.Field_Address_1)
			if 'address2' in params:
				ActivityDetails.AddChange(address.address2, params['address2'], activity.activityid, Constants.Field_Address_2)
			if 'townname' in params:
				ActivityDetails.AddChange(address.townname, params['townname'], activity.activityid, Constants.Field_Address_Town)
			if 'county' in params:
				ActivityDetails.AddChange(address.county, params['county'], activity.activityid, Constants.Field_Address_County)
			if 'postcode' in params:
				ActivityDetails.AddChange(address.postcode, params['postcode'], activity.activityid, Constants.Field_Address_Postcode)

			ActivityDetails.AddChange(comm.email, params['email'], activity.activityid, Constants.Field_Email)
			if 'tel' in params:
				ActivityDetails.AddChange(comm.tel, params['tel'], activity.activityid, Constants.Field_Tel)
			if 'fax' in params:
				ActivityDetails.AddChange(comm.fax, params['fax'], activity.activityid, Constants.Field_Fax)
			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)

			# deal with profile
			profile = OutletProfile.query.get(outlet.outletid)
			if not profile:
				profile = OutletProfile(outletid=outlet.outletid)
				session.add(profile)

			ActivityDetails.AddChange(profile.subtitle, params['subtitle'], activity.activityid, Constants.Field_Subtitle_name)
			ActivityDetails.AddChange(profile.officialjournalof, params['officialjournalof'], activity.activityid, Constants.Field_Officejournalof)
			ActivityDetails.AddChange(profile.incorporating, params['incorporating'], activity.activityid, Constants.Field_Incorporating)
			ActivityDetails.AddChange(profile.frequencynotes, params['frequencynotes'], activity.activityid, Constants.Field_Frequency_Notes)

			profile.subtitle = params['subtitle']
			profile.officialjournalof = params['officialjournalof']
			profile.incorporating = params['incorporating']
			profile.frequencynotes = params['frequencynotes']

			outlet.outletname = params['outletname']
			outlet.sortname = params['sortname']
			outlet.www = params['www']
			outlet.circulation = params['circulation']
			outlet.webbrowsers = params['webbrowsers']
			outlet.frequencyid = params['frequencyid']
			outlet.countryid = params["countryid"]

			outlet.circulationsourceid = params["circulationsourceid"]
			outlet.circulationauditdateid = params["circulationauditdateid"]
			outlet.websourceid = params["websourceid"]
			outlet.webauditdateid = params["webauditdateid"]
			outlet.outletpriceid = params["outletpriceid"]

			if outlet.mediaaccesstypeid != params["mediaaccesstypeid"]:
				# licence changed we need to tell all the clippings to rebuild and reflect this
				rows = [{"processid":Constants.Process_Clipping_View, "objectid": row.clippingid}
				        for row in session.query(Clipping.clippingid).filter(Clipping.outletid == outlet.outletid)]
				if rows:
					session.execute(ProcessQueue.mapping.insert(), rows)

			outlet.mediaaccesstypeid = params["mediaaccesstypeid"]

			if 'address1' in params:
				address.address1 = params['address1']
			if 'address2' in params:
				address.address2 = params['address2']
			if 'townname' in params:
				address.townname = params['townname']
			if 'county' in params:
				address.county = params['county']
			if 'postcode' in params:
				address.postcode = params['postcode']

			comm.email = params['email']
			if 'tel' in params:
				comm.tel = params['tel']
			if 'fax' in params:
				comm.fax = params['fax']
			comm.facebook = params['facebook']
			comm.twitter = params['twitter']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']
			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 params["outletid"],
			                                 Constants.Cache_Outlet_Objects)

			ResearchDetails.set_research_modified(params["outletid"])


			transaction.commit()
		except:
			LOGGER.exception("research_main_update")
			transaction.rollback()
			raise

	@staticmethod
	def research_coding_update(params):
		""" resarch system update the main part of a cotact record """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params['outletid'])

			# add the audit trail header record
			activity = Activity(reasoncodeid=params.get("reasoncodeid", Constants.ReasonCode_Questionnaire),
			                reason="",
			                objecttypeid=Constants.Object_Type_Outlet,
			                objectid=outlet.outletid,
			                actiontypeid=Constants.Research_Reason_Update,
			                userid=params['userid'],
			                parentobjectid=outlet.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet
			               )
			session.add(activity)
			session.flush()

			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			ActivityDetails.AddChange(outlet.prmax_outlettypeid, params['prmax_outlettypeid'], activity.activityid, Constants.Field_Outlet_Type)

			outlet.prmax_outlettypeid = params['prmax_outlettypeid']

			profile = OutletProfile.query.get(outlet.outletid)
			if not profile:
				profile = OutletProfile(outletid=outlet.outletid)
				session.add(profile)

			# update parent record of groups if required
			OutletGeneral.update_parent(profile.seriesparentid, params.get("seriesparentid", None))
			OutletGeneral.update_parent(profile.supplementofid, params.get("supplementofid", None))

			ActivityDetails.AddChange(profile.seriesparentid, params.get("seriesparentid", None), activity.activityid, Constants.Field_Series_Parent)
			ActivityDetails.AddChange(profile.supplementofid, params.get("supplementofid", None), activity.activityid, Constants.Field_Supplement_Of)

			profile.seriesparentid = params.get("seriesparentid", None)
			profile.supplementofid = params.get("supplementofid", None)

			Outlet.do_outlet_coverage(outlet, activity, params)
			Outlet.do_outlet_interests(outlet, activity, params)
			OutletProfile.do_supplements(outlet.outletid, params["supplements"], activity)
			OutletProfile.do_editions(outlet.outletid, params["editions"], activity)

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 params["outletid"],
			                                 Constants.Cache_Outlet_Objects)

			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=outlet.outletid))

			ResearchDetails.set_research_modified(params["outletid"])

			transaction.commit()
		except:
			LOGGER.exception("research_coding_update")
			transaction.rollback()
			raise

	@staticmethod
	def update_parent(oldparentid, newparentid):
		"add a refresh on profile"
		if newparentid != None:
			newparentid = int(newparentid)

		if oldparentid != newparentid:
				cpid = newparentid
				if cpid == None:
					cpid = oldparentid
				if cpid != None:
					session.add(ProcessQueue(
					  objecttypeid=Constants.Process_Outlet_Profile,
					  objectid=cpid))

	ListData = """
		SELECT
		outletid,
	  outletid AS id,
		outletname
		FROM outlets """

	ListDataCount = """
		SELECT COUNT(*) FROM  outlets """

	@staticmethod
	def get_research_list(params):
		"""list for dropdown list"""

		whereused = BaseSql.addclause("", "customerid = -1 AND sourcetypeid IN(1,2)")
		if "prmaxdatasetids" in params:
			whereused = BaseSql.addclause(whereused, "countryid IN (SELECT countryid FROM internal.prmaxdatasetcountries WHERE prmaxdatasetid IN %s)" % params["prmaxdatasetids"])
		if "ioutletid" in params:
			whereused = BaseSql.addclause(whereused, "countryid IN (SELECT countryid FROM outlets WHERE outletid=:ioutletid)" )
			params["ioutletid"] = int(params["ioutletid"])
		primaryid = False

		if "outletname" in params:
			whereused = BaseSql.addclause(whereused, "outletname ilike :outletname")
			if params["outletname"]:
				params["outletname"] = params["outletname"].replace("*", "")
				if "extended_search" in  params:
					params["outletname"] = "%" + params["outletname"] + "%"
				else:
					params["outletname"] = params["outletname"] + "%"
		else:
			return Outlet.grid_to_rest(dict(numRows=0, items=[], identity="outletid"),
			                          params["offset"],
			                          True if primaryid in  params else False)

		return Outlet.get_rest_page_base(
									params,
									'outletid',
									'outletname',
									OutletGeneral.ListData + whereused + BaseSql.Standard_View_Order,
									OutletGeneral.ListDataCount + whereused,
									Outlet)

	@staticmethod
	def update_international(params):
		""" Update Internation"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params["outletid"])

			activity = Activity(reasoncodeid=params.get("reasoncodeid", Constants.ReasonCode_Questionnaire),
			                reason="",
			                objecttypeid=Constants.Object_Type_Outlet,
			                objectid=outlet.outletid,
			                actiontypeid=Constants.Research_Reason_Update,
			                userid=params['userid'],
			                parentobjectid=outlet.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet
			               )
			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(outlet.prmax_outlettypeid, params['prmax_outlettypeid'], activity.activityid, Constants.Field_Outlet_Type)

			outlet.prmax_outlettypeid = params["prmax_outlettypeid"]
			com = Communication.query.get(outlet.communicationid)
			if com:
				address = Address.query.get(com.addressid)
				if address:
					address.address1 = params['address1']
					address.address2 = params['address2']
					address.townnamd = params['townname']
					address.county = params['county']
					address.postcode = params['postcode']
				com.email = params['email']
				com.tel = params['tel']
				com.fax = params['fax']

			Outlet.do_outlet_interests(outlet, activity, params)

			control = session.query(ResearchControRecord).\
			  filter(ResearchControRecord.objectid == params["outletid"]).scalar()

			if control:
				control.international_override = True
			else:
				session.add(ResearchControRecord(outletid=params["outletid"], international_override=True))

			transaction.commit()
		except:
			LOGGER.exception("update_international")
			transaction.rollback()
			raise


	@staticmethod
	def has_advancefeatures(params):
		"""Check for Advance feattures"""

		res = session.query(AdvanceFeature.advancefeatureid).\
		  filter(AdvanceFeature.outletid == params["outletid"]).\
			limit(1).all()

		return True if len(res) else False

	Grid_Outlet_View = """SELECT outletid,outletname,outletid as id FROM outlets AS o """
	Grid_View_Outlet_Count = """SELECT COUNT(*) FROM outlets AS o """

	@staticmethod
	def list_outlets(params):
		"""Rest Page """

		whereclause = BaseSql.addclause('', '(o.customerid=:customerid OR o.customerid=-1)')
		whereclause = BaseSql.addclause(whereclause,
		                                """o.countryid in(SELECT pc.countryid	FROM internal.customerprmaxdatasets AS cpd
		                                JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		                                WHERE cpd.customerid = :customerid)""")

		if 'outletid' in params:
			whereclause = BaseSql.addclause(whereclause, 'o.outletid=:outletid')
			params['outletid'] = int(params['outletid'])

		if 'countryid' in params:
			whereclause = BaseSql.addclause(whereclause, 'o.countryid=:countryid')
			params['countryid'] = int(params['countryid'])

		if "outletname" in params:
			if params["outletname"] != "*":
				whereclause = BaseSql.addclause(whereclause, "outletname ilike :outletname")
				if params["outletname"]:
					if params["outletname"][-1] == "*":
						params["outletname"] = params["outletname"][:-1]
					params["outletname"] = params["outletname"] + "%"

		data = BaseSql.get_grid_page(
				params,
		    'outletname',
				'outletid',
				OutletGeneral.Grid_Outlet_View + whereclause + BaseSql.Standard_View_Order,
				OutletGeneral.Grid_View_Outlet_Count + whereclause,
				Outlet)

		return BaseSql.grid_to_rest(data,
				                          params["offset"],
				                          True if 'outletid' in params else False)
