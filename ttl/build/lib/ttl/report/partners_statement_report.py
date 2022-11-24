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
                             alignment=TA_LEFT,
                             valign = 'MIDDLE'
                             )

HEADING_STYLE3=ParagraphStyle(name='heading',
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
DATA_STYLE_RIGHT=ParagraphStyle(name='data_right',
                             fontName=FONT_TYPE,
                             fontSize=10,
                             alignment=TA_RIGHT,
                             valign = 'MIDDLE'
                             )
HEADING_STYLE_RIGHT=ParagraphStyle(name='heading_right',
                             fontName=FONT_TYPE_BOLD,
                             fontSize=12,
                             alignment=TA_RIGHT,
                             valign = 'MIDDLE'
                             )
STD_FRAME = TableStyle(
    [
       # ('LINEABOVE',(0,splitlast),(2,splitlast),1,colors.black),
    ])

class PartnersStatementPDF(object):
	""" PartnertsListPDF
	"""
	# common page format for both templates:
	def logo_and_header(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		canvas.saveState()
		banner_height=1.0*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height
		tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/PRmaxletterheadtop.png'))
		Im = ImageReader(tmp)
		data = canvas.drawImage( Im, doc.leftMargin, ypos, 550,40)

		tmp = os.path.normpath(os.path.join(os.path.dirname(__file__),'resources/PRmaxletterheadbot.png'))
		Im = ImageReader(tmp)
		ypos=doc.bottomMargin- 30
		data = canvas.drawImage( Im, doc.leftMargin, ypos, 550,40)

		canvas.restoreState()

	class PartnersStatementPDFTemplate(PageTemplate) :
		"""tempate"""
		def __init__(self, parent, page_header) :
			"""Initialise our page template."""
			# we must save a pointer to our parent somewhere
			self.parent = parent
			self.page_header = page_header
			doc = parent.document
			showframes = 0
			frametop_height = 1.5*cm


			PageTemplate.__init__(self, "PartnersStatementPDFTemplate",
			                      [
			                          Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height-frametop_height-10, 6, 6, 6, 6, None, showframes),
			                      ])

		def beforeDrawPage(self, canvas, doc):
			"before draw"

			self.parent.logo_and_header(canvas, doc)

	def __init__(self, page_header, rows_invoices, rows_invoices_adj, rows_payments, rows_payments_adj, pay_total, invoice_total, customersource):
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
						title = "PartnersStatement"
						)

		for ptclass in (self.PartnersStatementPDFTemplate,):
			ptobj = ptclass(self, page_header)
			self.document.addPageTemplates(ptobj)

		self.page_header = page_header
		self.objects = []
		self.page_count = 1
		self.total_page_count = 0
		self._rows_invoices = rows_invoices
		self._rows_invoices_adj = rows_invoices_adj
		self._rows_payments = rows_payments
		self._rows_payments_adj = rows_payments_adj
		self.pay_total = pay_total
		self.invoice_total = invoice_total
		self._customersource = customersource

		col_width =self.document.width/5.0
		self.col_widths = (col_width*1.025,col_width,col_width,col_width,col_width*0.75)
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

		if self._customersource:
			self.append(Paragraph(self._customersource[0]['customersourcedescription'], DATA_STYLE))  if self._customersource[0]['customersourcedescription'] else ''
			self.append(Paragraph(self._customersource[0]['name'], DATA_STYLE)) if self._customersource[0]['name'] else ''
			self.append(Paragraph(self._customersource[0]['address1'], DATA_STYLE)) if self._customersource[0]['address1'] else ''
			self.append(Paragraph(self._customersource[0]['address2'], DATA_STYLE)) if self._customersource[0]['address2'] else ''
			self.append(Paragraph(self._customersource[0]['townname'], DATA_STYLE)) if self._customersource[0]['townname'] else ''
			self.append(Paragraph(self._customersource[0]['postcode'], DATA_STYLE)) if self._customersource[0]['postcode'] else ''
			self.append(Paragraph(self._customersource[0]['countryname'], DATA_STYLE)) if self._customersource[0]['countryname'] else ''
			self.append(Spacer(10, 50))	

		self.append(Paragraph("Invoices", HEADING_STYLE3))
		self.append(Spacer(10, 30))	
		self._generate_data_invoices()
		self._generate_data_invoices_adj()
		self.append(Paragraph("Invoices Total: £%.2f" %(self.invoice_total/100.00), HEADING_STYLE_RIGHT))
		self.append(Spacer(10, 50))	

		self.append(Paragraph("Payments", HEADING_STYLE3))
		self.append(Spacer(10, 30))	
		self._generate_data_payments()
		self._generate_data_payments_adj()
		self.append(Paragraph("Payments Total: £%.2f" %(self.pay_total/100.00), HEADING_STYLE_RIGHT))
		self.append(Spacer(10, 50))	


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

	def _generate_data_invoices(self):
		if len(self._rows_invoices)>0:
			data_invoices = [
			    ((Paragraph("Customer Name", HEADING_STYLE),),
			     (Paragraph("Invoice Date", HEADING_STYLE),),
			     (Paragraph("InvoiceNbr", HEADING_STYLE),),
			     (Paragraph("Invoice Amount", HEADING_STYLE),),
			     (Paragraph("Unallocated Amount", HEADING_STYLE))
			     )]
			#Add data for invoices
			for row in self._rows_invoices:
				data_invoices.append((
				    (Paragraph(row["customername"],DATA_STYLE),), 
				    (Paragraph(row["invoicedate"].strftime("%Y-%m-%d"),DATA_STYLE),), 
				    (Paragraph(str(row["invoicenbr"]),DATA_STYLE),), 
				    (Paragraph("£%.2f" %(row["invoiceamount"]/100.00),DATA_STYLE_RIGHT),), 
				    (Paragraph("£%.2f" %(row["unpaidamount"]/100.00),DATA_STYLE_RIGHT)),),
			                     )
			self.append(Table(data_invoices,
	                  self.col_widths,
	                  self.row_heights,
	                  STD_FRAME,
	                  repeatRows=1))
			self.append(Spacer(10, 50))	
		
	def _generate_data_invoices_adj(self):
		if len(self._rows_invoices_adj)>0:
			self.append(Paragraph("Invoices/Adjustments", HEADING_STYLE3))
			self.append(Spacer(10, 30))	
	
			data_invoices_adj = [
		        ((Paragraph("Customer Name", HEADING_STYLE),),
		         (Paragraph("Adjustment Date", HEADING_STYLE),),
		         (Paragraph("Reason", HEADING_STYLE),),
		         (Paragraph("Adjustment Type", HEADING_STYLE),),
		         (Paragraph("Unallocated Amount", HEADING_STYLE))
		         )]
	
			for row in self._rows_invoices_adj:
				data_invoices_adj.append((
			        (Paragraph(row["customername"],DATA_STYLE),), 
			        (Paragraph(row["adjustmentdate"].strftime("%Y-%m-%d"),DATA_STYLE),), 
			        (Paragraph(row["reason"],DATA_STYLE),), 
			        (Paragraph(row["adjustmenttypedescriptions"],DATA_STYLE),), 
			        (Paragraph("£%.2f" %(row["unallocated"]/100.00),DATA_STYLE_RIGHT)),),
			                         )
			self.append(Table(data_invoices_adj,
	                      self.col_widths,
	                      self.row_heights,
	                      STD_FRAME,
	                      repeatRows=1))
			self.append(Spacer(10, 30))	
			

	def _generate_data_payments(self):
		if len(self._rows_payments)>0:
			data_payments= [
				((Paragraph("Customer Name", HEADING_STYLE),),
				 (Paragraph("Actual Date", HEADING_STYLE),),
				 (Paragraph("InvoiceNbr", HEADING_STYLE),),
				 (Paragraph("Payment Type", HEADING_STYLE),),
				 (Paragraph("Unallocated Amount", HEADING_STYLE))
				 )]
			for row in self._rows_payments:
				data_payments.append((
					(Paragraph(row["customername"],DATA_STYLE),), 
					(Paragraph(row["actualdate"].strftime("%Y-%m-%d"),DATA_STYLE),), 
					(Paragraph(str(row["invoicenbr"] if row["invoicenbr"] else ''),DATA_STYLE),), 
					(Paragraph(row["customerpaymenttypename"],DATA_STYLE),), 
					(Paragraph("£%.2f" %(row["unallocated"]/100.00),DATA_STYLE_RIGHT)),),
					                 )
			self.append(Table(data_payments,
			              self.col_widths,
			              self.row_heights,
			              STD_FRAME,
			              repeatRows=1))
			self.append(Spacer(10, 50))	
		
	def _generate_data_payments_adj(self):
		
		if len(self._rows_payments_adj)>0:
			self.append(Paragraph("Payments/Adjustments", HEADING_STYLE3))
			self.append(Spacer(10, 30))	
	
			data_payments_adj = [
				((Paragraph("Customer Name", HEADING_STYLE),),
				 (Paragraph("Adjustment Date", HEADING_STYLE),),
				 (Paragraph("Reason", HEADING_STYLE),),
				 (Paragraph("Adjustment Type", HEADING_STYLE),),
				 (Paragraph("Unallocated Amount", HEADING_STYLE))
				 )]
			for row in self._rows_payments_adj:
				data_payments_adj.append((
					(Paragraph(row["customername"],DATA_STYLE),), 
					(Paragraph(row["adjustmentdate"].strftime("%Y-%m-%d"),DATA_STYLE),), 
					(Paragraph(row["reason"],DATA_STYLE),), 
					(Paragraph(row["adjustmenttypedescriptions"],DATA_STYLE),), 
					(Paragraph("£%.2f" %(row["unallocated"]/100.00),DATA_STYLE_RIGHT)),),
					                     )
			self.append(Table(data_payments_adj,
				              self.col_widths,
				              self.row_heights,
				              STD_FRAME,
				              repeatRows=1))	
			self.append(Spacer(10, 30))	
		
class PartnersStatementExcel(object):
	"""Partners List Excel"""

	def __init__(self, reportoptions, invoices, invoices_adj, payments, payments_adj, pay_total, invoice_total, customersource):

		self._invoices = invoices 
		self._invoices_adj = invoices_adj
		self._payments = payments
		self._payments_adj = payments_adj
		self._pay_total = pay_total
		self._invoice_total = invoice_total
		self._customersource = customersource
		self._reportoptions = reportoptions
		self._finaloutput = cStringIO.StringIO()

	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		return self._finaloutput.getvalue()

	def build_report(self):

		headers_invoices = ["Customer Name", "Invoice Date", "Invoice Nbr", "Invoice Amount","Unallocated Amount"]
		headers_adjustments = ["Customer Name", "Adjustment Date", "Reason", "Adjustment Type","Unallocated Amount"]
		headers_payments = ["Customer Name", "Actual Date", "Invoice Nbr", "Payment Type","Unallocated Amount"]

		wb = xlsxwriter.Workbook(self._finaloutput)
		bold = wb.add_format({'bold': True})	
		big_font = wb.add_format({'font_size':18})
		money_format = "£#,0.00".decode("utf-8")
		money = wb.add_format({'num_format': money_format})			
		money_bold = wb.add_format({'bold':True,'num_format': money_format})
		#Totals sheet
		
		self._generate_totals_sheet(wb, bold, money_bold, big_font)
		self._generate_invoices_sheet(wb, bold, money, headers_invoices)
		self._generate_adjustments_sheet(wb, bold, money, headers_adjustments, self._invoices_adj, "Invoices Adjustments")
		self._generate_payments_sheet(wb, bold, money, headers_payments)
		self._generate_adjustments_sheet(wb, bold, money, headers_adjustments, self._payments_adj, "Payments Adjustments")

		wb.close()		

	def _generate_totals_sheet(self, wb, bold, money_bold, big_font):
		ws_totals = wb.add_worksheet("Totals")
		self._set_columns_width(ws_totals)
		ws_totals.write(0,0, "Statements for %s:" % self._customersource[0][0].decode("utf-8"),big_font)

		ws_totals.write(2,0, "Total Unallocated Amounts For Invoices:",bold)
		ws_totals.write(2,1, self._invoice_total/100.00, money_bold)
		ws_totals.write(3,0, "Total Unallocated Amounts For Payments:",bold)
		ws_totals.write(3,1, self._pay_total/100.00, money_bold)

	def _generate_invoices_sheet(self, wb, bold, money, headers_invoices):
		ws_invoices = wb.add_worksheet("Invoices")
		self._set_columns_width(ws_invoices)
		self._get_headers(headers_invoices, ws_invoices, bold)
		row = 1
		col = 0
		for customername, invoicedate, invoicenbr, invoiceamount, unpaidamount in self._invoices:
			ws_invoices.write(row, col, customername.decode("utf-8"))
			ws_invoices.write(row, col+1, invoicedate.strftime("%Y-%m-%d"))
			ws_invoices.write(row, col+2, invoicenbr)
			ws_invoices.write(row, col+3, invoiceamount/100.00, money)
			ws_invoices.write(row, col+4, unpaidamount/100.00,money)
			row +=1		
	
	def _generate_adjustments_sheet(self, wb, bold, money, headers_adjustments, adjustments, title):
		ws = wb.add_worksheet(title)
		self._set_columns_width(ws)
		self._get_headers(headers_adjustments, ws, bold)
		row = 1
		col = 0
		for customername, adjustmentdate, reason, adjustmenttypedescriptions, unallocated in adjustments:
			ws.write(row, col, customername.decode("utf-8"))
			ws.write(row, col+1, adjustmentdate.strftime("%Y-%m-%d"))
			ws.write(row, col+2, reason.decode("utf-8"))
			ws.write(row, col+3, adjustmenttypedescriptions.decode("utf-8"))
			ws.write(row, col+4, unallocated/100.00,money)
			row +=1

	def _generate_payments_sheet(self, wb, bold, money, headers_payments):
		
		ws_payments = wb.add_worksheet("Payments")
		self._set_columns_width(ws_payments)
		self._get_headers(headers_payments, ws_payments, bold)
		row = 1
		col = 0
		for customername, actualdate, invoicenbr, customerpaymenttypename, unallocated in self._payments:
			ws_payments.write(row, col, customername.decode("utf-8"))
			ws_payments.write(row, col+1, actualdate.strftime("%Y-%m-%d"))
			ws_payments.write(row, col+2, invoicenbr)
			ws_payments.write(row, col+3, customerpaymenttypename.decode("utf-8"))
			ws_payments.write(row, col+4, unallocated/100.00,money)
			row +=1

	def _get_headers(self, headers, sheet, bold):
		row = 0
		col = 0
		for header in headers:
			sheet.write(row,col, header, bold)
			col +=1
	
	def _set_columns_width(self, sheet):
		sheet.set_column('A:A', 40)
		sheet.set_column('B:E', 20)
