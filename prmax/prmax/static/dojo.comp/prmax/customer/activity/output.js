//-----------------------------------------------------------------------------
// Name:    prmax.customer.activity.output.js
// Author:  
// Purpose:
// Created: Jan 2018
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.customer.activity.output");

dojo.require("prmax.common.ReportBuilder");
dojo.require("prcommon.date.daterange");

dojo.declare("prmax.customer.activity.output",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.customer.activity","templates/output.html"),
	constructor: function()
	{
		this._dialog = null;
		this._complete_call_back = dojo.hitch(this, this._complete_call);

		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._objecttypes = new dojo.data.ItemFileReadStore ( { url:"/activity/objecttype_list"});
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.users.store = this._users;
		this.objecttypes.store = this._objecttypes;		
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
		if ( this._dialog != null)
		{
		dojo.removeClass(this.closebtn.domNode,"prmaxhidden");
		dojo.removeClass(this.clearbtn.domNode,"prmaxhidden");
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
	_clear_filter:function()
	{
		this.users.set("value", null);
		this.objecttypes.set("value", null);
		this.drange.set("value", null);
		this.pdf.set("checked", true);
		this.reportnode.Stop();
		dojo.removeClass(this.reportbtn.domNode,"prmaxhidden");
	},	
});





