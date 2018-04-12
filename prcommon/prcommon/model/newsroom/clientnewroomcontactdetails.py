# -*- coding: utf-8 -*-
""" Global News room contact details"""
#-----------------------------------------------------------------------------
# Name:        clientnewroomcontactdetails.py
# Purpose:    Global News room contact detilas
#
# Author:      Chris Hoy
# Created:     27/03/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table

class ClientNewRoomContactDetails(object):
	""" Newsroom access Details """
	pass

ClientNewRoomContactDetails.mapping = Table('clientnewroomcontactdetails', metadata, autoload=True, schema="userdata")

mapper(ClientNewRoomContactDetails, ClientNewRoomContactDetails.mapping)
