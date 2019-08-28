# -*- coding: utf-8 -*-
"""Employee Model """
#-----------------------------------------------------------------------------
# Name:        employee.py
# Purpose:		 all employee and contact details
#
# Author:      Chris Hoy
#
# Created:     25/03/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import logging
from datetime import datetime
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, Integer, not_
from sqlalchemy.sql import text
from simplejson import JSONEncoder
from prcommon.model.common import BaseSql
from prcommon.model.contact import Contact
from prcommon.model.communications import Communication, Address
from prcommon.model.caching import CacheStore, CacheControl
from prcommon.model.interests import EmployeeInterestView, Interests
from prcommon.model.research import ResearchDetails
from prcommon.model.research import Activity, ActivityDetails
from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.outletprofile import OutletProfile
from prcommon.model.roles import PRMaxRoles
import prcommon.Constants as Constants
from ttl.dict import DictExt

LOGGER = logging.getLogger("prmax.model")

COMMAND1 = """SELECT
	JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	JSON_ENCODE(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname,
	CASE WHEN oca.address1 IS NULL THEN oa.address1	ELSE oca.address1 END as address1,
	CASE WHEN oca.address1 IS NULL THEN oa.address2	ELSE oca.address2 END as address2,
	CASE WHEN oca.address1 IS NULL THEN oa.townname	ELSE oca.townname END as townname,
	CASE WHEN oca.address1 IS NULL THEN oa.county	ELSE oca.county END as county,
	CASE WHEN oca.address1 IS NULL THEN oa.postcode	ELSE oca.postcode END as postcode,
	o.www,
	get_override(ec_c.tel,e_c.tel,oc_c.tel,o_c.tel) as telephone,
	get_override(ec_c.mobile,e_c.mobile,'','') as mobile,
	get_override(ec_c.fax,e_c.fax,oc_c.fax,o_c.fax) as fax,
	get_override(ec_c.email,e_c.email,o_c.email,o_c.email) as email,
	get_override(ec_c.twitter,e_c.twitter,o_c.twitter,'') AS contact_twitter,
	get_override(ec_c.facebook,e_c.facebook,o_c.facebook,'') AS contact_facebook,
	get_override(ec_c.linkedin,e_c.linkedin,o_c.linkedin,'') AS contact_linkedin,
	get_override(ec_c.instagram,e_c.instagram,o_c.instagram,'') AS contact_instagram

	FROM employees as e
	JOIN outlets as o on o.outletid = e.outletid
	LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = :customerid
	LEFT OUTER JOIN communications as o_c ON o.communicationid = o_c.communicationid
	LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid
	-- employee communications
	LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
	LEFT OUTER JOIN communications as ec_c ON e_c.communicationid = ec_c.communicationid

	LEFT OUTER JOIN addresses as oa ON oa.addressid = o_c.addressid
	LEFT OUTER JOIN addresses as oca ON oca.addressid = oc_c.addressid
	LEFT OUTER JOIN addresses as ea ON ea.addressid = e_c.addressid
	LEFT OUTER JOIN addresses as eca ON eca.addressid = ec_c.addressid

	LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	WHERE e.employeeid = :employeeid"""

class Employee(BaseSql):
	"""
	Employee
	"""
	Employee_Ext_Details = """
	SELECT
		e.*,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	  od.deskname,
	  st.sourcename,
	  e.prmaxstatusid,
	  com.tel,
	  com.fax,
		CASE WHEN o.primaryemployeeid =e.employeeid THEN true ELSE false END as prn_primary,
		CASE WHEN (select count(*) from outletprofile as op where op.seriesparentid = e.outletid) > 0 THEN true ELSE false END as series

		FROM employees as e
	  JOIN outlets AS o ON e.outletid = o.outletid
	  JOIN communications AS com ON com.communicationid = e.communicationid
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	  LEFT OUTER JOIN outletdesk AS od ON od.outletdeskid = e.outletdeskid
	  LEFT OUTER JOIN internal.sourcetypes AS st ON st.sourcetypeid = e.sourcetypeid
		WHERE
		e.employeeid = :employeeid"""

	Employee_Ext_Details_Limited = """
	SELECT
		e.employeeid,
		e.job_title,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
	  od.deskname,
	  st.sourcename,
	  e.prmaxstatusid,
	  com.tel,
	  com.fax,
		CASE WHEN o.primaryemployeeid =e.employeeid THEN true ELSE false END as prn_primary,
		CASE WHEN (select count(*) from outletprofile as op where op.seriesparentid = e.outletid) > 0 THEN true ELSE false END as series

	  		FROM employees as e
	  JOIN outlets AS o ON e.outletid = o.outletid
	  JOIN communications AS com ON com.communicationid = e.communicationid
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	  LEFT OUTER JOIN outletdesk AS od ON od.outletdeskid = e.outletdeskid
	  LEFT OUTER JOIN internal.sourcetypes AS st ON st.sourcetypeid = e.sourcetypeid
		WHERE
		e.employeeid = :employeeid"""

	Employee_ListData = """
	SELECT
		e.customerid as private,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname,
		JSON_ENCODE(e.job_title) as job_title,
		e.employeeid,
	  e.employeeid AS id
		FROM employees as e
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		WHERE
		e.outletid = :outletid and (e.customerid=-1 OR e.customerid=:customerid)
		ORDER BY  contactname
		LIMIT :limit  OFFSET :offset """

	Employee_ListData_2 = """
	SELECT
		e.employeeid,
	  e.employeeid AS id,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix))||' - '||JSON_ENCODE(e.job_title) as displayname
		FROM employees as e
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		WHERE
		e.outletid = :outletid and (e.customerid=-1 OR e.customerid=:customerid)
		ORDER BY  displayname
		LIMIT :limit  OFFSET :offset """

	Employee_ListData_3 = """
	SELECT
		e.employeeid,
	  e.employeeid AS id,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix))||' - '||JSON_ENCODE(e.job_title) as displayname
		FROM employees as e
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		WHERE
		e.outletid = :outletid and e.employeeid=:id"""

	Employee_ListData_4 = """
	SELECT
		e.employeeid,
	  e.employeeid AS id,
		JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix))||' - '||JSON_ENCODE(e.job_title) as displayname
		FROM employees as e
		LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
		WHERE
		e.outletid = :outletid AND
		ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)||' - '||e.job_title ILIKE :displayname
		ORDER BY  displayname
		LIMIT :limit OFFSET :offset"""

	@classmethod
	def getLookUpList(cls, params):
		""" get employee list """

		if "id" in params and params["id"] == "-1":
			if "nocontact" in params:
				return dict(identifier="employeeid",
				            numRows=1,
				            items=[{"displayname": "No Contact", "employeeid": -1, "id": -1,}])
			else:
				return dict(identifier="employeeid",
				            numRows=1,
				            items=[{"displayname": "No Selection", "employeeid": -1, "id": -1}])

		command = Employee.Employee_ListData
		if "extended" in params:
			if "id" in params:
				command = Employee.Employee_ListData_3
			else:
				command = Employee.Employee_ListData_4
				if not params.has_key("displayname"):
					params["displayname"] = "%"
				else:
					if params["displayname"] == "*":
						params["displayname"] = "%"
					else:
						params["displayname"] += "%"

		items = cls.sqlExecuteCommand(
			text(command),
			params,
			BaseSql.ResultAsEncodedDict)

		if "nocontact" in params and "id" not  in params:
			items.insert(1, dict(employeeid=-1, displayname="No Contact", id=-1))

		return dict(identifier="employeeid",
		            numRows=len(items),
		            items=items)

	@classmethod
	def get_look_up_list(cls, params):
		"""Return as a json rest store """

		return cls.grid_to_rest(
		  cls.getLookUpList(params),
		  params["offset"],
		  True if "id" in params else False)

	@classmethod
	def getEmployeeExt(cls, employeeid, restricted=False):
		""" Get and employee record and include the customer name """

		return cls.sqlExecuteCommand(
			text(Employee.Employee_Ext_Details_Limited if restricted else Employee.Employee_Ext_Details),
			dict(employeeid=employeeid),
				  BaseSql.ResultAsEncodedDict)[0]

	@classmethod
	def getOverrides(cls, employeeid, customerid):
		""" return the list of details for and employee overrides """
		# get contact details
		employee = session.query(EmployeeCustomerView).filter_by(
			employeeid=employeeid, customerid=customerid).all()
		if employee:
			employee = employee[0]
		else:
			employee = None
		interests = session.query(EmployeeInterestView).filter_by(
			employeeid=employeeid,
			interesttypeid=Constants.Interest_Type_Tag).all()
		return dict(data=dict(employee=employee,
		                      interests=interests))

	@staticmethod
	def _fix_number(countryid, number):
		if countryid == 1:
			if number is not None and number != '' and not number.startswith('+44'):
				number = '+44 (0)%s' % number
		if countryid == 3:
			if number is not None and number != '' and not number.startswith('+353'):
				number = '+353 (0)%s' % number
		return number

	@classmethod
	def saveOverrides(cls, params):
		""" save the employee overrides """
		# get outlet details
		transaction = session.begin(subtransactions=True)

		try:
			from prcommon.model import Outlet
			employeerecord = Employee.query.get(params['employeeid'])
			employeerecord_countryid = session.query(Outlet.countryid).filter(Outlet.outletid == employeerecord.outletid).scalar()

			if 'tel' in params:
				params['tel'] = Employee._fix_number(employeerecord_countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Employee._fix_number(employeerecord_countryid, params['fax'])

			employee = session.query(EmployeeCustomer).filter_by(
				employeeid=params['employeeid'],
				customerid=params['customerid']).all()
			if employee:
				employee = employee[0]
				employee_countryid = session.query(Outlet.countryid).filter(Outlet.outletid == employee.outletid).scalar()
				if 'tel' in params:
					params['tel'] = Employee._fix_number(employee_countryid, params['tel'])
				if 'fax' in params:
					params['fax'] = Employee._fix_number(employee_countryid, params['fax'])

				employee.profile = params['profile']
				employee.changed = datetime.now()
				# update all record
				comm = Communication.query.get(employee.communicationid)
				comm.tel = params['tel']
				comm.email = params['email']
				comm.fax = params['fax']
				comm.mobile = params["mobile"]
			else:
				comm = Communication(tel=params['tel'],
				                    email=params['email'],
				                    fax=params['fax'],
				                    mobile=params["mobile"],
				                    webphone="")
				session.add(comm)
				session.flush()
				empcust = EmployeeCustomer(profile=params['profile'],
									   outletid=employeerecord.outletid,
									   employeeid=params['employeeid'],
									   customerid=params['customerid'],
									   communicationid=comm.communicationid)
				session.add(empcust)
			# Handle  tags
			cls._interests(params['employeeid'], params['customerid'], params['interests'], employeerecord.outletid)
			session.flush()
			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("employee_saveOverrides")
			raise

	@classmethod
	def add(cls, params):
		""" add a new employee """
		transaction = session.begin(subtransactions=True)
		from prcommon.model import Outlet
		try:
			contactid = None
			if "contactid" in params and params["contactid"] > 0:
				contactid = params["contactid"]
			elif params["familyname"]:
				contactid = Contact.find(params)
				if not contactid:
					contactid = Contact.addprivate(params)

			employee_countryid = session.query(Outlet.countryid).filter(Outlet.outletid == params['outletid']).scalar()
			if 'tel' in params:
				params['tel'] = Employee._fix_number(employee_countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Employee._fix_number(employee_countryid, params['fax'])
			comm = Communication(email=params['email'],
			                    tel=params['tel'],
			                    fax=params['fax'],
			                    mobile=params['mobile'],
			                    twitter=params["twitter"],
			                    facebook=params["facebook"],
			                    instagram=params["instagram"],
			                    linkedin=params["linkedin"])
			session.add(comm)
			session.flush()

			employee = Employee(
				communicationid=comm.communicationid,
				customerid=params['customerid'],
				contactid=contactid,
				job_title=params['job_title'],
				outletid=params['outletid'],
				profile=params['profile'],
			    sourcetypeid=params["sourcetypeid"])
			session.add(employee)
			session.flush()

			# do interests
			cls._interests(employee.employeeid, params['customerid'], params['interests'], params['outletid'])
			session.flush()

			transaction.commit()
			return employee.employeeid
		except:
			LOGGER.exception("employee_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" update an employee"""
		transaction = session.begin(subtransactions=True)
		from prcommon.model import Outlet
		try:
			employee = Employee.query.get(params['employeeid'])
			comm = Communication.query.get(employee.communicationid)
			#
			# need to test the indexing
			#
			contactid = employee.contactid
			familyname = ""
			if employee.contactid:
				contact = Contact.query.get(employee.contactid)
				if contact:
					familyname = contact.familyname
					contact.firstname = params['firstname']
					contact.prefix = params['prefix']

			if params["familyname"] != familyname:
				if params["familyname"]:
					contact = Contact(familyname=params['familyname'],
					                  firstname=params['firstname'],
					                  prefix=params['prefix'],
					                  customerid=params['customerid'],
					                  sourcetypeid=Constants.Research_Source_Private)
					session.add(contact)
					session.flush()
					contactid = contact.contactid
				else:
					contactid = None

			employee_countryid = session.query(Outlet.countryid).filter(Outlet.outletid == employee.outletid).scalar()
			if 'tel' in params:
				params['tel'] = Employee._fix_number(employee_countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Employee._fix_number(employee_countryid, params['fax'])

			employee.contactid = contactid
			employee.job_title = params['job_title']
			employee.profile = params['profile']
			comm.email = params['email']
			comm.tel = params['tel']
			comm.fax = params['fax']
			comm.mobile = params['mobile']
			comm.twitter = params['twitter']
			comm.facebook = params['facebook']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']

			cls._interests(params['employeeid'], params['customerid'], params['interests'], employee.outletid)

			CacheControl.Invalidate_Cache_Object_Research(params['employeeid'], Constants.Cache_Employee_Objects)

			session.flush()
			transaction.commit()
			return params['employeeid']
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("employee_update")
			raise

	@classmethod
	def research_update(cls, params):
		""" Update an employee for the research system

		"""
		transaction = BaseSql.sa_get_active_transaction()
		from prcommon.model import Outlet
		try:
			# get current details
			employee = Employee.query.get(params['employeeid'])
			comm = Communication.query.get(employee.communicationid)
			employee_countryid = session.query(Outlet.countryid).filter(Outlet.outletid == employee.outletid).scalar()

			if "researchprojectitemid" in  params:
				activity = Activity(
				  reasoncodeid=Constants.ReasonCode_Questionnaire,
				  reason="",
				  objecttypeid=Constants.Object_Type_Employee,
				  objectid=employee.employeeid,
				  actiontypeid=Constants.Research_Record_Update,
				  userid=params['userid'],
				  parentobjectid=employee.outletid,
				  parentobjecttypeid=Constants.Object_Type_Outlet
				  )
			else:
				# add the audit trail header record
				activity = Activity(reasoncodeid=params["reasoncodeid"],
				                    reason=params.get("reason", ""),
				                    objecttypeid=Constants.Object_Type_Employee,
				                    objectid=employee.employeeid,
				                    actiontypeid=Constants.Research_Record_Update,
				                    userid=params['userid'],
				                    parentobjectid=employee.outletid,
				                    parentobjecttypeid=Constants.Object_Type_Outlet
				                    )
			session.add(activity)
			session.flush()

			# set source to us
			employee.sourcetypeid = Constants.Research_Source_Prmax
			employee.sourcekey = employee.employeeid

			# handle contact change
			tcontactid = employee.contactid
			if params['contacttype'] == "N":
				employee.contactid = None
			else:
				employee.contactid = int(params['contactid'])

			if 'tel' in params:
				params['tel'] = Employee._fix_number(employee_countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Employee._fix_number(employee_countryid, params['fax'])
			# add the change details to the audit record
			old_contactname = new_contactname = ''
			if tcontactid:
				old_contact = Contact.query.get(tcontactid)
				old_contactname = old_contact.getName()
			if employee.contactid:
				new_contact = Contact.query.get(employee.contactid)
				new_contactname = new_contact.getName()
			ActivityDetails.AddChange(old_contactname, new_contactname, activity.activityid, Constants.Field_Contactid)
			ActivityDetails.AddChange(employee.job_title, params['job_title'], activity.activityid, Constants.Field_Job_Title)
			ActivityDetails.AddChange(comm.email, params['email'], activity.activityid, Constants.Field_Email)
			ActivityDetails.AddChange(comm.tel, params['tel'], activity.activityid, Constants.Field_Tel)
			ActivityDetails.AddChange(comm.fax, params['fax'], activity.activityid, Constants.Field_Fax)
			ActivityDetails.AddChange(comm.mobile, params['mobile'], activity.activityid, Constants.Field_Mobile)
			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)

			old_deskname = new_deskname = "No desk"
			if employee.outletdeskid:
				old_desk = OutletDesk.query.get(employee.outletdeskid)
				old_deskname = old_desk.deskname
			if 'outletdeskid' in params and params['outletdeskid'] != -1 and params['outletdeskid'] != '-1' and params['outletdeskid'] != '' and params['outletdeskid'] != None:
				new_desk = OutletDesk.query.get(int(params['outletdeskid']))
				new_deskname = new_desk.deskname
			ActivityDetails.AddChange(old_deskname, new_deskname, activity.activityid, Constants.Field_DeskName)

			# update the the record
			employee.job_title = params['job_title']
			comm.email = params['email']
			comm.tel = params['tel']
			comm.fax = params['fax']
			comm.twitter = params['twitter']
			comm.facebook = params['facebook']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']
			comm.mobile = params['mobile']
			employee.outletdeskid = params["outletdeskid"]  if params["outletdeskid"] != -1 else None

			# handles address
			# missing from audit trail
			if 'has_address_old' in params and 'has_address_new' in params:
				ActivityDetails.AddChange('Checked' if params['has_address_old'] == 'true' else 'Unchecked', 'Checked' if params['has_address_new'] == 'true' else 'Unchecked', activity.activityid, Constants.Field_No_Address)

			if params.get("no_address", False) is True:

				# get the main address and make sure this isn't linked to it
				# if it is then create a new record
				oaddressid = cls.sqlExecuteCommand(
				  text("""SELECT c.addressid FROM outlets AS o JOIN communications AS c on c.communicationid = o.communicationid WHERE o.outletid = :outletid"""),
				  dict(outletid=employee.outletid),
				  BaseSql.singleFieldInteger)

				if comm.addressid is None or comm.addressid == oaddressid:
					ActivityDetails.AddChange("", params['address1'], activity.activityid, Constants.Field_Address_1)
					ActivityDetails.AddChange("", params['address2'], activity.activityid, Constants.Field_Address_2)
					ActivityDetails.AddChange("", params['county'], activity.activityid, Constants.Field_Address_County)
					ActivityDetails.AddChange("", params['postcode'], activity.activityid, Constants.Field_Address_Postcode)
					ActivityDetails.AddChange("", params['townname'], activity.activityid, Constants.Field_Address_Town)

					address = Address(address1=params['address1'],
					                  address2=params['address2'],
					                  county=params['county'],
					                  postcode=params['postcode'],
					                  townname=params['townname'],
					                  addresstypeid=Address.editorialAddress)
					session.add(address)
					session.flush()
					comm.addressid = address.addressid
				else:
					address = Address.query.get(comm.addressid)
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
			else:
				if comm.addressid:
					address = Address.query.get(comm.addressid)
					ActivityDetails.AddChange(address.address1, "", activity.activityid, Constants.Field_Address_1)
					comm.addressid = None
					session.flush()
					# only if the address is not used
					if not session.query(Communication).filter_by(addressid=address.addressid).limit(1).all():
						session.delete(address)

			cls._interests(params['employeeid'], -1, params['interests'], employee.outletid, activity.activityid)
			cls._jobroles(params['employeeid'], -1, params['jobroles'], employee.outletid, activity.activityid)

			CacheControl.Invalidate_Cache_Object_Research(params['employeeid'], Constants.Cache_Employee_Objects)

			ResearchDetails.set_research_modified(employee.outletid)
			transaction.commit()
			return params['employeeid']
		except:
			LOGGER.exception("employee_research_update")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def research_update_interests(cls, params):
		""" Update a empolyees interest only don't take ownership etc """

		transaction = cls.sa_get_active_transaction()
		from prcommon.model import Outlet
		try:

			employee = Employee.query.get(params['employeeid'])
			# add the audit trail header record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                    reason=params["reason"],
			                    objecttypeid=Constants.Object_Type_Employee,
			                    objectid=employee.employeeid,
			                    actiontypeid=Constants.Research_Record_Update,
			                    userid=params['userid'],
			                    parentobjectid=employee.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Outlet
			                    )
			session.add(activity)
			session.flush()

			cls._interests(params['employeeid'], params['customerid'], params['interests'], employee.outletid, activity.activityid)
			CacheControl.Invalidate_Cache_Object_Research(params['employeeid'], Constants.Cache_Employee_Objects)
			ResearchDetails.set_research_modified(employee.outletid)

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("research_update_interests")
			raise

	@classmethod
	def research_update_media(cls, params):
		""" Update solia media fields with no chnage of ownership"""

		transaction = cls.sa_get_active_transaction()
		try:

			employee = Employee.query.get(params['employeeid'])
			comm = Communication.query.get(employee.communicationid)
			# add the audit trail header record
			activity = Activity(reasoncodeid=params["reasoncodeid"],
			                reason=params["reason"],
			                objecttypeid=Constants.Object_Type_Employee,
			                objectid=employee.employeeid,
			                actiontypeid=Constants.Research_Record_Update,
			                userid=params['userid'],
			                parentobjectid=employee.outletid,
			                parentobjecttypeid=Constants.Object_Type_Outlet
			                )
			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(comm.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
			ActivityDetails.AddChange(comm.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
			ActivityDetails.AddChange(comm.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			ActivityDetails.AddChange(comm.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)

			# update the the record
			comm.twitter = params['twitter']
			comm.facebook = params['facebook']
			comm.linkedin = params['linkedin']
			comm.instagram = params['instagram']

			CacheControl.Invalidate_Cache_Object_Research(params['employeeid'], Constants.Cache_Employee_Objects)
			ResearchDetails.set_research_modified(employee.outletid)

			transaction.commit()
		except:
			try:
				transaction.rollback()
			except:
				pass
			LOGGER.exception("research_update_interests")
			raise

	@classmethod
	def research_add(cls, params):
		""" add a new employee for research  """
		transaction = cls.sa_get_active_transaction()
		from prcommon.model import Outlet

		try:
			if params.get("contacttype", "") == "N":
				contactid = None
			else:
				contactid = params.get('contactid', None)

			addressid = None
			if params.get("no_address", False) is True:
				address = Address(
				    address1=params['address1'],
				    address2=params['address2'],
				    county=params['county'],
				    postcode=params['postcode'],
				    townname=params['townname'],
				    addresstypeid=Address.editorialAddress)
				session.add(address)
				session.flush()
				addressid = address.addressid

			countryid = session.query(Outlet.countryid).filter(Outlet.outletid == params['outletid']).scalar()
			if 'tel' in params:
				params['tel'] = Employee._fix_number(countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = Employee._fix_number(countryid, params['fax'])

			comm = Communication(
			    email=params['email'],
			    tel=params['tel'],
			    fax=params['fax'],
			    mobile=params['mobile'],
			    twitter=params["twitter"],
			    linkedin=params["linkedin"],
			    facebook=params["facebook"],
			    instagram=params["instagram"],
			    addressid=addressid)
			session.add(comm)
			session.flush()

			employee = Employee(
			    communicationid=comm.communicationid,
			    contactid=contactid,
			    job_title=params['job_title'],
			    outletid=params['outletid'],
			    sourcetypeid=Constants.Research_Source_Prmax
			)
			if params["outletdeskid"] != -1:
				employee.outletdeskid = params["outletdeskid"]

			session.add(employee)
			session.flush()

			# do interests
			cls._interests(employee.employeeid, -1, params['interests'], params["outletid"])

			# do jobroles
			if params['jobroles']:
				cls._jobroles(employee.employeeid, -1, params['jobroles'], params['outletid'])

			# add the audit trail header record
			if "researchprojectitemid" in params:
				activity = Activity(
				  reasoncodeid=Constants.ReasonCode_Questionnaire,
				  reason="",
				  objecttypeid=Constants.Object_Type_Employee,
				  objectid=employee.employeeid,
				  actiontypeid=Constants.Research_Record_Add,
				  userid=params['userid'],
				  parentobjectid=employee.outletid,
				  parentobjecttypeid=Constants.Object_Type_Outlet
				  )
			else:
				activity = Activity(
				  reasoncodeid=params["reasoncodeid"],
				  reason=params.get("reason", ""),
				  objecttypeid=Constants.Object_Type_Employee,
				  objectid=employee.employeeid,
				  actiontypeid=Constants.Research_Record_Add,
				  userid=params['userid'],
				  parentobjectid=employee.outletid,
				  parentobjecttypeid=Constants.Object_Type_Outlet
				)
			session.add(activity)

			ResearchDetails.set_research_modified(employee.outletid)

			transaction.commit()
			return employee.employeeid
		except:
			LOGGER.exception("research_employee_add")
			transaction.rollback()
			raise

	@classmethod
	def getForEdit(cls, params):
		""" return the data need to edit a private employee"""
		employee = Employee.query.get(params['employeeid'])
		contact = Contact.getContactForEdit(employee.contactid)

		return dict(employee=employee,
		            comm=Communication.query.get(employee.communicationid),
		            contact=contact,
		            interests=dict(data=session.query(EmployeeInterestView).filter_by(
		                employeeid=params['employeeid'],
		                interesttypeid=Constants.Interest_Type_Standard).all()))

	@classmethod
	def research_get_edit(cls, params):
		""" return the data need to edit a research employee"""

		from prcommon.model.outlet import Outlet

		employee = Employee.query.get(params['employeeid'])
		outlet = Outlet.query.get(employee.outletid)
		comm = Communication.query.get(employee.communicationid)
		address = None
		if comm.addressid > 0:
			address = Address.query.get(comm.addressid)
		if employee.contactid:
			contact = Contact.query.get(employee.contactid)
			contactname = Contact.getName(contact)
		else:
			contactname = None
		# job roles
		jobroles = session.query(EmployeeRoleView).\
		  filter(EmployeeRoleView.employeeid == params["employeeid"]).all()

		return dict(
		  employeeid=params['employeeid'],
		  employee=employee,
		  comm=comm,
		  outlet=outlet,
		  contactname=contactname,
		  address=address,
		  jobroles=jobroles,
		  interests=dict(data=session.query(EmployeeInterestView).filter_by(
		    employeeid=params['employeeid'],
		    interesttypeid=Constants.Interest_Type_Standard).all()),
		  isprimary=True if outlet.primaryemployeeid == employee.employeeid else False)

	@staticmethod
	def get_for_display(params):
		"""Display Detilas"""

		employee = Employee.query.get(params['employeeid'])

		data = session.execute(text(COMMAND1), params, Employee).fetchone()

		return list(data)


	Delete_Employee = "SELECT employee_delete(:employeeid)"

	@classmethod
	def delete(cls, params):
		""" delete a employee record"""

		transaction = session.begin(subtransactions=True)
		try:
			# employee
			employee = Employee.query.get(params['employeeid'])
			if employee.customerid != params['customerid']:
				raise SecurityException("")

			session.execute(text(Employee.Delete_Employee), params, cls)

			ResearchDetails.set_research_modified(employee.outletid)

			transaction.commit()
		except:
			LOGGER.exception("employee_delete")
			transaction.rollback()
			raise

	@classmethod
	def research_delete(cls, params):
		""" delete a employee record from the  database in the reasech system
		Logs the action and if prn add to ignore list """

		transaction = cls.sa_get_active_transaction()

		try:
			employee = Employee.query.get(params['employeeid'])
			outletid = employee.outletid

			if int(params["delete_option"]) == 2:
				comm = Communication.query.get(employee.communicationid)
				comm.email = ""
				comm.tel = ""
				comm.addressid = None
				comm.fax = ""
				comm.mobile = ""
				comm.webphone = ""
				comm.twitter = ""
				comm.facebook = ""
				comm.linkedin = ""
				comm.instagram = ""
				comm.blog = ""
				employee.contactid = None
				activity = Activity(reasoncodeid=params["reasoncodeid"],
						                reason=params.get("reason", ""),
						                objecttypeid=Constants.Object_Type_Employee,
						                objectid=employee.employeeid,
						                actiontypeid=Constants.Research_Record_Update,
						                userid=params['userid'],
						                parentobjectid=employee.outletid,
						                parentobjecttypeid=Constants.Object_Type_Outlet,
						                name=employee.job_title
						                )
				session.add(activity)
				session.flush()
			else:
				cname = ""
				if employee.contactid:
					cname = Contact.query.get(employee.contactid).getName()

				# add audit trail record
				activity = Activity(reasoncodeid=params["reasoncodeid"],
						            reason=params.get("reason", ""),
						            objecttypeid=Constants.Object_Type_Employee,
						            objectid=employee.employeeid,
						            actiontypeid=Constants.Research_Record_Delete,
						            userid=params['userid'],
						            parentobjectid=employee.outletid,
						            parentobjecttypeid=Constants.Object_Type_Outlet,
						            name=employee.job_title + " : " + cname
						            )
				session.add(activity)
				session.flush()
				# delete contact
				#session.execute(text(Employee.Delete_Employee),dict(employeeid=employee.employeeid), Employee)
				session.execute(text("SELECT employee_research_force_delete(:employeeid)"), {'employeeid':employee.employeeid}, Employee)
				session.flush()

			ResearchDetails.set_research_modified(outletid)

			transaction.commit()
			session.expunge_all()
			# reget too see if delete worked
			return True if not Employee.query.get(params['employeeid']) else False
		except:
			LOGGER.exception("research_employee_delete")
			transaction.rollback()
			raise

	@classmethod
	def _interests(cls, employeeid, customerid, interests, outletid, activityid=None):
		""" interests"""
		# Handle  tags
		dbinterest = session.query(EmployeeInterestView).filter_by(employeeid=employeeid)
		dbinterest2 = []
		interests = interests if interests else []
		# do deletes
		for employeeinterest in dbinterest:
			dbinterest2.append(employeeinterest.interestid)
			if not employeeinterest.interestid in interests:
				# need to get
				out = EmployeeInterests.query.get(
					employeeinterest.employeeinterestid)
				if activityid:
					del_interest = Interests.query.get(out.interestid)
					ActivityDetails.AddDelete(del_interest.interestname, activityid, Constants.Field_Interest)
				session.delete(out)

		for interestid in interests:
			if not interestid in dbinterest2:
				interest = EmployeeInterests(
					employeeid=employeeid,
					interestid=interestid,
					customerid=customerid,
				    outletid=outletid,
					interesttypeid=Constants.Interest_Type_Tag)

				session.add(interest)
				session.flush()
				if activityid:
					new_interest = Interests.query.get(interestid)
					ActivityDetails.AddChange(None, new_interest.interestname, activityid, Constants.Field_Interest)

	@classmethod
	def _jobroles(cls, employeeid, customerid, jobroles, outletid, activityid=None):
		""" interests"""

		jobroles = jobroles if jobroles else []
		dbroles = session.query(EmployeePrmaxRole).filter(EmployeePrmaxRole.employeeid == employeeid).all()
		dbroles2 = {}

		# do deletes
		for role in dbroles:
			dbroles2[role.prmaxroleid] = True
			if not role.prmaxroleid in jobroles:
				del_jobrole = PRMaxRoles.query.get(role.prmaxroleid)
				ActivityDetails.AddDelete(del_jobrole.prmaxrole, activityid, Constants.Field_Role)
				session.delete(role)

		for roleid in jobroles:
			if not roleid in dbroles2:
				role = EmployeePrmaxRole(
				  employeeid=employeeid,
				  outletid=outletid,
				  prmaxroleid=roleid)
				add_jobrole = PRMaxRoles.query.get(role.prmaxroleid)
				ActivityDetails.AddChange(None, add_jobrole.prmaxrole, activityid, Constants.Field_Role)
				session.add(role)
				session.flush()

	@staticmethod
	def research_merge_contacts(params):
		"""
		Merge the the employees and delete the source employee
		"""

		# check for primary
		from  prcommon.model.outlet import Outlet
		from prcommon.model.list import ListMembers

		try:

			employee = Employee.query.get(params["employeeid"])
			outlet = Outlet.query.get(employee.outletid)
			if outlet.primaryemployeeid == employee.employeeid:
				raise Exception("Is Primary")

			transaction = BaseSql.sa_get_active_transaction()

			series = session.query(OutletProfile).filter(OutletProfile.seriesparentid == employee.outletid).all()
			# merge lists
			# get list of each employee and then work out what to do
			in_lists = {}
			for row in  session.query(ListMembers).filter(ListMembers.employeeid == params["newemployeeid"]).all():
				in_lists[row.listid] = True

			# delete all entries where already in list
			session.query(ListMembers).\
			  filter(ListMembers.employeeid == params["employeeid"]).\
			  filter(ListMembers.listid.in_(in_lists.keys())).delete(synchronize_session='fetch')

			#update all entries that are left
			session.query(ListMembers).\
			  filter(ListMembers.employeeid == params["employeeid"]).\
			  filter(not_(ListMembers.listid.in_(in_lists.keys()))).\
			  update({"employeeid": params["newemployeeid"]},
			         synchronize_session='fetch')
			if outlet.primaryemployeeid == params["newemployeeid"]:
				# need to delete duplicate entries from list
				pass

			#update contacthistory
			session.execute(text("UPDATE userdata.contacthistory SET employeeid = :newemployeeid WHERE employeeid = :employeeid"), params, Contact)

			# delete employee
			#session.execute(text(Employee.Delete_Employee), params, Employee)
			session.execute(text("SELECT employee_research_force_delete(:employeeid)"), params, Employee)

			# clear up duplicate nulls for outlet
			session.execute(text("SELECT removed_duplicates_priamry_outlets_in_list();"), None, Employee)

			ResearchDetails.set_research_modified(outlet.outletid)

			transaction.commit()
			session.expunge_all()
			return dict(series=True if len(series) > 0 else False)

		except:
			LOGGER.exception("research_merge_contacts")
			transaction.rollback()
			raise

	@classmethod
	def research_copy_interests(cls, params):
		"""Copy interests from outlet to employee"""

		from prcommon.model.outlet import OutletInterests

		transaction = cls.sa_get_active_transaction()

		try:
			employee = Employee.query.get(params['employeeid']) if params['employeeid'] != -1 else None
			# add the audit trail header record
			activity = Activity(reasoncodeid=params.get("reasoncodeid", None),
			                    reason=params.get("reason", None),
			                    objecttypeid=Constants.Object_Type_Employee,
			                    objectid=employee.employeeid,
			                    actiontypeid=Constants.Research_Record_Update,
			                    userid=params['userid'],
			                    parentobjectid=employee.outletid,
			                    parentobjecttypeid=Constants.Object_Type_Outlet
			                    )
			session.add(activity)
			session.flush()

			#existing_employee_interests = []
			#if params['employeeid'] != -1:
			#	existing_employee_interests = [ei.interestid for ei in session.query(EmployeeInterests).filter(EmployeeInterests.employeeid == params['employeeid']).all()]
			outletinterests = [oi.interestid for oi in OutletInterests.get_list(params['outletid'])]
			#for eei in existing_employee_interests:
			#	if eei not in outletinterests:
			#		outletinterests.append(eei)
			cls._interests(params['employeeid'], -1, outletinterests, params['outletid'], activity.activityid)
			CacheControl.Invalidate_Cache_Object_Research(params['employeeid'], Constants.Cache_Employee_Objects)
			ResearchDetails.set_research_modified(employee.outletid)
			transaction.commit()
			return dict(interests=dict(data=session.query(EmployeeInterestView).filter_by(employeeid=params['employeeid'], interesttypeid=Constants.Interest_Type_Standard).all()))

		except:
			LOGGER.exception("research_copy_interests_outlet_to_employee")
			transaction.rollback()
			raise


class EmployeeDisplay(BaseSql):
	""" EmployeeDisplay """
	Employee_Display_Query = """
	SELECT e.job_title,
		ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname,
		get_override(e.profile,'') as profile,
		get_override(ec.profile,'') as localprofile,
		get_override(c_ce.email,c_e.email,o_c_c.email,o_c.email) as email,
		get_overrideflag(c_ce.email,c_e.email) as emailflag,
		get_override(c_ce.tel,c_e.tel,o_c_c.tel,o_c.tel) as tel,
		get_overrideflag(c_ce.tel,c_e.tel) as telflag,
		get_override(c_ce.fax,c_e.fax,o_c_c.fax,o_c.fax) as fax,
		get_overrideflag(c_ce.fax,c_e.fax) as faxflag,
		get_override(c_ce.mobile,c_e.mobile,o_c_c.mobile,o_c.mobile) as mobile,
	    get_overrideflag(c_ce.mobile,c_e.mobile) as mobileflag,
	    CASE WHEN a_ec.address1 IS NULL THEN
	        CASE WHEN a_e.address1 IS NULL OR LENGTH(a_e.address1)=0 THEN
	            CASE WHEN (o.sourcetypeid = 5 OR o.sourcetypeid = 6) THEN
	                CASE WHEN a_o.county = a_o.townname THEN
	                    AddressFull(a_o.address1,a_o.address2,a_o.townname,'',a_otown.geographicalname,a_o.postcode,'')
	                ELSE
	                    AddressFull(a_o.address1,a_o.address2,a_o.townname,'',a_otown.geographicalname,a_o.postcode,'')
	                END
	            ELSE
	                AddressFull(a_o.address1,a_o.address2,a_o.county,a_o.postcode,a_otown.geographicalname,a_o.townname,'')
	            END
	        ELSE
	            CASE WHEN (o.sourcetypeid = 5 OR o.sourcetypeid = 6) THEN
	                CASE WHEN a_e.county = a_e.townname THEN
	                    AddressFull(a_e.address1,a_e.address2,a_e.townname,'',town.geographicalname,a_e.postcode,'')
	                ELSE
	                    AddressFull(a_e.address1,a_e.address2,a_e.townname,'',town.geographicalname,a_e.postcode,'')
	                END
	            ELSE
	                AddressFull(a_e.address1,a_e.address2,a_e.postcode,a_e.county,town.geographicalname,a_e.townname,'')
	            END
	        END
		ELSE
			AddressFull(a_ec.address1,a_ec.address2,a_ec.county,a_ec.postcode,a_ectown.geographicalname,a_ec.townname,'')
		END as address,
		CASE WHEN a_ec.address1 IS NULL THEN  false ELSE true END as addressflag,
		CASE WHEN o.primaryemployeeid = e.employeeid OR oc.primaryemployeeid = e.employeeid THEN true ELSE false END as isprimary,
		e.customerid,
		c.customerid as ccustomerid,
	  c_e.twitter,
	  c_e.linkedin,
	  c_e.instagram,
	  c_e.facebook,
	  e.contactid,
	  e.outletid,
	  o.outletname
	FROM employees as e
		LEFT OUTER JOIN contacts as c ON c.contactid = e.contactid
		LEFT OUTER JOIN internal.deliverypreferences as dp on dp.deliverypreferenceid = e.deliverypreferenceid
		LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = e.employeeid AND ec.customerid = :customerid
		LEFT OUTER JOIN communications as c_e ON c_e.communicationid = e.communicationid
		LEFT OUTER JOIN communications as c_ce ON c_ce.communicationid = ec.communicationid
		LEFT OUTER JOIN addresses as a_e ON a_e.addressid = c_e.addressid
		LEFT OUTER JOIN addresses as a_ec ON a_ec.addressid = c_ce.addressid
		LEFT OUTER JOIN internal.geographical AS town ON a_e.townid=town.geographicalid
		LEFT OUTER JOIN internal.geographical AS a_ectown ON a_ec.townid=a_ectown.geographicalid
		LEFT OUTER JOIN outlets as o ON e.outletid = o.outletid
		LEFT OUTER JOIN outletcustomers as oc ON o.outletid = oc.outletid AND oc.customerid = :customerid
		LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
		LEFT OUTER JOIN communications as o_c_c ON o_c_c.communicationid = oc.communicationid
		LEFT OUTER JOIN addresses as a_o ON a_o.addressid = o_c.addressid
		LEFT OUTER JOIN addresses as a_oc ON a_oc.addressid = o_c_c.addressid
		LEFT OUTER JOIN internal.geographical AS a_otown ON a_o.townid=a_otown.geographicalid
		LEFT OUTER JOIN internal.geographical AS a_octown ON a_oc.townid=a_octown.geographicalid
	    WHERE e.employeeid = :employeeid"""

	Employee_Display_Interest = """
	SELECT interestname
	FROM employeeinterest_view
	WHERE
		(customerid=-1 or customerid=:customerid) AND employeeid =:employeeid AND
		interesttypeid=1"""

	Employee_Display_Tags = """
	SELECT interestname
	FROM employeeinterest_view
	WHERE
		(customerid=-1 or customerid=:customerid) AND employeeid =:employeeid AND
		interesttypeid=2"""
	SortFields = {"contactname": "c.familyname"}
	EmployeeDisplay_ListData = """
	SELECT
		e.customerid ,
		c.customerid as ccustomerid,
		CASE WHEN e.contactid is NULL THEN '' ELSE JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) END as contactname,
		JSON_ENCODE(e.job_title) as job_title,
	  JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) || ' ' || e.job_title as extended_name,
		e.employeeid,
	  e.employeeid as id,
		CASE WHEN oc.primaryemployeeid IS NOT NULL AND (e.employeeid = oc.primaryemployeeid ) THEN true ELSE false END as override_primary,
		CASE WHEN o.primaryemployeeid =e.employeeid THEN true ELSE false END as prn_primary,
	    st.sourcename,
	    e.prmaxstatusid,
	  od.deskname
	FROM employees as e
	JOIN outlets as o ON e.outletid = o.outletid
	LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	LEFT OUTER JOIN outletcustomers AS oc ON oc.outletid = o.outletid  AND oc.customerid =:customerid
	LEFT OUTER JOIN internal.sourcetypes AS st ON st.sourcetypeid = e.sourcetypeid
	LEFT OUTER JOIN outletdesk AS od ON od.outletdeskid = e.outletdeskid"""

	EmployeeDisplay_ListData_Where = """ WHERE e.outletid = :outletid and (e.customerid=-1 OR e.customerid=:customerid) AND %s """
	EmployeeDisplay_ListData_Order = """ ORDER BY  %s %s LIMIT :limit  OFFSET :offset """

	EmployeeDisplay_ListData_Single = """
	SELECT
		e.customerid ,
		c.customerid as ccustomerid,
		CASE WHEN e.contactid is NULL THEN '' ELSE JSON_ENCODE(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) END as contactname,
		JSON_ENCODE(e.job_title) as job_title,
		e.employeeid,
	  e.employeeid as id,
		CASE WHEN oc.primaryemployeeid IS NOT NULL AND (e.employeeid = oc.primaryemployeeid ) THEN true ELSE false END as override_primary,
		CASE WHEN o.primaryemployeeid =e.employeeid THEN true ELSE false END as prn_primary,
	  od.deskname
	FROM employees as e
	LEFT OUTER JOIN contacts as c on e.contactid = c.contactid
	LEFT OUTER JOIN outletcustomers AS oc ON oc.outletid = e.outletid  AND oc.customerid =:customerid
	LEFT OUTER JOIN outletdesk AS od ON od.outletdeskid = e.outletdeskid
	WHERE
		e.employeeid = : id"""

	EmployeeDisplay_Count = """
						  SELECT COUNT(*) as nbr
						  FROM employees as e"""


	@classmethod
	def getDisplayPage(cls, params):
		""" getDisplayPage """
		if "outletid" in params:
			extrawhere = ""
			extrawhere = "e.prmaxstatusid = 1 "
			if "extended" in params:
				extrawhere = "e.prmaxstatusid IN (1,2) "

			if "extraemployeeid" in params:
				if extrawhere:
					extrawhere += " AND "
				extrawhere += " e.employeeid != :extraemployeeid "
				params["extraemployeeid"] = params["extraemployeeid"]

			if "job_title" in params:
				if extrawhere:
					extrawhere += " AND "
				extrawhere += " e.job_title ilike :job_title "
				params["job_title"] = params["job_title"]

			items = cls.sqlExecuteCommand(
				text(EmployeeDisplay.EmployeeDisplay_ListData +\
			         EmployeeDisplay.EmployeeDisplay_ListData_Where % extrawhere  +\
			         EmployeeDisplay.EmployeeDisplay_ListData_Order %  (params['sortby'], params['direction'])),
			    params,
			    BaseSql.ResultAsEncodedDict)

			numrows = cls.sqlExecuteCommand(
				text(EmployeeDisplay.EmployeeDisplay_Count  +\
			         EmployeeDisplay.EmployeeDisplay_ListData_Where % extrawhere),
				params,
				BaseSql.singleFieldInteger)
		elif "id" in params:
			items = cls.sqlExecuteCommand(
				text(EmployeeDisplay.EmployeeDisplay_ListData_Single),
				params,
				BaseSql.ResultAsEncodedDict)
			numrows = len(items)
		else:
			items = []
			numrows = 0

		return dict(
			identifier="employeeid",
			numRows=numrows,
			items=items)

	@classmethod
	def get_display_page(cls, param):
		"""display page  """

		return cls.grid_to_rest(
		  cls.getDisplayPage(param),
		  param["offset"],
		  False
		)

	@classmethod
	def getPageDisplayParams(cls, params):
		""" Get parameters for search display data page"""

		sortby = params.get('sort', 'UPPER(c.familyname)')
		if sortby.find("contactname") != -1:
			sortby = sortby.replace('contactname', 'UPPER(c.familyname)')

		direction = "asc"
		if sortby[0] == '-':
			direction = "desc"
			sortby = sortby[1:]

		retparams = DictExt(dict(
		    userid=params['user_id'],
		    customerid=params['customerid'],
		    limit=int(params.get("count", "100")),
		    offset=int(params.get("start", "0")),
		    direction=direction,
		    sortby=sortby))

		if "extended" in params:
			retparams["extended"] = 1

		if 'outletid' in params:
			retparams["outletid"] = params['outletid']

		if "extraemployeeid" in  params:
			retparams["extraemployeeid"] = int(params["extraemployeeid"])

		if "job_title" in params:
			retparams["job_title"] = params["job_title"].replace("*", "%")

		return retparams

	@classmethod
	def _convertInterestDisplay(cls, results):
		"""_convertInterestDisplay"""
		return ",".join([row['interestname'].decode('utf-8') for row in results.fetchall()])

	@classmethod
	def getEmployeeDisplay(cls, params):
		""" Get the employee display details"""

		#check cackhe for data
		data = CacheStore.getDisplayStore(params['customerid'],
		                                  params['employeeid'],
		                                  params['productid'],
		                                  Constants.Cache_Display_Employee)
		if data:
			return data
		else:
			# no cache buid data, cache and return
			data = JSONEncoder().encode(cls._GetEmployeeDisplay(params))
			CacheStore.addToCache(params['customerid'], params['employeeid'],
								  params['productid'],
								  Constants.Cache_Display_Employee,
								  data)
			# should add commit as this point to reduce transaction length
			return data

	@classmethod
	def _GetEmployeeDisplay(cls, params):
		"""getEmployeeDisplay  """
		details = cls.sqlExecuteCommand(
			text(EmployeeDisplay.Employee_Display_Query),
			params,
			BaseSql.SingleResultAsEncodedDict)

		BaseSql.checkprivate(details['customerid'])

		employee_display_roles = ""
		result = session.query(EmployeeRoleView.rolename).\
			   filter_by(employeeid=params["employeeid"]).\
			   order_by(EmployeeRoleView.rolename).all()
		employee_display_roles = ", ".join([row[0] for row in result])

		result = session.query(EmployeeInterestView.interestname).\
			   filter_by(employeeid=params["employeeid"]).\
			   order_by(EmployeeInterestView.interestname).all()
		employee_display_interests = ", ".join([row[0] for row in result if len(row[0])])

		return dict(employee=details,
					employee_display_roles=employee_display_roles,
		            employee_display_interests=employee_display_interests)

	@classmethod
	def interests_display(cls, params):
		return dict(
		    interests=cls.sqlExecuteCommand(
		        text(EmployeeDisplay.Employee_Display_Interest),
		        params,
		        BaseSql.ResultAsEncodedDict),

		    tags=cls.sqlExecuteCommand(
		        text(EmployeeDisplay.Employee_Display_Tags),
		        params,
		        BaseSql.ResultAsEncodedDict)
		)

class EmployeeInterests(BaseSql):
	""" EmployeeInterests """
	@classmethod
	def delete(cls, params):
		""" Delete an employee interest record by employeeid/interestid"""
		transaction = cls.sa_get_active_transaction()
		try:
			for item in session.query(EmployeeInterests).filter_by(
			    employeeid=params["employeeid"],
			    interestid=params["interestid"]):
				session.delete(item)
			transaction.commit()
		except:
			LOGGER.exception("EmployeeInterests_delete")
			transaction.rollback()
			raise

	_Interest_Delete_Batch = """DELETE from employeeinterests
	WHERE sourceid = 1 and customerid = -1 AND employeeid IN (SELECT COALESCE(s.employeeid,o.primaryemployeeid)
	FROM userdata.searchsession AS s JOIN outlets AS o ON o.outletid = s.outletid WHERE s.userid = :userid AND s.searchtypeid = 3 ) """

	_Interest_Add_Batch = """INSERT INTO employeeinterests(employeeid,interestid,sourceid,outletid)
	SELECT COALESCE(s.employeeid,o.primaryemployeeid),:interestid,1,s.outletid
	FROM userdata.searchsession AS s JOIN outlets AS o ON o.outletid = s.outletid WHERE s.userid = :userid AND s.searchtypeid = 3
	AND COALESCE(s.employeeid,o.primaryemployeeid) NOT IN (SELECT COALESCE(s.employeeid,o.primaryemployeeid) FROM userdata.searchsession AS s JOIN outlets AS o ON o.outletid = s.outletid
	JOIN employeeinterests AS ai ON ai.employeeid = COALESCE(s.employeeid,o.primaryemployeeid)
	WHERE s.userid = :userid AND s.searchtypeid = 3 AND ai.interestid = :interestid)"""

	@classmethod
	def research_contact_interests(cls, params):
		""" Change the interest on a list """

		transaction = cls.sa_get_active_transaction()

		try:
			if params["append_mode"]:
				# need to delete all keywords exept private and jobrole
				cls.sqlExecuteCommand(
				  text(EmployeeInterests._Interest_Delete_Batch),
				  params)

			for interestid in params["interests"] if params["interests"] else []:
				params["interestid"] = interestid
				cls.sqlExecuteCommand(
				  text(EmployeeInterests._Interest_Add_Batch),
				  params)

			transaction.commit()
		except:
			LOGGER.exception("research_contact_interests")
			transaction.rollback()
			raise


class EmployeeCustomer(object):
	""" EmployeeCustomer """
	pass

class EmployeeCustomerView(object):
	""" EmployeeCustomerView """
	pass

class EmployeeRoles(object):
	""" Employee roles """
	pass

class EmployeeRoleView(object):
	""" Employee roles view  """
	pass

class EmployeePrmaxRole(BaseSql):
	"""Employee job roles """
	pass

EmployeePrmaxRole.mapping = Table('employeeprmaxroles', metadata, autoload=True)
EmployeeRoles.mapping = Table('employeeroles', metadata, autoload=True)
Employee.mapping = Table('employees', metadata, autoload=True)
EmployeeInterests.mapping = Table('employeeinterests', metadata, autoload=True)
EmployeeCustomer.mapping = Table('employeecustomers', metadata, autoload=True)
EmployeeCustomerView.mapping = Table('employeecustomer_view', metadata,
                            Column("employeeid", Integer, primary_key=True),
                            Column("customerid", Integer, primary_key=True),
                            autoload=True)
EmployeeRoleView.mapping = Table('employeerole_view', metadata,
                            Column("employeeid", Integer, primary_key=True),
                            Column("prmaxroleid", Integer, primary_key=True),
                            autoload=True)


mapper(EmployeeRoles, EmployeeRoles.mapping)
mapper(Employee, Employee.mapping)
mapper(EmployeeRoleView, EmployeeRoleView.mapping)
mapper(EmployeeDisplay, Employee.mapping)
mapper(EmployeeInterests, EmployeeInterests.mapping)
mapper(EmployeeCustomer, EmployeeCustomer.mapping)
mapper(EmployeeCustomerView, EmployeeCustomerView.mapping)
mapper(EmployeePrmaxRole, EmployeePrmaxRole.mapping)
