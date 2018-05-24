# -*- coding: utf-8 -*-
"""Collateral interface"""
#-----------------------------------------------------------------------------
# Name:        collateral.py
# Purpose:	   Collateral interface, add update and delete user collaternal,
#				also check to see if the user has used up all the space.
#
# Author:      Chris Hoy
#
# Created:     04-04-2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import os
import os.path
import logging
from turbogears import config
from turbogears.database import metadata, mapper, session, config
from sqlalchemy import Table, MetaData, text
from sqlalchemy.sql.functions import sum as sql_sum
from prcommon.model.common import BaseSql
from prcommon.model.identity import Customer
from prcommon.model.projects import ProjectCollateral
from prcommon.model.newsroom.clientnewsroom import ClientNewsRoom
import prcommon.Constants as Constants
from ttl.postgres import DBCompress

LOGGER = logging.getLogger("prcommon.model")

CACHEDIR = config.get("prmax.cachedir", "/tmp/collateral")

class CollateralSpaceException(Exception):
	""" over allocation of space """
	pass

class Collateral(BaseSql):
	""" Press Release file storage object"""

	@classmethod
	def path_to_id(cls, collpth):
		"""Convert the collateral path to an id """

		return int(collpth[collpth.find("l/")+2:collpth.find(".")])

	@classmethod
	def get_ext_details(cls, fullname):
		""" strip out the collateral name to store it full path not required"""
		fields = fullname.split(".")
		if len(fields) > 1:
			coll = cls.query.get(fields[0])
			if coll:
				return(coll.collateralid, coll.ext[1:].strip(), coll.filename)
		return (None, None)

	@classmethod
	def exists(cls, params):
		""" Check to see of a item of collateral already exists """
		obj = session.query(Collateral).filter_by(customerid=params['customerid'],
		                                           collateralcode=params['collateralcode']).all()
		if params.has_key("collateralid") and len(obj) and params["collateralid"] == obj[0].collateralid:
			return False

		return True if len(obj) else False

	@classmethod
	def delete(cls, params):
		""" delete a specific collateral record """
		transaction = cls.sa_get_active_transaction()
		try:
			coll = Collateral.query.get(params['collateralid'])
			if coll:
				session.delete(coll)
			session.flush()

			colld = ECollateral.query.get(params['collateralid'])
			if colld:
				session.delete(colld)

			transaction.commit()
		except:
			LOGGER.exception("Collateral_Delete")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		"""change collateral fields"""
		transaction = cls.sa_get_active_transaction()
		try:
			coll = Collateral.query.get(params['collateralid'])
			coll.collateralcode = params["collateralcode"]
			coll.collateralname = params["description"]
			coll.clientid = params["clientid"] if params["clientid"] != '-1' else None
			coll.newsroomid = params["newsroomid"] if params["newsroomid"] != '-1' else None
			transaction.commit()
		except:
			LOGGER.exception("Collateral_Update")
			transaction.rollback()
			raise

	@classmethod
	def delete_selection(cls, params):
		"""change collateral fields"""
		transaction = cls.sa_get_active_transaction()
		try:

			colls = session.query(Collateral, CollateralUser).\
			  join(CollateralUser, text("userdata.collateralusers.collateralid = userdata.collateral.collateralid AND userdata.collateralusers.userid = %d" % params["userid"])).\
			  filter(Collateral.customerid == params["customerid"]).\
			  filter(CollateralUser.selected == True).all()
			if colls:
				for col in colls:
					session.delete(col[0])
			transaction.commit()
		except:
			LOGGER.exception("Collateral_Update")
			transaction.rollback()
			raise


	@classmethod
	def update_file(cls, params):
		"""Change the contents of the uploaded file """
		coll = Collateral.query.get(params['collateralid'])

		coll = ECollateral.query.get(params['collateralid'])
		coll.data = DBCompress.encode(params["fobj"].file.read())

	@classmethod
	def space_avaliable(cls, customerid, collaterallength):
		""" Check to see if a bit of collateral exceed the customers allowence """
		cust = Customer.query.get(customerid)

		size = session.query(sql_sum(Collateral.collaterallength)).filter_by(customerid=customerid).one()
		if size[0]:
			return True if cust.collateral_size > (size[0] + collaterallength) / Constants.ByteToMegaByte else False
		else:
			return True

	@classmethod
	def add(cls, params):
		""" add a new entry to the collaternal table and save the file into the actual
		folder """
		fobj = params['collateral_file']
		data = fobj.file.read()
		collaterallength = len(data)

		if not cls.space_avaliable(params["customerid"], collaterallength):
			raise CollateralSpaceException()

		transaction = cls.sa_get_active_transaction()
		try:
			(_, ext) = os.path.splitext(fobj.filename.strip())
			# create control record
			coll = Collateral(
			  customerid=params['customerid'],
			  collateralname=params['collateralname'],
			  collateralcode=params['collateralcode'],
			  filename=fobj.filename.strip(),
			  ext=ext.strip().lower(),
			  collaterallength=collaterallength)
			if params["clientid"] != "-1":
				coll.clientid = int(params["clientid"])
			if params["newsroomid"] != "-1":
				coll.newsroomid = int(params["newsroomid"])

			session.add(coll)
			session.flush()
			# add projects if avaliable
			if params.has_key("collateral_projects"):
				for projectid in params["collateral_projects"]:
					session.add(ProjectCollateral(collateralid=coll.collateralid, projectid=projectid))

			# create cache record
			colld = ECollateral(
				collateralid=coll.collateralid,
				customerid=params['customerid'],
				data=DBCompress.encode2(data))
			session.add(colld)
			session.flush()
			transaction.commit()
			return coll.collateralid
		except:
			LOGGER.exception("Collateral_add")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, params, asdict=True):
		""" return the requested collateral object"""

		from prcommon.model.emails import EmailTemplates
		from prcommon.model.client import Client

		obj = Collateral.query.get(params['collateralid'])
		emailtemplatename = clientname = description = ""
		if obj.clientid:
			clientname = Client.query.get(obj.clientid).clientname
		if obj.newsroomid:
			description = ClientNewsRoom.query.get(obj.newsroomid).description

		return dict(customerid=obj.customerid,
		            collateralname=obj.collateralname,
		            collateralcode=obj.collateralcode.strip(),
		            filename=obj.filename,
		            ext=obj.ext,
		            collateralid=obj.collateralid,
		            emailtemplatename=emailtemplatename,
		            clientname=clientname,
		            clientid=obj.clientid,
		            newsroomid=obj.newsroomid,
		            description=description,
		            collaterallength=round(obj.collaterallength / float(Constants.ByteToMegaByte), 2)
					 )

	ListData = """
		SELECT
		c.customerid,
	    JSON_ENCODE(TRIM(c.collateralcode)) AS collateralcode,
		JSON_ENCODE(c.collateralname) AS collateralname,
		JSON_ENCODE(c.filename) AS filename,
		c.collateralid,
		round(c.collaterallength/1048576.00,2) as collaterallength,
		c.ext,
	  c.emailtemplateid,
	  et.emailtemplatename,
	  cl.clientname,
	  c.clientid,
	  ns.newsroomid,
	  ns.description,
	  COALESCE( CASE WHEN cu.selected = false THEN NULL ELSE cu.selected END , false ) AS selected
		FROM userdata.collateral AS c
	  LEFT OUTER JOIN userdata.emailtemplates AS et ON c.emailtemplateid = et.emailtemplateid
	  LEFT OUTER JOIN userdata.client AS cl ON c.clientid = cl.clientid
	  LEFT OUTER JOIN userdata.collateralusers AS cu ON cu.collateralid = c.collateralid AND cu.userid = :userid 
	  LEFT OUTER JOIN userdata.clientnewsroom AS ns ON ns.newsroomid = c.newsroomid """

	ListDataCount = """
		SELECT COUNT(*) FROM userdata.collateral AS c """

	ListDataList = """
		SELECT
	  TRIM(c.collateralcode) AS collateralcode,
		c.collateralname,
		c.collateralid,
		c.ext,
	  c.emailtemplateid
		FROM userdata.collateral AS c
		WHERE c.customerid = :customerid AND
		TRIM(c.collateralcode) ILIKE :collateralcode
	    %s
		LIMIT :limit  OFFSET :offset """

	ListDataListId = """
		SELECT
	  TRIM(c.collateralcode) AS collateralcode,
		c.collateralname,
		c.collateralid,
		c.ext
		FROM userdata.collateral AS c
		WHERE c.collateralid = :collateralid"""

	@classmethod
	def get_grid_page(cls, params):
		""" get a page of collateral for a grid"""
		# fix up sort order
		if "sort" in params and len(params["sort"]):
			params["sort"] = 'UPPER(%s)' % params["sort"]

		whereused = BaseSql.addclause("", "c.customerid = :customerid")

		if "ignore_automated" in params:
			whereused = BaseSql.addclause(whereused, "c.automated_source = false")

		return BaseSql.getGridPage(params,
		                           'UPPER(collateralcode)',
		                           'collateralid',
		                           Collateral.ListData + whereused + BaseSql.Standard_View_Order,
		                           Collateral.ListDataCount + whereused,
		                           cls)

	@classmethod
	def get_list_page(cls, params):
		""" get a page of collateral for a list"""
		whereextra = ""

		if params["emailtemplateid"] == "-1":
			whereextra = " AND c.emailtemplateid IS NULL"
		else:
			whereextra = " AND ( c.emailtemplateid  = :emailtemplateid  OR c.emailtemplateid IS NULL)"

		return BaseSql.getListPage(params,
		                           'collateralcode',
		                           'collateralid',
		                           Collateral.ListDataList % whereextra,
		                           Collateral.ListDataListId,
		                           cls)

	def get_link_address(self):
		""" get the link address"""


		#x = "%s/%d%s" % ('http://prmaxtest.localhost/collateral', self.collateralid, self.ext)
		#return x
		return "%s/%d%s" % (config.get('collateral.link'), self.collateralid, self.ext)

	def get_link_description(self):
		""" get the link description"""

		return self.collateralname

class ECollateral(BaseSql):
	""" External connection need to be able to return the actual details of a
	piece of collaternal this method access the collaternal store and does so"""

	@classmethod
	def get(cls, collateralid):
		""" get the data for a specific collateral id"""
		data = cls.query.get(collateralid)

		return DBCompress.decode(data.data)

class CollateralIntgerests(BaseSql):
	""" Currently not used but may be allows the user to set catergories agains
	each pieces of collateral for searching """
	pass


class CollateralUser(object):
	"""Selection Record for user and collateral"""
	pass


class ForwardCache(object):
	"""
	Use a forward cache for collateral files
	This is an emergency fix
	"""

	def __init__(self, collateralid, ext):
		"__init__"

		self.cachefilename = os.path.normpath(os.path.join(CACHEDIR, '%d.%s' % (collateralid, ext)))

	def in_cache(self):
		"""Find in Cache"""

		if os.path.exists(self.cachefilename):
			with file(self.cachefilename, "rb") as tfile:
				data = tfile.read()
			return data
		else:
			return None

	def add(self, data):
		"""add to cache"""

		with file(self.cachefilename, "wb") as tfile:
			tfile.write(data)

	def clear_cache(self):
		"""Process to delete entry from cache """
		pass



################################################################################
## get definitions from the database
################################################################################

COLLATERALMETADATA = MetaData(config.get("prmaxcollateral.dburi"))
try:
	ECollateral.mapping = Table('collateralfiles', COLLATERALMETADATA, autoload=True)
	mapper(ECollateral, ECollateral.mapping)
except:
	LOGGER.exception("No prmaxcollateral")

Collateral.mapping = Table('collateral', metadata, autoload=True, schema="userdata")
CollateralIntgerests.mapping = Table('collateralinterests', metadata, autoload=True, schema='userdata')
CollateralUser.mapping = Table('collateralusers', metadata, autoload=True, schema='userdata')

mapper(Collateral, Collateral.mapping)
mapper(CollateralIntgerests, CollateralIntgerests.mapping)
mapper(CollateralUser, CollateralUser.mapping)
