# -*- coding: utf-8 -*-
""" Customer Client Model """
#-----------------------------------------------------------------------------
# Name:        cllient.py
# Purpose:		Customer Client record
#
# Author:      Chris Hoy
#
# Created:     12/10/2011
# RCS-ID:      $Id:  $
# Copyright:  (c) 2011
#-----------------------------------------------------------------------------
import logging
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from prcommon.model.emails import EmailTemplates
from prcommon.model.seopressreleases import SEORelease
from prcommon.model.newsroom.clientnewsroom import ClientNewsRoom
from prcommon.model.newsroom.clientnewsroomimage import ClientNewsRoomImage
from prcommon.model.newsroom.clientnewsroomcustumlinks import ClientNewsRoomCustumLinks
from prcommon.model.session import UserSessionImage
from prcommon.model.list import List

LOG = logging.getLogger("prmax")

class Client(BaseSql):
	""" client record """

	__Exists_Sql = """SELECT clientid FROM userdata.client WHERE clientname ilike :clientname AND customerid = :customerid """

	@classmethod
	def exists(cls, params):
		""" Check too see if a client exists """
		whereclause = ""
		if params.get("clientid", -1) != -1:
			whereclause = " AND clientid != :clientid"

		return cls.sqlExecuteCommand(
			text(Client.__Exists_Sql + whereclause),
			params,
			BaseSql.ResultExists)

	@classmethod
	def add(cls, params):
		""" add a new client too the database """

		clientid = None
		transaction = cls.sa_get_active_transaction()
		try:
			# fix up customerid
			if "icustomerid" in params:
				params["customerid"] = params["icustomerid"]

			params.pop("clientid")
			client = Client(**params)
			session.add(client)
			session.flush()
			if params["has_news_room"]:
				# add n newroom
				params["clientid"] = client.clientid
				client.has_news_room = True
				newsroom = ClientNewsRoom(
				  clientid=client.clientid,
				  customerid=params["customerid"],
				  news_room_root=params["news_room_root"],
				  about_template=params["about_template"],
				  header_colour=params["header_colour"])
				session.add(newsroom)
				session.flush()
				
				params['newsroomid']=newsroom.newsroomid
				if params.get("headerimageleftid", "") == "-2":
					cls._update_image(1, params)
				if params.get("headerimagerightid", "") == "-2":
					cls._update_image(2, params)
				if params["link_1_name"]:
					session.add(ClientNewsRoomCustumLinks(
					  clientid=client.clientid,
					  name=params["link_1_name"],
					  url=params["link_1_url"]))
				if params["link_2_name"]:
					session.add(ClientNewsRoomCustumLinks(
					  clientid=client.clientid,
					  name=params["link_2_name"],
					  url=params["link_2_url"]))

			clientid = client.clientid
			transaction.commit()
			return clientid
		except:
			LOG.exception("Client_add")
			transaction.rollback()
			raise

	@classmethod
	def _update_image(cls, imagetypeid, params, option=None):
		""" Update image"""
		imagestore = session.query(UserSessionImage).filter_by(
				  imagetypeid=imagetypeid,
		      userid=params["userid"]).scalar()
		if option == "-1" and imagestore:
			session.delete(imagestore)
			imagestore = None

		if "newsroomid" in params:
			image = session.query(ClientNewsRoomImage).filter_by(
			  imagetypeid=imagetypeid,
			  newsroomid=params["newsroomid"]).scalar()
		else:
			image = session.query(ClientNewsRoomImage).filter_by(
			  imagetypeid=imagetypeid,
			  clientid=params["clientid"]).scalar()
		# update
		if imagestore and image:
			image.image = imagestore.image
			image.height = imagestore.height
			image.width = imagestore.width
		#delete
		if not imagestore and image:
			session.delete(image)
		# add
		if imagestore and not image:
			session.add(ClientNewsRoomImage(newsroomid=params['newsroomid'],
			                                clientid=params.get("clientid", None),
			                                imagetypeid=imagetypeid,
			                                image=imagestore.image,
			                                height=imagestore.height,
			                                width=imagestore.width
			                                ))

	@classmethod
	def update(cls, params):
		""" Update a client record """
		transaction = cls.sa_get_active_transaction()
		try:
			client = Client.query.get(params["clientid"])

			client.clientname = params["clientname"]
			client.www = params["www"]
			client.tel = params["tel"]
			client.email = params["email"]
			client.linkedin = params["linkedin"]
			client.facebook = params["facebook"]
			client.twitter = params["twitter"]
			client.instagram = params["instagram"]
			
			newsroom = session.query(ClientNewsRoom).filter_by(clientid = client.clientid).scalar()
			if newsroom:
				params['newsroomid']=newsroom.newsroomid
			# header logo changed
			if params.get("headerimageleftid", "") in ("-1", "-2"):
				cls._update_image(1, params, params.get("headerimageleftid", ""))

			if params.get("headerimagerightid", "") in ("-1", "-2"):
				cls._update_image(2, params, params.get("headerimagerightid", ""))

			if params["has_news_room"] and not newsroom:
				# add news room
				client.has_news_room = True
				newsroom = ClientNewsRoom(
				  clientid=client.clientid,
				  news_room_root=params["news_room_root"],
				  header_colour=params["header_colour"],
				  customerid=params["customerid"],
				  about_template=params["about_template"])
				session.add(newsroom)
				session.flush()
				params['newsroomid'] = newsroom.newsroomid
			elif params["has_news_room"] and newsroom:
				#update
				newsroom.news_room_root = params["news_room_root"]
				newsroom.about_template = params["about_template"]
				newsroom.header_colour = params["header_colour"]
			elif not params["has_news_room"] and newsroom:
				# is a delete
				client.has_news_room = False
				
				for row in session.query(ClientNewsRoomCustumLinks).filter_by(newsroomid=params["newsroomid"]).all():
					session.delete(row)
					session.flush()		
				for row in session.query(ClientNewsRoomImage).filter_by(newsroomid=params["newsroomid"]).all():					
					session.delete(row)
					session.flush()		

				session.delete(newsroom)
			elif not params["has_news_room"]:
				client.has_news_room = False

			if params["has_news_room"]:
				for row in session.query(ClientNewsRoomCustumLinks).filter_by(newsroomid=params["newsroomid"]).all():
					session.delete(row)
					session.flush()

				if params["link_1_name"]:
					session.add(ClientNewsRoomCustumLinks(
					    newsroomid=params['newsroomid'],
					  clientid=params["clientid"],
					  name=params["link_1_name"],
					  url=params["link_1_url"]))

				if params["link_2_name"]:
					session.add(ClientNewsRoomCustumLinks(
					    newsroomid=params['newsroomid'],
					  clientid=params["clientid"],
					  name=params["link_2_name"],
					  url=params["link_2_url"]))

			transaction.commit()
		except:
			LOG.exception("Client_update")
			transaction.rollback()
			raise

	@classmethod
	def inuse(cls, clientid):
		""" Check too see if a client is in use """

		tmp = session.query(SEORelease).filter_by(clientid=clientid).limit(1).all()
		if tmp:
			return True
		tmp = session.query(EmailTemplates).filter_by(clientid=clientid).limit(1).all()
		if tmp:
			return True
		tmp = session.query(List).filter_by(clientid=clientid).limit(1).all()
		if tmp:
			return True

		return False

	@classmethod
	def delete(cls, params):
		""" Delete a customer """

		transaction = cls.sa_get_active_transaction()
		try:
			client = Client.query.get(params["clientid"])
			session.delete(client)
			transaction.commit()
		except:
			LOG.exception("Client_delete")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, clientid, extended=False):
		""" get a client record """
		if extended:
			client = Client.query.get(clientid)
			newsroom = session.query(ClientNewsRoom).filter_by(clientid=client.clientid).limit(1).all()
			if newsroom:
				newsroom = dict(
				  news_room_root=newsroom[0].news_room_root,
				  about_template=newsroom[0].about_template,
				  news_room_url=newsroom[0].get_news_room_url(),
				  header_colour=newsroom[0].header_colour,
				  link_1=dict(name="", url=""),
				  link_2=dict(name="", url=""))
				links = session.query(ClientNewsRoomCustumLinks).filter_by(clientid=clientid).all()
				if links:
					newsroom["link_1"]["name"] = links[0].name
					newsroom["link_1"]["url"] = links[0].url
				if len(links) > 1:
					newsroom["link_2"]["name"] = links[1].name
					newsroom["link_2"]["url"] = links[1].url
			else:
				newsroom = None
			return dict(
			  client=client,
			  newsroom=newsroom)
		else:
			return Client.query.get(clientid)

	__List_View = """SELECT clientid, clientname from userdata.client WHERE customerid = :customerid ORDER BY UPPER(clientname)"""
	@classmethod
	def get_look_up(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.clientid, name=row.clientname)
					for row in data.fetchall()]

		if "id" in params:
			client = Client.query.get(params["id"])
			return [dict(id=client.clientid, name=client.clientname)]
		else:
			return cls.sqlExecuteCommand(text(Client.__List_View), None, _convert)


	List_Data_View = """SELECT c.clientname, c.clientid FROM userdata.client AS c WHERE c.customerid = :customerid """
	List_Data_View_Sort = """
	ORDER BY  %s %s NULLS LAST
	LIMIT :limit OFFSET :offset
	"""
	List_Data_Count = """SELECT COUNT(*) FROM  userdata.client c WHERE c.customerid = :customerid """

	@classmethod
	def list(cls, params):
		""" list of clients for a cutomer """

		whereclause = ""
		if params.get("sortfield", "clientname"):
			params["sortfield"] = 'UPPER(clientname)'

		if "clientname" in params:
			whereclause = " AND clientname ilike :clientname"
			params["clientname"] = "%" + params["clientname"] + "%"

		return BaseSql.getGridPage(params,
		                            'UPPER(clientname)',
		                            'clientid',
		                            Client.List_Data_View + whereclause + Client.List_Data_View_Sort,
		                            Client.List_Data_Count + whereclause,
		                            cls)


	_Single_Record = """SELECT clientid AS id,clientname FROM userdata.client WHERE clientid = :id"""
	_List_Combo = """SELECT clientid AS id,clientname FROM userdata.client WHERE customerid = :customerid AND clientname ilike :clientname ORDER BY clientname"""

	@classmethod
	def rest_combo(cls, params):
		""" get via rest store"""

		single = True if "id" in params else False
		return cls.grid_to_rest(cls.combo(params),
		                          params['offset'],
		                          single)

	@classmethod
	def combo(cls, params):
		"""client conbo list """

		if "id" in params:
			if params["id"] == "-1":
				command = None
			else:
				command = Client._Single_Record
		else:
			command = Client._List_Combo
			if not "clientname" in params:
				params["clientname"] = "%"
			else:
				if params["clientname"] == "*":
					params["clientname"] = "%"
				else:
					params["clientname"] += "%"

		if command:
			items = cls.sqlExecuteCommand(
			  text(command),
			  params,
			  BaseSql.ResultAsEncodedDict)
		else:
			items = []

		if (not params.get("id", None) or params.get("id", "") in("-1", -1)) and \
		   "required_client" not in params:
			items.insert(0, dict(id=-1, clientname="No Selection"))

		return dict(
		  identifier="id",
		  numRows=len(items),
		  items=items)


	@classmethod
	def is_valid_newsroow(cls, root):
		"""check too see if it exist"""

		pass


	List_Client_Customer_View = """SELECT c.clientname, c.clientid, c.clientid AS id FROM userdata.client AS c"""
	List_Client_Customer_Count = """SELECT COUNT(*) FROM  userdata.client c"""

	@staticmethod
	def list_by_customer(params):
		""" list of clients for a cutomer """

		whereclause = ""
		if params.get("sortfield", "clientname"):
			params["sortfield"] = 'UPPER(clientname)'

		whereclause = BaseSql.addclause("", "c.customerid=:icustomerid")
		params["icustomerid"] = int(params.get("icustomerid", "-1"))

		if "clientname" in params:
			if params["clientname"] != "*":
				whereclause = BaseSql.addclause(whereclause, "clientname ilike :clientname")
				if params["clientname"]:
					if params["clientname"][-1] == "*":
						params["clientname"] = params["clientname"][:-1]
					params["clientname"] = params["clientname"] + "%"

		if "clientid" in params:
			whereclause = BaseSql.addclause("", "c.clientid=:clientid")
			params["icustomerid"] = int(params.get("clientid"))

		items = BaseSql.getGridPage(
		  params,
		  'UPPER(clientname)',
		  'clientid',
		  Client.List_Client_Customer_View + whereclause + BaseSql.Standard_View_Order,
		  Client.List_Client_Customer_Count + whereclause,
		  Client)

		return BaseSql.grid_to_rest(items, params['offset'], True if "clientid" in params else False)

Client.mapping = Table('client', metadata, autoload=True, schema="userdata")

mapper(Client, Client.mapping)
