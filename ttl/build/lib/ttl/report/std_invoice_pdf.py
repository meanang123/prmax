# -*- coding: utf-8 -*-
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import cStringIO
import os
import datetime, time

from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import tables
from reportlab.platypus.doctemplate import *
from reportlab.platypus import PageBreak,FrameBreak
from reportlab.platypus.tables import TableStyle
from reportlab.lib.units import cm
import reportlab.lib.colors as colors
from reportlab.lib.pdfencrypt import StandardEncryption
from reportlab.lib.enums import *
from reportlab.platypus import tables
from ttl.report.pdf_fields import *
from ttl.labels  import Line

from reportlab.lib.utils import ImageReader


Table = tables.Table

HEADING_STYLE2=ParagraphStyle(name='heading2',
							 fontName='Helvetica-Bold',
							 fontSize=16,
							 alignment=TA_LEFT,
							 valign = 'MIDDLE'
						 )


HEADING_STYLE=ParagraphStyle(name='heading',
							 fontName='Helvetica-Bold',
							 fontSize=14,
							 alignment=TA_RIGHT,
							 valign = 'MIDDLE'
						 )

HEADING_STYLE_LEFT=ParagraphStyle(name='heading',
							 fontName='Helvetica-Bold',
							 fontSize=14,
							 alignment=TA_LEFT,
							 valign = 'MIDDLE'
						 )

HEADING_SMALL=ParagraphStyle(name='data',
							 fontName='Helvetica',
							 fontSize=8,
							 alignment=TA_RIGHT,
							 valign = 'MIDDLE'
							 )

DETAILS_LEFT=ParagraphStyle(name='details_left',
							 fontName='Helvetica',
							 fontSize=10,
							 alignment=TA_LEFT,
							 valign = 'MIDDLE'
							 )

DETAILS_RIGHT=ParagraphStyle(name='details_right',
							 fontName='Helvetica',
							 fontSize=10,
							 alignment=TA_RIGHT,
							 valign = 'MIDDLE'
							 )
DETAILS_CENTER=ParagraphStyle(name='details_middle',
							 fontName='Helvetica',
							 fontSize=10,
							 alignment=TA_CENTER,
							 valign = 'MIDDLE'
							 )

DETAILS_RIGHT_TOTAL=ParagraphStyle(name='details_right_total',
							 fontName='Helvetica-Bold',
							 fontSize=12,
							 alignment=TA_RIGHT,
							 valign = 'MIDDLE'
							 )

BOTTOM_1 =ParagraphStyle(name='bottom_1',
							 fontName='Helvetica',
							 fontSize=6,
							 alignment=TA_CENTER,
							 valign = 'MIDDLE'
							 )



STD_FRAME = TableStyle(
	[
		#('GRID', (0,0), (-1,-1),1 , colors.blue),
    ('VALIGN',(0, 0),(-1,-1),'TOP'),
	])
STD2_FRAME = TableStyle(
	[
		#('GRID', (0,0), (-1,-1),1 , colors.blue),
		#('LINEBELOW',(0,-1), (-1,-1), .1, colors.black),

	])

SEO_FRAME = TableStyle(
	[
		('GRID', (0,0), (-1,-1), .1 , colors.black),
		('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
    ('VALIGN',(0, 0),(-1,-1),'MIDDLE'),
    ('FONTNAME',(0,-1),(-1,-1),'Helvetica-Bold')
	])


class InvoicePDF(object):
	"""
	"""
	# common page format for both templates:
	def logoAndHeader(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()
		banner_height=1.0*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height
		tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/PRmaxletterheadtop.png'))
		Im = ImageReader(tmp)
		data = canvas.drawImage( Im, doc.leftMargin, ypos, 550,40)

		tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/PRmaxletterheadbot.png'))
		Im = ImageReader(tmp)
		ypos=doc.bottomMargin- 30
		data = canvas.drawImage( Im, doc.leftMargin, ypos, 550,40)

		canvas.restoreState()


	class InvoicePDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header=page_header
			doc=parent.document
			showframes = 0
			PageTemplate.__init__(self, "Listing2PDFTemplate",
							[Frame(12*cm, 24*cm,8*cm, 5*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 24*cm, 10*cm, 3*cm,0,0,0,0,None,showframes),
							 Frame(8*cm, 18*cm,7*cm, 1*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 19*cm,12*cm, 5*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 17*cm,18*cm, 1*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 13*cm,18*cm, 4*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 3*cm,(doc.width/4)*3, 10*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 3*cm,doc.width, 2*cm,0,0,0,0,None,showframes),
			         Frame(0, 2*cm,doc.width, 1*cm,0,0,0,0,None,showframes),
							 ])

		def beforeDrawPage(self, canvas, doc):
			self.parent.logoAndHeader(canvas,doc)

	class SEOInvoicePDFTemplate(PageTemplate):
		"""SEO details"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header=page_header
			doc=parent.document
			showframes = 0
			PageTemplate.__init__(self, "SEOInvoicePDFTemplate",
							[Frame(12*cm, 24*cm,8*cm, 5*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 24*cm,7*cm, 3*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 2*cm,18*cm, 22*cm,0,0,0,0,None,showframes),

							 ])

		def beforeDrawPage(self, canvas, doc):
			self.parent.logoAndHeader(canvas,doc)


	def __init__(self, page_header):
		"""
		"""
		self._vatno = "979 7008 65"
		self._vatline = ""
		self._invoice_type_name = "Invoice"
		self._lineheight = 11
		if page_header.has_key("isproforma"):
			self._vatno = ""
			self._vatline = "This is not a vat invoice; a vat invoice will be sent once payment has been received"
			self._invoice_type_name = "Proforma Invoice"
		elif page_header.has_key("vatrate") and page_header["vatrate"] ==0:
			self._vatno = ""
		self._custvatno = page_header.get("vatnumber","")
		self._purchase_order = page_header.get("purchase_order","")
		self._show_bank = page_header.get("show_bank",False)
		self._distribution_label = page_header.get("distribution_description")
		self._distribution_label_plural = page_header.get("distribution_description_plural")

		self.report=cStringIO.StringIO()

		self.document = BaseDocTemplate(self.report,
						leftMargin=1*cm,
						rightMargin=1*cm,
						topMargin=1*cm,
						bottomMargin=1.5*cm,
		        author = "Chris Hoy",
						pageCompression = 1,
						title = "PRmax Invoice"
		        #encrypt = StandardEncryption("prmax", None, 1, 0, 1, 0, 40)
						)

		for ptclass in (self.InvoicePDFTemplate,self.SEOInvoicePDFTemplate):
			pt=ptclass(self,page_header)
			self.document.addPageTemplates(pt)

		self.page_header=page_header

		self.objects = []

	def write(self,filename):
		# process all stuff, then write the report

		self.buildInvoice()
		self.document.build(self.objects)
		open(filename,'wb').write(self.report.getvalue())

	def stream(self):
		# process all stuff, then write the report

		self.buildInvoice()
		self.document.build(self.objects)
		return self.report.getvalue()


	def _do_common_header(self):
		""" Common header on each page """
		self.append(FrameBreak())
		data = [
			(Paragraph("Account Number: ",DETAILS_LEFT),Paragraph(self.page_header["accnbr"],DETAILS_RIGHT),),
			(Paragraph("Date: ",DETAILS_LEFT),Paragraph(self.page_header["invoicedate"],DETAILS_RIGHT),),
			]
		if self._vatno:
			data.append((Paragraph("VAT No:",DETAILS_LEFT),Paragraph(self._vatno,DETAILS_RIGHT),))

		if self._custvatno:
			data.append((Paragraph("Customer VAT No:",DETAILS_LEFT),Paragraph(self._custvatno,DETAILS_RIGHT),))

		if "invoicenbr" in self.page_header:
			data.insert(1,(Paragraph("Invoice Number: ",DETAILS_LEFT),Paragraph(self.page_header["invoicenbr"],DETAILS_RIGHT),))
		else:
			data.insert(1,(Paragraph("Proforma Number: ",DETAILS_LEFT),Paragraph("%d"%time.time(),DETAILS_RIGHT),))

		self.append( Table ( data , None , [self._lineheight,]*len(data) , style = STD_FRAME))

		if self._purchase_order:
			data = ((Paragraph("PO Number:",DETAILS_LEFT),Paragraph(self._purchase_order,DETAILS_RIGHT),), )
			self.append( Table ( data , None , [self._lineheight * 2,]*len(data) , style = STD_FRAME))

		self.append(FrameBreak())

	def buildInvoice(self):
		"builds the individual Billing pages"
		self._do_common_header()
		self.append(Paragraph(self._invoice_type_name,HEADING_STYLE2))
		self.append(FrameBreak())
		data = [(Paragraph(row,DETAILS_LEFT),) for row in self.page_header["nameaddress"] ]
		self.append( Table ( data , None , [self._lineheight,]*len(data), style = STD_FRAME))
		self.append(FrameBreak())

		self.append(Paragraph(self.page_header["licencedetails"] ,DETAILS_LEFT))
		self.append(FrameBreak())
		self.append(Paragraph(self.page_header.get("message","").replace("\n","<br/>"),DETAILS_LEFT))
		self.append(FrameBreak())

		#
		if "advcost" in self.page_header or \
		   "updatumcost" in self.page_header or \
		   "seocost" in self.page_header or \
			 "clippingsfee" in self.page_header or \
		   "clippingscost" in self.page_header or \
		   "intcost" in self.page_header:
			# module costs
			if "has_bundled_invoice" not in self.page_header:
				if "corecost" in self.page_header:
					data = [(Paragraph("Media Database",DETAILS_RIGHT),Paragraph(self.page_header["corecost"],DETAILS_RIGHT),)]
				else:
					data = []
				if "advcost" in self.page_header:
					data.append ( (Paragraph("Forward Features",DETAILS_RIGHT),Paragraph(self.page_header["advcost"],DETAILS_RIGHT),))
				if "updatumcost" in self.page_header:
					data.append ( (Paragraph("Monitoring",DETAILS_RIGHT),Paragraph(self.page_header["updatumcost"],DETAILS_RIGHT),))
				if "seocost" in  self.page_header:
					data.append ( (Paragraph("SEO %s" %self._distribution_label,DETAILS_RIGHT),Paragraph(self.page_header["seocost"],DETAILS_RIGHT),))
				if "intcost" in  self.page_header:
					data.append ( (Paragraph("International",DETAILS_RIGHT),Paragraph(self.page_header["intcost"],DETAILS_RIGHT),))
				if "clippingscost" in  self.page_header:
					data.append ( (Paragraph("Clippings Cost",DETAILS_RIGHT),Paragraph(self.page_header["clippingscost"],DETAILS_RIGHT),))
			else:
				data = [(Paragraph("Cost ",DETAILS_RIGHT),Paragraph(self.page_header["cost"],DETAILS_RIGHT),)]

			if "clippingsfee" in self.page_header:
				data.append ( (Paragraph("Clippings Fee %s" % self.page_header["clippingsfee_period"],DETAILS_RIGHT),Paragraph(self.page_header["clippingsfee"],DETAILS_RIGHT),))

			data.append ( (Paragraph("Total",DETAILS_RIGHT_TOTAL),Paragraph(self.page_header["total"],DETAILS_RIGHT_TOTAL),))
		else:
			data = [
			  (Paragraph("Cost ",DETAILS_RIGHT),Paragraph(self.page_header["cost"],DETAILS_RIGHT),),
			  (Paragraph("Total",DETAILS_RIGHT_TOTAL),Paragraph(self.page_header["total"],DETAILS_RIGHT_TOTAL),),
			]

			if "clippingfee" in self.page_header:
				data.insert(0, (Paragraph("Clippings Fee %s" % self.page_header["clippingfee_period"],DETAILS_RIGHT),Paragraph(self.page_header["clippingfee"],DETAILS_RIGHT),))

		# add the vat if no country or country code == 1
		if self.page_header.has_key("vatrate") and self.page_header["vatrate"] >0 :
			data.insert(len(data)-1,(Paragraph("VAT @ 20.00%  ",DETAILS_RIGHT),Paragraph(self.page_header["vat"],DETAILS_RIGHT),),)

		self.append( Table ( data , style = STD2_FRAME))

		if self.page_header.has_key("isproforma"):
			self.append ( Spacer(10,50))
			self._bank_details()
		else:
			self.append ( Spacer(10,50))
			self.append(Paragraph(self.page_header["paymentline"] ,DETAILS_CENTER))

		self.append(Paragraph('Your annual subscription terms and conditions are attached.' ,DETAILS_CENTER))

		self.append(FrameBreak())
		if self._vatline:
			self.append(Paragraph(self._vatline ,DETAILS_LEFT))
		if self._show_bank:
			self._bank_details()
		self.append(FrameBreak())
		self.append(Paragraph("Any queries, please email accounts@prmax.co.uk or call accounts on 01582 380194" ,DETAILS_CENTER))
		self.append(Paragraph("Address : PRmax Ltd, 222 Chertsey Lane, Staines, TW18 3NF" ,DETAILS_CENTER))

		if "seolines" in self.page_header:
			self._do_seo_lines()

	def _bank_details(self):
		"Show Bank Details"
		data = [ (Paragraph("Bank",DETAILS_LEFT),Paragraph("Lloyds TSB, Chichester Branch",DETAILS_LEFT),),
		         (Paragraph("Account name",DETAILS_LEFT),Paragraph("PRMAX LTD",DETAILS_LEFT),),
		         (Paragraph("Sort code",DETAILS_LEFT),Paragraph("30-91-97",DETAILS_LEFT),),
		         (Paragraph("Acct #",DETAILS_LEFT),Paragraph("02521457",DETAILS_LEFT),),
		         (Paragraph("Cheques Payable To",DETAILS_LEFT),Paragraph("PRMAX LTD",DETAILS_LEFT),)
		         ]
		self.append( Table ( data ,(4*cm, 10*cm) , [self._lineheight,]*len(data), style = STD_FRAME))

	def _seo_header(self):
		"""Do Header"""
		self.objects.append(NextPageTemplate('SEOInvoicePDFTemplate'))
		self.objects.append(PageBreak())
		self._do_common_header()
		self.append(Paragraph("SEO %s Breakdown" %self._distribution_label,HEADING_STYLE2))
		self.append ( Spacer(10,10))

	def _do_seo_lines(self):
		"""Add the seo lines to the backing pages """
		#self._seo_header()
		data = self._start_seo_page(None, 0, "")
		seovalue = 0
		for row in self.page_header["seolines"]:
			data.append(row[:3])
			seovalue += row[3]

			if len(data) > 42:
				data = self._start_seo_page(data, "£%.2f" % (seovalue/100.0), "Page Total" )
				seovalue = 0

		self._start_seo_page(data, "£%.2f" % (seovalue/100.0), "Page Total")
		self._seo_total_row()

	def _seo_total_row( self ):
		"""Grand Total"""

		self.append( Table ( (("", "Total", self.page_header["seocost"] ), ) ,\
		                     (2*cm, 13.5 * cm, 2.5*cm) , (20, ) , style = SEO_FRAME))

	def _start_seo_page(self, data, seovalue,  seototaltype):
		"""add the seo heading """
		if data:
			if seovalue:
				data.append([ "", seototaltype, seovalue])
			self._seo_header()
			self.append( Table ( data ,(2*cm, 13.5 * cm, 2.5*cm) , [20, ] + [13,]*(len(data)-1), style = SEO_FRAME))

		return  [ (Paragraph("Date",HEADING_STYLE_LEFT),
		           Paragraph("Description",HEADING_STYLE_LEFT),
		           Paragraph("Price",HEADING_STYLE_LEFT)), ]

	def append(self, object) :
		"""Appends an object to our platypus "story" (using ReportLab's terminology)."""
		self.objects.append(object)

	def extend(self,objects):
		self.objects.extend(objects)
