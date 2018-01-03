# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			wordtohtml.py
# Purpose:	To process the word to html queue
#
# Author:   Chris Hoy
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
from time import sleep
from datetime import datetime
from ttl.postgres import DBCompress, DBConnect
from ttl.msword.convert import WordToHtml
from ttl.msword.AnalyseHtmlWordDocument import AnalyseHtmlWordDocument, \
     CSSHtmlconvertor
import os

# interface to the on-line databases
live = dict(host="89.16.167.250", base_url="https://collateral.prmax.co.uk/collateral", version=5)
test = dict(host="89.16.161.163", base_url="https://test.prmax.co.uk/collateral", version=7)
local_test = dict ( host = "localhost", base_url = "http://localhost/collateral", version=7)

class WordToHtmlController(object):
	"""  Word controller """

	def __init__(self, host = "localhost", base_url = "http://localhost/collateral", version = 4 ):
		self._running = False
		self.db_Command_Service = "dbname='prmax' user='prmaxmsword' host='%s' password='bFXt8Sbt9R'"%host
		self.db_Command_Service2 = "dbname='prmaxcollateral' user='prmaxmsword' host='%s' password='bFXt8Sbt9R'"%host
		self._version = version

		self._working = "c:\\temp"
		self._base_url = base_url

	def heartbeat(self):
		"heartbeat"
		pass

	def run(self):
		""" Proccess that run the convertion """

		if self._running:
			return

		try:
			self._running = True
			db = DBConnect(self.db_Command_Service)
			dbColl = DBConnect(self.db_Command_Service2)
			cur = db.getCursor()
			# this is restricted to internal email no mass email allowed
			cur.execute("""SELECT mswordqueueid,indata,orgfilename,template,customerid,emailtemplateid,cleanuphtmltypeid,exclude_images FROM queues.mswordqueue WHERE statusid = 1 """)
			rows = cur.fetchall()
			print "Start (%d) %s" % (len(rows), datetime.now())
			if len(rows):
				for row in rows:
					params = dict ( mswordqueueid = row[0] , exclude_images = row[7], statusid = 2, outdata = None)
					try:
						# convert word document to html
						try:
							_engine = WordToHtml(DBCompress.decode(row[1]),
							                     row[0],
							                     row[2],
							                     row[3],
							                     self._working,
							                     self._version)
							_engine.run()

							# fix up all the css
							if row[6] == 1 :
								html = _engine.getFixUpHtmlForIE()
							else:
								html = _engine._getData()

							if row[7] == True:
								#remove images
								while html.find('<img') != -1:
									img_start = html.find('<img')
									img_end = html.find('>', img_start)
									html = html[:img_start] + html[img_end+1:]

								#get links as text
								while html.find('<a href') != -1:
									link_start = html.find('<a href')
									link_end = html.find('>', link_start)
									a_tag = html.find('</a>', link_end)
									link_text = html[link_end+1:a_tag].replace(".", ".<span></span>").replace("//", "//<span></span>")
									html = html[:link_start] + link_text + html[a_tag+4:]

							css = CSSHtmlconvertor( html,
										self._working ,
										row[0] )
							css.translate()
							fin_html = css.getHtml()

							fin_html = _CleanUp(fin_html)

							if self._version != 7:
								fin_html = fin_html[fin_html.find('css"&gt;')+len('css"&gt;'):]


							#capture all images in document
							analyse = AnalyseHtmlWordDocument (  fin_html,
							                                     self._working,
							                                     self._base_url)
							analyse.parse()
						except Exception, ex :
							print ex
							analyse = None

					finally:
						dbCur = dbColl.getCursor()
						dbColl.startTransaction(dbCur)
						db.startTransaction(cur)
						if analyse:
							for image in analyse._images:
								# 1. add image to collateral
								# 2. create url
								code = str(analyse._images.index(image))
								(root, ext) = os.path.splitext(image._imagename)
								ps = dict ( customerid = row[4] ,
									        collateralname = code,
									        collateralcode = code,
									        filename = image._imagename,
									        ext = ext.lower().strip(),
									        collaterallength  = len( image._data ) ,
									        emailtemplateid = row[5])

								# fix for update of record
								cur.execute("""SELECT collateralid FROM userdata.collateral WHERE emailtemplateid = %(emailtemplateid)s AND collateralcode = %(collateralcode)s""", ps )
								tmp = cur.fetchall()
								if tmp:
									collaterid = tmp[0][0]
									dbCur.execute("""UPDATE collateralfiles SET data = %(data)s WHERE collateralid = %(collaterid)s""",
									              dict ( collaterid = collaterid ,
									                     data = DBCompress.encode ( image._data)))
								else:
									cur.execute("""INSERT INTO userdata.collateral(customerid, collateralname, collateralcode, filename, ext, collaterallength,emailtemplateid )
									VALUES( %(customerid)s ,%(collateralname)s,%(collateralcode)s,%(filename)s,%(ext)s,%(collaterallength)s,%(emailtemplateid)s)
									RETURNING collateralid;""", ps )
									collaterid  = cur.fetchall()[0][0]
									dbCur.execute("""INSERT INTO collateralfiles(collateralid,data)
									VALUES ( %(collaterid)s,%(data)s)""",
									                                    dict ( collaterid = collaterid ,
									                                           data = DBCompress.encode ( image._data)))

								image.setNewUrl( self._base_url + "/%d%s" % ( collaterid , ext ))

							analyse.fixImageLinks()
							params["outdata"] = DBCompress.b64encode( analyse._sourcedata)
						else:
							params["outdata"] = "Problem Converting Document"

						# update collateral store
									# update document
						cur.execute("""UPDATE queues.mswordqueue
									SET statusid = %(statusid)s,
						            outdata = %(outdata)s
									WHERE mswordqueueid =  %(mswordqueueid)s""", params)
						db.commitTransaction( cur )
						dbColl.commitTransaction( dbCur )

				print "Complete (%d) %s" % (len(rows), datetime.now())
			db.Close()
			dbColl.Close()
		except Exception, ex:
			try:
				print ex
				tmp = file("c:\\temp\\log.txt","a")
				tmp.write(str(ex))
				tmp.close()
			except Exception, ex:
				print ex
			print ex
		finally:
			self._running = False

def _CleanUp( instring ):
	"""Cleanup the html """

	outstring = instring.replace("\xe2\x80\xa8", " ")
	outstring = outstring.replace("\xe2\x80\x99", "'")
	outstring = outstring.replace("\xe2\x80\x9d", '"')
	outstring = outstring.replace('\xe2\x80\x9c', '"')
	outstring = outstring.replace('\xe2\x80\x93', "-")
	outstring = outstring.replace('\u017d','&reg;')
	outstring = outstring.replace('\n\r', '')
	outstring = outstring.replace('\n', '')


	return outstring

def _LocalRun(host = "localhost", base_url = "http://localhost/collateral", version = 7 ):
	wordhtmlCtrl = WordToHtmlController( host,
	                                     base_url ,
	                                     version )
	while (1==1):
		wordhtmlCtrl.heartbeat()
		wordhtmlCtrl.run()
		sleep(4)

if __name__=='__main__':
	import sys
	import getopt

	opts, args = getopt.getopt(sys.argv[1:],"" , ["live","test"])
	for o, a in opts:
		if o in ("--live",):
			_LocalRun( **live )
		if o in ("--test",):
			_LocalRun( **test )
	else:
		_LocalRun(**local_test)








