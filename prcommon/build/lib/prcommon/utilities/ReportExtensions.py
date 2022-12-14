# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import prcommon.Constants as Constants
import datetime
import logging
from ttl.postgres import DBCompress
from ttl.ttlemail import EmailMessage
from ttl.model import BaseSql

from ttl.report.listing_pdf import ListingPDF
from ttl.report.listing2_pdf import Listing2PDF
from ttl.report.std_invoice_pdf import InvoicePDF
from ttl.report.std_creditnote_pdf import CreditNotePdf
from ttl.report.order_confirmation import OrderConfirmationPDF
from ttl.report.engagement_report import EngagementPDF
from ttl.report.clippings_piechart_report import ClippingsPieChartPDF
from ttl.report.clippings_lineschart_report import ClippingsLinesChartPDF
from ttl.report.partners_list_report import PartnersListPDF, PartnersListExcel
from ttl.report.partners_statement_report import PartnersStatementPDF, PartnersStatementExcel
from ttl.report.pdf_fields import *
from datetime import date
from prcommon.Const.Email_Templates import *
import simplejson
import ttl.Constants as TTLConstants

LOGGER = logging.getLogger("prcommon.model")


class ReportCommon(object):
	""" Comoom report base """
	def __init__(self, reportoptions, parent):
		self._reportoptions = reportoptions
		self._parent = parent

	def sort(self, query, defaultorder):
		""" sort """
		return query

	def post(self, comm ):
		""" post create """
		pass

	def repdata(self, row):
		""" default report data """
		rvalue = [rwNORMAL]
		for key in self.col_names:
			rvalue.append( row[key])
		return rvalue

	def _run( self, data , output , datakey = 'lists') :
		""" run default extension """
		rdata = [ self.repdata(row) for row in data[datakey]]
		if not len(rdata):
			rdata = [[rwNORMAL, "No Data Present", "", "", "", "", "", ""]]
		r = ListingPDF(self.page_info, self.col_info, rdata)
		output.write(r.stream())

	def _GetDefaultShopSettings(self, *argv, **kw ):
		""" get the default setting dict """
		self.page_info = dict(shop_name = "PRmax",
							report_date = date.today().strftime("%d-%m-%y"),
							headerimage = "pressofficelogo4.png",
							strapline = "Powered by PRmax prmax.co.uk",
							prmax_info = dict( name = "PRmax"))
		self.page_info.update( kw )


class ListReportCommon(ReportCommon):
	def __init__(self, reportoptions, parent ) :
		ReportCommon.__init__(self, reportoptions, parent)
		# field translation fields
		self._translate = {'1':'UPPER(sortname)',
						   '2':'UPPER(familyname)',
						   '3':'circulation',
						   '4':'appended',
						   '5':'UPPER(job_title)',
						   '6':'sortorder DESC, UPPER(sortname) '}

	def sort(self, query, defaultorder):
		""" Sort functions """

		sortfield = self._reportoptions['sortorder']
		order  = 'ASC' if sortfield.find('-') else 'DESC'
		field = self._translate[sortfield.replace('-','').replace("+","")]

		return query.replace("ORDER BY  %s" % defaultorder,
							 "ORDER BY  %s %s" % (field, order))

	def run( self, data , output ) :
		"run"
		self._run( data , output , "results")


class BriefReport(ListReportCommon):
	"""Brief report extensions"""
	def __init__(self, reportoptions, parent):
		ListReportCommon.__init__(self, reportoptions, parent)

		self.col_info = {
			'headers' : [('Outlet Name', 'Contact Name', 'Tel', 'Email')],
			'widths' : (6, 4, 3, 6),
				'ctypes' : (ctSTRING, ctSTRING , ctSTRING , ctSTRING ),
					}
		self.col_names = ("outletname", "contactname", "tel", "email")

		# check report title
		report_name  = reportoptions.get("reporttitle","")
		if not report_name:
			report_name = 'Brief Report'

		self._GetDefaultShopSettings(report_id = '1',
									 report_name = report_name)

class DistributionReport(ListReportCommon):
	"""Distribution report extensions"""
	def __init__(self, reportoptions, parent):
		ListReportCommon.__init__(self, reportoptions, parent)

		self.col_info = {
			'headers' : [('Outlet Name', 'Contact Name', 'Tel', 'Email', "Status")],
			'widths' : (5, 4, 3, 5, 2),
				'ctypes' : (ctSTRING, ctSTRING , ctSTRING , ctSTRING, ctSTRING),
					}
		self.col_names = ("outletname", "contactname", "tel", "emailaddress", "distributionstatusdescription")

		# check report title
		report_name  = reportoptions.get("reporttitle","")
		if not report_name:
			report_name = 'Distribution Report'

		self._GetDefaultShopSettings(report_id = '3',
									 report_name = report_name)


class FullCheckReport(ListReportCommon):
	"""Brief report extensions"""
	def __init__(self, reportoptions, parent):
		ListReportCommon.__init__(self, reportoptions, parent)
		self.col_info = {
			'headers':[('Outlet Name', 'Contact Name', 'Tel', 'Email', 'Address', 'Town' ,'Post Code')],
			'widths':(6, 4, 3, 5, 4, 3, 2),
				'ctypes':(ctSTRING, ctSTRING , ctSTRING , ctSTRING, ctSTRING, ctSTRING, ctSTRING ),
					}
		self.col_names = ("outletname", "contactname", "tel", "email", "address1", "townname", "postcode")

		report_name = reportoptions.get('reporttitle','')
		if not report_name:
			report_name = 'Full Check Report'
		self._GetDefaultShopSettings(report_id = '2',
									 report_name = report_name)
		self.page_info["landscape"] = True

class InvoiceReport(ReportCommon):
	""" Handle the post invoice generateion """

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent)
		self._isproforma = False
		self._invoicenbr = None
		self._load_modules(parent._db)

	def _load_modules(self, database):
		"""create a dicitionay of module
		used later by the anslysis to create breakdown of invoice
		"""
		datarow = database.executeOne(
		  """SELECT pricecodeid,advpricecodeid,updatumpricecodeid,intpricecodeid,clippingspricecodeid FROM internal.customers WHERE customerid = %(customerid)s""",
		                              dict(customerid=self._reportoptions['customerid']))

		self._modules = {"corecost":datarow[0],
		                 "advcost":datarow[1],
		                 "updatumcost":datarow[2],
		                 "seocost":None,
		                 "intcost":datarow[3],
		                 "clippingscost":datarow[4],
		                 "clippingsfee":datarow[4]}

	def post(self, comm ):
		"post"
		# get the report and send invoice
		params  = dict( customerid = self._reportoptions['customerid'],
						data = DBCompress.encode(self._parent._finaloutput.getvalue()))

		Subject = Invoice_Subject_Proforma if self._isproforma else Invoice_Subject
		Body = Invoice_Body_Proforma if self._isproforma else Invoice_Body
		params["invoicetype"] = 'Proforma Invoice' if self._isproforma else "Invoice"
		params["audittypeid"] = Constants.audit_proforma if self._isproforma else Constants.audit_invoice
		attachFileName = "PRmaxProformaInvoice.pdf" if self._isproforma else "PRmaxinvoice.pdf"
		if self._reportoptions.has_key("monthly") and self._reportoptions["monthly"]:
			Body = Invoice_Monthly_Body
		if self._reportoptions.has_key("dd") and self._reportoptions["dd"]:
			Body = Invoice_Monthly_DD

		if  "oneoff" in self._reportoptions:
			Body = Invoice_Body_One_Off

		emailaddress = self._reportoptions.get ("email", "" )
		if not emailaddress:
			comm.execute( """SELECT COALESCE(NULLIF(invoiceemail,''),email) FROM internal.customers WHERE customerid = %(customerid)s""",  params)
			emailaddress = comm.fetchall()[0][0]
		params["emailedtoaddress"] = emailaddress
		params["subject"] = Subject

		# add to audit trial invoice details
		if not self._isproforma:
			# link up to invoice nbr and payments
			# value should always be payment value
			params["invoicenbr"] = self._invoicenbr
			if self._reportoptions.has_key("customerpaymentid"):
				params["customerpaymentid"] = self._reportoptions["customerpaymentid"]
				comm.execute( """SELECT payment,vat FROM accounts.customerpayments WHERE customerpaymentid = %(customerpaymentid)s""",  params)
				params["payment"],params["vat"]  = comm.fetchall()[0]
				params["unallocated"] = 0
			else:
				params["customerpaymentid"] = None
				params["payment"] = self._reportoptions['total']
				params["unallocated"] = self._reportoptions['total']
				params["vat"] = self._reportoptions['vat']

			# add to autitrail
			comm.execute( """INSERT INTO accounts.audittrail(audittypeid,audittext, customerid, document,customerpaymentid,invoicenbr,emailedtoaddress)
			VALUES(%(audittypeid)s,%(invoicetype)s,%(customerid)s,%(data)s,%(customerpaymentid)s,%(invoicenbr)s,%(emailedtoaddress)s) RETURNING audittrailid""",  params)
			params["audittrailid"]  = comm.fetchall()[0][0]

			# add to invoice list
			if self._reportoptions.has_key("invoicedate"):
				params["invoicedate"] = self._reportoptions["invoicedate"]
			else:
				cost = self._reportoptions['cost']
				vat =  self._reportoptions['vat']
				total = self._reportoptions['total']
				params["invoicedate"] = date.today().strftime("%Y-%m-%d")
			comm.execute( """INSERT INTO accounts.customerinvoices(invoicenbr,invoiceamount,invoicedate,vat,audittrailid,subject,customerid,unpaidamount)
				SELECT %(invoicenbr)s,%(payment)s,%(invoicedate)s,%(vat)s,%(audittrailid)s,%(subject)s,%(customerid)s,%(unallocated)s RETURNING customerinvoiceid """, params )
			params["customerinvoiceid"]  = comm.fetchall()[0][0]

			if self._reportoptions.has_key("customerpaymentid"):
				# add payment allocation record
				comm.execute( """INSERT INTO accounts.customerallocation(source_paymentid,alloc_invoiceid,amount)
				SELECT %(customerpaymentid)s,%(customerinvoiceid)s,payment FROM accounts.customerpayments WHERE customerpaymentid = %(customerpaymentid)s""", params )

			# link the seo release to an invoice
			if "seolines" in self._reportoptions:
				for row in  self._reportoptions["seolines"]:
					comm.execute( """UPDATE seoreleases.seorelease SET customerinvoiceid = %(customerinvoiceid)s WHERE seoreleaseid = %(seoreleaseid)s""", \
					              dict(customerinvoiceid = params["customerinvoiceid"],  seoreleaseid = row[4]))

			# setup analalysis
			# retrieve customer analysis fields

			if "modules" in self._reportoptions:
				pass
			else:
				pass


		else:
			comm.execute( """INSERT INTO accounts.audittrail(audittypeid,audittext, customerid, document)
			VALUES(%(audittypeid)s,%(invoicetype)s,%(customerid)s,%(data)s)""",  params)

		# issue with invoice number will need to access a central table
		email = EmailMessage(Constants.AccountsEmail,
							 emailaddress,
							 Subject,
							 Body,
		           "text/html")
		email.bcc = Constants.CopyEmail
		email.addAttachment(self._parent._finaloutput.getvalue() , attachFileName )
		email.BuildMessage()

		params = dict ( emailaddress = emailaddress ,
						subject = Subject,
						customerid = self._reportoptions['customerid'],
						message = DBCompress.encode(email),
						emailqueuetypeid = Constants.EmailQueueType_Internal)

		comm.execute( """INSERT INTO queues.emailqueue(emailaddress,subject, message, emailqueuetypeid)
		VALUES(%(emailaddress)s,'subject',%(message)s,%(emailqueuetypeid)s)""",  params)

	def run( self, data , output ) :
		lines = []
		params = dict(customerid = self._reportoptions['customerid'])
		self.comm.execute( """SELECT customerid, contactname, contactjobtitle, customername, a.address1, a.address2, a.townname, a.county, a.postcode,
		pc.cost, pc.vat,pc.total,logins, t.termname,c.countryid, co.countryname, vc.rate, c.vatnumber, c.purchase_order,
		pc.advancecost, pc.advancevat, pc.advancetotal, pc.crmcost, pc.crmvat, pc.crmtotal, c.advancefeatures , c.crm,c.is_bundle,c.has_bundled_invoice,
		c.distribution_description, c.distribution_description_plural

		FROM internal.customers as c
		JOIN addresses as a ON a.addressid = c.addressid
		JOIN internal.terms as t ON t.termid = c.termid
		JOIN internal.prmaxcosts as pc ON pc.termid = c.termid AND pc.nbrofloginsid = c.nbrofloginsid
		LEFT OUTER JOIN internal.countries AS co ON co.countryid = c.countryid
		LEFT OUTER JOIN internal.vatcode AS vc ON vc.vatcodeid = co.vatcodeid

		WHERE customerid = %(customerid)s""",  params)
		details = self.comm.fetchone()
		address = [ row for row in details[1:9] if row]
		address.append ( details[15] )

		# check for non standard detail
		date = datetime.date.today().strftime("%d/%m/%Y")

		if self._reportoptions.has_key("licencedetails"):
			licencedetails = self._reportoptions["licencedetails"]
		else:
			licencedetails = Constants.Licence_Line % ( details[13],date)

		if self._reportoptions.has_key("cost"):
			cost = self._reportoptions['cost']
			vat =  self._reportoptions['vat']
			total = self._reportoptions['total']
		else:
			# This is now more complex we need to get the module cost as well
			( cost, vat, total ) = details[9:12]
			# 19 - 24 field
			if details[25]:
				# has advance
				cost += details[19]
				vat += details[20]
				total += details[21]
				lines.append ( ["Features",
				                "??%.2f"% (details[19]/100.00,),
				                "??%.2f"% (details[20]/100.00,),
				                "??%.2f"% (details[21]/100.00,)])
			if details[26]:
				# has crm
				cost += details[22]
				vat += details[23]
				total += details[24]
				lines.append ( ["Crm",
				                "??%.2f"% (details[22]/100.00,),
				                "??%.2f"% (details[23]/100.00,),
				                "??%.2f"% (details[24]/100.00,)])

		invoicedate = date
		if self._reportoptions.has_key("invoicedate"):
			invoicedate = self._reportoptions["invoicedate"].strftime("%d/%m/%Y")

		purchase_order = self._reportoptions.get("purchase_order", details[18])

		params = dict ( accnbr = str(details[0]),
				        distribution_description = details[29],
				        distribution_description_plural = details[30],
						invoicedate = invoicedate,
						nameaddress = address,
						licencedetails = licencedetails,
						cost = "??%.2f"% (cost/100.00,),
						vat = "??%.2f"% (vat/100.00,),
						total = "??%.2f"% (total/100.00,),
		        countryid = details[14],
		        vatrate = details[16],
		        vatnumber = details[17],
		        purchase_order = purchase_order,
		        message = self._reportoptions.get("message",""),
		        show_bank = self._reportoptions.get("show_bank",False),
		        lines = lines)
		if "seolines" in self._reportoptions:
			params["seolines"] = self._reportoptions["seolines"]

		if details[28] == 1:
			params["has_bundled_invoice"] = True

		# setup module costs
		if "modules" in self._reportoptions:
			if "advcost" in self._reportoptions:
				params["advcost"] = "??%.2f" % (self._reportoptions["advcost"]/100.00,)
			if "updatumcost" in self._reportoptions:
				params["updatumcost"] = "??%.2f" % (self._reportoptions["updatumcost"]/100.00,)
			if "seocost" in self._reportoptions:
				params["seocost"] = "??%.2f" % (self._reportoptions["seocost"]/100.00,)
			if "corecost" in self._reportoptions:
				params["corecost"] = "??%.2f" % (self._reportoptions["corecost"]/100.00,)
			if "intcost" in self._reportoptions:
				params["intcost"] = "??%.2f" % (self._reportoptions["intcost"]/100.00,)
			if "clippingscost" in self._reportoptions:
				params["clippingscost"] = "??%.2f" % (self._reportoptions["clippingscost"]/100.00,)
			if "clippingsfee" in self._reportoptions:
				params["clippingsfee"] = "??%.2f" % (self._reportoptions["clippingsfee"]/100.00,)

		if self._isproforma:
			params["isproforma"] = True
		else:
			self.comm.execute( """LOCK TABLE internal.prmaxsettings""")
			self.comm.execute( """SELECT lastinvoicenbr FROM internal.prmaxsettings """)
			settings = self.comm.fetchone()
			self.comm.execute( """UPDATE internal.prmaxsettings SET lastinvoicenbr = lastinvoicenbr + 1""")
			self._invoicenbr = params["invoicenbr"] = str(settings[0]+1)
			params["paymentline"] = self._reportoptions.get('paymentline', '')
			if self._reportoptions.has_key ( "customerpaymentid"):
				self.comm.execute( """UPDATE accounts.customerpayments SET invoicenbr = %d WHERE customerpaymentid = %d""" % ( int(self._invoicenbr),int(self._reportoptions["customerpaymentid"])) )

		r = InvoicePDF(params)
		output.write(r.stream())

class InvoiceProformaReport ( InvoiceReport ) :
	def __init__(self, reportoptions, parent):
		InvoiceReport.__init__(self, reportoptions, parent)
		self._isproforma = True

class ListReportFull(ReportCommon):
	"""Brief report extensions"""
	def __init__(self, reportoptions, parent):
		ReportCommon.__init__(self, reportoptions, parent)
		self.col_info = {
			'headers' : [('List Name', 'Projects', 'Nbr', )],
			'widths':(10, 6, 1 ),
		    'ctypes':(ctSTRING, ctSTRING , ctNUMBER),
		}

		self.col_names = ("listname", "projects", "nbr")

		self._GetDefaultShopSettings(report_id = 'LL 1',
									 report_name = 'List of List')

	def run( self, data , output ) :
		"""run """
		self._run( data , output )


class ListReportSimple(ReportCommon):
	"""Brief report extensions"""
	def __init__(self, reportoptions, parent):
		ReportCommon.__init__(self, reportoptions, parent)
		self.col_info = {
			'headers' : [('List Name', 'Nbr', )],
			'widths' : (10, 6, 1),
			'ctypes' : (ctSTRING, ctNUMBER ),
		}

		self.col_names = ("listname", "nbr")

		self._GetDefaultShopSettings(report_id = 'LL 2',
									 report_name = 'List of List')

	def run( self, data , output ) :
		"run"
		self._run( data , output )

class PrintSummary(ReportCommon):
	""" Print summary details """
	def __init__(self, reportoptions, parent):
		ReportCommon.__init__(self, reportoptions, parent)

		self._GetDefaultShopSettings(report_id = 'LL 2',
									 reportname = 'Summary for')

	_outlet = [
		("outletname", "Name"),
		("contactname", "Contact"),
		("tel", "Telephone"),
		("email", "Email"),
		("fax", "Fax"),
		("address", "Address")
	]

	def run( self, data , output ) :
		""" run """
		self.page_info["reportname"] = 'Summary for %s' % data["outlet"]["outletname"]

		rData = [ [ rSingleLine , row[1], data["outlet"][row[0]]]
				  for row in PrintSummary._outlet]

		if data["outlet"]["profile"]:
			rData.append([ rMultiLine , "Profile", data["outlet"]["profile"]])
		if data["outlet"]["localprofile"]:
			rData.append([ rMultiLine , "Local Profile", data["outlet"]["localprofile"]])
		if data["interests"]:
			rData.append([ rMultiLine , "Interests", ",".join([ row['interestname'] for row in data["interests"]])])
		if data["tags"]:
			rData.append([ rMultiLine , "Tags", ",".join([ row['interestname'] for row in data["tags"]])])
		if data["coverage"]:
			rData.append([ rMultiLine , "Coverage", ",".join([ row['geographicalname'] for row in data["coverage"]])])

		r = Listing2PDF(self.page_info, rData)
		output.write(r.stream())
		del  r


class AdvanceReportList(ReportCommon):
	""" simple advance report"""
	def __init__(self, reportoptions, parent):
		ReportCommon.__init__(self, reportoptions, parent)
		self.col_info = {
			'headers' : [('Outlet Name', 'Pub Date', 'Feature')],
			'widths' : (5.5, 1.5, 20),
			'ctypes' : (ctSTRING, ctSTRING,ctSTRING ),
		}

		self.col_names = ("outletname", "pub_date_display", "feature")

		self._GetDefaultShopSettings(report_id = '',
									 report_name = 'Features List')

	def run( self, data , output ) :
		"run"
		self._run( data , output )

class OrderConfirmation(ReportCommon):
	""" generate an order confirmation"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )

	def post(self, comm ):
		"post"
		# get the report and send invoice
		emailaddress = self._reportoptions.get ("email", "" )
		if not emailaddress:
			comm.execute( """SELECT COALESCE(NULLIF(invoiceemail,''),email) FROM internal.customers WHERE customerid = %(customerid)s""", dict( customerid = self._reportoptions['customerid']))
			emailaddress = comm.fetchall()[0][0]

		# issue with invoice number will need to access a central table
		email = EmailMessage(Constants.AccountsEmail,
							 emailaddress,
							 Order_Confirmation_Subject,
							 Order_Confirmation_Body,
		           "text/html")
		email.bcc = Constants.CopyEmail
		email.addAttachment(self._parent._finaloutput.getvalue() , "PRmaxOrderConfirmation.pdf" )
		email.BuildMessage()

		params = dict ( emailaddress = emailaddress ,
						subject = Order_Confirmation_Subject,
						customerid = self._reportoptions['customerid'],
						message = DBCompress.encode(email),
						emailqueuetypeid = Constants.EmailQueueType_Internal,
		        data = DBCompress.encode(self._parent._finaloutput.getvalue()))

		comm.execute( """INSERT INTO queues.emailqueue(emailaddress,subject, message, emailqueuetypeid)
		VALUES(%(emailaddress)s,'subject',%(message)s,%(emailqueuetypeid)s)""",  params)
		# update both the contacthistory and add audittrail
		comm.execute( """INSERT INTO accounts.audittrail(audittypeid,audittext, customerid, document,emailedtoaddress)
			VALUES(8,'Order Confirmation',%(customerid)s,%(data)s,%(emailaddress)s)""",  params)

	def run( self, data , output ) :
		lines = []
		params = dict(customerid = self._reportoptions['customerid'])
		self.comm.execute( """SELECT customerid, contactname, contactjobtitle, customername, a.address1, a.address2, a.townname, a.county, a.postcode,
		pc.cost, pc.vat,pc.total,logins, t.termname,c.countryid, co.countryname, vc.rate, c.vatnumber, c.purchase_order,
		pc.advancecost, pc.advancevat, pc.advancetotal, pc.crmcost, pc.crmvat, pc.crmtotal, c.advancefeatures , c.crm

		FROM internal.customers as c
		JOIN addresses as a ON a.addressid = c.addressid
		JOIN internal.terms as t ON t.termid = c.termid
		JOIN internal.prmaxcosts as pc ON pc.termid = c.termid AND pc.nbrofloginsid = c.nbrofloginsid
		LEFT OUTER JOIN internal.countries AS co ON co.countryid = c.countryid
		LEFT OUTER JOIN internal.vatcode AS vc ON vc.vatcodeid = co.vatcodeid

		WHERE customerid = %(customerid)s""",  params)
		details = self.comm.fetchone()
		address = [ row for row in details[1:9] if row]
		address.append ( details[15] )

		self._reportoptions["address"] = address
		self._reportoptions["purchase_order"] = details[18]
		self._reportoptions["accnbr"]  = str(details[0])
		self._reportoptions["orderdate"] = date.today().strftime("%d/%m/%y")
		self._reportoptions["nameaddress"] = address

		emailaddress = self._reportoptions.get ("email", "" )
		if not emailaddress:
			self.comm.execute( """SELECT COALESCE(NULLIF(invoiceemail,''),email) FROM internal.customers WHERE customerid = %(customerid)s""",  params)
			emailaddress = self.comm.fetchall()[0][0]
		self._reportoptions["emailedtoaddress"] = emailaddress

		r = OrderConfirmationPDF( self._reportoptions )
		output.write(r.stream())

class CreditNoteReport(ReportCommon):
	""" Handle the post ccreated note """

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )

	def post(self, comm ):
		"post"
		# get the report and send invoice
		params  = dict( customerid = self._reportoptions['icustomerid'],
		                audittrailid = self._reportoptions["audittrailid"],
						data = DBCompress.encode(self._parent._finaloutput.getvalue()))

		# need to update the audittrial with the data
		comm.execute( """UPDATE accounts.audittrail SET document = %(data)s WHERE audittrailid =  %(audittrailid)s""",  params)

		emailaddress = self._reportoptions.get ("email", "" )
		if emailaddress:
			params["emailedtoaddress"] = emailaddress
			params["subject"] = Credit_Note_Subject

			# issue with invoice number will need to access a central table
			email = EmailMessage(Constants.AccountsEmail,
			                     emailaddress,
			                     Credit_Note_Subject,
			                     Credit_Note_Body,
			                     "text/html")
			email.bcc = Constants.CopyEmail
			email.addAttachment(self._parent._finaloutput.getvalue() , "PRmax Credit Note.pdf" )
			email.BuildMessage()

			params = dict ( emailaddress = emailaddress ,
			                subject = Credit_Note_Subject,
			                customerid = self._reportoptions['icustomerid'],
			                message = DBCompress.encode(email),
			                emailqueuetypeid = Constants.EmailQueueType_Internal)

			comm.execute( """INSERT INTO queues.emailqueue(emailaddress,subject, message, emailqueuetypeid)
			VALUES(%(emailaddress)s,'subject',%(message)s,%(emailqueuetypeid)s)""",  params)

	def run( self, data , output ) :
		lines = []
		params = dict(customerid = self._reportoptions['icustomerid'])
		self.comm.execute( """SELECT customerid, contactname, contactjobtitle, customername, a.address1, a.address2, a.townname, a.county, a.postcode,co.countryname,
		vc.rate
		FROM internal.customers as c
		JOIN addresses as a ON a.addressid = c.addressid
		JOIN internal.terms as t ON t.termid = c.termid
		JOIN internal.prmaxcosts as pc ON pc.termid = c.termid AND pc.nbrofloginsid = c.nbrofloginsid
		LEFT OUTER JOIN internal.countries AS co ON co.countryid = c.countryid
		LEFT OUTER JOIN internal.vatcode AS vc ON vc.vatcodeid = co.vatcodeid

		WHERE customerid = %(customerid)s""",  params)
		details = self.comm.fetchone()
		address = [ row for row in details[1:10] if row]

		# check for non standard detail
		date = datetime.date.today().strftime("%d/%m/%Y")

		if self._reportoptions.has_key("cost"):
			cost = self._reportoptions['cost']
			vat =  self._reportoptions['vat']
			total = self._reportoptions['total']

		params = dict (
		  accnbr = str(details[0]),
		  nameaddress = address,
		  vatrate = details[10],
		  cost = "??%.2f"% (cost/100.00,),
		  vat = "??%.2f"% (vat/100.00,),
		  total = "??%.2f"% (total/100.00,),
		  creditnotedate = self._reportoptions["creditnotedate"],
		  message = self._reportoptions.get("message",""),
		  customerpaymentid = self._reportoptions["customerpaymentid"])
		self.comm.execute( """LOCK TABLE internal.prmaxsettings""")
		self.comm.execute( """SELECT lastcreditnotenbr FROM internal.prmaxsettings """)
		settings = self.comm.fetchone()
		self.comm.execute( """UPDATE internal.prmaxsettings SET lastcreditnotenbr = lastcreditnotenbr + 1""")
		params["creditnotenbr"] = str(settings[0]+1)
		if self._reportoptions.has_key ( "customerpaymentid"):
			self.comm.execute( """UPDATE accounts.customerpayments SET creditnotenbr = %(creditnotenbr)s WHERE customerpaymentid = %(customerpaymentid)s""", params )

		r = CreditNotePdf(params)
		output.write(r.stream())

class ReportEngagments(ReportCommon):
	"""Engagments"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )
		self._byissue = False

	def load_data(self, db_connect ):
		"Load Data"

		data_command = """SELECT
			ch.contacthistoryid,
			to_char(ch.taken, 'DD/MM/YYYY') as taken_display,
		  COALESCE(o.outletname,'') as outletname,
		  COALESCE(ch.details,'') as details,
		  COALESCE(ch.outcome,'') as outcome,
		  chs.contacthistorystatusdescription,
		  COALESCE(array_to_string(array(
		  SELECT i.name FROM userdata.issues AS i JOIN userdata.contacthistoryissues AS chi ON chi.issueid = i.issueid
		  WHERE chi.contacthistoryid = ch.contacthistoryid ORDER BY i.name), ', '),'') as issue
		FROM userdata.contacthistory AS ch
		LEFT OUTER JOIN outlets AS o ON o.outletid = ch.outletid
		LEFT OUTER JOIN internal.contacthistorystatus AS chs ON chs.contacthistorystatusid = ch.contacthistorystatusid"""

		whereclause = """WHERE ch.ref_customerid = %(icustomerid)s"""

		engagement_label = """SELECT crm_engagement, crm_engagement_plural FROM internal.customers WHERE customerid = %(icustomerid)s"""

		params = dict(icustomerid = self._reportoptions["customerid"])

		drange = simplejson.loads(self._reportoptions["drange"])
		option = TTLConstants.CONVERT_TYPES[drange["option"]]
		if option == TTLConstants.BEFORE:
			params["from_date"] = drange["from_date"]
			whereclause = BaseSql.addclause( whereclause, 'ch.taken <= %(from_date)s')
		elif option == TTLConstants.AFTER:
			# After
			params["from_date"] = drange["from_date"]
			whereclause = BaseSql.addclause( whereclause, 'ch.taken >= %(from_date)s')
		elif option == TTLConstants.BETWEEN:
			# ABetween
			params["from_date"] = drange["from_date"]
			params["to_date"] = drange["to_date"]
			whereclause = BaseSql.addclause( whereclause, 'ch.taken BETWEEN %(from_date)s AND %(to_date)s')

		is_dict = False if self._reportoptions["reportoutputtypeid"] in Constants.Phase_3_is_csv else True

		if self._byissue:
			self._reportoptions["byissue"] = True
			order_by = " ORDER BY issue"
			results = []
			tmp_results = db_connect.executeAll(data_command + " " + whereclause + " " + order_by , params, is_dict)
			issues = {}
			for result in  tmp_results:
				if result["issue"] not in issues:
					issues[result["issue"]] = {"issue": result["issue"], "engagement": []}
					results.append(issues[result["issue"]])
				issues[result["issue"]]["engagement"].append(result)
		else:
			results = db_connect.executeAll(data_command + " " + whereclause, params, is_dict)
		results_eng_label = db_connect.executeAll(engagement_label, params, False)

		return dict ( results = results, engagement_label = results_eng_label )

	def run( self, data , output ) :
		"run engagemnt report"

		report = EngagementPDF( self._reportoptions,  data["results"], data['engagement_label'])

		output.write(report.stream())

class ReportEngagments2(ReportEngagments):
	"""Engagments"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )
		self._byissue = True


class ClippingsPieChartReport(ReportCommon):
	"""Clippings Pie chart Reports"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )

	def load_data(self, db_connect ):
		"Load Data"

		data_command = """SELECT COUNT(c.clippingstypeid) as count_clippings, c.clippingstypeid, ct.clippingstypedescription
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """

		whereclause = ''
		groupbyclause = 'GROUP BY c.clippingstypeid, ct.clippingstypedescription'

		params = dict(icustomerid = self._reportoptions["customerid"])

		if "clientid" in self._reportoptions and self._reportoptions['clientid'] != '' and self._reportoptions['clientid'] is not None and self._reportoptions['clientid'] != -1 and self._reportoptions['clientid'] != '-1':
			whereclause = BaseSql.addclause(whereclause, 'c.clientid=%(clientid)s')
			params['clientid'] = int(self._reportoptions['clientid'])

		if 'issueid' in self._reportoptions and self._reportoptions['issueid'] != '' and self._reportoptions['issueid'] is not None  and self._reportoptions['issueid'] != -1 and self._reportoptions['issueid'] != '-1':
			whereclause = BaseSql.addclause(whereclause, 'EXISTS (SELECT clippingsissueid FROM userdata.clippingsissues AS ci WHERE ci.issueid = %(issueid)s AND ci.clippingid = c.clippingid)')
			params['issueid'] = int(self._reportoptions['issueid'])

		# tones on the filter
		if self._reportoptions.get("tones", None):
			whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % ",".join([str(tone) for tone in self._reportoptions["tones"]]))

		#date range

		drange = simplejson.loads(self._reportoptions["drange"])
		option = TTLConstants.CONVERT_TYPES[drange["option"]]

		if option == TTLConstants.BEFORE:
			params["from_date"] = drange['from_date']
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date <= %(from_date)s')
		elif option == TTLConstants.AFTER:
			params["from_date"] = drange['from_date']
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date >= %(from_date)s')
		elif option == TTLConstants.BETWEEN:
			params["from_date"] = drange['from_date']
			params["to_date"] = drange['to_date']
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN %(from_date)s AND %(to_date)s')

		is_dict = False if self._reportoptions["reportoutputtypeid"] in Constants.Phase_3_is_csv else True

		results = db_connect.executeAll(data_command + " " + whereclause + " " + groupbyclause,  params, is_dict)

		return dict ( results = results )

	def run( self, data , output ) :
		"run clippings report"

		report = ClippingsPieChartPDF( self._reportoptions,  data["results"])

		output.write(report.stream())

class ClippingsLinesChartReport(ReportCommon):
	"""Clippings Lines chart Reports"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )

	def load_data(self, db_connect ):
		"Load Data"

		data_command = """SELECT COUNT(c.clippingstypeid), c.clippingstypeid, ct.clippingstypedescription, c.clip_source_date
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """

		whereclause = 'c.customerid=:icustomerid'
		groupbyclause = 'GROUP BY c.clippingstypeid, ct.clippingstypedescription, c.clip_source_date'

		params = dict(icustomerid = self._reportoptions["customerid"])

		if "clientid" in self._reportoptions and self._reportoptions['clientid'] != '' and self._reportoptions['clientid'] is not None and self._reportoptions['clientid'] != -1 and self._reportoptions['clientid'] != '-1':
			whereclause = BaseSql.addclause(whereclause, 'c.clientid=%(clientid)s')
			params['clientid'] = int(self._reportoptions['clientid'])

		if 'issueid' in self._reportoptions and self._reportoptions['issueid'] != '' and self._reportoptions['issueid'] is not None  and self._reportoptions['issueid'] != -1 and self._reportoptions['issueid'] != '-1':
			whereclause = BaseSql.addclause(whereclause, 'EXISTS (SELECT clippingsissueid FROM userdata.clippingsissues AS ci WHERE ci.issueid = %(issueid)s AND ci.clippingid = c.clippingid)')
			params['issueid'] = int(self._reportoptions['issueid'])

		# tones on the filter
		if self._reportoptions.get("tones", None):
			whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % ",".join([str(tone) for tone in self._reportoptions["tones"]]))

		#date range

		drange = simplejson.loads(self._reportoptions["drange"])
		option = TTLConstants.CONVERT_TYPES[drange["option"]]

		if option == TTLConstants.BEFORE:
			params["from_date"] = drange['from_date']
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date <= %(from_date)s')
		elif option == TTLConstants.AFTER:
			params["from_date"] = drange['from_date']
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date >= %(from_date)s')
		elif option == TTLConstants.BETWEEN:
			params["from_date"] = drange['from_date']
			params["to_date"] = drange['to_date']
			whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN %(from_date)s AND %(to_date)s')

		is_dict = False if self._reportoptions["reportoutputtypeid"] in Constants.Phase_3_is_csv else True

		results = db_connect.executeAll(data_command + " " + whereclause + " " + groupbyclause,  params, is_dict)

		return dict ( results = results )

	def run( self, data , output ) :
		"run clippings report"

		report = ClippingsLinesChartPDF( self._reportoptions,  data["results"])

		output.write(report.stream())


class PartnersListCustomersReport(ReportCommon):
	"""Listing Partner's Customers"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )
		self._GetDefaultShopSettings(report_id = 'P L',
		                             reportname = 'Partner Customers List')

	def load_data(self, db_connect ):
		"Load Data"

		data_command = """SELECT c.customername, c.contactname, cs.customerstatusname
		FROM internal.customers AS c
		LEFT OUTER JOIN internal.customerstatus AS cs ON c.customerstatusid = cs.customerstatusid
		WHERE customersourceid = %(customersourceid)s"""

		customersource = """SELECT customersourcedescription, name, address1, address2, townname, postcode, countryname
		FROM internal.customersources as cs
		LEFT OUTER JOIN communications as com ON cs.communicationid = com.communicationid
		LEFT OUTER JOIN addresses as a ON com.addressid = a.addressid
		LEFT OUTER JOIN internal.countries as c ON c.countryid = a.countryid
		WHERE customersourceid = %(customersourceid)s"""

		orderby = ''' ORDER BY c.customername'''
		andclause= ''
		if "customerstatusid" in self._reportoptions and 0 != int(self._reportoptions['customerstatusid']):
			andclause = ''' AND c.customerstatusid = %(customerstatusid)s'''
			if Constants.Customer_Active == int(self._reportoptions['customerstatusid']):
				andclause += ''' AND licence_expire > %(today)s'''

		is_dict = False if int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_3_is_csv \
				or int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_5_is_excel \
				else True
		params = dict(customersourceid = self._reportoptions["customersourceid"], customerstatusid = self._reportoptions['customerstatusid'], today = date.today().strftime("%Y-%m-%d"))
		results = db_connect.executeAll(data_command  + andclause + orderby, params, is_dict)
		results_customersource = db_connect.executeAll(customersource, params, is_dict)
		return dict ( results = results, customersource = results_customersource)

	def run( self, data , output ) :
		"run partners report"

		if int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_5_is_excel:
				report = PartnersListExcel(self._reportoptions,  data["results"], data["customersource"])
		elif int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_2_is_pdf:
				report = PartnersListPDF( self._reportoptions,  data["results"], data["customersource"])
		output.write(report.stream())


class PartnersStatementReport(ReportCommon):
	"""Listing Partner's Customers"""

	def __init__(self, reportoptions, parent):
		ReportCommon.__init__ (self, reportoptions, parent )
		self._GetDefaultShopSettings(report_id = 'P S',
		                             reportname = 'Partner Statement')

	def load_data(self, db_connect ):
		"Load Data"

		data_payments = """SELECT c.customername, actualdate, invoicenbr, customerpaymenttypename, abs(unallocated) as unallocated
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.customerpayments AS pay ON c.customerid = pay.customerid
		LEFT OUTER JOIN internal.customerpaymenttypes AS cpt ON cpt.customerpaymenttypeid = pay.paymenttypeid
		WHERE unallocated != 0
		AND c.customersourceid = %(customersourceid)s
		ORDER BY actualdate desc"""

		data_payments_adj = """SELECT c.customername, adjustmentdate, reason, adjustmenttypedescriptions, abs(unallocated) as unallocated
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.adjustments AS adj ON c.customerid = adj.customerid
		LEFT OUTER JOIN internal.adjustmenttypes AS adjt ON adjt.adjustmenttypeid = adj.adjustmenttypeid
		WHERE unallocated != 0
		AND adj.adjustmenttypeid = 6
		AND c.customersourceid = %(customersourceid)s
		ORDER BY adjustmentdate desc"""

		data_invoices = """SELECT c.customername, invoicedate, invoicenbr, invoiceamount, abs(unpaidamount) as unpaidamount
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.customerinvoices AS ci ON c.customerid = ci.customerid
		WHERE unpaidamount != 0
		AND c.customersourceid = %(customersourceid)s
		ORDER BY invoicedate desc"""

		data_invoices_adj = """SELECT c.customername, adjustmentdate, reason, adjustmenttypedescriptions, abs(unallocated) as unallocated
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.adjustments AS adj ON c.customerid = adj.customerid
		LEFT OUTER JOIN internal.adjustmenttypes AS adjt ON adjt.adjustmenttypeid = adj.adjustmenttypeid
		WHERE unallocated != 0
		AND adj.adjustmenttypeid != 6
		AND c.customersourceid = %(customersourceid)s
		ORDER BY adjustmentdate desc"""

		payments_subtotal = """SELECT sum(abs(unallocated)) as total
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.customerpayments AS pay ON c.customerid = pay.customerid
		LEFT OUTER JOIN internal.customerpaymenttypes AS cpt ON cpt.customerpaymenttypeid = pay.paymenttypeid
		WHERE unallocated != 0
		AND c.customersourceid = %(customersourceid)s"""

		payments_adj_subtotal = """SELECT sum(abs(unallocated)) as total
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.adjustments AS adj ON c.customerid = adj.customerid
		WHERE unallocated != 0
		AND adj.adjustmenttypeid = 6
		AND c.customersourceid = %(customersourceid)s"""

		invoices_subtotal = """SELECT sum(abs(unpaidamount)) as total
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.customerinvoices AS ci ON c.customerid = ci.customerid
		WHERE unpaidamount != 0
		AND c.customersourceid = %(customersourceid)s"""

		invoices_adj_subtotal = """SELECT sum(abs(unallocated)) as total
		FROM internal.customers AS c
		LEFT OUTER JOIN accounts.adjustments AS adj ON c.customerid = adj.customerid
		WHERE unallocated != 0
		AND adj.adjustmenttypeid != 6
		AND c.customersourceid = %(customersourceid)s"""

		customersource = """SELECT customersourcedescription, name, address1, address2, townname, postcode, countryname
		FROM internal.customersources as cs
		LEFT OUTER JOIN communications as com ON cs.communicationid = com.communicationid
		LEFT OUTER JOIN addresses as a ON com.addressid = a.addressid
		LEFT OUTER JOIN internal.countries as c ON c.countryid = a.countryid
		WHERE customersourceid = %(customersourceid)s"""

		params = dict(customersourceid = self._reportoptions["customersourceid"])
		is_dict = False if int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_3_is_csv \
		        or int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_5_is_excel \
		        else True
		results_customersource = db_connect.executeAll(customersource, params, is_dict)
		results_invoices = db_connect.executeAll(data_invoices, params, is_dict)
		results_invoices_adj = db_connect.executeAll(data_invoices_adj, params, is_dict)
		results_payments = db_connect.executeAll(data_payments, params, is_dict)
		results_payments_adj = db_connect.executeAll(data_payments_adj, params, is_dict)
		results_pay_total = db_connect.executeAll(payments_subtotal, params, False)
		results_pay_adj_total = db_connect.executeAll(payments_adj_subtotal, params, False)
		results_invoice_total = db_connect.executeAll(invoices_subtotal, params, False)
		results_invoice_adj_total = db_connect.executeAll(invoices_adj_subtotal, params, False)
		pay_total = 0
		invoice_total = 0
		if results_pay_total[0][0] and results_pay_total[0][0] != None:
			pay_total += results_pay_total[0][0]
		if results_pay_adj_total[0][0] and results_pay_adj_total[0][0] != None:
			pay_total += results_pay_adj_total[0][0]
		if results_invoice_total[0][0] and results_invoice_total[0][0] != None:
			invoice_total += results_invoice_total[0][0]
		if results_invoice_adj_total[0][0] and results_invoice_adj_total[0][0] != None:
			invoice_total += results_invoice_adj_total[0][0]

 		data = dict(
				 invoices = results_invoices,
				 invoices_adj = results_invoices_adj,
				 payments = results_payments,
				 payments_adj = results_payments_adj,
				 pay_total = pay_total,
				 invoice_total = invoice_total,
				 customersource = results_customersource
		 )
		return data

	def run( self, data , output ) :
		"run partners report"


		if int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_5_is_excel:
				report = PartnersStatementExcel( self._reportoptions,  data["invoices"], data["invoices_adj"], data["payments"], data["payments_adj"], data["pay_total"], data["invoice_total"], data["customersource"])
		elif int(self._reportoptions["reportoutputtypeid"]) in Constants.Phase_2_is_pdf:
				report = PartnersStatementPDF( self._reportoptions,  data["invoices"], data["invoices_adj"], data["payments"], data["payments_adj"], data["pay_total"], data["invoice_total"], data["customersource"])
		output.write(report.stream())




