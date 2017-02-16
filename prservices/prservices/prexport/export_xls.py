# -*- coding: utf-8 -*-
"""prexporter"""
#-----------------------------------------------------------------------------
# Name:        export_xml.py
# Purpose:     Export System
#
# Author:      Chris Hoy
#
# Created:     27/02/2014
# Copyright:  (c) 2014
#
#-----------------------------------------------------------------------------
import xlrd
import csv
import codecs
import getopt
import  sys


def fix_up_cell(cell_text):
  "Fix up characters"
  return cell_text.replace(u"ł", u"l")

options, dummy = getopt.getopt(sys.argv[1:],"" , ["source=", "dest="])
source = dest = None
for option, params in options:
  if option in ("--source",):
    source = params
  if option in ("--dest",):
    dest = params

if dest == None or source == None:
  print "Missing Parameters"
  exit(-1)

workbook = xlrd.open_workbook(source)
output = []
for sheet in workbook.sheet_names():
  xls_sheet = workbook.sheet_by_name(sheet)
  for rnum in range(xls_sheet.nrows):
    output.append([ fix_up_cell(unicode(xls_sheet.cell_value(rnum,cnum))).encode('utf8') for cnum in range(xls_sheet.ncols)])

with open(dest, "wb") as outfile:
  outfile.write(codecs.BOM_UTF8)
  writer = csv.writer(outfile)
  writer.writerows(output)

