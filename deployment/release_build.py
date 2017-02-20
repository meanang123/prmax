# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        release_build.py
# Purpose:     Build relwase
#
# Author:       Chris Hoy
#
# Created:     27/08/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import shutil, os, os.path, cStringIO
import slimmer
import gzip, zlib
import codecs

# path to test/live environment
vpath_test = "test"
vpath_live = "2"

# standard files
valid_folders = ('_firebug','nls','resources','images','resources\\images')
valid_files = ('dojo.js',
               'prmaxresearch.js',
               'prmaxquestionnaires.js',
               'prmaxcontrol.js',
               'prmaxclippings.js'
               )

def buildRelease(build, islive, version, module ):
   print "build dojo release", islive
   # get correct environment
   vpath = vpath_live if islive else vpath_test
   print vpath
   ( build_exe, profile_source, profile_dest, spath, dpath) = _init_path( vpath, islive, version, module)

   # set up correct build profile
   out = open(profile_dest,"w")
   out.write(open( profile_source,"r").read().replace("test",vpath_live if islive else vpath_test ))
   out.close()

   # execute dojo builder
   if build:
      os.system(build_exe);

      # copy files
   print "copy build to release"
   for(dirpath,dirnames, filenames) in os.walk(spath):
      if not ( dirpath==spath or dirpath[len(spath)+1:] in valid_folders):
         continue

      dbase = dirpath.replace(spath,dpath)
      print "copying " , dbase
      for npath in dirnames:
         if not npath in valid_folders:
            continue

         tpath = os.path.join(dbase,npath)
         if not os.path.exists(tpath):
            os.mkdir(tpath)

      for nfile in filenames:
         if dirpath == spath:
            if not nfile in valid_files:
               continue

         print os.path.join(dbase,nfile)
         shutil.copy( os.path.join(dirpath,nfile),
                      os.path.join(dbase,nfile))

   print "copy  Theme"
   themename = ( r"themes\claro", )
   themeimages = [r"themes\claro\images",
                  r"themes\claro\layout\images",
                  r"icons",
                  r"icons\images",
                  r"themes\claro\form\images"]
   if vpath == "test":
      sourcethemeroot= r"\Projects\prmax\test\deployment\dojo\release\prmax\dijit"
      destthemeroot= "\\Projects\\prmax\\test\\prcommon\\prcommon\\static\\rel\\dijit"
   else:
      sourcethemeroot= r"\Projects\prmax\live\deployment\dojo\release\prmax\dijit"
      destthemeroot= "\\Projects\\prmax\\live\\prcommon\\prcommon\\static\\rel\\dijit"


   themecommon = ("themes\dijit.css","themes\dijit_rtl.css",r"themes\claro\claro.css")

   for x in xrange(0,len(themename)):
      for tdir in [themename[x]] +themeimages:
         tpath = os.path.join(destthemeroot,tdir)
         if not os.path.exists(tpath):
            os.mkdir(tpath)

   for fname in themecommon:
      shutil.copy( os.path.join(sourcethemeroot,fname),
                     os.path.join(destthemeroot,fname))

   for themeim in themeimages:
      for(dirpath,dirnames, filenames) in os.walk(os.path.join(sourcethemeroot,themeim)):
         dname = os.path.join(destthemeroot,themeim)
         if not os.path.exists(dname):
            os.mkdir(dname)

         for nfile in filenames:
            shutil.copy( os.path.join(dirpath,nfile),
                         os.path.join(dname,nfile))

   print "Compress Js and Css and Images prcommon"
   if vpath == "test":
      rootdev= r"\Projects\prmax\test\prcommon\prcommon\static\dev"
      rootrel= r"\Projects\prmax\test\prcommon\prcommon\static\rel"
   else:
      rootdev= r"\Projects\prmax\live\prcommon\prcommon\static\dev"
      rootrel= r"\Projects\prmax\live\prcommon\prcommon\static\rel"
   prcss = ""
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
      for nfile in filenames:
         sfile = os.path.splitext(nfile)
         if sfile[1] in (".css",".htm",".kid",".html",".js"):
            print "Compressing" , nfile
            slimmed = None
            code = open(os.path.join(dirpath,nfile)).read()
            # need to add code here to improve
            if sfile[1] ==".css":
               if sfile[0].find("prcommon")!=-1:
                  if not sfile[0]=="prcommon":
                     prcss += " "
                     prcss +=slimmer.css_slimmer(code)
                  else:
                     prmaxpath = dirpath
               else:
                  slimmed=slimmer.css_slimmer(code)
            elif sfile[1] in (".js",):
               slimmed = slimmer.js_slimmer(code)
            else:
               slimmed = slimmer.xhtml_slimmer(code)

            if slimmed:
               nfile2 = os.path.join(dirpath.replace(rootdev,rootrel),nfile)
               f1 = open(nfile2,"w")
               f1.write(codecs.BOM_UTF8 )
               f1.write(slimmed.encode('utf-8'))
               f1.close()

   if prcss:
      nfile2 = os.path.join(prmaxpath.replace(rootdev,rootrel),"prcommon.css")
      f1 = open(nfile2,"w")
      f1.write(codecs.BOM_UTF8)
      f1.write(slimmer.css_slimmer(prcss.encode('utf-8')))
      f1.close()

   print "Copying ", module
   if vpath == "test":
      rootdev= r"\Projects\prmax\\test\%s\%s\static\dev" %(module, module)
      rootrel= r"\Projects\prmax\\test\%s\%s\static\rel" %(module, module)
   else:
      rootdev= r"\Projects\prmax\live\%s\%s\static\dev" %(module, module)
      rootrel= r"\Projects\prmax\live\%s\%s\static\rel" %(module, module)
   prcontrolcss = ""
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
      for nfile in filenames:
         sfile = os.path.splitext(nfile)
         if sfile[1] in (".css",".htm",".kid",".html",".js"):
            print "Compressing" , nfile
            slimmed = None
            code = open(os.path.join(dirpath,nfile)).read()
            # need to add code here to improve
            if sfile[1] ==".css":
               if sfile[0].find(module)!=-1:
                  if not sfile[0]==module:
                     prcontrolcss += " "
                     prcontrolcss +=slimmer.css_slimmer(code)
                  else:
                     prmaxpath = dirpath
               else:
                  slimmed=slimmer.css_slimmer(code)
            elif sfile[1] in (".js",):
               slimmed = slimmer.js_slimmer(code)
            else:
               slimmed = slimmer.xhtml_slimmer(code)

            if slimmed:
               nfile2 = os.path.join(dirpath.replace(rootdev,rootrel),nfile)
               f1 = open(nfile2,"w")
               f1.write(codecs.BOM_UTF8 )
               f1.write(slimmed.encode('utf-8'))
               f1.close()

   if prcontrolcss:
      nfile2 = os.path.join(prmaxpath.replace(rootdev,rootrel),"%s.css" % module)
      f1 = open(nfile2,"w")
      f1.write(codecs.BOM_UTF8 )
      f1.write(slimmer.css_slimmer(prcontrolcss.encode('utf-8')))
      f1.close()

def _init_path( base_locations, islive , version, module) :
   istest  = "_test" if not islive else ""
   build_exe = r"\Projects\prmax\test\deployment\build_dojo.bat %s %s" % (module, version)
   # live/test version here
   profile_source = r"\Projects\prmax\test\deployment\%s.profile.js" % module
   profile_dest = r"\Projects\prmax\test\deployment\dojo\util\buildscripts\profiles\%s.profile.js" % module

   if base_locations == "test":
      spath = r"\Projects\prmax\test\deployment\dojo\release\prmax\dojo"
      dpath = r"\Projects\prmax\test\prcommon\prcommon\static\rel\dojo"
   else:
      spath = r"\Projects\prmax\live\deployment\dojo\release\prmax\dojo"
      dpath = r"\Projects\prmax\live\prcommon\prcommon\static\rel\dojo"
      build_exe = r"\Projects\prmax\live\deployment\build_dojo_live.bat %s %s" % (module, version)
      profile_source = r"\Projects\prmax\live\deployment\%s.profile.js" % module
      profile_dest = r"\Projects\prmax\live\deployment\dojo\util\buildscripts\profiles\%s.profile.js" % module


   return ( build_exe, profile_source, profile_dest, spath, dpath)
