# -*- coding: utf-8 -*-
""" Client news room custom links"""
#-----------------------------------------------------------------------------
# Name:        clientnewsroomcustumlinks.py
# Purpose:     Customer Client custom links
#
# Author:      Chris Hoy
# Created:     29/04/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session, config
from sqlalchemy import Table
import prcommon.Constants as Constants

import logging
LOG = logging.getLogger("prmax.model")

class ClientNewsRoomCustumLinks(object):
	""" custom links """
	pass

ClientNewsRoomCustumLinks.mapping = Table('clientnewsroomcustumlinks', metadata, autoload = True, schema = "userdata")

mapper(ClientNewsRoomCustumLinks, ClientNewsRoomCustumLinks.mapping)
