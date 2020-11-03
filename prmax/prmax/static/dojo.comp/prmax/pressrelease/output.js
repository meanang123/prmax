//-----------------------------------------------------------------------------
// Name:    output.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Sept 2020
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.output");

dojo.require("prmax.common.ReportBuilder");
dojo.require("prcommon.date.daterange");

dojo.declare("prmax.pressrelease.output",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/output.html"),
	constructor: function()
	{
		this._dialog = null;
		this._complete_call_back = dojo.hitch(this, this._complete_call);
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.clientid.set("store",this._clients);
		this.clientid.set("value",-1);
	},
	_do_report:function()
	{
		var content = this.form_output.get("value");
		content['option'] = this.option.get("value");

		dojo.addClass(this.reportbtn.domNode,"prmaxhidden");
		this.reportnode.SetCompleted(this._complete_call_back);
		this.reportnode.StartNoDialog(content);
	},
	clear:function()
	{
		this.reportnode.hide();
		this.pdf.set('checked', true);
		this.excel.set('checked', false);
		this.option.set('value', 'Display Sent');
		this.clientid.set('value', -1);
		this.drange.set('value', null);
		
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
			//this.reportnode.Stop();
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
	_OptionChanged:function()
	{
		if ( this.option.get("value") == "Display Sent")
		{
			dojo.removeClass(this.drange_label,"prmaxhidden");
			dojo.removeClass(this.drange.domNode,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.drange_label,"prmaxhidden");
			dojo.addClass(this.drange.domNode,"prmaxhidden");
			this.drange.option.set("value", null);
		}
	},
});





