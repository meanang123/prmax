# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         ttlenv.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:      25/06/2011
# RCS-ID:       $Id:  $
# Copyright:    (c) 2011
# Licence:
#-----------------------------------------------------------------------------

import getopt, sys

def getEnvironment():
	opts, args = getopt.getopt(sys.argv[1:],"" , ["live","test","cfg="])
	for o, a in opts:
		if o in ("--live",):
			return False
		if o in ("--test",):
			return True
	else:
		print "No Environment Specific --live or --test"
		return None


def getConfigFile():
	opts, args = getopt.getopt(sys.argv[1:],"" , ["live","test","cfg=", "customerid=", "ispriority"])
	for o, a in opts:
		if o in ("--cfg",):
			return a
	return None


