# -*- coding: utf-8 -*-
"""employee synchronisation"""
#-----------------------------------------------------------------------------
# Name:        emplsynchroniser.py
# Purpose:     Synchronise series members
#
# Author:      Stamatia Vatsi
#
# Created:     21/10/2016
# Copyright:  (c) 2016
#
#-----------------------------------------------------------------------------

import logging
import os
from turbogears import database
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlets.emplsynchronisation import EmployeeSynchronise

LOGGER = logging.getLogger("prcommon.model")


def _run():
	""" run the application """

	sync = EmployeeSynchronise(None, True)
	resultdata = sync.start_service()


if __name__ == '__main__':
	_run()
