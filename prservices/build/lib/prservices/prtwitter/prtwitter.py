# -*- coding: utf-8 -*-
"""
This interacts with the seo's to publish a link as soon as it been published
This isn't a complex app single thread only does it in batch's every 10 mintes
"""
#-----------------------------------------------------------------------------
# Name:        prtwitter.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     16/12/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011
#-----------------------------------------------------------------------------

import sys
from time import sleep
from datetime import datetime
from os import getcwd
from turbogears import database, config
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
# prservices is dummy configuration
read_config(getcwd(),  sys.argv[1:], "prservices")

# connect to database
database.bind_meta_data()

from prapi import PRTwitter
#send tweets ever 10 minutes by def ault
SLEEPTIME = config.get("prtwitter.waittime", 600)
ISTEST = config.get("prtwitter.testmode", False)

# setup logging
import logging
logging.basicConfig(level = logging.INFO )
LOGGER = logging.getLogger()

def run_twitter():
	""" run the tiwtter engine"""

	while (1==1):
		try:
			LOGGER.info("Twitter Post Started: %s" % datetime.now())

			prtwitter = PRTwitter( LOGGER , ISTEST )
			nbr = prtwitter.run( )
			LOGGER.info("Posted %d at %s" % (nbr, datetime.now()))

		except:
			LOGGER.exception("Posting Failed")

		sleep( SLEEPTIME )

if __name__ == "__main__":
	run_twitter()