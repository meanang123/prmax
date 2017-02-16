# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        accounting.py
# Purpose:		Hold spific function to handle the interanl accounting system
#
# Author:      Chris Hoy
#
# Created:     17-12-2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
import datetime, calendar
from turbogears.database import session
from sqlalchemy.sql import text

from prcommon.model import Customer, BaseSql
from ttl.ttlcsv import ToCsv

import logging
log = logging.getLogger("prmax.model")

class Accounting ( object ) :
	""" handles some of the basuic accounting functions """

	@classmethod
	def getActiveUserAsCsv ( cls , kw ) :
		""" get a list of actibe account """

		dt = datetime.datetime.strptime( kw['active_report_date'], "%Y-%m-%d")
		dt = datetime.date(dt.year, dt.month, dt.day )
		_rows = [("Account Nbr", "Customer Name", "Licence")]
		_rows.extend( session.query(Customer.customerid, Customer.customername,Customer.licence_expire).filter(
		    Customer.licence_expire > dt ).filter_by(isinternal = False, isdemo = False ).all())

		return ToCsv ( _rows )

	List_Payments = """SELECT c.customerid, c.customername,
		to_char(cp.actualdate,'DD-MM-YY') AS paymentdate,
	  round(cp.payment/100.0,2) AS payment,
	  cpt.customerpaymenttypename,
	  cp.invoicenbr,
	  (SELECT to_char(a.auditdate,'DD-MM-YY') FROM accounts.audittrail AS a WHERE a.invoicenbr = cp.invoicenbr LIMIT 1)
		FROM internal.customers AS c
	  JOIN accounts.customerpayments AS cp ON cp.customerid = c.customerid
	  JOIN accounts.customerpaymenttypes AS cpt ON cp.paymenttypeid = cpt.customerpaymenttypeid
	  WHERE CAST(cp.actualdate AS DATE) BETWEEN :lower_date AND :upper_date """

	@classmethod
	def getPaymentHistory (cls, kw ) :
		""" get the payment listry list for a month """
		dt = datetime.datetime.strptime( kw['active_report_date'], "%Y-%m-%d")
		(dummy, upper_date) = calendar.monthrange ( dt.year, dt.month )
		_rows = [("Account Nbr", "Customer Name", "payment date", "payment", "payement type", " Inv Nbr", "Invoice date")]
		params = dict ( lower_date = datetime.date(dt.year, dt.month, 1),
		                upper_date = datetime.date(dt.year, dt.month, upper_date ) )

		data = Customer.sqlExecuteCommand ( text(Accounting.List_Payments), params , BaseSql.ResultAsList )

		_rows.extend ( data )
		return ToCsv ( _rows )