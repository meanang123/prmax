# -*- coding: utf-8 -*-
""" Standard TG controllers"""
#-----------------------------------------------------------------------------
# Name:        controllers.py
# Purpose:		standard controllers to tg syste,
#
# Author:      Chris Hoy
#
# Created:     /2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
#-----------------------------------------------------------------------------

from turbogears import controllers, identity,  view
from simplejson import JSONDecoder, JSONEncoder
import ttl.tg.cache as cache
import time
from cherrypy import response

class TTLBaseController(object):
	""" base conteoller """
	def __init__(self):
		# json controllers not sure if we should have this here
		self.jsonencoder = JSONEncoder()
		self.jsondecoder = JSONDecoder()

	def _cache(self, key , template, params ):
		""" cache page controller """
		rendered = cache.GetCache(key)
		if not rendered:
			rendered = view.render( params,
				template = template)
			cache.UpdateCache(key = key, data = rendered)

		return rendered

class OpenSecureController(controllers.RootController, TTLBaseController):
	""" an open contoller """
	def __init__(self):
		controllers.RootController.__init__(self)
		TTLBaseController.__init__(self)

class SecureController(controllers.RootController, identity.SecureResource,
					   TTLBaseController):
	""" for a sub-controller where the user must be logged in """

	require = identity.not_anonymous()
	def __init__(self):
		controllers.RootController.__init__(self)
		identity.SecureResource.__init__(self)
		TTLBaseController.__init__(self)

class SecureControllerExt(controllers.RootController, identity.SecureResource,
					   TTLBaseController):
	""" for a sub-controller where the user must be logged in
	but must be a memebr of the active group this allows for people who login in
	but are suspended for sun reason but we only know once they have logged in catch 22
	"""

	require = identity.in_group("active")

	def __init__(self):
		controllers.RootController.__init__(self)
		identity.SecureResource.__init__(self)
		TTLBaseController.__init__(self)

class SecureControllerAdmin(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","admin")

	def __init__(self):
		SecureControllerExt.__init__(self)

class SecureControllerCustomer(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","customer")

	def __init__(self):
		SecureControllerExt.__init__(self)

class SecureControllerShop(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","staff")

	def __init__(self):
		SecureControllerExt.__init__(self)

class DeliveryControllerSecure(SecureControllerExt):
	""" must be logged in   """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","delivery")

	def __init__(self):
		SecureControllerExt.__init__(self)

class SecureHeadOfficeController(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","headoffice")

	def __init__(self):
		SecureControllerExt.__init__(self)

class SecureControllerVp(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","vp")

	def __init__(self):
		SecureControllerExt.__init__(self)

class SecureControllerCallCenter(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","callcenter")

	def __init__(self):
		SecureControllerExt.__init__(self)

class SecureControllerPublisher(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","publisher")

	def __init__(self):
		SecureControllerExt.__init__(self)


class SecureControllerCommonNotCustomer(SecureControllerExt):
	""" must be logged in but is a memebr of the admin group oonly  """

	# must be active and a memebr of admin
	require = identity.All( identity.in_group("active"),  identity.in_any_group("admin", "staff", "publisher"))

	def __init__(self):
		SecureControllerExt.__init__(self)

class EmbeddedBaseController(SecureControllerExt):
	""" must be active and embedded """

	# must be active and a memebr of admin
	require = identity.in_all_groups("active","embedded")

	def __init__(self):
		SecureControllerExt.__init__(self)


def set_output_as( typestring, reportdata , infilename = None) :

	""" rest the response header details for a non json call """

	filename = infilename if infilename != None else "%.0f.csv" % time.time()

	if typestring == "csv":
		response.headers["Content-disposition"] = "inline; filename=%s"% filename
		response.headers["Content-type"] = "text/csv"
	elif typestring == "pdf":
		response.headers["Content-disposition"] = "inline; filename=%s"% filename
		response.headers["Content-type"] = "application/pdf"

	response.headers["Content-Length"] = len( reportdata )
	response.headers['Cache-Control'] = 'max-age=100'

	return reportdata




__all__ =  ["SecureController", "OpenSecureController" ,
            "SecureControllerAdmin", SecureControllerExt]
