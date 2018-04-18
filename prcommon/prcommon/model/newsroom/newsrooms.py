# -*- coding: utf-8 -*-
""" Newsrooms"""
#-----------------------------------------------------------------------------
# Name:        newsrooms.py
# Purpose:		Customer record
#
# Author:
#
# Created:     March 2018
# RCS-ID:      $Id:  $
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session, config
from sqlalchemy import Table
from PIL import Image
from cStringIO import StringIO
from ttl.postgres import DBCompress
from sqlalchemy import Table, text
from prcommon.model.session import UserSession
from prcommon.model.common import BaseSql

import logging
LOGGER = logging.getLogger("prmax.model")

class Newsrooms(BaseSql):
	""" ClientNewsroom table"""

	List_Types = """SELECT description FROM userdata.clientnewsroom ORDER BY description"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		data = [dict(id=row.newsroomid, name=row.description)
		        for row in session.query(Newsrooms).filter(Newsrooms.customerid == params['customerid']).all()]
		return data

	@classmethod
	def delete(cls, params):
		""" delete a newsroom """

		from prcommon.model import ClientNewsRoomCustumLinks, ClientNewsRoomImage, ClientNewsRoomContactDetails

		try:
			transaction = cls.sa_get_active_transaction()
			newsroom = Newsrooms.query.get(params["newsroomid"])
			ns_contact = ClientNewsRoomContactDetails.query.get(params["newsroomid"])
			session.delete(ns_contact)
			for row in session.query(ClientNewsRoomCustumLinks).filter_by(newsroomid=params["newsroomid"]).all():
				session.delete(row)
				session.flush()
			for row in session.query(ClientNewsRoomImage).filter_by(newsroomid=params["newsroomid"]).all():					
				session.delete(row)
				session.flush()		
			session.delete(newsroom)
			
			transaction.commit()
		except:
			LOGGER.exception("Newsroom_delete")
			transaction.rollback()
			raise

	@classmethod
	def add(cls, params):
		""" add a new newsroom """

		from prcommon.model import Client, ClientNewsRoomCustumLinks, ClientNewsRoomContactDetails

		try:
			transaction = cls.sa_get_active_transaction()
			newsroom = Newsrooms(
		        description=params["description"],
		        customerid=params["customerid"],
		        news_room_root=params["news_room_root"],
		        about_template=params["about_template"],
		        header_colour=params["header_colour"])
			session.add(newsroom)
			session.flush()
			params['newsroomid'] = newsroom.newsroomid
			
			session.add(ClientNewsRoomContactDetails(
			    newsroomid = newsroom.newsroomid,
			    www = params['www'],
			    tel = params['tel'],
			    email = params['email'],
			    linkedin = params['linkedin'],
			    facebook = params['facebook'],
			    twitter = params['twitter']))
			
			if params.get("headerimageleftid", "") == "-2":
				Client._update_image(1, params)
			if params.get("headerimagerightid", "") == "-2":
				Client._update_image(2, params)
			if params["link_1_name"]:
				session.add(ClientNewsRoomCustumLinks(
			        newsroomid=newsroom.newsroomid,
			        name=params["link_1_name"],
			        url=params["link_1_url"]))
			if params["link_2_name"]:
				session.add(ClientNewsRoomCustumLinks(
			        newsroomid=newsroom.newsroomid,
			        name=params["link_2_name"],
			        url=params["link_2_url"]))
			
			session.flush()
			transaction.commit()
			return newsroom.newsroomid
		except:
			LOGGER.exception("Newsroom_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" update a newsroom """

		from prcommon.model import Client, ClientNewsRoomCustumLinks, ClientNewsRoomContactDetails
		try:
			transaction = cls.sa_get_active_transaction()
			newsroomid = params["newsroomid"]
			newsroom = Newsrooms.query.get(newsroomid)
			newsroom.description = params["description"]
			newsroom.news_room_root = params["news_room_root"]
			newsroom.header_colour = params["header_colour"]
			newsroom.about_template = params["about_template"]
			ns_contact = ClientNewsRoomContactDetails.query.get(newsroomid)
			if not ns_contact and not newsroom.clientid:
				session.add(ClientNewsRoomContactDetails(
					newsroomid = newsroom.newsroomid,
				    www = params["www"],
				    tel = params["tel"],
				    email = params["email"],
				    linkedin = params["linkedin"],
				    facebook = params["facebook"],
				    twitter = params["twitter"]
				))
			if ns_contact:
				ns_contact.www = params['www']
				ns_contact.tel = params["tel"]
				ns_contact.email = params["email"]
				ns_contact.linkedin = params["linkedin"]
				ns_contact.facebook = params["facebook"]
				ns_contact.twitter = params["twitter"]

			# header logo changed
			if params.get("headerimageleftid", "") in ("-1", "-2"):
				Client._update_image(1, params, params.get("headerimageleftid", ""))
		
			if params.get("headerimagerightid", "") in ("-1", "-2"):
				Client._update_image(2, params, params.get("headerimagerightid", ""))
			
			for row in session.query(ClientNewsRoomCustumLinks).filter_by(newsroomid=params["newsroomid"]).all():
				session.delete(row)
				session.flush()
		
			if params["link_1_name"]:
				session.add(ClientNewsRoomCustumLinks(
				    newsroomid=params['newsroomid'],
					name=params["link_1_name"],
					url=params["link_1_url"]))
		
			if params["link_2_name"]:
				session.add(ClientNewsRoomCustumLinks(
				    newsroomid=params['newsroomid'],
					name=params["link_2_name"],
					url=params["link_2_url"]))
			
			transaction.commit()
			return newsroom.newsroomid
		except:
			LOGGER.exception("Newsroom_update")
			transaction.rollback()
			raise

	ListData = """SELECT newsroomid, description, news_room_root,
		CASE
	    	WHEN (clientid is null) THEN 'Global'
	        ELSE (SELECT clientname FROM userdata.client WHERE clientid = ns.clientid)
	    END as clientname
        FROM userdata.clientnewsroom AS ns
        WHERE ns.customerid = :customerid
        ORDER BY  %s %s
        LIMIT :limit  OFFSET :offset """

	ListDataCount = """SELECT COUNT(*) FROM userdata.clientnewsroom WHERE customerid = :customerid"""

	EMPTYGRID = dict (numRows = 0, items = [], identifier = 'newsroomid')

	@classmethod
	def get_grid_page(cls, params):
		""" get a page of newsrooms"""

		if "sortfield" not in params or params.get("sortfield") == "":
			params["sortfield"] = "description"
			params['direction'] = "DESC"

		return Newsrooms.getGridPage(params,
		                              'description',
		                              'newsroomid',
		                              Newsrooms.ListData,
		                              Newsrooms.ListDataCount,
		                              cls)

	@classmethod
	def get(cls, newsroomid):
		""" get a newsroom"""

		from prcommon.model import ClientNewsRoomCustumLinks, ClientNewsRoomContactDetails, ClientNewsRoom

		clientmode = False
		newsroom = Newsrooms.query.get(newsroomid)
		if newsroom and newsroom.clientid:
			clientmode=True
		clientnewsroom = ClientNewsRoom.query.get(newsroom.newsroomid)
		newsroom_url = clientnewsroom.get_news_room_url()
			
		customlinks=dict(link_1=dict(name="", url=""),	link_2=dict(name="", url=""))
		links = session.query(ClientNewsRoomCustumLinks).filter_by(newsroomid=newsroomid).all()
		ns_contact = ClientNewsRoomContactDetails.query.get(newsroomid)

		if links:
			customlinks["link_1"]["name"] = links[0].name
			customlinks["link_1"]["url"] = links[0].url
		if len(links) > 1:
			customlinks["link_2"]["name"] = links[1].name
			customlinks["link_2"]["url"] = links[1].url
		
		return dict(newsroom=newsroom,
		            customlinks=customlinks,
		            ns_contact=ns_contact,
		            clientmode=clientmode,
		            newsroom_url=newsroom_url)

	@classmethod
	def get_list_rest(cls, params):
		""" list of statementf ro """

		single = True if "id" in params else False

		return cls.grid_to_rest(cls.combo(params),
		                        params['offset'],
		                        single)

	_Single_Record = """SELECT newsroomid AS id, description FROM userdata.clientnewsroom WHERE newsroomid = :id"""
	_List_Combo = """SELECT newsroomid AS id,description FROM userdata.clientnewsroom WHERE customerid = :customerid AND description ilike :description and clientid is null ORDER BY description"""

	@classmethod
	def combo(cls, params):
		"""newsroom combo list """

		if "id" in params:
			if params["id"] == "-1":
				command = None
			else:
				command = Newsrooms._Single_Record
		else:
			command = Newsrooms._List_Combo
			if not "description" in params:
				params["description"] = "%"
			else:
				if params["description"] == "*":
					params["description"] = "%"
				else:
					params["description"] += "%"

		if command:
			items = cls.sqlExecuteCommand(
			    text(command),
			    params,
			    BaseSql.ResultAsEncodedDict)
		else:
			items = []

		if (not params.get("id", None) or params.get("id", "") in("-1", -1)):
			items.insert(0, dict(id=-1, description="No Selection"))

		return dict(
		    identifier="id",
		    numRows=len(items),
		    items=items)

	@classmethod
	def get_user_selection(cls,  params):
		"""list of selected """

		word = params["word"]
		if word == "*":
			word = ""
		word = word + "%"	

		return session.query(
		    Newsrooms.mapping.c.description,
		    Newsrooms.mapping.c.newsroomid).\
		       filter( Newsrooms.mapping.c.description.ilike(word)).\
		       filter(Newsrooms.mapping.c.clientid==None).\
		       filter(Newsrooms.mapping.c.customerid==params['customerid']).\
		       order_by(Newsrooms.mapping.c.description).all()


#########################################################
# load tables from db

Newsrooms.mapping = Table('clientnewsroom', metadata, autoload = True, schema = "userdata")

mapper(Newsrooms, Newsrooms.mapping)
