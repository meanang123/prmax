# -*- coding: utf-8 -*-
"""report handlee"""
#-----------------------------------------------------------------------------
# Name:        synchronise.py
# Purpose:     
#
# Author:      
#
# Created:     19/04/2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, redirect, config
from turbogears.database import session
from ttl.tg.errorhandlers import pr_form_error_handler, \
	 pr_std_exception_handler
from ttl.tg.controllers import SecureController
from cherrypy import response
from prcommon.model.outlets.emplsynchronisation import EmployeeSynchronise
from prcommon.model.outlet import OutletProfile
from prcommon.model.research import ResearchDetails
from prcommon.model.queues import ProcessQueue
import prcommon.Constants as Constants
from ttl.tg.validators import std_state_factory, PrFormSchema
from ttl.base import stdreturn
###########################################################
## validators
###########################################################
class SynchroniseIdSchema(PrFormSchema):
	""" report id schema"""
	outletid = validators.Int()


###########################################################
## Controller
###########################################################

class SynchroniseController(SecureController):
	"""
		controller for series member synchronisation system
	"""

	@expose("json")
	def start(self, *args, **params):
		""" start a synchronisation
		"""

		processqueue = ProcessQueue(
	        processid=Constants.Process_Synchronisation,
	        objectid=int(params['outletid']))
		session.add(processqueue)
		session.flush()
		session.commit()	
		
		return  stdreturn(processqueueid = processqueue.processqueueid)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SynchroniseIdSchema(), state_factory=std_state_factory)
	def status(self, *args, **params):
		""" get the status of a specific parent outlet synchronisation"""

		return stdreturn(data=EmployeeSynchronise.status( int(params['outletid']), int(params['processqueueid'])))
