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

import prmax.Constants as Constants
from ttl.postgres import DBConnect

from xml.sax import ContentHandler
from xml.sax import make_parser
import os
import types
import codecs
import datetime
import csv
import types
import platform, datetime
import csv

import prmax.Constants as Constants

if platform.system().lower()=="windows":
	dirSource = '/data/mediaproof/'
else:
	dirSource = '/home/prmax/data/'

_UpdatePrimarySql = """
UPDATE outlets AS o
SET primaryemployeeid = e.employeeid
FROM employees as e LEFT OUTER JOIN internal.research_control_record as rc ON (rc.objecttypeid = 1 AND rc.objectid = e.outletid)
WHERE
e.isprimary=1 AND e.prmaxstatusid = 1 AND e.outletid = o.outletid AND
(rc.primary_contact_by_prmax IS NULL OR rc.primary_contact_by_prmax = false)
AND (( o.primaryemployeeid is not null AND o.primaryemployeeid != e.employeeid) OR o.primaryemployeeid is null );"""

def normalize_whitespace(text):
	"Remove redundant whitespace from a string"
	#return ' '.join(text.split())
	return text.strip()

class ImportField(object):
	def __init__(self,prnname,dbname,type,cfunc=None,\
				 default=None,mustexist=False,filter=None,
				 cfuncrow=None,
	             defaultfunc=None,
	             fcheck = None ):
		self.prnname = prnname
		self.dbname = dbname
		self.type = type
		self.cfunc=cfunc
		self.cfuncrow = cfuncrow
		self.default=default
		self.mustexist=mustexist
		self.filter = filter
		self.defaultfunc = defaultfunc
		self.fcheck = fcheck

class DocHandlerBase(ContentHandler):
	def __init__(self,name,filename,tablename,prn_key,dbkey,prn_key_function=None,
				 insert_only = False, include_update = False, outaddfile = None, columns = None, outtablename = None ):
		self._name = name
		self._filename = filename
		self._tablename = [tablename,]
		self._tablekey = [dbkey,]
		self._fields = [[]]
		self._prn_key = prn_key
		self._sourcetype = [None,]
		self._prn_key_function = prn_key_function
		self._outletsearchtypes = None
		self._insert_only = insert_only
		self._include_update = include_update
		self._dbkeyfields = [{}]
		ContentHandler.__init__(self)
		self._db =  DBConnect(Constants.db_Command_Service)
		self._adds = []
		self.outaddfile = outaddfile
		self.columns = columns
		self.outtablename = outtablename

		self._ignoreprn_keys = {}
		for key in self._db.executeAll("SELECT prn_key FROM research.ignore_prn_outlets",None):
			self._ignoreprn_keys[str(key[0])] = True

	def _getfunc( self, dbfieldname, column = 0 ) :
		for row in self._fields[column]:
			if row.dbname == dbfieldname:
				return row
		return None

	def getFileName(self):
		return self._filename

	def deleteConnection(self):
		pass

	def UpdateRequired(self,row):
		return True

	filename = property(getFileName,doc="get source file")
	def _createdb(self,row,fields):
		return self._compdata(row,fields,[],True)

	def _createupddb(self,row,fields):
		return self._compdata(row,fields,{},False)

	def _compdata(self,row,fields,r,insert):
		for f in fields:
			if not insert and f.fcheck and f.fcheck ( f , row ) :
				continue
			if row.has_key(f.prnname):
				if f.filter and not f.filter(row[f.prnname]):
					return None
				if f.cfunc:
					value = f.cfunc(row[f.prnname])
				elif f.cfuncrow:
					value = f.cfuncrow(row)
				else:
					value = row[f.prnname]
			else:
				if f.cfuncrow:
					value = f.cfuncrow(row)
				else:
					if f.defaultfunc:
						value = f.defaultfunc()
					else:
						value = f.default
			if f.mustexist:
				if not value:
					return None
			if f.dbname:
				if insert:
					r.append(value)
				else:

					if f.dbname in ("prn_key"):
						continue
					if f.type == types.IntType:
						vcmp = None
						if value != None:
							vcmp = int(value)
						if vcmp != self._data[f.dbname]:
							r[f.dbname] = vcmp
					else:
						if value != self._data[f.dbname]:
							r[f.dbname] = value
		if not insert and self._include_update:
			r["update"] = datetime.datetime.now()

		return r

	def startDocument(self):
		self._rows = []
		print (self.__class__)

	def _ignore(self, row , mustexist = True ):
		if row.has_key("OTL_ID") and self._ignoreprn_keys.has_key ( row["OTL_ID"] ) :
			return True

		if row.has_key("OTL_ID")  and mustexist :
			if self.outletconvert(row["OTL_ID"] ) == None:
				return  True

		return False;

	def endDocument(self):
		for count in xrange(0,len(self._tablename)):
			_tablename = self._tablename[count]
			_tablekey =  self._tablekey[count]
			print (_tablename, _tablekey)
			dinserts = []
			dupdates = []
			for row in self._rows:
				if self._ignore( row ) :  continue

				value = self._createdb(row,self._fields[count])
				if not value:
					continue
				if self._prn_key_function:
					doesexist = self._prn_key_function(row,_tablename,self._sourcetype[count])
				else:
					if row.has_key(self._prn_key):
						doesexist = self.exists(row[self._prn_key],_tablename,self._sourcetype[count])
					else:
						doesexist = False

				if doesexist:
					if not self.UpdateRequired( row ) :
						continue
					if self._insert_only:
						continue
					value = self._createupddb(row, self._fields[count])
					if not dupdates or len(dupdates[-1])>=1000:
						dupdates.append([])
					if len(value.keys()):
						updcommand = ""
						for key in value.keys():
							if updcommand:
								updcommand +=", "
							data  = self._data[key]
							ndata = value[key]
							if ndata == None:
								updcommand += "%s = NULL " % (key)
							elif type(ndata)== types.StringType:
								ndata = ndata.replace("'","''")
								updcommand += "%s = '%s'" % (key,ndata.decode("utf8"))
							elif type(ndata)== types.UnicodeType:
								ndata = ndata.replace("'","''")
								updcommand += unicode("%s = '%s'")%(key,ndata)
							elif isinstance(ndata,datetime.date) or \
								 isinstance(ndata,datetime.datetime) :
								updcommand += "%s = '%s'"%(key,ndata)
							else:
								updcommand += "%s = %s"%(key,str(ndata))

						command = "UPDATE %s SET %s WHERE %s = %s" % (
							_tablename,
							updcommand,
							_tablekey,
							str(self._data[_tablekey]))
						dupdates[-1].append(command)
				else:
					if not dinserts or len(dinserts[-1])>=1000:
						dinserts.append([])
					dinserts[-1].append(value)
					if self.outaddfile and _tablename == self.outtablename:
						self._adds.append(value)

			commandline=self.createline(self._fields[count],_tablename)
			c = self._db.getCursor()
			try:
				try:
					for block in dinserts:
						c.executemany(commandline,block)
					for block in dupdates:
						for row in block:
							c.execute(row)
					self._db.commitTransaction(c)

				except Exception, ex :
					print (ex)
					self._db.rollbackTransaction(c)
			finally:
				self._db.closeCursor(c)

	def ExportAdds(self) :
		if self.outaddfile:
			def _fixrows(row):
				return "\"" + "\",\"".join ( [unicode(row[c]) for c in self.columns ]) + "\""
			import codecs
			f = codecs.open(self.outaddfile,"w","utf-8")
			try:
				f.write(u"\n".join([ _fixrows(row) for row in self._adds ] ))
			finally:
				f.close()

	def startElement(self, name, attrs):
		if name == self._name:
			self._row = {}
		else:
			self._data = ""

	def exists(self,key,tablename,sourcetype=None):
		self._data = None
		if sourcetype:
			command = "SELECT * FROM %s WHERE prn_key=%%(key)s AND prn_source=%s"%(tablename,sourcetype)
		else:
			command = "SELECT * FROM %s WHERE prn_key=%%(key)s"%tablename
		try:
			self._data = self._db.executeOne(command,dict(key=int(key)),True)
			return self._data
		except  Exception, ex :
			print (command,"\n",ex)
			return 0

	def _checklanguage(self):
		if self._row.has_key("LANG_ID"):
			if self._row["LANG_ID"] in ("291","0"):
				return True
			else:
				return False

		return True

	def endElement(self, name):
		if name != self._name:
			self._row[name] = normalize_whitespace ( self._data )
		else:
			if self._checklanguage():
				self._rows.append(self._row)

	def characters(self, ch):
		self._data = self._data + ch

	def createline(self,fields,tablename):
		result = ["INSERT INTO %s("%tablename]
		for f in fields:
			if not f.dbname: continue
			result.append(f.dbname)
			if fields[-1] != f :
				result.append(',')
		if result[-1]==",": result.pop()
		result.append(') VALUES(')
		for f in fields:
			if not f.dbname: continue
			result.append("%s")
			if fields[-1] != f :
				result.append(',')
		if result[-1]==",": result.pop()
		result.append(')')
		return "".join(result)

	def statusconvert(self,data):
		return self._baseconvert(data,"internal.status","statusid")

	def deliverypreferenceconvert(self,data):
		return self._baseconvert(data,"internal.deliverypreferences","deliverypreferenceid")

	def outletconvert(self,data):
		return self._baseconvert(data,"outlets","outletid")

	def subjectgetid(self,data):
		return self._baseconvert(data,"internal.subjects","subjectid")


	def contactconvert(self,data):
		return self._baseconvert(data,"contacts","contactid")

	def addressconvert(self,data):
		return self._baseconvert(data,"addresses","addressid")

	def subjectconvert(self,data):
		# we need to do the soccur fix here
		return self._baseconvert(data,"internal.subjects","subjectid")

	def employeeconvert(self,data):
		return self._baseconvert(data,"employees","employeeid")

	def roleconvert(self,data):
		return self._baseconvert(data,"internal.roles","roleid")

	def languageconvert(self,data):
		return self._baseconvert(data,"internal.languages","languageid")

	def geogconvert(self,data):
		return self._baseconvert(data,"internal.geographical","geographicalid")

	def geogconvert2(self,data):
		if data == "10756":
			return "LONDON"
		return self._baseconvert(data,"internal.geographical","geographicalname")

	def geogconvert(self,data):
		return self._baseconvert(data,"internal.geographical","geographicalid")


	def _fixoutlettype(self,data):
		if data == "650":
			data = "434"
		return data

	def outlettypeconvert(self,data):
		data = self._fixoutlettype(data)
		return self._baseconvert(data,"internal.outlettypes","outlettypeid")

	def productconvert(self,data):
		value = self._baseconvert(data,"internal.producttypes","producttypeid")

		return 34 if value is None else value

	def industryconvert(self,data):
		return self._baseconvert(data,"internal.industries","industryid")

	def frequencyconvert(self,data):
		return self._baseconvert(data,"internal.frequencies","frequencyid")

	def regionalconvert(self,data):
		return self._baseconvert(data,"internal.regionalfocus","regionalfocusid")

	def currencyconvert(self,data):
		return self._baseconvert(data,"internal.currencies","currencyid")

	def priceconvert(self,data):
		try:
			f = float(data)
			f = round(f,0)
			return int(f)
		except:
			return 0

	def _baseconvert(self,data,table,fieldid):
		r = None
		command = "SELECT %s FROM %s WHERE prn_key=%%(data)s"%(fieldid,table)
		dbresult = self._db.executeOne(command,dict(data=data))
		if dbresult:
			r = dbresult[0]
		return r

	def outletsearchtypeid(self,data):
		""" find defualt search types """
		if not self._outletsearchtypes:
			self._outletsearchtypes = {}
			for row in self._db.executeAll("SELECT prn_key,outletsearchtypeid FROM internal.producttypes",None):
				self._outletsearchtypes [row[0]]=row[1]

		# no types must be freelance
		if not data.has_key("PRODUCT_TYPE"):
			return Constants.Search_Type_Freelance
		else:
			#
			productid = int(self._fixoutlettype(data['PRODUCT_TYPE']))

			if self._outletsearchtypes.has_key(productid):
				return self._outletsearchtypes[productid]
			else:
				return self._outletsearchtypes[7827]

	def date_time(self):
		return datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")

class GeneralReference(DocHandlerBase):
	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_GENERAL_REF_ROW","PRN_GENERAL_REF.xml","","REF_ID","")
		self._fields[0].append(ImportField("REF_ID","prn_key",types.IntType ))
		self._fields[0].append(ImportField("REF_VALUE","?",types.StringType ))

	def endDocument(self):
		print ("lookups")
		fields = {"220":[[],[],"internal.status","statusname"],  # Status Table
				  "140":[[],[],"internal.outlettypes","outlettypename"],  # Outlet type table
				  "170":[[],[],"internal.producttypes","producttypename"],  # Prodcut types
				  "120":[[],[],"internal.industries","industryname"],  # Industry
				  "90":[[],[],"internal.frequencies","frequencyname"],  # frequency
				  "190":[[],[],"internal.regionalfocus","regionalfocusname"],  # frequency
				  "50":[[],[],"internal.currencies","currencyname"],  # frequency
				  "30":[[],[],"internal.deliverypreferences","deliverypreferencename"],# delivery prefence
				  "210":[[],[],"internal.roles","rolename"],# roles
				  "130":[[],[],"internal.languages","languagename"],# languages
				  }
		for row in self._rows:
			value = None
			key = row["REF_TYPE"]
			if fields.has_key(key):
				if key=="130" and row['LANG_ID']!='291':
					continue

				d = fields[key]
				self._tablename[0] = d[2]
				self._fields[0][1].dbname = d[3]
				value = self._createdb(row,self._fields[0])
			if not value:
				continue

			if not self.exists(row[self._prn_key],self._tablename[0]):
				d[0].append(value)

		for key,data in fields.iteritems():
			print (key)
			d = fields[key]
			self._tablename[0] = d[2]
			self._fields[0][1].dbname = d[3]

			commandline=self.createline(self._fields[0],self._tablename[0])
			c = self._db.getCursor()
			try:
				self._db.startTransaction(c)
				c.executemany(commandline,d[0])
				self._db.commitTransaction(c)
			except Exception, ex :
				print (ex)
				self._db.rollbackTransaction(c)
			self._db.closeCursor(c)

class Address(DocHandlerBase):
	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_ADDRESS_ROW","PRN_ADDRESS.xml",'addresses','ADDRESS_ID',"addressid",
								include_update = True )
		self._fields[0].append(ImportField("ADDRESS_ID","prn_key",types.IntType ))
		self._fields[0].append(ImportField("ADDRESS_LINE1","address1",types.StringType ))
		self._fields[0].append(ImportField("ADDRESS_LINE2","address2",types.StringType ))
		self._fields[0].append(ImportField("POST_OR_ZIP","postcode",types.StringType ))
		self._fields[0].append(ImportField("COUNTRY_GEO_ID","countryid",types.StringType,cfunc=self.geogconvert))
		self._fields[0].append(ImportField("STATE_GEO_ID","county",types.StringType,cfunc=self.geogconvert2))

		self._fields[0].append(ImportField("CITY_GEO_ID","townid",types.StringType,cfunc=self.geogconvert))
		self._fields[0].append(ImportField("CITY_GEO_ID","townname",types.StringType,cfunc=self.geogconvert2))
		self._fields[0].append(ImportField("","addresstypeid",types.StringType ,default=1))

		self._postcodes = {"E2":"", "E3":"", "E4":"","E5":"","E6":"","E7":"","E8":"","E9":"","E10":"","E11":"","E12":"","E13":"","E14":"","E15":"","E16":"","E17":"",
		                "E18":"","EC1":"","EC2":"","EC3":"","EC4":"","N1":"","N2":"","N3":"","N4":"","N5":"","N6":"","N7":"","N8":"","N9":"","N10":"","N11":"",
		                "N12":"","N13":"","N14":"","N15":"","N16":"","N17":"","N18":"","N19":"","N20":"","N21":"","N22":"","NW1":"","NW2":"","NW3":"",
		                "NW4":"","NW5":"","NW6":"","NW7":"","NW8":"","NW9":"","NW10":"","NW11":"","SE1":"","SE2":"","SE3":"","SE4":"","SE5":"",
		                "SE6":"","SE7":"","SE8":"","SE9":"","SE10":"","SE11":"","SE12":"","SE13":"","SE14":"","SE15":"","SE16":"","SE17":"","SE18":"","SE19":"",
		                "SE20":"","SE21":"","SE22":"","SE23":"","SE24":"","SE25":"","SE26":"","SE27":"","SE28":"","SW1":"","SW2":"","SW3":"","SW4":"",
		                "SW5":"","SW6":"","SW7":"","SW8":"","SW9":"","SW10":"","SW11":"","SW12":"","SW13":"","SW14":"","SW15":"","SW16":"",
		                "SW17":"","SW18":"","SW19":"","SW20":"","W1":"","W2":"","W3":"","W4":"","W5":"","W6":"","W7":"","W8":"","W9":"","W10":"",
		                "W11":"","W12":"","W13":"","W14":"","WC1":"","WC2":""}

	def _ignore(self , row ) :
		# if it on a record we control then ignore
		command = "SELECT sourcetypeid FROM outlets WHERE communicationid IN ( SELECT communicationid FROM communications WHERE addressid IN ( SELECT addressid FROM addresses WHERE prn_key = %(data)s ) ) AND sourcetypeid = 2;"
		dbresult = self._db.executeOne(command,dict(data= row["ADDRESS_ID"]))
		if dbresult:
			return True
		return False

class Outlet(DocHandlerBase):
	def communicationconvert(self,data):
		r = None
		dbresult = self._db.executeOne("SELECT communicationid FROM communications WHERE prn_key=%(key)s AND prn_source=1",dict(key=data))
		if dbresult:
			r = dbresult[0]
		return r

	def profile_check(self, field, row ):
		ret = False

		dbresult = self._db.executeOne("""SELECT profile_by_prmax FROM internal.research_control_record AS rc JOIN outlets AS o ON o.outletid =  rc.objectid
		WHERE o.prn_key=%(key)s AND rc.objecttypeid = 1""",dict(key=row["OTL_ID"]))
		if dbresult:
			r = dbresult[0]

		return ret

	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_OUTLET_ROW","PRN_OUTLET.xml",'communications','OTL_ID','communicationid',
		                        include_update = True,
		                        outaddfile = "/tmp/outlets_add.csv", columns = [0,2,3], outtablename = "outlets")
		self._sourcetype[0] = 1
		self._fields[0].append(ImportField("OTL_ID","prn_key",types.IntType))
		self._fields[0].append(ImportField("","communicationtypeid",types.IntType,default=1))
		self._fields[0].append(ImportField("","prn_source",types.IntType,default=1))
		self._fields[0].append(ImportField("ADDRESS_ID","addressid",types.IntType,self.addressconvert))
		self._fields[0].append(ImportField("TELEPHONE","tel",types.StringType,default=""))
		self._fields[0].append(ImportField("FAX","fax",types.StringType,default=""))
		self._fields[0].append(ImportField("EMAIL","email",types.StringType,default=""))
		self._fields[0].append(ImportField("","mobile",types.StringType,default=""))
		self._fields[0].append(ImportField("","webphone",types.StringType,default=""))

		self._tablename.append("outlets")
		self._tablekey.append("outletid")
		self._sourcetype.append(None)
		self._fields.append([])
		self._fields[1].append(ImportField("OTL_ID","prn_key",types.IntType ))
		self._fields[1].append(ImportField("HAS_CHILDREN","isparent",types.IntType,default=0))
		self._fields[1].append(ImportField("NAME","outletname",types.StringType))
		self._fields[1].append(ImportField("SORT_NAME","sortname",types.StringType))
		self._fields[1].append(ImportField("STATUS_TYPE","statusid",types.IntType,cfunc=self.statusconvert))
		self._fields[1].append(ImportField("OUTLET_TYPE","outlettypeid",types.IntType,cfunc=self.outlettypeconvert))
		self._fields[1].append(ImportField("PRODUCT_TYPE","producttypeid",types.IntType,cfunc=self.productconvert,default=34))
		self._fields[1].append(ImportField("INDUSTRY_TYPE","industryid",types.IntType,cfunc=self.industryconvert))
		self._fields[1].append(ImportField("FREQUENCY_TYPE","frequencyid",types.IntType,cfunc=self.frequencyconvert))
		self._fields[1].append(ImportField("REG_FOCUS_TYPE","regionalfocusid",types.IntType,cfunc=self.regionalconvert))
		self._fields[1].append(ImportField("CIRCULATION","circulation",types.IntType,default=0))
		self._fields[1].append(ImportField("PROFILE","profile",types.StringType,default="", fcheck = self.profile_check))
		self._fields[1].append(ImportField("CURRENCY_TYPE","currencyid",types.IntType,cfunc=self.currencyconvert))
		self._fields[1].append(ImportField("SUBS_PRICE","subprice",types.IntType,default=0,cfunc=self.priceconvert))
		self._fields[1].append(ImportField("PRICE","price",types.IntType,default=0,cfunc=self.priceconvert))
		self._fields[1].append(ImportField("PREF_DELIVERY_TYPE","deliverypreferenceid",types.IntType,cfunc=self.deliverypreferenceconvert))
		self._fields[1].append(ImportField("WWW","www",types.StringType,default=None))
		self._fields[1].append(ImportField("DATE_ESTABLISHED","established",types.StringType,default=None))
		self._fields[1].append(ImportField("OTL_ID","communicationid",types.IntType,cfunc=self.communicationconvert))
		self._fields[1].append(ImportField("","outletsearchtypeid",types.IntType,cfuncrow=self.outletsearchtypeid))
		self._fields[1].append(ImportField("","update",types.StringType,defaultfunc=self.date_time))

		self._fields[1].append(ImportField("","sourcetypeid",types.IntType,default=Constants.Research_Source_Prn))
		self._fields[1].append(ImportField("OTL_ID","sourcekey",types.IntType))

		self._ignoreprn_keys = {}
		for key in self._db.executeAll("SELECT prn_key FROM research.ignore_prn_outlets",None):
			self._ignoreprn_keys[str(key[0])] = True

	def _ignore(self , row ) :
		if DocHandlerBase._ignore(self, row ,False) :
			return True

		if row.has_key("PRODUCT_TYPE") and row["PRODUCT_TYPE"] in ("503392","503402"):
			return True

		if row.has_key("OUTLET_TYPE") and row["OUTLET_TYPE"] in ("4020","4021","4022","4023","4025","4026","4027","4028","4029","4030","4031","4032","4033","4035","4036","4037","4038" ) :
			return True

		return False

	def endDocument(self):
		DocHandlerBase.endDocument(self)
		c = self._db.getCursor()
		try:
			try:
				for row in self._rows:
					if self._ignore( row ) :  continue
					#
					child = self.outletconvert(row["OTL_ID"])
					#c.execute("update outlets AS o set update = CURRENT_DATE  WHERE outletid = %s" % child)

					if row.has_key("PARENT_OTL_ID"):
						# fix parent
						parent = self.outletconvert(row["PARENT_OTL_ID"])
						if parent:
							c.execute("UPDATE outlets set parentoutletid=%s WHERE outletid=%s",(parent,child))
							# fix primary contact

				c.execute(_UpdatePrimarySql)
				c.execute("update outlets as o set primaryemployeeid = e.employeeid FROM employees as e where e.outletid = o.outletid AND o.outlettypeid = 19 and o.primaryemployeeid  is null;")
				self._db.commitTransaction(c)
			except Exception, ex :
				print (ex)
				self._db.rollbackTransaction(c)
		finally:
			self._db.closeCursor(c)

class Contact(DocHandlerBase):
	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_CONTACT_ROW","PRN_CONTACT.xml",'contacts','CON_ID',"contactid",
								include_update = True )

		self._fields[0].append(ImportField("CON_ID","prn_key",types.IntType))
		self._fields[0].append(ImportField("PREFIX","prefix",types.StringType,default=""))
		self._fields[0].append(ImportField("FIRST_NAME","firstname",types.StringType,default=""))
		self._fields[0].append(ImportField("SURNAME","familyname",types.StringType,default=""))
		self._fields[0].append(ImportField("MIDDLE_NAME","middlename",types.StringType,default=""))
		self._fields[0].append(ImportField("SUFFIX","suffix",types.StringType,default=""))
		self._fields[0].append(ImportField("","sourcetypeid",types.IntType,default=Constants.Research_Source_Prn))

		self._ignoreprn_keys = {}
		for key in self._db.executeAll("SELECT prn_key FROM research.ignore_prn_contacts",None):
			self._ignoreprn_keys[str(key[0])] = True

	def _ignore(self, row , mustexist = True ):
		if row.has_key("CON_ID") and self._ignoreprn_keys.has_key ( row["CON_ID"] ) :
			return True

class Employee(DocHandlerBase):
	def communicationconvert(self,data):
		r = None
		dbresult = self._db.executeOne("SELECT communicationid FROM communications WHERE prn_key=%(data)s AND prn_source=2",dict(data=data))
		if dbresult:
			r = dbresult[0]
		return r

	def endDocument(self):
		DocHandlerBase.endDocument(self)
		c = self._db.getCursor()
		try:
			try:
				c.execute(_UpdatePrimarySql)
				c.execute("update outlets as o set primaryemployeeid = e.employeeid FROM employees as e where e.outletid = o.outletid AND o.outlettypeid = 19 and o.primaryemployeeid  is null;")
				self._db.commitTransaction(c)
			except Exception, ex :
				print (ex)
				self._db.rollbackTransaction(c)
		finally:
			self._db.closeCursor(c)

	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_EMPLOYEE_ROW","PRN_EMPLOYEE.xml",'communications','EMP_ID',"communicationid",
								include_update = True ,
		                        outaddfile = "/tmp/contacts_add.csv", columns = [1,3], outtablename = "employees")
		self._sourcetype[0] = 2
		self._fields[0].append(ImportField("EMP_ID","prn_key",types.IntType))
		self._fields[0].append(ImportField("","communicationtypeid",types.IntType,default=2))
		self._fields[0].append(ImportField("","prn_source",types.IntType,default=2))
		self._fields[0].append(ImportField("ADDRESS_ID","addressid",types.IntType,self.addressconvert))
		self._fields[0].append(ImportField("TELEPHONE","tel",types.StringType,default=""))
		self._fields[0].append(ImportField("FAX","fax",types.StringType,default=""))
		self._fields[0].append(ImportField("EMAIL","email",types.StringType,default=""))
		self._fields[0].append(ImportField("","mobile",types.StringType,default=""))
		self._fields[0].append(ImportField("","webphone",types.StringType,default=""))

		self._sourcetype.append(None)
		self._tablename.append("employees")
		self._tablekey.append("employeeid")
		self._fields.append([])
		self._fields[1].append(ImportField("EMP_ID","prn_key",types.IntType ))
		self._fields[1].append(ImportField("OTL_ID","outletid",types.IntType,cfunc=self.outletconvert))
		self._fields[1].append(ImportField("CON_ID","contactid",types.IntType,cfunc=self.contactconvert))
		self._fields[1].append(ImportField("JOB_TITLE","job_title",types.StringType,default=""))
		self._fields[1].append(ImportField("PREF_DELIVERY_TYPE","deliverypreferenceid",types.IntType,cfunc=self.deliverypreferenceconvert))
		self._fields[1].append(ImportField("IS_PRIMARY_NEWS_CONTACT","isprimary",types.IntType,default=0))
		self._fields[1].append(ImportField("PROFILE","profile",types.StringType,default=""))
		self._fields[1].append(ImportField("EMP_ID","communicationid",types.IntType,cfunc=self.communicationconvert))
		self._fields[1].append(ImportField("","sourcetypeid",types.IntType,default=Constants.Research_Source_Prn))
		self._fields[1].append(ImportField("EMP_ID","sourcekey",types.IntType))
		self._fields[1].append(ImportField("","update",types.StringType,defaultfunc=self.date_time))

		self._ignore_employee_prn_keys = {}
		for key in self._db.executeAll("SELECT prn_key FROM research.ignore_prn_employees",None):
			self._ignore_employee_prn_keys[str(key[0])] = True

		self._BlankFields = ("TELEPHONE","FAX","EMAIL")

	def _ignore(self , row ) :
		#if DocHandlerBase._ignore(self, row ,True ) :
		#	return True
		outletid = self.outletconvert(row["OTL_ID"] )
		if outletid == None:
			return True

		if row.has_key("EMP_ID") and self._ignore_employee_prn_keys.has_key ( row["EMP_ID"] ) :
			return True

		if row.get("JOB_TITLE",""):
			# check too see if exist as a prmax entry
			contactid = self.contactconvert(row["CON_ID"])
			if contactid:
				# get the contact name
				contactname = self._db.executeOne (
				  """SELECT ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname
				  FROM contacts AS c WHERE c.contactid = %(contactid)s""", dict ( contactid = contactid ), True )["contactname"]
				# look at the prmax contact and see if it all ready exits
				for trow in self._db.executeAll("""
					SELECT job_title,ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)
				  FROM employees AS e JOIN contacts AS c ON c.contactid = e.contactid
				  WHERE e.outletid = %(outletid)s AND e.customerid = -1 and e.sourcetypeid = 2""",
					dict( outletid = outletid)):
					#found a match
					if trow[0] == row["JOB_TITLE"] and trow[1] == contactname:
						return True

		# if this is a freelance  we need to fix up all the address/tel/email as blank
		command = "SELECT  outlettypeid FROM outletid WHERE prn_key=%(data)s"
		dbresult = self._db.executeOne("SELECT  outlettypeid FROM outlets WHERE prn_key=%(data)s",dict(data=row["OTL_ID"]))
		if dbresult and dbresult[0]== 19:
			# we need to fix the data at this point
			for key  in self._BlankFields:
				if row.has_key(key):
					row[key] = ""

		return False

class EmployeeLanguages(DocHandlerBase):
	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_EMPLOYEE_WORKING_LANGUAGES_ROW","PRN_EMPLOYEE_WORKING_LANGUAGES.xml",
			'employeelanguages','EMP_ID',"employeelanguageid",
			prn_key_function = self._localexists, include_update = True )

		self._fields[0].append(ImportField("EMP_ID","employeeid",types.IntType,cfunc=self.employeeconvert,mustexist=True))
		self._fields[0].append(ImportField("LANG_TYPE","languageid",types.IntType,cfunc=self.languageconvert,mustexist=True))
		self._fields[0].append(ImportField("IS_PREFERRED","isprefered",types.IntType))

	def _localexists(self,row,tablename,sourcetype):
		command = "SELECT * FROM employeelanguages WHERE employeeid =%(key1)s AND languageid =%(key2)s"
		try:
			self._data = None
			params  = dict(key1=self._getfunc("employeeid").cfunc(row["EMP_ID"]),
						   key2=self._getfunc("languageid").cfunc(row["LANG_TYPE"]))
			data = self._db.executeOne(command, params, True)
			self._data = data
			if data:
				return True
		except  Exception, ex :
			print (command,"\n",ex)
			return False

class OutletLanguages(DocHandlerBase):
	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_OUTLET_WORKING_LANGUAGES_ROW","PRN_OUTLET_WORKING_LANGUAGES.xml",'outletlanguages','OTL_ID',"outletlanguageid",
			prn_key_function = self._localexists, include_update = True )

		self._fields[0].append(ImportField("OTL_ID","outletid",types.IntType,cfunc=self.outletconvert,mustexist=True))
		self._fields[0].append(ImportField("LANG_TYPE","languageid",types.IntType,cfunc=self.languageconvert,mustexist=True))
		self._fields[0].append(ImportField("IS_PREFERRED","isprefered",types.IntType))

	def _localexists(self,row,tablename,sourcetype):
		""" need to fiunx"""
		command = "SELECT * FROM outletlanguages WHERE outletid =%(key1)s AND languageid =%(key2)s"
		try:
			self._data = None
			params  = dict(key1=self._getfunc("outletid").cfunc(row["OTL_ID"]),
						   key2=self._getfunc("languageid").cfunc(row["LANG_TYPE"]))
			data = self._db.executeOne(command,params,True)
			self._data = data
			if data:
				return True
		except  Exception, ex :
			print (command,"\n",ex)
			return False

		return None

class Products(DocHandlerBase):
	def exists(self,key,tablename,sourcetype=None):
		command = "SELECT * FROM %s WHERE prn_product_id=%%(key)s"%tablename
		try:
			self._data = None
			self._data = self._db.executeOne(command,dict(key=int(key)),True)
			return self._data
		except  Exception, ex :
			print (command,"\n",ex)
			return 0

	def __init__(self):
		DocHandlerBase.__init__(self,"PRN_PRODUCTS_ROW","PRN_PRODUCTS.xml",'outlettitles','ID',"outlettitleid",
								include_update = True )
		self._fields[0].append(ImportField("ID","prn_product_id",types.IntType))
		self._fields[0].append(ImportField("OTL_ID","prn_key",types.IntType))
		self._fields[0].append(ImportField("OTL_ID","outletid",types.IntType,cfunc=self.outletconvert))
		self._fields[0].append(ImportField("NAME","outletaltname", types.StringType))

def PreDataLoad():
	#initialise
	_db =  DBConnect(Constants.db_Command_Service)
	_db.execute("TRUNCATE cache.cachestore;COMMIT;",None)
	_db.Close()

def LoadPrnData():
	parser = make_parser()

	#OutletSubject, OutletCoverage
	for classobj in ( GeneralReference,Address,Contact,Outlet,Employee,Products, ) :
	#for classobj in ( Employee,) :
		dh=classobj()
		parser.setContentHandler(dh)
		parser.parse(codecs.open(os.path.normpath(os.path.join(dirSource,dh.filename))))
		dh.ExportAdds()

	# load completed
	_db =  DBConnect(Constants.db_Command_Service)
	_db.execute("UPDATE internal.prmaxcontrol SET import_completed = current_timestamp;COMMIT;",None)
	_db.Close()


def _fixrows(row):
	def _fixtext(c):
		if isinstance(c, basestring):
			return c
		else:
			return str(c)

	return "\"" + "\",\"".join ( [unicode( _fixtext(c) ,'utf-8','replace') for c in row ]) + "\""

def PrnDeletesData():
	def _PRNDeleteEmployee(c, lastcompleted):
		# delete  contact that are not primary
		print ("_PRNDeleteEmployee")

		# Export record for report
		c.execute("""SELECT CAST(o.outletid AS character varying) AS outletid,o.outletname,e.job_title,
		ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname
		FROM employees AS e
		JOIN outlets AS o ON o.outletid = e.outletid
		LEFT OUTER JOIN contacts AS con ON con.contactid =  e.contactid
		WHERE (CAST( e.update as DATE) != '%s' OR e.update is null) AND e.prn_key>0 AND e.sourcetypeid = 1 AND e.prmaxstatusid = 1 AND
		NOT EXISTS (select primaryemployeeid from outlets as o where e.employeeid = o.primaryemployeeid ) AND
		EXISTS (SELECT employeeid FROM userdata.listmembers AS lm WHERE lm.employeeid = e.employeeid)""" % lastcompleted)

		import codecs
		f = codecs.open("/tmp/contacts_delete.csv","w","utf-8")
		try:
			f.write(u"\n".join([ _fixrows(row) for row in c.fetchall() ] ))
		finally:
			f.close()

		# which customer list are altered
		c.execute("""SELECT c.customername,l.listname,o.outletname,e.job_title,
		ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname
		FROM employees AS e
		JOIN outlets AS o ON o.outletid = e.outletid
		JOIN userdata.listmembers as lm ON lm.employeeid = e.employeeid
		JOIN userdata.list as l ON l.listid = lm.listid
		JOIN internal.customers AS c ON c.customerid = l.customerid
		LEFT OUTER JOIN contacts AS con ON con.contactid =  e.contactid
		WHERE (CAST( e.update as DATE) != '%s' OR e.update is null) AND e.prn_key>0 AND e.sourcetypeid = 1 AND e.prmaxstatusid = 1 AND
		NOT EXISTS (select primaryemployeeid from outlets as o where e.employeeid = o.primaryemployeeid ) AND
		EXISTS (SELECT employeeid FROM userdata.listmembers AS lm WHERE lm.employeeid = e.employeeid)"""% lastcompleted)

		import codecs
		f = codecs.open("/tmp/list_contact_delete.csv","w","utf-8")
		try:
			f.write(u"\n".join([ _fixrows(row) for row in c.fetchall() ] ))
		finally:
			f.close()

		sqlCommands = ( "SELECT employee_delete(employeeid) FROM employees WHERE (CAST( update as DATE) != '%s' OR update is null) AND prn_key>0 AND sourcetypeid = 1",
		                "SELECT employee_delete(e.employeeid) FROM employees AS e JOIN outlets AS o ON o.outletid = e.outletid WHERE (CAST( e.update as DATE) != '%s' OR e.update is null) AND e.prn_key>0 AND e.sourcetypeid = 1 AND e.prmaxstatusid = 1 AND NOT EXISTS (select primaryemployeeid from outlets as o where e.employeeid = o.primaryemployeeid ) AND EXISTS (SELECT employeeid FROM userdata.listmembers AS lm WHERE lm.employeeid = e.employeeid)",
		                # handle primaries
		                "SELECT employee_delete(e.employeeid) FROM employees AS e JOIN outlets AS o ON o.outletid = e.outletid WHERE isprimary=1 AND e.update::date != '%s' AND e.employeeid != o.primaryemployeeid AND o.customerid =-1  AND e.sourcetypeid = 1 AND e.prmaxstatusid = 1 AND NOT EXISTS (SELECT employeeid FROM userdata.listmembers AS lm WHERE lm.employeeid = e.employeeid)",
		                "UPDATE  employees AS e SET prmaxstatusid = 2 FROM outlets AS o WHERE o.outletid = e.outletid AND isprimary=1 and e.update::date != '%s' and e.employeeid != o.primaryemployeeid AND o.customerid =-1  AND e.sourcetypeid = 1 AND e.prmaxstatusid = 1 AND NOT EXISTS (SELECT employeeid FROM userdata.listmembers AS lm WHERE lm.employeeid = e.employeeid)"
		                )
		for sqlcommand in sqlCommands:
			print (sqlcommand)
			c.execute(sqlcommand%lastcompleted)

		print ("Outlet DeleteReport")
		c.execute("""SELECT c.customername,l.listname,o.outletname
		FROM outlets AS o
		JOIN userdata.listmembers as lm ON lm.outletid = o.outletid
		JOIN userdata.list as l ON l.listid = lm.listid
		JOIN internal.customers AS c ON c.customerid = l.customerid
		WHERE (CAST( o.update as DATE) != '%s' OR o.update is null) AND o.prn_key !=0 AND o.sourcetypeid = 1""" %lastcompleted)

		f = codecs.open("/tmp/list_outlet_delete.csv","w","utf-8")
		try:
			f.write(u"\n".join([ _fixrows(row) for row in c.fetchall() ] ))
		finally:
			f.close()


	# need to add a section to controll the deleteing to make sure it can't be run on failure etc or wrong day
	print ("Deleting All ")
	command_list = (
		("DELETE FROM %s AS %s where (CAST( update as DATE) != '%s' OR update is null) AND prn_key>0",
		  (("addresses","a", "AND NOT EXISTS (select communicationid as c from communications as c where c.addressid = a.addressid ) " ),
		  ("communications","c","AND NOT EXISTS (select communicationid from outlets as o where c.communicationid = o.communicationid ) AND NOT EXISTS (select communicationid from employees as e where c.communicationid = e.communicationid ) "),
		  ("contacts","c","AND NOT EXISTS (select contactid from employees as e where c.contactid = e.contactid ) "),
		  ),),
		("SELECT outlet_delete(o.outletid) FROM %s AS %s WHERE (CAST( update as DATE) != '%s' OR update is null) AND prn_key>0  AND sourcetypeid = 1",
		 (("outlets","o",None,),),),
	)

	_db =  DBConnect(Constants.db_Command_Service)
	c = _db.getCursor()
	try:
		c.execute("SELECT CAST(import_completed AS DATE) FROM  internal.prmaxcontrol")
		lastcompletedobj = c.fetchone()[0]
		if lastcompletedobj != datetime.date.today():
			raise Exception("PrnDeletesData Delete run not syncronized")

		lastcompleted = lastcompletedobj.strftime("%Y-%m-%d")

		# generate report
		c.execute("SELECT o.outletid,o.outletname FROM outlets AS o WHERE (CAST( update as DATE) != '%s' OR update is null) AND prn_key>0  AND sourcetypeid = 1" % lastcompleted )
		import codecs
		f = codecs.open("/tmp/deleted_outlets.csv","w","utf-8")
		try:
			f.write(u"\n".join([ _fixrows(row) for row in c.fetchall() ] ))
		finally:
			f.close()

		try:
			for command in command_list:
				for table in command[1]:
					print (table[0])
					sqlcommand = command[0]%(table[0], table[1], lastcompleted)
					if table[2]:
						sqlcommand+= " "
						sqlcommand+= table[2]
					print (sqlcommand)
					c.execute(sqlcommand)
			_PRNDeleteEmployee(c, lastcompleted)
			_db.commitTransaction(c)
		except Exception, ex :
			print (ex)
			_db.rollbackTransaction(c)
	finally:
		_db.closeCursor(c)
	_db.Close()
	print ("Deleting Complete")


def LoadMediaProofData():
	print ("Loading MediaProof Data")
	_db =  DBConnect(Constants.db_Command_Service)
	try:
		sfile = codecs.open(os.path.normpath(os.path.join(dirSource,"mediadata.csv")))

		csvreader = csv.reader(sfile)
		csvreader.next()
		params = dict(outlettypeid="",prn_key="")
		c = _db.getCursor()

		for row in csvreader:
			if not row[0].strip():
				continue
			params['outlettypeid'] = int(row[2].replace(",",""))
			params['mp_sqcm'] = float ( row[5])
			if params['outlettypeid']==0:
				continue
			params['prn_product_id'] = int(row[1])
			c.execute("""
			UPDATE outlets AS o
				SET mp_outlettypeid = %(outlettypeid)s,
			  mp_sqcm = %(mp_sqcm)s
			FROM
				internal.mp_outlettypes as mpot
			WHERE
				o.prn_key = %(prn_product_id)s AND
				mpot.mp_outlettypeid = %(outlettypeid)s""", params)
		_db.commitTransaction(c)

	finally:
		_db.Close()


def PostDataLoad():
	print ("Loading PRmax Outlet Search Types")
	_db =  DBConnect(Constants.db_Command_Service)
	try:
		c = _db.getCursor()
		c.execute("""UPDATE outlets AS o
					SET outletsearchtypeid = ot.outletsearchtypeid
		            FROM internal.prmax_outlettypes as ot
		            WHERE ot.prmax_outlettypeid = o.prmax_outlettypeid""")

		c.execute("SELECT outletid FROM outlets WHERE customerid = -1 AND primaryemployeeid IS NULL AND sourcetypeid = 1")
		for outletrow in c.fetchall():
			# fix up for no contact employees
			c.execute("SELECT COUNT(*) FROM employees WHERE outletid = %s" % outletrow[0])
			if c.fetchone()[0] == 0 :
				# need to create a dummy primary contact
				c.execute("INSERT INTO employees(outletid,isprimary,update,sourcetypeid) VALUES(%s,1,CURRENT_DATE,1)" % outletrow[0])
				continue

		# after deletes need to fix up primary contacts again
		c.execute(_UpdatePrimarySql)


		# Clean up all contact that have been marked as deleted over time but now don't exists in list
		c.execute("""SELECT employee_delete(e.employeeid) FROM employees AS e WHERE e.prmaxstatusid = 2 AND e.customerid = -1 AND
		e.employeeid NOT IN (select employeeid from userdata.listmembers AS lm WHERE lm.employeeid = e.employeeid ) """)

		_db.commitTransaction(c)

		# apply roles no longer needed
		#c.execute("select Reapplyroles()")
		# chnaged to deduplicate
		c = _db.getCursor()
		c.execute("select standing_deduplicate()")
		_db.commitTransaction(c)

	finally:
		_db.Close()

	# at this point we could send all the reports too david


print ("Start Run", datetime.datetime.now())

PreDataLoad()
LoadPrnData()
LoadMediaProofData()
PrnDeletesData()
PostDataLoad()

print ("Complete", datetime.datetime.now())



