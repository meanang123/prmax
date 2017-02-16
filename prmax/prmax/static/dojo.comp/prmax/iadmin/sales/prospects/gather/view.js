//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 25/07/2012
// To do:
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.sales.prospects.gather.view");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.Toolbar");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.grid.DataGrid");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.Dialog");
dojo.require("prmax.iadmin.sales.prospects.gather.add");
dojo.require("prmax.iadmin.sales.prospects.gather.delete");


dojo.declare("prmax.iadmin.sales.prospects.gather.view",
	[ ttl.BaseWidget,dijit.layout.BorderContainer ],
	{
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/gather/templates/view.html"),
	constructor: function()
	{
		this._store = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/prospect/list", idAttribute:"prospectid"});
		dojo.subscribe("/prospect/prospect/add", dojo.hitch(this, this._add_event));
		dojo.subscribe("/prospect/prospect/updated", dojo.hitch(this, this._update_event));
		dojo.subscribe("/prospect/prospect/delete", dojo.hitch(this, this._delete_event));

		this._load_call_back = dojo.hitch(this,this._load_call);

	},
	clear:function()
	{
		this.tabcont.selectChild (this.blank);
	},
	postCreate:function()
	{
		this.result_grid.set("structure",this.view);
		this.result_grid._setStore(this._store );

		this.result_grid.onStyleRow = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
		this.result_grid.onRowClick = dojo.hitch(this,this._on_select_row);

		this.inherited(arguments);
		this.addctrl.set("dialog",this.adddialog);

	},
	_on_select_row : function(e)
	{
		this._row = this.result_grid.getItem(e.rowIndex);
		if ( e.cellIndex == 0 )
		{
			// Delete 2 options
			// 1. Move to archive
			// 2. Move to archive and remove email put email in unsuscribe list
			this.deletectrl.load( this._row.prospectid, this.deletedialog,this._row.email);
			this.deletedialog.show();
		}
		else
		{
			// Edit is obvious
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._load_call_back,
				url:"/iadmin/prospects/prospect/get",
				content:{prospectid:this._row.prospectid}}));
		}
		this.result_grid.selection.clickSelectEvent(e);
	},
	_load_call:function ( response )
	{
		if (response.success == "OK")
		{
			this.editctrl.load ( response.data );
			this.tabcont.selectChild (this.editctrl);
		}
		else
		{

		}
	},
	view: {
		cells: [[
		{name: " ",width: "12px",field:"",formatter:ttl.utilities.deleteRowCtrl},
		{name: " ",width: "12px",field:"",formatter:ttl.utilities.formatRowCtrl},
		{name: 'Email',width: "200px",field:"email"},
		{name: 'Contact',width: "200px",field:"contactname"},
		{name: 'Company',width: "200px",field:"prospectcompanyname"},
		{name: 'Type',width: "100px",field:"prospecttypename"},
		{name: 'Source',width: "100px",field:"prospectsourcename"},
		{name: 'Region',width: "100px",field:"prospectregionname"}
		]]
	},
	_refresh:function()
	{
		this.result_grid.setQuery( {} );
	},
	_clear_filter:function()
	{

		this.emailaddress.set("value","");
		this.result_grid.setQuery( {} );
		this.clear();
	},
	_execute_filter:function()
	{
		var filter = {};

		if ( arguments[0].emailaddress.length > 0 )
			filter["emailaddress"] = arguments[0].emailaddress;

		this.result_grid.setQuery( filter );
		this.clear();
	},
	_add:function()
	{
		this.tabcont.selectChild (this.blank);
		this.addctrl.clear();
		this.adddialog.show();
	},
	_add_event:function( prospect )
	{
		this._store.newItem ( prospect ) ;
	},
	_update_event:function( prospect )
	{

		this._store.setValue(this._row,"email",prospect.email);
		this._store.setValue(this._row,"contactname",prospect.contactname);
		this._store.setValue(this._row,"prospectcompanyname",prospect.prospectcompanyname);
		this._store.setValue(this._row,"prospecttypename",prospect.prospecttypename);
		this._store.setValue(this._row,"prospectsourcename",prospect.prospectsourcename);
		this._store.setValue(this._row,"prospectregionname",prospect.prospectregionname);
	},
	_delete_event:function( prospect )
	{
		this._store.deleteItem ( this._row ) ;
	}
});





