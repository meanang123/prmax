# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		labels.py
# Purpose:     Tp generate labels
#
# Author:       Chris Hoy
#
# Created:	23/02/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

import cStringIO
from reportlab.platypus.doctemplate import PageTemplate, \
	 BaseDocTemplate, Frame, KeepTogether
from reportlab.platypus import PageBreak, Paragraph
from reportlab.platypus.tables import TableStyle, ParagraphStyle, Table
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfbase.pdfmetrics import stringWidth

from ReportLabsExtensions import ParagraphNoWrap


class LabelStandardPDF(object):
	""" creates a sheet of labels
    """
	class LabelStandardPageTemplate(PageTemplate) :
		"""PageTemplate format for labels"""
		def __init__(self, parent) :
			"""Initialise our page template."""
			# cpature parent info
			self.parent = parent
			# show frame for debugging
			showBoundary = 0 if self.parent.frame  else 1
			# have to do here otherwise doesn't work
			parent.lwidth = parent.document.width
			parent.lheight = parent.document.height

			# define page frame
			self.frame = [ Frame(0, 0,
								 parent.lwidth,
								 parent.lheight,
								 bottomPadding = parent.label_info.bottommargin*cm ,
								 topPadding = parent.label_info.topmargin*cm ,
								 leftPadding = parent.label_info.leftmargin*cm ,
								 rightPadding = parent.label_info.rightmargin*cm,
								 id="LeftColumn",
								 showBoundary=showBoundary),]
			PageTemplate.__init__(self, "LabelStandardPageTemplate", self.frame)

		def beforeDrawPage(self, canvas, doc):
			""" Compress the page ?"""
			canvas.setPageCompression(1)

	def __init__(self, label_info, labels):
		"""
        """
		self.report = cStringIO.StringIO()
		self.frame = label_info.frame
		self.document = BaseDocTemplate(
			self.report,
			pagesize = A4,
			leftMargin = 0,
			rightMargin = 0,
			topMargin = 0,
			bottomMargin = 0,
			title = label_info.title,
			author = label_info.author,
			pageCompression = 1 )

		self.lwidth = self.document.width
		self.lheight = self.document.height
		self.label_info = label_info
		self.labels = labels
		self.document.addPageTemplates(self.LabelStandardPageTemplate(self))


		# create lable info
		self.pagelabelcount = self.label_info.rows * self.label_info.columns
		self.labelheight = (self.lheight-(label_info.topmargin*cm)-(label_info.bottommargin*cm))/label_info.rows
		self.labelwidth  = (self.lwidth- (label_info.leftmargin*cm)-(label_info.rightmargin*cm))/label_info.columns
		self.objects = []

		# create std label grid
		self._STD_FRAME = TableStyle(
			[ ('ALIGN', (0,0), (-1,-1), 'LEFT'),
			  ('VALIGN',(0,0), (-1,-1),'TOP'),  ])
		spacing = 0
		if self.label_info.labelgaphorizontal:
			spacing = (self.label_info.labelgaphorizontal*cm/2)
		self._STD_FRAME.add ('TOPPADDING', (0, 0), (-1, -1), spacing)
		self._STD_FRAME.add ('BOTTOMPADDING', (0, 0), (-1, -1), spacing)
		spacing = 0
		if self.label_info.labelgapvertical:
			spacing = (self.label_info.labelgapvertical*cm/2)
		self._STD_FRAME.add ('LEFTPADDING', (0, 0), (-1, -1), spacing)
		self._STD_FRAME.add ('RIGHTPADDING', (0, 0), (-1, -1), spacing)

		# outler padding
		self._PADDED_FRAME = TableStyle(
			[('ALIGN', (0,0), (-1, -1), 'LEFT'),
			 ('VALIGN',(0,0), (-1, -1),'TOP'),
			 ('LEFTPADDING', (0, 0), (-1, -1), 0),
			 ('RIGHTPADDING', (0, 0), (-1, -1), 0),
			 ('TOPPADDING', (0, 0), (-1, -1), 4),
			 ('BOTTOMPADDING', (0, 0), (-1, -1), 0), ])
		if self.frame:
			self._PADDED_FRAME.add ('GRID', (0, 0), (-1, -1), 0.50, colors.red)

		for (key, value) in self.label_info.rowfonts.iteritems():
			self.label_info.rowfonts[key] = ParagraphStyle(**self.label_info.rowfonts[key]	)

	def stream(self):
		""" build and get the pdf file """
		# process all stuff, then write the report
		self._BuildLabels()
		self.document.build(self.objects)
		return self.report.getvalue()

	def write(self, filename):
		""" write the outlput to a file"""
		# process all stuff, then write the report
		open(filename,'wb').write(self.stream())

	def _BuildLabels(self):
		""" Create the actual labels on the pdf files"""

		count = 0
		data = []

		label_col_widths = (self.labelwidth, )
		col_widths = [self.labelwidth] * self.label_info.columns
		row_heights = [self.labelheight, ]

		actualheight = self.labelheight
		if self.label_info.labelgaphorizontal:
			actualheight -= self.label_info.labelgaphorizontal

		# determine row fit
		label_row_heights = []
		total_height = 0
		for x in xrange ( 0 , self.label_info.maxdatarows ) :
			row_height = self.label_info.getRowHeight(x)
			total_height += row_height
			if total_height < self.labelheight:
				label_row_heights.append ( row_height )

		for label in self.labels:
			if count == 0 or count % self.pagelabelcount == 0 :
				# new page
				if count:
					self.objects.append(PageBreak())
			count += 1

			# build label
			# this will need to be more complex later to allow for same lines et c
			lrows = []
			label_row_heights_row = [] # row height for current label
			for x in xrange(0, len(label)):
				# got all rows ?
				if len(label_row_heights)<= len(lrows):
					break

				# check to see if we are passed the bottom of the label
				if self.label_info.rowfonts.has_key(x) and label[x]:
					rowheightfactor = 1
					if self.label_info.rowattr[x]['wrap']:
						# calculate round factor
						width = stringWidth(label[x], self.label_info.rowfonts[x].fontName, self.label_info.rowfonts[x].fontSize)*cm
						rowheightfactor = int(round(((width*cm)/self.lwidth)+.5,0))
						para = Paragraph(label[x] , self.label_info.rowfonts[x])
					else:
						para = ParagraphNoWrap(label[x] , self.label_info.rowfonts[x])
					# add paragrapg and append height
					lrows.append ( (para,) )
					label_row_heights_row.append ( label_row_heights[x]*rowheightfactor)
			# now determine if label is too big
			height = 0.0
			for value in label_row_heights_row:
				height += value
			if height > self.labelheight:
				label_row_heights_row = label_row_heights_row[0:-1]
				lrows = lrows[0:-1]


			data.append ( Table(lrows, label_col_widths, label_row_heights_row, self._STD_FRAME) )
			# write row
			if len ( data ) == self.label_info.columns :
				t = Table( (data,),
						   col_widths,
						   row_heights,
						   self._PADDED_FRAME)
				data = []
				self.objects.append(KeepTogether(t))
		# odd label at end
		if len (data) > 0 :
			if len(data) / float(self.label_info.columns) < 1 :
				for a in xrange(len(data), self.label_info.columns):
					data.append("")
			t = Table((data,),
					  col_widths,
					  row_heights,
					  self._PADDED_FRAME)
			self.objects.append(KeepTogether(t))

