# -*- coding: utf-8 -*-
"""common funtions """
#-----------------------------------------------------------------------------
# Name:        common.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     14-09-2012
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------

from turbogears.database import config
from cherrypy import response

GLOBALD = None

def add_config_details(in_dict, nocache = True, app = None):
	"""Append the common information used by the template to an incomming
	dictionary.
	returns the original dictionary with the settings including all the configuration
	information and the external user options appended to it
	"""
	def append_dict():
		""" append """
		global GLOBALD
		if not GLOBALD:
			GLOBALD = dict(
				retrieve_css="", # need for genshi
				retrieve_javascript="", # need for genshi
				build=config.get('prmax.build'),
				dojopath=config.get('prmax.dojopath'),
				dojodebug=config.get('prmax.dojodebug'),
				release=config.get('prmax.release'),
				dojoversion=config.get('prmax.dojoversion'),
			    prodpath=config.get('prmax.prodpath'),
				copyright=config.get('prmax.copyright').decode('utf-8'),
				fashion='modern')

		# add settings
		adict = in_dict
		adict['prmax'] = GLOBALD
		adict['prmaxapp'] = app
		adict['fashion'] = 'modern'

		if nocache:
			set_default_response_settings()

		return adict
	return append_dict()


def set_default_response_settings():
	""" set the reponse details for no caching
	probably need to run this manually on
	json response
	"""

	response.headers['Cache-Control'] = 'no-cache, no- store, must-revalidate'
	response.headers['Pragma'] = 'no-cache'
	response.headers['Expires'] = 0
