# -*- coding: utf-8 -*-
"""Holds system-defined types
"""
# special markers for the row indicator column in the data
rwCOL_HEADER,rwGROUP_HEADER,rwNORMAL,rwSUBTOTAL,rwTOTAL,rwHEADING,rwNORMALBACKGROUND,rwNEWPAGE, rwNOTRIM=range(9)
ctCOL_TYPES=(ctSTRING,ctNUMBER,ctAMOUNT)=range(3)

from reportlab.lib.units import cm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus.doctemplate import *
from reportlab.platypus import PageBreak
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.pdfencrypt import StandardEncryption

import cStringIO
import os

def xmlEscape(word):
	word=word.replace('&','&amp;')
	word=word.replace('"','&quot;')
	word=word.replace("'",'&apos;')
	word=word.replace('<','&lt;')
	word=word.replace('>','&gt;')
	return word

def xmlUnEscape(word):
	word=word.replace('&amp;','&')
	word=word.replace('&quot;','"')
	word=word.replace('&apos;',"'")
	word=word.replace('&lt;','<')
	word=word.replace('&gt;','>')
	return word

def xmlUnEscape2(word):
	word=word.replace('&amp;','and')
	word=word.replace('&','and')
	return word


def hilite_phrase(phrase, hilite_format):
	if hilite_format:
		return '<%s>%s</%s>' % (hilite_format,xmlEscape(phrase),hilite_format)
	else:
		return phrase

def format_words(phrase,cwidth,font,fontSize):
	"""formats the phrase into a list of phrases,
	each line of which does not exceed cwidth"""


	# do the simple case: if the whole of the phrase fits one line,
	# return a list with the phrase in:
	sw=stringWidth(phrase,font,fontSize)
	if sw<=cwidth:
		return [phrase]

	# mmm more than one line:
	# split the phrase into words:
	words=phrase.split()
	lines=[]

	line=''
	for word in words:
		line='%s %s'.strip() % (line,word)
		if stringWidth(line,font,fontSize)>cwidth:
			lines.append(line)
			line=''
	# do any remaining
	if line:
		lines.append(line)

	return lines

def format_ctype(word,mark,ctype,cwidth,font,fontSize):
	"""formats the word/phrase so that it fits on one line of cwidth wide
	if longer, adds ellipsis
	"""
	try:
		word=str(word)
		if ctype in (ctSTRING,ctNUMBER):
			# make sure that this fits:
			word=word.strip()
			if mark==rwNORMAL: # limit the field width only in NORMAL case
				has_ellipsis=False
				sw=stringWidth(word,font,fontSize)
				if sw>cwidth:
					while sw>cwidth:
						word=word[:-1].strip()
						sw=stringWidth(word+'..',font,fontSize)
						has_ellipsis=True
					# replace the last char in the string (which now fits)
					# with a couple of dots

				if has_ellipsis:
					word=word[:-1]+'..'

			return word
		elif ctype==ctAMOUNT:
			return str(FixedPoint(word))
		else:
			e='pdf_base.format_ctype("%s",%s): invalid ctype' % (word,ctype)
			raise Exception,e
	except ValueError: # allow a blank or text in a numeric, for instance
		return word.strip()

def in_cm(x):
	return x*cm


class MarkedRow(object):
	def __init__(self,mark,row):
		self.mark=mark
		self.row=row

	def __str__(self):
		return 'MarkedRow<%s> %s' % (self.mark,str(self.row))

	def __len__(self):
		return 1

class BasePDF(object):
	"""Generates the PrintListing pdf from a list of Listing data
	"""
	# common page format for both templates:
	def logoAndHeader(self, canvas, doc) :
		"""Draws a logo and text on each page."""
		if self.page_header.has_key('report_id'):
			text_left=self.page_header['report_id']
		else:
			text_left=''

		reportname = self.page_header.get("reporttitle","")
		if not reportname:
			if self.page_header.has_key('report_name'):
				reportname = self.page_header['report_name']

		text_centre = reportname

		self.page_count+=1
		text_right='Page %s of %d' % (self.page_count,self.total_page_count)

		canvas.saveState()
		banner_height=0.75*cm   # bigger the no, nearer the top!
		ypos=doc.pagesize[1] - doc.topMargin- banner_height

		canvas.drawImage(os.path.normpath(os.path.join(os.path.dirname(__file__),
								                                   'resources/%s'% self.page_header["headerimage"])),
								     doc.leftMargin, ypos+.25)
		FONT_TYPE='Helvetica'
		FONT_TYPE_BOLD='Helvetica-Bold'

		canvas.setFont(FONT_TYPE_BOLD, 13)
		x_centre=doc.width/2.0 + 1.5*cm
		ypos=ypos + 0.75*cm
		canvas.drawCentredString(x_centre, ypos,self.page_header['shop_name'])

		canvas.setFont(FONT_TYPE, 9)
		canvas.drawString(doc.width - 0.75*cm, ypos,self.page_header['report_date'])

		#ypos=ypos-0.75*cm
		ypos=ypos-1.1*cm
		if text_left:
			canvas.setFont(FONT_TYPE, 9)
			canvas.drawString(0.85*cm, ypos,text_left)
		if text_centre:
			canvas.setFont(FONT_TYPE, 11)
			canvas.drawCentredString(x_centre, ypos,text_centre)
		if text_right:
			canvas.setFont(FONT_TYPE, 9)
			canvas.drawString(doc.width - 0.75*cm, ypos,text_right)

		canvas.setFont(FONT_TYPE, 9)
		canvas.drawString(0.75*cm, 0.75*cm,self.page_header["strapline"])
		canvas.restoreState()

	def __init__(self,page_header):
		self.report=cStringIO.StringIO()

		from reportlab.lib.pagesizes import A4, landscape

		pagesize = A4
		if "landscape" in page_header:
			pagesize = landscape(A4)

		encrypt = None
		if "isinvoice" in  page_header:
			encrypt = StandardEncryption(None, None , 1, 0, 1, 1, 40)

		self.document = BaseDocTemplate(self.report,
								                    leftMargin=1*cm,
								                    rightMargin=1*cm,
								                    topMargin=1*cm,
								                    bottomMargin=0.5*cm,
								                    pagesize = pagesize,
								                    author = "Chris Hoy",
								                    pageCompression = 1,
								                    encrypt = encrypt )

		self.page_count=0
		self.page_header=page_header
		self.total_page_count=0

	def newPage(self):
		self.append(PageBreak())
		self.total_page_count+=1

	def newFrame(self):
		self.append(FrameBreak())