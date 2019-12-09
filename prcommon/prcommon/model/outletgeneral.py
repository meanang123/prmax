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
from prcommon.model.language import Languages
from prcommon.model.research import ResearchControRecord, ResearchDetails
from prcommon.model.advance import AdvanceFeature
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.lookups import Frequencies, Countries, Publishers, OutletPrices, MediaAccessTypes, PRmaxOutletTypes
from prcommon.model.circulationsources import CirculationSources
from prcommon.model.circulationdates import CirculationDates
from prcommon.model.websources import WebSources
from prcommon.model.webdates import WebDates
from prcommon.model.productioncompany import ProductionCompany
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
			ActivityDetails.AddChange(profile.broadcasttimes, params["broadcasttimes"], activity.activityid, Constants.Field_Broadcasttimes)

			old_productioncompanydescription = new_productioncompanydescription = ""
			if profile.productioncompanyid:
				old_productioncompany = ProductionCompany.query.get(profile.productioncompanyid)
				old_productioncompanydescription = old_productioncompany.productioncompanydescription
			if 'productioncompanyid' in params and params['productioncompanyid'] != None:
				new_productioncompany = ProductionCompany.query.get(int(params['productioncompanyid']))
				new_productioncompanydescription = new_productioncompany.productioncompanydescription
			ActivityDetails.AddChange(old_productioncompanydescription, new_productioncompanydescription, activity.activityid, Constants.Field_Productioncompany)

			old_languagename1 = new_languagename1 = ""
			language1 = session.query(OutletLanguages).\
					      filter(OutletLanguages.outletid == outlet.outletid).\
			              filter(OutletLanguages.isprefered == 1).scalar()
			if language1:
				old_language = Languages.query.get(language1.languageid)
				old_languagename1 = old_language.languagename
			if 'language1id' in params and params['language1id'] != -1 and params['language1id'] != '-1' and params['language1id'] != '':
				new_language1 = Languages.query.get(int(params['language1id']))
				new_languagename1 = new_language1.languagename
			ActivityDetails.AddChange(old_languagename1, new_languagename1, activity.activityid, Constants.Field_Language1)

			old_languagename2 = new_languagename2 = ""
			language2 = session.query(OutletLanguages).\
					      filter(OutletLanguages.outletid == outlet.outletid).\
			              filter(OutletLanguages.isprefered == 0).scalar()
			if language2:
				old_language = Languages.query.get(language2.languageid)
				old_languagename2 = old_language.languagename
			if 'language2id' in params and params['language2id'] != -1 and params['language2id'] != '-1' and params['language2id'] != '':
				new_language2 = Languages.query.get(int(params['language2id']))
				new_languagename2 = new_language2.languagename
			ActivityDetails.AddChange(old_languagename2, new_languagename2, activity.activityid, Constants.Field_Language2)

			old_publishername = new_publishername = ""
			if outlet.publisherid:
				old_publisher = Publishers.query.get(outlet.publisherid)
				old_publishername = old_publisher.publishername
			if 'publisherid' in params and params['publisherid'] != None:
				new_publisher = Publishers.query.get(int(params['publisherid']))
				new_publishername = new_publisher.publishername
			ActivityDetails.AddChange(old_publishername, new_publishername, activity.activityid, Constants.Field_PublisherName)
			ActivityDetails.AddChange(profile.web_profile_link, params["web_profile_link"], activity.activityid, Constants.Field_Web_Profile)

			profile.editorialprofile = params['editorialprofile']
			profile.readership = params["readership"]
			profile.nrsreadership = params["nrsreadership"]
			profile.jicregreadership = params["jicregreadership"]
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
	def _fix_number(countryid, number):
		if countryid == 1:
			if number is not None and number.strip() != '' and not number.startswith('+44'):
				number = '+44 (0)%s' % number
		if countryid == 3 :
			if number is not None and number.strip() != '' and not number.startswith('+353'):
				number = '+353 (0)%s' % number
		return number

	@staticmethod
	def research_main_update(params):
		""" resarch system update the main part of a cotact record """
		transaction = BaseSql.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params['outletid'])
			if outlet.researchdetailid:
				researchdetails = ResearchDetails.query.get(outlet.researchdetailid)
			else:
				researchdetails = session.query(ResearchDetails).filter(ResearchDetails.outletid == params["outletid"]).scalar()
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)
			if 'tel' in params:
				params['tel'] = OutletGeneral._fix_number(params['countryid'], params['tel'])
			if 'fax' in params:
				params['fax'] = OutletGeneral._fix_number(params['countryid'], params['fax'])

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
			old_frequencyname = new_frequencyname = ""
			if outlet.frequencyid:
				old_frequency = Frequencies.query.get(outlet.frequencyid)
				old_frequencyname = old_frequency.frequencyname
			if 'frequencyid' in params and params['frequencyid'] != None:
				new_frequency = Frequencies.query.get(int(params['frequencyid']))
				new_frequencyname = new_frequency.frequencyname
			ActivityDetails.AddChange(old_frequencyname, new_frequencyname, activity.activityid, Constants.Field_Frequency)

			old_countryname = new_countryname = ""
			if outlet.countryid:
				old_country = Countries.query.get(outlet.countryid)
				old_countryname = old_country.countryname
			if 'countryid' in params and params['countryid'] != None:
				new_country = Countries.query.get(int(params['countryid']))
				new_countryname = new_country.countryname
			ActivityDetails.AddChange(old_countryname, new_countryname, activity.activityid, Constants.Field_CountryId)

			old_circulationsourcedescription = new_circulationsourcedescription = ""
			if outlet.circulationsourceid:
				old_circulationsource = CirculationSources.query.get(outlet.circulationsourceid)
				old_circulationsourcedescription = old_circulationsource.circulationsourcedescription
			if 'circulationsourceid' in params and params['circulationsourceid'] != None and params['circulationsourceid'] != '':
				new_circulationsource = CirculationSources.query.get(int(params['circulationsourceid']))
				new_circulationsourcedescription = new_circulationsource.circulationsourcedescription
			ActivityDetails.AddChange(old_circulationsourcedescription, new_circulationsourcedescription, activity.activityid, Constants.Field_Outlet_Circulation_Source)

			old_circulationauditdatedescription = new_circulationauditdatedescription = ""
			if outlet.circulationauditdateid:
				old_circulationauditdate = CirculationDates.query.get(outlet.circulationauditdateid)
				old_circulationauditdatedescription = old_circulationauditdate.circulationauditdatedescription
			if 'circulationauditdateid' in params and params['circulationauditdateid'] != None and params['circulationauditdateid'] != '':
				new_circulationauditdate = CirculationDates.query.get(int(params['circulationauditdateid']))
				new_circulationauditdatedescription = new_circulationauditdate.circulationauditdatedescription
			ActivityDetails.AddChange(old_circulationauditdatedescription, new_circulationauditdatedescription, activity.activityid, Constants.Field_Outlet_Circulation_Dates)

			old_websourcedescription = new_websourcedescription = ""
			if outlet.websourceid:
				old_websource = WebSources.query.get(outlet.websourceid)
				old_websourcedescription = old_websource.websourcedescription
			if 'websourceid' in params and params['websourceid'] != None:
				new_websource = WebSources.query.get(int(params['websourceid']))
				new_websourcedescription = new_websource.websourcedescription
			ActivityDetails.AddChange(old_websourcedescription, new_websourcedescription, activity.activityid, Constants.Field_Outlet_Web_Source)

			old_webauditdatedescription = new_webauditdatedescription = ""
			if outlet.webauditdateid:
				old_webdate = WebDates.query.get(outlet.webauditdateid)
				old_webauditdatedescription = old_webdate.webauditdatedescription
			if 'webauditdateid' in params and params['webauditdateid'] != None:
				new_webdate = WebDates.query.get(int(params['webauditdateid']))
				new_webauditdatedescription = new_webdate.webauditdatedescription
			ActivityDetails.AddChange(old_webauditdatedescription, new_webauditdatedescription, activity.activityid, Constants.Field_Outlet_Web_Dates)

			old_outletpricedescription = new_outletpricedescription = ""
			if outlet.outletpriceid:
				old_outletprice = OutletPrices.query.get(outlet.outletpriceid)
				old_outletpricedescription = old_outletprice.outletpricedescription
			if 'outletpriceid' in params and params['outletpriceid'] != None:
				new_outletprice = OutletPrices.query.get(int(params['outletpriceid']))
				new_outletpricedescription = new_outletprice.outletpricedescription
			ActivityDetails.AddChange(old_outletpricedescription, new_outletpricedescription, activity.activityid, Constants.Field_Cost)

			old_mediaaccesstypedescription = new_mediaaccesstypedescription = ""
			if outlet.mediaaccesstypeid:
				old_mediaaccesstype = MediaAccessTypes.query.get(outlet.mediaaccesstypeid)
				old_mediaaccesstypedescription = old_mediaaccesstype.mediaaccesstypedescription
			if 'mediaaccesstypeid' in params and params['mediaaccesstypeid'] != None:
				new_mediaaccesstype = MediaAccessTypes.query.get(int(params['mediaaccesstypeid']))
				new_mediaaccesstypedescription = new_mediaaccesstype.mediaaccesstypedescription
			ActivityDetails.AddChange(old_mediaaccesstype.mediaaccesstypedescription, new_mediaaccesstype.mediaaccesstypedescription, activity.activityid, Constants.Field_Media_Access_Types)

			ActivityDetails.AddChange(researchdetails.no_sync, params["no_sync"], activity.activityid, Constants.Field_Research_No_Sync)

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

			researchdetails.no_sync = params["no_sync"]

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

			old_prmax_outlettype = PRmaxOutletTypes.query.get(outlet.prmax_outlettypeid)
			new_prmax_outlettype = PRmaxOutletTypes.query.get(int(params['prmax_outlettypeid']))
			ActivityDetails.AddChange(old_prmax_outlettype.prmax_outlettypename, new_prmax_outlettype.prmax_outlettypename, activity.activityid, Constants.Field_Outlet_Type)

			outlet.prmax_outlettypeid = params['prmax_outlettypeid']

			profile = OutletProfile.query.get(outlet.outletid)
			if not profile:
				profile = OutletProfile(outletid=outlet.outletid)
				session.add(profile)

			# update parent record of groups if required
			OutletGeneral.update_parent(profile.seriesparentid, params.get("seriesparentid", None))
			OutletGeneral.update_parent(profile.supplementofid, params.get("supplementofid", None))

			old_seriesparentname = new_seriesparentname = ''
			if profile.seriesparentid:
				old_seriesparent = Outlet.query.get(profile.seriesparentid)
				old_seriesparentname = old_seriesparent.outletname
			if 'seriesparentid' in params:
				new_seriesparent = Outlet.query.get(int(params['seriesparentid']))
				new_seriesparentname = new_seriesparent.outletname
			ActivityDetails.AddChange(old_seriesparentname, new_seriesparentname, activity.activityid, Constants.Field_Series_Parent)

			old_supplementofname = new_supplementofname = ''
			if profile.supplementofid:
				old_supplementof = Outlet.query.get(profile.supplementofid)
				old_supplementofname = old_supplementof.outletname
			if 'supplementofid' in params:
				new_supplementof = Outlet.query.get(int(params['supplementofid']))
				new_supplementofname = new_supplementof.outletname
			ActivityDetails.AddChange(old_supplementofname, new_supplementofname, activity.activityid, Constants.Field_Supplement_Of)

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

	ListDataParents = """
		SELECT
		o.outletid,
	    o.outletid AS id,
		o.outletname
		FROM outlets AS o
	    LEFT OUTER JOIN outletprofile AS op ON op.outletid = o.outletid
	    WHERE op.seriesparentid is null"""

	ListDataParentsCount = """
		SELECT COUNT(*) FROM  outlets AS o
	    LEFT OUTER JOIN outletprofile AS op ON op.outletid = o.outletid
	    WHERE op.seriesparentid is null"""



	@staticmethod
	def get_research_only_parents_list(params):
		"""list for dropdown list"""

		whereused = BaseSql.addclause(" ", "o.customerid = -1 AND o.sourcetypeid IN(1,2)")
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
									'o.outletid',
									'outletname',
									OutletGeneral.ListDataParents + whereused + BaseSql.Standard_View_Order,
									OutletGeneral.ListDataParentsCount + whereused,
									Outlet)


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
	def get_research_deleted_list(params):
		"""list for dropdown list"""

		whereused = ""
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

			old_prmax_outlettype = PRmaxOutletTypes.query.get(outlet.prmax_outlettypeid)
			new_prmax_outlettype = PRmaxOutletTypes.query.get(int(params['prmax_outlettypeid']))
			ActivityDetails.AddChange(old_prmax_outlettype.prmax_outlettypename, new_prmax_outlettype.prmax_outlettypename, activity.activityid, Constants.Field_Outlet_Type)

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
