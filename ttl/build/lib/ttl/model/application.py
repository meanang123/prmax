# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        application.py
# Purpose:
#
# Author:      Chris Hoy
# Created:     24-07-2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

class PPRApplication(object):
	"""Base class for application sepcific setting
	Customer
	Staff
	Control
	"""
	def __init__(self, name, panel_mode ):
		""" Init """
		self._name = name
		self._panel_mode = panel_mode

	@property
	def name(self):
		"""get app name"""

		return self._name

	@property
	def customer_info_pane_mode(self):
		""" Weather the info panels on the """

		return "true" if self._panel_mode else "false"
