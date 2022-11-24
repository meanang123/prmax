# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			test_labels
# Purpose:     test case for labels
#
# Author:       Chris Hoy
#
# Created:		23/02/2008
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import unittest
import os

from ttl.labels.labels import LabelStandardPDF
from ttl.labels.definitions import LabelInfo
from ttl.postgres import DBCompress

outputpath = "c:/output"
if not os.path.exists( outputpath ) :
	os.mkdir(outputpath)


class LabelTest(unittest.TestCase):
	def setUp(self):
		# common test data
		self.rows = [('Mr Chris Hoy','Tethys Technologies Ltd','5 Canons Field','Ash Grove','Wheathampstead','Herts','Al5 8HA'),]
		for a in xrange(4):
			self.rows.extend(self.rows)

	def tearDown(self):
		pass

	def test_print_alignments(self):
		""" """
		label_info = LabelInfo ( rows = 6, columns = 2 ,  frame = True )
		rows = [('Left','Right','Center','Justified line'),]
		label_info.setRowFont(0,inAlignment = LabelInfo.TA_LEFT )
		label_info.setRowFont(1,inAlignment = LabelInfo.TA_RIGHT )
		label_info.setRowFont(2,inAlignment = LabelInfo.TA_CENTER )
		label_info.setRowFont(3,inAlignment = LabelInfo.TA_JUSTIFY )

		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"alignment.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

		assert os.path.exists(ofile)  # missing output

	def test_print_sheet_blank_lines (self):
		""" """
		rows = [('Blank Lines','Tethys Technologies Ltd','5 Canons Field','','Wheathampstead','Herts','Al5 8HA'),]
		for a in xrange(4):
			rows.extend(rows)

		label_info = LabelInfo ( rows = 6, columns = 2 ,  frame = True )
		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"blank_line.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

		assert os.path.exists(ofile)  # missing output

	def test_print_sheet_too_many_rows (self):
		""" Test to make sure we don't overflow a label horizontally """
		label_info = LabelInfo ( rows = 20, columns = 2 ,  frame = True )
		ss=LabelStandardPDF(label_info, self.rows)
		ofile = os.path.normpath(os.path.join(outputpath,"too_many_rows_line.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

		assert os.path.exists(ofile)  # missing output

	def test_print_sheet_too_large_column (self):
		""" Test to make sure we don't overflow a label vertically """
		label_info = LabelInfo ( rows = 10, columns = 10 ,  frame = True )
		ss=LabelStandardPDF(label_info, self.rows)
		ofile = os.path.normpath(os.path.join(outputpath,"too_long_a_line.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

		assert os.path.exists(ofile)  # missing output


	def test_print_fonts(self):
		""" """
		label_info = LabelInfo ( rows = 6, columns = 2 ,  frame = True )
		rows = [('Large','Large Bold','Symbol','Norma'),]
		label_info.setRowFont(0,inFontSize=20)
		label_info.setRowFont(1,inFontSize=20,bold=True )
		label_info.setRowFont(2,inFontName="Symbol")

		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"fonts.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

	def test_print_fonts_heights(self):
		""" """
		label_info = LabelInfo ( rows = 20, columns = 2 ,  frame = True )
		rows = [('Line 1 but line 2 should fit','Large Bold','Symbol','Norma'),]
		label_info.setRowFont(0,inFontSize=20)
		label_info.setRowFont(1,inFontSize=20,bold=True )
		label_info.setRowFont(2,inFontName="Symbol")

		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"fonts_heights.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

	def test_print_sheet_blank_lines_and_fonts (self):
		""" """
		rows = [('Blank Lines','Tethys Technologies Ltd','5 Canons Field','','Wheathampstead Bold?','Herts','Al5 8HA(right)'),]
		for a in xrange(4):
			rows.extend(rows)

		label_info = LabelInfo ( rows = 6, columns = 2 ,  frame = True )
		label_info.setRowFont(4,inFontSize=14,bold=True)
		label_info.setRowFont(6,inFontSize=14,bold=True,inAlignment=LabelInfo.TA_RIGHT)
		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"blank_lines_fonts.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

		assert os.path.exists(ofile)  # missing output

	def test_print_special_characters(self):
		""" """
		rows = [('@$&<>(){}[]#~!£',"& missing but no error","html = &amp; "),]
		for a in xrange(4):
			rows.extend(rows)

		label_info = LabelInfo ( rows = 6, columns = 2 ,  frame = True )
		label_info.setRowFont(4,inFontSize=14,bold=True)
		label_info.setRowFont(6,inFontSize=14,bold=True,inAlignment=LabelInfo.TA_RIGHT)
		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"special_characters.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

		assert os.path.exists(ofile)  # missing output

	def test_pickle(self):
		""" """
		label_info = LabelInfo ( rows = 6, columns = 2 ,  frame = True )
		label_info.setRowFont(4,inFontSize=14,bold=True)
		label_info.setRowFont(6,inFontSize=14,bold=True,inAlignment=LabelInfo.TA_RIGHT)
		a = DBCompress.encode2(label_info)
		DBCompress.decode(a)

	def test_print_wrap(self):
		""" """
		label_info = LabelInfo ( rows = 20, columns = 4 ,  frame = True )
		rows = [('Line 1 but line 2 should fit need to a be a bit longer and should now work','Large Bold','Symbol','Norma'),]
		for a in xrange(0,4):
			rows.extend (rows)

		label_info.setRowFont(0,wrap=True)

		ss=LabelStandardPDF(label_info, rows)
		ofile = os.path.normpath(os.path.join(outputpath,"wrap.pdf"))
		if os.path.exists(ofile):
			os.remove( ofile )
		ss.write( ofile )

