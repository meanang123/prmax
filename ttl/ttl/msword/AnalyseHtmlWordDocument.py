# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		AnalyseHtmlWordDocument.py
# Purpose:	To html result file and capture images
#                  fix up url to prmax
#
# Author:       Chris Hoy
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------


from HTMLParser import HTMLParser
import os
import cssutils
from BeautifulSoup import BeautifulSoup
import copy


global _p_control

class AnalyseHtmlWordDocument(object):
	""" """
	class HtmlImage(object):
		def __init__(self, imagename , working):
			self._imagename = imagename
			self._data =  file ( os.path.normpath(os.path.join ( working , imagename ) ) , "rb").read()
			self._newurl = ""

		def setNewUrl ( self , url ):
			self._newurl = url

	class MyHTMLParser(HTMLParser):
		def handle_starttag(self, tag, attrs):
				if tag == "img":
					print attrs
					src = [attr[1] for attr in attrs  if attr[0] =="src"]
					if src:
						global _p_control
						_p_control._images.append ( AnalyseHtmlWordDocument.HtmlImage( src[0], _p_control._working ) )


	def __init__(self, data, working, url ):
		""" add data """
		self._sourcedata = data
		self._working = working
		self._images = []
		self._prmaxurl = url

	def parse(self):
		global _p_control

		_p_control = self

		p = AnalyseHtmlWordDocument.MyHTMLParser()
		p.feed ( self._sourcedata )
		p.close()

	def fixImageLinks(self):
		for image in self._images:
			self._sourcedata = self._sourcedata.replace( image._imagename , image._newurl )




class CSSUnit(object):
	def __init__(self, cleanup = True):
		self._attrs_dict = {}
		self._cleanup_mode = cleanup

	def add (self, name , value):
		if not self._cleanup( name , value ) :
			value = value.replace("\"","")
			item  = (name,value)
			self._attrs_dict[ name ] = item

	def update(self, item ) :
		if len(item) == 2 and not self._cleanup( item[0] , item[1] ) :
			if self._attrs_dict.has_key(item[0]):
				self._attrs_dict[item[0]] = (item[0],item[1])
			else:
				self.add ( item[0], item[1] )

	def __str__(self):
		def _item( r ):
			return r[0] +":" + r[1]

		return ";".join ( [_item(r) for r in self._attrs_dict.values()] )

	def mixin(self, style):
		p2 = copy.deepcopy (self)
		for item in style.split(";"):
			p2.update ( item.split(":") )

		return p2

	def _cleanup (self, name, value):
		if name == "margin":
			return True
		return False


class CSSHtmlconvertor(object):
	""" Add thhe style frm the word document into the html
	also does some basic tidy up of the styles
	1. margin's are removed this makes the code look v cramped
	"""
	_ignore = {"widows" : True, "orphans": True }

	def __init__(self, html , working , basename):
		""" setup basic details"""
		self._working = working
		self._basename = basename

		# parse html and style sheets
		self._html = BeautifulSoup(html)
		self._anlysisstyles()

	def _anlysisstyles(self):
		""" analyse and capture the css styles"""

		sheet = cssutils.parseString( file ( os.path.normpath(os.path.join ( self._working , str(self._basename) + ".css"))).read())
		self._styles = {}
		self._basestyle = None

		for rule in sheet:
			if rule.type == rule.STYLE_RULE :
				# p would be required as the default
				if rule.selectorText == "p" :
					self._basestyle = CSSUnit()
					for propertyv in rule.style:
						if not self._ignore.has_key ( propertyv.name):
							self._basestyle.add ( propertyv.name  , propertyv.value )
				else:
					t = CSSUnit()
					for propertyv in rule.style:
						if not self._ignore.has_key ( propertyv.name):
							t.add ( propertyv.name  , propertyv.value )
					self._styles[rule.selectorText.replace(".","").lower()] = t

	__elements = ("h1","h2","h3","h4")
	def translate(self):
		""" This but the styles into the html on and element by element basic
		currenlty it only does the "p" ones
		"""

		tmp = self._html.findAll('p')
		self._doType(tmp, self._basestyle )

		for el in CSSHtmlconvertor.__elements:
			if self._styles.has_key(el):
				self._doType(self._html.findAll('h1'),
				             self._styles[el] )

	def _doType(self, nodes , defaulttype):
		for r in nodes:
			if r.has_key('style'):
				# already has a still we need to mix in
				if r.has_key('class'):
					classname = r["class"].lower()
					if self._styles.has_key ( classname ) :
						p2 = self._styles[classname].mixin (r['style'])
						r['style'] = str(p2)
						del ( r['class'] )
				else:
					p2 = defaulttype.mixin (r['style'])
					r['style'] = str(p2)
					del p2
			elif r.has_key('class'):
				classname = r["class"].lower()
				if self._styles.has_key ( classname ) :
					r['style'] = str(self._styles[classname])
					del ( r['class'] )
				else:
					r['style'] = str(defaulttype)

			else:
				r['style'] = str(defaulttype)



	def getHtml(self):
		""" get the fixed data """
		data = str(self._html).strip()
		key = "/&gt;"
		if data and data[0] == "$" and data.find(key) != -1:
			return data[data.find("/&gt;")+len(key):]
		return data


