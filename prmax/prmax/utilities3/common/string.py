# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        String functions
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

_remove = u'()"'
_remove2 = u"()&\\"
SplitCharList = u";:,/-"
REPLACEWITHSPACE = (u'\t', )

def splitoutletname(name):
	""" Split an outlet name into a list of words"""

	for c in _remove:
		name = name.replace(c, u"")

	for c in REPLACEWITHSPACE:
		name = name.replace(c, u" ")

	for c in SplitCharList:
		name = name.replace(c, u" ")

	res = name.lower().split()

	#res = bytearray(res,'utf8')

	return res


def splitoutletname2(name):
	""" Split an outlet name into a list of words"""

	for c in _remove2:
		name = name.replace(c,"")

	for c in REPLACEWITHSPACE:
		name = name.replace(c, " ")

	t2 = ""
	for c in name:
		try:
			tmp = ord(c)
			if tmp >=31 and tmp <=127:
				t2 += c
		except: pass

	name = t2

	for c in SplitCharList:
		name = name.replace(c," ")


	return name.lower().split()


_removeWords = u"\"\'()&"
_removeWords2 = ((u"-"),)

def splitwords(name,removewords=True):
	""" Split an string into a list of works remove duplicates"""
	name = name.lower()

	for c in REPLACEWITHSPACE:
		name = name.replace(c, u" ")

	for c in _removeWords:
		name = name.replace(c, u"")

	for c in SplitCharList:
		name = name.replace(c, u" ")

	d ={}
	for word in name.lower().split(u" "):
		if removewords and word in _removeWords2 or word in d or not len(word):
			continue
		d[word] = True

	return d.keys()

def splitwordscompare(oldwords,newwords):

	add_words = []
	old_words = {}
	for w  in splitwords(oldwords):
		old_words[w] = w
	for w in splitwords(newwords):
		if old_words.has_key(w):
			old_words.pop(w)
		else:
			add_words.append(w)

	return (add_words, old_words.keys())

# postgres field to encode
_post_fields =  ( (u"%","\\%"),(u"?","\\?"),(u",","\,"),(u"'","''"))

def encodeforpostgres( data ) :
	""" Encode the special characters of a string for postgress"""
	def _encode( instring ) :
		for f in _post_fields:
			instring = instring.replace(f[0], f[1])
		return instring
	if type ( data ) in ( tuple, list ) :
		return [ _encode( f ) for f in data ]
	else:
		return _encode ( data )


_PostCodes = (u"E1", u"SE1","E2","SE2","E3","SE3","E4","SE4","E5","SE5","E6","SE6","E7","SE7",\
              "E8","SE8","E9","SE9","E10","SE10","E11","SE11","E12","SE12","E13","SE13","E14","SE14",\
              "E15","SE15","E16","SE16","E17","SE17","E18","SE18","SE19","WC1","SE20","WC2","SE21",\
              "SE22","EC1","SE23","EC2","SE24","EC3","SE25","EC4","SE26","SE27","N1","SE28","N2",\
              "N3","SW1","N4","SW2","N5","SW3","N6","SW4","N7","SW5","N8","SW6","N9","SW7",\
              "N10","SW8","N11","SW9","N12","SW10","N13","SW11","N14","SW12","N15","SW13",\
              "N16","SW14","N17","SW15","N18","SW16","N19","SW17","N20","SW18","N21","SW19",
              "N22","SW20","NW1","W1","NW2","W2","NW3","W3","NW4","W4","NW5","W5 ",\
              "NW6","W6","NW7","W7","NW8","W8","NW9","W9","NW10","W10","NW11","W11",\
              "W12","W13","W14")

def postcodeislondon(inpostcode):
	postcode = inpostcode.upper()
	for row in _PostCodes:
		if postcode.startswith( row ) :
			return True
	return False

#########################################################
# HTML translation to ISO 8859-1
# Currenlty only the french characters need to extend for the rest of europe
#
# Need german/dutch
########################################################

_HtmlEntities = (
  ("\xa0","&nbsp;"),
  ("\xa3","&pound;"),


  ("\xe0","&agrave;"),
  ("\xC0","&Agrave;"),
  ("\xE0","&agrave;"),
  ("\xC2","&Acirc;"),
  ("\xE2","&acirc;"),
  ("\xC6","&AElig;"),
  ("\xE6","&aelig;"),
  ("\xC7","&Ccedil;"),
  ("\xE7","&ccedil;"),
  ("\xC8","&Egrave;"),
  ("\xE8","&egrave;"),
  ("\xC9","&Eacute;"),
  ("\xE9","&eacute;"),
  ("\xCA","&Ecirc;"),
  ("\xEA","&ecirc;"),
  ("\xCB","&Euml;"),
  ("\xEB","&euml;"),
  ("\xCE","&Icirc;"),
  ("\xEE","&icirc;"),
  ("\xCF","&Iuml;"),
  ("\xEF","&iuml;"),
  ("\xD4","&Ocirc;"),
  ("\xF4","&ocirc;"),
  ("\x152","&OElig;"),
  ("\x153","&oelig;"),
  ("\xD9","&Ugrave;"),
  ("\xF9","&ugrave;"),
  ("\xDB","&Ucirc;"),
  ("\xFB","&ucirc;"),
  ("\xDC","&Uuml;"),
  ("\xFC","&uuml;"),
  ("\xAB","&laquo;"),
  ("\xBB","&raquo;"),
  ("\x80","&euro;"),
)

def TranslateToHtmlEntities( inString ) :
	""" Convert all the hex xml refrerence to html common (old) ones """

	oString = inString
	for row in _HtmlEntities:
		oString = oString.replace(*row )

	return oString

_HtmlEntities2 = (
  ("\xa0","&nbsp;"),
  ("\xc2\xa3","&pound;"),
  ("\xe2\x80\x99" ,"'"),
  ("\xe2\x80\x98" ,"'"),
  ("\xe2\x80\x93","-"),
  ("\xe0","&agrave;"),
  ("\xC0","&Agrave;"),
  ("\xE0","&agrave;"),
  ("\xC2","&Acirc;"),
  ("\xE2","&acirc;"),
  ("\xC6","&AElig;"),
  ("\xE6","&aelig;"),
  ("\xC7","&Ccedil;"),
  ("\xE7","&ccedil;"),
  ("\xC8","&Egrave;"),
  ("\xE8","&egrave;"),
  ("\xC9","&Eacute;"),
  ("\xE9","&eacute;"),
  ("\xCA","&Ecirc;"),
  ("\xEA","&ecirc;"),
  ("\xCB","&Euml;"),
  ("\xEB","&euml;"),
  ("\xCE","&Icirc;"),
  ("\xEE","&icirc;"),
  ("\xCF","&Iuml;"),
  ("\xEF","&iuml;"),
  ("\xD4","&Ocirc;"),
  ("\xF4","&ocirc;"),
  ("\x152","&OElig;"),
  ("\x153","&oelig;"),
  ("\xD9","&Ugrave;"),
  ("\xF9","&ugrave;"),
  ("\xDB","&Ucirc;"),
  ("\xFB","&ucirc;"),
  ("\xDC","&Uuml;"),
  ("\xFC","&uuml;"),
  ("\xAB","&laquo;"),
  ("\xBB","&raquo;"),
  ("\x80","&euro;"),
)

def Translate25UTF8ToHtml ( inString ):
	""" """
	oString = inString
	for row in _HtmlEntities2:
		oString = oString.replace(*row )

	return oString

HTMLENTRIES = (
  ("\xe2\x80\xa2", "&bull;"),
  ("\xe2\x80\xa6", "..."),
  ("\xe2\x80\x93", "&ndash;"),
  ("\xe2\x80\x94", "&mdash;"),
  ("\xe2\x80\x98", "&lsquo;"),
  ("\xe2\x80\x99", "&rsquo;"),
  ("\xe2\x80\x9c", "&ldquo;"),
  ("\xe2\x80\x9d", "&rdquo;"),
  ("\xe2\x84\xa2", "&trade;"),
  ("\xe2\x80\xa6", "&hellip"),
  ("\xe2\x80\xb2", "&prime;"),
  ("\xe2\x80\xb3", "&Prime;"),
  ("\xe2\x80\xbe", "&oline;"),
  ("\xe2\x81\x84", "&frasl;"),
  ("\xe2\x84\x98", "&weierp;"),
  ("\xe2\x84\x91", "&image;"),
  ("\xe2\x84\x9c", "&real;'"),
  ("\xe2\x84\xb5", "&alefsym;"),
  ("\xc2\xa0", "&nbsp;"),
  ("\xc2\xae","&reg;"),
  ("\xa0","&nbsp;"),
  ("\xc2\xa3","&pound;"),
  #("\xe0", "&agrave;"),
  #("\xc0", "&Agrave;"),
  #("\xe0", "&agrave;"),
  #("\xc2", "&Acirc;"),
  #("\xe2", "&acirc;"),
  #("\xc6", "&AElig;"),
  #("\xe6", "&aelig;"),
  #("\xc7", "&Ccedil;"),
  #("\xe7", "&ccedil;"),
  #("\xc8", "&Egrave;"),
  #("\xe8", "&egrave;"),
  #("\xc9", "&Eacute;"),
  #("\xe9", "&eacute;"),
  #("\xca", "&Ecirc;"),
  #("\xea", "&ecirc;"),
  #("\xcb", "&Euml;"),
  #("\xeb", "&euml;"),
  #("\xce", "&Icirc;"),
  #("\xee", "&icirc;"),
  #("\xcf", "&Iuml;"),
  #("\xef", "&iuml;"),
  #("\xd4", "&Ocirc;"),
  #("\xf4", "&ocirc;"),
  #("\x152", "&OElig;"),
  #("\x153", "&oelig;"),
  #("\xd9", "&Ugrave;"),
  #("\xf9", "&ugrave;"),
  #("\xdb", "&Ucirc;"),
  #("\xfb", "&ucirc;"),
  #("\xdc", "&Uuml;"),
  #("\xfc", "&uuml;"),
  #("\xab", "&laquo;"),
  #("\xbb", "&raquo;"),
  #("\x80", "&euro;"),
  # Latin 1
  ("\xc2\xa0" , "&nbsp;"),
  ("\xc2\xa1" , "&iexcl;"),
  ("\xc2\xa2" , "&cent;"),
  ("\xc2\xa3" , "&pound;"),
  ("\xc2\xa4" , "&curren;"),
  ("\xc2\xa5" , "&yen;"),
  ("\xc2\xa6" , "&brvbar;"),
  ("\xc2\xa7" , "&sect;"),
  ("\xc2\xa8" , "&uml;"),
  ("\xc2\xa9" , "&copy;"),
  ("\xc2\xaa" , "&ordf;"),
  ("\xc2\xab" , "&laquo;"),
  ("\xc2\xac" , "&not;"),
  ("\xc2\xad" , "&shy;"),
  ("\xc2\xae" , "&reg;"),
  ("\xc2\xaf" , "&macr;"),
  ("\xc2\xb0" , "&deg;"),
  ("\xc2\xb1" , "&plusmn;"),
  ("\xc2\xb2" , "&sup2;"),
  ("\xc2\xb3" , "&sup3;"),
  ("\xc2\xb4" , "&acute;"),
  ("\xc2\xb5" , "&micro;"),
  ("\xc2\xb6" , "&para;"),
  ("\xc2\xb7" , "&middot;"),
  ("\xc2\xb8" , "&cedil;"),
  ("\xc2\xb9" , "&sup1;"),
  ("\xc2\xba" , "&ordm;"),
  ("\xc2\xbb" , "&raquo;"),
  ("\xc2\xbc" , "&frac14;"),
  ("\xc2\xbd" , "&frac12;"),
  ("\xc2\xbe" , "&frac34;"),
  ("\xc2\xbf" , "&iquest;"),
  ("\xc3\x80" , "&Agrave;"),
  ("\xc3\x81" , "&Aacute;"),
  ("\xc3\x82" , "&Acirc;"),
  ("\xc3\x83" , "&Atilde;"),
  ("\xc3\x84" , "&Auml;"),
  ("\xc3\x85" , "&Aring;"),
  ("\xc3\x86" , "&AElig;"),
  ("\xc3\x87" , "&Ccedil;"),
  ("\xc3\x88" , "&Egrave;"),
  ("\xc3\x89" , "&Eacute;"),
  ("\xc3\x8a" , "&Ecirc;"),
  ("\xc3\x8b" , "&Euml;"),
  ("\xc3\x8c" , "&Igrave;"),
  ("\xc3\x8d" , "&Iacute;"),
  ("\xc3\x8e" , "&Icirc;"),
  ("\xc3\x8f" , "&Iuml;"),
  ("\xc3\x90" , "&ETH;"),
  ("\xc3\x91" , "&Ntilde;"),
  ("\xc3\x92" , "&Ograve;"),
  ("\xc3\x93" , "&Oacute;"),
  ("\xc3\x94" , "&Ocirc;"),
  ("\xc3\x95" , "&Otilde;"),
  ("\xc3\x96" , "&Ouml;"),
  ("\xc3\x97" , "&times;"),
  ("\xc3\x98" , "&Oslash;"),
  ("\xc3\x99" , "&Ugrave;"),
  ("\xc3\x9a" , "&Uacute;"),
  ("\xc3\x9b" , "&Ucirc;"),
  ("\xc3\x9c" , "&Uuml;"),
  ("\xc3\x9d" , "&Yacute;"),
  ("\xc3\x9e" , "&THORN;"),
  ("\xc3\x9f" , "&szlig;"),
  ("\xc3\xa0" , "&agrave;"),
  ("\xc3\xa1" , "&aacute;"),
  ("\xc3\xa2" , "&acirc;"),
  ("\xc3\xa3" , "&atilde;"),
  ("\xc3\xa4" , "&auml;"),
  ("\xc3\xa5" , "&aring;"),
  ("\xc3\xa6" , "&aelig;"),
  ("\xc3\xa7" , "&ccedil;"),
  ("\xc3\xa8" , "&egrave;"),
  ("\xc3\xa9" , "&eacute;"),
  ("\xc3\xaa" , "&ecirc;"),
  ("\xc3\xab" , "&euml;"),
  ("\xc3\xac" , "&igrave;"),
  ("\xc3\xad" , "&iacute;"),
  ("\xc3\xae" , "&icirc;"),
  ("\xc3\xaf" , "&iuml;"),
  ("\xc3\xb0" , "&eth;"),
  ("\xc3\xb1" , "&ntilde;"),
  ("\xc3\xb2" , "&ograve;"),
  ("\xc3\xb3" , "&oacute;"),
  ("\xc3\xb4" , "&ocirc;"),
  ("\xc3\xb5" , "&otilde;"),
  ("\xc3\xb6" , "&ouml;"),
  ("\xc3\xb7" , "&divide;"),
  ("\xc3\xb8" , "&oslash;"),
  ("\xc3\xb9" , "&ugrave;"),
  ("\xc3\xba" , "&uacute;"),
  ("\xc3\xbb" , "&ucirc;"),
  ("\xc3\xbc" , "&uuml;"),
  ("\xc3\xbd" , "&yacute;"),
  ("\xc3\xbe" , "&thorn;"),
  ("\xc3\xbf" , "&yuml;"),
  # Latin Extended-A
  ("\xc5\x92" , "&OElig;"),
  ("\xc5\x93" , "&oelig;"),
  ("\xc5\xa0" , "&Scaron;"),
  ("\xc5\xa1" , "&scaron;"),
  ("\xc5\xb8" , "&Yuml;"),
  #// Spacing Modifier Letters
  ("\xcb\x86" , "&circ;"),
  ("\xcb\x9c" , "&tilde;"),
  #General Punctuation
  ("\xe2\x80\x82" , "&ensp;"),
  ("\xe2\x80\x83", "&emsp;"),
  ("\xe2\x80\x89" , "&thinsp;"),
  ("\xe2\x80\x8c" , "&zwnj;"),
  ("\xe2\x80\x8d" , "&zwj;"),
  ("\xe2\x80\x8e" , "&lrm;"),
  ("\xe2\x80\x8f" , "&rlm;"),
  ("\xe2\x80\x93" , "&ndash;"),
  ("\xe2\x80\x94" , "&mdash;"),
  ("\xe2\x80\x98" , "&lsquo;"),
  ("\xe2\x80\x99" , "&rsquo;"),
  ("\xe2\x80\x9a" , "&sbquo;"),
  ("\xe2\x80\x9c" , "&ldquo;"),
  ("\xe2\x80\x9d" , "&rdquo;"),
  ("\xe2\x80\x9e" , "&bdquo;"),
  ("\xe2\x80\xa0" , "&dagger;"),
  ("\xe2\x80\xa1" , "&Dagger;"),
  ("\xe2\x80\xb0" , "&permil;"),
  ("\xe2\x80\xb9" , "&lsaquo;"),
  ("\xe2\x80\xba" , "&rsaquo;"),
  ("\xe2\x82\xac" , "&euro;"),
  #// Latin Extended-B
  ("\xc6\x92" , "&fnof;"),
  ("\xef\xbc\xad", "M"),
  ("\xef\xbc\xb3", "S")
)

def encode_html_2( content ):
	"""encode the string as html enteties"""

	for row in HTMLENTRIES:
		content = content.replace( row[0], row[1] )

	for row in HTMLENTRIES:
		content = content.replace( row[0].upper(), row[1])

	return content

CLEANUP =  (("\xbc\xad", ""),
            ("\xbc\xb3", ""),
            ("\x98\x8e", ""),
            ("\x9c\x9d", ""),
            ("\xef\xbb\xbf", ""),
            ("\xe6\xe6", "")
)

def encode_clean_up( content ):
	""" Cleanup"""
	for row in CLEANUP:
		content = content.replace( row[0], row[1] )

	for row in CLEANUP:
		content = content.replace( row[0].upper(), row[1])

	return content
