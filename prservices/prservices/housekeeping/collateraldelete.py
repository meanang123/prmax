# -*- coding: utf-8 -*-
"""collateraldelete """
#-----------------------------------------------------------------------------
# Name:        check_queue.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     04/06/2015
# Copyright:  (c) 2015
#
#-----------------------------------------------------------------------------
import os
from datetime import datetime
from turbogears import database
from sqlalchemy import text
from ttl.ttlemail import EmailMessage, SendMessage
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from turbogears.database import session
from prcommon.model import Collateral, ECollateral

def _run():
	""" run the application """

	instore = {}

	for collateralid in session.query(ECollateral.collateralid).all():
		instore[collateralid] = collateralid

	# look for active

	# do deletes

if __name__ == '__main__':
	print "Starting ", datetime.now()
	_run()
	print "Existing ", datetime.now()

