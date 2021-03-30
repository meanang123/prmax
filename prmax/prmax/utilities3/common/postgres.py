# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import logging
from platform import platform

key = "prmax.postgres"
log_file_windows = "c:/temp/prmax_postgres.log"
log_file_unix = "/var/log/prmax/postgres.log"
try:
	osname = platform(1, 1).lower()
except:
	osname = platform(1).lower()

if osname in ("microsoft-windows", "windows-xp", "windows-vista", "windows-7","windows-post2008server","windows-10","windows-8"):
	log_file = log_file_windows
else:
	log_file = log_file_unix

log = logging.getLogger(key)

def initializepythonlogging():
	""" setu ploggin system for pg"""
	logger = logging.getLogger(key)
	hdlr = logging.FileHandler(log_file)
	formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
	hdlr.setFormatter(formatter)
	logger.addHandler(hdlr)
	logger.setLevel(logging.DEBUG)

initializepythonlogging()

class PostGresControl(object):
	""" Posgress python control class """
	def __init__(self, plpy):
		"""init"""
		self.controlsettings = plpy.execute("SELECT debug_postgres_python,search_index_rebuild_mode,search_index_disable_change FROM internal.prmaxcontrol", 1)
		self.isdisabled = self.controlsettings[0]['search_index_disable_change']

	def dodebug(self, info):
		""" log message in debug mode """
		if self.controlsettings[0]['debug_postgres_python'] == 1 :
			log.debug( info )
			print(info)

	def getindexrebuildmode(self):
		""" get the index rebuild mode """
		return self.controlsettings[0]['search_index_rebuild_mode']
