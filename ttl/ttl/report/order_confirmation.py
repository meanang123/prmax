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

class OrderConfirmationPDF(object):
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


	class OrderConfirmationPDFTemplate(PageTemplate) :
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
							 Frame(2*cm, 13*cm,18*cm, 5*cm,0,0,0,0,None,showframes),
							 Frame(2*cm, 3*cm,(doc.width/4)*3, 10*cm,0,0,0,0,None,showframes),
			         Frame(0, 2*cm,doc.width, 1*cm,0,0,0,0,None,showframes),
							 ])

		def beforeDrawPage(self, canvas, doc):
			self.parent.logoAndHeader(canvas,doc)

	def __init__(self,page_header):
		"""
		"""
		self._lineheight = 11
		self._invoice_type_name = "Order Confirmation"
		self._purchase_order = page_header.get("purchase_order","")

		self.report=cStringIO.StringIO()

		self.document = BaseDocTemplate(self.report,
						leftMargin=1*cm,
						rightMargin=1*cm,
						topMargin=1*cm,
						bottomMargin=1.5*cm,
		        author = "Chris Hoy",
						pageCompression = 1,
						title = "Order Confirmation",
		        encrypt = StandardEncryption("",
		                                     None, 1, 0, 1, 0, 40)
						)

		for ptclass in (self.OrderConfirmationPDFTemplate,):
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
			(Paragraph("Date: ",DETAILS_LEFT),Paragraph(self.page_header["orderdate"],DETAILS_RIGHT),),
			]
		self.append( Table ( data , None , [self._lineheight,]*len(data) , style = STD_FRAME))
		self.append(FrameBreak())
		self.append(Paragraph(self._invoice_type_name,HEADING_STYLE2))
		self.append(FrameBreak())
		data = [(Paragraph(row,DETAILS_LEFT),) for row in self.page_header["nameaddress"] ]
		self.append( Table ( data , None , [self._lineheight,]*len(data), style = STD_FRAME))
		self.append(FrameBreak())
		self.append(Paragraph(self.page_header.get("message","").replace("\n","<br/>"),DETAILS_LEFT))
		self.append(FrameBreak())
		data = [("",
		         Paragraph("Unit",DETAILS_RIGHT),
		         Paragraph("VAT @ 20.00%",DETAILS_RIGHT),
		         Paragraph("Total",DETAILS_RIGHT),)]
		for row in self.page_header["breakdown"][:-1]:
			data.append((Paragraph(row[0],DETAILS_RIGHT),
			 Paragraph("%.2f" %row[1],DETAILS_RIGHT),
			 Paragraph("%.2f" %row[2],DETAILS_RIGHT),
			 Paragraph("%.2f" %row[3],DETAILS_RIGHT)))
		row  = self.page_header["breakdown"][-1]
		data.append((Paragraph(row[0],DETAILS_RIGHT_TOTAL),
		    Paragraph("%.2f" % row[1],DETAILS_RIGHT_TOTAL),
		    Paragraph("%.2f" % row[2],DETAILS_RIGHT_TOTAL),
		    Paragraph("%.2f" % row[3],DETAILS_RIGHT_TOTAL)))

		self.append( Table ( data , style = STD2_FRAME))

		self.append ( Spacer(10,50))
		data = [ (Paragraph("Bank",DETAILS_LEFT),Paragraph("Lloyds TSB, Chichester Branch",DETAILS_LEFT),),
		         (Paragraph("Account name",DETAILS_LEFT),Paragraph("PRMAX LTD",DETAILS_LEFT),),
		         (Paragraph("Sort code",DETAILS_LEFT),Paragraph("30-91-97",DETAILS_LEFT),),
		         (Paragraph("Acct #",DETAILS_LEFT),Paragraph("02521457",DETAILS_LEFT),),
		         (Paragraph("Cheques Payable To",DETAILS_LEFT),Paragraph("PRMAX LTD",DETAILS_LEFT),)
		         ]
		self.append( Table ( data ,(4*cm,6*cm) , [self._lineheight,]*len(data), style = STD_FRAME))

		self.append(FrameBreak())
		self.append(Paragraph("Any queries, please email accounts@prmax.co.uk or call accounts on 01582 380194", DETAILS_CENTER))
		self.append(Paragraph("Accounts, PRmax Ltd, Suite F, Diss Business Park, Hopper Way, Diss, IP22 4GT" ,DETAILS_CENTER))


	def append(self, object) :
		"""Appends an object to our platypus "story" (using ReportLab's terminology)."""
		self.objects.append(object)

	def extend(self,objects):
		self.objects.extend(objects)
