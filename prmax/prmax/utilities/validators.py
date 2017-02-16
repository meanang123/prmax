# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        validators.py
# Purpose:     Holds prmax explicit validators
#
# Author:      Chris Hoy
#
# Created:     24/09/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import validators, identity
from ttl.tg.validators import std_state_factory, PrFormSchema, \
	 SimpleFormValidator

from prmax.model import CustomerView
from ttl.tg.validators import StateBlob

class PrOutletIdFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	outletid = validators.Int()

class PrEmployeeIdFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	employeeid = validators.Int()

def std_state_factory_extended():
	"""
    Creates the standard state for a prmax system capture both the user id and
    the customerid as fields"""


	sb = StateBlob()
	# capture the current user
	sb.u = identity.current.user
	try:
		# attempt to capture the current customerid
		sb.customerid = identity.current.user.customerextid
		sb.productid = CustomerView.getProductId()

	except:
		customerid = None
		sb.productid = -1

	return sb


