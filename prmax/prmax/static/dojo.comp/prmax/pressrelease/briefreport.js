//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.briefreport
// Author:  Chris Hoy
// Purpose: report for districtuion list
// Created: 06/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.briefreport");

dojo.require("prmax.common.ReportBuilder");

dojo.declare("prmax.pressrelease.briefreport",
	[ ttl.BaseWidget ],
	{
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/briefreport.html"),
	constructor: function()
	{
		this._complete_call_back = dojo.hitch(this, this._complete_call) ;
	},
	postCreate:function()
	{
		dojo.attr(this.reporttemplateid, "value", "18");
		this.inherited(arguments);
	},
	load:function( listid , dialog )
	{
		this._dialog = dialog;
		this.listid.set("value",listid);
		this._clear();
	},
	_cancel:function()
	{
		this._clear();
		this._dialog.hide();
	},
	_clear:function()
	{
		this.report_ctrl.hide();
		this.report_ctrl.Stop();
		this.report_btn.cancel();
		dojo.addClass( this.report_notshown, "prmaxhidden");
		dojo.addClass( this.csv_notshown, "prmaxhidden");
		this.reporttitle.set("value","");
		this.reportoutputtypeid.set("value",0);
	},
	_report:function()
	{
		this.report_ctrl.SetCompleted(this._complete_call_back);
		this.report_ctrl.StartNoDialog(this.form_node.get("value"));
	},
	_complete_call:function()
	{
	

		this.report_ctrl.Stop();
		this.report_btn.cancel();
		if (this.reportoutputtypeid == 0)
		{
			dojo.removeClass( this.report_notshown, "prmaxhidden");
			dojo.attr(this.report_link, "href", "/reports/viewpdf?reportid="+ this.report_ctrl.reportid.value);
		}
		else if (this.reportoutputtypeid == 2)
		{
			dojo.removeClass( this.csv_notshown, "prmaxhidden");
			dojo.attr(this.csv_link, "href", "/reports/viewcsv?reportid="+ this.report_ctrl.reportid.value);
		}
		console.log("_complete");
		
		this.report_ctrl.hide();		
	},
	_set_reporttemplate:function()
	{
		dojo.addClass( this.report_notshown, "prmaxhidden");
		dojo.addClass( this.csv_notshown, "prmaxhidden");
		if (this.reportoutputtypeid == 0)
		{
			this.reporttemplateid.set("value", "18");
			dojo.removeClass(this.reporttitle.domNode, "prmaxhidden");
			dojo.removeClass(this.reporttitle_label, "prmaxhidden");
		}
		else if (this.reportoutputtypeid == 2)
		{
			this.reporttemplateid.set("value", "30");
			dojo.addClass(this.reporttitle.domNode, "prmaxhidden");
			dojo.addClass(this.reporttitle_label, "prmaxhidden");
		}
	}
});