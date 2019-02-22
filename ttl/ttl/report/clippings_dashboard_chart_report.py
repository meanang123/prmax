# -*- coding: utf-8 -*-
"""Clippings"""
# the path to the LOGO_FILE assumes that CreditNotePDF.py

import cStringIO
from datetime import datetime, timedelta
import os
import simplejson

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
from reportlab.lib import colors
from reportlab.graphics.charts.textlabels import Label

from reportlab.graphics.charts.piecharts import Pie
from reportlab.lib.colors import PCMYKColor
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.shapes import Drawing, _DrawingEditorMixin
from reportlab.lib.validators import Auto
from reportlab.lib.formatters import DecimalFormatter
from reportlab.lib.colors import purple, PCMYKColor, black, pink, green, blue
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.charts.barcharts import VerticalBarChart, BarChart
from reportlab.graphics.charts.legends import LineLegend
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.pdfbase.pdfmetrics import stringWidth, EmbeddedType1Face, registerTypeFace, Font, registerFont
from reportlab.graphics.charts.axes import XValueAxis, YValueAxis, AdjYValueAxis, NormalDateXValueAxis
Table = tables.Table
import xlsxwriter

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

NEWS_DB_DESC = 'News'
TWITTER_DB_DESC = 'Twitter'
FACEBOOK_DB_DESC = 'Facebook'
FORUMS_DB_DESC = 'Forums'
BLOGS_DB_DESC = 'Blogs'
INSTAGRAM_DB_DESC = 'Instagram'
YOUTUBE_DB_DESC = 'YouTube'
GOOGLEPLUS_DB_DESC = 'GooglePlus'
TUMBLR_DB_DESC = 'Tumblr'
VKONTAKTE_DB_DESC = 'VKontakte'
CHAT_DB_DESC = 'Chat' 
LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P','Q','R','S','T','U','V','W','X','Y','Z']



class ClippingsChartBuildExcelReports(object):

	@classmethod
	def build_chart_report(self, finaloutput, results, charttype, chartsubtype=None):
		wb = xlsxwriter.Workbook(finaloutput)
		self._sheet = wb.add_worksheet()
		if chartsubtype:
			self._chart = wb.add_chart({'type': charttype, 'subtype': chartsubtype})
		else:
			self._chart = wb.add_chart({'type': charttype})
		title = str(results['title'].replace('<br>', ' // '))
		bold = wb.add_format({'bold': 1})
		merge_format = wb.add_format({'align':'center', 'bold':True, 'valign':'center', 'font_size':18})
		merge_format.set_text_wrap()
		self._sheet.set_row(0, 50)
		self._sheet.merge_range('A1:M1', title, merge_format)
		categories = []
		values = []
		headings = ''
		if charttype == 'pie':
			headings = ['Name', 'Value']
			num = len(results['data']['pie'])
			for val in range(0, num):
				categories.append((results['data']['pie'][val]['label']))
				values.append((results['data']['pie'][val]['y']))
			data = [categories, values]
			self._set_columns_width()

			self._sheet.write_column('A5', data[0])
			self._sheet.write_column('B5', data[1])
			column = 'B'
			name = 'Clippings Pie Chart'

			self._chart.add_series({
				'categories': '=Sheet1!$A$5:$A$%d' %int(num+5-1),
				'name': name,
				'values': '=Sheet1!$%s$5:$%s$%d' %(column, column, int(num+5-1)),
				'gap': 10,
				'points': [
					{'fill': {'color': '#990000'}},
					],
			})
		else:
			headings = results['data'].keys()
			headings.insert(0, 'Date')
			names = results['data'].keys()
			dates = [x['label'] for x in results['dates']]
			data = {}
			for name in names:
				num = len(results['data'][name]['data'])
				data[name] = []
				categories = [x['labelx'] for x in results['data'][name]['data']]
				values = [x['y'] for x in results['data'][name]['data']]
				data[name] = [categories, values]

			self._set_columns_width_dates()
			self._sheet.write_column('A5', dates)

			l = 0
			for name in names:
				l += 1
				column = LETTERS[l]
				if l > 26:
					column = '%s%s' %(LETTERS[l/26], LETTERS[(l%26)])
				self._sheet.write_column('%s5' %column, data[name][1])
				self._chart.add_series({
					'categories': '=Sheet1!$A$5:$A$%d' %int(num+5-1),
					'name': name,
					'values': '=Sheet1!$%s$5:$%s$%d' %(column, column, int(num+5-1)),
					'gap': 10,
					'points': [
						{'fill': {'color': '#990000'}},
						],
				})
			self._chart.set_x_axis({'name': 'Dates'})
			self._chart.set_y_axis({'name': 'Number of Clippings'})

		self._sheet.write_row('A4', headings, bold)
		self._sheet.insert_chart('A%d' %int(num+6), self._chart, {'x_offset': 25, 'y_offset': 10, 'x_scale': 2, 'y_scale': 1.5})
		wb.close()

	@classmethod
	def _set_columns_width_dates(self):
		self._sheet.set_column('A:A', 15)
		self._sheet.set_column('B:J', 10)

	@classmethod
	def _set_columns_width(self):
		self._sheet.set_column('A:A', 35)
		self._sheet.set_column('B:J', 10)

class ClippingsDashboardPieChartReportPDF(object):
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
		canvas.drawCentredString(x_centre, ypos, self.page_header)


		canvas.setFont(FONT_TYPE, 10)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width+8.75*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class ClippingsDashboardPieChartReportPDFTemplate(PageTemplate) :
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

			PageTemplate.__init__(self, "ClippingsDashboardPieChartReportPDFTemplate",
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

		for ptclass in (self.ClippingsDashboardPieChartReportPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = rows['title']
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows = rows['data']['pie']

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
		self.legendHeader.y         = self.height - 270
		self.legendHeader.fontSize  = FONT_SIZE
		self.legendHeader.fontName  = FONT_TYPE_BOLD
		self.legendHeader.subCols[0].minWidth = 250
		self.legendHeader.subCols[0].align = 'left'
		self.legendHeader.subCols[1].minWidth = 100
		self.legendHeader.subCols[1].align = 'right'
		self.legendHeader.colorNamePairs = [(None, ('Name','Value'))]
		
	def legend(self):
		self._add(self,Legend(),name='legend',validate=None,desc=None)
		self.legend.x                   = 350
		self.legend.y                   = -120
		self.legend.fontSize            = FONT_SIZE
		self.legend.fontName            = FONT_TYPE
		self.legend.dx                  = 8
		self.legend.dy                  = 8
		self.legend.dxTextSpace         = 7
		self.legend.yGap                = 10
		self.legend.deltay              = 12
		self.legend.deltax              = 75		
		self.legend.strokeColor         = PCMYKColor(0,0,0,0)
		self.legend.strokeWidth         = 0
		self.legend.columnMaximum       = 70
		self.legend.alignment           = 'right'
		self.legend.variColumn          = 0
		self.legend.dividerDashArray    = None
		self.legend.dividerWidth        = 0.5
		self.legend.dividerOffsX        = (0, 0)
		self.legend.dividerLines        = 7
		self.legend.dividerOffsY        = 15
		self.legend.subCols[0].align    = 'left'
		self.legend.subCols[0].minWidth = 250
		self.legend.subCols[1].align    = 'right'
		self.legend.subCols[1].align    ='numeric'
		self.legend.subCols[1].dx       = -15
		self.legend.subCols[1].minWidth = 100

	def setData(self, clippings):
		self._seriesNames = [x['label'][:30] for x in clippings]
		self._seriesData1 = [x['value'] for x in clippings]
		formatter = DecimalFormatter(places=0)
		names = zip(self._seriesNames, map(formatter, self._seriesData1))

		self.legend.colorNamePairs = zip(self._colors, names)
		self.chart.data  = self._seriesData1
		# apply colors to slices
		for i, v in enumerate(self.chart.data): self.chart.slices[i].fillColor = self._colors[i]

class ClippingsDashboardLinesChartReportPDF(object):
	""" ClippingsLinesChartPDF
	"""
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height

		canvas.setFont(FONT_TYPE_BOLD, 14)
#		x_centre=doc.width/2.0 + 1.5*cm
#		ypos=ypos + -1*cm
		x_centre=doc.width/2.0 + 5*cm
		ypos=ypos + -9*cm
		canvas.drawCentredString(x_centre, ypos, self.page_header)

		canvas.setFont(FONT_TYPE, 10)
		right_text='Page %d'%self.page_count
#		canvas.drawString(doc.width-0.75*cm, 0.75*cm,right_text)
		canvas.drawString(doc.width+8.75*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class ClippingsDashboardLinesChartReportPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 10*cm
			pagesize = landscape(A4)

			PageTemplate.__init__(self, "ClippingsDashboardLinesChartReportPDFTemplate",
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
		                                title = "Clippings Lines Chart"
		                                )

		for ptclass in (self.ClippingsDashboardLinesChartReportPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = rows['title'].replace('<br>', '  -->  ')
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows = rows
		self.dates = rows['dates']

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
		lines = LinesChart(self._rows, width=540, height=177)
		lines.addChart()
		lines.setLines()
		lines.setData(self._rows, self.dates)
		lines.legend()

		self.append(lines)

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


class LinesChart(_DrawingEditorMixin,Drawing):

	def __init__(self,clippings,width=540,height=177,*args,**kw):
		Drawing.__init__(self,width,height,*args,**kw)
		self._colors = PCMYKColor(100,0,90,50,alpha=100), PCMYKColor(0,30,72,11,alpha=100), PCMYKColor(100,100,100,100,alpha=50), PCMYKColor(100,55,0,55,alpha=100), \
		    PCMYKColor(100,55,0,55,alpha=80), PCMYKColor(0,100,99,4,alpha=100), PCMYKColor(50,0,25,30,alpha=100), PCMYKColor(30,56,100,37,alpha=100), \
		    PCMYKColor(100,0,90,50,alpha=80), PCMYKColor(0,80,0,30,alpha=100), PCMYKColor(0,100,99,4,alpha=80)
		self._desc = []

	def addChart(self):
		self._add(self,LinePlot(),name='chart',validate=None,desc=None)
		self.chart.y                = -130
		self.chart.x                = 32
		self.chart.width            = 710
		self.chart.height           = 250
		# line styles
		self.chart.lines.strokeWidth     = 0
		self.chart.lines.symbol= makeMarker('FilledSquare')
		# x axis
		self.chart.xValueAxis = NormalDateXValueAxis()
		self.chart.xValueAxis.labels.fontName       = FONT_TYPE_BOLD
		self.chart.xValueAxis.labels.fontSize       = FONT_SIZE
		self.chart.xValueAxis.forceEndDate          = 1
		self.chart.xValueAxis.forceFirstDate        = 1
		self.chart.xValueAxis.labels.boxAnchor      ='autox'
		self.chart.xValueAxis.xLabelFormat          = '{dd}/{MM}/{YYYY}'
		self.chart.xValueAxis.maximumTicks          = 5
		self.chart.xValueAxis.minimumTickSpacing    = 0.5
		self.chart.xValueAxis.niceMonth             = 0
		self.chart.xValueAxis.strokeWidth           = 1
		self.chart.xValueAxis.loLLen                = 5
		self.chart.xValueAxis.hiLLen                = 5
		self.chart.xValueAxis.gridEnd               = self.width
		self.chart.xValueAxis.gridStart             = self.chart.x-10
		# y axis
		#self.chart.yValueAxis = AdjYValueAxis()
		self.chart.yValueAxis.visibleGrid           = 1
		self.chart.yValueAxis.visibleAxis           = 0
		self.chart.yValueAxis.labels.fontName       = FONT_TYPE_BOLD
		self.chart.yValueAxis.labels.fontSize       = FONT_SIZE
#		self.chart.yValueAxis.labelTextFormat       = '%0.2f%%'
		self.chart.yValueAxis.strokeWidth           = 0.25
		self.chart.yValueAxis.visible               = 1
		self.chart.yValueAxis.labels.rightPadding   = 5
		#self.chart.yValueAxis.maximumTicks          = 6
		self.chart.yValueAxis.rangeRound            ='both'
		self.chart.yValueAxis.tickLeft              = 7.5
		self.chart.yValueAxis.minimumTickSpacing    = 0.5
		self.chart.yValueAxis.maximumTicks          = 8
		self.chart.yValueAxis.forceZero             = 0
		self.chart.yValueAxis.avoidBoundFrac        = 0.1

	def legend(self):
		self._add(self,LineLegend(),name='legend',validate=None,desc=None)
		self.legend.fontName         = FONT_TYPE_BOLD
		self.legend.fontSize         = FONT_SIZE
		self.legend.alignment        ='right'
		self.legend.colorNamePairs = zip(self._colors, self._desc)
		self.legend.dxTextSpace    = 1
		self.legend.boxAnchor      = 'sw' #'nw','n','ne','w','c','e','sw','s','se', 'autox', 'autoy'
		self.legend.yGap           = 2
		self.legend.subCols.dx     = 5
		self.legend.subCols.dy     = -4
		self.legend.subCols.rpad   = 0
		self.legend.columnMaximum  = 4
		self.legend.deltax         = 1
		self.legend.deltay         = 0
		self.legend.dx             = 15
		self.legend.dy             = 8
		self.legend.y              = -280
		self.legend.x              = 25

	def setData(self, clippings, dates):
		data = {}
		yaxis = {}
		
		for desc in clippings['data']:
			self._desc.append(desc[:20] if len(desc.strip())>20 else desc[:len(desc.strip())])
			data[desc] = []

		for desc in clippings['data']:
			for x in range(0,len(clippings['data'][desc]['data'])):
				data[desc].append((datetime.strptime(clippings['data'][desc]['data'][x]['labelx'],'%Y-%m-%d').date(), clippings['data'][desc]['data'][x]['y']))

		self.chart.data = []
		for desc in clippings['data']:
			self.chart.data.append(data[desc])

		for i in range(0, len(self._colors)):
			self.chart.lines[i].strokeColor = self._colors[i]

		self.chart.xValueAxis.strokeColor = PCMYKColor(100,60,0,50,alpha=100)

	def setLines(self):
		self.chart.lines.symbol.x           = 0
		self.chart.lines.symbol.strokeWidth = 0
		self.chart.lines.symbol.arrowBarbDx = 5
		self.chart.lines.symbol.strokeColor = PCMYKColor(0,0,0,0,alpha=100)
		self.chart.lines.symbol.fillColor   = None
		self.chart.lines.symbol.arrowHeight = 5
		self.chart.lines.symbol.kind        = 'FilledDiamond'
		self.chart.lines.symbol.size        = 5
		self.chart.lines.symbol.angle       = 45


class ClippingsDashboardColumnsChartReportPDF(object):
	""" ClippingsLinesChartPDF
	"""
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height

		canvas.setFont(FONT_TYPE_BOLD, 14)
#		x_centre=doc.width/2.0 + 1.5*cm
#		ypos=ypos + -1*cm
		x_centre=doc.width/2.0 + 5*cm
		ypos=ypos + -9*cm
		canvas.drawCentredString(x_centre, ypos, self.page_header)

		canvas.setFont(FONT_TYPE, 10)
		right_text='Page %d'%self.page_count
#		canvas.drawString(doc.width-0.75*cm, 0.75*cm,right_text)
		canvas.drawString(doc.width+8.75*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class ClippingsDashboardColumnsChartReportPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 10*cm
			pagesize = landscape(A4)

			PageTemplate.__init__(self, "ClippingsDashboardColumnsChartReportPDFTemplate",
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
		                                title = "Clippings Lines Chart"
		                                )

		for ptclass in (self.ClippingsDashboardColumnsChartReportPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = rows['title'].replace('<br>', '  -->  ')
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows = rows
		self.dates = rows['dates']

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
		bars = ColumnsChart(self._rows, width=540, height=177)
		bars.addChart()
		bars.setData(self._rows, self.dates)
		bars.setBars(self._rows)
		bars.legend()

		self.append(bars)

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


class ColumnsChart(_DrawingEditorMixin,Drawing):

	def __init__(self,clippings,width=540,height=177,*args,**kw):
		Drawing.__init__(self,width,height,*args,**kw)
		self._colors = PCMYKColor(0,0,100,0,alpha=100), PCMYKColor(100,0,0,0,alpha=100), PCMYKColor(0,100,0,0,alpha=50), PCMYKColor(0,50,0,50,alpha=80), \
		    PCMYKColor(50,55,0,55,alpha=100), PCMYKColor(0,100,9,4,alpha=100), PCMYKColor(50,25,25,10,alpha=100), PCMYKColor(30,56,100,0,alpha=100), \
		    PCMYKColor(10,90,9,50,alpha=100), PCMYKColor(70,0,6,30,alpha=80), PCMYKColor(20,10,99,40,alpha=100), \
		    PCMYKColor(40,10,93,5,alpha=100), PCMYKColor(70,8,60,30,alpha=100), PCMYKColor(20,10,9,40,alpha=100), \
		    PCMYKColor(0,100,9,0,alpha=100), PCMYKColor(7,80,6,3,alpha=100), PCMYKColor(2,10,99,4,alpha=100)
		self._desc = []

	def addChart(self):
		self._add(self,VerticalBarChart(),name='chart',validate=None,desc=None)
		self.chart.categoryAxis.style = 'stacked'
		self.chart.y                = -130
		self.chart.x                = 60
		self.chart.width            = 690
		self.chart.height           = 250
	
		self.chart.barWidth = 50
		self.chart.groupSpacing = 15
		self.chart.valueAxis.valueMin = 0

		self.chart.categoryAxis.labels.boxAnchor = 'c'
		self.chart.categoryAxis.labels.dx  = 0
		self.chart.categoryAxis.labels.dy  = -20
		self.chart.categoryAxis.labels.angle  = 0

	def legend(self):
		self._add(self,LineLegend(),name='legend',validate=None,desc=None)
		self.legend.fontName         = FONT_TYPE_BOLD
		self.legend.fontSize         = FONT_SIZE
		self.legend.alignment        ='right'
		self.legend.colorNamePairs = zip(self._colors, self._desc)
		self.legend.dxTextSpace    = 1
		self.legend.boxAnchor      = 'sw' #'nw','n','ne','w','c','e','sw','s','se', 'autox', 'autoy'
		self.legend.yGap           = 2
		self.legend.subCols.dx     = 5
		self.legend.subCols.dy     = -4
		self.legend.subCols.rpad   = 0
		self.legend.columnMaximum  = 4
		self.legend.deltax         = 1
		self.legend.deltay         = 0
		self.legend.dx             = 15
		self.legend.dy             = 8
		self.legend.y              = -280
		self.legend.x              = 25

	def setData(self, clippings, dates):
		data = {}
		yaxis = {}
		
		for desc in clippings['data']:
			self._desc.append(desc[:20] if len(desc.strip())>20 else desc[:len(desc.strip())])
			data[desc] = []

		for desc in clippings['data']:
			for x in range(0,len(clippings['data'][desc]['data'])):
				data[desc].append((clippings['data'][desc]['data'][x]['y']))
			
		self.chart.data = []
		for desc in clippings['data']:
			self.chart.data.append(data[desc])

		self.chart.categoryAxis.strokeColor   = PCMYKColor(100,60,0,50,alpha=100)
		self.chart.categoryAxis.categoryNames = [x['label'] for x in dates]
		self._add(self,Label(),name='vaxisl',validate=None,desc=None)
		self.vaxisl.fontName       = 'Helvetica'
		self.vaxisl._text          ='Number of Clippings'
		self.vaxisl.boxAnchor      ='s'
		self.vaxisl.angle          = 90
		self.vaxisl.x              = 12
		self.vaxisl.y=(self.chart.y+self.chart.height*0.5)

		if len(self.chart.data)>0 and len(self.chart.data[0]) > 20:
			self.chart.categoryAxis.labels.angle  = 90


	def setBars(self, clippings):
		numberOfBars = len(clippings['data'])
		for i in range(0, numberOfBars):
			self.chart.bars[i].fillColor = self._colors[i]

class ClippingsDashboardChartReportExcel(object):
	def __init__(self, reportoptions, results, charttype, chartsubtype):
		self._reportoptions = reportoptions
		self._results = results
		self._finaloutput = cStringIO.StringIO()
		self._charttype = charttype
		self._chartsubtype = chartsubtype

	def stream(self):
		self.build_report()
		return self._finaloutput.getvalue()

	def build_report(self):
		ClippingsChartBuildExcelReports.build_chart_report(self._finaloutput, self._results, self._charttype, self._chartsubtype)
