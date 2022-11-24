# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        common.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears.database import config
from ttl.dict import DictExt, createModuleDict
from prmax.model import UserView, CustomerView, CacheStore
from cherrypy import response
from ttl.tg.controllers import SecureController
from ttl.tg.common import set_default_response_settings

import prcommon.Const.Search_Indexes as Constants_Search_Indexes
import prcommon.Const.Db_Fields_Sizes as Constants_Db_Fields_Sizes
import prcommon.Const.Search_Options as Constants_Search_Options

globalD = None

def addConfigDetails(inDict, nocache = True):
	"""Append the common information used by the template to an incomming
	dictionary.
	returns the original dictionary with the settings including all the configuration
	information and the external user options appended to it
	"""
	def _appendDict():
		""" append """
		global globalD
		if not globalD:
			globalD = DictExt (
				dict(
				retrieve_css = "", # need for genshi
				retrieve_javascript = "", # need for genshi
				build = config.get('prmax.build'),
				dojopath = config.get('prmax.dojopath'),
				dojodebug = config.get('prmax.dojodebug'),
				release = config.get('prmax.release'),
				dojoversion= config.get('prmax.dojoversion'),
				prodpath = config.get('prmax.prodpath','rel'),
				url = config.get('prmax.web'),
				url_web_app = config.get('prmax.web_app'),
				copyright =  config.get('prmax.copyright').decode('utf-8'),
				search_indexes= createModuleDict(Constants_Search_Indexes.__dict__),
				field_info= createModuleDict(Constants_Db_Fields_Sizes.__dict__),
				search_options = createModuleDict(Constants_Search_Options.__dict__))
			)

		# add settings
		adict = DictExt(inDict)
		adict['prmax'] = globalD
		adict['prmax']['user'] = UserView.get()
		adict['prmax']['customer'] = CustomerView.get()

		if nocache:
			set_default_response_settings()

		return adict
	return _appendDict()

class PrMaxBaseController(SecureController):
	def __init__(self):
		SecureController.__init__(self)

	def _DoCached( self, kw, data_render_function, isOutlet = True  ):
		""" base function for cache rendering and saving
		"""

		key = kw['outletid'] if isOutlet else kw['employeeid']

		cachedata = CacheStore.getDisplayStore ( kw['customerid'],
												 key,
												 kw['productid'],
												 kw['cache_type'])
		if cachedata:
			return cachedata
		else:
			rendered = data_render_function ( kw )
			CacheStore.addToCache(kw['customerid'],
								  key,
								  kw['productid'],
								  kw['cache_type'],
								  rendered )

			return rendered
