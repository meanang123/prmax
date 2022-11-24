# -*- coding: utf-8 -*-
"""Communications Model """
#-----------------------------------------------------------------------------
# Name:        md_Communications.py
# Purpose:		object that contain communication information
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

class Communication(object):
	""" communication objects"""
	pass

class Address(object):
	""" address record """
	editorialAddress = 1 # this is an editorial address
	customerAddress = 2
	fullAddress = 3

	def getAddressNoPostcode ( self ) :
		""" get a formated address """

		fields = [self.address1, self.address2,  self.townname, self.county]
		return " ".join( [ row for row in fields if row])

	def getAddressAsLine(self, delimitor = ","):
		""" get as a single delimeted line"""

		fields = (self.address1, self.address2,  self.townname, self.county, self.postcode)
		return ", ".join( [ row for row in fields if row])

	def getAddressLines(self):
		""" return address as full lines """

		fields = (self.address1, self.address2,  self.townname, self.county, self.postcode)
		return [ row for row in fields if row]

################################################################################

Communication.mapping = Table('communications', metadata, autoload = True)
Address.mapping = Table('addresses', metadata, autoload = True)

mapper(Address, Address.mapping)
mapper(Communication, Communication.mapping )