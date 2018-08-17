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
from prmaxtouch.sitecontrollers.enquiries.edit import UpdateController
from prmaxtouch.sitecontrollers.enquiries.search import SearchContactHistoryController
from prmaxtouch.sitecontrollers.enquiries.details import DetailsContactHistoryController

class EnquiriesController(EmbeddedBaseController):
	""" Customer root """

	search = SearchContactHistoryController()
	add = AddController()
	new = AddController().add
	update = UpdateController()
	details = DetailsContactHistoryController()
	
