//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.tasks.addtype");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.crm.tasks.addtype",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.tasks","templates/addtype.html"),
	constructor: function()
	{
		this._add_call_back = dojo.hitch(this, this._add_call);
	},
	postCreate:function()
	{
	},
	load:function ( dialog, customerid )
	{
		this._customerid = customerid;
		this._dialog = dialog;
		this._clear();
	},
	_close:function()
	{
		if (this._dialog != null )
			this._dialog.hide();
	},
	_add_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Task Type Added");
			this._close();
			this._clear();
			dojo.publish ("tasktype/add", [response.data]);
		}
		else
		{
			alert("Problem Adding Type");
		}
		this.addbtn.cancel();
	},
	_clear:function()
	{
		this.addbtn.cancel();
		this.tasktypedescription.set("value","");
	},
	_add:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		var content = this.form.get("value");

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._add_call_back),
			url:'/crm/tasks/tasktype_add',
			content: content}));
	}
});
