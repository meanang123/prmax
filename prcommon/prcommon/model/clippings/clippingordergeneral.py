# -*- coding: utf-8 -*-
"""ClippingsImport"""
#-----------------------------------------------------------------------------
# Name:        clippingsimport.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
from turbogears.database import session
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.clippings.clippingsorder import ClippingsOrder
from prcommon.model.clippings.clippingsprices import ClippingsPrices
from prcommon.model.clippings.clippingsordercountry import ClippingsOrderCountry
from prcommon.model.clippings.clippingsorderlanguage import ClippingsOrderLanguage
from prcommon.model.clippings.clippingsordertype import ClippingsOrderType
from prcommon.model.clippings.clippingstype import ClippingsType
from prcommon.model.identity import Customer
from prcommon.model.lookups import ClippingPriceServiceLevel, Countries
from prcommon.model.language import Languages
from prcommon.model.internal import AuditTrail
from prcommon.model.common import BaseSql
from ttl.ttlemail import send_paperround_message, EmailMessage
import prcommon.Constants as Constants
from prcommon.sales.salesorderconformation import SendClippingOrderConfirmationBuilder

import logging
LOGGER = logging.getLogger("prcommon")

class ClippingsOrderGeneral(object):
	""" ClippingsOrderGeneral """

	List_Customer_Data = """SELECT
	co.clippingsorderid,
	co.description,
	cpl.clippingpriceserviceleveldescription,
	co.keywords,
	cp.nbrclips,
	co.supplierreference,
	cs.clippingsourcedescription,
	co.clippingorderstatusid,
	cos.clippingorderstatusdescription

	FROM internal.clippingsorder AS co
	JOIN internal.clippingsprices AS cp ON cp.clippingspriceid = co.clippingspriceid
	JOIN internal.clippingpriceservicelevel AS cpl ON cpl.clippingpriceservicelevelid = cp.clippingpriceservicelevelid
	JOIN internal.clippingsource AS cs ON cs.clippingsourceid = co.clippingsourceid
	JOIN internal.clippingorderstatus AS cos ON cos.clippingorderstatusid = co.clippingorderstatusid	"""

	List_Customer_Data_Count = """SELECT COUNT(*) FROM internal.clippingsorder AS co"""

	@staticmethod
	def list_orders(params):
		"""list of orders for customer"""

		if "icustomerid" in params:
			whereclause = BaseSql.addclause('', 'co.customerid=:icustomerid')
			params['icustomerid'] = int(params['icustomerid'])

			return BaseSql.get_rest_page_base(
			  params,
			  'clippingsorderid',
			  'description',
			  ClippingsOrderGeneral.List_Customer_Data + whereclause + BaseSql.Standard_View_Order,
			  ClippingsOrderGeneral.List_Customer_Data_Count + whereclause,
			  Clipping)
		else:
			return dict(numRows=0, items=[], identifier='clippingsorderid')

	@staticmethod
	def send_order_conformation(clippingsorderid, email):

		sendorder = SendClippingOrderConfirmationBuilder()
		sendorder.run(clippingsorderid, email)

	@staticmethod
	def add(params):
		"""and and send an order """

		params['email'] = 'chris.g.hoy@gmail.com'

		try:
			transaction = BaseSql.sa_get_active_transaction()

			clippingsorder = ClippingsOrder(
			  customerid=params['icustomerid'],
			  startdate=params['startdate'],
			  enddate=params['enddate'],
			  keywords=params['keywords'],
			  rss_feed=params['rss_feed'],
			  clippingspriceid=params['clippingspriceid'],
			  defaultclientid=params['clientid'],
			  defaultissueid=params['issueid'],
			  description=params['description'],
			  pricecodeid=params['pricecodeid'],
			  clippingsourceid=params['clippingsourceid'],
			  purchaseorder=params['purchaseorder'])
			session.add(clippingsorder)
			session.flush()

			if params['countries']:
				clippingsordercountries = params['countries']['data']
				for clippingsordercountry in clippingsordercountries:
					clipcountry = ClippingsOrderCountry(
						clippingsorderid=clippingsorder.clippingsorderid,
						countryid=clippingsordercountry)
					session.add(clipcountry)
					session.flush()

			if params['languages']:
				clippingsorderlanguages = params['languages']['data']
				for clippingsorderlanguage in clippingsorderlanguages:
					cliplanguage = ClippingsOrderLanguage(
				        clippingsorderid=clippingsorder.clippingsorderid,
				        languageid=clippingsorderlanguage)
					session.add(cliplanguage)
					session.flush()

			#if clipping order is from IPCB the type should always be Print
			if params['clippingsourceid'] == 1 or params['clippingsourceid'] == 7:
				clippingsordertypes = [1]
			else:
				clippingsordertypes = params['clippingstypes']['data']
			for clippingsordertype in clippingsordertypes:
				cliptype = ClippingsOrderType(
			        clippingsorderid=clippingsorder.clippingsorderid,
			        clippingstypeid=clippingsordertype)
				session.add(cliptype)
				session.flush()

			# log entry in financial audit
			session.add(AuditTrail(
			  audittypeid=Constants.audit_trail_clipping_order_new,
				audittext="New Order:" + clippingsorder.get_description(),
				userid=params["userid"],
				customerid=params["icustomerid"]))

			ocsend = SendClippingOrderConfirmationBuilder()
			ocsend.run(clippingsorder.clippingsorderid, params['email'])

			transaction.commit()

			# send order email
			customer = Customer.query.get(params['icustomerid'])
			clippingsprice = ClippingsPrices.query.get(params['clippingspriceid'])
			cpl = ClippingPriceServiceLevel.query.get(clippingsprice.clippingpriceservicelevelid)

			params2 = dict(params)
			params2['clippingsorderid'] = clippingsorder.clippingsorderid
			params2['customername'] = customer.customername
			params2['clippingpriceserviceleveldescription'] = cpl.clippingpriceserviceleveldescription
			params2['nbrclips'] = clippingsprice.nbrclips
			params2['startdate_display'] = params['startdate'].strftime("%d/%m/%y")
			params2['enddate_display'] = params['enddate'].strftime("%d/%m/%y")
			params2['message'] = "<br/>".join(params['message'].split('\n'))

			message = EmailMessage(
			  Constants.SupportEmail,
			  Constants.CLIPPINGSORDEREMAIL,
			  Constants.Clippings_Order_Header,
			  Constants.Clippings_Order_Body % params2,
			  'text/html')
			#message.cc = Constants.SupportEmail_Email
			message.BuildMessage()

			send_paperround_message(message, Constants.SupportEmail_Email, Constants.SupportEmail_Password)


			return clippingsorder.clippingsorderid

		except:
			LOGGER.exception("clippings_add_order")
			transaction.rollback()
			raise

	@staticmethod
	def get(clippingsorderid):
		""" get details of order """

		clippingsorder = ClippingsOrder.query.get(clippingsorderid)
		clippingsprice = ClippingsPrices.query.get(clippingsorder.clippingspriceid)
		cpl = ClippingPriceServiceLevel.query.get(clippingsprice.clippingpriceservicelevelid)

		coc = [ row for row in session.query(Countries).\
		        join(ClippingsOrderCountry, ClippingsOrderCountry.countryid == Countries.countryid).\
		    filter(ClippingsOrderCountry.clippingsorderid == clippingsorderid).all()]

		col = [ row for row in session.query(Languages).\
		        join(ClippingsOrderLanguage, ClippingsOrderLanguage.languageid == Languages.languageid).\
		    filter(ClippingsOrderLanguage.clippingsorderid == clippingsorderid).all()]

		cot = [ row for row in session.query(ClippingsType).\
		        join(ClippingsOrderType, ClippingsOrderType.clippingstypeid == ClippingsType.clippingstypeid).\
		    filter(ClippingsOrderType.clippingsorderid == clippingsorderid).all()]

		customer = Customer.query.get(clippingsorder.customerid)
		retvalue = clippingsorder.get_as_dict()
		retvalue['nbrclips'] = clippingsprice.nbrclips
		retvalue['clippingpriceserviceleveldescription'] = cpl.clippingpriceserviceleveldescription
		retvalue["email"] = customer.email
		retvalue['countries'] = coc
		retvalue['languages'] = col
		retvalue['clippingstypes'] = cot

		return retvalue


	@staticmethod
	def cancel(params):
		"Cancel Order"

		params['email'] = 'chris.g.hoy@gmail.com'

		try:

			transaction = BaseSql.sa_get_active_transaction()
			clippingsorder = ClippingsOrder.query.get(params['clippingsorderid'])
			changes = ""
			if clippingsorder.clippingorderstatusid != 2: #if it is active
				if clippingsorder.enddate != params['enddate']:
					changes += "End: %s to %s " % (clippingsorder.enddate.strftime("%d/%m/%y"), params['enddate'].strftime("%d/%m/%y"))
					clippingsorder.enddate = params['enddate']
				clippingsorder.clippingorderstatusid = 2
				changes += "Status: Active to Cancelled"
			
				# log entry in audit
				session.add(AuditTrail(
					audittypeid=Constants.audit_trail_clipping_order_cancel,
					audittext=changes,
					userid=params["userid"],
					customerid=clippingsorder.customerid))

			transaction.commit()

		except:
			LOGGER.exception("cancel_order")
			transaction.rollback()
			raise

	@staticmethod
	def reactivate(params):
		"Reactivate cancelled Order"

		params['email'] = 'chris.g.hoy@gmail.com'

		try:
			transaction = BaseSql.sa_get_active_transaction()
			clippingsorder = ClippingsOrder.query.get(params['clippingsorderid'])
			changes = ""
			if clippingsorder.clippingorderstatusid == 2:
				if clippingsorder.enddate != params['enddate']:
					changes += "End: %s to %s " % (clippingsorder.enddate.strftime("%d/%m/%y"), params['enddate'].strftime("%d/%m/%y"))
					clippingsorder.enddate = params['enddate']
				clippingsorder.clippingorderstatusid = 1
				changes += "Status: Cancelled to Active"
			
				# log entry in audit
				session.add(AuditTrail(
					audittypeid=Constants.audit_trail_clipping_order_reactivate,
					audittext=changes,
					userid=params["userid"],
					customerid=clippingsorder.customerid))

			transaction.commit()

		except:
			LOGGER.exception("reactivate_order")
			transaction.rollback()
			raise

	@staticmethod
	def update(params):
		"Update Order"

		params['email'] = 'chris.g.hoy@gmail.com'

		try:

			transaction = BaseSql.sa_get_active_transaction()
			clippingsorder = ClippingsOrder.query.get(params['clippingsorderid'])
			changes = ""
			if clippingsorder.startdate != params['startdate']:
				changes += "Start: %s to %s " % (clippingsorder.startdate.strftime("%d/%m/%y"), params['startdate'].strftime("%d/%m/%y"))
				clippingsorder.startdate = params['startdate']

			if clippingsorder.enddate != params['enddate']:
				changes += "End: %s to %s " % (clippingsorder.enddate.strftime("%d/%m/%y"), params['enddate'].strftime("%d/%m/%y"))
				clippingsorder.enddate = params['enddate']

			if clippingsorder.keywords != params['keywords']:
				changes += "Keywords: %s to %s " % (clippingsorder.keywords, params['keywords'])
				clippingsorder.keywords = params['keywords']

			if clippingsorder.rss_feed != params['rss_feed']:
				changes += "RSS Feed: %s to %s " % (clippingsorder.rss_feed, params['rss_feed'])
				clippingsorder.rss_feed = params['rss_feed']

			if clippingsorder.clippingspriceid != params['clippingspriceid']:
				cpold = ClippingsPrices.query.get(clippingsorder.clippingspriceid)
				cplold = ClippingPriceServiceLevel.query.get(cpold.clippingpriceservicelevelid)
				cpnew = ClippingsPrices.query.get(params['clippingspriceid'])
				cplnew = ClippingPriceServiceLevel.query.get(cpnew.clippingpriceservicelevelid)
				changes += "Prices: %d-%s to %d-%s " % (cpold.nbrclips, cplold.clippingpriceserviceleveldescription,
				                                        cpnew.nbrclips, cplnew.clippingpriceserviceleveldescription)
				clippingsorder.clippingspriceid = params['clippingspriceid']

			if clippingsorder.purchaseorder != params['purchaseorder']:
				changes += "PO: %s to %s " % (clippingsorder.purchaseorder, params['purchaseorder'])
				clippingsorder.purchaseorder = params['purchaseorder']

			if clippingsorder.supplierreference != params['supplierreference']:
				changes += "SR: %s to %s " % (clippingsorder.supplierreference, params['supplierreference'])
				clippingsorder.supplierreference = params['supplierreference']

			if clippingsorder.defaultclientid != params['clientid']:
				changes += "Default Clientid: %s to %s " % (clippingsorder.defaultclientid, params['clientid'])
				clippingsorder.defaultclientid = params['clientid']

			if clippingsorder.defaultissueid != params['issueid']:
				changes += "Default Issueid: %s to %s " % (clippingsorder.defaultissueid, params['issueid'])
				clippingsorder.defaultissueid = params['issueid']

			if clippingsorder.description != params['description']:
				changes += "Description: %s to %s " % (clippingsorder.description, params['description'])
				clippingsorder.description = params['description']

			clippingsorder.pricecodeid = params['pricecodeid']

			#check for deleted and added countries
			coc = [ row.countryid for row in session.query(ClippingsOrderCountry).\
				    filter(ClippingsOrderCountry.clippingsorderid == clippingsorder.clippingsorderid).all()]
			if coc:
				if params['countries']:
					changes += _add_delete_countries(coc, clippingsorder,params)
				else:
					changes += _delete_all_countries(coc, clippingsorder)
			else:
				if params['countries']:
					changes += _add_all_countries(coc, clippingsorder, params)

			#check for deleted and added languages
			col = [ row.languageid for row in session.query(ClippingsOrderLanguage).\
		            filter(ClippingsOrderLanguage.clippingsorderid == clippingsorder.clippingsorderid).all()]
			if col:
				if params['languages']:
					changes += _add_delete_languages(col, clippingsorder, params)
				else:
					changes += _delete_all_languages(col, clippingsorder)
			else:
				if params['languages']:
					changes += _add_all_languages(col, clippingsorder, params)

			#check for deleted and added clippings types - clippinstype is required
			cot = [ row.clippingstypeid for row in session.query(ClippingsOrderType).\
				    filter(ClippingsOrderType.clippingsorderid == clippingsorder.clippingsorderid).all()]
			if cot:
				changes += _add_delete_clippingstype(cot, clippingsorder, params)

			# log entry in financial audit
			session.add(AuditTrail(
				audittypeid=Constants.audit_trail_clipping_order_change,
				audittext=changes,
				userid=params["userid"],
				customerid=clippingsorder.customerid))

			if "send_order_conf" in params:
				ocsend = SendClippingOrderConfirmationBuilder()
				ocsend.run(clippingsorder.clippingsorderid, params['email'])

			transaction.commit()

			if params["resendsupemail"]:
				# send order email
				customer = Customer.query.get(clippingsorder.customerid)
				clippingsprice = ClippingsPrices.query.get(clippingsorder.clippingspriceid)
				cpl = ClippingPriceServiceLevel.query.get(clippingsprice.clippingpriceservicelevelid)

				params2 = dict(params)
				params2['customername'] = customer.customername
				params2['clippingpriceserviceleveldescription'] = cpl.clippingpriceserviceleveldescription
				params2['nbrclips'] = clippingsprice.nbrclips
				params2['startdate_display'] = params['startdate'].strftime("%d/%m/%y")
				params2['enddate_display'] = params['enddate'].strftime("%d/%m/%y")
				params2['message'] = "<br/>".join(params['message'].split('\n'))

				message = EmailMessage(
				  Constants.SupportEmail,
				  Constants.CLIPPINGSORDEREMAIL,
				  Constants.Clippings_Order_Header_Update,
				  Constants.Clippings_Order_Body_Change % params2,
				  'text/html')
				#message.cc = Constants.SupportEmail_Email
				message.BuildMessage()

				send_paperround_message(message, Constants.SupportEmail_Email, Constants.SupportEmail_Password)

		except:
			LOGGER.exception("update_order")
			transaction.rollback()
			raise

def _delete_all_countries(coc, clippingsorder):
	deleted = ''
	changes = ''
	for coc_id in coc:
		clipcountry = session.query(ClippingsOrderCountry).filter(
	        ClippingsOrderCountry.clippingsorderid==clippingsorder.clippingsorderid,
	        ClippingsOrderCountry.countryid==coc_id).scalar()
		session.delete(clipcountry)
		session.flush()
		deleted += "%s," % (coc_id)
	deleted = deleted[:-1] if deleted.endswith(',') else deleted
	if deleted != '' :
		changes += "Countries:deleted[%s] " % (deleted)
	return changes
def _add_all_countries(coc, clippingsorder, params):
	added = ''
	changes = ''
	for added_coc_id in params['countries']['data']:
		if added_coc_id not in coc:
			clipcountry = ClippingsOrderCountry(
		        clippingsorderid=clippingsorder.clippingsorderid,
		        countryid=added_coc_id)
			session.add(clipcountry)
			session.flush()
			added += "%s," % (added_coc_id)
	added = added[:-1] if added.endswith(',') else added
	if added != '' :
		changes += "Countries:added[%s] " % (added)
	return changes
def _add_delete_countries(coc, clippingsorder, params):
	added = ''
	deleted = ''
	changes = ''
	for coc_id in coc:
		if coc_id not in params['countries']['data']:
			clipcountry = session.query(ClippingsOrderCountry).filter(
		        ClippingsOrderCountry.clippingsorderid==clippingsorder.clippingsorderid,
		        ClippingsOrderCountry.countryid==coc_id).scalar()
			session.delete(clipcountry)
			session.flush()
			deleted += "%s," % (coc_id)
	deleted = deleted[:-1] if deleted.endswith(',') else deleted
	if deleted != ''  :
		changes += "Countries:deleted[%s] " % (deleted)
	for added_coc_id in params['countries']['data']:
		if added_coc_id not in coc:
			clipcountry = ClippingsOrderCountry(
		        clippingsorderid=clippingsorder.clippingsorderid,
		        countryid=added_coc_id)
			session.add(clipcountry)
			session.flush()
			added += "%s," % (added_coc_id)
	added = added[:-1] if added.endswith(',') else added
	if added != '' :
		changes += "Countries:added[%s] " % (added)
	return changes

def _delete_all_languages(col, clippingsorder):
	deleted = ''
	changes = ''
	for col_id in col:
		cliplanguage = session.query(ClippingsOrderLanguage).filter(
	        ClippingsOrderLanguage.clippingsorderid==clippingsorder.clippingsorderid,
	        ClippingsOrderLanguage.languageid==col_id).scalar()
		session.delete(cliplanguage)
		session.flush()
		deleted += "%s," % (col_id)
	deleted = deleted[:-1] if deleted.endswith(',') else deleted
	if deleted != '' :
		changes += "Languages:deleted[%s] " % (deleted)
	return changes
def _add_all_languages(col, clippingsorder, params):
	added = ''
	changes = ''
	for added_col_id in params['languages']['data']:
		if added_col_id not in col:
			cliplanguage = ClippingsOrderLanguage(
		        clippingsorderid=clippingsorder.clippingsorderid,
		        languageid=added_col_id)
			session.add(cliplanguage)
			session.flush()
			added += "%s," % (added_col_id)
	added = added[:-1] if added.endswith(',') else added
	if added != '' :
		changes += "Languages:added[%s] " % (added)
	return changes
def _add_delete_languages(col, clippingsorder, params):
	added = ''
	deleted = ''
	changes = ''
	for col_id in col:
		if col_id not in params['languages']['data']:
			cliplanguage = session.query(ClippingsOrderLanguage).filter(
		        ClippingsOrderLanguage.clippingsorderid==clippingsorder.clippingsorderid,
		        ClippingsOrderLanguage.languageid==col_id).scalar()
			session.delete(cliplanguage)
			session.flush()
			deleted += "%s," % (col_id)
	deleted = deleted[:-1] if deleted.endswith(',') else deleted
	if deleted != ''  :
		changes += "Languages:deleted[%s] " % (deleted)
	for added_col_id in params['languages']['data']:
		if added_col_id not in col:
			cliplanguage = ClippingsOrderLanguage(
		        clippingsorderid=clippingsorder.clippingsorderid,
		        languageid=added_col_id)
			session.add(cliplanguage)
			session.flush()
			added += "%s," % (added_col_id)
	added = added[:-1] if added.endswith(',') else added
	if added != '' :
		changes += "Languages:added[%s] " % (added)
	return changes
def _add_delete_clippingstype(cot, clippingsorder, params):
	added = ''
	deleted = ''
	changes = ''
	for cot_id in cot:
		if cot_id not in params['clippingstypes']['data']:
			cliptype = session.query(ClippingsOrderType).filter(
		        ClippingsOrderType.clippingsorderid==clippingsorder.clippingsorderid,
		        ClippingsOrderType.clippingstypeid==cot_id).scalar()
			session.delete(cliptype)
			session.flush()
			deleted += "%s," % (cot_id)
	deleted = deleted[:-1] if deleted.endswith(',') else deleted
	if deleted != ''  :
		changes += "Clippings Types:deleted[%s] " % (deleted)
	for added_cot_id in params['clippingstypes']['data']:
		if added_cot_id not in cot:
			cliptype = ClippingsOrderType(
		        clippingsorderid=clippingsorder.clippingsorderid,
		        clippingstypeid=added_cot_id)
			session.add(cliptype)
			session.flush()
			added += "%s," % (added_cot_id)
	added = added[:-1] if added.endswith(',') else added
	if added != '' :
		changes += "Clippings Types:added[%s] " % (added)
	return changes
