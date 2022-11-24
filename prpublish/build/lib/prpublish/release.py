# -*- coding: utf-8 -*-
# Release information about prpublish
import slimmer
import codecs
import os

version = "1.0"

# description = "Your plan to rule the world"
# long_description = "More description about your plan"
# author = "Your Name Here"
# email = "YourEmail@YourDomain"
# copyright = "Copyright 2009 - the year of the Gorilla"

# if it's open source, you might want to specify these
# url = "http://yourcool.site/"
# download_url = "http://yourcool.site/download"
# license = "MIT"


print ("Compress Js and Css")
rootdev= r"prpublish\static\dev"
rootrel= r"prpublish\static\rel"

from  ttl.build import  CompressDetails

CompressDetails ( rootdev, rootrel, "prpublish" )


#prpublishcss = ""
#for(dirpath,dirnames, filenames) in os.walk(rootdev):
	#if dirpath.find(".svn")!=-1:
		#continue

	#for npath in dirnames:
		#if npath.find(".svn")!=-1:
			#continue
		#dpath2 = dirpath.replace(rootdev,rootrel)
		#tpath = os.path.join(dpath2,npath)
		#if not os.path.exists(tpath):
			#os.mkdir(tpath)

	## also compressed all the css files in the same folder into a single file
	## called prmax.css,
	#for nfile in filenames:
		#sfile = os.path.splitext(nfile)
		#if sfile[1] in (".css",".htm",".kid",".html",".js"):
			#print ("Compressing" , nfile)
			#slimmed = None
			#code = open(os.path.join(dirpath,nfile)).read()
			## need to add code here to improve
			#if sfile[1] ==".css":
				#if sfile[0].find("prpublish")!=-1:
					#if not sfile[0]=="prpublish":
						#prpublishcss += " "
						#prpublishcss +=slimmer.css_slimmer(code)
					#else:
						#prmaxpath = dirpath
				#else:
					#slimmed=slimmer.css_slimmer(code)
			#elif sfile[1] in (".js",):
				#slimmed = slimmer.js_slimmer(code)
			#else:
				#slimmed = slimmer.xhtml_slimmer(code)

			#if slimmed:
				#nfile2 = os.path.join(dirpath.replace(rootdev,rootrel),nfile)
				#f1 = open(nfile2,"w")
				#f1.write(codecs.BOM_UTF8 )
				#f1.write(slimmed.encode('utf-8'))
				#f1.close()

	#if prpublishcss:
		## do mrmax css
		#nfile2 = os.path.join(prmaxpath.replace(rootdev,rootrel),"prpublish.css")
		#f1 = open(nfile2,"w")
		#f1.write(codecs.BOM_UTF8 )
		#f1.write(slimmer.css_slimmer(prpublishcss.encode('utf-8')))
		#f1.close()