# -*- coding: utf-8 -*-
""" Customer Accounts Details """
#-----------------------------------------------------------------------------
# Name:        customeraccountsdetails.py
# Purpose:		 Customer Accoutn Details
#
# Author:      Chris Hoy
#
# Created:     23/02/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from ttl.model.common import BaseSql

import logging
LOG = logging.getLogger("prmax")

class CustomerAccountsDetails(BaseSql):
	"""  Customer Accoutn Details """

	pass


CustomerAccountsDetails.mapping = Table('customeraccountsdetails', metadata, autoload=True, schema="accounts")

mapper(CustomerAccountsDetails, CustomerAccountsDetails.mapping)

