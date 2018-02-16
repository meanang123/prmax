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
import xlsxwriter

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
DATA_STYLE_CENTER = ParagraphStyle(name = 'data_center_middle',
                                      fontName = FONT_TYPE_BOLD,
                                      fontSize = 10,
                                      alignment = TA_CENTER,
                                      valign = 'MIDDLE'
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

class StatisticsPDF(object):
	""" StatisticsPDF"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()

		banner_height=0.75*cm   # bigger the no, nearer the top!

		canvas.setFont(FONT_TYPE, 8)
		right_text='Page %d'%self.page_count
		canvas.drawString(doc.width-0.5*cm, 0.75*cm,right_text)
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
			frametop_height = 0.5*cm


			PageTemplate.__init__(self, "StatisticsPDFTemplate",
		                          [
		                            Frame(doc.leftMargin, doc.bottomMargin, doc.width-10, doc.height-frametop_height, 6, 6, 6, 6, None, showframes),
		                          ])

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, results):

		self.report = cStringIO.StringIO()
		self.document = BaseDocTemplate(self.report,
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
		self._rel = results['rel']
		self._rel_by_client = results['rel_by_client']
		self._stat = results['stat']
		self._stat_by_client = results['stat_by_client']
		self._clip_proactive_by_client = results['clip_proactive_by_client']
		self._clip_proactive = results['clip_proactive']
		self._clip_reactive_by_client = results['clip_reactive_by_client']
		self._clip_reactive = results['clip_reactive']
		self._clients = results['clients']
		self._results_eng_total_current = results['eng_total_current']
		self._results_eng_total_last = results['eng_total_last']
		self._results_stat_total_current = results['stat_total_current']
		self._results_stat_total_last = results['stat_total_last']
		self._results_rel_total_current = results['rel_total_current']
		self._results_rel_total_last = results['rel_total_last']
		self._results_clip_proactive_total_current = results['clip_proactive_total_current']
		self._results_clip_proactive_total_last = results['clip_proactive_total_last']
		self._results_clip_reactive_total_current = results['clip_reactive_total_current']
		self._results_clip_reactive_total_last = results['clip_reactive_total_last']
		self._display_date = results['display_date']
		self._engagement_label = results['labels'][0]['crm_engagement']
		self._engagement_label_plural = results['labels'][0]['crm_engagement_plural']
		self._distribution_label = results['labels'][0]['distribution_description']
		self._distribution_label_plural = results['labels'][0]['distribution_description_plural']

		col_width =self.document.width/10
		self.col_widths_dates = (col_width*2.5,col_width*4,col_width*2.5)
		self.col_widths = (col_width*1.4,col_width*1.4,col_width*2.1,col_width*2.1,col_width*2)
		self.col_widths2 = (col_width*1.4,col_width*1.4,col_width*1.1,col_width,col_width*1.1,col_width,col_width*1.1,col_width*0.9)
		self.col_widths3 = (col_width*3,col_width*2,col_width*2,col_width*2)
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

		header_dates = [(Paragraph(str(self._display_date), DATA_STYLE_CENTER))]
		header_dates = [((Paragraph("<b></b>", DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._display_date), DATA_STYLE_CENTER),),\
		                  (Paragraph("<b></b>", DATA_STYLE_CENTER)))]		
		self.append(Table(header_dates,self.col_widths_dates,self.row_heights,TABLE_HEADER,repeatRows=1))
		self.append(Spacer(10, 20))	

		header1_line1 = [((Paragraph("<b>Departments</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Number of press %s</b>" %self._engagement_label_plural, DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Number of %s & statements issued</b>" %self._distribution_label.lower(), DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Total number used</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>%used</b>", DATA_STYLE_CENTER)))]
		self.append(Table(header1_line1,self.col_widths,self.row_heights,TABLE_HEADER,repeatRows=1))
		header1_line2 = [((''),(''),
		                  (Paragraph("<b>Proactive</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Reactive</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Proactive</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Reactive</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Proactive</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Rective</b>", DATA_STYLE_CENTER)))]
		self.append(Table(header1_line2,self.col_widths2,self.row_heights,TABLE_HEADER,repeatRows=1))
#		self.append(Spacer(10, 20))	
		
		for client in self._clients:
			self._do_client(client)
		self._do_clients_totals()
			
		self.append(Spacer(10, 20))	

		header2_line1 = [((Paragraph("<b>Media Totals</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Previous Year</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Current Year</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph("<b>Varience</b>", DATA_STYLE_CENTER)))]
		self.append(Table(header2_line1,self.col_widths3,self.row_heights,TABLE_HEADER,repeatRows=1))
		header2_line2 = [((Paragraph("<b>Total No Press %s</b>" %self._engagement_label_plural, DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_eng_total_last[0]['count']), DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_eng_total_current[0]['count']), DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_eng_total_current[0]['count'] - self._results_eng_total_last[0]['count']), DATA_STYLE_CENTER)))]
		self.append(Table(header2_line2,self.col_widths3,self.row_heights,TABLE_HEADER,repeatRows=1))
		header2_line3 = [((Paragraph("<b>Total No %s/Statements issued</b>" %self._distribution_label_plural, DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_stat_total_last[0]['count']+self._results_rel_total_last[0]['count']), DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_stat_total_current[0]['count']+self._results_rel_total_current[0]['count']), DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_stat_total_current[0]['count']+self._results_rel_total_current[0]['count'] - self._results_stat_total_last[0]['count'] - self._results_rel_total_last[0]['count']), DATA_STYLE_CENTER)))]
		self.append(Table(header2_line3,self.col_widths3,self.row_heights,TABLE_HEADER,repeatRows=1))
		header2_line4 = [((Paragraph("<b>Total No %s/Statements used</b>" %self._distribution_label_plural, DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_clip_proactive_total_last[0]['count']+self._results_clip_reactive_total_last[0]['count']), DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_clip_proactive_total_current[0]['count']+self._results_clip_reactive_total_current[0]['count']), DATA_STYLE_CENTER),),\
		                  (Paragraph(str(self._results_clip_proactive_total_current[0]['count']+self._results_clip_reactive_total_current[0]['count'] - self._results_clip_proactive_total_last[0]['count'] - self._results_clip_reactive_total_last[0]['count']), DATA_STYLE_CENTER)))]
		self.append(Table(header2_line4,self.col_widths3,self.row_heights,TABLE_HEADER,repeatRows=1))
		
		issued_last = self._results_stat_total_last[0]['count']+self._results_rel_total_last[0]['count']
		issued_current = self._results_stat_total_current[0]['count']+self._results_rel_total_current[0]['count']
		used_last = self._results_clip_proactive_total_last[0]['count']+self._results_clip_reactive_total_last[0]['count']
		used_current = self._results_clip_proactive_total_current[0]['count']+self._results_clip_reactive_total_current[0]['count']

		total_used_last = self._fix_total(issued_last, issued_current)
		total_used_current = self._fix_total(used_last, used_current)

		header2_line5 = [((Paragraph("<b>Total % used</b>", DATA_STYLE_CENTER),),\
		                  (Paragraph(str(total_used_last)+'%', DATA_STYLE_CENTER),),\
		                  (Paragraph(str(total_used_current)+'%', DATA_STYLE_CENTER),),\
		                  (Paragraph(str(total_used_current - total_used_last), DATA_STYLE_CENTER)))]
		self.append(Table(header2_line5,self.col_widths3,self.row_heights,TABLE_HEADER,repeatRows=1))

	def _fix_total(self, value1, value2):
		if value1 == 0 :
			retval = 0
		elif value2 > value1:
			retval = 100
		else:
			retval = value2/value1*100	
		return retval

	def _do_clients_totals(self):

		client_eng_total = client_stat_total = client_rel_total = client_clip_pro_total = client_clip_re_total = 0
		for engagement in self._eng_by_client:
			if engagement[0] != None:
				client_eng_total += engagement[1]
		for release in self._rel_by_client:
			if release[0] != None:
				client_rel_total += release[1]
		for statement in self._stat_by_client:
			if statement[0] != None:
				client_stat_total += statement[1]
		for clip_proactive in self._clip_proactive_by_client:
			if clip_proactive[0] != None:
				client_clip_pro_total += clip_proactive[1]
		for clip_reactive in self._clip_reactive_by_client:
			if clip_reactive[0] != None:
				client_clip_re_total += clip_reactive[1]

		clip_pro_res_total = self._fix_total(client_rel_total, client_clip_pro_total)
		clip_re_res_total = self._fix_total(client_stat_total, client_clip_re_total)

		line =  [((Paragraph("<b>Total</b>", DATA_STYLE_CENTER),),\
	              (Paragraph(str(client_eng_total), DATA_STYLE_CENTER),),\
	              (Paragraph(str(client_rel_total), DATA_STYLE_CENTER),),\
	              (Paragraph(str(client_stat_total), DATA_STYLE_CENTER),),\
	              (Paragraph(str(client_clip_pro_total), DATA_STYLE_CENTER),),\
	              (Paragraph(str(client_clip_re_total), DATA_STYLE_CENTER),),\
	              (Paragraph(str(clip_pro_res_total)+'%', DATA_STYLE_CENTER),),\
	              (Paragraph(str(clip_re_res_total)+'%', DATA_STYLE_CENTER)))]
		self.append(Table(line,self.col_widths2,self.row_heights,TABLE_HEADER,repeatRows=1))		

			
	def _do_client(self, client):
		
		eng = rel = stat = clip_pro = clip_re = 0
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
				
		clip_pro_res = self._fix_total(rel, clip_pro)
		clip_re_res = self._fix_total(stat, clip_re)

		line =  [((Paragraph(str(client[0]), DATA_STYLE_CENTER),),\
		          (Paragraph(str(eng), DATA_STYLE_CENTER),),\
		          (Paragraph(str(rel), DATA_STYLE_CENTER),),\
		          (Paragraph(str(stat), DATA_STYLE_CENTER),),\
		          (Paragraph(str(clip_pro), DATA_STYLE_CENTER),),\
		          (Paragraph(str(clip_re), DATA_STYLE_CENTER),),\
		          (Paragraph(str(clip_pro_res)+'%', DATA_STYLE_CENTER),),\
		          (Paragraph(str(clip_re_res)+'%', DATA_STYLE_CENTER)))]
		self.append(Table(line,self.col_widths2,self.row_heights,TABLE_HEADER,repeatRows=1))
		

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
		header_dates = ""
		header1_relations = ["Departments","Number of Press %s" %self._results['labels'][0]['crm_engagement_plural']]#, "Number of releases & statements issued", "Total number used", "% used"]
		header2_relations = ["","", "Proactive", "Reactive", "Proactive", "Reactive", "Proactive", "Reactive"]
		header1_totals = ["Media Totals", "Previous Year", "Current Year", "Variance"]
		
		wb = xlsxwriter.Workbook(self._finaloutput)
		bold = wb.add_format({'bold': True})
		big_font = wb.add_format({'font_size':18})
		merge_format = wb.add_format({'align':'center', 'bold':True, 'valign':'center'})
		merge_format.set_text_wrap()
		self._percentage_format = wb.add_format({'num_format': '0%'})

		#Totals sheet

		self._sheet = wb.add_worksheet("Media Totals")
		self._set_columns_width(self._sheet)
		self._sheet.set_row(2, 30, merge_format)
		
		
		self._sheet.merge_range('A1:H1', self._results['display_date'], merge_format)
		self._row += 2

		self._get_headers(header1_relations, merge_format)

		self._sheet.merge_range('C3:D3', 'Number of %s & statements issued' %self._results['labels'][0]['distribution_description_plural'].lower(), merge_format)
		self._sheet.merge_range('E3:F3', 'Total number used', merge_format)
		self._sheet.merge_range('G3:H3', '% used', merge_format)

		self._get_headers(header2_relations, bold)
		
		self._print_clients()
		clients_totals = self._do_clients_totals()
		self._print_clients_totals(clients_totals)
		self._get_headers(header1_totals, bold)
		self._print_eng_totals()
		self._print_issued_totals()
		self._print_used_totals()
		total_used = self._do_total_used()
		self._print_total_used(total_used)

		wb.close()	

	def _print_eng_totals(self):
		self._sheet.write(self._row, 0, 'Total No Press %s' %self._results['labels'][0]['crm_engagement_plural'])
		self._sheet.write(self._row, 1, self._results['eng_total_last'][0]['count'])
		self._sheet.write(self._row, 2, self._results['eng_total_current'][0]['count'])
		self._sheet.write(self._row, 3, self._results['eng_total_current'][0]['count'] - self._results['eng_total_last'][0]['count'])
		self._row += 1
		
	def _print_issued_totals(self):
		self._sheet.write(self._row, 0, 'Total No %s/Statements Issued' %self._results['labels'][0]['distribution_description_plural'])
		self._sheet.write(self._row, 1, self._results['stat_total_last'][0]['count'] + self._results['rel_total_last'][0]['count'])
		self._sheet.write(self._row, 2, self._results['stat_total_current'][0]['count'] + self._results['rel_total_current'][0]['count'])
		self._sheet.write(self._row, 3, self._results['stat_total_current'][0]['count'] + self._results['rel_total_current'][0]['count'] - self._results['stat_total_last'][0]['count'] - self._results['rel_total_last'][0]['count'])
		self._row += 1
		
	def _print_used_totals(self):
		self._sheet.write(self._row, 0, 'Total No %s/Statements Used' %self._results['labels'][0]['distribution_description_plural'])
		self._sheet.write(self._row, 1, self._results['clip_proactive_total_last'][0]['count'] + self._results['clip_reactive_total_last'][0]['count'])
		self._sheet.write(self._row, 2, self._results['clip_proactive_total_current'][0]['count'] + self._results['clip_reactive_total_current'][0]['count'])
		self._sheet.write(self._row, 3, self._results['clip_proactive_total_current'][0]['count'] + self._results['clip_reactive_total_current'][0]['count'] - self._results['clip_proactive_total_last'][0]['count'] - self._results['clip_reactive_total_last'][0]['count'])
		self._row += 1
		
	def _do_total_used(self):
		issued_last = self._results['stat_total_last'][0]['count']+self._results['rel_total_last'][0]['count']
		issued_current = self._results['stat_total_current'][0]['count']+self._results['rel_total_current'][0]['count']
		used_last = self._results['clip_proactive_total_last'][0]['count']+self._results['clip_reactive_total_last'][0]['count']
		used_current = self._results['clip_proactive_total_current'][0]['count']+self._results['clip_reactive_total_current'][0]['count']

		total_used_last = self._fix_total(issued_last, used_last)
		total_used_current = self._fix_total(issued_current, used_current)

		return dict(total_used_last = total_used_last, total_used_current = total_used_current)

	def _print_total_used(self, total_used):
		self._sheet.write(self._row, 0, 'Total % Used')
		self._sheet.write(self._row, 1, total_used['total_used_last'], self._percentage_format)
		self._sheet.write(self._row, 2, total_used['total_used_current'], self._percentage_format)
		self._sheet.write(self._row, 3, (total_used['total_used_current'] - total_used['total_used_last'])*100 )
		self._row += 1

	def  _print_clients_totals(self, clients_totals):
		self._sheet.write(self._row, 0, 'Totals')
		self._sheet.write(self._row, 1, clients_totals['client_eng_total'])
		self._sheet.write(self._row, 2, clients_totals['client_rel_total'])
		self._sheet.write(self._row, 3, clients_totals['client_stat_total'])
		self._sheet.write(self._row, 4, clients_totals['client_clip_pro_total'])
		self._sheet.write(self._row, 5, clients_totals['client_clip_re_total'])
		self._sheet.write(self._row, 6, clients_totals['clip_pro_res_total'], self._percentage_format)
		self._sheet.write(self._row, 7, clients_totals['clip_re_res_total'], self._percentage_format)
		self._row += 2
		
	def _do_clients_totals(self):
		client_eng_total = client_stat_total = client_rel_total = client_clip_pro_total = client_clip_re_total = 0
		for engagement in self._results['eng_by_client']:
			if engagement[0] != None:
				client_eng_total += engagement[1]
		for release in self._results['rel_by_client']:
			if release[0] != None:
				client_rel_total += release[1]
		for statement in self._results['stat_by_client']:
			if statement[0] != None:
				client_stat_total += statement[1]
		for clip_proactive in self._results['clip_proactive_by_client']:
			if clip_proactive[0] != None:
				client_clip_pro_total += clip_proactive[1]
		for clip_reactive in self._results['clip_reactive_by_client']:
			if clip_reactive[0] != None:
				client_clip_re_total += clip_reactive[1]
		clip_pro_res_total = self._fix_total(client_rel_total, client_clip_pro_total)
		clip_re_res_total = self._fix_total(client_stat_total, client_clip_re_total)		
		return dict(client_eng_total = client_eng_total, client_stat_total = client_stat_total, client_rel_total = client_rel_total, 
		            client_clip_pro_total = client_clip_pro_total, client_clip_re_total = client_clip_re_total, 
		            clip_pro_res_total = clip_pro_res_total, clip_re_res_total = clip_re_res_total)

	def _print_clients(self):
		for client in self._results['clients']:
			self._sheet.write(self._row, 0, client[0])
			res_by_client = self._do_client(client[1])
			self._print_client(res_by_client)
			self._row +=1

	def _do_client(self, client):
		eng = rel = stat = clip_pro = clip_re = 0
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
		clip_pro_res = self._fix_total(rel, clip_pro)
		clip_re_res = self._fix_total(stat, clip_re)
		return dict(eng = eng, rel = rel, stat = stat, clip_pro = clip_pro, clip_re = clip_re, clip_pro_res = clip_pro_res, clip_re_res = clip_re_res)
	
	def  _print_client(self, res_by_client):
		self._sheet.write(self._row, 1, res_by_client['eng'])
		self._sheet.write(self._row, 2, res_by_client['rel'])
		self._sheet.write(self._row, 3, res_by_client['stat'])
		self._sheet.write(self._row, 4, res_by_client['clip_pro'])
		self._sheet.write(self._row, 5, res_by_client['clip_re'])
		self._sheet.write(self._row, 6, res_by_client['clip_pro_res'], self._percentage_format)
		self._sheet.write(self._row, 7, res_by_client['clip_re_res'], self._percentage_format)
		
	def _fix_total(self, value1, value2):
		if value1 == 0 :
			retval = 0
		elif value2 > value1:
			retval = 1
		else:
			retval = value2/value1	
		return retval
	
	def _get_headers(self, headers, bold):
		col = 0
		for header in headers:
			self._sheet.write(self._row,col, header, bold)
			col +=1
		self._row += 1

	def _set_columns_width(self, sheet):
		self._sheet.set_column('A:A', 35)
		self._sheet.set_column('B:H', 15)
			