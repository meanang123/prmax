# -*- coding: utf-8 -*-
"""GeneralDistributionTemplates Record """
#-----------------------------------------------------------------------------
# Name:        generaldistributiontemplates.py
# Purpose:
# Author:      Chris Hoy
# Created:     07/01/2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
import logging
from turbogears.database import session
from prcommon.model.distribution.distributiontemplates import DistributionTemplates
from prcommon.model.common import BaseSql
from prcommon.model.lookups import DistributionTemplateTypes
from ttl.postgres import DBCompress

LOGGER = logging.getLogger("prcommon.model")

class GeneralDistributionTemplates(object):
	"""General"""

	@staticmethod
	def add(params):
		"""Add a template file """

		transaction = BaseSql.sa_get_active_transaction()
		try:

			disttemplate = DistributionTemplates(
				customerid=params['customerid'],
				description=params['description'],
			  distributiontemplatetypeid=params['distributiontemplatetypeid'],
				templatecontent=DBCompress.encode2(params['templatecontent'])
			)
			session.add(disttemplate)
			session.flush()
			transaction.commit()
			return disttemplate.distributiontemplateid
		except:
			LOGGER.exception("GeneralDistributionTemplates_add")
			transaction.rollback()
			raise

	@staticmethod
	def exists(params):
		"""Exists"""

		command = session.query(DistributionTemplates).filter(DistributionTemplates.description.ilike(params["description"]))
		if "distributiontemplateid" in params:
			command = command.filter(DistributionTemplates.distributiontemplateid != params["distributiontemplateid"])

		return True if command.count() else False

	List_Data = """SELECT dt.distributiontemplateid,dt.description,dtt.distributiontemplatesdescription
	FROM userdata.distributiontemplates AS dt
	JOIN internal.distributiontemplatetypes AS dtt ON dtt.distributiontemplatetypeid = dt.distributiontemplatetypeid"""
	List_Data_Count = "SELECT COUNT(*) FROM userdata.distributiontemplates AS dt"

	@staticmethod
	def list_templates(params):
		"""list of answers for a question """

		whereclause = BaseSql.addclause('', 'dt.customerid = :customerid')

		if "description" in params:
			params["description"] = params["description"] + "%"
			whereclause = BaseSql.addclause(whereclause, 'dt.description ILIKE :description')

		if "distributiontemplateid" in params:
			params["distributiontemplateid"] = int(params["distributiontemplateid"])
			whereclause = BaseSql.addclause(whereclause, 'dt.distributiontemplateid = :distributiontemplateid')

		return BaseSql.get_rest_page_base(
		  params,
		  'distributiontemplateid',
		  'description',
		  GeneralDistributionTemplates.List_Data + whereclause + BaseSql.Standard_View_Order,
		  GeneralDistributionTemplates.List_Data_Count + whereclause,
		  DistributionTemplates)

	@staticmethod
	def get_display(params):
		"""Gte Display Options"""

		distributiontemplate = DistributionTemplates.query.get(params["distributiontemplateid"])
		dtt = DistributionTemplateTypes.query.get(distributiontemplate.distributiontemplatetypeid)

		return {"distributiontemplateid" : distributiontemplate.distributiontemplateid,
		        "description" : distributiontemplate.description,
		        "distributiontemplatesdescription" : dtt.distributiontemplatesdescription}

	@staticmethod
	def load(params):
		""" Load a record  """

		distributiontemplate = DistributionTemplates.query.get(params["distributiontemplateid"])

		return {"distributiontemplateid" : distributiontemplate.distributiontemplateid,
		        "description" : distributiontemplate.description,
		        "templatecontent" : DBCompress.decode(distributiontemplate.templatecontent)
		        }

	@staticmethod
	def update(params):
		"""Update a template file """

		transaction = BaseSql.sa_get_active_transaction()

		try:

			disttemplate = DistributionTemplates.query.get(params["distributiontemplateid"])
			disttemplate.description = params['description']
			disttemplate.templatecontent = DBCompress.encode2(params['templatecontent'])

			transaction.commit()
		except:
			LOGGER.exception("GeneralDistributionTemplates_update")
			transaction.rollback()
			raise

	@staticmethod
	def delete(params):
		"""Delete a template file """

		transaction = BaseSql.sa_get_active_transaction()
		try:

			disttemplate = DistributionTemplates.query.get(params["distributiontemplateid"])
			if disttemplate:
				session.delete(disttemplate)

			transaction.commit()
		except:
			LOGGER.exception("GeneralDistributionTemplates_delete")
			transaction.rollback()
			raise


	ListDataCombo = """ SELECT
		dt.distributiontemplateid AS id,
	  dt.description
		FROM userdata.distributiontemplates AS dt
    %s
		ORDER BY  UPPER(dt.description)
		LIMIT :limit  OFFSET :offset """

	ListDataCountCombo = """SELECT COUNT(*) FROM userdata.distributiontemplates AS dt %s """

	@staticmethod
	def get_list(params):
		"""List for drop down list """

		whereclause = BaseSql.addclause('', 'dt.customerid = :customerid')

		whereclause = BaseSql.addclause(whereclause, 'dt.distributiontemplatetypeid =:distributiontemplatetypeid')
		params["distributiontemplatetypeid"] = int(params["distributiontemplatetypeid"])

		if "description" in params:
			whereclause = BaseSql.addclause(whereclause, "dt.description ILIKE :description")
			params["description"] = params["description"].replace("*", "%")

		if "id" in params and params["id"] not in ("-1", ""):
			whereclause = BaseSql.addclause(whereclause, "dt.distributiontemplateid  = :distributiontemplateid")
			params["distributiontemplateid"] = int(params["id"])
			del params["id"]

		if "id" in params and params["id"] == "-1":
			data = dict(identifier="id",
			            numRows=1,
			            items=[dict(id=-1, description="No Selection")])
		else:
			data = BaseSql.getListPage(params,
			                           'description',
			                           'distributiontemplateid',
			                           GeneralDistributionTemplates.ListDataCombo % whereclause,
			                           GeneralDistributionTemplates.ListDataCountCombo % whereclause,
			                           DistributionTemplates)
			if "distributiontemplateid" not in params:
				data['items'].insert(0, dict(id=-1, description="No Selection"))
				data['numRows'] += 1

		data["identifier"] = "id"

		return data









