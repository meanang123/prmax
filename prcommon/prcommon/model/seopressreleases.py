# -*- coding: utf-8 -*-
""" SEO Press Release System """
#-----------------------------------------------------------------------------
# Name:        seopressreleases.py
# Purpose:     Seo Press Release Interface
# Author:      Chris Hoy
#
# Created:     22/09/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
import logging
import datetime
import random
from urlparse import urlparse
from xml.dom.minidom import Document
from cStringIO import StringIO
from turbogears.database import  metadata, mapper, session, config
from sqlalchemy import Table, text, desc
from BeautifulSoup import BeautifulSoup, Comment
from PIL import Image
import simplejson
from prcommon.model.common import BaseSql
from prcommon.model.lookups import SEOCategories, SEOStatus
from prcommon.model.session import UserSession
from prcommon.model.identity import Customer
from prcommon.model.newsroom.clientnewsroom import ClientNewsRoom
from prcommon.model.collateral import Collateral, ECollateral
from prcommon.lib.distribution import MailMerge
import prcommon.Constants as Constants
from ttl.string import encode_html_2, encode_clean_up
from ttl.postgres import DBCompress

LOG = logging.getLogger("prcommon")

BLOCK_SIZE = 16

#########################################################
## Map object to db
#########################################################
class SEORelease(BaseSql):
	""" Seo Press Release """

	@classmethod
	def get_for_display(cls, seoreleaseid):
		""" get all the details need to create a display publish page """

		seo = SEORelease.query.get(seoreleaseid)
		if not seo or seo.seostatusid != Constants.SEO_Live:
			return None

		content = DBCompress.decode(seo.content)
		# us soup too strip the comment and add the target too anchors
		soup = BeautifulSoup(content, smartQuotesTo=None)
		comments = soup.findAll(text=lambda text: isinstance(text, Comment))
		#strip comments
		for comment in comments:
			comment.extract()
		# do anchor tarkets
		for anc in soup.findAll('a'):
			anc["target"] = "_blank"
			anc["rel"] = "nofollow"

		# clean up the encoding
		try:
			content = encode_clean_up(encode_html_2(str(soup)))
			# back to utf-8 if not codede
			content = content.decode("utf-8")
		except:
			content = DBCompress.decode(seo.content)

		return dict(seo=seo,
		            content=content,
		            keywords=",".join([r.seoreleasekeyword.strip(",").replace("_", " ")
		                                for r in session.query(SEOReleaseInterests).filter_by(seoreleaseid=seoreleaseid).all()]),
		            categories=",".join([r.seocategorydescription
		                                  for r in session.query(SEOCategories).join(SEOReleaseCategories, SEOReleaseCategories.seocategoryid == SEOCategories.seocategoryid).filter(SEOReleaseCategories.seoreleaseid == seoreleaseid).all()]),
		            categories2=[r.seocategorydescription
		                         for r in session.query(SEOCategories).join(SEOReleaseCategories, SEOReleaseCategories.seocategoryid == SEOCategories.seocategoryid).filter(SEOReleaseCategories.seoreleaseid == seoreleaseid).all()]
		           )

	@classmethod
	def get_for_edit(cls, seoreleaseid, emailtemplateid):
		""" get the detaild for edit """
		if seoreleaseid:
			seo = SEORelease.query.get(seoreleaseid)
		else:
			# look for attach
			results = session.query(SEORelease).filter_by(emailtemplateid=emailtemplateid).all()
			if results:
				seo = results[0]
			else:
				seo = None

		if not seo:
			# we need to fill the content
			from prcommon.model.emails import EmailTemplates
			emailtemplate = EmailTemplates.query.get(emailtemplateid)
			content = MailMerge.remove_embedded(DBCompress.decode(emailtemplate.emailtemplatecontent))
			soup = BeautifulSoup(content)
			synopsis = "".join(soup.findAll(text=True))
			if synopsis:
				synopsis = MailMerge.remove_embedded(synopsis.strip("<>\n\r"))

			ret = dict(emailtemplateid=emailtemplateid,
									 seoreleaseid=-1,
									 seoimageid=-1,
									 headline=emailtemplate.subject,
									 synopsis=synopsis[0:200] if synopsis else "",
									 companyname="",
									 keywords="",
									 www="",
									 email="",
									 tel="",
									 twitter="",
			                         facebook="",
			                         instagram="",
									 linkedin="",
									 clientid=-1,
									 content=content)
			if emailtemplate.clientid:
				from prcommon.model.client import Client
				client = Client.query.get(emailtemplate.clientid)
				ret["clientid"] = client.clientid
				ret["companyname"] = client.clientname
				ret["www"] = client.www
				ret["email"] = client.email
				ret["tel"] = client.tel
				ret["twitter"] = client.twitter
				ret["facebook"] = client.facebook
				ret["linkedin"] = client.linkedin
				ret["instagram"] = client.instagram
		else:
			ret = dict(emailtemplateid=seo.emailtemplateid,
									 seoreleaseid=seo.seoreleaseid,
									 headline=seo.headline,
									 synopsis=seo.synopsis,
									 seoimageid=seo.seoimageid,
									 companyname=seo.companyname,
									 www=seo.www,
									 email=seo.email,
									 tel=seo.tel,
									 twitter=seo.twitter,
			                         facebook=seo.facebook,
			                         instagram=seo.instagram,
									 linkedin=seo.linkedin,
									 content=DBCompress.decode(seo.content),
									 clientid=seo.clientid,
									 keywords=" ".join([row.seoreleasekeyword for row in session.query(SEOReleaseInterests).filter_by(seoreleaseid=seo.seoreleaseid).all()])
									)
			# now add the categories
			for seoint in session.query(SEOReleaseCategories).filter_by(seoreleaseid=seo.seoreleaseid).all():
				ret["cat_%d" % seoint.seocategoryid] = True

		return ret

	@staticmethod
	def html_to_text(html):
		"convert html to the text version"
		try:
			soup = BeautifulSoup(html)
			return "".join(soup.findAll(text=True)).strip("\n\r")
		except:
			LOG.exception("Problem with text")
			return html

	@classmethod
	def save(cls, params):
		""" Save """
		seo = SEORelease.query.get(params["seoreleaseid"])
		transaction = cls.sa_get_active_transaction()

		if params.has_key("emailtemplateid") and params.get("emailtemplateid", "") and \
		   int(params["emailtemplateid"]) == -1:
			params.pop("emailtemplateid")

		try:
			# update Email record
			# we need to import so as not too create a cirular reference
			if params.get("emailtemplateid", None):
				from prcommon.model.emails import EmailTemplates

				emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])
				emailtemplate.seopressrelease = True

			if not seo:
				params["content_text"] = SEORelease.html_to_text(params["content"])
				params["content"] = DBCompress.encode2(params["content"])
				params.pop("seoreleaseid")
				if params["clientid"] == -1:
					params.pop("clientid")
				seoimageid = params["seoimageid"]
				if params["seoimageid"] in (-1, -2):
					params.pop("seoimageid")

				# check lengths
				# headline, synopsis 255
				if "headline" in params and len(params["headline"]) > 254:
					params["headline"] = params["headline"][:254]
				if "synopsis" in params and len(params["synopsis"]) > 254:
					params["synopsis"] = params["synopsis"][:254]


				seo = SEORelease(**params)
				# at this point do atransfer of the actual detail

				#seo.published = datetime.datetime.now()
				seo.modified = datetime.datetime.now()

				session.add(seo)
				session.flush()

				# depulicate and remove blanks
				for seoreleasekeyword in list(set([keyword for keyword in params["keywords"].split(" ") if keyword])):
					session.add(SEOReleaseInterests(seoreleasekeyword=seoreleasekeyword,
					                                seoreleaseid=seo.seoreleaseid))
				# categoreis
				for count in xrange(1, 26):
					if params.get("cat_%d" % count, False):
						session.add(SEOReleaseCategories(seoreleaseid=seo.seoreleaseid,
						                                 seocategoryid=count))

				# at this point we need to add image
				if seoimageid == -2:
					usersession = UserSession.query.get(params["userid"])
					seoimage = SEOImage(seoreleaseid=seo.seoreleaseid,
					                    seoimage=usersession.seo_image,
					                    seo_image_extension=usersession.seo_image_extension,
					                    height=usersession.seo_height,
					                    width=usersession.seo_width)
					session.add(seoimage)
					session.flush()
					seo.seoimageid = seoimage.seoimageid
			else:
				# update an existing record
				cls._update_seo(seo, params)

			session.flush()
			transaction.commit()
			return seo.seoreleaseid
		except:
			LOG.exception("SEOPressRelease_save")
			transaction.rollback()
			raise

	@classmethod
	def _update_seo(cls, seo, params):
		"""Update the seo record"""

		# at this point do atransfer of the actual detail
		seo.headline = params["headline"]
		seo.synopsis = params["synopsis"][:254]
		seo.companyname = params["companyname"]
		seo.www = params["www"]
		seo.email = params["email"]
		seo.tel = params["tel"]
		seo.twitter = params["twitter"]
		seo.facebook = params["facebook"]
		seo.instagram = params["instagram"]
		seo.linkedin = params["linkedin"]
		clientid = params.get("clientid", None)
		if clientid == -1:
			clientid = None
		seo.clientid = clientid
		seo.content_text = SEORelease.html_to_text(params["content"])
		seo.content = DBCompress.encode2(params["content"])
		session.flush()

		# handle keywords
		seodb = {}
		seokeywords = {}
		for seoint in session.query(SEOReleaseInterests).filter_by(seoreleaseid=seo.seoreleaseid).all():
			seodb[seoint.seoreleasekeyword.lower()] = seoint
		for keyword in [keyword for keyword in params["keywords"].split(" ") if keyword]:
			seokeywords[keyword.lower()] = keyword
		# add's
		for (key, value) in seokeywords.items():
			if not seodb.has_key(key):
				session.add(SEOReleaseInterests(
				  seoreleasekeyword=value,
				  seoreleaseid=seo.seoreleaseid))
		# deletes's
		for (key, obj) in seodb.items():
			if key not in seokeywords:
				session.delete(obj)

		# handle categories
		seodb = {}
		for seoint in session.query(SEOReleaseCategories).filter_by(seoreleaseid=seo.seoreleaseid).all():
			seodb[seoint.seocategoryid] = seoint
		seocategories = {}
		for count in xrange(1, 26):
			if params.get("cat_%d" % count, False):
				seocategories[count] = count

		for (key, value) in seocategories.items():
			if not seodb.has_key(key):
				session.add(SEOReleaseCategories(seocategoryid=value,
				                                 seoreleaseid=seo.seoreleaseid))
		# deletes's
		for (key, obj) in seodb.items():
			if key not in seocategories:
				session.delete(obj)

		# image clear
		if seo.seoimageid > 0 and params["seoimageid"] == -1:
			# images has been clear need to update
			seoimage = SEOImage.query.get(seo.seoimageid)
			session.delete(seoimage)
			seo.seoimageid = None

		# adding image
		if params["seoimageid"] == -2:
			usersession = UserSession.query.get(params["userid"])
			if seo.seoimageid:
				seoimage = SEOImage.query.get(seo.seoimageid)
				seoimage.seoimage = usersession.seo_image
				seoimage.seo_image_extension = usersession.seo_image_extension
				seoimage.height = usersession.seo_height
				seoimage.width = usersession.seo_width
			else:
				seoimage = SEOImage(seoreleaseid=seo.seoreleaseid,
				                    seoimage=usersession.seo_image,
				                    seo_image_extension=usersession.seo_image_extension,
				                    height=usersession.seo_height,
				                    width=usersession.seo_width)
				session.add(seoimage)
				session.flush()
				seo.seoimageid = seoimage.seoimageid

			usersession.seo_image_extension = None
			usersession.seo_image = None

		seocache = session.query(SEOCache).\
	    filter(SEOCache.seoreleaseid == seo.seoreleaseid).all()
		if seocache:
			for i in xrange(0, len(seocache)):
				session.delete(seocache[i])
				session.flush()


	@classmethod
	def _handle_payment(cls, seo):
		""" setup the payment settings """
		# handle the payment
		customer = Customer.query.get(seo.customerid)
		if customer.seonbrincredit > 0:
			# customer has some free ones or prepaid do it here
			customer.seonbrincredit -= 1
			seo.seostatusid = Constants.SEO_Live
			seo.seopaymenttypeid = Constants.SEO_PaymentType_Sales
		else:
			seo.seopaymenttypeid = customer.seopaymenttypeid
			if customer.seopaymenttypeid in (Constants.SEO_PaymentType_DD, Constants.SEO_PaymentType_PO, Constants.SEO_PaymentType_Beta):
				seo.seostatusid = Constants.SEO_Live
			elif customer.seopaymenttypeid == Constants.SEO_PaymentType_CC:
				seo.seostatusid = Constants.SEO_Waiting_Payment

	@classmethod
	def save_and_publish(cls, params):
		""" save and publish an seo press release """
		transaction = cls.sa_get_active_transaction()

		try:
			seoreleaseid = int(params.get("seoreleaseid", "-1"))
			seo = SEORelease.query.get(seoreleaseid)
			if seo:
				cls._update_seo(seo, params)
				seo.modified = datetime.datetime.now()
				seo.seostatusid = Constants.SEO_Live
				seo.published = datetime.datetime.now()
			else:
				if params["clientid"] == -1:
					params.pop("clientid")
				seoimageid = params["seoimageid"]
				if params["seoimageid"] in (-1, -2):
					params.pop("seoimageid")

				params["content_text"] = SEORelease.html_to_text(params["content"])
				params["content"] = DBCompress.encode2(params["content"])
				params.pop("seoreleaseid", None)
				params.pop("emailtemplateid", None)

				if "headline" in params and len(params["headline"]) > 254:
					params["headline"] = params["headline"][:254]
				if "synopsis" in params and len(params["synopsis"]) > 254:
					params["synopsis"] = params["synopsis"][:254]

				seo = SEORelease(**params)
				session.add(seo)

				seo.modified = datetime.datetime.now()
				seo.published = datetime.datetime.now()
				cls._handle_payment(seo)

				session.flush()
				# depulicate and remove blanks
				for seoreleasekeyword in list(set([keyword for keyword in params["keywords"].split(" ") if keyword])):
					session.add(SEOReleaseInterests(seoreleasekeyword=seoreleasekeyword,
					                                seoreleaseid=seo.seoreleaseid))
				# categoreis
				for count in xrange(1, 26):
					if params.get("cat_%d" % count, False):
						session.add(SEOReleaseCategories(
						  seoreleaseid=seo.seoreleaseid,
						  seocategoryid=count))

				# at this point we need to add image
				if seoimageid == -2:
					usersession = UserSession.query.get(params["userid"])
					seoimage = SEOImage(seoreleaseid=seo.seoreleaseid,
					                    seoimage=usersession.seo_image,
					                    seo_image_extension=usersession.seo_image_extension,
					                    height=usersession.seo_height,
					                    width=usersession.seo_width)
					session.add(seoimage)
					session.flush()
					seo.seoimageid = seoimage.seoimageid

			transaction.commit()
			return dict(seoreleaseid=seo.seoreleaseid,
			            seostatusid=seo.seostatusid,
			            seostatusdescription="Live",
			            headline=seo.headline,
			            published_display=datetime.date.today().strftime("%d-%m-%y"))
		except:
			LOG.exception("SEOPressRelease_save_and_publish")
			transaction.rollback()
			raise

	_Release_List_Date = """SELECT seo.synopsis,'/releases/'||seo.seoreleaseid||'.html' as link, seo.headline, seo.seoimageid,
	si.height,si.width, to_char(seo.published,'DD Month YY') as published_display, to_char(seo.published,'DD/MM/YY') as published_display2
	FROM seoreleases.seorelease AS seo
	LEFT OUTER JOIN seoreleases.seoimages AS si ON si.seoimageid = seo.seoimageid"""
	_Release_List_Date_Cardiff = """SELECT seo.synopsis,
	CASE
	WHEN seo.clientid = 2014 THEN '/releases/c/'||seo.seoreleaseid||'.html'
	WHEN seo.clientid = 1966 THEN '/releases/w/'||seo.seoreleaseid||'.html'
	END as link,
	seo.headline, seo.seoimageid,
	si.height,si.width, to_char(seo.published,'DD Month YY') as published_display, to_char(seo.published,'DD/MM/YY') as published_display2
	FROM seoreleases.seorelease AS seo
	LEFT OUTER JOIN seoreleases.seoimages AS si ON si.seoimageid = seo.seoimageid"""
	_Release_List_Date_Welsh = """SELECT seo.synopsis,'/releases/w/'||seo.seoreleaseid||'.html' as link, seo.headline, seo.seoimageid,
	si.height,si.width, to_char(seo.published,'DD Month YY') as published_display, to_char(seo.published,'DD/MM/YY') as published_display2
	FROM seoreleases.seorelease AS seo
	LEFT OUTER JOIN seoreleases.seoimages AS si ON si.seoimageid = seo.seoimageid"""

	_Release_List_Count = """SELECT COUNT(*) FROM seoreleases.seorelease AS seo """
	_Release_List_Order = """ ORDER BY published DESC OFFSET :offset LIMIT :limit"""

	@classmethod
	def get_for_release(cls, params):
		""" Do the search and return the details"""

		whereused = " WHERE published < CURRENT_TIMESTAMP AND seostatusid = 2 "
		fields = dict(limit=int(params.get("limit", BLOCK_SIZE)),
		              offset=BLOCK_SIZE * (int(params.get("o", 1)) -1)
								)

		return dict(
		    results=cls.sqlExecuteCommand(text(SEORelease._Release_List_Date + whereused + SEORelease._Release_List_Order),
		                                  fields,
		                                  BaseSql.ResultAsEncodedDict),
		    resultcount=cls.sqlExecuteCommand(text(SEORelease._Release_List_Count + whereused),
		                                        fields,
		                                        BaseSql.singleFieldInteger),
		  offset=fields["offset"] / BLOCK_SIZE + 1,
		  criteria="")

	@classmethod
	def save_release(cls, params):
		""" save the release and template as part of the press release wizard """

		if params.get("seopressrelease"):
			return cls.save(params)
		else:
			transaction = cls.sa_get_active_transaction()

			try:
				# no release with this one
				seoreleaseid = None
				if params.get("emailtemplateid", None):
					from prcommon.model.emails import EmailTemplates
					emailtemplate = EmailTemplates.query.get(params["emailtemplateid"])
					emailtemplate.seopressrelease = False

				seo = None
				if "seoreleaseid" in params:
					seo = SEORelease.query.get(params["seoreleaseid"])
				if not seo and "emailtemplateid" in  params:
					results = session.query(SEORelease).filter_by(emailtemplateid=params["emailtemplateid"]).all()
					if results:
						seo = results[0]
				if seo:
					session.delete(seo)

				transaction.commit()
				return seoreleaseid
			except:
				LOG.exception("SEOPressRelease_save_release")
				transaction.rollback()
				raise

	@classmethod
	def do_search(cls, params):
		""" do the search """

		whereused = " WHERE published < CURRENT_TIMESTAMP AND seostatusid = 2"
		fields = dict(limit=int(params.get("limit", BLOCK_SIZE)),
		              offset=BLOCK_SIZE * (int(params.get("o", 1)) -1),
								)
		cri = {}
		if params.get("s", ""):
			# load saved context
			cri = simplejson.JSONDecoder().decode(params["s"])
			for key in  cri:
				if key == "c":
					try:
						cri[key] = int(cri[key])
						whereused += " AND seo.seoreleaseid in (SELECT seoreleaseid FROM seoreleases.seoreleasecategories WHERE seocategoryid = :c) "
					except:
						pass
				if key == "h":
					whereused += " AND seo.headline ilike :h "

				if key == "b":
					whereused += " AND seo.content_text ilike :b "

				if key == "cid":
					whereused += " AND seo.clientid  = :cid "

				if key == "search":
					whereused += "AND (seo.headline ilike :search OR seo.content_text ilike :search) "
		else:
			# This is for the quick search
			if params.get("common", "").strip():
				cri["k"] = params.get("common").strip()
				cri["h"] = "%" + params["common"].strip() + "%"
				whereused += """ AND (  seo.seoreleaseid in (SELECT seoreleaseid FROM seoreleases.seoreleaseinterests WHERE seoreleasekeyword ilike :k) OR
				 seo.headline ilike :h) """
			else:
				# find the complex search
				if params.get("keywords", "").strip():
					cri["k"] = params.get("keywords").strip()
					whereused += " AND seo.seoreleaseid in (SELECT seoreleaseid FROM seoreleases.seoreleaseinterests WHERE seoreleasekeyword ilike :k) "

				if params.get("headline", "").strip():
					cri["h"] = "%" + params["headline"].strip() + "%"
					whereused += " AND seo.headline ilike :h "

				if params.get("bodytext"):
					cri["b"] = "%" + params["bodytext"].strip() + "%"
					whereused += " AND seo.content_text ilike :b "

				seocategoryid = int(params.get("seocategoryid", -1))
				if seocategoryid > 0:
					cri["c"] = seocategoryid
					whereused += " AND seo.seoreleaseid in (SELECT seoreleaseid FROM seoreleases.seoreleasecategories WHERE seocategoryid = :c) "

				if "cid" in params:
					cri["cid"] = int(params["cid"])
					whereused += " AND seo.clientid  = :cid "

				if 'search' in params:
					cri["search"] = "%" + params["search"].strip() + "%"
					whereused += "AND (seo.headline ilike :search OR seo.content_text ilike :search) "

		fields.update(cri)
		command = SEORelease._Release_List_Date + whereused + SEORelease._Release_List_Order
		if 'cid' in params and (params['cid'] == 2014 or params['cid'] == 1966): #Cardiff
			command = SEORelease._Release_List_Date_Cardiff + whereused + SEORelease._Release_List_Order

		return dict(
		    results=cls.sqlExecuteCommand(text(command),
		                                  fields,
		                                  BaseSql.ResultAsEncodedDict),
		    resultcount=cls.sqlExecuteCommand(text(SEORelease._Release_List_Count + whereused),
		                                      fields,
		                                      BaseSql.singleFieldInteger),
		    criteria=simplejson.JSONEncoder().encode(cri),
		    offset=(fields["offset"] / BLOCK_SIZE) + 1)

	@classmethod
	def delete(cls, params):
		""" with draw press release from the site """

		transaction = cls.sa_get_active_transaction()

		try:
			# no release with this one
			seo = SEORelease.query.get(params["seoreleaseid"])
			if seo:
				if seo.emailtemplateid:
					from prcommon.model.emails import EmailTemplates
					emailtemplate = EmailTemplates.query.get(seo.emailtemplateid)
					emailtemplate.seopressrelease = False

				session.delete(seo)
			# clear cache
			seocache = session.query(SEOCache).\
			filter(SEOCache.seoreleaseid == params["seoreleaseid"]).all()
			if seocache:
				for i in xrange(0, len(seocache)):
					session.delete(seocache[i])
					session.flush()
			transaction.commit()
		except:
			LOG.exception("SEOPressRelease_delete")
			transaction.rollback()
			raise

	@classmethod
	def withdraw(cls, params, seostatusid=Constants.SEO_Customer_Withdrawn):
		""" with draw press release from the site """

		transaction = cls.sa_get_active_transaction()

		try:
			# no release with this one
			seo = SEORelease.query.get(params["seoreleaseid"])
			if seo:
				seo.seostatusid = seostatusid
			# clear cache
			seocache = session.query(SEOCache).\
			filter(SEOCache.seoreleaseid == params["seoreleaseid"]).all()
			if seocache:
				for i in xrange(0, len(seocache)):
					session.delete(seocache[i])
					session.flush()
			transaction.commit()
		except:
			LOG.exception("SEOPressRelease_withdraw")
			transaction.rollback()
			raise

	@classmethod
	def republish(cls, params):
		""" Re-publish an seo release"""
		transaction = cls.sa_get_active_transaction()

		try:
			# get seo
			seo = SEORelease.query.get(params["seoreleaseid"])
			# only do payments if the seo is pending if it withdrawn then payment has already been done
			if seo.seostatusid == Constants.SEO_Status_Pending:
				cls._handle_payment(seo)
			else:
				seo.seostatusid = Constants.SEO_Live
			seo.published = datetime.datetime.now()

			if seo.emailtemplateid:
				from prcommon.model.emails import EmailTemplates
				emailtemplate = EmailTemplates.query.get(seo.emailtemplateid)
				emailtemplate.seopressrelease = True

			transaction.commit()
			return dict(seoreleaseid=seo.seoreleaseid,
			            seostatusid=seo.seostatusid,
			            seostatusdescription="Live",
			            headline=seo.headline,
			            published_display=datetime.date.today().strftime("%d-%m-%y"))
		except:
			LOG.exception("SEOPressRelease_publish")
			transaction.rollback()
			raise


	_List_View = """SELECT
	c.customerid,
	c.customername,
	seo.headline,
	seo.seoreleaseid,
	s.seostatusdescription,
	s.seostatusid,
	to_char(seo.published,'DD-MM-YY') AS published_display,
	seo.viewed,
	cl.clientname
	FROM seoreleases.seorelease AS seo
	JOIN internal.seostatus AS s ON seo.seostatusid = s.seostatusid
	LEFT OUTER JOIN internal.customers AS c ON c.customerid = seo.customerid
	LEFT OUTER JOIN userdata.client AS cl ON seo.clientid = cl.clientid"""

	_List_View2 = """SELECT
	seo.seoreleaseid,
	seo.headline as title,
	seo.synopsis as summary,
	'http://prnewslink.net/releases/'||seo.seoreleaseid||'.html' as link,
	to_char(seo.published,'DD-MM-YY') AS published_display
	FROM seoreleases.seorelease AS seo"""

	_Sort_Order = """ ORDER BY %s %s
	LIMIT :limit  OFFSET :offset """

	_Count_Figure = """ SELECT COUNT(*) FROM seoreleases.seorelease AS seo """

	@classmethod
	def get_grid_page(cls, params, internal=False):
		""" get a list of the seo """

		if params.get("sortfield", "") == "headline":
			params["sortfield"] = "UPPER(seo.headline)"
		elif params.get("sortfield", "") == "published_display":
			params["sortfield"] = "seo.published"

		whereclause = "" if internal else " WHERE seo.customerid = :customerid "

		if params.get("seostatusid", "-1") != "-1":
			whereclause = BaseSql.addclause(whereclause, "seo.seostatusid = :seostatusid")
			params["seostatusid"] = int(params["seostatusid"])

		if params.get("headline", "").strip():
			whereclause = BaseSql.addclause(whereclause, "seo.headline ilike :headline")
			params["headline"] = "%" + params["headline"] + "%"

		icustomerid = params.get("icustomerid", "").strip()
		if icustomerid and icustomerid not in ("-1", "-2"):
			whereclause = BaseSql.addclause(whereclause, "seo.customerid = :icustomerid")
			params["icustomerid"] = int(params["icustomerid"])

		return BaseSql.getGridPage(
		  params,
		  "UPPER(seo.headline)",
		  'seoreleaseid',
		  SEORelease._List_View + whereclause + SEORelease._Sort_Order,
		  SEORelease._Count_Figure + whereclause,
		  cls)

	@classmethod
	def get_list(cls, params, internal=False):
		""" get a list of the seo """

		customerid = params.get("customerid", "").strip()
		if customerid:
			cust = Customer.query.get(customerid)
			if cust.licence_expire < datetime.date.today():
				return

		fromdate = (datetime.date.today() - datetime.timedelta(days=params['days'])).strftime("%Y-%m-%d")
		todate = datetime.date.today().strftime("%Y-%m-%d")

		whereclause = """ WHERE seo.published::date BETWEEN '%s' AND '%s'""" %(fromdate, todate)

		# customer settings
		if customerid and customerid not in ("-1", "-2"):
			whereclause = BaseSql.addclause(whereclause, "seo.customerid = :customerid")
			params["customerid"] = int(params["customerid"])
		# for a client
		clientid = params.get("clientid", "").strip()
		if clientid and clientid not in ("-1", ):
			whereclause = BaseSql.addclause(whereclause, "seo.clientid = :clientid")
			params["clientid"] = int(params["clientid"])
		# for a newsroom
		newsrooomid = params.get('newsrooomid', '')
		if newsrooomid and newsrooomid not in ("-1", ):
			whereclause = BaseSql.addclause(whereclause, "seo.seoreleaseid IN (SELECT seoreleaseid FROM seoreleases.seonewsrooms WHERE newsroomid = :newsroomid)")

		return cls.sqlExecuteCommand(text(SEORelease._List_View2 + whereclause),
		                               params,
	                                   BaseSql.ResultAsEncodedDict)

	@classmethod
	def get(cls, seoreleaseid):
		"""Get the basic details """

		seo = SEORelease.query.get(seoreleaseid)
		status = SEOStatus.query.get(seo.seostatusid)
		published_display = ""
		if seo.published:
			published_display = seo.published.strftime("%d-%m-%y")

		return dict(seoreleaseid=seoreleaseid,
		            headline=seo.headline,
		            seostatusdescription=status.seostatusdescription,
		            seostatusid=seo.seostatusid,
		            published_display=published_display)

	@classmethod
	def get_rest_page_shop(cls, params):
		"""get a list of seo for shop """

		single = True if "seoreleaseid" in params else False
		return cls.grid_to_rest(cls.get_grid_page_shop(params),
		                          params['offset'],
		                          single)

	_List_Shop_View = """SELECT seo.headline,seo.seoreleaseid,s.seostatusdescription,
	s.seostatusid,
	to_char(seo.published,'DD-MM-YY') AS published_display,
	to_char(seo.seo_invoice_date,'DD-MM-YY') AS seo_invoice_date_display,
	ci.invoicenbr,
	p.seopaymenttypedescription
	FROM seoreleases.seorelease AS seo
	JOIN internal.seostatus AS s ON seo.seostatusid = s.seostatusid
	LEFT OUTER JOIN internal.seopaymenttypes AS p ON p.seopaymenttypeid = seo.seopaymenttypeid
	LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.customerinvoiceid = seo.customerinvoiceid"""
	_Count_Shop_Figure = """ SELECT COUNT(*) FROM seoreleases.seorelease AS seo """

	@classmethod
	def get_grid_page_shop(cls, inparams):
		""" get results"""
		if "icustomerid" in inparams and inparams["icustomerid"] == -1:
			return dict(numRows=1, items=[dict(shopid=-1, name="No Selection")],
			            identifier="seoreleaseid")
		else:
			whereclause = BaseSql.addclause("", "seo.customerid = :icustomerid")

			return BaseSql.getGridPage(
			  inparams,
			  'seo.published',
			  'seoreleaseid',
			  SEORelease._List_Shop_View  + whereclause + SEORelease._Sort_Order,
			  SEORelease._Count_Shop_Figure + whereclause,
			  cls)

class SEOReleaseInterests(BaseSql):
	""" Seo press Release keywords"""
	pass

class SEOReleaseCategories(BaseSql):
	""" SEO press Release catergory """
	pass

class SEOCache(BaseSql):
	""" Cache output of a record """

	@classmethod
	def get_cached(cls, seoreleaseid, layout):
		""" get an entry from the cache """
		seocache = session.query(SEOCache).\
		    filter(SEOCache.seoreleaseid == seoreleaseid).\
			filter(SEOCache.layout == layout).scalar()
		if seocache:
			seorelease = SEORelease.query.get(seoreleaseid)
			if seorelease:
				seorelease.viewed = seorelease.viewed + 1
			return seocache.cache
		else:
			return None

	@classmethod
	def add_cache(cls, seoreleaseid, html, layout):
		""" Add an entry to the cache"""

		transaction = cls.sa_get_active_transaction()
		try:
			# update Email record
			seocache = session.query(SEOCache).\
			    filter(SEOCache.seoreleaseid == seoreleaseid).\
			    filter(SEOCache.layout == layout).scalar()

			if not seocache:
				session.add(SEOCache(seoreleaseid=seoreleaseid,
				                     layout=layout,
				                     cache=html))
				seorelease = SEORelease.query.get(seoreleaseid)
				if seorelease:
					seorelease.viewed = seorelease.viewed + 1
			transaction.commit()
		except:
			LOG.exception("add_cache")

class SEOSite(object):
	""" SEO site function """
#<?xml version="1.0" encoding="utf-8"?>
#
#<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
#    <url>
#        <loc>http://example.com/</loc>
#        <lastmod>2006-11-18</lastmod>
#        <changefreq>daily</changefreq>
#        <priority>0.8</priority>
#    </url>
#</urlset>
	_basic_locations = ("aboutus", "privacypolicy", "termsconditions", "contactus")

	@staticmethod
	def sitemap():
		""" get the site map"""
		webroot = config.get('prpublish.web', '')
		doc = Document()
		urlset = doc.createElement('urlset')
		urlset.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
		doc.appendChild(urlset)
		# add standard pages
		url = doc.createElement('url')
		urlset.appendChild(url)
		tmp = doc.createElement('loc')
		tmp.appendChild(doc.createTextNode(webroot))
		url.appendChild(tmp)
		tmp = doc.createElement('lastmod')
		tmp.appendChild(doc.createTextNode(datetime.date.today().strftime("%Y-%m-%d")))
		url.appendChild(tmp)
		tmp = doc.createElement('changefreq')
		tmp.appendChild(doc.createTextNode("always"))
		url.appendChild(tmp)

		for loc in SEOSite._basic_locations:
			url = doc.createElement('url')
			urlset.appendChild(url)
			tmp = doc.createElement('loc')
			tmp.appendChild(doc.createTextNode(webroot + loc))
			url.appendChild(tmp)
			tmp = doc.createElement('lastmod')
			tmp.appendChild(doc.createTextNode(datetime.date.today().strftime("%Y-%m-%d")))
			url.appendChild(tmp)

		# add caegory search to sitmap as they are part of the site
		#for seocategoryid in xrange(1, 26):
		#	url = doc.createElement('url')
		#	urlset.appendChild(url)
		#	tmp = doc.createElement('loc')
		#	tmp.appendChild(doc.createTextNode(webroot + "search?seocategoryid=%d" % seocategoryid))
		#	url.appendChild(tmp)
		#	tmp = doc.createElement('lastmod')
		#	tmp.appendChild(doc.createTextNode( datetime.date.today().strftime("%Y-%m-%d")))
		#	url.appendChild(tmp)

		# add release pages
		for seo in session.query(SEORelease).filter_by(seostatusid=Constants.SEO_Live).order_by(desc(SEORelease.published)).all():
			url = doc.createElement('url')
			urlset.appendChild(url)
			tmp = doc.createElement('loc')
			tmp.appendChild(doc.createTextNode(webroot + "releases/%d.html" % seo.seoreleaseid))
			url.appendChild(tmp)
			tmp = doc.createElement('lastmod')
			# get last chnaged date
			published = seo.published
			if seo.modified:
				published = max(published, seo.modified)
			tmp.appendChild(doc.createTextNode(published.strftime("%Y-%m-%d")))
			url.appendChild(tmp)
			tmp = doc.createElement('changefreq')
			tmp.appendChild(doc.createTextNode("weekly"))
			url.appendChild(tmp)

		# add the news rooms
		from prcommon.model.client import Client
		for records in session.query(ClientNewsRoom, Client, Customer).\
		  join(Client, Client.clientid == ClientNewsRoom.clientid).\
		  join(Customer, Client.customerid == Customer.customerid).\
		  filter(ClientNewsRoom.customerid == Customer.customerid).\
		  filter(Customer.has_news_rooms == True).all():
			if records[2].is_active():
				url = doc.createElement('url')
				urlset.appendChild(url)
				tmp = doc.createElement('loc')
				tmp.appendChild(doc.createTextNode(records[0].get_news_room_url()))
				url.appendChild(tmp)
				tmp = doc.createElement('lastmod')
				tmp.appendChild(doc.createTextNode(datetime.date.today().strftime("%Y-%m-%d")))
				url.appendChild(tmp)
				tmp = doc.createElement('changefreq')
				tmp.appendChild(doc.createTextNode("weekly"))
				url.appendChild(tmp)

		tmp = StringIO()
		doc.writexml(tmp, encoding="utf-8")
		tmp.flush()
		return tmp.getvalue()

	@staticmethod
	def news_sitemap():
		"""Create a news feed for google"""
		webroot = config.get('prpublish.web', '')
		doc = Document()
		urlset = doc.createElement('urlset')
		urlset.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
		urlset.setAttribute("xmlns:news", "http://www.google.com/schemas/sitemap-news/0.9")
		doc.appendChild(urlset)
		published_after = datetime.date.today() - datetime.timedelta(days=2)
		for seo in session.query(SEORelease).\
		    filter(SEORelease.seostatusid == Constants.SEO_Live).\
				filter(SEORelease.published >= published_after).\
		    order_by(desc(SEORelease.published)).all():
			url = doc.createElement('url')
			urlset.appendChild(url)
			tmp = doc.createElement('loc')
			tmp.appendChild(doc.createTextNode(webroot + "releases/%d.html" % seo.seoreleaseid))
			url.appendChild(tmp)

			# create news feed item
			news = doc.createElement('news:publication')
			url.appendChild(news)

			tmp = doc.createElement('news:name')
			tmp.appendChild(doc.createTextNode("PRnewslink"))
			news.appendChild(tmp)

			tmp = doc.createElement('news:language')
			tmp.appendChild(doc.createTextNode("en"))
			news.appendChild(tmp)

			tmp = doc.createElement('news:genres')
			url.appendChild(tmp)
			tmp.appendChild(doc.createTextNode("PressRelease"))

			tmp = doc.createElement('news:publication_date')
			url.appendChild(tmp)
			tmp.appendChild(doc.createTextNode(seo.published.strftime("%Y-%m-%d")))

			tmp = doc.createElement('news:title')
			url.appendChild(tmp)
			tmp.appendChild(doc.createTextNode(seo.headline.encode("utf-8", "xmlcharrefreplace")))

			keywords = ",".join([r.seoreleasekeyword.strip(",") for r in session.query(SEOReleaseInterests).filter_by(seoreleaseid=seo.seoreleaseid).all()])
			tmp = doc.createElement('news:keywords')
			url.appendChild(tmp)
			tmp.appendChild(doc.createTextNode(keywords))

		tmp = StringIO()
		doc.writexml(tmp, encoding="utf-8")
		tmp.flush()
		return tmp.getvalue()


	@staticmethod
	def get_rss(seocategoryid=None,
	             clientid=None,
	             title="PRNewslink News",
	             description='Current News From PRmax'):
		""" get the rss feed for the site """
		webroot = config.get('prpublish.web', '')
		doc = Document()
		rss = doc.createElement('rss')
		rss.setAttribute("version", "2.0")
		doc.appendChild(rss)
		channel = doc.createElement('channel')
		rss.appendChild(channel)
		tmp = doc.createElement('title')
		title = title
		if  seocategoryid:
			cat = SEOCategories.query.get(seocategoryid)
			title += (" - " + cat.seocategorydescription)
		tmp.appendChild(doc.createTextNode(title))
		channel.appendChild(tmp)
		tmp = doc.createElement('link')
		tmp.appendChild(doc.createTextNode(webroot))
		channel.appendChild(tmp)
		tmp = doc.createElement('description')
		tmp.appendChild(doc.createTextNode(description))
		channel.appendChild(tmp)
		tmp = doc.createElement('language')
		tmp.appendChild(doc.createTextNode('en-uk'))
		channel.appendChild(tmp)

		# need too be refined section
		#pubDate
		#lastBuildDate

		# now append the last 24 hours news
		if seocategoryid:
			results = session.query(SEORelease).join(SEOReleaseCategories)\
			  .filter(SEORelease.seostatusid == Constants.SEO_Live)\
			  .filter(SEORelease.seoreleaseid == SEOReleaseCategories.seoreleaseid,)\
			  .filter(SEOReleaseCategories.seocategoryid == seocategoryid)\
				.filter(SEORelease.published <= datetime.datetime.now())\
			  .order_by(desc(SEORelease.published)).limit(BLOCK_SIZE).all()
		elif clientid:
			results = session.query(SEORelease).filter(SEORelease.seostatusid == Constants.SEO_Live)\
			  .filter(SEORelease.clientid == clientid)\
			  .filter(SEORelease.published <= datetime.datetime.now())\
			  .order_by(desc(SEORelease.published)).limit(BLOCK_SIZE).all()
		else:
			results = session.query(SEORelease).filter(SEORelease.seostatusid == Constants.SEO_Live)\
			        .filter(SEORelease.published <= datetime.datetime.now())\
			        .order_by(desc(SEORelease.published)).limit(BLOCK_SIZE).all()

		for seo in results:
			item = doc.createElement('item')
			channel.appendChild(item)
			tmp = doc.createElement('title')
			tmp.appendChild(doc.createTextNode(seo.headline))
			item.appendChild(tmp)
			tmp = doc.createElement('description')
			tmp.appendChild(doc.createTextNode(seo.synopsis))
			item.appendChild(tmp)
			tmp = doc.createElement('link')
			link = webroot + "releases/%d.html" % seo.seoreleaseid
			tmp.appendChild(doc.createTextNode(link))
			item.appendChild(tmp)
			tmp = doc.createElement('pubdate')
			tmp.appendChild(doc.createTextNode(str(seo.published)))
			item.appendChild(tmp)

		return doc.toxml("UTF-8")

	@classmethod
	def generate_test_data(cls, limit):
		""" generate test data """

		for counter in xrange(0, limit):
			seo = SEORelease(
			  synopsis="Large Data",
			  contactname="Mr Smith",
			  www="www.prmax.co.uk",
			  email="chris.g.hoy@hmail.com",
			  companyname="Tethys Tec",
			  headline="Example %d" % counter,
			  content=DBCompress.encode2("Test Example"),
			  content_text="Test Example",
			  customerid=-1,
			  seostatusid=2,
			  published=datetime.datetime.now(),
			  modified=datetime.datetime.now())
			session.add(seo)
			session.flush()
			for interestid in xrange(1, random.randint(1, 10)):
				session.add(SEOReleaseInterests(seoreleaseid=seo.seoreleaseid,
				                                seoreleasekeyword=str(interestid)))

			used = {}
			for interestid in xrange(1, random.randint(1, 25)):
				tmp = random.randint(1, 25)
				if tmp not in used:
					SEOReleaseCategories(seoreleaseid=seo.seoreleaseid,
					                     seocategoryid=tmp)
				used[tmp] = True

			session.flush()


	@classmethod
	def generate_soe_from_customer_live(cls, customerid):
		""" set all as paid for
		set as pending
		load baseic details """
		from prcommon.model.emails import EmailTemplates

		for emailtemplate in session.query(EmailTemplates).\
		    filter(EmailTemplates.pressreleasestatusid == 2).\
				filter(EmailTemplates.customerid == customerid).all():
			content = DBCompress.decode(emailtemplate.emailtemplatecontent)
			synopsis = SEORelease.html_to_text(content)

			seo = SEORelease(
			  synopsis=synopsis[0:200].strip("<>").replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ") if synopsis else "",
			  contactname="",
			  www="",
			  email="",
			  companyname="",
			  headline=emailtemplate.subject[:254],
			  content_text=synopsis.strip("\n"),
			  content=DBCompress.encode2(content),
			  customerid=emailtemplate.customerid,
			  seostatusid=Constants.SEO_Pending)
			session.add(seo)
			session.flush()
			emailtemplate.seoreleaseid = seo.seoreleaseid

	@classmethod
	def generate_test_from_live(cls, limit):
		""" test """
		from prcommon.model.emails import EmailTemplates

		for emailtemplate in session.query(EmailTemplates).filter(EmailTemplates.pressreleasestatusid == 2).limit(limit).all():
			content = DBCompress.decode(emailtemplate.emailtemplatecontent)
			synopsis = SEORelease.html_to_text(content)

			seo = SEORelease(
			  synopsis=synopsis[0:200].strip("<>") if synopsis else "",
			  contactname="Mr Smith",
			  www="www.prmax.co.uk",
			  email="chris.g.hoy@hmail.com",
			  companyname="Tethys Tec",
			  headline=emailtemplate.subject,
			  content_text=synopsis.strip("\n"),
			  content=DBCompress.encode2(content),
			  customerid=1,
			  seostatusid=2,
			  published=datetime.datetime.now(),
			  modified=datetime.datetime.now())
			session.add(seo)
			session.flush()
			for interestid in xrange(1, random.randint(1, 10)):
				session.add(SEOReleaseInterests(seoreleaseid=seo.seoreleaseid,
				                                seoreleasekeyword=str(interestid)))

			used = {}
			for dummy in xrange(1, random.randint(1, 25)):
				tmp = random.randint(1, 25)
				if tmp not in used:
					SEOReleaseCategories(seoreleaseid=seo.seoreleaseid,
					                     seocategoryid=tmp)
					used[tmp] = True


	@staticmethod
	def get_rss_limited_feed(results,
	                         title="PRNewslink News",
	                         description='Current News From PRmax'):
		""" get the rss feed for the site """
		webroot = config.get('prpublish.web', '')
		doc = Document()
		rss = doc.createElement('rss')
		rss.setAttribute("version", "2.0")
		rss.setAttribute("xmlns:content", "http://purl.org/rss/1.0/modules/content/")

		doc.appendChild(rss)
		channel = doc.createElement('channel')
		rss.appendChild(channel)
		tmp = doc.createElement('title')
		title = title
		tmp.appendChild(doc.createTextNode(title))
		channel.appendChild(tmp)
		tmp = doc.createElement('link')
		tmp.appendChild(doc.createTextNode(webroot))
		channel.appendChild(tmp)
		tmp = doc.createElement('description')
		tmp.appendChild(doc.createTextNode(description))
		channel.appendChild(tmp)
		tmp = doc.createElement('language')
		tmp.appendChild(doc.createTextNode('en-uk'))
		channel.appendChild(tmp)

		# now append the last 24 hours news
		for seo in results:
			item = doc.createElement('item')
			channel.appendChild(item)
			tmp = doc.createElement('title')
			tmp.appendChild(doc.createTextNode(seo['title']))
			item.appendChild(tmp)
			tmp = doc.createElement('description')
			tmp.appendChild(doc.createTextNode(seo['summary']))
			item.appendChild(tmp)
			tmp = doc.createElement('link')
			link = webroot + "releases/%d.html" % seo['seoreleaseid']
			tmp.appendChild(doc.createTextNode(link))
			item.appendChild(tmp)
			tmp = doc.createElement('pubdate')
			tmp.appendChild(doc.createTextNode(str(seo['published_display'])))
			item.appendChild(tmp)

			try:
				html = SEORelease.get_for_display(seo["seoreleaseid"])['content']
				item.appendChild(tmp)
				tmp = doc.createElement('content:encoded')
				tmp.appendChild(doc.createTextNode(unicode(html)))
				item.appendChild(tmp)
			except:
				LOG.exception("get_rss_limited_feed %d", seo["seoreleaseid"])



		return doc.toxml("UTF-8")

class SEOImage(BaseSql):
	""" images for the seo release """

	@classmethod
	def link_to_thumbnail(cls, userid, url):
		""" Take the link see if it's a collateral if it is then create a thumbnail"""
		try:
			parsed = urlparse(url)
			collateralid = Collateral.path_to_id(parsed.path)
			if collateralid:
				data = StringIO(ECollateral.get(collateralid))
				cls.create_thumbnail(data, userid)
		except:
			LOG.exception("link_to_thumbnail")
			raise

	@classmethod
	def create_thumbnail(cls, data, userid, itype="JPEG", ext=".jpg"):
		"""Create thumb nail"""

		# convert too a thumbnail exsure that the height is a max of 100px
		# makre sure that the witdht is one more that?

		usersession = UserSession.query.get(userid)
		img = Image.open(data)
		baseheight = 100
		wpercent = (baseheight / float(img.size[1]))
		wsize = int((float(img.size[0]) * float(wpercent)))
		if wsize > 150:
			#Image too wide so we need to do the calculation in revese
			baseheight = int(baseheight * (150.00 / wsize))
			wsize = 150

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
			#(fpath,ext) = os.path.splitext(params['seoimage_file'].filename)
			#formats = ['PNG', 'GIF', 'BMP', 'PPM', 'JPEG']
			#ext_to_type = {"JPG":"JPEG"}
			#itype = ext.strip(".").upper()
			#if itype not in formats:

			cls.create_thumbnail(params['seoimage_file'].file, params["userid"])
		except:
			LOG.exception("upload_and_convert")
			raise

SEORelease.mapping = Table('seorelease', metadata, schema="seoreleases", autoload=True)
SEOReleaseInterests.mapping = Table('seoreleaseinterests', metadata, schema="seoreleases", autoload=True)
SEOCache.mapping = Table('seocache', metadata, schema="seoreleases", autoload=True)
SEOReleaseCategories.mapping = Table('seoreleasecategories', metadata, schema="seoreleases", autoload=True)
SEOImage.mapping = Table('seoimages', metadata, schema="seoreleases", autoload=True)

mapper(SEORelease, SEORelease.mapping)
mapper(SEOReleaseInterests, SEOReleaseInterests.mapping)
mapper(SEOCache, SEOCache.mapping)
mapper(SEOReleaseCategories, SEOReleaseCategories.mapping)
mapper(SEOImage, SEOImage.mapping)













