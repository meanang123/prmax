# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        builder.py
# Purpose:     move a dev area to a release area html/cs/js files
#					this is not for the dojo
#
# Author:       Chris Hoy
#
# Created:     26/07/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010
#-----------------------------------------------------------------------------

import slimmer
import codecs
import os
import shutil

def CompressDetails ( rootdev, rootrel, cssname ) :
    """ Conver all the file and move from dev to rel"""
    print ("Compress Js and Css html ")
    for(dirpath,dirnames, filenames) in os.walk(rootdev):
        if dirpath.find(".svn")!=-1:
            continue

        for npath in dirnames:
            if npath.find(".svn")!=-1:
                continue

            dpath2 = dirpath.replace(rootdev,rootrel)
            tpath = os.path.join(dpath2,npath)
            if not os.path.exists(tpath):
                os.mkdir(tpath)

        # also compressed all the css files in the same folder into a single file
        # called prmax.css,
        prmaxcss = ""
        prmaxpath = ""
        for nfile in filenames:
            sfile = os.path.splitext(nfile)
            if sfile[1] in (".css",".htm",".kid",".html",".js"):
                slimmed = None
                code = open(os.path.join(dirpath,nfile)).read()
                # need to add code here to improve
                if sfile[1] ==".css":
                    if sfile[0].find( cssname )!=-1:
                        if not sfile[0]==cssname:
                            prmaxcss += " "
                            prmaxcss +=slimmer.css_slimmer(code)
                        else:
                            prmaxpath = dirpath
                    else:
                        slimmed=slimmer.css_slimmer(code)
                elif sfile[1] in (".js",):
                    slimmed = slimmer.js_slimmer(code)
                else:
                    slimmed = slimmer.xhtml_slimmer(code)
                if slimmed:
                    print ("Compressing" , nfile)
                    nfile2 = os.path.join(dirpath.replace(rootdev,rootrel),nfile)
                    f1 = open(nfile2,"w")
                    f1.write(codecs.BOM_UTF8 )
                    f1.write(slimmed.replace(codecs.BOM_UTF8, "").encode('utf-8'))
                    f1.close()
            if sfile[1] in (".gif",".jpg",".ico", ".png"):
                print ("Copying" , nfile)
                shutil.copyfile ( os.path.normpath ( os.path.join(dirpath,nfile) ) ,
                                  os.path.normpath ( os.path.join(dirpath.replace(rootdev,rootrel),nfile)))
        if prmaxcss:
            # do mrmax css
            nfile2 = os.path.join(prmaxpath.replace(rootdev,rootrel),cssname + ".css")
            f1 = open(nfile2,"w")
            f1.write(codecs.BOM_UTF8 )
            f1.write(slimmer.css_slimmer(prmaxcss.replace(codecs.BOM_UTF8, "").encode('utf-8')))
            f1.close()
