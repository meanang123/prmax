# -*- coding: utf-8 -*-
"""Activity report"""
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

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'

HEADING_STYLE = ParagraphStyle(name = 'heading',
							 fontName = FONT_TYPE_BOLD,
							 fontSize = 14,
							 alignment = TA_LEFT,
							 valign = 'MIDDLE'
						 )
HEADING_STYLE_LEFT = ParagraphStyle(name = 'heading',
							 fontName = FONT_TYPE_BOLD,
							 fontSize = 12,
							 alignment = TA_LEFT,
							 valign = 'TOP'
						 )

HEADING_STYLE2 = ParagraphStyle(name = 'heading2',
							 fontName = FONT_TYPE_BOLD,
							 fontSize = 14,
							 alignment = TA_LEFT,
							 valign = 'MIDDLE',
               leftIndent = 10
						 )
HEADING_STYLE_RIGHT=ParagraphStyle(name='heading_right',
                                   fontName=FONT_TYPE_BOLD,
                                   fontSize=14,
                                   alignment=TA_RIGHT,
                                   valign = 'MIDDLE'
                                   )
DETAILS_LEFT = ParagraphStyle(name = 'details_left',
							 fontName = FONT_TYPE,
							 fontSize = 10,
							 alignment = TA_LEFT,
							 valign = 'TOP',
               leftIndent = 10
							 )

DETAILS_LEFT_2 = ParagraphStyle(name = 'details_left_2',
							 fontName = FONT_TYPE,
							 fontSize = 10,
							 alignment = TA_LEFT,
							 valign = 'TOP',
               leftIndent = 15
							 )
DATA_STYLE_RIGHT=ParagraphStyle(name='data_right',
                                fontName=FONT_TYPE,
                                fontSize=10,
                                alignment=TA_RIGHT,
                                valign = 'MIDDLE'
                                )
DATA_STYLE_LEFT=ParagraphStyle(name='data_left_middle',
                                fontName=FONT_TYPE,
                                fontSize=10,
                                alignment=TA_LEFT,
                                valign = 'MIDDLE'
                                )
DATA_STYLE_LEFT_BOLD=ParagraphStyle(name='data_left_middle',
                                fontName=FONT_TYPE_BOLD,
                                fontSize=10,
                                alignment=TA_LEFT,
                                valign = 'MIDDLE'
                                )
DATA_STYLE_LEFT_2=ParagraphStyle(name='data_left_middle2',
                                fontName=FONT_TYPE,
                                fontSize=10,
                                alignment=TA_LEFT,
                                valign = 'MIDDLE',
                                leftIndent = 40,
                                rightIndent = 40
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

class ActivityPDF(object):
	""" ActivityPDF"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!


		#ypos=doc.pagesize[1] - doc.topMargin- banner_height
		#tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/solidmedia.png'))
		#Im = ImageReader(tmp)
		#data = canvas.drawImage( Im, doc.leftMargin, ypos, 201, 45)

#		ypos=doc.pagesize[1] - doc.topMargin- banner_height

#		canvas.setFont(FONT_TYPE_BOLD, 14)
#		x_centre=doc.width/2.0 + 1.5*cm
#		ypos=ypos + 0.75*cm
#		canvas.drawCentredString(x_centre, ypos, "Enquiries")


		canvas.setFont(FONT_TYPE, 8)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width-0.5*cm, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()


	class ActivityPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 0.5*cm


			PageTemplate.__init__(self, "ActivityPDFTemplate",
		                          [
		                            Frame(doc.leftMargin, doc.bottomMargin, doc.width-10, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
		                          ])

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, engagement_label, rows_eng, total_eng, completed_eng,inprogress_eng, rows_clip, total_clip, rows_rel, total_rel):
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
	                    title = "Activity Report"
	                    )

		for ptclass in (self.ActivityPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._engagement_label = engagement_label[0]['crm_engagement']
		self._engagement_label_plural = engagement_label[0]['crm_engagement_plural']
		self._rows_eng = rows_eng
		self._total_eng = total_eng
		self._completed_eng = completed_eng
		self._inprogress_eng = inprogress_eng
		self._rows_clip = rows_clip
		self._total_clip = total_clip
		self._rows_rel = rows_rel
		self._total_rel = total_rel

		col_width =self.document.width/3.0
		self.col_widths = (col_width,col_width,col_width*0.5)
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

		header1_line1 = [((Paragraph("<b>%s</b>" %self._engagement_label_plural, HEADING_STYLE_LEFT),),(''),(''))]
		header1_line2 = [((''),(Paragraph("<b>" + str(self._total_eng[0][0]) + "</b>", DATA_STYLE_RIGHT),),(Paragraph("<b>&nbsp %s</b>" %self._engagement_label_plural, DATA_STYLE_RIGHT)))]
		header1_line3 = [((''),(Paragraph("<b>" + str(self._inprogress_eng[0][0]) + "</b>", DATA_STYLE_RIGHT),),(Paragraph("<b>&nbsp In Progress</b>", DATA_STYLE_RIGHT)))]
		header1_line4 = [((''),(Paragraph("<b>" + str(self._completed_eng[0][0]) + "</b>", DATA_STYLE_RIGHT),),(Paragraph("<b>&nbsp Completed</b>", DATA_STYLE_RIGHT)))]
		self.append(Table(header1_line1,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Table(header1_line2,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Table(header1_line3,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Table(header1_line4,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Spacer(10, 20))			

		for engagement in self._rows_eng:
			self._do_engagement(engagement)
			self.append(Paragraph("&nbsp;", FOOTER))


		self.append(Spacer(10, 20))
		headerclip_line1 = [((Paragraph("<b>Coverage</b>", HEADING_STYLE_LEFT),),(''),(''))]
		headerclip_line2 = [((''),(Paragraph("<b>" + str(self._total_clip[0][0]) + "</b>", DATA_STYLE_RIGHT),),(Paragraph("<b>&nbsp Coverage</b>", DATA_STYLE_RIGHT)))]
		self.append(Table(headerclip_line1,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Table(headerclip_line2,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Spacer(10, 20))			

		for clipping in self._rows_clip:
			self._do_clippings(clipping)
			self.append(Paragraph("&nbsp;", FOOTER))

		self.append(Spacer(10, 20))
		headerrel_line1 = [((Paragraph("<b>Releases</b>", HEADING_STYLE_LEFT),),(''),(''))]
		headerrel_line2 = [((''),(Paragraph("<b>" + str(self._total_rel[0][0]) + "</b>", DATA_STYLE_RIGHT),),(Paragraph("<b>&nbsp Releases</b>", DATA_STYLE_RIGHT)))]
		self.append(Table(headerrel_line1,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Table(headerrel_line2,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Spacer(10, 20))			

		for release in self._rows_rel:
			self._do_releases(release)
			self.append(Paragraph("&nbsp;", FOOTER))

	def _do_releases(self, release,  style = DETAILS_LEFT):
		"_do_releases"

		first_line = [((Paragraph(str(release["clientname"]) if release["clientname"] else "", DATA_STYLE_LEFT_BOLD),),(''),(''))]
		second_line = [((Paragraph(str(release["sent_time"]), DATA_STYLE_LEFT),),(''),(''))]
		self.append(Table(first_line,self.col_widths,self.row_heights,STD_FRAME,repeatRows=1))
		self.append(Table(second_line,self.col_widths,self.row_heights,STD_FRAME,repeatRows=1))
		self.append(Spacer(10, 5))
		self.append(Paragraph(release["subject"].replace("\n", "<br/>"), DATA_STYLE_LEFT_2))

		self.append(Spacer(10, 5))
		self.append(MLine(40,0,480,0))

	def _do_clippings(self, clipping,  style = DETAILS_LEFT):
		"_do_clippings"

		first_line = [((Paragraph(str(clipping["clientname"]) if clipping["clientname"] else "", DATA_STYLE_LEFT_BOLD),),(''),(''))]
		second_line = [((Paragraph(clipping["source_date"], DATA_STYLE_LEFT),),
		                (Paragraph("<b>" + clipping["outletname"] + "</b>" if clipping["outletname"] else "", DATA_STYLE_LEFT),),(''))]
		self.append(Table(first_line,self.col_widths,self.row_heights,STD_FRAME,repeatRows=1))
		self.append(Table(second_line,self.col_widths,self.row_heights,STD_FRAME,repeatRows=1))
		self.append(Spacer(10, 5))
		self.append(Paragraph(clipping["clip_title"].replace("\n", "<br/>"), DATA_STYLE_LEFT_2))
#		self.append(Paragraph(clipping["clip_abstract"].replace("\n", "<br/>"), DATA_STYLE_LEFT_2))

		self.append(Spacer(10, 5))
		self.append(MLine(40,0,480,0))


	def _do_engagement(self, engagment,  style = DETAILS_LEFT):
		"_do_engagment"

		first_line = [((Paragraph(str(engagment["clientname"]) if engagment["clientname"] else "", DATA_STYLE_LEFT_BOLD),),(''),(''))]
		second_line = [
		    ((Paragraph(engagment["taken_display"], DATA_STYLE_LEFT),),
		    (Paragraph("<b>" + engagment["outletname"] + "</b>", DATA_STYLE_LEFT),),
		    (Paragraph(engagment["contacthistorystatusdescription"], DATA_STYLE_RIGHT))
		)]
		details = [((Paragraph(engagment["details"].replace("\n", "<br/>"), DATA_STYLE_LEFT),),)]
		outcome = [((Paragraph(engagment["outcome"].replace("\n", "<br/>"), DATA_STYLE_LEFT),),)]
		self.append(Table(first_line,self.col_widths,self.row_heights,STD_FRAME,repeatRows=1))
		self.append(Table(second_line,self.col_widths,self.row_heights,STD_FRAME,repeatRows=1))
		self.append(Spacer(10, 5))
		self.append(Paragraph(engagment["details"].replace("\n", "<br/>"), DATA_STYLE_LEFT_2))
		self.append(Paragraph(engagment["outcome"].replace("\n", "<br/>"), DATA_STYLE_LEFT_2))

		self.append(Spacer(10, 5))
		self.append(MLine(40,0,480,0))


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
			