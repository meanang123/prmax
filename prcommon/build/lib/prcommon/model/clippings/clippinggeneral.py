# -*- coding: utf-8 -*-
"""ClippingsGeneral"""
#-----------------------------------------------------------------------------
# Name:        clippingsgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
import logging
from datetime import date, timedelta, datetime
from turbogears.database import session
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.outlet import Outlet
from prcommon.model.lookups import ClippingStatus, ClippingSource, ClippingsTone
from prcommon.model.common import BaseSql
from prcommon.model.client import Client
from prcommon.model.crm2.issues import Issue
from prcommon.model.clippings.clippingsissues import ClippingsIssues
from prcommon.model.clippings.clippingstype import ClippingsType
from prcommon.model.clippings.clippingselection import ClippingSelection
from prcommon.model.queues import ProcessQueue
from prcommon.model.customer.activity import Activity
import prcommon.Constants as Constants
from ttl.tg.validators import DateRangeResult
from ttl.ttldate import to_json_date
from ttl.ttlmaths import from_int

LOGGER = logging.getLogger("prcommon.model")

class ClippingsGeneral(object):
	""" ClippingsGeneral """

	List_Customer_Data = """SELECT
	c.clippingid,
	to_char(c.clip_source_date,'DD/MM/YY') as clip_source_date_display,
	c.clip_title,
	c.clip_link,
	c.clip_abstract,
	o.outletname,
	cs.clippingsstatusdescription,
	css.clippingsourcedescription,
	ct.clippingstypedescription,
	cto.clippingstonedescription,
	ct.icon_name,
	cl.clientname,
	i.name as issuename,
	CASE WHEN (csel.clippingid IS NULL) THEN false ELSE true END as selected

	FROM userdata.clippings AS c
	JOIN internal.clippingstatus AS cs ON cs.clippingsstatusid = c.clippingsstatusid
	JOIN internal.clippingsource AS css ON css.clippingsourceid = c.clippingsourceid
	JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid
	LEFT OUTER JOIN internal.clippingstone AS cto ON cto.clippingstoneid = c.clippingstoneid
	LEFT OUTER JOIN userdata.client AS cl ON cl.clientid = c.clientid
	LEFT OUTER JOIN userdata.clippingsissues AS ci ON ci.clippingid = c.clippingid
	LEFT OUTER JOIN userdata.issues AS i ON i.issueid = ci.issueid
	LEFT OUTER JOIN outlets AS o ON o.outletid = c.outletid
	LEFT OUTER JOIN userdata.clippingselection AS csel ON csel.clippingid = c.clippingid
	LEFT OUTER JOIN tg_user ON tg_user.user_id = csel.userid
	"""

	List_Customer_Data_Count = """SELECT COUNT(*) FROM userdata.clippings AS c
	JOIN internal.clippingstatus AS cs ON cs.clippingsstatusid = c.clippingsstatusid
	JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid
	LEFT OUTER JOIN outlets AS o ON o.outletid = c.outletid"""

	List_Customer_Data2 = """SELECT
	c.clippingid,
	CASE WHEN (csel.clippingid IS NULL) THEN false ELSE true END as selected
	FROM userdata.clippings AS c
	JOIN internal.clippingstatus AS cs ON cs.clippingsstatusid = c.clippingsstatusid
	JOIN internal.clippingsource AS css ON css.clippingsourceid = c.clippingsourceid
	JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid
	LEFT OUTER JOIN internal.clippingstone AS cto ON cto.clippingstoneid = c.clippingstoneid
	LEFT OUTER JOIN userdata.client AS cl ON cl.clientid = c.clientid
	LEFT OUTER JOIN userdata.clippingsissues AS ci ON ci.clippingid = c.clippingid
	LEFT OUTER JOIN userdata.issues AS i ON i.issueid = ci.issueid
	LEFT OUTER JOIN outlets AS o ON o.outletid = c.outletid
	LEFT OUTER JOIN userdata.clippingselection AS csel ON csel.clippingid = c.clippingid
	LEFT OUTER JOIN tg_user ON tg_user.user_id = csel.userid
	"""

	List_Customer_Data_Count2 = """SELECT COUNT(*) FROM userdata.clippings AS c
	JOIN internal.clippingstatus AS cs ON cs.clippingsstatusid = c.clippingsstatusid
	JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid
	LEFT OUTER JOIN outlets AS o ON o.outletid = c.outletid"""


	List_Emailtemplate_Data = """SELECT
	c.clippingid,
	to_char(c.clip_source_date,'DD/MM/YY') as clip_source_date_display,
	c.clip_title,
	o.outletname,
	cl.clientname,
	i.name as issuename

	FROM userdata.clippings AS c
	LEFT OUTER JOIN userdata.client AS cl ON cl.clientid = c.clientid
	LEFT OUTER JOIN userdata.clippingsissues AS ci ON ci.clippingid = c.clippingid
	LEFT OUTER JOIN userdata.issues AS i ON i.issueid = ci.issueid
	LEFT OUTER JOIN outlets AS o ON o.outletid = c.outletid
	"""

	List_Emailtemplate_Data_Count = """SELECT COUNT(*) FROM userdata.clippings AS c
	LEFT OUTER JOIN outlets AS o ON o.outletid = c.outletid"""


	List_Question_Data = """SELECT
	c.clippingid,
	to_char(c.clip_source_date,'DD/MM/YY') as clip_source_date_display,
	c.clip_title

	FROM userdata.clippings AS c
	LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.clippingid = c.clippingid
	"""

	List_Question_Data_Count = """SELECT COUNT(*) FROM userdata.clippings AS c
	LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.clippingid = c.clippingid"""

	@staticmethod
	def list_clippings(params):
		"""list of clippings for customer"""

		whereclause = ''

		if "selected" in params and params['selected'] == True:
			whereclause = BaseSql.addclause(whereclause, 'csel.userid = :userid AND csel.clippingid = c.clippingid')

		if "customerid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.customerid=:customerid')

		if "clientid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.clientid=:clientid')
			params['clientid'] = int(params['clientid'])

		if "outletid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.outletid=:outletid')
			params['outletid'] = int(params['outletid'])

		if params.get('sortfield', '') == 'clip_source_date_display':
			params['sortfield'] = 'c.clip_source_date'

		if params.get('unprocessed', False):
			whereclause = BaseSql.addclause(whereclause, 'c.clippingsstatusid=1')

		if 'issueid' in params:
			whereclause = BaseSql.addclause(whereclause, 'EXISTS (SELECT clippingsissueid FROM userdata.clippingsissues AS ci WHERE ci.issueid = :issueid AND ci.clippingid = c.clippingid)')
			params['issueid'] = int(params['issueid'])

		if "daterestriction" in params:
			whereclause = BaseSql.addclause(whereclause, "c.clip_source_date= :daterestriction")
			params["daterestriction"] = datetime.strptime(params["daterestriction"], "%Y-%m-%d").date()
		else:
			# date range
			if "drange" in params and params["drange"].option != DateRangeResult.NOSELECTION:
				drange = params["drange"]
				if drange.option == DateRangeResult.BEFORE:
					# BEfore
					params["from_date"] = drange.from_date
					whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date <= :from_date')
				elif drange.option == DateRangeResult.AFTER:
					# After
					params["from_date"] = drange.from_date
					whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date >= :from_date')
				elif drange.option == DateRangeResult.BETWEEN:
					# ABetween
					params["from_date"] = drange.from_date
					params["to_date"] = drange.to_date
					whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN :from_date AND :to_date')

		if 'default_time_frame' in params:
			params["today_date"] = date.today()
			params["start_of_period"] = date.today() - timedelta(days=30)
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN :start_of_period AND :today_date')

		if "textid" in params:
			whereclause = BaseSql.addclause(whereclause, '(c.clip_text ILIKE :textid OR c.clip_title ILIKE :textid)')
			params["textid"] = "%" + params["textid"] + "%"

		if "clippingstypedescription" in params:
			whereclause = BaseSql.addclause(whereclause, "ct.clippingstypedescription ilike :clippingstypedescription")

		if "clippingstypeid" in params:
			whereclause = BaseSql.addclause(whereclause, "c.clippingstypeid = :clippingstypeid")

		if "clippingstones" in params:
			clippingstonelist = ', '.join(params["clippingstones"])
			whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % clippingstonelist)

		if params.get("tones", None):
			whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % ",".join([str(tone) for tone in params["tones"]]))

		if params.get('sortfield', '') == '':
			params['sortfield'] = 'c.clip_source_date'
			params['direction'] = 'DESC'

		return BaseSql.get_rest_page_base(
		  params,
		  'clippingid',
		  'clip_source_date',
		  ClippingsGeneral.List_Customer_Data + whereclause + BaseSql.Standard_View_Order,
		  ClippingsGeneral.List_Customer_Data_Count + whereclause,
		  Clipping)
	
	@staticmethod
	def list_clippings2(params):
		"""list of clippings for customer"""

		whereclause = ''

		if "selected" in params and params['selected'] == True:
			whereclause = BaseSql.addclause(whereclause, 'csel.userid = :userid AND csel.clippingid = c.clippingid')

		if "customerid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.customerid=:customerid')

		if "clientid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.clientid=:clientid')
			params['clientid'] = int(params['clientid'])

		if "outletid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.outletid=:outletid')
			params['outletid'] = int(params['outletid'])

		if params.get('sortfield', '') == 'clip_source_date_display':
			params['sortfield'] = 'c.clip_source_date'

		if params.get('unprocessed', False):
			whereclause = BaseSql.addclause(whereclause, 'c.clippingsstatusid=1')

		if 'issueid' in params:
			whereclause = BaseSql.addclause(whereclause, 'EXISTS (SELECT clippingsissueid FROM userdata.clippingsissues AS ci WHERE ci.issueid = :issueid AND ci.clippingid = c.clippingid)')
			params['issueid'] = int(params['issueid'])

		if "daterestriction" in params:
			whereclause = BaseSql.addclause(whereclause, "c.clip_source_date= :daterestriction")
			params["daterestriction"] = datetime.strptime(params["daterestriction"], "%Y-%m-%d").date()
		else:
			# date range
			if "drange" in params and params["drange"].option != DateRangeResult.NOSELECTION:
				drange = params["drange"]
				if drange.option == DateRangeResult.BEFORE:
					# BEfore
					params["from_date"] = drange.from_date
					whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date <= :from_date')
				elif drange.option == DateRangeResult.AFTER:
					# After
					params["from_date"] = drange.from_date
					whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date >= :from_date')
				elif drange.option == DateRangeResult.BETWEEN:
					# ABetween
					params["from_date"] = drange.from_date
					params["to_date"] = drange.to_date
					whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN :from_date AND :to_date')

		if 'default_time_frame' in params:
			params["today_date"] = date.today()
			params["start_of_period"] = date.today() - timedelta(days=30)
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN :start_of_period AND :today_date')

		if "textid" in params:
			whereclause = BaseSql.addclause(whereclause, '(c.clip_text ILIKE :textid OR c.clip_title ILIKE :textid)')
			params["textid"] = "%" + params["textid"] + "%"

		if "clippingstypedescription" in params:
			whereclause = BaseSql.addclause(whereclause, "ct.clippingstypedescription ilike :clippingstypedescription")

		if "clippingstypeid" in params:
			whereclause = BaseSql.addclause(whereclause, "c.clippingstypeid = :clippingstypeid")

		if "clippingstones" in params:
			clippingstonelist = ', '.join(params["clippingstones"])
			whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % clippingstonelist)

		if params.get("tones", None):
			whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % ",".join([str(tone) for tone in params["tones"]]))

		order = 'limit null offset 0'
		return BaseSql.get_grid_page(
		    params,
		    'clippingid',
		    'clip_source_date',
		    ClippingsGeneral.List_Customer_Data2 + whereclause + BaseSql.Standard_View_Order2,
		    ClippingsGeneral.List_Customer_Data_Count2 + whereclause,
		    Clipping)		    

	@staticmethod
	def list_clippings_emailtemplate(params):
		"""list of clippings linked with a press release"""

		whereclause = ''
		
		if "emailtemplateid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.emailtemplateid=:emailtemplateid')
		if "customerid" in params:
			whereclause = BaseSql.addclause(whereclause, 'c.customerid=:customerid')

		return BaseSql.getGridPage(
		  params,
		  'clip_source_date',
		  'clippingid',
		  ClippingsGeneral.List_Emailtemplate_Data + whereclause + BaseSql.Standard_View_Order,
		  ClippingsGeneral.List_Emailtemplate_Data_Count + whereclause,
		  Clipping)

	@staticmethod
	def list_clippings_question(params):
		"""list of clippings linked with a global analysis question"""

		whereclause = ''
		
		if "questionid" in params:
			whereclause = BaseSql.addclause(whereclause, 'ca.questionid=:questionid')
		if "customerid" in params:
			whereclause = BaseSql.addclause(whereclause, 'ca.customerid=:customerid')

		return BaseSql.getGridPage(
		  params,
		  'clip_source_date',
		  'clippingid',
		  ClippingsGeneral.List_Question_Data + whereclause + BaseSql.Standard_View_Order,
		  ClippingsGeneral.List_Question_Data_Count + whereclause,
		  Clipping)


	@staticmethod
	def get_for_edit(clippingid):
		"Get for edit "

		clip = Clipping.query.get(clippingid)

		r_data = dict(
		  clippingid=clip.clippingid,
		  clientid=clip.clientid,
		  clippingsourceid=clip.clippingsourceid,
		  clippingstoneid=clip.clippingstoneid,
		  outletid=clip.outletid,
		  outletname="",
		  issueid=None,
		  emailtemplateid=clip.emailtemplateid,
		statementid=clip.statementid)

		issue = session.query(ClippingsIssues).filter(ClippingsIssues.clippingid == clip.clippingid).scalar()
		if issue:
			r_data['issueid'] = issue.issueid

		if clip.outletid:
			r_data["outletname"] = session.query(Outlet.outletname).filter(Outlet.outletid == clip.outletid).scalar()

		return r_data

	@staticmethod
	def update_clipping(params):
		"Update Clipping"

		transaction = BaseSql.sa_get_active_transaction()

		try:
			clipping = Clipping.query.get(params["clippingid"])
			clipping.clientid = params["clientid"]
			clipping.clippingstoneid = params["clippingstoneid"]
			clipping.outletid = params["outletid"]
			clipping.statementid = params["statementid"]
			clipping.emailtemplateid = params["emailtemplateid"]

			issue = session.query(ClippingsIssues).filter(ClippingsIssues.clippingid == clipping.clippingid).all()
			# add
			if not issue and params["issueid"]:
				session.add(ClippingsIssues(clippingid=params["clippingid"], issueid=params["issueid"]))
			#delete
			elif issue and not params["issueid"]:
				session.delete(issue[0])
			#update
			elif issue and issue[0].issueid != params["issueid"]:
				issue[0].issueid = params["issueid"]

			if not params["issueid"] and not params["clientid"]:
				clipping.clippingsstatusid = Constants.Clipping_Status_Unallocated

			if params["issueid"] or params["clientid"] and clipping.clippingsstatusid == Constants.Clipping_Status_Unallocated:
				clipping.clippingsstatusid = Constants.Clipping_Status_Unprocessed

			session.add(ProcessQueue(
					processid=Constants.Process_Clipping_View,
			    objectid=clipping.clippingid))

			transaction.commit()
		except:
			LOGGER.exception("update_clipping")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def delete_clipping(params):
		"Delete Clipping"

		transaction = BaseSql.sa_get_active_transaction()

		try:
			clipping = Clipping.query.get(params["clippingid"])
			if clipping:
				activity = Activity(
					customerid=params['customerid'],
					userid=params['user_id'],
					objectid=clipping.clippingid,
					objecttypeid=2, #clipping
					actiontypeid=3, #delete
					description=clipping.clip_title
				)
				session.add(activity)
				session.flush()

				session.delete(clipping)

			transaction.commit()
		except:
			LOGGER.exception("delete_clipping")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def get_for_display(clippingid):
		"get for display "

		clipping = Clipping.query.get(clippingid)
		if clipping.outletid:
			outletname = session.query(Outlet.outletname).filter(Outlet.outletid == clipping.outletid).scalar()
		else:
			outletname = ""
		clippingstatus = ClippingStatus.query.get(clipping.clippingsstatusid)
		if clipping.clientid:
			clientname = session.query(Client.clientname).filter(Client.clientid == clipping.clientid).scalar()
		else:
			clientname = ""

		if clipping.clippingsourceid:
			clippingsource = ClippingSource.query.get(clipping.clippingsourceid)
			clippingsourcedescription = clippingsource.clippingsourcedescription
		else:
			clippingsourcedescription = ""

		if clipping.clippingstoneid:
			clippingstone = ClippingsTone.query.get(clipping.clippingstoneid)
			clippingstonedescription = clippingstone.clippingstonedescription
		else:
			clippingstonedescription = ""

		clippingstype = ClippingsType.query.get(clipping.clippingstypeid)

		clipissue = session.query(ClippingsIssues).filter(ClippingsIssues.clippingid == clipping.clippingid).scalar()
		issuename = ""
		if clipissue:
			issuename = session.query(Issue.name).filter(Issue.issueid == clipissue.issueid).scalar()

		return dict(
		  clippingid=clipping.clippingid,
		  clip_source_date_display=clipping.clip_source_date.strftime("%d/%m/%y"),
		  outletname=outletname,
		  clippingsstatusdescription=clippingstatus.clippingsstatusdescription,
		  clientname=clientname,
		  clip_title=clipping.clip_title,
		  clippingsourcedescription=clippingsourcedescription,
		  clippingstypedescription=clippingstype.clippingstypedescription,
		  clippingstonedescription=clippingstonedescription,
		  icon_name=clippingstype.icon_name,
		  statementid=clipping.statementid,
		  emailtemplateid=clipping.emailtemplateid,
		  issuename=issuename,
		  clip_circulation=clipping.clip_circulation
		)

	@staticmethod
	def add_user_selection(params):
		"""add clipping to user clipping selection"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			userclip = ClippingSelection(
				userid=params["userid"],
				clippingid=params["clippingid"])
			session.add(userclip)
			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("clipping_user_selection_add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def delete_user_selection(params):
		"""delete clipping from user clipping selection"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			userclip = session.query(ClippingSelection).filter(ClippingSelection.userid == params['userid']).filter(ClippingSelection.clippingid == params['clippingid']).scalar()
			if userclip:
				session.delete(userclip)
		except:
			LOGGER.exception("clipping_user_selection_delete")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def clear_user_selection(params, in_trans=False):
		"""add clipping to user clipping selection"""

		if not in_trans:
			transaction = BaseSql.sa_get_active_transaction()
		else:
			transaction = None
		try:
			userclips = session.query(ClippingSelection).filter(ClippingSelection.userid == params['userid']).all()
			if len(userclips) > 0:
				for userclip in userclips:
					session.delete(userclip)
			if transaction:
				transaction.commit()
		except:
			LOGGER.exception("clipping_user_selection_clear")
			if transaction:
				try:
					transaction.rollback()
				except:
					pass
			raise

	@staticmethod
	def add_user_selection_all(params, in_trans=False):
		"""add all selected clipping to user clipping selection"""

		if not in_trans:
			transaction = BaseSql.sa_get_active_transaction()
		else:
			transaction = None
		try:
			for clip in params['clips']:
				userclip = ClippingSelection(
				    userid=params["userid"],
				    clippingid=clip)
				session.add(userclip)
				session.flush()
			if transaction:
				transaction.commit()
		except:
			LOGGER.exception("clipping_user_selection_add_all")
			if transaction:
				try:
					transaction.rollback()
				except:
					pass
				raise


	@staticmethod
	def select_deselect_all_user_selection(params):
		
		listclippings = ClippingsGeneral.list_clippings2(params)
		checked = 0
		checked = sum(d['selected'] for d in listclippings['items'])
		if checked > 0:
			ClippingsGeneral.clear_user_selection(params)
		else:
			clips = [clip['clippingid'] for clip in listclippings['items']]
			params['clips'] = clips
			ClippingsGeneral.add_user_selection_all(params)

	@staticmethod
	def private_clipping_add(params):
		"""Add Private Clipping"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			clipping = Clipping(
				customerid=params["customerid"],
				clippingsstatusid=Constants.Clipping_Status_Processed,
				outletid=params["outletid"],
				clientid=params["clientid"],
				clip_source_date=params["clip_source_date"],
				clip_abstract=params["clip_abstract"],
				clip_source_page=params["clip_source_page"],
				clip_article_size=params["clip_article_size"],
				clip_words=params["clip_words"],
				clip_circulation=params["clip_circulation"],
				clip_readership=params["clip_readership"],
				clip_disrate=params["clip_disrate"],
				clip_text=params["clip_text"],
			    clip_title=params["clip_title"],
			    clip_link=params.get("clip_link", None),
			    clippingstypeid=params["clippingstypeid"],
			    clippingstoneid=params["clippingstoneid"],
			    statementid=params["statementid"],
			    emailtemplateid=params["emailtemplateid"],
				clippingsourceid=Constants.Clipping_Source_Private)
			session.add(clipping)
			session.flush()
			if params["issueid"]:
				session.add(ClippingsIssues(clippingid=clipping.clippingid,
				                            issueid=params["issueid"]))

			session.add(ProcessQueue(
				processid=Constants.Process_Clipping_View,
				objectid=clipping.clippingid))

			session.flush()
			transaction.commit()
			return clipping.clippingid
		except:
			LOGGER.exception("private_clipping_add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def private_clipping_update(params):
		"""Update Private Clipping"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			clipping = Clipping.query.get(params["clippingid"])
			clipping.outletid = params["outletid"]
			clipping.clientid = params["clientid"]
			clipping.clip_source_date = params["clip_source_date"]
			clipping.clip_abstract = params["clip_abstract"]
			clipping.clip_source_page = params["clip_source_page"]
			clipping.clip_article_size = params["clip_article_size"]
			clipping.clip_words = params["clip_words"]
			clipping.clip_circulation = params["clip_circulation"]
			clipping.clip_readership = params["clip_readership"]
			clipping.clip_disrate = params["clip_disrate"]
			clipping.clip_text = params["clip_text"]
			clipping.clip_title = params["clip_title"]
			clipping.statementid = params["statementid"]
			clipping.emailtemplateid = params["emailtemplateid"]
			clipping.clip_link = params["clip_link"]
			clipping.clippingstypeid = params["clippingstypeid"]
			clipping.clippingstoneid = params["clippingstoneid"]

			issue = session.query(ClippingsIssues).filter(ClippingsIssues.clippingid == clipping.clippingid).all()
			# add
			if not issue and params["issueid"]:
				session.add(ClippingsIssues(clippingid=params["clippingid"], issueid=params["issueid"]))
			#delete
			elif issue and not params["issueid"]:
				session.delete(issue[0])
			#update
			elif issue and issue[0].issueid != params["issueid"]:
				issue[0].issueid = params["issueid"]

			session.add(ProcessQueue(
		    processid=Constants.Process_Clipping_View,
		    objectid=clipping.clippingid))

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("private_clipping_update")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@staticmethod
	def private_clipping_get_for_edit(clippingid):
		"""get for private edit """
		clipping = Clipping.query.get(clippingid)

		issues = session.query(ClippingsIssues).filter(ClippingsIssues.clippingid == clippingid).all()
		if issues:
			issueid = issues[0].issueid
		else:
			issueid = None

		if clipping.outletid:
			outletname = session.query(Outlet.outletname).filter(Outlet.outletid == clipping.outletid).scalar()
		else:
			outletname = ""

		return dict(
		  clippingid=clipping.clippingid,
			outletid=clipping.outletid,
		    outletname=outletname,
			clientid=clipping.clientid,
			clip_source_date=to_json_date(clipping.clip_source_date),
			clip_abstract=clipping.clip_abstract,
			clip_source_page=clipping.clip_source_page,
			clip_article_size=clipping.clip_article_size,
			clip_words=clipping.clip_words,
			clip_circulation=clipping.clip_circulation,
			clip_readership=clipping.clip_readership,
			clip_disrate=from_int(clipping.clip_disrate),
			clip_text=clipping.clip_text,
		    clip_title=clipping.clip_title,
		    issueid=issueid,
		    clippingstypeid=clipping.clippingstypeid,
		    clippingstoneid=clipping.clippingstoneid,
		    clip_link=clipping.clip_link,
		    statementid=clipping.statementid,
		    emailtemplateid=clipping.emailtemplateid)
