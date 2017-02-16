# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import os, os.path, datetime, sys
import  prmax.Constants as Constants
from ttl.postgres import DBConnect

_ignoreFolders =(".svn","tests","sql_utilities","schema")
doinit=False

# walk tree
# for file do action ignore some directories
def _do(args,dirname,fname):
    for f in _ignoreFolders:
        if dirname.lower().find(f)!=-1: return
    for name in fname:
        if name.find(".sql")!=-1 and ( ( name.find("init_") !=-1 and doinit) or ( name.find("init_")==-1)):
            if name.find("temp_")!=-1 or name.find("query_temp")!=-1:
                continue
            print os.path.normpath(os.path.join(dirname,name))
            dbConnection = args[0]
            if name.find("prmaxcache")!=-1:
                dbConnection = args[1]

            fi = file ( os.path.normpath(os.path.join(dirname,name)))
            command = ""
            for line in fi.readlines():
                if len(line)==0 or line[0] in ("#","-"): continue
                if command: command+="\n"
                command+=line
            if command:
                cur = dbConnection.getCursor()
                dbConnection.startTransaction(cur)
                cur.execute(command)
                dbConnection.commitTransaction(cur)
            fi.close()

def doSqlRelease():
    print "Start SQL Release" , datetime.datetime.now()

    if len(sys.argv)==2 and  sys.argv[1]=="rel_sql":
        db = DBConnect(Constants.db_Release_Command)
        db2 = DBConnect(Constants.db_Release_Cache_Command)
    else:
        db = DBConnect(Constants.db_Full_Command)
        db2 = DBConnect(Constants.db_Full_Cache_Command)

    root_dir = os.path.dirname(__file__)
    if not root_dir:
        root_dir = "."

    os.path.walk(root_dir , _do,(db,db2))

    db.Close()
    db2.Close()
    print "End SQL Release " , datetime.datetime.now()

if __name__=="__main__":
    doSqlRelease()
