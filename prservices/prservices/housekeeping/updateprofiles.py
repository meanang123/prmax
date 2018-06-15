# -*- coding: utf-8 -*-
"""updateprofile """
#-----------------------------------------------------------------------------
# Name:        updateprofile.py
# Purpose:
#
# Author:
#
# Created:     15/06/2018
# Copyright:  (c) 2018
#
#-----------------------------------------------------------------------------
import os
from datetime import datetime
from turbogears import database
from sqlalchemy import text
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from turbogears.database import session
from prcommon.model import OutletProfile
from prcommon.model.queues import ProcessQueue

def _run():
	""" run the application """

	for outletid in session.query(OutletProfile.outletid).all():
		session.begin()
		session.add(ProcessQueue(
			objecttypeid=Constants.Process_Outlet_Profile,
			objectid=outletid))
		session.commit()

if __name__ == '__main__':
	_run()

