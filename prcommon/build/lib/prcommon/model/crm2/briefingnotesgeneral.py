# -*- coding: utf-8 -*-
"""issuesgeneral record"""
#-----------------------------------------------------------------------------
# Name:       briefingnotesgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     14/10/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import session
from ttl.model import BaseSql

from prcommon.model.crm2.briefingnotesstatus import BriefingNotesStatus

import logging
LOGGER = logging.getLogger("prmax")

class BriefingNotesGeneral(object):
	""" BriefingNotesGeneral general"""

	@staticmethod
	def exists( params ):
		""" Check too see if issue exists """

		tmp = session.query(BriefingNotesStatus).filter(BriefingNotesStatus.briefingnotesstatusdescription.ilike(params["briefingnotesstatusdescription"])).\
		  filter(BriefingNotesStatus.customerid == params["customerid"]).all()

		if  "briefingnotesstatusid" in params:
			if tmp:
				if tmp[0].briefingnotesstatusid != int(params["briefingnotesstatusid"]):
					return True
			return False
		else:
			return True if tmp else False

	@staticmethod
	def add(params):
		""" add a new issue too the database """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			briefingnotesstatus = BriefingNotesStatus(
			  briefingnotesstatusdescription = params["briefingnotesstatusdescription"],
			  customerid = params["customerid"]
			)

			if params["background_colour"]:
				briefingnotesstatus.background_colour = params["background_colour"]

			if params["text_colour"]:
				briefingnotesstatus.text_colour = params["text_colour"]

			session.add(  briefingnotesstatus )
			session.flush()
			transaction.commit()
			return briefingnotesstatus.briefingnotesstatusid
		except:
			LOGGER.exception("briefingnotesstatus_add")
			transaction.rollback()
			raise

	@staticmethod
	def delete(params):
		""" delete a briefing note """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			briefingnotesstatus = BriefingNotesStatus.query.get(params["briefingnotesstatusid"])
			session.delete ( briefingnotesstatus )
			transaction.commit()
		except:
			LOGGER.exception("briefingnotesstatus_delete")
			transaction.rollback()
			raise

	@staticmethod
	def get(briefingnotesstatusid):
		"""get record """

		return BriefingNotesStatus.query.get(briefingnotesstatusid)


	List_Data_View = """SELECT
	bn.briefingnotesstatusid,
	bn.briefingnotesstatusdescription

	FROM userdata.briefingnotesstatus AS bn """

	List_Data_Count = """SELECT COUNT(*) FROM userdata.briefingnotesstatus AS bn """

	@staticmethod
	def briefingnote_list(params):
		"""List of issues """

		whereclause = BaseSql.addclause("", "bn.customerid = :customerid")

		if "id" in params:
			whereclause = BaseSql.addclause(whereclause, "bn.briefingnotesstatusid = :briefingnotesstatusid")
			params["briefingnotesstatusid"] = int(params["id"])

		return BaseSql.getGridPage(
		  params,
		  'UPPER(briefingnotesstatusdescription)',
		  'briefingnotesstatusid',
		  BriefingNotesGeneral.List_Data_View + whereclause + BaseSql.Standard_View_Order,
		  BriefingNotesGeneral.List_Data_Count + whereclause,
		  BriefingNotesStatus )

	@staticmethod
	def update(params):
		""" update a briefing note """

		transaction = BaseSql.sa_get_active_transaction()
		try:
			briefingnotesstatus = BriefingNotesStatus.query.get(params["briefingnotesstatusid"])

			briefingnotesstatus.briefingnotesstatusdescription = params["briefingnotesstatusdescription"]

			briefingnotesstatus.background_colour = params["background_colour"]
			briefingnotesstatus.text_colour = params["text_colour"]

			transaction.commit()
		except:
			LOGGER.exception("briefingnotesstatus_update")
			transaction.rollback()
			raise
