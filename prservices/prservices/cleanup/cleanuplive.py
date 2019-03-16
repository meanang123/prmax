# -*- coding: utf-8 -*-
"""dagabase clean up"""
#-----------------------------------------------------------------------------
# Name:        cleanup.py
# Purpose:     Clean up database from suspended customers data
#
# Author:      Stamatia Vatsi
#
# Created:     11/05/2018
# Copyright:  (c) 2018
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

from prcommon.model.dataclean.dataclean import DataClean

LOGGER = logging.getLogger("prcommon.model")


def _run():
    """ run the application """

    dataclean = DataClean()
    resultdata = dataclean.start_old_data()


if __name__ == '__main__':
    _run()
