# -*- coding: utf-8 -*-
"""clipsearch"""
#-----------------------------------------------------------------------------
# Name:        clipsearch.py
# Purpose:     Search Clippings sources
#
# Author:      Chris Hoy
#
# Created:     27/6/2016
# Copyright:  (c) 2016
#
#-----------------------------------------------------------------------------
import logging
import os

from turbogears import database
from ttl.tg.config import read_config

logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger("prcommon.model")

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.clippings.clippingcapture import execute_capture

def _run():
	""" run the application """

	execute_capture()

if __name__ == '__main__':
	_run()
