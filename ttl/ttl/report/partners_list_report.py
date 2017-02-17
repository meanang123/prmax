# -*- coding: utf-8 -*-
"""Engagement"""
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import cStringIO
import datetime
import os

from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import tables
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
from reportlab.platypus import PageBreak,FrameBreak
from reportlab.platypus.tables import TableStyle
from reportlab.lib.units import cm
import reportlab.lib.colors as colors
from reportlab.lib.pdfencrypt import StandardEncryption
from reportlab.lib.enums import *
from reportlab.lib.utils import ImageReader
from ttl.report.pdf_fields import *
from reportlab.platypus.flowables import Spacer
import prcommon.Constants as Constants
import xlrd
import xlwt
import xlsxwriter

Table = tables.Table

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'

HEADING_STYLE=ParagraphStyle(name='heading',
                             fontName=FONT_TYPE_BOLD,
                             fontSize=12,
                             alignment=TA_LEFT,
                             valign = 'MIDDLE'
                             )
HEADING_STYLE2=ParagraphStyle(name='heading',
                             fontName=FONT_TYPE_BOLD,
                             fontSize=14,
                             alignment=TA_CENTER,
                             valign = 'MIDDLE'
                             )
DATA_STYLE=ParagraphStyle(name='data',
                          fontName=FONT_TYPE,
                          fontSize=10,
                          alignment=TA_LEFT,
                          valign = 'MIDDLE'
                          )

STD_FRAME = TableStyle(
    [
        #('LINEABOVE',(0,splitlast),(2,splitlast),1,colors.black),
    ])

class PartnersListPDF(object):
	""" PartnertsListPDF
	"""
	# common page format for both templates:
	def logo_and_header_old(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height

		canvas.setFont(FONT_TYPE_BOLD, 14)
		x_centre=doc.width/2.0 + 1.5*cm
		ypos=ypos + 0.75*cm
		canvas.drawCentredString(x_centre, ypos, "Partners List Report")


		canvas.setFont(FONT_TYPE, 8)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width-2*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()

	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()
		banner_height=1.0*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height
		tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/PRmaxletterheadtop.jpg'))
		Im = ImageReader(tmp)
		data = canvas.drawImage( Im, doc.leftMargin, ypos, 550,40)

		tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/PRmaxletterheadbot.jpg'))
		Im = ImageReader(tmp)
		ypos=doc.bottomMargin- 30
		data = canvas.drawImage( Im, doc.leftMargin, ypos, 550,40)

		canvas.restoreState()


	class PartnersListPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 1.5*cm


			PageTemplate.__init__(self, "PartnersListPDFTemplate",
			                      [
			                        Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
			                      ])

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, rows, customersource):
		"""
		"""
		self.report = cStringIO.StringIO()
		self.document = BaseDocTemplate(self.report,
						leftMargin = 1*cm,
						rightMargin = 1*cm,
						topMargin = 1*cm,
						bottomMargin = 1.5*cm,
		        author = "Prmax",
						pageCompression = 1,
						title = "PartnersList"
						)

		for ptclass in (self.PartnersListPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows = rows
		self._customersource = customersource

		col_width =self.document.width/10.0
		self.col_widths = (col_width*5, col_width*3, col_width*2)
		self.row_heights = None #When it is None it makes the calculation of height automatic

	def write(self, filename):
		"write"
		# process all stuff, then write the report
		self.build_report()
		self.document.build(self.objects)
		open(filename,'wb').write(self.report.getvalue())

	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		self.document.build(self.objects)
		return self.report.getvalue()

	def build_report(self):
		"builds"

		self.new_page()

		self.append(Paragraph(self._customersource[0]['customersourcedescription'], DATA_STYLE))
		self.append(Paragraph(self._customersource[0]['name'], DATA_STYLE))
		self.append(Paragraph(self._customersource[0]['address1'], DATA_STYLE))
		self.append(Paragraph(self._customersource[0]['address2'], DATA_STYLE))
		self.append(Paragraph(self._customersource[0]['townname'], DATA_STYLE))
		self.append(Paragraph(self._customersource[0]['postcode'], DATA_STYLE))
		self.append(Paragraph(self._customersource[0]['countryname'], DATA_STYLE))
		self.append(Spacer(10, 50))

		self.append(Paragraph("Customers List", HEADING_STYLE2))
		self.append(Spacer(10, 50))
#		self.append(Table(data_partner,
#	                      self.col_widths,
#	                      self.row_heights,
#		                  STD_FRAME))
		#Add a line for the headers that will be repeated in every page using repeatRows in TableStyle
		data = [
		    ((Paragraph("Customer Name", HEADING_STYLE),),
		     (Paragraph("Contact Name", HEADING_STYLE),),
		     (Paragraph("Status", HEADING_STYLE))
		     )
		]
		for row in self._rows:
			data.append(((Paragraph(row["customername"],DATA_STYLE),), (Paragraph(row["contactname"],DATA_STYLE),), (Paragraph(row["customerstatusname"],DATA_STYLE)),),)
			
		self.append(Table(data,
	                      self.col_widths,
	                      self.row_heights,
		                  STD_FRAME,
		                  repeatRows=1))

	def append(self, objtoappend) :
		"""Appends an object to our platypus "story" (using ReportLab's terminology)."""
		self.objects.append(objtoappend)

	def extend(self, objects):
		"extend"
		self.objects.extend(objects)

	def new_page(self):
		"create new page"

		if self.total_page_count > 0:
			self.append(PageBreak())

		self.total_page_count += 1

class PartnersListExcel(object):
	"""Partners List Excel"""
	
	def __init__(self, reportoptions, data, customersource):
		self._data = data
		self._reportoptions = reportoptions
		self._customersource = customersource
		self._finaloutput = cStringIO.StringIO()
		
	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		return self._finaloutput.getvalue()
	
	def build_report(self):
		
		headers = ["Customer Name", "Contact Name", "Status"]

		wb = xlsxwriter.Workbook(self._finaloutput)
		ws = wb.add_worksheet(self._customersource[0][0])
		bold = wb.add_format({'bold': True})		
		self._set_columns_width(ws)
		self._get_headers(headers, ws, bold)
		row = 1
		col = 0
		for customername, contactname, status in self._data:
			ws.write(row, col, customername.decode("utf-8"))
			ws.write(row, col+1, contactname.decode("utf-8"))
			ws.write(row, col+2, status.decode("utf-8"))
			row +=1
		wb.close()		

	def _get_headers(self, headers, sheet, bold):
		row = 0
		col = 0
		for header in headers:
			sheet.write(row,col, header, bold)
			col +=1

	def _set_columns_width(self, sheet):
		sheet.set_column('A:A', 50)
		sheet.set_column('B:C', 25)	
	