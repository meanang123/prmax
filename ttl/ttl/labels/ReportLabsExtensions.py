# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		ReportLabsExtensions.py
# Purpose:     Report lable extension objs
#
# Author:       Chris Hoy
#
# Created:	23/02/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
from reportlab.platypus.paragraph import Paragraph
try:
	from reportlab.platypus.paragraph import _parser
except:
	from reportlab.platypus.paragraph import ParaParser
	_parser = ParaParser()

from reportlab.platypus import Paragraph, Flowable
from reportlab.lib.enums import TA_RIGHT
from reportlab.pdfbase.pdfmetrics import stringWidth

class ParagraphNoWrap(Paragraph):
	""" Paragraph that is on a single line only"""
	def __init__(self, text, style, bulletText = None, frags = None, caseSensitive = 1):
		Paragraph.__init__(self, text, style, bulletText, frags, caseSensitive)

	def wrap(self, availWidth, availHeight):
		""" overloaded wrap method"""

		first_line_width = availWidth - (self.style.leftIndent + self.style.firstLineIndent) - self.style.rightIndent
		trueWidth = stringWidth(self.text, self.style.fontName, self.style.fontSize)

		doSize = False
		text = xmlUnEscape(self.text)
		while first_line_width < trueWidth :
			text = text[0: len(text)-1]
			trueWidth = stringWidth(text, self.style.fontName, self.style.fontSize)
			doSize = True

		if doSize   :
			self.text = xmlEscape(text)
			style, frags, bulletTextFrags = _parser.parse(self.text, self.style)
			self.frags = frags

		return   Paragraph.wrap(self, availWidth, availHeight)

class Line(Flowable):
	""" This creates a line in a cell"""
	def __init__(self, linewidth = 3, margin = 10):
		Flowable.__init__( self )
		self.width = 100
		self.height = 20
		self.pos = 0
		self.linewidth = linewidth
		self.margin = margin

	def wrap(self, availWidth, availHeight):
		""" function to set up size"""
		# work out widths array for breaking
		self.width = availWidth - (self.margin * 2)
		self.height = availHeight
		self.pos = self.height - self.linewidth - 1
		return (self.width, self.height)

	def draw(self):
		""" draw on the screen"""
		canv = self.canv
		canv.saveState()
		canv.setLineWidth(self.linewidth)
		canv.line(self.margin, self.pos, self.width, self.pos)
		canv.restoreState()

class BoxedText(Flowable):
	""" This add a box around a cell"""
	def __init__(self, text, style , leftmargin=1, rightmargin=1, topmargin=1 , bottommargin=1, align = TA_RIGHT):
		Flowable.__init__( self )
		self.width = 100
		self.height = 20
		self.topmargin = topmargin
		self.rightmargin = rightmargin
		self.bottommargin = bottommargin
		self.leftmargin = leftmargin
		self.text = text
		self.style = style
		self.align = align

	def wrap(self, availWidth, availHeight):
		""" size"""
		# work out widths array for breaking
		self.width = availWidth - self.leftmargin - self.rightmargin
		self.height = availHeight - self.topmargin - self.bottommargin
		return (self.width, self.height)

	def draw(self):
		""" draw"""
		canv = self.canv
		canv.saveState()
		text = canv.beginText()
		text.setFont ( self.style.fontName , self.style.fontSize)
		text.moveCursor (self.leftmargin + ( self.width-stringWidth(self.text, self.style.fontName, self.style.fontSize)) / 2 ,
						 ((self.height / 2)-(self.style.fontSize / 2)) * -1 )
		text.textLines(self.text)
		canv.drawText(text)
		canv.roundRect(self.leftmargin, -self.topmargin, self.width , self.height, 8)
		canv.restoreState()
		del text

def xmlUnEscape(word):
	""" from html """
	word = word.replace('&amp;', '&')
	word = word.replace('&quot;', '"')
	word = word.replace('&apos;', "'")
	word = word.replace('&lt;', '<')
	word = word.replace('&gt;','>')
	return word

def xmlEscape(word):
	""" to html"""
	word = word.replace('&', '&amp;')
	word = word.replace('"', '&quot;')
	word = word.replace("'", '&apos;')
	word = word.replace('<', '&lt;')
	word = word.replace('>', '&gt;')
	return word