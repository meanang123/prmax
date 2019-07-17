# -*- coding: utf-8 -*-
"""Advance Features Model"""
#-----------------------------------------------------------------------------
# Name:        advance.py
# Purpose:		Access to the advance features system.
#
# Author:      Chris Hoy
#
# Created:     06-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010
#-----------------------------------------------------------------------------
import logging
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, Integer, text
from ttl.dates import DateExtended
from prcommon.model.research import Activity, ActivityDetails
from prcommon.model.contact import Contact
from prcommon.model.employee import Employee
from prcommon.model.interests import Interests
from prcommon.model.common import BaseSql
from prcommon.model.list import List
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prmax")

class AdvanceFeature(BaseSql):
	""" individual advance features record """

	ListDataOutletSingle = """
	SELECT
	  a.advancefeatureid,
	  a.feature,
	  ToPartialDate(a.publicationdate_description,a.publicationdate_date,a.publicationdate_partial) as pub_date_display,
	  ToPartialDate(a.cover_description,a.cover_date,a.cover_partial) as cover_date_display,
	  ToPartialDate(a.editorial_description,a.editorial_date,a.editorial_partial) as editorial_date_display,
	  ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
	  get_override(ecomm.email,comm.email,'','') AS contactemail

	FROM advancefeatures AS a
	JOIN outlets AS o ON o.outletid = a.outletid
	JOIN communications AS comm ON comm.communicationid = o.communicationid
	LEFT OUTER JOIN employees AS e On e.employeeid = COALESCE(a.employeeid,
			(SELECT e1.employeeid FROM employees AS e1 WHERE o.outletid = e1.outletid AND e1.customerid = -1 AND e.job_title ILIKE 'Features Editor' LIMIT 1),
			o.primaryemployeeid)
	LEFT OUTER JOIN contacts AS con ON con.contactid = e.contactid
	LEFT OUTER JOIN communications AS ecomm ON ecomm.communicationid = e.communicationid

	WHERE a.advancefeatureid = :advancefeatureid"""

	def __json__(self):
		""" json record add the extra fields that are needed
		"""
		props = {}
		for key in self.__dict__:
			if not key.startswith('_sa_'):
				props[key] = getattr(self, key)

		props["editorial_date_full"] = self.editorial_date_full
		props["cover_date_full"] = self.cover_date_full
		props["publication_date_full"] = self.publication_date_full

		data = AdvanceFeature.sqlExecuteCommand(
		  AdvanceFeature.ListDataOutletSingle,
		  dict(advancefeatureid=self.advancefeatureid),
		  BaseSql._singleResultAsDict)
		props.update(data)

		return props

	@classmethod
	def getExt(cls, kw):
		""" get the details """

		interests = session.query(AdvanceFeatureInterestsView).filter_by(
		  advancefeatureid=kw["advancefeatureid"]).all()

		return dict(advance=AdvanceFeature.query.get(kw["advancefeatureid"]),
		            interests=interests,
		            interests_text=", ".join([interest.interestname for interest in interests]))

	@property
	def editorial_date_full(self):
		""" combined details editorial date """
		return DateExtended.to_json_obj(self, "editorial")

	@property
	def cover_date_full(self):
		""" full cover date"""
		return DateExtended.to_json_obj(self, "cover")

	@property
	def publication_date_full(self):
		""" publication date"""
		return DateExtended.to_json_obj(self, "publicationdate")

	@classmethod
	def research_new(cls, kw):
		""" Create a new record for research """

		try:
			if kw.has_key("advancefeatureid"):
				kw.pop("advancefeatureid")

			transaction = cls.sa_get_active_transaction()

			DateExtended.to_db_fields(kw, "editorial")
			DateExtended.to_db_fields(kw, "cover")
			DateExtended.to_db_fields(kw, "publicationdate")

			advance = AdvanceFeature(**kw)
			# force to internal customerid
			advance.customerid = -1
			session.add(advance)
			session.flush()
			#  interests
			for interestid in kw['interests'] if kw['interests'] else []:
				interest = AdvanceFeatureInterests(advancefeatureid=advance.advancefeatureid,
				                                   interestid=interestid,
				                                   customerid=-1)
				session.add(interest)

			# activy record
			activity = Activity(reasoncodeid=kw["reasoncodeid"],
			                reason=kw.get("reason", ""),
			                objecttypeid=Constants.Object_Type_Advance,
			                objectid=advance.advancefeatureid,
			                actiontypeid=Constants.Research_Reason_Add,
			                userid=kw['userid'],
			                parentobjectid=advance.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet,
			                name=advance.feature
			                )
			session.add(activity)

			transaction.commit()
			return advance.advancefeatureid
		except:
			LOGGER.exception("Features add")
			transaction.rollback()
			raise

	@classmethod
	def research_delete(cls, kw):
		""" delete an advance feature and log the """

		try:

			transaction = cls.sa_get_active_transaction()

			# get record and activity record
			a = AdvanceFeature.query.get(kw["advancefeatureid"])
			ac = Activity(reasoncodeid=kw["reasoncodeid"],
			                reason=kw["reason"],
			                objecttypeid=Constants.Object_Type_Advance,
			                objectid=kw["advancefeatureid"],
			                actiontypeid=Constants.Research_Reason_Delete,
			                userid=kw['userid'],
			                parentobjectid=a.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet,
			                name=a.feature
			                )
			session.add(ac)
			session.delete(a)
			transaction.commit()
		except:
			LOGGER.exception("Delete")
			transaction.rollback()
			raise

	@classmethod
	def research_update(cls, kw):
		""" Update record for research """
		try:
			advancefeatureid = kw["advancefeatureid"]
			kw.pop("advancefeatureid")

			DateExtended.to_db_fields(kw, "editorial")
			DateExtended.to_db_fields(kw, "cover")
			DateExtended.to_db_fields(kw, "publicationdate")

			transaction = cls.sa_get_active_transaction()

			a = AdvanceFeature.query.get(advancefeatureid)
			activity = Activity(reasoncodeid=kw["reasoncodeid"],
			                    reason=kw.get("reason", ""),
			                    objecttypeid=Constants.Object_Type_Advance,
			                    objectid=advancefeatureid,
			                    actiontypeid=Constants.Research_Reason_Update,
			                    userid=kw['userid'],
			                    parentobjectid=a.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Outlet,
			                    name=a.feature
			                    )
			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(a.editorial_partial, kw["editorial_partial"], activity.activityid, Constants.Field_Editorial_Partial)
			ActivityDetails.AddChange(a.editorial_date, kw["editorial_date"], activity.activityid, Constants.Field_Editorial_Date)
			ActivityDetails.AddChange(a.editorial_description, kw["editorial_description"], activity.activityid, Constants.Field_Editorial_Description)
			ActivityDetails.AddChange(a.cover_description, kw["cover_description"], activity.activityid, Constants.Field_Cover_Partial)
			ActivityDetails.AddChange(a.cover_partial, kw["cover_partial"], activity.activityid, Constants.Field_Cover_Date)
			ActivityDetails.AddChange(a.cover_date, kw["cover_date"], activity.activityid, Constants.Field_Cover_Description)
			ActivityDetails.AddChange(a.publicationdate_partial, kw["publicationdate_partial"], activity.activityid, Constants.Field_Publicationdate_Partial)
			ActivityDetails.AddChange(a.publicationdate_date, kw["publicationdate_date"], activity.activityid, Constants.Field_Publicationdate_Date)
			ActivityDetails.AddChange(a.publicationdate_description, kw["editorial_description"], activity.activityid, Constants.Field_Publicationdate_Description)
			ActivityDetails.AddChange(a.featuredescription, kw["featuredescription"], activity.activityid, Constants.Field_Feature_Description)
			ActivityDetails.AddChange(a.feature, kw["feature"], activity.activityid, Constants.Field_Feature)
			old_employeename = new_employeename = 'No Contact'
			if a.employeeid != -1 and a.employeeid != None:
				old_employee = session.query(Contact).\
				    join(Employee, Employee.contactid == Contact.contactid).\
				    filter(Employee.employeeid == a.employeeid).scalar()
				old_employeename = old_employee.getName()
			if 'employeeid' in kw and kw['employeeid'] != None:
				new_employee = session.query(Contact).\
				    join(Employee, Employee.contactid == Contact.contactid).\
				    filter(Employee.employeeid == int(kw['employeeid'])).scalar()
				new_employeename = new_employee.getName()
			ActivityDetails.AddChange(old_employeename, new_employeename, activity.activityid, Constants.Field_Feature_Contact)

			a.editorial_partial = kw["editorial_partial"]
			a.editorial_date = kw["editorial_date"]
			a.editorial_description = kw["editorial_description"]
			a.cover_description = kw["cover_description"]
			a.cover_partial = kw["cover_partial"]
			a.cover_date = kw["cover_date"]
			a.publicationdate_partial = kw["publicationdate_partial"]
			a.publicationdate_date = kw["publicationdate_date"]
			a.publicationdate_description = kw["publicationdate_description"]
			a.featuredescription = kw["featuredescription"]
			a.feature = kw["feature"]
			a.employeeid = kw["employeeid"] if kw.has_key("employeeid") else None

			dbinterest = session.query(AdvanceFeatureInterestsView).filter_by(
			    advancefeatureid=advancefeatureid).all()
			dbinterest2 = []
			interests = kw['interests'] if kw['interests'] else []
			for advanceinterest in dbinterest:
				dbinterest2.append(advanceinterest.interestid)
				if not advanceinterest.interestid in interests:
					tmp = AdvanceFeatureInterests.query.get(advanceinterest.advancefeatureinterestid)
					del_interest = Interests.query.get(tmp.interestid)
					ActivityDetails.AddDelete(del_interest.interestname, activity.activityid, Constants.Field_Feature_Interest)
					session.delete(tmp)

			for interestid in interests:
				if not interestid in dbinterest2:
					interest = AdvanceFeatureInterests(
						advancefeatureid=advancefeatureid,
						interestid=interestid)
					add_interest = Interests.query.get(interestid)
					ActivityDetails.AddAdd(add_interest.interestname, activity.activityid, Constants.Field_Feature_Interest)
					session.add(interest)

			transaction.commit()
			return advancefeatureid
		except:
			LOGGER.exception("research_update")
			transaction.rollback()
			raise

	@classmethod
	def research_duplicate(cls, kw):
		""" Duplicate Record """

		try:
			old = AdvanceFeature.query.get(kw["advancefeatureid"])
			props = {}
			for key in old.__dict__:
				if not key.startswith('_sa_') and key != "advancefeatureid":
					props[key.encode("ascii")] = getattr(old, key)

			transaction = cls.sa_get_active_transaction()

			props["feature"] = kw["feature"]
			advance = AdvanceFeature(**props)
			session.add(advance)
			session.flush()
			#  interests
			for interest in session.query(AdvanceFeatureInterestsView).filter_by(
			    advancefeatureid=old.advancefeatureid).all():
				i = AdvanceFeatureInterests(advancefeatureid=advance.advancefeatureid,
				                            interestid=interest.interestid,
				                            customerid=-1)
				session.add(i)

			activity = Activity(reasoncodeid=kw["reasoncodeid"],
			                    reason=kw.get("reason", ""),
			                    objecttypeid=Constants.Object_Type_Advance,
			                    objectid=advance.advancefeatureid,
			                    actiontypeid=Constants.Research_Reason_Add,
			                    userid=kw['userid'],
			                    parentobjectid=advance.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Outlet,
			                    name=advance.feature
			                    )
			session.add(activity)

			transaction.commit()
			return advance.advancefeatureid
		except:
			LOGGER.exception("Feature duplicate")
			transaction.rollback()
			raise

	ListDataOutlet = """
		SELECT
			a.advancefeatureid,
	    a.feature,
	    ToPartialDate(a.publicationdate_description,a.publicationdate_date,a.publicationdate_partial) as pub_date_display
		FROM advancefeatures AS a
		WHERE a.outletid = :outletid
	    ORDER BY %s %s
		LIMIT :limit  OFFSET :offset """

	ListDataOutletCount = """ SELECT COUNT(*) FROM advancefeatures WHERE outletid = :outletid"""

	@classmethod
	def getGridPageOutlet(cls, kw):
		""" List of featured for an outlet """

		if not "outletid" in kw:
			return  dict(numRows=0,	items=[], identifier='advancefeatureid')

		if kw["sortfield"] == "pub_date_display":
			kw["sortfield"] = "a.publicationdate_date %s, UPPER(a.feature) " % kw["direction"]

		if not kw['sortfield']:
			kw['direction'] = 'desc'
			kw["sortfield"] = "a.publicationdate_date %s, UPPER(a.feature) " % kw["direction"]


		return BaseSql.getGridPage(kw,
								"a.publicationdate_date %s, UPPER(a.feature) " % kw["direction"],
								'advancefeatureid',
								AdvanceFeature.ListDataOutlet,
								AdvanceFeature.ListDataOutletCount,
								cls)

	@classmethod
	def get_rest_outlet(cls, params):
		"""get list of features """

		return cls.grid_to_rest_ext(
		  cls.getGridPageOutlet(params),
		  params["offset"],
		  False)

class AdvanceFeatureInterests(BaseSql):
	""" individual advance  features interest record """
	pass

class AdvanceFeatureInterestsView(BaseSql):
	""" view of the advance features interests """
	pass

class AdvanceFeatureResearch(object):
	""" Research specific function """
	pass

class AdvanceFeaturesList(BaseSql):
	""" List of saved advance features """

	_Copy_To_Search_Session = "SELECT * FROM copy_advance_session(:customerid,:userid,:searchtypeid,:advancefeatureslistid, :selector)"
	@classmethod
	def toTempStandingList(cls, kw):
		""" convert the advance list or search results into a temporary list"""

		cls.fixUpdateId(kw)

		try:
			transaction = cls.sa_get_active_transaction()

			cls.sqlExecuteCommand(
			  text(AdvanceFeaturesList._Copy_To_Search_Session),
			  kw)
		except:
			transaction.rollback()
			LOGGER.exception("Features toTempStandingList")
			raise

	@classmethod
	def fixUpdateId(cls, kw):
		""" Fix up thhe list id """
		if kw.get("advancefeatureslistid", -1) == -1 or kw.get("advancefeatureslistid", "") == "-1":
			kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])
		else:
			kw["advancefeatureslistid"] = int(kw["advancefeatureslistid"])

	@classmethod
	def getDefaultListId(cls, userid, customerid):
		""" get the default internal list for a specufuc user """

		a = session.query(AdvanceFeaturesList).filter_by(userid=userid,
		              advancefeatureslisttypeid=2).all()
		if not a:
			a = AdvanceFeaturesList(userid=userid,
			                        customerid=customerid,
			                        advancefeatureslistdescription="Search Results",
			                        advancefeatureslisttypeid=2)
			session.flush()
		else:
			a = a[0]

		return a.advancefeatureslistid

	_Count_All = "SELECT * FROM advancecount(:advancefeatureslistid)"
	@classmethod
	def getCount(cls, kw):
		""" return the statistics for a advance list """

		if kw.get("advancefeatureslistid", -1) == -1 or kw.get("advancefeatureslistid", "") == "-1":
			kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

		return cls.sqlExecuteCommand(
		  text(AdvanceFeaturesList._Count_All),
		  kw,
		  BaseSql.SingleResultAsEncodedDict)

	@classmethod
	def Exists(cls, kw):
		""" Check too see if a list name already exists  """
		result = session.query(AdvanceFeaturesList.advancefeatureslistid).filter_by(
		  advancefeatureslistdescription=kw["listname"])
		return result.all()[0][0] if result.count() else None

	@classmethod
	def Exists2(cls, kw):
		""" Check too see if a list name already exists  """
		result = session.query(AdvanceFeaturesList.advancefeatureslistid).filter(
		  AdvanceFeaturesList.advancefeatureslistdescription == kw["listname"]).filter(
		  AdvanceFeaturesList.advancefeatureslistid != kw["advancefeatureslistid"])
		return result.all()[0][0] if result.count() else None


	_Copy_List = """SELECT advance_list_copy(:advancefeatureslistid,:destinationid,:selection);"""
	_Append_List = """SELECT advance_list_append(:advancefeatureslistid,:destinationid,:selection);"""

	@classmethod
	def Copy(cls, kw):
		""" Copy a list from one list to another always delete what their """

		try:
			transaction = cls.sa_get_active_transaction()
			command = AdvanceFeaturesList._Copy_List if kw["overwrite"] == 1 else AdvanceFeaturesList._Append_List

			if kw.get("advancefeatureslistid", -1) == -1 or kw.get("advancefeatureslistid", "") == "-1":
				kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

			cls.sqlExecuteCommand(text(command), kw, None)

			transaction.commit()
			return kw["destinationid"]
		except:
			transaction.rollback()
			LOGGER.exception("Copy")
			raise

	@classmethod
	def AddCopy(cls, kw):
		""" Add a new list and then copy a list into it"""

		try:
			transaction = cls.sa_get_active_transaction()

			s = AdvanceFeaturesList(
			  customerid=kw["customerid"],
			  userid=kw["userid"],
			  advancefeatureslistdescription=kw["listname"])
			session.add(s)
			session.flush()
			kw["destinationid"] = s.advancefeatureslistid

			if kw.get("advancefeatureslistid", -1) == -1 or kw.get("advancefeatureslistid", "") == "-1":
				kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

			cls.sqlExecuteCommand(text(AdvanceFeaturesList._Copy_List), kw, None)

			transaction.commit()
			return kw["destinationid"]
		except:
			transaction.rollback()
			LOGGER.exception("AddCopy")
			raise

	@classmethod
	def Add(cls, kw):
		""" Add a new list to the system """

		transaction = cls.sa_get_active_transaction()
		try:
			s = AdvanceFeaturesList(
			  customerid=kw["customerid"],
			  userid=kw["userid"],
			  advancefeatureslistdescription=kw["listname"])
			session.add(s)
			session.flush()
			transaction.commit()
			return s.advancefeatureslistid
		except:
			transaction.rollback()
			LOGGER.exception("Advance_list_Add")
			raise

	@classmethod
	def Rename(cls, kw):
		""" Rename list  """

		transaction = cls.sa_get_active_transaction()
		try:
			s = AdvanceFeaturesList.query.get(kw["advancefeatureslistid"])
			s.advancefeatureslistdescription = kw["listname"]
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("Advance_list_Rename")
			raise

	@classmethod
	def Delete(cls, listid):
		""" Delete a advance list """

		transaction = cls.sa_get_active_transaction()
		try:
			s = AdvanceFeaturesList.query.get(listid)
			session.delete(s)
			session.flush()
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("Advance_list_Delete")
			raise

	_FeaturesListForDelete = """SELECT l.advancefeatureslistid FROM userdata.advancefeatureslist AS l
		LEFT OUTER JOIN userdata.advancelistusers AS lu ON l.advancefeatureslistid = lu.advancefeatureslistid AND lu.userid = :userid
		WHERE l.advancefeatureslisttypeid = 1 AND l.userid = :userid AND lu.selected = true """

	@classmethod
	def deleteSelectedList(cls, kw):
		""" delete the selected advance lists """

		lists = []
		transaction = cls.sa_get_active_transaction()
		try:
			for row in session.execute(text(AdvanceFeaturesList._FeaturesListForDelete), kw, cls):
				lists.append(row[0])
				s = AdvanceFeaturesList.query.get(row[0])
				session.delete(s)
				session.flush()
			transaction.commit()
		except:
			transaction.rollback()
			LOGGER.exception("deleteSelectedList")
			raise
		return lists

	@classmethod
	def get(cls, advancefeatureslistid):
		""" get the details oof a specific list """

		return AdvanceFeaturesList.query.get(advancefeatureslistid)

	@classmethod
	def getExt(cls, advancefeatureslistid):
		""" get the details of a specific list """

		qty = session.query(AdvanceFeaturesListMembers.advancefeatureslistid).filter_by(advancefeatureslistid=advancefeatureslistid).count()
		return dict(advance=AdvanceFeaturesList.query.get(advancefeatureslistid),
		            qty=qty)

	__List_Lists = """
	SELECT l.advancefeatureslistid,
		l.advancefeatureslistdescription,
	  COALESCE( lu.selected, false ) AS selected,
	  COALESCE( (SELECT COUNT(*) FROM userdata.advancefeatureslistmembers AS aft WHERE aft.advancefeatureslistid = l.advancefeatureslistid ),0) AS qty

	FROM userdata.advancefeatureslist AS l
	LEFT OUTER JOIN userdata.advancelistusers AS lu ON l.advancefeatureslistid = lu.advancefeatureslistid AND lu.userid = :userid
	WHERE l.advancefeatureslisttypeid = 1 AND l.userid = :userid """

	__Lists_Lists_Order = """ORDER BY %s %s
	LIMIT :count OFFSET :start"""

	__List_Lists_Count = """
	SELECT COUNT(*) FROM userdata.advancefeatureslist
	WHERE advancefeatureslisttypeid = 1 AND userid = :userid """

	@classmethod
	def getGridPage(cls, kw):
		""" get list of lists """

		whereclause = " "
		if kw.has_key("advancefeatureslistdescription") and kw["advancefeatureslistdescription"]:
			whereclause = " AND advancefeatureslistdescription ilike :whereused "
			kw["whereused"] = kw["advancefeatureslistdescription"][:-1] + "%"

		def_sort = 'UPPER(advancefeatureslistdescription)'
		if "sortfield" in kw:
			if kw["sortfield"] == "advancefeatureslistdescription":
				kw["sortfield"] = def_sort

		return BaseSql.getGridPage(kw,
		    def_sort,
		    'advancefeatureslistid',
		    AdvanceFeaturesList.__List_Lists + whereclause + AdvanceFeaturesList.__Lists_Lists_Order,
		    AdvanceFeaturesList.__List_Lists_Count + whereclause,
		    cls)

	__Command_List_Count_All = """SELECT * FROM advancelistmaintcount(:customerid,:userid)"""

	@classmethod
	def getListMaintCount(cls, customerid, userid):
		""" getListMaintCount"""

		return cls.sqlExecuteCommand(
			text(AdvanceFeaturesList.__Command_List_Count_All),
			dict(customerid=customerid, userid=userid),
			BaseSql._singleResultAsDict)

	@classmethod
	def Open(cls, kw):
		""" if this is a single list then just specificed list else open all the list and ... """

		lists = [listid for listid in kw["lists"] if listid]

		if len(lists) == 1:
			kw["advancefeatureslistid"] = lists[0]
		else:
			kw["advancefeatureslistid"] = -1
			lists = [row[0] for row in session.query(AdvanceListUser.advancefeatureslistid).filter_by(userid=kw["userid"], selected=True).all()]

			transaction = cls.sa_get_active_transaction()
			try:
				command = text(AdvanceFeaturesList._Copy_List)
				params = dict(destinationid=AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"]))
				AdvanceFeaturesListMembers.Clear(params["destinationid"])
				for listid in lists:
					params["advancefeatureslistid"] = listid
					cls.sqlExecuteCommand(command, params, None)
			except:
				transaction.rollback()
				LOGGER.exception("Features Open")
				raise

		return AdvanceFeaturesList.getCount(kw)


	_Copy_Advance_To_Standing_List = """SELECT advance_to_standing(:advancefeatureslistid,:listid,:prmaxroleid,:selection );"""

	@classmethod
	def SaveToStanding(cls, kw):
		""" Copy an advance list to a specific standing list """

		kw["prmaxroleid"] = -1
		if kw["advancefeatureslistid"] == -1:
			kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

		transaction = cls.sa_get_active_transaction()
		try:
			cls.sqlExecuteCommand(text(AdvanceFeaturesList._Copy_Advance_To_Standing_List), kw, None)
		except:
			transaction.rollback()
			LOGGER.exception("Features SaveToStanding")
			raise

	@classmethod
	def SaveToNewStanding(cls, kw):
		""" Copy an advance list to a specific new standing list """

		kw["prmaxroleid"] = -1
		if kw["advancefeatureslistid"] == -1:
			kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

		transaction = cls.sa_get_active_transaction()
		try:
			# create new list
			l = List(customerid=kw["customerid"],
			         listname=kw["listname"])
			session.add(l)
			session.flush()
			kw["listid"] = l.listid
			# copy too list
			session.execute(text(AdvanceFeaturesList._Copy_Advance_To_Standing_List), kw, cls)
		except:
			transaction.rollback()
			LOGGER.exception("Features SaveToStanding")
			raise

	_Save_Advance_Results_To_List = """SELECT advance_list_append(:sourceid,:advancefeatureslistid,:selection);"""
	@classmethod
	def ResultsTolist(cls, kw):
		""" Save the search result to a specific list """

		kw["sourceid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])
		transaction = cls.sa_get_active_transaction()
		try:
			cls.sqlExecuteCommand(text(AdvanceFeaturesList._Save_Advance_Results_To_List), kw, None)
		except:
			transaction.rollback()
			LOGGER.exception("Features ResultsTolist")
			raise

class AdvanceFeaturesListMembers(BaseSql):
	""" memebers of an advance features list"""

	_Delete_Selection = "SELECT * FROM advance_deleteselection(:advancefeatureslistid, :deleteoptions)"
	@classmethod
	def DeleteSelection(cls, kw):
		""" Delete memebers of the list based upon the selection """

		if kw["advancefeatureslistid"] == -1:
			kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

		return cls.sqlExecuteCommand(
		  text(AdvanceFeaturesListMembers._Delete_Selection),
		  kw,
		  BaseSql._singleResultAsDict,
		  True)

	_Clear = "DELETE FROM userdata.advancefeatureslistmembers WHERE advancefeatureslistid = :advancefeatureslistid"
	@classmethod
	def Clear(cls, advancefeatureslistid):
		""" Delete all the data in an advance features list """
		return cls.sqlExecuteCommand(
		  text(AdvanceFeaturesListMembers._Clear),
		  dict(advancefeatureslistid=advancefeatureslistid),
		  None)


	@classmethod
	def DeleteMembers(cls, kw):
		""" Delete all the members of a list """
		AdvanceFeaturesList.fixUpdateId(kw)
		transaction = cls.sa_get_active_transaction()
		try:
			cls.sqlExecuteCommand(text(AdvanceFeaturesListMembers._Clear), kw, None)
		except:
			transaction.rollback()
			LOGGER.exception("Features DeleteMembers")
			raise


class AdvanceFeatureResultView(BaseSql):
	""" get an advance feature view """

	Page_View = """
		SELECT * FROM advancefeatureslistresultview
		WHERE advancefeatureslistid = :advancefeatureslistid
	  ORDER BY %s %s
		LIMIT :limit  OFFSET :offset """

	Page_View_Count = """ SELECT COUNT(*) FROM advancefeatureslistresultview WHERE advancefeatureslistid = :advancefeatureslistid"""

	@classmethod
	def getGridPage(cls, kw):
		""" list of memebrs of an advance fatures list  """

		if kw["customerid"] == -2:
			return dict(numRows=0, items=[], identifier='advancefeatureslistmemberid')

		if "advancefeatureslistid" not in kw or kw["advancefeatureslistid"] == "-1":
			kw["advancefeatureslistid"] = AdvanceFeaturesList.getDefaultListId(kw["userid"], kw["customerid"])

		def_order = "publicationdate_date %s, sortname %s, UPPER(SUBSTRING(feature,0,10)) " % (kw["direction"], kw["direction"])
		# fix up sort fields
		if "sortfield" in kw:
			if kw["sortfield"] == "pub_date_display" or kw["sortfield"] == "":
				kw["sortfield"] = def_order
			if kw["sortfield"] == "outletname":
				kw["sortfield"] = 'sortname'
			if kw["sortfield"] == "feature":
				kw["sortfield"] = 'UPPER(feature)'

		return BaseSql.getGridPage(kw,
		                           def_order,
		                           'advancefeatureslistmemberid',
		                           AdvanceFeatureResultView.Page_View,
		                           AdvanceFeatureResultView.Page_View_Count,
		                           cls)

	@classmethod
	def get_rest_page(cls, params):
		"""get as rest page """

		return cls.grid_to_rest_ext(
		  cls.getGridPage(params),
		  params["offset"],
		  False)

class AdvanceListUser(object):
	""" user details about an advance list """
	pass




# load tables from db
AdvanceFeature.mapping = Table('advancefeatures', metadata, autoload=True)
AdvanceFeatureInterests.mapping = Table('advancefeaturesinterests', metadata, autoload=True)

AdvanceFeatureInterestsView.mapping = Table('advancefeaturesinterest_view', metadata,
    Column("advancefeatureinterestid", Integer, primary_key=True),
    autoload=True)

AdvanceFeaturesList.mapping = Table('advancefeatureslist', metadata, autoload=True, schema="userdata")
AdvanceFeaturesListMembers.mapping = Table('advancefeatureslistmembers', metadata, autoload=True, schema="userdata")

AdvanceFeatureResultView.mappping = Table('advancefeatureslistresultview', metadata,
    Column("advancefeatureslistmemberid", Integer, primary_key=True),
    autoload=True)

AdvanceListUser.mapping = Table('advancelistusers', metadata, autoload=True, schema="userdata")

mapper(AdvanceFeature, AdvanceFeature.mapping)
mapper(AdvanceFeatureInterests, AdvanceFeatureInterests.mapping)
mapper(AdvanceFeatureInterestsView, AdvanceFeatureInterestsView.mapping)
mapper(AdvanceFeaturesList, AdvanceFeaturesList.mapping)
mapper(AdvanceFeaturesListMembers, AdvanceFeaturesListMembers.mapping)
mapper(AdvanceFeatureResultView, AdvanceFeatureResultView.mappping)
mapper(AdvanceListUser, AdvanceListUser.mapping)
