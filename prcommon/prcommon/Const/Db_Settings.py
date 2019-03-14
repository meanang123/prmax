# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        Db_Settings.py
# Purpose:		contants to access database
#
# Author:      Chris Hoy
#
# Created:     1/10/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
#-----------------------------------------------------------------------------
db_Name = 'prmax'
db_Cache_Name = 'prmaxcache'
db_Collateral_Name = 'prmaxcollateral'
db_User='prmax'
db_Host='localhost'
db_Password='mkjn_45'
db_Full_User='postgres'
db_Full_Password='amber'

db_User_Service='prmaxservice'
db_Password_Service='VVD8MuRF'

db_Host_Release='localhost'

# this is for the new server
# db_Host_Release='prmaxdb.default.prmax.uk0.bigv.io'

db_Release_User='postgres'
db_Release_Password='UPR8kqD8'

# new testserver
db_Release_New_Server = "5.28.62.201"

import platform
if platform.uname()[1].lower().find(".prmax.uk0.bigv.io") != -1:
	db_Host=db_Release_New_Server
	db_Host_Release=db_Release_New_Server


db_Command = "dbname='%s' user='%s' host='%s' password='%s'"\
	   %(db_Name,db_User,db_Host,db_Password)
db_Cache_Command = "dbname='%s' user='%s' host='%s' password='%s'"\
		 %(db_Cache_Name,db_User,db_Host,db_Password)
db_Full_Command = "dbname='%s' user='%s' host='%s' password='%s'"\
	   %(db_Name,db_Full_User,db_Host,db_Full_Password)
db_Full_Cache_Command = "dbname='%s' user='%s' host='%s' password='%s'"\
		 %(db_Cache_Name,db_Full_User,db_Host,db_Full_Password)
db_Release_Command = "dbname='%s' user='%s' host='%s' password='%s'"\
	   %(db_Name,db_Release_User,db_Host_Release,db_Release_Password)
db_Release_Cache_Command = "dbname='%s' user='%s' host='%s' password='%s'"\
	   %(db_Cache_Name,db_Release_User,db_Host_Release,db_Release_Password)


db_Command_Service = "dbname='%s' user='%s' host='%s' password='%s'"\
	   %(db_Name,db_User_Service,db_Host,db_Password_Service)

db_Cache_Command_Service= "dbname='%s' user='%s' host='%s' password='%s'"\
		 %(db_Cache_Name,db_User_Service,db_Host,db_Password_Service)

db_Collateral_Command_Service= "dbname='%s' user='%s' host='%s' password='%s'"\
		 %(db_Collateral_Name,db_User_Service,db_Host,db_Password_Service)


# email settings
email_host =  "localhost" #"smtp.orange.co.uk" #
email_post = 0

