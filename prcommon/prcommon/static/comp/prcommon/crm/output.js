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

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.output_style.set("store", this._output_styles);
		this.output_style.set("value", 21 );
		this.clientid.set("store",this._clients);
		this.clientid.set("value",-1);		
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
	},
	_get_style:function()
	{
		if (this.output_style == 31)	
		{
			dojo.addClass(this.csv.domNode, "prmaxhidden");
			dojo.addClass(this.csv_label, "prmaxhidden");
			this.pdf.set("checked", true);
		}
		else
		{
			dojo.removeClass(this.csv.domNode, "prmaxhidden");
			dojo.removeClass(this.csv_label, "prmaxhidden");
		}
	}
});





