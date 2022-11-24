# -*- coding: utf-8 -*-
"""Clipping Record """
#-----------------------------------------------------------------------------
# Name:        clipping.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table
from prcommon.model.common import BaseSql

class Clipping(BaseSql):
	""" Clippings record """

	@property
	def has_link(self):
		"check to see if link exists"

		if self.clip_link and self.clip_link.lower() != "no link":
			return True

		return False

	def get_link(self):
		"get link"
		if self.clip_link[:4].lower() != 'http':
			self.clip_link = "http://" + self.clip_link
		return self.clip_link

	def get_disrate(self):
		"get disrate"
		if self.clip_disrate:
			return '%.2f' % self.clip_disrate
		else:
			return 'N/A'


Clipping.mapping = Table('clippings', metadata, autoload=True, schema="userdata")
mapper(Clipping, Clipping.mapping)

