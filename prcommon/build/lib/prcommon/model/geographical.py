# -*- coding: utf-8 -*-
"geographical"
#-----------------------------------------------------------------------------
# Name:        geographical.py
# Purpose:	geographical model objects
#
# Author:      Chris Hoy
# Created:     01/10/2010
# Copyright:   (c) 2010
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, Column, Integer
from sqlalchemy.sql import text

from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prmax.model")

class GeographicalLookupView(BaseSql):
	""" basic geographical area """
	List = """SELECT geographicallookuptypeid as id, geographicallookupdescription as name
	FROM internal.geographicallookuptypes
	ORDER BY geographicallookupdescription"""

	Geographical_User_Selection = """
	SELECT %s, gl.geographicalid
	FROM geographical_lookup_word_view as gl
	WHERE
		gl.geographicalword ilike :word AND
		( gl.geographicallookuptypeid = :filter OR :filter=-1)"""


	Geographical_User_Selection_Parent = """
	SELECT %s, gl.geographicalid
	FROM geographical_lookup_word_view as gl
	WHERE
		gl.geographicalword ilike :word AND
		( gl.geographicallookuptypeid > :filter)"""

	Geographical_User_Selection_Range = """
	SELECT %s, gl.geographicalid
	FROM geographical_lookup_word_view as gl
	WHERE
		gl.geographicalword ilike :word AND
		gl.geographicallookuptypeid IN (:filter,:filter1)"""

	Order_By = """ GROUP BY geographicalid,geographicalname ORDER BY geographicalname"""


	@classmethod
	def getLookUp(cls, params):
		" Get the list of lookup types"
		def _convert(data):
			"internal"
			return [dict(id = row.id, name = row.name)
					for row in data.fetchall()]

		lines = cls.sqlExecuteCommand ( text(GeographicalLookupView.List),
				                        None, _convert)
		lines.insert(0, dict(id = -1, name = "No Filter"))
		return lines

	@classmethod
	def getLookupList(cls, params):
		""" get the list for the user selection"""
		def _convert(data):
			"internal"
			return [(row.geographicalname, row.geographicalid)
					for row in data.fetchall()]

		command = GeographicalLookupView.Geographical_User_Selection_Parent \
				if params.get("parentonly", None) else GeographicalLookupView.Geographical_User_Selection

		region_cascade = params.get("cascade_region", None)
		if region_cascade == "1" and params["filter"] == 3:
			command = GeographicalLookupView.Geographical_User_Selection_Range
			params["filter1"] = 6
		elif region_cascade == "1" and params["filter"] == 6:
			command = GeographicalLookupView.Geographical_User_Selection_Range
			params["filter1"] = 7
		elif region_cascade == "2" and params["filter"] == 3:
			command = GeographicalLookupView.Geographical_User_Selection_Range
			params["filter1"] = 2

		if params.get("extended_mode", None):
			command = command % "gl.geographicalname||' - '||gl.geographicalid as geographicalname"
		else:
			command = command % "gl.geographicalname"

		words = params["word"].strip(" %").split(" ")
		fcommand = ""
		for word in words:
			if fcommand:
				fcommand += " INTERSECT "
			c = words.index ( word ) +1
			fcommand += command.replace(":word", ":word%d" % c)
			params["word%d" % c] = word + "%"

		fcommand += GeographicalLookupView.Order_By

		return cls.sqlExecuteCommand ( text( fcommand ), params, _convert)

	Geog_Tree_1 = """SELECT geogarea.geographicalid,geogarea.geographicalname,
	(SELECT COUNT(*) FROM  internal.geographicaltree AS gt1 WHERE gt1.parentgeographicalareaid = gt.childgeographicalareaid) AS counts
	FROM internal.geographicaltree AS gt
	JOIN internal.geographical AS geogarea ON geogarea.geographicalid = gt.childgeographicalareaid
	WHERE parentgeographicalareaid = :geographicalid ORDER BY UPPER(geogarea.geographicalname)"""

	@classmethod
	def geogtree(cls, params, key):
		""" do geographical """


		def _child_node ( geogarea1 ) :
			"child node"
			data = {'$ref' : geogarea1.geographicalid, 'name' : geogarea1.geographicalname, 'id' : geogarea1.geographicalid}
			if geogarea1.counts:
				data['children'] = True
			return data

		data = {}
		if key == "root":
			data = []
			for geogarea in session.query(GeographicalLookupView).filter_by( geographicallookuptypeid = 6 ).\
			    order_by( GeographicalLookupView.geographicalname ).all():
				children = [ _child_node ( geogarea1 ) for geogarea1 in
				             session.execute(text( GeographicalLookupView.Geog_Tree_1), dict(geographicalid = geogarea.geographicalid), cls)]
				data.append ( dict ( id = geogarea.geographicalid, name =  geogarea.geographicalname, children = children ) )
		else:
			# this is a single node
			geographicalid = int (key )
			geogarea = Geographical.query.get( geographicalid )
			children = [ _child_node ( geogarea1 ) for geogarea1 in
			             session.execute(text( GeographicalLookupView.Geog_Tree_1),dict(geographicalid = geogarea.geographicalid), cls)]
			data = dict (id = geogarea.geographicalid, name = geogarea.geographicalname , children = children )

		return data


class GeographicalLookupTypes(BaseSql):
	""" GeographicalLookupTypes """

	List = """
	SELECT gt.geographicallookuptypeid,gt.geographicallookupdescription
	FROM internal.geographicallookuptypes  as gt
	WHERE gt.geographicallookuptypeid IN (1,2,3,6,7)
	ORDER BY gt.geographicallookuptypeid"""

	@classmethod
	def getLookUp(cls, params):
		""" get lookups for igroups"""
		def _convert(data):
			"internal"
			return  [dict(id = row.geographicallookuptypeid,
			              name = row.geographicallookupdescription)
			         for row in data.fetchall()]

		data = cls.sqlExecuteCommand ( text(GeographicalLookupTypes.List),
				                       params,
				                       _convert)
		if "addempty" in params:
			data.insert(0, dict(id = -1, name = "No Selection"))
		elif "typesonly" not in params:
			data.insert(0, dict(id = -1, name = "No Filter"))

		return data

	_to_prn_types = { 1:2416, 2:2147, 3: 2421, 6:2419, 7:2424}
	@staticmethod
	def toPrn ( typeid ) :
		"prn code"
		return GeographicalLookupTypes._to_prn_types[typeid]


class GeographicalTree(BaseSql):
	""" tree of areas """
	pass

class Geographical(BaseSql):
	"""  goeaographical area """
	ListData = """
		SELECT
		geogarea.geographicalid,
		geogarea.geographicalname,
	    glt.geographicallookupdescription

		FROM internal.geographical AS geogarea
	    JOIN internal.geographicallookup AS gl ON geogarea.geographicalid = gl.geographicalid
	    JOIN internal.geographicallookuptypes AS glt ON gl.geographicallookuptypeid = glt.geographicallookuptypeid"""
	ListData_2 = """ ORDER BY  %s %s LIMIT :limit  OFFSET :offset """

	ListDataCount = """
		SELECT COUNT(*) FROM  internal.geographical AS geogarea
	    JOIN internal.geographicallookup AS gl ON geogarea.geographicalid = gl.geographicalid %s"""

	_ParentList = """SELECT gt.parentgeographicalareaid, geogarea.geographicalname
	FROM internal.geographicaltree AS gt
	JOIN internal.geographical AS geogarea ON geogarea.geographicalid = gt.parentgeographicalareaid
	WHERE  gt.childgeographicalareaid = :geographicalid
	ORDER BY geogarea.geographicalname"""

	_ChildrenList = """SELECT gt.childgeographicalareaid, geogarea.geographicalname
	FROM internal.geographicaltree AS gt
	JOIN internal.geographical AS geogarea ON geogarea.geographicalid = gt.childgeographicalareaid
	WHERE  gt.parentgeographicalareaid= :geographicalid
	ORDER BY geogarea.geographicalname"""

	@classmethod
	def get_rest_list(cls, params):
		"""get result as rest """

		single = True if "geographicalid" in params else False

		return cls.grid_to_rest ( cls.getGridPage ( params ),
		                          params['offset'],
		                          single )

	@classmethod
	def getGridPage(cls, params ) :
		""" get display page for role maintanence """
		filtercommand = ""
		if params.get("filter",""):
			params["filter"] = "%" + params["filter"] + "%"
			filtercommand = " WHERE geogarea.geographicalname ilike :filter "
		if params.get("geographicallookuptypeid","-1") != "-1":
			if filtercommand:
				filtercommand += " AND geogarea.geographicallookuptypeid = :geographicallookuptypeid "
			else:
				filtercommand += " WHERE geogarea.geographicallookuptypeid =:geographicallookuptypeid "

		return BaseSql.getGridPage(
			params,
			'geographicalname',
			'geographicalid',
			Geographical.ListData + filtercommand + Geographical.ListData_2,
			Geographical.ListDataCount%filtercommand,
			cls )

	_ChildList = """SELECT geogarea.geographicalid,geogarea.geographicalname
		FROM internal.geographicaltree AS gt
	    JOIN internal.geographical AS geogarea ON geogarea.geographicalid = gt.childgeographicalareaid
	    WHERE
	    gt.parentgeographicalareaid = :geographicalid
	    ORDER BY  %s %s LIMIT :limit  OFFSET :offset """

	_ChildListNbr = """SELECT COUNT(*)
		FROM internal.geographicaltree AS gt
	    WHERE gt.parentgeographicalareaid = :geographicalid"""

	@classmethod
	def children_list(cls, params ) :
		""" children_list """
		return BaseSql.getGridPage(
			params,
			'geographicalname',
			'geographicalid',
			Geographical._ChildList,
			Geographical._ChildListNbr,
			cls )

	@classmethod
	def getDataForEdit(cls, params ) :
		""" get the details to be able to edit a geographical adrea"""

		geographical = Geographical.query.get(params["geographicalid"])
		lookup = GeographicalLookupTypes.query.get( geographical.geographicallookuptypeid )

		return dict (
			geographical = geographical,
			parents = cls.sqlExecuteCommand ( text( Geographical._ParentList) ,
				                              dict ( geographicalid = params["geographicalid"]),
				                              BaseSql.ResultAsEncodedDict),
		    children = cls.sqlExecuteCommand ( text( Geographical._ChildrenList) ,
		                                  dict ( geographicalid = params["geographicalid"]),
		                                  BaseSql.ResultAsEncodedDict),
		    geographicallookupdescription = lookup.geographicallookupdescription )


	_Exists = """SELECT geographicalid from internal.geographical AS geogarea
		WHERE
		geogarea.geographicallookuptypeid = :geographicallookuptypeid AND geogarea.geographicalname = :geographicalname AND
	    geogarea.geographicalid IN ( SELECT gl.geographicalid FROM internal.geographicallookup AS gl WHERE  gl.geographicallookuptypeid = :geographicallookuptypeid ) """

	@classmethod
	def exists (cls, params):
		""" check to see of an area name exists in lookup may exist in area but not lookup
		"""
		return cls.sqlExecuteCommand( text(Geographical._Exists), params,
				                      BaseSql.ResultExists )


	Cascade = "SELECT create_geographical_cascade(:geographicalid)"

	@classmethod
	def add (cls, params):
		""" Add a new geographical area
		does it exist but is not visible?
		"""

		transaction = cls.sa_get_active_transaction()
		try:
			# already exists?
			geogarea = session.query(Geographical.geographicalid).filter_by(
				geographicalname = params["geographicalname"],
				geographicallookuptypeid = params["geographicallookuptypeid"]).first()
			if not geogarea:
				geogarea = Geographical (  geographicalname = params["geographicalname"],
								    geographicallookuptypeid = params["geographicallookuptypeid"] ,
								    geographicaltypeid = GeographicalLookupTypes.toPrn ( params["geographicallookuptypeid"]  ) )
				session.add( geogarea )
				session.flush()
			else:
				# exists but could just be a left over prn record
				tmp = session.query(GeographicalLookup).\
				  filter ( GeographicalLookup.geographicallookuptypeid == params["geographicallookuptypeid"]).\
				  filter( GeographicalLookup.geographicalid == geogarea.geographicalid ).all()
				if not tmp:
					# clear pre existing setting tree
					session.query (GeographicalTree).filter( GeographicalTree.parentgeographicalareaid== geogarea.geographicalid).delete()
					session.query (GeographicalTree).filter( GeographicalTree.childgeographicalareaid== geogarea.geographicalid).delete()

			# now we need to add entry to lookup table
			session.add ( GeographicalLookup (
				geographicallookuptypeid = params["geographicallookuptypeid"] ,
				geographicalid = geogarea.geographicalid  ) )
			# add entry for parents
			for area in params["parents"]:
				# add parent record
				session.add( GeographicalTree (  parentgeographicalareaid = area ,
								                 childgeographicalareaid = geogarea.geographicalid ) )
				#add the cascade records
				cls.sqlExecuteCommand (text(Geographical.Cascade),
				                       dict(geographicalid = area),None )
			# add entry for children
			for area in params["children"]:
				# add parent record
				session.add( GeographicalTree (  parentgeographicalareaid = geogarea.geographicalid  ,
								                 childgeographicalareaid = area) )
				#add the cascade records
				cls.sqlExecuteCommand (text(Geographical.Cascade),
				                       dict(geographicalid = area),None )

			transaction.commit()

			# return fields for add to data grid
			tmp = session.query(Geographical.geographicalid, Geographical.geographicalname,
			    GeographicalLookupTypes.geographicallookupdescription).filter(
			    Geographical.geographicallookuptypeid == GeographicalLookupTypes.geographicallookuptypeid).filter(
			    Geographical.geographicalid == geogarea.geographicalid).first()
			return dict(geographicalid = tmp[0], geographicalname = tmp[1] ,
			            geographicallookupdescription = tmp[2] )

		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("Geographical add")
			raise

	@classmethod
	def delete(cls, params):
		""" Delete a geographical area
		remove from system completelty?
		"""
		transaction = cls.sa_get_active_transaction()
		try:
			geogarea = session.query(Geographical).filter_by(geographicalid = params["geographicalid"]).first()
			session.delete ( geogarea )
			transaction.commit()
			return params["geographicalid"]
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("Geographical delete")
			raise

	@classmethod
	def update(cls, params):
		""" change a geographical area"""
		transaction = cls.sa_get_active_transaction()
		try:
			# already exists?
			geogarea = session.query(Geographical.geographicalid).filter_by(
				geographicalname = params["geographicalname"],
				geographicallookuptypeid = params["geographicallookuptypeid"]).first()
			if geogarea and geogarea.geographicalid != params["geographicalid"] :
				# is it in in the cascade map used yes/no
				tmp = session.query(GeographicalLookup.geographicalid).filter_by(
				    geographicalid =  geogarea.geographicalid ) .first()
				if not tmp:
					# if no then delete
					session.delete ( Geographical.query.get(geogarea.geographicalid) )
				else:
					return "DU"

			geogarea = session.query(Geographical).filter_by(geographicalid = params["geographicalid"]).first()
			geogarea.geographicalname = params["geographicalname"]

			#change of type
			if geogarea.geographicallookuptypeid != params["geographicallookuptypeid"]:
				gl = session.query(GeographicalLookup).filter_by(geographicalid = params["geographicalid"],
				                                                 geographicallookuptypeid = geogarea.geographicallookuptypeid).first()
				if gl:
					gl.geographicallookuptypeid = params["geographicallookuptypeid"]

			geogarea.geographicallookuptypeid = params["geographicallookuptypeid"]

			existing = {}
			for row in cls.sqlExecuteCommand ( text( Geographical._ParentList) ,
			                                              dict ( geographicalid = params["geographicalid"]),
			                                              BaseSql.ResultAsEncodedDict):
				existing[row["parentgeographicalareaid"]] = row["parentgeographicalareaid"]

			# add extra parents
			for area in params["parents"]:
				if existing.has_key ( area ) :
					existing.pop ( area )
				else:
					# add parent record
					session.add( GeographicalTree (  parentgeographicalareaid = area ,
					                                 childgeographicalareaid = geogarea.geographicalid ) )
					#add the cascade records
					cls.sqlExecuteCommand (text(Geographical.Cascade),
					                       dict(geographicalid = area),None )
			# delete parents
			for area in existing.iterkeys():
				# delete parent link
				ld = session.query(GeographicalTree).filter_by(
				    parentgeographicalareaid = area,
				    childgeographicalareaid = geogarea.geographicalid).first()
				if ld:
					session.delete ( ld )
				session.query(Geographical).filter(Geographical.geographicalid == area).delete()
				# cls.sqlExecuteCommand (text(Geographical),
				#                        dict(geographicalid = area),None )

			for row in cls.sqlExecuteCommand ( text( Geographical._ChildrenList) ,
			                                              dict ( geographicalid = params["geographicalid"]),
			                                              BaseSql.ResultAsEncodedDict):
				existing[row["childgeographicalareaid"]] = row["childgeographicalareaid"]
			# add extra children
			for area in params["children"]:
				if existing.has_key ( area ) :
					existing.pop ( area )
				else:
					# add children record
					session.add( GeographicalTree (  parentgeographicalareaid = geogarea.geographicalid  ,
					                                 childgeographicalareaid = area) )
					#add the cascade records
					cls.sqlExecuteCommand (text(Geographical.Cascade),
					                       dict(geographicalid = area),None )
			# delete children
			for area in existing.iterkeys():
				# delete parent link
				ld = session.query(GeographicalTree).filter_by(
 				    parentgeographicalareaid = geogarea.geographicalid,
				    childgeographicalareaid = area ).first()
				if ld:
					session.delete ( ld )
				#delete cascance
				cls.sqlExecuteCommand (text(Geographical.Cascade),
				                       dict(geographicalid = area),None )
			transaction.commit()
			return "OK"
		except:
			try:
				transaction.rollback()
			except :
				pass
			LOGGER.exception("Geographical update")
			raise

class GeographicalLookupCascade(BaseSql):
	""" map for performace lookup"""
	pass

class GeographicalLookup(BaseSql):
	""" Entry in lookup table """

class Continents(BaseSql):
	"""Continents"""

	@classmethod
	def getLookUp(cls, params):
		""" get lookups for igroups"""

		data = [dict(id = row.continentid, name = row.continentname) for row in session.query(Continents).order_by(Continents.continentname).all()]
		data.insert(0, dict(id = -1, name = "All Continents"))

		return data


################################################################################
### model objets
################################################################################

GeographicalLookupView.mapping = Table('geographical_lookup_view', metadata,
                                 Column("geographicallookuptypeid", Integer, primary_key=True), # needed to load a view
                                 Column("geographicalid", Integer, primary_key=True), # needed to load a view
                                 autoload=True)

GeographicalLookupView.mapper = Table('geographicallookup', metadata,
                                      autoload=True, schema = "internal")

GeographicalLookupTypes.mapping = Table('geographicallookuptypes', metadata,
                                        autoload=True, schema = "internal")

GeographicalTree.mapping = Table('geographicaltree', metadata,
                                 autoload=True, schema = "internal")

GeographicalLookupCascade.mapping = Table('geographicallookupcascade', metadata,
                                          autoload=True, schema = "internal")


Geographical.mapping = Table('geographical', metadata,
                          autoload=True, schema = "internal")

Continents.mapping = Table('continents', metadata, autoload=True, schema = "internal")

mapper( GeographicalLookup, GeographicalLookupView.mapper)
mapper( GeographicalLookupView, GeographicalLookupView.mapping)
mapper( GeographicalLookupTypes, GeographicalLookupTypes.mapping )
mapper( Geographical, Geographical.mapping )
mapper( GeographicalTree , GeographicalTree.mapping )
mapper( GeographicalLookupCascade, GeographicalLookupCascade.mapping )
mapper( Continents, Continents.mapping )
