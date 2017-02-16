# -*- coding: utf-8 -*-
"""Customer Source"""
#-----------------------------------------------------------------------------
# Name:        customersource.py
# Purpose:		
#
# Author:      
#
# Created:    19/01/2017
# RCS-ID:      $Id:  $
# Copyright:  (c) 2017

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from turbogears import visit, identity
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from prcommon.model.identity import VisitIdentity, User, Customer
from prcommon.model.internal import Cost, Terms, NbrOfLogins, AuditTrail
from prcommon.model.lookups import PrmaxModules, CustomerProducts
from prcommon.model.customer.customerdatasets import CustomerPrmaxDataSets
from prcommon.model.accounts.customeraccountsdetails import CustomerAccountsDetails
from prcommon.model.customer.customersettings import CustomerSettings
from prcommon.model.crm import Task
from prcommon.model.communications import Address, Communication
from ttl.postgres import DBCompress
from ttl.ttldate import TtlDate, DateAddMonths
from ttl.ttlmaths import toInt, from_int
from copy import deepcopy

import prcommon.Constants as Constants
from ttl.PasswordGenerator import Pgenerate
from prcommon.model.crm import ContactHistory
from prcommon.model.lookups import VatCodes, Countries, CustomerTypes
from prcommon.model.report import Report
from prcommon.model.crm2.solidmediageneral import SolidMediaGeneral
from prcommon.sales.salesorderconformation import SendOrderConfirmationBuilder, \
     UpgradeConfirmationBuilder
from ttl.string import Translate25UTF8ToHtml

import datetime
import logging
LOGGER = logging.getLogger("prcommon")


class CustomerSources(BaseSql):
	""" Customer Source table"""

	List_Types = """SELECT customersourceid,customersourcedescription FROM internal.customersources ORDER BY customersourcedescription"""
	List_Types_Count = """SELECT count(*) FROM internal.customersources ORDER BY customersourcedescription"""

	@classmethod
	def get(cls, params):
		""" get a customer source """

		data = dict(email = '',
			        phone = '',
			        address1 = '',
			        address2 = '',
			        county = '',
			        postcode = '',
			        townname = '',
		            country = '')

		customersource = CustomerSources.query.get(params["customersourceid"])
		if customersource.communicationid:
			comm = Communication.query.get(customersource.communicationid)
			data['email'] = comm.email
			data['phone'] = comm.tel
			if comm.addressid:
				address = Address.query.get(comm.addressid)
				data['address1'] = address.address1
				data['address2'] = address.address2
				data['county'] = address.county
				data['postcode'] = address.postcode
				data['townname'] = address.townname
				data['country'] = address.countryid
			
		rdict =dict(customersourceid=customersource.customersourceid,
	                customersourcedescription=customersource.customersourcedescription,
	                name = customersource.name,
	                contactname = customersource.contactname,
		            )
		rdict.update(data)
		return rdict

	@classmethod
	def update(cls, params):
		""" update customer source """
		try:
			transaction = session.begin(subtransactions=True)
			customersource = CustomerSources.query.get(params["customersourceid"])
			
			comm = session.query(Communication).\
			    filter(Communication.communicationid == customersource.communicationid).scalar()
			if not comm:

				address = Address(address1 = params['address1'],
				                  address2 = params['address2'],
				                  county = params['county'],
				                  postcode = params['postcode'],
				                  townname = params['townname'],
				                  country = params['country'])
				session.add(address)
				session.flush()
				addressid = address.addressid
				                  
				
				comm = Communication(email = params['email'],
				                     tel = params['phone'],
				                     addressid = addressid)
				session.add(comm)
				session.flush()
				communicationid = comm.communicationid
			else:
				address = session.query(Address).\
				    filter(Address.addressid == comm.addressid).scalar()
				
			customersource.communicationid = comm.communicationid
			customersource.name = params["name"]
			customersource.contactname = params["contactname"]
			comm.tel = params['phone']
			comm.email = params['email']
			address.address1 = params['address1']
			address.address2 = params['address2']
			address.county = params['county']
			address.postcode = params['postcode']
			address.townname = params['townname']
			address.countryid = params['country']
			
			
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("CustomerSources_update")
			transaction.rollback()
			raise

#########################################################
# load tables from db
CustomerSources.mapping = Table("customersources", metadata, autoload=True, schema="internal")

mapper(CustomerSources, CustomerSources.mapping)
