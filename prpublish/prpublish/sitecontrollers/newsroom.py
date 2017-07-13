# -*- coding: utf-8 -*-
""" virtual news room """
#-----------------------------------------------------------------------------
# Name:        newsroom.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     26/04/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears import controllers, expose
from ttl.tg.common import set_default_response_settings, set_response_type
from prcommon.model import VirtualNewsRoom
from prpublish.lib.common import page_settings_basic

class NewsRoomController(controllers.RootController):
	""" controlls virtual news desk """

	@expose("")
	def default(self, *argv, **params):
		""" handles access to the virtual news room """

		# check too see if file is valid newsroom
		newsroom = VirtualNewsRoom.is_news_room_file(
		  argv,
		  params)
		# if is valid news room then get data
		if newsroom:
			(data, datatype) = newsroom.get_page( page_settings_basic(), params )
		else:
			datatype = "html"
			data = ""
			# just for debug
			#data = '%s %s' % (argv, params)

		# set the default setting for browser
		set_default_response_settings()
		set_response_type( datatype )

		return data







