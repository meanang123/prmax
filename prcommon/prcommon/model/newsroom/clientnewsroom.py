# -*- coding: utf-8 -*-
""" Client news room"""
#-----------------------------------------------------------------------------
# Name:        clientnewsroom.py
# Purpose:		Customer Client record
#
# Author:      Chris Hoy
#
# Created:     27/04/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
import logging
from cStringIO import StringIO
from turbogears.database import metadata, mapper, session, config
from sqlalchemy import Table
from PIL import Image
from ttl.postgres import DBCompress
from prcommon.model.session import UserSession

LOG = logging.getLogger("prmax.model")

class FakeClient(object):
	def __init__(self, _customerid, gobject, clientid=-1, clientname='Global', tel='', www='', email='', twitter='', linkedin='', facebook='', instagram=''):
		self._clientid = clientid
		self._clientname = clientname
		self._customerid = _customerid
		self._tel = tel
		self._www = www
		self._email = email
		self._twitter = twitter
		self._linkedin = linkedin
		self._facebook = facebook
		self._instagram = instagram
		if gobject:
			self._tel = gobject.tel
			self._www = gobject.www
			self._email = gobject.email
			self._twitter = gobject.twitter
			self._linkedin = gobject.linkedin
			self._facebook = gobject.facebook
			self._instagram = gobject.instagram


	@property
	def instagram(self):
		return self._instagram

	@instagram.setter
	def instagram(self, value):
		self._instagram = value

	@property
	def facebook(self):
		return self._facebook

	@property
	def linkedin(self):
		return self._linkedin

	@property
	def twitter(self):
		return self._twitter

	@property
	def email(self):
		return self._email

	@property
	def www(self):
		return self._www

	@property
	def tel(self):
		return self._tel

	@property
	def customerid(self):
		return self._customerid

	@property
	def clientid(self):
		return self._clientid

	@property
	def clientname(self):
		return self._clientname


class ClientNewsRoom(object):
	""" client news room """

	@classmethod
	def exists(cls, params):
		""" check too see if a root exists """

		query = session.query(ClientNewsRoom).\
		  filter(ClientNewsRoom.customerid == params["customerid"]).\
		  filter(ClientNewsRoom.news_room_root == params["news_room_root"])
		if params["clientid"] != -1:
			query = query.filter(ClientNewsRoom.clientid != params["clientid"])

		return True if query.count() else False

	@classmethod
	def is_valid_newsroow(cls, customerid, news_room_root):
		"""check too see if it exist"""

		from prcommon.model.client import Client
		from prcommon.model.identity import Customer
		from prcommon.model.newsroom.clientnewroomcontactdetails import ClientNewRoomContactDetails

		# check for client news rooms
		# check for global news rooms
		records = session.query(ClientNewsRoom, Client, Customer, ClientNewRoomContactDetails).\
			outerjoin(Client, Client.clientid == ClientNewsRoom.clientid).\
		    outerjoin(ClientNewRoomContactDetails, ClientNewRoomContactDetails.newsroomid == ClientNewsRoom.newsroomid).\
			join(Customer, ClientNewsRoom.customerid == Customer.customerid).\
		  filter(ClientNewsRoom.customerid == customerid).\
		  filter(ClientNewsRoom.news_room_root == news_room_root).all()
		if records:
			# customer is active
			if records[0][2].is_active():
				result = list(records[0])
				if result[1] is None:
					result[1] = FakeClient(customerid, result[3])

				return result

		return None

	@classmethod
	def create_thumbnail(cls, data, userid, itype="PNG", ext=".png"):
		"""Create thumb nail"""

		usersession = UserSession.query.get(userid)
		img = Image.open(data)
		baseheight = 49
		wpercent = (baseheight / float(img.size[1]))
		wsize = int((float(img.size[0]) * float(wpercent)))
		if wsize > 215:
			#Image too wide so we need to do the calculation in revese
			baseheight = int(baseheight * (150.00 / wsize))
			wsize = 215

		img.thumbnail((wsize, baseheight), Image.ANTIALIAS)
		thumbnail = StringIO()
		img = img.convert("RGB")
		img.save(thumbnail, itype, quality=60)
		thumbnail.flush()

		usersession.seo_image_extension = ext
		usersession.seo_image = DBCompress.encode2(thumbnail.getvalue())
		usersession.seo_height = img.size[1]
		usersession.seo_width = img.size[0]

	@classmethod
	def upload_and_convert(cls, params):
		""" upload the image and convert it store it on the user session """

		try:
			cls.create_thumbnail(params['headerimage_file'].file, params["userid"])
		except:
			LOG.exception("upload_and_convert")
			raise

	def get_news_room_url(self):
		""" get the client newsroom url"""

		return "%s/nr/%d/%s" % (config.get('prpublish.web', ''), self.customerid, self.news_room_root)


ClientNewsRoom.mapping = Table('clientnewsroom', metadata, autoload=True, schema="userdata")

mapper(ClientNewsRoom, ClientNewsRoom.mapping)
