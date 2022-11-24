# -*- coding: utf-8 -*-
"""send clipping emails"""
#-----------------------------------------------------------------------------
# Name:        clippingemailsend.py
# Purpose:
#
# Author:
#
# Created:     July 2017
# Copyright:   (c) 2017

#-----------------------------------------------------------------------------
import logging
import cPickle as pickle
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler
from turbogears.database import session
from ttl.tg.errorhandlers import pr_form_error_handler, \
	 pr_std_exception_handler
from ttl.tg.validators import std_state_factory, PrFormSchema
from ttl.base import stdreturn
from ttl.tg.controllers import SecureController
from prcommon.model.clippings.clippingselectionsender import ClippingSelectionSend
from prcommon.model.queues import ProcessQueue
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")
###########################################################
## validators
###########################################################
class ClippingSelectionSenderIdSchema(PrFormSchema):
	""" report id schema"""
	userid = validators.Int()


###########################################################
## Controller
###########################################################

class ClippingSelectionSenderController(SecureController):
	""" Clipping email sender"""

	@expose("json")
	def send_clippings_email(self, *args, **params):
		""" send email with all selected clippings"""

		controldata = dict(fromemailaddress=params['fromemailaddress'],
	        emailheaderid=params['emailheaderid'],
	        emailfooterid=params['emailfooterid'],
	        emaillayoutid=params['emaillayoutid'],
	        emailsubject=params['emailsubject'],
	        toemailaddress=params['toemailaddress'])

		processqueue = ProcessQueue(
	        processid=Constants.Process_Clippings_Send_Selection_Report,
	        objectid=int(params['userid']),
		    processqueueoutput=pickle.dumps(controldata))
		session.flush()
		session.commit()

		return stdreturn(processqueueid=processqueue.processqueueid)
