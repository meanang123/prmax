# -*- coding: utf-8 -*-
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import cStringIO
import os
import datetime

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


Table = tables.Table


HEADING_STYLE=ParagraphStyle(name='heading',
							 fontName='Helvetica-Bold',
							 fontSize=10,
							 alignment=TA_LEFT,
							 valign = 'MIDDLE'
						 )
DATA_STYLE=ParagraphStyle(name='data',
							 fontName='Helvetica',
							 fontSize=10,
							 alignment=TA_LEFT,
							 valign = 'MIDDLE'
							 )

STD_FRAME = TableStyle(
	[
		#('GRID', (0,0), (-1,-1),1 , colors.blue),
	])

class Listing2PDF(object):
	"""
	"""
	# common page format for both templates:
	def logoAndHeader(self, canvas, doc, text_left='',text_centre='',text_right='') :
		"""Draws a logo and text on each page."""
		canvas.saveState()
		banner_height=0.75*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height
		canvas.drawImage(os.path.normpath(os.path.join(os.path.dirname(__file__),
													   'resources/%s'% self.page_header["headerimage"])),
						 doc.leftMargin, ypos+.25)

		FONT_TYPE='Helvetica'
		FONT_TYPE_BOLD='Helvetica-Bold'

		canvas.setFont(FONT_TYPE_BOLD, 14)
		x_centre=doc.width/2.0 + 1.5*cm
		ypos=ypos + 0.75*cm
		canvas.drawCentredString(x_centre, ypos,self.prmax_info['name'])
		canvas.setFont(FONT_TYPE, 11)

		if text_right:
			canvas.setFont(FONT_TYPE, 8)
			canvas.drawString(doc.width - 1*cm, ypos,text_right)


		canvas.setFont(FONT_TYPE, 10)

		if text_centre:
			ypos1=ypos-0.5*cm
			canvas.setFont(FONT_TYPE, 10)
			canvas.drawCentredString(x_centre, ypos1,text_centre[0])

			ypos1=ypos1-0.35*cm
			canvas.drawCentredString(x_centre, ypos1,text_centre[1])

		ypos=ypos-1.1*cm
		if text_left:
			canvas.setFont(FONT_TYPE, 11)
			canvas.drawString(0.75*cm, ypos,text_left)

		canvas.setFont(FONT_TYPE, 9)
		canvas.drawString(0.75*cm, 0.75*cm,self.page_header["strapline"])

		canvas.setFont(FONT_TYPE, 8)
		right_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(doc.width-2*cm, 0.75*cm,right_text)
		canvas.restoreState()


	class Listing2PDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.pages = 1
			self.page_header=page_header
			doc=parent.document
			frametop_height=1.5*cm
			self.main_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height,6,6,6,6,None,0)

			PageTemplate.__init__(self, "Listing2PDFTemplate",[self.main_frame])

		def beforeDrawPage(self, canvas, doc):

			prmax_info=self.page_header['prmax_info']

			right_text='Page %d'%self.pages
			self.pages+=1
			self.parent.logoAndHeader(canvas,doc,"",(self.page_header["reportname"],""),right_text)

	def __init__(self,page_header, rows):
		"""
		"""

		self.report=cStringIO.StringIO()

		self.document = BaseDocTemplate(self.report,
						leftMargin=1*cm,
						rightMargin=1*cm,
						topMargin=1*cm,
						bottomMargin=1.5*cm,
                        author = "Chris Hoy",
						pageCompression = 1,
						title = page_header["reportname"],
                        encrypt = StandardEncryption("",
                                                     None, 1, 0, 1, 0, 40)
						)

		for ptclass in (self.Listing2PDFTemplate,):
			pt=ptclass(self,page_header)
			self.document.addPageTemplates(pt)

		self.page_header=page_header
		self.prmax_info=page_header['prmax_info']
		self.rows = rows

		self.objects = []
		col_width =self.document.width/6.0
		self.col_widths = ( col_width, col_width*5)
		self.row_heights = (15,)

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
		for row in self.rows:
			if row[0]==rSingleLine:
				# now add a table
				data = ((Paragraph(row[1],HEADING_STYLE),Paragraph(row[2],DATA_STYLE) ),)
				self.append(Table(data,
								  self.col_widths,
								  self.row_heights,
								  STD_FRAME))
			elif row[0]==rMultiLine:
				self.append(Paragraph(row[1],HEADING_STYLE))
				self.append(Paragraph(row[2],DATA_STYLE))



	def append(self, object) :
		"""Appends an object to our platypus "story" (using ReportLab's terminology)."""
		self.objects.append(object)

	def extend(self,objects):
		self.objects.extend(objects)
