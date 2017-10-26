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
vpath_test = "prmax\\development"
vpath_live = "prmax\\live"

# standard files
valid_folders = ('_firebug','nls','resources','images','resources\\images')
valid_files = ('dojo.js','prmaxdojo.js','parser.js','prmaxstartup.js','prmaxnewcustomer.js',
               'prmaxinternal.js','prmaxdatadmin.js','prmaxaidojo.js','prmaxnewslivedojo.js',
               'prmaxupdatumdojo.js', 'prmaxfensdojo.js', 'prmaxkantardojo.js',
               'prmaxphoenixpbdojo.js', 'prmaxseoodojo.js', 'prmaxblueboodojo.js',
               'prmaxipcbdojo.js', 'prmaxsolidmediadojo.js', 'prmaxdeperslijst.js',
               'prmaxmynewsdesk.js', 'prmaxprofessional.js', 'prmaxstereotribes.js', 'prmaxpressdata.js', 'prmaxpressdataoffice.js')

def buildRelease(build = True,islive = True , version = "missing" ):
   print "build dojo release", islive
   # get correct environment
   vpath = vpath_live if islive else vpath_test
   vpath = "\\"+ vpath +"\\prmax"
   print vpath
   ( build_exe, profile_source, profile_dest, spath, dpath) = _init_path( vpath, islive, version)

   # set up correct build profile
   out = open(profile_dest,"w")
   out.write(open( profile_source,"r").read().replace("prmax/live",vpath_live.replace("\\", "/") if islive else vpath_test.replace("\\", "/")))
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

         shutil.copy( os.path.join(dirpath,nfile),
                      os.path.join(dbase,nfile))

   print "copy  Theme"
   themename = ( "tundra", "soria","claro" )
   themeimages = ("tundra\\images","soria\\images","claro\\images")
   sourcethemeroot= "\\Projects\\" + vpath  + "\\buildrelease\\dojo\\release\\prmax\\dijit\\themes"
   destthemeroot= "\\Projects\\"+ vpath  + "\\prmax\\static\\dojo.prod\\dijit\\themes"
   themecommon = ("dijit.css","dijit_rtl.css","tundra\\tundra.css","soria\\soria.css","claro\\claro.css")

   for x in xrange(0,2):
      for tdir in (themename[x] ,themeimages[x]):
         tpath = os.path.join(destthemeroot,tdir)
         if not os.path.exists(tpath):
            os.mkdir(tpath)

   for fname in themecommon:
      shutil.copy( os.path.join(sourcethemeroot,fname),
                     os.path.join(destthemeroot,fname))
   for themeim in themeimages:
      for(dirpath,dirnames, filenames) in os.walk(os.path.join(sourcethemeroot,themeim)):
         dname = os.path.join(destthemeroot,themeim)
         for nfile in filenames:
            shutil.copy( os.path.join(dirpath,nfile),
                         os.path.join(dname,nfile))

   print "Compress Js and Css"
   rootdev= "\\Projects\\" + vpath  + "\\prmax\\static\\dev"
   rootrel= "\\Projects\\" + vpath  + "\\prmax\\static\\rel"
   prmaxcss = ""
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
               if sfile[0].find("prmax")!=-1:
                  if not sfile[0]=="prmax":
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
               nfile2 = os.path.join(dirpath.replace(rootdev,rootrel),nfile)
               f1 = open(nfile2,"w")
               f1.write(codecs.BOM_UTF8 )
               f1.write(slimmed.encode('utf-8'))
               f1.close()

   if prmaxcss:
      # do mrmax css
      nfile2 = os.path.join(prmaxpath.replace(rootdev,rootrel),"prmax.css")
      f1 = open(nfile2,"w")
      f1.write(codecs.BOM_UTF8 )
      f1.write(slimmer.css_slimmer(prmaxcss.encode('utf-8')))
      f1.close()


def _init_path( base_locations, islive , version ) :
   istest  = "_test" if not islive else ""
   build_exe = "\\Projects\\" + base_locations  + r"\buildrelease\build_dojo%s.bat %s" % ( istest, version )
   # live/test version here
   profile_source = "\\Projects\\" + base_locations + r"\buildrelease\prmax.profile.js"
   profile_dest = "\\Projects\\" + base_locations + r"\buildrelease\dojo\util\buildscripts\profiles\prmax.profile.js"

   spath = "\\Projects\\" + base_locations + r"\buildrelease\dojo\release\prmax\dojo"
   dpath = "\\Projects\\" + base_locations + r"\prmax\static\dojo.prod\dojo"

   return ( build_exe, profile_source, profile_dest, spath, dpath)
