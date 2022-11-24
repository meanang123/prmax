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

from prcommon.model.dataclean.dataclean import DataClean, CustomersClean

LOGGER = logging.getLogger("prcommon.model")


def _run():
    """ run the application """

    customersclean = CustomersClean()
    resultdata = customersclean.delete_old_customers()

if __name__ == '__main__':
    _run()
