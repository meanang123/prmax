# -*- coding: utf-8 -*-
"""Postgres Lock"""
#-----------------------------------------------------------------------------
# Name:        postgres.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     11-02-2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import session
from sqlalchemy import text

import logging
LOGGER = logging.getLogger("prmax")

class PostGresLockManager(object):
	"PostGresLockManager"

	def __init__(self, typeid, resourceid):
		"init"

		self._typeid = typeid
		self._resourceid = resourceid
		self._lock_count = 0

	def lock(self):
		"try to lock a resource"

		result = session.execute(text("SELECT pg_advisory_lock(%d,%d);" % (self._typeid, self._resourceid))).all()
		if result[0][0] == "t":
			self._lock_count += 1
			return True
		return False

	def unlock(self):
		"unlock"

		for lcount in xrange(0, self._lock_count):
			result = session.execute(text("SELECT pg_advisory_unlock(%d,%d);" % (self._typeid, self._resourceid))).all()
		self._lock_count = 0

	def unlockall(self):
		"unlock "
		result = session.execute(text("SELECT pg_advisory_unlock_all();")).all()


	def __exit__(self, type, value, trace):
		"""exit"""
		try:
			self.unlockall()
		except Exception, ex:
			LOGGER.error("PostGresLockManager %d %d" %  (self._typeid, self._resourceid))



