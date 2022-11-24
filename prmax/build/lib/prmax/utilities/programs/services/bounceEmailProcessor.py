# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:				bounceEmailProcessor.py
# Purpose:		Process to analyse bounced emails setup on supervisor control
#							this will run ever 15 minutes to analyse all the email
#
# Author:			Chris Hoy
#
# Created:		25/06/2011
# RCS-ID:			$Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from time import sleep
from datetime import datetime
from prcommon.lib.bouncedemails import AnalysisMessages
from ttl.ttlenv import getEnvironment
import logging

SleepTime = 600

level = logging.INFO
logging.basicConfig(level = level )
log = logging.getLogger()

# get the environment
testEnvironment = getEnvironment()
if testEnvironment == None:
	exit(-1)

while (1==1):
	try:
		log.info("Processed Started: %s" % datetime.now())

		a = AnalysisMessages( log , testEnvironment )
		nbr = a.run( )
		log.info("Processed %d at %s" % (nbr,datetime.now()))

	except Exception, e :
		log.info("Processed Failed %s" % str(e))


	sleep( SleepTime )
