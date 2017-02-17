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

from reportlab.lib.colors import purple, PCMYKColor, black, pink, green, blue
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.charts.legends import LineLegend
from reportlab.graphics.shapes import Drawing, _DrawingEditorMixin
from reportlab.lib.validators import Auto
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.pdfbase.pdfmetrics import stringWidth, EmbeddedType1Face, registerTypeFace, Font, registerFont
from reportlab.graphics.charts.axes import XValueAxis, YValueAxis, AdjYValueAxis, NormalDateXValueAxis

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'
FONT_SIZE = 10

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

class ClippingsLinesChartPDF(object):
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
		canvas.drawCentredString(x_centre, ypos, "Clippings Report - Dates Summary Chart")

		canvas.setFont(FONT_TYPE, 10)
		right_text='Page %d'%self.page_count
#		canvas.drawString(doc.width-0.75*cm, 0.75*cm,right_text)
		canvas.drawString(doc.width+8.75*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class ClippingsLinesChartPDFTemplate(PageTemplate) :
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
	
			PageTemplate.__init__(self, "ClippingsLinesChartPDFTemplate",
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
	
		for ptclass in (self.ClippingsLinesChartPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)
	
		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows = rows
		self.dates = simplejson.loads(page_header['drange'])
	
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
		lines.legend()
		lines.setLines()
		lines.setData(self._rows, self.dates)
	
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
		self._clippingstypesdescriptions = [NEWS_DB_DESC,TWITTER_DB_DESC,FACEBOOK_DB_DESC,FORUMS_DB_DESC,BLOGS_DB_DESC,INSTAGRAM_DB_DESC,YOUTUBE_DB_DESC,GOOGLEPLUS_DB_DESC,TUMBLR_DB_DESC,VKONTAKTE_DB_DESC,CHAT_DB_DESC]

	def addChart(self):
		self._add(self,LinePlot(),name='chart',validate=None,desc=None)
		self.chart.y                = -150
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
		self.legend.dx               = 5
		self.legend.colorNamePairs = zip(self._colors, self._clippingstypesdescriptions)
		self.legend.dxTextSpace    = 2
		self.legend.boxAnchor      = 'nw'
		self.legend.subCols.dx     = 0
		self.legend.subCols.dy     = -4
		self.legend.subCols.rpad   = 0
		self.legend.columnMaximum  = 1
		self.legend.deltax         = 1
		self.legend.deltay         = 0
		self.legend.dy             = 8
		self.legend.y              = 150
		self.legend.x              = 30
		
	def setData(self, clippings, dates):
		clippingstypes_db_trans={NEWS_DB_DESC:3,
		                         TWITTER_DB_DESC:4,
				                 FACEBOOK_DB_DESC:5,
				                 FORUMS_DB_DESC:6,
				                 BLOGS_DB_DESC:7,
				                 INSTAGRAM_DB_DESC:8,
				                 YOUTUBE_DB_DESC:9,
				                 GOOGLEPLUS_DB_DESC:10,
				                 TUMBLR_DB_DESC:11,
				                 VKONTAKTE_DB_DESC:12,
				                 CHAT_DB_DESC:13
				                 }  
		data = {}
		yaxis = {}

		yaxis = {}
		for typedesc in clippingstypes_db_trans:
			data[typedesc] = []

#		firstclipsdate = min(x['clip_source_date'] for x in clippings)
#		firstclipsdate = firstclipsdate - timedelta(days=1)
#		lastclipsdate = max(x['clip_source_date'] for x in clippings)
		firstclipsdate  = datetime.strptime(dates["from_date"], '%Y-%m-%d').date()
		lastclipsdate = datetime.strptime(dates['to_date'], '%Y-%m-%d').date()
		numberofdays = (lastclipsdate - firstclipsdate).days
		
		for daynumber in range(0, numberofdays+1):
			currentdate = firstclipsdate + timedelta(days=daynumber)

			for typedesc in clippingstypes_db_trans:
				yaxis[typedesc] = 0
			for clip in clippings:
					if clip['clip_source_date'] == currentdate:
						yaxis[clip['clippingstypedescription']] = clip['count']
			for typedesc in clippingstypes_db_trans:
				data[typedesc].append((str(currentdate), yaxis[typedesc])) 

		self.chart.data = []
		for typedesc in self._clippingstypesdescriptions:
			self.chart.data.append(data[typedesc])
		
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
		

