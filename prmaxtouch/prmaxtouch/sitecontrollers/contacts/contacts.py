# -*- coding: utf-8 -*-
""" Contacts """
#-----------------------------------------------------------------------------
# Name:        contacts.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     28/06/2018
# Copyright:   (c) 2018

#-----------------------------------------------------------------------------
from turbogears import expose, validate, exception_handler, view, redirect
from ttl.tg.controllers import EmbeddedBaseController

from prmaxtouch.sitecontrollers.contacts.search import SearchContactController
from prmaxtouch.sitecontrollers.contacts.details import DetailsContactController
from prmaxtouch.sitecontrollers.contacts.edit import EditContactController


class ContactsController(EmbeddedBaseController):
	""" Search controller """

	search = SearchContactController()
	details = DetailsContactController()
	edit = EditContactController()

	


