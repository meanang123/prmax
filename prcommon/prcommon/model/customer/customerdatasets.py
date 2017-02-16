# -*- coding: utf-8 -*-
""" Customer Data Sets """
#-----------------------------------------------------------------------------
# Name:        customerdataset.py
# Purpose:		Data sets for a customer
#
# Author:      Chris Hoy
#
# Created:     01/06/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from prcommon.model.common import BaseSql
from prcommon.model.customer.datasets import PrmaxDataSets
from prcommon.model.internal import AuditTrail

import prcommon.Constants as Constants
import logging
LOG = logging.getLogger("prmax")

class CustomerPrmaxDataSets(BaseSql):
	""" data sets for customers """

	@classmethod
	def rest_grid_page(cls, params):
		""" rest controler """

		single = True if "prmaxdatasetid" in params else False
		return cls.grid_to_rest(cls.get_grid_page(params),
		                          params['offset'],
		                          single)

	List_Data_View = """SELECT ds.prmaxdatasetid, ds.prmaxdatasetdescription,cds.customerprmaxdatasetid
	FROM internal.prmaxdatasets AS ds LEFT OUTER JOIN internal.customerprmaxdatasets AS cds ON ds.prmaxdatasetid = cds.prmaxdatasetid AND cds.customerid = :icustomerid"""

	List_Data_Count = """SELECT COUNT(*)
	FROM internal.prmaxdatasets AS ds LEFT OUTER JOIN internal.customerprmaxdatasets AS cds ON ds.prmaxdatasetid = cds.prmaxdatasetid AND cds.customerid = :icustomerid"""

	@classmethod
	def get_grid_page(cls, params):
		""" list of all dataset with those selected  """

		whereclause = ""
		if "icustomerid" not in params:
			return dict(numRows=0, items=[], identifier='prmaxdatasetid')


		params['sortfield'] = params.get('sortfield', 'UPPER(prmaxdatasetdescription)')

		return BaseSql.getGridPage(
		  params,
		  'UPPER(prmaxdatasetdescription)',
		  'prmaxdatasetid',
		  CustomerPrmaxDataSets.List_Data_View + whereclause + BaseSql.Standard_View_Order,
		  CustomerPrmaxDataSets.List_Data_Count + whereclause,
		  cls)


	@classmethod
	def update_datasets(cls, params):
		"""Update Data Sets"""

		icustomerid = params.get("icustomerid", None)
		message = "Data Set %s"
		transaction = cls.sa_get_active_transaction()
		try:
			dataset = None
			if params["customerprmaxdatasetid"]:
				tmp = CustomerPrmaxDataSets.query.get(params["customerprmaxdatasetid"])
				if tmp:
					dataset = PrmaxDataSets.query.get(tmp.prmaxdatasetid)
					icustomerid = tmp.customerid
					session.delete(tmp)
					message += " Removed"

				ret = dict(customerprmaxdatasetid=None)
			else:
				tmp = CustomerPrmaxDataSets(
				  prmaxdatasetid=params["prmaxdatasetid"],
				  customerid=params["icustomerid"])
				session.add(tmp)
				session.flush()
				dataset = PrmaxDataSets.query.get(params["prmaxdatasetid"])
				ret = tmp
				message += " Added"

			if dataset:
				session.add(AuditTrail(audittypeid=Constants.audit_trail_international,
				                       audittext=message % dataset.prmaxdatasetdescription,
				                       userid=params['user_id'],
				                       customerid=icustomerid))

			transaction.commit()
			return ret

		except:
			LOG.exception("update_datasets")
			transaction.rollback()
			raise


	@staticmethod
	def set_primary(customerid):
		"""Add the primary data set too a user """

		dataset = session.query(PrmaxDataSets).filter(PrmaxDataSets.prmaxdatasetdescription == "United Kingdom and Republic of Ireland").scalar()

		session.add(CustomerPrmaxDataSets(
		  customerid=customerid,
		  prmaxdatasetid=dataset.prmaxdatasetid))

CustomerPrmaxDataSets.mapping = Table('customerprmaxdatasets', metadata, autoload=True, schema="internal")

mapper(CustomerPrmaxDataSets, CustomerPrmaxDataSets.mapping)
