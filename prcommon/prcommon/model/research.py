# -*- coding: utf-8 -*-
"""research"""
#-----------------------------------------------------------------------------
# Name:        research.py
# Purpose:     Research specific
# Author:      Chris Hoy
#
# Created:     14/10/2010
# RCS-ID:      $Id:  $
# Copyright:  (c) 2010

#-----------------------------------------------------------------------------
from types import StringTypes
from datetime import date
import datetime
import logging
import StringIO
import email
import urllib2
import urllib
import simplejson
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table
from sqlalchemy.sql import text
from prcommon.model import BaseSql
from prcommon.model.internal import LockedObject
from prcommon.model.lookups import Months, AdvanceFeaturesStatus
from prcommon.lib.bouncedemails import AnalysisMessage
import prcommon.Constants as Constants
from ttl.ttlcsv import ToCsv
from ttl.ttldate import to_json_date
from ttl.base import stdreturn, lockedreturn

LOGGER = logging.getLogger("prmax.model")

class ReasonCodes(BaseSql):
	""" Reash reason for action codes """

	List = """
	SELECT rc.reasoncodeid AS id,rc.reasoncodedescription as  name
	FROM internal.reasoncodes as rc
	%s
	ORDER BY rc.reasoncodedescription"""

	@classmethod
	def getLookUp(cls, params):
		""" return list of reason codes """
		whereclause = ""
		if "reasoncategoryid" in params:
			whereclause = "WHERE reasoncategoryid = :reasoncategoryid AND reasoncodeid != 6"
			params["reasoncategoryid"] = int(params["reasoncategoryid"])

		return cls.sqlExecuteCommand(text(ReasonCodes.List%whereclause),
				                       params,
				                       BaseSql.ResultAsEncodedDict)

	Grid_View_Base = """
		SELECT r.reasoncodeid, r.reasoncodedescription,rc.reasoncategoryname
		FROM internal.reasoncodes AS r
	    JOIN internal.reasoncategories AS rc ON rc.reasoncategoryid = r.reasoncategoryid """
	Grid_View_Ext = """
		ORDER BY  %s %s
		LIMIT :limit  OFFSET :offset """

	Grid_View_Count_Base = """SELECT count(*) FROM internal.reasoncodes AS r """

	@classmethod
	def getGridPage(cls, params):
		""" get a page of collateral for a grid"""
		whereclause = ""
		if "filter" in params:
			whereclause = " WHERE r.reasoncodedescription ilike :filter "
			params["filter"] = "%" + params["filter"] + "%"
		if "reasoncategoryid" in params and params["reasoncategoryid"] != "-1":
			if whereclause:
				whereclause = whereclause + " AND r.reasoncategoryid = :reasoncategoryid"
			else:
				whereclause = " WHERE r.reasoncategoryid = :reasoncategoryid"

		return BaseSql.getGridPage(params,
								'reasoncodedescription',
								'reasoncodeid',
								ReasonCodes.Grid_View_Base + whereclause + ReasonCodes.Grid_View_Ext,
								ReasonCodes.Grid_View_Count_Base + whereclause,
								cls)

	@classmethod
	def get_rest_page(cls, params):
		""" get a page of collateral for a grid"""
		whereclause = ""
		if "filter" in params:
			whereclause = " WHERE r.reasoncodedescription ilike :filter "
			params["filter"] = "%" + params["filter"] + "%"
		if "reasoncategoryid" in params and params["reasoncategoryid"] != "-1":
			if whereclause:
				whereclause = whereclause + " AND r.reasoncategoryid = :reasoncategoryid"
			else:
				whereclause = " WHERE r.reasoncategoryid = :reasoncategoryid"

		return cls.grid_to_rest(BaseSql.get_grid_page(
		  params,
		  'reasoncodedescription',
		  'reasoncodeid',
		  ReasonCodes.Grid_View_Base + whereclause + ReasonCodes.Grid_View_Ext,
		  ReasonCodes.Grid_View_Count_Base + whereclause,
		  cls), params["offset"])

	@classmethod
	def Exists(cls, params):
		""" Check to see if a name exists for a category """

		ret = cls.query.filter_by(reasoncodedescription=params["reasoncodedescription"],
		                          reasoncategoryid=params["reasoncategoryid"]).first()

		if not ret:
			return False

		if "reasoncodeid" in params and ret.reasoncodeid == int(params["reasoncodeid"]):
			return False

		return True

	@classmethod
	def reason_code_add(cls, params):
		""" Add a new reason code """

		transaction = cls.sa_get_active_transaction()

		try:
			rcrecord = ReasonCodes(reasoncodedescription=params["reasoncodedescription"],
			                 reasoncategoryid=params["reasoncategoryid"])
			session.add(rcrecord)
			session.flush()

			transaction.commit()
			return rcrecord.reasoncodeid
		except:
			LOGGER.exception("reason_code_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, params):
		""" get a record """

		rc1 = cls.query.get(params["reasoncodeid"])
		rc2 = ReasonCategories.query.get(rc1.reasoncategoryid)

		return dict(reasoncodeid=rc1.reasoncodeid,
		              reasoncodedescription=rc1.reasoncodedescription,
		              reasoncategoryid=rc1.reasoncategoryid,
		              reasoncategoryname=rc2.reasoncategoryname)

class ReasonCategories(BaseSql):
	""" Categories of the reason codes """

	List = """
	SELECT rc.reasoncategoryid AS id,rc.reasoncategoryname as  name
	FROM internal.reasoncategories as rc
	ORDER BY rc.reasoncategoryname"""

	@classmethod
	def getLookUp(cls, params):
		""" return list of reason codes """

		data = cls.sqlExecuteCommand(text(ReasonCategories.List),
		                               params,
		                               BaseSql.ResultAsEncodedDict)
		if "nooption" in params:
			data.insert(0, dict(id="-1", name="No Selection"))

		return data

class ResearchFrequencies(BaseSql):
	""" research frequencies """

	List = """
	SELECT rf.researchfrequencyid AS id,rf.researchfrequencyname as  name
	FROM internal.researchfrequencies as rf
	ORDER BY rf.researchfrequencyid"""

	@classmethod
	def getLookUp(cls, params):
		""" return list of reason codes """
		return cls.sqlExecuteCommand(text(ResearchFrequencies.List),
		                               params,
		                               BaseSql.ResultAsEncodedDict)

class FrequencyCodes(BaseSql):
	""" codes for frequencies """

	List = """
	SELECT f.frequencyid AS id,f.frequencyname as  name
	FROM internal.frequencies as f
	ORDER BY f.frequencyid"""

	@classmethod
	def getLookUp(cls, params):
		""" return list of frequency codes """
		return cls.sqlExecuteCommand(text(ResearchFrequencies.List),
		                               params,
		                               BaseSql.ResultAsEncodedDict)
class Activity(BaseSql):
	""" Activity audit for reseach system """

	Grid_View = """select to_char(a.activitydate, 'YYYY-MM-DD HH24:MI:SS') as activitydate,u.display_name,o.actiontypedescription,a.activityid,
	rc.reasoncodedescription,
	a.reason,
	ob.objecttypename
	FROM research.activity AS a
	JOIN tg_user AS u ON a.userid = u.user_id
	LEFT OUTER JOIN internal.actiontypes AS o ON o.actiontypeid = a.actiontypeid
	LEFT OUTER JOIN internal.reasoncodes AS rc ON rc.reasoncodeid = a.reasoncodeid
	LEFT OUTER JOIN internal.objecttypes AS ob ON a.objecttypeid = ob.objecttypeid"""

	Grid_View_Order = """ORDER BY  %s %s LIMIT :limit  OFFSET :offset"""
	Grid_View_Count = """select COUNT(*)	FROM research.activity AS a """

	Grid_View_Where_Std = """ WHERE a.activitydate >= :filterdate AND a.objecttypeid = :objecttypeid AND objectid = :objectid """
	Grid_View_Where_Base = """ WHERE a.activitydate >= :filterdate AND parentobjecttypeid = :objecttypeid AND parentobjectid = :objectid """

	Grid_View_Deleted = """select to_char(a.activitydate,'YYYY-MM-DD HH24:MI:SS') as activitydate,u.display_name,o.actiontypedescription,a.activityid,
	rc.reasoncodedescription,
	a.reason,
	ob.objecttypename,
	a.name
	FROM research.activity AS a
	JOIN tg_user AS u ON a.userid = u.user_id
	LEFT OUTER JOIN internal.actiontypes AS o ON o.actiontypeid = a.actiontypeid
	LEFT OUTER JOIN internal.reasoncodes AS rc ON rc.reasoncodeid = a.reasoncodeid
	LEFT OUTER JOIN internal.objecttypes AS ob ON a.objecttypeid = ob.objecttypeid
	WHERE a.objecttypeid = :objecttypeid AND a.actiontypeid = 3
	"""

	Grid_View_Deleted_Count = """select COUNT(*)	FROM research.activity AS a
	WHERE a.objecttypeid = :objecttypeid AND a.actiontypeid = 3"""

	List_View_Deleted = """select a.activityid, a.name FROM research.activity AS a"""

	@classmethod
	def getGridPage(cls, params):
		""" grid based on date"""

		if "filterdate"  not in params:
			return dict(numRows=0, items=[], identifier="activityid")
		else:
			if params["objectisbase"] == 'true':
				whereused = Activity.Grid_View_Where_Base
			else:
				whereused = Activity.Grid_View_Where_Std
			# if no sort then this is a reverse date
			if not params.get('sortfield', ""):
				params['direction'] = "DESC"

			if params.get("sort") == "activitydate":
				params["sort"] = 'a.activitydate'

			return BaseSql.getGridPage(params,
			                            'a.activitydate',
			                            'activityid',
			                            Activity.Grid_View + whereused + Activity.Grid_View_Order,
			                            Activity.Grid_View_Count + whereused,
			                            cls)

	@classmethod
	def get_rest_page(cls, params):
		""" grid based on date"""

		return cls.grid_to_rest(
		  cls.getGridPage(params),
		  params["offset"])

	@classmethod
	def get_grid_page_deleted(cls, params):
		""" Delete activity"""
		return cls.grid_to_rest(
		  cls.getGridPageDeleted(params),
		  params["offset"],
		  False)

	@classmethod
	def get_list_deleted(cls, params):
		"""list for dropdown list"""

		whereused = " WHERE a.actiontypeid = 3 "
		if 'objecttypeid' in params:
			whereused = BaseSql.addclause(whereused, "a.objecttypeid >= :objecttypeid")
		if "name" in params:
			whereused = BaseSql.addclause(whereused, "name ilike :name")
			if params["name"]:
				params["name"] = params["name"].replace("*", "")
				if "extended_search" in  params:
					params["name"] = "%" + params["name"] + "%"
				else:
					params["name"] = params["name"] + "%"
		else:
			return Activity.grid_to_rest(dict(numRows=0, items=[], identity="objectid"),
			                           params["offset"],
			                           False)

		return Activity.get_rest_page_base(
		    params,
		    'activityid',
		    'name',
		    Activity.List_View_Deleted + whereused + BaseSql.Standard_View_Order,
		    Activity.Grid_View_Count + whereused,
		    cls)

	@classmethod
	def getGridPageDeleted(cls, params):
		""" grid based on date"""

		andclause = ''
#		if "activityid" in params and params["activityid"] != '':
#			andclause += " AND a.activityid = :activityid "
		if "filteroutlet" in params and params["filteroutlet"] != '':
			params['filteroutlet'] = "%" + params["filteroutlet"] +  "%"
			andclause += " AND a.name ilike :filteroutlet"
		if "filterdate" in params and params["filterdate"] != '':
			andclause += " AND a.activitydate >= :filterdate "
		if "filterdate" not in params and "activityid" not in params:
			return dict(numRows=0, items=[], identifier="activityid")
		else:
			return BaseSql.getGridPage(params,
			                            'activitydate',
			                            'activityid',
			                            Activity.Grid_View_Deleted + andclause + Activity.Grid_View_Order,
			                            Activity.Grid_View_Deleted_Count + andclause,
			                            cls)


class ActivityDetails(BaseSql):
	""" Detaild of which field has been changed """

	@staticmethod
	def AddChange(old_value, new_value, activityid, fieldid):
		""" check and add a record to the audit trail if the field has been chnaged """

		# None and empty string are the same think
		if old_value == None and new_value == "":
			return

		# fix up issue with string encoding
		if type(old_value)  in StringTypes:
			fromvalue = old_value  if old_value else None
		else:
			fromvalue = str(old_value) if old_value else None
		if type(new_value)  in StringTypes:
			tovalue = new_value  if new_value else None
		else:
			tovalue = str(new_value) if new_value else None


		if old_value != new_value:
			tmp = ActivityDetails(activityid=activityid,
			                        fieldid=fieldid,
			                        fromvalue=fromvalue,
			                        tovalue=tovalue)
			session.add(tmp)

	@staticmethod
	def AddDelete(value, activityid, fieldid):
		""" add entry for a delere"""
		tmp = ActivityDetails(activityid=activityid,
		                        fieldid=fieldid,
		                        fromvalue=str(value),
		                        tovalue=None)
		session.add(tmp)
	@staticmethod
	def AddAdd(value, activityid, fieldid):
		""" add entry for a delere"""
		tmp = ActivityDetails(activityid=activityid,
		                        fieldid=fieldid,
		                        fromvalue=None,
		                        tovalue=str(value))
		session.add(tmp)

	Grid_View = """SELECT sd.activitydetailid,fieldname, audit_to_string(f.fieldid, fromvalue) as fromvalue, audit_to_string(f.fieldid, tovalue) as tovalue
		FROM research.activitydetails AS sd
	    JOIN research.fields AS f ON f.fieldid = sd.fieldid
	    WHERE sd.activityid = :activityid
	    ORDER BY  %s %s
	    LIMIT :limit  OFFSET :offset"""

	Grid_View_Count = """SELECT COUNT(*) FROM research.activitydetails WHERE activityid = :activityid"""

	@classmethod
	def getGridPage(cls, params):
		""" grid based on date"""

		if "activityid" not in params:
			return dict(numRows=0, items=[], identifier="activitydetailid")
		else:
			activity = Activity.query.get(params["activityid"])
			data = BaseSql.getGridPage(params,
			                            'activitydetailid',
			                            'activitydetailid',
			                            ActivityDetails.Grid_View,
			                            ActivityDetails.Grid_View_Count,
			                            cls)

			if activity.objecttypeid == Constants.Object_Type_Employee:
				job_title = ""
				cname = ""
				if activity.actiontypeid == Constants.Research_Record_Delete:
					cname = activity.name
				else:
					from prcommon.model.employee import Employee
					from prcommon.model.contact import Contact

					employee = Employee.query.get(activity.objectid)
					job_title = employee.job_title
					if employee.contactid > 0:
						cname = Contact.query.get(employee.contactid).getName()
				data["numRows"] = data["numRows"] + 1
				data["items"].insert(0, dict(activitydetailid=-1,
				                                fieldname=cname,
				                                fromvalue=job_title,
				                                tovalue=""))

			if activity.objecttypeid == Constants.Object_Type_Desk:
				deskname = ""
				if activity.actiontypeid == Constants.Research_Record_Delete:
					deskname = activity.name
				else:
					from prcommon.model.outlets.outletdesk import OutletDesk

					outletdesk = OutletDesk.query.get(activity.objectid)
					deskname = outletdesk.deskname
				data["numRows"] = data["numRows"] + 1
				data["items"].insert(0, dict(activitydetailid=-1,
			                                    fieldname='Desk: ' + deskname,
			                                    fromvalue="",
			                                    tovalue=""))

			if activity.objecttypeid == Constants.Object_Type_Advance:
				summary = ""
				if activity.actiontypeid == Constants.Research_Record_Delete:
					summary = activity.name
				else:
					from prcommon.model.advance import AdvanceFeature

					advancefeature = AdvanceFeature.query.get(activity.objectid)
					summary = advancefeature.feature
				data["numRows"] = data["numRows"] + 1
				data["items"].insert(0, dict(activitydetailid=-1,
			                                    fieldname='Feature: ' + summary,
			                                    fromvalue="",
			                                    tovalue=""))

			return data

	@classmethod
	def get_rest_page(cls, params):
		"""get page for rest controller """

		return cls.grid_to_rest(
		  cls.getGridPage(params),
		  params["offset"]
		)

class IgnorePrnEmployees(BaseSql):
	""" Hold entries of prn records that we have changed and we should ignore """

	@classmethod
	def exists(cls, prn_key):
		""" Check to see if the prn record exists in the delete tree """
		result = session.query(IgnorePrnEmployees).filter_by(prn_key=prn_key)
		return True if result.count() else False

class IgnorePrnOutlets(BaseSql):
	""" Hold entries of prn records that we have changed and we should ignore """

class IgnorePrnContacts(BaseSql):
	""" Hold entries of prn records that we have changed and we should ignore """


class ResearchControRecord(BaseSql):
	""" Internal control record fo who changes etc
	will also work fine in the main system as it can be used too see who accessed
	private records"""

	@classmethod
	def getAdvaneResearchDict(cls, params):
		""" get the advance reserach fields as a dictionalry """

		rcr = ResearchControRecord.query.filter_by(
		  objectid=params["outletid"],
		  objecttypeid=Constants.Object_Type_Outlet).one()

		if rcr.advance_last_contact:
			advance_last_contact = dict(year=rcr.advance_last_contact.year,
			                            month=rcr.advance_last_contact.month,
			                            day=rcr.advance_last_contact.day)
		else:
			tod = date.today()
			advance_last_contact = dict(year=tod.year, month=tod.month, day=tod.day)

		return dict(advance_url=rcr.advance_url,
		            advance_notes=rcr.advance_notes,
		            advance_last_contact=advance_last_contact,
		            advancefeaturestatusid=rcr.advancefeaturestatusid)

	@classmethod
	def updateAdvanceResearch(cls, params):
		""" Update the advance features research info"""
		transaction = cls.sa_get_active_transaction()

		try:
			rcr = ResearchControRecord.query.filter_by(objectid=params["outletid"],
			                                           objecttypeid=Constants.Object_Type_Outlet).one()
			activity = Activity(reasoncodeid=5,
					            reason="",
					            objecttypeid=Constants.Object_Type_Outlet,
					            objectid=rcr.objectid,
					            actiontypeid=Constants.Research_Reason_Update,
					            userid=params['userid'],
					            parentobjectid=rcr.objectid,
					            parentobjecttypeid=Constants.Object_Type_Outlet
					            )
			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(rcr.advance_url, params["advance_url"], activity.activityid, Constants.Field_Feature_Research_URL)
			ActivityDetails.AddChange(rcr.advance_notes, params["advance_notes"], activity.activityid, Constants.Field_Feature_Research_Info)
			ActivityDetails.AddChange(rcr.advance_last_contact.strftime("%Y-%m-%d") if rcr.advance_last_contact else None, str(params["advance_last_contact"]), activity.activityid, Constants.Field_Feature_Research_Date)
			old_featurestatusdescription = new_featurestatusdescription = ""
			if rcr.advancefeaturestatusid != None:
				old_featurestatus = AdvanceFeaturesStatus.query.get(rcr.advancefeaturestatusid)
				old_featurestatusdescription = old_featurestatus.advancefeaturesstatusdescription
			if "advancefeaturestatusid" in params and params["advancefeaturestatusid"] != None and params["advancefeaturestatusid"] != '':
				new_featurestatus = AdvanceFeaturesStatus.query.get(int(params["advancefeaturestatusid"]))
				new_featurestatusdescription = new_featurestatus.advancefeaturesstatusdescription
			ActivityDetails.AddChange(old_featurestatusdescription, new_featurestatusdescription, activity.activityid, Constants.Field_Feature_Research_Outlet_Status)


			rcr.advance_url = params["advance_url"]
			rcr.advance_notes = params["advance_notes"]
			rcr.advance_last_contact = params["advance_last_contact"]
			rcr.advancefeaturestatusid = params["advancefeaturestatusid"]

			transaction.commit()
		except:
			LOGGER.exception("updateAdvanceResearch")
			transaction.rollback()
			raise

class ResearchDetails(BaseSql):
	""" Details about a outlet/freelance for research perposes"""

	def __json__(self):
		""" jsonify """

		return dict(surname=self.surname,
		             firstname=self.firstname,
		             prefix=self.prefix,
		             email=self.email,
		             #tel=self.tel,
		             job_title=self.job_title,
		             outletid=self.outletid,
		             researchfrequencyid=self.researchfrequencyid,
		             notes=self.notes,
		             quest_month_1=self.quest_month_1,
		             quest_month_2=self.quest_month_2,
		             quest_month_3=self.quest_month_3,
		             quest_month_4=self.quest_month_4,
		             last_sync=datetime.datetime.strftime(self.last_sync, "%d-%m-%y  %H:%M:%S") if self.last_sync else None,
		             no_sync=self.no_sync
		            )

	def for_quest(self):
		""" jsonify """

		return dict(research_surname="",
		             research_firstname="",
		             research_prefix="",
		             research_email="",
		             research_tel="",
		             research_job_title="",
		             research_outletid=None,
		             research_researchfrequencyid=None
		            )


	def get_salutation(self):
		" get the slaution "

		if self.firstname:
			return self.firstname
		else:
			sal = ''
			if self.prefix:
				sal = self.prefix
			if self.surname:
				if sal:
					sal += " "
				sal += self.surname
			return sal

	@classmethod
	def get(cls, params):
		""" if presetn get the research contract details """

		return ResearchDetails.query.get(params["outletid"])

	@classmethod
	def get_extended(cls, params):
		""" if presetn get the research contract details """

		from prcommon.model.outlet import Outlet
		outlet = Outlet.query.get(params["outletid"])
		if outlet.researchdetailid:
			research = ResearchDetails.query.get(outlet.researchdetailid)
		else:
			# check and fix if required
			research = session.query(ResearchDetails).filter(ResearchDetails.outletid == params["outletid"]).scalar()
			if research:
				outlet.researchdetailid = research.researchdetailid

		last_questionaire_sent = None
		last_research_completed = None
		last_research_changed_date = ""
		last_customer_questionaire_action = ""

		if research and research.last_questionaire_sent:
			last_questionaire_sent = to_json_date(research.last_questionaire_sent)

		if research and research.last_research_date:
			last_research_completed = to_json_date(research.last_research_date)

		if research and research.last_customer_questionaire_action:
			last_customer_questionaire_action = research.last_customer_questionaire_action.strftime("%d-%m-%y")

		if research and research.last_research_changed_date:
			last_research_changed_date = research.last_research_changed_date.strftime("%d-%m-%y")

		if research and research.last_customer_questionaire_action:
			last_customer_questionaire_action = research.last_customer_questionaire_action.strftime("%d-%m-%y")

		return dict(
		  research=research,
		  last_questionaire_sent=last_questionaire_sent,
		  last_research_completed=last_research_completed,
		  last_research_changed_date=last_research_changed_date,
		  last_customer_questionaire_action=last_customer_questionaire_action
		)

	def set_research_updated(self):
		"""update last chnaged record """

		self.last_research_changed_date = date.today()

	@staticmethod
	def set_research_modified(outletid):
		"""get and set updated date """

		control = session.query(ResearchDetails).\
			filter(ResearchDetails.outletid == outletid).scalar()
		if not control:
			control = ResearchDetails(outletid=outletid)
			session.add(control)
			session.flush()

		control.set_research_updated()

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
	def update(cls, params):
		""" update/add the research contact details """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			from prcommon.model.outlet import Outlet

			if "researchdetailid" in  params and  params["researchdetailid"]:
				researchdetails = ResearchDetails.query.get(params["researchdetailid"])
				outlet = Outlet.query.get(researchdetails.outletid)
			else:
				outlet = Outlet.query.get(params["outletid"])
				if outlet.researchdetailid:
					researchdetails = ResearchDetails.query.get(outlet.researchdetailid)
				else:
					researchdetails = session.query(ResearchDetails).filter(ResearchDetails.outletid == params["outletid"]).scalar()

			ptype = Constants.Object_Type_Freelance if outlet.outlettypeid == Constants.Outlet_Type_Freelance else Constants.Object_Type_Outlet

			if 'tel' in params:
				params['tel'] = ResearchDetails._fix_number(outlet.countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = ResearchDetails._fix_number(outlet.countryid, params['fax'])

			if researchdetails:
				activity = Activity(reasoncodeid=5,
				                reason="",
				                objecttypeid=Constants.Object_Type_Research,
				                objectid=params["outletid"],
				                actiontypeid=Constants.Research_Reason_Update,
				                userid=params['userid'],
				                parentobjectid=params["outletid"],
				                parentobjecttypeid=ptype
				               )
				session.add(activity)
				session.flush()
				ActivityDetails.AddChange(researchdetails.surname, params["surname"], activity.activityid, Constants.Field_FamilyName)
				ActivityDetails.AddChange(researchdetails.firstname, params["firstname"], activity.activityid, Constants.Field_Firstname)
				ActivityDetails.AddChange(researchdetails.prefix, params["prefix"], activity.activityid, Constants.Field_Prefix)
				ActivityDetails.AddChange(researchdetails.email, params["email"], activity.activityid, Constants.Field_Email)
				#ActivityDetails.AddChange(researchdetails.tel, params["tel"], activity.activityid, Constants.Field_Tel)
				ActivityDetails.AddChange(researchdetails.job_title, params["job_title"], activity.activityid, Constants.Field_Job_Title)

				old_researchfrequencyname = new_researchfrequencyname = ''
				if researchdetails.researchfrequencyid:
					old_reseaerchfrequency = ResearchFrequencies.query.get(researchdetails.researchfrequencyid)
					old_researchfrequencyname = old_reseaerchfrequency.researchfrequencyname
				if 'researchfrequencyid' in params and params['researchfrequencyid'] != '':
					new_reseaerchfrequency = ResearchFrequencies.query.get(int(params['researchfrequencyid']))
					new_researchfrequencyname = new_reseaerchfrequency.researchfrequencyname
				ActivityDetails.AddChange(old_researchfrequencyname, new_researchfrequencyname, activity.activityid, Constants.Field_Reseach_Frequency)

				old_month1 = new_month1 = ''
				if researchdetails.quest_month_1:
					old_month1 = Months.getDescription(researchdetails.quest_month_1)
				if 'quest_month_1' in params and params['quest_month_1'] != '' and params['quest_month_1'] != None:
					new_month1 = Months.getDescription(int(params['quest_month_1']))
				ActivityDetails.AddChange(old_month1, new_month1, activity.activityid, Constants.Field_Month1)
				old_month2 = new_month2 = ''
				if researchdetails.quest_month_2:
					old_month2 = Months.getDescription(researchdetails.quest_month_2)
				if 'quest_month_2' in params and params['quest_month_2'] != '' and params['quest_month_2'] != None:
					new_month2 = Months.getDescription(int(params['quest_month_2']))
				ActivityDetails.AddChange(old_month2, new_month2, activity.activityid, Constants.Field_Month2)
				old_month3 = new_month3 = ''
				if researchdetails.quest_month_3:
					old_month3 = Months.getDescription(researchdetails.quest_month_3)
				if 'quest_month_3' in params and params['quest_month_3'] != '' and params['quest_month_3'] != None:
					new_month3 = Months.getDescription(int(params['quest_month_3']))
				ActivityDetails.AddChange(old_month3, new_month3, activity.activityid, Constants.Field_Month3)
				old_month4 = new_month4 = ''
				if researchdetails.quest_month_4:
					old_month4 = Months.getDescription(researchdetails.quest_month_4)
				if 'quest_month_4' in params and params['quest_month_4'] != '' and params['quest_month_4'] != None:
					new_month4 = Months.getDescription(int(params['quest_month_4']))
				ActivityDetails.AddChange(old_month4, new_month4, activity.activityid, Constants.Field_Month4)

				ActivityDetails.AddChange(researchdetails.last_questionaire_sent, params['last_questionaire_sent'], activity.activityid, Constants.Field_Research_Last_Questionaire_Sent)
				ActivityDetails.AddChange(researchdetails.notes, params['notes'], activity.activityid, Constants.Field_Research_Notes)
				ActivityDetails.AddChange(researchdetails.last_research_date, params['last_research_completed'], activity.activityid, Constants.Field_Research_Last_Researched_Completed)
				#ActivityDetails.AddChange(researchdetails.no_sync, params["no_sync"], activity.activityid, Constants.Field_Profile)

				researchdetails.surname = params["surname"]
				researchdetails.firstname = params["firstname"]
				researchdetails.prefix = params["prefix"]
				researchdetails.email = params["email"]
				#researchdetails.tel = params["tel"]
				researchdetails.job_title = params["job_title"]
				researchdetails.researchfrequencyid = params["researchfrequencyid"]
				researchdetails.notes = params["notes"]
				#researchdetails.no_sync = params["no_sync"]
				if params["last_research_completed"]:
					researchdetails.last_research_date = params["last_research_completed"]
				if params["last_questionaire_sent"]:
					researchdetails.last_questionaire_sent = params["last_questionaire_sent"]

				researchdetails.quest_month_1 = params["quest_month_1"]
				researchdetails.quest_month_2 = params["quest_month_2"]
				researchdetails.quest_month_3 = params["quest_month_3"]
				researchdetails.quest_month_4 = params["quest_month_4"]

			else:
				researchdetails = ResearchDetails(outletid=params["outletid"],
								       surname=params["surname"],
								       firstname=params["firstname"],
								       prefix=params["prefix"],
								       email=params["email"],
								       #tel=params["tel"],
								       job_title=params["job_title"],
								       researchfrequencyid=params["researchfrequencyid"],
				               last_questionaire_sent=params["last_questionaire_sent"],
								       notes=params["notes"]
				                       #no_sync=params["no_sync"]
								      )

				if params["last_research_completed"]:
					researchdetails.last_research_date = params["last_research_completed"]

				researchdetails.quest_month_1 = params["quest_month_1"]
				researchdetails.quest_month_2 = params["quest_month_2"]
				researchdetails.quest_month_3 = params["quest_month_3"]
				researchdetails.quest_month_4 = params["quest_month_4"]
				session.add(researchdetails)
				session.flush()
				outlet = Outlet.query.get(params["outletid"])
				outlet.researchdetailid = researchdetails.researchdetailid

				activity = Activity(reasoncodeid=5,
				                reason="",
				                objecttypeid=Constants.Object_Type_Research,
				                objectid=params["outletid"],
				                actiontypeid=Constants.Research_Reason_Add,
				                userid=params['userid'],
				                parentobjectid=params["outletid"],
				                parentobjecttypeid=ptype
				               )
				session.add(activity)
			transaction.commit()
		except:
			LOGGER.exception("ResearchDetails_update")
			transaction.rollback()
			raise

class ResearchDetailsDesk(ResearchDetails):
	"""Desk version need to override some function !!"""
	def __json__(self):
		""" jsonify """

		data = ResearchDetails.__json__(self)
		data["outletdeskid"] = self.outletdeskid

		return data

class ResearchGeneral(object):
	""" research General"""

	@classmethod
	def activityreport(cls, params):
		""" activity report """

		dt1 = datetime.datetime.strptime(params['active_report_date'], "%Y-%m-%d")
		dt1 = datetime.date(dt1.year, dt1.month, dt1.day)
		_rows = [("Researcher", "Action", "Count",)]
		tmp = session.execute("""SELECT  u.display_name,at.actiontypedescription,COUNT(*)
			FROM research.activity AS a
		    JOIN internal.actiontypes AS at ON at.actiontypeid = a.actiontypeid
		    JOIN tg_user AS u on u.user_id = userid
		    WHERE a.activitydate::date = :active_report_date
		    GROUP BY u.display_name,at.actiontypedescription
		    ORDER BY u.display_name,at.actiontypedescription""", params, mapper=ReasonCategories)
		_rows.extend(tmp.fetchall())
		if "active_report_detailed" in params:
			_rows.append(("Researcher", "Action", "Outlet", "Employee", "Contact"))
			tmp = session.execute("""SELECT
			u.display_name,
			at.actiontypedescription,
			ot.objecttypename,
			COALESCE(mo.outletname,po.outletname),
			COALESCE(eo.job_title,peo.job_title),
			ContactName(co.prefix,co.firstname,co.middlename,co.familyname,co.suffix)
			FROM research.activity AS a
			JOIN internal.actiontypes AS at ON at.actiontypeid = a.actiontypeid
			JOIN tg_user AS u on u.user_id = userid
			JOIN internal.objecttypes AS ot ON ot.objecttypeid = a.objecttypeid
			LEFT OUTER JOIN outlets  AS mo ON mo.outletid = a.objectid AND a.objecttypeid IN(1,4)
			LEFT OUTER JOIN employees AS eo ON eo.employeeid = a.objectid AND a.objecttypeid = 2
			LEFT OUTER JOIN contacts AS co ON co.contactid = a.objectid AND a.objecttypeid = 5
			LEFT OUTER JOIN outlets  AS po ON po.outletid = a.objectid AND a.objecttypeid IN(1,4)
			LEFT OUTER JOIN employees  AS peo ON peo.employeeid = a.parentobjectid AND a.parentobjecttypeid =2
			WHERE a.activitydate::date = :active_report_date
			ORDER BY u.display_name,at.actiontypedescription""", params, mapper=ReasonCategories)
			_rows.extend(tmp.fetchall())

		return ToCsv(_rows)

class BouncedEmails(BaseSql):
	""" interface too the bounced email """
	Grid_View_Main = """SELECT bd.bounceddistributionid,bd.outletid,o.outletname,bd.employeeid,
ContactName(con.familyname,con.firstname,con.prefix,'','') as contactname,
bd.subject,
COALESCE(o.customerid,-1) AS owneroutletid,
COALESCE(e.customerid,-1) AS owneremployeeid,
to_char(bd.created,'DD/MM/YY') AS createdate_display,
lmd.job_title,
c.customername,
owner.customername AS ownercustomername,
o.prmax_outlettypeid,
st.sourcename

FROM research.bounceddistribution as bd
LEFT OUTER JOIN userdata.listmemberdistribution AS lmd ON lmd.listmemberdistributionid = bd.listmemberdistributionid
LEFT OUTER JOIN userdata.list AS l ON l.listid = lmd.listid
LEFT OUTER JOIN outlets AS o ON o.outletid = bd.outletid
LEFT OUTER JOIN employees AS e ON e.employeeid = bd.employeeid
LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
LEFT OUTER JOIN internal.customers AS c ON c.customerid = l.customerid
LEFT OUTER JOIN internal.customers AS owner ON owner.customerid = o.customerid
LEFT OUTER JOIN internal.sourcetypes AS st ON st.sourcetypeid = e.sourcetypeid"""

	Grid_View_Order = """ ORDER BY  %s %s LIMIT :limit  OFFSET :offset"""
	Grid_View_Count = """SELECT COUNT(*)	FROM research.bounceddistribution AS bd
	LEFT OUTER JOIN userdata.listmemberdistribution AS lmd ON lmd.listmemberdistributionid = bd.listmemberdistributionid
	LEFT OUTER JOIN userdata.list AS l ON l.listid = lmd.listid
	LEFT OUTER JOIN outlets AS o ON o.outletid = bd.outletid"""

	@classmethod
	def get_grid_page(cls, params):
		""" grid based on date"""

		whereused = " WHERE bd.completed = false "

		if params.get("outletname", ""):
			whereused += " AND o.outletname ilike :outletname "
			params["outletname"] = "%" + params["outletname"] + "%"

		if params.get("emailaddress", ""):
			whereused += " AND bd.emailaddress ilike :emailaddress "
			params["emailaddress"] = "%" + params["emailaddress"] + "%"

		if "icustomerid" in params:
			whereused += " AND l.customerid = :icustomerid "

		if params["top50"]:
			# show only the top 50 outlets be number of bounces
			whereused = BaseSql.addclause(whereused, """bd.outletid IN(SELECT o.outletid
			FROM research.bounceddistribution AS bc
			JOIN outlets AS o ON o.outletid = bc.outletid
			WHERE o.sourcetypeid = 2
			GROUP BY o.outletid
			ORDER BY COUNT(*) DESC LIMIT 20)""")

		orderby = BouncedEmails.Grid_View_Order

		if "sortfield" not in params:
			params["sortfield"] = "bd.created"
			params['direction'] = "DESC"

		if params["sortfield"] == "createdate_display":
			params["sortfield"] = "bd.created"

		if params["sortfield"] == "sourcename":
			orderby = """ORDER BY  %s %s, bd.created DESC LIMIT :limit OFFSET :offset"""

		return BaseSql.getGridPage(params,
		                            'bd.created',
		                            'bounceddistributionid',
		                            BouncedEmails.Grid_View_Main + whereused + orderby,
		                            BouncedEmails.Grid_View_Count + whereused,
		                            cls)

	@classmethod
	def get_rest_page(cls, params):
		"""Get As Rest Page"""

		return cls.grid_to_rest(cls.get_grid_page(params),
		                        params["offset"])

	_Cacaded_Completed = """UPDATE research.bounceddistribution
	SET completed = true
	WHERE listmemberdistributionid IN(SELECT listmemberdistributionid FROM userdata.listmemberdistribution WHERE emailaddress =
	(SELECT emailaddress FROM userdata.listmemberdistribution AS lmd WHERE listmemberdistributionid = :listmemberdistributionid));"""

	@classmethod
	def completed(cls, params):
		""" When a bounced email has been dealt with """

		transaction = cls.sa_get_active_transaction()

		try:
			bounced = BouncedEmails.query.get(params["bounceddistributionid"])

			if bounced:
				bounced.completed_date = datetime.datetime.now()
				bounced.completed = True

				# remove text take up too much room
				bounced.emailmessage = None
				bounced.completed_userid = params["userid"]
				bounced.reasoncodeid = params["reasoncodeid"]
				bounced.reason = params["reason"]

			# remove lock record
			LockedObject.expirelock(Constants.Object_Type_Bounced_Email,
			                         Constants.Lock_Type_Warning,
			                         params["bounceddistributionid"])

			if bounced:
				# Cascade the completed too all references too thhis address
				cls.sqlExecuteCommand(BouncedEmails._Cacaded_Completed,
				                       dict(listmemberdistributionid=bounced.listmemberdistributionid))

			# need to set the research flag for the outlet as well
			if params["has_been_research"] and bounced:
				research = ResearchControRecord.query.filter_by(
				  objectid=bounced.outletid,
				  objecttypeid=Constants.Object_Type_Outlet).one()
				research.last_research_date = date.today()

				from prcommon.model.outlet import Outlet

				outlet = Outlet.query.get(bounced.outletid)
				if outlet.researchdetailid:
					research = ResearchDetails.query.get(outlet.researchdetailid)
					research.last_research_date = date.today()
				else:
					research = session.query(ResearchDetails).filter(ResearchDetails.outletid == params["outletid"]).scalar()
					if research:
						research.last_research_date = date.today()
						outlet.researchdetailid = research.researchdetailid
					else:
						research = ResearchDetails(outletid=bounced.outletid,
						                           last_research_date=date.today())
						session.add(research)
						session.flush()
						outlet.researchdetailid = research.researchdetailid

			transaction.commit()
		except:
			LOGGER.exception("BouncedEmails-Completed")
			transaction.rollback()
			raise

	@classmethod
	def MarkAsCompleted(cls, params):
		""" When a bounced email has been dealt with """
		transaction = cls.sa_get_active_transaction()

		try:
			bde = BouncedEmails.query.get(params["bounceddistributionid"])

			bde.completed_date = datetime.datetime.now()
			bde.completed = True
			bde.completed_userid = params["userid"]
			bde.reasoncodeid = 5
			bde.reason = "Ignored"

			# remove lock record
			LockedObject.expirelock(Constants.Object_Type_Bounced_Email,
			                        Constants.Lock_Type_Warning,
			                        params["bounceddistributionid"])

			# Cascade the completed too all references too thhis address
			cls.sqlExecuteCommand(BouncedEmails._Cacaded_Completed, dict(listmemberdistributionid=bd.listmemberdistributionid))

			transaction.commit()
		except:
			LOGGER.exception("MarkAsCompleted")
			transaction.rollback()
			raise

	@classmethod
	def getMsgText(cls, bounceddistributionid):
		""" get the text content of the message """

		bd1 = BouncedEmails.query.get(bounceddistributionid)

		# does work with direct string for some reason
		msg = email.message_from_file(StringIO.StringIO(bd1.emailmessage))
		ang = AnalysisMessage(msg, False)
		ang.analysis()

		try:
			return msg.as_string("utf-8", 'xmlcharrefreplace').replace("\n", "<br/>").replace("p.gif", "")
		except:
			return msg.as_string().replace("\n", "<br/>").replace("p.gif", "")

	@classmethod
	def getMsgBasicText(cls, bounceddistributionid):
		""" get the text content of the message """

		bd1 = BouncedEmails.query.get(bounceddistributionid)

		# does work with direct string for some reason
		msg = email.message_from_file(StringIO.StringIO(bd1.emailmessage))
		ang = AnalysisMessage(msg, False)
		ang.analysis()

		tmp = ang._getMessageBody()
		try:
			return tmp.replace("\n", "<br/>").replace("p.gif", "")
		except:
			return tmp.replace("\n", "<br/>").replace("p.gif", "")


	@classmethod
	def get_and_lock(cls, bounceddistributionid, userid):
		""" get and set in use date """

		# check to see if record is locked
		lock = LockedObject.islocked(Constants.Object_Type_Bounced_Email,
		                               Constants.Lock_Type_Warning,
		                               bounceddistributionid,
		                               userid)
		if lock and lock.locked:
			return lockedreturn(lock=lock)

		transaction = cls.sa_get_active_transaction()

		try:
			bd1 = BouncedEmails.query.get(bounceddistributionid)
			LockedObject.addlock(Constants.Object_Type_Bounced_Email,
		                               Constants.Lock_Type_Warning,
		                               bounceddistributionid,
			                             userid)

			transaction.commit()
			return stdreturn(data=bd1)
		except:
			LOGGER.exception("get_and_lock")
			transaction.rollback()
			raise

class DataSourceTranslations(BaseSql):
	"DataSourceTranslations"

	def __json__(self):
		"too json"
		props = {}
		for key in self.__dict__:
			if not key.startswith('_sa_') and key != "fieldname":
				props[key] = getattr(self, key)
			if key == "fieldname":
				props[key] = self.fieldname.strip()

		return props

	@staticmethod
	def do_translations(sourcetypeid, fieldname, limit=None, lan="de", force=False):
		"""Add english translation to help """

		nbr = 0
		transaction = BaseSql.get_session_transaction()

		for row in session.query(DataSourceTranslations).\
		  filter(DataSourceTranslations.sourcetypeid == sourcetypeid).\
		  filter(DataSourceTranslations.fieldname == fieldname).all():

			if row.english or not row.sourcetext:
				continue
			nbr += 1

			values = {"q" : row.sourcetext.encode("utf-8"), "langpair": lan + "|en", "de": "chris.hoy@prmax.co.uk",}
			req = urllib2.Request("http://mymemory.translated.net/api/get",
			                      urllib.urlencode(values),
		                        {'user-agent':'text/html'})
			#handler=urllib2.HTTPHandler(debuglevel=1)
			opener = urllib2.build_opener()
			urllib2.install_opener(opener)
			retdata = simplejson.load(urllib2.urlopen(req).fp)
			print row.sourcetext.encode("utf-8")
			word_translated = retdata["responseData"]["translatedText"]
			if word_translated.find("YOU USED ALL AVAILABLE FREE TRANSLATION FOR TODAY") != -1:
				break

			if limit and nbr > limit:
				break

			row.english = retdata["responseData"]["translatedText"]

		transaction.commit()

class CirculationSourceCodes(BaseSql):
	""" codes for circulationsource """

	List = """
	SELECT c.circulationsourceid AS id,c.circulationsourcedescription as name
	FROM internal.circulationsource as c
	ORDER BY c.circulationsourceid"""

	@classmethod
	def getLookUp(cls, params):
		""" return list of circulationsource codes """
		return cls.sqlExecuteCommand(text(CirculationSourceCodes.List),
		                               params,
		                               BaseSql.ResultAsEncodedDict)
#########################################################
## Map object to db
#########################################################

ReasonCodes.mapping = Table('reasoncodes', metadata, autoload=True, schema='internal')
ReasonCategories.mapping = Table('reasoncategories', metadata, autoload=True, schema='internal')
Activity.mapping = Table('activity', metadata, autoload=True, schema='research')
ActivityDetails.mapping = Table('activitydetails', metadata, autoload=True, schema='research')
IgnorePrnEmployees.mapping = Table('ignore_prn_employees', metadata, autoload=True, schema='research')
IgnorePrnOutlets.mapping = Table('ignore_prn_outlets', metadata, autoload=True, schema='research')
ResearchControRecord.mapping = Table('research_control_record', metadata, autoload=True, schema="internal")
IgnorePrnContacts.mapping = Table('ignore_prn_contacts', metadata, autoload=True, schema='research')
ResearchDetails.mapping = Table('researchdetails', metadata, autoload=True, schema='research')
ResearchDetailsDesk.mapping = Table('researchdetailsdesk', metadata, autoload=True, schema='research')
ResearchFrequencies.mapping = Table('researchfrequencies', metadata, autoload=True, schema="internal")
BouncedEmails.mapping = Table('bounceddistribution', metadata, autoload=True, schema='research')
DataSourceTranslations.mapping = Table('datasourcetranslations', metadata, autoload=True, schema='research')
FrequencyCodes.mapping = Table('frequencies', metadata, autoload=True, schema='internal')
CirculationSourceCodes.mapping = Table('circulationsource', metadata, autoload=True, schema='internal')

mapper(ReasonCodes, ReasonCodes.mapping)
mapper(Activity, Activity.mapping)
mapper(ActivityDetails, ActivityDetails.mapping)
mapper(IgnorePrnEmployees, IgnorePrnEmployees.mapping)
mapper(IgnorePrnOutlets, IgnorePrnOutlets.mapping)
mapper(ResearchControRecord, ResearchControRecord.mapping)
mapper(ReasonCategories, ReasonCategories.mapping)
mapper(IgnorePrnContacts, IgnorePrnContacts.mapping)
mapper(ResearchDetails, ResearchDetails.mapping)
mapper(ResearchFrequencies, ResearchFrequencies.mapping)
mapper(BouncedEmails, BouncedEmails.mapping)
mapper(DataSourceTranslations, DataSourceTranslations.mapping)
mapper(ResearchDetailsDesk, ResearchDetailsDesk.mapping)
mapper(FrequencyCodes, FrequencyCodes.mapping)
mapper(CirculationSourceCodes, CirculationSourceCodes.mapping)

