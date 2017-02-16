# -*- coding: utf-8 -*-
""" cyberwatch search ing"""
#-----------------------------------------------------------------------------
# Name:        cyberwatchgeneral.py
# Purpose:		 To do a search on the cyperwatch system
#
# Author:      Chris Hoy
#
# Created:	   20/10/2015
# Copyright:   (c) 2015

#-----------------------------------------------------------------------------
import logging
from datetime import datetime, timedelta
import prcommon.Constants as Constants
from prcommon.model.cyberwatch.soapinterface import CSWCommand, CSWSearchResult, CSWResultTextView, CWSOAPLOG

class CyberWatchGeneral(object):
	"CyberWatchGeneral"

	@staticmethod
	def do_test_search():
		#if CWSOAPLOG:
		#	CWSOAPLOG.start_log()
		start_date = datetime.now() - timedelta(days=200)
		command = CSWCommand()
		for indexid in (CSWCommand.Index_News,
		                CSWCommand.Index_Facebook,
		                CSWCommand.Index_Blog,
		                CSWCommand.Index_Twitter,
		                CSWCommand.Index_Forum):
			print indexid
			indexid = CSWCommand.Index_Twitter
			command.search_all(start_date=start_date,
			                   index=indexid,
			                   keywords=["Bishop of Durham"],
			                   extra_search=["meta.country.id=3", ],
			                   search_phrase=True)
			command.do_search(CSWResultTextView(True))

		#if CWSOAPLOG:
		#	CWSOAPLOG.end_log()
