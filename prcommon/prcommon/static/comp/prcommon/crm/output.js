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
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		dojo.subscribe('/update/engagement_label', dojo.hitch(this,this._UpdateEngagementLabelEvent));

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.output_style.set("store", this._output_styles);
		this.output_style.set("value", 21 );
		this.clientid.set("store",this._clients);
		this.clientid.set("value",-1);
		dojo.addClass(this.excel.domNode, "prmaxhidden");
		dojo.addClass(this.excel_label, "prmaxhidden");
	},
	_do_report:function()
	{
		var content = this.form_output.get("value");

		if (this.output_style == 32 && this.drange.option.get("value") == "0")
		{
			alert('Please enter a range date');
			return false;
		}

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
		if ( this._dialog != null)
		{
		dojo.removeClass(this.closebtn.domNode,"prmaxhidden");
		}
	},
	_close:function()
	{
		if ( this._dialog)
		{
			this.reportnode.Stop();
			this._dialog.hide();
			this.clear();
		}
	},
	_complete_call:function()
	{
		this.reportnode.hide();
		this._close();
		this.clear();
	},
	_get_style:function()
	{
		if (this.output_style == 31 || this.output_style == 39)
		{
			dojo.addClass(this.csv.domNode, "prmaxhidden");
			dojo.addClass(this.csv_label, "prmaxhidden");
			dojo.addClass(this.excel.domNode, "prmaxhidden");
			dojo.addClass(this.excel_label, "prmaxhidden");
			dojo.removeClass(this.clientid.domNode, "prmaxhidden");
			dojo.removeClass(this.client_label, "prmaxhidden");
			this.pdf.set("checked", true);
		}
		else if (this.output_style == 32)
		{
			dojo.addClass(this.csv.domNode, "prmaxhidden");
			dojo.addClass(this.csv_label, "prmaxhidden");
			dojo.removeClass(this.excel.domNode, "prmaxhidden");
			dojo.removeClass(this.excel_label, "prmaxhidden");
			dojo.addClass(this.clientid.domNode, "prmaxhidden");
			dojo.addClass(this.client_label, "prmaxhidden");
			this.excel.set("checked", true);
		}
		else
		{
			dojo.removeClass(this.csv.domNode, "prmaxhidden");
			dojo.removeClass(this.csv_label, "prmaxhidden");
			dojo.addClass(this.excel.domNode, "prmaxhidden");
			dojo.addClass(this.excel_label, "prmaxhidden");
			dojo.removeClass(this.clientid.domNode, "prmaxhidden");
			dojo.removeClass(this.client_label, "prmaxhidden");
		}
	},
	_UpdateEngagementLabelEvent:function()
	{
		this._output_styles = new dojo.data.ItemFileReadStore( { url:"/reports/reporttemplates?reportsourceid=9"});
	},
});





