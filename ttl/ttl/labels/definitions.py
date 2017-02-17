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

class LabelInfo(object):
	""" Control object for labels"""
	TA_LEFT = 0
	TA_CENTER = 1
	TA_RIGHT = 2
	TA_JUSTIFY = 4
	__field_list = ("rows", "columns", "topmargin", "bottommargin",
		"leftmargin", "rightmargin", "labelgapvertical", "labelgaphorizontal",
		"labelshrinkvertical", "labelshrinkhorizontal", "fontname", "fontsize",
		"frame", "maxdatarows", "reporttemplateid")

	def __init__( self, rows = 7 ,
				  columns = 3,
				  topmargin = 0.5,
				  bottommargin = 1.0,
				  leftmargin = 0.1,
				  rightmargin =  0.1,
				  labelgapvertical =  0.5,
				  labelgaphorizontal = 0.0,
				  labelshrinkvertical = 0,
				  labelshrinkhorizontal = 0 ,
				  fontname='Helvetica',
				  fontsize=10,
				  frame = False ,
				  maxdatarows = 10,
				  labelobj = None) :
		self.rows = rows
		self.columns = columns
		self.topmargin = topmargin
		self.bottommargin = bottommargin
		self.leftmargin = leftmargin
		self.rightmargin =  rightmargin
		self.labelgapvertical =  labelgapvertical
		self.labelgaphorizontal = labelgaphorizontal
		self.labelshrinkvertical = labelshrinkvertical
		self.labelshrinkhorizontal = labelshrinkhorizontal
		self.fontname = fontname
		self.fontsize = fontsize
		self.frame = frame
		self.title = "Labels"
		self.author = "TTL"
		self.maxdatarows = maxdatarows
		self.reporttemplateid = None

		# initialise from an object
		if labelobj:
			for key in LabelInfo.__field_list:
				self.__dict__[key] = labelobj.__getattribute__(key)

		# initialise row phonts
		self.rowfonts  = {}
		self.rowattr  = {}
		for x in xrange(0, maxdatarows):
			self.rowfonts[x] = dict(name = 'Normal_%d' % x,
											  fontName = self.fontname,
											  fontSize = self.fontsize)
			self.rowattr[x]  = dict(wrap = False)

	def setRowFont(self, rowId = 0 , inFontName = None, inFontSize = None ,
				   inAlignment = None , bold = False , onbottomRow = False,
				   wrap = False) :
		""" override the font and alignment on a row """

		fontname = inFontName  if inFontName else self.fontname
		fontsize = inFontSize  if inFontSize else self.fontsize
		alignment = inAlignment if inAlignment else LabelInfo.TA_LEFT
		if bold:
			fontname += "-Bold"

		self.rowfonts[rowId] = dict(name = 'Normal_%d'%rowId,
											  fontName = fontname,
											  fontSize = fontsize ,
											  alignment = alignment)
		self.rowattr[rowId]['wrap'] = wrap

	def getRowHeight(self, rowId  ):
		""" Get the height of the row based on it's font"""
		rowInfo = self.rowfonts[rowId]

		height = rowInfo.fontSize +2
		if rowInfo.fontName.lower().find("bold") != -1:
			height += 4
		return height