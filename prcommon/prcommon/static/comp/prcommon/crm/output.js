//-----------------------------------------------------------------------------
// Name:    output.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.output");

dojo.require("prmax.common.ReportBuilder");
dojo.require("prcommon.date.daterange");

dojo.declare("prcommon.crm.output",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/output.html"),
	constructor: function()
	{
		this._dialog = null;
		this._complete_call_back = dojo.hitch(this, this._complete_call);
		this._output_styles = new dojo.data.ItemFileReadStore( { url:"/reports/reporttemplates?reportsourceid=9"});
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.output_style.set("store", this._output_styles);
		this.output_style.set("value", 21 );
	},
	_do_report:function()
	{
		var content = this.form_output.get("value");

		dojo.addClass(this.reportbtn.domNode,"prmaxhidden");
		this.reportnode.SetCompleted(this._complete_call_back);
		this.reportnode.StartNoDialog(content);

	},
	clear:function()
	{
		this.reportnode.hide();
		dojo.removeClass(this.reportbtn.domNode,"prmaxhidden");
	},
	_setDialogAttr:function(dialog)
	{
		this._dialog = dialog;
	},
	_close:function()
	{
		if ( this._dialog)
		{
			this._dialog.hide();
			this.clear();
		}
	},
	_complete_call:function()
	{
		this.reportnode.hide();
		this._close();
		this.clear();
	}
});





