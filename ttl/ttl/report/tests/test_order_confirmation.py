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

from ttl.report.order_confirmation  import OrderConfirmationPDF

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
		outputpath = "c:/temp"
		params = dict ( accnbr = "1",
						invoicenbr = "1" ,
						invoicedate = datetime.date.today().strftime("%d/%m/%Y"),
						nameaddress = ("Mr A Test", "Account Person","The Company", "Line 1","Line 2","Town", "County","PostCode"),
		        paymentline = "Payment Received 17.00 by Credit Card, With Thanks",
		        message = "Message area",
		        breakdown = [("Core",1000,200,1200,),
		                     ("Features",100,20,120,),
		                     ("Total",1100,220,1120,)
		                     ]
						)

		ss = OrderConfirmationPDF(params )
		ofile = os.path.normpath(os.path.join(outputpath,"prmax_order_confromation.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )