# -*- coding: utf-8 -*-
"""UnsubscribeGeneral """
#-----------------------------------------------------------------------------
# Name:        unsubscribegeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     23/10/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
from turbogears.database import session
from prcommon.model import BaseSql
from prcommon.model.customer.unsubscribe import UnSubscribe
from prcommon.model.emails import ListMemberDistribution
from prcommon.model.list import List

import logging
LOGGER = logging.getLogger("prcommon.model")

class UnsubscribeGeneral(object):
	"""User General """

	@staticmethod
	def get_unsubscribe(params):
		""" get_unsubscribe
		# get details to display"""

		listmemberdistribution = {}
		if params:
			try:
				listmemberdistributionid = int(params[0])
				listmember = ListMemberDistribution.query.get(listmemberdistributionid)
				if  listmember and listmember.emailaddress:
					listmemberdistribution["lm"] = listmember
			except:
				LOGGER.exception("get_unsubscribe")

		return listmemberdistribution

	@staticmethod
	def do_unsubscribe(params):
		"""Do unsubscribe"""

		try:
			transaction = BaseSql.sa_get_active_transaction()

			params["listmemberdistributionid"] = params["listmemberdistributionid"].split(",")[0].strip()

			# get record to unsubscribe
			listmemberdistribution = ListMemberDistribution.query.get(params["listmemberdistributionid"])
			if listmemberdistribution:
				# get list to get client id
				listdetails = List.query.get(listmemberdistribution.listid)
				#check if it no already in
				tmp = session.query(UnSubscribe.unsubscribeid).filter(UnSubscribe.emailaddress == listmemberdistribution.emailaddress.lower()).\
				    filter(UnSubscribe.clientid == listdetails.clientid).\
				    filter(UnSubscribe.customerid == listdetails.customerid).all()

				# only add if not on the unssubscrive list
				if not tmp:
					unsubscribe = UnSubscribe(emailaddress=listmemberdistribution.emailaddress.lower(),
					                          clientid=listdetails.clientid,
					                          customerid=listdetails.customerid)

					session.add(unsubscribe)

			transaction.commit()
		except:
			LOGGER.exception("do_unsubscribe")
			transaction.rollback()
			raise

	LIST_SUB_VIEW = "SELECT unsubscribeid,emailaddress FROM userdata.unsubscribe"
	LIST_SUB_COUNT = "SELECT COUNT(*) FROM userdata.unsubscribe"

	@staticmethod
	def list_unsub(params):
		"""List of email address that have been unsubscribed"""

		whereclause = BaseSql.addclause("", "customerid = :customerid")

		return BaseSql.getGridPage( params,
		    "emailaddress",
		    'unsubscribeid',
		    UnsubscribeGeneral.LIST_SUB_VIEW + whereclause + BaseSql.Standard_View_Order,
		    UnsubscribeGeneral.LIST_SUB_COUNT + whereclause,
		    UnSubscribe )


