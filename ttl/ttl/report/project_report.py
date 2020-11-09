# -*- coding: utf-8 -*-
"""Project report"""


import cStringIO
import datetime
import os
import xlsxwriter

class ProjectExcel(object):
	"""Partners List Excel"""

	def __init__(self, reportoptions, results, dates):


		self._reportoptions = reportoptions
		self._results = results
		self._display_dates = dates
		self._finaloutput = cStringIO.StringIO()

	def stream(self):
		"stream"
		# process all stuff, then write the report

		self.build_report()
		return self._finaloutput.getvalue()

	def build_report(self):

		self._row = 0
		header = [""]
		header_items = ["Outletname", "Owner", "Date", "Type", "Notes"]

		
		wb = xlsxwriter.Workbook(self._finaloutput)
		bold = wb.add_format({'bold': True})
		merge_format = wb.add_format({'align':'center', 'bold':True, 'valign':'center'})
		merge_format.set_text_wrap()
		self._percentage_format = wb.add_format({'num_format': '0%'})

		self._sheet = wb.add_worksheet(self._results[0]['researchprojectname'])
		self._set_columns_width(self._sheet)

		self._sheet.merge_range('A1:J1', 'Projects Report for: %s' % self._display_dates, merge_format)
		self._row += 2
		
		self._get_headers(header_items, bold)
		
		self._print_items()

		wb.close()	

	def _print_items(self):
		for item in self._results:
			
			
			item['researchprojectitemhistorydate'] = (datetime.datetime.strptime(str(item['researchprojectitemhistorydate']),"%Y-%m-%d" ).strftime('%d/%m/%Y'))			
			
			self._sheet.write(self._row, 0, item['outletname'])
			self._sheet.write(self._row, 1, item['user_name'])
			self._sheet.write(self._row, 2, item['researchprojectitemhistorydate'])
			self._sheet.write(self._row, 3, item['researchprojectitemhistorytypedescription'])
			self._sheet.write(self._row, 4, item['researchprojectitemhistorydescription'])
			self._row +=1

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
			