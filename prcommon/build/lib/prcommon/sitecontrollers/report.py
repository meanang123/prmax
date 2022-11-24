# -*- coding: utf-8 -*-
"""report handlee"""
#-----------------------------------------------------------------------------
# Name:        report.py
# Purpose:     Handles the access to the search list data
#
# Author:       Chris Hoy
#
# Created:     23/05/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears import expose, validate, validators, error_handler, \
	 exception_handler, redirect, config
from ttl.tg.errorhandlers import pr_form_error_handler, \
	 pr_std_exception_handler
from ttl.tg.controllers import SecureController
from prcommon.model import Report, ReportTemplate, Labels, ProcessQueue
from prcommon.model import AdvanceFeaturesList
from cherrypy import response
import prcommon.Constants as Constants
from ttl.tg.validators import std_state_factory, PrFormSchema
from ttl.base import stdreturn

###########################################################
## validators
###########################################################
class ReportStartSchema(PrFormSchema):
	""" Start a report validator"""
	reportoutputtypeid = validators.Int()
	reporttemplateid = validators.Int()
	searchtypeid = validators.Int()

class ReportIdSchema(PrFormSchema):
	""" report id schema"""
	reportid = validators.Int()

class ReportSourceIdSchema(PrFormSchema):
	"""report source id"""
	reportsourceid = validators.Int()

###########################################################
## Controller
###########################################################

class ReportController(SecureController):
	"""
		controler for report system
	"""

	@expose("json")
	def start(self, *args, **params):
		""" start a report
		"""

		if params["reporttemplateid"] == -2 :
			# clipping reports
			reportid=ProcessQueue.add(
			  processid=Constants.Process_Clipping_Report,
			  processqueuesettings=params) * -1
			return stdreturn( reportid=reportid)

		else:

			if params["searchtypeid"] == 10:
				# need to create temporaty list of outlets from the
				AdvanceFeaturesList.toTempStandingList(params)

			if params.has_key("advancefeatureslistid"):
				AdvanceFeaturesList.fixUpdateId(params)

			reportdatainfo = {}
			reportoptions = params

			if reportoptions.has_key("selector"):
				reportoptions["selector"] = int(params["selector"])

			if params.has_key("labelid"):
				params["label_info"] = Labels.getLabelInfo(params)
				if params["label_info"].reporttemplateid:
					params["reporttemplateid"] = params["label_info"].reporttemplateid

			return stdreturn(
				    reportid=Report.add(
				      params['customerid'],
				      params['reportoutputtypeid'],
				      reportoptions,
				      reportdatainfo,
				      params['reporttemplateid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportIdSchema(), state_factory=std_state_factory)
	def status(self, *args, **params):
		""" get the status of a specific report"""

		if params['reportid'] > 0:
			return stdreturn(reportstatusid=Report.status(params['reportid']))
		else:
			return stdreturn(reportstatusid=ProcessQueue.status(params['reportid']))

	#
	@expose("")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportIdSchema(), state_factory=std_state_factory)
	def view(self, *args, **params):
		""" view a specific report id"""

		if params['reportid'] > 0:
			# load report record
			report = Report.query.get(params['reportid'])
			# determine if you have permission
			if report and report.customerid == params['customerid'] or report.customerid == -1:
				# rediredt to the correct handler for the output
				prefix = "/reports"
				if report.reportoutputtypeid in Constants.Report_Output_is_pdf:
					raise redirect(prefix + '/viewpdf', reportid=params['reportid'])
				if report.reportoutputtypeid == Constants.Report_Output_html:
					raise redirect(prefix + '/viewhtml', reportid=params['reportid'])
				if report.reportoutputtypeid == Constants.Report_Output_csv:
					raise redirect(prefix + '/viewcsv', reportid=params['reportid'])
				if report.reportoutputtypeid == Constants.Report_Output_excel:
					raise redirect(prefix + '/viewexcel', reportid=params['reportid'])
		else:
			pass
		return ""

	@expose(content_type="application/pdf")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportIdSchema(), state_factory=std_state_factory)
	def viewpdf(self, *args, **params):
		""" view a specific pdf report """

		# load report record
		# attachment make it a file to open/save on FF
		# inline make it appear in browser window but .. no title etc
		report = Report.query.get(params['reportid'])
		if report and report.reportoutputtypeid in Constants.Report_Output_is_pdf and \
		   (report.customerid == params['customerid'] or report.customerid == -1):
			reportoutput = report.fixedOutput()
			response.headers["Content-disposition"] = \
					"inline; filename=%s" % report.getFileName()
			response.headers["Content-Length"] = len(reportoutput)
			response.headers["Content-type"] = "application/pdf"
			response.headers['Cache-Control'] = 'max-age=100'

			return reportoutput

		return ""

	@expose(content_type="application/csv")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportIdSchema(), state_factory=std_state_factory)
	def viewcsv(self, *args, **params):
		""" view a specific pdf report """

		# load report record, attachment
		report = Report.query.get(params['reportid'])
		if report and report.reportoutputtypeid == Constants.Report_Output_csv and \
		   (report.customerid == params['customerid'] or report.customerid == -1):
			reportoutput = report.fixedOutput()
			response.headers["Content-disposition"] = \
					"inline; filename=%s" % report.getFileName()
			response.headers["Content-Length"] = len(reportoutput)
			response.headers["Content-type"] = "text/csv;charset=iso-8859-1"
			response.headers['Cache-Control'] = 'max-age=100'
			return reportoutput

		return ""

	@expose(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportIdSchema(), state_factory=std_state_factory)
	def viewexcel(self, *args, **params):
		""" view a specific excel report """

		# load report record, attachment
		report = Report.query.get(params['reportid'])
		if report and report.reportoutputtypeid == Constants.Report_Output_excel and \
		   (report.customerid == params['customerid'] or report.customerid == -1):
			reportoutput = report.fixedOutput()
			response.headers["Content-disposition"] = \
					"inline; filename=%s" % report.getFileName()
			response.headers["Content-Length"] = len(reportoutput)
			response.headers["Content-type"] = "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			response.headers['Cache-Control'] = 'max-age=100'
			return reportoutput

		return ""


	@expose("")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportIdSchema(), state_factory=std_state_factory)
	def viewhtml(self, *args, **params):
		""" view a html document """

		# load report record
		report = Report.query.get(params['reportid'])
		if report and report.reportoutputtypeid == Constants.Report_Output_html and \
		   (report.customerid == params['customerid'] or report.customerid == -1):
			return report.fixedOutput()

		return ""

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=ReportSourceIdSchema(), state_factory=std_state_factory)
	def reporttemplates(self, *args, **params):
		""" list of report templates """

		return ReportTemplate.getTemplatesForArea(params)
