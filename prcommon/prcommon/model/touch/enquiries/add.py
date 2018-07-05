# -*- coding: utf-8 -*-
""" Embedded Add """
#-----------------------------------------------------------------------------
# Name:        add.py
# Purpose:
#
# Author:      Seb Holt
#
# Created:	   08/02/2017
# $Revision$
# Copyright:   (c) 2017
#-----------------------------------------------------------------------------
from turbogears.database import session
from ttl.model import PPRApplication
from ttl.tg.validators import is_fixed_size_screen, embedded_flags
from pprcommon.model.tgusers import TGUser
from pprcommon.model.common.address import Address
from pprcommon.model.customer.Customer import Customer
from pprcommon.model.rounds.rounds import Rounds
from pprcommon.model.rounds.roundmembers import RoundMembers
from pprcommon.model.shops.shops import Shops
from pprcommon.model.shops.locations import ShopLocation
from pprcommon.model.shops.owners import Owners
from pprcommon.model.shops.sources import ShopSources
from pprcommon.model.lookups.customertypes import CustomerTypes
from pprcommon.model.chargebands.chargebands import ChargeBand
from pprcommon.model.lookups.lookups import PaymentMethod, CustomerStatementFrequency, CustomerBillFormats, \
     BillingMethods
from pprcommon.model.lookups.lookups import TillTypes, Days
from pprcommon.model.tills.tilltypegeneral import TillTypeGeneral
from pprcommon.model.shops.paystations import Paystations, PaystationLocations
from pprcommon.lib.common import add_config_details
import pprcommon.Constants as Constants
import datetime
import json
import urllib

PPRAPP = PPRApplication("PPREmbedded", True)

class EmbeddedAdd(object):
	""" Add function """

	@staticmethod
	def get_foundation(params, posid):

		user = TGUser.query.get(params["userid"])
	
		shop = Shops.query.get(params["shopid"])
		tilltype = TillTypes.query.get(shop.tilltypeid)
		paystation = session.query(Paystations).\
			filter(Paystations.shopid == shop.id).\
			filter(Paystations.user_id == user.user_id).all()
	
		returnurl = TillTypeGeneral.posid_to_url(tilltype.tilltypereturnurl,posid)
	
		tomorrow = datetime.datetime.today() + datetime.timedelta(days = 1)
		startdate = "%s %s" % (tomorrow.day, tomorrow.strftime("%B %Y"))
	
		typedata = []
		typeid = -1
		if shop.customertypeid:
			typeid = shop.customertypeid
	
		_Is_Business_Version = (Constants.Customer_Business_Drop, Constants.Customer_Business_Master)
		_Is_Not_Smiths = (Constants.Customer_Private, Constants.Customer_ShopSave_Account, \
			              Constants.Customer_ShopSave_Cash)
		_Private_Types = (Constants.Customer_Private, Constants.Customer_ShopSave_Account, \
			              Constants.Customer_ShopSave_Cash, Constants.Customer_ShopSave_Business)
		_Non_Private_Types = (Constants.Customer_Business_Master, Constants.Customer_Business_Drop)
		_Business_Types = (Constants.Customer_Business, Constants.Customer_Hotel, Constants.Customer_Wholesale)
		_Drop_Types = (Constants.Customer_Business, Constants.Customer_Business_Drop)
		_Contract_Types = (Constants.Customer_NationalContract, Constants.Customer_NationalBrand, \
			               Constants.Customer_NationalDrop, Constants.Customer_NationalDelivery)
		tempdata = session.query(CustomerTypes).order_by(CustomerTypes.id).all()
		tempdata = [row for row in tempdata if row.id not in _Contract_Types]
		if not shop.businessversion:
			tempdata = [row for row in tempdata if row.id not in _Is_Business_Version]
		if shop.smithextensions:
			tempdata = [row for row in tempdata if row.id not in _Is_Not_Smiths]
		typeok = False
		for row in tempdata:
			if (typeid in _Private_Types and row.id not in _Non_Private_Types) or \
			   (typeid in _Business_Types and row.id in _Business_Types) or \
			   (typeid == Constants.Customer_Business_Master and row.id == Constants.Customer_Business_Master) or \
			   (typeid == Constants.Customer_Business_Drop and row.id in _Drop_Types) or \
			   (typeid == Constants.Customer_Extra_Address and row.id == Constants.Customer_Extra_Address):
				if typeid == row.id:
					typeok = True
				typedata.append(dict(id=row.id, name=row.description))
			elif typeid in _Contract_Types:
				typeok = True
				typedata.append(dict(id=row.id, name=row.description))
		if typeok == False:
			typeid = -1

		typeitems = urllib.quote(json.dumps(typedata), "")
		
		remaining = -1
		if shop.maxcustomers:
			current = session.query(Customer).filter(Customer.shopid == shop.id).count()
			if shop.maxcustomers >= current:
				remaining = shop.maxcustomers - current
			else:
				remaining = 0
	
		flags = embedded_flags(params["browser"], shop, paystation)
		return add_config_details(
			{"fashion": flags[0],
			 "write": flags[1],
		     "kb": flags[2],
			 "logout": shop.embeddedlogout,
			 "cusonly": user.is_sales_only,
			 "startdate": startdate,
			 "shop": shop,
		     "remaining": remaining,
			 "typeid": typeid,
			 "typeitems": typeitems,
			 "returnurl": returnurl,
			 "hasowner": 1 if params["zownerid"] else 0,
			 "posid": posid},
			True,
			PPRAPP)
