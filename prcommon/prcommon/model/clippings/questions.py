# -*- coding: utf-8 -*-
"""Question Record """
#-----------------------------------------------------------------------------
# Name:        question.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from simplejson import JSONDecoder,dump
from cherrypy import request, response
from cStringIO import StringIO
from ttl.ttljson import TtlJsonEncoder
from ttl.tg.common import set_default_response_settings, set_response_type
import logging
LOG = logging.getLogger("prcommon")

class Question(BaseSql):
	""" Question record """

	@classmethod
	def get_list_page(cls, params):
		"""Get a list of customer for internal use """

		# this is the no selection option
		if params.has_key("id") and params["id"] == "-2":
			return dict(identifier="customerid",
			            numRows=1,
			            items=[dict(customerid=-2, customername="No Selection")])

		# return coplete list based on selection
		return BaseSql.getListPage(params,
		                           "customername",
		                           "customerid",
		                           Clipping.List_Combo_Customers,
		                           Customer.List_Combo_Customers_Id,
		                           cls)


	@classmethod
	def grid_to_rest(cls, data, offset, single = False ) :
		""" convert the output from a grid too a rest controller
		A single record request has a single object and not an array """

		# return the json as a string
		tmp = StringIO()
		if single:
			if data["items"]:
				dump ( data["items"][0], tmp )
		else:
			dump ( data["items"], tmp )
		tmp.flush()
		response.headers['Content-Range'] = "items %d-%d/%d" % ( offset , len(data["items"]), data["numRows"])
		data  = tmp.getvalue()
		tmp.close()
		del tmp

		set_default_response_settings()
		set_response_type( "json" )

		return data


	@classmethod
	def get_list_rest(cls, params):
		""" list of questions ro """

		single = True if "id" in params else False

		return cls.grid_to_rest(cls.combo(params),
		                        params['offset'],
		                        single)

	_Single_Record = """SELECT questionid AS id, questiontext, questiontypeid FROM userdata.questions WHERE questionid = :id"""
	_List_Combo = """SELECT questionid AS id, questiontext, questiontypeid FROM userdata.questions WHERE customerid = :customerid and questiontypeid != 3"""

	@classmethod
	def combo(cls, params):
		"""client conbo list """

		if "id" in params:
			if params["id"] == "-1":
				command = None
			else:
				command = Question._Single_Record
		else:
			command = Question._List_Combo
			if not "questiontext" in params:
				params["questiontext"] = "%"
			else:
				if params["questiontext"] == "*":
					params["questiontext"] = "%"
				else:
					params["questiontext"] += "%"

		if command:
			items = cls.sqlExecuteCommand(
			    text(command),
			    params,
			    BaseSql.ResultAsEncodedDict)
		else:
			items = []

		return dict(
		    identifier="id",
		    numRows=len(items),
		    items=items)


	

Question.mapping = Table('questions', metadata, autoload=True, schema="userdata")

mapper(Question, Question.mapping)

