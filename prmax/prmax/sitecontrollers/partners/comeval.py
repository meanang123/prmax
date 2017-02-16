# -*- coding: utf-8 -*-
""" comeval extra info"""
#-----------------------------------------------------------------------------
# Name:        comeval.py
# Purpose:     Extra function
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


class ComEvalController(SecureController):
	""" ComEval Interface """

	@expose(content_type="application/csv")
	@identity.require(identity.in_all_groups("active","comeval"))
	@validate(validators = PrFormSchema(), state_factory = std_state_factory)
	def data_coverage(self, *args, **params):
		""" generates a csv of coverage for local newspapers """

		reportoutput = ComEval.report_data( )
		return set_output_as ( "csv" , reportoutput)
