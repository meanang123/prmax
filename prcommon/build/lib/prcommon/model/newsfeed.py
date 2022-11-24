# -*- coding: utf-8 -*-
"""news feed system"""
#-----------------------------------------------------------------------------
# Name:        newsfeed.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     05/01/2012
# RCS-ID:      $Id:  $
# Copyright:   (c) 2012

#-----------------------------------------------------------------------------
from turbogears.database import mapper, session, config, metadata
from sqlalchemy import Table
from common import BaseSql
from datetime import date
from prcommon.model.identity import Customer
from prcommon.model.lookups import NewsFeedTypes
from prcommon.model.identity import Customer

from xml.dom.minidom import Document

import prcommon.Constants as Constants
import logging
LOG = logging.getLogger("prcommon")

class NewsFeed(BaseSql):
	""" Create a news feed for prmax"""

	@classmethod
	def get_news_feed(cls, icustomerid ):
		""" return the last 5 news itemes based up the customer settings """
		webroot = config.get('prmax.web_main','')
		doc = Document()
		rss = doc.createElement('rss')
		rss.setAttribute("version","2.0")
		doc.appendChild ( rss )
		channel = doc.createElement('channel')
		rss.appendChild ( channel )
		tmp = doc.createElement('title')
		tmp.appendChild ( doc.createTextNode("PRmax News"))
		channel.appendChild ( tmp )
		tmp = doc.createElement('link')
		tmp.appendChild ( doc.createTextNode(webroot))
		channel.appendChild ( tmp )
		tmp = doc.createElement('description')
		tmp.appendChild ( doc.createTextNode('Current News From PRmax'))
		channel.appendChild ( tmp )
		tmp = doc.createElement('language')
		tmp.appendChild ( doc.createTextNode('en-uk'))
		channel.appendChild ( tmp )

		newsitems = session.query (NewsFeed).\
				filter ( NewsFeed.embargo <= date.today()).\
				filter ( NewsFeed.expire > date.today()).\
				order_by(NewsFeed.published).limit(10).all()

		icustomer = None
		if icustomerid:
			icustomer = Customer.query.get( icustomerid)

		for news in newsitems:
			if news.newsfeedtypeid != Constants.NewsFeed_General and icustomer:
				# filter out customer options
				if news.newsfeedtypeid == Constants.NewsFeed_Advance and icustomer.isAdvanceActive():
					continue
				if news.newsfeedtypeid == Constants.NewsFeed_Monitor and icustomer.updatum:
					continue
				if news.newsfeedtypeid == Constants.NewsFeed_SEO and icustomer.seo:
					continue
			item = doc.createElement('item')
			channel.appendChild ( item )
			tmp = doc.createElement('title')
			tmp.appendChild ( doc.createTextNode(news.subject))
			item.appendChild (tmp)
			tmp = doc.createElement('description')
			tmp.appendChild ( doc.createTextNode(news.summary))
			item.appendChild (tmp)
			tmp = doc.createElement('link')
			link = webroot + "newsitems/%d.html" %  news.newsfeedid
			tmp.appendChild ( doc.createTextNode( link))
			item.appendChild (tmp)
			tmp = doc.createElement('pubDate')
			tmp.appendChild ( doc.createTextNode(news.published.strftime("%Y-%m-%d")))
			item.appendChild (tmp)

		return doc.toxml("UTF-8")

	@classmethod
	def add(cls, params):
		""" ad new new feed"""

		transaction = cls.sa_get_active_transaction()
		try:
			news = NewsFeed(**params)
			session.add(news)
			session.flush()
			transaction.commit()
			return news.newsfeedid

		except:
			LOG.exception("newsfeed_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" ad new new feed"""

		transaction = cls.sa_get_active_transaction()

		try:
			news = NewsFeed.query.get( params["newsfeedid"] )
			news.subject = params["subject"]
			news.newscontent = params["newscontent"]
			news.embargo = params["embargo"]
			news.expire = params["expire"]
			news.newsfeedtypeid = params["newsfeedtypeid"]
			news.summary = params["summary"]

			transaction.commit()
		except:
			LOG.exception("newsfeed_add")
			transaction.rollback()
			raise

	@classmethod
	def delete(cls, newsfeedid):
		""" ad new new feed"""

		transaction = cls.sa_get_active_transaction()

		try:
			news = NewsFeed.query.get( newsfeedid )
			session.delete ( news )
			transaction.commit()
		except:
			LOG.exception("newsfeed_delete")
			transaction.rollback()
			raise

	@classmethod
	def get(cls, newsfeedid, extended = False):
		""" ad new new feed"""

		news = NewsFeed.query.get( newsfeedid )
		newstype = NewsFeedTypes.query.get(news.newsfeedtypeid)

		data =  dict(
			newsfeedid = news.newsfeedid,
		  subject = news.subject,
		  summary = news.summary,
		  newsfeedtypedescription = newstype.newsfeedtypedescription,
			embargo_display = news.embargo.strftime("%d-%m-%y"),
			expire_display = news.expire.strftime("%d-%m-%y"))
		if extended:
			data["newscontent"] = news.newscontent
			data["embargo"] = dict(  year = news.embargo.year ,
			                         month = news.embargo.month ,
			                         day = news.embargo.day )
			data["expire"] = dict(  year = news.expire.year ,
			                         month = news.expire.month ,
			                         day = news.expire.day )
			data["newsfeedtypeid"] = news.newsfeedtypeid

		return data


	@classmethod
	def get_rest_page(cls,  params):
		""" list of news feeds"""

		single = True if "newsfeedid" in params else False
		return cls.grid_to_rest ( cls.get_grid_page ( params ),
		                          params['offset'],
		                          single )


	_List_View = """SELECT n.newsfeedid,n.subject,n.summary,
	to_char(n.embargo,'DD-MM-YY') AS embargo_display,
	to_char(n.expire,'DD-MM-YY') AS expire_display,
	nft.newsfeedtypedescription
	FROM newsfeed AS n
	JOIN internal.newsfeedtypes AS nft ON nft.newsfeedtypeid = n.newsfeedtypeid"""
	_Sort_Order = """ ORDER BY %s %s LIMIT :limit  OFFSET :offset """
	_Count_Figure = """ SELECT COUNT(*) FROM newsfeed AS n JOIN internal.newsfeedtypes AS nft ON nft.newsfeedtypeid = n.newsfeedtypeid"""

	_Sort_field = dict(subject = "UPPER(subject)",
	                   summary = "UPPER(summary)",
	                   embargo_display = "n.embargo",
	                   expire_display = "n.expire",
	                   newsfeedtypedescription = "UPPER(newsfeedtypedescription)")
	@classmethod
	def get_grid_page(cls, params ):
		""" Grid page of news"""
		whereclause = ""

		# fix up sort field
		if params.get("sortfield", "") in NewsFeed._Sort_field:
			params["sortfield"] = NewsFeed._Sort_field[params.get("sortfield")]

		return BaseSql.getGridPage( params,
								                "UPPER(n.subject)",
								                'newsfeedid',
								                NewsFeed._List_View + whereclause + NewsFeed._Sort_Order,
								                NewsFeed._Count_Figure + whereclause,
								                cls )

	@classmethod
	def get_external_page(cls, newsfeedid):
		"""Return an external page """

		news = NewsFeed.query.get( newsfeedid )
		header =  ""
		footer =  ""

		return header + news.newscontent  + footer


NewsFeed.mapping = Table('newsfeed', metadata, autoload=True )
mapper(NewsFeed, NewsFeed.mapping)