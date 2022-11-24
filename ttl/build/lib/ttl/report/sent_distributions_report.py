# -*- coding: utf-8 -*-
"""Sent Distributions report"""
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import cStringIO
import datetime
import os

from reportlab.lib import colors
from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import tables
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
from reportlab.platypus import PageBreak
from reportlab.platypus.tables import TableStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib.utils import ImageReader
from reportlab.graphics.shapes import Line
from reportlab.platypus.flowables import Spacer, Flowable
Table = tables.Table
import xlsxwriter
import csv
#from ttl.postgres  import DBConnect, DBCompress
#from bs4 import BeautifulSoup

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'

HEADING_STYLE = ParagraphStyle(name = 'heading',
							 fontName = FONT_TYPE_BOLD,
							 fontSize = 14,
							 alignment = TA_CENTER,
							 valign = 'MIDDLE',
                             leading = 24
						 )
HEADING_STYLE2 = ParagraphStyle(name = 'heading',
                                      fontName = FONT_TYPE,
                                      fontSize = 10,
                                      alignment = TA_CENTER,
                                      valign = 'MIDDLE',
                                      leading=18
                                      )
DATA_STYLE_CENTER = ParagraphStyle(name = 'data_center_middle',
                                      fontName = FONT_TYPE,
                                      fontSize = 8,
                                      alignment = TA_CENTER,
                                      valign = 'MIDDLE'
                                      )
DATA_STYLE_LEFT = ParagraphStyle(name = 'data_center_left',
                                      fontName = FONT_TYPE,
                                      fontSize = 8,
                                      alignment = TA_LEFT,
                                      valign = 'MIDDLE'
                                      )
DETAILS_LEFT = ParagraphStyle(name = 'details_left',
                              fontName = FONT_TYPE,
                              fontSize = 10,
                              alignment = TA_LEFT,
                              valign = 'TOP',
                              leftIndent = 10
                              )
TOTALS_STYLE_RIGHT = ParagraphStyle(name = 'totals',
                                      fontName = FONT_TYPE,
                                      fontSize = 10,
                                      alignment = TA_RIGHT,
                                      valign = 'MIDDLE',
                                      leading=18
                                      )
TABLE_HEADER = TableStyle(
    [
        ('BACKGROUND',(0,0),(-1, 0),colors.Color(0.9,0.9,0.9))
    ])


STD_FRAME = TableStyle(
    [
        # ('LINEABOVE',(0,splitlast),(2,splitlast),1,colors.black),
    ])
FOOTER = ParagraphStyle(
  name = 'details_footer',
  fontName = 'Helvetica',
  fontSize = 8,
  alignment = TA_LEFT,
  valign = 'TOP'
)

class SentDistributionsPDF(object):
	""" StatisticsPDF"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=1*cm   # bigger the no, nearer the top!

		canvas.setFont(FONT_TYPE, 8)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width-0.5*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()

	class SentDistributionsPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 0.5*cm


			PageTemplate.__init__(self, "SentDistributionsPDFTemplate",
		                          [
		                            Frame(doc.leftMargin, doc.bottomMargin, doc.width-10, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
		                          ])

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, results, dates, customername, title):

		self.report = cStringIO.StringIO()
		self.document = BaseDocTemplate(self.report,
	                    leftMargin = 1*cm,
	                    rightMargin = 1*cm,
	                    topMargin = 1*cm,
	                    bottomMargin = 1.5*cm,
	            author = "Prmax",
	                    pageCompression = 1,
	                    title = "Distributions Report"
	                    )

		for ptclass in (self.SentDistributionsPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._data = results
		self._total = len(results)
		self._dates = dates
		self._customername = customername
		self._title = title

		col_width =self.document.width/10
		self.col_widths1 = self.document.width
		self.col_widths2 = (col_width*1.8,col_width*3.4,col_width*1.1,col_width*2.9)
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
		# do the header:
		self.new_page()

		self.append(Paragraph("<b>%s</b>" %self._customername[0]['customername'], HEADING_STYLE))

		self.append(Paragraph("%s Distributions From: %s To: %s" %(self._title, self._dates['from_date'], self._dates['to_date']), HEADING_STYLE2))
		self.append(Paragraph(" ", HEADING_STYLE2))

		self.append(Paragraph("Total: %s" %(self._total), TOTALS_STYLE_RIGHT))
		self.append(MLine(-5,0,525,0))
		
		header = [((Paragraph("Date", DATA_STYLE_LEFT),),\
		           (Paragraph("Description", DATA_STYLE_LEFT),),\
		           (Paragraph("Status", DATA_STYLE_LEFT),),\
		           (Paragraph("Client", DATA_STYLE_LEFT)))]
		self.append(Table(header,self.col_widths2,self.row_heights,repeatRows=1))
		self.append(MLine(-5,0,525,0))

		for dist in self._data:
			self._do_distributions(dist)
		
		
		self.append(MLine(-5,0,525,0))
		
		
		self.append(Paragraph("&nbsp;", FOOTER))		


	def _do_distributions(self, dist,  style = DETAILS_LEFT):
		"_do_distributions"

		row = [((Paragraph(dist["display_sent_time"], DATA_STYLE_LEFT),),
		        (Paragraph(dist["emailtemplatename"], DATA_STYLE_LEFT),),
		        (Paragraph(dist["status"], DATA_STYLE_LEFT),),
		        (Paragraph(dist["clientname"], DATA_STYLE_LEFT))
		     )]
		self.append(Table(row,self.col_widths2,self.row_heights,STD_FRAME,repeatRows=1))
		
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
	
class MLine(Flowable):
	"""Line flowable --- draws a line in a flowable"""

	def __init__(self,x1, y1, x2, y2):
		Flowable.__init__(self)
		self.x1 = x1
		self.y1 = y1
		self.x2 = x2
		self.y2 = y2

	def draw(self):
		self.canv.line(self.x1,self.y1,self.x2,self.y2)			


class SentDistributionsExcel(object):
	"""Partners List Excel"""

	def __init__(self, reportoptions, results, dates, customername, title):

		self._reportoptions = reportoptions
		self._data = results
		self._total = len(results)
		self._dates = dates
		#self._criteria = criteria
		self._customername = customername
		self._title = title
		self._finaloutput = cStringIO.StringIO()

	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		return self._finaloutput.getvalue()

	def build_report(self):

		self._row = 0
		header_dates = "%s Distributions From: %s  To: %s" %(self._title, self._dates['from_date'], self._dates['to_date'])#, "Number of releases & statements issued", "Total number used", "% used"]
#		header_dates = self._customername[0]['customername']
		headers_cols = ["Date", "Description", "Status", "Client"]
		
		wb = xlsxwriter.Workbook(self._finaloutput)
		bold = wb.add_format({'bold': True})
		big_font = wb.add_format({'font_size':18})
		merge_format = wb.add_format({'align':'center', 'bold':True, 'valign':'center', 'font_size':18})
		merge_format.set_text_wrap()

		#Totals sheet

		self._sheet = wb.add_worksheet("SentDistributions")
		self._sheet.merge_range('A1:E1', header_dates, merge_format)
		self._set_columns_width(self._sheet)
		self._sheet.set_row(0, 30, merge_format)
		
		self._row += 2

		self._get_headers(headers_cols, bold)

		self._do_distributions()
		
		self._sheet.write(self._row+1, 0, 'Total: %s' %self._total)

		wb.close()	

	def _do_distributions(self):
		for dist in self._data:
#			content = DBCompress.decode(dist['emailtemplatecontent'])
#			soup = BeautifulSoup(content)
#
			self._sheet.write(self._row, 0, dist['display_sent_time'])
			self._sheet.write(self._row, 1, dist['emailtemplatename'])
			self._sheet.write(self._row, 2, dist['status'])
			self._sheet.write(self._row, 3, dist['clientname'])
#			self._sheet.write(self._row, 4, soup.get_text().replace('\n','\n\n'))

			self._row +=1		
	
	def _get_headers(self, headers, bold):
		col = 0
		for header in headers:
			self._sheet.write(self._row,col, header, bold)
			col +=1
		self._row += 1

	def _set_columns_width(self, sheet):
		self._sheet.set_column('A:A', 20)
		self._sheet.set_column('B:B', 50)
		self._sheet.set_column('C:C', 15)
		self._sheet.set_column('D:D', 30)
			