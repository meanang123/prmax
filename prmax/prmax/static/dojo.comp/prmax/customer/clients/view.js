//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 13/10/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.customer.clients.view");

dojo.require("prmax.customer.clients.add");
dojo.require("prcommon.data.QueryWriteStore");

dojo.declare("prmax.customer.clients.view",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.customer.clients","templates/view.html"),
	constructor: function()
	{
		this.client_model = new prcommon.data.QueryWriteStore(
			{	url:'/clients/list',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});
		this._Client_Added_Call_Back = dojo.hitch ( this, this._Client_Added_Call);
		this._Client_Update_Call_Back = dojo.hitch ( this, this._Client_Update_Call);
	},
	postCreate:function()
	{
		this.client_add_dialog.set("title", "Add New " + PRMAX.utils.settings.client_name);
		dojo.attr(this.client_header_name,"innerHTML",PRMAX.utils.settings.client_name + "s");

		this.view1["cells"][0][0].name = PRMAX.utils.settings.client_name + " Short Name";
		this.grid.set("structure",this.view1 );
		this.grid._setStore ( this.client_model ) ;
		this.grid["onCellClick"] = dojo.hitch(this, this._OnCellClick);

		this.inherited(arguments);
	},
	_OnCellClick:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);
		this.client_edit_ctrl.Load( this._row.i.clientid , this._Client_Update_Call_Back );

		this.grid.selection.clickSelectEvent(e);
	},
	view1:{
		cells: [[
			{name: 'Short Name',width: "auto",field:"clientname"},
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.formatRowCtrl}
			]]
	},
	resize:function()
	{
		//console.log("VIEW_RESIZE", arguments[0]);
		this.borderControl.resize(arguments[0]);
	},
	_ClearFilter:function()
	{
		this.clientname_filter.set("value","");
	},
	_ExecuteFilter:function()
	{
		var query = {};

		if (arguments[0].clientname_filter.length>0)
			query["clientname"] = arguments[0].clientname_filter;

		this.grid.setQuery(ttl.utilities.getPreventCache(query));
		this._row = null;
		this.edit_client_stack.selectChild ( this.blank_view ) ;
	},
	_Client_Added_Call:function( mode, response )
	{
		if ( mode == 1 )
		{

		}
		else if ( mode == 2 )
		{
			this.client_model.newItem ( response );
			this.client_add_dialog.hide();
		}
		else if ( mode == 3 )
		{
			this.client_model.newItem ( response );
			this.client_add_dialog.hide();
			this.client_edit_ctrl.Load( response.clientid , this._Client_Update_Call_Back );
		}
	},
	_Client_Update_Call:function( mode, response )
	{
		if ( mode == 1 )
		{
			this.edit_client_stack.selectChild ( this.client_edit_ctrl ) ;
		}
		else if ( mode == 2 )
		{
			this.client_model.setValue(  this._row, "clientname" , response.clientname, true );
		}
		else if ( mode == 3 )
		{
			this.client_model.deleteItem(  this._row);
			this._row = null;
			this.edit_client_stack.selectChild ( this.blank_view ) ;
		}
	},
	_Add:function()
	{
		this.client_add_ctrl.Load(-1, this._Client_Added_Call_Back);
		this.client_add_dialog.show();
	}
});
