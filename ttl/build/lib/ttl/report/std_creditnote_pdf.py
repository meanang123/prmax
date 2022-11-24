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
	])
STD2_FRAME = TableStyle(
	[
		#('GRID', (0,0), (-1,-1),1 , colors.blue),
		#('LINEBELOW',(0,-1), (-1,-1), .1, colors.black),

	])

class CreditNotePdf(object):
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
							 Frame(2*cm, 24*cm,7*cm, 3*cm,0,0,0,0,None,showframes),
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

	def __init__(self,page_header):
		"""
		"""
		self._vatno = "979 7008 65"
		self._vatline = ""
		self._invoice_type_name = "Credit Note"
		self._lineheight = 11
		self._custvatno = page_header.get("vatnumber","")

		self.report=cStringIO.StringIO()

		self.document = BaseDocTemplate(self.report,
						leftMargin=1*cm,
						rightMargin=1*cm,
						topMargin=1*cm,
						bottomMargin=1.5*cm,
		        author = "Chris Hoy",
						pageCompression = 1,
						title = "PRmax Credit Note",
		        encrypt = StandardEncryption("",
		                                     None, 1, 0, 1, 0, 40)
						)

		for ptclass in (self.InvoicePDFTemplate,):
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

	def buildInvoice(self):
		"builds the individual Billing pages"
		# do the header:
		self.append(FrameBreak())
		data = [
			(Paragraph("Account Number: ",DETAILS_LEFT),Paragraph(self.page_header["accnbr"],DETAILS_RIGHT),),
			(Paragraph("Date: ",DETAILS_LEFT),Paragraph(self.page_header["creditnotedate"],DETAILS_RIGHT),),
			]
		if self._vatno:
			data.append((Paragraph("VAT No:",DETAILS_LEFT),Paragraph(self._vatno,DETAILS_RIGHT),))

		if self._custvatno:
			data.append((Paragraph("Customer VAT No:",DETAILS_LEFT),Paragraph(self._custvatno,DETAILS_RIGHT),))

		if self.page_header.has_key("creditnotenbr"):
			data.insert(1,(Paragraph("Credit Number: ",DETAILS_LEFT),Paragraph(self.page_header["creditnotenbr"],DETAILS_RIGHT),))

		self.append( Table ( data , None , [self._lineheight,]*len(data) , style = STD_FRAME))
		self.append(FrameBreak())
		self.append(Paragraph(self._invoice_type_name,HEADING_STYLE2))
		self.append(FrameBreak())
		data = [(Paragraph(row,DETAILS_LEFT),) for row in self.page_header["nameaddress"] ]
		self.append( Table ( data , None , [self._lineheight,]*len(data), style = STD_FRAME))
		self.append(FrameBreak())
		self.append(Paragraph("" ,DETAILS_LEFT))
		self.append(FrameBreak())
		self.append(Paragraph(self.page_header.get("message","").replace("\n","<br/>"),DETAILS_LEFT))
		self.append(FrameBreak())

		# add modules here?

		data = [
			(Paragraph("Credit ",DETAILS_RIGHT),Paragraph(self.page_header["cost"],DETAILS_RIGHT),),
			(Paragraph("Total Credit",DETAILS_RIGHT_TOTAL),Paragraph(self.page_header["total"],DETAILS_RIGHT_TOTAL),),
		    ]

		# add the vat if no country or country code == 1
		if self.page_header.has_key("vatrate") and self.page_header["vatrate"] >0 :
			data.insert(1,(Paragraph("VAT @ 20.00%  ",DETAILS_RIGHT),Paragraph(self.page_header["vat"],DETAILS_RIGHT),),)

		self.append( Table ( data , style = STD2_FRAME))

		self.append(FrameBreak())
		self.append(Paragraph(self._vatline ,DETAILS_LEFT))
		self.append(FrameBreak())
		self.append(Paragraph("Any queries, please email accounts@prmax.co.uk or call accounts on 01582 380194" ,DETAILS_CENTER))
		self.append(Paragraph("Address : PRmax Ltd, 222 Chertsey Lane, Staines, TW18 3NF" ,DETAILS_CENTER))

	def append(self, object) :
		"""Appends an object to our platypus "story" (using ReportLab's terminology)."""
		self.objects.append(object)

	def extend(self,objects):
		self.objects.extend(objects)
