# -*- coding: utf-8 -*-
"""Outlet interface """
#-----------------------------------------------------------------------------
# Name:        md_Outlet.py
# Purpose:    To handle the access to the Outlet object in it's most general
#			sence
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import logging
from types import StringTypes
from datetime import datetime
from sqlalchemy import Table, Integer, Column
from sqlalchemy.sql import text
from turbogears.database import  metadata, mapper, session
from ttl.tg.errorhandlers import SecurityException
import prcommon.Constants as Constants
from prcommon.model.common import BaseSql
from prcommon.model.caching import CacheControl
from prcommon.model.communications import Communication, Address
from prcommon.model.contact import Contact
from prcommon.model.outletprofile import  OutletProfile
from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.outletlanguages import OutletLanguages
from prcommon.model.employee import Employee, EmployeeInterests, EmployeeInterestView, EmployeePrmaxRole
from prcommon.model.interests import OutletInterestView, Interests
from prcommon.model.indexer import IndexerQueue, StandardIndexerInternal
from prcommon.model.searchsession import SearchSession
from prcommon.model.lookups import PRmaxOutletTypes, Countries
from prcommon.model.research import IgnorePrnOutlets, Activity, ActivityDetails, \
     ResearchControRecord, ResearchDetails
from prcommon.lib.caching import Invalidate_Cache_Object_Research
from prcommon.model.list import ListMembers
from prcommon.model.queues import ProcessQueue
from prcommon.model.geographical import Geographical
from prcommon.model.deletionhistory import DeletionHistory
LOGGER = logging.getLogger("prmax.model")

class OutletCoverage(BaseSql):
	""" Outlet Coverage Record """

	@classmethod
	def moveCoverage(cls, params):
		""" move the coverage from one area to another
		take control of record ect
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			cls.sqlExecuteCommand(
			    """UPDATE internal.research_control_record
			    SET coverage_by_prmax = true
			    WHERE objecttypeid = 1 AND objectid in ( select outletid from outletcoverage where geographicalid = :fromgeographicalid ) ;

			    INSERT INTO outletcoverage(outletid,geographicalid,customerid)
			    	SELECT  sc.outletid,:togeographicalid,sc.customerid from outletcoverage AS sc
			        LEFT OUTER JOIN outletcoverage AS dc ON dc.geographicalid = :togeographicalid AND sc.outletid = dc.outletid
			        where sc.geographicalid = :fromgeographicalid AND dc.outletcoverageid IS NULL;

			    DELETE FROM outletcoverage WHERE geographicalid = :fromgeographicalid""", params)

			transaction.commit()
			return "OK"
		except:
			LOGGER.exception("Geographical move coverage")
			transaction.rollback()
			raise


class OutletCoverageView(BaseSql):
	""" view record for customer outlet details"""

	ListData = """SELECT ov.outletid,o.outletname
		FROM outletcoverage_view AS ov
	    JOIN outlets AS o ON o.outletid = ov.outletid
	    WHERE
	    	ov.geographicalid = :geographicalid
	    ORDER BY  %s %s LIMIT :limit  OFFSET :offset """
	ListDataCount = """SELECT COUNT(*) FROM outletcoverage_view
				WHERE geographicalid = :geographicalid"""

	@classmethod
	def getGridPageByArea(cls, params):
		""" Data from geographical area coverage"""

		if not params.get("geographicalid", None):
			params["geographicalid"] = -1

		return BaseSql.getGridPage(
			params,
			'outletname',
			'outletid',
			OutletCoverageView.ListData,
			OutletCoverageView.ListDataCount,
			cls)

	@classmethod
	def get_rest_list(cls, params):
		"""get result as rest """

		single = True if "outletid" in params else False

		return cls.grid_to_rest(cls.getGridPageByArea(params),
		                          params['offset'],
		                          single)


class OutletInterests(BaseSql):
	""" Class for outlet internes list """

	@classmethod
	def delete(cls, params):
		""" Delete an outlet interest record by ouletid/interestid"""
		transaction = cls.sa_get_active_transaction()
		try:
			for item in session.query(OutletInterests).filter_by(
			    outletid=params["outletid"],
			    interestid=params["interestid"]):
				session.delete(item)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("OutletInterests_delete")
			transaction.rollback()
			raise

	@classmethod
	def get_list(cls, outletid):

		outletinterests = session.query(OutletInterests).\
		    filter(OutletInterests.outletid == outletid).all()
		return outletinterests

class Outlet(BaseSql):
	"""Outlet class
	"""
	Live = 1
	InActive = 2
	Awaiting_Deletion = 3

	@staticmethod
	def getContactId(params):
		""" return the contact id """
		if params.get("contacttype", "") == "N":
			contactid = None
		else:
			contactid = params.get('contactid', None)
		if type(contactid) in StringTypes:
			contactid = int(contactid)
		return contactid


	@classmethod
	def add(cls, params):
		""" Add a outlet """
		outletid = 0
		outletsearchtypeid = PRmaxOutletTypes.query.get(params["outlettypeid"]).outletsearchtypeid
		if not params.has_key("prmax_outlettypeid"):
			params["prmax_outlettypeid"] = params["outlettypeid"]

		transaction = session.begin(subtransactions=True)
		try:
			# add primary contact
			p_com = Communication(tel=params['contact_tel'],
			                      email=params['contact_email'],
			                      fax=params['contact_fax'],
			                      mobile=params['contact_mobile'],
			                      twitter=params['contact_twitter'],
			                      facebook=params['contact_facebook'],
			                      linkedin=params['contact_linkedin'],
			                      instagram=params['contact_instagram'],
			                      webphone="")
			session.add(p_com)
			# add outlet
			address = Address(address1=params['address1'],
			                  address2=params['address2'],
			                  county=params['county'],
			                  postcode=params['postcode'],
			                  townname=params['townname'],
			                  addresstypeid=Address.editorialAddress)
			session.add(address)
			session.flush()
			com = Communication(addressid=address.addressid,
			                    tel=params['outlet_tel'],
			                    email=params['outlet_email'],
			                    fax=params['outlet_fax'],
			                    mobile="",
			                    webphone="",
			                    twitter=params['outlet_twitter'],
			                    facebook=params['outlet_facebook'],
			                    instagram=params['outlet_instagram'],
			                    linkedin=params['outlet_linkedin'])

			session.add(com)
			session.flush()
			out = Outlet(outletname=params["outletname"],
						 sortname=params["outletname"],
						 addressid=address.addressid,
						 communicationid=com.communicationid,
						 customerid=params['customerid'],
						 outlettypeid=Constants.Outlet_Type_Standard,
						 prmax_outlettypeid=params["prmax_outlettypeid"],
			             circulation=params['outlet_circulation'],
			             webbrowsers=params.get('outlet_webbrowsers', None),
						 frequencyid=params['frequencyid'],
						 profile=params['outlet_profile'],
						 www=params["outlet_www"],
						 statusid=Outlet.Live,
						 userid=params["userid"],
						 outletsearchtypeid=outletsearchtypeid,
			             sourcetypeid=params["sourcetypeid"],
			             countryid=params["countryid"]
						 )
			session.add(out)
			session.flush()
			# add primary contact

			# get primary contact  id
			contactid = None
			if params["familyname"]:
				contactid = Contact.find(params)
				if not contactid:
					contactid = Contact.addprivate(params)
			elif "contactid" in params:
				contactid = params["contactid"]

			empl = Employee(
				outletid=out.outletid,
				contactid=contactid,
				isprimary=1,
				job_title=params['contact_jobtitle'],
				customerid=params['customerid'],
				communicationid=p_com.communicationid,
				userid=params["userid"],
			    sourcetypeid=params["sourcetypeid"])

			session.add(empl)
			session.flush()

			# employee interests
			for interestid in params['contact_interest'] if params['contact_interest'] else []:
				interest = EmployeeInterests(employeeid=empl.employeeid,
								             interestid=interestid,
								             customerid=params['customerid'])
				session.add(interest)
			session.flush()

			# outlet interest
			out.primaryemployeeid = empl.employeeid
			for interestid in params['outlet_interest'] if params['outlet_interest'] else []:
				interest = OutletInterests(outletid=out.outletid,
								           interestid=interestid,
								           customerid=params['customerid'])
				session.add(interest)
			session.flush()
			for geographicalid in params['geographicalid'] if params.has_key('geographicalid') else []:
				out = OutletCoverage(outletid=out.outletid,
								    geographicalid=geographicalid)
				session.add(out)
			session.flush()

			# coverage
			transaction.commit()
			outletid = out.outletid
		except:
			LOGGER.exception("outlet_add")
			transaction.rollback()
			raise
		return outletid

	@classmethod
	def update(cls, params):
		""" update a private outlet """

		transaction = session.begin(subtransactions=True)
		try:
			outlet = Outlet.query.get(params['outletid'])
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)
			p_employee = Employee.query.get(outlet.primaryemployeeid)
			p_com = Communication.query.get(p_employee.communicationid)

			# outlet
			outlet.outletname = params['outletname']
			outlet.www = params['outlet_www']
			outlet.circulation = params['outlet_circulation']
			outlet.webbrowsers = params.get('outlet_webbrowsers', None)
			outlet.profile = params['outlet_profile']
			outlet.frequencyid = params['frequencyid']
			outlet.prmax_outlettypeid = params["outlettypeid"]
			outlet.countryid = params["countryid"]

			outlet.userid = params["userid"]
			session.flush()

			# communications
			comm.tel = params['outlet_tel']
			comm.email = params['outlet_email']
			comm.fax = params['outlet_fax']
			comm.twitter = params['outlet_twitter']
			comm.facebook = params['outlet_facebook']
			comm.linkedin = params['outlet_linkedin']
			comm.instagram = params['outlet_instagram']

			address.address1 = params['address1']
			address.address2 = params['address2']
			address.county = params['county']
			address.postcode = params['postcode']
			address.townname = params['townname']
			session.flush()

			# primary contact
			# handle index chnages
			contactid = p_employee.contactid
			familyname = ""
			if p_employee.contactid:
				contact = Contact.query.get(p_employee.contactid)
				if contact:
					familyname = contact.familyname

			if params["familyname"] != familyname:
				if params["familyname"]:
					contactid = Contact.addprivate(params)
				else:
					contactid = None
					p_employee.contactid = contactid
					IndexerQueue.IndexFreelanceContact(params['customerid'],
					                                   familyname,
					                                   params["familyname"],
					                                   outlet.primaryemployeeid)

			p_employee.job_title = params['contact_jobtitle']
			# communications
			p_com.tel = params['contact_tel']
			p_com.email = params['contact_email']
			p_com.fax = params['contact_fax']
			p_com.mobile = params['contact_mobile']
			p_com.twitter = params['contact_twitter']
			p_com.facebook = params['contact_facebook']
			p_com.linkedin = params['contact_linkedin']
			p_com.instagram = params['contact_instagram']

			CacheControl.Invalidate_Cache_Object_Research(outlet.primaryemployeeid, Constants.Cache_Employee_Objects)

			# interests
			# employee interest
			dbinterest = session.query(EmployeeInterests).filter_by(
				employeeid=outlet.primaryemployeeid)
			dbinterest2 = []
			interests = params['contact_interest'] if params['contact_interest'] else []
			# do deletes
			for employeeinterest in dbinterest:
				dbinterest2.append(employeeinterest.interestid)
				if not employeeinterest.interestid in interests:
					session.delete(employeeinterest)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = EmployeeInterests(
						employeeid=outlet.primaryemployeeid,
						interestid=interestid,
						customerid=params['customerid'])
					session.add(interest)

			# outlet interest
			dbinterest = session.query(OutletInterests).filter_by(
				outletid=outlet.outletid)
			dbinterest2 = []
			interests = params['outlet_interest'] if params['outlet_interest'] else []
			# do deletes
			for outletinterest in dbinterest:
				dbinterest2.append(outletinterest.interestid)
				if not outletinterest.interestid in interests:
					session.delete(outletinterest)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = OutletInterests(
						outletid=outlet.outletid,
						interestid=interestid,
						customerid=params['customerid'])
					session.add(interest)

			session.flush()

			transaction.commit()
		except:
			LOGGER.exception("outlet_save")
			transaction.rollback()
			raise

	@classmethod
	def do_outlet_interests(cls, outlet, activity, params):
		"""Update the outlet interest """
		# interest changed
		if outlet.prmax_outlettypeid == 42:
			dbinterest = session.query(EmployeeInterests).filter_by(
				employeeid=outlet.primaryemployeeid)
		else:
			dbinterest = session.query(OutletInterests).filter_by(
				outletid=outlet.outletid)
		dbinterest2 = []
		interests = params['interests'] if params['interests'] else []
		# do deletes
		for outletinterest in dbinterest:
			dbinterest2.append(outletinterest.interestid)
			if not outletinterest.interestid in interests:
				del_interest = Interests.query.get(outletinterest.interestid)
				ActivityDetails.AddDelete(del_interest.interestname, activity.activityid, Constants.Field_Interest)
				session.delete(outletinterest)
		# do adds
		for interestid in interests:
			if not interestid in dbinterest2:
				if outlet.prmax_outlettypeid == 42: #if it is freelancer add the keywords to outlet's primary employee
					interest = EmployeeInterests(
					    employeeid=outlet.primaryemployeeid,
						interestid=interestid)
					add_interest = Interests.query.get(interestid)
					ActivityDetails.AddAdd(add_interest.interestname, activity.activityid, Constants.Field_Interest)
				else:
					interest = OutletInterests(
					    outletid=outlet.outletid,
					    interestid=interestid)
					add_interest = Interests.query.get(interestid)
					ActivityDetails.AddAdd(add_interest.interestname, activity.activityid, Constants.Field_Interest)
				session.add(interest)

	@classmethod
	def do_outlet_coverage(cls, outlet, activity, params):
		"""Update the outlet interest """

		# coverage
		dbcoverage = session.query(OutletCoverage).filter_by(
				outletid=outlet.outletid)
		dbcoverage2 = []
		coverage = params['coverage'] if params['coverage'] else []
		for outletcoverage in dbcoverage:
			dbcoverage2.append(outletcoverage.geographicalid)
			if not outletcoverage.geographicalid in coverage:
				del_geo = Geographical.query.get(outletcoverage.geographicalid)
				ActivityDetails.AddDelete(del_geo.geographicalname, activity.activityid, Constants.Field_Outlet_Coverage)
				session.delete(outletcoverage)
		# do adds
		for geographicalid in coverage:
			if not geographicalid in dbcoverage2:
				geog = OutletCoverage(
					outletid=outlet.outletid,
				    geographicalid=geographicalid)
				add_geo = Geographical.query.get(geog.geographicalid)
				ActivityDetails.AddAdd(add_geo.geographicalname, activity.activityid, Constants.Field_Outlet_Coverage)
				session.add(geog)

	@classmethod
	def research_update_media(cls, params):
		""" update social media only """
		transaction = cls.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params['outletid'])
			comm = Communication.query.get(outlet.communicationid)
			# add the audit trail header record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                reason=params["reason"],
			                objecttypeid=Constants.Object_Type_Outlet,
			                objectid=outlet.outletid,
			                actiontypeid=Constants.Research_Reason_Update,
			                userid=params['userid'],
			                parentobjectid=outlet.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet
			                )
			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)
			comm.facebook = params['facebook']
			comm.twitter = params['twitter']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']

			Invalidate_Cache_Object_Research(cls, params["outletid"], Constants.Cache_Outlet_Objects)

			transaction.commit()
		except:
			LOGGER.exception("research_update_media")
			transaction.rollback()
			raise

	@classmethod
	def research_update_prn(cls, params):
		""" Update type put dont' take over """

		transaction = cls.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params['outletid'])

			# add the audit trail header record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                reason=params["reason"],
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

			cls.do_outlet_coverage(outlet, activity, params)
			cls.do_outlet_interests(outlet, activity, params)

			transaction.commit()
		except:
			LOGGER.exception("research_update_prn")
			transaction.rollback()
			raise

	@classmethod
	def research_profile_update(cls, params):
		""" Update the  outlet profile  """
		transaction = cls.sa_get_active_transaction()
		try:
			outlet = Outlet.query.get(params['outletid'])
			# add the audit trail header record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
		                    reason=params["reason"],
		                    objecttypeid=Constants.Object_Type_Outlet,
		                    objectid=outlet.outletid,
		                    actiontypeid=Constants.Research_Reason_Update,
		                    userid=params['userid'],
		                    parentobjectid=outlet.outletid,
		                    parentobjecttypeid=Constants.Object_Type_Outlet
		                    )
			session.add(activity)
			session.flush()
			# if prn add ignore record
			if outlet.sourcetypeid == Constants.Research_Source_Prn:
				session.add(IgnorePrnOutlets(
			        outletname=outlet.outletname,
			        prn_key=outlet.prn_key))

			# set source to us
			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			ActivityDetails.AddChange(outlet.profile, params['profile'], activity.activityid, Constants.Field_Profile)
			outlet.profile = params["profile"]

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(cls, params["outletid"], Constants.Cache_Search_Outlet_Profile)

			transaction.commit()
		except:
			LOGGER.exception("research_profile_update")
			transaction.rollback()
			raise

	@classmethod
	def research_set_primary(cls, params):
		""" Override the primary contact """
		try:
			transaction = cls.sa_get_active_transaction()
			employee = Employee.query.get(params['employeeid'])
			outlet = Outlet.query.get(employee.outletid)
			if outlet.primaryemployeeid != employee.employeeid:
				control = ResearchControRecord.query.filter_by(objecttypeid=Constants.Object_Type_Outlet,
				                                              objectid=outlet.outletid).first()

				primaryemployee = Employee.query.get(outlet.primaryemployeeid)

				# add the audit trail header record
				activity = Activity(reasoncodeid=params["reasoncodeid"],
				                #reason=params["reason"],
				                objecttypeid=Constants.Object_Type_Outlet,
				                objectid=outlet.outletid,
				                actiontypeid=Constants.Research_Reason_Update,
				                userid=params['userid'],
				                parentobjectid=outlet.outletid,
				                parentobjecttypeid=Constants.Object_Type_Outlet
				                )

				session.add(activity)
				session.flush()
				old_primaryempoyee = session.query(Contact).\
				    join(Employee, Employee.contactid == Contact.contactid).\
				    filter(Employee.employeeid == outlet.primaryemployeeid).scalar()
				new_primaryempoyee = session.query(Contact).\
				    join(Employee, Employee.contactid == Contact.contactid).\
				    filter(Employee.employeeid == employee.employeeid).scalar()

				ActivityDetails.AddChange(old_primaryempoyee.getName(), new_primaryempoyee.getName(), activity.activityid, Constants.Field_Primary_Contact)
				control.primary_contact_by_prmax = True
				primaryemployee.isprimary = 0
				employee.isprimary = 1
				outlet.primaryemployeeid = employee.employeeid

				# clear out the cache across all customers
				Invalidate_Cache_Object_Research(cls, outlet.outletid, Constants.Cache_Outlet_Objects)

			transaction.commit()
		except:
			LOGGER.exception("research_main_update")
			transaction.rollback()
			raise

	@staticmethod
	def _fix_number(countryid, number):
		if countryid == 1:
			if number is not None and number.strip() != '' and not number.startswith('+44'):
				number = '+44 (0)%s' % number
		if countryid == 3:
			if number is not None and number.strip() != '' and not number.startswith('+353'):
				number = '+353 (0)%s' % number
		return number

	@classmethod
	def research_main_add(cls, params):
		""" Add a outlet for the research system """

		transaction = cls.sa_get_active_transaction()
		outletsearchtypeid = PRmaxOutletTypes.query.get(params["prmax_outlettypeid"]).outletsearchtypeid

		try:
			# add outlet
			address = Address(address1=params.get('address1', None),
						address2=params.get('address2', None),
						county=params.get('county', None),
						postcode=params.get('postcode', None),
						townname=params.get('townname', None),
						addresstypeid=Address.editorialAddress)
			session.add(address)
			session.flush()

			if 'countryid' in params and params['countryid'] != None:
				if 'tel' in params:
					params['tel'] = Outlet._fix_number(params['countryid'], params['tel'])
				if 'fax' in params:
					params['fax'] = Outlet._fix_number(params['countryid'], params['fax'])
			com = Communication(addressid=address.addressid,
			                    tel=params.get('tel', None),
			                    email=params.get('email', None),
			                    fax=params.get('fax', None),
			                    mobile="",
			                    webphone="",
			                    twitter=params.get('twitter', None),
			                    linkedin=params.get('linkedin', None),
			                    instagram=params.get('instagram', None),
			                    facebook=params.get('facebook', None))
			session.add(com)
			session.flush()
			out = Outlet(outletname=params["outletname"],
						 sortname=params.get("sortname", params["outletname"].upper()),
						 addressid=address.addressid,
						 communicationid=com.communicationid,
						 outlettypeid=Constants.Outlet_Type_Standard,
						 prmax_outlettypeid=params["prmax_outlettypeid"],
			             circulation=params.get('circulation', None),
			             webbrowsers=params.get('webbrowsers', None),
						 frequencyid=params.get('frequencyid', None),
						 profile=params.get('profile', None),
						 www=params.get('www', None),
						 statusid=Outlet.Live,
						 userid=params["userid"],
			             outletsearchtypeid=outletsearchtypeid,
			             sourcetypeid=Constants.Research_Source_Prmax,
			             countryid=params["countryid"])
			session.add(out)
			session.flush()
			# add  context record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                    reason=params.get('reason', None),
			                    objecttypeid=Constants.Object_Type_Outlet,
			                    objectid=out.outletid,
			                    actiontypeid=Constants.Research_Record_Add,
			                    userid=params['userid'],
			                    parentobjectid=out.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Outlet
			                    )
			session.add(activity)
			# add primary contact
			p_com = Communication(tel=None,
			                      email=None,
			                      fax=None,
			                      mobile=None,
			                      webphone="")
			session.add(p_com)
			session.flush()

			contactid = Outlet.getContactId(params)
			empl = Employee(
				outletid=out.outletid,
				contactid=contactid,
				isprimary=1,
				job_title=params['jobtitle'],
				communicationid=p_com.communicationid,
				userid=params["userid"])

			session.add(empl)
			session.flush()
			out.primaryemployeeid = empl.employeeid
			# outlet interest
			if 'interests' in params:
				for interestid in params['interests'] if params['interests'] else []:
					interest = OutletInterests(outletid=out.outletid,
						                       interestid=interestid)
					session.add(interest)
			# coverage
			if 'coverage' in params:
				for geographicalid in params['coverage'] if params['coverage'] else []:
					geog = OutletCoverage(outletid=out.outletid,
						                  geographicalid=geographicalid)
					session.add(geog)

			# add research control record
			outlettype = PRmaxOutletTypes.query.get(params["prmax_outlettypeid"])
			session.add(ResearchDetails(outletid=out.outletid,
			                            researchfrequencyid=outlettype.researchfrequencyid))

			transaction.commit()
			return out.outletid
		except:
			LOGGER.exception("research_outlet_add")
			transaction.rollback()
			raise
		return None


	@classmethod
	def update_prmax_settings(cls, params):
		""" Update the prn fields that prmax overrides"""
		transaction = cls.sa_get_active_transaction()

		try:
			outlet = Outlet.query.get(params['outletid'])
			outlet.prmax_outletsearchtypeid = params["prmax_outletsearchtypeid"]
			outlet.outletsearchtypeid = params["prmax_outletsearchtypeid"]
			session.flush()

			transaction.commit()
		except:
			LOGGER.exception("update_prmax_settings")
			transaction.rollback()
			raise

	Delete_Outlet = "SELECT outlet_delete(:outletid)"

	@classmethod
	def delete(cls, params):
		""" Delete a specific outlet"""
		transaction = session.begin(subtransactions=True)
		try:
			# outlet
			outlet = Outlet.query.get(params['outletid'])
			if outlet.customerid != params['customerid']:
				raise SecurityException("")

			session.execute(text(Outlet.Delete_Outlet), params, cls)

			transaction.commit()
		except:
			LOGGER.exception("outlet_delete")
			transaction.rollback()
			raise

	@classmethod
	def research_delete(cls, params):
		""" Delete a specific outlet"""

		transaction = cls.sa_get_active_transaction()

		try:
			# outlet
			outlet = Outlet.query.get(params['outletid'])

			if "reasoncodeid" not in params:
				params['reasoncodeid'] = 28

			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                    reason=params.get("reason", ""),
			                    objecttypeid=Constants.Object_Type_Outlet,
			                    objectid=outlet.outletid,
			                    actiontypeid=Constants.Research_Reason_Delete,
			                    userid=params['userid'],
			                    parentobjectid=outlet.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Outlet,
			                    name=outlet.outletname
			                    )
			session.add(activity)

			deletionhistory = DeletionHistory(objectid=outlet.outletid,
			                                  outlet_name=outlet.outletname,
			                                  domain=outlet.www,
			                                  reasoncodeid=29, #Outlet request to remove
			                                  deletionhistorytypeid=2 if outlet.prmax_outlettypeid == 42 else 1, #1=Outlet, 2=Freelancer
			                                  userid=params['userid']
			                                  )
			session.add(deletionhistory)

			# get profile and then re-build parent profile
			profile = OutletProfile.query.get(outlet.outletid)
			if profile and profile.seriesparentid:
				session.add(ProcessQueue(
					objecttypeid=Constants.Process_Outlet_Profile,
					objectid=profile.seriesparentid))


			session.execute(text(Outlet.Delete_Outlet), params, cls)

			print "completed"

			transaction.commit()
		except:
			LOGGER.exception("research_outlet_delete")
			transaction.rollback()
			raise


	@classmethod
	def getForEdit(cls, outletid, customerid):
		""" get the details of a private outlet for editing """

		# outlet details
		outlet = Outlet.query.get(outletid)
		communications = Communication.query.get(outlet.communicationid)
		address = Address.query.get(communications.addressid)
		interests = session.query(OutletInterestView).filter_by(
			outletid=outletid,
			interesttypeid=Constants.Interest_Type_Standard).all()
		coverage = session.query(OutletCoverageView).filter_by(
			outletid=outletid).all()

		profile = OutletProfile.get_for_research_edit(outletid)

		# primary contact
		employee = Employee.query.get(outlet.primaryemployeeid)
		contact = Contact.getContactForEdit(employee.contactid)

		interests2 = session.query(EmployeeInterestView).filter_by(
			employeeid=outlet.primaryemployeeid).all()
		if employee.communicationid:
			communications2 = Communication.query.get(employee.communicationid)
			if communications2.addressid:
				address2 = Address.query.get(communications2.addressid)
			else:
				address2 = None
		else:
			communications2 = None
			address2 = None

		# langauges
		language1id = None
		language2id = None
		for row in session.query(OutletLanguages).\
		    filter(OutletLanguages.outletid == outlet.outletid).all():
			if row.isprefered:
				language1id = row.languageid
			else:
				if language2id is None:
					language2id = row.languageid
				elif language1id is  None:
					language1id = row.languageid

		serieschildren = [child for child in session.query(Outlet).\
		                  join(OutletProfile, Outlet.outletid == OutletProfile.outletid).\
		                  filter(OutletProfile.seriesparentid == outlet.outletid).all()]
		if outlet.researchdetailid:
			researchdetails = ResearchDetails.query.get(outlet.researchdetailid)
		else:
			researchdetails = session.query(ResearchDetails).filter(ResearchDetails.outletid == outlet.outletid).scalar()
			if researchdetails:
				outlet.researchdetailid = researchdetails.researchdetailid

		outletdesks = [outletdeskid for outletdeskid in session.query(OutletDesk.outletdeskid).filter(OutletDesk.outletid == outlet.outletid).all()]

		return dict(
		    outlet=dict(outlet=outlet,
		                outletdesks=outletdesks,
		                languages=dict(
		                    language1id=language1id,
		                    language2id=language2id
		                    ),
		                profile=profile,
		                communications=communications,
		                address=address,
		                coverage=coverage,
		                interests=dict(data=interests),
		                supplements=[dict(outletname=row[1].outletname, outletid=row[1].outletid) for row in session.query(OutletProfile, Outlet).\
		                                join(Outlet, Outlet.outletid == OutletProfile.outletid).\
		                                filter(OutletProfile.supplementofid == outlet.outletid).all()],
		                editions=[dict(outletname=row[1].outletname, outletid=row[1].outletid) for row in  session.query(OutletProfile, Outlet).\
		                             join(Outlet, Outlet.outletid == OutletProfile.outletid).\
		                             filter(OutletProfile.editionofid == outlet.outletid).all()],
		                serieschildren=serieschildren,
		                researchdetails=researchdetails
		                ),
		  primary=dict(employee=employee,
		               communications=communications2,
		               address=address2,
		               contact=contact,
		               interests=dict(data=interests2)))

	@classmethod
	def getBasicDetails(cls, params):
		""" get the very basic details for an outlet """
		outlet = Outlet.query.get(params['outletid'])
		comm = Communication.query.get(outlet.communicationid)
		employee = Employee.query.get(outlet.primaryemployeeid)
		if employee.contactid:
			contactname = Contact.query.get(employee.contactid).getName()
		else:
			contactname = ""

		return dict(outlet=dict(outletid=outlet.outletid,
		                        outletname=outlet.outletname),
				    comm=dict(tel=comm.tel,
		                      fax=comm.fax),
		            employee=dict(job_title=employee.job_title,
		                        contactname=contactname),
		            search=SearchSession.outlet_where_used(params))

	@classmethod
	def getOverrides(cls, outletid, customerid):
		""" get the customer override for an outlet"""
		# get outlet details
		outlet = session.query(OutletCustomerView).filter_by(
			outletid=outletid, customerid=customerid).all()
		if outlet:
			outlet = outlet[0]
		else:
			outlet = None
		interests = session.query(OutletInterestView).filter_by(
			outletid=outletid,
			interesttypeid=Constants.Interest_Type_Tag).all()
		return dict(data=dict(outlet=outlet,
		                    interests=interests))

	@classmethod
	def saveOverrides(cls, outletid, customerid, params):
		""" Save the details of the custoemr overrides of an outlet"""
		# get outlet details
		# check to see if override primary id is same as actual primary id if it is
		# then set override to None
		stdoutlet = Outlet.query.get(outletid)
		if not stdoutlet.outlettypeid in Constants.Outlet_Is_Individual:
			primaryemployeeid = params['primaryemployeeid'] if params.get('primaryemployeeid', '-1') != '-1' else None
			if primaryemployeeid == '':
				primaryemployeeid = None
			if primaryemployeeid:
				if stdoutlet.primaryemployeeid == primaryemployeeid:
					primaryemployeeid = None
		else:
			primaryemployeeid = None

		transaction = session.begin(subtransactions=True)
		try:
			outlet = session.query(OutletCustomer).filter_by(
				outletid=outletid, customerid=customerid).all()
			if outlet:
				outlet = outlet[0]
				outlet.profile = params['profile']
				outlet.changed = datetime.now()

				if not stdoutlet.outlettypeid in Constants.Outlet_Is_Individual:
					outlet.primaryemployeeid = primaryemployeeid
				# update all record
				if 'tel' in params:
					params['tel'] = Outlet._fix_number(outlet.countryid, params['tel'])
				if 'fax' in params:
					params['fax'] = Outlet._fix_number(outlet.countryid, params['fax'])
				comm = Communication.query.get(outlet.communicationid)
				comm.tel = params['tel']
				comm.email = params['email']
				comm.fax = params['fax']

				addr = Address.query.get(comm.addressid)
				# empty address needs to be null
				addr.address1 = params['address1'] if len(params['address1']) else None
				addr.address2 = params['address2']
				addr.county = params['county']
				addr.postcode = params['postcode']
				addr.townname = params['townname']
			else:
				# add address
				addr = Address(
					address1=params['address1'] if len(params['address1']) else None,
					address2=params['address2'],
					county=params['county'],
					postcode=params['postcode'],
					townname=params['townname'],
					addresstypeid=Address.editorialAddress)
				session.add(addr)
				session.flush()

				if 'tel' in params:
					params['tel'] = Outlet._fix_number(addr.countryid, params['tel'])
				if 'fax' in params:
					params['fax'] = Outlet._fix_number(addr.countryid, params['fax'])

				comm = Communication(addressid=addr.addressid,
				                     tel=params['tel'],
				                     email=params['email'],
				                     fax=params['fax'],
				                     mobile="",
				                     webphone="")
				session.add(comm)
				session.flush()
				outletcust = OutletCustomer(profile=params['profile'],
								     outletid=outletid,
								     customerid=customerid,
								     communicationid=comm.communicationid,
								     primaryemployeeid=primaryemployeeid)
				session.add(outletcust)
			# Handle  tags
			# interests
			dbinterest = session.query(OutletInterestView).filter_by(
				outletid=outletid,
				interesttypeid=Constants.Interest_Type_Tag)
			dbinterest2 = []
			interests = params['interests'] if params['interests'] else []
			# do deletes
			for outletinterest in dbinterest:
				dbinterest2.append(outletinterest.interestid)
				if not outletinterest.interestid in interests:
					# need to get
					out = OutletInterests.query.get(outletinterest.outletinterestid)
					session.delete(out)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = OutletInterests(
						outletid=outletid,
						interestid=interestid,
						customerid=params['customerid'],
						interesttypeid=Constants.Interest_Type_Tag)
					session.add(interest)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("outlet_saveOverrides")
			transaction.rollback()
			raise
		return  dict(success="OK", errorMessage="")

	__SplitFields = ("GENERAL DETAILS", "Cost:",
						   "READERSHIP/AUDIENCE PROFILE",
	             "LISTENERS/AUDIENCE",
	             "AUDIENCE/CIRCULATION",
	             "EDITORIAL PROFILE",
						   "SERIES TITLES")

	def getProfileAsList(self):
		""" getProfileList """
		profile = self.profile
		if profile:
			profile = profile.replace("\n", "<br/>")
		data = []
		for field in Outlet.__SplitFields:
			offset = profile.find(field)
			if offset != -1:
				data.append([offset, offset + len(field), "", field])
		data.sort()

		for row in data:
			# check is end
			if row == data[-1]:
				# is end
				row[2] = profile[row[1]:]
			else:
				endrow = data[data.index(row)+1]
				row[2] = profile[row[1]:endrow[0]]
			#fix up profile
			if row[2].startswith('<br/>') and len(row[2]) > 5:
				row[2] = row[2][5:]

		data = [(row[2].strip(), row[3]) for row in data]
		if not data and profile:
			data.append((profile, "GENERAL"))

		return data


	@classmethod
	def research_outlet_is_child(cls, params):
		""" Check if an outlet is series member """

		parent = OutletProfile.query.get(params["outletid"])
#		parent = session.query(OutletProfile).filter(OultetProfile.outletid == params["outletid"]).scalar()
		is_child = False
		if parent and parent.seriesparentid != None:
			is_child = True
		return is_child

	@classmethod
	def research_move_contact(cls, params):
		""" This function moved a contact between outlets """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			employee = Employee.query.get(params["employeeid"])
			contact = Contact.query.get(employee.contactid)
			
			source_series = session.query(OutletProfile).filter(OutletProfile.seriesparentid == employee.outletid).all()
			destination_series = session.query(OutletProfile).filter(OutletProfile.seriesparentid == int(params['outletid'])).all()
			index_fields_employeeid = (
			  (Constants.freelance_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.mp_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.employee_contact_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.employee_prmaxoutlettypeid, 'prmax_outlettypeid', None, None),
			  (Constants.employee_contactfull_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.freelance_employeeid_countryid, 'countryid', None, None),
			  (Constants.employee_countryid, 'countryid', None, None),
			)
			index_fields_outletidid = (
			  (Constants.freelance_employee_outletid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.mp_employee_outletid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.employee_contact_outletid, 'familyname', StandardIndexerInternal.standardise_string, None),
			  (Constants.employee_outletid_countryid, 'countryid', None, None),
			)

			# roles
			index_fields_roles_employees = ((Constants.employee_job_role, 'prmaxroleid', None, None),)
			index_fields_roles_outlet = ((Constants.outlet_job_role, 'prmaxroleid', None, None),)

			#interests
			index_fields_interest_employee = ((Constants.employee_employeeid_interestid, 'interestid', None, None),)
			index_fields_interest_outlet = ((Constants.employee_outletid_interestid, 'interestid', None, None),)

			# need to delete from employee roles
			for role in session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all():
				indexer = StandardIndexerInternal(index_fields_roles_outlet, "outletid", (employee, role), Constants.index_Delete)
				indexer.run_indexer()
				indexer = StandardIndexerInternal(index_fields_roles_employees, "employeeid", (employee, role), Constants.index_Delete)
				indexer.run_indexer()

			# need to delete from employee keywords
			for interest in session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == employee.employeeid).all():
				indexer = StandardIndexerInternal(index_fields_interest_outlet, "outletid", (employee, interest), Constants.index_Delete)
				indexer.run_indexer()
				indexer = StandardIndexerInternal(index_fields_interest_employee, "employeeid", (employee, interest), Constants.index_Delete)
				indexer.run_indexer()

			# Do delete index
			indexer = StandardIndexerInternal(index_fields_outletidid, "outletid", (employee, contact), Constants.index_Delete)
			indexer.run_indexer()
			indexer = StandardIndexerInternal(index_fields_employeeid, "employeeid", (employee, contact), Constants.index_Delete)
			indexer.run_indexer()

			# setup address move the current outlet address to a new conntact address
			outlet = Outlet.query.get(employee.outletid)

			# this is moving the primary contact
			if outlet.primaryemployeeid == params["employeeid"]:
				is_primary_move = True
				tmp_emp = Employee(outletid=outlet.outletid,
				                    job_title="No  Contact",
				                    sourcetypeid=2,
				                    isprimary=1)
				session.add(tmp_emp)
				session.flush()
				outlet.primaryemployeeid = tmp_emp.employeeid
				employee.isprimary = 0
			else:
				is_primary_move = False


			# setup activity record
			activity = Activity(reasoncodeid=5,
			                reason="",
			                objecttypeid=Constants.Object_Type_Employee,
			                objectid=params["outletid"],
			                actiontypeid=Constants.Research_Reason_Move,
			                userid=params['userid'],
			                parentobjectid=params["outletid"],
			                parentobjecttypeid=Constants.Object_Type_Outlet
			                )
			session.add(activity)

			employee.sourcetypeid = Constants.Research_Source_Prmax
			employee.sourcekey = employee.employeeid
			employee.outletid = params["outletid"]
			if params["outletdeskid"] > 0:
				employee.outletdeskid = params["outletdeskid"]

			# now fixup lists move all entries in lists
			if is_primary_move:
				# no we need to delete the duplicates
				to_delete_list = []
				tmp_params = {"outletid": outlet.outletid, "employeeid": params["employeeid"],}
				for row in session.execute(text("""SELECT listid,COUNT(*) FROM userdata.listmembers WHERE ( outletid = :outletid AND employeeid IS NULL) OR ( outletid = :outletid AND employeeid = :employeeid ) GROUP BY listid HAVING COUNT(*) > 1"""), tmp_params, SearchSession).fetchall():
					tmp_params["listid"] = row[0]
					rows_delete = session.execute(text("""SELECT listmemberid FROM userdata.listmembers WHERE listid = :listid AND (( outletid = :outletid AND employeeid IS NULL) OR ( outletid = :outletid AND employeeid = :employeeid ))"""), tmp_params, SearchSession).fetchall()
					if rows_delete:
						# add all bar one row too the delete
						for row in rows_delete[:-1]:
							to_delete_list.append(row[0])

				# do delete
				session.query(ListMembers).\
				  filter(ListMembers.mapping.c.listmemberid.in_(to_delete_list)).delete(False)
				session.flush()
				# set all primary to emplyeeid
				session.query(ListMembers).\
								filter(ListMembers.outletid == outlet.outletid).\
								filter(ListMembers.employeeid == None).\
				        update({"employeeid" : params["employeeid"]})
				session.flush()

			# moves entries
			session.query(ListMembers).filter(ListMembers.employeeid == params["employeeid"]).\
			  update({"outletid" : params["outletid"]})

			# need to move the prmxroles to the new outlet as well
			session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == params["employeeid"]).\
			  update({"outletid" : params["outletid"]})

			session.flush()

			# force index
			indexer = StandardIndexerInternal(index_fields_outletidid, "outletid", (employee, contact), Constants.index_Add)
			indexer.run_indexer()
			indexer = StandardIndexerInternal(index_fields_employeeid, "employeeid", (employee, contact), Constants.index_Add)
			indexer.run_indexer()

			for role in session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all():
				indexer = StandardIndexerInternal(index_fields_roles_outlet, "outletid", (employee, role), Constants.index_Add)
				indexer.run_indexer()
				indexer = StandardIndexerInternal(index_fields_roles_employees, "employeeid", (employee, role), Constants.index_Add)
				indexer.run_indexer()

			for interest in session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == employee.employeeid).all():
				indexer = StandardIndexerInternal(index_fields_interest_outlet, "outletid", (employee, interest), Constants.index_Add)
				indexer.run_indexer()
				indexer = StandardIndexerInternal(index_fields_interest_employee, "employeeid", (employee, interest), Constants.index_Add)
				indexer.run_indexer()

			transaction.commit()
			
			return dict(source_series=True if len(source_series) > 0 else False, destination_series=True if len(destination_series) > 0 else False)
		except:
			LOGGER.exception("research_move_contact")
			transaction.rollback()
			raise

	@classmethod
	def research_copy_contact(cls, params):
		""" This function copy a contact to another outlet """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			#copy from
			employee = Employee.query.get(params["employeeid"])
			source_series = session.query(OutletProfile).filter(OutletProfile.seriesparentid == employee.outletid).all()
			destination_series = session.query(OutletProfile).filter(OutletProfile.seriesparentid == int(params['outletid'])).all()
			
			if employee.contactid:
				contact = Contact.query.get(employee.contactid)
			else:
				contact = None

			com = Communication.query.get(employee.communicationid)
			addr = None
			if com and com.addressid:
				addr = Address.query.get(com.addressid)

			#copy to
			outlet = Outlet.query.get(params['outletid'])

			# setup activity record
			activity = Activity(reasoncodeid=5,
			                reason="",
			                objecttypeid=Constants.Object_Type_Employee,
			                objectid=params["outletid"],
			                actiontypeid=Constants.Research_Reason_Copy,
			                userid=params['userid'],
			                parentobjectid=params["outletid"],
			                parentobjecttypeid=Constants.Object_Type_Outlet
			                )
			session.add(activity)

			#if there is desk with the same name in the second outlet, copy desk too.
			deskname = session.query(OutletDesk.deskname).filter(OutletDesk.outletdeskid == employee.outletdeskid).scalar()
			desk = session.query(OutletDesk).\
			    filter(OutletDesk.outletid == outlet.outletid).\
				filter(OutletDesk.deskname == deskname).scalar()

			new_addr = {}
			if addr:
				new_addr = Address(address1=addr.address1,
				                   address2=addr.address2,
				                   addresstypeid=addr.addresstypeid,
				                   county=addr.county,
				                   postcode=addr.postcode,
				                   countryid=addr.countryid,
				                   prn_key=addr.prn_key,
				                   townname=addr.townname,
				                   townid=addr.townid,
				                   multiline=addr.multiline
				                   )
				session.add(new_addr)
				session.flush()

			new_com = Communication(addressid=new_addr.addressid if new_addr else com.addressid,
			                        email=com.email,
			                        customerid=com.customerid,
			                        communicationtypeid=com.communicationtypeid,
			                        tel=com.tel,
			                        fax=com.fax,
			                        mobile=com.mobile,
			                        webphone=com.webphone,
			                        prn_key=com.prn_key,
			                        prn_source=com.prn_source,
			                        twitter=com.twitter,
			                        facebook=com.facebook,
			                        linkedin=com.linkedin,
			                        twitterid=com.twitterid,
			                        blog=com.blog,
			                        instagram=com.instagram
			                        )
			session.add(new_com)
			session.flush()

			# setup new employee record
			new_emp = Employee(outletid=outlet.outletid,
			                   contactid=contact.contactid if contact else None,
			                   communicationid=new_com.communicationid,
			                   job_title=employee.job_title,
			                   outletdeskid=desk.outletdeskid if desk else None,
			                   sourcetypeid=2
			                   )
			session.add(new_emp)
			session.flush()

			#copy roles to new employee
			employee_roles = session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employee.employeeid).all()
			employee_roles2 = {}
			for row in employee_roles:
				employee_roles2[row.prmaxroleid] = True
				new_emp_role = EmployeePrmaxRole(employeeid=new_emp.employeeid,
						                         prmaxroleid=row.prmaxroleid
						                         )
				session.add(new_emp_role)
				session.flush()

			#delete roles from new employee that does not exist in old employee
			all_roles = session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == new_emp.employeeid).all()
			for role in all_roles:
				if not role.prmaxroleid in employee_roles2:
					session.delete(role)

			#copy interests to new employee
			employee_interests = session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == employee.employeeid).all()
			for row in employee_interests:
				interest_exist = session.query(EmployeeInterests).\
				    filter(EmployeeInterests.employeeid == new_emp.employeeid).\
				    filter(EmployeeInterests.interestid == row.interestid).first()
				if not interest_exist:
					new_emp_interest = EmployeeInterests(employeeid=new_emp.employeeid,
						                                 interestid=row.interestid,
						                                 outletid=row.outletid
						                                 )
					session.add(new_emp_interest)
					session.flush()

			transaction.commit()
			return dict(source_series=True if len(source_series) > 0 else False, destination_series=True if len(destination_series) > 0 else False)			
			
		except:
			LOGGER.exception("research_copy_contact")
			transaction.rollback()
			raise


	def is_questionannaire_broadcast(self):
		"""Is a broadcast for questionannaire"""
		if self.prmax_outlettypeid in  (40, 41, 21, 22, 23, 24, 25, 26, 27, 28):
			return True
		return False

	def is_freelance(self):
		"""Is a freelancer"""
		if self.prmax_outlettypeid in (42, ):
			return True
		return False

class OutletCustomer(object):
	""" customer override for a outlet"""
	pass

class Freelance(BaseSql):
	""" freelance redortd"
	"""
	@staticmethod
	def _fix_number(countryid, number):
		if countryid == 1:
			if number is not None and number.strip() != '' and not number.startswith('+44'):
				number = '+44 (0)%s' % number
		if countryid == 3:
			if number is not None and number.strip() != '' and not number.startswith('+353'):
				number = '+353 (0)%s' % number
		return number

	@classmethod
	def add(cls, outlettypeid, params):
		""" add a new freelance record to the system"""
		transaction = session.begin(subtransactions=True)
		outletid = -1
		try:
			# add primary contact
			p_contact = Contact(prefix=params['title'],
			                    firstname=params['firstname'],
			                    familyname=params['familyname'],
			                    sourcetypeid=Constants.Research_Source_Private)
			session.add(p_contact)
			# add outlet
			address = Address(address1=params['address1'],
						address2=params['address2'],
						county=params['county'],
						postcode=params['postcode'],
						townname=params['townname'],
						addresstypeid=Address.editorialAddress)
			session.add(address)
			session.flush()

			if 'tel' in params:
				params['tel'] = Freelance._fix_number(address.countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Freelance._fix_number(address.countryid, params['fax'])

			com = Communication(addressid=address.addressid,
			                    tel=params['tel'],
			                    email=params['email'],
			                    fax=params['fax'],
			                    mobile=params['mobile'],
			                    twitter=params['twitter'],
			                    facebook=params['facebook'],
			                    linkedin=params['linkedin'],
			                    instagram=params['instagram'],
			                    webphone="")
			session.add(com)
			session.flush()
			out = Outlet(outletname=p_contact.getName(),
						 sortname="",
						 addressid=address.addressid,
						 communicationid=com.communicationid,
						 customerid=params['customerid'],
						 outletsearchtypeid=Constants.Search_Type_Freelance,
						 www=params["www"],
						 outlettypeid=Constants.Outlet_Type_Freelance,
						 statusid=Outlet.Live,
						 profile=params['profile'],
						 userid=params["userid"],
			             countryid=params["countryid"],
			             sourcetypeid=Constants.Research_Source_Private
						 )
			session.add(out)
			session.flush()
			outletid = out.outletid
			session.flush()
			# add primary contact
			# deliverypreferenceid, profile
			empl = Employee(
				outletid=out.outletid,
				contactid=p_contact.contactid,
				isprimary=1,
				job_title="Freelance",
			    sourcetypeid=Constants.Research_Source_Private,
				customerid=params['customerid'])
			session.add(empl)
			session.flush()
			out.primaryemployeeid = empl.employeeid
			for interestid in params['interests'] if params['interests'] else []:
				interest = EmployeeInterests(employeeid=empl.employeeid,
								             interestid=interestid,
								             customerid=params['customerid'])
				session.add(interest)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("freelance_save")
			transaction.rollback()
			raise
		return outletid

	@classmethod
	def update(cls, outlettypeid, params):
		""" update a private freelance record"""
		transaction = session.begin(subtransactions=True)
		try:
			# get data
			outlet = Outlet.query.get(params['outletid'])
			employee = Employee.query.get(outlet.primaryemployeeid)
			contact = Contact.query.get(employee.contactid)
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)
			# update

			if 'tel' in params:
				params['tel'] = Freelance._fix_number(outlet.countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Freelance._fix_number(outlet.countryid, params['fax'])
			comm.tel = params['tel']
			comm.email = params['email']
			comm.fax = params['fax']
			comm.mobile = params['mobile']
			comm.twitter = params['twitter']
			comm.facebook = params['facebook']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']

			contact.prefix = params['title']
			contact.firstname = params['firstname']
			if contact.familyname != params['familyname']:
				# this is a special index issue
				# delete and re-index employee
				IndexerQueue.IndexFreelanceContact(params['customerid'],
								                   contact.familyname,
								                   params['familyname'],
								                   outlet.primaryemployeeid)

			contact.familyname = params['familyname']

			outlet.outletname = contact.getName()
			outlet.profile = params['profile']
			outlet.www = params['www']
			outlet.countryid = params["countryid"]

			address.address1 = params['address1']
			address.address2 = params['address2']
			address.county = params['county']
			address.postcode = params['postcode']
			address.townname = params['townname']

			CacheControl.Invalidate_Cache_Object_Research(outlet.outletid, Constants.Cache_Outlet_Objects)

			# interests
			dbinterest = session.query(EmployeeInterests).filter_by(
				employeeid=outlet.primaryemployeeid)
			dbinterest2 = []
			interests = params['interests'] if params['interests'] else []
			# do deletes
			for outletinterest in dbinterest:
				dbinterest2.append(outletinterest.interestid)
				if not outletinterest.interestid in interests:
					session.delete(outletinterest)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = EmployeeInterests(
						employeeid=outlet.primaryemployeeid,
						interestid=interestid,
					    outletid=params['outletid'],
						customerid=params['customerid'])
					session.add(interest)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("freelance_update")
			transaction.rollback()
			raise

	@classmethod
	def getForEdit(cls, outletid):
		"""Load an employee record for editing"""
		outlet = Outlet.query.get(outletid)
		employee = Employee.query.get(outlet.primaryemployeeid)
		contact = Contact.query.get(employee.contactid)
		comm = Communication.query.get(outlet.communicationid)
		address = Address.query.get(comm.addressid)
		dbinterest = session.query(EmployeeInterestView).filter_by(employeeid=outlet.primaryemployeeid).all()
		outletprofile = OutletProfile.query.get(outletid)
		profile = outletprofile.editorialprofile if outletprofile else outlet.profile
		# update
		return  dict(outletid=outletid,
		             data=dict(outlet=outlet,
		                       profile=profile,
		                       employee=employee,
		                       contact=contact,
		                       contactname=contact.getName(),
		                       address=address,
		                       comm=comm,
		                       interests=dict(data=dbinterest)))

	@classmethod
	def research_add(cls, params):
		""" add a new freelance record to the global system"""
		transaction = cls.sa_get_active_transaction()
		try:
			p_contact = Contact.query.get(params["contactid"])
			# add outlet
			address = Address(address1=params['address1'],
			                  address2=params['address2'],
			                  county=params['county'],
			                  postcode=params['postcode'],
			                  townname=params['townname'],
			                  addresstypeid=Address.editorialAddress)
			session.add(address)
			session.flush()

			if 'tel' in params:
				params['tel'] = Freelance._fix_number(address.countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Freelance._fix_number(address.countryid, params['fax'])

			com = Communication(addressid=address.addressid,
			                    tel=params['tel'],
			                    email=params['email'],
			                    fax=params['fax'],
			                    mobile=params['mobile'],
			                    twitter=params["twitter"],
			                    facebook=params["facebook"],
			                    linkedin=params["linkedin"],
			                    instagram=params["instagram"],
			                    webphone="")
			session.add(com)
			session.flush()
			out = Outlet(outletname=p_contact.getName(),
						 sortname="",
						 addressid=address.addressid,
						 communicationid=com.communicationid,
						 customerid=-1,
						 outletsearchtypeid=Constants.Search_Type_Freelance,
						 outlettypeid=Constants.Outlet_Type_Freelance,
						 statusid=Outlet.Live,
						 profile=params['profile'],
						 userid=params["userid"],
			             www=params["www"],
			             prmax_outlettypeid=Constants.PRmax_OutletTypeId,
			             sourcetypeid=Constants.Research_Source_Prmax
						 )
			session.add(out)
			session.flush()
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                    reason=params["reason"],
			                    objecttypeid=Constants.Object_Type_Freelance,
			                    objectid=out.outletid,
			                    actiontypeid=Constants.Research_Reason_Add,
			                    userid=params['userid'],
			                    parentobjectid=out.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Freelance
			                    )
			session.add(activity)
			session.flush()
			# add primary contact
			# deliverypreferenceid, profile
			empl = Employee(
			    outletid=out.outletid,
			    contactid=p_contact.contactid,
			    isprimary=1,
			    job_title="Freelance",
			    customerid=-1)
			session.add(empl)
			session.flush()
			out.primaryemployeeid = empl.employeeid
			for interestid in params['interests'] if params['interests'] else []:
				interest = EmployeeInterests(employeeid=empl.employeeid,
								             interestid=interestid,
				                             outletid=out.outletid,
								             customerid=-1)
				session.add(interest)
			session.flush()

#			rd = ResearchDetails(surname=p_contact.familyname,
#			                     firstname=p_contact.firstname if p_contact.firstname else None,
#			                     title=p_contact.prefix if p_contact.prefix else None,
#			                     email=com.email,
#			                     job_title=empl.job_title,
#			                     researchfrequencyid=5,
#			                     outletid=out.outletid
#			                     )
#			session.add(rd)
#			session.flush()

			transaction.commit()
			return out.outletid
		except:
			LOGGER.exception("research_freelance_save")
			transaction.rollback()
			raise

	@classmethod
	def research_update(cls, params):
		""" update a public freelance record"""

		transaction = cls.sa_get_active_transaction()

		try:
			# get data
			outlet = Outlet.query.get(params['outletid'])
			employee = Employee.query.get(outlet.primaryemployeeid)
			comm = Communication.query.get(outlet.communicationid)
			address = Address.query.get(comm.addressid)
			# update
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                    reason="",
			                    objecttypeid=Constants.Object_Type_Freelance,
			                    objectid=outlet.outletid,
			                    actiontypeid=Constants.Research_Reason_Update,
			                    userid=params['userid'],
			                    parentobjectid=outlet.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Freelance
			                    )
			session.add(activity)
			session.flush()

			if 'tel' in params:
				params['tel'] = Freelance._fix_number(outlet.countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Freelance._fix_number(outlet.countryid, params['fax'])

			ActivityDetails.AddChange(comm.tel, params['tel'], activity.activityid, Constants.Field_Tel)
			ActivityDetails.AddChange(comm.email, params['email'], activity.activityid, Constants.Field_Email)
			ActivityDetails.AddChange(comm.fax, params['fax'], activity.activityid, Constants.Field_Fax)
			ActivityDetails.AddChange(comm.mobile, params['mobile'], activity.activityid, Constants.Field_Mobile)
			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)
			ActivityDetails.AddChange(comm.blog, params['blog'], activity.activityid, Constants.Field_Blog)

			comm.tel = params['tel']
			comm.email = params['email']
			comm.fax = params['fax']
			comm.mobile = params['mobile']
			comm.twitter = params["twitter"]
			comm.facebook = params["facebook"]
			comm.linkedin = params["linkedin"]
			comm.instagram = params["instagram"]
			comm.blog = params["blog"]

			if int(params["contactid"]) != employee.contactid:
				contact_old = Contact.query.get(employee.contactid)
				new_contact = Contact.query.get(int(params['contactid']))
				ActivityDetails.AddChange(contact_old.getName(), new_contact.getName(), activity.activityid, Constants.Field_Contactid)
				# delete this contact
				index_fields_employeeid = (
					(Constants.freelance_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
					(Constants.mp_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
					(Constants.employee_contact_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
					(Constants.employee_prmaxoutlettypeid, 'prmax_outlettypeid', None, None),
					(Constants.employee_contactfull_employeeid, 'familyname', StandardIndexerInternal.standardise_string, None),
					(Constants.freelance_employeeid_countryid, 'countryid', None, None),
					(Constants.employee_countryid, 'countryid', None, None),
				)
				indexer = StandardIndexerInternal(index_fields_employeeid, "employeeid", (employee, contact_old), Constants.index_Delete)
				indexer.run_indexer()
				employee.contactid = params["contactid"]
				contact = Contact.query.get(employee.contactid)
				indexer = StandardIndexerInternal(index_fields_employeeid, "employeeid", (employee, contact), Constants.index_Add)
				indexer.run_indexer()


			contact = Contact.query.get(employee.contactid)
			outlet.outletname = contact.getName()

			ActivityDetails.AddChange(outlet.www, params['www'], activity.activityid, Constants.Field_Address_Www)
			old_country = Countries.query.get(outlet.countryid)
			new_country = Countries.query.get(int(params['countryid']))
			ActivityDetails.AddChange(old_country.countryname, new_country.countryname, activity.activityid, Constants.Field_CountryId)
			ActivityDetails.AddChange(employee.job_title, params['job_title'], activity.activityid, Constants.Field_Job_Title)

			employee.job_title = params['job_title']

			profile = params.get('profile', "")
			if not profile:
				profile = params.get('editoralprofile', "")

			profile_record = OutletProfile.query.get(outlet.outletid)
			if not profile_record:
				profile_record = OutletProfile(outletid=outlet.outletid)
				session.add(profile_record)

			ActivityDetails.AddChange(profile_record.editorialprofile, profile, activity.activityid, Constants.Field_Profile)
			profile_record.editorialprofile = profile

			outlet.www = params['www']
			outlet.countryid = params["countryid"]
			outlet.sortname = params["sortname"]

			if 'prmax_outlettypeid' in params:
				old_prmax_outlettype = PRmaxOutletTypes.query.get(outlet.prmax_outlettypeid)
				new_prmax_outlettype = PRmaxOutletTypes.query.get(int(params['prmax_outlettypeid']))
				ActivityDetails.AddChange(old_prmax_outlettype.prmax_outlettypename, new_prmax_outlettype.prmax_outlettypename, activity.activityid, Constants.Field_Outlet_Type)
				outlet.prmax_outlettypeid = params["prmax_outlettypeid"]

			ActivityDetails.AddChange(address.address1, params['address1'], activity.activityid, Constants.Field_Address_1)
			ActivityDetails.AddChange(address.address2, params['address2'], activity.activityid, Constants.Field_Address_2)
			ActivityDetails.AddChange(address.county, params['county'], activity.activityid, Constants.Field_Address_County)
			ActivityDetails.AddChange(address.postcode, params['postcode'], activity.activityid, Constants.Field_Address_Postcode)
			ActivityDetails.AddChange(address.townname, params['townname'], activity.activityid, Constants.Field_Address_Town)

			address.address1 = params['address1']
			address.address2 = params['address2']
			address.county = params['county']
			address.postcode = params['postcode']
			address.townname = params['townname']

			# interests
			dbinterest = session.query(EmployeeInterests).filter_by(
				employeeid=outlet.primaryemployeeid)
			dbinterest2 = []
			interests = params['interests'] if params['interests'] else []
			# do deletes
			for outletinterest in dbinterest:
				dbinterest2.append(outletinterest.interestid)
				if not outletinterest.interestid in interests:
					old_interest = Interests.query.get(outletinterest.interestid)
					ActivityDetails.AddDelete(old_interest.interestname, activity.activityid, Constants.Field_Interest)
					session.delete(outletinterest)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = EmployeeInterests(
						employeeid=outlet.primaryemployeeid,
					    outletid=outlet.outletid,
						interestid=interestid)
					session.add(interest)
					new_interest = Interests.query.get(interestid)
					ActivityDetails.AddAdd(new_interest.interestname, activity.activityid, Constants.Field_Interest)

			# if prn add ignore record
			if outlet.sourcetypeid == Constants.Research_Source_Prn:
				session.add(IgnorePrnOutlets(
				    outletname=outlet.outletname,
				    prn_key=outlet.prn_key))

			# set source to us
			outlet.sourcetypeid = Constants.Research_Source_Prmax
			outlet.sourcekey = outlet.outletid

			# clear out the cache across all customers
			Invalidate_Cache_Object_Research(Outlet,
			                                 outlet.outletid,
			                                 Constants.Cache_Outlet_Objects)

			# rebuild profiles
			session.add(ProcessQueue(
			  objecttypeid=Constants.Process_Outlet_Profile,
			  objectid=outlet.outletid))

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("research_freelance_update")
			transaction.rollback()
			raise

class OutletCustomerView(object):
	""" view record for customer outlet details"""
	pass
class OutletAltTitle(object):
	""" Alternative titles """
	pass


Outlet.mapping = Table('outlets', metadata, autoload=True)
OutletCoverage.mapping = Table('outletcoverage', metadata, autoload=True)
OutletCoverageView.mapping = Table('outletcoverage_view', metadata,
                            Column("outletid", Integer, primary_key=True), # needed to load a view
                            Column("geographicalid", Integer, primary_key=True), # needed to load a view
                            autoload=True)
OutletAltTitle.mapping = Table('outlettitles', metadata, autoload=True)
OutletInterests.mapping = Table('outletinterests', metadata, autoload=True)
OutletCustomer.mapping = Table('outletcustomers', metadata, autoload=True)
OutletCustomerView.mapping = Table('outletcustomer_view', metadata,
                            Column("outletid", Integer, primary_key=True), # needed to load a view
                            Column("customerid", Integer, primary_key=True), # needed to load a view
                            autoload=True)

mapper(OutletCoverageView, OutletCoverageView.mapping)
mapper(OutletCoverage, OutletCoverage.mapping)
mapper(Outlet, Outlet.mapping)
mapper(OutletAltTitle, OutletAltTitle.mapping)
mapper(Freelance, Outlet.mapping)
mapper(OutletInterests, OutletInterests.mapping)
mapper(OutletCustomer, OutletCustomer.mapping)
mapper(OutletCustomerView, OutletCustomerView.mapping)
