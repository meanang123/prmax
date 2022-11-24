# -*- coding: utf-8 -*-
"""MEssages"""
#-----------------------------------------------------------------------------
# Name:        Messages.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     06-08-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from sqlalchemy.sql import text
from common import BaseSql

import logging
log = logging.getLogger("prmax.interests")

class MessageTypes(BaseSql):
	"""types of user message"""
	List = """
	SELECT mt.messagetypeid,JSON_ENCODE(mt.messagetypedescription) as messagetypedescription
	FROM internal.messagetypes AS mt
	ORDER BY mt.messagetypedescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get lookups for igroups"""
		def _convert(data):
			"internal"
			return [dict(id = row.messagetypeid, name = row.messagetypedescription)
			        for row in data.fetchall()]

		return cls.sqlExecuteCommand ( text(MessageTypes.List),
									   params,
									   _convert)

class MessageUser(BaseSql):
	""" user message"""
	@classmethod
	def add(cls, kw ) :
		""" add a new message
		or if parentmessageid set then this is a reply
		"""

		transaction = cls.sa_get_active_transaction()

		try:
			if kw.has_key("parentmessageid") and kw["parentmessageid"] == -1:
				del kw["parentmessageid"]

			t = MessageUser(**kw)
			session.flush()
			transaction.commit()
			return t.messageid
		except Exception, ex:
			transaction.rollback()
			log.error("ressageUser  Add : %s"% str(ex))
			raise ex

	@classmethod
	def delete_message(cls, kw ) :
		""" Delete a specific message
		"""
		transaction = cls.sa_get_active_transaction()

		try:
			t = MessageUser.query.get ( kw["messageid"] )
			session.delete ( t )
			transaction.commit()
		except Exception, ex:
			transaction.rollback()
			log.error("delete_message  Add : %s"% str(ex))
			raise ex


	@classmethod
	def markasread(cls, kw ) :
		""" mark a message as read """
		pass

	@classmethod
	def delete(cls, kw ) :
		""" delete a message """

	@classmethod
	def get(cls, messageid ):
		""" Get the details of a message include the category desctiprion """

		d = MessageUser.query.get ( messageid )
		l = MessageTypes.query.get ( d.messagetypeid )

		return dict ( d = d, l = l )


	ListData = """
		SELECT
	    	m.parentmessageid,
			m.messageid,
			m.subject,
	        u.display_name,
	        TO_CHAR(m.created,'DD-MM-YYYY HH24:MM') as sent,
	        mt.messagetypedescription,
	        m.touserid
		FROM userdata.message AS m
	    JOIN  internal.messagetypes  AS mt ON mt.messagetypeid = m.messagetypeid
	    LEFT OUTER JOIN tg_user AS u ON u.user_id = m.touserid
	    %s %s
		LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM userdata.message AS m %s"""

	@classmethod
	def getGridPage( cls, kw ) :
		if kw.has_key("issent"):
			whereclause =  "WHERE m.userid = :userid "
		else:
			whereclause =  "WHERE m.touserid  = :userid "

		data = BaseSql.getGridPage( kw,
									'subject',
									'messageid',
									MessageUser.ListData % (whereclause,"ORDER BY  %s %s"),
									MessageUser.ListDataCount % whereclause,
									cls )
		return data

# load tables from db
mt_table = Table('messagetypes', metadata, autoload=True, schema = 'internal')
m_table = Table('message', metadata, autoload=True, schema = 'userdata')

mapper(MessageTypes, mt_table)
mapper(MessageUser, m_table)
