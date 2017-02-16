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
import psycopg2

# walk tree
# for file do action ignore some directories
def _do(args,dirname,fname):
    for f in _ignoreFolders:
        if dirname.lower().find(f)!=-1: return
    for name in fname:
        if name.find(".sql")!=-1 and ( ( name.find("init_") !=-1 and doinit) or ( name.find("init_")==-1)):
            print dirname,name
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
root_dir = os.path.dirname(__file__)
if not root_dir:
    root_dir = "."
ctrl_dir = root_dir  + "/ctls"
query_dir = root_dir+"/query"
template_dir = root_dir+"/template"


def doReportRelease():
    print "Report Template Release" , datetime.datetime.now()

    if len(sys.argv)==2 and  sys.argv[1]=="rel_sql":
        db = DBConnect(Constants.db_Release_Command)
        db2 = DBConnect(Constants.db_Release_Cache_Command)
    else:
        db = DBConnect(Constants.db_Full_Command)
        db2 = DBConnect(Constants.db_Full_Cache_Command)

    for fullname in os.listdir(ctrl_dir):
        if fullname[-4:].lower() == ".ctl":
            name = os.path.basename(fullname).replace(".ctl","")
            print name
            query = file(os.path.normpath(os.path.join(query_dir,name+".sql")),"r").read().replace("\t", " " ).replace("\n", " " )
            templatefilename = os.path.normpath(os.path.join(template_dir,name+".htm"))
            if os.path.exists(templatefilename):
                templatedata = file(templatefilename,"r").read()
            else:
                templatedata = ""

            params = dict(reporttemplateid=-1,
                          customerid=-1,
                          reportname="",
                          reportsourceid=0,
                          reportextension=None,
                          query=query,
                          template=templatedata)
            for line in file(os.path.normpath(os.path.join(ctrl_dir,fullname)),"r").readlines():
                f = line.split("=")
                params[f[0]] = f[1].replace("\n","")
                params[f[0]] = f[1].replace("\r","")

            # try insert
            command = """INSERT INTO internal.reporttemplates (  reporttemplateid, customerid,reporttemplatename,query,template,reportsourceid,reportextension)
            VALUES (%(reporttemplateid)s, %(customerid)s, %(reportname)s, %(query)s, %(template)s, %(reportsourceid)s,%(reportextension)s)"""
            cur = db.getCursor()
            try:
                db.startTransaction(cur)
                cur.execute(command,params)
                db.commitTransaction(cur)
            except psycopg2.IntegrityError:
                db.rollbackTransaction(cur)
                db.closeCursor(cur)
                command = """UPDATE internal.reporttemplates
                SET reporttemplatename = %(reportname)s,
                query = %(query)s,
                template = %(template)s,
                reportsourceid = %(reportsourceid)s,
                reportextension = %(reportextension)s
                WHERE reporttemplateid = %(reporttemplateid)s AND customerid = %(customerid)s"""
                cur = db.getCursor()
                db.startTransaction(cur)
                cur.execute(command,params)
                db.commitTransaction(cur)
            db.closeCursor(cur)

    db.Close()
    db2.Close()
    print "End Report Template Release " , datetime.datetime.now()

if __name__=="__main__":
    doReportRelease()
