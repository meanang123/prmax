# -*- coding: utf-8 -*-
"""Prospects Root"""
#-----------------------------------------------------------------------------
# Name:        prospect.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     25/07/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from ttl.tg.controllers import SecureController

from prospect import ProspectController
from company import CompanyController
from unsubscribe import UnSubscribeController
from mailing import MailingController
from sources import SourceController
from types import TypesController
from regions import RegionsController

class ProspectsController(SecureController):
	""" prospects controler """

	prospect = ProspectController()
	companies = CompanyController()
	unsubscribe = UnSubscribeController()
	mailing = MailingController()
	sources = SourceController()
	types = TypesController()
	regions = RegionsController()