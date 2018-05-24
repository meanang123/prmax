# -*- coding: utf-8 -*-
""" clean up collateral database"""
#-----------------------------------------------------------------------------
# Name:        cleanupcollateral.py
# Purpose:     Clean up collateral database
#
# Author:      Stamatia Vatsi
#
# Created:     16/05/2018
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

from prcommon.model.dataclean.dataclean import CollateralClean

LOGGER = logging.getLogger("prcommon.model")


def _run():
    """ run the application """

    collateralclean = CollateralClean()
    resultdata = collateralclean.start_service()


if __name__ == '__main__':
    _run()
