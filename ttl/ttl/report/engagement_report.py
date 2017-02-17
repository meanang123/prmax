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
from reportlab.platypus import PageBreak
from reportlab.platypus.tables import TableStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib.utils import ImageReader

Table = tables.Table

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'

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

class EngagementPDF(object):
	""" EngagementPDF
	"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!


		#ypos=doc.pagesize[1] - doc.topMargin- banner_height
		#tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/solidmedia.png'))
		#Im = ImageReader(tmp)
		#data = canvas.drawImage( Im, doc.leftMargin, ypos, 201, 45)
		ypos=doc.pagesize[1] - doc.topMargin- banner_height

		canvas.setFont(FONT_TYPE_BOLD, 14)
		x_centre=doc.width/2.0 + 1.5*cm
		ypos=ypos + 0.75*cm
		canvas.drawCentredString(x_centre, ypos, "Engagment Report")


		canvas.setFont(FONT_TYPE, 8)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width-2*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class EngagementPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 1.5*cm


			PageTemplate.__init__(self, "EngamentPDFTemplate",
			                      [
			                        Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
			                      ])

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
						title = "Engagements"
						)

		for ptclass in (self.EngagementPDFTemplate,):
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
		if "byissue" in self.page_header:
			for row in self._rows:
				issuename = row["issue"] if row["issue"] else "No Issue"
				self.append(Paragraph("Issues: " +  row["issue"], HEADING_STYLE))
				self.append(Paragraph("Engagements:", HEADING_STYLE2))
				for engagement in row["engagement"]:
					self.append(Paragraph("&nbsp;", FOOTER))
					self._do_engagement(engagement, DETAILS_LEFT_2)
		else:
			for engagement in self._rows:
				self._do_engagement(engagement)
				self.append(Paragraph("&nbsp;", FOOTER))

	def _do_engagement(self, engagment,  style = DETAILS_LEFT):
		"_do_engagment"

		self.append(Paragraph("<b>Date : </b> " + engagment["taken_display"], style))
		self.append(Paragraph("<b>Outlet : </b>" + engagment["outletname"], style))
		self.append(Paragraph("<b>Notes : </b>" + engagment["details"].replace("\n", "<br/>"), style))
		self.append(Paragraph("<b>Outcome : </b>" + engagment["outcome"].replace("\n", "<br/>"), style))
		self.append(Paragraph("<b>Status : </b>" + engagment["contacthistorystatusdescription"], style))

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
