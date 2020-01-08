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
from prcommon.model import ResearchProjectItems, Outlet


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
	ListData2 = """
		SELECT
		p.publisherid,
	    p.publisherid AS id,
		p.publishername,
	    p.www,
	    p.sourcetypeid,
	    s.sourcename
		FROM internal.publishers AS p
	    LEFT OUTER JOIN internal.sourcetypes AS s ON s.sourcetypeid = p.sourcetypeid"""

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.publishers AS p"""

	@classmethod
	def get_list_publisher_questionnaires(cls, params):
		""" get rest page  """

		from prcommon.model import CustomerPrmaxDataSets

		whereused = ""

		if "publishername" in params:
			whereused = BaseSql.addclause("", "publishername ilike :publishername")
			if params["publishername"]:
				params["publishername"] = params["publishername"].replace("*", "")
				params["publishername"] = params["publishername"] + "%"

		if "publisherid" in  params:
			whereused = BaseSql.addclause(whereused, "publisherid = :publisherid")

		if 'questionnaireid' in params:
			questionnaire = ResearchProjectItems.query.get(int(params['questionnaireid']))
			outlet = Outlet.query.get(questionnaire.outletid)
			params['countryid'] = outlet.countryid
			whereused = BaseSql.addclause(whereused,
			"""(countryid IN (SELECT countryid
			                  FROM internal.prmaxdatasetcountries
			                  WHERE prmaxdatasetid in (SELECT distinct(prmaxdatasetid)
			                                           FROM internal.prmaxdatasetcountries
			                                           WHERE countryid = :countryid))
			    OR countryid is null)""")

		return cls.get_rest_page_base(
									params,
									'publisherid',
									'publishername',
									Publisher.ListData + whereused + BaseSql.Standard_View_Order,
									Publisher.ListDataCount + whereused,
									cls)

	@classmethod
	def get_list_publisher(cls, params):
		""" get rest page  """

		from prcommon.model import CustomerPrmaxDataSets

		whereused = ""

		if "publishername" in params:
			whereused = BaseSql.addclause("", "publishername ilike :publishername")
			if params["publishername"]:
				params["publishername"] = params["publishername"].replace("*", "")
				params["publishername"] = params["publishername"] + "%"

		if "publisherid" in  params:
			whereused = BaseSql.addclause(whereused, "publisherid = :publisherid")

		if 'customerid' in params:
			whereused = BaseSql.addclause(whereused,
			"""(countryid IN (SELECT pc.countryid
				            FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
				          WHERE cpd.customerid = :customerid)
				OR countryid is null)""")

		return cls.get_rest_page_base(
									params,
									'publisherid',
									'publishername',
									Publisher.ListData + whereused + BaseSql.Standard_View_Order,
									Publisher.ListDataCount + whereused,
									cls)

	@classmethod
	def get_list_publisher2(cls, params):
		""" get rest page  """

		from prcommon.model import CustomerPrmaxDataSets

		whereused = ""

		if "publishername" in params:
			whereused = BaseSql.addclause("", "p.publishername ilike :publishername")
			if params["publishername"]:
				params["publishername"] = params["publishername"].replace("*", "")
				params["publishername"] = params["publishername"] + "%"

		if "publisherid" in  params:
			whereused = BaseSql.addclause(whereused, "p.publisherid = :publisherid")

		if 'sourcetypeid' in params:
			whereused = BaseSql.addclause(whereused, "p.sourcetypeid = :sourcetypeid")

		return cls.get_rest_page_base(
									params,
									'publisherid',
									'publishername',
									Publisher.ListData2 + whereused + BaseSql.Standard_View_Order,
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
		"""(countryid IN (SELECT pc.countryid
						FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
					  WHERE cpd.customerid = :customerid)
		    OR countryid is null)""")

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
	def exists(cls, publishername, customerid, publisherid=-1):
		""" check to see if a specific publisher exists """

		command = """SELECT publisherid FROM internal.publishers
		WHERE publishername ilike :publishername
		AND (countryid IN (SELECT pc.countryid
		                  FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasetcountries AS pc ON cpd.prmaxdatasetid = pc.prmaxdatasetid
		                  WHERE cpd.customerid = :customerid)
		                  OR countryid is null)"""
		data = session.execute(text(command), {'publishername': publishername, 'customerid': customerid}, Publisher).fetchall()
		if len(data) > 0 and publisherid != -1:
			for row in data:
				if row[0] != publisherid:
					return True
			else:
				return False
		else:
			return True if len(data) > 0 else False

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
