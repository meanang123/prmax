# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        ttldeployment.py
# Purpose:     function too log memory on unix system
#
# Author:      Chris Hoy
#
# Created:     01/09/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011
# Licence:
#-----------------------------------------------------------------------------

import os
from fabric.api import put, run

def stdCreateDir( dirname ) :
	""" Standard create function """
	run ('mkdir -p %s' % dirname )

def stdPut ( fromfile , tofile ) :
	""" copy a file to a destination """

	put( fromfile, tofile.replace("\\","/"))

def walkAndPutTree(rootweb, webroot, validdir = None,  validfile = None ) :
	walkAndPutTreeExt ( rootweb, webroot ,
				              stdCreateDir,
				              stdPut,
				              validdir,
				              validfile )


def walkAndPutTreeExt(rootweb, webroot,
                      createdir = None , putFile = None ,
                      validdir = None,  validfile = None):
	""" Walk a tree and and use put function to move to destination """

	if createdir:
		createdir(webroot)

	for (path, dirs, files) in os.walk ( rootweb ):
		if path.find(".svn") != -1 :
			continue

		if path != rootweb:
			if validdir and validdir ( path ) == False:
				continue

		subdir = path[len(rootweb):]
		if subdir and subdir[0] == "\\":
			subdir = subdir[1:]
		droot = os.path.join ( webroot, subdir ).replace("\\","/")

		if createdir:
			createdir( droot )
		for filename in files:
			if validfile and validfile(filename) == False :
				continue

			putFile(os.path.join(path,filename), os.path.join(droot, filename).replace("\\","/"))



def Test():
	def validdir( dirname ) :
		if dirname.find ( ".svn") != -1 :
			return False

		for vdir in ( "Extensions", "Imports", "pr_reports" ,"Utilities", "Common", "Email" ):
			if dirname.find ( vdir ) != -1:
				return True
		else:
			return False

		return True

	def validfile( filename ):

		extension = os.path.splitext(filename)[1][1:]
		if extension != "py" or filename in ("Constants.py",):
			return False
		else:
			return True


	def _print(fromFile, to ):
		print (fromFile , to)

	walkAndPutTreeExt ( r"C:\PPRTest\Products\Hnd",
	                    "/home/zope/instance/Products/Hnd",
	                    None,
	                    _print,
	                    validdir,
											validfile )

	walkAndPutTreeExt ( r"C:\PPRTest\Products\Hnd\dojo_system\release\web",
	                 "/home/zope/instance/Products/Hnd/web", None,
	                 _print )

#Test()