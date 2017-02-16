# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        internal.py
# Purpose:		object that are affectivaly internal to the system
#
# Author:      Chris Hoy
#
# Created:     10-12-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import datetime
import simplejson

from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from sqlalchemy.sql import text

from prcommon.model.common import BaseSql
from ttl.labels import LabelInfo
from ttl.postgres import DBCompress
from ttl.tg.validators import DateRangeResult

import logging
log = logging.getLogger("prcommon.model")

class AuditTrail(BaseSql):
	""" Event object for trail of action of customer rectord"""
	Audit_Trail_Data_Grid = """SELECT TO_CHAR(a.auditdate, 'DD-MM-YY HH24:MI') AS auditdate , a.audittypeid, a.audittext,
	CASE WHEN document IS NULL THEN false ELSE true END AS documentpresent,
	a.audittrailid,
	u.user_name
	FROM accounts.audittrail AS a
	LEFT OUTER JOIN tg_user AS u ON u.user_id = a.userid
	WHERE a.customerid = :icustomerid ORDER BY %s %s  LIMIT :limit OFFSET :offset"""

	Audit_Trail_Data_Count = """SELECT COUNT(*) FROM accounts.audittrail AS a WHERE a.customerid = :icustomerid """

	Financial_View = """SELECT TO_CHAR(auditdate,'DD-MM-YY') AS auditdate,au.audittypeid,
	COALESCE(at.adjustmenttypedescriptions,au.audittext) AS audittext,
	CASE WHEN document IS NULL THEN false ELSE true END AS documentpresent,
	CASE WHEN au.audittypeid NOT IN (4,9,15,16) OR (adj.adjustmentid IS NOT NULL AND adj.amount >0) THEN NULL
	ELSE
		CASE WHEN pay.paymenttypeid = 5 THEN round((pay.payment)/100.00,2) ELSE
	  	CASE WHEN pay.customerpaymentid IS NOT NULL THEN round(pay.payment/100.00,2) ELSE
	      round(ABS(adj.amount/100.00),2)
	      END
	    END
	END AS paid,

	CASE WHEN ( ci.invoiceamount IS NULL AND adj.adjustmentid IS NULL ) OR ( adj.adjustmentid IS NOT NULL AND adj.amount < 0) THEN NULL
	  ELSE
			CASE WHEN ci.invoiceamount IS NOT NULL THEN round(ci.invoiceamount/100.00,2)
	    ELSE round(adj.amount/100.00,2)
	  END
	END AS charge,
	au.audittrailid,
	COALESCE(adj.adjustmentid,pay.creditnotenbr, ci.invoicenbr) AS invoicenbr,
	to_char(payment_month, 'Mon/yy') AS payment_month_display,
	CASE WHEN ci.invoiceamount IS NOT NULL THEN round(ci.unpaidamount/100.00,2)
		WHEN pay.customerpaymentid IS NOT NULL THEN round(pay.unallocated/100.00,2)
	  WHEN adj.adjustmentid IS NOT NULL THEN round(adj.unallocated/100.00,2)
	  ELSE NULL END AS unallocated,
		  to_char(COALESCE(ci.invoicedate,pay.actualdate,COALESCE(adj.adjustmentdate,adj.applieddate)), 'DD/MM/YY') AS invoice_date,
	    COALESCE (ci.unpaidamount,pay.unallocated,adj.unallocated) as unallocated_value,
	    CASE WHEN pay.customerpaymentid IS NOT NULL THEN 'P' ||pay.customerpaymentid
	  	WHEN au.adjustmentid IS NOT NULL THEN 'A' ||au.adjustmentid
	WHEN ci.customerinvoiceid IS NOT NULL THEN 'I' || ci.customerinvoiceid END as keyid,
	COALESCE(adj.reason,pay.reason) AS reason

	FROM accounts.audittrail AS au
	LEFT OUTER JOIN accounts.customerpayments AS pay ON au.customerpaymentid = pay.customerpaymentid
	LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.audittrailid = au.audittrailid
	LEFT OUTER JOIN accounts.adjustments AS adj ON adj.adjustmentid = au.adjustmentid
	LEFT OUTER JOIN internal.adjustmenttypes AS at ON at.adjustmenttypeid = adj.adjustmenttypeid
	WHERE au.customerid = :icustomerid """

	Financial_View_Order = """ ORDER BY %s %s NULLS LAST LIMIT :limit OFFSET :offset"""
	Financial_View_Count = """SELECT COUNT(*) FROM accounts.audittrail as au
	LEFT OUTER JOIN accounts.customerpayments AS pay ON au.customerpaymentid = pay.customerpaymentid
	LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.audittrailid = au.audittrailid
	LEFT OUTER JOIN accounts.adjustments AS adj ON adj.adjustmentid = au.adjustmentid
	WHERE au.customerid = :icustomerid"""

	Customer_Financial_View_Grid = """SELECT au.audittrailid,
	to_char(ci.invoicedate, 'DD/MM/YY') AS invoice_date,
	au.audittext,
	round(ci.invoiceamount/100.00,2) as invoiceamount,
	ci.invoicenbr

	FROM accounts.audittrail AS au
	LEFT JOIN accounts.customerinvoices AS ci ON ci.audittrailid = au.audittrailid
	WHERE au.customerid = :customerid AND au.audittypeid IN (14,15)"""

	Customer_Financial_View_Count = """SELECT COUNT(*) FROM accounts.audittrail AS au
	WHERE au.customerid = :customerid AND au.audittypeid IN (14,15)"""


	Financial_Partners_View = """SELECT c.customername, TO_CHAR(auditdate,'DD-MM-YY') AS auditdate,au.audittypeid,
	COALESCE(at.adjustmenttypedescriptions,au.audittext) AS audittext,
	CASE WHEN document IS NULL THEN false ELSE true END AS documentpresent,
	CASE WHEN au.audittypeid NOT IN (4,9,15,16) OR (adj.adjustmentid IS NOT NULL AND adj.amount >0) THEN NULL
	ELSE
		CASE WHEN pay.paymenttypeid = 5 THEN round((pay.payment)/100.00,2) ELSE
	  	CASE WHEN pay.customerpaymentid IS NOT NULL THEN round(pay.payment/100.00,2) ELSE
	      round(ABS(adj.amount/100.00),2)
	      END
	    END
	END AS paid,

	CASE WHEN ( ci.invoiceamount IS NULL AND adj.adjustmentid IS NULL ) OR ( adj.adjustmentid IS NOT NULL AND adj.amount < 0) THEN NULL
	  ELSE
			CASE WHEN ci.invoiceamount IS NOT NULL THEN round(ci.invoiceamount/100.00,2)
	    ELSE round(adj.amount/100.00,2)
	  END
	END AS charge,
	au.audittrailid,
	COALESCE(adj.adjustmentid,pay.creditnotenbr, ci.invoicenbr) AS invoicenbr,
	to_char(payment_month, 'Mon/yy') AS payment_month_display,
	CASE WHEN ci.invoiceamount IS NOT NULL THEN round(ci.unpaidamount/100.00,2)
		WHEN pay.customerpaymentid IS NOT NULL THEN round(pay.unallocated/100.00,2)
	  WHEN adj.adjustmentid IS NOT NULL THEN round(adj.unallocated/100.00,2)
	  ELSE NULL END AS unallocated,
		  to_char(COALESCE(ci.invoicedate,pay.actualdate,COALESCE(adj.adjustmentdate,adj.applieddate)), 'DD/MM/YY') AS invoice_date,
	    COALESCE (ci.unpaidamount,pay.unallocated,adj.unallocated) as unallocated_value,
	    CASE WHEN pay.customerpaymentid IS NOT NULL THEN 'P' ||pay.customerpaymentid
	  	WHEN au.adjustmentid IS NOT NULL THEN 'A' ||au.adjustmentid
	WHEN ci.customerinvoiceid IS NOT NULL THEN 'I' || ci.customerinvoiceid END as keyid,
	COALESCE(adj.reason,pay.reason) AS reason

	FROM accounts.audittrail AS au
	LEFT OUTER JOIN internal.customers AS c ON au.customerid = c.customerid
	LEFT OUTER JOIN accounts.customerpayments AS pay ON au.customerpaymentid = pay.customerpaymentid
	LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.audittrailid = au.audittrailid
	LEFT OUTER JOIN accounts.adjustments AS adj ON adj.adjustmentid = au.adjustmentid
	LEFT OUTER JOIN internal.adjustmenttypes AS at ON at.adjustmenttypeid = adj.adjustmenttypeid
	WHERE c.customersourceid = :customersourceid """

	Financial_Partners_View_Count = """SELECT COUNT(*) FROM accounts.audittrail as au
	LEFT OUTER JOIN internal.customers AS c ON au.customerid = c.customerid
	LEFT OUTER JOIN accounts.customerpayments AS pay ON au.customerpaymentid = pay.customerpaymentid
	LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.audittrailid = au.audittrailid
	LEFT OUTER JOIN accounts.adjustments AS adj ON adj.adjustmentid = au.adjustmentid
	WHERE c.customersourceid = :customersourceid"""
	
	
	@classmethod
	def getDataGridPage(cls, kw):
		""" get a grid page for the display no primary key specified """

		if "icustomerid" in kw:
			if kw.get("sortfield", "") == "auditdate":
				kw["sortfield"] = "a.auditdate"
			if not kw.get('sortfield', ""):
				kw["sortfield"] = "a.auditdate"
				kw['direction'] = "desc"

			return BaseSql.getGridPage(
					kw,
					'auditdate',
					None,
					AuditTrail.Audit_Trail_Data_Grid,
					AuditTrail.Audit_Trail_Data_Count,
			    cls)
		else:
			return dict(numRows=0, items=[])

	@classmethod
	def getFinancialDataGridPage(cls, kw):
		""" get a grid page for the display no primary key specified """

		if kw.get('sortfield', "") == "auditdate":
			kw["sortfield"] = kw["sortfield"].replace("auditdate", "au.auditdate")
		if not kw.get('sortfield', ""):
			kw["sortfield"] = "au.auditdate"
			kw['direction'] = "desc"
		if kw.get('sortfield', "") == "invoice_date":
			kw["sortfield"] = "COALESCE(ci.invoicedate,pay.actualdate,adj.applieddate)"

		if kw.get('sortfield', "") == "invoicenbr":
			kw["sortfield"] = "COALESCE(pay.creditnotenbr, ci.invoicenbr)"

		whereusedext = ""
		if kw.has_key("filter_date"):
			whereusedext = " AND au.auditdate::date >= :filter_date"

		if kw.get("unallocated", False):
			whereusedext += " AND ( pay.unallocated != 0 OR ci.unpaidamount != 0 OR adj.unallocated != 0 )"

		if kw.get("moneyonly", False):
			whereusedext += " AND au.audittypeid IN (4,8,9,11,14,15,16) "
		else:
			whereusedext += " AND au.audittypeid IN ( 2,4,5,8,9,11,14,15,16,17) "

		if "icustomerid" in kw:
			return BaseSql.getGridPage(
			  kw,
			  'auditdate',
			  "audittrailid",
			  AuditTrail.Financial_View + whereusedext + AuditTrail.Financial_View_Order,
			  AuditTrail.Financial_View_Count + whereusedext,
			  cls)
		else:
			return dict(numRows=0, items=[], identifier="audittrailid")

	@classmethod
	def getFinancialPartnersDataGridPage(cls, kw):
		""" get a grid page for the display no primary key specified """

		if kw.get('sortfield', "") == "auditdate":
			kw["sortfield"] = kw["sortfield"].replace("auditdate", "au.auditdate")
		if not kw.get('sortfield', ""):
			kw["sortfield"] = "au.auditdate"
			kw['direction'] = "desc"
		if kw.get('sortfield', "") == "invoice_date":
			kw["sortfield"] = "COALESCE(ci.invoicedate,pay.actualdate,adj.applieddate)"

		if kw.get('sortfield', "") == "invoicenbr":
			kw["sortfield"] = "COALESCE(pay.creditnotenbr, ci.invoicenbr)"

		andclause = ""
		if kw.has_key("daterange"):
			daterange = kw["daterange"]
			if daterange.option == DateRangeResult.BEFORE:
				kw["from_date"] = daterange.from_date.strftime("%Y-%m-%d")
				andclause += ' AND au.auditdate <= :from_date'
			elif daterange.option == DateRangeResult.AFTER:
				kw["from_date"] = daterange.from_date.strftime("%Y-%m-%d")
				andclause += ' AND au.auditdate >= :from_date'
			elif daterange.option == DateRangeResult.BETWEEN:
				# ABetween
				kw["from_date"] = daterange.from_date.strftime("%Y-%m-%d")
				kw["to_date"] = daterange.to_date.strftime("%Y-%m-%d")
				andclause += ' AND au.auditdate BETWEEN :from_date AND :to_date'
			
		if kw.get("unallocated", 'false') == 'true':
			andclause += ' AND ( pay.unallocated != 0 OR ci.unpaidamount != 0 OR adj.unallocated != 0 )'

		if "customersourceid" in kw:
			return BaseSql.getGridPage(
			  kw,
			  'auditdate',
			  "audittrailid",
			  AuditTrail.Financial_Partners_View + andclause + AuditTrail.Financial_View_Order,
			  AuditTrail.Financial_Partners_View_Count + andclause,
			  cls)
		else:
			return dict(numRows=0, items=[], identifier="audittrailid")

	@classmethod
	def getReportData(cls, audittrailid):
		""" get the report data from the cusrrent instance """

		audit = cls.query.get(audittrailid)

		return DBCompress.decode(audit.document)

	@classmethod
	def customer_financial_history(cls, kw):
		""" customer_financial_history """

		if kw.get('sortfield', "") == "invoicedate":
			kw["sortfield"] = kw["sortfield"].replace("invoicedate", "ci.invoicedate")

		if kw.get('sortfield', "") == "invoiceamount":
			kw["sortfield"] = kw["sortfield"].replace("invoiceamount", "ci.invoiceamount")

		return BaseSql.getGridPage(
			kw,
			'ci.invoicedate',
			"audittrailid",
		  AuditTrail.Customer_Financial_View_Grid + AuditTrail.Financial_View_Order,
		  AuditTrail.Customer_Financial_View_Count,
		  cls)

class Terms(BaseSql):
	""" length of an  """
	List = """SELECT termid, termname FROM internal.terms"""
	ListId = """SELECT termid, termname  FROM internal.terms WHERE termid = :id"""
	ListName = """SELECT termid, termname  FROM internal.terms WHERE termname ilike :name """
	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.termid, name=row.termname)
					for row in data.fetchall()]

		if params.has_key("id"):
			command = Terms.ListId
		elif params.has_key("name"):
			if params["name"] == "*":
				command = Terms.List
			else:
				command = Terms.ListName
				params["name"] = params["name"] + "%"
		else:
			command = Terms.List

		return cls.sqlExecuteCommand(text(command), params, _convert)

	def getEndDate(self, isdemo=False):
		""" return the end of licende date for this term"""
		if isdemo:
			# temp chnage for just this month
			return datetime.date.today() + datetime.timedelta(days=5)
		else:
			if self.nbrweeks == 4:
				return datetime.date.today() + datetime.timedelta(days=30)
			else:
				return datetime.date.today() + datetime.timedelta(weeks=self.nbrweeks)

class Cost(object):
	""" Cost of licence"""

	@classmethod
	def getCosts(cls, paymentfreqid, nbroflogins, isdd=False):
		""" this get the default values for the order confirmation """

		termid = 1 if paymentfreqid == 2 else 4
		if isdd:
			termid = 4

		cost = session.query(Cost).filter_by(termid=termid, nbrofloginsid=1).all()[0]

		costs = dict(media=cost.cost * nbroflogins,
		              advance=cost.advancecost * nbroflogins)
		if isdd:
			costs["media"] = costs["media"] / 10
			costs["advance"] = costs["advance"] / 10

		return costs

class NbrOfLogins(BaseSql):
	""" Nbr of logins """
	List = """SELECT nbrofloginsid, nbrofloginsname FROM internal.nbroflogins"""
	ListId = """SELECT nbrofloginsid, nbrofloginsname FROM internal.nbroflogins WHERE nbrofloginsid = :id"""
	ListName = """SELECT nbrofloginsid, nbrofloginsname FROM internal.nbroflogins WHERE nbrofloginsname ilike :name """
	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.nbrofloginsid, name=row.nbrofloginsname)
					for row in data.fetchall()]

		if "id" in params:
			command = NbrOfLogins.ListId
		elif params.has_key("name"):
			if params["name"] == "*":
				command = NbrOfLogins.List
			else:
				command = NbrOfLogins.ListName
				params["name"] = params["name"] + "%"
		else:
			command = NbrOfLogins.List

		return cls.sqlExecuteCommand(text(command), params, _convert)

class HelpTree(object):
	""" Help Tree"""

	@classmethod
	def getTree(cls):
		""" get the tree of items for display"""

		def _capturelevel(row):
			""" capture help tree node"""
			items = []
			# setup current item
			retDict = dict(name=row.name, type=row.type)
			if row.page:
				# fix up page for test system
				retDict['page'] = row.page
			if row.jsmethod:
				retDict['jsmethod'] = row.jsmethod

			# is this a parent node ? is yes then walk the tree
			if row.helptreeid:
				rows = session.query(HelpTree).filter_by(parenthelptreeid=row.helptreeid)
				for row1 in rows:
					items.extend(_capturelevel(row1))
				else:
					children = [dict(_reference=row1.name) for row1 in rows]
					if children:
						retDict['children'] = children

			items.append(retDict)
			return items

		# capture top level
		items = []
		for row in session.query(HelpTree).filter_by(parenthelptreeid=None):
			items.extend(_capturelevel(row))

		return dict(identifier='name',
		            label='name',
		            items=items)

class LabelRows(object):
	""" label row object"""
	pass

class Labels(BaseSql):
	""" Label definitions"""

	List_Types = """SELECT l.labelid,l.labelname FROM internal.labels as l WHERE  (l.customerid = -1 OR l.customerid = :customerid ) ORDER BY l.labelname """

	@classmethod
	def getLookUp(cls, params):
		""" get the list of label types fo lookup"""
		def _convert(data):
			"internal"
			return [dict(id=row.labelid, name=row.labelname)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(Labels.List_Types), params, _convert)

	@classmethod
	def getLabelInfo(cls, kw):
		""" Get ingo about label"""

		label = Labels.query.get(kw["labelid"])
		ret = LabelInfo(labelobj=label)
		if kw.has_key("frame"):
			ret.frame = True

		for row in session.query(LabelRows).filter_by(labelid=kw['labelid']).order_by(LabelRows.labelrowid):
			params = {'rowId':row.labelrowid, 'bold': row.bold}
			if row.fontname:
				params['inFontName'] = row.fontname
			if row.fontsize:
				params['inFontSize'] = row.fontsize
			if row.alignment:
				params['inAlignment'] = row.alignment
			ret.setRowFont(**params)
		return ret

class CustomerPayments(object):
	""" Customer payment history """
	pass

class CustomerProtex(object):
	""" customer protex transactions"""
	pass

class PRMaxSettings(object):
	""" internal prmax settings """
	pass

class SourceType(object):
	""" source of object """
	pass

class Adjustments(BaseSql):
	""" Ajustemnt entry for accounts"""
	pass

class CustomerInvoice(BaseSql):
	""" Customer Invoice Record """

	@classmethod
	def getNextInvoiceId(cls):
		""" get the next invoice this locks the table as well """

		session.execute("LOCK TABLE internal.prmaxsettings", None, cls)
		result = session.execute("SELECT lastinvoicenbr FROM internal.prmaxsettings", None, cls)
		invoicenbr = result.fetchone()[0]
		session.execute("UPDATE internal.prmaxsettings SET lastinvoicenbr = lastinvoicenbr + 1", None, cls)

		return invoicenbr + 1

	__Invoice_Data_Grid = """SELECT
			ci.customerinvoiceid,
	    ci.invoicenbr,
	    ci.invoiceref,
	    to_char(ci.invoicedate,'DD-MM-YY') AS invoicedate,
	    ci.invoiceamount,
	    ci.unpaidamount,
	    ROUND(ci.invoiceamount/100.00,2) as invoiceamount_display,
	    ROUND(ci.unpaidamount/100.00,2) as unpaidamount_display,
	    ROUND(ABS(ci.unpaidamount - ci.invoiceamount)/100.0,2) AS allocated
	    FROM accounts.customerinvoices AS ci
	    WHERE ci.customerid  =:icustomerid AND ci.unpaidamount > 0
	    ORDER BY %s %s  LIMIT :limit OFFSET :offset"""
	__Invoice_Data_Count = """SELECT COUNT(*) FROM accounts.customerinvoices WHERE customerid = :icustomerid  AND unpaidamount > 0"""

	@classmethod
	def getGridPage(cls, kw):
		""" Get a grid page of custoemr invoices """

		if "icustomerid" not in kw:
			return dict(numRows=0, identifier="customerinvoiceid", items=[])

		return BaseSql.getGridPage(
			kw,
			'invoicenbr',
			"customerinvoiceid",
			CustomerInvoice.__Invoice_Data_Grid,
			CustomerInvoice.__Invoice_Data_Count,
			cls)

class CustomerAllocation(BaseSql):
	""" Customer Payment Allocation Record """


	Data_Grid_Invoices = """SELECT
	'Invoice' as typedescription,
	'I' ||ci.customerinvoiceid as key,
	ci.invoicenbr,
	ci.invoiceref,
	to_char(ci.invoicedate,'DD-MM-YY') AS invoicedate,
	ci.invoiceamount,
	ci.unpaidamount AS unallocated,
	ROUND(ci.invoiceamount/100.00,2) as invoiceamount_display,
	ROUND(ci.unpaidamount/100.00,2) as unpaidamount_display,
	0 AS allocated
	FROM accounts.customerinvoices AS ci
	WHERE ci.customerid  = :icustomerid AND ci.unpaidamount > 0"""

	Data_Count_Invoices = """SELECT COUNT(*) as nbr
	FROM accounts.customerinvoices AS ci
	WHERE ci.customerid  = :icustomerid AND ci.unpaidamount > 0"""


	Data_Grid_Payments = """SELECT
	'Payment' as typedescription,
	'P' ||cp.customerpaymentid as key,
	0 AS invoicenbr,
	'' AS invoiceref,
	to_char(cp.actualdate,'DD-MM-YY') AS invoicedate,
	cp.payment,
	cp.unallocated,
	ROUND(cp.payment/100.00,2) as invoiceamount_display,
	ROUND(cp.unallocated/100.00,2) as unpaidamount_display,
	0 AS allocated
	FROM accounts.customerpayments AS cp
	WHERE cp.customerid  = :icustomerid AND cp.unallocated > 0"""

	Data_Count_Payments = """SELECT COUNT(*) as nbr
	FROM accounts.customerpayments AS cp
	WHERE cp.customerid  = :icustomerid AND cp.unallocated > 0"""



	Data_Grid_Adjustments = """SELECT
	at.adjustmenttypedescriptions as typedescription,
	'A' ||adj.adjustmentid  as key,
	0 AS invoicenbr,
	'' AS invoiceref,
	to_char(adj.applieddate,'DD-MM-YY') AS invoicedate,
	adj.amount,
	adj.unallocated,
	ROUND(adj.amount/100.00,2) as invoiceamount_display,
	ROUND(adj.unallocated/100.00,2) as unpaidamount_display,
	0 AS allocated
	FROM accounts.adjustments AS adj
	LEFT OUTER JOIN internal.adjustmenttypes AS at ON adj.adjustmenttypeid = at.adjustmenttypeid
	WHERE adj.customerid  = :icustomerid AND adj.unallocated > 0"""

	Data_Count_Adjustments = """SELECT COUNT(*) as nbr
	FROM accounts.adjustments AS adj
	WHERE adj.customerid  = :icustomerid AND adj.unallocated > 0"""

	Data_Adjustment_Plus = " AND adj.amount > 0 "
	Data_Adjustment_Negative = " AND adj.amount < 0"

	Data_Grid_Order = " ORDER BY %s %s  LIMIT :limit OFFSET :offset"

	@staticmethod
	def _add(whereclause, extra):
		if whereclause:
			whereclause += " UNION "
		return whereclause + " " + extra

	@staticmethod
	def _addsum(whereclause, extra):
		if not whereclause:
			whereclause += " SELECT "
		else:
			whereclause += " + "

		return whereclause + "(" + extra + ")"

	Alloc_Details_Count = "SELECT COUNT(*) FROM accounts.customerallocation AS ca"
	Alloc_Details = """SELECT
	ca.customerpaymentallocationid,
	CASE WHEN ca.alloc_paymentid IS NOT NULL THEN 'Payment'
			WHEN ca.alloc_invoiceid IS NOT NULL THEN 'Invoice'
	    WHEN ca.alloc_adjustmentid IS NOT NULL THEN at.adjustmenttypedescriptions
	END as Type,
	ROUND(ca.amount/100.00,2 ) as amount,
	CASE WHEN ca.alloc_paymentid IS NOT NULL THEN cp.payment/100
			WHEN ca.alloc_invoiceid IS NOT NULL THEN ci.invoiceamount/100
	    WHEN ca.alloc_adjustmentid IS NOT NULL THEN a.amount/100
	END as value,
	CASE WHEN ca.alloc_paymentid IS NOT NULL THEN 0
			WHEN ca.alloc_invoiceid IS NOT NULL THEN ci.invoicenbr
	    WHEN ca.alloc_adjustmentid IS NOT NULL THEN 0
	END as invoicenbr,
	to_char(
		CASE WHEN ca.alloc_paymentid IS NOT NULL THEN cp.actualdate::date
			WHEN ca.alloc_invoiceid IS NOT NULL THEN ci.invoicedate::date
	    WHEN ca.alloc_adjustmentid IS NOT NULL THEN a.applieddate::date END,
	    'DD-MM-YY')	as invoicedate
	FROM accounts.customerallocation AS ca
	LEFT OUTER JOIN accounts.customerpayments AS cp ON cp.customerpaymentid = ca.alloc_paymentid
	LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.customerinvoiceid = ca.alloc_invoiceid
	LEFT OUTER JOIN accounts.adjustments AS a ON a.adjustmentid = ca.alloc_adjustmentid
	LEFT OUTER JOIN internal.adjustmenttypes AS at ON a.adjustmenttypeid = at.adjustmenttypeid"""

	@classmethod
	def getGridPage(cls, kw):
		""" get a grid page for the display no primary key specified """

		if "icustomerid" not in kw:
			return dict(numRows=0, items=[], identifier='key')

		kw["icustomerid"] = int(kw["icustomerid"])

		whereclause = ""
		datacount = ""
		if kw.get("source") != "invoice":
			whereclause = cls._add(whereclause, CustomerAllocation.Data_Grid_Invoices)
			datacount = cls._addsum(datacount, CustomerAllocation.Data_Count_Invoices)

		if kw.get("source") != "payment":
			whereclause = cls._add(whereclause, CustomerAllocation.Data_Grid_Payments)
			datacount = cls._addsum(datacount, CustomerAllocation.Data_Count_Payments)

		#if kw.get("source") != "adjustments":
		# always show adjustment s
		whereclause = cls._add(whereclause, CustomerAllocation.Data_Grid_Adjustments)
		datacount = cls._addsum(datacount, CustomerAllocation.Data_Count_Adjustments)

		return BaseSql.getGridPage(
		  kw,
		  'invoicedate',
		  'key',
		  whereclause + CustomerAllocation.Data_Grid_Order,
		  datacount,
		  cls)

	Alloc_Invoice = """SELECT ca.customerpaymentallocationid,
CASE WHEN ca.alloc_paymentid IS NOT NULL THEN cpt.customerpaymenttypename
WHEN ca.alloc_adjustmentid IS NOT NULL THEN aj.adjustmenttypedescriptions END as Type,
ROUND(ca.amount/100.00,2) as amount,
CASE WHEN ca.source_paymentid IS NOT NULL THEN ROUND(cp.payment/100.00,2) WHEN ca.source_adjustmentid IS NOT NULL THEN ROUND(a.amount/100.00,2) END as value,
NULL AS invoicenbr,
to_char( CASE WHEN ca.alloc_paymentid IS NOT NULL THEN cp.actualdate::date WHEN ca.alloc_adjustmentid IS NOT NULL THEN a.applieddate::date END, 'DD-MM-YY')  as invoicedate
FROM accounts.customerallocation AS ca
LEFT OUTER JOIN accounts.customerpayments AS cp ON cp.customerpaymentid = ca.alloc_paymentid
LEFT OUTER JOIN internal.customerpaymenttypes AS cpt ON cpt.customerpaymenttypeid = cp.paymenttypeid
LEFT OUTER JOIN accounts.adjustments AS a ON a.adjustmentid = ca.alloc_adjustmentid
LEFT OUTER JOIN internal.adjustmenttypes AS aj on aj.adjustmenttypeid = a.adjustmenttypeid"""

	@classmethod
	def getGridPageAllocations(cls, params):
		""" get a grid page for the display no primary key specified """

		if "keyid" not in params:
			return  dict(numRows=0, items=[], identifier='customerpaymentallocationid')

		keyid = int(params["keyid"][1:])
		if params["keyid"][0] == "I":
			params["alloc_invoiceid"] = keyid
			command = CustomerAllocation.Alloc_Invoice
			whereclause = "WHERE ca.alloc_invoiceid = :alloc_invoiceid"

		elif params["keyid"][0] == "A":
			params["source_adjustmentid"] = keyid
			whereclause = "WHERE ca.source_adjustmentid = :source_adjustmentid"
			command = CustomerAllocation.Alloc_Details

		elif params["keyid"][0] == "P":
			params["source_paymentid"] = keyid
			whereclause = "WHERE ca.source_paymentid = :source_paymentid"
			command = CustomerAllocation.Alloc_Details

		return BaseSql.getGridPage(
			params,
			'invoicedate',
			'customerpaymentallocationid',
			command + " " + whereclause + CustomerAllocation.Data_Grid_Order,
			CustomerAllocation.Alloc_Details_Count + " " + whereclause,
			cls)

	@classmethod
	def delete(cls, kw):
		""" Delete a allocation record """

		transaction = cls.sa_get_active_transaction()
		try:
			alloc = CustomerAllocation.query.get(kw["customerpaymentallocationid"])
			# now we need to add this value too the actual allocation figure
			if alloc.source_paymentid:
				p = CustomerPayments.query.get(alloc.source_paymentid)
				p.unallocated = p.unallocated if p.unallocated != None else 0
				p.unallocated += alloc.amount
			if alloc.source_adjustmentid:
				a = Adjustments.query.get(alloc.source_adjustmentid)
				a.unallocated += alloc.amount
			if alloc.alloc_paymentid:
				p = CustomerPayments.query.get(alloc.alloc_paymentid)
				p.unallocated += alloc.amount
			if alloc.alloc_invoiceid:
				ci = CustomerInvoice.query.get(alloc.alloc_invoiceid)
				ci.unpaidamount += alloc.amount
			if alloc.alloc_adjustmentid:
				a = Adjustments.query.get(alloc.alloc_adjustmentid)
				a.unallocated += alloc.amount

			session.delete(alloc)

			transaction.commit()
		except:
			log.exception("CustomerAllocarion_delete")
			transaction.rollback()
			raise

	@classmethod
	def getDetailsFromKey(cls, kw):
		""" getDetailsFromKey """
		typeid = kw["keyid"][0]
		keyid = int(kw["keyid"][1:])
		if typeid == "P":
			source = "payments"
			p = CustomerPayments.query.get(keyid)
			value = p.payment
			unallocated = p.unallocated if p.unallocated else 0.0
		if typeid == "I":
			source = "invoice"
			i = CustomerInvoice.query.get(keyid)
			value = i.invoiceamount
			unallocated = i.unpaidamount
		if typeid == "A":
			source = "adjustments"
			a = Adjustments.query.get(keyid)
			value = a.amount
			unallocated = a.unallocated

		return dict(
		  source=source,
		  value=value / 100.00,
		  unallocated=unallocated / 100.00)

	@classmethod
	def update_allocations(cls, kw):
		""" Update allocation """

		# get source
		allocations = simplejson.loads(kw["allocations"])
		unallocated = 0
		for row in allocations:
			unallocated += row["amount"] * 100

		typeid = kw["keyid"][0]
		keyid = int(kw["keyid"][1:])
		if typeid == "P":
			p = CustomerPayments.query.get(keyid)
			p.unallocated -= unallocated
			params = dict(source_paymentid=p.customerpaymentid)
		if typeid == "I":
			i = CustomerInvoice.query.get(keyid)
			i.unpaidamount -= unallocated
			params = dict(alloc_invoiceid=i.customerinvoiceid)
		if typeid == "A":
			a = Adjustments.query.get(keyid)
			a.unallocated -= unallocated
			params = dict(source_adjustmentid=a.adjustmentid)

		for row in allocations:
			keyid2 = int(row["keyid"][1:])
			params["amount"] = row["amount"] * 100
			if not row["amount"]:
				continue
			if row["keyid"][0] == "I":
				params["alloc_invoiceid"] = keyid2
				ci = CustomerInvoice.query.get(keyid2)
				ci.unpaidamount -= (row["amount"] * 100)
				if ci.unpaidamount < 0:
					ci.unpaidamount = 0
			elif row["keyid"][0] == "A":
				params["alloc_adjustmentid"] = keyid2
				ci = Adjustments.query.get(keyid2)
				ci.unallocated -= (row["amount"] * 100)
				if ci.unallocated < 0:
					ci.unallocated = 0
			elif row["keyid"][0] == "P":
				if keyid == "I":
					params["source_paymentid"] = keyid2
				else:
					params["alloc_paymentid"] = keyid2
				ci = CustomerPayments.query.get(keyid2)
				ci.unallocated -= (row["amount"] * 100)
				if ci.unallocated < 0:
					ci.unallocated = 0

			t = CustomerAllocation(**params)
			session.add(t)



# LockStatus record
# need 2.6 + for namedtuples
#import collections
#LockedStatus = collections.namedtuple("LockedStatus","locked lockedat userid username")
class LockedStatus(object):
	def __init__(self, *argc, **kw):
		self.locked = kw["locked"]
		self.lockedat = kw["lockedat"]
		self.userid = kw["userid"]
		self.username = kw["username"]

	def __json__(self):

		props = {}
		for key in self.__dict__:
			if not key.startswith('_sa_'):
				props[key] = getattr(self, key)
		return props


class LockedObject(BaseSql):
	""" Access to see if an object has a lock on it """

	ExpireTime = 5 # time out in mintes

	@classmethod
	def islocked(cls, objecttypeid, locktypeid, objectid, userid):
		""" test too see if an object has a lock on it
		returns """

		l = session.query(LockedObject).filter_by(objecttypeid=objecttypeid,
		                                           locktypeid=locktypeid,
		                                           objectid=objectid).all()
		if l:
			# locked by self
			if l[0].userid == userid:
				return None
			l = l[0]
			from prcommon.model import User
			u = User.query.get(l.userid)
			# check to see if the time issue
			tmp = l.lockedat + datetime.timedelta(minutes=LockedObject.ExpireTime)
			# lock expired
			if tmp < datetime.datetime.now():
				return None

			return LockedStatus(
			  locked=False if l.has_expired() else True,
			  lockedat=l.lockedat,
			  userid=l.userid,
			  username=u.display_name)

		return None

	def has_expired(self):
		""" Check to see if a lock has expired """

		if self.lockedat == None:
			return True

		tmp = self.lockedat + datetime.timedelta(minutes=LockedObject.ExpireTime)
		return False if tmp > datetime.datetime.now() else True


	@classmethod
	def addlock(cls, objecttypeid, locktypeid, objectid, userid):
		""" add a lock for a record """
		l = session.query(LockedObject).filter_by(objecttypeid=objecttypeid,
		                                          locktypeid=locktypeid,
		                                          objectid=objectid).all()
		if l:
			l = l[0]
			l.userid = userid
			l.lockedat = datetime.datetime.now()
		else:
			session.add(LockedObject(objecttypeid=objecttypeid,
			                         locktypeid=locktypeid,
			                         objectid=objectid,
			                         userid=userid))

	@classmethod
	def expirelock(cls, objecttypeid, locktypeid, objectid):
		""" remove a lock """
		l = LockedObject.query.filter_by(objecttypeid=objecttypeid,
		                                 locktypeid=locktypeid,
		                                 objectid=objectid).all()
		if l:
			session.delete(l[0])

	@classmethod
	def expirealllocks(cls):
		""" expire all the locks int he system """

		transaction = cls.sa_get_active_transaction()
		try:
			session.execute(text("""SELECT clear_prmax_locks();"""), None, cls)
			transaction.commit()
		except:
			log.error("expirealllocks_delete")
			transaction.rollback()
			raise

################################################################################
###
################################################################################

customerpayments_table = Table("customerpayments", metadata, autoload=True, schema='accounts')
cost_table = Table('prmaxcosts', metadata, autoload=True, schema='internal')
nbr_table = Table('nbroflogins', metadata, autoload=True, schema='internal')
term_table = Table('terms', metadata, autoload=True, schema='internal')
audittrail_table = Table('audittrail', metadata, autoload=True, schema='accounts')
helptree_table = Table('helptree', metadata, autoload=True, schema='internal')
labels_table = Table('labels', metadata, autoload=True, schema='internal')
labelsrows_table = Table('labelrows', metadata, autoload=True, schema='internal')
customerprotex_table = Table('customerprotex', metadata, autoload=True, schema='accounts')
prmaxsettings_table = Table("prmaxsettings", metadata, autoload=True, schema='internal')
sourcetype_table = Table('sourcetypes', metadata, autoload=True, schema='internal')
CustomerInvoice.mapping = Table('customerinvoices', metadata, autoload=True, schema='accounts')
CustomerAllocation.mapping = Table('customerallocation', metadata, autoload=True, schema='accounts')
Adjustments.mapping = Table('adjustments', metadata, autoload=True, schema='accounts')
LockedObject.mapping = Table('lockedobjects', metadata, autoload=True, schema='internal')

mapper(CustomerProtex, customerprotex_table)
mapper(CustomerPayments, customerpayments_table)
mapper(Cost, cost_table)
mapper(NbrOfLogins, nbr_table)
mapper(Terms, term_table)
mapper(AuditTrail, audittrail_table)
mapper(HelpTree, helptree_table)
mapper(Labels, labels_table)
mapper(LabelRows, labelsrows_table)
mapper(PRMaxSettings, prmaxsettings_table)
mapper(SourceType, sourcetype_table)
mapper(CustomerInvoice, CustomerInvoice.mapping)
mapper(CustomerAllocation, CustomerAllocation.mapping)
mapper(Adjustments, Adjustments.mapping)
mapper(LockedObject, LockedObject.mapping)
