# -*- coding: utf-8 -*-
""" Soap Client for protal """
#-----------------------------------------------------------------------------
# Name:        solidsoapclient.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:	   16/01/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
import logging
import prcommon.Constants as Constants
import suds
from suds.client import Client

try:
	logging.getLogger('suds.client').setLevel(logging.ERROR)
	logging.getLogger('suds.transport').setLevel(logging.ERROR)
	logging.getLogger('suds.xsd.schema').setLevel(logging.ERROR)
	logging.getLogger('suds.wsdl').setLevel(logging.ERROR)
	logging.getLogger('suds.metrics').setLevel(logging.ERROR)
	logging.getLogger('suds.xsd.query').setLevel(logging.ERROR)
	logging.getLogger('suds.xsd.sxbasic').setLevel(logging.ERROR)
	logging.getLogger('suds.xsd.sxbase').setLevel(logging.ERROR)
	logging.getLogger('suds.cache').setLevel(logging.ERROR)
	PTSOAPCLIENT = Client("http://service.cyberwatcher.com/PortalServices/PortalServices.asmx?WSDL")
except:
	print ("Problem loading PT interface ")
	PTSOAPCLIENT = None


