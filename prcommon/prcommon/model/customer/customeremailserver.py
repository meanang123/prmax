# -*- coding: utf-8 -*-
"""Customer Email Server Record """
#-----------------------------------------------------------------------------
# Name:        customeremailserver.py
# Purpose:
# Author:
# Created:     July 2017
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from ttl.sqlalchemy.ttlcoding import CryptyInfo

import prcommon.Constants as Constants

import logging
LOG = logging.getLogger("prcommon")

CRYPTENGINE = CryptyInfo(Constants.KEY1)

class CustomerEmailServer(BaseSql):
	""" customeremailserver table"""

	List_Email_Servers = """SELECT fromemailaddress	FROM customeremailserver"""
	List_Email_Servers_count = """SELECT count(*) FROM customeremailserver"""

	@classmethod
	def getLookUp(cls, params):
		data = [dict(id=row.customeremailserverid, name=row.fromemailaddress)
		        for row in session.query(CustomerEmailServer).filter(CustomerEmailServer.customerid == params['customerid']).order_by(CustomerEmailServer.fromemailaddress).all()]

		return data


	@staticmethod
	def get_list(cls, params):
		""" list of email servers for a customer """

		def _convert(data):
			""""local convert"""
			return dict(
				customeremailserver = row.customeremailserverid,
				fromemailaddress = row.fromemailaddress)

		data = [ _convert( row ) for row in session.query( CustomerEmailServer).\
		         filter(CustomerEmailServer.customerid == params['customerid']). \
		         order_by( CustomerEmailServer.fromemailaddress).all()]


	@classmethod
	def add(cls, params):
		""" add a new fromemailaddress record """

		try:
			transaction = cls.sa_get_active_transaction()
			customeremailserver = CustomerEmailServer(
		        fromemailaddress=params["fromemailaddress"],
		        customerid=params["customerid"],
		        servertypeid=params["servertypeid"],
			    host=params["host"],
		        username=CRYPTENGINE.aes_encrypt(params["username"]),
		        password=CRYPTENGINE.aes_encrypt(params["password"]))
			session.add(customeremailserver)
			session.flush()
			transaction.commit()
			return customeremailserver.customeremailserverid
		except:
			LOG.exception("Customer_email_server_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, customeremailserverid):

		return CustomerEmailServer.query.get(customeremailserverid);

#			customeremailaddress = session.query(CustomerEmailServer).\
#			    filter(CustomerEmailServer.customerid == customeremailserver.customerid). \
#			    filter(CustomerEmailServer.fromemailaddress == customeremailserver.fromemailaddress).scalar()
#			return dict(customeremailserver=customeremailserver)


CustomerEmailServer.mapping = Table('customeremailserver', metadata, autoload=True, schema="public")

mapper(CustomerEmailServer, CustomerEmailServer.mapping)
