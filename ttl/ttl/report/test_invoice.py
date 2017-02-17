# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			test_invoice
# Purpose:     test case for invoice
#
# Author:       Chris Hoy
#
# Created:		23/02/2008
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import unittest
import datetime
import os

from ttl.report.std_invoice_pdf  import InvoicePDF

outputpath = "c:/output"

class Testreports(unittest.TestCase):
	def setUp(self):
		# common test data
		pass
	def tearDown(self):
		pass

	def test_invoice(self):
		""" """
		import datetime
		outputpath = "c:/tmp"
		params = dict ( accnbr = "1",
						invoicenbr = "1" ,
						invoicedate = datetime.date.today().strftime("%d/%m/%Y"),
						nameaddress = ("Mr A Test", "Account Person","The Company", "Line 1","Line 2","Town", "County","PostCode"),
						licencedetails = "PRmax licence for 6 users from 12 months",
		        purchase_order="XXXXXXX NNNNNNNNNN YYYYYYYY",
						cost = "£12.00",
						vat = "£5.00",
						total = "£17.00",
		                paymentline = "Payment Received 17.00 by Credit Card, With Thanks",
		                message = "Message area"
						)

		ss=InvoicePDF(params)
		ofile = os.path.normpath(os.path.join(outputpath,"prmax_invoice.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )
