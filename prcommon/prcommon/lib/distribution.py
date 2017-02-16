# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:				distribution.py
# Purpose:
#
# Author:     Chris Hoy
#
# Created:		16/05/2011
# RCS-ID:        $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from turbogears import config
import prcommon.Constants as Constants
from ttl.ttlemail import SendMessage, getTestMode

import logging
LOG = logging.getLogger("prcommon")

_FIRSTNAME = "!FIRSTNAME!"
_FORMAL = "!FORMAL!"
_JOB_TITLE = "!JOBTITLE!"

class MailMerge(object):
	""" Covert merge fields to actual values from emal row
	"""

	_ALL_TITLES = ( _FIRSTNAME, _FORMAL, _JOB_TITLE )

	@staticmethod
	def remove_embedded( instring ) :
		""" remove the embdedded mail merge fields """

		for rem in MailMerge._ALL_TITLES:
			instring = instring.replace(rem,"")

		return instring

	def __init__(self):
		self.	_tafields = {
		  _FIRSTNAME : self._func_firstname,
		  _FORMAL : self._func_formal,
		  _JOB_TITLE : self._func_job_title }

	def _func_firstname( self, key, row, emailbody ):
		""" replace a firstname tag if not exists then try formal name
		then the default is job title """
		if row["firstname"]:
			return emailbody.replace(key, row["firstname"])
		elif self._get_format_name(row):
			return emailbody.replace(key, self._get_format_name(row))
		else:
			return emailbody.replace(key, row["job_title"])

	def _func_job_title( self, key, row, emailbody ):
		""" Repleace loswest element should always exists """
		return emailbody.replace(key, row["job_title"])

	def _func_formal( self, key, row, emailbody ):
		""" formal name tag chnaged """

		if self._get_format_name(row):
			return emailbody.replace(key, self._get_format_name(row))
		elif row["firstname"]:
			return emailbody.replace(key, row["firstname"])
		else:
			return emailbody.replace(key, row["job_title"])

	def _get_format_name(self, row):
		""" get the formal name """
		rdata = ""
		if row["prefix"]:
			rdata = row["prefix"]

		if row["familyname"]:
			if rdata:
				rdata += " "
			rdata += row["familyname"]

		return rdata

	def do_merge_fields ( self, row , emailbody ) :
		""" apply merge fields """
		for (key, func) in self._tafields.items():
			if emailbody.find(key) != -1:
				emailbody = func(key, row, emailbody)

		return emailbody

	def do_merge_test ( self, emailbody) :
		""" get data for a test merge """
		row = dict ( firstname = "John", job_title = "Editor", familyname = "Smith" , prefix="Mr")
		for (key, func) in self._tafields.items():
			if emailbody.find(key) != -1:
				emailbody = func(key, row, emailbody)

		return emailbody


def get_view_link(include_view_as_link, emailtemplateid ):
	""" get the view as web page link"""

	if include_view_as_link:
		return Constants.Distribution_LinkView % ( config.get('prmax.web'), emailtemplateid )
	else:
		return ""

def get_view_link_to_seo(include_view_as_link, seoreleaseid ):
	""" get the view as web page link"""

	if include_view_as_link:
		return Constants.SEO_LinkView % ( config.get('seo.link'), seoreleaseid )
	else:
		return ""

def get_unsubscribe( data, listmemberdistributionid ):
	""" get the view as web page link"""

	return data + Constants.Unsubscribe_View % ( config.get('prmax.unsubscribe'), listmemberdistributionid )

def add_read_link(data, listmemberid):
	""" add the virtual link to the html"""
	return data + Constants.Distribution_Link % ( config.get('prmax.web'), listmemberid)



class EmailDistributionQueue(object):
	""" mark an email as having been sent """

	_sql_add_queue = """ INSERT INTO queues.emailqueue( emailaddress, subject, emailqueuetypeid, message, customerid,statusid,error)
	VALUES( %(emailaddress)s, %(subject)s, %(emailqueuetypeid)s, %(message)s, %(customerid)s, %(statusid)s, %(error)s)"""

	def __init__(self, lock , indb,  set_processed_sql, _do_email ):
		""" setup the basic details"""
		self._lock = lock
		self._db = indb
		self._sql_set_processing = set_processed_sql
		self._testmode = getTestMode()
		self._do_email = _do_email

	def markassent(self, record, error ) :
		""" mark the record as having been sent """

		self._lock.acquire()
		try:
			try:
				cur2 = self._db.getCursor()
				self._db.startTransaction ( cur2 )
				# set email as created
				cur2.execute ( self._sql_set_processing, record )
				# add email to send queue but as sent
				cur2.execute ( EmailDistributionQueue._sql_add_queue,
					             dict ( emailaddress = record["emailaddress"],
					                    subject = record["subject"],
					                    emailqueuetypeid = Constants.EmailQueueType_Standard,
					                    message = None,
					                    statusid = 2 ,
					                    error = error,
					                    customerid = record["customerid"] ) )
				self._db.commitTransaction (cur2 )
				return True
			except:
				LOG.exception ("Id = %d" , record["researchprojectitemid"])
				self._db.rollbackTransaction ( cur2 )
				return False
		finally:
			self._lock.release()
			try:
				cur2.close()
			except:
				pass

	def sendemail(self, email, sender ):
		# emailer
		if self._do_email:
			(error, ignore) = SendMessage(
			  Constants.email_host ,
			  Constants.email_post,
			  email,
			  self._testmode,
			  sender)
		else:
			error = ""

		return error



