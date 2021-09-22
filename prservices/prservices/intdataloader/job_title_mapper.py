# -*- coding: utf-8 -*-
"""Importer """
#-----------------------------------------------------------------------------
# Name:        Importer
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     01/05/2013
# Copyright:  (c) 2013
#
#-----------------------------------------------------------------------------
from datetime import datetime
import prcommon.Constants as Constants
from turbogears import database
from turbogears.database import session
from sqlalchemy.sql import text
from ttl.tg.config import read_config
import os
import logging
import getopt
import sys
import csv
import urllib2, urllib
import simplejson

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

def _do_match(prmaxrole, word):
	"""Do the actual match"""
	session.execute(text("""INSERT INTO internal.prmaxrolesynonyms(parentprmaxroleid,childprmaxroleid) SELECT :prmaxroleid,prmaxroleid FROM internal.prmaxroles
	WHERE visible = false AND
	prmaxroleid NOT IN ( SELECT childprmaxroleid FROM internal.prmaxrolesynonyms) AND
	( replace(replace(prmaxrole,'/',' '),'-',' ') ilike :word1 OR replace(replace(prmaxrole,'/',' '),'-',' ') ilike :word2)"""), dict(
	                                                               word1= word + " %",
	                                                               word2 = "% " + word + " %",
	                                                               prmaxroleid = prmaxrole.prmaxroleid), PRMaxRoles)



languages = ["it",  "fr", "de", "es", "pt", "sv", "da", "nl", "no"]

from prcommon.model import PRMaxRoles

logging.basicConfig(level = logging.DEBUG )
LOGGER = logging.getLogger("prmax.import")

rows = csv.reader(file(r"/tmp/prmax/int_job.csv"))
rows.next()
rowcount = 0
translations = {}
trans_used_up = False
if os.path.exists(r"/tmp/prmax/translations.txt"):
	translations = simplejson.load(file(r"/tmp/prmax/translations.txt"))

for row in rows:
	if trans_used_up:
		break

	rowcount += 1
	simplejson.dump(translations, file(r"/tmp/prmax/translations.txt", "w"))
	# get parent
	prmaxrole = session.query(PRMaxRoles).filter(PRMaxRoles.prmaxrole == row[1].strip()).scalar()
	if not prmaxrole:
		print ("Missing", row[1])
		continue
	_do_match(prmaxrole, row[0].strip())

	# run translation matrix
	for lan in languages:
		word = row[0].strip()
		word_translated = ""
		if word in translations and lan in translations[word]:
			word_translated = translations[word][lan]

		if word_translated.find("YOU USED ALL AVAILABLE FREE TRANSLATION FOR TODAY") !=  -1:
			word_translated = ""


		if not  word_translated:
			values = {"q":word, "langpair": "en|" + lan, "de": "chris.hoy@prmax.co.uk",}
			req = urllib2.Request("http://mymemory.translated.net/api/get",
			                      urllib.urlencode(values),
			                      {'user-agent':'text/html'})
			#handler=urllib2.HTTPHandler(debuglevel=1)
			opener = urllib2.build_opener()
			urllib2.install_opener(opener)
			retdata = simplejson.load(urllib2.urlopen(req).fp)
			print (retdata["responseData"]["translatedText"])
			word_translated = retdata["responseData"]["translatedText"]
			if word_translated.find("YOU USED ALL AVAILABLE FREE TRANSLATION FOR TODAY") !=  -1:
				trans_used_up = True
				break

		print (lan, row[0], word_translated)
		_do_match(prmaxrole, word_translated)

		if word not in translations:
			translations[word] = {}

		translations[word][lan] = word_translated

simplejson.dump(translations, file(r"/tmp/prmax/translations.txt", "w"))
