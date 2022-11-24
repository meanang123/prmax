# -*- coding: utf-8 -*-
"""Clippings"""
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import cStringIO
import datetime
import os

from reportlab.platypus.paragraph import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import tables
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
from reportlab.platypus import PageBreak
from reportlab.platypus.tables import TableStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import letter, landscape, A4

from reportlab.graphics.charts.piecharts import Pie
from reportlab.lib.colors import PCMYKColor
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.shapes import Drawing, _DrawingEditorMixin
from reportlab.lib.validators import Auto
from reportlab.lib.formatters import DecimalFormatter
Table = tables.Table

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'
ORIENTATION = 'landscape'
FONT_SIZE = 14

HEADING_STYLE = ParagraphStyle(name = 'heading',
                               fontName = 'Helvetica-Bold',
                               fontSize = 14,
                               alignment = TA_LEFT,
                               valign = 'MIDDLE'
                               )

HEADING_STYLE2 = ParagraphStyle(name = 'heading2',
                                fontName = 'Helvetica-Bold',
                                fontSize = 14,
                                alignment = TA_LEFT,
                                valign = 'MIDDLE',
                                leftIndent = 10
                                )

DETAILS_LEFT = ParagraphStyle(name = 'details_left',
                              fontName = 'Helvetica',
                              fontSize = 10,
                              alignment = TA_LEFT,
                              valign = 'TOP',
                              leftIndent = 10
                              )

DETAILS_LEFT_2 = ParagraphStyle(name = 'details_left_2',
                                fontName = 'Helvetica',
                                fontSize = 10,
                                alignment = TA_LEFT,
                                valign = 'TOP',
                                leftIndent = 15
                                )

FOOTER = ParagraphStyle(
    name = 'details_footer',
    fontName = 'Helvetica',
    fontSize = 8,
    alignment = TA_LEFT,
    valign = 'TOP'
)

class ClippingsPieChartPDF(object):
	""" ClippingsPieChartPDF
	"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height
		canvas.setFont(FONT_TYPE_BOLD, 14)
		x_centre=doc.width/2.0 + 5*cm
		ypos=ypos + -9*cm
		canvas.drawCentredString(x_centre, ypos, "Clippings Report - Summary")


		canvas.setFont(FONT_TYPE, 10)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width+8.75*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class ClippingsPieChartPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 1.5*cm
			pagesize = landscape(A4)

			PageTemplate.__init__(self, "ClippingsPieChartPDFTemplate",
			                      [
			                        Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
			                      ], pagesize = pagesize)

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, rows):
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
						title = "Clippings"
						)

		for ptclass in (self.ClippingsPieChartPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows = rows

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
		pie = PieChart(self._rows, width=540, height=177)
		pie.addPie()
		pie.legendHeader()
		pie.legend()
		pie.setData(self._rows)
		
		self.append(pie)
#		chart.save()
		#for clippings in self._rows:
		#	self._do_clippings(clippings)
		#	self.append(Paragraph("&nbsp;", FOOTER))

	def _do_clippings(self, clippings,  style = DETAILS_LEFT):
		"_do_clippings"
		
#		self.append(Paragraph("<b>Type : </b>" + str(clippings["clippingstypedescription"]), style))
#		self.append(Paragraph("<b>Count Clippings : </b> " + str(clippings["count_clippings"]), style))
#		self.append(Paragraph("<b>Tone : </b>" + str(clippings["clippingstoneid"]), style))
#	self.append(Paragraph("<b>Source : </b>" + str(clippings["clippingsourceid"]), style))

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


class PieChart(_DrawingEditorMixin,Drawing):
	def __init__(self,clippings,width=540,height=177,*args,**kw):
		Drawing.__init__(self,width,height,*args,**kw)
		self._colors = PCMYKColor(0,70,60,5), PCMYKColor(100,55,0,55), PCMYKColor(55,24,0,9), PCMYKColor(10,0,49,28), PCMYKColor(47,64,28,0), PCMYKColor(10,10,73,0), \
		    PCMYKColor(22,3,0,0), PCMYKColor(22,0,100,8), PCMYKColor(0,64,100,0), PCMYKColor(0,100,99,4), PCMYKColor(0,30,72,11), PCMYKColor(50,0,25,30), \
		    PCMYKColor(64,100,0,14), PCMYKColor(75,0,7,0), PCMYKColor(23,2,0,77), PCMYKColor(30,56,100,37), PCMYKColor(0,4,22,32), PCMYKColor(0,30,100,0),


	def addPie(self):
		self._add(self,Pie(),name='chart',validate=None,desc=None)
		# pie
		self.chart.width             = self.chart.height = 250 # its a circle
		self.chart.sameRadii         = 1
		self.chart.x                 = 30
		self.chart.y                 = -380
		self.chart.slices.strokeColor  = PCMYKColor(0,0,0,0)
		self.chart.slices.strokeWidth  = 0.5

		
	def legendHeader(self):
		self._add(self,Legend(),name='legendHeader',validate=None,desc=None)
		self.legendHeader.x         = 350
		self.legendHeader.y         = self.height - 300
		self.legendHeader.fontSize  = FONT_SIZE
		self.legendHeader.fontName  = FONT_TYPE_BOLD
		self.legendHeader.subCols[0].minWidth = 150
		self.legendHeader.subCols[0].align = 'left'
		self.legendHeader.subCols[1].minWidth = 150
		self.legendHeader.subCols[1].align = 'right'
		self.legendHeader.colorNamePairs = [(None, ('Channel','Value'))]
		
	def legend(self):
		self._add(self,Legend(),name='legend',validate=None,desc=None)
		self.legend.x                = 350
		self.legend.y                = -150
		self.legend.fontSize         = FONT_SIZE
		self.legend.fontName         = FONT_TYPE
		self.legend.dx               = 8
		self.legend.dy               = 8
		self.legend.dxTextSpace      = 7
		self.legend.yGap             = 10
		self.legend.deltay           = 12
		self.legend.deltax         = 75		
		self.legend.strokeColor      = PCMYKColor(0,0,0,0)
		self.legend.strokeWidth      = 0
		self.legend.columnMaximum    = 150
		self.legend.alignment        = 'right'
		self.legend.variColumn       = 0
		self.legend.dividerDashArray = None
		self.legend.dividerWidth     = 0.5
		self.legend.dividerOffsX     = (0, 0)
		self.legend.dividerLines     = 7
		self.legend.dividerOffsY     = 15
		self.legend.subCols[0].align = 'left'
		self.legend.subCols[0].minWidth = 150
		self.legend.subCols[1].align = 'right'
		self.legend.subCols[1].align='numeric'
		self.legend.subCols[1].dx = -15
		self.legend.subCols[1].minWidth = 150
		#self.legend.colorNamePairs   = Auto(obj=self.chart)

	def setData(self, clippings):
		self._seriesNames = [x['clippingstypedescription'] for x in clippings]
		self._seriesData1 = [x['count_clippings'] for x in clippings]
		formatter = DecimalFormatter(places=0)
		names = zip(self._seriesNames, map(formatter, self._seriesData1))

		self.legend.colorNamePairs = zip(self._colors, names)
		self.chart.data  = self._seriesData1
		# apply colors to slices
		for i, v in enumerate(self.chart.data): self.chart.slices[i].fillColor = self._colors[i]
		#return Drawing.getContents(self)

