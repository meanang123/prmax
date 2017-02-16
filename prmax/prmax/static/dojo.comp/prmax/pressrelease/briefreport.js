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
		dojo.removeClass(this.close_btn.domNode,"prmaxhidden");
		this.reporttitle.set("value","");
	},
	_report:function()
	{
		dojo.addClass(this.close_btn.domNode,"prmaxhidden");
		this.report_ctrl.SetCompleted(this._complete_call_back);
		this.report_ctrl.StartNoDialog(this.form_node.get("value"));
	},
	_complete_call:function()
	{
		this._cancel();
	}
});