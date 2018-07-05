# -*- coding: utf-8 -*-
""" Enquiries base controller """
#-----------------------------------------------------------------------------
# Name:        enquiries.py
# Purpose:
# Author:      Stamatia Vatsi
# Created:     26/06/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from ttl.tg.controllers import EmbeddedBaseController

from prmaxtouch.sitecontrollers.enquiries.add import AddController

class EnquiriesController(EmbeddedBaseController):
	""" Customer root """

#	search = SearchController()
	add = AddController()
	new = AddController().add
