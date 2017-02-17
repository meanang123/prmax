# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         ttlhtml.py
# Purpose:     function to tidy up and print html
#
# Author:      Chris Hoy
#
# Created:     19/04/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010
# Licence:
#-----------------------------------------------------------------------------

from BeautifulSoup import BeautifulSoup
from slimmer import html_slimmer
from types import UnicodeType

def PrintHtml(htmlString):
	""" take html string and make look easy too read """

	soup = BeautifulSoup(htmlString)
	return soup.prettify()

def CompressHtml(htmlString):
	""" Compress and return a html string for release """

	return html_slimmer(htmlString)

_Replace_Html = (('\xe2\x80\xa8', ' '),
                 ('\xe2\x80\x99', "'"),
                 ('\xe2\x80\x9d', '"'),
                 ('\xe2\x80\x9c', '"'),
                 ('\xe2\x80\x93', "-"),
                 ("\xa0", "&nbsp;"),
                 ("\xa3", "&pound;"),
                 ("<br>", "<br/>"),
                 ("<br >", "<br/>"),)

_Replace_Html_unicode = (
  (u'\xe2\x80\xa8', u' '),
  (u'\xe2\x80\x99', u"'"),
  (u'\xe2\x80\x9d', u'"'),
  (u'\xe2\x80\x9c', u'"'),
  (u'\xe2\x80\x93', u"-"),
  (u"\xa0", u"&nbsp;"),
  (u"\xa3", u"&pound;"),
  (u"<br>", u"<br/>"),
  (u"<br >", u"<br/>"),)

def clean_up_html(html):
	"""replace the problematic unicode characters"""

	tmp = html
	if isinstance(html, UnicodeType):
		replaces = _Replace_Html_unicode
	else:
		replaces = _Replace_Html

	for change in replaces:
		tmp = tmp.replace(change[0], change[1])
	return tmp



