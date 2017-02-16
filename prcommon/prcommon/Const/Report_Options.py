# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        Report_Options.py
# Purpose:		report builder options
#
# Author:      Chris Hoy
#
# Created:     1/11/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008
#
#-----------------------------------------------------------------------------

Report_Output_pdf  	= 0
Report_Output_html 	= 1
Report_Output_csv 		= 2
Report_Output_label 	= 3
Report_Output_excel 	= 4

Report_Output_is_pdf = ( Report_Output_pdf, Report_Output_label)

Phase_1_is_html 	= (Report_Output_html, )
Phase_2_is_pdf 		= (Report_Output_pdf,)
Phase_3_is_csv  	= (Report_Output_csv,)
Phase_4_is_label 	= (Report_Output_label,)
Phase_5_is_excel 	= (Report_Output_excel,)


# report template format used internally
Report_Template_Invoice = 9 					# this is a standard invoice sent to the customer
Report_Template_Invoice_Proforma = 10
Report_Template_Credit_Note = 17

Data_Format_Single_Dict = 'single'
Data_Format_Multiple_Dict = 'multiple'
Data_Format_List = 'list'


## Report builder serving settings
# standard paths
windowsReportPath = "/Projects/prmax/prmax/static/dev/css"
# this is dependant on the egg name
linuxReportPath = "/usr/local/lib/python2.7/dist-packages/prmax-1.0.0.1-py2.7.egg/prmax/static/rel/css"
sleepintervals = 3


windowsReportDebugPath = "c:/Temp/prmaxreportstemp"
linuxReportDebugPath = "/tmp/prmaxreportstemp"

# path to external label
windows_label_path = "python.exe /Projects/ttl/ttl/labels/generate.py"
unix_label_path = "python /usr/local/lib/python2.7/dist-packages/ttl-1.0.0.1-py2.7.egg/ttl/labels/generate.py"
