# -*- coding: utf-8 -*-
"""Report Interface """
#-----------------------------------------------------------------------------
# Name:        reports.py
# Purpose:		access to the report queue and templates
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, text
from prcommon.model.common import BaseSql
from prcommon.model import Customer
from ttl.postgres import DBCompress
from ttl.dict import DictExt

import prcommon.Constants as Constants

import logging
log = logging.getLogger("prcommon")

class Report(BaseSql):
	""" report interface"""
	@classmethod
	def add(cls, customerid, reportoutputtypeid, reportoptions, \
			reportdatainfo, reporttemplateid):
		""" add a new entry to the report queue"""

		if 'prstate' in reportoptions:
			reportoptions['prstate'] = None

		transaction = session.begin(subtransactions=True)

		try:
			# addreport
			report = Report(
				customerid=customerid,
				reportoptions=DBCompress.encode2(reportoptions),
				reportdatainfo=DBCompress.encode2(reportdatainfo),
				reportoutputtypeid=reportoutputtypeid,
				reporttemplateid=reporttemplateid)
			session.add(report)
			session.flush()
			transaction.commit()
			return report.reportid
		except:
			log.exception("Report add")
			transaction.rollback()
			raise

	@classmethod
	def status(cls, reportid):
		""" Check status of report """
		return session.query(Report.reportstatusid).filter_by(reportid=reportid).first()[0]

	@classmethod
	def wait(cls, reportid, timeout=30):
		""" wait for a report to be created
		if the time out is reached then it failed"""
		ltime = timeout
		while ltime:
			reportstatusid = session.query(Report.reportstatusid).filter_by(
				reportid=reportid).first()[0]
			if reportstatusid == 2:
				break
			ltime -= 2

	@classmethod
	def deletes(cls, reportid):
		""" Delete a report """
		result = session.query(Report).filter_by(reportid=reportid).first()
		session.delete(result)
		session.flush()

	@classmethod
	def getData(cls, reportid):
		"""get report data """
		result = session.query(Report).filter_by(reportid=reportid).one()

		# return dictionary
		return result.toDict()

	def toDict(self):
		""" report to dict """
		result = DictExt(self.__dict__)

		result.reportoutput = DBCompress.b64decode(self.reportoutput)
		return result

	def fixedOutput(self):
		""" returbn ddecoded data"""

		return DBCompress.b64decode(self.reportoutput)

	def getFileName(self):
		""" get a file name based up the type of report """

		if self.reportoutputtypeid == Constants.Report_Output_csv:
			return "PRMaxReport_%d.csv" % self.reportid
		elif self.reportoutputtypeid == Constants.Report_Output_label:
			return "PRMaxLabels_%d.pdf" % self.reportid
		elif self.reportoutputtypeid == Constants.Report_Output_pdf:
			return "PRMaxReport_%d.pdf" % self.reportid
		elif self.reportoutputtypeid == Constants.Report_Output_html:
			return "PRMaxReport_%d.html" % self.reportid
		elif self.reportoutputtypeid == Constants.Report_Output_excel:
			return "PRMaxReport_%d.xls" % self.reportid
		else:
			return "PRMaxReport_%d.pdf" % self.reportid


class ReportTemplate(BaseSql):
	""" report templates """
	List_Std = """SELECT reporttemplateid,
	CASE
	WHEN (reporttemplateid = 21) THEN (SELECT crm_engagement_plural FROM internal.customers where customerid = :customerid)
	WHEN (reporttemplateid = 22) THEN (SELECT crm_engagement_plural||' By Issue' FROM internal.customers where customerid = :customerid)
	ELSE reporttemplatename
	END as reporttemplatename
	FROM internal.reporttemplates as r
	WHERE
		(r.customerid=-1 OR r.customerid = :customerid) AND
		reportsourceid = :reportsourceid AND
		r.reporttemplatename ILIKE :reporttemplatename AND
	    r.reporttemplateid != 32
	ORDER BY r.reporttemplatename"""

	List_Id = """SELECT reporttemplateid,reporttemplatename
	FROM internal.reporttemplates as r
	WHERE
		reporttemplateid = :id AND
		(r.customerid=-1 OR r.customerid = :customerid)"""

	List_Std_EastAyrshire = """SELECT reporttemplateid,
	CASE
	WHEN (reporttemplateid = 21) THEN (SELECT crm_engagement_plural FROM internal.customers where customerid = :customerid)
	WHEN (reporttemplateid = 22) THEN (SELECT crm_engagement_plural||' By Issue' FROM internal.customers where customerid = :customerid)
	ELSE reporttemplatename
	END as reporttemplatename
	FROM internal.reporttemplates as r
	WHERE
		(r.customerid=-1 OR r.customerid = :customerid) AND
		reportsourceid = :reportsourceid AND
		r.reporttemplatename ILIKE :reporttemplatename
	ORDER BY r.reporttemplatename"""


	@classmethod
	def getTemplatesForArea(cls, kw):
		""" a a list of templates for an area"""

		command = None
		if "reporttemplatename" in kw:
			kw['reporttemplatename'] = kw['reporttemplatename'].replace("*", "%")

		# if customer is journolink we want to see restricted exports
		if 'customerid' in kw:
			customer = Customer.query.get(int(kw['customerid']))
			if customer.customertypeid == 27: 
				if 'reportsourceid' in kw:
					if kw['reportsourceid'] == 2:
						kw['id'] = 3
					elif kw['reportsourceid'] == 3:
						kw['id'] = 38

		if "id" in kw:
			command = text(ReportTemplate.List_Id)
		elif "reporttemplatename" not in kw:
			kw['reporttemplatename'] = "%"

		if command == None:
			command = text(ReportTemplate.List_Std)

			if 'customerid' in kw:
				customertypeid = session.query(Customer.customertypeid).filter(Customer.customerid == kw['customerid']).scalar()
				if customertypeid == 20:
					command = text(ReportTemplate.List_Std_EastAyrshire)
		
		
		data = cls.sqlExecuteCommand(command,
									   kw,
									   BaseSql.ResultAsEncodedDict)

		return dict(
			numRows=len(data),
			items=data,
			identifier="reporttemplateid")

#########################################################
## setup link
#########################################################
report_table = Table('reports', metadata, autoload=True, schema='queues')
reporttemplate_table = Table('reporttemplates', metadata, autoload=True, schema='internal')

mapper(Report, report_table)
mapper(ReportTemplate, reporttemplate_table)
