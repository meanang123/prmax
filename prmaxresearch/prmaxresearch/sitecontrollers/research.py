# -*- coding: utf-8 -*-
"""rearch controller """
#-----------------------------------------------------------------------------
# Name:
# Purpose:
#              functions
#
# Author:      Chris Hoy
#
# Created:
# Copyright:   (c) 2009
#-----------------------------------------------------------------------------

from turbogears import identity
from ttl.tg.controllers import SecureControllerExt
from prmaxresearch.sitecontrollers.bouncedemail import BouncedEmailsController
from prmaxresearch.sitecontrollers.frame import FrameController
from prmaxresearch.sitecontrollers.dataadmin import DataAdminController
from prmaxresearch.sitecontrollers.international import InternationalController
from prmaxresearch.sitecontrollers.clippings import ClippingsController

class ResearchController(SecureControllerExt):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	bemails = BouncedEmailsController()
	frame = FrameController()
	admin = DataAdminController()
	international = InternationalController()
	clippings = ClippingsController()
