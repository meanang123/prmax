# -*- coding: utf-8 -*-
""" Import Stamm Data """
#-----------------------------------------------------------------------------
# Name:        stamm.py
# Purpose:		 Import Stamm Data
#
# Author:      Chris Hoy
#
# Created:     14/4/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import session
from sqlalchemy import text
import sys
import simplejson
from ttl.model import BaseSql
from prcommon.model.outlet import Outlet
from prcommon.model.research import DataSourceTranslations
from prcommon.model.interests import Interests
from prcommon.model.roles import PRMaxRoles

import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")

class DataFeedsGeneral(object):
	"""Data feed geenral"""

	@staticmethod
	def do_delete_old_data(countryid):
		"""Do cleardown"""

		sys.stdout.write('Delete Country %d\n' % (countryid))
		sys.stdout.flush()
		command = session.query(Outlet.outletid).\
		    filter(Outlet.sourcetypeid.in_((2, 4, 5))).\
		    filter(Outlet.customerid == -1).\
		    filter(Outlet.countryid == countryid)

		total = command.count()
		nbr = 0
		session.begin()
		for row in session.query(Outlet.outletid).\
		    filter(Outlet.sourcetypeid.in_((2, 4, 5))).\
		    filter(Outlet.customerid == -1).\
		    filter(Outlet.countryid == countryid).all():
			nbr += 1
			session.execute('SELECT outlet_delete(:outletid)', {'outletid': row[0],}, Outlet)
			if nbr % 50 == 0:
				session.commit()
				session.begin()
				sys.stdout.write('%5d %5d\r' % (nbr, total))
				sys.stdout.flush()

		session.commit()


	@staticmethod
	def do_delete_old_sourcetypeid(sourcetypeid):
		"""Do cleardown"""

		sys.stdout.write('Delete sourcetypeid %d\n' % (sourcetypeid))
		sys.stdout.flush()
		command = session.query(Outlet.outletid).\
		    filter(Outlet.sourcetypeid == sourcetypeid).\
		    filter(Outlet.customerid == -1)

		total = command.count()
		nbr = 0
		session.begin()
		for row in session.query(Outlet.outletid).\
		    filter(Outlet.sourcetypeid == sourcetypeid).\
		    filter(Outlet.customerid == -1).all():
			nbr += 1
			session.execute('SELECT outlet_delete(:outletid)', {'outletid': row[0],}, Outlet)
			if nbr % 50 == 0:
				session.commit()
				session.begin()
				sys.stdout.write('%5d %5d\r' % (nbr, total))
				sys.stdout.flush()

		session.commit()
		
	@staticmethod
	def sourcefield(sourcetypeid):
		"""List of sourcefields """

		return [{"id":row[0].strip(), "name": row[0].strip(), } for row in session.execute(text("SELECT fieldname FROM research.datasourcetranslations WHERE sourcetypeid = :sourcetypeid GROUP BY fieldname ORDER BY fieldname;"),
		              dict(sourcetypeid=sourcetypeid), Outlet).fetchall()]

	Grid_View = """SELECT datasourcetranslationid,sourcetext,translation,TRIM(fieldname) AS fieldname ,english,extended_function FROM research.datasourcetranslations"""
	Grid_View_Count = """SELECT COUNT(*) FROM research.datasourcetranslations"""
	@staticmethod
	def get_rest_page(params):
		"""Rest Page """

		whereclause = ""
		if "sourcetypeid" in params:
			whereclause = BaseSql.addclause('', 'sourcetypeid = :sourcetypeid')
			params["sourcetypeid"] = int(params["sourcetypeid"])

			if "sourcefield" in params:
				whereclause = BaseSql.addclause(whereclause, 'fieldname like :sourcefield')
				params["sourcefield"] = "%" + params["sourcefield"] + "%"

			if "sourcetext" in params:
				whereclause = BaseSql.addclause(whereclause, 'sourcetext like :sourcetext')
				params["sourcetext"] = "%" + params["sourcetext"] + "%"

			if "not_translated" in params:
				whereclause = BaseSql.addclause(whereclause, '(translation IS NULL OR LENGTH(translation)=0)')

			data = BaseSql.get_grid_page(
				params,
				'translation',
				'datasourcetranslationid',
				DataFeedsGeneral.Grid_View + whereclause + BaseSql.Standard_View_Order,
				DataFeedsGeneral.Grid_View_Count + whereclause,
				Outlet)
		else:
			data = dict(numRows=0, items=[], identifier='datasourcetranslationid')

		return BaseSql.grid_to_rest(data, params["offset"])

	@staticmethod
	def get(datasourcetranslationid):
		"""get a record"""

		datasource = DataSourceTranslations.query.get(datasourcetranslationid)
		retvalue = datasource.__json__()

		if datasource.sourcetypeid == Constants.Source_Type_Stamm and datasource.fieldname.strip() in ("classification", "jobtitle-areainterest"):
			if datasource.extended_translation:
				interests = [Interests.query.get(interest) for interest in simplejson.loads(datasource.extended_translation)]
			else:
				interests = []
			retvalue["interests"] = interests

		if datasource.sourcetypeid == Constants.Source_Type_Stamm and datasource.fieldname.strip() == "jobtitle-areainterest":
			if datasource.translation:
				roles = [PRMaxRoles.query.get(roleid) for roleid in simplejson.loads(datasource.translation)]
			else:
				roles = []

			retvalue["roles"] = roles

		return retvalue

	@staticmethod
	def update(params):
		"""Update translations"""

		transaction = BaseSql.sa_get_active_transaction()
		try:
			datasource = DataSourceTranslations.query.get(params["datasourcetranslationid"])
			datasource.translation = params["translation"]
			datasource.extended_translation = params.get("extended_translation", None)
			transaction.commit()
		except:
			LOGGER.exception("update")
			transaction.rollback()
			raise

