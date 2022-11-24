# -*- coding: utf-8 -*-
"""Clippings"""
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import xlsxwriter
import cStringIO
import datetime

from reportlab.lib import colors
from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import tables
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
from reportlab.platypus import PageBreak
from reportlab.platypus.tables import TableStyle
from reportlab.platypus.flowables import Flowable
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER

Table = tables.Table

FONT_TYPE = 'Helvetica'
FONT_TYPE_BOLD = 'Helvetica-Bold'

HEADING_STYLE = ParagraphStyle(name='heading',
                               fontName=FONT_TYPE_BOLD,
                               fontSize=14,
                               alignment=TA_CENTER,
                               valign='MIDDLE',
                               leading=24
                               )
HEADING_STYLE2 = ParagraphStyle(name='heading',
                                fontName=FONT_TYPE,
                                fontSize=10,
                                alignment=TA_CENTER,
                                valign='MIDDLE',
                                leading=18
                                )
DATA_STYLE_CENTER = ParagraphStyle(name='data_center_middle',
                                   fontName=FONT_TYPE,
                                   fontSize=8,
                                   alignment=TA_CENTER,
                                   valign='MIDDLE'
                                   )
DATA_STYLE_LEFT = ParagraphStyle(name='data_center_left',
                                 fontName=FONT_TYPE,
                                 fontSize=8,
                                 alignment=TA_LEFT,
                                 valign='MIDDLE'
                                 )
DETAILS_LEFT = ParagraphStyle(name='details_left',
                              fontName=FONT_TYPE,
                              fontSize=10,
                              alignment=TA_LEFT,
                              valign='TOP',
                              leftIndent=10
                              )
TABLE_HEADER = TableStyle(
    [
        ('BACKGROUND', (0, 0), (-1, 0), colors.Color(0.9, 0.9, 0.9))
    ])


STD_FRAME = TableStyle(
    [
        # ('LINEABOVE',(0,splitlast),(2,splitlast),1,colors.black),
    ])
FOOTER = ParagraphStyle(
    name='details_footer',
    fontName='Helvetica',
    fontSize=8,
    alignment=TA_LEFT,
    valign='TOP'
)

class ClippingsStdPDF(object):
	""" ClippingsPDF
	"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc):
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height = 0.75*cm   # bigger the no, nearer the top!
		ypos = doc.pagesize[1] - doc.topMargin- banner_height
		canvas.setFont(FONT_TYPE_BOLD, 14)

		x_centre = doc.width/2.0 + 1.5*cm
		ypos = ypos + -0.3*cm
		#canvas.drawCentredString(x_centre, ypos, "Clippings Report")

		canvas.setFont(FONT_TYPE, 10)
		right_text = 'Page %d'%self.page_count
		canvas.drawString(doc.width-0.75*cm, 0.75*cm, right_text)
		self.page_count += 1

		left_text = "Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm, left_text)

		canvas.restoreState()

	class ClippingsStdPDFTemplate(PageTemplate):
		"""tempate"""
		def __init__(self, parent, page_header):
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 1.5*cm

			PageTemplate.__init__(self, "ClippingsStdPDFTemplate",
			                      [
			                        Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
			                      ])

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, results, dates, customername, reporttitle):

		self.report = cStringIO.StringIO()
		self.document = BaseDocTemplate(self.report,
	                                    leftMargin=1*cm,
	                                    rightMargin=1*cm,
	                                    topMargin=1*cm,
	                                    bottomMargin=1.5*cm,
	                                    author="Prmax",
	                                    pageCompression=1,
	                                    title="Clippings Report"
	                                    )
		for ptclass in (self.ClippingsStdPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._data = results
		self._dates = dates
		self._customername = customername
		self._reporttitle = reporttitle

		col_width = self.document.width/10
		self.col_widths2 = (col_width*1, col_width*1, col_width*2.5, col_width*2.5, col_width*3)
		self.row_heights = None #When it is None it makes the calculation of height automatic

	def write(self, filename):
		"write"
		# process all stuff, then write the report
		self.build_report()
		self.document.build(self.objects)
		open(filename, 'wb').write(self.report.getvalue())

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
		
		self.append(Paragraph("%s" %(self._reporttitle), HEADING_STYLE))

		if self.page_header['source'] == 'criteria':
			self.append(Paragraph("Clippings From: %s To: %s" %(self._dates['from_date'], self._dates['to_date']), HEADING_STYLE2))
			self.append(MLine(-5, 0, 525, 0))

		header = [((Paragraph("Date", DATA_STYLE_LEFT),),\
		           (Paragraph("Type", DATA_STYLE_LEFT),),\
		           (Paragraph("Client", DATA_STYLE_LEFT),),\
		           (Paragraph("Publication", DATA_STYLE_LEFT),),\
	               (Paragraph("Title", DATA_STYLE_LEFT)))]
		self.append(Table(header, self.col_widths2, self.row_heights, repeatRows=1))
		self.append(MLine(-5, 0, 525, 0))

		for clipping in self._data:
			self._do_clippings(clipping)

		self.append(Paragraph("&nbsp;", FOOTER))

	def _do_clippings(self, activity, style=DETAILS_LEFT):
		"_do_activities"

		row = [((Paragraph(activity["clip_source_date"] if activity["clip_source_date"] else '', DATA_STYLE_LEFT),),
		        (Paragraph(activity["clippingstypedescription"] if activity["clippingstypedescription"] else '', DATA_STYLE_LEFT),),
		        (Paragraph(activity["clientname"] if activity["clientname"] else '', DATA_STYLE_LEFT),),
		        (Paragraph(activity["outletname"] if activity["outletname"] else '', DATA_STYLE_LEFT),),
		        (Paragraph(activity["clip_title"] if activity["clip_title"] else '', DATA_STYLE_LEFT))
		        )]
		self.append(Table(row, self.col_widths2, self.row_heights, STD_FRAME, repeatRows=1))

	def append(self, objtoappend):
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

	def __init__(self, x1, y1, x2, y2):
		Flowable.__init__(self)
		self.x1 = x1
		self.y1 = y1
		self.x2 = x2
		self.y2 = y2

	def draw(self):
		self.canv.line(self.x1, self.y1, self.x2, self.y2)

class ClippingsStdExcel(object):
	"""Partners List Excel"""

	def __init__(self, reportoptions, results, dates, reporttitle):

		self._reportoptions = reportoptions
		self._data = results
		self._dates = dates
		self._reporttitle = reporttitle
		self._finaloutput = cStringIO.StringIO()

	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		return self._finaloutput.getvalue()

	def build_report(self):

		self._row = 0
		reporttitle = self._reporttitle
		header_dates = 'Clippings'
		if self._reportoptions['source'] == 'criteria':
			header_dates = "Clippings From: %s  To: %s" %(self._dates['from_date'], self._dates['to_date'])
		headers_cols = ["Date", "Type", "Client", "Publication", "Title", "Abstract", "Text", "URL"]

		wb = xlsxwriter.Workbook(self._finaloutput)
		bold = wb.add_format({'bold': True})
		merge_format = wb.add_format({'align':'center', 'bold':True, 'valign':'center', 'font_size':18})
		merge_format.set_text_wrap()

		self._sheet = wb.add_worksheet("Clippings")
		self._sheet.merge_range('A1:H1', reporttitle, merge_format)
		self._sheet.merge_range('A2:H2', header_dates, merge_format)
		self._set_columns_width(self._sheet)
		self._sheet.set_row(0, 30, merge_format)
		self._row += 2

		self._get_headers(headers_cols, bold)
		self._do_clippings()

		wb.close()

	def _do_clippings(self):
		for clipping in self._data:
			self._sheet.write(self._row, 0, clipping['clip_source_date'])
			self._sheet.write(self._row, 1, clipping['clippingstypedescription'])
			self._sheet.write(self._row, 2, clipping['clientname'])
			self._sheet.write(self._row, 3, clipping['outletname'])
			self._sheet.write(self._row, 4, clipping['clip_title'])
			self._sheet.write(self._row, 5, clipping['clip_abstract'])
			self._sheet.write(self._row, 6, clipping['clip_text'])
			self._sheet.write(self._row, 7, clipping['clip_link'])

			self._row += 1

	def _get_headers(self, headers, bold):
		col = 0
		for header in headers:
			self._sheet.write(self._row, col, header, bold)
			col += 1
		self._row += 1

	def _set_columns_width(self, sheet):
		self._sheet.set_column('A:B', 15)
		self._sheet.set_column('C:D', 20)
		self._sheet.set_column('E:H', 50)
