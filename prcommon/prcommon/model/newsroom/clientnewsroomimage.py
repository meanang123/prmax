# -*- coding: utf-8 -*-
""" Client news room images"""
#-----------------------------------------------------------------------------
# Name:        clientnewsroomimage.py
# Purpose:     Customer Client news room images record
#
# Author:      Chris Hoy
# Created:     27/04/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session, config
from sqlalchemy import Table
from PIL import Image
from cStringIO import StringIO
from ttl.postgres import DBCompress
from prcommon.model.session import UserSessionImage
import prcommon.Constants as Constants

import logging
LOG = logging.getLogger("prmax.model")

class ClientNewsRoomImage(object):
	""" client news room """

	@classmethod
	def create_thumbnail(cls, data, userid, imagetypeid = 1, itype = "PNG", ext = ".png"):
		"""Create thumb nail"""

		img = Image.open(data)
		baseheight = Constants.Newsroom_image_height
		wpercent = (baseheight / float(img.size[1]))
		wsize = int((float(img.size[0])*float(wpercent)))
		if wsize > Constants.Newsroom_image_width:
			#Image too wide so we need to do the calculation in revese
			baseheight = int(baseheight * (150.00/ wsize))
			wsize = Constants.Newsroom_image_width

		img.thumbnail((wsize, baseheight), Image.ANTIALIAS)
		thumbnail = StringIO()
		img = img.convert("RGB")
		img.save(thumbnail, itype, quality = 60)
		thumbnail.flush()
		imagestore = session.query( UserSessionImage ).filter_by(
		  imagetypeid = imagetypeid,
		  userid = userid).scalar()
		if not imagestore:
			imagestore = UserSessionImage( userid = userid ,
			                               imagetypeid =imagetypeid)
			session.add ( imagestore)

		imagestore.image = DBCompress.encode2 ( thumbnail.getvalue())
		imagestore.height = img.size[1]
		imagestore.width = img.size[0]

	@classmethod
	def upload_and_convert(cls, params ):
		""" upload the image and convert it store it on the user session """

		try:
			cls.create_thumbnail(params['headerimage_file'].file,
			                     params["userid"],
			                     params["imagetypeid"])
		except:
			LOG.exception("upload_and_convert")
			raise


ClientNewsRoomImage.mapping = Table('clientnewsroomimage', metadata, autoload = True, schema = "userdata")

mapper(ClientNewsRoomImage, ClientNewsRoomImage.mapping)
