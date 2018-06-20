# -*- coding: utf-8 -*-
""" Capture prrequest twitters
"""
#-----------------------------------------------------------------------------
# Name:        prtwitterreader.py
# Purpose:
# Author:      Chris Hoy
#
# Created:     06/03/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

import logging
from datetime import datetime
from os import getcwd
from dateutil import parser
from turbogears import database
from sqlalchemy import desc
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
# prservices is dummy configuration
read_config(getcwd(), None, "prservices")

# connect to database
database.bind_meta_data()

from prapi import PRTwitter
from prcommon.model import PRRequest

# setup logging
logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger()

def run_twitter():
	""" basic function"""

	# open twitter
	prtwitter = PRTwitter(LOGGER, False)
	prtwitter._open_twitter()

	# get last handle
	since_id = database.session.query(PRRequest.twitterid).order_by(desc(PRRequest.prrequestid)).limit(1).scalar()

	# capture data
	print "Twitter Capture"
	print "Starting at  : ", datetime.now().strftime("%d/%m/%y %H:%M:%S")

	database.session.begin()
	twitters = prtwitter.search("#prrequest OR #journorequest", since_id=since_id)
	for row in twitters:
		tmp = database.session.query(PRRequest.prrequestid).filter(PRRequest.twitterid == str(row.id)).all()
		if tmp:
			print row.id, len(str(row.id)), parser.parse(row.created_at)
			continue

		database.session.add(PRRequest(
		  twitterid=row.id,
		  created=parser.parse(row.created_at),
		  user_name=row.user.screen_name,
		  tweet=row.text,
		  profile_image_url=row.user.profile_image_url))
	database.session.commit()
	print "Finished"
	print "Nbr Imported : ", len(twitters)
	print "Completed at : ", datetime.now().strftime("%d/%m/%y %H:%M:%S")

if __name__ == "__main__":
	run_twitter()
