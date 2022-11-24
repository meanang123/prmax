# -*- coding: utf-8 -*-
""" """
#-----------------------------------------------------------------------------
# Name:        partners.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     08/05/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears import expose, validate, identity
from ttl.tg.controllers import SecureController
from ttl.tg.common import set_output_as
from ttl.tg.validators import std_state_factory, PrFormSchema
from prcommon.model import ComEval

from comeval import ComEvalController

class PartnersController(SecureController):
	""" parnet specific functions """
	comeval = ComEvalController()

