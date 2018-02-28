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
from reportlab.lib.pagesizes import letter, landscape, A4
Table = tables.Table
import xlsxwriter

FONT_TYPE='Helvetica'
FONT_TYPE_BOLD='Helvetica-Bold'

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
DATA_STYLE_CENTER = ParagraphStyle(name = 'data_center_middle',
                                      fontName = FONT_TYPE,
                                      fontSize = 10,
                                      alignment = TA_CENTER,
                                      valign = 'MIDDLE'
                                      )

TABLE_HEADER = TableStyle(
    [
        ('BACKGROUND',(0,0),(-1, 0),colors.Color(1,1,1))
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

class StatisticsPDF(object):
	""" StatisticsPDF"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!

		canvas.setFont(FONT_TYPE, 8)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width, 0.75*cm,right_text)
		self.page_count+=1

		left_text="Printed %s" % datetime.datetime.today().strftime("%d/%m/%y %H:%M")
		canvas.drawString(0.75*cm, 0.75*cm,left_text)

		canvas.restoreState()

	class StatisticsPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 9*cm
			pagesize = landscape(A4)

			PageTemplate.__init__(self, "StatisticsPDFTemplate",
		                          [
		                            Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, 6, 6, 6, 6, None, showframes),
		                          ], pagesize = pagesize)

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, results):

		self.report = cStringIO.StringIO()
		self.document = BaseDocTemplate(self.report,
				        pagesize = landscape(A4),
	                    leftMargin = 1*cm,
	                    rightMargin = 1*cm,
	                    topMargin = 1*cm,
	                    bottomMargin = 1.5*cm,
	            author = "Prmax",
	                    pageCompression = 1,
	                    title = "Statistics Report"
	                    )

		for ptclass in (self.StatisticsPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._eng = results['eng']
		self._eng_by_client = results['eng_by_client']
		self._eng_no_client = results['eng_no_client']
		self._rel = results['rel']
		self._rel_by_client = results['rel_by_client']
		self._rel_no_client = results['rel_no_client']
		self._rel_with_clips_by_client = results['rel_with_clips_by_client']
		self._rel_with_clips_no_client = results['rel_with_clips_no_client']
		self._stat = results['stat']
		self._stat_by_client = results['stat_by_client']
		self._stat_no_client = results['stat_no_client']
		self._stat_with_clips_by_client = results['stat_with_clips_by_client']
		self._stat_with_clips_no_client = results['stat_with_clips_no_client']
		self._clip_proactive_by_client = results['clip_proactive_by_client']
		self._clip_proactive_no_client = results['clip_proactive_no_client']
		self._clip_proactive = results['clip_proactive']
		self._clip_reactive_by_client = results['clip_reactive_by_client']
		self._clip_reactive_no_client = results['clip_reactive_no_client']
		self._clip_reactive = results['clip_reactive']
		self._clients = results['clients']
		self._results_eng_total_current = results['eng_total_current']
		self._results_eng_total_last = results['eng_total_last']
		self._results_stat_total_current = results['stat_total_current']
		self._results_stat_total_last = results['stat_total_last']
		self._results_rel_total_current = results['rel_total_current']
		self._results_rel_total_last = results['rel_total_last']
		self._results_rel_with_clip_total_current = results['rel_with_clip_total_current']
		self._results_rel_with_clip_total_last = results['rel_with_clip_total_last']
		self._results_stat_with_clip_total_current = results['stat_with_clip_total_current']
		self._results_stat_with_clip_total_last = results['stat_with_clip_total_last']
		self._display_date = results['display_date']

		col_width =self.document.width/20
		self.col_widths_dates = (col_width,col_width*18,col_width*1)
		self.col_widths2 = (col_width*3.5,col_width*2.5,col_width*2,col_width*2,col_width*2,col_width*2,col_width*1.5,col_width*1.5,col_width*1.5,col_width*1.5)
		self.col_widths3 = (col_width*5,col_width*2.5,col_width*2.5,col_width*2.5,col_width*2.5,col_width*5)
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

		header_dates = [((Paragraph("<b></b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Media Statisctics Report for: %s</b>" %str(self._display_date), DATA_STYLE_CENTER),),\
		                  (Paragraph("<b></b>", DATA_STYLE_CENTER)))]		
		self.append(Table(header_dates,self.col_widths_dates,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Spacer(10, 20))	

		header1_line2 = [((Paragraph("<b>Departments</b>", DATA_STYLE_LEFT_BOLD),),\
				          (Paragraph("<b>Number of Press Enquiries</b>", DATA_STYLE_CENTER),),\
				          (Paragraph("<b>Proactive Releases</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Reactive Statements</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Proactive Coverage</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Reactive Coverage</b>", DATA_STYLE_CENTER),),\
				          (Paragraph("<b>Proactive Used</b>", DATA_STYLE_CENTER),),\
				          (Paragraph("<b>Reactive Used</b>", DATA_STYLE_CENTER),),\
				          (Paragraph("<b>Proactive % Used</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Reactive % Used</b>", DATA_STYLE_CENTER)))]
		self.append(Table(header1_line2,self.col_widths2,self.row_heights,TABLE_HEADER,repeatRows=1))
		
		for client in self._clients:
			self._do_client(client)
		self._print_other()
		self.append(Spacer(10, 50))

		self._print_media_total_line1()
		self._print_media_total_line2()
		self._print_media_total_line3()
		self._print_media_total_line4()
		self._print_media_total_line5()

	def _print_media_total_line1(self):
		col1 = "<b>Media Totals</b>"
		col2 = "<b>Previous Year</b>"
		col3 = "<b>Current Year</b>"
		col4 = "<b>Variance</b>"
		col5 = "<b>Variance %</b>"
		self._print_line(col1,col2,col3,col4,col5)

	def _print_media_total_line2(self):
		previous_year = self._results_eng_total_last[0]['count']
		current_year = self._results_eng_total_current[0]['count']
		variance = current_year - previous_year
		variance_percent = self._do_division_percentage(variance, previous_year)
		col1 = "<b>Total No Press Enquiries</b>"
		col2 = str(previous_year)
		col3 = str(current_year)
		col4 = str(variance)
		col5 = str(int(variance_percent))+'%'
		self._print_line(col1,col2,col3,col4,col5)

	def _print_media_total_line3(self):
		previous_year = self._results_stat_total_last[0]['count']+self._results_rel_total_last[0]['count']
		current_year = self._results_stat_total_current[0]['count']+self._results_rel_total_current[0]['count']
		variance = current_year - previous_year
		variance_percent = self._do_division_percentage(variance, previous_year)
		col1 = "<b>Total No Press Releases/Statements issued</b>"
		col2 = str(previous_year)
		col3 = str(current_year)
		col4 = str(variance)
		col5 = str(int(variance_percent))+'%'
		self._print_line(col1,col2,col3,col4,col5)

	def _print_media_total_line4(self):
		previous_year = self._results_stat_with_clip_total_last[0]['count']+self._results_rel_with_clip_total_last[0]['count']
		current_year = self._results_stat_with_clip_total_current[0]['count']+self._results_rel_with_clip_total_current[0]['count']
		variance = current_year - previous_year
		variance_percent = self._do_division_percentage(variance, previous_year)
		col1 = "<b>Total Used</b>"
		col2 = str(previous_year)
		col3 = str(current_year)
		col4 = str(variance)
		col5 = str(int(variance_percent))+'%'
		self._print_line(col1,col2,col3,col4,col5)

	def _print_media_total_line5(self):
		previous_year1 = self._results_stat_total_last[0]['count']+self._results_rel_total_last[0]['count']
		previous_year2 = self._results_stat_with_clip_total_last[0]['count']+self._results_rel_with_clip_total_last[0]['count']
		previous_year = self._do_division_percentage(previous_year1, previous_year2)
		current_year1 = self._results_stat_total_current[0]['count']+self._results_rel_total_current[0]['count']
		current_year2 = self._results_stat_with_clip_total_current[0]['count']+self._results_rel_with_clip_total_current[0]['count']
		current_year = self._do_division_percentage(current_year1, current_year2)
		variance = current_year - previous_year
		variance_percent = self._do_division_percentage(variance, previous_year)
		col1 = "<b>Total % Used</b>"
		col2 = str(int(previous_year))+'%'
		col3 = str(int(current_year))+'%'
		col4 = str(int(variance))+'%'
		col5 = str(int(variance_percent))+'%'
		self._print_line(col1,col2,col3,col4,col5)

	def _print_line(self, col1,col2,col3,col4,col5):
		line = [((Paragraph(col1, DATA_STYLE_LEFT),),\
				 (Paragraph(col2, DATA_STYLE_CENTER),),\
				 (Paragraph(col3, DATA_STYLE_CENTER),),\
				 (Paragraph(col4, DATA_STYLE_CENTER),),\
				 (Paragraph(col5, DATA_STYLE_CENTER),),\
				 (Paragraph("", DATA_STYLE_CENTER)))]
		self.append(Table(line,self.col_widths3,self.row_heights,TABLE_HEADER,repeatRows=1))
			
	def _do_client(self, client):
		eng = rel = stat = rel_with_clip = stat_with_clip = clip_pro = clip_re = rel_used = stat_used = 0
		for engagement in self._eng_by_client:
			if engagement[0] == client[1]:
				eng = engagement[1]
		for release in self._rel_by_client:
			if release[0] == client[1]:
				rel = release[1]
		for statement in self._stat_by_client:
			if statement[0] == client[1]:
				stat = statement[1]
		for clip_proactive in self._clip_proactive_by_client:
			if clip_proactive[0] == client[1]:
				clip_pro = clip_proactive[1]
		for clip_reactive in self._clip_reactive_by_client:
			if clip_reactive[0] == client[1]:
				clip_re = clip_reactive[1]
		for release_with_clip in self._rel_with_clips_by_client:
			if release_with_clip[0] == client[1]:
				rel_with_clip = release_with_clip[1]
		for statement_with_clip in self._stat_with_clips_by_client:
			if statement_with_clip[0] == client[1]:
				stat_with_clip = statement_with_clip[1]
		rel_used = self._do_division_percentage(rel, rel_with_clip)
		stat_used = self._do_division_percentage(stat, stat_with_clip)

		line =  [((Paragraph(str(client[0]), DATA_STYLE_LEFT),),\
		          (Paragraph(str(eng), DATA_STYLE_CENTER),),\
		          (Paragraph(str(rel), DATA_STYLE_CENTER),),\
		          (Paragraph(str(stat), DATA_STYLE_CENTER),),\
		          (Paragraph(str(clip_pro), DATA_STYLE_CENTER),),\
		          (Paragraph(str(clip_re), DATA_STYLE_CENTER),),\
				  (Paragraph(str(rel_with_clip), DATA_STYLE_CENTER),),\
				  (Paragraph(str(stat_with_clip), DATA_STYLE_CENTER),),\
				  (Paragraph(str(int(rel_used))+'%', DATA_STYLE_CENTER),),\
		          (Paragraph(str(int(stat_used))+'%', DATA_STYLE_CENTER)))]
		self.append(Table(line,self.col_widths2,self.row_heights,TABLE_HEADER,repeatRows=1))

	def  _print_other(self):
		rel_used = self._do_division_percentage(self._rel_no_client[0]['count'] if self._rel_no_client else 0, self._rel_with_clips_no_client[0]['count'] if self._rel_with_clips_no_client else 0)
		stat_used = self._do_division_percentage(self._stat_no_client[0]['count'] if self._stat_no_client else 0, self._stat_with_clips_no_client[0]['count'] if self._stat_with_clips_no_client else 0)
		line =  [((Paragraph("Other", DATA_STYLE_LEFT),),\
		          (Paragraph(str(self._eng_no_client[0]['count'] if self._eng_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(self._rel_no_client[0]['count'] if self._rel_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(self._stat_no_client[0]['count'] if self._stat_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(self._clip_proactive_no_client[0]['count'] if self._clip_proactive_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(self._clip_reactive_no_client[0]['count'] if self._clip_reactive_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(self._rel_with_clips_no_client[0]['count'] if self._rel_with_clips_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(self._stat_with_clips_no_client[0]['count'] if self._stat_with_clips_no_client else 0), DATA_STYLE_CENTER),),\
		          (Paragraph(str(int(rel_used))+'%', DATA_STYLE_CENTER),),\
		          (Paragraph(str(int(stat_used))+'%', DATA_STYLE_CENTER)))]
		self.append(Table(line,self.col_widths2,self.row_heights,TABLE_HEADER,repeatRows=1))


	def _do_division_percentage(self, value1, value2):
		if value2 == 0 or value2 == 0:
			retval = 0
		else:
			retval = value1/(value2 * 1.0)
		return round(retval,2)*100

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


class StatisticsExcel(object):
	"""Partners List Excel"""

	def __init__(self, reportoptions, results):


		self._reportoptions = reportoptions
		self._results = results
		self._finaloutput = cStringIO.StringIO()

	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		return self._finaloutput.getvalue()

	def build_report(self):

		self._row = 0
		header_relations = ["Department","Number of Press Enquiries", "Proactive Releases", "Reactive Statements", "Proactive Coverage", "Reactive Coverage", "Proactive Used", "Reactive Used", "Proactive % Used", "Reactive % Used"]
		header1_totals = ["Media Totals", "Previous Year", "Current Year", "Variance", "Variance %"]
		
		wb = xlsxwriter.Workbook(self._finaloutput)
		bold = wb.add_format({'bold': True})
		merge_format = wb.add_format({'align':'center', 'bold':True, 'valign':'center'})
		merge_format.set_text_wrap()
		self._percentage_format = wb.add_format({'num_format': '0%'})

		self._sheet = wb.add_worksheet("Media Totals")
		self._set_columns_width(self._sheet)
		self._sheet.set_row(2, 30, merge_format)
		
		self._sheet.merge_range('A1:J1', 'Media Statistics Report for: %s' % self._results['display_date'], merge_format)
		self._row += 2

		self._get_headers(header_relations, bold)
		
		self._print_clients()
		self._print_other()
		self._get_headers(header1_totals, bold)
		self._print_eng_totals()
		self._print_issued_totals()
		self._print_used_totals()
		self._print_total_used()

		wb.close()	

	def _print_eng_totals(self):
		self._sheet.write(self._row, 0, 'Total No Press Enquiries')
		previous_year = self._results['eng_total_last'][0]['count']
		current_year = self._results['eng_total_current'][0]['count']
		self._print_total_rows(current_year, previous_year)

	def _print_issued_totals(self):
		self._sheet.write(self._row, 0, 'Total No Press Releases/Statements Issued')
		previous_year = self._results['stat_total_last'][0]['count'] + self._results['rel_total_last'][0]['count']
		current_year = self._results['stat_total_current'][0]['count'] + self._results['rel_total_current'][0]['count']
		self._print_total_rows(current_year, previous_year)

	def _print_used_totals(self):
		self._sheet.write(self._row, 0, 'Total Used')
		previous_year = self._results['rel_with_clip_total_last'][0]['count'] + self._results['stat_with_clip_total_last'][0]['count']
		current_year = self._results['rel_with_clip_total_current'][0]['count'] + self._results['stat_with_clip_total_current'][0]['count']
		self._print_total_rows(current_year, previous_year)

	def _print_total_used(self):
		self._sheet.write(self._row, 0, 'Total % Used')
		previous_year_all = self._results['stat_total_last'][0]['count'] + self._results['rel_total_last'][0]['count']
		previous_year_with_clip = self._results['rel_with_clip_total_last'][0]['count'] + self._results['stat_with_clip_total_last'][0]['count']
		previous_year = self._do_division(previous_year_all, previous_year_with_clip)
		current_year_all = self._results['stat_total_current'][0]['count'] + self._results['rel_total_current'][0]['count']
		current_year_with_clip = self._results['rel_with_clip_total_current'][0]['count'] + self._results['stat_with_clip_total_current'][0]['count']
		current_year = self._do_division(current_year_all, current_year_with_clip)
		variance = current_year - previous_year
		self._sheet.write(self._row, 1, previous_year, self._percentage_format)
		self._sheet.write(self._row, 2, current_year, self._percentage_format)
		self._sheet.write(self._row, 3, variance, self._percentage_format)
		self._sheet.write(self._row, 4, self._do_division(variance, previous_year), self._percentage_format)
		self._row += 1

	def _print_total_rows(self, current_year, previous_year):
		variance = current_year - previous_year
		self._sheet.write(self._row, 1, previous_year)
		self._sheet.write(self._row, 2, current_year)
		self._sheet.write(self._row, 3, variance)
		self._sheet.write(self._row, 4, self._do_division(variance, previous_year), self._percentage_format)
		self._row += 1

	def  _print_other(self):
		self._sheet.write(self._row, 0, 'Other')
		self._sheet.write(self._row, 1, self._results['eng_no_client'][0]['count'] if self._results['eng_no_client'] else 0)
		self._sheet.write(self._row, 2, self._results['rel_no_client'][0]['count'] if self._results['rel_no_client'] else 0)
		self._sheet.write(self._row, 3, self._results['stat_no_client'][0]['count'] if self._results['stat_no_client'] else 0)
		self._sheet.write(self._row, 4, self._results['clip_proactive_no_client'][0]['count'] if self._results['clip_proactive_no_client'] else 0)
		self._sheet.write(self._row, 5, self._results['clip_reactive_no_client'][0]['count'] if self._results['clip_reactive_no_client'] else 0)
		self._sheet.write(self._row, 6, self._results['rel_with_clips_no_client'][0]['count'] if self._results['rel_with_clips_no_client'] else 0)
		self._sheet.write(self._row, 7, self._results['stat_with_clips_no_client'][0]['count'] if self._results['stat_with_clips_no_client'] else 0)

		self._sheet.write(self._row, 8, self._do_division(self._results['rel_no_client'][0]['count'] if self._results['eng_no_client'] else 0,self._results['rel_with_clips_no_client'][0]['count'] if self._results['rel_with_clips_no_client'] else 0), self._percentage_format)
		self._sheet.write(self._row, 9, self._do_division(self._results['stat_no_client'][0]['count'] if self._results['stat_no_client'] else 0,self._results['stat_with_clips_no_client'][0]['count'] if self._results['stat_with_clips_no_client'] else 0), self._percentage_format)
		self._row += 2
		
	def _print_clients(self):
		for client in self._results['clients']:
			self._sheet.write(self._row, 0, client[0])
			res_by_client = self._do_client(client[1])
			self._print_client(res_by_client)
			self._row +=1

	def _do_client(self, client):
		eng = rel = stat = rel_with_clip = stat_with_clip = clip_pro = clip_re = rel_used = stat_used = 0
		for engagement in self._results['eng_by_client']:
			if engagement[0] == client:
				eng = engagement[1]
		for release in self._results['rel_by_client']:
			if release[0] == client:
				rel = release[1]
		for statement in self._results['stat_by_client']:
			if statement[0] == client:
				stat = statement[1]
		for clip_proactive in self._results['clip_proactive_by_client']:
			if clip_proactive[0] == client:
				clip_pro = clip_proactive[1]
		for clip_reactive in self._results['clip_reactive_by_client']:
			if clip_reactive[0] == client:
				clip_re = clip_reactive[1]
		for release_with_clip in self._results['rel_with_clips_by_client']:
			if release_with_clip[0] == client:
				rel_with_clip = release_with_clip[1]
		for statement_with_clip in self._results['stat_with_clips_by_client']:
			if statement_with_clip[0] == client:
				stat_with_clip = statement_with_clip[1]
		rel_used = self._do_division(rel, rel_with_clip)
		stat_used = self._do_division(stat, stat_with_clip)

		return dict(eng = eng, rel = rel, stat = stat, clip_pro = clip_pro, clip_re = clip_re, rel_with_clip = rel_with_clip, stat_with_clip = stat_with_clip, rel_used = rel_used, stat_used = stat_used)

	def  _print_client(self, res_by_client):
		self._sheet.write(self._row, 1, res_by_client['eng'])
		self._sheet.write(self._row, 2, res_by_client['rel'])
		self._sheet.write(self._row, 3, res_by_client['stat'])
		self._sheet.write(self._row, 4, res_by_client['clip_pro'])
		self._sheet.write(self._row, 5, res_by_client['clip_re'])
		self._sheet.write(self._row, 6, res_by_client['rel_with_clip'])
		self._sheet.write(self._row, 7, res_by_client['stat_with_clip'])
		self._sheet.write(self._row, 8, res_by_client['rel_used'], self._percentage_format)
		self._sheet.write(self._row, 9, res_by_client['stat_used'], self._percentage_format)

	def _do_division(self, value1, value2):
		if value2 == 0 or value2 == 0:
			retval = 0
		else:
			retval = value1/(value2 * 1.0)
		return round(retval,2)

	def _get_headers(self, headers, bold):
		col = 0
		for header in headers:
			self._sheet.write(self._row, col, header, bold)
			col +=1
		self._row += 1

	def _set_columns_width(self, sheet):
		self._sheet.set_column('A:A', 35)
		self._sheet.set_column('B:J', 15)
			