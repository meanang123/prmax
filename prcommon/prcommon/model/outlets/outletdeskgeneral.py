# -*- coding: utf-8 -*-
"""outletdesk"""
#-----------------------------------------------------------------------------
# Name:        outletdeskgeneral
# Purpose:
# Author:      Chris Hoy
# Created:     08/10/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
import logging
from turbogears.database import session
from prcommon.model.outlets.outletdesk import OutletDesk
from prcommon.model.research import ResearchDetailsDesk
from prcommon.model.communications import Communication, Address
from prcommon.model.research import Activity, ActivityDetails, ResearchFrequencies
from prcommon.model.lookups import Months
import prcommon.Constants as Constants
from ttl.ttldate import to_json_date
from ttl.model import BaseSql

LOGGER = logging.getLogger("prcommon")

class OutletDeskGeneral(object):
	""" OutletDeskGeneral  """

	ListData = """
	SELECT
	outletdeskid,
	outletdeskid AS id,
	deskname
	FROM outletdesk AS od """

	ListDataCount = """SELECT COUNT(*) FROM outletdesk AS od """

	_Default_Data = dict(
	  numRows=1,
	  items=[dict(outletdeskid=-1, deskname="No Desk", id=-1)],
	  identifier='outletdeskid'
	)

	_Default_Empty_Data = dict(
		  numRows=0,
		  items=[],
		  identifier='outletdeskid'
		)

	@staticmethod
	def _fix_number(countryid, number):
		if countryid == 1:
			if number is not None and number != '' and not number.startswith('+44'):
				number = '+44 (0)%s' % number
		if countryid == 3:
			if number is not None and number != '' and not number.startswith('+353'):
				number = '+353 (0)%s' % number
		return number

	@staticmethod
	def get_list_desks(params):
		""" get rest page  of  desk for outlet"""
		whereused = ""
		include_no_selection = False
		data = None

		if "outletid" in params and params["outletid"] > 0:
			whereused = BaseSql.addclause("", "od.outletid = :outletid")
			if "deskname" in params:
				if params["deskname"]:
					whereused = BaseSql.addclause(whereused, "deskname ilike :deskname")
					if params["deskname"] == "*":
						include_no_selection = True
					params["deskname"] = params["deskname"].replace("*", "")
					params["deskname"] = params["deskname"] + "%"
		else:
			data = OutletDeskGeneral._Default_Empty_Data

		if "outletdeskid" in params:
			params["outletdeskid"] = int(params["outletdeskid"])
			if params["outletdeskid"] == -1:
				data = OutletDeskGeneral._Default_Data
			else:
				whereused = BaseSql.addclause(whereused, "od.outletdeskid = :outletdeskid")
				data = None

		if not data:
			data = BaseSql.getGridPage(
			  params,
			  'deskname',
			  'outletdeskid',
			  OutletDeskGeneral.ListData + whereused + BaseSql.Standard_View_Order,
			  OutletDeskGeneral.ListDataCount + whereused,
			  OutletDesk)

		if include_no_selection:
			data['numRows'] += data['numRows']
			data['items'].insert(0, dict(outletdeskid=-1, deskname="No Desk", id=-1))

		return BaseSql.grid_to_rest(data,
		                            params["offset"],
		                            True if 'outletdeskid' in  params else False)

	@staticmethod
	def exists(deskname, outletdeskid, outletid):
		""" check to see if a desk exists """

		data = session.query(OutletDesk).\
		  filter(OutletDesk.deskname == deskname).\
		  filter(OutletDesk.outletid == outletid).all()
		if data and outletdeskid != -1:
			for row in data:
				if row.outletdeskid != outletdeskid:
					return True
			return False
		else:
			return True if data else False

	@staticmethod
	def add(params):
		""" add a new desk """

		transaction = BaseSql.sa_get_active_transaction()


		try:
			from prcommon.model import Outlet
			countryid = session.query(Outlet.countryid).filter(Outlet.outletid == params['outletid']).scalar()
			if 'tel' in params:
				params['tel'] = OutletDeskGeneral._fix_number(countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = OutletDeskGeneral._fix_number(countryid, params['fax'])
			comms = Communication(email=params['email'],
				                      tel=params['tel'],
				                      fax=params['fax'],
				                      twitter=params['twitter'],
			                          facebook=params['facebook'],
			                          instagram=params['instagram'],
				                      linkedin=params['linkedin'])
			session.add(comms)

			if params['has_address']:
				address = Address(
				  address1=params['address1'],
				  address2=params['address2'],
				  county=params['county'],
				  postcode=params['postcode'],
				  townname=params['townname'],
				  addresstypeid=Address.editorialAddress)
				session.add(address)
				session.flush()
				comms.addressid = address.addressid

			session.flush()

			outletdesk = OutletDesk(
			  outletid=params["outletid"],
			  deskname=params["deskname"],
			  communicationid=comms.communicationid)
			session.add(outletdesk)
			session.flush()

			# now add a research desk if required
			if params['research_required']:
				researchoutletdesk = ResearchDetailsDesk(
				outletid=outletdesk.outletid,
				outletdeskid=outletdesk.outletdeskid,
				surname=params['research_surname'],
				firstname=params['research_firstname'],
				prefix=params['research_prefix'],
				email=params['research_email'],
				tel=params['research_tel'],
				job_title=params['research_job_title'],
				researchfrequencyid=params['researchfrequencyid'],
				quest_month_1=params['quest_month_1'],
				quest_month_2=params['quest_month_2'],
				quest_month_3=params['quest_month_3'],
				quest_month_4=params['quest_month_4']
				)
				session.add(researchoutletdesk)

			# add the audit trail header record
			if "researchprojectitemid" in  params:
				activity = Activity(
					reasoncodeid=Constants.ReasonCode_Questionnaire,
					reason="",
					objecttypeid=Constants.Object_Type_Desk,
					objectid=outletdesk.outletdeskid,
					actiontypeid=Constants.Research_Record_Add,
					userid=params['userid'],
					parentobjectid=outletdesk.outletid,
					parentobjecttypeid=Constants.Object_Type_Outlet
				)

			else:
				activity = Activity(
					reasoncodeid=5,
					reason="",
					objecttypeid=Constants.Object_Type_Desk,
					objectid=outletdesk.outletdeskid,
					actiontypeid=Constants.Research_Record_Add,
					userid=params['userid'],
					parentobjectid=outletdesk.outletid,
					parentobjecttypeid=Constants.Object_Type_Outlet
				)
			session.add(activity)
			session.flush()
			transaction.commit()

			return outletdesk.outletdeskid
		except:
			LOGGER.exception("OutletDesk Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def get(outletdeskid):
		"""Get oulet desk details"""

		outletdesk = OutletDesk.query.get(outletdeskid)
		address = None
		if outletdesk.communicationid:
			comms = Communication.query.get(outletdesk.communicationid)
			if comms.addressid:
				address = Address.query.get(comms.addressid)
		else:
			comms = None
		researchoutletdesk = session.query(ResearchDetailsDesk).\
		  filter(ResearchDetailsDesk.outletdeskid == outletdesk.outletdeskid).scalar()

		last_questionaire_sent = None
		last_research_completed = None
		last_research_changed_date = ""
		last_customer_questionaire_action = ""

		if researchoutletdesk and researchoutletdesk.last_questionaire_sent:
			last_questionaire_sent = to_json_date(researchoutletdesk.last_questionaire_sent)

		if researchoutletdesk and researchoutletdesk.last_research_date:
			last_research_completed = to_json_date(researchoutletdesk.last_research_date)

		if researchoutletdesk and researchoutletdesk.last_research_changed_date:
			last_research_changed_date = researchoutletdesk.last_research_changed_date.strftime("%d-%m-%y")

		if researchoutletdesk and researchoutletdesk.last_research_date:
			last_research_completed = to_json_date(researchoutletdesk.last_research_date)

		if researchoutletdesk and researchoutletdesk.last_research_changed_date:
			last_research_changed_date = researchoutletdesk.last_customer_questionaire_action.strftime("%d-%m-%y")

		return dict(outletdesk=outletdesk,
		            researchoutletdesk=researchoutletdesk,
		            outletdeskcomms=comms,
		            deskaddress=address,
		            last_questionaire_sent=last_questionaire_sent,
		            last_research_completed=last_research_completed,
		            last_research_changed_date=last_research_changed_date,
		            last_customer_questionaire_action=last_customer_questionaire_action
		            )

	@staticmethod
	def update(params):
		""" update desk """

		transaction = BaseSql.sa_get_active_transaction()
		from prcommon.model import Outlet

		try:
			outletdesk = OutletDesk.query.get(params["outletdeskid"])

			if "researchprojectitemid" in  params:
				activity = Activity(
					reasoncodeid=Constants.ReasonCode_Questionnaire,
					reason="",
					objecttypeid=Constants.Object_Type_Desk,
					objectid=outletdesk.outletdeskid,
					actiontypeid=Constants.Research_Record_Update,
					userid=params['userid'],
					parentobjectid=outletdesk.outletid,
					parentobjecttypeid=Constants.Object_Type_Outlet
				)
			else:
				# add the audit trail header record
				activity = Activity(reasoncodeid=5,
				                    reason=params.get("reason", ""),
				                    objecttypeid=Constants.Object_Type_Desk,
				                    objectid=outletdesk.outletdeskid,
				                    actiontypeid=Constants.Research_Record_Update,
				                    userid=params['userid'],
				                    parentobjectid=outletdesk.outletid,
				                    parentobjecttypeid=Constants.Object_Type_Outlet
				                    )
			session.add(activity)
			session.flush()

			ActivityDetails.AddChange(outletdesk.deskname, params['deskname'], activity.activityid, Constants.Field_DeskName)
			outletdesk.deskname = params["deskname"]

			countryid = session.query(Outlet.countryid).filter(Outlet.outletid == outletdesk.outletid).scalar()
			if 'tel' in params:
				params['tel'] = OutletDeskGeneral._fix_number(countryid, params['tel'])
			if 'fax' in params:
				params['fax'] = OutletDeskGeneral._fix_number(countryid, params['fax'])

			if outletdesk.communicationid:
				comms = Communication.query.get(outletdesk.communicationid)
				ActivityDetails.AddChange(comms.email, params['email'], activity.activityid, Constants.Field_Email)
				ActivityDetails.AddChange(comms.tel, params['tel'], activity.activityid, Constants.Field_Tel)
				ActivityDetails.AddChange(comms.fax, params['fax'], activity.activityid, Constants.Field_Fax)
				ActivityDetails.AddChange(comms.twitter, params['twitter'], activity.activityid, Constants.Field_Twitter)
				ActivityDetails.AddChange(comms.facebook, params['facebook'], activity.activityid, Constants.Field_Facebook)
				ActivityDetails.AddChange(comms.instagram, params['instagram'], activity.activityid, Constants.Field_Instagram)
				ActivityDetails.AddChange(comms.linkedin, params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
			else:
				comms = Communication()
				session.add(comms)
				session.flush()
				ActivityDetails.AddChange('', params['email'], activity.activityid, Constants.Field_Email)
				ActivityDetails.AddChange('', params['tel'], activity.activityid, Constants.Field_Tel)
				ActivityDetails.AddChange('', params['fax'], activity.activityid, Constants.Field_Fax)
				ActivityDetails.AddChange('', params['twitter'], activity.activityid, Constants.Field_Twitter)
				ActivityDetails.AddChange('', params['facebook'], activity.activityid, Constants.Field_Facebook)
				ActivityDetails.AddChange('', params['instagram'], activity.activityid, Constants.Field_Instagram)
				ActivityDetails.AddChange('', params['linkedin'], activity.activityid, Constants.Field_LinkedIn)
				outletdesk.communicationid = comms.communicationid

			ActivityDetails.AddChange('Checked' if params['has_address_old'] else 'Unchecked', 'Checked' if params['has_address_new'] else 'Unchecked', activity.activityid, Constants.Field_No_Address)
			if params['has_address']:
				if comms.addressid:
					address = Address.query.get(comms.addressid)
					address.address1 = params['address1']
					address.address2 = params['address2']
					address.county = params['county']
					address.postcode = params['postcode']
					address.townname = params['townname']

					ActivityDetails.AddChange(address.address1, params['address1'], activity.activityid, Constants.Field_Address_1)
					ActivityDetails.AddChange(address.address2, params['address2'], activity.activityid, Constants.Field_Address_2)
					ActivityDetails.AddChange(address.county, params['county'], activity.activityid, Constants.Field_Address_County)
					ActivityDetails.AddChange(address.postcode, params['postcode'], activity.activityid, Constants.Field_Address_Postcode)
					ActivityDetails.AddChange(address.townname, params['townname'], activity.activityid, Constants.Field_Address_Town)
				else:
					address = Address(address1=params['address1'],
									          address2=params['address2'],
									          county=params['county'],
									          postcode=params['postcode'],
									          townname=params['townname'],
									          addresstypeid=Address.editorialAddress)
					session.add(address)
					session.flush()
					ActivityDetails.AddChange('', params['address1'], activity.activityid, Constants.Field_Address_1)
					ActivityDetails.AddChange('', params['address2'], activity.activityid, Constants.Field_Address_2)
					ActivityDetails.AddChange('', params['county'], activity.activityid, Constants.Field_Address_County)
					ActivityDetails.AddChange('', params['postcode'], activity.activityid, Constants.Field_Address_Postcode)
					ActivityDetails.AddChange('', params['townname'], activity.activityid, Constants.Field_Address_Town)
					comms.addressid = address.addressid
			else:
				if comms.addressid:
					session.delete(Address.query.get(comms.addressid))
					comms.addressid = None

			comms.email = params['email']
			comms.tel = params['tel']
			comms.fax = params['fax']
			comms.twitter = params['twitter']
			comms.facebook = params['facebook']
			comms.instagram = params['instagram']
			comms.linkedin = params['linkedin']

			researchoutletdesk = session.query(ResearchDetailsDesk).\
			  filter(ResearchDetailsDesk.outletdeskid == outletdesk.outletdeskid).scalar()
			# update research details

			ActivityDetails.AddChange('Checked' if params['required_old'] else 'Unchecked', 'Checked' if params['required_new'] else 'Unchecked', activity.activityid, Constants.Field_Research_Details_Required)
			if params['research_required']:
				if not researchoutletdesk:
					researchoutletdesk = ResearchDetailsDesk(
							outletid=outletdesk.outletid,
							outletdeskid=outletdesk.outletdeskid,
							surname=params['research_surname'],
							firstname=params['research_firstname'],
							prefix=params['research_prefix'],
							email=params['research_email'],
							tel=params['research_tel'],
							job_title=params['research_job_title'],
					    researchfrequencyid=params['researchfrequencyid'],
					    quest_month_1=params['quest_month_1'],
					    quest_month_2=params['quest_month_2'],
					    quest_month_3=params['quest_month_3'],
					    quest_month_4=params['quest_month_4'],
					    last_questionaire_sent=params["last_questionaire_sent"],
					    notes=params["notes"],
					    last_research_date=params["last_research_completed"])
					session.add(researchoutletdesk)
					ActivityDetails.AddChange('', params['research_surname'], activity.activityid, Constants.Field_Research_Surname)
					ActivityDetails.AddChange('', params['research_firstname'], activity.activityid, Constants.Field_Research_Firstname)
					ActivityDetails.AddChange('', params['research_prefix'], activity.activityid, Constants.Field_Research_Prefix)
					ActivityDetails.AddChange('', params['research_email'], activity.activityid, Constants.Field_Research_Email)
					ActivityDetails.AddChange('', params['research_tel'], activity.activityid, Constants.Field_Research_Tel)
					ActivityDetails.AddChange('', params['research_job_title'], activity.activityid, Constants.Field_Research_Job_Title)
					new_frequency = ResearchFrequencies.query.get(int(params['researchfrequencyid']))
					ActivityDetails.AddChange('', new_frequency.researchfrequencyname, activity.activityid, Constants.Field_Reseach_Frequency)

					ActivityDetails.AddChange('', Months.getDescription(int(params['quest_month_1'])), activity.activityid, Constants.Field_Month1)
					ActivityDetails.AddChange('', Months.getDescription(int(params['quest_month_2'])), activity.activityid, Constants.Field_Month2)
					ActivityDetails.AddChange('', Months.getDescription(int(params['quest_month_3'])), activity.activityid, Constants.Field_Month3)
					ActivityDetails.AddChange('', Months.getDescription(int(params['quest_month_4'])), activity.activityid, Constants.Field_Month4)
					ActivityDetails.AddChange('', params['last_questionaire_sent'], activity.activityid, Constants.Field_Research_Last_Questionaire_Sent)
					ActivityDetails.AddChange('', params['notes'], activity.activityid, Constants.Field_Research_Notes)
					ActivityDetails.AddChange('', params['last_research_completed'], activity.activityid, Constants.Field_Research_Last_Researched_Completed)
				else:
					ActivityDetails.AddChange(researchoutletdesk.surname, params['research_surname'], activity.activityid, Constants.Field_Research_Surname)
					ActivityDetails.AddChange(researchoutletdesk.firstname, params['research_firstname'], activity.activityid, Constants.Field_Research_Firstname)
					ActivityDetails.AddChange(researchoutletdesk.prefix, params['research_prefix'], activity.activityid, Constants.Field_Research_Prefix)
					ActivityDetails.AddChange(researchoutletdesk.email, params['research_email'], activity.activityid, Constants.Field_Research_Email)
					ActivityDetails.AddChange(researchoutletdesk.tel, params['research_tel'], activity.activityid, Constants.Field_Research_Tel)
					ActivityDetails.AddChange(researchoutletdesk.job_title, params['research_job_title'], activity.activityid, Constants.Field_Research_Job_Title)

					old_frequencyname = new_frequencyname = ''
					if researchoutletdesk.researchfrequencyid:
						old_frequency = ResearchFrequencies.query.get(researchoutletdesk.researchfrequencyid)
						old_frequencyname = old_frequency.researchfrequencyname
					if 'researchfrequencyid' in params and params['researchfrequencyid'] != '':
						new_frequency = ResearchFrequencies.query.get(int(params['researchfrequencyid']))
						new_frequencyname = new_frequency.researchfrequencyname
					ActivityDetails.AddChange(old_frequencyname, new_frequencyname, activity.activityid, Constants.Field_Reseach_Frequency)

					old_month1 = new_month1 = ''
					if researchoutletdesk.quest_month_1:
						old_month1 = Months.getDescription(researchoutletdesk.quest_month_1)
					if 'quest_month_1' in params and params['quest_month_1'] != '' and params['quest_month_1'] != None:
						new_month1 = Months.getDescription(int(params['quest_month_1']))
					ActivityDetails.AddChange(old_month1, new_month1, activity.activityid, Constants.Field_Month1)
					old_month2 = new_month2 = ''
					if researchoutletdesk.quest_month_2:
						old_month2 = Months.getDescription(researchoutletdesk.quest_month_2)
					if 'quest_month_2' in params and params['quest_month_2'] != '' and params['quest_month_2'] != None:
						new_month2 = Months.getDescription(int(params['quest_month_2']))
					ActivityDetails.AddChange(old_month2, new_month2, activity.activityid, Constants.Field_Month2)
					old_month3 = new_month3 = ''
					if researchoutletdesk.quest_month_3:
						old_month3 = Months.getDescription(researchoutletdesk.quest_month_3)
					if 'quest_month_3' in params and params['quest_month_3'] != '' and params['quest_month_3'] != None:
						new_month3 = Months.getDescription(int(params['quest_month_3']))
					ActivityDetails.AddChange(old_month3, new_month3, activity.activityid, Constants.Field_Month3)
					old_month4 = new_month4 = ''
					if researchoutletdesk.quest_month_4:
						old_month4 = Months.getDescription(researchoutletdesk.quest_month_4)
					if 'quest_month_4' in params and params['quest_month_4'] != '' and params['quest_month_4'] != None:
						new_month4 = Months.getDescription(int(params['quest_month_4']))
					ActivityDetails.AddChange(old_month4, new_month4, activity.activityid, Constants.Field_Month4)

					ActivityDetails.AddChange(researchoutletdesk.last_questionaire_sent, params['last_questionaire_sent'], activity.activityid, Constants.Field_Research_Last_Questionaire_Sent)
					ActivityDetails.AddChange(researchoutletdesk.notes, params['notes'], activity.activityid, Constants.Field_Research_Notes)
					ActivityDetails.AddChange(researchoutletdesk.last_research_date, params['last_research_completed'], activity.activityid, Constants.Field_Research_Last_Researched_Completed)

					researchoutletdesk.surname = params['research_surname']
					researchoutletdesk.firstname = params['research_firstname']
					researchoutletdesk.prefix = params['research_prefix']
					researchoutletdesk.email = params['research_email']
					researchoutletdesk.tel = params['research_tel']
					researchoutletdesk.job_title = params['research_job_title']
					researchoutletdesk.researchfrequencyid = params['researchfrequencyid']
					researchoutletdesk.quest_month_1 = params['quest_month_1']
					researchoutletdesk.quest_month_2 = params['quest_month_2']
					researchoutletdesk.quest_month_3 = params['quest_month_3']
					researchoutletdesk.quest_month_4 = params['quest_month_4']
					researchoutletdesk.last_questionaire_sent = params["last_questionaire_sent"]
					researchoutletdesk.notes = params["notes"]
					researchoutletdesk.last_research_date = params["last_research_completed"]
			# no longer required remove
			elif researchoutletdesk:
				session.delete(researchoutletdesk)

			transaction.commit()
		except:
			LOGGER.exception("OutletDesk update")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def delete(params):
		""" delete desk """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			outletdesk = OutletDesk.query.get(params['outletdeskid'])

			if "researchprojectitemid" in  params:
				activity = Activity(
					reasoncodeid=Constants.ReasonCode_Questionnaire,
					reason="",
					objecttypeid=Constants.Object_Type_Desk,
					objectid=outletdesk.outletdeskid,
					actiontypeid=Constants.Research_Record_Delete,
					userid=params['userid'],
					parentobjectid=outletdesk.outletid,
					parentobjecttypeid=Constants.Object_Type_Outlet,
				    name=outletdesk.deskname
				)
			else:
				activity = Activity(
					reasoncodeid=5,
					reason="",
					objecttypeid=Constants.Object_Type_Desk,
					objectid=outletdesk.outletdeskid,
					actiontypeid=Constants.Research_Record_Delete,
					userid=params['userid'],
					parentobjectid=outletdesk.outletid,
					parentobjecttypeid=Constants.Object_Type_Outlet,
				    name='Desk: ' + outletdesk.deskname
				)
			session.add(activity)
			session.flush()
			session.delete(outletdesk)

			transaction.commit()
		except:
			LOGGER.exception("OutletDesk delete")
			try:
				transaction.rollback()
			except:
				pass
			raise
