# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        User Session.py
# Purpose:		To control access too the user session. What current list is open
#						etc
#
# Author:      Chris Hoy
#
# Created:    18-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from common import BaseSql, RunInTransaction

import logging
log = logging.getLogger("prcommon")

class UserSession(BaseSql):
	""" What the user's temporary settinga are """

	@classmethod
	def setList(cls, userid, listid):
		""" set the active list for a user """

		RunInTransaction ( cls.setListNoTrans ,
		                   dict ( userid = userid , listid = list ) )

	@classmethod
	def setListNoTrans(cls, userid, listid):
		""" set the users current active list """

		usession = UserSession.query.get(userid)
		usession.listid = listid
		session.flush()

class UserSessionImage(BaseSql):
	""" temporary storage for images before being added to clients"""
	pass



#########################################################
# load tables from db
UserSession.mapping = Table('user_session', metadata, autoload=True, schema = "internal" )
UserSessionImage.mapping = Table('user_session_images', metadata, autoload=True, schema = "internal" )
mapper(UserSession, UserSession.mapping)
mapper(UserSessionImage, UserSessionImage.mapping)
