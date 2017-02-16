//-----------------------------------------------------------------------------
// Name:    userdefined.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/08/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.userdefined");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Dialog");

dojo.declare("prcommon.crm.userdefined",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	fieldid:1,
	templatePath: dojo.moduleUrl( "prcommon.crm","templates/userdefined.html"),
	constructor: function()
	{
		this._add_call_back = dojo.hitch(this, this._add_call);
		this._error_call_back = dojo.hitch(this, this._error_call);
		this._delete_call_back = dojo.hitch(this, this._delete_call);

		this._store = new prcommon.data.QueryWriteStore (
			{url:'/crm/user_defined',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
			});
	},
	view: {
		cells: [[
		{name: 'Items',width: "auto",field:"description"},
		{name: ' ',width:"20px",formatter:ttl.utilities.formatRowCtrl }
		]]
	},
	postCreate:function()
	{
		this.grid.set("structure", this.view);
		this.grid._setStore(this._store);
		this.grid.onRowClick = dojo.hitch(this, this._on_select_row);

		this.inherited(arguments);
	},
	_on_select_row:function(e)
	{
		this._row = this.grid.getItem(e.rowIndex);

		if ( this._row && confirm("Delete ("+ this._row.i.description+")?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._delete_call_back,
				url:'/crm/user_defined_delete',
				error: this._error_call_back,
				content:{contacthistoryuserdefinid:this._row.i.contacthistoryuserdefinid}}));
		}
	},
	_delete_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._store.deleteItem(this._row);
		}
	},
	force_startup:function()
	{
		this.grid.resize( {w:200, h:75});
	},
	_add:function()
	{
		if ( ttl.utilities.formValidator(this.form) == false )
		{
			alert("Not all required field filled in");
			this.addbtn.cancel();
			return;
		}

		var content = this.form.get("value");

		content["fieldid"] = this.fieldid;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._add_call_back,
			url:'/crm/user_defined_add',
			error: this._error_call_back,
			content:content}));
	},
	_add_call:function( response )
	{
		if ( response.success == "OK")
		{
			this._store.newItem(response.data);
			this.new_item_dlg.hide();
		}
		else if ( response.success=="DU")
		{
			alert("already exist's");
		}
		else
		{
			alert("Problem");
		}

		this.addbtn.cancel();

	},
	_show_add:function()
	{
		this.addbtn.cancel();
		this.crm_user_define_1.set("value","");
		this.new_item_dlg.show();
	},
	_close:function()
	{
		this.new_item_dlg.hide();
		this.crm_user_define_1.set("value","");
	},
	_error_call:function(response, ioArgs)
	{
		ttl.utilities.xhrPostError(response, ioArgs);
		this.addbtn.cancel();
	}
});





