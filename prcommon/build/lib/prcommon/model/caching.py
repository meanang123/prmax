# -*- coding: utf-8 -*-
"""Chache interface"""
#-----------------------------------------------------------------------------
# Name: 		caching.py
# Purpose:	forward cache store access
#
# Author:   Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import logging
from types import TupleType
from turbogears.database import mapper, session, metadata
from sqlalchemy import Table, text
from ttl.postgres import DBCompress

LOGGER = logging.getLogger("prcommon.model")

class CacheQueue(object):
	""" tell formward caching engine to do job"""
	pass

class CacheStore(object):
	""" Cache store object """
	@classmethod
	def getDisplayStore(cls, customerid, objectid, productid, objecttypeid):
		""" check and return the cache data """
		result = session.query(CacheStore).filter_by(
			customerid=customerid,
			objectid=objectid,
			productid=productid,
			objecttypeid=objecttypeid)
		if result.count() == 1:
			data = result.one()
			return data.cache
		else:
			return None

	@classmethod
	def addToCache(cls, customerid, objectid, productid, objecttypeid, cache, flush=True):
		""" add data to the cache as part of a session """
		try:
			if not cls.getDisplayStore(customerid, objectid, productid, objecttypeid):
				session.add(CacheStore(
					customerid=customerid,
					objectid=objectid,
					productid=productid,
					objecttypeid=objecttypeid,
					limit=0,
					offset=0,
					cache=cache))
				if flush:
					session.flush()
		except:
			# it's pssoible to get this as a timing issue
			LOGGER.exception("addToCache")

	@classmethod
	def invalidateCacheObject(cls, customer, objectid, objecttypeid):
		""" invlideate """
		pass

class CacheStoreList(object):
	""" Acess to the cache store object system """
	@classmethod
	def getDisplayStore(cls, customerid, objectid, objecttypeid, q_offset, q_limit):
		""" get an entry from the cache store """
		result = session.query(CacheStoreList).filter_by(
			customerid=customerid,
			objectid=objectid,
			objecttypeid=objecttypeid,
			q_offset=q_offset,
			q_limit=q_limit)
		if result.count() == 1:
			data = result.one()
			return DBCompress.decode(data.cache)
		else:
			return None

class CacheControl(object):
	"""Cache Control"""
	_Cache_Clear_Command = """DELETE FROM cache.cachestore WHERE objecttypeid = :objecttypeid AND objectid = :objectid"""
	_Cache_Clear_Command_ByType = """DELETE FROM cache.cachestore WHERE objecttypeid = :objecttypeid"""


	@classmethod
	def Invalidate_Cache_Object_Research(cls, objectid, objecttypeid):
		""" Research has made a chnage invalidate cache """

		command = CacheControl._Cache_Clear_Command if objectid else CacheControl._Cache_Clear_Command_ByType

		if isinstance(objecttypeid, TupleType):
			for typeid in objecttypeid:
				session.execute(text(command),
				                dict(objectid=objectid,
				                     objecttypeid=typeid), CacheStore)
		else:
			session.execute(text(command),
			                dict(objectid=objectid,
			                     objecttypeid=objecttypeid), CacheStore)

class CacheProfile(object):
	"""cached profile view """
	pass

class CachePreBuildPageStore(object):
	"CachePreBuildPageStore"

#########################################################
##
#########################################################

CacheQueue.mapping = Table('cachequeue', metadata, autoload=True, schema="queues")
CacheStore.mapping = Table('cachestore', metadata, autoload=True, schema="cache")
CacheStoreList.mapping = Table('cachestorelist', metadata, autoload=True, schema="cache")
CacheProfile.mapping = Table('cacheprofile', metadata, autoload=True, schema="cache")
CachePreBuildPageStore.mapping = Table('cacheprebuildpagestore', metadata, autoload=True, schema="cache")


mapper(CacheStoreList, CacheStoreList.mapping)
mapper(CacheQueue, CacheQueue.mapping)
mapper(CacheStore, CacheStore.mapping)
mapper(CacheProfile, CacheProfile.mapping)
mapper(CachePreBuildPageStore, CachePreBuildPageStore.mapping)
