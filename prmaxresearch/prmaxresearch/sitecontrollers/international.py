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

from prmaxresearch.sitecontrollers.translations import TranslationController

class InternationalController(SecureControllerExt):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	translation = TranslationController()
