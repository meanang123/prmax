# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        selenium extension .py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:     02/03/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

from selenium import selenium
from time import sleep

class SeleniumExt(selenium):
	""" Class that extend seleniums python web interface"""

	# default wait time in seconds
	DefaultWaitTime = 3

	def click_and_wait( self, location, waittime = None):
		""" press key and then wait for the system to finish before going on """
		self.click ( location )
		self.wait ( waittime )

	def wait(self , waittime  = None ):
		""" wait for a period of time """
		sleep( waittime if waittime else SeleniumExt.DefaultWaitTime)
