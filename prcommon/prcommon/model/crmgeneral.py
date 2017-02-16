# -*- coding: utf-8 -*-
"""Crm """
#-----------------------------------------------------------------------------
# Name:        crmgeneral.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     07-11-2013
# Copyright:   (c) 2013

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model import BaseSql
from datetime import datetime

import prcommon.Constants as Constants
from outlet import OutletCustomer
from employee import EmployeeCustomer, Employee

import logging
LOGGER = logging.getLogger("prcommon.model")

class PRNotesGeneral(object):
	"""General access for notes"""

	@staticmethod
	def update_private_notes(params):
		"""Update notes"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			if "employeeid" in params and  params["employeeid"]:
				tmp = session.query(EmployeeCustomer).\
				  filter(EmployeeCustomer.employeeid == params["employeeid"]).\
				  filter(EmployeeCustomer.customerid == params["customerid"]).scalar()
				if not tmp:
					employee = Employee.query.get (params["employeeid"])
					tmp = EmployeeCustomer(employeeid = params["employeeid"],
					                       outletid = employee.outletid,
					                       customerid = params["customerid"])
				tmp.profile = params["profile"]
			else:
				tmp = session.query(OutletCustomer).\
				  filter(OutletCustomer.outletid == params["outletid"]).\
				  filter(OutletCustomer.customerid == params["customerid"]).scalar()
				if not tmp:
					tmp = OutletCustomer(outletid = params["outletid"],
					                       customerid = params["customerid"])
				tmp.profile = params["profile"]

			transaction.commit()
		except:
			LOGGER.exception("update_private_notes")
			try:
				transaction.rollback()
			except :
				pass
			raise

	@staticmethod
	def get_notes(params):
		"""get the basic private notes"""

		tmp = None

		if "employeeid" in params and  params["employeeid"]:
			tmp = session.query(EmployeeCustomer).\
			  filter(EmployeeCustomer.employeeid == params["employeeid"]).\
			  filter(EmployeeCustomer.customerid == params["customerid"]).scalar()
		else:
			tmp = session.query(OutletCustomer).\
			  filter(OutletCustomer.outletid == params["outletid"]).\
			  filter(OutletCustomer.customerid == params["customerid"]).scalar()


		return tmp.profile if tmp else ""





