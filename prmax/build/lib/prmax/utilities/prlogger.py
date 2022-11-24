# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       Chris Hoy
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import cherrypy
from turbogears.identity.exceptions import IdentityFailure
from turbogears import visit

import logging
log = logging.getLogger("prmax")

class PrMaxVisitPlugin(object):
	""" Log all access to prmax system allows for debugging"""

	def __init__(self):
		""" init """
		from prmax.model import ActionLog, VisitIdentity, Visit
		self._actionLog = ActionLog
		self._visitIdentity = VisitIdentity
		self._visit = Visit
		log.debug("PrMaxVisitPlugin extension starting")

	def record_request(self, visit_id):
		""" record an event """
		self._logAction(visit_id)
		self._verifyConnection(visit_id)

	def new_visit(self, visit_id):
		""" this is a new connaction """
		self._logAction(visit_id)
		self._verifyConnection(visit_id)

	def _logAction(self, visit_id):
		""" do the actual log """

		try:
			# source ip address
			try:
				ip = cherrypy.request.headerMap.get("X-Forwarded-For", cherrypy.request.remoteAddr)
			except:
				ip = cherrypy.request.headers.get("X-Forwarded-For", cherrypy.request.remote.ip)

			# get user if valid
			user_id = 0
			v = self._visitIdentity.query.get(visit_id.key)
			if v :
				# need to get the user and customer details at this point
				# need to test for multiple login ect status
				user_id = v.user_id
			self._actionLog.logAction(user_id, ip)
		except:
			log.exception("_logAction")

	def _verifyConnection(self, visit_id):
		""" check conection is correct """
		v = self._visitIdentity.query.get(visit_id.key)
		if v :
			v2 = self._visit.query.get (v.visit_key)
			if v2 and v2.has_expired():
				log.exception( "Caught exception while getting identity from request" )
				errors = ["Session Expired"]
				raise IdentityFailure( errors )

def prmaxcontrol_on():
	""" Check to see if we should start
	"Returns True if ip tracking is properly enabled, False otherwise."""
	return cherrypy.config.get('visit.logging', True)

#Interface for the TurboGears extension
def start_extension():
	""" start the plugin """
	if not prmaxcontrol_on():
		cherrypy.log( "Prmax Logging Interface Not Enabled" )
		return
	cherrypy.log( "Prmax Control System Started" )
	visit.enable_visit_plugin( PrMaxVisitPlugin() )

def shutdown_extension():
	""" close the plugin """
	if not prmaxcontrol_on():
		return
	cherrypy.log( "Prmax Control System shutting down" )


def logError(function, err_args, kw, ex, message ):
	""" log an internal exception into the audit trail
		This will need to be added to all expection handles so we can see
		may get missed if transaction is aborted
	"""

	log.error("**** " + function.upper() + " ***** " + "\nargs : " + str(err_args)  +
			  "\nparams: " + str(kw))

	from prmax.model import ActionLog
	try:
		# source ip address
		user_id = -1
		if kw.has_key("userid"):
			user_id = kw["userid"]

		ActionLog.internalLogError(user_id, ex, message, kw, function , err_args)

	except Exception , ex :
		log.exception(ex)


