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
			comms = Communication(email=params['email'],
				                      tel=params['tel'],
				                      fax=params['fax'],
				                      twitter=params['twitter'],
				                      facebook=params['facebook'],
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

		try:
			outletdesk = OutletDesk.query.get(params["outletdeskid"])
			outletdesk.deskname = params["deskname"]
			if outletdesk.communicationid:
				comms = Communication.query.get(outletdesk.communicationid)
			else:
				comms = Communication()
				session.add(comms)
				session.flush()
				outletdesk.communicationid = comms.communicationid
			if params['has_address']:
				if comms.addressid:
					address = Address.query.get(comms.addressid)
					address.address1 = params['address1']
					address.address2 = params['address2']
					address.county = params['county']
					address.postcode = params['postcode']
					address.townname = params['townname']
				else:
					address = Address(address1=params['address1'],
									          address2=params['address2'],
									          county=params['county'],
									          postcode=params['postcode'],
									          townname=params['townname'],
									          addresstypeid=Address.editorialAddress)
					session.add(address)
					session.flush()
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
			comms.linkedin = params['linkedin']

			researchoutletdesk = session.query(ResearchDetailsDesk).\
			  filter(ResearchDetailsDesk.outletdeskid == outletdesk.outletdeskid).scalar()
			# update research details
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
				else:
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
	def delete(outletdeskid):
		""" delete desk """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			outletdesk = OutletDesk.query.get(outletdeskid)
			session.delete(outletdesk)
			transaction.commit()
		except:
			LOGGER.exception("OutletDesk delete")
			try:
				transaction.rollback()
			except:
				pass
			raise
