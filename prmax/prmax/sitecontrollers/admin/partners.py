# -*- coding: utf-8 -*-
"""Partner function"""
#-----------------------------------------------------------------------------
# Name:        partners.py
# Purpose:			Allow the partner to submit a demo request
#
# Author:      Chris Hoy
#
# Created:     12/01/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------

from turbogears import identity, expose
from ttl.tg.controllers import OpenSecureController
from prmax.sitecontrollers.admin.demorequests import DemoRequestController

class PartnerController(OpenSecureController):
	""" handles all soe stuff for admin """

	requests = DemoRequestController()


