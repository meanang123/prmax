# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        display.py
# Purpose:     Get the data for display of outlet details.
# Author:       Chris Hoy
#
# Created:     11/07/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler, \
	 error_handler, view
from ttl.tg.validators import std_state_factory
from prmax.utilities.validators import PrOutletIdFormSchema, \
	 PrFormSchema, SimpleFormValidator, std_state_factory_extended, \
     PrEmployeeIdFormSchema
from prmax.utilities.common import addConfigDetails
from prmax.model import OutletDisplay, HelpTree, CacheStore, \
     CustomerView, EmployeeDisplay
from prcommon.model import ProfileCache
import prmax.Constants as Constants
from ttl.dict import DictExt
from ttl.tg.errorhandlers import  pr_std_exception_handler_text, \
	 pr_form_error_handler
from prmax.utilities.common import PrMaxBaseController

from prmax.utilities.Security import check_access_rights
from cherrypy import request
from ttl.ttlhtml import CompressHtml

import logging
log = logging.getLogger("prmax.display")

class DisplayController(PrMaxBaseController):
	""" Display Controller"""

	@expose("text/html")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory_extended)
	@check_access_rights("outlet")
	def outletmain(self, *args,  **kw):
		""" return the template for an outlet based upont ht etype of outlet"""

		if kw['outletid'] == -1:
			return ""

		# check cache
		data = CacheStore.getDisplayStore ( kw['customerid'], kw['outletid'],
											kw['productid'],
											Constants.Cache_Display_Outlet )

		#data = None
		if data:
			return data
		else:
			data = OutletDisplay.main_only_display(kw['outletid'], kw['customerid'])
			if data['outlet']['outlettypeid'] == Constants.Outlet_Type_Freelance:
				template = "prmax.templates.display/outletdisplay/outletfreelance"
			elif data['outlet']['prmax_outlettypeid'] in Constants.Outlet_Is_Mp:
				template = "prmax.templates.display/outletdisplay/outletmp"
			else:
				template = "prmax.templates.display/outletdisplay/outletmain"

			rendered = CompressHtml(view.render(addConfigDetails(data), template=template ) )

			CacheStore.addToCache(kw['customerid'], kw['outletid'],
								  kw['productid'],
								  Constants.Cache_Display_Outlet,
								  rendered )
			return rendered

	@expose("text/html")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory_extended)
	def outletprofile(self, *args, **kw):
		""" return the outlet profile details"""

		if kw["outletid"] == -1 :
			return ""
		# if new version
		profile = ProfileCache.get_profile_cache( kw["outletid"],  kw["customerid"])
		if profile:
			return profile

		# setup controls
		kw['cache_type'] = Constants.Cache_Search_Outlet_Profile

		def _Renderer ( kw ) :
			return CompressHtml( view.render( addConfigDetails(dict (
			    profile = OutletDisplay.getProfileList( kw['outletid'], kw['customerid']))),
			                    template = "prmax.templates.display/outletdisplay/outletprofile") )

		return self._DoCached( kw, _Renderer )


	@expose("text/html")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory_extended)
	def outletinterests(self, *args, **kw):
		""" return the data for template for outlet interests """

		if kw["outletid"] == -1 :
			return ""

		# setup controls
		kw['cache_type'] = Constants.Cache_Search_Outlet_Interests

		def _Renderer ( kw ) :
			""" render for outlet interests """
			return view.render( addConfigDetails(dict (
				interests = OutletDisplay.interests_display(
					kw['outletid'],
					kw['customerid']))),
				template = "prmax.templates.display/outletdisplay/interests")
		return self._DoCached( kw, _Renderer )

	@expose("text/html")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory_extended)
	def outletcoverage(self, *args, **kw):
		""" covergae details for a specific outlet"""

		if kw["outletid"] == -1 :
			return ""

		# setup controls
		kw['cache_type'] = Constants.Cache_Search_Outlet_Coverage

		def _Renderer ( kw ) :
			""" render for outlet interests """
			return view.render( addConfigDetails(dict (
				coverage = OutletDisplay.coverage_display(
					kw['outletid'],
					kw['customerid']))),
				template = "prmax.templates.display/outletdisplay/coverage")
		return self._DoCached( kw, _Renderer )

	@expose("text/html")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrOutletIdFormSchema(), state_factory=std_state_factory_extended)
	def outletextra(self, *args, **kw):
		""" extended outlet details"""

		if kw["outletid"] == -1 :
			return ""

		# setup controls
		kw['cache_type'] = Constants.Cache_Search_Outlet_Extra

		def _Renderer ( kw ) :
			""" render for outlet extended details """
			return view.render( addConfigDetails(dict (
			    OutletDisplay.outlet_extra_display(
			        kw['outletid'],
			        kw['customerid']))),
				template = "prmax.templates.display/outletdisplay/outletextra")
		return self._DoCached( kw, _Renderer )


	@expose("text/html")
	def outletemployees(self, *args, **kw):
		""" return template for employee detais"""
		return self._cache("outletemployees",
						   "prmax.templates.display.outletdisplay.outletemployees",
						   addConfigDetails(DictExt(kw)))

	@expose("text/html")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrEmployeeIdFormSchema(), state_factory=std_state_factory_extended)
	def employeeinterests(self, *args, **kw):
		""" Employee interest list"""

		# setup controls
		kw['cache_type'] = Constants.Cache_Search_Employee_Interests

		def _Renderer ( kw ) :
			""" render for employee interests """
			return view.render( addConfigDetails(dict (
			    EmployeeDisplay.interests_display(kw ) )),
				template = "prmax.templates.display/employeedisplay/interests")
		return self._DoCached( kw, _Renderer , False )


#########################################################
## Help System
#########################################################

	@expose("json")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def helptree(self, *argv, **kw ):
		""" This medod return the tree of help topics"""

		return HelpTree.getTree()

	@expose(template="mako:prmax.templates.display.about")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def about(self, *args, **kw):
		"""Display a more detailed about"""

		kw1 = DictExt(kw)
		kw1.request = request.base
		return addConfigDetails(kw1)

	@expose(template="mako:prmax.templates.display.contact_support")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def contact_support(self, *args, **kw):
		""" contact cupport details page """
		return addConfigDetails(kw)


