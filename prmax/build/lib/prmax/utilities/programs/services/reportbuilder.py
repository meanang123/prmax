# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         reportbuilder
# Purpose:     To run the report generator application
#
# Author:       Chris Hoy
#
# Created:      02/10/2008
# RCS-ID:       $Id:  $
# Copyright:  (c) 2008

# look at sub-process.py look at better
#-----------------------------------------------------------------------------
from time import sleep
import logging, os , platform
import prmax.Constants as Constants
from prmax.utilities.ReportBuilder import ReportController

# initialise basic logging for the application
logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger()

# paths
if platform.system().lower()=="windows":
	templatepath = Constants.windowsReportPath
	tmppath = Constants.windowsReportDebugPath
	debug = True
else:
	templatepath = Constants.linuxReportPath
	tmppath = Constants.linuxReportDebugPath
	debug = False

if not os.path.exists(tmppath):
	os.makedirs(tmppath)


# create an instance of the report server and run the threading application
reportctl = ReportController(templatepath, tmppath, debug)
while (1==1):
	sleep(Constants.sleepintervals)
	reportctl.heartbeat()
	reportctl.run()