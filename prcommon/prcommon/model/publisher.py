# -*- coding: utf-8 -*-
"""Publisher record """
#-----------------------------------------------------------------------------
# Name:       publisher.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     07/11/2012
# Copyright:   (c) 2012
#
#-----------------------------------------------------------------------------
import logging
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql

LOGGER = logging.getLogger("prcommon.model")

class Publisher(BaseSql):
	""" Publisher Record"""
	ListData = """
		SELECT
		publisherid,
	  publisherid AS id,
		publishername,
	  www
		FROM internal.publishers """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.publishers """

	@classmethod
	def get_list_publisher(cls, params):
		""" get rest page  """
		whereused = ""

		if "publishername" in params:
			whereused = BaseSql.addclause("", "publishername ilike :publishername")
			if params["publishername"]:
				params["publishername"] = params["publishername"].replace("*", "")
				params["publishername"] = params["publishername"] + "%"

		if "publisherid" in  params:
			whereused = BaseSql.addclause(whereused, "publisherid = :publisherid")


		return cls.get_rest_page_base(
									params,
									'publisherid',
									'publishername',
									Publisher.ListData + whereused + BaseSql.Standard_View_Order,
									Publisher.ListDataCount + whereused,
									cls)

	@classmethod
	def get_search_list_publisher(cls, params):
		""" get rest page  """
		whereused = ""
		unionclause = ""

		if "publishername" in params:
			whereused = BaseSql.addclause("", "publishername ilike :publishername")
			if params["publishername"]:
				params["publishername"] = params["publishername"].replace("*", "")
				params["publishername"] = params["publishername"] + "%"

		if "publisherid" in  params:
			whereused = BaseSql.addclause(whereused, "publisherid = :publisherid")

		# add country's for dataset
		whereused = BaseSql.addclause(whereused,
		"""countryid IN (SELECT pc.countryid
						FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
					  WHERE cpd.customerid = :userid)""")

		if "publisherid" in params and params['publisherid'] == -1:
			unionclause = " UNION SELECT -1 as publisherid, -1 as id , 'All' as publishername, '' as www "

		return cls.get_rest_page_base(
									params,
									'publisherid',
									'publishername',
									Publisher.ListData + whereused + unionclause + BaseSql.Standard_View_Order,
									Publisher.ListDataCount + whereused,
									cls)

	@classmethod
	def exists(cls, publishername, publisherid=-1):
		""" check to see a specufuc role exists """

		data = session.query(Publisher).filter_by(publishername=publishername)
		if data and publisherid != -1:
			for row in data:
				if row.publisherid != publisherid:
					return True
			else:
				return False
		else:
			return True if data.count() > 0 else False

	@classmethod
	def add(cls, params):
		""" add a new role to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			publisher = Publisher(publishername=params["publishername"],
			                       www=params["www"])
			session.add(publisher)
			session.flush()
			transaction.commit()
			return publisher.publisherid
		except:
			LOGGER.exception("Publisher Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def delete(cls, params):
		""" add a new role to the system """
		transaction = BaseSql.sa_get_active_transaction()

		try:
			publisher = Publisher.query.get(params["publisherid"])
			session.delete(publisher)
			transaction.commit()
		except:
			LOGGER.exception("Publisher Delete")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def update(cls, params):
		""" update new role to the system """

		transaction = BaseSql.sa_get_active_transaction()

		try:
			publisher = Publisher.query.get(params["publisherid"])

			publisher.www = params["www"]
			if publisher.publishername != params["publishername"]:
				# this require a re-build of the
				session.execute(text("INSERT INTO queues.processqueue(processid,objectid) SELECT 1,outletid FROM outlets WHERE publisherid=:publisherid"), dict(publisherid=params["publisherid"]), Publisher)

			publisher.publishername = params["publishername"]

			transaction.commit()
		except:
			LOGGER.exception("Publisher Update")
			try:
				transaction.rollback()
			except:
				pass
			raise


	@classmethod
	def get(cls, publisherid):
		""" Get prmaxrole details and extended details"""

		from prcommon.model.outlet import Outlet

		return dict(publisher=Publisher.query.get(publisherid),
		            inuse=True if session.query(Outlet.publisherid).filter(Outlet.publisherid == publisherid).all() else False)


#########################################################
## Map object to db
#########################################################

Publisher.mapping = Table('publishers', metadata, autoload=True, schema='internal')

mapper(Publisher, Publisher.mapping)
