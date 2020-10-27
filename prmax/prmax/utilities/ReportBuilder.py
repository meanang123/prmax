# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:			ReportBuilder.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:		01/10/2008
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

# look at sub-process.py look at better
#-----------------------------------------------------------------------------
from threading import Thread
from genshi.template import TextTemplate, MarkupTemplate, \
	 TemplateNotFound
import os, slimmer, datetime
from StringIO import StringIO
from xml.dom.minidom  import parseString
from ttl.dict import DictExt
from ttl.decorators import synchronized
from ttl.postgres  import DBConnect, DBCompress
import prmax.utilities.ReportExtensions as ReportExtensions
import prmax.Constants as Constants
import xlrd
import xlwt
import xlsxwriter
import csv
import cPickle
import platform
import codecs
from ttl.labels.definitions import LabelInfo

import logging
log = logging.getLogger()

class ThreadReport(Thread):
	""" Process to run the actual report
	"""
	def __init__ (self, reportid, path, parent):
		"""initialise system """
		self._reportid = reportid
		self._path  = path
		self._parent = parent
		Thread.__init__(self)

	def run(self):
		"""run the process """
		log.debug("Report Build Started %d"%self._reportid)
		report = ReportBuilder(self._reportid,
							   self._path,
							   self._parent._tmppath,
							   self._parent._debug  )
		try:
			try:
				report.run()
			except:
				log.exception("Report Build Failed %d" % self._reportid)
				report.failed()
			log.debug("Report Build Completed %d" % self._reportid)
		finally:
			report.close()
			del report
			self._parent.complete()

class TemplateLoader(object):
	""" used by the genshi system to load the xi:include files into a template
	This used that template path supplied from the controller
	Follows the pattern in genshi
	"""
	def __init__(self, path):
		self._path = path
		self.auto_reload = False

	def load(self, filename, relative_to = None, cls = None, encoding = None):
		""" load include template """
		try:
			try:
				tfile = codecs.open( os.path.normpath(os.path.join(self._path, filename)), "r", "utf-8")
				if filename[-3:].lower() == "css":
					# why have do od this
					data = tfile.read()
					if platform.system().lower() != "windows":
						data = data[2:]
					return TextTemplate(data)
				else:
					return MarkupTemplate(tfile.read())
			finally:
				try:
					tfile.close()
				except: pass
		except Exception, ex :
			log.exception("Load")
			raise TemplateNotFound(filename, "")

class ReportController(object):
	"""
	Controller class for the report system
	looks at the queue and allocates the report to a thread
	"""
	def __init__(self, templatepath, tmppath, debug = False):
		self._db = DBConnect(Constants.db_Command_Service)
		self._templatepath = templatepath
		self._tmppath = tmppath
		self._debug = debug
		self.used = 0

	__sql_report_data = """SELECT reportid FROM queues.reports WHERE reportstatusid IN (0) AND reporttemplateid IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,30,31,32,33,34,35,37) LIMIT 10"""
	__sql_report_status = """UPDATE queues.reports SET reportstatusid = 1 WHERE reportid = %(reportid)s"""
	__sql_report_time = """UPDATE internal.prmaxcontrol SET report_time  = %(reporttime)s"""

	@synchronized(lockname="report_clt")
	def run(self):
		" collect all and far out to threads"
		for row in self._db.executeAll(ReportController.__sql_report_data, {}):
			# need to put this on a thread or process but can be done later
			log.debug("Report Build Initiated %d" % row[0])
			self._changeStatus(row[0])
			report = ThreadReport(row[0], self._templatepath, self)
			report.start()

	@synchronized(lockname = "report_clt")
	def _changeStatus(self, reportid):
		""" This
		"""
		comm = self._db.getCursor(no_stop = False)
		comm.execute( ReportController.__sql_report_status ,
					  dict( reportid = reportid))
		self._db.commitTransaction(comm)
		self._db.closeCursor(comm)

	@synchronized(lockname = "report_clt")
	def start(self):
		"""start report """
		self.used += 1

	@synchronized(lockname = "report_clt")
	def complete(self):
		""" complete report """
		self.used -= 1

	@synchronized(lockname = "report_clt")
	def heartbeat(self):
		""" 	heartbeat """
		try:
			comm = self._db.getCursor(no_stop = False)
			comm.execute( ReportController.__sql_report_time ,
						  dict( reporttime = datetime.datetime.now()))
			self._db.commitTransaction(comm)
			self._db.closeCursor(comm)
		except Exception , ex :
			print ex


class ReportBuilder(object):
	""" Do an actual report """
	__sql_report_data = """select r.reportdatainfo,r.reportoptions,r.reportoutputtypeid,rt.query_text,rt.template,rt.reportextension,c.productid
		FROM queues.reports AS r
	    JOIN internal.reporttemplates AS rt ON rt.reporttemplateid = r.reporttemplateid
	    JOIN internal.customers AS c ON r.customerid = c.customerid
		WHERE r.reportid = %(reportid)s"""

	__sql_update = """UPDATE queues.reports SET reportoutput =%(reportoutputdata)s, reportstatusid=2
	WHERE reportid = %(reportid)s"""
	__sql_reset = """UPDATE queues.reports SET reportstatusid=0
	WHERE reportid = %(reportid)s"""

	def __init__(self, reportid, path, temppath, debug = False):
		""" init """
		self._reportid = reportid
		self._templatebuf = StringIO()
		self._data = {}
		self._db = DBConnect(Constants.db_Command_Service)
		self._report = DictExt()
		self._htmlrender = StringIO()
		self._finaloutput = StringIO()
		self._templatepath = path
		self._debug = debug
		self._temppath = temppath
		self._extension = None

	def close(self):
		self._db.Close()

	def _captureData(self):
		""" runs the query associated with the report based upon the params
		supplied by the report instance
		"""
		self._data = dict(common = self._commondata())
		# parse xml document
		document = parseString (self._report.query_text)
		# for each of the queries
		for command in document.getElementsByTagName("query"):
			if command.getAttribute("type") == "SQL":
				query = command.childNodes[0].nodeValue
				format = command.getAttribute("format")
				dictname = str(command.getAttribute("dictname"))
				defaultsortorder = command.getAttribute("defaultsortorder")
				query = self._fixSortOrder(query, defaultsortorder,
										   self._report.reportoptions)
				if format == Constants.Data_Format_Single_Dict:
					self._data[dictname] = self._db.executeOne(query ,
													self._report.reportoptions,
													to_dict = True)
				elif format == Constants.Data_Format_Multiple_Dict:
					self._data[dictname] = self._db.executeAll(query ,
													self._report.reportoptions,
													to_dict = True)
				elif format == Constants.Data_Format_List:
					self._data[dictname] = self._db.executeAll(query ,
													self._report.reportoptions)
					header = command.getAttribute("header")
					if header:
						self._data[dictname].insert(0, header.split(","))

			elif command.getAttribute("type") == "CUSTOM":
				# ask tim about loading modules?
				self._data.update(self._extension.load_data(self._db))
		document.unlink()

	def _commondata(self):
		""" add common data """
		return dict ( datetime = datetime.datetime.now().strftime("%d-%m-%y %H:%M"))

	def _fixSortOrder(self, query, defaultsortorder, options):
		""" fix the sort order """
		# find the line ORDER BY "defaultsortorder"
		# check options
		# convet default to actuial
		if self._extension:
			return self._extension.sort(query, defaultsortorder)
		return query

	def _loadreport(self):
		""" load the report instance and template from the systsem
		decode the report options and data options
		"""
		# capture report details
		a = LabelInfo()
		b = DBCompress.encode2(a)
		DBCompress.decode(b)

		data = self._db.executeAll( ReportBuilder.__sql_report_data,
									dict(reportid=self._reportid))
		self._report = DictExt ( dict(
			reportdatainfo = DBCompress.decode(data[0][0]) if data[0][0] else {},
			reportoptions = DBCompress.decode(data[0][1]) if data[0][1] else {},
			reportoutputtypeid = data[0][2],
			query_text = data[0][3].decode('utf-8'),
			template = data[0][4].decode('utf-8'),
			reportextension = data[0][5],
			productid = data[0][6]))

		# load extensions
		if self._report.reportextension:
			self._extension = ReportExtensions.__dict__[self._report.reportextension](
				self._report.reportoptions,
				self)

	def _runTemplate(self):
		""" run the twemplate to generate the report """
		if self._report.reportoutputtypeid in Constants.Phase_1_is_html:
			# this used the genshi template to render html
			tmpl = MarkupTemplate( self._report.template,
								  loader = TemplateLoader(self._templatepath))
			stream = tmpl.generate( **self._data)
			self._htmlrender.write(stream.render('xhtml', doctype = 'xhtml'))

			if self._debug:
				toutput = file( os.path.normpath(os.path.join(
					self._temppath,"%d.html"%self._reportid)),"w")
				toutput.write(self._htmlrender.getvalue())
				toutput.close()
		# csv etc

		# pdf
		if self._report.reportoutputtypeid in Constants.Phase_2_is_pdf:
			if self._extension and getattr(self._extension, "run", None) != None:
				comm = self._db.getCursor(no_stop = False)
				try:
					self._extension.comm = comm
					self._extension.run(self._data, self._finaloutput)
					self._db.commitTransaction(comm)
				except Exception:
					self._db.rollbackTransaction(comm)
					raise
			self._finaloutput.flush()
			if self._debug:
				toutput = file( os.path.normpath(os.path.join(
					self._temppath, "%d.pdf" % self._reportid)), "wb")
				toutput.write(self._finaloutput.getvalue())
				toutput.close() #0141567620

		# csv
		if self._report.reportoutputtypeid in Constants.Phase_3_is_csv:
			csv_write = csv.writer(self._finaloutput)
			csv_write.writerows(self._data["results"])

		# html
		if self._report.reportoutputtypeid == Constants.Report_Output_html:
			self._finaloutput.write(slimmer.slimmer(self._htmlrender.getvalue()))

		# label outlput
		if self._report.reportoutputtypeid in Constants.Phase_4_is_label:
			self._labels()

		# pdf or excel
		if self._report.reportoutputtypeid in Constants.Phase_5_is_excel:
			if self._extension and getattr(self._extension, "run", None) != None:
				comm = self._db.getCursor(no_stop = False)
				try:
					self._extension.comm = comm
					self._extension.run(self._data, self._finaloutput)
					self._db.commitTransaction(comm)
				except Exception:
					self._db.rollbackTransaction(comm)
					raise
			self._finaloutput.flush()
			if self._debug:
				toutput = file( os.path.normpath(os.path.join(
			        self._temppath, "%d.xls" % self._reportid)), "wb")
				toutput.write(self._finaloutput.getvalue())
				toutput.close()

	def _labels(self):
		""" Do Labels """
		# serialise the data
		# need to serial most of the command

		# fix data remove trailing sort field
		data = [ row[:-1] for row in self._data['labels'] ]

		tfname = os.path.join("", os.tempnam())
		tf = file( tfname,"wb")
		data = dict ( labels = data,
					  label_info = self._report.reportoptions['label_info'] )
		cPickle.dump(data , tf)
		tf.close()

		# collect the correct command
		if platform.system() in ('Microsoft', "Windows"):
			command = Constants.windows_label_path
		else:
			command = Constants.unix_label_path
		# remove output name
		fname = os.path.join("", os.tempnam())
		# create the params list
		params = " ".join ( (tfname, fname))
		# run command
		os.system(command + " " + params)
		# cleanup
		try:
			os.remove(tfname)
		except : pass

		df = open(fname, "rb")
		self._finaloutput.write(df.read())
		self._finaloutput.flush()
		df.close()

	def _finalise(self):
		""" complete report """
		comm = self._db.getCursor(no_stop = False)
		try:
			comm.execute( ReportBuilder.__sql_update ,
						  dict( reportid = self._reportid,
								reportoutputdata = DBCompress.b64encode(
									self._finaloutput.getvalue())))

			# report may be part of a work flow
			if self._extension:
				self._extension.post(comm)

			self._db.commitTransaction(comm)
		except Exception , ex:
			self._db.rollbackTransaction(comm)
			raise ex

		self._db.closeCursor(comm)

	def failed(self):
		""" report failed """
		try:
			log.debug("Report Build Reset Started %d" % self._reportid)
			comm = self._db.getCursor()
			comm.execute( ReportBuilder.__sql_reset ,
						  dict( reportid = self._reportid))
			self._db.commitTransaction(comm)
			self._db.closeCursor(comm)
			log.debug("Report Build Reset Completed %d" % self._reportid)
		except Exception, ex:
			log.exception("failed")


	def run(self):
		""" created the report"""

		# load report details
		self._loadreport()

		# locd and convert the postgres data into the data needed for the
		# html template
		self._captureData()

		# run the template to generate the base report format
		self._runTemplate()

		# final phase place output data inot report record etc
		self._finalise()


